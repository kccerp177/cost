// Review Screen — Step 3: 도면확인 + 구조변경 통합
// 상단 도면 / 발코니 토글 / 공간 목록 / 바텀시트 편집 / [물량확정]

function ReviewScreen({ state, activeSite, selectedRoomId, onSelectRoom, onToggleExpansion, onUpdateDim, onUpdateRoomMat, onConfirm }) {
  const T = window.TOKENS;
  const rooms = qcGetCurrentRooms(state);
  const selectedRoom = selectedRoomId ? rooms.find(r => r.id === selectedRoomId) : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg, position: 'relative' }}>
      <div style={{ padding: '12px 18px 10px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>도면 확인</div>
        <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>
          {activeSite ? activeSite.name : '개포주공 5단지 · 34평'} · 공간 터치 → 수량·치수 수정
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 80 }}>
        {/* 도면 */}
        <div style={{
          background: '#FAF3E0', borderRadius: 12, border: `1px solid ${T.lineSoft}`,
          height: 220, padding: 6, overflow: 'hidden',
        }}>
          <QcFloorplan state={state} selectedRoomId={selectedRoomId} onSelectRoom={onSelectRoom} highlightExpansion={true}/>
        </div>

        {/* 발코니 확장 토글 */}
        <div style={{
          background: '#fff', borderRadius: 12, padding: 12,
          border: `1px solid ${T.lineSoft}`,
        }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 8 }}>발코니 확장</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ExpansionChip
              label="거실" checked={state.expansionState.living} 
              onToggle={v => onToggleExpansion('living', v)}
              detail="+6.8㎡"
            />
            <ExpansionChip
              label="침실3" checked={state.expansionState.bed3}
              onToggle={v => onToggleExpansion('bed3', v)}
              detail="+4.2㎡"
            />
          </div>
        </div>

        {/* 공간 목록 */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: `1px solid ${T.lineSoft}`, overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 12px 6px', fontSize: 11.5, fontWeight: 700, color: T.ink3, letterSpacing: 0.3 }}>
            공간 {rooms.length}개 · 터치하여 수정
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rooms.map(r => (
              <RoomRow key={r.id} room={r} selected={selectedRoomId === r.id} onClick={() => onSelectRoom(r.id)}/>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 고정 물량확정 버튼 */}
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

      {/* 공간 편집 바텀시트 */}
      {selectedRoom && (
        <RoomEditSheet
          room={selectedRoom}
          state={state}
          onUpdateDim={onUpdateDim}
          onUpdateRoomMat={onUpdateRoomMat}
          onClose={() => onSelectRoom(null)}
        />
      )}
    </div>
  );
}

function ExpansionChip({ label, detail, checked, onToggle }) {
  const T = window.TOKENS;
  return (
    <button onClick={() => onToggle(!checked)} style={{
      flex: 1, padding: '10px 12px', borderRadius: 10,
      background: checked ? T.brand.primarySoft : T.surfaceAlt,
      border: `1px solid ${checked ? T.brand.primary + '55' : T.line}`,
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: 5,
        background: checked ? T.brand.primary : '#fff',
        border: `1.5px solid ${checked ? T.brand.primary : T.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {checked && <svg width="10" height="10" viewBox="0 0 16 16"><path d="M3 8.5L6.5 12 13 5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: checked ? T.brand.primary : T.ink }}>{label} 발코니</div>
        <div style={{ fontSize: 10.5, color: checked ? T.brand.primary : T.ink3, opacity: checked ? 0.75 : 1 }}>{detail}</div>
      </div>
    </button>
  );
}

function RoomRow({ room, selected, onClick }) {
  const T = window.TOKENS;
  return (
    <button onClick={onClick} style={{
      padding: '10px 12px', border: 'none',
      background: selected ? T.brand.primarySoft : '#fff',
      borderTop: `1px solid ${T.lineSoft}`,
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: 2, background: QC_ROOM_COLORS[room.id], flexShrink: 0,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: selected ? T.brand.primary : T.ink }}>
          {room.name}{room._overridden && <span style={{ fontSize: 10, color: T.warn, marginLeft: 4 }}>✎</span>}
        </div>
        <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>
          {room.floor.toFixed(1)}㎡ · {room._wMm}×{room._hMm}mm
        </div>
      </div>
      <Icon name="chevronRight" size={14} color={T.ink4}/>
    </button>
  );
}

// ─── 공간 편집 바텀시트 ───────────────────────────────────
function RoomEditSheet({ room, state, onUpdateDim, onUpdateRoomMat, onClose }) {
  const T = window.TOKENS;
  const [wMm, setW] = React.useState(String(room._wMm || ''));
  const [hMm, setH] = React.useState(String(room._hMm || ''));
  const mats = qcCalcMaterialsForRoom(room, state);
  const matEntries = qcSortMaterialEntries(mats);

  const wNum = parseInt(wMm, 10) || 0;
  const hNum = parseInt(hMm, 10) || 0;
  const dimChanged = wNum !== room._wMm || hNum !== room._hMm;
  const newArea = dimChanged && wNum > 0 && hNum > 0
    ? (room.floor * ((wNum * hNum) / (room._wMm * room._hMm)))
    : room.floor;

  const applyDim = () => {
    if (wNum > 0 && hNum > 0) onUpdateDim(room.id, wNum, hNum);
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'flex-end', zIndex: 30,
      animation: 'qc-fade-in .18s',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderRadius: '18px 18px 0 0',
        maxHeight: '78%', display: 'flex', flexDirection: 'column',
        animation: 'qc-slide-up .22s ease-out',
      }}>
        <div style={{ padding: '12px 18px 10px', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: QC_ROOM_COLORS[room.id] }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>{room.name}</div>
            <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>치수와 예상 소요량을 수정할 수 있습니다</div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 999, background: T.bg, border: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>✕</button>
        </div>

        <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 치수 편집 */}
          <div style={{
            background: T.brand.primarySoft, borderRadius: 12, padding: 12,
            border: `1px solid ${T.brand.primary}33`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.brand.primary, letterSpacing: 0.3, marginBottom: 8 }}>
              가로 × 세로 (mm)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <input type="number" value={wMm} onChange={e => setW(e.target.value)} onBlur={applyDim} style={{
                flex: 1, height: 38, padding: '0 10px', borderRadius: 9,
                border: `1.5px solid ${T.brand.primary}55`, background: '#fff',
                fontSize: 13, fontWeight: 600, outline: 'none', textAlign: 'center',
                fontFamily: 'inherit',
              }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.brand.primary }}>×</span>
              <input type="number" value={hMm} onChange={e => setH(e.target.value)} onBlur={applyDim} style={{
                flex: 1, height: 38, padding: '0 10px', borderRadius: 9,
                border: `1.5px solid ${T.brand.primary}55`, background: '#fff',
                fontSize: 13, fontWeight: 600, outline: 'none', textAlign: 'center',
                fontFamily: 'inherit',
              }}/>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.7)',
            }}>
              <span style={{ fontSize: 11.5, color: T.brand.primary, fontWeight: 600 }}>면적 (자동 재계산)</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.brand.primary, letterSpacing: -0.3 }}>
                {newArea.toFixed(2)} ㎡
              </span>
            </div>
          </div>

          {/* 예상 소요량 (수량만 수정) */}
          <div style={{
            background: '#fff', borderRadius: 12, padding: 12,
            border: `1px solid ${T.lineSoft}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 8 }}>
              예상 소요량 · 수량 직접 수정 가능
            </div>
            {matEntries.length === 0 ? (
              <div style={{ fontSize: 11, color: T.ink4, padding: '8px 0' }}>이 공간에 정의된 자재가 없습니다</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {matEntries.map(([k, m]) => <MatQtyRow key={k} matKey={k} mat={m} roomId={room.id} onUpdate={onUpdateRoomMat}/>)}
              </div>
            )}
          </div>

          {/* 공간 기본 정보 */}
          <div style={{
            background: T.surfaceAlt, borderRadius: 12, padding: 10,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 11,
          }}>
            <div><div style={{ color: T.ink3, marginBottom: 2 }}>벽면적</div><div style={{ fontWeight: 700 }}>{room.wall.toFixed(1)}㎡</div></div>
            <div><div style={{ color: T.ink3, marginBottom: 2 }}>둘레</div><div style={{ fontWeight: 700 }}>{room.perimeter.toFixed(1)}m</div></div>
            <div><div style={{ color: T.ink3, marginBottom: 2 }}>도어/창</div><div style={{ fontWeight: 700 }}>{room.doors}/{room.windows}</div></div>
          </div>
        </div>
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
        padding: '2px 6px', borderRadius: 4,
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
