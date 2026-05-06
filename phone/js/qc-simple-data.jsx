// 단순계산 모드 데이터
// 천장 높이 표준 2.4m 가정

const SIMPLE_CEILING_H = 2.4; // m

const SIMPLE_ROOMS = [
  { id: 'living',   name: '거실',  allowDimMode: false },  // 거실은 면적만
  { id: 'bedroom',  name: '침실',  allowDimMode: true  },
  { id: 'kitchen',  name: '주방',  allowDimMode: true  },
  { id: 'bath',     name: '욕실',  allowDimMode: true  },
  { id: 'entrance', name: '현관',  allowDimMode: true  },
];

// 공간별 자재 구성: 욕실/현관은 바닥재 타일
const SIMPLE_ROOM_FINISH = {
  living:   ['floor_wood', 'wallpaper', 'ceiling_paper', 'molding', 'baseboard'],
  bedroom:  ['floor_wood', 'wallpaper', 'ceiling_paper', 'molding', 'baseboard'],
  kitchen:  ['floor_wood', 'wallpaper', 'ceiling_paper', 'molding', 'baseboard'],
  bath:     ['floor_tile', 'wall_tile', 'ceiling_paper', 'bath_fixture'],
  entrance: ['floor_tile', 'wallpaper', 'ceiling_paper', 'molding', 'baseboard', 'door'],
};

// 산정근거 텍스트 — 사용 자재 규격
const SIMPLE_MATERIAL_BASIS = {
  floor_wood:    '강마루 195 × 1200mm 사용',
  floor_tile:    '바닥타일 300 × 300mm 사용',
  wallpaper:     '실크벽지 폭 1060mm × 길이 15.6m / 롤',
  wall_tile:     '벽타일 300 × 600mm 사용',
  ceiling_paper: '합지벽지 폭 930mm × 길이 12.5m / 롤',
  molding:       '천장몰딩 2400mm / 본',
  baseboard:     '걸레받이 2400mm / 본',
  bath_fixture:  '욕실 1세트 (양변기 · 세면기 · 수전 · 악세서리)',
  door:          '현관도어 1세트 (도어 · 도어틀 · 손잡이)',
};

// 자재별 어떤 면적을 쓰는지: floor / wall / ceiling / perimeter / fixture
const SIMPLE_MATERIAL_AREA_TYPE = {
  floor_wood: 'floor', floor_tile: 'floor',
  wallpaper: 'wall',   wall_tile: 'wall',
  ceiling_paper: 'ceiling',
  molding: 'perimeter', baseboard: 'perimeter_door',
  bath_fixture: 'fixture', door: 'fixture',
};

Object.assign(window, {
  SIMPLE_CEILING_H, SIMPLE_ROOMS, SIMPLE_ROOM_FINISH,
  SIMPLE_MATERIAL_BASIS, SIMPLE_MATERIAL_AREA_TYPE,
});
