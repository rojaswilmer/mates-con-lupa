'use strict';
// Efectos de sonido sintetizados con Web Audio API (sin ficheros externos)
(function(){
const LS=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const SS=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
let ctx=null,master=null,sfxBus=null,musBus=null,musTimer=null;
let muted=LS('tm_mute')==='1',music=LS('tm_music')==='1';
function init(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
 try{ctx=new AC();}catch(e){return null}
 master=ctx.createGain();master.gain.value=muted?0:0.8;
 const comp=ctx.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;master.connect(comp);comp.connect(ctx.destination);
 sfxBus=ctx.createGain();sfxBus.gain.value=0.55;sfxBus.connect(master);
 musBus=ctx.createGain();musBus.gain.value=0.07;musBus.connect(master);return ctx}
let primed=false;
function unlock(){const c=init();if(!c)return;
 // iOS/Safari: el contexto nace 'suspended' y puede quedar 'interrupted'; se reanuda dentro del gesto
 if(c.state!=='running'){const p=c.resume();p&&p.catch&&p.catch(()=>{})}
 // buffer silencioso (desbloqueo clásico de iOS), solo una vez
 if(!primed){primed=true;try{const b=c.createBuffer(1,1,22050),s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0)}catch(e){}}
 if(music&&!musTimer)startMusic()}
['touchstart','touchend','pointerdown','pointerup','keydown','click'].forEach(ev=>document.addEventListener(ev,unlock,{capture:true,passive:true}));
// al volver a la app (cambio de pestaña, bloqueo de pantalla) se reanuda con el siguiente toque o al momento si se puede
document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden){if(ctx.state==='running')ctx.suspend().catch(()=>{})}else ctx.resume().catch(()=>{})});
window.addEventListener('pageshow',()=>{ctx&&ctx.state!=='running'&&ctx.resume().catch(()=>{})});
function ok(){return ctx&&!muted&&ctx.state==='running'}
// tono básico con envolvente
function tone(f,t0,dur,{type='sine',vol=.5,f2=null,att=.005,bus=null}={}){const t=ctx.currentTime+t0;const o=ctx.createOscillator(),g=ctx.createGain();
 o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+att);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 o.connect(g);g.connect(bus||sfxBus);o.start(t);o.stop(t+dur+.05)}
function noise(t0,dur,{vol=.3,freq=1500,q=1,type='bandpass',f2=null}={}){const t=ctx.currentTime+t0;const n=Math.floor(ctx.sampleRate*dur),b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);
 for(let i=0;i<n;i++)d[i]=Math.random()*2-1;const s=ctx.createBufferSource();s.buffer=b;const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(freq,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=q;
 const g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 s.connect(fl);fl.connect(g);g.connect(sfxBus);s.start(t);s.stop(t+dur+.02)}
const last={};function rl(n,ms){const now=performance.now();if(last[n]&&now-last[n]<ms)return false;last[n]=now;return true}
const R=(a,b)=>a+Math.random()*(b-a);
const S={
 tap(){tone(R(820,900),0,.06,{type:'triangle',vol:.18})},
 key(){tone(R(600,680),0,.05,{type:'square',vol:.06});tone(1200,0,.03,{vol:.05})},
 drop(){tone(R(300,340),0,.18,{f2:90,vol:.45});noise(0,.06,{vol:.12,freq:900})},
 pop(){tone(R(500,560),0,.09,{f2:1100,vol:.3,type:'triangle'})},
 merge(){[523,659,784,1047].forEach((f,i)=>{tone(f,i*.08,.35,{vol:.22,type:'triangle'});tone(f*2,i*.08,.2,{vol:.05})})},
 hop(){tone(180,0,.28,{f2:620,vol:.32,type:'sine'});tone(360,0,.22,{f2:900,vol:.08,type:'triangle'})},
 clink(){const f=R(1800,2300);tone(f,0,.25,{vol:.16});tone(f*1.5,0,.15,{vol:.07});tone(f*0.75,.03,.2,{vol:.06,type:'triangle'})},
 slice(){noise(0,.08,{vol:.2,freq:2500,q:2});tone(R(700,760),0,.1,{f2:400,vol:.18,type:'triangle'})},
 correct(){[523,659,784].forEach((f,i)=>tone(f,i*.1,.22,{vol:.25,type:'triangle'}));tone(1047,.3,.5,{vol:.28,type:'triangle'});tone(784,.3,.5,{vol:.12,type:'triangle'});
  for(let i=0;i<6;i++)tone(R(2000,3500),.45+i*.06,.18,{vol:.06})},
 sparkle(n=3){for(let i=0;i<n*3;i++)tone(R(1800,3600),i*.05,.2,{vol:.05})},
 wrong(){tone(440,0,.22,{f2:415,vol:.16,type:'sine'});tone(370,.22,.35,{f2:330,vol:.16,type:'sine'})},
 levelup(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,i*.09,.25,{vol:.2,type:'square',att:.01}));tone(1568,.5,.6,{vol:.18,type:'triangle'})},
 hint(){tone(500,0,.14,{f2:700,vol:.2,type:'sine'});tone(700,.16,.18,{f2:560,vol:.18,type:'sine'})},
 whoosh(){noise(0,.35,{vol:.18,freq:400,f2:3000,q:.8})},
 hoot(){tone(420,0,.28,{f2:380,vol:.3,att:.04});tone(400,.38,.45,{f2:340,vol:.3,att:.05})}
};
const play=(n,...a)=>{(window.__sfxLog=window.__sfxLog||[]).push(n);if(window.__sfxLog.length>500)window.__sfxLog.shift();if(!ok()||!S[n])return;if(!rl(n,n==='drop'||n==='clink'?40:60))return;try{S[n](...a)}catch(e){}};
// música de fondo suave (pentatónica)
const MEL=[523,587,659,784,880,784,659,587,523,659,784,659,587,523,440,523];
function startMusic(){if(!ctx||musTimer)return;let i=0;const beat=.45;let next=ctx.currentTime+.1;
 musTimer=setInterval(()=>{if(!ctx)return;while(next<ctx.currentTime+.6){const dt=next-ctx.currentTime;
   if(!muted&&ctx.state==='running'){tone(MEL[i%MEL.length],dt,beat*.9,{vol:.4,type:'triangle',att:.03,bus:musBus});
    if(i%4===0)tone(MEL[(i)%MEL.length]/4,dt,beat*3.5,{vol:.35,type:'sine',att:.05,bus:musBus})}
   i++;next+=beat}},150)}
function stopMusic(){clearInterval(musTimer);musTimer=null}
function setMute(m){muted=m;SS('tm_mute',m?'1':'0');if(master)master.gain.setTargetAtTime(m?0:.8,ctx.currentTime,.02);ui()}
function setMusic(m){music=m;SS('tm_music',m?'1':'0');if(m){unlock();startMusic()}else stopMusic();ui()}
function ui(){let b=document.getElementById('sndbar');if(!b){b=document.createElement('div');b.id='sndbar';
  b.innerHTML='<button id="sndM" aria-label="Sonido"></button><button id="sndB" aria-label="Música"></button>';document.body.appendChild(b);
  b.querySelector('#sndM').onclick=e=>{e.stopPropagation();setMute(!muted);if(!muted)play('tap')};
  b.querySelector('#sndB').onclick=e=>{e.stopPropagation();setMusic(!music)}}
 const m=b.querySelector('#sndM'),u=b.querySelector('#sndB');m.textContent=muted?'🔇':'🔊';m.title=muted?'Activar sonido':'Silenciar';
 u.textContent='🎵';u.classList.toggle('off',!music);u.title=music?'Quitar música':'Poner música'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui);else ui();
// clics genéricos en botones
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b||b.closest('#sndbar'))return;
 if(b.closest('.pad'))play('key');else if(b.id!=='ck'&&b.id!=='hi'&&b.id!=='nx')play('tap')},true);
// enganche a la escena 3D
window.__wrap3D=T=>{if(!T||T.__snd)return;T.__snd=1;
 const w=(o,k,n)=>{const f=o[k];o[k]=function(...a){play(n);return f.apply(this,a)}};
 w(T.blocks,'add','drop');w(T.blocks,'merge','merge');w(T.blocks,'remove','pop');w(T.line,'hop','hop');w(T.frac,'toggle','slice');w(T.share,'deal','clink');
 const cel=T.celebrate;T.celebrate=function(n){play('correct');setTimeout(()=>play('sparkle',n||3),500);return cel.apply(this,arguments)};
 const ow=T.owl;T.owl=function(a){if(a==='hint')play('hint');else if(a==='sad')play('wrong');return ow.apply(this,arguments)}};
window.SFX={play,setMute,setMusic,get muted(){return muted},get music(){return music},get state(){return ctx?ctx.state:'none'}};
})();
