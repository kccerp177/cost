// Upload Screen — Step 1: 이미지 업로드 또는 기존 현장 선택

function UploadScreen({ activeSite, sites, onUploaded, onPickSite }) {
  const T = window.TOKENS;
  const [uploading, setUploading] = React.useState(false);
  const [showSitePicker, setShowPicker] = React.useState(false);

  const simulate = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); onUploaded(); }, 1200);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '14px 18px 12px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>업로드</div>
        <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2 }}>
          {activeSite ? `${activeSite.name}` : '이미지 업로드 또는 기존 현장 선택'}
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* 이미지 업로드 영역 */}
        <div style={{
          background: '#fff', borderRadius: 16, border: `1.5px dashed ${T.brand.primary}66`,
          padding: '28px 20px', textAlign: 'center', cursor: uploading ? 'default' : 'pointer',
          transition: 'all .15s',
        }} onClick={uploading ? undefined : simulate}>
          {uploading ? (
            <>
              <div style={{
                width: 44, height: 44, border: `3.5px solid ${T.line}`, borderTopColor: T.brand.primary,
                borderRadius: '50%', margin: '0 auto 14px',
                animation: 'qc-spin .8s linear infinite',
              }}/>
              <div style={{ fontSize: 14, fontWeight: 700 }}>업로드 중...</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 4 }}>개포주공_34평.jpg</div>
            </>
          ) : (
            <>
              <div style={{
                width: 58, height: 58, borderRadius: 14, background: T.brand.primarySoft,
                margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="upload" size={26} color={T.brand.primary} strokeWidth={2}/>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>평면 이미지를 업로드</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 6, lineHeight: 1.5 }}>
                네이버 부동산 · 분양 홍보<br/>JPG / PNG / WEBP · 최대 10MB
              </div>
              <div style={{
                marginTop: 16, display: 'inline-block',
                padding: '7px 18px', borderRadius: 999,
                background: T.brand.primary, color: '#fff',
                fontSize: 12, fontWeight: 700,
              }}>이미지 선택</div>
            </>
          )}
        </div>

        {/* 또는 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.line }}/>
          <span style={{ fontSize: 11, color: T.ink4, fontWeight: 500 }}>또는</span>
          <div style={{ flex: 1, height: 1, background: T.line }}/>
        </div>

        {/* 기존 현장 선택 버튼 */}
        <button onClick={() => setShowPicker(true)} style={{
          padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.line}`,
          background: '#fff', fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: T.brand.primarySoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="building" size={19} color={T.brand.primary} strokeWidth={2}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2 }}>기존 현장에서 선택</div>
            <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>
              이전 도면·물량을 재사용합니다
            </div>
          </div>
          <Icon name="chevronRight" size={16} color={T.ink4}/>
        </button>
      </div>

      {showSitePicker && (
        <SitePickerSheet
          sites={sites}
          onPick={(site) => { setShowPicker(false); onPickSite(site); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// 기존 현장 선택 바텀시트
function SitePickerSheet({ sites, onPick, onClose }) {
  const T = window.TOKENS;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'flex-end', zIndex: 30,
      animation: 'qc-fade-in .18s',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderRadius: '18px 18px 0 0',
        maxHeight: '72%', display: 'flex', flexDirection: 'column',
        animation: 'qc-slide-up .22s ease-out',
      }}>
        <div style={{ padding: '12px 18px 10px', borderBottom: `1px solid ${T.lineSoft}`, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>현장 선택</div>
            <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>물량 있음 → 바로 확정 / 도면만 있음 → 리뷰로</div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 999, background: T.bg, border: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>✕</button>
        </div>
        <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sites.map(site => (
              <SitePickerRow key={site.id} site={site} onPick={() => onPick(site)}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SitePickerRow({ site, onPick }) {
  const T = window.TOKENS;
  const stateText = site.hasQuantity ? '물량 완료' : site.hasDrawing ? '도면 있음' : '신규 등록';
  const stateBg = site.hasQuantity ? T.successSoft : site.hasDrawing ? T.brand.primarySoft : T.warnSoft;
  const stateColor = site.hasQuantity ? T.success : site.hasDrawing ? T.brand.primary : T.warn;
  return (
    <button onClick={onPick} style={{
      padding: 12, borderRadius: 12, border: `1px solid ${T.line}`,
      background: '#fff', fontFamily: 'inherit', cursor: 'pointer',
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
        <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>{site.size} · {site.updatedAt}</div>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 700, color: stateColor, background: stateBg,
        padding: '3px 8px', borderRadius: 999, flexShrink: 0,
      }}>{stateText}</span>
    </button>
  );
}

window.UploadScreen = UploadScreen;
