/* ===== SVG 도면 렌더링 ===== */

function renderFloorplan(containerId, options = {}) {
  const { showLabels = true, highlightExpansion = false } = options;
  const container = document.getElementById(containerId);
  if (!container) return;

  const livingExp = expansionState.living;
  const bed3Exp = expansionState.bed3;

  const W = 620, H = 480;

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-height:440px;">`;
  svg += `<defs><style>
    .wall { fill: none; stroke: #1E293B; stroke-width: 4; stroke-linecap: round; }
    .wall-thin { fill: none; stroke: #64748B; stroke-width: 2; }
    .room-fill { opacity: 0.12; }
    .room-label { font-family: 'Noto Sans KR', sans-serif; font-size: 12px; font-weight: 600; fill: #334155; text-anchor: middle; }
    .room-area { font-family: 'Noto Sans KR', sans-serif; font-size: 10px; fill: #64748B; text-anchor: middle; }
    .door-arc { fill: none; stroke: #F59E0B; stroke-width: 1.5; stroke-dasharray: 4 2; }
    .window { stroke: #06B6D4; stroke-width: 3; stroke-linecap: round; }
    .expansion-zone { stroke: #2563EB; stroke-width: 1.5; stroke-dasharray: 6 3; }
  </style></defs>`;

  const ox = 40, oy = 30;
  const ow = 540, oh = 400;

  svg += `<rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" fill="white" rx="2"/>`;

  const rooms = getCurrentRooms();

  // 거실
  const lvW = livingExp ? 310 : 270;
  svg += `<rect x="${ox}" y="${oy}" width="${lvW}" height="220" class="room-fill" fill="${ROOM_COLORS.living}"/>`;

  // 거실 발코니
  if (livingExp) {
    svg += `<rect x="${ox + 270}" y="${oy}" width="40" height="220" class="room-fill" fill="${ROOM_COLORS.bal_living}" opacity="0.2"/>`;
    if (highlightExpansion) svg += `<rect x="${ox + 270}" y="${oy}" width="40" height="220" class="expansion-zone" fill="none"/>`;
  } else {
    svg += `<rect x="${ox + 270}" y="${oy}" width="40" height="220" fill="#F1F5F9" opacity="0.5"/>`;
    svg += `<rect x="${ox + 270}" y="${oy}" width="40" height="220" class="expansion-zone" fill="none"/>`;
  }

  // 주방
  svg += `<rect x="${ox}" y="${oy + 220}" width="200" height="180" class="room-fill" fill="${ROOM_COLORS.kitchen}"/>`;
  // 현관
  svg += `<rect x="${ox + 200}" y="${oy + 320}" width="110" height="80" class="room-fill" fill="${ROOM_COLORS.entrance}"/>`;
  // 침실1
  svg += `<rect x="${ox + 310}" y="${oy}" width="230" height="180" class="room-fill" fill="${ROOM_COLORS.bed1}"/>`;
  // 욕실1
  svg += `<rect x="${ox + 440}" y="${oy + 180}" width="100" height="80" class="room-fill" fill="${ROOM_COLORS.bath1}"/>`;
  // 침실2
  svg += `<rect x="${ox + 310}" y="${oy + 180}" width="130" height="120" class="room-fill" fill="${ROOM_COLORS.bed2}"/>`;
  // 침실3
  const b3H = bed3Exp ? 140 : 100;
  svg += `<rect x="${ox + 310}" y="${oy + 300}" width="130" height="${b3H}" class="room-fill" fill="${ROOM_COLORS.bed3}"/>`;

  // 침실3 발코니
  if (bed3Exp) {
    svg += `<rect x="${ox + 310}" y="${oy + 360}" width="130" height="40" class="room-fill" fill="${ROOM_COLORS.bal_bed3}" opacity="0.2"/>`;
    if (highlightExpansion) svg += `<rect x="${ox + 310}" y="${oy + 360}" width="130" height="40" class="expansion-zone" fill="none"/>`;
  } else {
    svg += `<rect x="${ox + 310}" y="${oy + 360}" width="130" height="40" fill="#F1F5F9" opacity="0.5"/>`;
    svg += `<rect x="${ox + 310}" y="${oy + 360}" width="130" height="40" class="expansion-zone" fill="none"/>`;
  }

  // 공용욕실
  svg += `<rect x="${ox + 440}" y="${oy + 260}" width="100" height="140" class="room-fill" fill="${ROOM_COLORS.bath2}"/>`;
  // 복도
  svg += `<rect x="${ox + 200}" y="${oy + 220}" width="110" height="100" fill="white" opacity="0.5"/>`;

  // === 벽체 ===
  svg += `<rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" class="wall" fill="none"/>`;
  svg += `<line x1="${ox + 310}" y1="${oy}" x2="${ox + 310}" y2="${oy + oh}" class="wall"/>`;
  svg += `<line x1="${ox}" y1="${oy + 220}" x2="${ox + 310}" y2="${oy + 220}" class="wall-thin"/>`;
  svg += `<line x1="${ox + 310}" y1="${oy + 180}" x2="${ox + ow}" y2="${oy + 180}" class="wall"/>`;
  svg += `<line x1="${ox + 310}" y1="${oy + 300}" x2="${ox + 440}" y2="${oy + 300}" class="wall-thin"/>`;
  svg += `<line x1="${ox + 440}" y1="${oy + 180}" x2="${ox + 440}" y2="${oy + 260}" class="wall"/>`;
  svg += `<line x1="${ox + 440}" y1="${oy + 260}" x2="${ox + ow}" y2="${oy + 260}" class="wall"/>`;
  svg += `<line x1="${ox + 440}" y1="${oy + 260}" x2="${ox + 440}" y2="${oy + oh}" class="wall"/>`;
  svg += `<line x1="${ox + 200}" y1="${oy + 320}" x2="${ox + 310}" y2="${oy + 320}" class="wall-thin"/>`;
  svg += `<line x1="${ox + 200}" y1="${oy + 220}" x2="${ox + 200}" y2="${oy + oh}" class="wall-thin"/>`;

  if (!livingExp) {
    svg += `<line x1="${ox + 270}" y1="${oy}" x2="${ox + 270}" y2="${oy + 220}" class="wall-thin"/>`;
  }
  svg += `<line x1="${ox + 310}" y1="${oy + 360}" x2="${ox + 440}" y2="${oy + 360}" class="wall-thin" ${bed3Exp ? 'stroke-dasharray="4 3" opacity="0.3"' : ''}/>`;

  // === 창문 ===
  svg += `<line x1="${ox + 60}" y1="${oy}" x2="${ox + 150}" y2="${oy}" class="window"/>`;
  svg += `<line x1="${ox + 160}" y1="${oy}" x2="${ox + 250}" y2="${oy}" class="window"/>`;
  svg += `<line x1="${ox + 370}" y1="${oy}" x2="${ox + 490}" y2="${oy}" class="window"/>`;
  svg += `<line x1="${ox + ow}" y1="${oy + 200}" x2="${ox + ow}" y2="${oy + 250}" class="window"/>`;
  svg += `<line x1="${ox + 340}" y1="${oy + oh}" x2="${ox + 420}" y2="${oy + oh}" class="window"/>`;
  svg += `<line x1="${ox}" y1="${oy + 280}" x2="${ox}" y2="${oy + 360}" class="window"/>`;

  // === 도어 ===
  const doorArc = (cx, cy, r, startAngle, endAngle) => {
    const s = startAngle * Math.PI / 180;
    const e = endAngle * Math.PI / 180;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    return `<path d="M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}" class="door-arc"/>`;
  };
  svg += doorArc(ox + 310, oy + 150, 20, 0, 90);
  svg += doorArc(ox + 310, oy + 270, 20, 0, 90);
  svg += doorArc(ox + 310, oy + 330, 18, -90, 0);
  svg += doorArc(ox + 440, oy + 230, 16, 90, 180);
  svg += doorArc(ox + 440, oy + 290, 16, 90, 180);
  svg += doorArc(ox + 260, oy + oh, 20, 180, 270);

  // === 라벨 ===
  if (showLabels) {
    const roomMap = {};
    rooms.forEach(r => roomMap[r.id] = r);

    const labels = [
      { id: 'living',   x: ox + (livingExp ? 155 : 135), y: oy + 110 },
      { id: 'bed1',     x: ox + 425, y: oy + 90 },
      { id: 'bed2',     x: ox + 375, y: oy + 240 },
      { id: 'bed3',     x: ox + 375, y: oy + 330 },
      { id: 'kitchen',  x: ox + 100, y: oy + 310 },
      { id: 'bath1',    x: ox + 490, y: oy + 220 },
      { id: 'bath2',    x: ox + 490, y: oy + 330 },
      { id: 'entrance', x: ox + 255, y: oy + 370 },
    ];

    labels.forEach(l => {
      const r = roomMap[l.id];
      if (!r) return;
      svg += `<text x="${l.x}" y="${l.y}" class="room-label">${r.name}</text>`;
      svg += `<text x="${l.x}" y="${l.y + 16}" class="room-area">${r.floor.toFixed(1)}㎡</text>`;
    });

    if (!livingExp) {
      svg += `<text x="${ox + 290}" y="${oy + 115}" class="room-area" style="font-size:9px;" transform="rotate(-90,${ox + 290},${oy + 115})">발코니</text>`;
    }
    if (!bed3Exp) {
      svg += `<text x="${ox + 375}" y="${oy + 382}" class="room-area" style="font-size:9px;">발코니</text>`;
    }
  }

  svg += `</svg>`;
  container.innerHTML = svg;
}
