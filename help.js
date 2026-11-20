'use strict';
/* Aiuto: pulsante «?» generale in alto e un pulsantino «?» accanto al titolo di ogni sezione. by Lollo ®2026 */
(()=>{
 const $=id=>document.getElementById(id);
 const GUIDA='./docs/Guida-La-nostra-cucina.pdf';
 // pagina della guida PDF (numero fisico, copertina compresa)
 const H={
  generale:{t:'Come funziona l’app',p:6,h:`
   <p><b>La nostra cucina</b> raccoglie ricette, menù, turni e spesa della comunità. Funziona su telefono, tablet e computer, anche senza rete.</p>
   <h3>La barra colorata in alto</h3>
   <ul><li><b>👁 Pubblico</b> (grigio-blu): consultare, stampare, esportare, fare il backup.</li>
   <li><b>✎ Operatore</b> (verde): in più modificare, generare e pubblicare i turni, ripristinare.</li>
   <li><b>★ Master</b> (oro): in più gestire la password degli operatori.</li></ul>
   <p>Per entrare premi <b>Accesso operatori</b> (sul telefono 🔑). L'accesso si chiude dopo 15 minuti di inattività.</p>
   <h3>I comandi che valgono ovunque</h3>
   <ul><li><b>🖨 Stampa</b> e <b>⬇ Esporta</b> (PDF, Word, Excel) agiscono sulla schermata aperta.</li>
   <li><b>💾 Backup</b> salva tutti i dati in un file: fallo almeno una volta a settimana.</li>
   <li><b>⚙ Impostazioni</b>: installare o aggiornare l'app, tema e colori, importazioni.</li></ul>
   <div class="help-warn">I dati restano solo nel browser di questo dispositivo: il backup è l'unico modo per conservarli o spostarli.</div>`},
  recipes:{t:'Le mie ricette',p:13,h:`
   <ul><li><b>Cerca</b> per nome o ingrediente, filtra per categoria, cambia l'ordine.</li>
   <li>Tocca una scheda per aprirla: <b>Modifica</b>, <b>Stampa / PDF</b>, <b>Chiedi all'AI</b>, <b>Duplica</b>, <b>Elimina</b>.</li>
   <li>Il cuore ♡ aggiunge la ricetta alle <b>Preferite</b>.</li>
   <li><b>☑ Seleziona ricette</b>: spunta le schede che vuoi, poi usa la barra in basso per <b>stampare</b> o esportare in <b>PDF, Word, Excel</b> solo quelle. Anche 🖨 e ⬇ in alto usano la selezione.</li>
   <li><b>＋ Nuova ricetta</b>: titolo, categoria, persone, foto e testo.</li>
   <li>Tieni premuta una scheda e trascinala per cambiare l'ordine personale.</li></ul>
   <div class="help-tip">Nel testo scrivi i titoli di sezione con <code>## </code> (es. <code>## Ingredienti</code>) e gli ingredienti con <code>- </code>: stampe e PDF verranno ordinati.</div>`},
  favorites:{t:'Preferite',p:13,h:`
   <p>Qui trovi solo le ricette con il cuore ♥. Tocca di nuovo il cuore su una scheda per toglierla.</p>
   <p><b>🖨 Stampa</b> ed <b>⬇ Esporta</b> in questa schermata usano solo le preferite.</p>`},
  menu:{t:'Calendario menù',p:15,h:`
   <ul><li>Due <b>schemi settimanali</b>, invernale (ottobre–marzo) ed estivo, che si ripetono ogni settimana.</li>
   <li>Scegli il mese con ← → o <b>Oggi</b> e tocca un giorno: vedi portate, turni e <b>ingredienti calcolati</b> sulle persone.</li>
   <li>Operatori: <b>✎ Modifica menù del giorno</b> cambia solo quella data; <b>Copia da un altro giorno</b> riprende un menù già fatto; lo <b>schema stagionale</b> in basso cambia il menù tipo.</li>
   <li><b>🖨 Stampa</b>: «Menù del giorno» oppure «Calendario del mese (A4)». <b>⬇ Esporta</b>: calendario in PDF e Word, Excel con giorni e ingredienti.</li></ul>`},
  turni:{t:'Turni cucina e servizio',p:17,h:`
   <ul><li>La tabella mostra per ogni giorno chi è di <b>cucina</b>, di <b>servizio</b> e gli <b>affiancamenti</b>.</li>
   <li><b>👤 I miei turni</b>: scegli il tuo nome e vedi solo i tuoi giorni. <b>📅 Aggiungi al calendario del telefono</b> scarica un file .ics con promemoria alle 18 del giorno prima.</li>
   <li><b>🖨 Stampa</b> ed <b>⬇ Esporta</b>: il mese su un solo foglio A4, weekend e festivi evidenziati.</li></ul>
   <h3>Operatori</h3>
   <ul><li>Il generatore ha le schede Progetto, Persone, Indisponibilità, Turni fissi, Regole, Genera, Export. Dentro c'è anche <b>? Aiuto turni</b>.</li>
   <li><b>📤 Pubblica i turni per tutti</b>: scegli il mese, scarica <code>turni-pubblicati.js</code>, mettilo nel progetto al posto del vecchio e ripubblica con Pubblica.</li></ul>`},
  community:{t:'Spesa comunità',p:22,h:`
   <ul><li>Ogni <b>giornata</b> si salva da sola; in alto scegli la data o <b>Copia giorno precedente</b>.</li>
   <li>Spunta <b>Da comprare</b> o scrivi la <b>quantità</b>: in stampa escono solo quei prodotti. <b>Selezione ▾</b> spunta in blocco.</li>
   <li><b>➕ Aggiungi al volo</b> (riga in cima): solo per oggi, già spuntato.</li>
   <li><b>Aggiungi un prodotto</b> con la spunta «lista fissa»: resta anche nei giorni dopo.</li>
   <li>Tocca il nome o ✎ per <b>Salva</b>, <b>Duplica</b>, <b>Elimina</b>. Con «Applica anche alla lista fissa» vale anche per i prossimi giorni.</li>
   <li><b>ALTRO</b>: testo libero stampato in fondo. <b>📲 Invia la lista su WhatsApp</b> nel pannello Giornata.</li></ul>
   <div class="help-tip">La stampa sta al massimo su 2 pagine A4.</div>`},
  shopping:{t:'Spesa AI',p:26,h:`
   <ol><li>Scegli le ricette e le persone, indica cosa hai già in dispensa.</li>
   <li>Premi <b>✧ Crea la spesa con AI</b> (serve una chiave in Assistente AI) oppure <b>Copia prompt</b>, incollalo in ChatGPT e poi <b>Usa la risposta incollata</b>.</li>
   <li>Correggi, spunta, aggiungi a mano; poi stampa, esporta o manda su WhatsApp.</li></ol>
   <div class="help-warn">Controlla sempre quantità, allergeni e unità proposte dall'AI.</div>`},
  explore:{t:'Esplora sul web',p:26,h:`
   <ul><li><b>Una ricerca sul web</b>: scrivi cosa vuoi cucinare e scegli Google o DuckDuckGo; si apre una nuova scheda.</li>
   <li><b>TheMealDB</b>: database internazionale, cerca in inglese («pasta», «chicken», «cake») o premi <b>Sorprendimi</b>.</li>
   <li>Per salvare una ricetta trovata usa <b>＋ Nuova ricetta</b> e indica la fonte.</li></ul>`},
  ai:{t:'Assistente AI',p:27,h:`
   <ol><li>Scegli il servizio (Google Gemini o OpenRouter) e incolla la tua <b>chiave API</b>.</li>
   <li>Premi <b>Carica modelli disponibili</b> e scegline uno.</li>
   <li>Se vuoi, allega una ricetta; scrivi la domanda e premi <b>✧ Chiedi all'AI</b>.</li>
   <li>La risposta si può copiare o salvare come <b>nuova bozza</b> di ricetta.</li></ol>
   <div class="help-tip">La chiave resta solo finché la pagina è aperta e non finisce nel backup. Senza chiave usa <b>Copia prompt</b> e incollalo in ChatGPT.</div>`},
  export:{t:'Scegli le ricette',p:28,h:`
   <p>Spunta le ricette da includere (o <b>Seleziona tutte</b> / <b>Nessuna</b>), poi scegli il formato qui sotto oppure usa <b>🖨 Stampa</b> / <b>⬇ Esporta</b> nella barra in alto.</p>
   <p>La spunta per le fonti decide se stampare anche note e provenienza delle ricette.</p>`},
  dedication:{t:'Introduzione e dedica',p:2,h:`<p>Le parole con cui si apre il ricettario. Con <b>🖨 Stampa</b> puoi stamparle in una pagina.</p>`},
  sources:{t:'Fonti e storia',p:6,h:`<p>Da dove arrivano le ricette: i documenti originali su Google Drive e come sono state riunite le varianti. Le modifiche nell'app non cambiano i file su Drive.</p>`}
 };
 const SECT={recipes:'recipes',favorites:'recipes',menu:'menu',turni:'turni',community:'community',shopping:'shopping',explore:'explore',ai:'ai',export:'export',dedication:'dedication',sources:'sources'};
 function open(key){
  const x=H[key]||H.generale;let d=$('helpDialog');if(d)d.remove();
  d=document.createElement('dialog');d.id='helpDialog';d.className='help-dialog';
  const others=key==='generale'?'<h3>Aiuto sulle sezioni</h3><div class="help-links">'+Object.entries(H).filter(([k])=>k!=='generale'&&k!=='favorites').map(([k,v])=>'<button type="button" data-help-go="'+k+'">'+v.t+'</button>').join('')+'</div>':'<p><button type="button" class="link-btn" data-help-go="generale">← Come funziona l’app</button></p>';
  d.innerHTML='<div class="dialog-top"><h2>? '+x.t+'</h2><button type="button" aria-label="Chiudi aiuto" data-help-close>✕</button></div><div class="help-body">'+x.h+others+'</div><div class="help-foot"><a class="help-pdf" href="'+GUIDA+'#page='+x.p+'" target="_blank" rel="noopener">📖 Apri la guida completa (PDF, pagina '+x.p+')</a></div>';
  document.body.append(d);
  d.addEventListener('click',e=>{const g=e.target.closest('[data-help-go]');if(g){open(g.dataset.helpGo);return}if(e.target.closest('[data-help-close]')||e.target===d)d.close()});
  d.addEventListener('close',()=>d.remove());d.showModal();
 }
 function init(){
  // pulsante generale accanto a ⚙
  const set=$('settings');
  if(set&&!$('helpOpen')){const b=document.createElement('button');b.id='helpOpen';b.className='icon-btn';b.type='button';b.setAttribute('aria-label','Aiuto');b.title='Aiuto';b.textContent='?';b.onclick=()=>open('generale');set.before(b)}
  // pulsantino accanto al titolo di ogni sezione (rimesso al suo posto se l'app riscrive il titolo)
  const dot=(view,key)=>{const h=document.querySelector('#'+view+'View h1');if(!h||h.querySelector('.help-dot'))return h;
   const b=document.createElement('button');b.type='button';b.className='help-dot';b.textContent='?';b.title='Aiuto su questa sezione';b.setAttribute('aria-label','Aiuto: '+H[key].t);
   b.onclick=e=>{e.stopPropagation();const act=document.querySelector('#nav button.active')?.dataset.view;open(view==='recipes'&&act==='favorites'?'favorites':key)};h.append(b);return h};
  for(const [view,key] of Object.entries(SECT)){const h=dot(view,key);if(h)new MutationObserver(()=>dot(view,key)).observe(h,{childList:true})}
 }
 window.CucinaHelp={open};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
