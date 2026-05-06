// 단순계산 화면 — 입력 + 결과 통합

function SimpleScreen({ onBackToMode }) {
  const T = window.TOKENS;
  const [phase, setPhase]       = React.useState('input'); // input | result
  const [roomId, setRoomId]     = React.useState('living');
  const [dimMode, setDimMode]   = React.useState('area');  // 'dim' (가로×세로) | 'area' (면적만)
  const [wMm, setW]             = React.useState('');
  const [hMm, setH]             = React.useState('');
  const [areaInput, setArea]    = React.useState('');
  const [lossRates, setLossRates] = React.useState({});    // { matKey: rate% }

  const roomDef = SIMPLE_ROOMS.find(r => r.id === roomId);

  // 거실은 dimMode 자동 area 고정
  React.useEffect(() => {
    if (!roomDef.allowDimMode) setDimMode('area');
  }, [roomId]);

  // 면적 자동 계산 (dim 모드)
  const wNum = parseFloat(wMm) || 0;
  const hNum = parseFloat(hMm) || 0;
  const aNum = parseFloat(areaInput) || 0;
  const calcArea = dimMode === 'dim'
    ? (wNum * hNum) / 1_000_000   // mm² → m²
    : aNum;
  const canCalc = dimMode === 'dim' ? (wNum > 0 && hNum > 0) : aNum > 0;

  const goCalc = () => {
    if (!canCalc) return;
    const init = {};
    SIMPLE_ROOM_FINISH[roomId].forEach(k => {
      init[k] = Math.round((QC_MATERIAL_SPECS[k].lossRate || 0) * 100);
    });
    setLossRates(init);
    setPhase('result');
  };

  const reset = () => {
    setPhase('input');
    setW(''); setH(''); setArea('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      {/* 상단 바 — 모드 표시 + 모드 변경 */}
      <div style={{
        padding: '8px 14px', background: T.brand.accentSoft,
        borderBottom: `1px solid ${T.brand.accent}33`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="box" size={13} color={T.brand.accent} strokeWidth={2.2}/>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: T.brand.accent, flex: 1 }}>단순계산 모드</span>
        <button onClick={onBackToMode} style={{
          height: 24, padding: '0 9px', borderRadius: 999,
          background: '#fff', border: `1px solid ${T.brand.accent}66`,
          color: T.brand.accent, fontSize: 10.5, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <Icon name="chevronLeft" size={10} color={T.brand.accent} strokeWidth={2.4}/>
          모드 변경
        </button>
      </div>

      {phase === 'input' ? (
        <SimpleInput
          roomId={roomId} setRoomId={setRoomId}
          roomDef={roomDef}
          dimMode={dimMode} setDimMode={setDimMode}
          wMm={wMm} setW={setW} hMm={hMm} setH={setH}
          areaInput={areaInput} setArea={setArea}
          calcArea={calcArea} canCalc={canCalc}
          onCalc={goCalc}
        />
      ) : (
        <SimpleResult
          roomId={roomId} roomDef={roomDef}
          dimMode={dimMode} wNum={wNum} hNum={hNum} calcArea={calcArea}
          lossRates={lossRates} setLossRates={setLossRates}
          onReset={reset}
        />
      )}
    </div>
  );
}

// ─── 입력 ────────────────────────────────────────────────
function SimpleInput({ roomId, setRoomId, roomDef, dimMode, setDimMode, wMm, setW, hMm, setH, areaInput, setArea, calcArea, canCalc, onCalc }) {
  const T = window.TOKENS;
  const [focusW, setFocusW] = React.useState(true);

  return (
    <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 공간 구분 */}
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: T.ink3, letterSpacing: 0.4, marginBottom: 6 }}>공간 구분</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5 }}>
          {SIMPLE_ROOMS.map(r => {
            const active = roomId === r.id;
            return (
              <button key={r.id} onClick={() => setRoomId(r.id)} style={{
                padding: '9px 4px', borderRadius: 9, border: 'none',
                background: active ? T.brand.accent : '#fff',
                color: active ? '#fff' : T.ink2,
                fontSize: 12, fontWeight: active ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: active ? 'none' : `inset 0 0 0 0.5px ${T.line}`,
              }}>{r.name}</button>
            );
          })}
        </div>
      </div>

      {/* 입력 모드 토글 */}
      <div style={{
        padding: 4, background: T.line, borderRadius: 9,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
      }}>
        <button onClick={() => roomDef.allowDimMode && setDimMode('dim')}
          disabled={!roomDef.allowDimMode}
          style={{
            padding: '7px', borderRadius: 7, border: 'none',
            background: dimMode === 'dim' ? '#fff' : 'transparent',
            color: dimMode === 'dim' ? T.ink : T.ink3,
            fontSize: 11.5, fontWeight: dimMode === 'dim' ? 700 : 500,
            cursor: roomDef.allowDimMode ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            opacity: roomDef.allowDimMode ? 1 : 0.45,
          }}>가로 × 세로</button>
        <button onClick={() => setDimMode('area')} style={{
          padding: '7px', borderRadius: 7, border: 'none',
          background: dimMode === 'area' ? '#fff' : 'transparent',
          color: dimMode === 'area' ? T.ink : T.ink3,
          fontSize: 11.5, fontWeight: dimMode === 'area' ? 700 : 500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>면적만</button>
      </div>

      {!roomDef.allowDimMode && (
        <div style={{
          fontSize: 10.5, color: T.ink3, padding: '6px 10px',
          background: T.warnSoft, borderRadius: 8, border: `1px dashed ${T.warn}55`,
        }}>ℹ️ 거실은 형태가 일정하지 않아 면적만 입력합니다</div>
      )}

      {/* 입력 필드 */}
      {dimMode === 'dim' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <SimpleInputField label="가로 (mm)" value={wMm} onChange={setW}
            focused={focusW} onFocus={() => setFocusW(true)}/>
          <SimpleInputField label="세로 (mm)" value={hMm} onChange={setH}
            focused={!focusW} onFocus={() => setFocusW(false)}/>
        </div>
      ) : (
        <SimpleInputField label="면적 (㎡)" value={areaInput} onChange={setArea}
          focused={true} onFocus={() => {}} step="0.01"/>
      )}

      {/* 계산 결과 미리보기 */}
      {dimMode === 'dim' && (
        <div style={{
          padding: '11px 14px', borderRadius: 10,
          background: T.brand.accentSoft,
          border: `1px solid ${T.brand.accent}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11.5, color: T.brand.accent, fontWeight: 600 }}>면적 (자동)</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: T.brand.accent, letterSpacing: -0.3 }}>
            {calcArea.toFixed(2)} ㎡
          </span>
        </div>
      )}

      <div style={{ flex: 1 }}/>

      <button onClick={onCalc} disabled={!canCalc} style={{
        padding: 14, borderRadius: 12, border: 'none',
        background: canCalc ? T.brand.primary : T.line,
        color: canCalc ? '#fff' : T.ink4,
        fontSize: 14, fontWeight: 700, letterSpacing: -0.2,
        boxShadow: canCalc ? `0 6px 16px ${T.brand.primary}2e` : 'none',
        cursor: canCalc ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
      }}>물량 계산하기</button>
    </div>
  );
}

function SimpleInputField({ label, value, onChange, focused, onFocus, step }) {
  const T = window.TOKENS;
  return (
    <div>
      <div style={{ fontSize: 10.5, color: T.ink3, fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>{label}</div>
      <input type="number" inputMode="decimal" step={step || '1'} value={value}
        onChange={e => onChange(e.target.value)} onFocus={onFocus}
        placeholder="0" style={{
          width: '100%', height: 50, padding: '0 14px',
          borderRadius: 10, background: '#fff',
          border: `${focused ? 1.5 : 0.5}px solid ${focused ? T.brand.primary : T.line}`,
          fontSize: 22, fontWeight: 600, letterSpacing: -0.5,
          textAlign: 'right', outline: 'none', fontFamily: 'inherit', color: T.ink,
        }}/>
    </div>
  );
}

// ─── 결과 ────────────────────────────────────────────────
function SimpleResult({ roomId, roomDef, dimMode, wNum, hNum, calcArea, lossRates, setLossRates, onReset }) {
  const T = window.TOKENS;
  const matKeys = SIMPLE_ROOM_FINISH[roomId];

  // 둘레 / 벽면적 계산
  // dim 모드: (w+h)*2 (m), area 모드: 정사각형 가정 √area * 4
  const perimM = dimMode === 'dim'
    ? (wNum + hNum) * 2 / 1000
    : Math.sqrt(calcArea) * 4;
  const wallArea = perimM * SIMPLE_CEILING_H;
  const floorArea = calcArea;
  const ceilArea = calcArea;

  const calcQty = (matKey) => {
    const spec = QC_MATERIAL_SPECS[matKey];
    const areaType = SIMPLE_MATERIAL_AREA_TYPE[matKey];
    const lossPct = lossRates[matKey] != null ? lossRates[matKey] : Math.round((spec.lossRate || 0) * 100);
    let baseAmt;
    if (areaType === 'floor')          baseAmt = floorArea / spec.coverage;
    else if (areaType === 'wall')      baseAmt = wallArea / spec.coverage;
    else if (areaType === 'ceiling')   baseAmt = ceilArea / spec.coverage;
    else if (areaType === 'perimeter') baseAmt = perimM;
    else if (areaType === 'perimeter_door') baseAmt = Math.max(0, perimM - 0.9);
    else if (areaType === 'fixture')   baseAmt = 1;
    else baseAmt = 0;
    const finalQty = Math.ceil(baseAmt * (1 + lossPct / 100));
    return { baseAmt, finalQty, lossPct };
  };

  const updateLoss = (matKey, val) => {
    const n = parseFloat(val);
    if (isNaN(n) || n < 0) return;
    setLossRates({ ...lossRates, [matKey]: n });
  };

  const dimText = dimMode === 'dim'
    ? `${wNum.toLocaleString()} × ${hNum.toLocaleString()} mm`
    : `면적 ${floorArea.toFixed(2)}㎡`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* 헤더 */}
      <div style={{
        padding: '12px 16px', background: '#fff',
        borderBottom: `1px solid ${T.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onReset} style={{
          width: 28, height: 28, borderRadius: 999, background: T.bg, border: 'none',
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevronLeft" size={14} color={T.ink2} strokeWidth={2.2}/>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>계산 결과</div>
          <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 1 }}>
            {roomDef.name} · {floorArea.toFixed(2)} ㎡ · {dimText}
          </div>
        </div>
      </div>

      {/* 자재 카드 */}
      <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {matKeys.map(k => {
          const spec = QC_MATERIAL_SPECS[k];
          const { baseAmt, finalQty, lossPct } = calcQty(k);
          return (
            <SimpleMatCard key={k} matKey={k} spec={spec}
              baseAmt={baseAmt} finalQty={finalQty} lossPct={lossPct}
              onLossChange={(v) => updateLoss(k, v)}/>
          );
        })}

        {/* 가정 안내 */}
        <div style={{
          marginTop: 6, padding: '8px 12px', borderRadius: 9,
          background: T.surfaceAlt, fontSize: 10.5, color: T.ink3, lineHeight: 1.5,
        }}>
          ※ 천장 높이 {SIMPLE_CEILING_H}m 기준
          {dimMode === 'area' && ', 정사각형 가정으로 둘레 추정'}
        </div>
      </div>

      <div style={{ padding: '8px 14px 14px', background: T.bg }}>
        <button onClick={onReset} style={{
          width: '100%', padding: 13, borderRadius: 11, border: `1px solid ${T.line}`,
          background: '#fff', color: T.ink2,
          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>다시 계산</button>
      </div>
    </div>
  );
}

function SimpleMatCard({ matKey, spec, baseAmt, finalQty, lossPct, onLossChange }) {
  const T = window.TOKENS;
  const [val, setVal] = React.useState(String(lossPct));
  React.useEffect(() => { setVal(String(lossPct)); }, [lossPct]);
  const commit = () => {
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0) onLossChange(n);
    else setVal(String(lossPct));
  };
  const catColor = {
    floor: '#185FA5', wall: '#3C3489', ceiling: '#3C3489',
    fixture: '#854F0B', etc: '#0F6E56',
  }[spec.cat] || T.ink3;
  const catBg = {
    floor: '#E6F1FB', wall: '#EEEDFE', ceiling: '#EEEDFE',
    fixture: '#FAEEDA', etc: '#E1F5EE',
  }[spec.cat] || T.surfaceAlt;
  const basis = SIMPLE_MATERIAL_BASIS[matKey] || '';

  return (
    <div style={{
      background: '#fff', borderRadius: 11, padding: 12,
      border: `0.5px solid ${T.line}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <span style={{
          fontSize: 9.5, fontWeight: 700, color: catColor,
          background: catBg, padding: '2px 7px', borderRadius: 4,
        }}>{QC_CAT_LABEL[spec.cat]}</span>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{spec.name}</span>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>{finalQty}</span>
        <span style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>{spec.unit}</span>
      </div>

      {/* 산정근거 */}
      <div style={{
        fontSize: 10.5, color: T.ink3, lineHeight: 1.45,
        padding: '6px 8px', background: T.surfaceAlt, borderRadius: 6, marginBottom: 7,
      }}>📐 {basis}</div>

      {/* 산출량 + 로스율 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 6, borderTop: `0.5px dashed ${T.lineSoft}`,
      }}>
        <span style={{ fontSize: 10.5, color: T.ink3 }}>
          산출 {baseAmt.toFixed(2)} · 로스율
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="number" inputMode="decimal" value={val}
            onChange={e => setVal(e.target.value)} onBlur={commit} style={{
              width: 50, height: 26, padding: '0 7px', borderRadius: 6,
              border: `0.5px solid ${T.line}`, background: T.surfaceAlt,
              fontSize: 12, fontWeight: 700, outline: 'none', textAlign: 'right',
              fontFamily: 'inherit',
            }}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.ink2 }}>%</span>
        </div>
      </div>
    </div>
  );
}

window.SimpleScreen = SimpleScreen;
