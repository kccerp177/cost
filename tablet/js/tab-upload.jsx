// Tablet Upload Tab

function TabUpload({ activeSite, sites, onUploaded, onPickSite }) {
  const T = window.TOKENS;
  const [uploading, setUploading] = React.useState(false);
  const simulate = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); onUploaded(); }, 1200);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      <div style={{ padding: '18px 24px 14px', background: '#fff', borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>업로드</div>
        <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>평면 이미지를 업로드하거나 기존 현장을 선택하세요</div>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, maxWidth: 960, margin: '0 auto' }}>
          {/* 업로드 영역 */}
          <div style={{
            background: '#fff', borderRadius: 16, border: `1.5px dashed ${T.brand.primary}66`,
            padding: '48px 24px', textAlign: 'center',
            cursor: uploading ? 'default' : 'pointer', minHeight: 360,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }} onClick={uploading ? undefined : simulate}>
            {uploading ? (
              <>
                <div style={{
                  width: 56, height: 56, border: `4px solid ${T.line}`, borderTopColor: T.brand.primary,
                  borderRadius: '50%', marginBottom: 18, animation: 'qc-spin .8s linear infinite',
                }}/>
                <div style={{ fontSize: 16, fontWeight: 700 }}>업로드 중...</div>
                <div style={{ fontSize: 13, color: T.ink3, marginTop: 6 }}>개포주공_34평.jpg</div>
              </>
            ) : (
              <>
                <div style={{
                  width: 80, height: 80, borderRadius: 20, background: T.brand.primarySoft,
                  margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="upload" size={36} color={T.brand.primary} strokeWidth={2}/>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>평면 이미지를 업로드</div>
                <div style={{ fontSize: 13, color: T.ink3, marginTop: 8, lineHeight: 1.6 }}>
                  네이버 부동산 · 분양 홍보 · 수기 스케치<br/>JPG / PNG / WEBP · 최대 10MB
                </div>
                <div style={{
                  marginTop: 22, padding: '10px 24px', borderRadius: 999,
                  background: T.brand.primary, color: '#fff', fontSize: 13, fontWeight: 700,
                }}>이미지 선택</div>
              </>
            )}
          </div>

          {/* 기존 현장 목록 */}
          <div style={{
            background: '#fff', borderRadius: 16, border: `1px solid ${T.lineSoft}`,
            padding: 16, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: T.ink2 }}>기존 현장에서 선택</div>
            <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sites.map(site => (
                <button key={site.id} onClick={() => onPickSite(site)} style={{
                  padding: 11, borderRadius: 10, border: `1px solid ${T.line}`,
                  background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: site.thumb + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon name="building" size={15} color={site.thumb} strokeWidth={2}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{site.name}</div>
                    <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>
                      {site.hasQuantity ? '물량 완료' : site.hasDrawing ? '도면 있음' : '신규'} · {site.updatedAt}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.TabUpload = TabUpload;
