'use strict';
window.CucinaUnita=(()=>{
 const KEYS=['lollo-ricettario-v1','ricettario-menu-calendar-v1','ricettario-community-shopping-v2','ricettario-shopping-v2','ricettario-appearance-v2','ricettario-theme','turni_offline_state_v1'];
 const $=id=>document.getElementById(id);
 let api,frameReady=false;
 const NOVEMBER_2026={
  1:['ANA','ELENA'],2:['VALERIO','VALENTINA'],3:['ROBI','MAX',null,'DARIO'],4:['BRIAN','PAOLO'],5:['ELENA','ALESSANDRA','DARIO'],
  6:['MONICA','VALERIO'],7:['THIERRY','DARIO'],8:['EDO','ELENA'],9:['PAOLO','ANA','DARIO'],10:['VALENTINA','MONICA'],
  11:['VALERIO','EDO'],12:['THIERRY','ALESSANDRA'],13:['ROBI','ELENA'],14:['PAOLO','BRIAN'],15:['MAX','VALERIO'],
  16:['ALESSANDRA','VALENTINA'],17:['BRIAN','EDO','DARIO'],18:['MONICA','THIERRY'],19:['EDO','ANA'],20:['VALERIO','MONICA'],
  21:['ALESSANDRA','DARIO'],22:['VALENTINA','ROBI'],23:['DARIO','EDO'],24:['THIERRY','VALENTINA'],25:['MONICA','BRIAN'],
  26:['MAX','VALERIO'],27:['EDO','ROBI'],28:['BRIAN','THIERRY'],29:['ELENA','MONICA'],30:['ANA','PAOLO']
 };
 const engine=()=>{try{return $('turniFrame')?.contentWindow?.CucinaTurniAPI}catch{return undefined}};
 const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function getMenu(date){return window.MenuCalendar.getDay(date)}
 function openMenu(date){api.openView('menu');window.MenuCalendar.selectDate(date)}
 function bundledAssignment(date){
  if(!/^2026-11-\d{2}$/.test(date))return null;const row=NOVEMBER_2026[Number(date.slice(-2))];if(!row)return null;
  return{archived:true,cucina:row[0],servizio:row[1],affCucina:row[2]||null,affServizio:row[3]||null};
 }
 function assignment(date){
  let s=engine()?.snapshot();if(!s){try{s=JSON.parse(localStorage.getItem('turni_offline_state_v1'))}catch{return bundledAssignment(date)}}if(!s)return bundledAssignment(date);
  const [y,m,g]=date.split('-').map(Number),current=s.anno===y&&s.mese===m;
  const currentSpecial=current?s.giorniSpeciali?.find(x=>x.giorno===g):null;
  const archived=s.storico?.[y+'-'+m];
  const record=current&&(s.griglia||currentSpecial)?s:archived;if(!record)return bundledAssignment(date);
  // Never present an invalidated generated plan as an assignment.
  const d=record.griglia?.[g],special=record.giorniSpeciali?.find(x=>x.giorno===g);
  if(!d&&!special)return bundledAssignment(date);
  return {archived:record!==s,cucina:special?special.cucina.join(', '):d.CUCINA||'Da assegnare',servizio:special?special.servizio.join(', '):d.SERVIZIO||'Da assegnare',affCucina:d?.affCucina,affServizio:d?.affServizio};
 }
 function renderAssignment(date){
  const el=$('menuTurni');if(!el)return;el.dataset.date=date;const a=assignment(date);
  el.innerHTML='<h3>Turni cucina e servizio</h3>'+(a?.archived?'<p>Dal piano archiviato del mese.</p>':'')+(a?'<p><b>Cucina:</b> '+safe(a.cucina)+(a.affCucina?' · affiancamento '+safe(a.affCucina):'')+'</p><p><b>Servizio:</b> '+safe(a.servizio)+(a.affServizio?' · affiancamento '+safe(a.affServizio):'')+'</p>':'<p>Nessun turno salvato per questa data. Puoi generarlo o importare il backup della vecchia app.</p>')+'<button type="button" id="openTurniDate">Apri i turni del mese</button>';
  $('openTurniDate').onclick=()=>{api.openView('turni');$('publicTurniMonth').value=date.slice(0,7);renderPublicTurns();engine()?.showMonth(date)};
 }
 function syncTheme(){
  if(!frameReady)return;const s=getComputedStyle(document.body),map={'--bg':'--bg','--card':'--paper','--surface2':'--paper','--ink':'--ink','--muted':'--muted','--line':'--line','--accent':'--accent','--accent-text':'--on-accent','--accent2':'--secondary','--modal-bg':'--paper','--header-bg':'--paper'};
  engine()?.setTheme(document.body.classList.contains('dark'),Object.fromEntries(Object.entries(map).map(([k,v])=>[k,s.getPropertyValue(v)])));
 }
 function turnsChanged(){syncTheme();const date=$('menuTurni')?.dataset.date;if(date)renderAssignment(date)}
 function turnsReady(){frameReady=true;syncTheme();turnsChanged()}
 function recoverStorage(){const data={};for(const key of window.CucinaDataGuard.KEYS)data[key]=localStorage.getItem(key);api.download('Cucina_recupero_originali_'+Date.now()+'.json',JSON.stringify({format:'lollo-cucina-recupero',data,issues:window.CucinaDataGuard.issues()},null,2));api.toast('Copia originale esportata per il recupero. Questo file conserva anche eventuali sezioni non leggibili.');}
 function assignmentHTML(date){const a=assignment(date);return a?'<div class="menu-notes"><b>Turni'+(a.archived?' · archivio':'')+'</b><p>Cucina: '+safe(a.cucina)+(a.affCucina?' · affiancamento '+safe(a.affCucina):'')+'<br>Servizio: '+safe(a.servizio)+(a.affServizio?' · affiancamento '+safe(a.affServizio):'')+'</p></div>':''}
 const LAST='cucina-last-backup';
 const BACKUP_GROUPS=[['ricette','Ricette',['lollo-ricettario-v1']],['menu','Calendario menù',['ricettario-menu-calendar-v1']],['spesa','Spesa comunità e Spesa AI',['ricettario-community-shopping-v2','ricettario-shopping-v2']],['turni','Turni',['turni_offline_state_v1']],['colori','Colori e aspetto',['ricettario-appearance-v2','ricettario-theme']]];
 function buildBackup(){
  if(window.CucinaDataGuard.issues().length)throw Error('Alcuni dati non sono leggibili: apri ⚙ Impostazioni → Dati e scarica la copia dei dati bloccati.');
  const data={};for(const key of KEYS)data[key]=localStorage.getItem(key);
  data['lollo-ricettario-v1']=JSON.stringify(api.recipeState());
  data['ricettario-menu-calendar-v1']=JSON.stringify(window.MenuCalendar.exportData());
  data['ricettario-community-shopping-v2']=JSON.stringify(window.CommunityShopping.exportData());
  data['ricettario-shopping-v2']=JSON.stringify(window.RecipeShopping.exportData());
  if(engine())data.turni_offline_state_v1=JSON.stringify(engine().snapshot());
  return{format:'lollo-cucina-unita',version:2,exportedAt:new Date().toISOString(),data};
 }
 function lastBackup(){try{return localStorage.getItem(LAST)}catch{return null}}
 function exportAll(){
  const b=buildBackup();
  api.download('La_nostra_cucina_backup_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(b,null,2));
  try{localStorage.setItem(LAST,b.exportedAt)}catch{}
  window.dispatchEvent(new CustomEvent('cucina-backup-done'));
  api.toast('Backup completo salvato: ricette, menù, spesa, turni e colori. Chiavi API escluse.');
 }
 function validateAll(x){
  if(x?.format!=='lollo-cucina-unita'||x.version!==2||!x.data||typeof x.data!=='object')throw Error('Backup unico non valido.');
  if(!engine())throw Error('Attendi il caricamento della sezione turni.');
  for(const key of KEYS){const raw=x.data[key];if(raw!==null&&typeof raw!=='string')throw Error('Sezione mancante o non valida: '+key);if(raw!==null)window.CucinaDataGuard.validate(key,key==='ricettario-theme'?raw:JSON.parse(raw))}
  api.validateRecipes(JSON.parse(x.data['lollo-ricettario-v1']));
  const t=JSON.parse(x.data.turni_offline_state_v1),err=t===null?null:engine().validate(t);if(err)throw Error(err);
  const m=JSON.parse(x.data['ricettario-menu-calendar-v1']);if(m?.version!==1||!m.templates||!m.overrides)throw Error('Calendario menù non valido.');
  const c=JSON.parse(x.data['ricettario-community-shopping-v2']);if(c?.version!==2||!c.days)throw Error('Archivio spesa non valido.');
 }
 function askRestoreGroups(x){
  return new Promise(resolve=>{
   const present=BACKUP_GROUPS.filter(([,,keys])=>keys.some(k=>x.data[k]!==null&&x.data[k]!==undefined));
   const d=document.createElement('dialog');d.id='restoreDialog';
   const when=x.exportedAt?new Date(x.exportedAt).toLocaleString('it-IT'):'data non indicata';
   d.innerHTML='<div class="dialog-top"><h2>Ripristina backup</h2></div><p>Backup del <b>'+safe(when)+'</b>. Scegli cosa ripristinare: le parti non spuntate restano come sono ora.</p><div id="restoreChecks">'+present.map(([id,label])=>'<label class="check-option"><input type="checkbox" value="'+id+'" checked><span>'+safe(label)+'</span></label>').join('')+'</div><p class="muted">Prima di sovrascrivere viene scaricata una copia di sicurezza dei dati attuali.</p><div class="button-row"><button type="button" class="primary" id="restoreGo">Ripristina</button><button type="button" id="restoreCancel">Annulla</button></div>';
   document.body.append(d);const done=v=>{d.close();d.remove();resolve(v)};
   d.querySelector('#restoreGo').onclick=()=>{const g=[...d.querySelectorAll('input:checked')].map(i=>i.value);if(!g.length){api.toast('Spunta almeno una parte da ripristinare.');return}done(g)};
   d.querySelector('#restoreCancel').onclick=()=>done(null);d.addEventListener('cancel',e=>{e.preventDefault();done(null)});d.showModal();
  });
 }
 async function importAll(x){
  window.CucinaAccess.requireEdit();
  validateAll(x);
  const groups=await askRestoreGroups(x);if(!groups)return;
  const keys=BACKUP_GROUPS.filter(([id])=>groups.includes(id)).flatMap(([,,k])=>k);
  const safety=buildBackup();api.download('Cucina_copia_prima_del_ripristino_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(safety,null,2));
  const before=Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));
  try{for(const k of keys)localStorage.removeItem(k);for(const k of keys)if(x.data[k]!==null&&x.data[k]!==undefined)localStorage.setItem(k,x.data[k])}
  catch(e){let failed=false;for(const k of keys){try{localStorage.removeItem(k)}catch{failed=true}}for(const k of keys){try{if(before[k]!==null)localStorage.setItem(k,before[k])}catch{failed=true}}if(failed)throw Error('Ripristino non riuscito: usa la copia di sicurezza appena scaricata.');throw Error('Spazio insufficiente: ripristino annullato, dati precedenti conservati.')}
  setTimeout(()=>location.reload(),600);
 }
 function pickRestore(){window.CucinaAccess.requireEdit();$('unifiedImportFile').click()}
 function pasqua(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da)}
 const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 function festivo(date){
  const y=+date.slice(0,4),md=date.slice(5),F={'01-01':'Capodanno','01-06':'Epifania','04-25':'Liberazione','05-01':'Festa del Lavoro','06-02':'Festa della Repubblica','08-15':'Ferragosto','11-01':'Ognissanti','12-08':'Immacolata','12-25':'Natale','12-26':'Santo Stefano'};
  if(y>=2026)F['10-04']='San Francesco';
  const p=pasqua(y),pm=new Date(p);pm.setDate(p.getDate()+1);
  if(date===iso(p))return 'Pasqua';if(date===iso(pm))return 'Pasquetta';
  return F[md]||'';
 }
 function turniDocData(month){
  const m=/^\d{4}-\d{2}$/.test(month||'')?month:new Date().toISOString().slice(0,7),[y,mo]=m.split('-').map(Number),n=new Date(y,mo,0).getDate();
  const rows=[['Giorno','Data','Cucina','Affiancamento cucina','Servizio','Affiancamento servizio']],table=[];
  for(let g=1;g<=n;g++){const date=m+'-'+String(g).padStart(2,'0'),a=assignment(date),dt=new Date(date+'T12:00:00'),wd=dt.toLocaleDateString('it-IT',{weekday:'short'}),we=dt.getDay()===0||dt.getDay()===6,fest=festivo(date);
   rows.push([g,date,a?.cucina||'',a?.affCucina||'',a?.servizio||'',a?.affServizio||'']);
   table.push({cells:[g+' '+wd,(a?.cucina||'—')+(a?.affCucina?' + '+a.affCucina+' (aff.)':''),(a?.servizio||'—')+(a?.affServizio?' + '+a.affServizio+' (aff.)':'')],strong:we||!!fest,tint:fest?'fest':we?'we':''})}
  if(!rows.slice(1).some(r=>r[2]||r[4]))throw Error('Nessun turno salvato per questo mese.');
  const title=new Date(y,mo-1,1).toLocaleDateString('it-IT',{month:'long',year:'numeric'});
  return{base:'Turni_'+m,doc:{title:'Turni cucina e servizio · '+title,subtitle:'La nostra cucina · stampato il '+new Date().toLocaleDateString('it-IT')+' · in grassetto sabati, domeniche e festivi',onePage:true,sections:[{table:{head:['Giorno','Cucina','Servizio'],widths:[70,226,227],rows:table,cls:'days'}}]},sheets:[{name:'Turni',rows,widths:[8,12,22,24,22,24]}],rows:table,title};
 }


 function refresh(){renderPublicTurns();syncTheme();try{$('turniFrame').contentWindow?.aggiornaMenuCollegati?.()}catch{}}

 function renderPublicTurns(){
  const el=$('publicTurniTable'),month=$('publicTurniMonth')?.value;if(!el||!/^\d{4}-\d{2}$/.test(month||''))return;
  const [y,m]=month.split('-').map(Number),n=new Date(y,m,0).getDate();let rows='',found=false;
  for(let g=1;g<=n;g++){const date=month+'-'+String(g).padStart(2,'0'),a=assignment(date);if(a)found=true;rows+='<tr><th scope="row">'+g+'</th><td>'+safe(a?.cucina||'—')+(a?.affCucina?'<small>Affiancamento: '+safe(a.affCucina)+'</small>':'')+'</td><td>'+safe(a?.servizio||'—')+(a?.affServizio?'<small>Affiancamento: '+safe(a.affServizio)+'</small>':'')+'</td></tr>'}
  el.innerHTML=found?'<table class="public-turni-table"><thead><tr><th>Giorno</th><th>Cucina</th><th>Servizio</th></tr></thead><tbody>'+rows+'</tbody></table>':'<p>Nessun turno salvato per questo mese su questo dispositivo.</p>';
 }
 function accessChanged(){
  const editable=window.CucinaAccess?.canEdit(),frame=$('turniFrame');$('publicTurni').hidden=!!editable;frame.hidden=!editable;
  if(editable){if(!frame.dataset.loaded){frame.dataset.loaded='yes';if(window.TURNI_DOCUMENT)frame.srcdoc=window.TURNI_DOCUMENT;else frame.src='./turni.html'}}
  else {frameReady=false;delete frame.dataset.loaded;frame.removeAttribute('srcdoc');frame.src='about:blank';renderPublicTurns()}
  window.MenuCalendar?.refresh();
 }
 function init(options){
  api=options;
  if(/^https?:$/.test(location.protocol)&&window.TURNI_DOCUMENT)fetch('./turni.html').then(r=>r.ok?r.text():null).then(t=>{if(t&&t!==window.TURNI_DOCUMENT){console.warn('turni-doc.js non coincide con turni.html: lancia strumenti/aggiorna-turni-doc.py');if(window.CucinaAccess?.role()==='owner')api.toast('Attenzione Lorenzo: turni-doc.js è vecchio. Lancia strumenti/aggiorna-turni-doc.py e ripubblica.')}}).catch(()=>{});
  if(window.CucinaDataGuard.issues().length){$('recoverBox').hidden=false;setTimeout(()=>api.toast('Alcuni dati non sono leggibili: apri ⚙ Impostazioni → Dati.'),1500)}
  $('recoverStorage').onclick=()=>{try{recoverStorage()}catch(e){api.toast(e.message)}};
  $('unifiedImportFile').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>30*1024*1024)throw Error('Il file supera 30 MB.');await importAll(JSON.parse(await f.text()))}catch(err){api.toast(err.message)}finally{e.target.value=''}};
  $('legacyTurniImport').onclick=()=>$('legacyTurniFile').click();
  $('legacyTurniFile').onchange=async e=>{try{window.CucinaAccess.requireEdit();const f=e.target.files[0];if(!f)return;if(f.size>20*1024*1024)throw Error('Il file supera 20 MB.');if(!engine())throw Error('Attendi il caricamento dei turni.');const d=JSON.parse(await f.text());window.CucinaAccess.requireEdit();if(!engine())throw Error('Accesso scaduto.');const err=engine().validate(d);if(err)throw Error(err);if(!confirm('Importare persone, regole e turni dal backup selezionato? I turni attualmente aperti saranno sostituiti.'))return;engine().importData(d);api.toast('Turni importati. Ricette, menù e spesa sono disponibili nello stesso programma.')}catch(err){api.toast('Importazione non riuscita: '+err.message)}finally{e.target.value=''}};
  $('turniFrame').addEventListener('load',turnsReady);
  new MutationObserver(syncTheme).observe(document.body,{attributes:true,attributeFilter:['class','style']});
  $('publicTurniMonth').value=new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0');
  $('publicTurniMonth').onchange=renderPublicTurns;
  window.addEventListener('cucina-access-change',accessChanged);window.addEventListener('storage',()=>{renderPublicTurns();const date=$('menuTurni')?.dataset.date;if(date)renderAssignment(date)});accessChanged();
 }
 return{init,assignment,assignmentHTML,recoverStorage,getMenu,openMenu,renderAssignment,turnsChanged,turnsReady,exportAll,buildBackup,importAll,pickRestore,lastBackup,turniDocData,festivo,refresh};
})();

