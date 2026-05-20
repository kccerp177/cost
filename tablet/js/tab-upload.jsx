// Tablet Upload Tab — 방법 선택 → 주소 검색 or 이미지 업로드

const TAB_MOCK_RESULTS = [
  { id: 'm1', name: '개포주공 1단지 3동 504호', addr: '서울 강남구 개포동 12', size: '34평', thumb: '#2563EB' },
  { id: 'm2', name: '반포자이 101동 1204호', addr: '서울 서초구 반포동 1', size: '59평', thumb: '#7C3AED' },
  { id: 'm3', name: '잠실엘스 7동 201호', addr: '서울 송파구 잠실동 10', size: '46평', thumb: '#0891B2' },
  { id: 'm4', name: '마포래미안푸르지오 5동 302호', addr: '서울 마포구 아현동 3', size: '38평', thumb: '#059669' },
];

function TabUpload({ activeSite, sites, onUploaded, onPickSite, onBack }) {
  const T = window.TOKENS;
  const [method, setMethod] = React.useState(null); // null | 'address' | 'image' | 'existing'

  if (method === 'address') {
    return <TabAddressSearchView onUploaded={onUploaded} onBack={() => setMethod(null)}/>;
  }
  if (method === 'image') {
    return <TabImageUploadView onUploaded={onUploaded} onBack={() => setMethod(null)}/>;
  }
  if (method === 'existing') {
    return (
      <TabExistingSiteView
        sites={sites}
        onPickSite={onPickSite}
        onSelectForImageUpload={(site) => { onPickSite(site); setMethod('image'); }}
        onBack={() => setMethod(null)}
      />
    );
  }

  // 방법 선택 화면
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '18px 24px 14px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{
            width: 32, height: 32, borderRadius: 999, background: T.surfaceAlt, border: `1px solid ${T.line}`,
            cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="chevronLeft" size={15} color={T.ink2} strokeWidth={2.2}/>
          </button>
        )}
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>도면 등록</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>등록 방법을 선택하세요</div>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 700 }}>
          {/* 주소로 검색 */}
          <button onClick={() => setMethod('address')} style={{
            padding: '36px 28px', borderRadius: 18, border: `1.5px solid ${T.brand.primary}55`,
            background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14,
            boxShadow: `0 4px 14px ${T.brand.primary}12`,
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 26px ${T.brand.primary}22`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${T.brand.primary}12`; }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: T.brand.primarySoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="search" size={28} color={T.brand.primary} strokeWidth={2}/>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: T.ink, marginBottom: 6 }}>주소로 검색</div>
              <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.6 }}>
                아파트명 또는 주소를 입력하면<br/>자동으로 도면을 불러옵니다
              </div>
            </div>
            <div style={{
              marginTop: 4, padding: '7px 16px', borderRadius: 999,
              background: T.brand.primary, color: '#fff', fontSize: 12.5, fontWeight: 700,
            }}>주소 검색하기</div>
          </button>

          {/* 이미지 직접 업로드 */}
          <button onClick={() => setMethod('image')} style={{
            padding: '36px 28px', borderRadius: 18, border: `1.5px solid ${T.brand.accent}55`,
            background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14,
            boxShadow: `0 4px 14px ${T.brand.accent}12`,
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 26px ${T.brand.accent}22`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${T.brand.accent}12`; }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: T.brand.accentSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="upload" size={28} color={T.brand.accent} strokeWidth={2}/>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: T.ink, marginBottom: 6 }}>이미지 직접 업로드</div>
              <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.6 }}>
                네이버 부동산 · 분양 홍보 · 수기 스케치<br/>JPG / PNG / WEBP · 최대 10MB
              </div>
            </div>
            <div style={{
              marginTop: 4, padding: '7px 16px', borderRadius: 999,
              background: T.brand.accent, color: '#fff', fontSize: 12.5, fontWeight: 700,
            }}>이미지 선택하기</div>
          </button>
        </div>

        {/* 방법 3: 기존 현장 등록 */}
        <button onClick={() => setMethod('existing')} style={{
          width: '100%', maxWidth: 700, padding: '20px 28px', borderRadius: 18,
          border: `1.5px solid #10B98155`, background: '#D1FAE5',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 20,
          boxShadow: '0 4px 14px #10B98112', transition: 'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 26px #10B98122'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px #10B98112'; }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: '#10B981',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="building" size={26} color="#fff" strokeWidth={2}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: '#059669', marginBottom: 4 }}>기존 현장 등록</div>
            <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.6 }}>
              저장된 현장 목록에서 선택해 새 도면을 등록합니다
            </div>
          </div>
          <Icon name="chevronRight" size={20} color="#059669"/>
        </button>
      </div>
    </div>
  );
}

// ─── 기존 현장 등록 뷰 ───────────────────────────────────────
function TabExistingSiteView({ sites, onPickSite, onSelectForImageUpload, onBack }) {
  const T = window.TOKENS;
  const [q, setQ] = React.useState('');
  const sorted = [...sites].sort((a, b) => (b.regOrder || 0) - (a.regOrder || 0));
  const filtered = q.trim()
    ? sorted.filter(s => s.name.includes(q) || s.addr.includes(q))
    : sorted;

  const getBadge = (site) => site.hasDrawing
    ? { text: '도면 있음', bg: T.brand.primarySoft, color: T.brand.primary }
    : { text: '도면 없음', bg: T.warnSoft, color: T.warn };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '18px 24px 14px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{
          width: 32, height: 32, borderRadius: 999, background: T.surfaceAlt, border: `1px solid ${T.line}`,
          cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevronLeft" size={15} color={T.ink2} strokeWidth={2.2}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>기존 현장 등록</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>현장을 선택하면 새 도면을 등록합니다 · {sites.length}곳</div>
        </div>
        {/* 검색창 */}
        <div style={{ position: 'relative', width: 260 }}>
          <Icon name="search" size={15} color={T.ink4} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}/>
          <input
            type="text" value={q} onChange={e => setQ(e.target.value)}
            placeholder="현장명 또는 주소 검색"
            style={{
              width: '100%', height: 38, padding: '0 12px 0 34px', borderRadius: 10,
              border: `1px solid ${T.line}`, background: T.surfaceAlt,
              fontSize: 13, outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: T.ink3, fontSize: 14 }}>
            검색 결과가 없습니다
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {filtered.map(site => {
              const badge = getBadge(site);
              return (
                <button key={site.id} onClick={() => site.hasDrawing ? onPickSite(site) : onSelectForImageUpload(site)} style={{
                  background: '#fff', borderRadius: 14, padding: 18,
                  border: `1px solid ${T.lineSoft}`, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left', transition: 'all .15s',
                  display: 'flex', flexDirection: 'column', gap: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B98155'; e.currentTarget.style.boxShadow = T.shadowCard; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.lineSoft; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 11, background: site.thumb + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon name="building" size={21} color={site.thumb} strokeWidth={2}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2 }}>{site.name}</div>
                      <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>📍 {site.addr}</div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: 9, background: T.surfaceAlt, fontSize: 11.5,
                  }}>
                    <span style={{ color: T.ink3 }}>{site.size}</span>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, color: badge.color, background: badge.bg,
                      padding: '3px 9px', borderRadius: 999,
                    }}>{badge.text}</span>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: T.ink3, textAlign: 'right' }}>
                    {site.updatedAt}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 주소 검색 뷰 ────────────────────────────────────────────
function TabAddressSearchView({ onUploaded, onBack }) {
  const T = window.TOKENS;
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [searched, setSearched] = React.useState(false);

  const doSearch = () => {
    if (!q.trim()) return;
    setSearched(true);
    setResults(q.length > 0 ? TAB_MOCK_RESULTS.filter(r =>
      r.name.includes(q) || r.addr.includes(q) || q.length <= 1
    ).concat(TAB_MOCK_RESULTS).slice(0, 4) : []);
  };

  const handleKey = (e) => { if (e.key === 'Enter') doSearch(); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '18px 24px 14px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{
          width: 32, height: 32, borderRadius: 999, background: T.surfaceAlt, border: `1px solid ${T.line}`,
          cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevronLeft" size={15} color={T.ink2} strokeWidth={2.2}/>
        </button>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>주소로 검색</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>아파트명 또는 주소를 입력하세요</div>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '28px 40px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
        {/* 검색창 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Icon name="search" size={16} color={T.ink4} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
            <input
              type="text" value={q} onChange={e => setQ(e.target.value)} onKeyDown={handleKey}
              placeholder="예) 개포주공, 서울 강남구 개포동..."
              autoFocus
              style={{
                width: '100%', height: 48, padding: '0 14px 0 42px', borderRadius: 12,
                border: `1.5px solid ${T.brand.primary}66`, background: '#fff',
                fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          <button onClick={doSearch} style={{
            height: 48, padding: '0 24px', borderRadius: 12, border: 'none',
            background: T.brand.primary, color: '#fff', fontSize: 13.5, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
          }}>검색</button>
        </div>

        {/* 결과 목록 */}
        {searched && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 4 }}>
              검색 결과 {results.length}건
            </div>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: T.ink3, fontSize: 14 }}>
                검색 결과가 없습니다
              </div>
            ) : (
              results.map(r => (
                <button key={r.id} onClick={onUploaded} style={{
                  padding: '16px 18px', borderRadius: 14, border: `1px solid ${T.lineSoft}`,
                  background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.brand.primary + '55'; e.currentTarget.style.boxShadow = `0 4px 12px ${T.brand.primary}14`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.lineSoft; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, background: r.thumb + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon name="building" size={22} color={r.thumb} strokeWidth={2}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>📍 {r.addr} · {r.size}</div>
                  </div>
                  <Icon name="chevronRight" size={16} color={T.ink4}/>
                </button>
              ))
            )}
          </div>
        )}

        {!searched && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: T.ink4, fontSize: 14 }}>
            검색어를 입력하고 Enter 또는 검색 버튼을 누르세요
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 이미지 업로드 뷰 ─────────────────────────────────────────
function TabImageUploadView({ onUploaded, onBack }) {
  const T = window.TOKENS;
  const [uploading, setUploading] = React.useState(false);

  const simulate = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); onUploaded(); }, 1200);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '18px 24px 14px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{
          width: 32, height: 32, borderRadius: 999, background: T.surfaceAlt, border: `1px solid ${T.line}`,
          cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevronLeft" size={15} color={T.ink2} strokeWidth={2.2}/>
        </button>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>이미지 업로드</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>평면 이미지를 업로드하세요</div>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{
          background: '#fff', borderRadius: 20, border: `2px dashed ${T.brand.primary}66`,
          padding: '64px 48px', textAlign: 'center',
          cursor: uploading ? 'default' : 'pointer', width: '100%', maxWidth: 520,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }} onClick={uploading ? undefined : simulate}>
          {uploading ? (
            <>
              <div style={{
                width: 64, height: 64, border: `4px solid ${T.line}`, borderTopColor: T.brand.primary,
                borderRadius: '50%', marginBottom: 20, animation: 'qc-spin .8s linear infinite',
              }}/>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>업로드 중...</div>
              <div style={{ fontSize: 13, color: T.ink3, marginTop: 8 }}>개포주공_34평.jpg</div>
            </>
          ) : (
            <>
              <div style={{
                width: 88, height: 88, borderRadius: 22, background: T.brand.primarySoft,
                margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="upload" size={40} color={T.brand.primary} strokeWidth={2}/>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>평면 이미지를 업로드</div>
              <div style={{ fontSize: 13.5, color: T.ink3, marginTop: 10, lineHeight: 1.6 }}>
                네이버 부동산 · 분양 홍보 · 수기 스케치<br/>JPG / PNG / WEBP · 최대 10MB
              </div>
              <div style={{
                marginTop: 26, padding: '12px 32px', borderRadius: 999,
                background: T.brand.primary, color: '#fff', fontSize: 14, fontWeight: 700,
              }}>이미지 선택</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

window.TabUpload = TabUpload;
