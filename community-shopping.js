'use strict';
window.CommunityShopping=(()=>{
  const KEY='ricettario-community-shopping-v2',OLD_KEY='ricettario-community-shopping-v1',STORES=['Angelo','Eurospin','Altro'];
  const UNITS=[
    {value:'',label:'Senza unità'},
    {value:'pz',label:'Pezzi (pz)'},
    {value:'gr',label:'Grammi (gr)'},
    {value:'lt',label:'Litri (lt)'},
    {value:'conf',label:'Confezioni (conf)'},
    {value:'altro',label:'Altro'}
  ];
  const SOURCE=`Colazione/Merenda\tBiscotti
Colazione/Merenda\tCaffè
Colazione/Merenda\tCioccolato in polvere
Colazione/Merenda\tMiele
Colazione/Merenda\tOrzo
Colazione/Merenda\tTè
Colazione/Merenda\tTisane
Cucina/Cibo\tGrissini
Cucina/Cibo\tDolcificante
Cucina/Cibo\tZucchero bianco
Cucina/Cibo\tZucchero di canna
Cucina/Cibo\tCeci
Cucina/Cibo\tFagioli
Cucina/Cibo\tLegumi secchi
Cucina/Cibo\tLenticchie in scatola
Cucina/Cibo\tMais
Cucina/Cibo\tMarmellata
Cucina/Cibo\tPassata di pomodoro
Cucina/Cibo\tPolpa di pomodoro
Animali\tCrocchette cani
Animali\tCrocchette gatti
Animali\tScatolette cani
Animali\tScatolette gatti
Casa/Pulizia\tAmmoniaca
Casa/Pulizia\tAmmorbidente
Casa/Pulizia\tCandeggina 5L
Casa/Pulizia\tCarta igienica
Casa/Pulizia\tDetersivo lavatrice
Casa/Pulizia\tDetersivo pavimenti 2L
Casa/Pulizia\tGuanti monouso M/L
Casa/Pulizia\tPagliette
Casa/Pulizia\tPanni cucina
Casa/Pulizia\tRotoloni carta
Casa/Pulizia\tSacchi pattumiera 80x110
Casa/Pulizia\tScope e palette
Casa/Pulizia\tSpugne per bagni
Casa/Pulizia\tSpugne per pentole
Casa/Pulizia\tStuzzicadenti
Casa/Pulizia\tTovaglioli
Igiene Personale\tAssorbenti
Igiene Personale\tBagnoschiuma
Igiene Personale\tBalsamo capelli
Igiene Personale\tDentifricio
Igiene Personale\tDetergente intimo
Igiene Personale\tDeodorante ambiente
Igiene Personale\tFazzoletti
Igiene Personale\tLamette
Igiene Personale\tSaponetta
Igiene Personale\tSchiuma da barba
Igiene Personale\tShampoo
Igiene Personale\tSpazzolini da denti
Formaggi/Carne/Pesce/Freschi\tAffettati in vaschetta
Formaggi/Carne/Pesce/Freschi\tArrosto
Formaggi/Carne/Pesce/Freschi\tBonroll
Formaggi/Carne/Pesce/Freschi\tBurro
Formaggi/Carne/Pesce/Freschi\tCosce/fettine di pollo
Formaggi/Carne/Pesce/Freschi\tFiletti di pesce
Formaggi/Carne/Pesce/Freschi\tFormaggio
Formaggi/Carne/Pesce/Freschi\tLatte
Formaggi/Carne/Pesce/Freschi\tLievito di pizza
Formaggi/Carne/Pesce/Freschi\tMix grattugiato
Formaggi/Carne/Pesce/Freschi\tMozzarelle
Formaggi/Carne/Pesce/Freschi\tPanna per dolci
Formaggi/Carne/Pesce/Freschi\tPasta fresca
Formaggi/Carne/Pesce/Freschi\tPasta sfoglia
Formaggi/Carne/Pesce/Freschi\tPetti di pollo
Formaggi/Carne/Pesce/Freschi\tRagù
Formaggi/Carne/Pesce/Freschi\tRicotta
Formaggi/Carne/Pesce/Freschi\tRolatine di pollo
Formaggi/Carne/Pesce/Freschi\tSalamino piccante
Formaggi/Carne/Pesce/Freschi\tSalsiccia
Cucina/Cibo\tAcciughe
Cucina/Cibo\tCapperi
Cucina/Cibo\tCous-cous
Cucina/Cibo\tDado
Cucina/Cibo\tFarina integrale/manitoba
Cucina/Cibo\tOlive nere
Cucina/Cibo\tOlive verdi
Cucina/Cibo\tOlio di semi
Cucina/Cibo\tOlio EVO
Cucina/Cibo\tOlio di oliva
Cucina/Cibo\tPanna da cucina
Cucina/Cibo\tPangrattato
Cucina/Cibo\tPasta minestre
Cucina/Cibo\tPastina per lasagna
Cucina/Cibo\tPasta sfoglia
Cucina/Cibo\tRiso
Cucina/Cibo\tSale fino
Cucina/Cibo\tSale grosso
Cucina/Cibo\tSpezie
Cucina/Cibo\tTonno in scatola grande
Cucina/Cibo\tTonno in scatola piccolo
Cucina/Cibo\tUova
Cucina/Cibo\tZafferano
Altro per la casa/Pulizia\tAlluminio
Altro per la casa/Pulizia\tBicchieri plastica grandi
Altro per la casa/Pulizia\tBicchieri plastica piccoli
Altro per la casa/Pulizia\tCarta forno
Altro per la casa/Pulizia\tPellicola
Altro per la casa/Pulizia\tPiatti plastica
Altro per la casa/Pulizia\tPosate plastica
Prodotti Eurospin\tCorn flakes\tEurospin
Prodotti Eurospin\tCrackers\tEurospin
Prodotti Eurospin\tDeodorante corpo no alcol\tEurospin
Prodotti Eurospin\tSalvaslip\tEurospin
Prodotti Eurospin\tFarina di grano 00\tEurospin
Prodotti Eurospin\tFette biscottate\tEurospin
Prodotti Eurospin\tMuslei\tEurospin
Prodotti Eurospin\tYogurt\tEurospin
Prodotti Eurospin\tWurstel\tEurospin`;
  const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid=()=>crypto.randomUUID?.()||'community-'+Date.now()+'-'+Math.random().toString(36).slice(2);
  const seed=()=>({version:1,other:'',items:SOURCE.split('\n').map((line,i)=>{const [department,name,store]=line.split('\t');return{id:'drive-'+i,department,name,qty:'',unit:'',store:store||'Angelo',selected:false,custom:false}})});
  let api,archive={version:2,activeDate:'',days:{}},data=seed(),editing='';
  const today=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`};
  function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(v||'')}
  function validItem(i){return i&&typeof i.id==='string'&&typeof i.name==='string'&&i.name.trim()&&typeof i.department==='string'}
  function sanitizeDay(x){const d={version:1,other:typeof x?.other==='string'?x.other.slice(0,20000):'',items:Array.isArray(x?.items)?x.items.filter(validItem).slice(0,2000).map(i=>({id:i.id,name:i.name.slice(0,180),department:i.department.slice(0,100),qty:typeof i.qty==='string'?i.qty.slice(0,80):'',unit:UNITS.some(u=>u.value===i.unit)?i.unit:'',store:STORES.includes(i.store)?i.store:'Altro',selected:!!i.selected,custom:!!i.custom})):[]};return d}
  function baseList(){return Array.isArray(archive.base)&&archive.base.length?archive.base:seed().items.map(({id,department,name,store,unit})=>({id,department,name,store,unit:unit||''}))}
  function fresh(){return{version:1,other:'',items:baseList().map(i=>({id:i.id,department:i.department,name:i.name,qty:'',unit:i.unit||'',store:i.store,selected:false,custom:!String(i.id).startsWith('drive-')}))}}
  function ensureBase(){if(!Array.isArray(archive.base)||!archive.base.length)archive.base=baseList()}
  function baseUpsert(it,afterId){ensureBase();const e={id:it.id,department:it.department,name:it.name,store:it.store,unit:it.unit||''},k=archive.base.findIndex(x=>x.id===it.id);if(k>=0)archive.base[k]=e;else{const a=archive.base.findIndex(x=>x.id===afterId);a>=0?archive.base.splice(a+1,0,e):archive.base.push(e)}}
  function baseRemove(id){ensureBase();archive.base=archive.base.filter(x=>x.id!==id)}
  function baseInfo(){const e=$('communityBaseInfo');if(e)e.textContent='Lista fissa: '+baseList().length+' prodotti'+(Array.isArray(archive.base)&&archive.base.length?' (modificata da te)':' (originale)')+'. Ogni nuova giornata parte da qui.'}
  function ensureDay(date){if(!archive.days[date])archive.days[date]=fresh();return archive.days[date]}
  function load(){const date=today();if(window.CucinaDataGuard?.isBlocked(KEY)){archive={version:2,activeDate:date,days:{}};data=ensureDay(date);return}try{const x=JSON.parse(localStorage.getItem(KEY));if(x?.version===2&&x.days&&typeof x.days==='object'){archive={version:2,activeDate:validDate(x.activeDate)?x.activeDate:date,days:{}};for(const [day,value] of Object.entries(x.days))if(validDate(day))archive.days[day]=sanitizeDay(value);if(Array.isArray(x.base))archive.base=x.base.filter(i=>i&&typeof i.id==='string'&&typeof i.name==='string'&&i.name.trim()&&STORES.includes(i.store)).slice(0,2000).map(i=>({id:i.id.slice(0,200),name:i.name.slice(0,180),department:String(i.department||'Altro').slice(0,100),store:i.store,unit:typeof i.unit==='string'?i.unit:''}))}else{const old=JSON.parse(localStorage.getItem(OLD_KEY));archive={version:2,activeDate:date,days:{[date]:sanitizeDay(old||seed())}}}}catch{archive={version:2,activeDate:date,days:{}}}data=ensureDay(archive.activeDate)}
  function markSaved(){const e=$('communitySaved');if(e)e.textContent='Salvato automaticamente · '+new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}
  function save(render=true){if(window.CucinaDataGuard?.isBlocked(KEY)){$('communityStatus').textContent='Salvataggio protetto: recupera i dati originali e ripristina un backup valido.';return false}archive.days[archive.activeDate]=data;try{localStorage.setItem(KEY,JSON.stringify(archive));markSaved()}catch{if($('communityStatus'))$('communityStatus').textContent='Salvataggio locale non riuscito. Esporta subito l’archivio.'}if(render)renderList();baseInfo()}
  function renderHistory(){const days=Object.keys(archive.days).sort().reverse();$('communityHistory').innerHTML=days.map(d=>{const n=archive.days[d].items.filter(i=>i.selected||i.qty.trim()).length;return `<option value="${d}" ${d===archive.activeDate?'selected':''}>${new Date(d+'T12:00:00').toLocaleDateString('it-IT')} · ${n} prodotti</option>`}).join('');$('communityDate').value=archive.activeDate}
  function switchDay(date){if(!validDate(date))return;save(false);archive.activeDate=date;data=ensureDay(date);$('communityOther').value=data.other;$('communitySearch').value='';$('communityStoreFilter').value='';save();$('communityStatus').textContent='Giornata '+new Date(date+'T12:00:00').toLocaleDateString('it-IT')+' aperta.'}
  function filtered(){const q=$('communitySearch').value.trim().toLocaleLowerCase('it'),store=$('communityStoreFilter').value;return data.items.filter(i=>(!store||i.store===store)&&(!q||(i.name+' '+i.department).toLocaleLowerCase('it').includes(q)))}
  function unitOptions(value){return UNITS.map(u=>`<option value="${u.value}" ${value===u.value?'selected':''}>${u.label}</option>`).join('')}
  function formatQty(i){const qty=i.qty.trim();if(!qty)return '________';return i.unit&&i.unit!=='altro'?qty+' '+i.unit:qty}
  function row(i){return `<div class="community-row ${i.selected?'selected':''}"><input type="checkbox" data-community-check="${esc(i.id)}" ${i.selected?'checked':''} aria-label="Da comprare: ${esc(i.name)}"><button class="community-name" data-community-edit="${esc(i.id)}"><strong>${esc(i.name)}</strong><small>${esc(i.department)}</small></button><div class="community-quantity"><input data-community-qty="${esc(i.id)}" value="${esc(i.qty)}" maxlength="80" placeholder="Quantità" aria-label="Quantità per ${esc(i.name)}"><select data-community-unit="${esc(i.id)}" aria-label="Unità per ${esc(i.name)}">${unitOptions(i.unit)}</select></div><select data-community-store="${esc(i.id)}" aria-label="Supermercato per ${esc(i.name)}">${STORES.map(s=>`<option ${i.store===s?'selected':''}>${s}</option>`).join('')}</select><button class="community-edit" data-community-edit="${esc(i.id)}" aria-label="Modifica ${esc(i.name)}">✎</button></div>`}
  function renderList(){const list=filtered(),departments=[...new Set(list.map(i=>i.department))];$('communityList').innerHTML=departments.length?departments.map(d=>`<section class="community-department"><h3>${esc(d)}</h3>${list.filter(i=>i.department===d).map(row).join('')}</section>`).join(''):'<div class="empty-mini">Nessun prodotto trovato.</div>';const active=data.items.filter(i=>i.selected||i.qty.trim()).length;$('communitySummary').textContent=`${active} da comprare · ${data.items.length} prodotti totali`;if($('communityOther').value!==data.other)$('communityOther').value=data.other;renderHistory()}
  function activeItems(){return data.items.filter(i=>i.selected||i.qty.trim())}
  function printHtml(){const items=activeItems(),other=data.other.trim();if(!items.length&&!other)throw Error('Spunta almeno un prodotto, inserisci una quantità oppure scrivi nello spazio ALTRO.');const lines=items.length+[...new Set(items.map(i=>i.store+'|'+i.department))].length*1.6+(other?other.split('\n').length+3:0),size=lines>150?'9pt':lines>125?'9.5pt':items.length>80?'10pt':items.length>45?'11pt':'12pt';let body='';for(const store of STORES){const storeItems=items.filter(i=>i.store===store);if(!storeItems.length)continue;body+=`<section class="community-print-store"><h2>${esc(store)}</h2>`;for(const dep of [...new Set(storeItems.map(i=>i.department))])body+=`<div class="community-print-group"><h3>${esc(dep)}</h3>${storeItems.filter(i=>i.department===dep).map(i=>`<div class="community-print-row"><span>☐</span><b>${esc(i.name)}</b><em>${esc(formatQty(i))}</em></div>`).join('')}</div>`;body+='</section>'}if(other)body+=`<section class="community-print-other"><h2>ALTRO</h2><p>${esc(other).replace(/\n/g,'<br>')}</p></section>`;return `<div class="community-print" style="--community-print-size:${size}"><header><h1>Lista della spesa · Comunità</h1><p>${new Date(archive.activeDate+'T12:00:00').toLocaleDateString('it-IT')} · ${items.length} prodotti</p></header><div class="community-print-columns">${body}</div></div>`}
  function print(){try{api.printHTML(printHtml());$('communityStatus').textContent='Anteprima A4 pronta. Controlla e premi “Stampa ora”.'}catch(e){$('communityStatus').textContent=e.message}}
  function openEdit(id){const i=data.items.find(x=>x.id===id);if(!i)return;editing=id;$('communityEditName').value=i.name;$('communityEditQty').value=i.qty;$('communityEditUnit').value=i.unit;$('communityEditDepartment').value=i.department;$('communityEditStore').value=i.store;$('communityEditFixed').checked=false;$('communityEditDialog').showModal()}
  function csv(){const lines=[['Data','Supermercato','Reparto','Prodotto','Quantità','Unità'],...activeItems().map(i=>[archive.activeDate,i.store,i.department,i.name,i.qty,i.unit==='altro'?'Altro':i.unit])];if(data.other.trim())lines.push([archive.activeDate,'Altro','ALTRO',data.other.replace(/\n/g,' / '),'','']);const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return '\ufeff'+lines.map(r=>r.map(q).join(';')).join('\r\n')}
  function exportArchive(){save(false);api.download('Spesa_comunita_archivio_'+today()+'.json',JSON.stringify({...archive,exportedAt:new Date().toISOString()},null,2),'application/json');$('communityStatus').textContent=Object.keys(archive.days).length+' giornate esportate.'}
  function importArchive(x){window.CucinaDataGuard?.validate(KEY,x);if(!x||x.version!==2||!x.days||typeof x.days!=='object')throw Error('Scegli un archivio JSON della spesa comunità.');let count=0;for(const [day,value] of Object.entries(x.days))if(validDate(day)){archive.days[day]=sanitizeDay(value);count++}if(!count)throw Error('L’archivio non contiene giornate valide.');data=ensureDay(archive.activeDate);save();$('communityStatus').textContent=count+' giornate importate e unite all’archivio.'}
  function init(options){api=options;load();$('communityOther').value=data.other;renderList();$('communityDate').onchange=e=>switchDay(e.target.value);$('communityHistory').onchange=e=>switchDay(e.target.value);$('communityToday').onclick=()=>switchDay(today());$('communityCopyPrevious').onclick=()=>{const prev=Object.keys(archive.days).filter(d=>d<archive.activeDate).sort().pop();if(!prev){$('communityStatus').textContent='Non ci sono giornate precedenti da copiare.';return}if((activeItems().length||data.other.trim())&&!confirm('Sostituire il contenuto del giorno aperto con quello del '+new Date(prev+'T12:00:00').toLocaleDateString('it-IT')+'?'))return;data=JSON.parse(JSON.stringify(archive.days[prev]));archive.days[archive.activeDate]=data;$('communityOther').value=data.other;save();$('communityStatus').textContent='Giornata precedente copiata.'};$('communitySearch').oninput=renderList;$('communityStoreFilter').onchange=renderList;$('communityList').onclick=e=>{const b=e.target.closest('[data-community-edit]');if(b)openEdit(b.dataset.communityEdit)};$('communityList').onchange=e=>{const check=e.target.dataset.communityCheck,store=e.target.dataset.communityStore,unit=e.target.dataset.communityUnit;if(check){const i=data.items.find(x=>x.id===check);i.selected=e.target.checked;save()}if(store){const i=data.items.find(x=>x.id===store);i.store=e.target.value;save()}if(unit){const i=data.items.find(x=>x.id===unit);i.unit=UNITS.some(u=>u.value===e.target.value)?e.target.value:'';save()}};$('communityList').oninput=e=>{const id=e.target.dataset.communityQty;if(!id)return;const i=data.items.find(x=>x.id===id);i.qty=e.target.value.slice(0,80);if(i.qty.trim())i.selected=true;save(false);const row=e.target.closest('.community-row'),box=row?.querySelector('[data-community-check]');row?.classList.toggle('selected',i.selected);if(box)box.checked=i.selected;$('communitySummary').textContent=`${activeItems().length} da comprare · ${data.items.length} prodotti totali`};$('communityOther').oninput=e=>{data.other=e.target.value.slice(0,20000);save(false)};$('communitySelectQty').onclick=()=>{data.items.forEach(i=>{if(i.qty.trim())i.selected=true});save()};$('communityClear').onclick=()=>{data.items.forEach(i=>i.selected=false);save()};$('communityAdd').onsubmit=e=>{e.preventDefault();data.items.push({id:uid(),name:$('communityAddName').value.trim(),qty:$('communityAddQty').value.trim(),unit:$('communityAddUnit').value,department:$('communityAddDepartment').value.trim()||'Altro',store:$('communityAddStore').value,selected:true,custom:true});const fixed=$('communityAddFixed').checked;if(fixed)baseUpsert(data.items[data.items.length-1]);e.target.reset();$('communityAddStore').value='Angelo';$('communityAddUnit').value='';save();$('communityStatus').textContent=fixed?'Prodotto aggiunto oggi e alla lista fissa.':'Prodotto aggiunto solo per oggi.'};$('communityEditForm').onsubmit=e=>{e.preventDefault();const i=data.items.find(x=>x.id===editing);if(!i)return;i.name=$('communityEditName').value.trim();i.qty=$('communityEditQty').value.trim();i.unit=$('communityEditUnit').value;i.department=$('communityEditDepartment').value.trim()||'Altro';i.store=$('communityEditStore').value;if(i.qty)i.selected=true;if($('communityEditFixed').checked)baseUpsert(i);save();$('communityEditDialog').close();$('communityStatus').textContent=$('communityEditFixed').checked?'Modifica salvata anche nella lista fissa.':'Modifica salvata per questa giornata.'};$('communityDelete').onclick=()=>{const i=data.items.find(x=>x.id===editing);const fixed=$('communityEditFixed').checked;if(i&&confirm('Eliminare “'+i.name+'”'+(fixed?' da questa giornata e dalla lista fissa (non comparirà più nei prossimi giorni)?':' solo da questa giornata?'))){data.items=data.items.filter(x=>x.id!==editing);if(fixed)baseRemove(editing);save();$('communityEditDialog').close();$('communityStatus').textContent='Prodotto eliminato'+(fixed?' anche dalla lista fissa.':' da questa giornata.')}};$('communityPrint').onclick=print;$('communityReset').onclick=()=>{if(confirm('Ricominciare questa giornata da zero? Si torna alla lista fissa ('+baseList().length+' prodotti): quantità, spunte, prodotti aggiunti al volo e testo ALTRO di questo giorno verranno cancellati. Le altre giornate non cambiano.')){data=fresh();archive.days[archive.activeDate]=data;save();$('communityOther').value='';$('communityStatus').textContent='Giornata ripristinata.'}}}
  function bulkSelection(mode){data.items.forEach(i=>{if(mode==='all')i.selected=true;else if(mode==='none')i.selected=false;else i.selected=!i.selected});save();$('communityStatus').textContent=mode==='all'?'Tutti i prodotti selezionati.':mode==='none'?'Tutte le spunte rimosse; le quantità inserite restano conservate.':'Selezione invertita.'}
  function initWithBulk(options){init(options);
   $('communityQuick').onsubmit=e=>{e.preventDefault();const name=$('communityQuickName').value.trim();if(!name)return;data.items.push({id:uid(),name:name.slice(0,180),qty:$('communityQuickQty').value.trim().slice(0,80),unit:'',department:'Aggiunti a mano',store:$('communityQuickStore').value,selected:true,custom:true});$('communityQuickName').value='';$('communityQuickQty').value='';save();$('communityStatus').textContent='«'+name+'» aggiunto per oggi: è già spuntato e uscirà in stampa.';$('communityQuickName').focus()};
   $('communityDuplicate').onclick=()=>{const i=data.items.find(x=>x.id===editing);if(!i)return;const copy={...i,id:uid(),name:i.name+' (copia)',custom:true};data.items.splice(data.items.indexOf(i)+1,0,copy);if($('communityEditFixed').checked)baseUpsert(copy,i.id);save();openEdit(copy.id);$('communityEditName').select();$('communityStatus').textContent='Copia creata: cambia nome, quantità o supermercato e premi Salva.'};
   $('communityBaseReset').onclick=()=>{if(!confirm('Tornare alla lista fissa originale di 110 prodotti? Vale per le prossime giornate nuove: le giornate già salvate non cambiano.'))return;delete archive.base;save();$('communityStatus').textContent='Lista fissa originale ripristinata.'};
   baseInfo();$('communitySelectAll').onclick=()=>bulkSelection('all');$('communityClear').onclick=()=>bulkSelection('none');$('communityInvert').onclick=()=>bulkSelection('invert')}
  function docData(){const items=activeItems(),other=data.other.trim();if(!items.length&&!other)throw Error('Spunta almeno un prodotto, inserisci una quantità oppure scrivi nello spazio ALTRO.');
  const qty=i=>{const q=formatQty(i);return /^[_\s]*$/.test(q)?'':q},date=new Date(archive.activeDate+'T12:00:00').toLocaleDateString('it-IT'),sections=[],rows=[['Supermercato','Reparto','Prodotto','Quantità']];
  for(const store of STORES){const list=items.filter(i=>i.store===store);if(!list.length)continue;const out=[];for(const dep of [...new Set(list.map(i=>i.department))]){out.push({h:dep});for(const i of list.filter(x=>x.department===dep)){out.push({check:true,t:i.name,r:qty(i)});rows.push([store,dep,i.name,qty(i)])}}sections.push({heading:store,items:out})}
  if(other){sections.push({heading:'ALTRO',items:other.split('\n').filter(Boolean)});rows.push(['Altro','ALTRO',other.replace(/\n/g,' / '),''])}
  return{base:'Spesa_comunita_'+archive.activeDate,doc:{title:'Lista della spesa · Comunità',subtitle:date+' · '+items.length+' prodotti',sections},sheets:[{name:'Spesa',rows,widths:[16,26,42,18]}]};}
  return{init:initWithBulk,refresh:renderList,docData,seedCount:()=>seed().items.length,exportData:()=>JSON.parse(JSON.stringify(archive))};
})();
