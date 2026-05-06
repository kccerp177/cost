// Tablet Convert Tab

function TabConvert({ activeSite, onDone }) {
  const T = window.TOKENS;
  const stages = [
    { label: '이미지 → 도면 변환', desc: '평면 이미지를 벡터로 변환' },
    { label: '객체 인식', desc: '벽 · 바닥 · 천장 · 도어 · 창호' },
    { label: '공간 자동 분리', desc: '거실 · 침실 · 주방 · 욕실' },
    { label: '면적 산출', desc: '공간별 바닥 / 벽 / 천장' },
  ];
  const durs = [1200, 1000, 800, 600];
  const [stage, setStage] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    let t = 0;
    function proc(i) {
      if (i >= stages.length) {
        setStage(stages.length);
        setTimeout(onDone, 700);
        return;
      }
      setStage(i);
      t += durs[i];
      setTimeout(() => { setElapsed(t / 1000); proc(i + 1); }, durs[i]);
    }
    const id = setTimeout(() => proc(0), 400);
    return () => clearTimeout(id);
  }, []);

  const progress = Math.min(stage / stages.length, 1) * 100;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '18px 24px 14px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>도면 변환</div>
        <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>{activeSite ? activeSite.name : '개포주공 5단지 · 34평'}</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: '#fff', borderRadius: 18, padding: '36px 32px',
          border: `1px solid ${T.lineSoft}`, maxWidth: 720, width: '100%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{
              width: 74, height: 74, borderRadius: 18, margin: '0 auto 16px',
              background: stage >= stages.length ? T.successSoft : T.brand.primarySoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {stage >= stages.length ? (
                <svg width="38" height="38" viewBox="0 0 16 16"><path d="M3 8.5L6.5 12 13 5" stroke={T.success} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="38" height="38" viewBox="0 0 24 24" style={{ animation: 'qc-spin 1.2s linear infinite' }}>
                  <circle cx="12" cy="12" r="9" stroke={T.brand.primary} strokeOpacity="0.2" strokeWidth="2.5" fill="none"/>
                  <path d="M12 3 A9 9 0 0 1 21 12" stroke={T.brand.primary} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              )}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>
              {stage >= stages.length ? '변환 완료' : '도면 변환 중...'}
            </div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 6 }}>
              {stage >= stages.length ? '공간 8개 · 벽 24개 · 자재 13종 인식' : `처리 중... ${elapsed.toFixed(1)}초`}
            </div>
          </div>

          <div style={{ height: 5, background: T.line, borderRadius: 3, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: T.brand.primary, transition: 'width .4s ease' }}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {stages.map((st, i) => {
              const done = i < stage;
              const active = i === stage;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 11,
                  background: done ? T.successSoft : active ? T.brand.primarySoft : T.surfaceAlt,
                  border: `1px solid ${done ? T.success + '33' : active ? T.brand.primary + '33' : T.line}`,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                    background: done ? T.success : active ? T.brand.primary : '#fff',
                    border: `1.5px solid ${done ? T.success : active ? T.brand.primary : T.line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done && <svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5L6.5 12 13 5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    {active && <div style={{ width: 8, height: 8, borderRadius: 999, background: '#fff', animation: 'qc-pulse 1s infinite' }}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{st.label}</div>
                    <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>{st.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

window.TabConvert = TabConvert;
