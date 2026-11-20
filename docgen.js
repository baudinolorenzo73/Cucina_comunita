'use strict';
/* Generatore comune di PDF, Word ed Excel per Spesa, Menù e Turni. by Lollo ®2026
   doc    = {title, subtitle, sections:[{heading, items:[{t, r, check, h}|string], note}]}
   sheets = [{name, rows:[intestazione, ...righe], widths:[...]}] */
window.DocGen=(()=>{
 const $=id=>document.getElementById(id);let api;const R=()=>window.RecipeExports,L=()=>R().lib;
 const MIME={pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
 const item=x=>typeof x==='string'?{t:x}:x;
 
 const ACC=[0.137,0.518,0.373],GREY=[0.42,0.42,0.42],SOFT=[0.78,0.78,0.78];
 function pdf(doc){
  const lines=[{t:doc.title,b:1,s:20,color:ACC,after:2},{t:doc.subtitle||'',s:9.5,color:GREY,rule:true,after:8}];
  for(const sec of doc.sections){
   if(sec.heading)lines.push({gap:8},{t:sec.heading,b:1,s:13,color:ACC,keep:60,rule:SOFT,ruleW:0.6,after:3});
   if(sec.table){const w=sec.table.widths;lines.push({cols:sec.table.head.map((t,k)=>({t,w:w[k]})),b:1,s:9.5,shade:[0.9,0.95,0.92],keep:60});const fs=doc.onePage?10.5:9.5;sec.table.rows.forEach((r0,i)=>{const r=Array.isArray(r0)?{cells:r0}:r0;lines.push({cols:r.cells.map((t,k)=>({t:String(t??''),w:w[k],b:r.strong||k===0?1:0})),s:fs,pad:5,shade:r.tint==='fest'?[1,0.92,0.88]:r.tint==='we'?[0.93,0.96,0.94]:(i%2?[0.975,0.975,0.975]:null)})})}
   for(const raw of sec.items||[]){const x=item(raw);
    if(x.h)lines.push({gap:4},{t:x.h,b:1,s:10.5,keep:34,after:1});
    else if(x.k)lines.push({cols:[{t:x.k,w:92,b:1},{t:x.t,w:431}],s:10,border:false});
    else if(x.r)lines.push({cols:[{t:x.t,w:330},{t:x.r,w:177,color:GREY}],box:x.check,s:10});
    else lines.push({t:x.t,s:10,box:x.check,after:1.5});
   }
   if(sec.note)lines.push({t:sec.note,s:9,b:2,color:GREY,after:2});
  }
  return R().build.pdfFromLines(lines,{title:doc.title});
 }
 function para(t,{b,i,sz=20,color,center,keep}={}){
  const x=L().xml;
  return `<w:p><w:pPr>${keep?'<w:keepNext/>':''}${center?'<w:jc w:val="center"/>':''}<w:spacing w:before="0" w:after="40" w:line="240"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/>${b?'<w:b/>':''}${i?'<w:i/>':''}${color?`<w:color w:val="${color}"/>`:''}<w:sz w:val="${sz}"/></w:rPr><w:t xml:space="preserve">${x(t||' ')}</w:t></w:r></w:p>`;
 }
 function tbl(t){
  const cols=t.widths.map(w=>Math.round(w*20)),x=L().xml;
  const cell=(c,k,head,r={})=>{const fill=head?'E6F2EB':r.tint==='fest'?'FDEBE1':r.tint==='we'?'EDF5F0':'';return `<w:tc><w:tcPr><w:tcW w:w="${cols[k]}" w:type="dxa"/>${fill?`<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>`:''}</w:tcPr>${para(String(c??''),{b:head||r.strong||k===0,sz:19})}</w:tc>`};
  const row=(r,head,meta)=>`<w:tr>${head?'<w:trPr><w:tblHeader/></w:trPr>':''}${r.map((c,k)=>cell(c,k,head,meta)).join('')}</w:tr>`;
  const br=['top','left','bottom','right','insideH','insideV'].map(s=>`<w:${s} w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>`).join('');
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${br}</w:tblBorders><w:tblCellMar><w:left w:w="90" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${cols.map(c=>`<w:gridCol w:w="${c}"/>`).join('')}</w:tblGrid>${row(t.head,true)}${t.rows.map(r0=>{const r=Array.isArray(r0)?{cells:r0}:r0;return row(r.cells,false,r)}).join('')}</w:tbl>`+para('',{sz:8});
 }
 function labelPara(k,t){const x=L().xml;return `<w:p><w:pPr><w:spacing w:before="0" w:after="40"/><w:ind w:left="1300" w:hanging="1300"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:b/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">${x(k)}	</w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">${x(t)}</w:t></w:r></w:p>`}
 function docx(doc){
  const p=[para(doc.title,{b:1,sz:40,color:'23845F'})];if(doc.subtitle)p.push(para(doc.subtitle,{sz:19,color:'6B6B6B'}));
  for(const sec of doc.sections){
   if(sec.heading)p.push(para(' ',{sz:8}),para(sec.heading,{b:1,sz:26,color:'23845F',keep:1}));
   if(sec.table)p.push(tbl(sec.table));
   for(const raw of sec.items||[]){const x=item(raw);p.push(x.h?para(x.h,{b:1,sz:21,keep:1}):x.k?labelPara(x.k,x.t):para((x.check?'☐  ':'')+x.t+(x.r?'  —  '+x.r:'')))}
   if(sec.note)p.push(para(sec.note,{i:1,sz:18,color:'666666'}));
  }
  const body=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${p.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="567" w:right="567" w:bottom="567" w:left="567"/></w:sectPr></w:body></w:document>`;
  return L().zip({'[Content_Types].xml':'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>','_rels/.rels':'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>','word/document.xml':body});
 }
 function xlsx(sheets){
  const n=sheets.length,x=L().xml,files={};
  files['[Content_Types].xml']='<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+sheets.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
  files['_rels/.rels']='<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  files['xl/workbook.xml']='<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+sheets.map((s,i)=>`<sheet name="${x(String(s.name).slice(0,31))}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>';
  files['xl/_rels/workbook.xml.rels']='<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((s,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+`<Relationship Id="rId${n+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  files['xl/styles.xml']='<?xml version="1.0"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="0"/><fonts count="2"><font><sz val="11"/><name val="Aptos"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Aptos"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF23845F"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  sheets.forEach((s,i)=>{files[`xl/worksheets/sheet${i+1}.xml`]=L().sheet(s.rows,s.widths)});
  return L().zip(files);
 }
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function html(doc){
  let h='<div class="doc-print'+(doc.onePage?' one-page':'')+'"><header><h1>'+esc(doc.title)+'</h1>'+(doc.subtitle?'<p>'+esc(doc.subtitle)+'</p>':'')+'</header>';
  for(const sec of doc.sections){
   h+='<section>'+(sec.heading?'<h2>'+esc(sec.heading)+'</h2>':'');
   if(sec.table)h+='<table class="doc-table'+(sec.table.cls?' '+sec.table.cls:'')+'"><thead><tr>'+sec.table.head.map(t=>'<th>'+esc(t)+'</th>').join('')+'</tr></thead><tbody>'+sec.table.rows.map(r0=>{const r=Array.isArray(r0)?{cells:r0}:r0;return '<tr'+(r.strong||r.tint?' class="'+[r.strong?'strong':'',r.tint||''].join(' ').trim()+'"':'')+'>'+r.cells.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>'}).join('')+'</tbody></table>';
   const its=(sec.items||[]).map(item);
   if(its.length)h+='<ul class="doc-items">'+its.map(x=>x.h?'<li class="doc-sub">'+esc(x.h)+'</li>':x.k?'<li class="doc-kv"><b>'+esc(x.k)+'</b><span>'+esc(x.t)+'</span></li>':'<li'+(x.check?' class="doc-check"':'')+'><span>'+esc(x.t)+'</span>'+(x.r?'<em>'+esc(x.r)+'</em>':'')+'</li>').join('')+'</ul>';
   if(sec.note)h+='<p class="doc-note">'+esc(sec.note)+'</p>';
   h+='</section>';
  }
  return h+'<footer>La nostra cucina · by Lollo ®2026</footer></div>';
 }
 function print(data){if(!data)throw Error('Niente da stampare.');$('printContent').innerHTML=html(data.doc);$('printDialog').showModal()}

 /* Calendario del mese su una pagina A4 orizzontale. */
 const DOW=['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
 function calendarPdf(cal){
  const K=L().pdf,PW=842,PH=595,Lm=24,Rm=818,Wd=Rm-Lm,cw=Wd/7,ops=[];
  ops.push(K.text(K.norm(cal.title),Lm,565,17,1,ACC),K.text(K.norm(cal.subtitle),Lm,550,8.5,0,GREY));
  const top=538,hh=14;ops.push(K.rect(Lm,top-hh,Wd,hh,[0.9,0.95,0.92]));
  DOW.forEach((n,i)=>ops.push(K.text(n,Lm+i*cw+5,top-10,8,1,i>4?ACC:[0.2,0.2,0.2])));
  const gTop=top-hh,gBot=40,rows=cal.weeks.length,rh=(gTop-gBot)/rows;
  cal.weeks.forEach((w,r)=>w.forEach((c,i)=>{
   const x=Lm+i*cw,yTop=gTop-r*rh;
   if(!c){ops.push(K.rect(x,yTop-rh,cw,rh,[0.985,0.985,0.985]));return}
   if(c.fest)ops.push(K.rect(x,yTop-rh,cw,rh,[1,0.93,0.89]));else if(c.we)ops.push(K.rect(x,yTop-rh,cw,rh,[0.94,0.965,0.95]));
   const strong=c.we||c.fest;ops.push(K.text(String(c.d),x+4,yTop-11,10,1,c.fest?[0.75,0.2,0.12]:strong?ACC:[0.15,0.15,0.15]));
   if(!cal.people&&c.people)ops.push(K.text(c.people+' pers.',x+cw-4-K.width(c.people+' pers.',6.5,0),yTop-10,6.5,0,GREY));
   const avail=rh-17-(c.turni?10:0);let s=8.2,lines;
   const build=s=>{const out=[];for(const m of c.meals){const lab=K.norm(m.slot)+': ',lw=K.width(lab,s,1),words=K.norm(m.dish).split(/\s+/);let line='',first=true;const max=()=>cw-8-(first?lw:0);for(const wd of words){const t=line?line+' '+wd:wd;if(K.width(t,s,0)<=max()){line=t;continue}out.push({lab:first?lab:'',t:line});first=false;line=wd}out.push({lab:first?lab:'',t:line})}return out};
   for(;s>=5.4;s-=0.2){lines=build(s);if(lines.length*s*1.18<=avail)break}
   const lh=s*1.18,maxL=Math.floor(avail/lh);if(lines.length>maxL){lines=lines.slice(0,maxL);lines[maxL-1].t+=' …'}
   lines.forEach((l,k)=>{const yy=yTop-21-k*lh;if(l.lab)ops.push(K.text(l.lab,x+4,yy,s,1,[0.25,0.25,0.25]));ops.push(K.text(l.t,x+4+(l.lab?K.width(l.lab,s,1):0),yy,s,0))});
   if(c.turni){const t=K.norm(c.turni);let ts=6.8;while(ts>5.2&&K.width(t,ts,0)>cw-8)ts-=0.2;ops.push(K.text(K.wrap(t,ts,0,cw-8)[0],x+4,yTop-rh+4.5,ts,0,GREY))}
  }));
  for(let i=0;i<=7;i++)ops.push(K.vline(Lm+i*cw,gTop,gBot,K.LINE,0.6));
  for(let r=0;r<=rows;r++)ops.push(K.rule(gTop-r*rh,K.LINE,0.6,Lm,Rm));
  ops.push(K.rule(gTop,ACC,1,Lm,Rm));
  const pages=[ops];K.footer(pages,PW,Lm,Rm,cal.title);
  return K.assemble(pages,PW,PH);
 }
 function calendarHtml(cal){
  const rows=cal.weeks.length;
  return '<div class="cal-print" style="--cal-rows:'+rows+'"><header><h1>'+esc(cal.title)+'</h1><p>'+esc(cal.subtitle)+'</p></header><table><thead><tr>'+DOW.map((n,i)=>'<th'+(i>4?' class="we"':'')+'>'+n+'</th>').join('')+'</tr></thead><tbody>'+cal.weeks.map(w=>'<tr>'+w.map(c=>{if(!c)return '<td class="empty"><div class="cal-cell"></div></td>';return '<td class="'+(c.fest?'fest':c.we?'we':'')+'"><div class="cal-cell"><div class="cal-day"><b>'+c.d+'</b>'+(!cal.people&&c.people?'<span>'+c.people+' pers.</span>':'')+'</div>'+c.meals.map(m=>'<p><b>'+esc(m.slot)+':</b> '+esc(m.dish)+'</p>').join('')+(c.turni?'<p class="cal-turni">'+esc(c.turni)+'</p>':'')+'</div></td>'}).join('')+'</tr>').join('')+'</tbody></table><footer>La nostra cucina · by Lollo ®2026</footer></div>';
 }
 function calendarDocx(cal){
  const x=L().xml,cw=Math.floor(15400/7);
  const run=(t,o={})=>`<w:r><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/>${o.b?'<w:b/>':''}${o.color?`<w:color w:val="${o.color}"/>`:''}<w:sz w:val="${o.sz||14}"/></w:rPr><w:t xml:space="preserve">${x(t)}</w:t></w:r>`;
  const p=(runs)=>`<w:p><w:pPr><w:spacing w:before="0" w:after="20" w:line="200" w:lineRule="auto"/></w:pPr>${runs}</w:p>`;
  const cell=(c,i)=>{const fill=!c?'F7F7F7':c.fest?'FDEBE1':c.we?'EDF5F0':'';const body=!c?p(''):p(run(String(c.d),{b:1,sz:18,color:c.fest?'B8331F':c.we?'23845F':'222222'}))+c.meals.map(m=>p(run(m.slot+': ',{b:1})+run(m.dish))).join('')+(c.turni?p(run(c.turni,{color:'6B6B6B',sz:12})):'');return `<w:tc><w:tcPr><w:tcW w:w="${cw}" w:type="dxa"/>${fill?`<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>`:''}</w:tcPr>${body}</w:tc>`};
  const br=['top','left','bottom','right','insideH','insideV'].map(s=>`<w:${s} w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>`).join('');
  const head='<w:tr><w:trPr><w:tblHeader/></w:trPr>'+DOW.map((n,i)=>`<w:tc><w:tcPr><w:tcW w:w="${cw}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="E6F2EB"/></w:tcPr>${p(run(n,{b:1,sz:16,color:i>4?'23845F':'333333'}))}</w:tc>`).join('')+'</w:tr>';
  const rowsXml=cal.weeks.map(w=>`<w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="${Math.floor(8600/cal.weeks.length)}"/></w:trPr>${w.map(cell).join('')}</w:tr>`).join('');
  const body=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${para(cal.title,{b:1,sz:32,color:'23845F'})}${para(cal.subtitle,{sz:16,color:'6B6B6B'})}<w:tbl><w:tblPr><w:tblW w:w="${cw*7}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>${br}</w:tblBorders><w:tblCellMar><w:left w:w="60" w:type="dxa"/><w:right w:w="60" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${DOW.map(()=>`<w:gridCol w:w="${cw}"/>`).join('')}</w:tblGrid>${head}${rowsXml}</w:tbl><w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="567" w:right="567" w:bottom="567" w:left="567"/></w:sectPr></w:body></w:document>`;
  return L().zip({'[Content_Types].xml':'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>','_rels/.rels':'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>','word/document.xml':body});
 }
 function printCalendar(cal){$('printContent').innerHTML=calendarHtml(cal);let st=$('pageLandscape');if(!st){st=document.createElement('style');st.id='pageLandscape';st.textContent='@media print{@page{size:A4 landscape;margin:8mm}}';document.head.append(st)}$('printDialog').addEventListener('close',()=>$('pageLandscape')?.remove(),{once:true});$('printDialog').showModal()}
 /* Condivisione: testo leggibile su WhatsApp (*grassetto*), poi Condividi del telefono o WhatsApp Web. */
 function shareText(data){const doc=data.doc;let t='*'+doc.title+'*'+(doc.subtitle?'\n'+doc.subtitle:'');
  for(const sec of doc.sections){if(sec.heading)t+='\n\n*'+sec.heading.toUpperCase()+'*';for(const raw of sec.items||[]){const x=item(raw);t+=x.h?'\n_'+x.h+'_':x.k?'\n'+x.k+': '+x.t:'\n'+(x.check?'☐ ':'• ')+x.t+(x.r?' — '+x.r:'')}if(sec.note)t+='\n'+sec.note}
  return t+'\n\n— La nostra cucina';}
 async function share(data){const text=shareText(data),title=data.doc.title;
  const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(mobile&&navigator.share){try{await navigator.share({title,text});return}catch(e){if(e.name==='AbortError')return}}
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');
 }
 function save(kind,data){
  if(!data)throw Error('Niente da esportare.');
  if(!window.RecipeExports?.lib)throw Error('Esportazione non pronta: ricarica la pagina.');
  const bytes=kind==='pdf'?(data.calendar?calendarPdf(data.calendar):pdf(data.doc)):kind==='docx'?(data.calendar?calendarDocx(data.calendar):docx(data.doc)):xlsx(data.sheets);
  api.download(data.base+'.'+kind,bytes,MIME[kind]);
  api.toast(data.base+'.'+kind+' creato.');
 }
 return{init:o=>{api=o},shareText,share,pdf,docx,xlsx,html,print,printCalendar,calendarPdf,save};
})();
