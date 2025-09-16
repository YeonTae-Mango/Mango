import pandas as pd, numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split

# -------- 유틸 프린터들 --------
def banner(msg):
    print("\n" + "="*12 + f" {msg} " + "="*12, flush=True)

def head(df, n=5):
    print(df.head(n).to_string(index=False), flush=True)

def describe_counts(name, s, top=10):
    print(f"[{name}] 고유값={s.nunique():,}개, 총개수={len(s):,}개", flush=True)
    vc = s.value_counts().head(top)
    print(f" - Top{top}:\n{vc.to_string()}", flush=True)

# 0) 데이터 로드
banner("LOAD CSV")
csv_path = "C:/Users/SSAFY/Desktop/망고/S13P21A408/AI/Banking/trainset.csv"
print(f"읽는 중: {csv_path}", flush=True)
df_raw = pd.read_csv(csv_path)
print(f"원본 행 수={len(df_raw):,}", flush=True)
head(df_raw)

# 1) 파싱/정제
banner("CLEAN & PARSE")
df = df_raw.rename(columns={
    "유저아이디":"user_id","결제시점":"ts","대분류":"cat_big",
    "소분류":"cat_small","결제번호":"tx_id","결제금액":"amount"
})
df["ts"] = pd.to_datetime(df["ts"], errors="coerce")

before = len(df)
df = df.dropna(subset=["user_id","ts","cat_small","amount"]).drop_duplicates(subset=["tx_id"])
after = len(df)
print(f"정제 후 행 수={after:,} (제거된 행 수={before-after:,})", flush=True)
print(f"유저 수={df['user_id'].nunique():,}, 기간={df['ts'].min()} ~ {df['ts'].max()}", flush=True)

# 2) 파생컬럼
banner("FEATURE ENGINEERING")
df["hour"]  = df["ts"].dt.hour
df["dow"]   = df["ts"].dt.dayofweek      # 0=월
df["month"] = df["ts"].dt.month
df["amount_log"] = np.log1p(df["amount"])

# 시간대 버킷(6구간)
def to_timebucket(h):
    if  6 <= h < 10:  return 0  # 아침
    if 10 <= h < 14:  return 1  # 점심
    if 14 <= h < 18:  return 2  # 오후
    if 18 <= h < 22:  return 3  # 저녁
    if 22 <= h or h < 2: return 4  # 야밤
    return 5                      # 새벽(2~6)

df["time_bucket"] = df["hour"].apply(to_timebucket)

# 금액버킷(5-분위)
df["amt_bucket"] = pd.qcut(df["amount_log"], q=5, labels=False, duplicates="drop")

# 파생 분포 확인
describe_counts("time_bucket(0아침~5새벽)", df["time_bucket"])
describe_counts("amt_bucket(0~4)", df["amt_bucket"])

# 3) 소분류 정수 인코딩
banner("ENCODE CATEGORIES")
small_cats = sorted(df["cat_small"].unique())
small2id = {c:i+1 for i,c in enumerate(small_cats)}  # 0은 패딩 예약
id2small = {i:c for c,i in small2id.items()}
df["small_id"] = df["cat_small"].map(small2id)

print(f"소분류 고유 개수={len(small2id)} (패딩 제외)", flush=True)
describe_counts("cat_small", df["cat_small"], top=10)

# 4) 유저별 시퀀스 생성
banner("BUILD SEQUENCES")
df = df.sort_values(["user_id","ts"])
grouped = df.groupby("user_id", sort=False)

seq_small, seq_tbucket, seq_dow, seq_amtb = {}, {}, {}, {}
lengths = []

for uid, g in grouped:
    s  = g["small_id"].tolist()
    tb = g["time_bucket"].astype(int).tolist()
    dw = g["dow"].astype(int).tolist()
    ab = g["amt_bucket"].astype(int).tolist()
    seq_small[uid], seq_tbucket[uid], seq_dow[uid], seq_amtb[uid] = s, tb, dw, ab
    lengths.append(len(s))

print(f"유저 수={len(seq_small):,}", flush=True)
print(f"시퀀스 길이 요약(건당): min={np.min(lengths)}, median={int(np.median(lengths))}, max={np.max(lengths)}", flush=True)

# 샘플 유저 시퀀스 미리보기
sample_uid = next(iter(seq_small.keys()))
print(f"\n[샘플 유저] user_id={sample_uid}", flush=True)
g = df[df["user_id"]==sample_uid].head(12)
print(g[["ts","cat_small","amount"]].to_string(index=False), flush=True)

# 5) Train/Val/Test 분할(유저 기준)
banner("SPLIT USERS")
user_ids = list(seq_small.keys())
train_u, test_u = train_test_split(user_ids, test_size=0.2, random_state=42)
val_u,   test_u = train_test_split(test_u,   test_size=0.5, random_state=42)
print(f"Split 유저수 → train={len(train_u)}, val={len(val_u)}, test={len(test_u)}", flush=True)

# 6) 패딩 유틸
def pad_seq(x, max_len, pad=0):
    if len(x) >= max_len:
        return x[-max_len:]  # 최근 max_len만 사용
    return [pad]*(max_len-len(x)) + x

max_len = 32  # 이후 모델 입력 길이

def build_split(uids):
    X_small, X_t, X_d, X_a, Y_next = [], [], [], [], []
    sample_cnt = 0
    for uid in uids:
        s  = seq_small[uid]
        tb = seq_tbucket[uid]
        dw = seq_dow[uid]
        ab = seq_amtb[uid]
        # 샘플 생성: t 시점까지 → t+1 예측
        for t in range(1, len(s)):
            x_small = pad_seq(s[:t],  max_len)
            x_tb    = pad_seq(tb[:t], max_len)
            x_dw    = pad_seq(dw[:t], max_len)
            x_ab    = pad_seq(ab[:t], max_len)
            y       = s[t]  # 다음 소분류
            X_small.append(x_small); X_t.append(x_tb); X_d.append(x_dw); X_a.append(x_ab); Y_next.append(y)
            sample_cnt += 1
    return {
        "X_small": np.array(X_small, dtype=np.int64),
        "X_t": np.array(X_t, dtype=np.int64),
        "X_d": np.array(X_d, dtype=np.int64),
        "X_a": np.array(X_a, dtype=np.int64),
        "Y": np.array(Y_next, dtype=np.int64),
        "_samples": sample_cnt,
    }

banner("BUILD TRAIN/VAL/TEST ARRAYS")
train_data = build_split(train_u)
val_data   = build_split(val_u)
test_data  = build_split(test_u)
print(f"샘플 개수 → train={train_data['_samples']:,}, val={val_data['_samples']:,}, test={test_data['_samples']:,}", flush=True)

# 7) 저장(②단계에서 바로 불러 써서 학습)
banner("SAVE NPZ & MAPPINGS")
np.savez_compressed(
    "seq_dataset.npz",
    train_X_small=train_data["X_small"], train_X_t=train_data["X_t"], train_X_d=train_data["X_d"], train_X_a=train_data["X_a"], train_Y=train_data["Y"],
    val_X_small=val_data["X_small"],     val_X_t=val_data["X_t"],     val_X_d=val_data["X_d"],     val_X_a=val_data["X_a"],     val_Y=val_data["Y"],
    test_X_small=test_data["X_small"],   test_X_t=test_data["X_t"],   test_X_d=test_data["X_d"],   test_X_a=test_data["X_a"],   test_Y=test_data["Y"],
    max_len=max_len,
    vocab_small=len(small2id)+1  # 패딩 포함
)
print("저장 완료: seq_dataset.npz", flush=True)
print(" - train_X_small:", train_data["X_small"].shape, "train_Y:", train_data["Y"].shape, flush=True)
print(" - val_X_small:  ", val_data["X_small"].shape,   "val_Y:  ", val_data["Y"].shape,   flush=True)
print(" - test_X_small: ", test_data["X_small"].shape,  "test_Y: ", test_data["Y"].shape,  flush=True)

# 매핑도 저장(유형/키워드 스코어링에 필요)
import json
Path("mappings").mkdir(exist_ok=True)
json.dump(small2id, open("mappings/small2id.json","w", encoding="utf-8"), ensure_ascii=False)
json.dump(id2small, open("mappings/id2small.json","w", encoding="utf-8"), ensure_ascii=False)
print("저장 완료: mappings/small2id.json, mappings/id2small.json", flush=True)

banner("DONE")
