// 도면 SVG 렌더러 — 기존 renderFloorplan 포팅
// SVG 문자열을 생성해서 dangerouslySetInnerHTML로 주입 (기존 로직 유지 목적)

function qcBuildFloorplanSvg(state, selectedRoomId, opts) {
  const o = opts || {};
  const lE = state.expansionState.living;
  const b3E = state.expansionState.bed3;
  const hl = o.highlightExpansion;

  const W = 620, H = 480, ox = 40, oy = 30, ow = 540, oh = 400;
  const lvW = lE ? 310 : 270;
  const b3Bot = b3E ? 400 : 360;

  // bbMap을 먼저 계산 (viewBox zoom + 벽 하이라이트 공용)
  const bbMap = {
    living:   { x1: ox, y1: oy, x2: ox + lvW, y2: oy + 220 },
    kitchen:  { x1: ox, y1: oy + 220, x2: ox + 200, y2: oy + 400 },
    entrance: { x1: ox + 200, y1: oy + 320, x2: ox + 310, y2: oy + 400 },
    bed1:     { x1: ox + 310, y1: oy, x2: ox + 540, y2: oy + 180 },
    bath1:    { x1: ox + 440, y1: oy + 180, x2: ox + 540, y2: oy + 260 },
    bed2:     { x1: ox + 310, y1: oy + 180, x2: ox + 440, y2: oy + 300 },
    bed3:     { x1: ox + 310, y1: oy + 300, x2: ox + 440, y2: b3Bot },
    bath2:    { x1: ox + 440, y1: oy + 260, x2: ox + 540, y2: oy + 400 },
  };

  // zoomRoomId가 있으면 해당 공간으로 viewBox 확대
  let vx = 0, vy = 0, vw = W, vh = H;
  if (o.zoomRoomId && bbMap[o.zoomRoomId]) {
    const bb = bbMap[o.zoomRoomId];
    const pad = 48;
    vx = bb.x1 - pad;
    vy = bb.y1 - pad;
    vw = (bb.x2 - bb.x1) + 2 * pad;
    vh = (bb.y2 - bb.y1) + 2 * pad;
  }

  let s = `<svg viewBox="${vx} ${vy} ${vw} ${vh}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">`;
  s += `<defs><pattern id="qc-gb" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M 16 0 L 0 0 0 16" fill="none" stroke="#E5E7EB" stroke-width="0.5"/></pattern>`;
  s += `<style>.qc-wl{fill:none;stroke:#0F172A;stroke-width:6;stroke-linejoin:miter}.qc-wli{fill:none;stroke:#FAF3E0;stroke-width:2.5}.qc-wt{fill:none;stroke:#1E293B;stroke-width:3.5;stroke-linejoin:miter}.qc-wti{fill:none;stroke:#FAF3E0;stroke-width:1.5}.qc-rl{font-family:Pretendard,sans-serif;font-size:12px;font-weight:700;fill:#0F172A;text-anchor:middle}.qc-ra{font-family:Pretendard,sans-serif;font-size:10px;fill:#64748B;text-anchor:middle}.qc-win{stroke:#1D4ED8;stroke-width:2.5;stroke-linecap:butt}.qc-da{fill:none;stroke:#64748B;stroke-width:1.2;stroke-dasharray:3 2}.qc-ez{stroke:#94A3B8;stroke-width:1;stroke-dasharray:4 3;fill:none}.qc-rbg{fill:#FAF3E0}.qc-bbg{fill:#E0E9F2}.qc-space{fill:transparent;cursor:pointer;transition:fill .15s}.qc-space:hover{fill:rgba(37,99,235,0.12)}.qc-space.qc-selected{fill:rgba(37,99,235,0.25);stroke:#1D4ED8;stroke-width:2}.qc-dim-line{stroke:#1D4ED8;stroke-width:1.2;fill:none}.qc-dim-text{font-family:Pretendard,sans-serif;font-size:10px;font-weight:700;fill:#1D4ED8}.qc-dim-info{font-family:Pretendard,sans-serif;font-size:9.5px;fill:#64748B;text-anchor:middle}</style></defs>`;

  s += `<rect width="${W}" height="${H}" fill="url(#qc-gb)"/>`;
  s += `<rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" class="qc-rbg"/>`;

  // 발코니 영역 표현
  if (!lE) { s += `<rect x="${ox + 270}" y="${oy}" width="40" height="220" class="qc-bbg"/><rect x="${ox + 270}" y="${oy}" width="40" height="220" class="qc-ez"/>`; }
  else if (hl) { s += `<rect x="${ox + 270}" y="${oy}" width="40" height="220" class="qc-ez"/>`; }
  if (!b3E) { s += `<rect x="${ox + 310}" y="${oy + 360}" width="130" height="40" class="qc-bbg"/><rect x="${ox + 310}" y="${oy + 360}" width="130" height="40" class="qc-ez"/>`; }
  else if (hl) { s += `<rect x="${ox + 310}" y="${oy + 360}" width="130" height="40" class="qc-ez"/>`; }

  const ln = (x1, y1, x2, y2, cOut, cIn, extra) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cOut}"${extra || ''}/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cIn}"${extra || ''}/>`;

  // 외벽 및 분할선
  s += `<rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" class="qc-wl"/><rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" class="qc-wli"/>`;
  s += ln(ox + 310, oy, ox + 310, oy + oh, 'qc-wl', 'qc-wli');
  s += ln(ox, oy + 220, ox + 310, oy + 220, 'qc-wt', 'qc-wti');
  s += ln(ox + 310, oy + 180, ox + ow, oy + 180, 'qc-wl', 'qc-wli');
  s += ln(ox + 310, oy + 300, ox + 440, oy + 300, 'qc-wt', 'qc-wti');
  s += ln(ox + 440, oy + 180, ox + 440, oy + 260, 'qc-wl', 'qc-wli');
  s += ln(ox + 440, oy + 260, ox + ow, oy + 260, 'qc-wl', 'qc-wli');
  s += ln(ox + 440, oy + 260, ox + 440, oy + oh, 'qc-wl', 'qc-wli');
  s += ln(ox + 200, oy + 320, ox + 310, oy + 320, 'qc-wt', 'qc-wti');
  s += ln(ox + 200, oy + 220, ox + 200, oy + oh, 'qc-wt', 'qc-wti');
  if (!lE) s += ln(ox + 270, oy, ox + 270, oy + 220, 'qc-wt', 'qc-wti');
  s += ln(ox + 310, oy + 360, ox + 440, oy + 360, 'qc-wt', 'qc-wti', b3E ? ' stroke-dasharray="4 3" opacity=".3"' : '');

  // 창호
  s += `<line x1="${ox + 60}" y1="${oy}" x2="${ox + 150}" y2="${oy}" class="qc-win"/>`;
  s += `<line x1="${ox + 160}" y1="${oy}" x2="${ox + 250}" y2="${oy}" class="qc-win"/>`;
  s += `<line x1="${ox + 370}" y1="${oy}" x2="${ox + 490}" y2="${oy}" class="qc-win"/>`;
  s += `<line x1="${ox + ow}" y1="${oy + 200}" x2="${ox + ow}" y2="${oy + 250}" class="qc-win"/>`;
  s += `<line x1="${ox + 340}" y1="${oy + oh}" x2="${ox + 420}" y2="${oy + oh}" class="qc-win"/>`;
  s += `<line x1="${ox}" y1="${oy + 280}" x2="${ox}" y2="${oy + 360}" class="qc-win"/>`;

  // 도어 아크
  function darc(cx, cy, r, sa, ea) {
    const sr = sa * Math.PI / 180, er = ea * Math.PI / 180;
    const x1 = cx + r * Math.cos(sr), y1 = cy + r * Math.sin(sr);
    const x2 = cx + r * Math.cos(er), y2 = cy + r * Math.sin(er);
    return `<path d="M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}" class="qc-da"/>`;
  }
  s += darc(ox + 310, oy + 150, 18, 0, 90);
  s += darc(ox + 310, oy + 270, 18, 0, 90);
  s += darc(ox + 310, oy + 330, 16, -90, 0);
  s += darc(ox + 440, oy + 230, 14, 90, 180);
  s += darc(ox + 440, oy + 290, 14, 90, 180);
  s += darc(ox + 260, oy + oh, 18, 180, 270);

  // 라벨
  const rooms = qcGetCurrentRooms(state);
  const rm = {};
  rooms.forEach(r => { rm[r.id] = r; });
  const labels = [
    { id: 'living', x: ox + (lE ? 155 : 135), y: oy + 110 },
    { id: 'bed1', x: ox + 425, y: oy + 90 },
    { id: 'bed2', x: ox + 375, y: oy + 240 },
    { id: 'bed3', x: ox + 375, y: oy + 330 },
    { id: 'kitchen', x: ox + 100, y: oy + 310 },
    { id: 'bath1', x: ox + 490, y: oy + 220 },
    { id: 'bath2', x: ox + 490, y: oy + 330 },
    { id: 'entrance', x: ox + 255, y: oy + 370 },
  ];
  labels.forEach(l => {
    const r = rm[l.id];
    if (!r) return;
    s += `<text x="${l.x}" y="${l.y}" class="qc-rl">${r.name}</text><text x="${l.x}" y="${l.y + 16}" class="qc-ra">${r.floor.toFixed(2)} ㎡</text>`;
  });
  if (!lE) s += `<text x="${ox + 290}" y="${oy + 115}" class="qc-ra" style="font-size:9px" transform="rotate(-90,${ox + 290},${oy + 115})">발코니</text>`;
  if (!b3E) s += `<text x="${ox + 375}" y="${oy + 382}" class="qc-ra" style="font-size:9px">발코니</text>`;

  // 공간 polygon (클릭 가능)
  const polys = [
    { id: 'living',   pts: `${ox},${oy} ${ox + lvW},${oy} ${ox + lvW},${oy + 220} ${ox},${oy + 220}` },
    { id: 'kitchen',  pts: `${ox},${oy + 220} ${ox + 200},${oy + 220} ${ox + 200},${oy + 400} ${ox},${oy + 400}` },
    { id: 'entrance', pts: `${ox + 200},${oy + 320} ${ox + 310},${oy + 320} ${ox + 310},${oy + 400} ${ox + 200},${oy + 400}` },
    { id: 'bed1',     pts: `${ox + 310},${oy} ${ox + 540},${oy} ${ox + 540},${oy + 180} ${ox + 310},${oy + 180}` },
    { id: 'bath1',    pts: `${ox + 440},${oy + 180} ${ox + 540},${oy + 180} ${ox + 540},${oy + 260} ${ox + 440},${oy + 260}` },
    { id: 'bed2',     pts: `${ox + 310},${oy + 180} ${ox + 440},${oy + 180} ${ox + 440},${oy + 300} ${ox + 310},${oy + 300}` },
    { id: 'bed3',     pts: `${ox + 310},${oy + 300} ${ox + 440},${oy + 300} ${ox + 440},${b3Bot} ${ox + 310},${b3Bot}` },
    { id: 'bath2',    pts: `${ox + 440},${oy + 260} ${ox + 540},${oy + 260} ${ox + 540},${oy + 400} ${ox + 440},${oy + 400}` },
  ];
  polys.forEach(p => {
    s += `<polygon points="${p.pts}" class="qc-space${selectedRoomId === p.id ? ' qc-selected' : ''}" data-room="${p.id}"/>`;
  });

  // 선택된 공간 치수 + 벽 하이라이트
  if (selectedRoomId) {
    const bb = bbMap[selectedRoomId];
    const selRoom = rooms.find(r => r.id === selectedRoomId);
    if (bb && selRoom) {
      const wMm = selRoom._wMm;
      const hMm = selRoom._hMm;
      const pad = 16, tick = 3;
      const midX = (bb.x1 + bb.x2) / 2;
      const hY = bb.y1 + pad;
      const hX1 = bb.x1 + pad, hX2 = bb.x2 - pad;
      let g = `<g pointer-events="none">`;
      g += `<line x1="${hX1}" y1="${hY}" x2="${hX2}" y2="${hY}" class="qc-dim-line"/>`;
      g += `<line x1="${hX1}" y1="${hY - tick}" x2="${hX1}" y2="${hY + tick}" class="qc-dim-line"/>`;
      g += `<line x1="${hX2}" y1="${hY - tick}" x2="${hX2}" y2="${hY + tick}" class="qc-dim-line"/>`;
      g += `<rect x="${midX - 22}" y="${hY - 8}" width="44" height="12" fill="#FAF3E0" opacity=".92"/>`;
      g += `<text x="${midX}" y="${hY + 2}" class="qc-dim-text" text-anchor="middle">${wMm}</text>`;

      const vX = bb.x1 + pad;
      const vY1 = bb.y1 + pad + 10, vY2 = bb.y2 - pad;
      if (vY2 - vY1 > 24) {
        g += `<line x1="${vX}" y1="${vY1}" x2="${vX}" y2="${vY2}" class="qc-dim-line"/>`;
        g += `<line x1="${vX - tick}" y1="${vY1}" x2="${vX + tick}" y2="${vY1}" class="qc-dim-line"/>`;
        g += `<line x1="${vX - tick}" y1="${vY2}" x2="${vX + tick}" y2="${vY2}" class="qc-dim-line"/>`;
        const vMid = (vY1 + vY2) / 2;
        g += `<rect x="${vX + 2}" y="${vMid - 8}" width="40" height="12" fill="#FAF3E0" opacity=".92"/>`;
        g += `<text x="${vX + 22}" y="${vMid + 2}" class="qc-dim-text" text-anchor="middle">${hMm}</text>`;
      }
      g += `</g>`;
      s += g;
    }

    // 선택된 벽 빨간색 하이라이트
    if (o.selectedWall) {
      const bb2 = bbMap[selectedRoomId];
      if (bb2) {
        let wx1, wy1, wx2, wy2;
        const sw = o.selectedWall;
        if (sw === 'top')    { wx1 = bb2.x1; wy1 = bb2.y1; wx2 = bb2.x2; wy2 = bb2.y1; }
        if (sw === 'right')  { wx1 = bb2.x2; wy1 = bb2.y1; wx2 = bb2.x2; wy2 = bb2.y2; }
        if (sw === 'bottom') { wx1 = bb2.x1; wy1 = bb2.y2; wx2 = bb2.x2; wy2 = bb2.y2; }
        if (sw === 'left')   { wx1 = bb2.x1; wy1 = bb2.y1; wx2 = bb2.x1; wy2 = bb2.y2; }
        if (wx1 !== undefined) {
          s += `<line x1="${wx1}" y1="${wy1}" x2="${wx2}" y2="${wy2}" stroke="#EF4444" stroke-width="5" stroke-linecap="round" pointer-events="none"/>`;
        }
      }
    }
  }

  s += '</svg>';
  return s;
}

// React 컴포넌트 래퍼 (클릭 이벤트 wiring)
function QcFloorplan({ state, selectedRoomId, selectedWall, zoomRoomId, onSelectRoom, highlightExpansion, style }) {
  const ref = React.useRef(null);
  const svgHtml = React.useMemo(
    () => qcBuildFloorplanSvg(state, selectedRoomId, { highlightExpansion, selectedWall, zoomRoomId }),
    [state, selectedRoomId, selectedWall, zoomRoomId, highlightExpansion]
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handlers = [];
    el.querySelectorAll('.qc-space').forEach(poly => {
      const fn = (e) => {
        e.stopPropagation();
        const id = poly.getAttribute('data-room');
        onSelectRoom && onSelectRoom(id);
      };
      poly.addEventListener('click', fn);
      handlers.push([poly, fn]);
    });
    const svg = el.querySelector('svg');
    const bgFn = (e) => {
      const t = e.target.tagName.toLowerCase();
      if (t !== 'polygon' && t !== 'text' && t !== 'line' && t !== 'path') {
        onSelectRoom && onSelectRoom(null);
      }
    };
    if (svg) svg.addEventListener('click', bgFn);
    return () => {
      handlers.forEach(([el, fn]) => el.removeEventListener('click', fn));
      if (svg) svg.removeEventListener('click', bgFn);
    };
  }, [svgHtml, onSelectRoom]);

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%', ...style }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}

Object.assign(window, { qcBuildFloorplanSvg, QcFloorplan });
