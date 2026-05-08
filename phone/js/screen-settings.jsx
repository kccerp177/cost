// 설정 화면 — 마감재별 로스율 설정
// 저장 시 localStorage에 기록 + QC_MATERIAL_SPECS에 즉시 반영

function SettingsScreen({ lossRates, onSave }) {
  const T = window.TOKENS;
  const [rates, setRates] = React.useState(() => ({ ...lossRates }));
  const [saved, setSaved] = React.useState(false);

  // lossRates prop이 외부에서 바뀔 경우 동기화
  React.useEffect(() => { setRates({ ...lossRates }); }, []);

  const CAT_LABEL = { floor: '바닥재', wall: '벽재', ceiling: '천장재', fixture: '설비', etc: '기타' };
  const CAT_COLOR = { floor: '#3B82F6', wall: '#8B5CF6', ceiling: '#A855F7', fixture: '#F59E0B', etc: '#14B8A6' };
  const CAT_ORDER = ['floor', 'wall', 'ceiling', 'fixture', 'etc'];

  // 카테고리별 그룹핑
  const grouped = CAT_ORDER
    .map(cat => ({
      cat,
      entries: Object.entries(QC_MATERIAL_SPECS).filter(([, s]) => s.cat === cat),
    }))
    .filter(g => g.entries.length > 0);

  const handleChange = (key, rawVal) => {
    const n = parseFloat(rawVal);
    setRates(r => ({ ...r, [key]: isNaN(n) ? 0 : Math.max(0, Math.min(100, n)) }));
  };

  const handleSave = () => {
    // QC_MATERIAL_SPECS에 즉시 반영
    Object.entries(rates).forEach(([key, rate]) => {
      if (QC_MATERIAL_SPECS[key]) QC_MATERIAL_SPECS[key].lossRate = rate / 100;
    });
    // localStorage 저장
    try { localStorage.setItem('qc_loss_rates', JSON.stringify(rates)); } catch (e) {}
    onSave(rates);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg, position: 'relative' }}>
      {/* 헤더 */}
      <div style={{ padding: '12px 18px 10px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>설정</div>
        <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>마감재별 로스율 · 저장 시 이후 계산에 적용</div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 14, paddingBottom: 88 }}>
        {/* 안내 */}
        <div style={{
          padding: '10px 12px', borderRadius: 10,
          background: T.brand.accentSoft, border: `1px solid ${T.brand.accent}33`,
          fontSize: 11, color: T.ink2, lineHeight: 1.6, marginBottom: 16,
        }}>
          💡 설정된 로스율은 저장 후 도면변환 계산과 단순계산 모두에 적용됩니다.
        </div>

        {grouped.map(({ cat, entries }) => (
          <div key={cat} style={{ marginBottom: 18 }}>
            {/* 카테고리 헤더 */}
            <div style={{
              fontSize: 10.5, fontWeight: 700, color: CAT_COLOR[cat],
              letterSpacing: 0.5, marginBottom: 7, paddingLeft: 2,
            }}>
              {CAT_LABEL[cat].toUpperCase()}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {entries.map(([key, spec]) => {
                const currentRate = rates[key] ?? Math.round(spec.lossRate * 100);
                return (
                  <div key={key} style={{
                    background: '#fff', borderRadius: 10, padding: '10px 12px',
                    border: `1px solid ${T.lineSoft}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{
                      fontSize: 9.5, fontWeight: 700,
                      color: CAT_COLOR[cat], background: CAT_COLOR[cat] + '18',
                      padding: '2px 6px', borderRadius: 4, flexShrink: 0,
                    }}>{spec.unit}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.ink }}>{spec.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <input
                        type="number" inputMode="decimal" min="0" max="100" step="1"
                        value={currentRate}
                        onChange={e => handleChange(key, e.target.value)}
                        style={{
                          width: 54, height: 32, padding: '0 8px', borderRadius: 7,
                          border: `1px solid ${T.line}`, background: T.surfaceAlt,
                          fontSize: 13, fontWeight: 700, outline: 'none',
                          textAlign: 'right', fontFamily: 'inherit', color: T.ink,
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.ink3, width: 14 }}>%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 저장 버튼 (하단 고정) */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px', background: 'rgba(255,255,255,0.96)',
        borderTop: `1px solid ${T.lineSoft}`, backdropFilter: 'blur(8px)',
      }}>
        <button onClick={handleSave} style={{
          width: '100%', height: 46, borderRadius: 12, border: 'none',
          background: saved ? T.success : T.brand.primary, color: '#fff',
          fontSize: 14, fontWeight: 700, letterSpacing: -0.2,
          boxShadow: `0 6px 16px ${saved ? T.success : T.brand.primary}2e`,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'background .2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name={saved ? 'checkCircle' : 'settings'} size={16} color="#fff" strokeWidth={2.2}/>
          {saved ? '저장되었습니다 ✓' : '로스율 저장'}
        </button>
      </div>
    </div>
  );
}

window.SettingsScreen = SettingsScreen;
