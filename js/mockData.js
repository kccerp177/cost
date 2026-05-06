/* ===== 개포주공 5단지 34평 목업 데이터 ===== */

const APARTMENT = {
  name: '개포주공 5단지',
  size: '34평 (112.4㎡)',
  type: '112A',
};

const ROOM_COLORS = {
  living:   '#3B82F6',
  bed1:     '#8B5CF6',
  bed2:     '#A855F7',
  bed3:     '#EC4899',
  kitchen:  '#F59E0B',
  bath1:    '#06B6D4',
  bath2:    '#14B8A6',
  entrance: '#6366F1',
  bal_living: '#93C5FD',
  bal_bed3:   '#F9A8D4',
};

// 기본 공간 데이터 (확장 전)
const BASE_ROOMS = [
  { id: 'living',   name: '거실',         floor: 28.5, wall: 42.3, ceiling: 28.5, perimeter: 22.4, doors: 0, windows: 2 },
  { id: 'bed1',     name: '침실1(안방)',   floor: 14.2, wall: 28.6, ceiling: 14.2, perimeter: 15.2, doors: 1, windows: 1 },
  { id: 'bed2',     name: '침실2',         floor: 10.8, wall: 23.4, ceiling: 10.8, perimeter: 13.2, doors: 1, windows: 1 },
  { id: 'bed3',     name: '침실3(아이방)', floor: 9.2,  wall: 21.0, ceiling: 9.2,  perimeter: 12.4, doors: 1, windows: 1 },
  { id: 'kitchen',  name: '주방',         floor: 8.4,  wall: 18.6, ceiling: 8.4,  perimeter: 11.8, doors: 0, windows: 1 },
  { id: 'bath1',    name: '욕실1(안방)',   floor: 3.8,  wall: 14.2, ceiling: 3.8,  perimeter: 7.8,  doors: 1, windows: 0 },
  { id: 'bath2',    name: '공용욕실',     floor: 4.2,  wall: 15.6, ceiling: 4.2,  perimeter: 8.4,  doors: 1, windows: 0 },
  { id: 'entrance', name: '현관',         floor: 3.2,  wall: 8.4,  ceiling: 3.2,  perimeter: 7.2,  doors: 1, windows: 0 },
];

// 발코니 확장 데이터
const EXPANSIONS = {
  living: { name: '거실 발코니', addFloor: 6.8, addWall: 12.4, addPerimeter: 5.2 },
  bed3:   { name: '침실3 발코니', addFloor: 4.2, addWall: 8.6,  addPerimeter: 3.6 },
};

// 확장 상태
const expansionState = { living: true, bed3: false };

// 인식 결과 요약
const RECOGNITION = [
  { label: '벽체',   count: 24, color: '#64748B' },
  { label: '바닥',   count: 8,  color: '#3B82F6' },
  { label: '천장',   count: 8,  color: '#8B5CF6' },
  { label: '도어',   count: 6,  color: '#F59E0B' },
  { label: '창호',   count: 6,  color: '#06B6D4' },
  { label: '공간',   count: 8,  color: '#10B981' },
];

// 자재 규격 정보
const MATERIAL_SPECS = {
  floor_wood:    { name: '강마루',       unit: '박스', coverage: 1.3,  lossRate: 0.10, category: 'floor' },
  floor_tile:    { name: '바닥타일',     unit: '장',   coverage: 0.09, lossRate: 0.08, category: 'floor' },
  floor_marble:  { name: '대리석(바닥)', unit: '㎡',   coverage: 1.0,  lossRate: 0.05, category: 'floor' },
  wallpaper:     { name: '실크벽지',     unit: '롤',   coverage: 5.3,  lossRate: 0.15, category: 'wall' },
  wall_tile:     { name: '벽타일',       unit: '장',   coverage: 0.09, lossRate: 0.10, category: 'wall' },
  wall_marble:   { name: '대리석(벽)',   unit: '㎡',   coverage: 1.0,  lossRate: 0.05, category: 'wall' },
  wall_paint:    { name: '페인트',       unit: 'L',    coverage: 6.0,  lossRate: 0.10, category: 'wall' },
  ceiling_paper: { name: '천장도배',     unit: '롤',   coverage: 5.3,  lossRate: 0.15, category: 'ceiling' },
  molding:       { name: '천장몰딩',     unit: 'm',    coverage: 1.0,  lossRate: 0.05, category: 'ceiling' },
  baseboard:     { name: '걸레받이',     unit: 'm',    coverage: 1.0,  lossRate: 0.05, category: 'floor' },
  door:          { name: '도어 세트',    unit: '세트', coverage: 1.0,  lossRate: 0,    category: 'fixture' },
  bath_fixture:  { name: '도기/수전',    unit: '세트', coverage: 1.0,  lossRate: 0,    category: 'fixture' },
  bond:          { name: '도배 본드',    unit: '통',   coverage: 25.0, lossRate: 0.10, category: 'etc' },
};

// 공간별 기본 마감재 매핑
const ROOM_FINISH = {
  living:   { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  bed1:     { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  bed2:     { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  bed3:     { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  kitchen:  { floor: 'floor_wood', wall: 'wallpaper', ceiling: 'ceiling_paper' },
  bath1:    { floor: 'floor_tile', wall: 'wall_tile', ceiling: 'ceiling_paper' },
  bath2:    { floor: 'floor_tile', wall: 'wall_tile', ceiling: 'ceiling_paper' },
  entrance: { floor: 'floor_tile', wall: 'wallpaper', ceiling: 'ceiling_paper' },
};

// 마감재 오버라이드 (거실 TV벽, 현관 바닥)
const finishOverrides = {
  living_tv_wall: 'wallpaper',
  entrance_floor: 'floor_tile',
};

// ===== 계산 함수 =====

function getCurrentRooms() {
  return BASE_ROOMS.map(r => {
    const room = { ...r };
    if (r.id === 'living' && expansionState.living) {
      const exp = EXPANSIONS.living;
      room.floor += exp.addFloor;
      room.wall += exp.addWall;
      room.ceiling += exp.addFloor;
      room.perimeter += exp.addPerimeter;
    }
    if (r.id === 'bed3' && expansionState.bed3) {
      const exp = EXPANSIONS.bed3;
      room.floor += exp.addFloor;
      room.wall += exp.addWall;
      room.ceiling += exp.addFloor;
      room.perimeter += exp.addPerimeter;
    }
    return room;
  });
}

function calcMaterials() {
  const rooms = getCurrentRooms();
  const materials = {};

  function addQty(matKey, rawArea) {
    const spec = MATERIAL_SPECS[matKey];
    if (!spec) return;
    if (!materials[matKey]) {
      materials[matKey] = { ...spec, rawQty: 0, qty: 0 };
    }
    const raw = rawArea / spec.coverage;
    materials[matKey].rawQty += raw;
    materials[matKey].qty = Math.ceil(materials[matKey].rawQty * (1 + spec.lossRate));
  }

  rooms.forEach(room => {
    const finish = ROOM_FINISH[room.id];
    if (!finish) return;

    // 바닥
    if (room.id === 'entrance') {
      const fKey = finishOverrides.entrance_floor === 'marble' ? 'floor_marble' :
                   finishOverrides.entrance_floor === 'polished' ? 'floor_tile' : finish.floor;
      addQty(fKey, room.floor);
    } else {
      addQty(finish.floor, room.floor);
    }

    // 벽
    if (room.id === 'living') {
      const tvWallArea = 6.0;
      const restWallArea = room.wall - tvWallArea;
      const tvKey = finishOverrides.living_tv_wall === 'marble' ? 'wall_marble' :
                    finishOverrides.living_tv_wall === 'paint' ? 'wall_paint' : 'wallpaper';
      addQty(tvKey, tvWallArea);
      addQty(finish.wall, restWallArea);
    } else {
      addQty(finish.wall, room.wall);
    }

    // 천장
    addQty(finish.ceiling, room.ceiling);

    // 몰딩 / 걸레받이 (욕실 제외)
    if (!room.id.startsWith('bath')) {
      addQty('molding', room.perimeter);
      const doorWidth = room.doors * 0.9;
      addQty('baseboard', room.perimeter - doorWidth);
    }
  });

  // 도어
  const totalDoors = rooms.reduce((s, r) => s + r.doors, 0);
  addQty('door', totalDoors);

  // 욕실 도기/수전
  const bathCount = rooms.filter(r => r.id.startsWith('bath')).length;
  addQty('bath_fixture', bathCount);

  // 도배 본드
  const totalPaperArea = rooms.reduce((s, r) => {
    const f = ROOM_FINISH[r.id];
    let a = 0;
    if (f && f.wall === 'wallpaper') a += r.wall;
    if (f && f.ceiling === 'ceiling_paper') a += r.ceiling;
    return s + a;
  }, 0);
  addQty('bond', totalPaperArea);

  return materials;
}
