export type PlantType = 'sunflower' | 'tulip' | 'cactus' | 'clover' | 'tomato';

export interface PlantMeta {
  id: PlantType;
  name: string;
  emoji: string;
  scientificName: string;
  tagline: string;
  description: string;
  themeColor: string;
  lightBg: string;
  growthStory: {
    stage0: string;
    stage1: string;
    stage2: string;
    stage3: string;
    stage4: string;
    stage5: string;
  };
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  order: number;
}

export interface GardenRecord {
  date: string; // YYYY-MM-DD
  plantType: PlantType;
  totalCount: number;
  completedCount: number;
  growthPercent: number;
  completedAt: string;
  tasksSummary: string[];
}

export interface DailyData {
  todos: TodoItem[];
  plantType: PlantType;
  savedToGarden?: boolean;
}

export type ViewTab = 'today' | 'garden' | 'encyclopedia' | 'history';

export const PLANT_DEFINITIONS: Record<PlantType, PlantMeta> = {
  sunflower: {
    id: 'sunflower',
    name: '해바라기',
    emoji: '🌻',
    scientificName: 'Helianthus annuus',
    tagline: '태양을 향해 활짝 피어나는 황금빛 꽃',
    description: '작은 씨앗에서 튼튼한 줄기가 뻗어나와 마침내 커다란 태양처럼 따스한 황금빛 꽃을 활짝 피웁니다. 밝고 긍정적인 에너지를 전해줘요.',
    themeColor: '#EAB308',
    lightBg: '#FEF9C3',
    growthStory: {
      stage0: '흙 속에 단단한 해바라기 씨앗이 꿈꾸고 있어요.',
      stage1: '햇살을 받아 앙증맞은 연둣빛 떡잎이 쏙 고개를 내밀었어요.',
      stage2: '줄기가 꼿꼿해지고 톱니 모양의 본잎이 자라나기 시작했어요.',
      stage3: '키가 훌쩍 자라고 줄기 끝에 싱그러운 꽃망울이 맺혔어요.',
      stage4: '노란 꽃잎이 한 잎 두 잎 펼쳐지며 만개를 준비해요.',
      stage5: '찬란한 햇살 속에서 커다란 황금빛 해바라기가 활짝 피었습니다!'
    }
  },
  tulip: {
    id: 'tulip',
    name: '튤립',
    emoji: '🌷',
    scientificName: 'Tulipa gesneriana',
    tagline: '단아하고 우아한 봄의 전령사',
    description: '둥근 구근에서 부드러운 곡선의 잎이 솟아나며, 매혹적인 분홍빛 꽃잎이 우아하게 피어납니다. 사랑과 감사의 마음을 담고 있어요.',
    themeColor: '#EC4899',
    lightBg: '#FCE7F3',
    growthStory: {
      stage0: '영양을 품은 둥근 구근이 흙 속에서 조용히 숨 쉬고 있어요.',
      stage1: '연한 초록빛 새싹이 힘차게 흙을 밀어올렸어요.',
      stage2: '부드럽게 휘어지는 아름다운 튤립 잎 두 장이 생겼어요.',
      stage3: '줄기가 길게 자라나고 봉긋한 꽃봉오리가 솟아올랐어요.',
      stage4: '꽃봉오리가 분홍빛으로 물들며 은은한 향기를 머금었어요.',
      stage5: '우아하고 사랑스러운 분홍빛 튤립이 찬란하게 만개했어요!'
    }
  },
  cactus: {
    id: 'cactus',
    name: '선인장',
    emoji: '🌵',
    scientificName: 'Carnegiea gigantea',
    tagline: '어떤 환경에서도 꿋꿋하게 피어나는 끈기',
    description: '작고 통통한 새싹에서 시작해 단단한 가시와 귀여운 가지를 만들고, 마침내 정수리에 화사한 사막의 꽃을 피워내는 강인한 친구입니다.',
    themeColor: '#059669',
    lightBg: '#D1FAE5',
    growthStory: {
      stage0: '작은 선인장 씨앗이 고운 모래흙 속에 자리 잡았어요.',
      stage1: '동글동글하고 귀여운 아기 선인장이 살포시 올라왔어요.',
      stage2: '세로 줄무늬와 부드러운 별 모양 가시가 돋아났어요.',
      stage3: '양옆으로 앙증맞은 아기 가지들이 자라나기 시작했어요.',
      stage4: '선인장 꼭대기에 작고 영롱한 꽃망울이 맺혔어요.',
      stage5: '머리 위에 화사한 분홍빛 꽃을 피운 씩씩한 선인장 완성!'
    }
  },
  clover: {
    id: 'clover',
    name: '네잎클로버',
    emoji: '🍀',
    scientificName: 'Trifolium repens',
    tagline: '당신에게 찾아온 행운과 희망의 상징',
    description: '조그만 풀잎에서 시작해 세 잎을 거쳐, 오직 정성으로 피워낸 신비로운 네 번째 잎이 기적과 행운을 가져다줍니다.',
    themeColor: '#16A34A',
    lightBg: '#DCFCE7',
    growthStory: {
      stage0: '행운의 기운을 품은 씨앗이 촉촉한 이끼 흙에 심어졌어요.',
      stage1: '두 장의 앙증맞은 하트 모양 아기 잎이 돋아났어요.',
      stage2: '행복을 상징하는 세 잎 클로버가 예쁘게 자리 잡았어요.',
      stage3: '줄기 주변으로 잎이 풍성해지며 네 번째 잎망울이 자라나요.',
      stage4: '드디어 네 번째 잎이 펼쳐지며 행운의 형태를 갖췄어요.',
      stage5: '싱그러운 네 잎과 하얀 클로버 꽃이 빛나는 행운의 네잎클로버 완성!'
    }
  },
  tomato: {
    id: 'tomato',
    name: '방울토마토',
    emoji: '🍅',
    scientificName: 'Solanum lycopersicum',
    tagline: '노력의 결실을 맺는 싱그럽고 달콤한 열매',
    description: '작은 묘목에서 노란 별 모양 꽃이 피고, 주렁주렁 탐스러운 붉은 열매가 익어가는 수확의 기쁨을 선사합니다.',
    themeColor: '#EA580C',
    lightBg: '#FFEDD5',
    growthStory: {
      stage0: '단단하고 생명력 넘치는 토마토 씨앗이 심어졌어요.',
      stage1: '가느다란 줄기 끝에 싱그러운 떡잎이 활짝 펼쳐졌어요.',
      stage2: '토마토 특유의 톱니 잎이 자라며 튼튼한 줄기가 섰어요.',
      stage3: '줄기를 타고 노란 별 모양의 작고 귀여운 꽃들이 피어났어요.',
      stage4: '꽃이 진 자리에 동글동글 초록색 아기 토마토가 맺혔어요.',
      stage5: '따스한 햇살을 받아 탐스럽고 달콤하게 익은 빨간 토마토 수확!'
    }
  }
};

export const ENCOURAGING_MESSAGES = [
  '작은 실천이 모여 큰 성장을 만들어요!',
  '오늘도 한 걸음씩 성장하는 중이에요!',
  '하나씩 완료하다 보면 어느새 꽃이 활짝 필 거예요!',
  '당신의 정원이 조금씩 자라고 있어요!',
  '오늘 하루도 나만의 속도로 정성껏 가꿔보아요.',
  '오늘 심은 작은 노력이 내일의 멋진 열매가 됩니다.',
  '조급해하지 않아도 괜찮아요, 꽃은 때가 되면 피어나요.',
  '정성 어린 물주기처럼 할 일을 하나씩 체크해보세요!'
];

export const STAGE_MESSAGES = [
  '오늘의 씨앗을 정원에 심어볼까요?',
  '작은 새싹이 파릇파릇 돋아났어요!',
  '줄기와 잎이 조금씩 튼튼하게 자라고 있어요!',
  '잎이 무성해지고 꽃망울이 맺히고 있어요!',
  '꽃이 피고 열매가 맺힐 날이 정말 가까워요!',
  '축하해요! 오늘의 정원에 멋진 식물이 활짝 피었어요!'
];
