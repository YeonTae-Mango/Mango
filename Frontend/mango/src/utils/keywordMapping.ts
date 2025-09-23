// 소분류를 키워드와 설명으로 매핑하는 파일
export const keywordMapping: Record<string, { keyword: string; description: string }> = {
  "경기관람": {
    keyword: "서포터즈",
    description: "직관 없인 못 사시는군요, 인정합니다~"
  },
  "전시장": {
    keyword: "큐레이터",
    description: "전시장에서 길 잃는 스타일 아니신가요?"
  },
  "공연관람": {
    keyword: "공연 덕후",
    description: "무대 보는 순간 심장이 쿵쾅이시죠!"
  },
  "인터넷쇼핑": {
    keyword: "택배요정",
    description: "문 앞 택배 뜯는 게 제일 행복하시죠?"
  },
  "기타결제": {
    keyword: "x",
    description: "설명 없음"
  },
  "미용서비스": {
    keyword: "단발병",
    description: "머리 자를 때마다 새 인생 시작하시죠~"
  },
  "차량관리/서비스": {
    keyword: "메케닉",
    description: "자동차 얘기만 나오면 눈빛 달라지시네요!"
  },
  "교통서비스": {
    keyword: "조깅전문가",
    description: "두 발로 세상 정복 중이시군요!"
  },
  "여행": {
    keyword: "탑건",
    description: "여행도 액션처럼 즐기시는군요!"
  },
  "유학대행": {
    keyword: "교환학생",
    description: "세계를 놀이터 삼으시는군요, 맞죠?"
  },
  "사우나": {
    keyword: "땀땀땀;",
    description: "찜질방 없인 못 버티실 텐데요~"
  },
  "휴게시설": {
    keyword: "휴게소 전문가",
    description: "휴게소 간식 메뉴판 다 외우셨죠?"
  },
  "인테리어/가정용품": {
    keyword: "홈데코",
    description: "집안 꾸미기에 영혼을 갈아넣으셨네요!"
  },
  "스포츠/레져용품": {
    keyword: "운동은 장비빨",
    description: "장비부터 사야 직성이 풀리시죠~"
  },
  "음/식료품소매": {
    keyword: "간식창고",
    description: "간식 숨겨두는 거 들켰네요!"
  },
  "의복/의류": {
    keyword: "패션피플",
    description: "오늘도 런웨이 걷는 기분 아니신가요?"
  },
  "종합소매점": {
    keyword: "편의점러버",
    description: "편의점이 제2의 집이시군요~"
  },
  "악기/공예": {
    keyword: "아티스트",
    description: "손끝에서 걸작이 툭툭 나오시죠!"
  },
  "패션잡화": {
    keyword: "트렌드세터",
    description: "유행을 이끄시는군요!"
  },
  "건강/기호식품": {
    keyword: "건강이 최우선",
    description: "채소만 봐도 웃음 나시죠?"
  },
  "서적/도서": {
    keyword: "똑똑이가 되",
    description: "서점에서 시간순삭 하시는군요!"
  },
  "화장품소매": {
    keyword: "뷰티홀릭",
    description: "화장대 위에 자리 없으시겠네요~"
  },
  "사무/교육용품": {
    keyword: "문방구대장",
    description: "볼펜 하나에도 진심이시군요!"
  },
  "요가/단전/마사지": {
    keyword: "스트레칭 요정",
    description: "스트레칭할 때 요정 강림하시네요!"
  },
  "일반스포츠": {
    keyword: "스포츠광",
    description: "운동할 때 제일 빛나시죠, 맞죠?"
  },
  "숙박": {
    keyword: "출장러",
    description: "출장마저 여행처럼 소화하시네요~"
  },
  "취미/오락": {
    keyword: "게임 덕후",
    description: "새벽까지 손에서 패드 안 놓으시죠!"
  },
  "한식": {
    keyword: "한식러버",
    description: "역시 밥심 아니면 안 되시죠?"
  },
  "양식": {
    keyword: "파스타학과",
    description: "면 종류 다 마스터하셨겠네요~"
  },
  "일식": {
    keyword: "스시러버",
    description: "스시 없인 주말이 허전하시죠!"
  },
  "중식": {
    keyword: "마라중독",
    description: "얼얼해야 삶이 즐거우신가요?"
  },
  "베이커리": {
    keyword: "빵돌이",
    description: "빵집 앞에선 무조건 멈추시네요~"
  },
  "카페/디저트": {
    keyword: "카페인중독",
    description: "커피 없인 하루 시작 불가시죠!"
  },
  "예체능계학원": {
    keyword: "전문취미러",
    description: "취미를 전공처럼 연구하시네요!"
  },
  "외국어학원": {
    keyword: "N개국어",
    description: "언어마다 성격도 바뀌시나요?"
  },
  "입시학원": {
    keyword: "N수생",
    description: "몇 번이든 도전하실 기세시군요!"
  },
  "기술/직업교육학원": {
    keyword: "기술이 자산",
    description: "배운 기술은 곧바로 써먹으시죠~"
  },
  "독서실": {
    keyword: "열공러",
    description: "공부할 때만큼 진지하실 때 없으시네요!"
  }
};

// 소분류를 키워드로 변환하는 헬퍼 함수
export const getKeywordFromCategory = (category: string): { keyword: string; description: string } => {
  return keywordMapping[category] || { keyword: category, description: "키워드 정보가 없습니다." };
};
