// Hoja Oficial QR – lógica
const $ = (sel, root=document)=>root.querySelector(sel);
const $$ = (sel, root=document)=>[...root.querySelectorAll(sel)];
const yearEl=$('#year'); if(yearEl) yearEl.textContent=new Date().getFullYear();

function getSide(){
  const r = document.querySelector('input[name="side"]:checked');
  return r ? r.value : 'A';
}

function getPositions(){
  const vals = [$('#p1').value, $('#p2').value, $('#p3').value, $('#p4').value, $('#p5').value, $('#p6').value].map(v=>v.trim());
  const set = new Set(vals.filter(v=>v!==''));
  if(set.size !== vals.filter(v=>v!=='').length) throw new Error('No puedes repetir dorsales.');
  if(vals.some(v=>v==='')) throw new Error('Completa las 6 posiciones.');
  return vals;
}

function setPositions(vals){
  [$('#p1'),$('#p2'),$('#p3'),$('#p4'),$('#p5'),$('#p6')].forEach((el,i)=>el.value = vals[i] ?? '');
}

function rotatePlus(){
  const vals = getPositions();
  const rotated = [vals[5], vals[0], vals[1], vals[2], vals[3], vals[4]];
  setPositions(rotated);
}
function rotateMinus(){
  const vals = getPositions();
  const rotated = [vals[1], vals[2], vals[3], vals[4], vals[5], vals[0]];
  setPositions(rotated);
}

function buildPayload(){
  const equipo = $('#equipo').value.trim();
  if(!equipo) throw new Error('Introduce el código de equipo.');
  const side = getSide();
  const set = $('#set').value;
  const vals = getPositions();
  const zones = { ZN1: vals[0], ZN2: vals[1], ZN3: vals[2], ZN4: vals[3], ZN5: vals[4], ZN6: vals[5] };
  const zonesStr = JSON.stringify(zones);
  const arr = [equipo, side, zonesStr, set];
  return JSON.stringify(arr);
}

function renderQR(text){
  const el = $('#qr');
  el.innerHTML = '';
  const canvas = document.createElement('canvas');
  QRCode.toCanvas(canvas, text, { width: 256, margin: 1 }, function (error) {
    if (error) console.error(error);
  });
  el.appendChild(canvas);
}

function generate(){
  try{
    const payload = buildPayload();
    $('#payload').value = payload;
    renderQR(payload);
  }catch(e){
    alert(e.message);
  }
}

function copyPayload(){
  const t = $('#payload');
  t.select(); t.setSelectionRange(0, 99999);
  document.execCommand('copy');
}

function downloadPNG(){
  const canvas = $('#qr canvas');
  if(!canvas){ alert('Genera el QR primero.'); return; }
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'hoja-oficial-qr.png';
  document.body.appendChild(a); a.click(); a.remove();
}

function keyFor(set){ return 'hojaOficialQR:set:'+set; }
function saveSet(){
  const set = $('#set').value;
  const equipo = $('#equipo').value.trim();
  const side = getSide();
  const vals = [$('#p1').value, $('#p2').value, $('#p3').value, $('#p4').value, $('#p5').value, $('#p6').value];
  const data = { equipo, side, vals };
  localStorage.setItem(keyFor(set), JSON.stringify(data));
  alert('Set guardado.');
}
function loadSet(){
  const set = $('#set').value;
  const raw = localStorage.getItem(keyFor(set));
  if(!raw){ alert('No hay datos guardados para este set.'); return; }
  try{
    const d = JSON.parse(raw);
    $('#equipo').value = d.equipo||'';
    $$('input[name="side"]').forEach(r=>{ r.checked = (r.value === (d.side||'A')); });
    setPositions(d.vals||['','','','','','']);
  }catch(e){ alert('Datos corruptos.'); }
}

$$('.tab').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const s = btn.dataset.set;
    $('#set').value = s;
    loadSet();
  });
});

$('#rot-mas').addEventListener('click', (e)=>{ e.preventDefault(); try{ rotatePlus(); }catch(err){ alert(err.message); }});
$('#rot-menos').addEventListener('click', (e)=>{ e.preventDefault(); try{ rotateMinus(); }catch(err){ alert(err.message); }});
$('#btn-generar').addEventListener('click', (e)=>{ e.preventDefault(); generate(); });
$('#btn-copiar').addEventListener('click', (e)=>{ e.preventDefault(); copyPayload(); });
$('#btn-png').addEventListener('click', (e)=>{ e.preventDefault(); downloadPNG(); });

$('#btn-guardar').addEventListener('click', (e)=>{ e.preventDefault(); saveSet(); });
$('#btn-cargar').addEventListener('click', (e)=>{ e.preventDefault(); loadSet(); });

$('#btn-nuevo').addEventListener('click', (e)=>{
  e.preventDefault();
  if(confirm('Vaciar todos los campos?')){
    $('#equipo').value='';
    $$('input[name="side"]')[0].checked = true;
    $('#set').value='1';
    setPositions(['','','','','','']);
    $('#payload').value='';
    $('#qr').innerHTML='';
  }
});

$('#btn-demo').addEventListener('click', (e)=>{
  e.preventDefault();
  $('#equipo').value = 'CANGAS';
  $$('input[name="side"]').forEach(r=>r.checked = (r.value==='A'));
  $('#set').value = '1';
  setPositions(['1','2','3','4','5','6']);
  generate();
});














































































































=================================================
Visita: www.intercambiosvirtuales.org
Dudas y Sugerencias: www.intercambiosos.org
=================================================




























































































=================================================
Visita: www.intercambiosvirtuales.org
Dudas y Sugerencias: www.intercambiosos.org
=================================================