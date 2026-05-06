// 갤럭시 탭 S 스타일 가로형 프레임 (photo-organizer에서 재사용)

function TabletDevice({ width = 1200, height = 820, children }) {
  const BEZEL = 12;
  const outerW = width + BEZEL * 2;
  const outerH = height + BEZEL * 2;

  return (
    <div style={{ position: 'relative', width: outerW, height: outerH }}>
      <div style={{
        position: 'absolute', left: -4, top: '50%', transform: 'translateY(-50%)',
        width: 8, height: 8, borderRadius: 999,
        background: 'radial-gradient(circle at 30% 30%, #2A2D35, #000)',
        border: '1px solid #15181E', zIndex: 3,
        boxShadow: 'inset 0 0 2px rgba(255,255,255,0.15)',
      }}>
        <div style={{ position: 'absolute', top: 2, left: 2, width: 2, height: 2, borderRadius: 999, background: 'rgba(255,255,255,0.3)' }}/>
      </div>
      <div style={{ position: 'absolute', top: -3, right: 40, width: 80, height: 4, background: 'linear-gradient(90deg, #2A2D35, #15181E)', borderRadius: '2px 2px 0 0' }}/>
      <div style={{ position: 'absolute', top: -3, right: 160, width: 56, height: 4, background: 'linear-gradient(90deg, #2A2D35, #15181E)', borderRadius: '2px 2px 0 0' }}/>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 24,
        background: 'linear-gradient(145deg, #2A2D35 0%, #15181E 50%, #2A2D35 100%)',
        boxShadow: '0 40px 80px -15px rgba(0,0,0,0.6), 0 20px 40px -10px rgba(0,0,0,0.4)',
        padding: BEZEL,
      }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          borderRadius: 16, background: '#F4F6FA', overflow: 'hidden',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
        }}>{children}</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}/>
    </div>
  );
}

window.TabletDevice = TabletDevice;
