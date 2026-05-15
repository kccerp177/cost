// 태블릿 쉘 — 상단바 + 좌측 사이드바(탭 5개)

function TabletTopBar({ activeSite, onConfirm, showConfirm }) {
  const T = window.TOKENS;
  return (
    <div style={{
      height: 56, padding: '0 20px',
      borderBottom: `1px solid ${T.lineSoft}`, background: '#fff',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: `linear-gradient(135deg, ${T.brand.primary}, ${T.brand.accent})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="#fff" strokeWidth="2" fill="none"/>
          <path d="M4 7h16M4 12h16M4 17h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.3 }}>물량 산출기</div>
        <div style={{ fontSize: 10.5, color: T.ink3 }}>
          {activeSite ? activeSite.name : '현장 미지정'}
        </div>
      </div>

      <div style={{ flex: 1 }}/>

      {showConfirm && (
        <button onClick={onConfirm} style={{
          height: 36, padding: '0 16px', borderRadius: 9, border: 'none',
          background: T.brand.primary, color: '#fff',
          fontSize: 12.5, fontWeight: 700, letterSpacing: -0.2,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          물량확정 <Icon name="chevronRight" size={13} color="#fff" strokeWidth={2.4}/>
        </button>
      )}
    </div>
  );
}

function TabletSideBar({ tab, onChange, step, activeSite, confirmed }) {
  const T = window.TOKENS;
  const isLocked = !activeSite && step <= 1;
  const items = [
    { key: 'sites',    label: '현장',     icon: 'building', lockable: false },
    { key: 'review',   label: '도면 확인', icon: 'image',   lockable: true  },
    { key: 'confirm',  label: '자재 확인', icon: 'box',     lockable: false },
    { key: 'settings', label: '설정',     icon: 'settings', lockable: false },
  ];
  return (
    <div style={{
      width: 130, background: '#fff', borderRight: `1px solid ${T.lineSoft}`,
      padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3,
    }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: T.ink4, letterSpacing: 0.6, padding: '4px 10px 8px' }}>
        NAVIGATION
      </div>
      {items.map(it => {
        const active = tab === it.key;
        const reviewLocked  = it.key === 'review'  && isLocked;
        const confirmLocked = it.key === 'confirm' && !confirmed;
        const locked = reviewLocked || confirmLocked;
        return (
          <button key={it.key} onClick={() => onChange(it.key)} style={{
            padding: '10px 12px', borderRadius: 9, border: 'none',
            background: active ? T.brand.primarySoft : 'transparent',
            color: active ? T.brand.primary : T.ink2,
            fontSize: 12, fontWeight: active ? 700 : 500, letterSpacing: -0.1,
            cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left',
            opacity: locked ? 0.32 : 1,
          }}>
            <Icon name={it.icon} size={16} color={active ? T.brand.primary : T.ink3} strokeWidth={active ? 2.2 : 1.8}/>
            <span style={{ flex: 1 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { TabletTopBar, TabletSideBar });
