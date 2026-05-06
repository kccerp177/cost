// SVG 아이콘 세트 — Lucide 스타일 stroke-based
// 폰·태블릿 공용. <Icon name="..." size={16} color="..." />

const ICON_PATHS = {
  home:        'M3 12l9-9 9 9v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z',
  upload:      'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  building:    'M5 20V8l7-3 7 3v12 M5 20h14 M9 12h.01 M13 12h.01 M9 16h.01 M13 16h.01',
  search:      'M11 17a6 6 0 100-12 6 6 0 000 12z M16 16l5 5',
  share:       'M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7 M16 6l-4-4-4 4 M12 2v13',
  folder:      'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
  camera:      'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z M12 17a4 4 0 100-8 4 4 0 000 8z',
  image:       'M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z M9 11a2 2 0 100-4 2 2 0 000 4z M21 15l-5-5L5 21',
  images:      'M5 3h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M3 7v12a2 2 0 002 2h14',
  sofa:        'M4 10V7a2 2 0 012-2h12a2 2 0 012 2v3 M2 10h20v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7z M6 19v2 M18 19v2',
  chef:        'M6 14a4 4 0 014-4h4a4 4 0 014 4v7H6v-7z M12 6a3 3 0 11-3 3 M12 6a3 3 0 013 3 M9 10v-1a3 3 0 016 0v1',
  shower:      'M12 3v5 M5 8h14 M7 8v8a5 5 0 0010 0V8 M9 14v2 M13 14v2 M11 17v2',
  bed:         'M3 10V5 M3 15h18 M21 15V8a2 2 0 00-2-2h-7a2 2 0 00-2 2v4 M3 21v-4h18v4 M7 10a2 2 0 100-4 2 2 0 000 4z',
  door:        'M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16 M2 21h20 M15 12h.01',
  leaf:        'M11 20a8 8 0 008-8V4h-8a8 8 0 100 16z M2 22c4-4 6-8 9-10',
  hammer:      'M14 11l7 7-3 3-7-7 M14 11l-3 3-7-7 3-3 7 7z M3 7l4-4',
  paintroller: 'M4 8V5a2 2 0 012-2h10a2 2 0 012 2v3 M18 8H4 M11 11v4 M11 15h6a2 2 0 012 2v4H5v-4a2 2 0 012-2h4',
  wrench:      'M14 7a5 5 0 016 6l-9 9-6-6 9-9z M9 15l-4 4 M4 11l3 3',
  lightbulb:   'M9 18h6 M10 22h4 M12 2a7 7 0 00-4 12c1 1 2 2 2 4h4c0-2 1-3 2-4a7 7 0 00-4-12z',
  window:      'M4 4h16v16H4V4z M4 12h16 M12 4v16',
  stairs:      'M2 20h5v-4h5v-4h5V8h5',
  box:         'M21 8v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8 M3 8h18V4H3v4z M10 12h4',
  alert:       'M12 3l10 18H2L12 3z M12 10v5 M12 18h.01',
  warning:     'M12 9v4 M12 17h.01 M10 2l-9 16a2 2 0 002 3h18a2 2 0 002-3L14 2a2 2 0 00-4 0z',
  check:       'M20 6L9 17l-5-5',
  checkCircle: 'M22 12a10 10 0 11-20 0 10 10 0 0120 0z M9 12l2 2 4-4',
  x:           'M18 6L6 18 M6 6l12 12',
  xCircle:     'M12 22a10 10 0 100-20 10 10 0 000 20z M15 9l-6 6 M9 9l6 6',
  clock:       'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2',
  bell:        'M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9 M10 21a2 2 0 004 0',
  star:        'M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z',
  chevronLeft:  'M15 18l-6-6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown:  'M6 9l6 6 6-6',
  chevronUp:    'M18 15l-6-6-6 6',
  arrowLeft:    'M19 12H5 M12 19l-7-7 7-7',
  arrowRight:   'M5 12h14 M12 5l7 7-7 7',
  arrowUp:      'M12 19V5 M5 12l7-7 7 7',
  arrowDown:    'M12 5v14 M19 12l-7 7-7-7',
  plus:         'M12 5v14 M5 12h14',
  mail:         'M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z M22 6l-10 7L2 6',
  messageCircle:'M21 11c0 5-4 9-9 9-1 0-3 0-4-1l-5 1 1-5c-1-1-1-3-1-4 0-5 4-9 9-9s9 4 9 9z',
  link:         'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1 M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
  send:         'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  download:     'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  phone:        'M22 16c0 1 0 2-1 2-3 1-7 0-10-3S7 8 8 5c0-1 1-1 2-1h3l1 4-2 2c1 2 3 4 5 5l2-2 4 1v2z',
  edit:         'M12 20h9 M16 3l5 5L8 21H3v-5L16 3z',
  trash:        'M3 6h18 M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6',
  filter:       'M22 3H2l8 9v7l4 2v-9l8-9z',
  sliders:      'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  grid:         'M3 3h7v7H3V3z M14 3h7v7h-7V3z M14 14h7v7h-7v-7z M3 14h7v7H3v-7z',
  list:         'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  more:         'M12 13a1 1 0 100-2 1 1 0 000 2z M19 13a1 1 0 100-2 1 1 0 000 2z M5 13a1 1 0 100-2 1 1 0 000 2z',
  user:         'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  users:        'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-4 M16 3a4 4 0 010 8',
  mapPin:       'M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z',
  map:          'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16',
  calendar:     'M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z M16 2v4 M8 2v4 M3 10h18',
  sparkles:     'M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z M5 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z',
  trophy:       'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 01-10 0V4z M7 4H3v3a4 4 0 004 4 M17 4h4v3a4 4 0 01-4 4',
  palette:      'M12 2a10 10 0 00-7 17c1 1 3 1 4 0l1-1 1 1c1 1 3 1 4 0a10 10 0 00-3-17z M7 9a1 1 0 100-2 1 1 0 000 2z M11 6a1 1 0 100-2 1 1 0 000 2z M15 6a1 1 0 100-2 1 1 0 000 2z M17 10a1 1 0 100-2 1 1 0 000 2z',
  zap:          'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  settings:     'M12 15a3 3 0 100-6 3 3 0 000 6z M20 12a8 8 0 01-.2 1.8l2 1.5-2 3.5-2.4-.8a8 8 0 01-3 1.8l-.4 2.6h-4l-.4-2.6a8 8 0 01-3-1.8l-2.4.8-2-3.5 2-1.5A8 8 0 014 12a8 8 0 01.2-1.8l-2-1.5 2-3.5 2.4.8a8 8 0 013-1.8L10 1.4h4l.4 2.6a8 8 0 013 1.8l2.4-.8 2 3.5-2 1.5c.1.6.2 1.2.2 1.8z',
  eye:          'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z',
  flame:        'M12 2s6 6 6 11a6 6 0 01-12 0c0-2 1-4 2-5 0 2 1 3 2 3 0-4 2-6 2-9z',
};

function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.8, filled = false, style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) {
    if (typeof console !== 'undefined') console.warn(`[Icon] unknown name: ${name}`);
    return null;
  }
  const paths = d.split(/ (?=M)/);
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? color : 'none'} stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-hidden="true">
      {paths.map((p, i) => <path key={i} d={p}/>)}
    </svg>
  );
}

window.Icon = Icon;
window.ICON_PATHS = ICON_PATHS;
