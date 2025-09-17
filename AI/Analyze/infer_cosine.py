# infer_cosine.py
import json, math
from pathlib import Path
from typing import Dict, List, Iterable
import numpy as np
import pandas as pd

# ---------- 0) 표준화(별칭) ----------
ALIASES = {
    "인테리어": "인테리어/가정용품",
    "가정용품": "인테리어/가정용품",
    "가전제품": "인테리어/가정용품",
    "음식배달서비스": "인터넷쇼핑",
}
def canonical(name: str) -> str:
    return ALIASES.get(name, name)

# ---------- 1) 분류 테이블 / 유형 키워드 ----------
BIG2SMALL: Dict[str, List[str]] = {
    "공연/전시": ["경기관람","전시장","공연관람"],
    "미디어/통신": ["인터넷쇼핑","기타결제"],
    "생활서비스": ["미용서비스","차량관리/서비스","교통서비스","여행","유학대행","사우나","휴게시설"],
    "소매/유통": ["인테리어/가정용품","스포츠/레져용품","음/식료품소매","의복/의류","종합소매점","악기/공예","패션잡화","건강/기호식품","서적/도서","화장품소매","사무/교육용품"],
    "여가/오락": ["요가/단전/마사지","일반스포츠","숙박","취미/오락"],
    "음식": ["한식","양식","일식","중식","베이커리","카페/디저트"],
    "학문/교육": ["예체능계학원","외국어학원","입시학원","기술/직업교육학원","독서실"],
}

TYPE_KEYWORDS: Dict[str, List[str]] = {
    "핫플형":    ["경기관람","전시장","공연관람","미용서비스","교통서비스","의복/의류","패션잡화","화장품소매","취미/오락"],
    "쇼핑형":    ["인터넷쇼핑","인테리어","의복/의류","종합소매점","패션잡화"],
    "예술가형":  ["전시장","공연관람","인테리어","의복/의류","악기/공예","예체능계학원"],
    "뷰티형":    ["미용서비스","사우나","의복/의류","패션잡화","화장품소매","예체능계학원"],
    "여행가형":  ["차량관리/서비스","교통서비스","여행","휴게시설","숙박","취미/오락","외국어학원"],
    "자기계발형":["유학대행","악기/공예","서적/도서","사무/교육용품","요가/단전/마사지","일반스포츠","예체능계학원","외국어학원","입시학원","기술/직업교육학원","독서실"],
    "스포츠형":  ["경기관람","의복/의류","건강/기호식품","요가/단전/마사지","일반스포츠"],
    "집돌이형":  ["인터넷쇼핑","인테리어/가정용품","인테리어","가정용품","음/식료품소매","종합소매점","가전제품","음식배달서비스"],
    "음식":      ["한식","중식","양식","일식","카페/디저트","베이커리"],
}

# ---------- 2) 매핑/임베딩 ----------
def load_mappings():
    small2id = json.load(open("mappings/small2id.json","r",encoding="utf-8"))
    id2small = json.load(open("mappings/id2small.json","r",encoding="utf-8"))
    id2small = {int(k):v for k,v in id2small.items()}
    return small2id, id2small

def load_small_embeddings(path="artifacts/small_embeddings.npy"):
    return np.load(path)  # (vocab, dim), 0은 padding

# ---------- 3) 유틸 ----------
def cosine(a: np.ndarray, B: np.ndarray) -> np.ndarray:
    a = a / (np.linalg.norm(a)+1e-12)
    Bn = B / (np.linalg.norm(B,axis=1,keepdims=True)+1e-12)
    return Bn @ a

def _norm_series(s: pd.Series) -> pd.Series:
    return (s - s.min())/(s.max()-s.min()) if s.max()>s.min() else pd.Series([1.0]*len(s), index=s.index)

def user_vector_from_payload(payload: dict, small2id: Dict[str,int], W: np.ndarray) -> np.ndarray:
    df = pd.DataFrame(payload["payments"])
    df["small"] = df["subcategory"].map(canonical)
    df["ts"]    = pd.to_datetime(df["payment_time"])
    df["amt"]   = df["payment_amount"]

    now = df["ts"].max()
    days = (now - df["ts"]).dt.days.clip(lower=0)
    lam = math.log(2)/45.0
    df["rec"] = np.exp(-lam * days)

    g = df.groupby("small").agg(cnt=("small","count"),
                                amt=("amt","sum"),
                                rec=("rec","max")).reset_index()
    g["cnt_n"] = _norm_series(g["cnt"])
    g["amt_n"] = _norm_series(np.log1p(g["amt"]))
    g["rec_n"] = g["rec"] / max(g["rec"].max(), 1e-9)

    w_amt, w_cnt, w_rec = 0.45, 0.35, 0.20
    g["w"] = w_amt*g["amt_n"] + w_cnt*g["cnt_n"] + w_rec*g["rec_n"]

    vecs, ws = [], []
    for _, r in g.iterrows():
        sid = small2id.get(r["small"])
        if sid is None or sid==0 or sid>=W.shape[0]:
            continue
        vecs.append(W[sid]); ws.append(float(r["w"]))
    if not vecs:
        return np.zeros(W.shape[1], dtype=np.float32)
    V = np.vstack(vecs); w = np.asarray(ws, dtype=np.float32)
    u = (V * w[:,None]).sum(axis=0) / (w.sum() + 1e-8)
    return u / (np.linalg.norm(u)+1e-12)

def build_type_prototypes(W: np.ndarray, small2id: Dict[str,int]) -> Dict[str,np.ndarray]:
    out = {}
    for t, kws in TYPE_KEYWORDS.items():
        ids = []
        for k in kws:
            sid = small2id.get(canonical(k))
            if sid is not None and 0 < sid < W.shape[0]:
                ids.append(sid)
        if not ids:
            out[t] = np.zeros(W.shape[1], dtype=np.float32); continue
        v = W[ids].mean(axis=0)
        out[t] = v / (np.linalg.norm(v)+1e-12)
    return out

def build_keyword_pool(id2small: Dict[int,str]) -> List[str]:
    pool = set()

    # 학습에서 본 모든 소분류
    for i, name in id2small.items():
        if i == 0:  # padding
            continue
        pool.add(canonical(name))

    # 유형 키워드 / 대분류 표의 소분류
    for kws in TYPE_KEYWORDS.values():
        for k in kws:
            pool.add(canonical(k))
    for v in BIG2SMALL.values():
        for k in v:
            pool.add(canonical(k))

    return sorted(pool)

# ---------- 4) 메인 추론 ----------
def infer_profile(payload: dict,
                  emb_path="artifacts/small_embeddings.npy",
                  tau: float = 0.7,
                  include_missing_zero: bool = True) -> dict:
    small2id, id2small = load_mappings()
    W = load_small_embeddings(emb_path)

    # 유저 벡터
    u = user_vector_from_payload(payload, small2id, W)

    # 대표유형(전부)
    types = build_type_prototypes(W, small2id)
    names, mats = zip(*types.items())
    T = np.vstack(mats)
    sims = cosine(u, T)
    z = np.exp((sims - sims.max())/tau)
    probs = z / z.sum()
    type_result = [{"name": n, "prob": float(p), "sim": float(s)}
                   for n, p, s in zip(names, probs, sims)]
    type_result.sort(key=lambda x: -x["prob"])

    # 키워드: 풀 전체
    pool = build_keyword_pool(id2small)
    keywords = []
    for kw in pool:
        sid = small2id.get(kw)
        if sid is None or sid <= 0 or sid >= W.shape[0]:
            if include_missing_zero:
                keywords.append({"name": kw, "score": 0.0})
            continue
        score = float(cosine(u, W[sid:sid+1])[0])
        keywords.append({"name": kw, "score": score})
    keywords.sort(key=lambda x: (-x["score"], x["name"]))

    # 대분류별 상세(전부) – 표 기준
    bigs = {}
    for big, smalls in BIG2SMALL.items():
        items = []
        for s in smalls:
            s_can = canonical(s)
            sid = small2id.get(s_can, 0)
            if 0 < sid < W.shape[0]:
                sc = float(cosine(u, W[sid:sid+1])[0])
            else:
                sc = 0.0 if include_missing_zero else None
            if sc is not None:
                items.append({"name": s_can, "score": sc})
        items.sort(key=lambda x: (-x["score"], x["name"]))
        bigs[big] = items

    # 요약
    df = pd.DataFrame(payload["payments"])
    ts = pd.to_datetime(df["payment_time"])
    summary = {
        "transactions": int(len(df)),
        "start": str(ts.min()),
        "end": str(ts.max()),
    }

    return {
        "user_id": payload.get("user", {}).get("user_id"),
        "summary": summary,
        "대표유형": type_result,        # ← 전체
        "키워드": keywords,            # ← 전체
        "대분류상세": bigs,             # ← 각 대분류 전체
    }

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True, help="mock.json")
    p.add_argument("--emb", default="artifacts/small_embeddings.npy")
    p.add_argument("--output", default="profile_cosine.json")
    p.add_argument("--tau", type=float, default=0.7)
    p.add_argument("--no-missing-zero", action="store_true",
                   help="임베딩 없는 항목을 score=0 으로 포함하지 않음")
    args = p.parse_args()

    payload = json.load(open(args.input, "r", encoding="utf-8"))
    out = infer_profile(payload,
                        emb_path=args.emb,
                        tau=args.tau,
                        include_missing_zero=not args.no_missing_zero)
    json.dump(out, open(args.output, "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    print(f"saved → {args.output}")
