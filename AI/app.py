from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Optional

# 🔴 변경: 서브폴더(New_User)에서 가져오기
from New_User.payments_api import generate_payments_json

app = FastAPI(title="Payments Demo API")

def birthdate_from_age(age: int, ref: datetime) -> str:
    year = ref.year - age
    month = ref.month
    day = min(ref.day, 28)
    return f"{year:04d}-{month:02d}-{day:02d}"

@app.get("/payments")
def payments(
    gender: str,
    birthdate: Optional[str] = None,
    age: Optional[int] = None,
    months: int = 6,
):
    now = datetime.now()
    if not birthdate and age is None:
        return JSONResponse(status_code=400, content={"detail": "birthdate 또는 age 중 하나 필요"})

    if not birthdate and age is not None:
        birthdate = birthdate_from_age(age, now)

    result = generate_payments_json(birthdate=birthdate, gender=gender, months=months, end_date=now)
    return result
