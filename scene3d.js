// Mates con Lupa · escena 3D (Three.js local). Si falla, la app sigue en 2D.
import * as THREE from './three.module.js';

function webglOK(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}}
if(!webglOK()||new URLSearchParams(location.search).has('2d')){console.info('WebGL no disponible: modo 2D');}
else init();

function init(){
const P={bg:0xeaf6ff,floor:0xfdf3e7,owl:0xb79ced,belly:0xf6e7ff,beak:0xffa64d,unit:0x7bd34d,rod:0x3dc3ff,flat:0xff8a3d,pink:0xff6fa8,yellow:0xffd34d,blue:0x4a7cff,green:0x5bd17a};
const wrap=document.createElement('div');wrap.id='stage';
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
wrap.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(P.bg);scene.fog=new THREE.Fog(P.bg,18,34);
const cam=new THREE.PerspectiveCamera(38,2,0.1,100);cam.position.set(0,4,16);
const camGoal={pos:new THREE.Vector3(0,4,16),look:new THREE.Vector3(0,1.5,0)},camLook=new THREE.Vector3(0,1.5,0);
scene.add(new THREE.HemisphereLight(0xffffff,0xffe4c4,1.1));
const sun=new THREE.DirectionalLight(0xffffff,1.6);sun.position.set(5,12,8);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-14,right:14,top:10,bottom:-6,near:1,far:40});sun.shadow.radius=4;scene.add(sun);
const floor=new THREE.Mesh(new THREE.CircleGeometry(30,40),new THREE.MeshLambertMaterial({color:P.floor}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const M=c=>new THREE.MeshLambertMaterial({color:c});
const mesh=(g,c,cast=true)=>{const m=new THREE.Mesh(g,typeof c==='number'?M(c):c);m.castShadow=cast;m.receiveShadow=true;return m};

// ---- tweens ----
const tweens=[];const ease={lin:k=>k,out:k=>1-Math.pow(1-k,3),inout:k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,
 bounce:k=>{const n=7.5625,d=2.75;if(k<1/d)return n*k*k;if(k<2/d)return n*(k-=1.5/d)*k+.75;if(k<2.5/d)return n*(k-=2.25/d)*k+.9375;return n*(k-=2.625/d)*k+.984375},
 back:k=>{const c=1.70158;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)}};
const tween=(dur,fn,e='out')=>new Promise(res=>tweens.push({t:0,dur,fn,e:ease[e],res}));
const wait=ms=>new Promise(r=>setTimeout(r,ms));

// ---- etiquetas ----
function label(txt,h=.6,color='#223',bg=null){const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');
 const draw=t=>{x.clearRect(0,0,256,128);if(bg){x.fillStyle=bg;x.beginPath();x.roundRect(8,8,240,112,40);x.fill()}x.fillStyle=color;let fs=80;x.font='bold 80px "Trebuchet MS",sans-serif';const mw=x.measureText(t).width;if(mw>220){fs=Math.floor(80*220/mw);x.font='bold '+fs+'px "Trebuchet MS",sans-serif'}x.textAlign='center';x.textBaseline='middle';x.fillText(t,128,68)};
 draw(txt);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthWrite:false}));s.scale.set(h*2,h,1);
 s.userData.set=t=>{draw(t);tex.needsUpdate=true};return s}

// ---- búho Lupa ----
const owl=new THREE.Group();scene.add(owl);
const body=new THREE.Group();owl.add(body);
const torso=mesh(new THREE.SphereGeometry(1,20,16),P.owl);torso.scale.set(1,1.15,.9);torso.position.y=1.2;body.add(torso);
const belly=mesh(new THREE.SphereGeometry(.75,16,12),P.belly);belly.scale.set(1,1.1,.5);belly.position.set(0,1.05,.55);body.add(belly);
const head=new THREE.Group();head.position.y=2.35;body.add(head);
const skull=mesh(new THREE.SphereGeometry(.85,20,16),P.owl);skull.scale.set(1.1,.9,.9);head.add(skull);
for(const s of[-1,1]){const tuft=mesh(new THREE.ConeGeometry(.22,.55,8),P.owl);tuft.position.set(s*.62,.7,0);tuft.rotation.z=-s*.4;head.add(tuft)}
const eyes=[];for(const s of[-1,1]){const g=new THREE.Group();g.position.set(s*.37,.08,.62);const w=mesh(new THREE.SphereGeometry(.3,16,12),0xffffff,false);g.add(w);
 const p=mesh(new THREE.SphereGeometry(.15,12,10),0x223344,false);p.position.z=.2;g.add(p);const hl=mesh(new THREE.SphereGeometry(.05,8,6),0xffffff,false);hl.position.set(.06,.06,.33);g.add(hl);head.add(g);eyes.push(g)}
// lupa (gafas-lupa) en un ojo
const ring=mesh(new THREE.TorusGeometry(.36,.06,8,24),P.yellow);ring.position.set(.37,.08,.72);head.add(ring);
const beak=mesh(new THREE.ConeGeometry(.14,.35,8),P.beak);beak.rotation.x=Math.PI/2+.4;beak.position.set(0,-.2,.8);head.add(beak);
const wings=[];for(const s of[-1,1]){const piv=new THREE.Group();piv.position.set(s*.9,1.7,0);const w=mesh(new THREE.SphereGeometry(.5,12,10),0x9c80dd);w.scale.set(.35,1,.7);w.position.y=-.55;piv.add(w);body.add(piv);wings.push(piv)}
for(const s of[-1,1]){const f=mesh(new THREE.SphereGeometry(.2,10,8),P.beak);f.scale.set(1,.4,1.3);f.position.set(s*.35,.1,.3);owl.add(f)}
const perch={scale:1};let owlMood={flap:0,tilt:0,shake:0,jump:0};
function blink(){Promise.resolve().then(()=>tween(120,k=>eyes.forEach(e=>e.scale.y=1-.9*k))).then(()=>tween(120,k=>eyes.forEach(e=>e.scale.y=.1+.9*k)));setTimeout(blink,2500+Math.random()*3000)}setTimeout(blink,1500);
function owlDo(a){if(a==='celebrate'){owlMood.flap=1.4;owlMood.jump=1.4}else if(a==='hint'){owlMood.tilt=1.8}else if(a==='sad'){owlMood.shake=1}else if(a==='talk'){owlMood.tilt=.8}}

// ---- grupos de escenas ----
const groups={};const interactive=[];
function newGroup(n){if(groups[n]){scene.remove(groups[n]);}const g=new THREE.Group();groups[n]=g;scene.add(g);interactive.length=0;return g}
function clearAll(){for(const n in groups){scene.remove(groups[n]);delete groups[n]}interactive.length=0}

// ---- bloques base 10 ----
function stripeTex(col,n){const c=document.createElement('canvas');c.width=16;c.height=16*n;const x=c.getContext('2d');x.fillStyle='#'+col.toString(16).padStart(6,'0');x.fillRect(0,0,16,16*n);x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=2;for(let i=0;i<=n;i++){x.beginPath();x.moveTo(0,i*16);x.lineTo(16,i*16);x.stroke()}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function gridTex(col){const c=document.createElement('canvas');c.width=c.height=160;const x=c.getContext('2d');x.fillStyle='#'+col.toString(16).padStart(6,'0');x.fillRect(0,0,160,160);x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=2;for(let i=0;i<=10;i++){x.beginPath();x.moveTo(0,i*16);x.lineTo(160,i*16);x.moveTo(i*16,0);x.lineTo(i*16,160);x.stroke()}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const U=.32;const geo={u:new THREE.BoxGeometry(U*.95,U*.95,U*.95),d:new THREE.BoxGeometry(U*.95,U*10,U*.95),c:new THREE.BoxGeometry(U*10,U*10,U*.95)};
const mat={u:new THREE.MeshLambertMaterial({color:P.unit}),d:new THREE.MeshLambertMaterial({map:stripeTex(P.rod,10)}),c:new THREE.MeshLambertMaterial({map:gridTex(P.flat)})};
const B={list:{c:[],d:[],u:[]},onTap:null,label:null};
function slot(k,i){if(k==='c')return new THREE.Vector3(-3.4+i*.28,U*5,-i*.35);if(k==='d')return new THREE.Vector3(.6+i*.42,U*5,0);return new THREE.Vector3(5.1+Math.floor(i/5)*.4,U*.5+(i%5)*U,0)}
function blocksSetup(){const g=newGroup('blocks');B.list={c:[],d:[],u:[]};
 const pad=mesh(new THREE.BoxGeometry(11,.08,3.6),new THREE.MeshLambertMaterial({color:0xdfeaff}),false);pad.position.set(1.6,.04,-.6);g.add(pad);
 B.label=label('0',1,'#223','#ffffffdd');B.label.position.set(1.6,4.4,0);g.add(B.label);relabel();}
function relabel(){const c=B.list.c.length,d=B.list.d.length,u=B.list.u.length;B.label&&B.label.userData.set(String(c*100+d*10+u))}
function blockAdd(k,silent){const g=groups.blocks;if(!g)return;const m=mesh(geo[k],mat[k]);const i=B.list[k].length;const p=slot(k,i);m.position.set(p.x,p.y+6,p.z);m.rotation.z=(Math.random()-.5)*.6;
 m.userData.kind=k;m.userData.onTap=()=>B.onTap&&B.onTap(k);g.add(m);B.list[k].push(m);interactive.push(m);relabel();
 const y0=p.y+6,r0=m.rotation.z;return tween(silent?1:700,e=>{m.position.y=y0+(p.y-y0)*e;m.rotation.z=r0*(1-e)},'bounce')}
function blockRemove(k){const m=B.list[k].pop();if(!m)return;const ii=interactive.indexOf(m);if(ii>=0)interactive.splice(ii,1);relabel();
 tween(250,e=>m.scale.setScalar(1-e+.001)).then(()=>m.parent&&m.parent.remove(m))}
async function blockMerge(k){// 10 u -> 1 d  ó 10 d -> 1 c
 const from=B.list[k].splice(0,10);from.forEach(m=>{const ii=interactive.indexOf(m);if(ii>=0)interactive.splice(ii,1)});
 const to=k==='u'?'d':'c';const target=slot(to,B.list[to].length);
 const starts=from.map(m=>m.position.clone());
 await tween(600,e=>from.forEach((m,i)=>{const t=k==='u'?new THREE.Vector3(target.x,U*.5+i*U,0):new THREE.Vector3(target.x-U*4.5+i*U,target.y,0);m.position.lerpVectors(starts[i],t,e);m.position.y+=Math.sin(e*Math.PI)*1.5}),'inout');
 await tween(250,e=>from.forEach(m=>m.scale.setScalar(1+.25*Math.sin(e*Math.PI))));
 from.forEach(m=>m.parent.remove(m));
 // re-colocar los que quedan
 B.list[k].forEach((m,i)=>{const p=slot(k,i);const s=m.position.clone();tween(300,e=>m.position.lerpVectors(s,p,e))});
 await blockAdd(to,false);burst(target.clone().add(new THREE.Vector3(0,1.5,0)),40);}
function blocksClear(){['c','d','u'].forEach(k=>{while(B.list[k].length)blockRemove(k)})}

// ---- recta numérica ----
const L={};
function lineSetup({max=20,step=1,start=0}){const g=newGroup('line');L.max=max;L.step=step;L.n=max/step;L.x0=-4.5;L.len=11;L.cur=start;
 const bar=mesh(new THREE.BoxGeometry(L.len+.6,.15,.4),0xffffff);bar.position.set(L.x0+L.len/2,.3,0);g.add(bar);
 for(let i=0;i<=L.n;i++){const x=L.X(i*step);const t=mesh(new THREE.CylinderGeometry(.06,.06,.5,6),0x556);t.position.set(x,.45,0);g.add(t);
  const lb=label(String(i*step),L.n>12?.42:.55);lb.position.set(x,-.15+.02,.6);lb.position.y=.05;lb.center.set(.5,0);g.add(lb);lb.position.set(x,0.05,.7);
  const pad=mesh(new THREE.CylinderGeometry(.22,.26,.12,12),i%5===0?P.yellow:0xcfe0ff);pad.position.set(x,.42,0);pad.userData.onTap=()=>L.onTap&&L.onTap(i*step);g.add(pad);interactive.push(pad)}
 const frog=new THREE.Group();const fb=mesh(new THREE.SphereGeometry(.38,14,10),P.green);fb.scale.set(1,.75,1);frog.add(fb);
 for(const s of[-1,1]){const e=mesh(new THREE.SphereGeometry(.13,10,8),0xffffff);e.position.set(s*.17,.27,.15);frog.add(e);const p=mesh(new THREE.SphereGeometry(.06,8,6),0x223);p.position.set(s*.17,.3,.26);frog.add(p)}
 frog.position.set(L.X(start),.8,0);g.add(frog);L.frog=frog;L.arcs=new THREE.Group();g.add(L.arcs);
 L.label=label('Estás en el '+start,.5,'#223','#ffffffdd');L.label.scale.set(2.6,.65,1);L.label.position.set(L.x0+L.len/2,3.6,0);g.add(L.label);}
L.X=v=>L.x0+(v/L.step)*(L.len/L.n);
async function lineHop(v){if(!groups.line)return;const a=L.cur,x1=L.X(a),x2=L.X(v);const h=Math.min(3,.8+Math.abs(x2-x1)*.35);
 const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(x1,.6,0),new THREE.Vector3((x1+x2)/2,h*2,0),new THREE.Vector3(x2,.6,0));
 const tube=mesh(new THREE.TubeGeometry(curve,24,.04,6),v>=a?P.blue:P.pink,false);L.arcs.add(tube);L.cur=v;
 const fy=.8;await tween(450,e=>{L.frog.position.x=x1+(x2-x1)*e;L.frog.position.y=fy+Math.sin(e*Math.PI)*h;L.frog.scale.y=1+.25*Math.sin(e*Math.PI)},'inout');
 await tween(150,e=>L.frog.scale.y=1-.3*Math.sin(e*Math.PI));L.label.userData.set('Estás en el '+v);}

// ---- fracciones ----
const F={};
function fracSetup(den){const g=newGroup('frac');F.den=den;F.parts=[];F.on=new Set();
 const pie=den<=6;const base=new THREE.Group();base.position.set(1.4,0,0);g.add(base);
 for(let i=0;i<den;i++){let m;const c=new THREE.MeshLambertMaterial({color:0xfff4d6});
  if(pie){const len=Math.PI*2/den;m=mesh(new THREE.CylinderGeometry(2.4,2.4,.5,Math.max(8,Math.round(48/den)),1,false,i*len+.02,len-.04),c);m.position.y=.3;m.userData.dir=new THREE.Vector3(Math.sin(i*len+len/2),0,Math.cos(i*len+len/2));m.rotation.x=0;}
  else{const w=8/den;m=mesh(new THREE.BoxGeometry(w-.08,1.2,1.2),c);m.position.set(-4+w/2+i*w,.65,0);m.userData.dir=new THREE.Vector3(0,0,.6)}
  m.userData.home=m.position.clone();m.userData.onTap=()=>F.onTap&&F.onTap(i);base.add(m);F.parts.push(m);interactive.push(m)}
 if(pie){base.rotation.x=.55;base.position.y=1.2}
 F.label=label('0/'+den,1,'#223','#ffffffdd');F.label.position.set(1.4,4.3,0);g.add(F.label)}
function fracToggle(i){const m=F.parts[i];if(!m)return;const on=!F.on.has(i);on?F.on.add(i):F.on.delete(i);m.material.color.set(on?P.pink:0xfff4d6);
 const h=m.userData.home,t=on?h.clone().addScaledVector(m.userData.dir,.45).add(new THREE.Vector3(0,.5,0)):h.clone(),s=m.position.clone();
 tween(350,e=>m.position.lerpVectors(s,t,e),'back');F.label.userData.set(F.on.size+'/'+F.den);return F.on.size}

// ---- reparto de caramelos ----
const S={};const candyCols=[0xff6fa8,0xffd34d,0x3dc3ff,0x7bd34d,0xb79ced];
function candy(){const g=new THREE.Group();const c=candyCols[Math.floor(Math.random()*5)];const b=mesh(new THREE.SphereGeometry(.16,10,8),c);g.add(b);
 for(const s of[-1,1]){const w=mesh(new THREE.ConeGeometry(.1,.16,6),c);w.rotation.z=s*Math.PI/2;w.position.x=s*.22;g.add(w)}return g}
function shareSetup(total,n){const g=newGroup('share');S.left=[];S.counts=Array(n).fill(0);S.plates=[];
 const bowl=mesh(new THREE.CylinderGeometry(1.3,.9,.6,20),0xffffff);bowl.position.set(-2.6,.3,1.2);g.add(bowl);
 for(let i=0;i<total;i++){const c=candy();const a=i*2.4,r=.25+.05*Math.sqrt(i)*2.2;c.position.set(-2.6+Math.cos(a)*Math.min(r,1),.65+Math.floor(i/14)*.22,1.2+Math.sin(a)*Math.min(r,1)*.8);c.rotation.y=a;g.add(c);S.left.push(c)}
 const hit=mesh(new THREE.CylinderGeometry(1.5,1.5,2,12),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),false);hit.position.set(-2.6,1,1.2);hit.userData.onTap=()=>S.onTap&&S.onTap();g.add(hit);interactive.push(hit);
 const span=Math.min(9.5,n*2.2),x0=1.6-span/2+span/n/2;
 for(let i=0;i<n;i++){const x=n===1?1.6:x0+i*span/n;const p=mesh(new THREE.CylinderGeometry(.85,.65,.12,20),0xcfe0ff);p.position.set(x+1.4,.08,0);g.add(p);
  const f=mesh(new THREE.SphereGeometry(.45,14,10),[0xffe0bd,0xf1c27d,0xffd1dc][i%3]);f.position.set(x+1.4,1.1,-1);g.add(f);
  for(const s of[-1,1]){const e=mesh(new THREE.SphereGeometry(.06,6,6),0x223,false);e.position.set(x+1.4+s*.15,1.2,-.6);g.add(e)}
  const lb=label('0',.5,'#223','#ffffffdd');lb.position.set(x+1.4,2,-1);g.add(lb);S.plates.push({x:x+1.4,lb})}}
async function shareDeal(i){const c=S.left.pop();if(!c)return false;S.counts[i]++;const k=S.counts[i]-1;const pl=S.plates[i];
 const t=new THREE.Vector3(pl.x+((k%3)-1)*.3,.25+Math.floor(k/3)*.2,(Math.floor(k/3)%2)*.2),s=c.position.clone();
 await tween(450,e=>{c.position.lerpVectors(s,t,e);c.position.y+=Math.sin(e*Math.PI)*2;c.rotation.x=e*6},'inout');pl.lb.userData.set(String(S.counts[i]));return true}

// ---- confeti y estrellas ----
const confN=160;const conf=new THREE.InstancedMesh(new THREE.PlaneGeometry(.18,.1),new THREE.MeshBasicMaterial({side:THREE.DoubleSide,vertexColors:false}),confN);
conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage);const cv=[];const dummy=new THREE.Object3D();const col=new THREE.Color();
for(let i=0;i<confN;i++){conf.setColorAt(i,col.set(candyCols[i%5]));cv.push({p:new THREE.Vector3(0,-50,0),v:new THREE.Vector3(),r:new THREE.Vector3(),life:0})}
scene.add(conf);conf.frustumCulled=false;
function burst(at,n=confN){let k=0;for(const c of cv){if(k>=n)break;if(c.life>0&&n<confN)continue;c.p.copy(at);c.v.set((Math.random()-.5)*8,4+Math.random()*6,(Math.random()-.5)*4);c.r.set(Math.random()*6,Math.random()*6,0);c.life=2.2;k++}}
const starShape=new THREE.Shape();for(let i=0;i<10;i++){const r=i%2?.18:.42,a=i/10*Math.PI*2+Math.PI/2;i?starShape.lineTo(Math.cos(a)*r,Math.sin(a)*r):starShape.moveTo(Math.cos(a)*r,Math.sin(a)*r)}
const starGeo=new THREE.ExtrudeGeometry(starShape,{depth:.12,bevelEnabled:false});const starMat=M(P.yellow);
function starBurst(n=3){for(let i=0;i<n;i++){const s=mesh(starGeo,starMat,false);s.position.copy(owl.position).add(new THREE.Vector3(0,3,0));scene.add(s);const tx=owl.position.x+(i-(n-1)/2)*1.4,ty=owl.position.y+4;const s0=s.position.clone();
 tween(900+i*150,e=>{s.position.set(s0.x+(tx-s0.x)*e,s0.y+(ty-s0.y)*e,s0.z);s.rotation.y=e*8;s.scale.setScalar(.5+e*1.2)},'back').then(()=>wait(500)).then(()=>tween(300,e=>s.scale.setScalar(1.7*(1-e)+.001))).then(()=>scene.remove(s))}}

// ---- cámara / escenas ----
const views={owl:{owl:[0,0,0,1.3],cam:[0,3.2,10],look:[0,1.8,0]},
 blocks:{owl:[-6.3,0,.5,1],cam:[-.4,3.6,11],look:[-.4,1.7,0]},
 line:{owl:[-6.6,0,.5,1],cam:[-.6,4,11],look:[-.6,1.2,0]},
 frac:{owl:[-4.6,0,.5,1],cam:[-1,4.6,9.5],look:[-1,1.3,0]},
 share:{owl:[-6,0,.5,1],cam:[-.2,5,10.5],look:[-.2,1,0]}};
let curView='owl';
function setView(v){curView=v;const o=views[v];const s=owl.position.clone(),s0=perch.scale;tween(800,e=>{owl.position.lerpVectors(s,new THREE.Vector3(o.owl[0],o.owl[1],o.owl[2]),e);perch.scale=s0+(o.owl[3]-s0)*e;owl.scale.setScalar(perch.scale)},'inout');
 camGoal.pos.set(...o.cam);camGoal.look.set(...o.look)}

// ---- bucle ----
let last=performance.now(),t=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
 if(!wrap.isConnected)return;
 for(let i=tweens.length-1;i>=0;i--){const w=tweens[i];w.t+=dt*1000;const k=Math.min(1,w.t/w.dur);w.fn(w.e(k));if(k>=1){tweens.splice(i,1);w.res()}}
 // búho
 body.position.y=Math.sin(t*2)*.06+(owlMood.jump>0?Math.abs(Math.sin(owlMood.jump*7))*.6:0);
 const fl=owlMood.flap>0?Math.sin(t*25)*.9:Math.sin(t*2)*.05;wings[0].rotation.z=-.15-Math.max(0,fl);wings[1].rotation.z=.15+Math.max(0,fl);
 head.rotation.z=owlMood.tilt>0?.35*Math.min(1,owlMood.tilt*3):Math.sin(t*.7)*.04;head.rotation.y=owlMood.shake>0?Math.sin(owlMood.shake*30)*.4:Math.sin(t*.5)*.15;
 for(const k in owlMood)owlMood[k]=Math.max(0,owlMood[k]-dt);
 // cámara
 cam.position.lerp(camGoal.pos,1-Math.pow(.02,dt));camLook.lerp(camGoal.look,1-Math.pow(.02,dt));cam.lookAt(camLook);
 // confeti
 let any=false;for(let i=0;i<confN;i++){const c=cv[i];if(c.life>0){any=true;c.life-=dt;c.v.y-=9*dt;c.v.multiplyScalar(.99);c.p.addScaledVector(c.v,dt);if(c.p.y<.05){c.p.y=.05;c.v.set(0,0,0)}c.r.x+=dt*5;}
  else c.p.y=-50;dummy.position.copy(c.p);dummy.rotation.set(c.r.x,c.r.y,c.r.x*.5);dummy.updateMatrix();conf.setMatrixAt(i,dummy.matrix)}
 conf.instanceMatrix.needsUpdate=true;
 resize();renderer.render(scene,cam)}
function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;const c=renderer.domElement;if(c._w!==w||c._h!==h){c._w=w;c._h=h;renderer.setSize(w,h,false);cam.aspect=w/h;
 cam.fov=w/h<1.4?52:38;cam.updateProjectionMatrix()}}
requestAnimationFrame(frame);

// ---- toques ----
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
renderer.domElement.addEventListener('pointerdown',e=>{const r=renderer.domElement.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(ndc,cam);
 const hit=ray.intersectObjects(interactive,false)[0];if(hit&&hit.object.userData.onTap){hit.object.userData.onTap();e.preventDefault()}
 else{const o=ray.intersectObject(owl,true)[0];if(o){owlDo('celebrate');window.SFX&&SFX.play('hoot')}}});

window.T3D={
 mount(el,h){el.appendChild(wrap);wrap.style.height=(h||340)+'px'},
 scene(name,opts={}){clearAll();if(name==='blocks')blocksSetup();else if(name==='line')lineSetup(opts);else if(name==='frac')fracSetup(opts.den);else if(name==='share')shareSetup(opts.total,opts.n);setView(views[name]?name:'owl')},
 owl:owlDo,
 celebrate(n=3){owlDo('celebrate');burst(owl.position.clone().add(new THREE.Vector3(2,3,0)));starBurst(n)},
 blocks:{add:k=>blockAdd(k),remove:blockRemove,merge:blockMerge,clear:blocksClear,set onTap(f){B.onTap=f}},
 line:{hop:lineHop,set onTap(f){L.onTap=f}},
 frac:{toggle:fracToggle,set onTap(f){F.onTap=f}},
 share:{deal:shareDeal,set onTap(f){S.onTap=f}},
 wait
};
window.__t3dReady&&window.__t3dReady();
}
