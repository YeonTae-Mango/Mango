-- ==================================================================
-- 상위 코드 (main_code) 데이터
-- ==================================================================
INSERT IGNORE INTO main_code (MAIN_CODE, MAIN_CODE_NAME, MAIN_CODE_DESCRIPTION, USE_YN)
VALUES ('SHOW', '공연/전시', '공연 및 전시 관련 카테고리', true),
       ('MEDIA', '미디어/통신', '미디어 및 통신 관련 카테고리', true),
       ('LIFE', '생활서비스', '생활 서비스 관련 카테고리', true),
       ('RETAIL', '소매/유통', '소매 및 유통 관련 카테고리', true),
       ('LEISURE', '여가/오락', '여가 및 오락 관련 카테고리', true),
       ('FOOD', '음식', '음식 관련 카테고리', true),
       ('EDU', '학문/교육', '학문 및 교육 관련 카테고리', true);

-- ==================================================================
-- 하위 코드 (sub_code) 데이터
-- ==================================================================

-- == SHOW (공연/전시) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('SHOW001', 'SHOW', '경기관람', '경기관람을(를) 나타내는 코드', true),
       ('SHOW002', 'SHOW', '전시장', '전시장을(를) 나타내는 코드', true),
       ('SHOW003', 'SHOW', '공연관람', '공연관람을(를) 나타내는 코드', true);

-- == MEDIA (미디어/통신) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('MEDIA001', 'MEDIA', '인터넷쇼핑', '인터넷쇼핑을(를) 나타내는 코드', true),
       ('MEDIA002', 'MEDIA', '기타결제', '기타결제을(를) 나타내는 코드', true);

-- == LIFE (생활서비스) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('LIFE001', 'LIFE', '미용서비스', '미용서비스을(를) 나타내는 코드', true),
       ('LIFE002', 'LIFE', '차량관리/서비스', '차량관리/서비스을(를) 나타내는 코드', true),
       ('LIFE003', 'LIFE', '교통서비스', '교통서비스을(를) 나타내는 코드', true),
       ('LIFE004', 'LIFE', '여행', '여행을(를) 나타내는 코드', true),
       ('LIFE005', 'LIFE', '유학대행', '유학대행을(를) 나타내는 코드', true),
       ('LIFE006', 'LIFE', '사우나', '사우나을(를) 나타내는 코드', true),
       ('LIFE007', 'LIFE', '휴게시설', '휴게시설을(를) 나타내는 코드', true);

-- == RETAIL (소매/유통) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('RETAIL001', 'RETAIL', '인테리어/가정용품', '인테리어/가정용품을(를) 나타내는 코드', true),
       ('RETAIL002', 'RETAIL', '스포츠/레져용품', '스포츠/레져용품을(를) 나타내는 코드', true),
       ('RETAIL003', 'RETAIL', '음/식료품소매', '음/식료품소매을(를) 나타내는 코드', true),
       ('RETAIL004', 'RETAIL', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('RETAIL005', 'RETAIL', '종합소매점', '종합소매점을(를) 나타내는 코드', true),
       ('RETAIL006', 'RETAIL', '악기/공예', '악기/공예을(를) 나타내는 코드', true),
       ('RETAIL007', 'RETAIL', '패션잡화', '패션잡화을(를) 나타내는 코드', true),
       ('RETAIL008', 'RETAIL', '건강/기호식품', '건강/기호식품을(를) 나타내는 코드', true),
       ('RETAIL009', 'RETAIL', '서적/도서', '서적/도서을(를) 나타내는 코드', true),
       ('RETAIL010', 'RETAIL', '화장품소매', '화장품소매을(를) 나타내는 코드', true),
       ('RETAIL011', 'RETAIL', '사무/교육용품', '사무/교육용품을(를) 나타내는 코드', true);

-- == LEISURE (여가/오락) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('LEISURE001', 'LEISURE', '요가/단전/마사지', '요가/단전/마사지을(를) 나타내는 코드', true),
       ('LEISURE002', 'LEISURE', '일반스포츠', '일반스포츠을(를) 나타내는 코드', true),
       ('LEISURE003', 'LEISURE', '숙박', '숙박을(를) 나타내는 코드', true),
       ('LEISURE004', 'LEISURE', '취미/오락', '취미/오락을(를) 나타내는 코드', true);

-- == FOOD (음식) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('FOOD001', 'FOOD', '한식', '한식을(를) 나타내는 코드', true),
       ('FOOD002', 'FOOD', '양식', '양식을(를) 나타내는 코드', true),
       ('FOOD003', 'FOOD', '일식', '일식을(를) 나타내는 코드', true),
       ('FOOD004', 'FOOD', '중식', '중식을(를) 나타내는 코드', true),
       ('FOOD005', 'FOOD', '베이커리', '베이커리을(를) 나타내는 코드', true),
       ('FOOD006', 'FOOD', '카페/디저트', '카페/디저트을(를) 나타내는 코드', true);

-- == EDU (학문/교육) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('EDU001', 'EDU', '예체능계학원', '예체능계학원을(를) 나타내는 코드', true),
       ('EDU002', 'EDU', '외국어학원', '외국어학원을(를) 나타내는 코드', true),
       ('EDU003', 'EDU', '입시학원', '입시학원을(를) 나타내는 코드', true),
       ('EDU004', 'EDU', '기술/직업교육학원', '기술/직업교육학원을(를) 나타내는 코드', true),
       ('EDU005', 'EDU', '독서실', '독서실을(를) 나타내는 코드', true);

-- ==================================================================
-- 상위 코드 (main_code) 데이터
-- ==================================================================
INSERT IGNORE INTO main_code (MAIN_CODE, MAIN_CODE_NAME, MAIN_CODE_DESCRIPTION, USE_YN)
VALUES ('HOT', '핫플형', '핫플레이스를 좋아하는 라이프스타일 타입', true),
       ('SHOP', '쇼핑형', '쇼핑을 좋아하는 라이프스타일 타입', true),
       ('ART', '예술가형', '예술을 좋아하는 라이프스타일 타입', true),
       ('BEAUTY', '뷰티형', '뷰티에 관심이 많은 라이프스타일 타입', true),
       ('TRAVEL', '여행가형', '여행을 좋아하는 라이프스타일 타입', true),
       ('SELF', '자기계발형', '자기계발에 관심이 많은 라이프스타일 타입', true),
       ('SPORTS', '스포츠형', '스포츠를 좋아하는 라이프스타일 타입', true),
       ('HOME', '집돌이형', '집에서 보내는 시간을 좋아하는 라이프스타일 타입', true),
       ('FOOD', '음식', '음식 관련 카테고리', true);

-- ==================================================================
-- 하위 코드 (sub_code) 데이터
-- ==================================================================

-- == HOT (핫플형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('HOT001', 'HOT', '경기관람', '경기관람을(를) 나타내는 코드', true),
       ('HOT002', 'HOT', '전시장', '전시장을(를) 나타내는 코드', true),
       ('HOT003', 'HOT', '공연관람', '공연관람을(를) 나타내는 코드', true),
       ('HOT004', 'HOT', '미용서비스', '미용서비스을(를) 나타내는 코드', true),
       ('HOT005', 'HOT', '교통서비스', '교통서비스을(를) 나타내는 코드', true),
       ('HOT006', 'HOT', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('HOT007', 'HOT', '패션잡화', '패션잡화을(를) 나타내는 코드', true),
       ('HOT008', 'HOT', '화장품소매', '화장품소매을(를) 나타내는 코드', true),
       ('HOT009', 'HOT', '취미/오락', '취미/오락을(를) 나타내는 코드', true);

-- == SHOP (쇼핑형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('SHOP001', 'SHOP', '인터넷쇼핑', '인터넷쇼핑을(를) 나타내는 코드', true),
       ('SHOP002', 'SHOP', '인테리어', '인테리어을(를) 나타내는 코드', true),
       ('SHOP003', 'SHOP', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('SHOP004', 'SHOP', '종합소매점', '종합소매점을(를) 나타내는 코드', true),
       ('SHOP005', 'SHOP', '패션잡화', '패션잡화을(를) 나타내는 코드', true);

-- == ART (예술가형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('ART001', 'ART', '전시장', '전시장을(를) 나타내는 코드', true),
       ('ART002', 'ART', '공연관람', '공연관람을(를) 나타내는 코드', true),
       ('ART003', 'ART', '인테리어', '인테리어을(를) 나타내는 코드', true),
       ('ART004', 'ART', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('ART005', 'ART', '악기/공예', '악기/공예을(를) 나타내는 코드', true),
       ('ART006', 'ART', '예체능계학원', '예체능계학원을(를) 나타내는 코드', true);

-- == BEAUTY (뷰티형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('BEAUTY001', 'BEAUTY', '미용서비스', '미용서비스을(를) 나타내는 코드', true),
       ('BEAUTY002', 'BEAUTY', '사우나', '사우나을(를) 나타내는 코드', true),
       ('BEAUTY003', 'BEAUTY', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('BEAUTY004', 'BEAUTY', '패션잡화', '패션잡화을(를) 나타내는 코드', true),
       ('BEAUTY005', 'BEAUTY', '화장품소매', '화장품소매을(를) 나타내는 코드', true),
       ('BEAUTY006', 'BEAUTY', '예체능계학원', '예체능계학원을(를) 나타내는 코드', true);

-- == TRAVEL (여행가형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('TRAVEL001', 'TRAVEL', '차량관리/서비스', '차량관리/서비스을(를) 나타내는 코드', true),
       ('TRAVEL002', 'TRAVEL', '교통서비스', '교통서비스을(를) 나타내는 코드', true),
       ('TRAVEL003', 'TRAVEL', '여행', '여행을(를) 나타내는 코드', true),
       ('TRAVEL004', 'TRAVEL', '휴게시설', '휴게시설을(를) 나타내는 코드', true),
       ('TRAVEL005', 'TRAVEL', '숙박', '숙박을(를) 나타내는 코드', true),
       ('TRAVEL006', 'TRAVEL', '취미/오락', '취미/오락을(를) 나타내는 코드', true),
       ('TRAVEL007', 'TRAVEL', '외국어학원', '외국어학원을(를) 나타내는 코드', true);

-- == SELF (자기계발형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('SELF001', 'SELF', '유학대행', '유학대행을(를) 나타내는 코드', true),
       ('SELF002', 'SELF', '악기/공예', '악기/공예을(를) 나타내는 코드', true),
       ('SELF003', 'SELF', '서적/도서', '서적/도서을(를) 나타내는 코드', true),
       ('SELF004', 'SELF', '사무/교육용품', '사무/교육용품을(를) 나타내는 코드', true),
       ('SELF005', 'SELF', '요가/단전/마사지', '요가/단전/마사지을(를) 나타내는 코드', true),
       ('SELF006', 'SELF', '일반스포츠', '일반스포츠을(를) 나타내는 코드', true),
       ('SELF007', 'SELF', '예체능계학원', '예체능계학원을(를) 나타내는 코드', true),
       ('SELF008', 'SELF', '외국어학원', '외국어학원을(를) 나타내는 코드', true),
       ('SELF009', 'SELF', '입시학원', '입시학원을(를) 나타내는 코드', true),
       ('SELF010', 'SELF', '기술/직업교육학원', '기술/직업교육학원을(를) 나타내는 코드', true),
       ('SELF011', 'SELF', '독서실', '독서실을(를) 나타내는 코드', true);

-- == SPORTS (스포츠형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('SPORTS001', 'SPORTS', '경기관람', '경기관람을(를) 나타내는 코드', true),
       ('SPORTS002', 'SPORTS', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('SPORTS003', 'SPORTS', '건강/기호식품', '건강/기호식품을(를) 나타내는 코드', true),
       ('SPORTS004', 'SPORTS', '요가/단전/마사지', '요가/단전/마사지을(를) 나타내는 코드', true),
       ('SPORTS005', 'SPORTS', '일반스포츠', '일반스포츠을(를) 나타내는 코드', true);

-- == HOME (집돌이형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('HOME001', 'HOME', '인터넷쇼핑', '인터넷쇼핑을(를) 나타내는 코드', true),
       ('HOME002', 'HOME', '인테리어/가정용품', '인테리어/가정용품을(를) 나타내는 코드', true),
       ('HOME003', 'HOME', '인테리어', '인테리어을(를) 나타내는 코드', true),
       ('HOME004', 'HOME', '가정용품', '가정용품을(를) 나타내는 코드', true),
       ('HOME005', 'HOME', '음/식료품소매', '음/식료품소매을(를) 나타내는 코드', true),
       ('HOME006', 'HOME', '종합소매점', '종합소매점을(를) 나타내는 코드', true),
       ('HOME007', 'HOME', '가전제품', '가전제품을(를) 나타내는 코드', true),
       ('HOME008', 'HOME', '음식배달서비스', '음식배달서비스을(를) 나타내는 코드', true);

-- == FOOD (음식) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('FOOD001', 'FOOD', '한식', '한식을(를) 나타내는 코드', true),
       ('FOOD002', 'FOOD', '중식', '중식을(를) 나타내는 코드', true),
       ('FOOD003', 'FOOD', '양식', '양식을(를) 나타내는 코드', true),
       ('FOOD004', 'FOOD', '일식', '일식을(를) 나타내는 코드', true),
       ('FOOD005', 'FOOD', '카페/디저트', '카페/디저트을(를) 나타내는 코드', true),
       ('FOOD006', 'FOOD', '베이커리', '베이커리을(를) 나타내는 코드', true);