// Convert Screen — Step 2: 도면 변환 (4단계 progress)

function ConvertScreen({ activeSite, onDone }) {
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
      <div style={{ padding: '14px 18px 12px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>도면 변환</div>
        <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2 }}>
          {activeSite ? activeSite.name : '개포주공 5단지 · 34평'}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '22px 18px',
          border: `1px solid ${T.lineSoft}`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 15, margin: '0 auto 10px',
              background: stage >= stages.length ? T.successSoft : T.brand.primarySoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {stage >= stages.length ? (
                <svg width="28" height="28" viewBox="0 0 16 16"><path d="M3 8.5L6.5 12 13 5" stroke={T.success} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" style={{ animation: 'qc-spin 1.2s linear infinite' }}>
                  <circle cx="12" cy="12" r="9" stroke={T.brand.primary} strokeOpacity="0.2" strokeWidth="2.5" fill="none"/>
                  <path d="M12 3 A9 9 0 0 1 21 12" stroke={T.brand.primary} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              )}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>
              {stage >= stages.length ? '변환 완료' : '도면 변환 중...'}
            </div>
            <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 4 }}>
              {stage >= stages.length ? '공간 8개 인식' : `처리 중... ${elapsed.toFixed(1)}초`}
            </div>
          </div>

          <div style={{ height: 4, background: T.line, borderRadius: 2, overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: T.brand.primary, transition: 'width .4s ease' }}/>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stages.map((st, i) => {
              const done = i < stage;
              const active = i === stage;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10,
                  background: done ? T.successSoft : active ? T.brand.primarySoft : T.surfaceAlt,
                  border: `1px solid ${done ? T.success + '33' : active ? T.brand.primary + '33' : T.line}`,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                    background: done ? T.success : active ? T.brand.primary : '#fff',
                    border: `1.5px solid ${done ? T.success : active ? T.brand.primary : T.line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done && <svg width="11" height="11" viewBox="0 0 16 16"><path d="M3 8.5L6.5 12 13 5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    {active && <div style={{ width: 7, height: 7, borderRadius: 999, background: '#fff', animation: 'qc-pulse 1s infinite' }}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: done || active ? T.ink : T.ink3 }}>{st.label}</div>
                    <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>{st.desc}</div>
                  </div>
                  {done && <span style={{ fontSize: 10, fontWeight: 700, color: T.success }}>완료</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ConvertScreen = ConvertScreen;
