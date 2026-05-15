// Upload Screen — 새 현장 도면 찾기
// 주소 검색 / 이미지 직접 업로드 두 가지 방법 제공

function UploadScreen({ activeSite, sites, onUploaded, onPickSite, onBack }) {
  const T = window.TOKENS;
  const [method, setMethod] = React.useState(null); // null | 'address' | 'image'

  if (method === 'address') {
    return <AddressSearchView T={T} onUploaded={onUploaded} onBack={() => setMethod(null)}/>;
  }
  if (method === 'image') {
    return <ImageUploadView T={T} onUploaded={onUploaded} onBack={() => setMethod(null)}/>;
  }

  // ── 방법 선택 화면 ─────────────────────────────────────────
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      {/* 헤더 */}
      <div style={{
        padding: '10px 14px', background: '#fff',
        borderBottom: `1px solid ${T.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            width: 34, height: 34, borderRadius: 10, border: 'none',
            background: T.surfaceAlt, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="chevronLeft" size={16} color={T.ink2} strokeWidth={2.2}/>
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>새 현장 도면 찾기</div>
          <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>
            {activeSite ? activeSite.name : '평면도를 찾는 방법을 선택하세요'}
          </div>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 안내 배너 */}
        <div style={{
          padding: '10px 12px', borderRadius: 10,
          background: T.brand.accentSoft, border: `1px solid ${T.brand.accent}33`,
          fontSize: 11, color: T.ink2, lineHeight: 1.6,
        }}>
          💡 평면도를 업로드하면 AI가 공간·벽·개구부를 자동으로 인식해 물량을 산출합니다
        </div>

        {/* 방법 1: 주소 검색 */}
        <button onClick={() => setMethod('address')} style={{
          padding: '18px 16px', borderRadius: 14,
          border: `1.5px solid ${T.brand.primary}55`,
          background: T.brand.primarySoft,
          fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13, background: T.brand.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="search" size={24} color="#fff" strokeWidth={2}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: T.brand.primary, letterSpacing: -0.2 }}>
              주소로 검색
            </div>
            <div style={{ fontSize: 11.5, color: T.ink2, marginTop: 5, lineHeight: 1.55 }}>
              아파트명·주소를 입력하면<br/>평면 이미지를 자동으로 찾아드립니다
            </div>
          </div>
          <Icon name="chevronRight" size={16} color={T.brand.primary}/>
        </button>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: T.line }}/>
          <span style={{ fontSize: 11, color: T.ink4, fontWeight: 500 }}>또는</span>
          <div style={{ flex: 1, height: 1, background: T.line }}/>
        </div>

        {/* 방법 2: 이미지 직접 업로드 */}
        <button onClick={() => setMethod('image')} style={{
          padding: '18px 16px', borderRadius: 14,
          border: `1.5px solid ${T.line}`,
          background: '#fff',
          fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13, background: T.surfaceAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="upload" size={24} color={T.ink2} strokeWidth={2}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink, letterSpacing: -0.2 }}>
              이미지 직접 업로드
            </div>
            <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 5, lineHeight: 1.55 }}>
              보유한 평면 이미지를 직접 업로드<br/>JPG · PNG · WEBP · 최대 10MB
            </div>
          </div>
          <Icon name="chevronRight" size={16} color={T.ink4}/>
        </button>
      </div>
    </div>
  );
}

// ── 주소 검색 뷰 ─────────────────────────────────────────────
function AddressSearchView({ T, onUploaded, onBack }) {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [selecting, setSelecting] = React.useState(false);

  const MOCK_RESULTS = [
    { id: 1, name: '개포주공 5단지 34평', addr: '서울 강남구 개포동', size: '34평 (112.4㎡)', color: '#3B82F6' },
    { id: 2, name: '개포주공 5단지 32평', addr: '서울 강남구 개포동', size: '32평 (105.8㎡)', color: '#8B5CF6' },
    { id: 3, name: '개포주공 7단지 28평', addr: '서울 강남구 개포동', size: '28평 (92.3㎡)', color: '#06B6D4' },
  ];

  const handleSearch = () => {
    if (!q.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => { setLoading(false); setResults(MOCK_RESULTS); }, 900);
  };

  const handleSelect = () => {
    setSelecting(true);
    setTimeout(() => { setSelecting(false); onUploaded(); }, 1000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      {/* 헤더 */}
      <div style={{
        padding: '10px 14px', background: '#fff',
        borderBottom: `1px solid ${T.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onBack} style={{
          width: 34, height: 34, borderRadius: 10, border: 'none',
          background: T.surfaceAlt, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="chevronLeft" size={16} color={T.ink2} strokeWidth={2.2}/>
        </button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>주소로 검색</div>
          <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>아파트명 또는 주소를 입력하세요</div>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 검색 입력 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Icon name="search" size={14} color={T.ink4} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}/>
            <input
              type="text" value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="예) 개포 주공 5단지, 반포 아크로"
              style={{
                width: '100%', height: 42, padding: '0 12px 0 34px', borderRadius: 11,
                border: `1.5px solid ${T.brand.primary}55`, background: '#fff',
                fontSize: 13, outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          <button onClick={handleSearch} style={{
            height: 42, padding: '0 16px', borderRadius: 11, border: 'none',
            background: T.brand.primary, color: '#fff',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
          }}>검색</button>
        </div>

        {/* 로딩 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div style={{
              width: 36, height: 36,
              border: `3px solid ${T.line}`, borderTopColor: T.brand.primary,
              borderRadius: '50%', margin: '0 auto 12px',
              animation: 'qc-spin .8s linear infinite',
            }}/>
            <div style={{ fontSize: 12.5, color: T.ink3 }}>평면도 검색 중...</div>
          </div>
        )}

        {/* 검색 결과 */}
        {results && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink3, letterSpacing: 0.2 }}>
              검색 결과 {results.length}건
            </div>
            {results.map(item => (
              <button key={item.id} onClick={handleSelect} disabled={selecting} style={{
                padding: '12px 14px', borderRadius: 12,
                border: `1px solid ${T.line}`, background: '#fff',
                fontFamily: 'inherit', cursor: selecting ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 10,
                  background: item.color + '18', border: `1px solid ${item.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name="image" size={22} color={item.color} strokeWidth={1.8}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>{item.name}</div>
                  <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 2 }}>📍 {item.addr}</div>
                  <div style={{ fontSize: 10.5, color: T.ink2, marginTop: 1 }}>{item.size}</div>
                </div>
                {selecting ? (
                  <div style={{
                    width: 18, height: 18,
                    border: `2.5px solid ${T.line}`, borderTopColor: T.brand.primary,
                    borderRadius: '50%', animation: 'qc-spin .8s linear infinite', flexShrink: 0,
                  }}/>
                ) : (
                  <div style={{
                    height: 28, padding: '0 13px', borderRadius: 999, border: 'none',
                    background: T.brand.primary, color: '#fff',
                    fontSize: 11.5, fontWeight: 700, flexShrink: 0,
                    display: 'flex', alignItems: 'center',
                  }}>선택</div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* 초기 안내 */}
        {!loading && !results && (
          <div style={{
            textAlign: 'center', padding: '36px 16px',
            background: '#fff', borderRadius: 14, border: `1px dashed ${T.line}`,
          }}>
            <Icon name="search" size={34} color={T.ink4} strokeWidth={1.5}/>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginTop: 14 }}>
              아파트명 또는 주소를 검색하면
            </div>
            <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 5, lineHeight: 1.5 }}>
              등록된 평면 이미지 목록이 표시됩니다
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 이미지 직접 업로드 뷰 ────────────────────────────────────
function ImageUploadView({ T, onUploaded, onBack }) {
  const [uploading, setUploading] = React.useState(false);

  const simulate = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); onUploaded(); }, 1200);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      {/* 헤더 */}
      <div style={{
        padding: '10px 14px', background: '#fff',
        borderBottom: `1px solid ${T.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onBack} style={{
          width: 34, height: 34, borderRadius: 10, border: 'none',
          background: T.surfaceAlt, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="chevronLeft" size={16} color={T.ink2} strokeWidth={2.2}/>
        </button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>이미지 직접 업로드</div>
          <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>평면 이미지 파일을 선택하세요</div>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* 업로드 영역 */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: `1.5px dashed ${T.brand.primary}66`,
          padding: '36px 20px', textAlign: 'center',
          cursor: uploading ? 'default' : 'pointer',
        }} onClick={uploading ? undefined : simulate}>
          {uploading ? (
            <>
              <div style={{
                width: 44, height: 44,
                border: `3.5px solid ${T.line}`, borderTopColor: T.brand.primary,
                borderRadius: '50%', margin: '0 auto 14px',
                animation: 'qc-spin .8s linear infinite',
              }}/>
              <div style={{ fontSize: 14, fontWeight: 700 }}>업로드 중...</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 4 }}>개포주공_34평.jpg</div>
            </>
          ) : (
            <>
              <div style={{
                width: 60, height: 60, borderRadius: 14, background: T.brand.primarySoft,
                margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="upload" size={28} color={T.brand.primary} strokeWidth={2}/>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2 }}>평면 이미지를 업로드</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 7, lineHeight: 1.55 }}>
                네이버 부동산 · 분양 홍보물<br/>JPG / PNG / WEBP · 최대 10MB
              </div>
              <div style={{
                marginTop: 18, display: 'inline-block',
                padding: '9px 22px', borderRadius: 999,
                background: T.brand.primary, color: '#fff',
                fontSize: 13, fontWeight: 700,
              }}>이미지 선택</div>
            </>
          )}
        </div>

        {/* 안내 */}
        <div style={{
          padding: '10px 12px', borderRadius: 10,
          background: T.surfaceAlt, border: `1px solid ${T.lineSoft}`,
          fontSize: 11, color: T.ink3, lineHeight: 1.65,
        }}>
          📌 네이버 부동산, 분양 홍보물, 건축도면 사진 모두 사용 가능합니다
        </div>
      </div>
    </div>
  );
}

// 기존 현장 선택 바텀시트 (하위 호환 유지)
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
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 999, background: T.bg, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
        </div>
        <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sites.map(site => (
              <button key={site.id} onClick={() => onPick(site)} style={{
                padding: 12, borderRadius: 12, border: `1px solid ${T.line}`,
                background: '#fff', fontFamily: 'inherit', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: site.thumb + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="building" size={17} color={site.thumb} strokeWidth={2}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{site.name}</div>
                  <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>{site.size} · {site.updatedAt}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.UploadScreen = UploadScreen;
