// Confirm Screen — Step 4: 물량확정 (읽기 전용)
// 자재 카드 클릭 시 공간별 소요량 확인 가능

function ConfirmScreen({ state, activeSite, sites, onSave }) {
  const T = window.TOKENS;
  const roomEnabled = state.roomEnabled || {};
  const rooms = qcGetCurrentRooms(state).filter(r => roomEnabled[r.id] !== false);
  const mats = qcCalcMaterials(state);
  const matEntries = qcSortMaterialEntries(mats);
  const [showSiteAssign, setShowSiteAssign] = React.useState(false);
  const [tab, setTab] = React.useState('mat'); // mat|area

  const totalFloor = rooms.reduce((s, r) => s + r.floor, 0);
  const totalWall  = rooms.reduce((s, r) => s + r.wall, 0);

  const handleSaveClick = () => {
    if (activeSite) { onSave(activeSite); }
    else            { setShowSiteAssign(true); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg, position: 'relative' }}>
      <div style={{ padding: '12px 18px 10px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>물량 확정</div>
            <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>
              {activeSite ? activeSite.name : '현장 미지정'} · 총 {totalFloor.toFixed(1)}㎡
            </div>
          </div>
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: T.success, background: T.successSoft,
            padding: '4px 9px', borderRadius: 999,
          }}>{matEntries.length}종</span>
        </div>
      </div>

      {/* 읽기 전용 안내 배너 */}
      <div style={{
        padding: '7px 14px', background: T.successSoft,
        borderBottom: `1px solid ${T.success}22`,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Icon name="check" size={12} color={T.success} strokeWidth={2.5}/>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.success }}>
          물량이 확정되었습니다 · 자재를 눌러 공간별 수량을 확인하세요
        </span>
      </div>

      {/* 서브 탭 */}
      <div style={{
        display: 'flex', background: '#fff',
        borderBottom: `1px solid ${T.lineSoft}`, padding: '0 12px',
      }}>
        {[
          { k: 'mat',  label: '자재 소요량' },
          { k: 'area', label: '공간 면적표' },
        ].map(t => {
          const active = tab === t.k;
          return (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              flex: 1, padding: '11px 4px', border: 'none', background: 'transparent',
              fontSize: 12.5, fontWeight: active ? 700 : 500,
              color: active ? T.brand.primary : T.ink3,
              borderBottom: `2px solid ${active ? T.brand.primary : 'transparent'}`,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: -0.2,
            }}>{t.label}</button>
          );
        })}
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 14, paddingBottom: 80 }}>
        {tab === 'mat'  && <MatTab entries={matEntries} rooms={rooms} state={state}/>}
        {tab === 'area' && <AreaTab rooms={rooms} totalFloor={totalFloor} totalWall={totalWall}/>}
      </div>

      {/* 저장 버튼 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px', background: 'rgba(255,255,255,0.96)',
        borderTop: `1px solid ${T.lineSoft}`, backdropFilter: 'blur(8px)',
      }}>
        <button onClick={handleSaveClick} style={{
          width: '100%', height: 46, borderRadius: 12, border: 'none',
          background: T.brand.primary, color: '#fff',
          fontSize: 14, fontWeight: 700, letterSpacing: -0.2,
          boxShadow: `0 6px 16px ${T.brand.primary}2e`,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="check" size={16} color="#fff" strokeWidth={2.4}/>
          {activeSite ? `${activeSite.apt || '현장'}에 저장` : '현장에 저장'}
        </button>
      </div>

      {showSiteAssign && (
        <SiteAssignModal
          sites={sites}
          onPick={(site) => { setShowSiteAssign(false); onSave(site); }}
          onClose={() => setShowSiteAssign(false)}
        />
      )}
    </div>
  );
}

// ─── 자재 소요량 탭 ────────────────────────────────────────
function MatTab({ entries, rooms, state }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {entries.map(([k, m]) => (
        <MatCard key={k} matKey={k} mat={m} rooms={rooms} state={state}/>
      ))}
    </div>
  );
}

// ─── 자재 카드 (읽기 전용 + 클릭 시 공간별 상세) ──────────
function MatCard({ matKey, mat, rooms, state }) {
  const T = window.TOKENS;
  const [expanded, setExpanded] = React.useState(false);

  const catColor = {
    floor: '#3B82F6', wall: '#8B5CF6', ceiling: '#A855F7',
    fixture: '#F59E0B', etc: '#14B8A6',
  }[mat.cat] || T.ink3;

  // 공간별 수량 계산
  const roomBreakdown = React.useMemo(() => {
    if (!rooms || !state) return [];
    return rooms
      .map(room => {
        const roomMats = qcCalcMaterialsForRoom(room, state);
        const rm = roomMats[matKey];
        return { room, qty: rm ? rm.qty : 0 };
      })
      .filter(rb => rb.qty > 0);
  }, [matKey, rooms, state]);

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: `1px solid ${expanded ? catColor + '55' : T.lineSoft}`,
      overflow: 'hidden', transition: 'border-color .2s',
    }}>
      {/* 메인 행 — 클릭 시 공간별 상세 펼치기 */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ padding: 12, cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            fontSize: 9.5, fontWeight: 700, color: catColor,
            background: catColor + '18', padding: '2px 7px', borderRadius: 4,
          }}>{QC_CAT_LABEL[mat.cat]}</span>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{mat.name}</span>
          {/* 펼치기/접기 화살표 */}
          <span style={{
            fontSize: 10, color: T.ink4,
            display: 'inline-block',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform .2s',
          }}>▶</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10.5, color: T.ink3 }}>
            산출 {mat.rawQty.toFixed(1)}{mat.unit}
            {mat.lossRate > 0 && <> · 로스 {(mat.lossRate * 100).toFixed(0)}%</>}
          </div>
          {/* 읽기 전용 수량 표시 */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5 }}>{mat.qty}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.ink2 }}>{mat.unit}</span>
          </div>
        </div>
      </div>

      {/* 공간별 소요량 상세 */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${catColor}33`, background: catColor + '08' }}>
          <div style={{
            padding: '6px 12px 4px',
            fontSize: 10, fontWeight: 700, color: catColor, letterSpacing: 0.4,
          }}>
            공간별 소요량
          </div>
          {roomBreakdown.length === 0 ? (
            <div style={{ padding: '8px 12px 10px', fontSize: 11, color: T.ink4 }}>
              공간별 데이터 없음
            </div>
          ) : (
            roomBreakdown.map(rb => (
              <div key={rb.room.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px',
                borderTop: `1px solid ${catColor}22`,
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: 2,
                  background: QC_ROOM_COLORS[rb.room.id], flexShrink: 0,
                }}/>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: T.ink2 }}>
                  {rb.room.name}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{rb.qty}</span>
                <span style={{ fontSize: 11, color: T.ink3, width: 26 }}>{mat.unit}</span>
              </div>
            ))
          )}
          {/* 합계 행 */}
          {roomBreakdown.length > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 12px 9px',
              borderTop: `1px solid ${catColor}44`,
              background: catColor + '14',
            }}>
              <div style={{ width: 7, height: 7, flexShrink: 0 }}/>
              <span style={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: catColor }}>합계</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: catColor }}>{mat.qty}</span>
              <span style={{ fontSize: 11, color: catColor, width: 26 }}>{mat.unit}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 공간 면적표 탭 ────────────────────────────────────────
function AreaTab({ rooms, totalFloor, totalWall }) {
  const T = window.TOKENS;
  return (
    <div style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${T.lineSoft}`,
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
        padding: '9px 10px', background: T.surfaceAlt,
        fontSize: 10.5, fontWeight: 700, color: T.ink3, letterSpacing: 0.2,
      }}>
        <span>공간</span>
        <span style={{ textAlign: 'right' }}>바닥</span>
        <span style={{ textAlign: 'right' }}>벽</span>
        <span style={{ textAlign: 'right' }}>천장</span>
      </div>
      {rooms.map(r => (
        <div key={r.id} style={{
          display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
          padding: '10px', fontSize: 11.5,
          borderTop: `1px solid ${T.lineSoft}`,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: 2, background: QC_ROOM_COLORS[r.id] }}/>
            <span style={{ fontWeight: 600 }}>{r.name}</span>
          </span>
          <span style={{ textAlign: 'right', fontWeight: 600 }}>{r.floor.toFixed(1)}</span>
          <span style={{ textAlign: 'right' }}>{r.wall.toFixed(1)}</span>
          <span style={{ textAlign: 'right' }}>{r.ceiling.toFixed(1)}</span>
        </div>
      ))}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
        padding: '10px', fontSize: 12, fontWeight: 700,
        background: T.brand.primarySoft, color: T.brand.primary,
        borderTop: `2px solid ${T.brand.primary}33`,
      }}>
        <span>합계 (㎡)</span>
        <span style={{ textAlign: 'right' }}>{totalFloor.toFixed(1)}</span>
        <span style={{ textAlign: 'right' }}>{totalWall.toFixed(1)}</span>
        <span style={{ textAlign: 'right' }}>{totalFloor.toFixed(1)}</span>
      </div>
    </div>
  );
}

// ─── 현장 지정/등록 모달 ───────────────────────────────────
function SiteAssignModal({ sites, onPick, onClose }) {
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
      hasDrawing: true, hasQuantity: true,
      updatedAt: '방금 등록', thumb: '#2563EB',
    });
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
        maxHeight: '82%', display: 'flex', flexDirection: 'column',
        animation: 'qc-slide-up .22s ease-out',
      }}>
        <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2 }}>
                {newMode ? '새 현장 등록' : '현장 선택'}
              </div>
              <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>
                {newMode ? '현장 이름만 입력하면 됩니다' : '이 물량을 저장할 현장을 선택하세요'}
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 999, background: T.bg, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>✕</button>
          </div>
        </div>

        {newMode ? (
          <div style={{ padding: 18 }}>
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="예) 반포 자이 305호" autoFocus style={{
              width: '100%', height: 46, padding: '0 14px', borderRadius: 11,
              border: `1.5px solid ${T.brand.primary}`, outline: 'none',
              fontSize: 14, fontWeight: 500, fontFamily: 'inherit', background: '#fff',
            }}/>
            <div style={{ fontSize: 11, color: T.ink3, marginTop: 10 }}>ℹ️ 상세 정보는 나중에 수정 가능합니다</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => { setNewMode(false); setNewName(''); }} style={{
                flex: 1, height: 44, borderRadius: 11, border: `1px solid ${T.line}`,
                background: '#fff', color: T.ink2, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>취소</button>
              <button onClick={registerNew} disabled={!newName.trim()} style={{
                flex: 1.5, height: 44, borderRadius: 11, border: 'none',
                background: newName.trim() ? T.brand.primary : T.line,
                color: newName.trim() ? '#fff' : T.ink4,
                fontSize: 13, fontWeight: 700,
                cursor: newName.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              }}>등록 후 저장</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: '10px 18px 8px' }}>
              <input type="text" value={q} onChange={e => setQ(e.target.value)}
                placeholder="🔍 현장명 검색" style={{
                width: '100%', height: 38, padding: '0 12px', borderRadius: 10,
                border: `1px solid ${T.line}`, background: T.surfaceAlt,
                fontSize: 13, outline: 'none', fontFamily: 'inherit',
              }}/>
            </div>
            <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '4px 14px 10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filtered.map(site => (
                  <button key={site.id} onClick={() => onPick(site)} style={{
                    padding: 10, borderRadius: 10, border: `1px solid ${T.line}`,
                    background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left',
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, background: site.thumb + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon name="building" size={15} color={site.thumb} strokeWidth={2}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700 }}>{site.name}</div>
                      <div style={{ fontSize: 10.5, color: T.ink3 }}>{site.addr}</div>
                    </div>
                    <Icon name="chevronRight" size={14} color={T.ink4}/>
                  </button>
                ))}
              </div>
              <button onClick={() => setNewMode(true)} style={{
                marginTop: 10, width: '100%', padding: 12, borderRadius: 11,
                border: `1.5px dashed ${T.brand.primary}66`,
                background: T.brand.primarySoft, color: T.brand.primary,
                fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Icon name="plus" size={14} color={T.brand.primary} strokeWidth={2.4}/>
                신규 현장 등록
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.ConfirmScreen = ConfirmScreen;
