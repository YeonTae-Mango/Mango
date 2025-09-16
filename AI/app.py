from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Optional
from New_User.payments_api import generate_payments_json

app = FastAPI(title="Payments API")

@app.get("/payments", summary="Payments")
def payments(
    gender: str = Query(..., description="성별 (남자/여자)"),
    user_id: int = Query(..., description="요청 유저ID (응답에는 포함되지 않음)"),
    birthdate: Optional[str] = Query(None, description="생년월일 YYYY-MM-DD (age 대신 사용 가능)"),
    age: Optional[int] = Query(None, description="나이 (birthdate 없을 때 사용)"),
    months: int = Query(6, description="생성 개월 수 (기본 6)")
):
    # 간단한 유효성
    if not birthdate and age is None:
        raise HTTPException(status_code=400, detail="birthdate 또는 age 중 하나는 필수입니다.")

    now = datetime.now()
    result = generate_payments_json(
        birthdate=birthdate,
        gender=gender,
        months=months,
        end_date=now,
        age=age,
        user_id=user_id,           # ← 추가
    )
    return JSONResponse(content=result)
