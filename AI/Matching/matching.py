# AI/Matching/matching.py
from __future__ import annotations
from pathlib import Path
from typing import Dict, List, Tuple, Iterable, Optional
import json
import numpy as np

# ---------- 벡터 유틸 ----------
def _cos(a: np.ndarray, b: np.ndarray) -> float:
    na = np.linalg.norm(a); nb = np.linalg.norm(b)
    if na == 0.0 or nb == 0.0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))

def _build_keyword_spaces(ref: Dict, cands: List[Dict]) -> Tuple[List[str], List[str]]:
    """키워드 전체 차원, 대표유형 전체 차원 정의"""
    # 키워드 차원: ref + 모든 후보의 '키워드' name 전부
    kw_set = {k["name"] for k in ref.get("키워드", [])}
    for c in cands:
        kw_set.update(k["name"] for k in c.get("키워드", []))
    # 대표유형 차원(고정 9종일 가능성이 높지만, 파일 기준으로 구성)
    tp_set = {t["name"] for t in ref.get("대표유형", [])}
    for c in cands:
        tp_set.update(t["name"] for t in c.get("대표유형", []))
    return sorted(kw_set), sorted(tp_set)

def _vec_from_keywords(profile: Dict, dims: List[str]) -> Tuple[np.ndarray, np.ndarray]:
    """
    키워드 벡터 생성.
    - 양수 벡터: score>0 인 값만 (선호)
    - 음수 벡터: score<0 의 절댓값 (비선호)
    """
    pos = np.zeros(len(dims), dtype=np.float32)
    neg = np.zeros(len(dims), dtype=np.float32)
    scores = {k["name"]: float(k.get("score", 0.0)) for k in profile.get("키워드", [])}
    for i, name in enumerate(dims):
        s = scores.get(name, 0.0)
        if s > 0:
            pos[i] = s
        elif s < 0:
            neg[i] = -s
    return pos, neg

def _vec_from_types(profile: Dict, dims: List[str]) -> np.ndarray:
    """대표유형 확률 벡터(없으면 0). 이미 정규화되어 있지 않아도 코사인으로 비교하므로 문제 없음."""
    v = np.zeros(len(dims), dtype=np.float32)
    table = {t["name"]: float(t.get("prob", 0.0)) for t in profile.get("대표유형", [])}
    for i, name in enumerate(dims):
        v[i] = table.get(name, 0.0)
    return v

def _kw_similarity(p_pos: np.ndarray, p_neg: np.ndarray,
                   q_pos: np.ndarray, q_neg: np.ndarray,
                   beta: float = 0.5) -> float:
    """
    키워드 유사도 = pos 코사인 * (1 - beta * neg 코사인)
    - pos 코사인은 선호의 정합도
    - neg 코사인은 '함께 싫어함'의 정합도이므로 패널티로 사용(가중치 beta)
    결과는 [0,1] 범위로 클램프
    """
    pos_sim = _cos(p_pos, q_pos)  # [0,1]
    neg_sim = _cos(p_neg, q_neg)  # [0,1]
    score = pos_sim * (1.0 - beta * neg_sim)
    return max(0.0, min(1.0, score))

def match_one_to_many(
    ref_profile: Dict,
    candidates: List[Dict],
    *,
    w_kw: float = 0.7,
    w_type: float = 0.3,
    beta: float = 0.5,
    exclude_ids: Optional[Iterable[int]] = None,
) -> List[Dict]:
    """
    ref_profile  : 기준 유저 1명의 프로필(대표유형/키워드 포함)
    candidates   : 비교 대상 유저들의 프로필 리스트
    반환         : [{user_id, score(0~1), matching_percent, matching_rank}, ...] 내림차순
    """
    if exclude_ids is None:
        exclude_ids = set()
    else:
        exclude_ids = set(exclude_ids)

    # 1) 공통 차원 구성
    kw_dims, tp_dims = _build_keyword_spaces(ref_profile, candidates)

    # 2) 기준 유저 벡터
    r_pos, r_neg = _vec_from_keywords(ref_profile, kw_dims)
    r_type = _vec_from_types(ref_profile, tp_dims)

    # 3) 후보별 점수
    results = []
    ref_id = ref_profile.get("user_id")
    for c in candidates:
        uid = c.get("user_id")
        if uid is None or uid in exclude_ids or uid == ref_id:
            continue
        c_pos, c_neg = _vec_from_keywords(c, kw_dims)
        c_type = _vec_from_types(c, tp_dims)

        kw_sim = _kw_similarity(r_pos, r_neg, c_pos, c_neg, beta=beta)
        tp_sim = _cos(r_type, c_type)  # [0,1] 권장 스케일
        tp_sim = max(0.0, tp_sim)      # 음수 방지(드물지만 안전장치)

        score = w_kw * kw_sim + w_type * tp_sim
        score = max(0.0, min(1.0, float(score)))

        results.append({
            "user_id": int(uid),
            "score": score,
            "matching_percent": int(round(score * 100)),
        })

    # 4) 정렬 & 랭크
    results.sort(key=lambda x: (-x["score"], x["user_id"]))
    for rank, r in enumerate(results, start=1):
        r["matching_rank"] = rank
    return results

# -------- 파일 읽기 헬퍼 --------
def load_candidates_from_json(path: str | Path) -> List[Dict]:
    p = Path(path)
    data = json.loads(p.read_text(encoding="utf-8"))
    if isinstance(data, dict) and "users" in data:
        return data["users"]
    if isinstance(data, list):
        return data
    raise ValueError("user_category_data.json 형식이 list 또는 {users:[...]} 여야 합니다.")

# -------- 단독 실행 테스트 --------
if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help="기준 유저 프로필 JSON(한 명)")
    ap.add_argument("--cands", required=True, help="비교 대상 JSON 리스트 파일")
    ap.add_argument("--topn", type=int, default=20)
    args = ap.parse_args()

    ref = json.loads(Path(args.ref).read_text(encoding="utf-8"))
    cands = load_candidates_from_json(args.cands)

    out = match_one_to_many(ref, cands)
    out = out[:args.topn] if args.topn else out
    print(json.dumps(out, ensure_ascii=False, indent=2))
