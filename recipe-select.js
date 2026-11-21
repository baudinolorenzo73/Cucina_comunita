'use strict';
/* Selezione delle ricette dalla schermata principale: ogni scheda ha la sua casella,
   sempre visibile; con almeno una scelta compare la barra per stampare o esportare. by Lollo ®2026 */
window.RecipePick=(()=>{
 const $=id=>document.getElementById(id);
 const picked=new Set();
 let bar=null,toggle=null;
 const all=()=>window.RecipeExports?window.RecipeExports.all():[];
 const list=()=>all().filter(r=>picked.has(r.id));
 const has=id=>picked.has(id);
 const visible=()=>[...document.querySelectorAll('#recipeGrid [data-pick]')].map(b=>b.dataset.pick);
 const toast=m=>{const t=$('toast');if(!t||!$('toastText')){alert(m);return}$('toastText').textContent=m;if($('undoDelete'))$('undoDelete').hidden=true;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{t.hidden=true},6000)};
 function sync(){
  document.querySelectorAll('#recipeGrid [data-pick]').forEach(b=>{const s=picked.has(b.dataset.pick);b.classList.toggle('selected',s);b.setAttribute('aria-pressed',s);b.textContent=s?'✓':''});
  document.querySelectorAll('#recipeGrid .recipe-card').forEach(c=>c.classList.toggle('is-picked',picked.has(c.dataset.recipeId)));
  const n=list().length,vis=visible(),tutte=vis.length>0&&vis.every(id=>picked.has(id));
  if(toggle){toggle.textContent=tutte?'☐ Deseleziona tutte':'☑ Seleziona tutte';toggle.disabled=!vis.length}
  if(bar){bar.hidden=n===0;$('pickCount').textContent=n===1?'1 ricetta selezionata':n+' ricette selezionate'}
 }
 function run(kind){
  try{const l=list();if(!l.length)throw Error('Seleziona almeno una ricetta.');toast(window.RecipeExports.run(kind,l,'Ricette_selezionate'))}
  catch(e){toast(e.message)}
 }
 function init(){
  const meta=document.querySelector('#recipesView .list-meta'),view=$('recipesView');
  if(!meta||!view||$('pickToggle'))return;
  toggle=document.createElement('button');toggle.type='button';toggle.id='pickToggle';toggle.className='pick-toggle';toggle.title='Seleziona o deseleziona le ricette mostrate';
  meta.insertBefore(toggle,meta.querySelector('label'));
  bar=document.createElement('div');bar.id='pickBar';bar.className='pick-bar';bar.hidden=true;bar.setAttribute('role','region');bar.setAttribute('aria-label','Ricette selezionate');
  bar.innerHTML='<b id="pickCount" aria-live="polite"></b><span class="pick-actions"><button type="button" id="pickNone">✕ Nessuna</button><button type="button" data-pick-run="print">🖨 Stampa</button><button type="button" data-pick-run="pdf">⬇ PDF</button><button type="button" data-pick-run="docx">⬇ Word</button><button type="button" data-pick-run="xlsx">⬇ Excel</button></span>';
  view.append(bar);
  toggle.onclick=()=>{const vis=visible(),tutte=vis.length>0&&vis.every(id=>picked.has(id));vis.forEach(id=>tutte?picked.delete(id):picked.add(id));sync()};
  $('pickNone').onclick=()=>{picked.clear();sync()};
  bar.addEventListener('click',e=>{const b=e.target.closest('[data-pick-run]');if(b)run(b.dataset.pickRun)});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(!b)return;const id=b.dataset.pick;picked.has(id)?picked.delete(id):picked.add(id);sync()});
  sync();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 return{has,list,sync,count:()=>list().length};
})();
