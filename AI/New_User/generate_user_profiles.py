#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# AI/New_User/generate_user_profiles.py

import json
import pandas as pd
from datetime import datetime
from pathlib import Path
import sys
import os

# AI/New_User에서 상위 디렉토리(AI)를 sys.path에 추가
current_dir = Path(__file__).parent  # AI/New_User
ai_dir = current_dir.parent           # AI
sys.path.append(str(ai_dir))

from Analyze.infer_cosine import infer_profile

def load_trainset_data():
    """trainset.csv 파일 로드"""
    # AI/New_User에서 AI/Banking으로 가는 경로
    csv_path = ai_dir / "Banking" / "trainset.csv"
    if not csv_path.exists():
        raise FileNotFoundError(f"trainset.csv 파일을 찾을 수 없습니다: {csv_path}")
    
    df = pd.read_csv(csv_path, encoding='utf-8')
    print(f"trainset.csv 로드 완료: {len(df)}건")
    return df

def load_users_data():
    """users_for_entity_named_fixed_gender.csv 파일 로드"""
    # AI/New_User에서 AI/Banking으로 가는 경로
    csv_path = ai_dir / "Banking" / "users_for_entity_named_fixed_gender.csv"
    if not csv_path.exists():
        raise FileNotFoundError(f"users 파일을 찾을 수 없습니다: {csv_path}")
    
    df = pd.read_csv(csv_path, encoding='utf-8')
    print(f"users 파일 로드 완료: {len(df)}명")
    return df

def convert_trainset_to_mock_format(trainset_df, users_df):
    """trainset과 users 데이터를 mock.json 형태로 변환"""
    user_data_list = []
    
    # 유저별로 그룹화
    unique_users = sorted(trainset_df['유저아이디'].unique())
    print(f"총 {len(unique_users)}명의 유저 데이터 변환 시작...")
    
    for user_id in unique_users:
        user_payments = trainset_df[trainset_df['유저아이디'] == user_id].copy()
        
        # 해당 유저 정보 찾기
        user_info = users_df[users_df['user_id'] == user_id]
        if len(user_info) == 0:
            print(f"Warning: 유저 {user_id} 정보를 찾을 수 없습니다.")
            # 기본 정보로 생성
            gender = "남자" if user_id <= 50 else "여자"
            age = 30
            birth_date = "1993-01-01"
        else:
            user_info = user_info.iloc[0]
            gender = str(user_info['gender'])
            
            # 생년월일에서 나이 계산
            try:
                birth_date = pd.to_datetime(user_info['birth_date'])
                age = datetime.now().year - birth_date.year
                if datetime.now().month < birth_date.month or \
                   (datetime.now().month == birth_date.month and datetime.now().day < birth_date.day):
                    age -= 1
                birth_date = str(birth_date)[:10]
            except:
                age = 30
                birth_date = "1993-01-01"
        
        # 결제 데이터를 mock.json 형태로 변환
        payments_list = []
        for _, payment in user_payments.iterrows():
            payment_dict = {
                "user_id": int(payment['유저아이디']),
                "payment_time": str(payment['결제시점']),
                "category": str(payment['대분류']),
                "subcategory": str(payment['소분류']),
                "payment_id": str(payment['결제번호']),
                "payment_amount": int(payment['결제금액'])
            }
            payments_list.append(payment_dict)
        
        # 결제 시간 순으로 정렬
        payments_list.sort(key=lambda x: x['payment_time'])
        
        # mock.json 형태로 구성
        user_mock_data = {
            "user": {
                "birthdate": birth_date,
                "gender": gender,
                "age": age,
                "user_id": int(user_id)
            },
            "period": {
                "months": 6,
                "end_date": str(payments_list[-1]['payment_time'][:10]) if payments_list else "2025-09-16"
            },
            "count": len(payments_list),
            "payments": payments_list
        }
        
        user_data_list.append(user_mock_data)
        
        if user_id % 10 == 0:  # 10명마다 진행상황 출력
            print(f"유저 {user_id} 변환 완료 (진행률: {user_id}/{len(unique_users)})")
    
    return user_data_list

def generate_user_profile_analysis(user_mock_data):
    """단일 유저의 프로필 분석 수행"""
    try:
        # artifacts 폴더 경로 (AI/New_User에서 프로젝트 루트의 artifacts로)
        emb_path = ai_dir.parent / "artifacts" / "small_embeddings.npy"
        
        # infer_profile 함수 호출
        analysis = infer_profile(
            user_mock_data, 
            emb_path=str(emb_path),
            tau=0.7, 
            include_missing_zero=True
        )
        
        # to_preferred_shape 함수와 유사한 형태로 변환
        # 대표유형 확률 정규화
        types = [{"name": t["name"], "prob": float(t.get("prob", 0.0))}
                 for t in analysis.get("대표유형", [])]
        s = sum(t["prob"] for t in types) or 1.0
        for t in types:
            t["prob"] = round(t["prob"]/s, 2)
        
        # 키워드 전체
        keywords = [{"name": k["name"], "score": round(float(k.get("score", 0.0)), 2)}
                   for k in analysis.get("키워드", [])]
        
        # 음식 섹션
        by_big = analysis.get("대분류상세", {})
        food_list = by_big.get("음식", [])
        food = [{"name": x["name"], "score": round(float(x.get("score", 0.0)), 2)}
               for x in food_list]
        
        result = {
            "user_id": user_mock_data["user"]["user_id"],
            "대표유형": types,
            "키워드": keywords,
            "음식": food
        }
        
        return result
        
    except Exception as e:
        print(f"유저 {user_mock_data['user']['user_id']} 분석 실패: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    """메인 실행 함수"""
    try:
        print("=== 사용자 프로필 분석 시작 ===")
        print(f"작업 디렉토리: {Path.cwd()}")
        print(f"스크립트 위치: {Path(__file__).parent}")
        print(f"AI 디렉토리: {ai_dir}")
        
        # 1. 데이터 로드
        print("\n1. 데이터 로드 중...")
        trainset_df = load_trainset_data()
        users_df = load_users_data()
        
        # 2. mock.json 형태로 변환
        print("\n2. 데이터 변환 중...")
        user_mock_list = convert_trainset_to_mock_format(trainset_df, users_df)
        print(f"총 {len(user_mock_list)}명의 유저 데이터 변환 완료")
        
        # 3. 각 유저별 프로필 분석
        print("\n3. 프로필 분석 수행 중...")
        user_profiles = []
        
        for i, user_mock_data in enumerate(user_mock_list, 1):
            user_id = user_mock_data['user']['user_id']
            
            if i % 10 == 1:  # 처음과 10의 배수마다 출력
                print(f"[{i}/{len(user_mock_list)}] 유저 {user_id} 분석 중...")
            
            profile_result = generate_user_profile_analysis(user_mock_data)
            if profile_result:
                user_profiles.append(profile_result)
            
            # 진행상황 출력
            if i % 20 == 0:
                print(f"진행률: {i}/{len(user_mock_list)} ({i/len(user_mock_list)*100:.1f}%)")
        
        # 4. 결과 저장
        print(f"\n4. 결과 저장 중...")
        output_path = current_dir / "user_category_data.json"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(user_profiles, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 완료!")
        print(f"📁 저장 위치: {output_path}")
        print(f"📊 총 분석된 유저: {len(user_profiles)}명")
        
        # 샘플 출력
        if user_profiles:
            print(f"\n=== 샘플 데이터 (유저 {user_profiles[0]['user_id']}) ===")
            sample = user_profiles[0]
            print(f"대표유형 수: {len(sample['대표유형'])}")
            print(f"키워드 수: {len(sample['키워드'])}")
            print(f"음식 카테고리 수: {len(sample['음식'])}")
            
            print("\n상위 3개 대표유형:")
            for i, type_info in enumerate(sample['대표유형'][:3], 1):
                print(f"  {i}. {type_info['name']}: {type_info['prob']}")
            
            print("\n상위 5개 키워드:")
            for i, keyword in enumerate(sample['키워드'][:5], 1):
                print(f"  {i}. {keyword['name']}: {keyword['score']}")
            
            print("\n음식 카테고리:")
            for i, food_item in enumerate(sample['음식'], 1):
                print(f"  {i}. {food_item['name']}: {food_item['score']}")
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()