// 태블릿 설정 탭 — 마감재별 로스율 설정
// 저장 시 localStorage에 기록 + QC_MATERIAL_SPECS에 즉시 반영

function TabSettings({ lossRates, onSave }) {
  const T = window.TOKENS;
  const [rates, setRates] = React.useState(() => ({ ...lossRates }));
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => { setRates({ ...lossRates }); }, []);

  const CAT_LABEL = { floor: '바닥재', wall: '벽재', ceiling: '천장재', fixture: '설비', etc: '기타' };
  const CAT_COLOR = { floor: '#3B82F6', wall: '#8B5CF6', ceiling: '#A855F7', fixture: '#F59E0B', etc: '#14B8A6' };
  const CAT_ORDER = ['floor', 'wall', 'ceiling', 'fixture', 'etc'];

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
    Object.entries(rates).forEach(([key, rate]) => {
      if (QC_MATERIAL_SPECS[key]) QC_MATERIAL_SPECS[key].lossRate = rate / 100;
    });
    try { localStorage.setItem('qc_loss_rates', JSON.stringify(rates)); } catch (e) {}
    onSave(rates);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      {/* 헤더 */}
      <div style={{
        padding: '18px 24px 14px', background: '#fff',
        borderBottom: `1px solid ${T.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>설정</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>
            마감재별 로스율 설정 · 저장 시 이후 모든 계산에 적용됩니다
          </div>
        </div>
        <button onClick={handleSave} style={{
          height: 38, padding: '0 22px', borderRadius: 10, border: 'none',
          background: saved ? T.success : T.brand.primary, color: '#fff',
          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 7,
          transition: 'background .2s',
          boxShadow: `0 4px 12px ${saved ? T.success : T.brand.primary}2e`,
        }}>
          <Icon name={saved ? 'checkCircle' : 'settings'} size={15} color="#fff" strokeWidth={2.2}/>
          {saved ? '저장되었습니다 ✓' : '로스율 저장'}
        </button>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '20px 28px' }}>
        {/* 안내 */}
        <div style={{
          padding: '11px 16px', borderRadius: 11,
          background: T.brand.accentSoft, border: `1px solid ${T.brand.accent}33`,
          fontSize: 12.5, color: T.ink2, lineHeight: 1.6,
          maxWidth: 980, margin: '0 auto 22px',
        }}>
          💡 설정된 로스율은 저장 후 도면변환 계산과 단순계산 모두에 자동 적용됩니다. 기본값은 마감재별 권장 로스율입니다.
        </div>

        {/* 2열 그리드로 카테고리 카드 배치 */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16, maxWidth: 980, margin: '0 auto',
        }}>
          {grouped.map(({ cat, entries }) => (
            <div key={cat} style={{
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              border: `1px solid ${T.lineSoft}`,
            }}>
              {/* 카테고리 헤더 */}
              <div style={{
                padding: '10px 16px',
                background: CAT_COLOR[cat] + '12',
                borderBottom: `1px solid ${CAT_COLOR[cat]}22`,
                fontSize: 12, fontWeight: 700, color: CAT_COLOR[cat], letterSpacing: 0.3,
              }}>
                {CAT_LABEL[cat]}
              </div>

              {/* 자재 행 */}
              {entries.map(([key, spec], idx) => {
                const currentRate = rates[key] ?? Math.round(spec.lossRate * 100);
                const isLast = idx === entries.length - 1;
                return (
                  <div key={key} style={{
                    padding: '11px 16px',
                    borderBottom: isLast ? 'none' : `1px solid ${T.lineSoft}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: T.ink }}>
                      {spec.name}
                    </span>
                    <span style={{ fontSize: 11, color: T.ink4, flexShrink: 0 }}>{spec.unit}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <input
                        type="number" inputMode="decimal" min="0" max="100" step="1"
                        value={currentRate}
                        onChange={e => handleChange(key, e.target.value)}
                        style={{
                          width: 62, height: 34, padding: '0 10px', borderRadius: 8,
                          border: `1.5px solid ${T.line}`, background: T.surfaceAlt,
                          fontSize: 14, fontWeight: 700, outline: 'none',
                          textAlign: 'right', fontFamily: 'inherit', color: T.ink,
                          transition: 'border-color .15s',
                        }}
                        onFocus={e => { e.target.style.borderColor = CAT_COLOR[cat]; }}
                        onBlur={e => { e.target.style.borderColor = T.line; }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.ink3, width: 18 }}>%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.TabSettings = TabSettings;
