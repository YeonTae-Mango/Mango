# Python 3.11 슬림 이미지 사용
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 복사 및 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 현재 디렉토리(AI/) 내용을 모두 복사
COPY . .

# 포트 노출
EXPOSE 8000

# FastAPI 애플리케이션 실행 (app.py를 직접 실행)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]