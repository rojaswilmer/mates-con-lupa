'use strict';
const KIDS=[{id:'matias',name:'Matías',curso:3,av:'🦖',subs:['mates','science','english','frances']},{id:'isabella',name:'Isabella',curso:2,av:'🦄',subs:['mates','lectura','catala','frances']}];
const TOPICS={
 suma:{t:'Sumas',i:'➕',d:'con y sin llevadas'},
 resta:{t:'Restas',i:'➖',d:'con y sin llevadas'},
 posicion:{t:'Valor posicional',i:'🧱',d:'unidades, decenas, centenas'},
 tablas:{t:'Tablas',i:'✖️',d:'tablas de multiplicar'},
 division:{t:'Repartir',i:'➗',d:'introducción a la división'},
 fraccion:{t:'Fracciones',i:'🍕',d:'mitades, tercios, cuartos…'},
 problema:{t:'Problemas',i:'📖',d:'con enunciado'}
};
const MAXLVL=5;
const $=s=>document.querySelector(s);
const app=$('#app');
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[R(0,a.length-1)];
let kid=null,st=null,cur=null,input='',hintStep=0,wrong=0,view=()=>home();
const D3=()=>window.T3D;
const owlBox=()=>D3()?'':`<div class="owl" id="owl">${window.petEmoji?petEmoji():'🦉'}</div>`;
function stage(sel,h,name,opts){if(!D3())return;D3().mount($(sel),h);D3().scene(name,opts||{})}
window.__t3dReady=()=>{window.__wrap3D&&window.__wrap3D(window.T3D);document.body.classList.add('d3');view()};
const sfx=(n,...a)=>window.SFX&&SFX.play(n,...a);
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#owl'))sfx('hoot')});

function load(id){try{return JSON.parse(localStorage.getItem('tm_'+id))||null}catch(e){return null}}
function fresh(k){const s={stars:0,topics:{},log:[]};for(const t in TOPICS)s.topics[t]={lvl:k.curso===3?2:1,streak:0,miss:0,ok:0,ko:0};return s}
function save(){localStorage.setItem('tm_'+kid.id,JSON.stringify(st))}

function header(){ $('#hdr').innerHTML=kid?`<span class="stars">⭐ ${st.stars}</span> <button id="hk" aria-label="Cambiar">${kid.av}<span class="lbl"> Cambiar</span></button> <button id="hp" aria-label="Padres">👪<span class="lbl"> Padres</span></button>`:`<button id="hp" aria-label="Padres">👪<span class="lbl"> Padres</span></button>`;
 if(kid)$('#hk').onclick=home; $('#hp').onclick=parents;}

function home(){kid=null;view=home;header();
 app.innerHTML=`<div id="slot"></div><div class="tutor">${owlBox()}<div class="bubble">¡Hola! Soy Lupa, tu búho profe. ¿Quién va a jugar hoy?</div></div><div class="grid">`+
 KIDS.map(k=>`<button class="card kid" data-k="${k.id}"><div class="av">${k.av}</div>${k.name}<br><small>${k.curso}º de primaria</small></button>`).join('')+`</div>`;
 app.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{kid=KIDS.find(k=>k.id===b.dataset.k);st=load(kid.id)||fresh(kid);for(const t in TOPICS)if(!st.topics[t])st.topics[t]=fresh(kid).topics[t];save();kidHome()});
 window.T3D&&T3D.pet({sp:'buho'});stage('#slot',230,'owl');}

function menu(){view=menu;header();
 app.innerHTML=`<div class="row" style="justify-content:flex-start"><button class="back" id="bkm">⬅ Materias</button><span>🔢 Mates</span></div><div id="slot"></div><div class="tutor">${owlBox()}<div class="bubble">¡Hola, ${kid.name}! Tienes ${st.stars} estrellas. ¿Qué practicamos?</div></div><div class="grid">`+
 Object.entries(TOPICS).map(([k,v])=>`<div class="tcell"><button class="topic" data-t="${k}">${v.i} ${v.t}<small>${v.d} · nivel ${st.topics[k].lvl}</small>${(st.lessons||{})[k]?'':'<small class="new">🎓 ¡Lección nueva!</small>'}</button><button class="lesbtn" data-l="${k}">🎓 Ver lección</button></div>`).join('')+`</div>`;
 app.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>(st.lessons||{})[b.dataset.t]?start(b.dataset.t):lesson(b.dataset.t));
 app.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>lesson(b.dataset.l));$('#bkm').onclick=kidHome;
 stage('#slot',200,'owl');}

// ---------- generadores ----------
function gen(topic,l){
 const q={topic,lvl:l};
 if(topic==='suma'){
  let a,b;
  if(l===1){a=R(2,9);b=R(1,9-a+9);if(a+b>18)b=18-a}
  else if(l===2){a=R(10,89);b=R(1,9);if(a%10+b<10)b=10-a%10+R(0,9-((10-a%10)%10));b=Math.min(b,9)}
  else if(l===3){a=R(15,79);b=R(15,99-a)}
  else if(l===4){a=R(100,599);b=R(100,399)}
  else{a=R(150,799);b=R(150,999-a)}
  q.a=a;q.b=b;q.ans=a+b;q.text=`${a} + ${b} = ?`;q.manip=a+b<=20?'line':(a+b<=999?'blocks':null);
 }else if(topic==='resta'){
  let a,b;
  if(l===1){a=R(5,18);b=R(1,Math.min(9,a))}
  else if(l===2){a=R(20,99);b=R(1,9)}
  else if(l===3){a=R(30,99);b=R(11,a-5)}
  else if(l===4){a=R(200,999);b=R(100,a-50)}
  else{a=R(300,999);b=R(101,a-1);}
  q.a=a;q.b=b;q.ans=a-b;q.text=`${a} − ${b} = ?`;q.manip=a<=20?'line':'blocks';
 }else if(topic==='posicion'){
  const n=l<=1?R(11,99):l===2?R(11,999):R(101,999);const c=Math.floor(n/100),d=Math.floor(n/10)%10,u=n%10;
  const K=[['build','dec','uni'],['build','dec','cen','uni','decomp','comp'],['build','decomp','comp','exch','cen'],['comp','exch','cmp','words','decomp'],['exch','cmp','words','decomp','comp','build']][l-1];
  let kind=pick(K);if(kind==='cen'&&n<100)kind='dec';
  q.n=n;q.c=c;q.d=d;q.u=u;q.manip='blocks';const desc=`${c?c+' centenas, ':''}${d} decenas y ${u} unidades`;
  if(kind==='build'){q.text=`Construye el número ${n} con bloques`;q.ans=n;q.build=true}
  else if(kind==='dec'){q.text=`¿Cuántas decenas tiene ${n}?`;q.ans=d}
  else if(kind==='cen'){q.text=`¿Cuántas centenas tiene ${n}?`;q.ans=c}
  else if(kind==='uni'){q.text=`¿Cuántas unidades tiene ${n}?`;q.ans=u}
  else if(kind==='decomp'){const which=pick(n>99?['c','d','u']:['d','u']);const parts={c:`${which==='c'?'?':c} C`,d:`${which==='d'?'?':d} D`,u:`${which==='u'?'?':u} U`};
   q.text=`${n} = ${n>99?parts.c+' + ':''}${parts.d} + ${parts.u}`;q.ans={c,d,u}[which];q.hk=[`C = centenas, D = decenas, U = unidades.`,`${n} = ${desc}.`]}
  else if(kind==='comp'){q.text=`${c?c+' C + ':''}${d} D + ${u} U = ?`;q.ans=n;q.hk=[`Cada C vale 100, cada D vale 10 y cada U vale 1.`,`${c*100} + ${d*10} + ${u} = ${n}`]}
  else if(kind==='exch'){const t=pick(['u2d','d2c','d2u','c2d']);const k=R(2,9);
   if(t==='d2u'){q.text=`${k} decenas = ? unidades`;q.ans=k*10;q.hk=['1 decena = 10 unidades.',`${k} × 10 = ${k*10}`]}
   else if(t==='c2d'){q.text=`${k} centenas = ? decenas`;q.ans=k*10;q.hk=['1 centena = 10 decenas.',`${k} × 10 = ${k*10}`]}
   else if(t==='u2d'){q.text=`${k*10} unidades = ? decenas`;q.ans=k;q.hk=['10 unidades se cambian por 1 decena.',`${k*10} : 10 = ${k}`]}
   else{q.text=`${k*10} decenas = ? centenas`;q.ans=k;q.hk=['10 decenas se cambian por 1 centena.',`${k*10} : 10 = ${k}`]}}
  else if(kind==='cmp'){let m;do{const sw=pick(['du','cd','u']);m=sw==='du'&&d!==u?c*100+u*10+d:sw==='cd'&&c!==d&&d?d*100+c*10+u:n+pick([-1,1])*R(1,9)}while(m===n||m<100||m>999);
   q.text=`¿Cuál es MAYOR?\n${n}  o  ${m}`;q.ans=Math.max(n,m);q.hk=['Compara primero las centenas. Si son iguales, mira las decenas, y luego las unidades.',`${Math.max(n,m)} es mayor que ${Math.min(n,m)}.`]}
  else{q.text=`Escribe con cifras:\n«${numES(n)}»`;q.ans=n;q.hk=['Busca primero las centenas (cien, doscientos…), luego decenas y unidades.',`${numES(n)} = ${desc}.`]}
 }else if(topic==='tablas'){
  const sets=[[2,5,10],[2,3,4,5,10],[2,3,4,5,6,10],[6,7,8,9],[2,3,4,5,6,7,8,9]];
  const a=pick(sets[l-1]),b=R(1,10);q.a=a;q.b=b;q.ans=a*b;q.text=`${a} × ${b} = ?`;q.manip='line';
 }else if(topic==='division'){
  const maxd=[2,3,5,9,9][l-1],d=R(2,Math.max(2,maxd)),c=R(1,l<3?5:10);q.a=d*c;q.b=d;q.ans=c;
  q.text=`Reparte ${d*c} caramelos entre ${d} amigos. ¿Cuántos para cada uno?\n${d*c} : ${d} = ?`;q.manip='share';
 }else if(topic==='fraccion'){
  const dens=[[2],[2,4],[2,3,4],[3,4,5,6],[4,5,6,8]][l-1];const den=pick(dens),num=R(1,den-1>0?den-1:1);
  q.num=num;q.den=den;q.manip='frac';
  if(l>=4&&Math.random()<.5){const tot=den*R(2,4);q.tot=tot;q.text=`¿Cuánto es ${num}/${den} de ${tot}?`;q.ans=tot/den*num;q.manip='frac'}
  else{q.text=`Colorea ${num}/${den}`;q.ans=num;q.shade=true}
 }else if(topic==='problema'){
  const names=['Lucía','Pau','Martina','Hugo','Nora','Leo'],n=pick(names);
  const T=[
   ()=>{const a=R(5,30)*(l>2?3:1),b=R(3,20)*(l>2?2:1);return{text:`${n} tiene ${a} cromos y le regalan ${b}. ¿Cuántos tiene ahora?`,ans:a+b,op:'+',a,b}},
   ()=>{const a=R(20,60)*(l>2?2:1),b=R(3,a-5);return{text:`En el autobús van ${a} niños. Bajan ${b}. ¿Cuántos quedan?`,ans:a-b,op:'-',a,b}},
   ()=>{const a=R(2,l>2?9:5),b=R(2,l>2?9:5);return{text:`Hay ${a} cajas con ${b} galletas cada una. ¿Cuántas galletas hay?`,ans:a*b,op:'×',a,b}},
   ()=>{const b=R(2,l>2?9:5),c=R(2,l>2?9:5);return{text:`${n} reparte ${b*c} canicas entre ${b} amigos a partes iguales. ¿Cuántas recibe cada uno?`,ans:c,op:':',a:b*c,b}},
  ];
  Object.assign(q,pick(l<=1?T.slice(0,2):l<=2?T.slice(0,3):T)());
 }
 return q;
}

// ---------- pistas paso a paso ----------
function hints(q){
 const H={
  suma:()=>{const s=[`Vamos poco a poco. Empieza siempre por las unidades (la columna de la derecha).`];
   const ua=q.a%10,ub=q.b%10;s.push(`Unidades: ${ua} + ${ub} = ${ua+ub}.`+(ua+ub>=10?` ¡Pasa de 9! Escribe ${(ua+ub)%10} y te llevas 1 a las decenas.`:''));
   if(q.a>=10||q.b>=10){const da=Math.floor(q.a/10)%10,db=Math.floor(q.b/10)%10,ll=ua+ub>=10?1:0;s.push(`Decenas: ${da} + ${db}${ll?' + 1 que te llevabas':''} = ${da+db+ll}.`+(da+db+ll>=10?' ¡Otra llevada a las centenas!':''))}
   if(q.manip==='line')s.push(`En la recta numérica, ponte en el ${q.a} y salta ${q.b} pasos hacia la derecha.`);
   else s.push(`Puedes usar los bloques: pon ${q.a} y luego añade ${q.b}. Cuando tengas 10 unidades se convierten en 1 decena.`);
   return s},
  resta:()=>{const s=[`Empieza por las unidades, de derecha a izquierda.`];const ua=q.a%10,ub=q.b%10;
   if(ua<ub)s.push(`Unidades: a ${ua} no le puedo quitar ${ub}. Pedimos prestada 1 decena: ${ua} se convierte en ${ua+10}. ${ua+10} − ${ub} = ${ua+10-ub}.`);
   else s.push(`Unidades: ${ua} − ${ub} = ${ua-ub}.`);
   s.push(`Ahora las decenas${ua<ub?' (recuerda que has gastado 1)':''}.`);
   s.push(q.manip==='line'?`En la recta, ponte en el ${q.a} y salta ${q.b} hacia la izquierda.`:`Truco: comprueba sumando. Tu respuesta + ${q.b} debe dar ${q.a}.`);return s},
  posicion:()=>q.hk?q.hk.concat([`Puedes usar los bloques para ayudarte.`]):[`Cada barra azul es una decena (10) y cada cuadrado naranja una centena (100). Los cubitos verdes son unidades.`,
   `${q.n} = ${q.c?q.c+' centenas, ':''}${q.d} decenas y ${q.u} unidades.`,q.build?`Arrastra ${q.c?q.c+' centenas, ':''}${q.d} decenas y ${q.u} unidades a la alfombra.`:`Mira la cifra que está en esa posición.`],
  tablas:()=>[`${q.a} × ${q.b} quiere decir ${q.b} grupos de ${q.a}.`,`Puedes ir saltando de ${q.a} en ${q.a} en la recta: ${Array.from({length:Math.min(q.b,4)},(_,i)=>q.a*(i+1)).join(', ')}…`,
   q.b>1?`Si ya sabes ${q.a} × ${q.b-1} = ${q.a*(q.b-1)}, solo te falta sumar ${q.a} más.`:`Cualquier número por 1 es él mismo.`],
  division:()=>[`Dividir es repartir a partes iguales. Toca los caramelos para dárselos a cada amigo por turnos.`,`Piensa: ¿qué número por ${q.b} da ${q.a}? Es la tabla del ${q.b} al revés.`,`${q.b} × ? = ${q.a}`],
  fraccion:()=>q.tot?[`Primero divide ${q.tot} en ${q.den} partes iguales: ${q.tot} : ${q.den} = ${q.tot/q.den}.`,`Ahora coge ${q.num} de esas partes: ${q.num} × ${q.tot/q.den}.`]:
   [`El número de abajo (${q.den}) dice en cuántas partes iguales partimos la barra.`,`El número de arriba (${q.num}) dice cuántas partes coloreamos.`,`Toca ${q.num} trocitos de la barra y pulsa Comprobar.`],
  problema:()=>{const w={'+':'juntar o añadir → es una SUMA','-':'quitar → es una RESTA','×':'grupos iguales → es una MULTIPLICACIÓN',':':'repartir a partes iguales → es una DIVISIÓN'}[q.op];
   return[`Lee el problema despacio. ¿Qué datos tenemos? ${q.a} y ${q.b}.`,`¿Qué pasa en la historia? Hay que ${w}.`,`La operación es ${q.a} ${q.op} ${q.b}.`]}
 };return H[q.topic]();
}

const PRAISE=['¡Genial!','¡Muy bien!','¡Eres un crack!','¡Perfecto!','¡Así se hace!','¡Increíble!'];
const ENCOURAGE=['Casi, ¡inténtalo otra vez!','Uy, no pasa nada, equivocarse es aprender.','Mmm, revisa con calma.'];

function start(t){cur=gen(t,st.topics[t].lvl);input='';hintStep=0;wrong=0;render()}
function say(m){$('#say').innerHTML=m}

function render(msg){view=()=>render(msg);header();const q=cur,tp=st.topics[q.topic];
 const needPad=!(q.shade||q.build);
 app.innerHTML=`<div class="row" style="justify-content:space-between"><button class="back" id="bk">⬅ Temas</button><span>${TOPICS[q.topic].i} ${TOPICS[q.topic].t} · nivel ${tp.lvl}/${MAXLVL} · racha ${'🔥'.repeat(tp.streak)}</span></div>
 <div class="tutor">${owlBox()}<div class="bubble" id="say">${msg||'¡Vamos allá! Si te atascas, pídeme una pista.'}</div></div>
 <div class="q">${q.text.replace(/\n/g,'<br>')}</div><div class="manip" id="manip"></div>
 ${needPad?`<div class="row"><input class="ans" id="ans" readonly value=""></div><div class="pad">${[1,2,3,4,5,6,7,8,9,0].map(n=>`<button data-n="${n}">${n}</button>`).join('')}</div>`:''}
 <div class="row">${needPad?'<button class="back" id="del">⌫ Borrar</button>':''}<button class="hint" id="hi">💡 Pista</button><button class="ok" id="ck">✔ Comprobar</button></div>`;
 $('#bk').onclick=menu;$('#hi').onclick=()=>{D3()?D3().owl('hint'):sfx('hint');const h=hints(q);say('💡 '+h[Math.min(hintStep,h.length-1)]);hintStep++};
 $('#ck').onclick=check;
 if(needPad){app.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{if(input.length<5)input+=b.dataset.n;$('#ans').value=input});$('#del').onclick=()=>{input=input.slice(0,-1);$('#ans').value=input}}
 drawManip(q);
}

// ---------- manipulativos ----------
let blocks={c:0,d:0,u:0},shaded=new Set(),shared=[];
function drawManip(q){const m=$('#manip');if(D3())return drawManip3D(q,m);
 if(q.manip==='blocks'){blocks={c:0,d:0,u:0};
  m.innerHTML=`<div class="tray">${[['c','b100','Centena'],['d','b10','Decena'],['u','b1','Unidad']].map(([k,c,l])=>`<div class="src" data-src="${k}"><div class="${c}"></div>${l}</div>`).join('')}<button class="back" id="clr" style="min-height:40px">Vaciar</button></div>
  <div class="mat" id="mat"></div><div class="count" id="cnt"></div>`;
  const upd=()=>{const mat=$('#mat');mat.innerHTML='';[['c','b100'],['d','b10'],['u','b1']].forEach(([k,c])=>{for(let i=0;i<blocks[k];i++){const e=document.createElement('div');e.className=c;e.title='Toca para quitar';e.onclick=()=>{blocks[k]--;sfx('pop');upd()};mat.appendChild(e)}});
   if(blocks.u>=10){blocks.u-=10;blocks.d++;say('¡10 unidades se han juntado en 1 decena! 🎉');return upd()}
   if(blocks.d>=10){blocks.d-=10;blocks.c++;say('¡10 decenas forman 1 centena! 🎉');return upd()}
   $('#cnt').textContent=`${blocks.c} centenas · ${blocks.d} decenas · ${blocks.u} unidades = ${blocks.c*100+blocks.d*10+blocks.u}`};
  m.querySelectorAll('[data-src]').forEach(s=>{const k=s.dataset.src;s.onclick=()=>{blocks[k]++;sfx('drop');upd()};dragify(s,()=>{blocks[k]++;sfx('drop');upd()})});
  $('#clr').onclick=()=>{blocks={c:0,d:0,u:0};upd()};upd();
 }else if(q.manip==='line'){
  let max=q.topic==='tablas'?q.a*10:20;const step=q.topic==='tablas'?q.a:1;const W=900,pad=30,n=max/step;
  let s=`<svg viewBox="0 0 ${W} 110" width="100%" id="nl"><line x1="${pad}" y1="70" x2="${W-pad}" y2="70" stroke="#333" stroke-width="3"/>`;
  for(let i=0;i<=n;i++){const x=pad+i*(W-2*pad)/n;s+=`<line x1="${x}" y1="60" x2="${x}" y2="80" stroke="#333"/><text x="${x}" y="100" text-anchor="middle">${i*step}</text><rect x="${x-14}" y="40" width="28" height="60" fill="transparent" data-v="${i*step}" style="cursor:pointer"/>`}
  m.innerHTML=s+`<g id="hops"></g><circle id="dot" style="pointer-events:none" r="10" fill="#ff6fa8" cx="-50" cy="70"/></svg><div class="count">Toca la recta para dar saltos 🐸</div>`;
  let last=q.topic==='tablas'?0:q.a;const X=v=>pad+v/step*(W-2*pad)/n;
  const dot=$('#dot');dot.setAttribute('cx',X(last));
  m.querySelectorAll('[data-v]').forEach(r=>r.onclick=()=>{const v=+r.dataset.v;const h=$('#hops');const x1=X(last),x2=X(v);
   sfx('hop');h.innerHTML+=`<path d="M${x1} 65 Q${(x1+x2)/2} ${15} ${x2} 65" fill="none" stroke="#4a7cff" stroke-width="3"/>`;last=v;dot.setAttribute('cx',x2);
   m.querySelector('.count').textContent=`Estás en el ${v}`});
 }else if(q.manip==='frac'){shaded=new Set();
  m.innerHTML=`<div class="fbar" id="fb">${Array.from({length:q.den},(_,i)=>`<div data-i="${i}"></div>`).join('')}</div><div class="fbar" style="background:#ffd34d;justify-content:center;align-items:center;font-weight:bold">1 entero</div><div class="count" id="fc">0/${q.den}</div>`;
  m.querySelectorAll('[data-i]').forEach(d=>d.onclick=()=>{const i=+d.dataset.i;sfx('slice');shaded.has(i)?shaded.delete(i):shaded.add(i);d.classList.toggle('on');$('#fc').textContent=`${shaded.size}/${q.den}`});
 }else if(q.manip==='share'){shared=Array(q.b).fill(0);let left=q.a;
  const draw=()=>{m.innerHTML=`<div class="count">Caramelos por repartir (toca para dar uno): </div><div class="row" id="pile" style="font-size:34px;cursor:pointer">${'🍬'.repeat(left)||'¡Todo repartido!'}</div><div class="grid">${shared.map((c,i)=>`<div class="card">🙂 Amigo ${i+1}<br><span style="font-size:26px">${'🍬'.repeat(c)}</span><br>${c}</div>`).join('')}</div>`;
   $('#pile').onclick=()=>{if(!left)return;sfx('clink');const i=shared.indexOf(Math.min(...shared));shared[i]++;left--;draw()}};draw();
 }else m.style.display='none';
}
function dragify(src,drop){// arrastre con dedo o ratón (pointer events + captura)
 src.addEventListener('pointerdown',e=>{if(e.button>0)return;const sx=e.clientX,sy=e.clientY;let g=null,moved=false;
  const tgt=()=>$('#mat')||$('#stage');try{src.setPointerCapture(e.pointerId)}catch(_){}
  const inside=ev=>{const m=tgt();if(!m)return false;const r=m.getBoundingClientRect();return ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom};
  const mv=ev=>{if(!moved&&Math.hypot(ev.clientX-sx,ev.clientY-sy)<8)return;
   if(!moved){moved=true;g=src.firstElementChild.cloneNode();g.classList.add('drag-ghost');document.body.appendChild(g);src.classList.add('drag')}
   g.style.left=ev.clientX+'px';g.style.top=ev.clientY+'px';const m=tgt();if(m)m.classList.toggle('droptarget',inside(ev));
   if(ev.clientY>innerHeight-40)scrollBy(0,14);else if(ev.clientY<40)scrollBy(0,-14);ev.preventDefault()};
  const end=(ev,ok)=>{src.removeEventListener('pointermove',mv);src.removeEventListener('pointerup',up);src.removeEventListener('pointercancel',cancel);
   if(g)g.remove();src.classList.remove('drag');const m=tgt();if(m)m.classList.remove('droptarget');
   if(moved){if(ok&&inside(ev))drop();src.dataset.skip=1;setTimeout(()=>delete src.dataset.skip,350)}};
  const up=ev=>end(ev,true),cancel=ev=>end(ev,false);
  src.addEventListener('pointermove',mv);src.addEventListener('pointerup',up);src.addEventListener('pointercancel',cancel)});
 const oc=src.onclick;src.onclick=e=>{if(src.dataset.skip)return;oc&&oc(e)};}

// ---------- evaluación y adaptación ----------
function numES(n){const U=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
 const D=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'],C=['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
 if(n===100)return'cien';const c=Math.floor(n/100),r=n%100;const t=r<30?U[r]:D[Math.floor(r/10)]+(r%10?' y '+U[r%10]:'');return[C[c],t].filter(Boolean).join(' ')}
function check(){const q=cur,tp=st.topics[q.topic];let val;
 if(q.shade)val=shaded.size;else if(q.build)val=blocks.c*100+blocks.d*10+blocks.u;else{if(input==='')return say('Escribe tu respuesta con los números 🙂');val=+input}
 if(val===q.ans){tp.ok++;tp.miss=0;tp.streak++;const earn=wrong?1:(hintStep?2:3);st.stars+=earn;let up='';
  if(tp.streak>=3&&tp.lvl<MAXLVL){tp.lvl++;tp.streak=0;up=` 🚀 ¡Subes al nivel ${tp.lvl}!`}
  log(q,true);petReward(earn);save();cur=gen(q.topic,tp.lvl);input='';hintStep=0;wrong=0;
  render(`${pick(PRAISE)} +${'⭐'.repeat(earn)}${up}`);if(D3())D3().celebrate(earn);else{$('#owl').classList.add('good');sfx('correct');setTimeout(()=>sfx('sparkle',earn),500)}
  if(up)setTimeout(()=>sfx('levelup'),1100);
 }else{tp.ko++;wrong++;tp.streak=0;tp.miss++;log(q,false);
  if(tp.miss>=2&&tp.lvl>1){tp.lvl--;tp.miss=0;save();const h=hints(q);cur=gen(q.topic,tp.lvl);input='';hintStep=0;wrong=0;
   sfx('wrong');render(`La respuesta era ${q.ans}. ${h[h.length-1]} Vamos a practicar un poquito más fácil 💪`);return}
  save();D3()?D3().owl('sad'):sfx('wrong');const h=hints(q);say(`${pick(ENCOURAGE)} 💡 ${h[Math.min(hintStep,h.length-1)]}`);hintStep++;input='';const a=$('#ans');if(a)a.value='';}
 header();
}
function log(q,ok){st.log.push({t:Date.now(),topic:q.topic,lvl:q.lvl,q:q.text.split('\n').pop(),ok});if(st.log.length>300)st.log.shift()}

// ---------- vista padres ----------
function parents(){view=parents;header();
 app.innerHTML=`<div class="row" style="justify-content:flex-start"><button class="back" id="bk">⬅ Volver</button></div><h2>👪 Progreso</h2>`+KIDS.map(k=>{const s=load(k.id);if(!s)return`<div class="card"><h3>${k.av} ${k.name}</h3>Todavía no ha jugado.</div>`;
  const today=new Date().toDateString(),hoy=s.log.filter(l=>new Date(l.t).toDateString()===today).length;
  return`<div class="card" style="text-align:left;margin-bottom:16px"><h3>${k.av} ${k.name} · ${k.curso}º · ⭐ ${s.stars} · ${hoy} ejercicios hoy</h3><div class="tablewrap"><table><tr><th>Tema</th><th>Nivel</th><th>Aciertos</th><th>Fallos</th><th>% acierto</th></tr>`+
  Object.entries(TOPICS).map(([t,v])=>{const p=s.topics[t]||{lvl:1,ok:0,ko:0},tot=p.ok+p.ko,pc=tot?Math.round(p.ok*100/tot):0;
   return`<tr><td>${v.i} ${v.t}</td><td>${p.lvl}/${MAXLVL}</td><td>${p.ok}</td><td>${p.ko}</td><td><div class="bar"><i style="width:${pc}%"></i></div>${tot?pc+'%':'—'}</td></tr>`}).join('')+
  (window.parentsExtra?parentsExtra(k,s):'')+`</table></div><details><summary>Últimos fallos</summary><ul>${s.log.filter(l=>!l.ok).slice(-10).reverse().map(l=>`<li>${(TOPICS[l.topic]||{t:l.topic}).t}: ${l.q}</li>`).join('')||'<li>Ninguno 🎉</li>'}</ul></details>
  <button class="back" data-reset="${k.id}" style="margin-top:10px">Borrar progreso de ${k.name}</button></div>`}).join('');
 $('#bk').onclick=()=>kid?menu():home();
 app.querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>{if(confirm('¿Seguro que quieres borrar el progreso?')){localStorage.removeItem('tm_'+b.dataset.reset);if(kid&&kid.id===b.dataset.reset){st=fresh(kid);save()}parents()}});
}
// autotest de generadores (sin efectos)
window.__selftest=()=>{for(const t in TOPICS)for(let l=1;l<=MAXLVL;l++)for(let i=0;i<200;i++){const q=gen(t,l);if(!Number.isInteger(q.ans)||q.ans<0)throw new Error(t+l+JSON.stringify(q));hints(q)}return'ok'};
home();

// ---------- manipulativos 3D ----------
function drawManip3D(q,m){const T=D3();
 if(q.manip==='blocks'){blocks={c:0,d:0,u:0};
  m.innerHTML=`<div class="tray">${[['c','b100','Centena'],['d','b10','Decena'],['u','b1','Unidad']].map(([k,c,l])=>`<div class="src" data-src="${k}"><div class="${c}"></div>+ ${l}</div>`).join('')}<button class="back" id="clr" style="min-height:40px">Vaciar</button></div>
  <div id="slot3"></div><div class="count" id="cnt"></div>`;
  stage('#slot3',340,'blocks');
  let busy=Promise.resolve();
  const txt=()=>$('#cnt').textContent=`${blocks.c} centenas · ${blocks.d} decenas · ${blocks.u} unidades = ${blocks.c*100+blocks.d*10+blocks.u} · toca un bloque para quitarlo`;
  const add=k=>{blocks[k]++;busy=busy.then(async()=>{await Promise.race([T.blocks.add(k),T.wait(250)]);
   if(blocks.u>=10){blocks.u-=10;blocks.d++;say('¡10 unidades se han juntado en 1 decena! 🎉');await T.blocks.merge('u')}
   if(blocks.d>=10){blocks.d-=10;blocks.c++;say('¡10 decenas forman 1 centena! 🎉');await T.blocks.merge('d')}txt()});txt()};
  T.blocks.onTap=k=>{if(blocks[k]>0){blocks[k]--;T.blocks.remove(k);txt()}};
  m.querySelectorAll('[data-src]').forEach(s=>{const k=s.dataset.src;s.onclick=()=>add(k);dragify(s,()=>add(k))});
  $('#clr').onclick=()=>{blocks={c:0,d:0,u:0};T.blocks.clear();txt()};txt();
 }else if(q.manip==='line'){const tab=q.topic==='tablas';const step=tab?q.a:1,max=tab?q.a*10:20,st0=tab?0:Math.min(q.a,20);
  m.innerHTML=`<div id="slot3"></div><div class="count">Toca los botones de la recta para que la rana salte 🐸</div>`;
  stage('#slot3',320,'line',{max,step,start:st0});let busy=Promise.resolve();T.line.onTap=v=>{busy=busy.then(()=>T.line.hop(v))};
 }else if(q.manip==='frac'){shaded=new Set();
  m.innerHTML=`<div id="slot3"></div><div class="count" id="fc">${q.shade?'Toca los trozos para colorearlos':'Cada trozo es 1/'+q.den}</div>`;
  stage('#slot3',340,'frac',{den:q.den});T.frac.onTap=i=>{shaded.has(i)?shaded.delete(i):shaded.add(i);T.frac.toggle(i);$('#fc').textContent=`${shaded.size}/${q.den}`};
 }else if(q.manip==='share'){shared=Array(q.b).fill(0);let left=q.a;
  m.innerHTML=`<div id="slot3"></div><div class="row"><button class="hint" id="give">🍬 Dar uno</button><button class="back" id="give1">🍬×${q.b} Una ronda</button></div><div class="count" id="sc">Toca el bol para repartir caramelos (quedan ${q.a})</div>`;
  stage('#slot3',330,'share',{total:q.a,n:q.b});
  const one=()=>{if(!left)return;const i=shared.indexOf(Math.min(...shared));shared[i]++;left--;T.share.deal(i);$('#sc').textContent=left?`Quedan ${left} caramelos`:'¡Todo repartido! ¿Cuántos tiene cada amigo?'};
  T.share.onTap=one;$('#give').onclick=one;$('#give1').onclick=async()=>{for(let i=0;i<q.b;i++){one();await T.wait(120)}};
 }else{m.innerHTML='<div id="slot3"></div>';stage('#slot3',200,'owl')}
}

// ---------- mini-lecciones guiadas (antes de practicar) ----------
const LESSONS={
 suma:{title:'Sumar es juntar',scene:['blocks'],steps:[
  ['¡Hola! Hoy vamos a aprender a SUMAR. Sumar es juntar cosas. Mira: aquí tengo 1 decena y 3 unidades. ¿Cuántos son?',async T=>{await T.blocks.add('d');for(let i=0;i<3;i++)await T.blocks.add('u')}],
  ['¡Son 13! Ahora le sumo 8 unidades más. Mira cómo caen…',async T=>{for(let i=0;i<7;i++){await T.blocks.add('u')}}],
  ['¡Atención! Ya hay 10 unidades. Cuando juntamos 10 unidades… ¡se convierten en 1 decena! Esto es «llevarse una».',async T=>{await T.blocks.merge('u');await T.blocks.add('u')}],
  ['Ahora tenemos 2 decenas y 1 unidad: 13 + 8 = 21. ¡Lo has visto! Ahora te toca a ti.',T=>T.celebrate(3)]]},
 resta:{title:'Restar es quitar',scene:['line',{max:20,step:1,start:15}],steps:[
  ['Restar es QUITAR. Nuestra rana está en el 15. Vamos a calcular 15 − 4.',T=>T.owl('talk')],
  ['Para restar, la rana salta hacia la IZQUIERDA. Un salto por cada número que quitamos: 1, 2…',async T=>{await T.line.hop(14);await T.line.hop(13)}],
  ['…3, 4. ¡Cuatro saltos!',async T=>{await T.line.hop(12);await T.line.hop(11)}],
  ['La rana ha llegado al 11. Así que 15 − 4 = 11. ¡Ahora tú!',T=>T.celebrate(3)]]},
 posicion:{title:'Unidades, decenas y centenas',scene:['blocks'],steps:[
  ['Este cubito pequeño es una UNIDAD (U). Vale 1.',async T=>{await T.blocks.add('u')}],
  ['Si junto 10 unidades forman una barra: una DECENA (D). ¡10 U = 1 D!',async T=>{for(let i=0;i<9;i++)await T.blocks.add('u');await T.blocks.merge('u')}],
  ['Y 10 decenas forman una placa: una CENTENA (C). ¡10 D = 1 C! Vale 100.',async T=>{T.blocks.clear();await T.wait(200);await T.blocks.add('c')}],
  ['Vamos a construir el 347: 3 centenas, 4 decenas y 7 unidades.',async T=>{await T.blocks.add('c');await T.blocks.add('c');for(let i=0;i<4;i++)await T.blocks.add('d');for(let i=0;i<7;i++)await T.blocks.add('u')}],
  ['Lo podemos DESCOMPONER: 347 = 3 C + 4 D + 7 U = 300 + 40 + 7.',T=>T.owl('talk')],
  ['Si añado 3 unidades más… ¡tengo 10 unidades! Las CAMBIO por 1 decena: ahora hay 350.',async T=>{for(let i=0;i<3;i++)await T.blocks.add('u');await T.blocks.merge('u')}],
  ['Y si añado 5 decenas… ¡10 decenas! Las CAMBIO por 1 centena: ¡400!',async T=>{for(let i=0;i<5;i++)await T.blocks.add('d');await T.blocks.merge('d')}],
  ['Para COMPARAR 347 y 374: mira las centenas (3 y 3, iguales), luego las decenas: 4 es menor que 7. ¡374 es mayor!',T=>T.owl('hint')],
  ['Los números también se escriben con letras: 347 es «trescientos cuarenta y siete».',T=>T.owl('talk')],
  ['¡Ya eres experto en C, D y U! Vamos a practicar.',T=>T.celebrate(3)]]},
 tablas:{title:'Multiplicar son saltos iguales',scene:['line',{max:30,step:3,start:0}],steps:[
  ['Multiplicar es sumar el mismo número muchas veces. Vamos a ver 3 × 4.',T=>T.owl('talk')],
  ['3 × 4 son 4 saltos de 3 en 3. Primer salto: ¡3!',async T=>{await T.line.hop(3)}],
  ['Segundo: 6. Tercero: 9…',async T=>{await T.line.hop(6);await T.line.hop(9)}],
  ['Cuarto salto: ¡12! Entonces 3 × 4 = 12. ¡Ahora tú!',async T=>{await T.line.hop(12);T.celebrate(3)}]]},
 division:{title:'Dividir es repartir',scene:['share',{total:12,n:3}],steps:[
  ['Dividir es REPARTIR a partes iguales. Tenemos 12 caramelos y 3 amigos.',T=>T.owl('talk')],
  ['Damos uno a cada amigo, por turnos, para que sea justo.',async T=>{for(let i=0;i<3;i++)await T.share.deal(i)}],
  ['Y seguimos dando vueltas hasta que no quede ninguno…',async T=>{for(let r=0;r<3;r++)for(let i=0;i<3;i++)await T.share.deal(i)}],
  ['¡Cada amigo tiene 4! Por eso 12 : 3 = 4. ¡Te toca!',T=>T.celebrate(3)]]},
 fraccion:{title:'Las fracciones',scene:['frac',{den:4}],steps:[
  ['Esta tarta está partida en 4 trozos IGUALES. El número de abajo de la fracción dice cuántos trozos hay: 4.',T=>T.owl('talk')],
  ['Si me como 1 trozo, es 1/4 (un cuarto).',async T=>{T.frac.toggle(0)}],
  ['Si coloreo 3 trozos, tengo 3/4 (tres cuartos). El número de arriba dice cuántos trozos cogemos.',async T=>{T.frac.toggle(1);await T.wait(300);T.frac.toggle(2)}],
  ['¡Así de fácil! Ahora colorea tú las fracciones.',T=>T.celebrate(3)]]},
 problema:{title:'Cómo resolver un problema',scene:['blocks'],steps:[
  ['Lucía tiene 5 cromos y le regalan 3. ¿Cuántos tiene? Primero, buscamos los DATOS: 5 y 3.',async T=>{for(let i=0;i<5;i++)await T.blocks.add('u')}],
  ['Después pensamos qué pasa: le REGALAN, así que tiene más. Juntar es SUMAR.',async T=>{for(let i=0;i<3;i++)await T.blocks.add('u')}],
  ['Contamos: 5 + 3 = 8. ¡Lucía tiene 8 cromos! Lee siempre despacio y piensa: ¿junto, quito, reparto o hago grupos?',T=>T.celebrate(3)]]}
};
// las animaciones de una lección se detienen si el niño sale de ella (no ensucian la escena siguiente)
function guardT(T,alive){const w=o=>new Proxy(o,{get(t,k){const v=t[k];if(typeof v==='function')return(...a)=>alive()?v.apply(t,a):Promise.resolve();return v&&typeof v==='object'?w(v):v}});return w(T)}
function lesson(t){view=()=>lesson(t);const me=view;header();const L=LESSONS[t];let i=0,busy=false;const GT=()=>D3()&&guardT(D3(),()=>view===me);
 app.innerHTML=`<div class="row" style="justify-content:space-between"><button class="back" id="bk">⬅ Temas</button><span>🎓 Lección: ${L.title}</span></div>
 <div class="tutor">${owlBox()}<div class="bubble" id="say"></div></div><div id="slot3"></div><div class="dots" id="dots"></div>
 <div class="row"><button class="back" id="rep">🔁 Otra vez</button><button class="ok" id="nx">Siguiente ▶</button></div>`;
 $('#bk').onclick=menu;
 const begin=()=>{i=0;if(D3()){D3().mount($('#slot3'),330);D3().scene(L.scene[0],L.scene[1]||{})}step()};
 const step=async()=>{const [txt,act]=L.steps[i];sfx('whoosh');say(txt);$('#dots').innerHTML=L.steps.map((_,j)=>`<i class="${j<=i?'on':''}"></i>`).join('');
  $('#nx').textContent=i===L.steps.length-1?'¡Ahora yo! ✏️':'Siguiente ▶';
  if(D3()){busy=true;$('#nx').disabled=true;try{await D3().wait(i===0?700:50);await act(GT())}catch(e){console.error(e)}busy=false;const nx=$('#nx');if(nx)nx.disabled=false}};
 $('#nx').onclick=()=>{if(busy)return;if(i<L.steps.length-1){i++;step()}else{st.lessons=st.lessons||{};st.lessons[t]=1;save();start(t)}};
 $('#rep').onclick=()=>{if(!busy)begin()};begin();
}
