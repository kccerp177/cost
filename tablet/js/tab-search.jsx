// Tablet Search Tab — 2컬럼 통합 검색

function TabSearch({ query, setQuery, sites, onSiteSelect }) {
  const T = window.TOKENS;
  const q = query.trim().toLowerCase();
  const siteResults = q
    ? sites.filter(s => s.name.toLowerCase().includes(q) || s.addr.toLowerCase().includes(q) || (s.apt && s.apt.toLowerCase().includes(q)))
    : [];
  const matResults = q
    ? Object.entries(QC_MATERIAL_SPECS).filter(([k, m]) => m.name.toLowerCase().includes(q) || QC_CAT_LABEL[m.cat].includes(q))
    : [];
  const suggestions = ['강마루', '실크벽지', '개포주공', '욕실 타일', '도어', '대리석'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '18px 24px 14px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3, marginBottom: 10 }}>검색</div>
        <div style={{ position: 'relative', maxWidth: 600 }}>
          <Icon name="search" size={16} color={T.ink4} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="현장명 · 자재명 검색" autoFocus style={{
            width: '100%', height: 44, padding: '0 14px 0 40px', borderRadius: 11,
            border: `1px solid ${T.line}`, background: T.surfaceAlt,
            fontSize: 14, outline: 'none', fontFamily: 'inherit',
          }}/>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {!q ? (
          <div style={{ maxWidth: 600 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 12 }}>추천 검색어</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setQuery(s)} style={{
                  padding: '8px 14px', borderRadius: 999,
                  background: '#fff', border: `1px solid ${T.line}`,
                  fontSize: 12.5, fontWeight: 500, color: T.ink2,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 10 }}>
                현장 · {siteResults.length}건
              </div>
              {siteResults.length === 0 ? (
                <div style={{
                  padding: 20, borderRadius: 12, background: '#fff',
                  border: `1px dashed ${T.line}`, fontSize: 12.5, color: T.ink4, textAlign: 'center',
                }}>일치하는 현장이 없습니다</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {siteResults.map(site => (
                    <button key={site.id} onClick={() => onSiteSelect(site)} style={{
                      padding: 12, borderRadius: 11, border: `1px solid ${T.lineSoft}`,
                      background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, background: site.thumb + '22',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon name="building" size={17} color={site.thumb} strokeWidth={2}/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{site.name}</div>
                        <div style={{ fontSize: 11, color: T.ink3 }}>{site.addr} · {site.size}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, letterSpacing: 0.3, marginBottom: 10 }}>
                자재 · {matResults.length}건
              </div>
              {matResults.length === 0 ? (
                <div style={{
                  padding: 20, borderRadius: 12, background: '#fff',
                  border: `1px dashed ${T.line}`, fontSize: 12.5, color: T.ink4, textAlign: 'center',
                }}>일치하는 자재가 없습니다</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {matResults.map(([k, m]) => (
                    <div key={k} style={{
                      padding: 12, borderRadius: 11, border: `1px solid ${T.lineSoft}`,
                      background: '#fff', display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: T.ink3,
                        background: T.surfaceAlt, padding: '3px 8px', borderRadius: 5,
                      }}>{QC_CAT_LABEL[m.cat]}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>
                          단위: {m.unit} · 커버리지: {m.coverage}
                          {m.lossRate > 0 && <> · 로스 {(m.lossRate * 100).toFixed(0)}%</>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.TabSearch = TabSearch;
