'use strict';
/* Installa / Aggiorna l'app (PWA) su Windows, Android, iOS e macOS. by Lollo ®2026 */
(()=>{
 const VERSION='2.7.4',$=id=>document.getElementById(id);
 const toast=m=>{const t=$('toast');if(!t||!$('toastText')){alert(m);return}$('toastText').textContent=m;if($('undoDelete'))$('undoDelete').hidden=true;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{t.hidden=true},7000)};
 const ua=navigator.userAgent,isIOS=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const isAndroid=/Android/.test(ua),isWindows=/Windows/.test(ua),isMac=/Macintosh/.test(ua)&&!isIOS;
 const isEdge=/Edg\//.test(ua),isFirefox=/Firefox|FxiOS/.test(ua),isChromeLike=/Chrome|CriOS|EdgiOS/.test(ua)&&!isEdge;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: window-controls-overlay)').matches||navigator.standalone===true;
 const swOk=()=>'serviceWorker'in navigator&&location.protocol!=='file:'&&(location.protocol==='https:'||/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname));
 const DEFAULT_URL='https://baudinolorenzo73.github.io/Cucina_comunita/';
 const local=location.protocol==='file:';
 const onlineUrl=()=>{try{return localStorage.getItem('cucina-online-url')||DEFAULT_URL}catch{return DEFAULT_URL}};
 let promptEvent=null,reloading=false;
 function onlineDialog(){
  const url=onlineUrl();
  showDialog('Apri la versione online','<p>Stai usando la copia sul disco (<code>file://</code>): da qui l’app non si può installare. La versione online sì, su Windows, Android e iPhone.</p><p>Premendo <b>Apri la versione online</b>:</p><ol><li>viene <b>salvato in automatico il backup</b> dei tuoi dati (file .json nei Download);</li><li>si apre il sito e <b>ti propone di importare i dati</b> (serve l’accesso operatore o master);</li><li>poi premi <b>📲 Installa / aggiorna app</b> nella finestra Config che si apre da sola.</li></ol><p class="muted">Indirizzo: <code id="pwaUrl"></code><br>Se la proposta di importazione non compare, usa sul sito <b>💾 Backup → Ripristina da file…</b> e scegli il file appena scaricato.</p><div class="button-row"><button type="button" class="primary" id="pwaOpen">🌐 Salva backup e apri online</button><button type="button" id="pwaChangeUrl">Cambia indirizzo</button></div>');
  const d=$('pwaDialog');d.querySelector('#pwaUrl').textContent=url;
  d.querySelector('#pwaOpen').onclick=()=>{
   let backup;try{backup=window.CucinaUnita.buildBackup();window.CucinaUnita.exportAll()}catch(e){toast(e.message);return}
   const u=new URL(onlineUrl());u.searchParams.set('installa','1');
   const w=window.open(u.href,'_blank');if(!w){toast('Il browser ha bloccato l’apertura: consenti i popup per questa pagina e riprova. Il backup è già stato salvato.');return}
   const h=ev=>{if(ev.source!==w||ev.data?.type!=='cucina-ready')return;window.removeEventListener('message',h);w.postMessage({type:'cucina-backup',backup},u.origin)};
   window.addEventListener('message',h);setTimeout(()=>window.removeEventListener('message',h),180000);
   toast('Backup salvato. Nel sito che si è aperto conferma l’importazione dei dati.');
  };
  d.querySelector('#pwaChangeUrl').onclick=()=>{const v=prompt('Indirizzo https del sito pubblicato:',onlineUrl());if(!v)return;try{const u=new URL(v);if(u.protocol!=='https:')throw Error();localStorage.setItem('cucina-online-url',u.href);d.querySelector('#pwaUrl').textContent=u.href}catch{toast('Indirizzo non valido: deve iniziare con https://')}};
 }

 function guide(){
  let title='Come installare l’app',steps=[];
  if(!swOk())return showDialog('Serve l’indirizzo del sito','<p>Aprendo il file direttamente dal disco (<code>'+location.protocol+'//…</code>) il browser non permette di installare né aggiornare l’app.</p><p>Apri invece l’indirizzo pubblicato del sito (https), per esempio quello di GitHub Pages, poi premi di nuovo questo pulsante.</p><p class="muted">I dati salvati in questa pagina restano separati da quelli del sito pubblicato: per spostarli usa 💾 Backup → Salva backup completo, poi Ripristina sul sito.</p>');
  if(isIOS)steps=['Apri questo sito con <b>Safari</b> (da iOS 16.4 funziona anche da Chrome o Edge).','Tocca il pulsante <b>Condividi</b> (il quadrato con la freccia in su, in basso o in alto).','Scorri e scegli <b>«Aggiungi alla schermata Home»</b>.','Tocca <b>Aggiungi</b>. L’icona compare nella Home: aprila da lì.'];
  else if(isAndroid)steps=isFirefox?['Tocca il menu <b>⋮</b> di Firefox.','Scegli <b>«Installa»</b> (o «Aggiungi a schermata Home»).','Conferma con <b>Aggiungi</b>.']:['Tocca il menu <b>⋮</b> di Chrome (in alto a destra).','Scegli <b>«Installa app»</b> (o «Aggiungi a schermata Home»).','Conferma con <b>Installa</b>. L’icona compare tra le tue app.'];
  else if(isWindows||(!isMac))steps=isFirefox?['Firefox su computer non installa le app: usa <b>Chrome</b> o <b>Edge</b>.']:isEdge?['Clicca il menu <b>⋯</b> in alto a destra.','Vai su <b>App → Installa questo sito come app</b>.','Conferma con <b>Installa</b>: compare nel menu Start e sul desktop.']:['Cerca l’icona <b>Installa</b> (monitor con freccia) a destra nella barra dell’indirizzo, oppure menu <b>⋮ → Trasmetti, salva e condividi → Installa pagina come app</b>.','Conferma con <b>Installa</b>: compare nel menu Start e sul desktop.'];
  else steps=['Con <b>Safari</b> (macOS Sonoma o successivi): menu <b>File → Aggiungi al Dock</b>.','Con <b>Chrome</b> o <b>Edge</b>: icona <b>Installa</b> nella barra dell’indirizzo.'];
  showDialog(title,'<ol>'+steps.map(s=>'<li>'+s+'</li>').join('')+'</ol><p class="muted">Se l’hai già installata, aprila dalla sua icona: così vedi l’app senza la barra del browser e puoi aggiornarla da qui.</p>');
 }
 function showDialog(title,html){
  let d=$('pwaDialog');if(d)d.remove();
  d=document.createElement('dialog');d.id='pwaDialog';
  d.innerHTML='<div class="dialog-top"><h2>'+title+'</h2><button type="button" aria-label="Chiudi" id="pwaClose">✕</button></div><div class="panel">'+html+'</div>';
  document.body.append(d);d.querySelector('#pwaClose').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());d.showModal();
 }

 function waitInstalled(reg,ms=20000){
  return new Promise(res=>{
   const done=v=>{clearTimeout(t);res(v)};const t=setTimeout(()=>done(!!reg.waiting),ms);
   if(reg.waiting)return done(true);
   const w=reg.installing;if(!w)return done(false);
   w.addEventListener('statechange',()=>{if(w.state==='installed')done(true);if(w.state==='redundant')done(false)});
  });
 }
 async function checkUpdate(){
  const reg=await navigator.serviceWorker.getRegistration();if(!reg)return{reg:null,found:false};
  await reg.update();
  const found=await waitInstalled(reg);
  return{reg,found};
 }
 function applyWaiting(reg){
  const w=reg.waiting;if(!w)return false;
  toast('Aggiornamento in corso: l’app si riavvia da sola…');
  w.postMessage('SKIP_WAITING');
  setTimeout(()=>{if(!reloading){reloading=true;location.reload()}},4000);
  return true;
 }
 async function main(){
  const btn=$('pwaMain');btn.disabled=true;const label=btn.textContent;btn.textContent='Controllo…';
  try{
   if(swOk()){
    if(navigator.onLine){
     try{const {reg,found}=await checkUpdate();if(found&&applyWaiting(reg))return}catch{}
    }else if(standalone()){toast('Sei offline: l’aggiornamento richiede Internet.');return}
    if(standalone()){toast('L’app è già aggiornata (versione '+VERSION+').');return}
    if(promptEvent){const ev=promptEvent;promptEvent=null;await ev.prompt();const r=await ev.userChoice.catch(()=>({}));toast(r.outcome==='accepted'?'Installazione avviata: cerca l’icona tra le tue app.':'Installazione annullata.');return}
    toast('Nessun aggiornamento: versione '+VERSION+'.');guide();
   }else if(local)onlineDialog();else guide();
  }finally{btn.disabled=false;btn.textContent=label;status()}
 }
 async function repair(){
  if(!confirm('Cancello la copia offline dell’app e la riscarico da Internet. I tuoi dati (ricette, menù, spesa, turni) NON vengono toccati. Continuo?'))return;
  try{
   if(!navigator.onLine)throw Error('Sei offline: la riparazione richiede Internet.');
   if(swOk()){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()));}
   if(window.caches){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('lollo-ricettario:')).map(k=>caches.delete(k)))}
   toast('Copia offline cancellata: ricarico l’app…');setTimeout(()=>location.reload(),900);
  }catch(e){toast(e.message)}
 }
 function status(){
  const el=$('pwaStatus'),b=$('pwaMain');if(!el||!b)return;
  const inst=standalone();
  b.textContent=inst?'🔄 Aggiorna app':local?'🌐 Apri online e installa':'📲 Installa / aggiorna app';
  el.textContent='Versione '+VERSION+' · '+(inst?'installata':'in uso nel browser')+' · '+(swOk()?'funziona anche offline':local?'copia locale: per installare apri la versione online':'offline non disponibile: apri il sito https');
 }
 let pending=null;
 function openConfig(){let f=null;try{f=sessionStorage.getItem('pwa-open-config')}catch{}if(!f)return;try{sessionStorage.removeItem('pwa-open-config')}catch{}try{$('settingsDialog').showModal();$('pwaMain')?.scrollIntoView({block:'center'})}catch{}}
 function tryImport(){
  if(!pending)return;
  if(!window.CucinaAccess?.canEdit()){toast('Dati ricevuti dalla copia su disco. Accedi come operatore o master per importarli.');$('accessOpen')?.click();return}
  const x=pending;pending=null;
  Promise.resolve().then(()=>window.CucinaUnita.importAll(x)).catch(e=>toast(e.message)).finally(()=>setTimeout(openConfig,1000));
 }
 function init(){
  const opener=window.opener,fromLocal=new URLSearchParams(location.search).get('installa')==='1';
  window.addEventListener('message',ev=>{if(!opener||ev.source!==opener||ev.data?.type!=='cucina-backup'||!ev.data.backup)return;pending=ev.data.backup;tryImport()});
  window.addEventListener('cucina-access-change',()=>setTimeout(tryImport,300));
  if(opener&&fromLocal){try{opener.postMessage({type:'cucina-ready'},'*')}catch{}}
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;status()});
  window.addEventListener('appinstalled',()=>{promptEvent=null;toast('App installata! Aprila dalla sua icona.');status()});
  matchMedia('(display-mode: standalone)').addEventListener?.('change',status);
  if(swOk()){
   navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading||!sessionStorage.getItem('pwa-updating'))return;reloading=true;location.reload()});
   navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(reg=>{
    if(reg.waiting&&navigator.serviceWorker.controller)toast('Nuova versione pronta: apri Config → «Aggiorna app».');
    reg.addEventListener('updatefound',()=>{const w=reg.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)toast('Nuova versione pronta: apri Config → «Aggiorna app».')})});
   }).catch(()=>toast('La modalità offline non è stata attivata.'));
  }
  const b=$('pwaMain'),r=$('pwaRepair');
  if(b)b.onclick=()=>{try{sessionStorage.setItem('pwa-updating','1')}catch{}main()};
  if(r)r.onclick=repair;
  status();
  if(fromLocal){history.replaceState(null,'',location.pathname+location.hash);try{sessionStorage.setItem('pwa-open-config','1')}catch{}}
  if(!(opener&&fromLocal))setTimeout(openConfig,600);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
