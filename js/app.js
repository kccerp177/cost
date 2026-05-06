var ROOM_COLORS={living:'#3B82F6',bed1:'#8B5CF6',bed2:'#A855F7',bed3:'#EC4899',kitchen:'#F59E0B',bath1:'#06B6D4',bath2:'#14B8A6',entrance:'#6366F1'};
var BASE_ROOMS=[{id:'living',name:'거실',floor:28.5,wall:42.3,ceiling:28.5,perimeter:22.4,doors:0,windows:2},{id:'bed1',name:'침실1(안방)',floor:14.2,wall:28.6,ceiling:14.2,perimeter:15.2,doors:1,windows:1},{id:'bed2',name:'침실2',floor:10.8,wall:23.4,ceiling:10.8,perimeter:13.2,doors:1,windows:1},{id:'bed3',name:'침실3(아이방)',floor:9.2,wall:21.0,ceiling:9.2,perimeter:12.4,doors:1,windows:1},{id:'kitchen',name:'주방',floor:8.4,wall:18.6,ceiling:8.4,perimeter:11.8,doors:0,windows:1},{id:'bath1',name:'욕실1(안방)',floor:3.8,wall:14.2,ceiling:3.8,perimeter:7.8,doors:1,windows:0},{id:'bath2',name:'공용욕실',floor:4.2,wall:15.6,ceiling:4.2,perimeter:8.4,doors:1,windows:0},{id:'entrance',name:'현관',floor:3.2,wall:8.4,ceiling:3.2,perimeter:7.2,doors:1,windows:0}];
var EXPANSIONS={living:{addFloor:6.8,addWall:12.4,addPerimeter:5.2},bed3:{addFloor:4.2,addWall:8.6,addPerimeter:3.6}};
var expansionState={living:true,bed3:false};
var RECOGNITION=[{label:'벽체',count:24,color:'#64748B'},{label:'바닥',count:8,color:'#3B82F6'},{label:'천장',count:8,color:'#8B5CF6'},{label:'도어',count:6,color:'#F59E0B'},{label:'창호',count:6,color:'#06B6D4'},{label:'공간',count:8,color:'#10B981'}];
var MATERIAL_SPECS={floor_wood:{name:'강마루',unit:'박스',coverage:1.3,lossRate:.10,cat:'floor'},floor_tile:{name:'바닥타일',unit:'장',coverage:.09,lossRate:.08,cat:'floor'},floor_marble:{name:'대리석(바닥)',unit:'㎡',coverage:1.0,lossRate:.05,cat:'floor'},wallpaper:{name:'실크벽지',unit:'롤',coverage:5.3,lossRate:.15,cat:'wall'},wall_tile:{name:'벽타일',unit:'장',coverage:.09,lossRate:.10,cat:'wall'},wall_marble:{name:'대리석(벽)',unit:'㎡',coverage:1.0,lossRate:.05,cat:'wall'},wall_paint:{name:'페인트',unit:'L',coverage:6.0,lossRate:.10,cat:'wall'},ceiling_paper:{name:'천장도배',unit:'롤',coverage:5.3,lossRate:.15,cat:'ceiling'},molding:{name:'천장몰딩',unit:'m',coverage:1.0,lossRate:.05,cat:'ceiling'},baseboard:{name:'걸레받이',unit:'m',coverage:1.0,lossRate:.05,cat:'floor'},door:{name:'도어 세트',unit:'세트',coverage:1.0,lossRate:0,cat:'fixture'},bath_fixture:{name:'도기/수전',unit:'세트',coverage:1.0,lossRate:0,cat:'fixture'},bond:{name:'도배 본드',unit:'통',coverage:25.0,lossRate:.10,cat:'etc'}};
var ROOM_FINISH={living:{floor:'floor_wood',wall:'wallpaper',ceiling:'ceiling_paper'},bed1:{floor:'floor_wood',wall:'wallpaper',ceiling:'ceiling_paper'},bed2:{floor:'floor_wood',wall:'wallpaper',ceiling:'ceiling_paper'},bed3:{floor:'floor_wood',wall:'wallpaper',ceiling:'ceiling_paper'},kitchen:{floor:'floor_wood',wall:'wallpaper',ceiling:'ceiling_paper'},bath1:{floor:'floor_tile',wall:'wall_tile',ceiling:'ceiling_paper'},bath2:{floor:'floor_tile',wall:'wall_tile',ceiling:'ceiling_paper'},entrance:{floor:'floor_tile',wall:'wallpaper',ceiling:'ceiling_paper'}};
var finishOverrides={living_tv_wall:'wallpaper',entrance_floor:'floor_tile'};
var selectedRoomId=null;
var ROOM_DIMS={
  living:{wMm:6270,wMmExp:7200,hMm:5100,doors:[],windows:[1712,2078]},
  bed1:{wMm:4600,hMm:3600,doors:[900],windows:[2078]},
  bed2:{wMm:2663,hMm:3677,doors:[900],windows:[2663]},
  bed3:{wMm:3028,hMm:3597,hMmExp:4000,doors:[900],windows:[3028]},
  kitchen:{wMm:2781,hMm:3762,doors:[],windows:[]},
  bath1:{wMm:1594,hMm:2341,doors:[700],windows:[]},
  bath2:{wMm:1678,hMm:2184,doors:[700],windows:[]},
  entrance:{wMm:2663,hMm:1762,doors:[900],windows:[]}
};

function getCurrentRooms(){return BASE_ROOMS.map(function(r){var room=Object.assign({},r);if(r.id==='living'&&expansionState.living){var e=EXPANSIONS.living;room.floor+=e.addFloor;room.wall+=e.addWall;room.ceiling+=e.addFloor;room.perimeter+=e.addPerimeter}if(r.id==='bed3'&&expansionState.bed3){var e2=EXPANSIONS.bed3;room.floor+=e2.addFloor;room.wall+=e2.addWall;room.ceiling+=e2.addFloor;room.perimeter+=e2.addPerimeter}return room})}

function calcMaterials(){var rooms=getCurrentRooms(),mats={};function add(k,area){var s=MATERIAL_SPECS[k];if(!s)return;if(!mats[k])mats[k]=Object.assign({},s,{rawQty:0,qty:0});mats[k].rawQty+=area/s.coverage;mats[k].qty=Math.ceil(mats[k].rawQty*(1+s.lossRate))}rooms.forEach(function(room){var f=ROOM_FINISH[room.id];if(!f)return;if(room.id==='entrance'){var fk=finishOverrides.entrance_floor==='marble'?'floor_marble':'floor_tile';add(fk,room.floor)}else{add(f.floor,room.floor)}if(room.id==='living'){var tvA=6.0,restA=room.wall-tvA;var tk=finishOverrides.living_tv_wall==='marble'?'wall_marble':finishOverrides.living_tv_wall==='paint'?'wall_paint':'wallpaper';add(tk,tvA);add(f.wall,restA)}else{add(f.wall,room.wall)}add(f.ceiling,room.ceiling);if(room.id.indexOf('bath')!==0){add('molding',room.perimeter);add('baseboard',room.perimeter-room.doors*0.9)}});add('door',rooms.reduce(function(s,r){return s+r.doors},0));add('bath_fixture',rooms.filter(function(r){return r.id.indexOf('bath')===0}).length);var pa=rooms.reduce(function(s,r){var f=ROOM_FINISH[r.id];var a=0;if(f&&f.wall==='wallpaper')a+=r.wall;if(f&&f.ceiling==='ceiling_paper')a+=r.ceiling;return s+a},0);add('bond',pa);return mats}

function renderFloorplan(cid,opts){
  var o=opts||{},hl=o.highlightExpansion;
  var c=document.getElementById(cid);if(!c)return;
  var lE=expansionState.living,b3E=expansionState.bed3;
  var W=620,H=480,ox=40,oy=30,ow=540,oh=400;
  var lvW=lE?310:270,b3Bot=b3E?400:360;
  var s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  s+='<defs><pattern id="gb" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M 16 0 L 0 0 0 16" fill="none" stroke="#E5E7EB" stroke-width="0.5"/></pattern>';
  s+='<style>.wl{fill:none;stroke:#0F172A;stroke-width:6;stroke-linejoin:miter}.wli{fill:none;stroke:#FAF3E0;stroke-width:2.5}.wt{fill:none;stroke:#1E293B;stroke-width:3.5;stroke-linejoin:miter}.wti{fill:none;stroke:#FAF3E0;stroke-width:1.5}.rl{font-family:Noto Sans KR,sans-serif;font-size:12px;font-weight:700;fill:#0F172A;text-anchor:middle}.ra{font-family:Noto Sans KR,sans-serif;font-size:10px;fill:#64748B;text-anchor:middle}.win{stroke:#1D4ED8;stroke-width:2.5;stroke-linecap:butt}.da{fill:none;stroke:#64748B;stroke-width:1.2;stroke-dasharray:3 2}.ez{stroke:#94A3B8;stroke-width:1;stroke-dasharray:4 3;fill:none}.rbg{fill:#FAF3E0}.bbg{fill:#E0E9F2}</style></defs>';
  s+='<rect width="'+W+'" height="'+H+'" fill="url(#gb)"/>';
  s+='<rect x="'+ox+'" y="'+oy+'" width="'+ow+'" height="'+oh+'" class="rbg"/>';
  if(!lE){s+='<rect x="'+(ox+270)+'" y="'+oy+'" width="40" height="220" class="bbg"/><rect x="'+(ox+270)+'" y="'+oy+'" width="40" height="220" class="ez"/>';}else if(hl){s+='<rect x="'+(ox+270)+'" y="'+oy+'" width="40" height="220" class="ez"/>';}
  if(!b3E){s+='<rect x="'+(ox+310)+'" y="'+(oy+360)+'" width="130" height="40" class="bbg"/><rect x="'+(ox+310)+'" y="'+(oy+360)+'" width="130" height="40" class="ez"/>';}else if(hl){s+='<rect x="'+(ox+310)+'" y="'+(oy+360)+'" width="130" height="40" class="ez"/>';}
  function ln(x1,y1,x2,y2,cOut,cIn,extra){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cOut+'"'+(extra||'')+'/><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cIn+'"'+(extra||'')+'/>';}
  s+='<rect x="'+ox+'" y="'+oy+'" width="'+ow+'" height="'+oh+'" class="wl"/><rect x="'+ox+'" y="'+oy+'" width="'+ow+'" height="'+oh+'" class="wli"/>';
  s+=ln(ox+310,oy,ox+310,oy+oh,'wl','wli');
  s+=ln(ox,oy+220,ox+310,oy+220,'wt','wti');
  s+=ln(ox+310,oy+180,ox+ow,oy+180,'wl','wli');
  s+=ln(ox+310,oy+300,ox+440,oy+300,'wt','wti');
  s+=ln(ox+440,oy+180,ox+440,oy+260,'wl','wli');
  s+=ln(ox+440,oy+260,ox+ow,oy+260,'wl','wli');
  s+=ln(ox+440,oy+260,ox+440,oy+oh,'wl','wli');
  s+=ln(ox+200,oy+320,ox+310,oy+320,'wt','wti');
  s+=ln(ox+200,oy+220,ox+200,oy+oh,'wt','wti');
  if(!lE)s+=ln(ox+270,oy,ox+270,oy+220,'wt','wti');
  s+=ln(ox+310,oy+360,ox+440,oy+360,'wt','wti',b3E?' stroke-dasharray="4 3" opacity=".3"':'');
  s+='<line x1="'+(ox+60)+'" y1="'+oy+'" x2="'+(ox+150)+'" y2="'+oy+'" class="win"/>';
  s+='<line x1="'+(ox+160)+'" y1="'+oy+'" x2="'+(ox+250)+'" y2="'+oy+'" class="win"/>';
  s+='<line x1="'+(ox+370)+'" y1="'+oy+'" x2="'+(ox+490)+'" y2="'+oy+'" class="win"/>';
  s+='<line x1="'+(ox+ow)+'" y1="'+(oy+200)+'" x2="'+(ox+ow)+'" y2="'+(oy+250)+'" class="win"/>';
  s+='<line x1="'+(ox+340)+'" y1="'+(oy+oh)+'" x2="'+(ox+420)+'" y2="'+(oy+oh)+'" class="win"/>';
  s+='<line x1="'+ox+'" y1="'+(oy+280)+'" x2="'+ox+'" y2="'+(oy+360)+'" class="win"/>';
  function darc(cx,cy,r,sa,ea){var sr=sa*Math.PI/180,er=ea*Math.PI/180;var x1=cx+r*Math.cos(sr),y1=cy+r*Math.sin(sr);var x2=cx+r*Math.cos(er),y2=cy+r*Math.sin(er);return '<path d="M '+x1+' '+y1+' A '+r+' '+r+' 0 0 1 '+x2+' '+y2+'" class="da"/>';}
  s+=darc(ox+310,oy+150,18,0,90);
  s+=darc(ox+310,oy+270,18,0,90);
  s+=darc(ox+310,oy+330,16,-90,0);
  s+=darc(ox+440,oy+230,14,90,180);
  s+=darc(ox+440,oy+290,14,90,180);
  s+=darc(ox+260,oy+oh,18,180,270);
  var rooms=getCurrentRooms(),rm={};rooms.forEach(function(r){rm[r.id]=r});
  var labels=[{id:'living',x:ox+(lE?155:135),y:oy+110},{id:'bed1',x:ox+425,y:oy+90},{id:'bed2',x:ox+375,y:oy+240},{id:'bed3',x:ox+375,y:oy+330},{id:'kitchen',x:ox+100,y:oy+310},{id:'bath1',x:ox+490,y:oy+220},{id:'bath2',x:ox+490,y:oy+330},{id:'entrance',x:ox+255,y:oy+370}];
  labels.forEach(function(l){var r=rm[l.id];if(!r)return;s+='<text x="'+l.x+'" y="'+l.y+'" class="rl">'+r.name+'</text><text x="'+l.x+'" y="'+(l.y+16)+'" class="ra">'+r.floor.toFixed(2)+' ㎡</text>';});
  if(!lE)s+='<text x="'+(ox+290)+'" y="'+(oy+115)+'" class="ra" style="font-size:9px" transform="rotate(-90,'+(ox+290)+','+(oy+115)+')">발코니</text>';
  if(!b3E)s+='<text x="'+(ox+375)+'" y="'+(oy+382)+'" class="ra" style="font-size:9px">발코니</text>';
  var polys=[{id:'living',pts:ox+','+oy+' '+(ox+lvW)+','+oy+' '+(ox+lvW)+','+(oy+220)+' '+ox+','+(oy+220)},{id:'kitchen',pts:ox+','+(oy+220)+' '+(ox+200)+','+(oy+220)+' '+(ox+200)+','+(oy+400)+' '+ox+','+(oy+400)},{id:'entrance',pts:(ox+200)+','+(oy+320)+' '+(ox+310)+','+(oy+320)+' '+(ox+310)+','+(oy+400)+' '+(ox+200)+','+(oy+400)},{id:'bed1',pts:(ox+310)+','+oy+' '+(ox+540)+','+oy+' '+(ox+540)+','+(oy+180)+' '+(ox+310)+','+(oy+180)},{id:'bath1',pts:(ox+440)+','+(oy+180)+' '+(ox+540)+','+(oy+180)+' '+(ox+540)+','+(oy+260)+' '+(ox+440)+','+(oy+260)},{id:'bed2',pts:(ox+310)+','+(oy+180)+' '+(ox+440)+','+(oy+180)+' '+(ox+440)+','+(oy+300)+' '+(ox+310)+','+(oy+300)},{id:'bed3',pts:(ox+310)+','+(oy+300)+' '+(ox+440)+','+(oy+300)+' '+(ox+440)+','+b3Bot+' '+(ox+310)+','+b3Bot},{id:'bath2',pts:(ox+440)+','+(oy+260)+' '+(ox+540)+','+(oy+260)+' '+(ox+540)+','+(oy+400)+' '+(ox+440)+','+(oy+400)}];
  polys.forEach(function(p){s+='<polygon points="'+p.pts+'" class="space'+(selectedRoomId===p.id?' selected':'')+'" data-room="'+p.id+'"/>';});
  if(selectedRoomId)s+=renderRoomDimensions(selectedRoomId,ox,oy,lvW,b3Bot);
  s+='</svg>';
  c.innerHTML=s;
  c.querySelectorAll('.space').forEach(function(el){el.addEventListener('click',function(e){e.stopPropagation();selectRoom(el.getAttribute('data-room'));});});
  var svgEl=c.querySelector('svg');
  if(svgEl){svgEl.addEventListener('click',function(e){var t=e.target.tagName.toLowerCase();if(t!=='polygon'&&t!=='text'&&t!=='line'&&t!=='path')clearSelection();});}
}

function getRoomBbox(id,ox,oy,lvW,b3Bot){
  var map={
    living:{x1:ox,y1:oy,x2:ox+lvW,y2:oy+220},
    kitchen:{x1:ox,y1:oy+220,x2:ox+200,y2:oy+400},
    entrance:{x1:ox+200,y1:oy+320,x2:ox+310,y2:oy+400},
    bed1:{x1:ox+310,y1:oy,x2:ox+540,y2:oy+180},
    bath1:{x1:ox+440,y1:oy+180,x2:ox+540,y2:oy+260},
    bed2:{x1:ox+310,y1:oy+180,x2:ox+440,y2:oy+300},
    bed3:{x1:ox+310,y1:oy+300,x2:ox+440,y2:b3Bot},
    bath2:{x1:ox+440,y1:oy+260,x2:ox+540,y2:oy+400}
  };
  return map[id]||null;
}

function renderRoomDimensions(id,ox,oy,lvW,b3Bot){
  var bb=getRoomBbox(id,ox,oy,lvW,b3Bot);
  var dims=ROOM_DIMS[id];
  if(!bb||!dims)return '';
  var wMm=(id==='living'&&expansionState.living&&dims.wMmExp)?dims.wMmExp:dims.wMm;
  var hMm=(id==='bed3'&&expansionState.bed3&&dims.hMmExp)?dims.hMmExp:dims.hMm;
  var pad=16,tick=3;
  var midX=(bb.x1+bb.x2)/2,midY=(bb.y1+bb.y2)/2;
  var g='<g class="dim-overlay" pointer-events="none">';
  // 가로 치수선 (공간 내부 상단)
  var hY=bb.y1+pad;
  var hX1=bb.x1+pad,hX2=bb.x2-pad;
  g+='<line x1="'+hX1+'" y1="'+hY+'" x2="'+hX2+'" y2="'+hY+'" class="dim-line"/>';
  g+='<line x1="'+hX1+'" y1="'+(hY-tick)+'" x2="'+hX1+'" y2="'+(hY+tick)+'" class="dim-line"/>';
  g+='<line x1="'+hX2+'" y1="'+(hY-tick)+'" x2="'+hX2+'" y2="'+(hY+tick)+'" class="dim-line"/>';
  g+='<rect x="'+(midX-20)+'" y="'+(hY-8)+'" width="40" height="12" fill="#FAF3E0" opacity=".9"/>';
  g+='<text x="'+midX+'" y="'+(hY+2)+'" class="dim-text" text-anchor="middle">'+wMm+'</text>';
  // 세로 치수선 (공간 내부 좌측, 가로 치수선 아래부터)
  var vX=bb.x1+pad;
  var vY1=bb.y1+pad+10,vY2=bb.y2-pad;
  if(vY2-vY1>24){
    g+='<line x1="'+vX+'" y1="'+vY1+'" x2="'+vX+'" y2="'+vY2+'" class="dim-line"/>';
    g+='<line x1="'+(vX-tick)+'" y1="'+vY1+'" x2="'+(vX+tick)+'" y2="'+vY1+'" class="dim-line"/>';
    g+='<line x1="'+(vX-tick)+'" y1="'+vY2+'" x2="'+(vX+tick)+'" y2="'+vY2+'" class="dim-line"/>';
    var vMid=(vY1+vY2)/2;
    g+='<rect x="'+(vX+2)+'" y="'+(vMid-8)+'" width="36" height="12" fill="#FAF3E0" opacity=".9"/>';
    g+='<text x="'+(vX+20)+'" y="'+(vMid+2)+'" class="dim-text" text-anchor="middle">'+hMm+'</text>';
  }
  // 창/문 정보 (공간 내부 하단)
  var info=[];
  if(dims.doors&&dims.doors.length)info.push('문 '+dims.doors.join(',')+'mm');
  if(dims.windows&&dims.windows.length)info.push('창 '+dims.windows.join(',')+'mm');
  if(info.length){
    var iy=bb.y2-pad-(info.length-1)*12;
    info.forEach(function(ln,i){g+='<text x="'+midX+'" y="'+(iy+i*12)+'" class="dim-info">'+ln+'</text>';});
  }
  g+='</g>';
  return g;
}

var currentStep=1;
function goToStep(n){if(n<1||n>6)return;if(n===5){if(currentStep!==3)goToStep(3);openQtyModal();return}document.getElementById('step'+currentStep).classList.remove('active');currentStep=n;selectedRoomId=null;document.getElementById('step'+n).classList.add('active');updateNav();onEnter(n);window.scrollTo({top:0,behavior:'smooth'})}
function updateNav(){document.querySelectorAll('.step-dot').forEach(function(d){var s=parseInt(d.dataset.step);d.classList.remove('active','done');if(s===currentStep)d.classList.add('active');else if(s<currentStep)d.classList.add('done')});document.getElementById('stepTrackFill').style.width=((currentStep-1)/5*100)+'%'}
function onEnter(n){if(n===3)renderStep3();if(n===4)renderStep4();if(n===5)renderStep5();if(n===6)renderStep6()}

function simulateUpload(){var a=document.getElementById('uploadArea');a.style.borderColor='#2563EB';a.style.background='#EFF6FF';a.innerHTML='<div style="padding:20px"><div style="width:48px;height:48px;border:3px solid #E2E8F0;border-top-color:#2563EB;border-radius:50%;margin:0 auto 16px;animation:spin .8s linear infinite"></div><p style="font-size:14px;font-weight:600">이미지 업로드 중...</p><p style="font-size:12px;color:#64748B;margin-top:4px">개포주공_34평.jpg</p></div>';setTimeout(function(){a.innerHTML='<div style="padding:20px"><div style="font-size:40px;margin-bottom:8px">✅</div><p style="font-size:14px;font-weight:600;color:#16A34A">업로드 완료</p><p style="font-size:12px;color:#64748B;margin-top:4px">개포주공_34평.jpg · 1.2MB</p></div>';showToast('이미지 업로드 완료');setTimeout(function(){goToStep(2)},800)},1200)}

function runConvert(){var stages=['cs1','cs2','cs3','cs4'],durs=[1200,1000,800,600],bar=document.getElementById('convertProgressBar'),el=document.getElementById('convertElapsed'),t=0;stages.forEach(function(id){var e=document.getElementById(id);e.classList.remove('processing','done');e.querySelector('.cs-icon').textContent='○';e.querySelector('.cs-status').textContent=''});bar.style.width='0%';function proc(i){if(i>=stages.length){bar.style.width='100%';el.textContent='변환 완료 · 3.6초';showToast('도면 변환 완료 — 8개 공간 인식');setTimeout(function(){goToStep(3)},1000);return}var e=document.getElementById(stages[i]);e.classList.add('processing');e.querySelector('.cs-icon').textContent='⟳';t+=durs[i];setTimeout(function(){e.classList.remove('processing');e.classList.add('done');e.querySelector('.cs-icon').textContent='✔';e.querySelector('.cs-status').textContent='완료';bar.style.width=((i+1)/4*100)+'%';el.textContent='처리 중... '+(t/1000).toFixed(1)+'초';proc(i+1)},durs[i])}setTimeout(function(){proc(0)},400)}

function renderStep3(){renderFloorplan('planCanvas');document.getElementById('recogGrid').innerHTML=RECOGNITION.map(function(r){return'<div class="recog-item"><span class="recog-dot" style="background:'+r.color+'"></span><span>'+r.label+'</span><span class="recog-val">'+r.count+'</span></div>'}).join('');document.getElementById('roomList').innerHTML=getCurrentRooms().map(function(r){return'<div class="room-item'+(selectedRoomId===r.id?' active':'')+'" data-room="'+r.id+'" onclick="selectRoom(\''+r.id+'\')"><span class="room-color" style="background:'+ROOM_COLORS[r.id]+'"></span><span class="room-name">'+r.name+'</span><span class="room-area-label">'+r.floor.toFixed(1)+'㎡</span></div>'}).join('');renderSelectedPanel()}

function renderStep4(){renderFloorplan('planCanvas2',{highlightExpansion:true});updateImpact();updateBadge()}
function toggleExpansion(t,c){expansionState[t]=c;document.getElementById(t==='living'?'expLiving':'expBed3').classList.toggle('checked',c);renderFloorplan('planCanvas2',{highlightExpansion:true});updateImpact();updateBadge()}
function updateBadge(){var c=(expansionState.living?1:0)+(expansionState.bed3?1:0);var b=document.getElementById('changeBadge');b.textContent='변경 '+c+'건';b.style.background=c>0?'#DBEAFE':'#FEF3C7';b.style.color=c>0?'#1E40AF':'#92400E'}
function updateImpact(){var bf=BASE_ROOMS.reduce(function(s,r){return s+r.floor},0),bw=BASE_ROOMS.reduce(function(s,r){return s+r.wall},0),cr=getCurrentRooms(),cf=cr.reduce(function(s,r){return s+r.floor},0),cw=cr.reduce(function(s,r){return s+r.wall},0);document.getElementById('impFloor').innerHTML=bf.toFixed(1)+'㎡ → <strong>'+cf.toFixed(1)+'㎡</strong>';document.getElementById('impWall').innerHTML=bw.toFixed(1)+'㎡ → <strong>'+cw.toFixed(1)+'㎡</strong>'}
function applyChangesAndCalc(){showToast('구조 변경 적용 — 물량 재산출 중...');setTimeout(function(){goToStep(5)},600)}

function renderStep5(){var rooms=getCurrentRooms(),tb=document.getElementById('areaTableBody'),tf=document.getElementById('areaTableFoot');tb.innerHTML=rooms.map(function(r){return'<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+ROOM_COLORS[r.id]+';margin-right:8px;vertical-align:middle"></span>'+r.name+'</td><td>'+r.floor.toFixed(1)+'</td><td>'+r.wall.toFixed(1)+'</td><td>'+r.ceiling.toFixed(1)+'</td><td>'+r.perimeter.toFixed(1)+'</td><td>'+r.doors+'</td><td>'+r.windows+'</td></tr>'}).join('');var t=rooms.reduce(function(a,r){return{floor:a.floor+r.floor,wall:a.wall+r.wall,ceiling:a.ceiling+r.ceiling,perimeter:a.perimeter+r.perimeter,doors:a.doors+r.doors,windows:a.windows+r.windows}},{floor:0,wall:0,ceiling:0,perimeter:0,doors:0,windows:0});tf.innerHTML='<tr><td>합계</td><td>'+t.floor.toFixed(1)+'</td><td>'+t.wall.toFixed(1)+'</td><td>'+t.ceiling.toFixed(1)+'</td><td>'+t.perimeter.toFixed(1)+'</td><td>'+t.doors+'</td><td>'+t.windows+'</td></tr>';renderMats()}

function renderMats(){var mats=calcMaterials(),catL={floor:'바닥',wall:'벽',ceiling:'천장',fixture:'설비',etc:'부자재'};var entries=Object.entries(mats).sort(function(a,b){var o=['floor','wall','ceiling','fixture','etc'];return o.indexOf(a[1].cat)-o.indexOf(b[1].cat)});document.getElementById('materialCards').innerHTML=entries.map(function(e){var m=e[1];return'<div class="mat-card"><div class="mat-header"><span class="mat-name">'+m.name+'</span><span class="mat-badge '+m.cat+'">'+catL[m.cat]+'</span></div><div class="mat-rows"><div class="mat-row"><span>산출량</span><span class="mat-row-val">'+m.rawQty.toFixed(1)+' '+m.unit+'</span></div>'+(m.lossRate>0?'<div class="mat-row"><span>로스율</span><span class="mat-row-val">'+(m.lossRate*100).toFixed(0)+'%</span></div>':'')+'</div><div class="mat-total"><span>소요량</span><span>'+m.qty+' '+m.unit+'</span></div></div>'}).join('')}

function changeFinish(){finishOverrides.living_tv_wall=document.getElementById('selTvWall').value;var ev=document.getElementById('selEntFloor').value;finishOverrides.entrance_floor=ev==='marble'?'marble':'floor_tile';renderMats();document.getElementById('finishNotice').style.display='flex';showToast('마감재 변경 반영 — 소요량 재계산 완료')}

function renderStep6(){var rooms=getCurrentRooms(),mats=calcMaterials(),tf=rooms.reduce(function(s,r){return s+r.floor},0),mc=Object.keys(mats).length;var expText=(expansionState.living?'거실':'')+(expansionState.living&&expansionState.bed3?', ':'')+(expansionState.bed3?'침실3':'');if(!expText)expText='없음';document.getElementById('exportSummary').innerHTML='<div class="export-row"><span>아파트</span><strong>개포주공 5단지 · 34평</strong></div><div class="export-row"><span>총 바닥면적</span><strong>'+tf.toFixed(1)+'㎡</strong></div><div class="export-row"><span>공간 수</span><strong>'+rooms.length+'개</strong></div><div class="export-row"><span>자재 항목</span><strong>'+mc+'종</strong></div><div class="export-row"><span>발코니 확장</span><strong>'+expText+'</strong></div>';document.getElementById('exportDone').style.display='none';document.getElementById('exportActions').style.display='flex'}

function openQtyModal(){var m=document.getElementById('qtyModal');if(!m)return;renderStep5();m.style.display='flex'}
function closeQtyModal(){var m=document.getElementById('qtyModal');if(m)m.style.display='none'}
function handleQtyModalOverlayClick(e){if(e.target&&e.target.id==='qtyModal')closeQtyModal()}

function exportToEstimate(){var btn=document.querySelector('#exportActions .btn-primary');btn.disabled=true;btn.textContent='연동 중...';setTimeout(function(){document.getElementById('exportActions').style.display='none';document.getElementById('exportDone').style.display='block';showToast('견적 에이전트로 자재 소요량 연동 완료')},1500)}

function selectRoom(id){if(!id)return;if(selectedRoomId===id){clearSelection();return}selectedRoomId=id;rerenderActivePlan();document.querySelectorAll('.room-item').forEach(function(it){it.classList.toggle('active',it.getAttribute('data-room')===id)});renderSelectedPanel()}
function clearSelection(){selectedRoomId=null;rerenderActivePlan();document.querySelectorAll('.room-item.active').forEach(function(it){it.classList.remove('active')});renderSelectedPanel()}
function rerenderActivePlan(){if(document.getElementById('step3').classList.contains('active'))renderFloorplan('planCanvas');if(document.getElementById('step4').classList.contains('active'))renderFloorplan('planCanvas2',{highlightExpansion:true})}
function calcMaterialsForRoom(room){var f=ROOM_FINISH[room.id],mats={};function add(k,area){var s=MATERIAL_SPECS[k];if(!s)return;if(!mats[k])mats[k]=Object.assign({},s,{rawQty:0,qty:0});mats[k].rawQty+=area/s.coverage;mats[k].qty=Math.ceil(mats[k].rawQty*(1+s.lossRate))}if(!f)return mats;if(room.id==='entrance'){add(finishOverrides.entrance_floor==='marble'?'floor_marble':'floor_tile',room.floor)}else{add(f.floor,room.floor)}if(room.id==='living'){var tvA=6.0,restA=room.wall-tvA;var tk=finishOverrides.living_tv_wall==='marble'?'wall_marble':finishOverrides.living_tv_wall==='paint'?'wall_paint':'wallpaper';add(tk,tvA);add(f.wall,restA)}else{add(f.wall,room.wall)}add(f.ceiling,room.ceiling);if(room.id.indexOf('bath')!==0){add('molding',room.perimeter);add('baseboard',room.perimeter-room.doors*0.9)}if(room.doors>0)add('door',room.doors);if(room.id.indexOf('bath')===0)add('bath_fixture',1);return mats}
function renderSelectedPanel(){var box=document.getElementById('selectedRoomBox');if(!box)return;if(!selectedRoomId){box.style.display='none';box.innerHTML='';return}var room=getCurrentRooms().find(function(r){return r.id===selectedRoomId});if(!room){box.style.display='none';return}var mats=calcMaterialsForRoom(room),catL={floor:'바닥',wall:'벽',ceiling:'천장',fixture:'설비',etc:'부자재'};var matEntries=Object.entries(mats).sort(function(a,b){var o=['floor','wall','ceiling','fixture','etc'];return o.indexOf(a[1].cat)-o.indexOf(b[1].cat)});var matHtml=matEntries.length?matEntries.map(function(e){var m=e[1];return'<div class="selected-room-mat-item"><span class="selected-room-mat-name">'+m.name+'</span><span class="selected-room-mat-qty">'+m.qty+' '+m.unit+'</span></div>'}).join(''):'<div class="selected-room-mat-empty">해당 공간의 자재 정의 없음</div>';box.style.display='block';box.innerHTML='<div class="selected-room-header"><div class="selected-room-title"><span class="selected-room-swatch" style="background:'+ROOM_COLORS[room.id]+'"></span>'+room.name+'</div><button class="selected-room-clear" onclick="clearSelection()">✕ 선택 해제</button></div><table class="selected-room-area-table"><tr><td>바닥면적</td><td>'+room.floor.toFixed(2)+' ㎡</td></tr><tr><td>벽면적</td><td>'+room.wall.toFixed(2)+' ㎡</td></tr><tr><td>천장면적</td><td>'+room.ceiling.toFixed(2)+' ㎡</td></tr><tr><td>둘레</td><td>'+room.perimeter.toFixed(2)+' m</td></tr><tr><td>도어 / 창호</td><td>'+room.doors+' / '+room.windows+'</td></tr></table><div class="selected-room-mat-head">자재 소요량</div><div class="selected-room-mat-list">'+matHtml+'</div>'}
function showToast(msg){var t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},2800)}

document.addEventListener('DOMContentLoaded',function(){updateNav();document.addEventListener('keydown',function(e){if(e.key==='Escape')closeQtyModal()})});
new MutationObserver(function(){if(document.getElementById('step2').classList.contains('active'))runConvert()}).observe(document.getElementById('step2'),{attributes:true,attributeFilter:['class']});
