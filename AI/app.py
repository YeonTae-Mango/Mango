# AI/app.py
from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Optional
from typing import Dict, List
from .New_User.payments_api import generate_payments_json
from .Analyze.infer_cosine import infer_profile
from .Matching.matching import match_one_to_many, load_candidates_from_json
from pathlib import Path
import json
import numpy as np

app = FastAPI(title="Payments API")

def birthdate_from_age(age: int, ref: Optional[datetime] = None) -> str:
    if ref is None:
        ref = datetime.now()
    year = ref.year - age
    month = ref.month
    day = min(ref.day, 28)
    return f"{year:04d}-{month:02d}-{day:02d}"

def to_preferred_shape(analysis: dict, focus_big: str = "음식") -> dict:
    # 대표유형 확률 정규화(보기 좋게 소수 2자리) - "음식" 제외
    types = [{"name": t["name"], "prob": float(t.get("prob", 0.0))}
             for t in analysis.get("대표유형", [])
             if t["name"] != "음식"]
    s = sum(t["prob"] for t in types) or 1.0
    for t in types:
        t["prob"] = round(t["prob"]/s, 2)

    # 키워드: 전부 반영(소수 2자리)
    kws_raw = analysis.get("키워드", [])
    keywords = [{"name": k["name"], "score": round(float(k.get("score", 0.0)), 2)}
                for k in kws_raw]

    # 특정 대분류 섹션(기본 '음식') 전부
    by_big = analysis.get("대분류상세", {})
    focus_list = by_big.get(focus_big, [])
    focus = [{"name": x["name"], "score": round(float(x.get("score", 0.0)), 2)}
             for x in focus_list]

    return {"main_type": types, "keyword": keywords, "foods": focus}

# ---------- 2) 매핑/임베딩 (현재 사용하지 않음, infer_cosine.py에서 처리) ----------
# 이 함수들은 infer_cosine.py에서 동적 경로로 처리되므로 여기서는 제거
BASE_URL = "/ai-api/v1"
@app.post(f"{BASE_URL}/payments", summary="Payments")
def payments(
    gender: str = Query(..., description="성별 (남자/여자)"),
    user_id: int = Query(..., description="요청 유저ID (응답에는 포함되지 않음)"),
    birthdate: Optional[str] = Query(None, description="생년월일 YYYY-MM-DD (age 대신 사용 가능)"),
    age: Optional[int] = Query(None, description="나이 (birthdate 없을 때 사용)"),
    months: int = Query(6, description="생성 개월 수 (기본 6)")
):
    if not birthdate and age is None:
        raise HTTPException(status_code=400, detail="birthdate 또는 age 중 하나는 필수입니다.")
    now = datetime.now()
    if birthdate is None and age is not None:
        birthdate = birthdate_from_age(age, now)

    result = generate_payments_json(
        birthdate=birthdate,
        gender=gender,
        months=months,
        end_date=now,
        user_id=user_id,
    )

    cleaned = dict(result)
    cleaned["payments"] = [
        {k: v for k, v in p.items() if k != "user_id"}
        for p in result.get("payments", [])
    ]
    return JSONResponse(content=cleaned)

@app.post(f"{BASE_URL}/profile/cosine", summary="코사인 기반 대표유형/키워드 (파라미터 없음)")
def profile_cosine(payload: dict = Body(...)):
    # artifacts/small_embeddings.npy 사용 - 경로를 동적으로 계산
    current_dir = Path(__file__).resolve().parent
    emb_path = current_dir / "artifacts" / "small_embeddings.npy"
    analysis = infer_profile(payload, emb_path=str(emb_path),
                             tau=0.7, include_missing_zero=True)
    # 키워드 전체 + '음식' 섹션 전체
    return to_preferred_shape(analysis, focus_big="음식")

@app.post(
    f"{BASE_URL}/match/users",
    summary="(내 프로필 vs 전체 유저) 매칭 점수/순위",
    description="""요청 본문:
{
  "ref": { ...한 명의 프로필(JSON)... },
  "candidates": [ ...프로필 리스트... ]  // 생략하면 dataset_path에서 로드
  "dataset_path": "AI/user_category_data.json" // 옵션
}
응답: [{"user_id":1,"matching_rank":3,"matching_percent":82}, ...]
""",
)
def match_users(payload: Dict = Body(...)):
    # 1) 기준 유저(필수)
    ref = payload.get("ref")
    if ref is None:
        raise HTTPException(status_code=400, detail="'ref' (기준 유저 프로필)이 필요합니다.")

    # 2) 후보 목록: 직접 주거나 파일에서 로드
    cands: Optional[List[Dict]] = payload.get("candidates")
    if cands is None:
        dataset_path = payload.get("dataset_path")
        if dataset_path is None:
            # 기본 경로: AI/Matching/user_category_data.json 을 먼저 시도, 없으면 프로젝트 루트
            default1 = Path(__file__).resolve().parent / "Matching" / "user_category_data.json"
            default2 = Path.cwd() / "user_category_data.json"
            if default1.exists():
                dataset_path = str(default1)
            elif default2.exists():
                dataset_path = str(default2)
            else:
                raise HTTPException(status_code=400,
                    detail="candidates 또는 dataset_path 를 제공해 주세요.")
        try:
            cands = load_candidates_from_json(dataset_path)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"데이터셋 로드 실패: {e}")

    # 3) 계산
    results = match_one_to_many(ref, cands)

    # 4) 최종 형태(요청하신 최소 필드만)
    slim = [{"user_id": r["user_id"],
             "matching_rank": r["matching_rank"],
             "matching_percent": r["matching_percent"]} for r in results]
    return slim