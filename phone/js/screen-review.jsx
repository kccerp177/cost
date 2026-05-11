// Review Screen — Step 3: 도면확인
// 공간 목록에서 탭 → 해당 공간 확대 도면 + 바닥·벽별 치수/벽지 편집 화면으로 전환

function ReviewScreen({ state, activeSite, selectedRoomId, onSelectRoom, onToggleExpansion, onUpdateDim, onUpdateRoomMat, onUpdateWall, onUpdateFloor, onToggleRoom, onConfirm }) {
  const T = window.TOKENS;
  const rooms = qcGetCurrentRooms(state);
  const roomEnabled = state.roomEnabled || {};
  const selectedRoom = selectedRoomId ? rooms.find(r => r.id === selectedRoomId) : null;
  const [selectedWall, setSelectedWall] = React.useState(null);

  const enabledCount = rooms.filter(r => roomEnabled[r.id] !== false).length;
  const allEnabled   = enabledCount === rooms.length;
  const toggleAll    = () => {
    rooms.forEach(r => {
      // 모두 켜져있으면 전체 해제, 아니면 전체 선택
      if (allEnabled) { onToggleRoom && onToggleRoom(r.id, false); }
      else            { onToggleRoom && onToggleRoom(r.id, true);  }
    });
  };

  React.useEffect(() => { setSelectedWall(null); }, [selectedRoomId]);

  // 공간 선택 시 → 편집 화면으로 전환
  if (selectedRoom) {
    return (
      <RoomEditView
        room={selectedRoom}
        state={state}
        selectedWall={selectedWall}
        onSelectWall={setSelectedWall}
        onUpdateDim={onUpdateDim}
        onUpdateRoomMat={onUpdateRoomMat}
        onUpdateWall={onUpdateWall}
        onUpdateFloor={onUpdateFloor}
        onBack={() => { onSelectRoom(null); setSelectedWall(null); }}
        onConfirm={onConfirm}
      />
    );
  }

  // 기본: 도면 + 공간 목록
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg, position: 'relative' }}>
      <div style={{ padding: '12px 18px 10px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>도면 확인</div>
        <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>
          {activeSite ? activeSite.name : '개포주공 5단지 · 34평'} · 공간 터치 → 치수·자재 수정
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 80 }}>
        {/* 도면 */}
        <div style={{
          background: '#FAF3E0', borderRadius: 12, border: `1px solid ${T.lineSoft}`,
          height: 280, padding: 6, overflow: 'hidden',
        }}>
          <QcFloorplan
            state={state} selectedRoomId={null} selectedWall={null}
            onSelectRoom={onSelectRoom} highlightExpansion={false}
          />
        </div>

        {/* 공간 목록 */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: `1px solid ${T.lineSoft}`, overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 12px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: T.ink3, letterSpacing: 0.3 }}>
              공간 {rooms.length}개 · <span style={{ color: enabledCount < rooms.length ? T.warn : T.ink3 }}>{enabledCount}개 계산 포함</span>
            </span>
            <button onClick={toggleAll} style={{
              fontSize: 10.5, fontWeight: 700,
              color: allEnabled ? T.ink3 : T.brand.primary,
              background: allEnabled ? T.surfaceAlt : T.brand.primarySoft,
              border: 'none', padding: '3px 9px', borderRadius: 999,
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
            }}>
              {allEnabled ? '전체 해제' : '전체 선택'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${T.lineSoft}` }}>
            {rooms.map(r => (
              <RoomRow
                key={r.id} room={r} selected={false}
                enabled={roomEnabled[r.id] !== false}
                onClick={() => onSelectRoom(r.id)}
                onToggle={() => onToggleRoom && onToggleRoom(r.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 물량 확정 버튼 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px', background: 'rgba(255,255,255,0.96)',
        borderTop: `1px solid ${T.lineSoft}`, backdropFilter: 'blur(8px)',
      }}>
        <button onClick={onConfirm} style={{
          width: '100%', height: 46, borderRadius: 12, border: 'none',
          background: T.brand.primary, color: '#fff',
          fontSize: 14, fontWeight: 700, letterSpacing: -0.2,
          boxShadow: `0 6px 16px ${T.brand.primary}2e`,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="box" size={16} color="#fff" strokeWidth={2.2}/>
          물량 확정하기
        </button>
      </div>
    </div>
  );
}

function RoomRow({ room, selected, enabled, onClick, onToggle }) {
  const T = window.TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      borderBottom: `1px solid ${T.lineSoft}`,
      background: selected ? T.brand.primarySoft : enabled ? '#fff' : '#F9FAFB',
    }}>
      {/* 체크박스 */}
      <div
        onClick={e => { e.stopPropagation(); onToggle && onToggle(); }}
        style={{
          padding: '0 6px 0 12px', minHeight: 46,
          display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
          background: enabled ? T.brand.primary : '#fff',
          border: `2px solid ${enabled ? T.brand.primary : T.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
        }}>
          {enabled && <Icon name="check" size={11} color="#fff" strokeWidth={2.5}/>}
        </div>
      </div>
      {/* 공간 정보 + 이동 버튼 */}
      <button onClick={onClick} style={{
        flex: 1, padding: '10px 12px 10px 6px', border: 'none',
        background: 'transparent',
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
        opacity: enabled ? 1 : 0.45,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: QC_ROOM_COLORS[room.id], flexShrink: 0 }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: selected ? T.brand.primary : T.ink }}>
            {room.name}{room._overridden && <span style={{ fontSize: 10, color: T.warn, marginLeft: 4 }}>✎</span>}
            {!enabled && <span style={{ fontSize: 10, color: T.ink4, marginLeft: 4, fontWeight: 500 }}>(제외)</span>}
          </div>
          <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>
            {room.floor.toFixed(1)}㎡ · {room._wMm}×{room._hMm}mm
          </div>
        </div>
        <Icon name="chevronRight" size={14} color={enabled ? T.ink4 : T.line}/>
      </button>
    </div>
  );
}

// ─── 공간 확대 편집 화면 (전체 화면 전환) ─────────────────────
const WALL_KEYS = [
  { key: 'top',    label: '위' },
  { key: 'right',  label: '우' },
  { key: 'bottom', label: '아래' },
  { key: 'left',   label: '좌' },
];
const WALLPAPER_OPTS = [
  { v: 'silk',  label: '실크벽지' },
  { v: 'hanji', label: '합지벽지' },
  { v: 'paint', label: '페인트' },
  { v: 'tile',  label: '타일' },
];
const FLOOR_OPTS = [
  { v: 'floor_wood',   label: '강마루' },
  { v: 'floor_tile',   label: '타일' },
  { v: 'floor_marble', label: '대리석' },
];

function RoomEditView({ room, state, selectedWall, onSelectWall, onUpdateDim, onUpdateRoomMat, onUpdateWall, onUpdateFloor, onBack, onConfirm }) {
  const T = window.TOKENS;
  const wallOverrides  = (state.wallOverrides  || {})[room.id] || {};
  const floorOverrides = state.floorOverrides  || {};

  // ─── 바닥·벽지 기본값 (욕실=타일, 나머지=실크/강마루) ───
  const isBath          = room.id.startsWith('bath');
  const defaultWallType = isBath ? 'tile' : 'silk';
  const defaultFloorKey = isBath ? 'floor_tile' : 'floor_wood';
  const currentFloor    = floorOverrides[room.id] || defaultFloorKey;

  const defaultLen = (key) => (key === 'top' || key === 'bottom') ? (room._wMm || 0) : (room._hMm || 0);
  const getWallData = (key) => ({
    lengthMm: wallOverrides[key]?.lengthMm ?? defaultLen(key),
    wallpaper: wallOverrides[key]?.wallpaper ?? defaultWallType,
  });

  // ─── 로컬 벽 길이 상태 ──────────────────────────────────
  const [localLen, setLocalLen] = React.useState(() => {
    const o = {};
    WALL_KEYS.forEach(w => { o[w.key] = String(getWallData(w.key).lengthMm); });
    return o;
  });
  React.useEffect(() => {
    const o = {};
    WALL_KEYS.forEach(w => { o[w.key] = String(getWallData(w.key).lengthMm); });
    setLocalLen(o);
  }, [room.id]);

  // ─── 현재 선택된 벽의 벽지 ──────────────────────────────
  const [curWallpaper, setCurWallpaper] = React.useState(
    selectedWall ? getWallData(selectedWall).wallpaper : defaultWallType
  );
  React.useEffect(() => {
    setCurWallpaper(selectedWall ? getWallData(selectedWall).wallpaper : defaultWallType);
  }, [selectedWall, room.id]);

  // ─── 일괄 적용 상태 — 모든 벽 동일 여부 ────────────────
  const allWallTypes = WALL_KEYS.map(w => getWallData(w.key).wallpaper);
  const isUniform    = allWallTypes.every(t => t === allWallTypes[0]);

  // ─── 핸들러 ─────────────────────────────────────────────
  const commitLen = (wallKey) => {
    const n = parseInt(localLen[wallKey], 10);
    if (isNaN(n) || n <= 0) return;
    onUpdateWall && onUpdateWall(room.id, wallKey, { ...getWallData(wallKey), lengthMm: n });
    if (wallKey === 'top' || wallKey === 'bottom') onUpdateDim(room.id, n, room._hMm);
    else onUpdateDim(room.id, room._wMm, n);
  };

  const applyWallpaper = (wallKey, wp) => {
    setCurWallpaper(wp);
    onUpdateWall && onUpdateWall(room.id, wallKey, { ...getWallData(wallKey), wallpaper: wp });
  };

  const applyAll = () => {
    WALL_KEYS.forEach(w => {
      onUpdateWall && onUpdateWall(room.id, w.key, { ...getWallData(w.key), wallpaper: curWallpaper });
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg, position: 'relative' }}>

      {/* 헤더 */}
      <div style={{
        padding: '10px 14px', background: '#fff',
        borderBottom: `1px solid ${T.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onBack} style={{
          width: 34, height: 34, borderRadius: 10, border: 'none',
          background: T.surfaceAlt, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="chevronLeft" size={16} color={T.ink2} strokeWidth={2.2}/>
        </button>
        <div style={{ width: 10, height: 10, borderRadius: 3, background: QC_ROOM_COLORS[room.id], flexShrink: 0 }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>{room.name}</div>
          <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>
            {room.floor.toFixed(1)}㎡ · 바닥·벽 자재 및 치수 수정
          </div>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>

        {/* 확대 도면 */}
        <div style={{ background: '#FAF3E0', borderBottom: `1px solid ${T.lineSoft}`, height: 220 }}>
          <QcFloorplan
            state={state}
            selectedRoomId={room.id}
            selectedWall={selectedWall}
            zoomRoomId={room.id}
            onSelectRoom={() => {}}
            highlightExpansion={false}
          />
        </div>

        <div style={{ padding: '14px 14px 0' }}>

          {/* ── 벽 길이 ───────────────────────────────── */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 9 }}>
              벽 길이 (mm) · 탭하여 수정
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {WALL_KEYS.map(w => {
                const isActive = selectedWall === w.key;
                return (
                  <div
                    key={w.key}
                    onClick={() => onSelectWall(w.key)}
                    style={{
                      padding: '10px 10px 8px', borderRadius: 11, cursor: 'pointer',
                      border: `1.5px solid ${isActive ? '#EF4444' : T.line}`,
                      background: isActive ? '#FEF2F2' : '#fff',
                      transition: 'border-color .15s, background .15s',
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: isActive ? '#EF4444' : T.ink3, marginBottom: 6 }}>
                      {w.label}벽
                    </div>
                    <input
                      type="number" inputMode="numeric"
                      value={localLen[w.key]}
                      onChange={e => setLocalLen(l => ({ ...l, [w.key]: e.target.value }))}
                      onFocus={() => onSelectWall(w.key)}
                      onBlur={() => commitLen(w.key)}
                      onClick={e => e.stopPropagation()}
                      style={{
                        width: '100%', height: 36, padding: '0 10px',
                        borderRadius: 8,
                        border: `1.5px solid ${isActive ? '#EF4444' : T.line}`,
                        background: isActive ? '#fff' : T.surfaceAlt,
                        fontSize: 15, fontWeight: 700, outline: 'none',
                        textAlign: 'right', fontFamily: 'inherit',
                        color: isActive ? '#EF4444' : T.ink,
                        transition: 'border-color .15s',
                      }}
                    />
                    <div style={{ fontSize: 10, color: T.ink4, marginTop: 3, textAlign: 'right' }}>mm</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 벽지 종류 (벽 선택 시 표시) ──────────── */}
          {selectedWall && (
            <div style={{
              background: '#fff', borderRadius: 12, padding: '12px 12px',
              border: `1px solid ${T.lineSoft}`, marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.ink2 }}>
                  {WALL_KEYS.find(w => w.key === selectedWall)?.label}벽 · 벽지 종류
                </div>
                {/* 일괄 적용 버튼 — 균일 여부에 따라 색상 변화 */}
                <button onClick={applyAll} style={{
                  height: 28, padding: '0 11px', borderRadius: 8,
                  border: `1px solid ${isUniform ? '#10B981' : T.brand.primary}55`,
                  background: isUniform ? '#D1FAE5' : T.brand.primarySoft,
                  color: isUniform ? '#10B981' : T.brand.primary,
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Icon name="check" size={11} color={isUniform ? '#10B981' : T.brand.primary} strokeWidth={2.5}/>
                  {isUniform ? '일괄됨' : '일괄 적용'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {WALLPAPER_OPTS.map(wp => {
                  const active = curWallpaper === wp.v;
                  return (
                    <button key={wp.v} onClick={() => applyWallpaper(selectedWall, wp.v)} style={{
                      padding: '7px 14px', borderRadius: 999,
                      background: active ? T.brand.primary : '#fff',
                      color: active ? '#fff' : T.ink2,
                      border: `1px solid ${active ? T.brand.primary : T.line}`,
                      fontSize: 12, fontWeight: active ? 700 : 500,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                    }}>{wp.label}</button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 바닥 종류 ─────────────────────────────── */}
          <div style={{
            background: '#fff', borderRadius: 12, padding: '11px 12px',
            border: `1px solid ${T.lineSoft}`, marginBottom: 12,
          }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink2, marginBottom: 9 }}>
              바닥 종류
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {FLOOR_OPTS.map(fo => {
                const active = currentFloor === fo.v;
                return (
                  <button key={fo.v} onClick={() => onUpdateFloor && onUpdateFloor(room.id, fo.v)} style={{
                    padding: '7px 14px', borderRadius: 999,
                    background: active ? T.brand.accent : '#fff',
                    color: active ? '#fff' : T.ink2,
                    border: `1px solid ${active ? T.brand.accent : T.line}`,
                    fontSize: 12, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                  }}>{fo.label}</button>
                );
              })}
            </div>
          </div>

          {/* ── 예상 소요량 ───────────────────────────── */}
          <div style={{
            background: '#fff', borderRadius: 12, padding: 12,
            border: `1px solid ${T.lineSoft}`, marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 8 }}>
              예상 소요량 · 수량 직접 수정 가능
            </div>
            {(() => {
              const mats = qcCalcMaterialsForRoom(room, state);
              const matEntries = qcSortMaterialEntries(mats);
              return matEntries.length === 0 ? (
                <div style={{ fontSize: 11, color: T.ink4, padding: '4px 0' }}>이 공간에 정의된 자재가 없습니다</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {matEntries.map(([k, m]) => (
                    <MatQtyRow key={k} matKey={k} mat={m} roomId={room.id} onUpdate={onUpdateRoomMat}/>
                  ))}
                </div>
              );
            })()}
          </div>

        </div>
      </div>

      {/* 물량 확정 버튼 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px', background: 'rgba(255,255,255,0.96)',
        borderTop: `1px solid ${T.lineSoft}`, backdropFilter: 'blur(8px)',
      }}>
        <button onClick={onConfirm} style={{
          width: '100%', height: 46, borderRadius: 12, border: 'none',
          background: T.brand.primary, color: '#fff',
          fontSize: 14, fontWeight: 700, letterSpacing: -0.2,
          boxShadow: `0 6px 16px ${T.brand.primary}2e`,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="box" size={16} color="#fff" strokeWidth={2.2}/>
          물량 확정하기
        </button>
      </div>
    </div>
  );
}

function MatQtyRow({ matKey, mat, roomId, onUpdate }) {
  const T = window.TOKENS;
  const [val, setVal] = React.useState(String(mat.qty));
  React.useEffect(() => { setVal(String(mat.qty)); }, [mat.qty]);
  const commit = () => {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 0 && n !== mat.qty) onUpdate(roomId, matKey, n);
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 0', borderBottom: `1px dashed ${T.lineSoft}`,
    }}>
      <span style={{
        fontSize: 9.5, fontWeight: 700, color: T.ink3, background: T.surfaceAlt,
        padding: '2px 6px', borderRadius: 4, flexShrink: 0,
      }}>{QC_CAT_LABEL[mat.cat]}</span>
      <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500 }}>{mat.name}</span>
      <input type="number" value={val} onChange={e => setVal(e.target.value)} onBlur={commit} style={{
        width: 56, height: 30, padding: '0 8px', borderRadius: 7,
        border: `1px solid ${T.line}`, background: '#fff',
        fontSize: 12, fontWeight: 700, outline: 'none', textAlign: 'right',
        fontFamily: 'inherit',
      }}/>
      <span style={{ fontSize: 11, color: T.ink3, width: 24 }}>{mat.unit}</span>
    </div>
  );
}

window.ReviewScreen = ReviewScreen;
