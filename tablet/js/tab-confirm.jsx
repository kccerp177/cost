// Tablet Confirm Tab — Step 4

function TabConfirm({ state, activeSite, sites, onUpdateMat, onSave }) {
  const T = window.TOKENS;
  // roomEnabled로 비활성 공간 제외 (qcCalcMaterials와 동일 기준)
  const roomEnabled = state.roomEnabled || {};
  const rooms = qcGetCurrentRooms(state).filter(r => roomEnabled[r.id] !== false);
  const mats = qcCalcMaterials(state);
  const matEntries = qcSortMaterialEntries(mats);
  const [showSiteAssign, setShowSiteAssign] = React.useState(false);

  const totalFloor = rooms.reduce((s, r) => s + r.floor, 0);
  const totalWall  = rooms.reduce((s, r) => s + r.wall, 0);

  const handleSaveClick = () => {
    if (activeSite) onSave(activeSite);
    else setShowSiteAssign(true);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg, position: 'relative' }}>
      <div style={{ padding: '14px 24px 12px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>물량 확정</div>
          <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2 }}>
            {activeSite ? activeSite.name : '현장 미지정'} · 총 {totalFloor.toFixed(1)}㎡ · 자재 {matEntries.length}종
          </div>
        </div>
        <button onClick={handleSaveClick} style={{
          height: 36, padding: '0 18px', borderRadius: 9, border: 'none',
          background: T.brand.primary, color: '#fff',
          fontSize: 12.5, fontWeight: 700, letterSpacing: -0.2,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="check" size={14} color="#fff" strokeWidth={2.4}/>
          {activeSite ? `${activeSite.apt || '현장'}에 저장` : '현장에 저장'}
        </button>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
          {/* 좌: 자재 소요량 */}
          <div style={{ background: '#fff', borderRadius: 14, padding: 14, border: `1px solid ${T.lineSoft}` }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 10, color: T.ink2 }}>자재 소요량</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {matEntries.map(([k, m]) => <MatMini key={k} matKey={k} mat={m} onUpdate={onUpdateMat}/>)}
            </div>
          </div>

          {/* 우: 공간 면적표 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.lineSoft}` }}>
              <div style={{ padding: '11px 14px 8px', fontSize: 12.5, fontWeight: 700, color: T.ink2 }}>공간 면적표</div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
                padding: '8px 14px', background: T.surfaceAlt,
                fontSize: 10.5, fontWeight: 700, color: T.ink3, letterSpacing: 0.2,
              }}>
                <span>공간</span><span style={{ textAlign: 'right' }}>바닥</span><span style={{ textAlign: 'right' }}>벽</span><span style={{ textAlign: 'right' }}>천장</span>
              </div>
              {rooms.map(r => (
                <div key={r.id} style={{
                  display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
                  padding: '8px 14px', fontSize: 11.5,
                  borderTop: `1px solid ${T.lineSoft}`,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: QC_ROOM_COLORS[r.id] }}/>
                    <span style={{ fontWeight: 500 }}>{r.name}</span>
                  </span>
                  <span style={{ textAlign: 'right', fontWeight: 600 }}>{r.floor.toFixed(1)}</span>
                  <span style={{ textAlign: 'right' }}>{r.wall.toFixed(1)}</span>
                  <span style={{ textAlign: 'right' }}>{r.ceiling.toFixed(1)}</span>
                </div>
              ))}
              <div style={{
                display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
                padding: '9px 14px', fontSize: 12, fontWeight: 700,
                background: T.brand.primarySoft, color: T.brand.primary,
                borderTop: `2px solid ${T.brand.primary}33`,
              }}>
                <span>합계</span>
                <span style={{ textAlign: 'right' }}>{totalFloor.toFixed(1)}</span>
                <span style={{ textAlign: 'right' }}>{totalWall.toFixed(1)}</span>
                <span style={{ textAlign: 'right' }}>{totalFloor.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSiteAssign && (
        <TabletSiteAssignModal sites={sites}
          onPick={(site) => { setShowSiteAssign(false); onSave(site); }}
          onClose={() => setShowSiteAssign(false)}/>
      )}
    </div>
  );
}

function MatMini({ matKey, mat, onUpdate }) {
  const T = window.TOKENS;
  const [val, setVal] = React.useState(String(mat.qty));
  React.useEffect(() => { setVal(String(mat.qty)); }, [mat.qty]);
  const commit = () => {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 0 && n !== mat.qty) onUpdate(matKey, n);
  };
  const catColor = {
    floor: '#3B82F6', wall: '#8B5CF6', ceiling: '#A855F7',
    fixture: '#F59E0B', etc: '#14B8A6',
  }[mat.cat] || T.ink3;
  return (
    <div style={{
      padding: 10, borderRadius: 10,
      border: `1px solid ${T.lineSoft}`, background: T.surfaceAlt,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, color: catColor,
          background: catColor + '18', padding: '2px 6px', borderRadius: 3,
        }}>{QC_CAT_LABEL[mat.cat]}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{mat.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ fontSize: 10, color: T.ink4 }}>
          산출 {mat.rawQty.toFixed(1)}{mat.unit}
          {mat.lossRate > 0 && <> · {(mat.lossRate * 100).toFixed(0)}%</>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} onBlur={commit} style={{
            width: 52, height: 28, padding: '0 8px', borderRadius: 6,
            border: `1px solid ${T.line}`, background: '#fff',
            fontSize: 11.5, fontWeight: 700, outline: 'none', textAlign: 'right', fontFamily: 'inherit',
          }}/>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: T.ink2 }}>{mat.unit}</span>
        </div>
      </div>
    </div>
  );
}

function TabletSiteAssignModal({ sites, onPick, onClose }) {
  const T = window.TOKENS;
  const [newMode, setNewMode] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [q, setQ] = React.useState('');
  const filtered = sites.filter(s => !q || s.name.includes(q) || s.addr.includes(q));

  const registerNew = () => {
    if (!newName.trim()) return;
    onPick({
      id: 'new_' + Date.now(), name: newName.trim(), apt: newName.trim(),
      addr: '직접 등록', size: '-',
      hasDrawing: true, hasQuantity: true, updatedAt: '방금 등록', thumb: '#2563EB',
    });
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30,
      animation: 'qc-fade-in .18s',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, maxHeight: '80%', background: '#fff',
        borderRadius: 16, display: 'flex', flexDirection: 'column',
        animation: 'qc-slide-up .22s ease-out',
      }}>
        <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>{newMode ? '새 현장 등록' : '현장 선택'}</div>
            <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2 }}>{newMode ? '현장 이름만 입력하면 됩니다' : '이 물량을 저장할 현장을 선택하세요'}</div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 999, background: T.bg, border: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>✕</button>
        </div>
        {newMode ? (
          <div style={{ padding: 20 }}>
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="예) 반포 자이 305호" autoFocus style={{
              width: '100%', height: 46, padding: '0 14px', borderRadius: 10,
              border: `1.5px solid ${T.brand.primary}`, outline: 'none',
              fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
            }}/>
            <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 10 }}>ℹ️ 상세 정보는 나중에 수정 가능합니다</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setNewMode(false)} style={{
                flex: 1, height: 42, borderRadius: 10, border: `1px solid ${T.line}`,
                background: '#fff', color: T.ink2, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>취소</button>
              <button onClick={registerNew} disabled={!newName.trim()} style={{
                flex: 1.5, height: 42, borderRadius: 10, border: 'none',
                background: newName.trim() ? T.brand.primary : T.line,
                color: newName.trim() ? '#fff' : T.ink4,
                fontSize: 13, fontWeight: 700,
                cursor: newName.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              }}>등록 후 저장</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 20px 8px' }}>
              <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 현장명 검색" style={{
                width: '100%', height: 38, padding: '0 12px', borderRadius: 9,
                border: `1px solid ${T.line}`, background: T.surfaceAlt,
                fontSize: 13, outline: 'none', fontFamily: 'inherit',
              }}/>
            </div>
            <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '4px 16px 14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filtered.map(site => (
                  <button key={site.id} onClick={() => onPick(site)} style={{
                    padding: 11, borderRadius: 10, border: `1px solid ${T.line}`,
                    background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, background: site.thumb + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon name="building" size={16} color={site.thumb} strokeWidth={2}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{site.name}</div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>{site.addr}</div>
                    </div>
                    <Icon name="chevronRight" size={14} color={T.ink4}/>
                  </button>
                ))}
              </div>
              <button onClick={() => setNewMode(true)} style={{
                marginTop: 10, width: '100%', padding: 12, borderRadius: 10,
                border: `1.5px dashed ${T.brand.primary}66`,
                background: T.brand.primarySoft, color: T.brand.primary,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Icon name="plus" size={15} color={T.brand.primary} strokeWidth={2.4}/>
                신규 현장 등록
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.TabConfirm = TabConfirm;
