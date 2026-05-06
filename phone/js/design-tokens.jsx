// Design tokens — Quantity Calculator (blue/teal 계열로 photo-organizer와 구분)

const TOKENS = {
  brand: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primarySoft: '#EFF6FF',
    primaryInk: '#1E3A8A',
    accent: '#06B6D4',
    accentSoft: '#ECFEFF',
  },
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F9FAFB',
  surfaceInk: '#0E1116',
  ink: '#0E1116',
  ink2: '#3D434D',
  ink3: '#6B7280',
  ink4: '#9AA1AD',
  line: '#E5E7EB',
  lineSoft: '#F1F3F5',
  success: '#10B981',
  successSoft: '#ECFDF5',
  warn: '#F59E0B',
  warnSoft: '#FFFBEB',
  danger: '#EF4444',
  dangerSoft: '#FEF2F2',
  shadowCard: '0 1px 2px rgba(15,23,42,0.04), 0 2px 8px rgba(15,23,42,0.04)',
  shadowFloat: '0 4px 14px rgba(15,23,42,0.08), 0 12px 32px rgba(15,23,42,0.10)',
  shadowDeep: '0 20px 50px rgba(15,23,42,0.14)',
  r: { xs: 6, sm: 10, md: 14, lg: 18, xl: 22, xxl: 28 },
  font: `'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', sans-serif`,
  mono: `'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace`,
};

function InstallGlobalStyles() {
  return (
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; font-family: ${TOKENS.font}; color: ${TOKENS.ink}; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
      body { background: #E9ECF1; }
      button { font-family: inherit; cursor: pointer; }
      input, textarea, select { font-family: inherit; }
      ::-webkit-scrollbar { width: 0; height: 0; }
      .no-scrollbar { scrollbar-width: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      @keyframes qc-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      @keyframes qc-spin { to { transform: rotate(360deg); } }
      @keyframes qc-slide-up { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes qc-fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes qc-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    `}</style>
  );
}

window.TOKENS = TOKENS;
window.InstallGlobalStyles = InstallGlobalStyles;
