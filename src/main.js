import './style.css';
import { PAGE, centers, drawPhoto, drawSlot } from './layout.js';
const KEY='recuerdos-navidad-v1';
const icons={star:'✦',upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',photo:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',check:'<path d="m5 12 4 4L19 6"/>',reset:'<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',edit:'<path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14z"/>',trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>'};
function icon(name){return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||''}</svg>`;}
let photos=Array(9).fill(null), images=Array(9).fill(null), active=0, saveTimer, busy=false, lastFocus;
let restored=false, storageError=false;
try { const data=JSON.parse(localStorage.getItem(KEY)); if(data?.version===1 && Array.isArray(data.photos)) photos=Array.from({length:9},(_,i)=>{const p=data.photos[i];return p && typeof p.src==='string' && p.src.startsWith('data:image/') ? {src:p.src,name:String(p.name||'Fotografía'),zoom:Math.max(1,Math.min(2000,Number(p.zoom)||100)),x:Number.isFinite(p.x)?p.x:0,y:Number.isFinite(p.y)?p.y:0}:null;}); restored=photos.some(Boolean); } catch {storageError=true;}
const app=document.querySelector('#app');
app.innerHTML=`
<header class="topbar"><a class="brand" href="#"><span class="brand-mark">✦</span><span>recuerdos<span class="brand-sub">DE NAVIDAD</span></span></a><span class="top-note">Pequeños detalles. Grandes recuerdos.</span><span class="season">HECHO CON CARIÑO <span>✧</span></span></header>
<main><section class="hero"><div class="eyebrow"><span></span> TU TALLER DE ESFERAS</div><h1>Tus recuerdos,<br>hechos <em>Navidad.</em></h1><p>Una foto, una historia, una esfera.<br class="mobile-break"> Prepara tus fotos y llena tu árbol de momentos especiales.</p><div class="specs"><span>◉ <b>${PAGE.diameter / 10} cm</b> de diámetro</span><span>▤ Papel carta</span><span>✦ Hasta 9 fotos por hoja</span></div><div class="hero-art" aria-hidden="true"><div class="thread t1"></div><div class="thread t2"></div><div class="bauble b1"><span>✧</span></div><div class="bauble b2"><span>✦</span></div><i class="spark s1">✧</i><i class="spark s2">✧</i><i class="spark s3">·</i></div></section>
<nav class="steps" aria-label="Cómo funciona"><span><b>1</b> Sube tus fotos</span><i>—</i><span><b>2</b> Ajusta cada recuerdo</span><i>—</i><span><b>3</b> Imprime y recorta</span></nav>
<div class="workspace"><section class="photos-panel" aria-labelledby="photos-title"><div class="panel-heading"><div><span class="eyebrow small">ELIGE TUS MOMENTOS</span><h2 id="photos-title">Tus fotografías <span id="count">0 / 9</span></h2></div><button id="upload-all" class="button primary">${icon('upload')}<span>Subir fotos</span></button></div><div class="intro-row"><p>Arrastra la imagen para encuadrarla. Ajusta el zoom a tu gusto.</p><a href="#preview" class="mobile-preview">Ver hoja ↓</a></div><div id="photo-grid" class="photo-grid"></div><div class="save-row"><span id="save-status" role="status">${icon('check')} Guardado automático en este navegador</span><button id="clear-all" class="text-button">Borrar todo</button></div><div class="privacy">${icon('photo')}<p><b>Tus recuerdos se quedan contigo.</b> Las fotos se procesan y guardan en este navegador; no se envían a ningún servidor. Borrar los datos del navegador elimina el proyecto.</p></div></section>
<aside id="preview" class="preview-panel" aria-labelledby="preview-title"><div class="preview-heading"><span class="eyebrow small">ASÍ SE VERÁ TU HOJA</span><h2 id="preview-title">Lista para la magia</h2><p>Vista previa de todas tus fotos</p></div><div class="paper-surround"><div class="paper" id="paper" aria-label="Vista previa de hoja carta con nueve recortes circulares"></div><div class="paper-caption">CARTA <span>21.59 × 27.94 cm</span></div></div><div class="print-details"><span><i class="dashed-dot"></i> Línea punteada para recortar</span><span>◉ Círculos de ${PAGE.diameter / 10} cm exactos en el PDF</span></div><button id="export" class="button download">${icon('download')} Descargar PDF</button><p class="print-note">Al imprimir: <b>tamaño real / escala 100%</b>.<br>Selecciona papel carta y desactiva “ajustar a página”.</p><details class="layout-info"><summary>¿Cómo caben 9 fotografías?</summary><p>Tres columnas escalonadas, con 0.5 mm de separación mínima entre círculos. La composición ocupa 20.03 × 25.68 cm y deja al menos 7.7 mm de margen. Cada círculo conserva sus ${PAGE.diameter / 10} cm de diámetro.</p><p><a href="https://kaas.hpcloud.hp.com/pdf-public/pdf_380033_en-US-1.pdf" target="_blank" rel="noopener noreferrer">Consultar medidas de papel carta (HP) ↗</a></p></details></aside></div>
<section class="bottom-note"><span>✧</span><p>Los mejores adornos<br><em>son los que cuentan tu historia.</em></p><span>✧</span></section></main><footer><span>recuerdos de Navidad</span><p>De tu galería al árbol, con amor.</p><span>✦</span></footer>
<input type="file" id="files" accept="image/*" multiple hidden><input type="file" id="single-file" accept="image/*" hidden>
<dialog id="editor"><div class="dialog-header"><div><span class="eyebrow small">CADA DETALLE CUENTA</span><h2 id="editor-title">Ajusta tu fotografía</h2></div><button class="icon-button" id="close-editor" aria-label="Cerrar editor">${icon('close')}</button></div><p class="editor-help">Arrastra para mover. Usa dos dedos para acercar o alejar.</p><div class="editor-stage"><canvas id="editor-canvas" width="1000" height="1000" tabindex="0" aria-label="Encuadre de la foto; usa las flechas para moverla"></canvas></div><div class="editor-controls"><label for="editor-range">Zoom</label><input id="editor-range" type="range" min="1" max="400" value="100"><div class="zoom-number"><input id="editor-number" type="number" min="1" max="2000" value="100" aria-label="Porcentaje de zoom"><span>%</span></div></div><p class="editor-tip">Puedes alejar la imagen y dejar espacio blanco. Con el teclado, mueve la foto usando las flechas.</p><div class="editor-actions"><button id="reset-editor" class="button secondary">${icon('reset')} Restablecer</button><button id="done-editor" class="button primary">Listo ${icon('check')}</button></div></dialog>
<dialog id="confirm-dialog"><div class="confirm-inner"><span class="confirm-star">✧</span><h2 id="confirm-title"></h2><p id="confirm-text"></p><div class="confirm-actions"><button id="confirm-no" class="button secondary">Volver</button><button id="confirm-yes" class="button primary">Sí, descargar</button></div></div></dialog><div id="toast" class="toast" role="status" aria-live="polite"></div>`;
const $=s=>document.querySelector(s);
const grid=$('#photo-grid');
const paper=$('#paper');
for(let i=0;i<9;i++){
 const card=document.createElement('article');card.className='photo-card';card.dataset.index=i;
 card.innerHTML=`<div class="card-top"><span>FOTO ${String(i+1).padStart(2,'0')}</span><button class="icon-button remove" aria-label="Eliminar foto ${i+1}" hidden>${icon('trash')}</button></div><div class="circle-wrap"><canvas width="600" height="600" class="photo-canvas" tabindex="0" aria-label="Foto ${i+1}: subir o arrastrar para ajustar"></canvas><button class="empty-upload" aria-label="Subir foto ${i+1}"><span>${icon('plus')}</span><b>Añadir foto</b><small>JPG, PNG y más</small></button></div><div class="card-controls"><label class="sr-only" for="zoom-${i}">Zoom de la foto ${i+1}</label><input id="zoom-${i}" type="range" min="1" max="400" value="100" disabled><output for="zoom-${i}">100%</output></div><button class="edit-button" disabled>${icon('edit')}<span>Ajustar foto</span></button>`;
 grid.append(card);
 const c=centers[i],mini=document.createElement('canvas');mini.width=360;mini.height=360;mini.className='preview-circle';mini.dataset.index=i;mini.style.cssText=`left:${(c.x-PAGE.diameter/2)/PAGE.width*100}%;top:${(c.y-PAGE.diameter/2)/PAGE.height*100}%;width:${PAGE.diameter/PAGE.width*100}%;`;mini.setAttribute('aria-label',`Foto ${i+1}`);paper.append(mini);
 card.querySelector('.empty-upload').onclick=()=>pickSingle(i);
 card.querySelector('.remove').onclick=()=>{photos[i]=null;images[i]=null;render(i);scheduleSave();};
 card.querySelector('.edit-button').onclick=()=>openEditor(i);
 card.querySelector('input').oninput=e=>setZoom(i,Number(e.target.value));
 attachCanvas(card.querySelector('canvas'),()=>i);
 mini.onclick=()=>photos[i]?openEditor(i):pickSingle(i);
}
function announce(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(announce.timer);announce.timer=setTimeout(()=>$('#toast').classList.remove('visible'),5500);}
function count(){return photos.filter(Boolean).length;}
function render(i){
 const p=photos[i],card=grid.children[i];drawPhoto(card.querySelector('canvas').getContext('2d'),images[i],p,600);
 const mini=paper.children[i],ctx=mini.getContext('2d');drawSlot(ctx,images[i],p,360,i);
 card.classList.toggle('has-photo',!!p);card.querySelector('.empty-upload').hidden=!!p;card.querySelector('.remove').hidden=!p;card.querySelector('.edit-button').disabled=!p;card.querySelector('input').disabled=!p;card.querySelector('input').value=p?.zoom||100;card.querySelector('output').textContent=`${p?.zoom||100}%`;
 $('#count').textContent=`${count()} / 9`;$('#clear-all').disabled=!count();$('#export').disabled=busy;
 if($('#editor').open && active===i)renderEditor();
}
function renderEditor(){drawPhoto($('#editor-canvas').getContext('2d'),images[active],photos[active],1000);$('#editor-range').value=photos[active].zoom;$('#editor-number').value=photos[active].zoom;}
function setZoom(i,value){if(!photos[i]||!Number.isFinite(value))return;photos[i].zoom=Math.max(1,Math.min(2000,Math.round(value)));render(i);scheduleSave();}
function scheduleSave(){clearTimeout(saveTimer);$('#save-status').textContent='Guardando cambios…';saveTimer=setTimeout(save,300);}
function save(){clearTimeout(saveTimer);try{localStorage.setItem(KEY,JSON.stringify({version:1,photos}));storageError=false;$('#save-status').innerHTML=`${icon('check')} Guardado en este navegador`;$('#save-status').classList.remove('save-error');}catch{storageError=true;$('#save-status').textContent='No se pudo guardar: el almacenamiento está lleno o bloqueado.';$('#save-status').classList.add('save-error');announce('No se pudo guardar. Descarga tu PDF antes de cerrar la página.');}}
window.addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save();});
function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});}
async function prepare(file){
 if(!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name))throw new Error('Selecciona un archivo de imagen.');
 if(file.size>50*1024*1024)throw new Error('Esta imagen supera los 50 MB. Elige una versión más pequeña.');
 const url=URL.createObjectURL(file);
 try{const im=await loadImage(url),scale=Math.min(1,1800/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*scale));c.height=Math.max(1,Math.round(im.naturalHeight*scale));const ctx=c.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(im,0,0,c.width,c.height);
 // Keep nine photos comfortably below the usual localStorage quota (UTF-16).
 let src;for(let quality=.88;quality>=.36;quality-=.08){src=c.toDataURL('image/jpeg',quality);if(src.length<210000)break;}
 while(src.length>210000){const factor=Math.min(.85,Math.sqrt(170000/src.length));const small=document.createElement('canvas');small.width=Math.max(1,Math.round(c.width*factor));small.height=Math.max(1,Math.round(c.height*factor));small.getContext('2d').drawImage(c,0,0,small.width,small.height);c.width=small.width;c.height=small.height;ctx.drawImage(small,0,0);src=c.toDataURL('image/jpeg',.75);}
 return {src,name:file.name,zoom:100,x:0,y:0};
 }catch(e){if(e.message?.includes('50 MB'))throw e;throw new Error('No se pudo abrir esta foto. Si es HEIC, conviértela a JPG o PNG.');}finally{URL.revokeObjectURL(url);}
}
let singleTarget=0;
function pickSingle(i){if(busy)return;singleTarget=i;$('#single-file').click();}
async function importFiles(files, target){
 if(busy)return;const list=Array.from(files);if(!list.length)return;
 const slots=target!==undefined?[target]:photos.flatMap((p,i)=>p?[]:[i]);
 if(!slots.length){announce('Tu hoja está completa. Elimina una foto o usa “Cambiar foto” en el editor.');return;}
 busy=true;$('#upload-all').disabled=true;$('#export').disabled=true;
 if(list.length>slots.length)announce(`Se cargarán ${slots.length} fotos; es el espacio disponible.`);
 let added=0,errors=[];
 for(let j=0;j<Math.min(list.length,slots.length);j++){const i=slots[j];try{const p=await prepare(list[j]);const im=await loadImage(p.src);photos[i]=p;images[i]=im;added++;render(i);}catch(e){errors.push(`${list[j].name}: ${e.message}`);}}
 busy=false;$('#upload-all').disabled=false;for(let i=0;i<9;i++)render(i);save();
 if(errors.length)announce(errors.join(' '));else if(added)announce(`${added===1?'Foto añadida':'Fotos añadidas'}. Tus cambios se guardan automáticamente.`);
}
$('#upload-all').onclick=()=>$('#files').click();$('#files').onchange=async e=>{await importFiles(e.target.files);e.target.value='';};$('#single-file').onchange=async e=>{await importFiles(e.target.files,singleTarget);e.target.value='';};
// Drop photos anywhere over the grid, without letting the browser navigate away.
window.addEventListener('dragover',e=>{if(e.dataTransfer?.types.includes('Files'))e.preventDefault();});window.addEventListener('drop',e=>{if(e.dataTransfer?.files.length){e.preventDefault();importFiles(e.dataTransfer.files);}});
function openEditor(i){if(!photos[i])return;active=i;lastFocus=document.activeElement;$('#editor-title').textContent=`Ajusta tu foto ${String(i+1).padStart(2,'0')}`;$('#editor').showModal();renderEditor();}
function closeEditor(){save();$('#editor').close();lastFocus?.focus();}
$('#close-editor').onclick=closeEditor;$('#done-editor').onclick=closeEditor;$('#editor').addEventListener('close',()=>{save();});$('#editor-range').oninput=e=>setZoom(active,Number(e.target.value));$('#editor-number').oninput=e=>{if(e.target.value!=='')setZoom(active,Number(e.target.value));};$('#editor-number').onchange=renderEditor;
$('#reset-editor').onclick=()=>{Object.assign(photos[active],{zoom:100,x:0,y:0});render(active);scheduleSave();};
const replace=document.createElement('button');replace.className='text-button replace-button';replace.textContent='Cambiar foto';replace.onclick=()=>pickSingle(active);$('.editor-actions').before(replace);
function attachCanvas(canvas,getIndex){
 const pointers=new Map();let prevPinch=null;
 canvas.addEventListener('pointerdown',e=>{const i=getIndex();if(!photos[i]){pickSingle(i);return;}canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2)prevPinch=distance();canvas.classList.add('dragging');});
 function distance(){const a=[...pointers.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);}
 canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const i=getIndex(),p=photos[i],old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const d=distance();if(prevPinch>0)setZoom(i,p.zoom*d/prevPinch);prevPinch=d;}else{const size=canvas.getBoundingClientRect().width;p.x+=(e.clientX-old.x)/size;p.y+=(e.clientY-old.y)/size;render(i);scheduleSave();}});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{pointers.delete(e.pointerId);prevPinch=null;if(!pointers.size){canvas.classList.remove('dragging');save();}});
 canvas.addEventListener('keydown',e=>{const i=getIndex(),p=photos[i];if(!p){if(e.key==='Enter'||e.key===' '){e.preventDefault();pickSingle(i);}return;}const steps={ArrowLeft:[-.01,0],ArrowRight:[.01,0],ArrowUp:[0,-.01],ArrowDown:[0,.01]};if(steps[e.key]){e.preventDefault();const [x,y]=steps[e.key];p.x+=x*(e.shiftKey?5:1);p.y+=y*(e.shiftKey?5:1);render(i);scheduleSave();}else if(e.key==='+'||e.key==='='){e.preventDefault();setZoom(i,p.zoom+5);}else if(e.key==='-'){e.preventDefault();setZoom(i,p.zoom-5);}});
}
attachCanvas($('#editor-canvas'),()=>active);
function confirmAction(title,text,yes){return new Promise(resolve=>{const d=$('#confirm-dialog');$('#confirm-title').textContent=title;$('#confirm-text').textContent=text;$('#confirm-yes').textContent=yes;const finish=value=>{d.close();resolve(value);};$('#confirm-no').onclick=()=>finish(false);$('#confirm-yes').onclick=()=>finish(true);d.oncancel=e=>{e.preventDefault();finish(false);};d.showModal();$('#confirm-no').focus();});}
$('#clear-all').onclick=async()=>{if(await confirmAction('¿Empezamos de nuevo?','Se eliminarán las fotografías y sus ajustes guardados en este navegador.','Sí, borrar todo')){photos=Array(9).fill(null);images=Array(9).fill(null);for(let i=0;i<9;i++)render(i);save();}};
$('#export').onclick=async()=>{
 if(busy)return;
 if(count()<9 && !await confirmAction('Todavía quedan recuerdos por añadir',`Has cargado ${count()} de 9 fotografías. ¿Estás seguro de que quieres descargar el PDF? Los espacios vacíos se imprimirán como aparecen en la vista previa, con su número y guía de recorte.`,'Sí, descargar PDF'))return;
 busy=true;$('#export').disabled=true;$('#export').innerHTML='Preparando tu PDF…';
 try{const {jsPDF}=await import('jspdf');const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'letter',compress:true,precision:6});doc.setProperties({title:`Recuerdos de Navidad · Fotos de ${PAGE.diameter / 10} cm`,subject:'Imprimir en papel carta, tamaño real, escala 100%',creator:'Recuerdos de Navidad'});
 for(let i=0;i<9;i++){const c=centers[i];const cv=document.createElement('canvas');cv.width=1000;cv.height=1000;drawSlot(cv.getContext('2d'),images[i],photos[i],1000,i);doc.addImage(cv.toDataURL('image/png'),'PNG',c.x-PAGE.diameter/2,c.y-PAGE.diameter/2,PAGE.diameter,PAGE.diameter,undefined,'FAST');doc.setDrawColor(169,169,160);doc.setLineWidth(.15);doc.setLineDashPattern([.65,.85],0);doc.circle(c.x,c.y,PAGE.diameter/2,'S');}
 doc.setLineDashPattern([],0);doc.save(`recuerdos-navidad-carta-${PAGE.diameter}mm.pdf`);announce('PDF listo. Imprime en papel carta, a tamaño real (100%).');
 }catch(e){console.error(e);announce('No se pudo crear el PDF. Inténtalo de nuevo; tus fotos siguen aquí.');}finally{busy=false;$('#export').disabled=false;$('#export').innerHTML=`${icon('download')} Descargar PDF`;}
};
for(let i=0;i<9;i++){if(photos[i])try{images[i]=await loadImage(photos[i].src);}catch{photos[i]=null;}render(i);}
if(restored)announce('Tus recuerdos están aquí. Retoma tu hoja donde la dejaste.');
if(storageError){$('#save-status').textContent='El guardado local no está disponible.';$('#save-status').classList.add('save-error');}
