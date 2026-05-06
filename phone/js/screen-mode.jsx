// Mode Select Screen — 최초 진입: 사용 모드 선택

function ModeSelectScreen({ onSelect }) {
  const T = window.TOKENS;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '20px 20px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.brand.primary, letterSpacing: 1.5, marginBottom: 8 }}>
          AI 물량 산출기
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.25 }}>
          어떻게 계산할까요?
        </div>
      </div>

      <div style={{ flex: 1, padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ModeCard
          recommended
          accent={T.brand.primary}
          accentSoft={T.brand.primarySoft}
          title="도면변환 계산"
          desc="이미지를 도면으로 변환해 공간별 자동 산출"
          preview={<FloorplanPreview/>}
          onClick={() => onSelect('floorplan')}
        />
        <ModeCard
          accent={T.brand.accent}
          accentSoft={T.brand.accentSoft}
          title="단순계산"
          desc="치수만 입력해 빠르게 자재량 산출"
          preview={<SimplePreview/>}
          onClick={() => onSelect('simple')}
        />
      </div>
    </div>
  );
}

function ModeCard({ accent, accentSoft, title, desc, preview, recommended, onClick }) {
  const T = window.TOKENS;
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: 0, borderRadius: 16, overflow: 'hidden',
      background: '#fff', border: `1.5px solid ${accent}55`,
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      boxShadow: `0 4px 14px ${accent}1a`,
      transition: 'all .15s', position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 22px ${accent}33`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${accent}1a`; }}>

      {recommended && (
        <span style={{
          position: 'absolute', top: 10, right: 10, zIndex: 5,
          fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
          color: '#fff', background: accent,
          padding: '3px 9px', borderRadius: 999,
        }}>추천</span>
      )}

      <div style={{
        height: 130, background: accentSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
      }}>
        {preview}
      </div>

      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: T.ink3, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </button>
  );
}

// ─── 도면변환 미리보기 (도면 + 물량표) ────────────────────
function FloorplanPreview() {
  return (
    <svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg" style={{ width: '92%', height: '92%' }}>
      {/* 도면 */}
      <g transform="translate(8, 10)">
        <rect width="140" height="110" fill="#FAF3E0" stroke="#0F172A" strokeWidth="2.5" rx="2"/>
        <line x1="76" y1="0" x2="76" y2="110" stroke="#0F172A" strokeWidth="2.5"/>
        <line x1="0" y1="60" x2="76" y2="60" stroke="#1E293B" strokeWidth="1.5"/>
        <line x1="76" y1="42" x2="140" y2="42" stroke="#0F172A" strokeWidth="2"/>
        <line x1="76" y1="80" x2="140" y2="80" stroke="#0F172A" strokeWidth="2"/>
        <polygon points="0,0 76,0 76,60 0,60" fill="#3B82F6" fillOpacity="0.18"/>
        <text x="38" y="33" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1D4ED8" fontFamily="Pretendard, sans-serif">거실</text>
        <text x="108" y="22" textAnchor="middle" fontSize="8" fill="#0F172A" fontFamily="Pretendard, sans-serif">침실1</text>
        <text x="108" y="63" textAnchor="middle" fontSize="8" fill="#0F172A" fontFamily="Pretendard, sans-serif">침실2</text>
        <text x="108" y="98" textAnchor="middle" fontSize="8" fill="#0F172A" fontFamily="Pretendard, sans-serif">침실3</text>
        <text x="38" y="88" textAnchor="middle" fontSize="8" fill="#0F172A" fontFamily="Pretendard, sans-serif">주방</text>
        <line x1="6" y1="6" x2="70" y2="6" stroke="#1D4ED8" strokeWidth="0.6"/>
        <text x="38" y="103" textAnchor="middle" fontSize="6.5" fill="#64748B" fontFamily="Pretendard, sans-serif">7,200×5,100</text>
      </g>

      {/* 화살표 */}
      <g transform="translate(160, 60)">
        <path d="M 0 0 L 12 0" stroke="#1D4ED8" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <path d="M 8 -4 L 12 0 L 8 4" stroke="#1D4ED8" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>

      {/* 물량표 */}
      <g transform="translate(180, 14)">
        <rect width="132" height="102" rx="7" fill="#fff" stroke="#1D4ED8" strokeOpacity="0.3" strokeWidth="0.8"/>
        <text x="8" y="13" fontSize="8" fontWeight="700" fill="#1D4ED8" fontFamily="Pretendard, sans-serif">자재 소요량</text>
        <line x1="8" y1="18" x2="124" y2="18" stroke="#1D4ED8" strokeOpacity="0.2" strokeWidth="0.5"/>

        <text x="8"   y="32" fontSize="7" fill="#3D434D" fontFamily="Pretendard, sans-serif">강마루</text>
        <text x="124" y="32" fontSize="7" fontWeight="700" fill="#0E1116" textAnchor="end" fontFamily="Pretendard, sans-serif">29 박스</text>

        <text x="8"   y="46" fontSize="7" fill="#3D434D" fontFamily="Pretendard, sans-serif">실크벽지</text>
        <text x="124" y="46" fontSize="7" fontWeight="700" fill="#0E1116" textAnchor="end" fontFamily="Pretendard, sans-serif">12 롤</text>

        <text x="8"   y="60" fontSize="7" fill="#3D434D" fontFamily="Pretendard, sans-serif">바닥타일</text>
        <text x="124" y="60" fontSize="7" fontWeight="700" fill="#0E1116" textAnchor="end" fontFamily="Pretendard, sans-serif">88 장</text>

        <text x="8"   y="74" fontSize="7" fill="#3D434D" fontFamily="Pretendard, sans-serif">천장도배</text>
        <text x="124" y="74" fontSize="7" fontWeight="700" fill="#0E1116" textAnchor="end" fontFamily="Pretendard, sans-serif">8 롤</text>

        <text x="8"   y="88" fontSize="7" fill="#3D434D" fontFamily="Pretendard, sans-serif">천장몰딩</text>
        <text x="124" y="88" fontSize="7" fontWeight="700" fill="#0E1116" textAnchor="end" fontFamily="Pretendard, sans-serif">88 m</text>
      </g>
    </svg>
  );
}

// ─── 단순계산 미리보기 (입력 화면 mini) ─────────────────
function SimplePreview() {
  return (
    <svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg" style={{ width: '78%', height: '92%' }}>
      <g transform="translate(60, 6)">
        {/* 폰 외곽 */}
        <rect x="0" y="0" width="200" height="118" rx="14" fill="#fff" stroke="#06B6D4" strokeOpacity="0.3" strokeWidth="0.8"/>

        {/* 공간 칩 5개 */}
        <g transform="translate(10, 12)">
          <rect x="0"   y="0" width="32" height="16" rx="4" fill="#06B6D4"/>
          <text x="16"  y="11" fontSize="7.5" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="Pretendard, sans-serif">거실</text>
          <rect x="36"  y="0" width="32" height="16" rx="4" fill="#fff" stroke="#E5E7EB" strokeWidth="0.5"/>
          <text x="52"  y="11" fontSize="7.5" fill="#3D434D" textAnchor="middle" fontFamily="Pretendard, sans-serif">침실</text>
          <rect x="72"  y="0" width="32" height="16" rx="4" fill="#fff" stroke="#E5E7EB" strokeWidth="0.5"/>
          <text x="88"  y="11" fontSize="7.5" fill="#3D434D" textAnchor="middle" fontFamily="Pretendard, sans-serif">주방</text>
          <rect x="108" y="0" width="32" height="16" rx="4" fill="#fff" stroke="#E5E7EB" strokeWidth="0.5"/>
          <text x="124" y="11" fontSize="7.5" fill="#3D434D" textAnchor="middle" fontFamily="Pretendard, sans-serif">욕실</text>
          <rect x="144" y="0" width="36" height="16" rx="4" fill="#fff" stroke="#E5E7EB" strokeWidth="0.5"/>
          <text x="162" y="11" fontSize="7.5" fill="#3D434D" textAnchor="middle" fontFamily="Pretendard, sans-serif">현관</text>
        </g>

        {/* 입력 박스 (가로) - 강조 */}
        <g transform="translate(10, 36)">
          <text x="0" y="6" fontSize="6" fill="#9AA1AD" fontFamily="Pretendard, sans-serif">가로 (mm)</text>
          <rect x="0" y="9" width="180" height="22" rx="5" fill="#fff" stroke="#2563EB" strokeWidth="1.2"/>
          <text x="172" y="24" fontSize="11" fontWeight="700" fill="#0E1116" textAnchor="end" fontFamily="Pretendard, sans-serif">7,200</text>
        </g>

        {/* 입력 박스 (세로) */}
        <g transform="translate(10, 64)">
          <text x="0" y="6" fontSize="6" fill="#9AA1AD" fontFamily="Pretendard, sans-serif">세로 (mm)</text>
          <rect x="0" y="9" width="180" height="22" rx="5" fill="#fff" stroke="#E5E7EB" strokeWidth="0.6"/>
          <text x="172" y="24" fontSize="11" fontWeight="700" fill="#0E1116" textAnchor="end" fontFamily="Pretendard, sans-serif">5,100</text>
        </g>

        {/* 면적 자동 표시 */}
        <g transform="translate(10, 96)">
          <rect x="0" y="0" width="180" height="16" rx="4" fill="#ECFEFF" stroke="#06B6D4" strokeOpacity="0.4" strokeWidth="0.5"/>
          <text x="6" y="11" fontSize="7" fill="#06B6D4" fontWeight="600" fontFamily="Pretendard, sans-serif">면적 (자동)</text>
          <text x="172" y="11" fontSize="9" fontWeight="700" fill="#06B6D4" textAnchor="end" fontFamily="Pretendard, sans-serif">36.72 ㎡</text>
        </g>
      </g>
    </svg>
  );
}

window.ModeSelectScreen = ModeSelectScreen;
