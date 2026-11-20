'use strict';
/* Barra della modalità: Stampa, Esporta (PDF/Word/Excel) e Backup totale. by Lollo ®2026 */
(()=>{
 const $=id=>document.getElementById(id);
 const toast=m=>{const t=$('toast');if(!t||!$('toastText')){alert(m);return}$('toastText').textContent=m;if($('undoDelete'))$('undoDelete').hidden=true;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{t.hidden=true},6000)};
 const editable=()=>!!window.CucinaAccess?.canEdit();
 const clickIn=(id,frame)=>()=>{let el=null;try{el=frame?$('turniFrame')?.contentDocument?.getElementById(id):$(id)}catch{}if(!el){toast('Azione non disponibile in questa schermata.');return}el.click();if(frame)setTimeout(()=>{try{const m=$('turniFrame').contentDocument.querySelector('#msgExport .bad');if(m&&m.textContent.trim())toast(m.textContent.trim())}catch{}},150)};
 const gen=(kind,get)=>()=>window.DocGen.save(kind,get());
 const trio=(get)=>[['PDF',gen('pdf',get)],['Word (.docx)',gen('docx',get)],['Excel (.xlsx)',gen('xlsx',get)]];
 const wa=get=>['📲 WhatsApp / Condividi',()=>window.DocGen.share(get())];
 function viewName(){const a=document.querySelector('#nav button.active');if(a)return a.dataset.view;const s=document.querySelector('main section[id$="View"]:not([hidden])');return s?s.id.replace(/View$/,''):'recipes'}
 function printSection(title){const s=$(viewName()+'View');const c=s.cloneNode(true);c.querySelectorAll('button,input,select,textarea,iframe,details,#sourcesList,[data-operator-only]').forEach(e=>e.remove());c.querySelectorAll('h2.section-title,h2.section-title+p,.page-kicker,.eyebrow').forEach(e=>e.remove());$('printContent').innerHTML='<div class="doc-print doc-page"><header><h1>'+title+'</h1><p>La nostra cucina</p></header>'+c.innerHTML+'<footer>La nostra cucina · by Lollo ®2026</footer></div>';$('printDialog').showModal()}
 function printPublicTurns(){window.DocGen.print(window.CucinaUnita.turniDocData($('publicTurniMonth')?.value))}
 function config(v){
  if(v==='recipes'||v==='favorites'||v==='export'){
   const R=()=>window.RecipeExports,sel=v==='export'?[]:(window.RecipePick?.list()||[]),base=sel.length?'Ricette_selezionate':v==='favorites'?'Ricette_preferite':'Ricettario_Lorenzo';
   const go=k=>()=>toast(R().run(k,v==='export'?undefined:(sel.length?sel:v==='favorites'?R().favorites():R().all()),base));
   const exp=[['PDF',go('pdf')],['Word (.docx)',go('docx')],['Excel (.xlsx)',go('xlsx')]];
   if(v!=='export')exp.push(['Scegli quali ricette…',()=>{window.switchView('export');window.scrollTo(0,0)}]);
   if(sel.length)exp.unshift(['--info','Solo le '+sel.length+(sel.length===1?' ricetta selezionata':' ricette selezionate')]);
   return{print:go('print'),exp,sel:sel.length};
  }
  if(v==='shopping')return{print:()=>window.DocGen.print(window.RecipeShopping.docData()),exp:[...trio(()=>window.RecipeShopping.docData()),wa(()=>window.RecipeShopping.docData())]};
  if(v==='community')return{print:()=>{clickIn('communityPrint')();setTimeout(()=>{if(!$('printDialog').open){const m=$('communityStatus')?.textContent;if(m)toast(m)}},100)},exp:[...trio(()=>window.CommunityShopping.docData()),wa(()=>window.CommunityShopping.docData())]};
  if(v==='menu')return{print:[['Menù del giorno',()=>window.MenuCalendar.printDay()],['Calendario del mese (A4)',()=>window.DocGen.printCalendar(window.MenuCalendar.calendarData())]],exp:trio(()=>window.MenuCalendar.docData())};
  if(v==='turni')return editable()?{print:clickIn('btnStampa',true),exp:[['PDF',clickIn('btnPdf',true)],['Word (.docx)',clickIn('btnDocx',true)],['Excel (.xlsx)',clickIn('btnXlsx',true)]]}:{print:printPublicTurns,exp:trio(()=>window.CucinaUnita.turniDocData($('publicTurniMonth')?.value))};
  if(v==='sources')return{print:()=>printSection('Fonti e storia'),exp:[]};
  if(v==='dedication')return{print:()=>printSection('Introduzione e dedica'),exp:[]};
  return{print:null,exp:[]};
 }
 let menu=null,menuOwner=null;
 function closeMenu(){if(menu){menu.remove();menu=null;menuOwner=null}}
 function openMenu(owner,entries){
  if(menu&&menuOwner===owner){closeMenu();return}closeMenu();
  menu=document.createElement('div');menu.className='bar-menu';menu.setAttribute('role','menu');menuOwner=owner;
  for(const [label,run,disabled,note] of entries){if(label==='--info'){const p=document.createElement('p');p.className='bar-menu-info';p.textContent=run;menu.append(p);continue}const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=!!disabled;if(note)b.title=note;b.onclick=()=>{closeMenu();try{run()}catch(e){toast(e.message)}};menu.append(b)}
  $(owner).parentElement.append(menu);
 }
 const DAY=86400000;
 function backupAge(){const t=window.CucinaUnita?.lastBackup?.();if(!t)return{days:null,text:'mai salvato',warn:true};const d=Math.floor((Date.now()-new Date(t).getTime())/DAY);return{days:d,text:d<=0?'oggi':d===1?'ieri':d+' giorni fa',warn:d>7,when:new Date(t).toLocaleString('it-IT')}}
 function refresh(){
  const c=config(viewName()),p=$('barPrint'),e=$('barExport');if(!p||!e)return;
  p.disabled=!c.print;p.title=c.print?(c.sel?'Stampa le '+c.sel+' ricette selezionate':'Stampa la schermata aperta'):'Nessuna stampa per questa schermata';
  e.disabled=!c.exp.length;e.title=c.exp.length?(c.sel?'Esporta le '+c.sel+' ricette selezionate':'Esporta la schermata aperta in PDF, Word o Excel'):'Nessuna esportazione per questa schermata';
  const a=backupAge(),b=$('barBackup');b.classList.toggle('warn',a.warn);$('barBackupAge').textContent=a.text;b.title=a.warn?'Backup vecchio o mai fatto: salvane uno!':'Ultimo backup: '+a.when;
  const k=viewName()+editable();if(k!==refresh.k){refresh.k=k;closeMenu()}
 }
 function init(){
  const bar=document.querySelector('.access-bar'),open=$('accessOpen');if(!bar||!open||$('barPrint'))return;
  const wrap=document.createElement('span');wrap.className='bar-actions';
  wrap.innerHTML='<button type="button" id="barPrint" aria-label="Stampa">🖨<span class="lbl"> Stampa</span></button><button type="button" id="barExport" aria-haspopup="true" aria-label="Esporta">⬇<span class="lbl"> Esporta</span></button><button type="button" id="barBackup" aria-haspopup="true" aria-label="Backup">💾<span class="lbl"> Backup</span> <small id="barBackupAge"></small></button>';
  bar.insertBefore(wrap,open);
  $('barPrint').onclick=ev=>{ev.stopPropagation();const c=config(viewName());if(Array.isArray(c.print)){openMenu('barPrint',c.print);return}closeMenu();try{c.print?.()}catch(e){toast(e.message)}};
  $('barExport').onclick=ev=>{ev.stopPropagation();const c=config(viewName());if(c.exp.length)openMenu('barExport',c.exp)};
  $('barBackup').onclick=ev=>{ev.stopPropagation();const a=backupAge(),can=editable();
   openMenu('barBackup',[['--info','Ultimo backup: '+(a.when||'mai')],['Salva backup completo',()=>window.CucinaUnita.exportAll()],['Ripristina da file…',()=>window.CucinaUnita.pickRestore(),!can,can?'':'Serve l’accesso operatore o master']])};
  document.addEventListener('click',e=>{if(!e.target.closest('.bar-actions'))closeMenu();document.querySelectorAll('details.select-menu[open]').forEach(d=>{if(!d.contains(e.target)||e.target.closest('div>button'))d.open=false});setTimeout(refresh,50)});
  window.addEventListener('hashchange',()=>setTimeout(refresh,50));window.addEventListener('cucina-access-change',()=>setTimeout(refresh,50));window.addEventListener('cucina-backup-done',()=>setTimeout(refresh,50));
  refresh();
  setTimeout(()=>{const a=backupAge();if(a.warn)toast(a.days===null?'Non hai ancora fatto un backup: premi 💾 Backup nella barra.':'Ultimo backup di '+a.days+' giorni fa: conviene salvarne uno nuovo (💾 Backup).')},2500);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
