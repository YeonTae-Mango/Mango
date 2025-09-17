# train_gru.py
# 목적: 1단계에서 만든 시퀀스 데이터로 GRU 언어모델을 학습하고,
#       소분류/유저 임베딩을 추출한다. (특정 유저 임베딩 콘솔 출력 지원)

import os, json, time, math, random, argparse
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from pathlib import Path

# ---------------------- 설정 ----------------------
ARTI = Path("artifacts"); ARTI.mkdir(exist_ok=True)
NPZ_PATH = "seq_dataset.npz"                     # 1단계 산출물
SMALL2ID = "mappings/small2id.json"              # 1단계 산출물
RAW_CSV  = "C:/Users/SSAFY/Desktop/망고/S13P21A408/AI/Banking/trainset.csv"  # 유저 임베딩 추출용

CONFIG = {
    "seed": 42,
    "batch_size": 256,
    "epochs": 25,
    "lr": 1e-3,
    "weight_decay": 1e-4,
    "hidden": 128,
    "dropout": 0.2,
    # 임베딩 크기(필요시 조절)
    "emb_small": 64,
    "emb_time": 4,
    "emb_dow": 3,
    "emb_amt": 3,
    # 각 범주 vocab 크기(고정)
    "vocab_time": 6,     # time_bucket: 0~5
    "vocab_dow": 7,      # 요일: 0~6
    "vocab_amt": 5,      # amt_bucket: 0~4
}

# ---------------------- 유틸 ----------------------
def set_seed(s):
    random.seed(s); np.random.seed(s); torch.manual_seed(s); torch.cuda.manual_seed_all(s)

def banner(msg):
    print("\n" + "="*12 + f" {msg} " + "="*12, flush=True)

def topk_acc(logits, y, k=1):
    topk = logits.topk(k, dim=1).indices
    return (topk.eq(y.view(-1,1))).any(dim=1).float().mean().item()

# ---------------------- 데이터 ----------------------
class SeqDataset(Dataset):
    def __init__(self, X_small, X_t, X_d, X_a, Y):
        self.X_small = torch.tensor(X_small, dtype=torch.long)
        self.X_t     = torch.tensor(X_t,     dtype=torch.long)
        self.X_d     = torch.tensor(X_d,     dtype=torch.long)
        self.X_a     = torch.tensor(X_a,     dtype=torch.long)
        self.Y       = torch.tensor(Y,       dtype=torch.long)
        # 길이 = PAD(0) 아닌 토큰 수
        self.lengths = (self.X_small != 0).sum(dim=1)

    def __len__(self):
        return self.Y.size(0)

    def __getitem__(self, i):
        return (self.X_small[i], self.X_t[i], self.X_d[i], self.X_a[i],
                self.lengths[i], self.Y[i])

# ---------------------- 모델 ----------------------
class NextSmallGRU(nn.Module):
    """
    입력: (small_id, time_bucket, dow, amt_bucket) 시퀀스
    처리: 임베딩 → concat → GRU → 마지막 hidden → Linear → 다음 소분류 확률
    """
    def __init__(self, vocab_small, emb_small, emb_time, emb_dow, emb_amt, hidden, dropout,
                 vocab_time=6, vocab_dow=7, vocab_amt=5):
        super().__init__()
        self.emb_small = nn.Embedding(vocab_small, emb_small, padding_idx=0)
        self.emb_time  = nn.Embedding(vocab_time,  emb_time,  padding_idx=0)
        self.emb_dow   = nn.Embedding(vocab_dow,   emb_dow,   padding_idx=0)
        self.emb_amt   = nn.Embedding(vocab_amt,   emb_amt,   padding_idx=0)

        in_dim = emb_small + emb_time + emb_dow + emb_amt
        self.gru = nn.GRU(input_size=in_dim, hidden_size=hidden, batch_first=True)
        self.dropout = nn.Dropout(dropout)
        self.out = nn.Linear(hidden, vocab_small)

    def forward(self, x_small, x_t, x_d, x_a, lengths):
        # B, L -> B, L, D
        e_small = self.emb_small(x_small)
        e_t     = self.emb_time(x_t)
        e_d     = self.emb_dow(x_d)
        e_a     = self.emb_amt(x_a)
        x = torch.cat([e_small, e_t, e_d, e_a], dim=-1)  # (B,L,EmbSum)

        # 패딩 무시를 위해 pack
        lengths = lengths.cpu()  # pack은 CPU int64 필요
        packed = nn.utils.rnn.pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)
        _, h_n = self.gru(packed)           # h_n: (1,B,H) 마지막 스텝 hidden
        h = self.dropout(h_n[-1])           # (B,H)
        logits = self.out(h)                # (B,Vsmall)
        return logits, h                    # h는 유저 임베딩 용도로 재사용 가능

# ---------------------- 학습 루프 ----------------------
def train_loop(model, loader, optim, crit, device):
    model.train()
    tot_loss, tot_n, acc1, acc3 = 0.0, 0, 0.0, 0.0
    for xb, xt, xd, xa, lens, y in loader:
        xb, xt, xd, xa, lens, y = xb.to(device), xt.to(device), xd.to(device), xa.to(device), lens.to(device), y.to(device)
        optim.zero_grad()
        logits, _ = model(xb, xt, xd, xa, lens)
        loss = crit(logits, y)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 1.0)  # ← 요 줄만 바꾸면 끝!
        optim.step()

        n = y.size(0)
        tot_loss += loss.item() * n
        tot_n    += n
        acc1     += topk_acc(logits, y, k=1) * n
        acc3     += topk_acc(logits, y, k=3) * n
    return tot_loss/tot_n, acc1/tot_n, acc3/tot_n

@torch.no_grad()
def eval_loop(model, loader, crit, device):
    model.eval()
    tot_loss, tot_n, acc1, acc3 = 0.0, 0, 0.0, 0.0
    for xb, xt, xd, xa, lens, y in loader:
        xb, xt, xd, xa, lens, y = xb.to(device), xt.to(device), xd.to(device), xa.to(device), lens.to(device), y.to(device)
        logits, _ = model(xb, xt, xd, xa, lens)
        loss = crit(logits, y)
        n = y.size(0)
        tot_loss += loss.item() * n
        tot_n    += n
        acc1     += topk_acc(logits, y, k=1) * n
        acc3     += topk_acc(logits, y, k=3) * n
    ppl = math.exp(min(tot_loss/tot_n, 50))  # Perplexity 안전범위
    return tot_loss/tot_n, acc1/tot_n, acc3/tot_n, ppl

# ---------------------- 메인 ----------------------
def main():
    # --- CLI args ---
    parser = argparse.ArgumentParser()
    parser.add_argument("--show-user", type=str, default=None,
                        help="이 user_id의 임베딩을 출력 (예: --show-user 1)")
    parser.add_argument("--show-user-idx", type=int, default=None,
                        help="user_ids.json의 0-based 인덱스로 출력 (예: --show-user-idx 0)")
    parser.add_argument("--topk", type=int, default=5,
                        help="가장 비슷한 유저 top-k도 함께 출력 (기본 5, 0이면 출력 안 함)")
    args = parser.parse_args()

    set_seed(CONFIG["seed"])
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    banner(f"DEVICE = {device}")

    # 데이터 로드
    banner("LOAD NPZ")
    D = np.load(NPZ_PATH)
    max_len     = int(D["max_len"])
    vocab_small = int(D["vocab_small"])
    print(f"max_len={max_len}, vocab_small={vocab_small}")

    train_ds = SeqDataset(D["train_X_small"], D["train_X_t"], D["train_X_d"], D["train_X_a"], D["train_Y"])
    val_ds   = SeqDataset(D["val_X_small"],   D["val_X_t"],   D["val_X_d"],   D["val_X_a"],   D["val_Y"])
    test_ds  = SeqDataset(D["test_X_small"],  D["test_X_t"],  D["test_X_d"],  D["test_X_a"],  D["test_Y"])

    print(f"train samples={len(train_ds):,}, val={len(val_ds):,}, test={len(test_ds):,}")

    train_ld = DataLoader(train_ds, batch_size=CONFIG["batch_size"], shuffle=True,  num_workers=0)
    val_ld   = DataLoader(val_ds,   batch_size=CONFIG["batch_size"], shuffle=False, num_workers=0)
    test_ld  = DataLoader(test_ds,  batch_size=CONFIG["batch_size"], shuffle=False, num_workers=0)

    # 모델
    banner("BUILD MODEL")
    model = NextSmallGRU(
        vocab_small=vocab_small,
        emb_small=CONFIG["emb_small"],
        emb_time=CONFIG["emb_time"],
        emb_dow=CONFIG["emb_dow"],
        emb_amt=CONFIG["emb_amt"],
        hidden=CONFIG["hidden"],
        dropout=CONFIG["dropout"],
        vocab_time=CONFIG["vocab_time"],
        vocab_dow=CONFIG["vocab_dow"],
        vocab_amt=CONFIG["vocab_amt"],
    ).to(device)
    print(model)

    crit  = nn.CrossEntropyLoss()
    optim = torch.optim.AdamW(model.parameters(), lr=CONFIG["lr"], weight_decay=CONFIG["weight_decay"])

    # 학습
    banner("TRAIN")
    best_val, best_path = 1e9, ARTI/"model_best.pt"
    hist = []
    for epoch in range(1, CONFIG["epochs"]+1):
        t0 = time.time()
        tr_loss, tr_a1, tr_a3 = train_loop(model, train_ld, optim, crit, device)
        va_loss, va_a1, va_a3, va_ppl = eval_loop(model, val_ld, crit, device)
        dt = time.time()-t0
        print(f"[{epoch:02d}] "
              f"train loss={tr_loss:.4f} acc@1={tr_a1:.3f} acc@3={tr_a3:.3f} | "
              f"val loss={va_loss:.4f} acc@1={va_a1:.3f} acc@3={va_a3:.3f} ppl={va_ppl:.1f} "
              f"({dt:.1f}s)", flush=True)
        hist.append({"epoch":epoch,"train_loss":tr_loss,"train_acc1":tr_a1,"train_acc3":tr_a3,
                     "val_loss":va_loss,"val_acc1":va_a1,"val_acc3":va_a3,"val_ppl":va_ppl,"sec":dt})
        # early stop
        if va_loss < best_val:
            best_val = va_loss
            torch.save({"model": model.state_dict(), "config": CONFIG,
                        "vocab_small": vocab_small, "max_len": max_len}, best_path)
            print(f"  ↳ saved best to {best_path}")

    # 로드 & 테스트
    ckpt = torch.load(best_path, map_location=device)
    model.load_state_dict(ckpt["model"])
    te_loss, te_a1, te_a3, te_ppl = eval_loop(model, test_ld, crit, device)
    banner("TEST METRICS")
    print(f"test loss={te_loss:.4f} acc@1={te_a1:.3f} acc@3={te_a3:.3f} ppl={te_ppl:.1f}")

    # 히스토리/설정 저장
    json.dump({"history":hist,"test":{"loss":te_loss,"acc1":te_a1,"acc3":te_a3,"ppl":te_ppl}},
              open(ARTI/"training_report.json","w"), ensure_ascii=False, indent=2)
    json.dump({"config":CONFIG,"vocab_small":vocab_small,"max_len":max_len},
              open(ARTI/"config.json","w"), ensure_ascii=False, indent=2)

    # 소분류 임베딩 저장
    small_emb = model.emb_small.weight.detach().cpu().numpy()  # (vocab_small, emb_small)
    np.save(ARTI/"small_embeddings.npy", small_emb)
    print(f"saved: {ARTI/'small_embeddings.npy'} shape={small_emb.shape}")

    # (선택) 유저 임베딩 저장 — 각 유저의 최근 max_len 시퀀스를 넣고 h(last) 추출
    try:
        with open(SMALL2ID, "r", encoding="utf-8") as f:
            small2id = json.load(f)

        # 원본 CSV로 유저-시퀀스 빌드(1단계 로직 요약)
        df = pd.read_csv(RAW_CSV).rename(columns={"유저아이디":"user_id","결제시점":"ts","소분류":"cat_small","결제금액":"amount"})
        df["ts"] = pd.to_datetime(df["ts"], errors="coerce")
        # 원본 컬럼명 '결제번호'는 rename에 포함하지 않았으므로 그대로 사용
        df = df.dropna(subset=["user_id","ts","cat_small","amount"]).drop_duplicates(subset=["결제번호"])
        df = df.sort_values(["user_id","ts"])
        df["small_id"] = df["cat_small"].map(lambda x: small2id.get(x, 0))
        df = df[df["small_id"]>0]

        # 1단계와 동일한 파생특성(간단 버전)
        def to_timebucket(h):
            if  6 <= h < 10:  return 0
            if 10 <= h < 14:  return 1
            if 14 <= h < 18:  return 2
            if 18 <= h < 22:  return 3
            if 22 <= h or h < 2: return 4
            return 5
        df["hour"] = df["ts"].dt.hour
        df["dow"]  = df["ts"].dt.dayofweek
        df["time_bucket"] = df["hour"].apply(to_timebucket)
        df["amount_log"] = np.log1p(df["amount"])
        df["amt_bucket"] = pd.qcut(df["amount_log"], q=5, labels=False, duplicates="drop")

        users, uvecs = [], []
        model.eval()
        for uid, g in df.groupby("user_id", sort=False):
            s  = g["small_id"].tolist()
            tb = g["time_bucket"].astype(int).tolist()
            dw = g["dow"].astype(int).tolist()
            ab = g["amt_bucket"].astype(int).tolist()
            # 패딩
            def pad_seq(x):
                if len(x) >= max_len: return x[-max_len:]
                return [0]*(max_len-len(x)) + x
            xb = torch.tensor([pad_seq(s)],  dtype=torch.long, device=device)
            xt = torch.tensor([pad_seq(tb)], dtype=torch.long, device=device)
            xd = torch.tensor([pad_seq(dw)], dtype=torch.long, device=device)
            xa = torch.tensor([pad_seq(ab)], dtype=torch.long, device=device)
            lens = torch.tensor([(np.array(s)!=0).sum() if len(s)<max_len else max_len], dtype=torch.long, device=device)
            _, h = model(xb, xt, xd, xa, lens)
            uvecs.append(h.squeeze(0).detach().cpu().numpy())
            users.append(uid)
        U = np.stack(uvecs) if len(uvecs)>0 else np.zeros((0, CONFIG["hidden"]), dtype=np.float32)
        np.save(ARTI/"user_embeddings.npy", U)
        json.dump(users, open(ARTI/"user_ids.json","w"), ensure_ascii=False, indent=2)
        print(f"user_embeddings saved: {U.shape} for {len(users)} users")

        # ====== (추가) 특정 유저 임베딩 콘솔 출력 ======
        try:
            target_idx = None
            if args.show_user is not None:
                target = args.show_user
                # 다양한 타입 대비
                candidates = [target]
                try: candidates.append(int(target))
                except: pass
                candidates.append(str(target))
                # 직접 매칭
                for c in candidates:
                    if c in users:
                        target_idx = users.index(c)
                        break
                # users가 숫자형일 때 재시도
                if target_idx is None and len(users) > 0 and isinstance(users[0], (int, np.integer)):
                    try:
                        target_idx = users.index(int(target))
                    except:  # noqa
                        pass
                if target_idx is None:
                    print(f"[warn] --show-user {target} 를 users 리스트에서 못 찾았어요. 예: 첫 5명={users[:5]}")
            elif args.show_user_idx is not None:
                if 0 <= args.show_user_idx < len(users):
                    target_idx = args.show_user_idx
                else:
                    print(f"[warn] --show-user-idx 범위를 벗어났어요: 0~{len(users)-1}")

            if target_idx is not None and len(U) > 0:
                vec = U[target_idx]
                uid = users[target_idx]
                np.set_printoptions(precision=4, suppress=True, linewidth=160)
                norm = float(np.linalg.norm(vec))
                print("\n========== USER EMBEDDING ==========")
                print(f"user_id={uid} | index={target_idx} | dim={vec.shape[0]} | L2norm={norm:.4f}")
                print(vec)

                # (선택) 가장 비슷한 유저 Top-K
                if args.topk and args.topk > 0 and len(U) > 1:
                    v = vec.reshape(1, -1)
                    U_norm = np.linalg.norm(U, axis=1, keepdims=True) + 1e-12
                    v_norm = np.linalg.norm(v) + 1e-12
                    sims = (U @ v.T).ravel() / (U_norm.ravel() * v_norm)
                    sims[target_idx] = -1.0   # 자기 자신 제외
                    topk = np.argsort(-sims)[:args.topk]
                    print("\n[Top-{} similar users] (cosine)".format(args.topk))
                    for rank, j in enumerate(topk, 1):
                        print(f"{rank:2d}. user_id={users[j]} idx={j} sim={sims[j]:.4f}")
                print("====================================\n")
        except Exception as e:
            print("[warn] 임베딩 출력 중 오류:", e)

    except Exception as e:
        print("[warn] user embedding export skipped:", e)

    banner("DONE")

if __name__ == "__main__":
    main()
