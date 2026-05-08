// Quantity Calculator 데이터 (기존 app.js에서 포팅)

const QC_ROOM_COLORS = {
  living: '#3B82F6', bed1: '#8B5CF6', bed2: '#A855F7', bed3: '#EC4899',
  kitchen: '#F59E0B', bath1: '#06B6D4', bath2: '#14B8A6', entrance: '#6366F1',
};

const QC_BASE_ROOMS = [
  { id: 'living',   name: '거실',         floor: 28.5, wall: 42.3, ceiling: 28.5, perimeter: 22.4, doors: 0, windows: 2 },
  { id: 'bed1',     name: '침실1(안방)',  floor: 14.2, wall: 28.6, ceiling: 14.2, perimeter: 15.2, doors: 1, windows: 1 },
  { id: 'bed2',     name: '침실2',        floor: 10.8, wall: 23.4, ceiling: 10.8, perimeter: 13.2, doors: 1, windows: 1 },
  { id: 'bed3',     name: '침실3(아이방)', floor: 9.2,  wall: 21.0, ceiling: 9.2,  perimeter: 12.4, doors: 1, windows: 1 },
  { id: 'kitchen',  name: '주방',         floor: 8.4,  wall: 18.6, ceiling: 8.4,  perimeter: 11.8, doors: 0, windows: 1 },
  { id: 'bath1',    name: '욕실1(안방)',  floor: 3.8,  wall: 14.2, ceiling: 3.8,  perimeter: 7.8,  doors: 1, windows: 0 },
  { id: 'bath2',    name: '공용욕실',     floor: 4.2,  wall: 15.6, ceiling: 4.2,  perimeter: 8.4,  doors: 1, windows: 0 },
  { id: 'entrance', name: '현관',         floor: 3.2,  wall: 8.4,  ceiling: 3.2,  perimeter: 7.2,  doors: 1, windows: 0 },
];

const QC_EXPANSIONS = {
  living: { addFloor: 6.8, addWall: 12.4, addPerimeter: 5.2 },
  bed3:   { addFloor: 4.2, addWall: 8.6,  addPerimeter: 3.6 },
};

const QC_RECOGNITION = [
  { label: '벽체', count: 24, color: '#64748B' },
  { label: '바닥', count: 8,  color: '#3B82F6' },
  { label: '천장', count: 8,  color: '#8B5CF6' },
  { label: '도어', count: 6,  color: '#F59E0B' },
  { label: '창호', count: 6,  color: '#06B6D4' },
  { label: '공간', count: 8,  color: '#10B981' },
];

const QC_MATERIAL_SPECS = {
  floor_wood:    { name: '강마루',        unit: '박스', coverage: 1.3,  lossRate: 0.10, cat: 'floor'   },
  floor_tile:    { name: '바닥타일',      unit: '장',   coverage: 0.09, lossRate: 0.08, cat: 'floor'   },
  floor_marble:  { name: '대리석(바닥)',  unit: '㎡',   coverage: 1.0,  lossRate: 0.05, cat: 'floor'   },
  wallpaper:     { name: '실크벽지',      unit: '롤',   coverage: 5.3,  lossRate: 0.15, cat: 'wall'    },
  wall_hanji:    { name: '합지벽지',      unit: '롤',   coverage: 5.3,  lossRate: 0.15, cat: 'wall'    },
  wall_tile:     { name: '벽타일',        unit: '장',   coverage: 0.09, lossRate: 0.10, cat: 'wall'    },
  wall_marble:   { name: '대리석(벽)',    unit: '㎡',   coverage: 1.0,  lossRate: 0.05, cat: 'wall'    },
  wall_paint:    { name: '페인트',        unit: 'L',    coverage: 6.0,  lossRate: 0.10, cat: 'wall'    },
  ceiling_paper: { name: '천장도배',      unit: '롤',   coverage: 5.3,  lossRate: 0.15, cat: 'ceiling' },
  molding:       { name: '천장몰딩',      unit: 'm',    coverage: 1.0,  lossRate: 0.05, cat: 'ceiling' },
  baseboard:     { name: '걸레받이',      unit: 'm',    coverage: 1.0,  lossRate: 0.05, cat: 'floor'   },
  door:          { name: '도어 세트',     unit: '세트', coverage: 1.0,  lossRate: 0,    cat: 'fixture' },
  bath_fixture:  { name: '도기/수전',     unit: '세트', coverage: 1.0,  lossRate: 0,    cat: 'fixture' },
  bond:          { name: '도배 본드',     unit: '통',   coverage: 25.0, lossRate: 0.10, cat: 'etc'     },
};

const QC_ROOM_FINISH = {
  living:   { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  bed1:     { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  bed2:     { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  bed3:     { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  kitchen:  { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  bath1:    { floor: 'floor_tile', wall: 'wall_tile', ceiling: 'ceiling_paper' },
  bath2:    { floor: 'floor_tile', wall: 'wall_tile', ceiling: 'ceiling_paper' },
  entrance: { floor: 'floor_tile', wall: 'wallpaper', ceiling: 'ceiling_paper' },
};

const QC_ROOM_DIMS = {
  living:   { wMm: 6270, wMmExp: 7200, hMm: 5100, doors: [],    windows: [1712, 2078] },
  bed1:     { wMm: 4600, hMm: 3600,                 doors: [900], windows: [2078] },
  bed2:     { wMm: 2663, hMm: 3677,                 doors: [900], windows: [2663] },
  bed3:     { wMm: 3028, hMm: 3597, hMmExp: 4000,   doors: [900], windows: [3028] },
  kitchen:  { wMm: 2781, hMm: 3762,                 doors: [],    windows: [] },
  bath1:    { wMm: 1594, hMm: 2341,                 doors: [700], windows: [] },
  bath2:    { wMm: 1678, hMm: 2184,                 doors: [700], windows: [] },
  entrance: { wMm: 2663, hMm: 1762,                 doors: [900], windows: [] },
};

const QC_CAT_LABEL = { floor: '바닥', wall: '벽', ceiling: '천장', fixture: '설비', etc: '부자재' };
const QC_CAT_ORDER = ['floor', 'wall', 'ceiling', 'fixture', 'etc'];

// ─── 현장 Mock 데이터 (8개, 상태 다양) ───────────────────────
// hasQuantity: 산출된 물량 有 → Step 4 점프
// hasDrawing : 도면만 有 → Step 3 점프
// 둘 다 없음 (신규) : 도면 확인으로 이동
// regOrder: 등록 순서 (1=가장 먼저 등록, 숫자 클수록 최근 등록)
const QC_SITES = [
  {
    id: 'st3', name: 'e편한세상 송파 201호', apt: 'e편한세상 송파',
    addr: '서울 송파구 잠실동', size: '32평 (105.8㎡)',
    hasDrawing: true, hasQuantity: true,
    updatedAt: '5일 전', thumb: '#06B6D4', regOrder: 1,
  },
  {
    id: 'st5', name: '반포 아크로리버파크', apt: '아크로리버파크',
    addr: '서울 서초구 반포동', size: '45평 (148.7㎡)',
    hasDrawing: true, hasQuantity: false,
    updatedAt: '3일 전', thumb: '#EC4899', regOrder: 2,
  },
  {
    id: 'st1', name: '개포주공 5단지 · 34평', apt: '개포주공 5단지',
    addr: '서울 강남구 개포동', size: '34평 (112.4㎡)',
    hasDrawing: true, hasQuantity: true,
    updatedAt: '2일 전', thumb: '#3B82F6', regOrder: 3,
  },
  {
    id: 'st2', name: '래미안 퍼스티지 102동', apt: '래미안 퍼스티지',
    addr: '서울 강남구 도곡동', size: '38평 (125.6㎡)',
    hasDrawing: true, hasQuantity: false,
    updatedAt: '어제', thumb: '#8B5CF6', regOrder: 4,
  },
  {
    id: 'st4', name: '자이 방배 304호', apt: '자이 방배',
    addr: '서울 서초구 방배동', size: '28평 (92.3㎡)',
    hasDrawing: false, hasQuantity: false,
    updatedAt: '오늘 등록', thumb: '#F59E0B', regOrder: 5,
  },
  {
    id: 'st6', name: '힐스테이트 마포 501호', apt: '힐스테이트 마포',
    addr: '서울 마포구 아현동', size: '30평 (99.1㎡)',
    hasDrawing: true, hasQuantity: true,
    updatedAt: '오늘 등록', thumb: '#10B981', regOrder: 6,
  },
  {
    id: 'st7', name: '롯데캐슬 강동 302호', apt: '롯데캐슬 강동',
    addr: '서울 강동구 암사동', size: '33평 (109.0㎡)',
    hasDrawing: true, hasQuantity: false,
    updatedAt: '오늘 등록', thumb: '#F97316', regOrder: 7,
  },
  {
    id: 'st8', name: '푸르지오 수원 1402호', apt: '푸르지오 수원',
    addr: '경기 수원시 권선구', size: '25평 (82.6㎡)',
    hasDrawing: false, hasQuantity: false,
    updatedAt: '방금 등록', thumb: '#6366F1', regOrder: 8,
  },
];

Object.assign(window, {
  QC_ROOM_COLORS, QC_BASE_ROOMS, QC_EXPANSIONS, QC_RECOGNITION,
  QC_MATERIAL_SPECS, QC_ROOM_FINISH, QC_ROOM_DIMS,
  QC_CAT_LABEL, QC_CAT_ORDER, QC_SITES,
});
