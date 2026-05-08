// Tablet Sites Tab — 현장 그리드

function TabSites({ sites, onSelect }) {
  const T = window.TOKENS;
  const [q, setQ] = React.useState('');
  // 최신 등록순(regOrder 내림차순)으로 정렬
  const sorted = [...sites].sort((a, b) => (b.regOrder || 0) - (a.regOrder || 0));
  const filtered = q.trim()
    ? sorted.filter(s => s.name.includes(q) || s.addr.includes(q))
    : sorted;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '18px 24px 14px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>현장</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>도면 · 물량 기록이 저장된 현장 {sites.length}곳</div>
        </div>
        <div style={{ position: 'relative', width: 280 }}>
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
            {filtered.map(site => <TabSiteCard key={site.id} site={site} onClick={() => onSelect(site)}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

function TabSiteCard({ site, onClick }) {
  const T = window.TOKENS;
  const badge = site.hasQuantity
    ? { text: '물량 완료', bg: T.successSoft, color: T.success }
    : site.hasDrawing
      ? { text: '도면 완료', bg: T.brand.primarySoft, color: T.brand.primary }
      : { text: '신규', bg: T.warnSoft, color: T.warn };
  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 14, padding: 18,
      border: `1px solid ${T.lineSoft}`, cursor: 'pointer', transition: 'all .15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = T.brand.primary + '55'; e.currentTarget.style.boxShadow = T.shadowCard; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = T.lineSoft; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11, background: site.thumb + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="building" size={21} color={site.thumb} strokeWidth={2}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>{site.name}</div>
          <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>📍 {site.addr}</div>
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', borderRadius: 9, background: T.surfaceAlt,
        fontSize: 11.5,
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
    </div>
  );
}

window.TabSites = TabSites;
