// Tablet Review Tab — 도면확인 (2컬럼)
// 좌측: 도면 크게
// 우측: 선택 공간 편집 (바닥 종류 + 벽별 치수+벽지) + 공간 목록

const TAB_WALL_KEYS = [
  { key: 'top',    label: '위' },
  { key: 'right',  label: '우' },
  { key: 'bottom', label: '아래' },
  { key: 'left',   label: '좌' },
];
const TAB_WALLPAPER_OPTS = [
  { v: 'silk',  label: '실크벽지' },
  { v: 'hanji', label: '합지벽지' },
  { v: 'paint', label: '페인트' },
  { v: 'tile',  label: '타일' },
];
const TAB_FLOOR_OPTS = [
  { v: 'floor_wood',   label: '강마루' },
  { v: 'floor_tile',   label: '타일' },
  { v: 'floor_marble', label: '대리석' },
];

function TabReview({ state, activeSite, selectedRoomId, onSelectRoom, onToggleExpansion, onUpdateDim, onUpdateRoomMat, onUpdateWall, onUpdateFloor, onConfirm }) {
  const T = window.TOKENS;
  const rooms = qcGetCurrentRooms(state);
  const selectedRoom = selectedRoomId ? rooms.find(r => r.id === selectedRoomId) : null;
  const [selectedWall, setSelectedWall] = React.useState(null);

  React.useEffect(() => { setSelectedWall(null); }, [selectedRoomId]);

  const handleSelectRoom = (id) => {
    onSelectRoom(id);
    setSelectedWall(null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, background: T.bg }}>
      {/* 좌측: 도면 */}
      <div style={{ flex: 1.6, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
        {/* 헤더 */}
        <div style={{
          background: '#fff', borderRadius: 12, padding: '10px 14px',
          border: `1px solid ${T.lineSoft}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink2 }}>
            {activeSite ? activeSite.name : '도면 확인'} · 공간 {rooms.length}개
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 11, color: T.ink4 }}>공간 클릭 → 우측에서 편집</div>
        </div>

        {/* 도면 크게 */}
        <div style={{
          flex: 1, background: '#FAF3E0', borderRadius: 14,
          border: `1px solid ${T.lineSoft}`, padding: 8, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <QcFloorplan
            state={state}
            selectedRoomId={selectedRoomId}
            selectedWall={selectedWall}
            onSelectRoom={handleSelectRoom}
            highlightExpansion={false}
          />
        </div>
      </div>

      {/* 우측: 편집 패널 */}
      <div style={{
        flex: 1, minWidth: 0, padding: '16px 16px 16px 0',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* 편집 카드 */}
        {selectedRoom ? (
          <WallEditCard
            room={selectedRoom}
            state={state}
            selectedWall={selectedWall}
            onSelectWall={setSelectedWall}
            onUpdateDim={onUpdateDim}
            onUpdateWall={onUpdateWall}
            onUpdateFloor={onUpdateFloor}
            onClose={() => handleSelectRoom(null)}
          />
        ) : (
          <div style={{
            background: T.surfaceAlt, borderRadius: 12, padding: '20px 14px',
            border: `1px dashed ${T.line}`, textAlign: 'center',
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink3, marginBottom: 3 }}>편집할 공간을 선택하세요</div>
            <div style={{ fontSize: 10.5, color: T.ink4 }}>좌측 도면 또는 아래 목록에서 클릭</div>
          </div>
        )}

        {/* 예상 소요량 */}
        {selectedRoom && (
          <RoomMatCard room={selectedRoom} state={state} onUpdate={onUpdateRoomMat}/>
        )}

        {/* 공간 목록 */}
        <div style={{
          flex: 1, background: '#fff', borderRadius: 12,
          border: `1px solid ${T.lineSoft}`, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <div style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, borderBottom: `1px solid ${T.lineSoft}` }}>
            공간 목록 · 면적 · 치수 (mm)
          </div>
          <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto' }}>
            {rooms.map(r => (
              <button key={r.id} onClick={() => handleSelectRoom(r.id)} style={{
                width: '100%', padding: '9px 12px', border: 'none',
                background: selectedRoomId === r.id ? T.brand.primarySoft : '#fff',
                borderBottom: `1px solid ${T.lineSoft}`,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: QC_ROOM_COLORS[r.id], flexShrink: 0 }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: selectedRoomId === r.id ? T.brand.primary : T.ink }}>
                    {r.name}{r._overridden && <span style={{ fontSize: 10, color: T.warn, marginLeft: 4 }}>✎</span>}
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: T.ink3, textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>{r.floor.toFixed(1)}㎡</div>
                  <div>{r._wMm}×{r._hMm}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 벽별 편집 카드 (태블릿 우측 패널) ─────────────────────
function WallEditCard({ room, state, selectedWall, onSelectWall, onUpdateDim, onUpdateWall, onUpdateFloor, onClose }) {
  const T = window.TOKENS;
  const wallOverrides  = (state.wallOverrides  || {})[room.id] || {};
  const floorOverrides = state.floorOverrides  || {};

  const isBath          = room.id.startsWith('bath');
  const defaultWallType = isBath ? 'tile' : 'silk';
  const defaultFloorKey = isBath ? 'floor_tile' : 'floor_wood';
  const currentFloor    = floorOverrides[room.id] || defaultFloorKey;

  const defaultLen = (key) => (key === 'top' || key === 'bottom') ? (room._wMm || 0) : (room._hMm || 0);
  const getWallData = (key) => ({
    lengthMm: wallOverrides[key]?.lengthMm ?? defaultLen(key),
    wallpaper: wallOverrides[key]?.wallpaper ?? defaultWallType,
  });

  const [localLen, setLocalLen] = React.useState(() => {
    const o = {};
    TAB_WALL_KEYS.forEach(w => { o[w.key] = String(getWallData(w.key).lengthMm); });
    return o;
  });

  React.useEffect(() => {
    const o = {};
    TAB_WALL_KEYS.forEach(w => { o[w.key] = String(getWallData(w.key).lengthMm); });
    setLocalLen(o);
  }, [room.id]);

  const [curWallpaper, setCurWallpaper] = React.useState(
    selectedWall ? getWallData(selectedWall).wallpaper : defaultWallType
  );

  React.useEffect(() => {
    setCurWallpaper(selectedWall ? getWallData(selectedWall).wallpaper : defaultWallType);
  }, [selectedWall, room.id]);

  // 일괄 적용 상태
  const allWallTypes = TAB_WALL_KEYS.map(w => getWallData(w.key).wallpaper);
  const isUniform    = allWallTypes.every(t => t === allWallTypes[0]);

  const commitLen = (wallKey) => {
    const n = parseInt(localLen[wallKey], 10);
    if (isNaN(n) || n <= 0) return;
    const data = { ...getWallData(wallKey), lengthMm: n };
    onUpdateWall && onUpdateWall(room.id, wallKey, data);
    if (wallKey === 'top' || wallKey === 'bottom') onUpdateDim(room.id, n, room._hMm);
    else onUpdateDim(room.id, room._wMm, n);
  };

  const applyWallpaper = (wallKey, wp) => {
    setCurWallpaper(wp);
    onUpdateWall && onUpdateWall(room.id, wallKey, { ...getWallData(wallKey), wallpaper: wp });
  };

  const applyAll = () => {
    TAB_WALL_KEYS.forEach(w => {
      onUpdateWall && onUpdateWall(room.id, w.key, { ...getWallData(w.key), wallpaper: curWallpaper });
    });
  };

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 12,
      border: `1.5px solid ${T.brand.primary}33`,
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: 3, background: QC_ROOM_COLORS[room.id] }}/>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: T.brand.primary }}>
          {room.name} · 편집 중
        </div>
        <button onClick={onClose} style={{
          width: 22, height: 22, borderRadius: 999, background: T.surfaceAlt, border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, color: T.ink3,
        }}>✕</button>
      </div>

      {/* 4개 벽 입력 */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 7 }}>
          벽 길이 (mm) · 클릭하여 수정
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {TAB_WALL_KEYS.map(w => {
            const isActive = selectedWall === w.key;
            return (
              <div
                key={w.key}
                onClick={() => onSelectWall(w.key)}
                style={{
                  padding: '7px 8px', borderRadius: 8, cursor: 'pointer',
                  border: `1.5px solid ${isActive ? '#EF4444' : T.line}`,
                  background: isActive ? '#FEF2F2' : T.surfaceAlt,
                  transition: 'border-color .15s',
                }}
              >
                <div style={{ fontSize: 9.5, fontWeight: 700, color: isActive ? '#EF4444' : T.ink4, marginBottom: 4 }}>
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
                    width: '100%', height: 30, padding: '0 6px', borderRadius: 6,
                    border: `1px solid ${isActive ? '#EF4444' : T.line}`,
                    background: '#fff',
                    fontSize: 12.5, fontWeight: 700, outline: 'none', textAlign: 'right',
                    fontFamily: 'inherit', color: isActive ? '#EF4444' : T.ink,
                  }}
                />
                <div style={{ fontSize: 9, color: T.ink4, marginTop: 2, textAlign: 'right' }}>mm</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 벽지 선택 + 바닥 종류 */}
      {selectedWall && (
        <div style={{ borderTop: `1px solid ${T.lineSoft}`, paddingTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: T.ink3 }}>
              {TAB_WALL_KEYS.find(w => w.key === selectedWall)?.label}벽 · 벽지 종류
            </div>
            <button onClick={applyAll} style={{
              height: 24, padding: '0 9px', borderRadius: 6,
              border: `1px solid ${isUniform ? '#10B981' : T.brand.primary}55`,
              background: isUniform ? '#D1FAE5' : T.brand.primarySoft,
              color: isUniform ? '#10B981' : T.brand.primary,
              fontSize: 10.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <Icon name="check" size={10} color={isUniform ? '#10B981' : T.brand.primary} strokeWidth={2.5}/>
              {isUniform ? '일괄됨' : '일괄 적용'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {TAB_WALLPAPER_OPTS.map(wp => {
              const active = curWallpaper === wp.v;
              return (
                <button key={wp.v} onClick={() => applyWallpaper(selectedWall, wp.v)} style={{
                  padding: '5px 10px', borderRadius: 999,
                  background: active ? T.brand.primary : '#fff',
                  color: active ? '#fff' : T.ink2,
                  border: `1px solid ${active ? T.brand.primary : T.line}`,
                  fontSize: 11, fontWeight: active ? 700 : 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{wp.label}</button>
              );
            })}
          </div>

          {/* 바닥 종류 (벽지 아래) */}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.lineSoft}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 6 }}>바닥 종류</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {TAB_FLOOR_OPTS.map(fo => {
                const active = currentFloor === fo.v;
                return (
                  <button key={fo.v} onClick={() => onUpdateFloor && onUpdateFloor(room.id, fo.v)} style={{
                    padding: '5px 10px', borderRadius: 999,
                    background: active ? T.brand.accent : '#fff',
                    color: active ? '#fff' : T.ink2,
                    border: `1px solid ${active ? T.brand.accent : T.line}`,
                    fontSize: 11, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>{fo.label}</button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 예상 소요량 카드 ─────────────────────
function RoomMatCard({ room, state, onUpdate }) {
  const T = window.TOKENS;
  const mats = qcCalcMaterialsForRoom(room, state);
  const entries = qcSortMaterialEntries(mats);
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 10,
      border: `1px solid ${T.lineSoft}`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 6, padding: '0 4px' }}>
        예상 소요량 · 수량 수정 가능
      </div>
      {entries.length === 0 ? (
        <div style={{ fontSize: 11, color: T.ink4, padding: 8 }}>정의된 자재 없음</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {entries.map(([k, m]) => <QtyRow key={k} matKey={k} mat={m} roomId={room.id} onUpdate={onUpdate}/>)}
        </div>
      )}
    </div>
  );
}

function QtyRow({ matKey, mat, roomId, onUpdate }) {
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
      padding: '5px 4px', borderBottom: `1px dashed ${T.lineSoft}`,
    }}>
      <span style={{ fontSize: 11.5, flex: 1, fontWeight: 500 }}>{mat.name}</span>
      <input type="number" value={val} onChange={e => setVal(e.target.value)} onBlur={commit} style={{
        width: 52, height: 26, padding: '0 7px', borderRadius: 6,
        border: `1px solid ${T.line}`, background: '#fff',
        fontSize: 11.5, fontWeight: 700, outline: 'none', textAlign: 'right', fontFamily: 'inherit',
      }}/>
      <span style={{ fontSize: 10.5, color: T.ink3, width: 22 }}>{mat.unit}</span>
    </div>
  );
}

window.TabReview = TabReview;
