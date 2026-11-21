'use strict';
/* Generatore di QR code (byte, correzione M, versioni 1-6), senza librerie: funziona offline. by Lollo ®2026 */
(root=>{
 const ECC_PER_BLOCK=[0,10,16,26,18,24,16],NUM_BLOCKS=[0,1,1,1,2,2,4]; // livello M, versioni 1..6
 const MAXV=6;
 const rawModules=v=>{let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55}return r};
 const dataCodewords=v=>Math.floor(rawModules(v)/8)-ECC_PER_BLOCK[v]*NUM_BLOCKS[v];
 const mul=(x,y)=>{let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z};
 function generator(deg){const r=new Array(deg).fill(0);r[deg-1]=1;let root=1;for(let i=0;i<deg;i++){for(let j=0;j<deg;j++){r[j]=mul(r[j],root);if(j+1<deg)r[j]^=r[j+1]}root=mul(root,2)}return r}
 function remainder(data,div){const r=new Array(div.length).fill(0);for(const b of data){const f=b^r.shift();r.push(0);div.forEach((c,i)=>{r[i]^=mul(c,f)})}return r}
 function encodeData(bytes,ver){
  const bits=[],put=(val,len)=>{for(let i=len-1;i>=0;i--)bits.push((val>>>i)&1)};
  put(4,4);put(bytes.length,8);bytes.forEach(b=>put(b,8));
  const cap=dataCodewords(ver)*8;
  put(0,Math.min(4,cap-bits.length));put(0,(8-bits.length%8)%8);
  for(let pad=0xEC;bits.length<cap;pad^=0xEC^0x11)put(pad,8);
  const out=[];for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bits[i+j];out.push(b)}
  return out;
 }
 function interleave(data,ver){
  const nb=NUM_BLOCKS[ver],eccLen=ECC_PER_BLOCK[ver],raw=Math.floor(rawModules(ver)/8),short=nb-raw%nb,shortLen=Math.floor(raw/nb),div=generator(eccLen),blocks=[];
  for(let i=0,k=0;i<nb;i++){const dat=data.slice(k,k+shortLen-eccLen+(i<short?0:1));k+=dat.length;const ecc=remainder(dat,div);if(i<short)dat.push(0);blocks.push(dat.concat(ecc))}
  const res=[];
  for(let i=0;i<blocks[0].length;i++)blocks.forEach((b,j)=>{if(i!==shortLen-eccLen||j>=short)res.push(b[i])});
  return res;
 }
 function matrix(text){
  const bytes=[...new TextEncoder().encode(text)];
  let ver=1;while(ver<=MAXV&&bytes.length+2>dataCodewords(ver))ver++;
  if(ver>MAXV)throw Error('Testo troppo lungo per il QR');
  const size=ver*4+17,m=Array.from({length:size},()=>new Array(size).fill(false)),fn=Array.from({length:size},()=>new Array(size).fill(false));
  const set=(x,y,v)=>{m[y][x]=v;fn[y][x]=true};
  for(let i=0;i<size;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
  const finder=(cx,cy)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy)),x=cx+dx,y=cy+dy;if(x>=0&&x<size&&y>=0&&y<size)set(x,y,d!==2&&d!==4)}};
  finder(3,3);finder(size-4,3);finder(3,size-4);
  if(ver>=2){const n=Math.floor(ver/7)+2,step=Math.ceil((ver*4+4)/(n*2-2))*2,pos=[6];for(let p=size-7;pos.length<n;p-=step)pos.splice(1,0,p);
   pos.forEach((cx,i)=>pos.forEach((cy,j)=>{if((i===0&&j===0)||(i===0&&j===n-1)||(i===n-1&&j===0))return;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(cx+dx,cy+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}))}
  const formatPlaceholder=()=>{for(let i=0;i<9;i++){if(i!==6){fn[8][i]=true;fn[i][8]=true}}for(let i=0;i<8;i++){fn[8][size-1-i]=true;fn[size-1-i][8]=true}fn[size-8][8]=true};
  formatPlaceholder();
  const codewords=interleave(encodeData(bytes,ver),ver);
  const place=[];for(let i=0,right=size-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<size;vert++)for(let j=0;j<2;j++){const x=right-j,up=((right+1)&2)===0,y=up?size-1-vert:vert;if(!fn[y][x]){m[y][x]=i<codewords.length*8?((codewords[i>>>3]>>>(7-(i&7)))&1)===1:false;i++}}}
  const masks=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
  const applyMask=(mk)=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!fn[y][x]&&masks[mk](x,y))m[y][x]=!m[y][x]};
  const formatBits=mk=>{const d=(0<<3)|mk;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);return((d<<10)|r)^0x5412}; // livello M = 00
  const drawFormat=mk=>{const b=formatBits(mk),bit=i=>((b>>>i)&1)===1;
   for(let i=0;i<=5;i++)m[i][8]=bit(i);m[7][8]=bit(6);m[8][8]=bit(7);m[8][7]=bit(8);for(let i=9;i<15;i++)m[8][14-i]=bit(i);
   for(let i=0;i<8;i++)m[8][size-1-i]=bit(i);for(let i=8;i<15;i++)m[size-15+i][8]=bit(i);m[size-8][8]=true};
  const penalty=()=>{let p=0;for(let y=0;y<size;y++){for(const line of [m[y],m.map(r=>r[y])]){let run=1;for(let i=1;i<size;i++){if(line[i]===line[i-1]){run++;if(run===5)p+=3;else if(run>5)p++}else run=1}}}
   for(let y=0;y<size-1;y++)for(let x=0;x<size-1;x++)if(m[y][x]===m[y][x+1]&&m[y][x]===m[y+1][x]&&m[y][x]===m[y+1][x+1])p+=3;return p};
  let best=0,bestP=Infinity;
  for(let mk=0;mk<8;mk++){applyMask(mk);drawFormat(mk);const p=penalty();if(p<bestP){bestP=p;best=mk}applyMask(mk)}
  applyMask(best);drawFormat(best);
  return m;
 }
 function svg(text,px=240){
  const m=matrix(text),n=m.length,q=4,total=n+2*q;let d='';
  m.forEach((row,y)=>row.forEach((v,x)=>{if(v)d+=`M${x+q} ${y+q}h1v1h-1z`}));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${px}" height="${px}" shape-rendering="crispEdges" role="img" aria-label="QR code dell’indirizzo"><rect width="${total}" height="${total}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
 }
 root.QRCode={matrix,svg};
 if(typeof module!=='undefined')module.exports=root.QRCode;
})(typeof window!=='undefined'?window:globalThis);
