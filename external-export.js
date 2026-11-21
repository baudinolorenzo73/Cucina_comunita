'use strict';
/* Copia completa (programma + dati) su un'unità esterna: cartella normale + ZIP.
   Il browser non può formattare dischi: qui si controlla che l'unità sia scrivibile e,
   se non lo è, si spiega come formattarla da Windows con tutte le precauzioni. by Lollo ®2026 */
window.ExternalExport=(()=>{
 const $=id=>document.getElementById(id);
 const enc=new TextEncoder();
 const pad=n=>String(n).padStart(2,'0');
 const stamp=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
 const EXTRA=['turni.html','LEGGIMI.md','README.md','docs/Guida-La-nostra-cucina.pdf'];
 let busy=false,logFn=null;
 const kb=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';

 function log(t,cls){
  if(logFn){logFn(t,cls);return}
  const el=$('extLog');if(!el)return;el.hidden=false;
  const p=document.createElement('div');p.textContent=t;if(cls)p.className=cls;el.append(p);el.scrollTop=el.scrollHeight;
 }
 function openGuide(){const g=$('extGuide');if(g)g.open=true}

 async function fetchBytes(path){
  let r;
  try{r=await fetch('./'+path,{cache:'no-store'})}
  catch{throw Error('Non riesco a leggere i file del programma da qui (succede aprendo il file dal disco). Apri il sito online e riprova.')}
  if(!r.ok)throw Error('File del programma mancante: '+path+' (errore '+r.status+').');
  return new Uint8Array(await r.arrayBuffer());
 }
 async function programList(){
  let text;
  try{const r=await fetch('./sw.js',{cache:'no-store'});if(!r.ok)throw 0;text=await r.text()}
  catch{throw Error('Non riesco a leggere l’elenco dei file del programma. Apri il sito online e riprova.')}
  const block=(text.match(/const FILES=\[([^\]]*)\]/)||[])[1]||'';
  const files=[...block.matchAll(/'\.\/([^']+)'/g)].map(m=>m[1]);
  if(files.length<10)throw Error('Elenco dei file del programma non valido.');
  const version=(text.match(/CACHE=PREFIX\+'([^']+)'/)||[])[1]||'?';
  return{files:[...new Set([...files,...EXTRA])],version};
 }

 /* Prova di scrittura: crea, rilegge e cancella un piccolo file temporaneo. */
 async function checkWritable(dir){
  const name='.prova-scrittura-'+Date.now()+'.tmp',data=enc.encode('prova '+Date.now());
  let fh;
  try{
   fh=await dir.getFileHandle(name,{create:true});
   const w=await fh.createWritable();await w.write(data);await w.close();
   const back=new Uint8Array(await(await fh.getFile()).arrayBuffer());
   if(back.length!==data.length||back.some((b,i)=>b!==data[i]))throw Error('mismatch');
  }catch(e){
   throw Object.assign(Error('L’unità non permette di scrivere (protetta da scrittura, piena, non formattata o con errori).'),{notWritable:true});
  }finally{try{await dir.removeEntry(name)}catch{}}
 }
 async function countEntries(dir,max=200){let n=0;for await(const _ of dir.values()){n++;if(n>=max)break}return n}

 async function dirFor(root,parts){let d=root;for(const p of parts)d=await d.getDirectoryHandle(p,{create:true});return d}
 async function writeFile(root,path,bytes){
  const parts=path.split('/'),name=parts.pop(),dir=await dirFor(root,parts);
  const fh=await dir.getFileHandle(name,{create:true});
  const w=await fh.createWritable();await w.write(bytes);await w.close();
  return fh;
 }
 async function exists(root,name){try{await root.getDirectoryHandle(name);return true}catch{}try{await root.getFileHandle(name);return true}catch{}return false}

 function readmeText(version,when,n){
  return `LA NOSTRA CUCINA — copia completa
by Lollo ®2026

Creata il ${when.toLocaleString('it-IT')} dalla versione ${version} · ${n} file del programma.

CHE COSA C'È
- Questa cartella contiene il PROGRAMMA: apri «index.html» con Chrome o Edge per usarlo (anche senza internet).
- Aprendo index.html da qui l'app chiede se vuoi installarla su questo computer o su un telefono/tablet Android.
- «dati/» contiene la COPIA DEI TUOI DATI (ricette, menù, spese, turni) in un file .json.
- Accanto a questa cartella trovi lo stesso contenuto in un unico file .zip.

COME RIMETTERE I DATI
1. Apri l'app (dal sito o da questa cartella).
2. Barra in alto → 💾 Backup → «Ripristina da file…» (serve l'accesso operatore).
3. Scegli il file .json dentro «dati/» e spunta le parti da rimettere.

NOTE
- I dati dell'app vivono nel browser: aprendo index.html da questa cartella l'app parte vuota finché non ripristini il file .json.
- Le password degli operatori NON sono nella copia: si impostano di nuovo dall'accesso master.
- Per la guida illustrata apri «docs/Guida-La-nostra-cucina.pdf».
`;
 }

 /* Scrive la copia nella cartella scelta. Restituisce un riepilogo. */
 async function exportTo(root,progress){
  logFn=progress||null;
  const when=new Date(),base='La-nostra-cucina_'+stamp(when),zipName=base+'.zip';
  let created=false;
  try{
   if(await exists(root,base)||await exists(root,zipName))throw Error('Esiste già una copia con questo nome: riprova tra un secondo.');
   log('Preparo i dati (database)…');
   const backup=window.CucinaUnita.buildBackup();
   const dataName='dati/La_nostra_cucina_dati_'+when.toISOString().slice(0,10)+'.json';
   const dataBytes=enc.encode(JSON.stringify(backup,null,2));
   log('Leggo i file del programma…');
   const {files,version}=await programList();
   const entries={};
   let i=0;
   for(const f of files){entries[f]=await fetchBytes(f);i++;if(i%8===0)log('  letti '+i+' di '+files.length+' file…')}
   entries[dataName]=dataBytes;
   entries['LEGGIMI-PRIMA.txt']=enc.encode(readmeText(version,when,files.length));
   const total=Object.values(entries).reduce((n,b)=>n+b.length,0);
   log('Totale da scrivere: '+kb(total)+' in cartella + '+kb(total)+' nello ZIP.');

   log('Creo lo ZIP…');
   const zipFiles={};for(const[k,v]of Object.entries(entries))zipFiles[base+'/'+k]=v;
   const zipBytes=window.RecipeExports.lib.zip(zipFiles);

   log('Scrivo la cartella «'+base+'»…');
   created=true;
   await dirFor(root,[base]);
   const written=[];
   for(const[k,v]of Object.entries(entries)){await writeFile(root,base+'/'+k,v);written.push([base+'/'+k,v.length])}
   log('Scrivo «'+zipName+'»…');
   await writeFile(root,zipName,zipBytes);written.push([zipName,zipBytes.length]);

   log('Verifico quanto scritto…');
   for(const[path,size]of written){
    const parts=path.split('/'),name=parts.pop(),dir=await dirFor(root,parts);
    const f=await(await dir.getFileHandle(name)).getFile();
    if(f.size!==size)throw Error('Verifica fallita su «'+path+'»: scritti '+f.size+' byte invece di '+size+'.');
   }
   const head=new Uint8Array(await(await(await root.getFileHandle(zipName)).getFile()).slice(0,2).arrayBuffer());
   if(head[0]!==0x50||head[1]!==0x4b)throw Error('Lo ZIP scritto non risulta valido.');
   const back=JSON.parse(await(await(await(await dirFor(root,[base,'dati'])).getFileHandle(dataName.split('/')[1])).getFile()).text());
   if(back.format!=='lollo-cucina-unita')throw Error('Il file dei dati scritto non è leggibile.');
   window.CucinaUnita.markBackup?.();
   const res={base,zipName,files:written.length,total,version};
   log('✓ Fatto: '+res.files+' file verificati ('+kb(total)+'). Cartella «'+base+'» e «'+zipName+'».','ok');
   return res;
  }catch(e){
   if(created){
    // si rimuove solo ciò che ha creato questa operazione, mai altro
    try{await root.removeEntry(base,{recursive:true})}catch{}
    try{await root.removeEntry(zipName)}catch{}
    log('La copia incompleta è stata rimossa dall’unità.','bad');
   }
   throw e;
  }finally{logFn=null}
 }

 const INTRO=`COPIA COMPLETA SU UNITÀ ESTERNA

Prima di continuare:
• Collega l'unità (chiavetta o disco) e controlla che compaia in Esplora file.
• Deve essere già formattata (consigliato exFAT o NTFS). Questo programma NON può formattare: se Windows chiede «Devi formattare il disco», chiudi questo avviso e segui la guida «Unità non formattata?» qui nelle Impostazioni.
• Nel passo dopo sceglierai una CARTELLA sull'unità (se Chrome rifiuta la radice, crea prima una cartella, per esempio «Copie cucina»).
• Non viene cancellato né sovrascritto nulla: viene creata una cartella nuova con data e ora, più un file ZIP.

Continuare?`;

 async function start(){
  if(busy)return;
  const btn=$('extStart'),el=$('extLog');if(el){el.textContent='';el.hidden=true}
  if(!window.showDirectoryPicker||!window.isSecureContext){
   log('✗ Questa funzione richiede Chrome o Edge su computer (Windows, Mac, Linux), da sito https o app installata. Sul telefono non è disponibile.','bad');return;
  }
  if(!window.CucinaUnita?.buildBackup){log('✗ L’app non è ancora pronta: riprova tra un attimo.','bad');return}
  if(!confirm(INTRO))return;
  let dir;
  try{dir=await window.showDirectoryPicker({id:'cucina-esterna',mode:'readwrite'})}
  catch(e){
   if(e.name==='AbortError'){log('Annullato: nessuna cartella scelta.');return}
   log('✗ Chrome non ha permesso di usare quella posizione ('+(e.message||e.name)+'). Scegli una cartella dentro l’unità, non l’unità intera né una cartella di sistema.','bad');openGuide();return;
  }
  busy=true;if(btn)btn.disabled=true;
  try{
   log('Cartella scelta: «'+dir.name+'». Controllo che si possa scrivere…');
   await checkWritable(dir);
   log('✓ Scrittura riuscita.','ok');
   const n=await countEntries(dir);
   const ok=confirm('Scrittura sull’unità riuscita.\n\nCartella scelta: «'+dir.name+'»'+(n?'\nContiene già '+(n>=200?'200 o più':n)+' elementi: non verranno toccati.':'\n(vuota)')+'\n\nVerranno create qui:\n• una cartella «La-nostra-cucina_data_ora» con programma e dati\n• lo stesso contenuto in un file .zip\n\nÈ proprio la cartella sull’unità esterna?');
   if(!ok){log('Annullato dall’utente: non è stato scritto nulla.');return}
   const res=await exportTo(dir);
   alert('Copia completata e verificata.\n\nCartella: '+res.base+'\nZIP: '+res.zipName+'\n\nPuoi espellere l’unità in sicurezza da Windows.');
  }catch(e){
   log('✗ '+e.message,'bad');
   if(e.notWritable){log('Se l’unità è nuova o Windows ne chiede la formattazione, usa la guida qui sotto.');openGuide()}
  }finally{busy=false;if(btn)btn.disabled=false}
 }

 function init(){const b=$('extStart');if(b)b.onclick=start}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 return{start,exportTo,checkWritable};
})();
