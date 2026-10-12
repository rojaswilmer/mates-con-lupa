'use strict';
// Capa visual infantil: números de colores, animaciones, fondo y celebraciones. No toca la lógica.
(function(){
const COL=n=>'c'+(+n%10);
function digits(s){let i=0;return s.replace(/(\d)|([+−\-×:=?\/])/g,(m,d,o)=>d?`<span class="dg ${COL(d)}" style="animation-delay:${(i++)*0.06}s">${d}</span>`:`<span class="dg op" style="animation-delay:${(i++)*0.06}s">${o}</span>`)}
function colorText(el){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const ns=[];while(w.nextNode())ns.push(w.currentNode);
 ns.forEach(t=>{if(!/[\d?]/.test(t.data))return;const s=document.createElement('span');s.innerHTML=digits(t.data.replace(/&/g,'&amp;').replace(/</g,'&lt;'));t.replaceWith(s)})}
function bg(){if(document.getElementById('bgfx'))return;const b=document.createElement('div');b.id='bgfx';
 const sh=['⭐','🔺','🟡','🔷','💖','✨','🟢','🟣'];let h='';
 for(let i=0;i<5;i++)h+=`<i class="cloud" style="top:${5+i*17}%;width:${120+i*30}px;height:${40+i*8}px;animation-duration:${50+i*15}s;animation-delay:-${i*12}s"></i>`;
 for(let i=0;i<16;i++)h+=`<i style="left:${Math.random()*100}%;font-size:${24+Math.random()*40}px;animation-duration:${14+Math.random()*16}s;animation-delay:-${Math.random()*25}s">${sh[i%sh.length]}</i>`;
 b.innerHTML=h;document.body.prepend(b)}
function enhance(){const q=document.querySelector('#app .q:not([data-ui])');
 if(q){q.dataset.ui=1;if(q.textContent.length>16)q.classList.add('long');colorText(q)}
 const a=document.getElementById('ans');if(a&&!document.getElementById('ansv')){const v=document.createElement('div');v.id='ansv';a.after(v)}
}
let lastAns='';
function syncAns(){const a=document.getElementById('ans'),v=document.getElementById('ansv');if(!a||!v)return;
 if(a.value!==lastAns){const grew=a.value.length>lastAns.length;lastAns=a.value;v.innerHTML=a.value.split('').map((d,i)=>`<span class="dg ${COL(d)}" style="animation-delay:${grew&&i<a.value.length-1?'-1s':'0s'}">${d}</span>`).join('')}}
// Totales que cambian: animación de conteo + rebote
const prev=new WeakMap();
function animNum(el){const m=el.textContent.match(/=\s*(\d+)|^(\d+)\/(\d+)$|⭐\s*(\d+)/);if(!m)return;
 const val=+(m[1]||m[2]||m[4]);const old=prev.get(el);prev.set(el,val);if(old===undefined||old===val)return;
 el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}
function watchCounts(){document.querySelectorAll('#cnt,#fc,#hdr .stars').forEach(animNum)}
// Celebración gigante: zoom de número + confeti + estrellas
function burst(text){let b=document.getElementById('burst');if(b)b.remove();b=document.createElement('div');b.id='burst';
 const cols=['#ff3d7f','#ff8a00','#ffc400','#20c45a','#00a8ff','#7a4dff','#ff4dd2'];let h=`<div class="zoom dg c${Math.floor(Math.random()*10)}">${text}</div>`;
 for(let i=0;i<70;i++){const an=Math.random()*6.28,r=200+Math.random()*500;h+=`<i class="cf" style="background:${cols[i%7]};--x:${Math.cos(an)*r}px;--y:${Math.sin(an)*r}px;--r:${Math.random()*720}deg;animation-delay:${Math.random()*.15}s"></i>`}
 for(let i=0;i<12;i++){const an=i/12*6.28,r=260+Math.random()*160;h+=`<i class="st" style="--x:${Math.cos(an)*r}px;--y:${Math.sin(an)*r}px;--r:${Math.random()*360}deg">⭐</i>`}
 b.innerHTML=h;document.body.appendChild(b);setTimeout(()=>b.remove(),1700)}
window.UIBurst=burst;
// Detectar acierto: el mensaje de elogio con +⭐
let lastSay='';
function watchSay(){const s=document.getElementById('say');if(!s)return;const t=s.textContent;if(t===lastSay)return;lastSay=t;
 const m=t.match(/\+(⭐+)/);if(m)burst('+'+m[1].length+'⭐');else if(/¡Subes|10 unidades se han juntado|10 decenas forman/.test(t))burst(/decenas forman/.test(t)?'100':'10')}
document.addEventListener('click',e=>{const d=e.target.closest&&e.target.closest('.dg');if(d){d.classList.remove('wig');void d.offsetWidth;d.classList.add('wig')}
 setTimeout(()=>{syncAns();watchCounts();watchSay()},0)});
const mo=new MutationObserver(()=>{enhance();syncAns();watchCounts();watchSay()});
function init(){bg();enhance();mo.observe(document.body,{childList:true,subtree:true,characterData:true})}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
