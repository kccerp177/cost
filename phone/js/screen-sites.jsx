// Sites 탭 — 현장별 산출 기록 목록

function SitesScreen({ sites, onSelect, onNew, onBackToMode }) {
  const T = window.TOKENS;
  const [q, setQ] = React.useState('');
  // 최신 등록순(regOrder 내림차순)으로 정렬
  const sorted = [...sites].sort((a, b) => (b.regOrder || 0) - (a.regOrder || 0));
  const filtered = q.trim()
    ? sorted.filter(s => s.name.includes(q) || s.addr.includes(q))
    : sorted;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      {/* 모드 표시 + 변경 */}
      <div style={{
        padding: '8px 14px',
        background: T.brand.primarySoft,
        borderBottom: `1px solid ${T.brand.primary}22`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="image" size={13} color={T.brand.primary} strokeWidth={2.2}/>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: T.brand.primary, flex: 1 }}>
          도면변환 계산 모드
        </span>
        <button onClick={onBackToMode} style={{
          height: 24, padding: '0 9px', borderRadius: 999,
          background: '#fff', border: `1px solid ${T.brand.primary}55`,
          color: T.brand.primary, fontSize: 10.5, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <Icon name="chevronLeft" size={10} color={T.brand.primary} strokeWidth={2.4}/>
          모드 변경
        </button>
      </div>

      <div style={{
        padding: '14px 18px 12px',
        background: '#fff', borderBottom: `1px solid ${T.lineSoft}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>현장</div>
            <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2 }}>도면 · 물량 기록이 저장된 현장 {sites.length}곳</div>
          </div>
          <button onClick={onNew} style={{
            height: 34, padding: '0 13px', borderRadius: 10,
            background: T.brand.primary, border: 'none',
            color: '#fff', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          }}>
            <Icon name="plus" size={13} color="#fff" strokeWidth={2.5}/>
            신규 현장
          </button>
        </div>
      </div>
      {/* 검색 */}
      <div style={{ padding: '8px 14px 6px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={14} color={T.ink4} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}/>
          <input
            type="text" value={q} onChange={e => setQ(e.target.value)}
            placeholder="현장명 또는 주소 검색"
            style={{
              width: '100%', height: 36, padding: '0 10px 0 32px', borderRadius: 10,
              border: `1px solid ${T.line}`, background: T.surfaceAlt,
              fontSize: 12.5, outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '10px 14px 14px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.ink3, fontSize: 13 }}>
            검색 결과가 없습니다
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {filtered.map(site => <SiteCard key={site.id} site={site} onClick={() => onSelect(site)}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

function SiteCard({ site, onClick }) {
  const T = window.TOKENS;
  const badge = site.hasQuantity
    ? { text: '물량 완료', bg: T.successSoft, color: T.success }
    : site.hasDrawing
      ? { text: '도면 완료', bg: T.brand.primarySoft, color: T.brand.primary }
      : { text: '신규', bg: T.warnSoft, color: T.warn };

  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 12, padding: '10px 12px',
      border: `1px solid ${T.lineSoft}`, cursor: 'pointer',
      transition: 'all .15s', fontFamily: 'inherit',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = T.brand.primary + '55'; e.currentTarget.style.boxShadow = T.shadowCard; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = T.lineSoft; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: site.thumb + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="building" size={17} color={site.thumb} strokeWidth={2}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2 }}>{site.name}</div>
          <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>📍 {site.addr}</div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, color: badge.color, background: badge.bg,
          padding: '3px 8px', borderRadius: 999, flexShrink: 0,
        }}>{badge.text}</span>
      </div>
      <div style={{
        marginTop: 7, paddingTop: 7, borderTop: `1px dashed ${T.lineSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 10.5, color: T.ink3,
      }}>
        <span>{site.size}</span>
        <span>{site.updatedAt}</span>
      </div>
    </div>
  );
}

window.SitesScreen = SitesScreen;
