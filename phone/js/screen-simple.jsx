// 단순계산 화면 — 입력 + 결과 통합

function SimpleScreen({ onBackToMode }) {
  const T = window.TOKENS;
  const [phase, setPhase]     = React.useState('input'); // input | result
  const [dimMode, setDimMode] = React.useState('area');  // 'dim' | 'area'
  const [wMm, setW]           = React.useState('');
  const [hMm, setH]           = React.useState('');
  const [areaInput, setArea]  = React.useState('');
  const [lossRates, setLossRates] = React.useState({});

  // ─── 공간 인스턴스 목록 ────────────────────────────────
  const [roomInstances, setRoomInstances] = React.useState(() => [
    { id: 'i_living',   baseId: 'living',   name: '거실' },
    { id: 'i_bedroom1', baseId: 'bedroom',  name: '침실 1' },
    { id: 'i_kitchen',  baseId: 'kitchen',  name: '주방' },
    { id: 'i_bath1',    baseId: 'bath',     name: '욕실 1' },
    { id: 'i_entrance', baseId: 'entrance', name: '현관' },
  ]);
  const [activeId, setActiveId] = React.useState('i_living');

  const activeInstance = roomInstances.find(r => r.id === activeId) || roomInstances[0];
  const roomDef = SIMPLE_ROOMS.find(r => r.id === activeInstance.baseId);

  // ─── 공간 전환 ─────────────────────────────────────────
  const handleRoomSwitch = (id) => {
    if (id === activeId) return;
    setActiveId(id);
    setW(''); setH(''); setArea('');
    setPhase('input');
  };

  React.useEffect(() => {
    if (roomDef && !roomDef.allowDimMode) setDimMode('area');
  }, [activeId]);

  // ─── 침실/욕실 추가 ────────────────────────────────────
  const addRoom = (baseId) => {
    const count = roomInstances.filter(r => r.baseId === baseId).length + 1;
    const baseRoom = SIMPLE_ROOMS.find(r => r.id === baseId);
    const newId = `i_${baseId}_${Date.now()}`;
    const newInst = { id: newId, baseId, name: `${baseRoom.name} ${count}` };
    // 같은 baseId의 마지막 위치 뒤에 삽입
    const lastIdx = roomInstances.reduce((acc, r, i) => r.baseId === baseId ? i : acc, -1);
    const updated = [...roomInstances];
    updated.splice(lastIdx + 1, 0, newInst);
    setRoomInstances(updated);
    setActiveId(newId);
    setW(''); setH(''); setArea('');
    setPhase('input');
  };

  // ─── 침실/욕실 제거 ────────────────────────────────────
  const removeRoom = (id) => {
    const inst = roomInstances.find(r => r.id === id);
    if (!inst) return;
    const sameType = roomInstances.filter(r => r.baseId === inst.baseId);
    if (sameType.length <= 1) return; // 마지막 1개는 제거 불가
    const baseRoom = SIMPLE_ROOMS.find(r => r.id === inst.baseId);
    const filtered = roomInstances.filter(r => r.id !== id);
    // 남은 같은 타입 재번호
    let n = 1;
    filtered.forEach(r => {
      if (r.baseId === inst.baseId) r.name = `${baseRoom.name} ${n++}`;
    });
    setRoomInstances(filtered);
    if (activeId === id) {
      const next = filtered.find(r => r.baseId === inst.baseId) || filtered[0];
      setActiveId(next.id);
      setW(''); setH(''); setArea('');
      setPhase('input');
    }
  };

  // ─── 계산 ──────────────────────────────────────────────
  const wNum = parseFloat(wMm) || 0;
  const hNum = parseFloat(hMm) || 0;
  const aNum = parseFloat(areaInput) || 0;
  const calcArea = dimMode === 'dim' ? (wNum * hNum) / 1_000_000 : aNum;
  const canCalc  = dimMode === 'dim' ? (wNum > 0 && hNum > 0) : aNum > 0;

  const goCalc = () => {
    if (!canCalc) return;
    const init = {};
    SIMPLE_ROOM_FINISH[activeInstance.baseId].forEach(k => {
      init[k] = Math.round((QC_MATERIAL_SPECS[k].lossRate || 0) * 100);
    });
    setLossRates(init);
    setPhase('result');
  };

  const reset = () => { setPhase('input'); setW(''); setH(''); setArea(''); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: T.bg }}>
      {/* 상단 바 */}
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
          roomInstances={roomInstances}
          activeId={activeId}
          onRoomSwitch={handleRoomSwitch}
          onAddRoom={addRoom}
          onRemoveRoom={removeRoom}
          roomDef={roomDef}
          dimMode={dimMode} setDimMode={setDimMode}
          wMm={wMm} setW={setW} hMm={hMm} setH={setH}
          areaInput={areaInput} setArea={setArea}
          calcArea={calcArea} canCalc={canCalc}
          onCalc={goCalc}
        />
      ) : (
        <SimpleResult
          roomId={activeInstance.baseId}
          roomDef={roomDef}
          roomName={activeInstance.name}
          dimMode={dimMode} wNum={wNum} hNum={hNum} calcArea={calcArea}
          lossRates={lossRates} setLossRates={setLossRates}
          onReset={reset}
        />
      )}
    </div>
  );
}

// ─── 입력 ────────────────────────────────────────────────
function SimpleInput({
  roomInstances, activeId, onRoomSwitch, onAddRoom, onRemoveRoom,
  roomDef, dimMode, setDimMode, wMm, setW, hMm, setH,
  areaInput, setArea, calcArea, canCalc, onCalc,
}) {
  const T = window.TOKENS;
  const [focusW, setFocusW] = React.useState(true);

  return (
    <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* 공간 구분 */}
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: T.ink3, letterSpacing: 0.4, marginBottom: 7 }}>공간 구분</div>

        {/* 인스턴스 칩 목록 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 7 }}>
          {roomInstances.map(inst => {
            const active = activeId === inst.id;
            const canRemove = roomInstances.filter(r => r.baseId === inst.baseId).length > 1;
            return (
              <div key={inst.id} style={{ position: 'relative', display: 'inline-flex' }}>
                <button
                  onClick={() => onRoomSwitch(inst.id)}
                  style={{
                    padding: '8px 12px',
                    paddingRight: canRemove ? 24 : 12,
                    borderRadius: 9, border: 'none',
                    background: active ? T.brand.accent : '#fff',
                    color: active ? '#fff' : T.ink2,
                    fontSize: 12, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: active ? 'none' : `inset 0 0 0 0.5px ${T.line}`,
                    whiteSpace: 'nowrap',
                  }}
                >{inst.name}</button>
                {canRemove && (
                  <button
                    onClick={e => { e.stopPropagation(); onRemoveRoom(inst.id); }}
                    style={{
                      position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)',
                      width: 15, height: 15, borderRadius: 999,
                      background: active ? 'rgba(255,255,255,0.32)' : T.line,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, color: active ? '#fff' : T.ink3,
                      lineHeight: 1, padding: 0,
                    }}
                  >✕</button>
                )}
              </div>
            );
          })}
        </div>

        {/* 침실/욕실 추가 버튼 */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onAddRoom('bedroom')} style={{
            padding: '5px 10px', borderRadius: 8,
            border: `1px dashed ${T.brand.accent}77`,
            background: T.brand.accentSoft, color: T.brand.accent,
            fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Icon name="plus" size={10} color={T.brand.accent} strokeWidth={2.5}/>
            침실 추가
          </button>
          <button onClick={() => onAddRoom('bath')} style={{
            padding: '5px 10px', borderRadius: 8,
            border: `1px dashed ${T.brand.accent}77`,
            background: T.brand.accentSoft, color: T.brand.accent,
            fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Icon name="plus" size={10} color={T.brand.accent} strokeWidth={2.5}/>
            욕실 추가
          </button>
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
            fontFamily: 'inherit', opacity: roomDef.allowDimMode ? 1 : 0.45,
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

      {/* 면적 미리보기 */}
      {dimMode === 'dim' && (
        <div style={{
          padding: '11px 14px', borderRadius: 10,
          background: T.brand.accentSoft, border: `1px solid ${T.brand.accent}55`,
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
function SimpleResult({ roomId, roomDef, roomName, dimMode, wNum, hNum, calcArea, lossRates, setLossRates, onReset }) {
  const T = window.TOKENS;
  const matKeys = SIMPLE_ROOM_FINISH[roomId];

  const perimM = dimMode === 'dim'
    ? (wNum + hNum) * 2 / 1000
    : Math.sqrt(calcArea) * 4;
  const wallArea  = perimM * SIMPLE_CEILING_H;
  const floorArea = calcArea;
  const ceilArea  = calcArea;

  const calcQty = (matKey) => {
    const spec = QC_MATERIAL_SPECS[matKey];
    const areaType = SIMPLE_MATERIAL_AREA_TYPE[matKey];
    const lossPct = lossRates[matKey] != null ? lossRates[matKey] : Math.round((spec.lossRate || 0) * 100);
    let baseAmt;
    if (areaType === 'floor')             baseAmt = floorArea / spec.coverage;
    else if (areaType === 'wall')         baseAmt = wallArea / spec.coverage;
    else if (areaType === 'ceiling')      baseAmt = ceilArea / spec.coverage;
    else if (areaType === 'perimeter')    baseAmt = perimM;
    else if (areaType === 'perimeter_door') baseAmt = Math.max(0, perimM - 0.9);
    else if (areaType === 'fixture')      baseAmt = 1;
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
            {roomName} · {floorArea.toFixed(2)} ㎡ · {dimText}
          </div>
        </div>
      </div>

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

      <div style={{
        fontSize: 10.5, color: T.ink3, lineHeight: 1.45,
        padding: '6px 8px', background: T.surfaceAlt, borderRadius: 6, marginBottom: 7,
      }}>📐 {basis}</div>

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
