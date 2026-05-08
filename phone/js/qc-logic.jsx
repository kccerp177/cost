// Quantity Calculator 로직 — 기존 app.js 계산 로직 + mm 수정 시 면적 재계산

// state 초기화
function qcCreateInitialState() {
  return {
    expansionState: { living: true, bed3: false },
    dimOverrides:    {}, // { roomId: { wMm, hMm } }
    finishOverrides: { living_tv_wall: 'wallpaper', entrance_floor: 'floor_tile' },
    matOverrides:    {}, // Step 4 전체 자재 수량 오버라이드
    roomMatOverrides: {}, // Step 3 공간별 수량 오버라이드 { roomId: { matKey: qty } }
    wallOverrides:   {}, // 공간별 벽 오버라이드 { roomId: { top/right/bottom/left: { lengthMm, wallpaper } } }
    floorOverrides:  {}, // 공간별 바닥 자재 오버라이드 { roomId: 'floor_wood'|'floor_tile'|'floor_marble' }
  };
}

// 발코니 확장 + 치수 오버라이드 반영한 공간 리스트
function qcGetCurrentRooms(state) {
  const expansionState  = state.expansionState  || {};
  const dimOverrides    = state.dimOverrides    || {};

  return QC_BASE_ROOMS.map(r => {
    let room = Object.assign({}, r);

    // 1) 발코니 확장 반영 (기존 로직)
    if (r.id === 'living' && expansionState.living) {
      const e = QC_EXPANSIONS.living;
      room.floor     += e.addFloor;
      room.wall      += e.addWall;
      room.ceiling   += e.addFloor;
      room.perimeter += e.addPerimeter;
    }
    if (r.id === 'bed3' && expansionState.bed3) {
      const e2 = QC_EXPANSIONS.bed3;
      room.floor     += e2.addFloor;
      room.wall      += e2.addWall;
      room.ceiling   += e2.addFloor;
      room.perimeter += e2.addPerimeter;
    }

    // 2) 치수 오버라이드 반영 → 면적 비율 재계산
    const ov = dimOverrides[r.id];
    if (ov && ov.wMm && ov.hMm) {
      const baseDim = QC_ROOM_DIMS[r.id];
      if (baseDim) {
        const baseW = (r.id === 'living' && expansionState.living && baseDim.wMmExp) ? baseDim.wMmExp : baseDim.wMm;
        const baseH = (r.id === 'bed3'   && expansionState.bed3   && baseDim.hMmExp) ? baseDim.hMmExp : baseDim.hMm;
        const scaleFloor = (ov.wMm * ov.hMm) / (baseW * baseH);
        const scalePeri  = (ov.wMm + ov.hMm) * 2 / ((baseW + baseH) * 2);
        room.floor     = room.floor     * scaleFloor;
        room.ceiling   = room.ceiling   * scaleFloor;
        room.wall      = room.wall      * scalePeri;   // 벽면적은 둘레 × 높이와 비례
        room.perimeter = room.perimeter * scalePeri;
        room._wMm = ov.wMm; room._hMm = ov.hMm;
        room._overridden = true;
      }
    } else {
      const bd = QC_ROOM_DIMS[r.id];
      if (bd) {
        room._wMm = (r.id === 'living' && expansionState.living && bd.wMmExp) ? bd.wMmExp : bd.wMm;
        room._hMm = (r.id === 'bed3'   && expansionState.bed3   && bd.hMmExp) ? bd.hMmExp : bd.hMm;
      }
    }
    return room;
  });
}

// wallpaper 옵션 값 → 자재 키 변환
const QC_WALLPAPER_MAT = { silk: 'wallpaper', hanji: 'wall_hanji', paint: 'wall_paint', tile: 'wall_tile' };

// 개별 공간 자재 계산
function qcCalcMaterialsForRoom(room, state) {
  const finishOv  = state.finishOverrides  || {};
  const roomMatOv = (state.roomMatOverrides || {})[room.id] || {};
  const floorOv   = state.floorOverrides   || {};
  const wallOv    = (state.wallOverrides   || {})[room.id] || {};
  const f = QC_ROOM_FINISH[room.id];
  const mats = {};

  function add(k, area) {
    const s = QC_MATERIAL_SPECS[k];
    if (!s) return;
    if (!mats[k]) mats[k] = Object.assign({}, s, { rawQty: 0, qty: 0 });
    mats[k].rawQty += area / s.coverage;
    mats[k].qty = Math.ceil(mats[k].rawQty * (1 + s.lossRate));
  }

  if (!f) return mats;

  // ─── 바닥 — floorOverrides 우선 ────────────────────────
  const defaultFloor = room.id.startsWith('bath') ? 'floor_tile' : f.floor;
  add(floorOv[room.id] || defaultFloor, room.floor);

  // ─── 벽 — wallOverrides wallpaper 타입 기반 ────────────
  const defaultWallType = room.id.startsWith('bath') ? 'tile' : 'silk';
  const wks = ['top', 'right', 'bottom', 'left'];
  const wallTypes = wks.map(wk => wallOv[wk]?.wallpaper || defaultWallType);
  const allSame   = wallTypes.every(t => t === wallTypes[0]);

  if (allSame) {
    const matKey = QC_WALLPAPER_MAT[wallTypes[0]] || f.wall;
    if (room.id === 'living') {
      const tvA = 6.0;
      const tk = finishOv.living_tv_wall === 'marble' ? 'wall_marble'
               : finishOv.living_tv_wall === 'paint'  ? 'wall_paint'
               : matKey;
      add(tk, tvA);
      add(matKey, room.wall - tvA);
    } else {
      add(matKey, room.wall);
    }
  } else {
    // 벽별 다른 타입 → 각 벽 길이 비례로 면적 배분
    const CEIL_H = 2.4;
    const lens = wks.map(wk =>
      (wallOv[wk]?.lengthMm || ((wk === 'top' || wk === 'bottom') ? (room._wMm || 0) : (room._hMm || 0))) / 1000
    );
    const totalLen = lens.reduce((s, l) => s + l, 0);
    wks.forEach((wk, i) => {
      const area = totalLen > 0 ? (lens[i] / totalLen) * room.wall : 0;
      add(QC_WALLPAPER_MAT[wallTypes[i]] || f.wall, area);
    });
  }

  // ─── 천장 ──────────────────────────────────────────────
  add(f.ceiling, room.ceiling);

  // ─── 부자재 ────────────────────────────────────────────
  if (!room.id.startsWith('bath')) {
    add('molding', room.perimeter);
    add('baseboard', room.perimeter - room.doors * 0.9);
  }
  if (room.doors > 0) add('door', room.doors);
  if (room.id.startsWith('bath')) add('bath_fixture', 1);

  // 공간별 수량 오버라이드 적용
  Object.keys(roomMatOv).forEach(k => {
    if (mats[k]) mats[k].qty = roomMatOv[k];
  });
  return mats;
}

// 전체 자재 계산
function qcCalcMaterials(state) {
  const rooms = qcGetCurrentRooms(state);
  const finishOv = state.finishOverrides || {};
  const matOv = state.matOverrides || {};
  const mats = {};

  function add(k, area) {
    const s = QC_MATERIAL_SPECS[k];
    if (!s) return;
    if (!mats[k]) mats[k] = Object.assign({}, s, { rawQty: 0, qty: 0 });
    mats[k].rawQty += area / s.coverage;
    mats[k].qty = Math.ceil(mats[k].rawQty * (1 + s.lossRate));
  }

  rooms.forEach(room => {
    const f = QC_ROOM_FINISH[room.id];
    if (!f) return;

    if (room.id === 'entrance') {
      const fk = finishOv.entrance_floor === 'marble' ? 'floor_marble' : 'floor_tile';
      add(fk, room.floor);
    } else {
      add(f.floor, room.floor);
    }
    if (room.id === 'living') {
      const tvA = 6.0;
      const restA = room.wall - tvA;
      const tk = finishOv.living_tv_wall === 'marble' ? 'wall_marble'
               : finishOv.living_tv_wall === 'paint'  ? 'wall_paint'
               : 'wallpaper';
      add(tk, tvA);
      add(f.wall, restA);
    } else {
      add(f.wall, room.wall);
    }
    add(f.ceiling, room.ceiling);
    if (room.id.indexOf('bath') !== 0) {
      add('molding', room.perimeter);
      add('baseboard', room.perimeter - room.doors * 0.9);
    }
  });

  add('door', rooms.reduce((s, r) => s + r.doors, 0));
  add('bath_fixture', rooms.filter(r => r.id.indexOf('bath') === 0).length);

  const paperArea = rooms.reduce((s, r) => {
    const f = QC_ROOM_FINISH[r.id];
    let a = 0;
    if (f && f.wall === 'wallpaper')      a += r.wall;
    if (f && f.ceiling === 'ceiling_paper') a += r.ceiling;
    return s + a;
  }, 0);
  add('bond', paperArea);

  // Step 4 전체 자재 수량 오버라이드
  Object.keys(matOv).forEach(k => {
    if (mats[k]) mats[k].qty = matOv[k];
  });

  return mats;
}

// 자재 엔트리 정렬 (카테고리 순)
function qcSortMaterialEntries(mats) {
  return Object.entries(mats).sort((a, b) => {
    const oa = QC_CAT_ORDER.indexOf(a[1].cat);
    const ob = QC_CAT_ORDER.indexOf(b[1].cat);
    return oa - ob;
  });
}

Object.assign(window, {
  qcCreateInitialState, qcGetCurrentRooms,
  qcCalcMaterialsForRoom, qcCalcMaterials, qcSortMaterialEntries,
  QC_WALLPAPER_MAT,
});
