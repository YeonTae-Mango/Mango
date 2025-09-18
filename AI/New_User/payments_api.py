# file: payments_api.py
import random
import uuid
import json
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional

# ---------------------------------------
# 데이터 모델
# ---------------------------------------
@dataclass
class PaymentRecord:
    user_id: int
    payment_time: str  # 'YYYY-MM-DD HH:MM:SS'
    category: str
    subcategory: str
    payment_id: str
    payment_amount: int

@dataclass
class UserProfile:
    age: int
    gender: str  # "남자" | "여자"

# ---------------------------------------
# 유틸
# ---------------------------------------
def parse_birthdate(birthdate: str) -> datetime:
    s = birthdate.replace("/", "-")
    if "-" not in s and len(s) == 8:  # 19960214 형태
        s = f"{s[0:4]}-{s[4:6]}-{s[6:8]}"
    return datetime.strptime(s, "%Y-%m-%d")

def calc_age(birthdate: datetime, ref: datetime) -> int:
    return ref.year - birthdate.year - ((ref.month, ref.day) < (birthdate.month, birthdate.day))

def rand_uuid8() -> str:
    return str(uuid.uuid4())[:8].upper()

# ---------------------------------------
# 베이스 금액 테이블 (간단 버전)
# ---------------------------------------
BASE_CATEGORIES: Dict[str, Dict[str, Dict[str, int]]] = {
    "음식": {
        "한식": {"min": 8000, "max": 25000, "avg": 15000},
        "양식": {"min": 15000, "max": 45000, "avg": 25000},
        "중식": {"min": 8000, "max": 20000, "avg": 12000},
        "일식": {"min": 12000, "max": 35000, "avg": 20000},
        "카페/디저트": {"min": 4000, "max": 12000, "avg": 6500},
        "베이커리": {"min": 3000, "max": 15000, "avg": 8000},
    },
    "소매/유통": {
        "의복/의류": {"min": 20000, "max": 200000, "avg": 80000},
        "화장품소매": {"min": 10000, "max": 150000, "avg": 45000},
        "패션잡화": {"min": 15000, "max": 100000, "avg": 40000},
        "인터넷쇼핑": {"min": 8000, "max": 120000, "avg": 35000},
        "인테리어/가정용품": {"min": 10000, "max": 80000, "avg": 30000},
    },
    "생활서비스": {
        "교통서비스": {"min": 1370, "max": 30000, "avg": 8000},
        "미용서비스": {"min": 15000, "max": 150000, "avg": 50000},
        "차량관리/서비스": {"min": 30000, "max": 200000, "avg": 80000},
        "여행": {"min": 50000, "max": 1000000, "avg": 200000},
    },
    "여가/오락": {
        "일반스포츠": {"min": 60000, "max": 200000, "avg": 100000},
        "취미/오락": {"min": 10000, "max": 100000, "avg": 35000},
        "숙박": {"min": 50000, "max": 300000, "avg": 120000},
    },
    "공연/전시": {
        "공연관람": {"min": 30000, "max": 150000, "avg": 70000},
        "전시장": {"min": 10000, "max": 30000, "avg": 18000},
        "경기관람": {"min": 20000, "max": 80000, "avg": 40000},
    },
    "학문/교육": {
        "외국어학원": {"min": 150000, "max": 600000, "avg": 300000},
        "서적/도서": {"min": 8000, "max": 40000, "avg": 18000},
    },
    "미디어/통신": {
        "인터넷쇼핑": {"min": 5000, "max": 80000, "avg": 25000},
        "기타결제": {"min": 10000, "max": 50000, "avg": 20000},
    },
}

# ---------------------------------------
# 시간 가중치 (요일/시간대)
# ---------------------------------------
WEEKDAY_WEIGHTS = {0: 0.12, 1: 0.13, 2: 0.14, 3: 0.15, 4: 0.18, 5: 0.16, 6: 0.12}
HOUR_WEIGHTS = {
    "음식": [0.02,0.01,0.01,0.01,0.01,0.02,0.04,0.08,0.06,0.04,0.05,0.08,0.12,0.08,0.05,0.04,0.05,0.06,0.08,0.10,0.08,0.06,0.04,0.03],
    "생활서비스": [0.02,0.01,0.01,0.01,0.02,0.04,0.08,0.12,0.10,0.08,0.06,0.05,0.06,0.05,0.04,0.04,0.05,0.08,0.10,0.08,0.06,0.04,0.03,0.02],
    "default": [0.02,0.01,0.01,0.01,0.01,0.02,0.03,0.05,0.06,0.08,0.10,0.08,0.08,0.07,0.06,0.06,0.07,0.08,0.09,0.08,0.06,0.05,0.04,0.03]
}

# ---------------------------------------
# 페르소나 (간단/독립 버전)
# categories: {카테고리: (frequency, {소분류:가중치})}, budget: float
# ---------------------------------------
MALE_PERSONAS = {
    "IT_개발자": {
        "budget": 1.2,
        "categories": {
            "음식": (35, {"카페/디저트":0.3,"중식":0.25,"한식":0.2,"양식":0.15,"일식":0.1}),
            "소매/유통": (18, {"인터넷쇼핑":0.4,"의복/의류":0.25,"서적/도서":0.15,"인테리어/가정용품":0.1,"화장품소매":0.05,"패션잡화":0.05}),
            "여가/오락": (25, {"취미/오락":0.8,"숙박":0.15,"일반스포츠":0.03}),
            "생활서비스": (10, {"교통서비스":0.7,"미용서비스":0.2,"차량관리/서비스":0.05,"여행":0.03}),
            "미디어/통신": (20, {"기타결제":0.6,"인터넷쇼핑":0.4}),
            "공연/전시": (2,  {"공연관람":0.5,"전시장":0.3,"경기관람":0.2}),
            "학문/교육": (3,  {"외국어학원":0.3,"서적/도서":0.1}),
        }
    },
    "헬스_마니아": {
        "budget": 1.1,
        "categories": {
            "음식": (45, {"한식":0.4,"양식":0.25,"카페/디저트":0.15,"베이커리":0.1,"중식":0.05,"일식":0.05}),
            "여가/오락": (35, {"일반스포츠":0.7,"취미/오락":0.1,"숙박":0.05}),
            "소매/유통": (22, {"스포츠/레져용품":0.5,"의복/의류":0.2,"인터넷쇼핑":0.1,"화장품소매":0.05,"패션잡화":0.05,"인테리어/가정용품":0.1}),
            "생활서비스": (15, {"교통서비스":0.5,"미용서비스":0.25,"여행":0.08}),
            "공연/전시": (2,  {"경기관람":0.7,"공연관람":0.2,"전시장":0.1}),
            "학문/교육": (3,  {"예체능계학원":0.6,"기술/직업교육학원":0.2,"외국어학원":0.2})
        }
    },
    "미니멀_절약형": {
        "budget": 0.7,
        "categories": {
            "음식": (35, {"중식":0.35,"한식":0.3,"카페/디저트":0.2,"베이커리":0.1,"양식":0.03,"일식":0.02}),
            "소매/유통": (8,  {"인터넷쇼핑":0.5,"의복/의류":0.15,"화장품소매":0.1,"서적/도서":0.15,"인테리어/가정용품":0.1}),
            "여가/오락": (10, {"취미/오락":0.7,"숙박":0.2,"일반스포츠":0.05}),
            "생활서비스": (12, {"교통서비스":0.8,"미용서비스":0.1,"여행":0.05,"차량관리/서비스":0.05}),
            "학문/교육": (5,  {"서적/도서":0.5,"외국어학원":0.15,"기술/직업교육학원":0.1}),
            "공연/전시": (1,  {"전시장":0.6,"공연관람":0.3,"경기관람":0.1}),
            "미디어/통신": (10, {"기타결제":0.6,"인터넷쇼핑":0.4})
        }
    }
}

FEMALE_PERSONAS = {
    "카페_인플루언서": {
        "budget": 1.0,
        "categories": {
            "음식": (55, {"카페/디저트":0.4,"베이커리":0.25,"양식":0.15,"한식":0.1,"일식":0.1}),
            "소매/유통": (25, {"화장품소매":0.35,"패션잡화":0.25,"의복/의류":0.2,"인터넷쇼핑":0.2}),
            "생활서비스": (18, {"미용서비스":0.5,"교통서비스":0.35,"여행":0.15}),
            "여가/오락": (15, {"취미/오락":0.6,"숙박":0.3}),
            "공연/전시": (5,  {"공연관람":0.5,"전시장":0.4,"경기관람":0.1}),
            "학문/교육": (2,  {"예체능계학원":0.4,"외국어학원":0.3,"서적/도서":0.3}),
            "미디어/통신": (8,  {"인터넷쇼핑":0.6,"기타결제":0.4})
        }
    },
    "쇼핑_러버": {
        "budget": 1.4,
        "categories": {
            "음식": (42, {"카페/디저트":0.3,"양식":0.25,"베이커리":0.2,"한식":0.15,"일식":0.1}),
            "소매/유통": (45, {"의복/의류":0.35,"화장품소매":0.25,"패션잡화":0.2,"인터넷쇼핑":0.2}),
            "생활서비스": (20, {"교통서비스":0.4,"미용서비스":0.35,"여행":0.25}),
            "여가/오락": (15, {"취미/오락":0.5,"숙박":0.3,"요가/단전/마사지":0.2}),
            "공연/전시": (5,  {"공연관람":0.6,"전시장":0.3,"경기관람":0.1}),
            "학문/교육": (1,  {"외국어학원":0.4,"서적/도서":0.6}),
            "미디어/통신": (12, {"인터넷쇼핑":0.8,"기타결제":0.2})
        }
    },
    "헬시_라이프": {
        "budget": 1.1,
        "categories": {
            "음식": (42, {"한식":0.3,"카페/디저트":0.25,"양식":0.2,"베이커리":0.15,"일식":0.1}),
            "여가/오락": (30, {"일반스포츠":0.5,"요가/단전/마사지":0.3,"취미/오락":0.2}),
            "소매/유통": (20, {"스포츠/레져용품":0.35,"화장품소매":0.25,"의복/의류":0.2,"인터넷쇼핑":0.2}),
            "생활서비스": (18, {"미용서비스":0.35,"교통서비스":0.35,"여행":0.3}),
            "공연/전시": (2,  {"공연관람":0.5,"전시장":0.3,"경기관람":0.2}),
            "학문/교육": (3,  {"예체능계학원":0.5,"외국어학원":0.3,"서적/도서":0.2}),
            "미디어/통신": (5,  {"인터넷쇼핑":0.7,"기타결제":0.3})
        }
    }
}

# ---------------------------------------
# 생성 로직
# ---------------------------------------
class OneUserPaymentGenerator:
    def __init__(self):
        self.used_ids = set()

    def select_persona(self, gender: str) -> Tuple[str, Dict]:
        pool = MALE_PERSONAS if gender == "남자" else FEMALE_PERSONAS
        name, data = random.choice(list(pool.items()))
        # 20% 확률로 다른 페르소나와 혼합
        if random.random() < 0.2 and len(pool) > 1:
            other_name, other_data = random.choice([x for x in pool.items() if x[0] != name])
            mixed = self.mix_persona(data, other_data, weight1=random.uniform(0.7, 0.9))
            return f"{name}+{other_name}", mixed
        return name, data

    @staticmethod
    def mix_persona(p1: dict, p2: dict, weight1: float = 0.8) -> dict:
        """현재 구조( budget + categories:{cat:(freq, subpref)} )에 맞춰 혼합"""
        out = {"budget": 0.0, "categories": {}}
        c1, c2 = p1.get("categories", {}), p2.get("categories", {})
        all_cats = set(c1.keys()) | set(c2.keys())

        for c in all_cats:
            if c in c1 and c in c2:
                f1, pref1 = c1[c]
                f2, pref2 = c2[c]
                mfreq = max(1, int(f1 * weight1 + f2 * (1 - weight1)))
                # subpref mix
                all_subs = set(pref1.keys()) | set(pref2.keys())
                mpref = {}
                for s in all_subs:
                    v1 = pref1.get(s, 0.0)
                    v2 = pref2.get(s, 0.0)
                    mpref[s] = v1 * weight1 + v2 * (1 - weight1)
                total = sum(mpref.values())
                if total > 0:
                    mpref = {k: v / total for k, v in mpref.items()}
                out["categories"][c] = (mfreq, mpref)
            elif c in c1:
                out["categories"][c] = (c1[c][0], dict(c1[c][1]))
            else:
                out["categories"][c] = (c2[c][0], dict(c2[c][1]))

        out["budget"] = p1.get("budget", 1.0) * weight1 + p2.get("budget", 1.0) * (1 - weight1)
        return out

    def amount(self, category: str, sub: str, budget: float) -> int:
        base = BASE_CATEGORIES.get(category, {}).get(sub)
        if not base:
            return 10000
        mn = max(base["min"], int(base["min"] * budget * 0.8))
        mx = min(base["max"], int(base["max"] * budget * 1.2))
        avg = int(base["avg"] * budget)
        std = max(1, (mx - mn) / 6)
        val = random.gauss(avg, std)
        val = max(mn, min(mx, val))
        return int(round(val / 100) * 100)

    def even_datetime(self, start: datetime, end: datetime, category: str) -> datetime:
        days = (end - start).days + 1
        d = start + timedelta(days=random.randint(0, days - 1))
        hw = HOUR_WEIGHTS.get(category, HOUR_WEIGHTS["default"])
        hh = random.choices(list(range(24)), weights=hw)[0]
        mm = random.randint(0, 59)
        ss = random.randint(0, 59)
        return d.replace(hour=hh, minute=mm, second=ss)

    def generate_month(self, persona: Dict, month_start: datetime, month_end: datetime, count: int, user_id: int) -> List[PaymentRecord]:
        cats = {c: persona["categories"][c][0] for c in persona["categories"] if c in BASE_CATEGORIES}
        total_f = sum(cats.values()) or 1
        ratios = {c: f / total_f for c, f in cats.items()}
        assigned = {c: max(1, int(count * r)) for c, r in ratios.items()}
        remain = count - sum(assigned.values())
        while remain > 0:
            for c in sorted(ratios, key=ratios.get, reverse=True):
                if remain <= 0:
                    break
                assigned[c] += 1
                remain -= 1

        records: List[PaymentRecord] = []
        for cat, n in assigned.items():
            _, subpref = persona["categories"][cat]
            valid = [(s, w) for s, w in subpref.items() if s in BASE_CATEGORIES[cat]]
            if not valid:
                continue
            subs, weights = zip(*valid)
            for _ in range(n):
                sub = random.choices(subs, weights=weights)[0]
                ts = self.even_datetime(month_start, month_end, cat)
                amt = self.amount(cat, sub, persona["budget"])
                records.append(PaymentRecord(
                    user_id=user_id,
                    payment_time=ts.strftime("%Y-%m-%d %H:%M:%S"),
                    category=cat,
                    subcategory=sub,
                    payment_id=self.unique_id(),
                    payment_amount=amt
                ))
        return records

    def unique_id(self) -> str:
        while True:
            pid = rand_uuid8()
            if pid not in self.used_ids:
                self.used_ids.add(pid)
                return pid

    def generate_for_user(self, profile: UserProfile, months: int = 6,
                          end_date: Optional[datetime] = None, user_id: int = 1) -> List[PaymentRecord]:
        if end_date is None:
            end_date = datetime.now()
        _, persona = self.select_persona(profile.gender)
        out: List[PaymentRecord] = []
        for m in range(months):
            month = end_date.month - m
            year = end_date.year
            while month <= 0:
                month += 12
                year -= 1
            m_start = datetime(year, month, 1)
            # 해당 월의 마지막 날
            if month == 12:
                next_first = datetime(year + 1, 1, 1)
            else:
                next_first = datetime(year, month + 1, 1)
            m_end = next_first - timedelta(seconds=1)
            if m == 0:
                m_end = min(m_end, end_date)
            out.extend(self.generate_month(persona, m_start, m_end, 30, user_id=user_id))
        out.sort(key=lambda x: x.payment_time)
        return out

# ---------------------------------------
# 퍼사드: JSON 반환 함수
# ---------------------------------------
def generate_payments_json(
    birthdate: Optional[str] = None,
    gender: str = "남자",
    user_id: int = 1,
    months: int = 6,
    end_date: Optional[datetime] = None,
    age: Optional[int] = None
) -> Dict:
    """
    birthdate 또는 age 둘 중 하나는 반드시 제공.
    """
    if end_date is None:
        end_date = datetime.now()

    if birthdate:
        bdt = parse_birthdate(birthdate)
        age_val = calc_age(bdt, end_date)
        bdt_str = bdt.strftime("%Y-%m-%d")
    elif age is not None:
        age_val = age
        bdt_str = None
    else:
        raise ValueError("birthdate 또는 age 중 하나는 반드시 제공해야 합니다.")

    profile = UserProfile(age=age_val, gender=gender)
    gen = OneUserPaymentGenerator()
    payments = gen.generate_for_user(profile, months=months, end_date=end_date, user_id=user_id)

    return {
        # "user": {"birthdate": bdt_str, "gender": gender, "age": age_val, "user_id": user_id},
        # "period": {"months": months, "end_date": end_date.strftime("%Y-%m-%d")},
        # "count": len(payments),  # 기대: 180
        "payments": [vars(p) for p in payments]
    }

# ---------------------------------------
# 데모 실행
# ---------------------------------------
if __name__ == "__main__":
    result = generate_payments_json(birthdate="1993-04-12", gender="남자", user_id=7, months=6)
    print(json.dumps(result, ensure_ascii=False, indent=2))
