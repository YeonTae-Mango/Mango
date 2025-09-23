// 카테고리 타입 정의
export type CategoryType =
  | 'hotplace'
  | 'shopping'
  | 'artist'
  | 'beauty'
  | 'airport'
  | 'study'
  | 'sports'
  | 'cozyroom';

// 카테고리 정보 인터페이스
export interface CategoryInfo {
  id: CategoryType;
  name: string;
  emoji: string;
  shortDescription: string;
  detailedDescription: string;
  image: string;
  colors: {
    primary: string;
    background: string;
    text: string;
  };
}

// 카테고리 상수
export const CATEGORIES: Record<CategoryType, CategoryInfo> = {
  hotplace: {
    id: 'hotplace',
    name: '핫플형',
    emoji: '🔥',
    shortDescription:
      '새로운 트렌드와 인기 장소를 즐기며, 문화생활과 취미를 활발히 즐기는 유형입니다.',
    detailedDescription:
      "핫플형은 경기관람, 전시, 공연 등 최신 트렌드와 문화생활을 적극적으로 소비하는 사람들입니다. 패션잡화, 미용서비스, 교통서비스 등을 활용해 외출을 즐기며, 취미와 오락 활동에도 적극적입니다. 이들은 새로운 장소를 탐방하고 SNS에 기록하며, '핫플'에 관심이 많은 라이프스타일을 가집니다.",
    image: require('../../assets/images/categoryimg/hotplace.jpg'),
    colors: {
      primary: '#FF5A36',
      background: '#FFF1EC',
      text: '#7A1F0E',
    },
  },
  shopping: {
    id: 'shopping',
    name: '쇼핑형',
    emoji: '🛍️',
    shortDescription:
      '쇼핑을 즐기고 다양한 상품을 찾아보고 구매하는 데 적극적인 유형입니다.',
    detailedDescription:
      '쇼핑형은 인터넷 쇼핑, 인테리어, 의류·패션, 종합 소매점 등을 자주 이용하는 소비자입니다. 이들은 온라인과 오프라인을 가리지 않고 제품을 비교·분석하고, 최신 트렌드 제품이나 인테리어 아이템을 빠르게 찾아 구매하는 특징이 있습니다. 패션잡화나 라이프스타일 아이템에 관심이 많고, 소비를 즐기는 편입니다.',
    image: require('../../assets/images/categoryimg/shopping.jpg'),
    colors: {
      primary: '#00C2A8',
      background: '#E6FFFA',
      text: '#0E4A45',
    },
  },
  artist: {
    id: 'artist',
    name: '예술가형',
    emoji: '🎨',
    shortDescription:
      '예술과 창작 활동에 관심이 많고, 문화적 감수성이 풍부한 유형입니다.',
    detailedDescription:
      '예술가형은 전시회나 공연 관람을 즐기고, 인테리어와 패션, 악기·공예 등 창작 활동에 관심이 있는 사람들입니다. 이들은 예체능계 학원이나 문화센터를 찾아 배우며 자기표현을 중요시합니다. 감각적인 라이프스타일을 추구하며, 창의적이고 예술적인 경험을 통해 삶의 만족을 얻습니다.',
    image: require('../../assets/images/categoryimg/artist.jpg'),
    colors: {
      primary: '#6C5CE7',
      background: '#F3F0FF',
      text: '#2D1F6B',
    },
  },
  beauty: {
    id: 'beauty',
    name: '뷰티형',
    emoji: '💄',
    shortDescription:
      '외모 관리와 뷰티 트렌드에 관심이 많고 꾸준히 자기관리에 투자하는 유형입니다.',
    detailedDescription:
      '뷰티형은 미용실, 피부관리, 사우나, 화장품 구매 등을 즐기며 외모와 건강 관리에 많은 시간을 씁니다. 패션잡화, 의류에도 관심이 많아 스타일링과 자기관리에서 만족을 얻습니다. 예체능계 학원 등을 통해 몸매 관리나 뷰티 관련 교육을 받기도 하며, 자기 표현과 이미지 메이킹에 적극적입니다.',
    image: require('../../assets/images/categoryimg/beauty.jpg'),
    colors: {
      primary: '#E91E63',
      background: '#FFF0F6',
      text: '#6B0B2B',
    },
  },
  airport: {
    id: 'airport',
    name: '여행가형',
    emoji: '✈️',
    shortDescription:
      '국내외 여행과 이동을 즐기며, 다양한 지역의 경험을 추구하는 유형입니다.',
    detailedDescription:
      '여행가형은 교통수단과 차량 관리 서비스를 자주 이용하며, 숙박·휴양 시설을 찾아 여행을 즐깁니다. 외국어 학원에 다니거나 해외여행을 준비하는 등, 새로운 경험과 모험을 추구합니다. 이들은 여가를 적극적으로 활용하고, 취미와 여행을 결합하여 삶을 풍부하게 만듭니다.',
    image: require('../../assets/images/categoryimg/airport.jpg'),
    colors: {
      primary: '#2196F3',
      background: '#EAF5FF',
      text: '#0B3C67',
    },
  },
  study: {
    id: 'study',
    name: '자기계발형',
    emoji: '📚',
    shortDescription: '공부와 학습, 개인의 성장을 위해 투자하는 유형입니다.',
    detailedDescription:
      '자기계발형은 유학, 외국어 학원, 입시·직업 교육 등 학습에 적극적이며, 독서실·서점·교육용품을 자주 이용합니다. 요가, 마사지, 일반 스포츠 등 신체적 건강 관리에도 관심이 많고, 예체능계 학원 등을 통해 새로운 기술을 배우기도 합니다. 자기 성장과 커리어 발전에 큰 가치를 두는 사람들이 많습니다.',
    image: require('../../assets/images/categoryimg/study.jpg'),
    colors: {
      primary: '#4CAF50',
      background: '#EDF7ED',
      text: '#1B5E20',
    },
  },
  sports: {
    id: 'sports',
    name: '스포츠형',
    emoji: '🏃',
    shortDescription:
      '스포츠 관람·참여를 즐기고, 건강 관리에 적극적인 유형입니다.',
    detailedDescription:
      '스포츠형은 경기 관람을 즐기고 직접 운동에도 참여합니다. 일반 스포츠, 요가, 기호식품, 건강관리 제품 등을 자주 소비하며, 활동적인 라이프스타일을 유지합니다. 의류·의료 관련 소비도 활발해 스포츠 웨어나 건강 보조 용품에 투자하는 경향이 있습니다.',
    image: require('../../assets/images/categoryimg/sports.jpg'),
    colors: {
      primary: '#00C853',
      background: '#E9F9EF',
      text: '#0A3D22',
    },
  },
  cozyroom: {
    id: 'cozyroom',
    name: '집돌이형',
    emoji: '🏠',
    shortDescription:
      '집에서 시간을 보내며 온라인 쇼핑, 배달 서비스 등을 즐기는 유형입니다.',
    detailedDescription:
      '집돌이형은 인터넷 쇼핑, 인테리어, 가전제품, 음식 배달 서비스 등 집에서 편리하게 소비할 수 있는 서비스를 선호합니다. 외출보다는 집에서 여유를 즐기고, 집을 꾸미거나 새로운 가전제품·소품을 들이는 데 관심이 많습니다. 집 안에서의 만족도를 높이는 데 소비가 집중되는 편입니다.',
    image: require('../../assets/images/categoryimg/cozyroom.jpg'),
    colors: {
      primary: '#607D8B',
      background: '#F2F7F9',
      text: '#2C3E50',
    },
  },
};

// 카테고리 배열 (순서대로)
export const CATEGORY_LIST: CategoryInfo[] = [
  CATEGORIES.hotplace,
  CATEGORIES.shopping,
  CATEGORIES.artist,
  CATEGORIES.beauty,
  CATEGORIES.airport,
  CATEGORIES.study,
  CATEGORIES.sports,
  CATEGORIES.cozyroom,
];

// 카테고리 ID 배열
export const CATEGORY_IDS: CategoryType[] = [
  'hotplace',
  'shopping',
  'artist',
  'beauty',
  'airport',
  'study',
  'sports',
  'cozyroom',
];

// 카테고리 정보를 ID로 가져오는 헬퍼 함수
export const getCategoryById = (id: CategoryType): CategoryInfo => {
  return CATEGORIES[id];
};

// 모든 카테고리 정보를 가져오는 헬퍼 함수
export const getAllCategories = (): CategoryInfo[] => {
  return CATEGORY_LIST;
};
