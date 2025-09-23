-- ==================================================================
-- 상위 코드 (main_code) 데이터
-- ==================================================================
INSERT IGNORE INTO main_code (MAIN_CODE, MAIN_CODE_NAME, MAIN_CODE_DESCRIPTION, USE_YN)
VALUES ('PH_SHOW', '공연/전시', '공연 및 전시 관련 카테고리', true),
       ('PH_MEDIA', '미디어/통신', '미디어 및 통신 관련 카테고리', true),
       ('PH_LIFE', '생활서비스', '생활 서비스 관련 카테고리', true),
       ('PH_RETAIL', '소매/유통', '소매 및 유통 관련 카테고리', true),
       ('PH_LEISURE', '여가/오락', '여가 및 오락 관련 카테고리', true),
       ('PH_FOOD', '음식', '음식 관련 카테고리', true),
       ('PH_EDU', '학문/교육', '학문 및 교육 관련 카테고리', true);

-- ==================================================================
-- 하위 코드 (sub_code) 데이터
-- ==================================================================

-- == PH_SHOW (공연/전시) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('SHOW001', 'PH_SHOW', '경기관람', '경기관람을(를) 나타내는 코드', true),
       ('SHOW002', 'PH_SHOW', '전시장', '전시장을(를) 나타내는 코드', true),
       ('SHOW003', 'PH_SHOW', '공연관람', '공연관람을(를) 나타내는 코드', true);

-- == PH_MEDIA (미디어/통신) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('MEDIA001', 'PH_MEDIA', '인터넷쇼핑', '인터넷쇼핑을(를) 나타내는 코드', true),
       ('MEDIA002', 'PH_MEDIA', '기타결제', '기타결제을(를) 나타내는 코드', true);

-- == PH_LIFE (생활서비스) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('LIFE001', 'PH_LIFE', '미용서비스', '미용서비스을(를) 나타내는 코드', true),
       ('LIFE002', 'PH_LIFE', '차량관리/서비스', '차량관리/서비스을(를) 나타내는 코드', true),
       ('LIFE003', 'PH_LIFE', '교통서비스', '교통서비스을(를) 나타내는 코드', true),
       ('LIFE004', 'PH_LIFE', '여행', '여행을(를) 나타내는 코드', true),
       ('LIFE005', 'PH_LIFE', '유학대행', '유학대행을(를) 나타내는 코드', true),
       ('LIFE006', 'PH_LIFE', '사우나', '사우나을(를) 나타내는 코드', true),
       ('LIFE007', 'PH_LIFE', '휴게시설', '휴게시설을(를) 나타내는 코드', true);

-- == PH_RETAIL (소매/유통) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('RETAIL001', 'PH_RETAIL', '인테리어/가정용품', '인테리어/가정용품을(를) 나타내는 코드', true),
       ('RETAIL002', 'PH_RETAIL', '스포츠/레져용품', '스포츠/레져용품을(를) 나타내는 코드', true),
       ('RETAIL003', 'PH_RETAIL', '음/식료품소매', '음/식료품소매을(를) 나타내는 코드', true),
       ('RETAIL004', 'PH_RETAIL', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('RETAIL005', 'PH_RETAIL', '종합소매점', '종합소매점을(를) 나타내는 코드', true),
       ('RETAIL006', 'PH_RETAIL', '악기/공예', '악기/공예을(를) 나타내는 코드', true),
       ('RETAIL007', 'PH_RETAIL', '패션잡화', '패션잡화을(를) 나타내는 코드', true),
       ('RETAIL008', 'PH_RETAIL', '건강/기호식품', '건강/기호식품을(를) 나타내는 코드', true),
       ('RETAIL009', 'PH_RETAIL', '서적/도서', '서적/도서을(를) 나타내는 코드', true),
       ('RETAIL010', 'PH_RETAIL', '화장품소매', '화장품소매을(를) 나타내는 코드', true),
       ('RETAIL011', 'PH_RETAIL', '사무/교육용품', '사무/교육용품을(를) 나타내는 코드', true);

-- == PH_LEISURE (여가/오락) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('LEISURE001', 'PH_LEISURE', '요가/단전/마사지', '요가/단전/마사지을(를) 나타내는 코드', true),
       ('LEISURE002', 'PH_LEISURE', '일반스포츠', '일반스포츠을(를) 나타내는 코드', true),
       ('LEISURE003', 'PH_LEISURE', '숙박', '숙박을(를) 나타내는 코드', true),
       ('LEISURE004', 'PH_LEISURE', '취미/오락', '취미/오락을(를) 나타내는 코드', true);

-- == PH_FOOD (음식) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('FOOD001', 'PH_FOOD', '한식', '한식을(를) 나타내는 코드', true),
       ('FOOD002', 'PH_FOOD', '양식', '양식을(를) 나타내는 코드', true),
       ('FOOD003', 'PH_FOOD', '일식', '일식을(를) 나타내는 코드', true),
       ('FOOD004', 'PH_FOOD', '중식', '중식을(를) 나타내는 코드', true),
       ('FOOD005', 'PH_FOOD', '베이커리', '베이커리을(를) 나타내는 코드', true),
       ('FOOD006', 'PH_FOOD', '카페/디저트', '카페/디저트을(를) 나타내는 코드', true);

-- == PH_EDU (학문/교육) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('EDU001', 'PH_EDU', '예체능계학원', '예체능계학원을(를) 나타내는 코드', true),
       ('EDU002', 'PH_EDU', '외국어학원', '외국어학원을(를) 나타내는 코드', true),
       ('EDU003', 'PH_EDU', '입시학원', '입시학원을(를) 나타내는 코드', true),
       ('EDU004', 'PH_EDU', '기술/직업교육학원', '기술/직업교육학원을(를) 나타내는 코드', true),
       ('EDU005', 'PH_EDU', '독서실', '독서실을(를) 나타내는 코드', true);

-- ==================================================================
-- 상위 코드 (main_code) 데이터
-- ==================================================================
INSERT IGNORE INTO main_code (MAIN_CODE, MAIN_CODE_NAME, MAIN_CODE_DESCRIPTION, USE_YN)
VALUES ('LS_HOT', '핫플형', '핫플레이스를 좋아하는 라이프스타일 타입', true),
       ('LS_SHOP', '쇼핑형', '쇼핑을 좋아하는 라이프스타일 타입', true),
       ('LS_ART', '예술가형', '예술을 좋아하는 라이프스타일 타입', true),
       ('LS_BEAUTY', '뷰티형', '뷰티에 관심이 많은 라이프스타일 타입', true),
       ('LS_TRAVEL', '여행가형', '여행을 좋아하는 라이프스타일 타입', true),
       ('LS_SELF', '자기계발형', '자기계발에 관심이 많은 라이프스타일 타입', true),
       ('LS_SPORTS', '스포츠형', '스포츠를 좋아하는 라이프스타일 타입', true),
       ('LS_HOME', '집돌이형', '집에서 보내는 시간을 좋아하는 라이프스타일 타입', true),
       ('LS_FOOD', '음식', '음식 관련 카테고리', true);

-- ==================================================================
-- 하위 코드 (sub_code) 데이터
-- ==================================================================

-- == LS_HOT (핫플형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('HOT001', 'LS_HOT', '경기관람', '경기관람을(를) 나타내는 코드', true),
       ('HOT002', 'LS_HOT', '전시장', '전시장을(를) 나타내는 코드', true),
       ('HOT003', 'LS_HOT', '공연관람', '공연관람을(를) 나타내는 코드', true),
       ('HOT004', 'LS_HOT', '미용서비스', '미용서비스을(를) 나타내는 코드', true),
       ('HOT005', 'LS_HOT', '교통서비스', '교통서비스을(를) 나타내는 코드', true),
       ('HOT006', 'LS_HOT', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('HOT007', 'LS_HOT', '패션잡화', '패션잡화을(를) 나타내는 코드', true),
       ('HOT008', 'LS_HOT', '화장품소매', '화장품소매을(를) 나타내는 코드', true),
       ('HOT009', 'LS_HOT', '취미/오락', '취미/오락을(를) 나타내는 코드', true);

-- == LS_SHOP (쇼핑형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('SHOP001', 'LS_SHOP', '인터넷쇼핑', '인터넷쇼핑을(를) 나타내는 코드', true),
       ('SHOP002', 'LS_SHOP', '인테리어', '인테리어을(를) 나타내는 코드', true),
       ('SHOP003', 'LS_SHOP', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('SHOP004', 'LS_SHOP', '종합소매점', '종합소매점을(를) 나타내는 코드', true),
       ('SHOP005', 'LS_SHOP', '패션잡화', '패션잡화을(를) 나타내는 코드', true);

-- == LS_ART (예술가형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('ART001', 'LS_ART', '전시장', '전시장을(를) 나타내는 코드', true),
       ('ART002', 'LS_ART', '공연관람', '공연관람을(를) 나타내는 코드', true),
       ('ART003', 'LS_ART', '인테리어', '인테리어을(를) 나타내는 코드', true),
       ('ART004', 'LS_ART', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('ART005', 'LS_ART', '악기/공예', '악기/공예을(를) 나타내는 코드', true),
       ('ART006', 'LS_ART', '예체능계학원', '예체능계학원을(를) 나타내는 코드', true);

-- == LS_BEAUTY (뷰티형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('BEAUTY001', 'LS_BEAUTY', '미용서비스', '미용서비스을(를) 나타내는 코드', true),
       ('BEAUTY002', 'LS_BEAUTY', '사우나', '사우나을(를) 나타내는 코드', true),
       ('BEAUTY003', 'LS_BEAUTY', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('BEAUTY004', 'LS_BEAUTY', '패션잡화', '패션잡화을(를) 나타내는 코드', true),
       ('BEAUTY005', 'LS_BEAUTY', '화장품소매', '화장품소매을(를) 나타내는 코드', true),
       ('BEAUTY006', 'LS_BEAUTY', '예체능계학원', '예체능계학원을(를) 나타내는 코드', true);

-- == LS_TRAVEL (여행가형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('TRAVEL001', 'LS_TRAVEL', '차량관리/서비스', '차량관리/서비스을(를) 나타내는 코드', true),
       ('TRAVEL002', 'LS_TRAVEL', '교통서비스', '교통서비스을(를) 나타내는 코드', true),
       ('TRAVEL003', 'LS_TRAVEL', '여행', '여행을(를) 나타내는 코드', true),
       ('TRAVEL004', 'LS_TRAVEL', '휴게시설', '휴게시설을(를) 나타내는 코드', true),
       ('TRAVEL005', 'LS_TRAVEL', '숙박', '숙박을(를) 나타내는 코드', true),
       ('TRAVEL006', 'LS_TRAVEL', '취미/오락', '취미/오락을(를) 나타내는 코드', true),
       ('TRAVEL007', 'LS_TRAVEL', '외국어학원', '외국어학원을(를) 나타내는 코드', true);

-- == LS_SELF (자기계발형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('SELF001', 'LS_SELF', '유학대행', '유학대행을(를) 나타내는 코드', true),
       ('SELF002', 'LS_SELF', '악기/공예', '악기/공예을(를) 나타내는 코드', true),
       ('SELF003', 'LS_SELF', '서적/도서', '서적/도서을(를) 나타내는 코드', true),
       ('SELF004', 'LS_SELF', '사무/교육용품', '사무/교육용품을(를) 나타내는 코드', true),
       ('SELF005', 'LS_SELF', '요가/단전/마사지', '요가/단전/마사지을(를) 나타내는 코드', true),
       ('SELF006', 'LS_SELF', '일반스포츠', '일반스포츠을(를) 나타내는 코드', true),
       ('SELF007', 'LS_SELF', '예체능계학원', '예체능계학원을(를) 나타내는 코드', true),
       ('SELF008', 'LS_SELF', '외국어학원', '외국어학원을(를) 나타내는 코드', true),
       ('SELF009', 'LS_SELF', '입시학원', '입시학원을(를) 나타내는 코드', true),
       ('SELF010', 'LS_SELF', '기술/직업교육학원', '기술/직업교육학원을(를) 나타내는 코드', true),
       ('SELF011', 'LS_SELF', '독서실', '독서실을(를) 나타내는 코드', true);

-- == LS_SPORTS (스포츠형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('SPORTS001', 'LS_SPORTS', '경기관람', '경기관람을(를) 나타내는 코드', true),
       ('SPORTS002', 'LS_SPORTS', '의복/의류', '의복/의류을(를) 나타내는 코드', true),
       ('SPORTS003', 'LS_SPORTS', '건강/기호식품', '건강/기호식품을(를) 나타내는 코드', true),
       ('SPORTS004', 'LS_SPORTS', '요가/단전/마사지', '요가/단전/마사지을(를) 나타내는 코드', true),
       ('SPORTS005', 'LS_SPORTS', '일반스포츠', '일반스포츠을(를) 나타내는 코드', true);

-- == LS_HOME (집돌이형) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('HOME001', 'LS_HOME', '인터넷쇼핑', '인터넷쇼핑을(를) 나타내는 코드', true),
       ('HOME002', 'LS_HOME', '인테리어/가정용품', '인테리어/가정용품을(를) 나타내는 코드', true),
       ('HOME003', 'LS_HOME', '인테리어', '인테리어을(를) 나타내는 코드', true),
       ('HOME004', 'LS_HOME', '가정용품', '가정용품을(를) 나타내는 코드', true),
       ('HOME005', 'LS_HOME', '음/식료품소매', '음/식료품소매을(를) 나타내는 코드', true),
       ('HOME006', 'LS_HOME', '종합소매점', '종합소매점을(를) 나타내는 코드', true),
       ('HOME007', 'LS_HOME', '가전제품', '가전제품을(를) 나타내는 코드', true),
       ('HOME008', 'LS_HOME', '음식배달서비스', '음식배달서비스을(를) 나타내는 코드', true);

-- == LS_FOOD (음식) ==
INSERT IGNORE INTO sub_code (SUB_CODE, MAIN_CODE, SUB_CODE_NAME, SUB_CODE_DESCRIPTION, USE_YN)
VALUES ('FOOD001', 'LS_FOOD', '한식', '한식을(를) 나타내는 코드', true),
       ('FOOD002', 'LS_FOOD', '중식', '중식을(를) 나타내는 코드', true),
       ('FOOD003', 'LS_FOOD', '양식', '양식을(를) 나타내는 코드', true),
       ('FOOD004', 'LS_FOOD', '일식', '일식을(를) 나타내는 코드', true),
       ('FOOD005', 'LS_FOOD', '카페/디저트', '카페/디저트을(를) 나타내는 코드', true),
       ('FOOD006', 'LS_FOOD', '베이커리', '베이커리을(를) 나타내는 코드', true);

-- == 유저 ==
INSERT IGNORE INTO users (birth_date, distance, last_sync_at, user_id, gender, nickname, sigungu, email, password, introduction, location)
VALUES
('2000-01-13', 10, '2025-09-15 12:10:51.547212', 1, 'M', '정연', '서울시 동작구', 'kimjeongyeon113@gmail.com', '$2a$10$bPC2VFs.9jIIG5uj5zeH.eyz1ZfWKHnvtYSVvGzmf1foYRuTWSikS', '안녕하세요! 저는 개발과 음악을 좋아합니다.', ST_GeomFromText('POINT (37.593894 127.063466)', 4326)),
('1999-06-18', 5, '2025-09-16 00:06:39.594416', 2, 'F', '아이유', '서울시 강남구', 'user0002@gmail.com', '$2a$10$uJMM7VVI6VHsmb8XaC4d/O9m/O0wDxN5b1KgAygiu33gU8S3/P.He', '안녕하세요.', ST_GeomFromText('POINT (37.593894 127.063466)', 4326)),
('1975-11-19', 10, '2025-09-21 18:17:00.000000', 3, 'M', '나나', '송파구', 'user1@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 나나 입니다.', ST_GeomFromText('POINT (37.593894 127.063466)', 4326)),
('1983-08-14', 1, '2025-09-21 03:09:00.000000', 4, 'M', '태호', '영등포구', 'user2@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 태호 입니다.', ST_GeomFromText('POINT (37.530204 127.094098)', 4326)),
('1980-12-05', 20, '2025-10-02 16:32:00.000000', 5, 'M', '호태', '서초구', 'user3@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 호태 입니다.', ST_GeomFromText('POINT (37.56878 127.094769)', 4326)),
('2002-01-03', 10, '2025-09-26 14:20:00.000000', 6, 'M', '대홍', '노원구', 'user4@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 대홍 입니다.', ST_GeomFromText('POINT (37.535573 127.044667)', 4326)),
('1998-12-28', 7, '2025-10-02 08:38:00.000000', 7, 'M', '민준', '영등포구', 'user5@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 민준 입니다.', ST_GeomFromText('POINT (37.514592 127.054268)', 4326)),
('1978-10-18', 3, '2025-10-01 20:03:00.000000', 8, 'M', '서준', '광진구', 'user6@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 서준 입니다.', ST_GeomFromText('POINT (37.468421 127.065055)', 4326)),
('2003-11-11', 5, '2025-09-26 01:18:00.000000', 9, 'M', '도윤', '송파구', 'user7@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 도윤 입니다.', ST_GeomFromText('POINT (37.512452 127.063953)', 4326)),
('1976-06-07', 10, '2025-09-26 01:51:00.000000', 10, 'M', '예준', '강서구', 'user8@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 예준 입니다.', ST_GeomFromText('POINT (37.563686 127.045382)', 4326)),
('1985-12-26', 7, '2025-09-25 19:01:00.000000', 11, 'M', '하준', '용인시', 'user9@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하준 입니다.', ST_GeomFromText('POINT (37.546607 127.147834)', 4326)),
('1980-11-08', 3, '2025-10-02 06:17:00.000000', 12, 'M', '지호', '용인시', 'user10@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지호 입니다.', ST_GeomFromText('POINT (37.570612 127.08176)', 4326)),
('1996-10-31', 1, '2025-10-01 05:22:00.000000', 13, 'M', '지후', '동작구', 'user11@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지후 입니다.', ST_GeomFromText('POINT (37.58626 127.131319)', 4326)),
('1980-04-13', 3, '2025-09-21 15:11:00.000000', 14, 'M', '준우', '동작구', 'user12@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 준우 입니다.', ST_GeomFromText('POINT (37.574981 127.101203)', 4326)),
('1999-09-23', 20, '2025-09-26 07:57:00.000000', 15, 'M', '시우', '송파구', 'user13@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 시우 입니다.', ST_GeomFromText('POINT (37.486067 127.074147)', 4326)),
('1999-11-27', 7, '2025-09-23 15:01:00.000000', 16, 'M', '유준', '강동구', 'user14@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 유준 입니다.', ST_GeomFromText('POINT (37.453226 127.089165)', 4326)),
('1997-04-20', 20, '2025-10-04 03:59:00.000000', 17, 'M', '윤우', '성동구', 'user15@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 윤우 입니다.', ST_GeomFromText('POINT (37.589106 127.047815)', 4326)),
('2005-11-21', 20, '2025-09-26 18:01:00.000000', 18, 'M', '재윤', '동작구', 'user16@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 재윤 입니다.', ST_GeomFromText('POINT (37.458718 127.045715)', 4326)),
('1993-11-04', 20, '2025-09-27 18:13:00.000000', 19, 'M', '승우', '용인시', 'user17@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 승우 입니다.', ST_GeomFromText('POINT (37.577605 127.008647)', 4326)),
('2001-04-30', 1, '2025-09-19 20:24:00.000000', 20, 'M', '시헌', '동작구', 'user18@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 시헌 입니다.', ST_GeomFromText('POINT (37.498171 127.051518)', 4326)),
('1992-03-18', 1, '2025-10-03 18:01:00.000000', 21, 'M', '선우', '용산구', 'user19@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 선우 입니다.', ST_GeomFromText('POINT (37.476179 127.048297)', 4326)),
('1995-03-18', 10, '2025-09-28 22:59:00.000000', 22, 'M', '현우', '강동구', 'user20@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 현우 입니다.', ST_GeomFromText('POINT (37.62089 127.057726)', 4326)),
('1978-09-15', 3, '2025-10-04 11:33:00.000000', 23, 'M', '정우', '강남구', 'user21@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 정우 입니다.', ST_GeomFromText('POINT (37.545692 127.078174)', 4326)),
('1982-07-17', 3, '2025-09-21 17:02:00.000000', 24, 'M', '태윤', '노원구', 'user22@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 태윤 입니다.', ST_GeomFromText('POINT (37.58107 127.052386)', 4326)),
('2002-01-19', 7, '2025-10-04 10:55:00.000000', 25, 'M', '하진', '서초구', 'user23@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하진 입니다.', ST_GeomFromText('POINT (37.509175 127.084522)', 4326)),
('1994-04-03', 1, '2025-09-30 22:03:00.000000', 26, 'M', '하율', '화성시', 'user24@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하율 입니다.', ST_GeomFromText('POINT (37.596215 127.02416)', 4326)),
('1982-10-09', 7, '2025-09-29 02:59:00.000000', 27, 'M', '지율', '강서구', 'user25@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지율 입니다.', ST_GeomFromText('POINT (37.465873 127.064252)', 4326)),
('1978-11-09', 10, '2025-09-23 17:48:00.000000', 28, 'M', '서윤', '서초구', 'user26@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 서윤 입니다.', ST_GeomFromText('POINT (37.635517 127.085351)', 4326)),
('2000-06-10', 15, '2025-10-01 21:15:00.000000', 29, 'M', '채윤', '강남구', 'user27@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 채윤 입니다.', ST_GeomFromText('POINT (37.459716 127.106305)', 4326)),
('2001-09-17', 1, '2025-09-23 11:27:00.000000', 30, 'M', '서연', '동작구', 'user28@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 서연 입니다.', ST_GeomFromText('POINT (37.507307 127.04597)', 4326)),
('1982-12-08', 3, '2025-09-20 14:45:00.000000', 31, 'M', '하린', '성북구', 'user29@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하린 입니다.', ST_GeomFromText('POINT (37.550474 127.060503)', 4326)),
('1980-12-21', 7, '2025-09-22 13:07:00.000000', 32, 'M', '서현', '광진구', 'user30@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 서현 입니다.', ST_GeomFromText('POINT (37.503182 127.132202)', 4326)),
('1987-08-09', 20, '2025-09-24 21:40:00.000000', 33, 'M', '지우', '송파구', 'user31@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지우 입니다.', ST_GeomFromText('POINT (37.461324 127.023555)', 4326)),
('1997-03-31', 5, '2025-09-24 00:28:00.000000', 34, 'M', '연우', '서초구', 'user32@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 연우 입니다.', ST_GeomFromText('POINT (37.614301 127.136481)', 4326)),
('1993-03-03', 1, '2025-09-25 11:55:00.000000', 35, 'M', '지민', '성동구', 'user33@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지민 입니다.', ST_GeomFromText('POINT (37.466314 127.130365)', 4326)),
('1977-04-28', 1, '2025-09-20 02:24:00.000000', 36, 'M', '수현', '성동구', 'user34@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 수현 입니다.', ST_GeomFromText('POINT (37.524144 127.138319)', 4326)),
('1991-03-26', 7, '2025-09-30 09:04:00.000000', 37, 'M', '유진', '강남구', 'user35@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 유진 입니다.', ST_GeomFromText('POINT (37.491219 127.107664)', 4326)),
('2003-04-17', 5, '2025-09-26 19:35:00.000000', 38, 'M', '민서', '마포구', 'user36@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 민서 입니다.', ST_GeomFromText('POINT (37.543305 127.101049)', 4326)),
('1985-06-23', 20, '2025-10-04 09:25:00.000000', 39, 'M', '수아', '노원구', 'user37@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 수아 입니다.', ST_GeomFromText('POINT (37.463355 127.098005)', 4326)),
('1988-03-24', 20, '2025-09-26 19:23:00.000000', 40, 'M', '다은', '고양시', 'user38@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 다은 입니다.', ST_GeomFromText('POINT (37.470527 127.104975)', 4326)),
('1976-01-20', 15, '2025-09-20 17:41:00.000000', 41, 'M', '채원', '수원시', 'user39@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 채원 입니다.', ST_GeomFromText('POINT (37.553743 127.06388)', 4326)),
('2004-04-27', 15, '2025-09-26 05:21:00.000000', 42, 'M', '가은', '영등포구', 'user40@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 가은 입니다.', ST_GeomFromText('POINT (37.514264 127.12683)', 4326)),
('1975-01-13', 5, '2025-09-23 04:28:00.000000', 43, 'M', '하은', '수원시', 'user41@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하은 입니다.', ST_GeomFromText('POINT (37.49732 127.137525)', 4326)),
('2000-01-15', 3, '2025-09-19 12:02:00.000000', 44, 'M', '유나', '송파구', 'user42@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 유나 입니다.', ST_GeomFromText('POINT (37.550443 127.04705)', 4326)),
('1976-01-15', 15, '2025-10-01 21:17:00.000000', 45, 'M', '예린', '마포구', 'user43@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 예린 입니다.', ST_GeomFromText('POINT (37.49765 127.121169)', 4326)),
('1999-12-23', 5, '2025-09-27 01:49:00.000000', 46, 'M', '소율', '동작구', 'user44@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 소율 입니다.', ST_GeomFromText('POINT (37.646116 127.080926)', 4326)),
('2004-09-16', 1, '2025-09-28 01:30:00.000000', 47, 'M', '지원', '성남시', 'user45@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지원 입니다.', ST_GeomFromText('POINT (37.525037 127.014556)', 4326)),
('2003-08-13', 20, '2025-09-22 02:46:00.000000', 48, 'M', '시윤', '수원시', 'user46@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 시윤 입니다.', ST_GeomFromText('POINT (37.49165 127.066505)', 4326)),
('2005-09-17', 3, '2025-10-01 11:15:00.000000', 49, 'M', '연서', '중구', 'user47@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 연서 입니다.', ST_GeomFromText('POINT (37.58015 127.129819)', 4326)),
('1990-01-22', 20, '2025-10-01 08:31:00.000000', 50, 'M', '민지', '화성시', 'user48@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 민지 입니다.', ST_GeomFromText('POINT (37.46349 127.148955)', 4326)),
('1976-09-05', 1, '2025-09-30 13:16:00.000000', 51, 'M', '다현', '성남시', 'user49@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 다현 입니다.', ST_GeomFromText('POINT (37.565133 127.094459)', 4326)),
('1986-09-13', 1, '2025-09-24 08:25:00.000000', 52, 'M', '은우', '고양시', 'user50@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 은우 입니다.', ST_GeomFromText('POINT (37.646486 127.025218)', 4326)),
('1991-07-04', 1, '2025-09-28 13:21:00.000000', 53, 'F', '윤호', '동작구', 'user51@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 윤호 입니다.', ST_GeomFromText('POINT (37.57641 127.003929)', 4326)),
('1997-01-21', 20, '2025-09-28 02:43:00.000000', 54, 'F', '태민', '강남구', 'user52@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 태민 입니다.', ST_GeomFromText('POINT (37.459179 127.10665)', 4326)),
('1993-08-12', 1, '2025-09-19 21:41:00.000000', 55, 'F', '성민', '강서구', 'user53@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 성민 입니다.', ST_GeomFromText('POINT (37.644846 127.101285)', 4326)),
('2000-07-10', 15, '2025-09-21 14:26:00.000000', 56, 'F', '현서', '성남시', 'user54@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 현서 입니다.', ST_GeomFromText('POINT (37.649596 127.095663)', 4326)),
('1976-07-20', 7, '2025-09-26 02:02:00.000000', 57, 'F', '지성', '노원구', 'user55@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지성 입니다.', ST_GeomFromText('POINT (37.505439 127.080918)', 4326)),
('1997-08-22', 7, '2025-09-30 06:07:00.000000', 58, 'F', '준호', '용인시', 'user56@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 준호 입니다.', ST_GeomFromText('POINT (37.557992 127.085215)', 4326)),
('1979-05-29', 15, '2025-10-02 02:59:00.000000', 59, 'F', '진우', '화성시', 'user57@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 진우 입니다.', ST_GeomFromText('POINT (37.465504 127.133811)', 4326)),
('1998-05-07', 1, '2025-09-30 04:02:00.000000', 60, 'F', '우빈', '수원시', 'user58@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 우빈 입니다.', ST_GeomFromText('POINT (37.561207 127.075084)', 4326)),
('1986-11-08', 1, '2025-10-02 19:06:00.000000', 61, 'F', '세현', '성남시', 'user59@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 세현 입니다.', ST_GeomFromText('POINT (37.489673 127.007814)', 4326)),
('1995-06-02', 1, '2025-10-04 09:51:00.000000', 62, 'F', '재원', '노원구', 'user60@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 재원 입니다.', ST_GeomFromText('POINT (37.544001 127.005881)', 4326)),
('1986-07-21', 3, '2025-09-27 12:33:00.000000', 63, 'F', '하람', '관악구', 'user61@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하람 입니다.', ST_GeomFromText('POINT (37.517109 127.052435)', 4326)),
('1977-04-22', 7, '2025-10-01 08:24:00.000000', 64, 'F', '나연', '성남시', 'user62@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 나연 입니다.', ST_GeomFromText('POINT (37.498444 127.14065)', 4326)),
('1999-11-08', 10, '2025-10-02 22:07:00.000000', 65, 'F', '혜원', '송파구', 'user63@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 혜원 입니다.', ST_GeomFromText('POINT (37.517268 127.049065)', 4326)),
('1991-07-11', 15, '2025-09-29 22:15:00.000000', 66, 'F', '보민', '강동구', 'user64@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 보민 입니다.', ST_GeomFromText('POINT (37.550379 127.12535)', 4326)),
('2004-09-10', 5, '2025-10-01 22:26:00.000000', 67, 'F', '다영', '서초구', 'user65@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 다영 입니다.', ST_GeomFromText('POINT (37.558394 127.087008)', 4326)),
('1976-05-23', 5, '2025-09-24 01:04:00.000000', 68, 'F', '소연', '수원시', 'user66@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 소연 입니다.', ST_GeomFromText('POINT (37.560496 127.075744)', 4326)),
('1978-07-21', 20, '2025-09-23 13:21:00.000000', 69, 'F', '세영', '영등포구', 'user67@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 세영 입니다.', ST_GeomFromText('POINT (37.567336 127.108405)', 4326)),
('1984-09-13', 20, '2025-09-20 02:30:00.000000', 70, 'F', '민혁', '강동구', 'user68@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 민혁 입니다.', ST_GeomFromText('POINT (37.59934 127.116665)', 4326)),
('1977-10-10', 10, '2025-10-03 17:51:00.000000', 71, 'F', '준영', '동작구', 'user69@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 준영 입니다.', ST_GeomFromText('POINT (37.605953 127.035622)', 4326)),
('1999-11-28', 7, '2025-09-22 09:50:00.000000', 72, 'F', '태경', '동작구', 'user70@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 태경 입니다.', ST_GeomFromText('POINT (37.604576 127.103256)', 4326)),
('2003-08-01', 1, '2025-09-20 03:38:00.000000', 73, 'F', '지환', '용인시', 'user71@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지환 입니다.', ST_GeomFromText('POINT (37.451206 127.013111)', 4326)),
('2000-08-02', 15, '2025-09-25 12:20:00.000000', 74, 'F', '지한', '강서구', 'user72@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지한 입니다.', ST_GeomFromText('POINT (37.504035 127.054064)', 4326)),
('1978-03-22', 15, '2025-10-02 18:06:00.000000', 75, 'F', '현진', '서초구', 'user73@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 현진 입니다.', ST_GeomFromText('POINT (37.541254 127.04197)', 4326)),
('2005-04-24', 3, '2025-09-19 19:27:00.000000', 76, 'F', '민호', '성북구', 'user74@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 민호 입니다.', ST_GeomFromText('POINT (37.458684 127.106067)', 4326)),
('1976-07-02', 5, '2025-09-22 17:53:00.000000', 77, 'F', '수민', '강서구', 'user75@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 수민 입니다.', ST_GeomFromText('POINT (37.639424 127.092649)', 4326)),
('1976-06-18', 15, '2025-09-26 21:04:00.000000', 78, 'F', '하람', '고양시', 'user76@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하람 입니다.', ST_GeomFromText('POINT (37.635084 127.049619)', 4326)),
('1976-07-17', 15, '2025-09-27 07:25:00.000000', 79, 'F', '예나', '동작구', 'user77@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 예나 입니다.', ST_GeomFromText('POINT (37.479018 127.102024)', 4326)),
('2002-02-10', 7, '2025-09-25 00:54:00.000000', 80, 'F', '서하', '강남구', 'user78@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 서하 입니다.', ST_GeomFromText('POINT (37.581185 127.060848)', 4326)),
('1984-07-10', 3, '2025-09-25 18:46:00.000000', 81, 'F', '도현', '중구', 'user79@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 도현 입니다.', ST_GeomFromText('POINT (37.529728 127.027733)', 4326)),
('1979-08-22', 7, '2025-10-03 17:51:00.000000', 82, 'F', '예지', '고양시', 'user80@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 예지 입니다.', ST_GeomFromText('POINT (37.62742 127.045095)', 4326)),
('1990-08-20', 5, '2025-09-22 17:43:00.000000', 83, 'F', '채은', '서초구', 'user81@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 채은 입니다.', ST_GeomFromText('POINT (37.563122 127.113511)', 4326)),
('1978-02-16', 20, '2025-09-29 11:25:00.000000', 84, 'F', '다빈', '관악구', 'user82@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 다빈 입니다.', ST_GeomFromText('POINT (37.520195 127.073265)', 4326)),
('2004-05-30', 1, '2025-09-23 14:07:00.000000', 85, 'F', '하율', '강남구', 'user83@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하율 입니다.', ST_GeomFromText('POINT (37.481824 127.136509)', 4326)),
('1987-08-19', 15, '2025-10-01 22:22:00.000000', 86, 'F', '유빈', '관악구', 'user84@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 유빈 입니다.', ST_GeomFromText('POINT (37.614263 127.072169)', 4326)),
('1987-01-28', 5, '2025-09-29 11:37:00.000000', 87, 'F', '하늘', '용산구', 'user85@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 하늘 입니다.', ST_GeomFromText('POINT (37.473791 127.147671)', 4326)),
('1989-04-20', 20, '2025-09-23 11:01:00.000000', 88, 'F', '주희', '강서구', 'user86@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 주희 입니다.', ST_GeomFromText('POINT (37.458123 127.096873)', 4326)),
('1981-04-05', 20, '2025-09-22 01:14:00.000000', 89, 'F', '예솔', '용인시', 'user87@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 예솔 입니다.', ST_GeomFromText('POINT (37.467966 127.097267)', 4326)),
('1998-02-09', 15, '2025-09-30 20:33:00.000000', 90, 'F', '시온', '성남시', 'user88@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 시온 입니다.', ST_GeomFromText('POINT (37.56338 127.143536)', 4326)),
('1989-12-09', 10, '2025-09-21 08:34:00.000000', 91, 'F', '예원', '송파구', 'user89@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 예원 입니다.', ST_GeomFromText('POINT (37.46092 127.076399)', 4326)),
('2005-10-09', 7, '2025-09-20 13:29:00.000000', 92, 'F', '지안', '마포구', 'user90@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 지안 입니다.', ST_GeomFromText('POINT (37.626543 127.137921)', 4326)),
('1986-05-07', 3, '2025-09-25 19:07:00.000000', 93, 'F', '로하', '수원시', 'user91@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 로하 입니다.', ST_GeomFromText('POINT (37.62031 127.019142)', 4326)),
('1992-01-02', 3, '2025-09-23 11:50:00.000000', 94, 'F', '라온', '용산구', 'user92@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 라온 입니다.', ST_GeomFromText('POINT (37.511129 127.137527)', 4326)),
('1979-01-15', 1, '2025-09-22 15:57:00.000000', 95, 'F', '은채', '용인시', 'user93@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 은채 입니다.', ST_GeomFromText('POINT (37.646113 127.126134)', 4326)),
('1999-08-16', 15, '2025-09-28 00:30:00.000000', 96, 'F', '유림', '수원시', 'user94@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 유림 입니다.', ST_GeomFromText('POINT (37.545556 127.092578)', 4326)),
('1992-09-26', 15, '2025-09-21 01:23:00.000000', 97, 'F', '서온', '강동구', 'user95@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 서온 입니다.', ST_GeomFromText('POINT (37.471069 127.094044)', 4326)),
('2004-12-30', 7, '2025-10-01 11:17:00.000000', 98, 'F', '민아', '성동구', 'user96@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 민아 입니다.', ST_GeomFromText('POINT (37.519638 127.13477)', 4326)),
('1994-11-21', 5, '2025-10-01 04:42:00.000000', 99, 'F', '보라', '용인시', 'user97@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 보라 입니다.', ST_GeomFromText('POINT (37.505901 127.103559)', 4326)),
('1996-12-26', 15, '2025-09-19 23:05:00.000000', 100, 'F', '나리', '성북구', 'user98@example.com', '$2b$12$QyeiS9KD1RR06DHsobw7DOc4mgq6Cro1LhKXbqdb5h8id4tAQYD.u', '안녕하세요, 나리 입니다.', ST_GeomFromText('POINT (37.554973 127.08065)', 4326));

INSERT IGNORE INTO user_photos (photo_id, user_id, photo_url, photo_order)
VALUES
    (1, 1, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/1.jpg', 1),
    (2, 2, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/2.jpg', 1),
    (3, 3, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/3.jpg', 1),
    (4, 4, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/4.jpg', 1),
    (5, 5, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/5.jpg', 1),
    (6, 6, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/6.jpg', 1),
    (7, 7, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/7.jpg', 1),
    (8, 8, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/8.jpg', 1),
    (9, 9, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/9.jpg', 1),
    (10, 10, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/10.jpg', 1),
    (11, 11, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/11.jpg', 1),
    (12, 12, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/12.png', 1),
    (13, 13, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/13.jpg', 1),
    (14, 14, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/14.jpg', 1),
    (15, 15, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/15.png', 1),
    (16, 16, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/16.jpg', 1),
    (17, 17, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/17.png', 1),
    (18, 18, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/18.jpg', 1),
    (19, 19, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/19.png', 1),
    (20, 20, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/20.png', 1),
    (21, 21, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/21.png', 1),
    (22, 22, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/22.jpg', 1),
    (23, 23, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/23.jpg', 1),
    (24, 24, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/24.jpg', 1),
    (25, 25, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/25.png', 1),
    (26, 26, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/26.jpg', 1),
    (27, 27, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/27.png', 1),
    (28, 28, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/28.png', 1),
    (29, 29, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/29.png', 1),
    (30, 30, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/30.png', 1),
    (31, 31, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/31.jpg', 1),
    (32, 32, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/32.jpg', 1),
    (33, 33, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/33.png', 1),
    (34, 34, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/34.jpg', 1),
    (35, 35, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/35.png', 1),
    (36, 36, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/36.png', 1),
    (37, 37, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/37.jpg', 1),
    (38, 38, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/38.png', 1),
    (39, 39, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/39.png', 1),
    (40, 40, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/40.jpg', 1),
    (41, 41, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/41.jpg', 1),
    (42, 42, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/42.jpg', 1),
    (43, 43, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/43.jpg', 1),
    (44, 44, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/44.jpg', 1),
    (45, 45, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/45.jpg', 1),
    (46, 46, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/46.jpg', 1),
    (47, 47, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/47.jpg', 1),
    (48, 48, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/48.png', 1),
    (49, 49, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/49.jpg', 1),
    (50, 50, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/50.jpg', 1),
    (51, 51, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/51.jpg', 1),
    (52, 52, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/52.jpg', 1),
    (53, 53, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/53.jpg', 1),
    (54, 54, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/54.jpg', 1),
    (55, 55, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/55.jpg', 1),
    (56, 56, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/56.jpg', 1),
    (57, 57, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/57.jpg', 1),
    (58, 58, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/58.jpg', 1),
    (59, 59, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/59.png', 1),
    (60, 60, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/60.jpg', 1),
    (61, 61, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/61.jpg', 1),
    (62, 62, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/62.jpg', 1),
    (63, 63, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/63.png', 1),
    (64, 64, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/64.webp', 1),
    (65, 65, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/65.webp', 1),
    (66, 66, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/66.webp', 1),
    (67, 67, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/67.webp', 1),
    (68, 68, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/68.jpg', 1),
    (69, 69, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/69.jpg', 1),
    (70, 70, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/70.jpg', 1),
    (71, 71, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/71.png', 1),
    (72, 72, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/72.jpg', 1),
    (73, 73, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/73.jpg', 1),
    (74, 74, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/74.png', 1),
    (75, 75, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/75.jpg', 1),
    (76, 76, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/76.jpg', 1),
    (77, 77, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/77.png', 1),
    (78, 78, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/78.webp', 1),
    (79, 79, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/79.jpg', 1),
    (80, 80, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/80.png', 1),
    (81, 81, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/81.jpg', 1),
    (82, 82, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/82.png', 1),
    (83, 83, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/83.png', 1),
    (84, 84, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/84.png', 1),
    (85, 85, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/85.jpg', 1),
    (86, 86, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/86.png', 1),
    (87, 87, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/87.png', 1),
    (88, 88, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/88.png', 1),
    (89, 89, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/89.jpg', 1),
    (90, 90, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/90.png', 1),
    (91, 91, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/91.png', 1),
    (92, 92, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/92.png', 1),
    (93, 93, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/93.jpg', 1),
    (94, 94, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/94.png', 1),
    (95, 95, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/95.png', 1),
    (96, 96, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/96.png', 1),
    (97, 97, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/97.png', 1),
    (98, 98, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/98.jpg', 1),
    (99, 99, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/99.jpg', 1),
    (100, 100, 'https://j13a408.p.ssafy.io/dev/api/v1/photos/profile/100.jpg', 1);
