'use strict';
/* Selezione delle ricette dalla schermata principale: stampa o esporta solo quelle scelte. by Lollo ®2026 */
window.RecipePick=(()=>{
 const $=id=>document.getElementById(id);
 const picked=new Set();
 let on=false,bar=null,toggle=null;
 const all=()=>window.RecipeExports?window.RecipeExports.all():[];
 const list=()=>all().filter(r=>picked.has(r.id));
 const has=id=>picked.has(id);
 const toast=m=>{const t=$('toast');if(!t||!$('toastText')){alert(m);return}$('toastText').textContent=m;if($('undoDelete'))$('undoDelete').hidden=true;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{t.hidden=true},6000)};
 function sync(){
  document.body.classList.toggle('pick-mode',on);
  document.querySelectorAll('#recipeGrid [data-pick]').forEach(b=>{const s=picked.has(b.dataset.pick);b.classList.toggle('selected',s);b.setAttribute('aria-pressed',s);b.textContent=s?'✓':''});
  document.querySelectorAll('#recipeGrid .recipe-card').forEach(c=>c.classList.toggle('is-picked',picked.has(c.dataset.recipeId)));
  if(toggle){toggle.setAttribute('aria-pressed',on);toggle.textContent=on?'✕ Chiudi selezione':'☑ Seleziona ricette'}
  if(bar){bar.hidden=!on;const n=list().length;$('pickCount').textContent=n===0?'Nessuna ricetta selezionata':n===1?'1 ricetta selezionata':n+' ricette selezionate';bar.querySelectorAll('[data-pick-run]').forEach(b=>b.disabled=n===0);$('pickNone').disabled=n===0}
 }
 function run(kind){
  try{const l=list();if(!l.length)throw Error('Seleziona almeno una ricetta.');toast(window.RecipeExports.run(kind,l,'Ricette_selezionate'))}
  catch(e){toast(e.message)}
 }
 function setMode(v){on=v;if(!on)picked.clear();sync()}
 function init(){
  const meta=document.querySelector('#recipesView .list-meta'),view=$('recipesView');
  if(!meta||!view||$('pickToggle'))return;
  toggle=document.createElement('button');toggle.type='button';toggle.id='pickToggle';toggle.className='pick-toggle';toggle.title='Scegli le ricette da stampare o esportare';
  meta.insertBefore(toggle,meta.querySelector('label'));
  bar=document.createElement('div');bar.id='pickBar';bar.className='pick-bar';bar.hidden=true;bar.setAttribute('role','region');bar.setAttribute('aria-label','Ricette selezionate');
  bar.innerHTML='<b id="pickCount" aria-live="polite"></b><span class="pick-actions"><button type="button" id="pickAll">Tutte quelle visibili</button><button type="button" id="pickNone">Nessuna</button><button type="button" data-pick-run="print">🖨 Stampa</button><button type="button" data-pick-run="pdf">⬇ PDF</button><button type="button" data-pick-run="docx">⬇ Word</button><button type="button" data-pick-run="xlsx">⬇ Excel</button></span>';
  view.append(bar);
  toggle.onclick=()=>setMode(!on);
  $('pickAll').onclick=()=>{document.querySelectorAll('#recipeGrid [data-pick]').forEach(b=>picked.add(b.dataset.pick));sync()};
  $('pickNone').onclick=()=>{picked.clear();sync()};
  bar.addEventListener('click',e=>{const b=e.target.closest('[data-pick-run]');if(b)run(b.dataset.pickRun)});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(!b)return;const id=b.dataset.pick;picked.has(id)?picked.delete(id):picked.add(id);sync()});
  sync();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 return{has,list,sync,count:()=>list().length,active:()=>on};
})();
