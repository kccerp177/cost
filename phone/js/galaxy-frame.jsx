// Galaxy device frame — photo-organizer에서 그대로 재사용

function GalaxyStatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#fff' : '#0A0E14';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px 10px', boxSizing: 'border-box',
      position: 'relative', zIndex: 20, width: '100%',
    }}>
      <div style={{ fontFamily: 'Pretendard, -apple-system, system-ui', fontWeight: 600, fontSize: 14, letterSpacing: -0.2, color: c }}>{time}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="16" height="11" viewBox="0 0 16 11">
          <rect x="0" y="7.5" width="2.5" height="3.5" rx="0.5" fill={c}/>
          <rect x="4" y="5" width="2.5" height="6" rx="0.5" fill={c}/>
          <rect x="8" y="2.5" width="2.5" height="8.5" rx="0.5" fill={c}/>
          <rect x="12" y="0" width="2.5" height="11" rx="0.5" fill={c}/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11">
          <path d="M7.5 1.5C10 1.5 12.2 2.3 13.8 3.8L15 2.6C13 .9 10.3 0 7.5 0S2 .9 0 2.6l1.2 1.2C2.8 2.3 5 1.5 7.5 1.5z" fill={c}/>
          <path d="M7.5 5C9 5 10.3 5.5 11.3 6.3l1.2-1.2C11.1 4.2 9.4 3.5 7.5 3.5S3.9 4.2 2.5 5.1l1.2 1.2C4.7 5.5 6 5 7.5 5z" fill={c}/>
          <circle cx="7.5" cy="9" r="1.5" fill={c}/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="1.5" stroke={c} strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="19" height="8" rx="0.5" fill={c}/>
          <rect x="23" y="4" width="1.5" height="4" rx="0.3" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

function GalaxyDevice({ children, width = 402, height = 874, dark = false }) {
  return (
    <div style={{
      width: width + 10, height: height + 10,
      position: 'relative', padding: 5, borderRadius: 52,
      background: 'linear-gradient(145deg, #2A2D35 0%, #15181E 50%, #2A2D35 100%)',
      boxShadow: '0 40px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 52,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 10%, transparent 20%, transparent 80%, rgba(255,255,255,0.08) 90%, transparent 100%)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        width, height, borderRadius: 46, overflow: 'hidden', position: 'relative',
        background: dark ? '#000' : '#F5F6F8',
        fontFamily: 'Pretendard, -apple-system, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}>
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          width: 11, height: 11, borderRadius: 999, background: '#000',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 0 1px #1A1D24',
          zIndex: 60,
        }}>
          <div style={{
            position: 'absolute', top: 2, left: 2, width: 3, height: 3, borderRadius: 999,
            background: 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)',
          }}/>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <GalaxyStatusBar dark={dark} />
        </div>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
          height: 24, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          paddingBottom: 8, pointerEvents: 'none',
        }}>
          <div style={{
            width: 108, height: 4, borderRadius: 100,
            background: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.35)',
          }} />
        </div>
      </div>
      <div style={{ position: 'absolute', right: -2, top: 180, width: 3, height: 62, borderRadius: '0 2px 2px 0', background: 'linear-gradient(90deg, #1A1D24 0%, #2A2D35 100%)', boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.05)' }}/>
      <div style={{ position: 'absolute', left: -2, top: 140, width: 3, height: 46, borderRadius: '2px 0 0 2px', background: 'linear-gradient(90deg, #2A2D35 0%, #1A1D24 100%)', boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.05)' }}/>
      <div style={{ position: 'absolute', left: -2, top: 200, width: 3, height: 46, borderRadius: '2px 0 0 2px', background: 'linear-gradient(90deg, #2A2D35 0%, #1A1D24 100%)', boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.05)' }}/>
    </div>
  );
}

Object.assign(window, { GalaxyDevice, GalaxyStatusBar });
