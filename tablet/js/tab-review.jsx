// Tablet Review Tab — Step 3 도면확인 (2컬럼)
// 좌측 1.6배: 도면 + 발코니 토글
// 우측 1배: (선택 공간 편집 카드) + (예상 소요량) + (공간 목록)

function TabReview({ state, activeSite, selectedRoomId, onSelectRoom, onToggleExpansion, onUpdateDim, onUpdateRoomMat, onConfirm }) {
  const T = window.TOKENS;
  const rooms = qcGetCurrentRooms(state);
  const selectedRoom = selectedRoomId ? rooms.find(r => r.id === selectedRoomId) : null;

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, background: T.bg }}>
      {/* 좌측 3/5 (도면) */}
      <div style={{ flex: 1.6, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
        {/* 발코니 토글 + 헤더 */}
        <div style={{
          background: '#fff', borderRadius: 12, padding: '10px 14px',
          border: `1px solid ${T.lineSoft}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: 0.3 }}>발코니 확장</div>
          <ExpChip label="거실" detail="+6.8㎡" checked={state.expansionState.living} onToggle={v => onToggleExpansion('living', v)}/>
          <ExpChip label="침실3" detail="+4.2㎡" checked={state.expansionState.bed3} onToggle={v => onToggleExpansion('bed3', v)}/>
          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 11, color: T.ink4 }}>공간 {rooms.length}개</div>
        </div>

        {/* 도면 */}
        <div style={{
          flex: 1, background: '#FAF3E0', borderRadius: 14,
          border: `1px solid ${T.lineSoft}`, padding: 8, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <QcFloorplan state={state} selectedRoomId={selectedRoomId} onSelectRoom={onSelectRoom} highlightExpansion={true}/>
          <div style={{
            position: 'absolute', bottom: 10, right: 12,
            padding: '5px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.92)',
            fontSize: 10.5, color: T.ink3, border: `0.5px solid ${T.line}`,
          }}>공간 클릭 → 우측에서 편집</div>
        </div>
      </div>

      {/* 우측 2/5 (편집 패널) */}
      <div style={{
        flex: 1, minWidth: 0, padding: '16px 16px 16px 0',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* 편집 중 카드 */}
        {selectedRoom ? (
          <RoomEditCard room={selectedRoom} state={state} onUpdateDim={onUpdateDim} onClose={() => onSelectRoom(null)}/>
        ) : (
          <div style={{
            background: T.surfaceAlt, borderRadius: 12, padding: '18px 14px',
            border: `1px dashed ${T.line}`, textAlign: 'center',
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink3, marginBottom: 3 }}>편집할 공간을 선택하세요</div>
            <div style={{ fontSize: 10.5, color: T.ink4 }}>좌측 도면 또는 아래 목록에서 터치</div>
          </div>
        )}

        {/* 예상 소요량 (선택된 공간의 자재 수량) */}
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
            공간 목록 · 면적 · 가로 × 세로 (mm)
          </div>
          <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto' }}>
            {rooms.map(r => (
              <button key={r.id} onClick={() => onSelectRoom(r.id)} style={{
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

// ─── 발코니 칩 ─────────────────────────────────────
function ExpChip({ label, detail, checked, onToggle }) {
  const T = window.TOKENS;
  return (
    <button onClick={() => onToggle(!checked)} style={{
      padding: '5px 10px', borderRadius: 7,
      background: checked ? T.brand.primarySoft : T.surfaceAlt,
      border: `1px solid ${checked ? T.brand.primary + '66' : T.line}`,
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 11.5, fontWeight: checked ? 700 : 500,
      color: checked ? T.brand.primary : T.ink2,
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: 3,
        background: checked ? T.brand.primary : '#fff',
        border: `1.3px solid ${checked ? T.brand.primary : T.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && <svg width="8" height="8" viewBox="0 0 16 16"><path d="M3 8.5L6.5 12 13 5" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>}
      </div>
      {label}
      <span style={{ color: T.ink4, fontSize: 10 }}>{detail}</span>
    </button>
  );
}

// ─── 선택된 공간 편집 카드 (치수) ─────────────────────
function RoomEditCard({ room, state, onUpdateDim, onClose }) {
  const T = window.TOKENS;
  const [wMm, setW] = React.useState(String(room._wMm || ''));
  const [hMm, setH] = React.useState(String(room._hMm || ''));
  React.useEffect(() => { setW(String(room._wMm || '')); setH(String(room._hMm || '')); }, [room.id, room._wMm, room._hMm]);

  const wNum = parseInt(wMm, 10) || 0;
  const hNum = parseInt(hMm, 10) || 0;
  const dimChanged = wNum !== room._wMm || hNum !== room._hMm;
  const newArea = dimChanged && wNum > 0 && hNum > 0
    ? (room.floor * ((wNum * hNum) / (room._wMm * room._hMm)))
    : room.floor;
  const applyDim = () => { if (wNum > 0 && hNum > 0 && dimChanged) onUpdateDim(room.id, wNum, hNum); };

  return (
    <div style={{
      background: T.brand.primarySoft, borderRadius: 12, padding: 12,
      border: `1px solid ${T.brand.primary}33`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: 3, background: QC_ROOM_COLORS[room.id] }}/>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: T.brand.primary }}>
          {room.name} · 편집 중
        </div>
        <button onClick={onClose} style={{
          width: 22, height: 22, borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, color: T.brand.primary,
        }}>✕</button>
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: T.brand.primary, opacity: 0.7, marginBottom: 5 }}>가로 × 세로 (mm)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <input type="number" value={wMm} onChange={e => setW(e.target.value)} onBlur={applyDim} style={{
          flex: 1, height: 34, padding: '0 10px', borderRadius: 7,
          border: `1.5px solid ${T.brand.primary}55`, background: '#fff',
          fontSize: 12.5, fontWeight: 600, outline: 'none', textAlign: 'center', fontFamily: 'inherit',
        }}/>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.brand.primary }}>×</span>
        <input type="number" value={hMm} onChange={e => setH(e.target.value)} onBlur={applyDim} style={{
          flex: 1, height: 34, padding: '0 10px', borderRadius: 7,
          border: `1.5px solid ${T.brand.primary}55`, background: '#fff',
          fontSize: 12.5, fontWeight: 600, outline: 'none', textAlign: 'center', fontFamily: 'inherit',
        }}/>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.7)',
      }}>
        <span style={{ fontSize: 10.5, color: T.brand.primary, fontWeight: 600 }}>면적 자동 재계산</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: T.brand.primary, letterSpacing: -0.3 }}>{newArea.toFixed(2)} ㎡</span>
      </div>
    </div>
  );
}

// ─── 예상 소요량 카드 (선택된 공간) ─────────────────────
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
