'use strict';
// Aprende con Lupa · materias extra (Lectura, Català, Science, Français) + mascota virtual.
// ================= utilidades =================
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const TTS_OK=!!(window.speechSynthesis&&window.SpeechSynthesisUtterance);
function speak(text,lang){if(!TTS_OK)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g,'').replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu,''));u.lang=lang;u.rate=.85;
 const v=speechSynthesis.getVoices().find(v=>v.lang.replace('_','-').toLowerCase().startsWith(lang.toLowerCase()))||speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(lang.slice(0,2)));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
function opts(correct,pool,n){const o=[correct];for(const x of shuffle(pool))if(o.length<n&&!o.includes(x))o.push(x);return shuffle(o)}
const MAXS=3;

// ================= LECTURA (es) =================
const PAL=[['🐱','gato','ga-to'],['🐶','perro','pe-rro'],['🏠','casa','ca-sa'],['☀️','sol','sol'],['🌙','luna','lu-na'],['🌸','flor','flor'],['🌳','árbol','ár-bol'],['🐟','pez','pez'],['🚗','coche','co-che'],['🚂','tren','tren'],
 ['🍎','manzana','man-za-na'],['🍌','plátano','plá-ta-no'],['🍓','fresa','fre-sa'],['⚽','pelota','pe-lo-ta'],['📖','libro','li-bro'],['⭐','estrella','es-tre-lla'],['🦋','mariposa','ma-ri-po-sa'],['🐢','tortuga','tor-tu-ga'],
 ['🦆','pato','pa-to'],['🐸','rana','ra-na'],['🍦','helado','he-la-do'],['🎂','tarta','tar-ta'],['👞','zapato','za-pa-to'],['⛵','barco','bar-co'],['🐌','caracol','ca-ra-col'],['🐝','abeja','a-be-ja'],['🐭','ratón','ra-tón'],
 ['🐄','vaca','va-ca'],['🐻','oso','o-so'],['🦁','león','le-ón'],['☁️','nube','nu-be'],['✏️','lápiz','lá-piz'],['🐘','elefante','e-le-fan-te'],['🍅','tomate','to-ma-te'],['🐧','pingüino','pin-güi-no'],['🧦','calcetín','cal-ce-tín']];
const PAL_SIM=[['🐱','gato',['pato','plato']],['🏠','casa',['cosa','caza']],['☀️','sol',['sal','col']],['🌙','luna','lana cuna'.split(' ')],['🐸','rana',['rama','lana']],['🐻','oso',['ojo','ola']],
 ['🚂','tren',['tres','trenza']],['🦆','pato',['palo','gato']],['🐭','ratón',['ratos','botón']],['⛵','barco',['barro','marco']],['🐟','pez',['paz','pie']],['🍓','fresa',['mesa','fresco']]];
const CUENTOS=[
 {t:'Lola y la cometa',p:'🪁👧👴',x:'Lola tiene una cometa roja. El domingo va al parque con su abuelo. Hace mucho viento y la cometa vuela muy alto. ¡Lola está muy contenta!',
  q:[['¿De qué color es la cometa?','roja','azul','verde','amarilla'],['¿Con quién va Lola al parque?','con su abuelo','con su mamá','con su hermano','con su perro'],['¿Cómo está Lola?','contenta','triste','enfadada','cansada'],['¿Qué día va al parque?','el domingo','el lunes','el martes','el viernes']]},
 {t:'El gato Bigotes',p:'🐱🪟🧶',x:'Bigotes es un gato gris. Le gusta dormir al sol en la ventana. Por la noche juega con una pelota de lana. Bigotes bebe leche en un plato azul.',
  q:[['¿De qué color es Bigotes?','gris','negro','blanco','naranja'],['¿Dónde le gusta dormir?','en la ventana','en la cama','en el jardín','en una caja'],['¿Con qué juega por la noche?','con una pelota de lana','con un ratón','con una pluma','con un coche'],['¿De qué color es su plato?','azul','rojo','verde','rosa']]},
 {t:'La semilla de Pablo',p:'🌱🪴🌻',x:'Pablo planta una semilla en una maceta. Cada día le echa un poco de agua. Después de muchos días sale una planta pequeña. ¡Al final crece un girasol amarillo!',
  q:[['¿Dónde planta Pablo la semilla?','en una maceta','en la playa','en una caja','en un vaso'],['¿Qué le echa cada día?','agua','leche','zumo','arena'],['¿Qué flor crece al final?','un girasol','una rosa','un tulipán','una margarita'],['¿De qué color es la flor?','amarilla','roja','azul','morada']]},
 {t:'Un día de playa',p:'🏖️🏰🐚',x:'Nora y Leo van a la playa en verano. Leo hace un castillo de arena. Nora busca conchas en la orilla. A la hora de comer, toman bocadillos bajo la sombrilla.',
  q:[['¿Quién hace un castillo de arena?','Leo','Nora','el abuelo','un perro'],['¿Qué busca Nora?','conchas','piedras','peces','flores'],['¿Dónde comen?','bajo la sombrilla','en casa','en el coche','en el agua'],['¿En qué época del año van?','en verano','en invierno','en otoño','en Navidad']]},
 {t:'El tren de los animales',p:'🚂🐄🐑🦆',x:'Un tren pequeño lleva animales a la granja. En el primer vagón va una vaca. En el segundo van tres ovejas. En el último vagón viaja un pato que no para de cantar.',
  q:[['¿Adónde va el tren?','a la granja','al zoo','a la playa','al colegio'],['¿Cuántas ovejas van en el tren?','tres','dos','cinco','una'],['¿Quién no para de cantar?','el pato','la vaca','una oveja','el tren'],['¿Quién va en el primer vagón?','una vaca','un pato','tres ovejas','un caballo']]},
 {t:'La tortuga Tula',p:'🐢🏞️🐸🍓',x:'Tula es una tortuga muy lenta. Un día quiere ir al río a ver a su amiga la rana. Camina, camina y camina. Cuando llega, la rana le da un abrazo y comen fresas juntas.',
  q:[['¿Cómo es Tula?','muy lenta','muy rápida','muy grande','muy ruidosa'],['¿A quién va a ver?','a la rana','al pato','al conejo','a la abeja'],['¿Adónde va Tula?','al río','al mar','al bosque','a la ciudad'],['¿Qué comen juntas?','fresas','galletas','manzanas','helado']]}];
const LECTURA={t:'Lectura',i:'📚',lang:'es-ES',ui:'es',color:'#ff5fa2',topics:{
 silabas:{t:'Sílabas',i:'👏',d:'contar y completar sílabas',gen(l){const pool=PAL.filter(p=>{const n=p[2].split('-').length;return l===1?n<=2:l===2?n<=3:n>=2});const p=pick(pool),sy=p[2].split('-');
   const k=pick(l===1?['count','first']:['count','missing','first']);
   if(k==='count')return{pic:p[0],word:p[1],prompt:`¿Cuántas sílabas tiene «${p[1]}»?`,ans:String(sy.length),options:['1','2','3','4'],speak:p[1],hint:`Da una palmada por cada trozo: ${sy.join(' · ')}`};
   if(k==='first'||sy.length<2){const others=shuffle(PAL.map(x=>x[2].split('-')[0]).filter(x=>x!==sy[0]));return{pic:p[0],prompt:`¿Con qué sílaba empieza ${p[0]}?`,ans:sy[0],options:opts(sy[0],others,l===1?3:4),speak:p[1],hint:`Di la palabra despacio: ${sy.join('… ')}`}}
   const i=R(1,sy.length-1),shown=sy.map((s,j)=>j===i?'❓':s).join(' - ');const others=shuffle(PAL.flatMap(x=>x[2].split('-')).filter(x=>x!==sy[i]));
   return{pic:p[0],prompt:`¿Qué sílaba falta? ${shown}`,ans:sy[i],options:opts(sy[i],others,4),speak:p[1],hint:`La palabra es «${p[1]}». Dila despacio.`}}},
 palabras:{t:'Palabras y dibujos',i:'🖼️',d:'une la palabra con su dibujo',gen(l){
   if(l===3){const p=pick(PAL_SIM);return{pic:p[0],prompt:'¿Qué palabra es? ¡Lee con cuidado!',ans:p[1],options:shuffle([p[1],...p[2]]),hint:'Fíjate bien en cada letra: se parecen mucho.'}}
   if(l===2&&Math.random()<.4){const ps=shuffle(PAL).slice(0,3);return{type:'match',prompt:'Une cada palabra con su dibujo',pairs:ps.map(p=>[p[1],p[0]]),hint:'Lee una palabra y busca su dibujo.'}}
   const p=pick(PAL);if(l===1){const o=opts(p[1],PAL.filter(x=>x[1][0]!==p[1][0]).map(x=>x[1]),3);return{pic:p[0],prompt:'¿Cómo se llama?',ans:p[1],options:o,speak:p[1],hint:`Empieza por «${p[1][0].toUpperCase()}».`}}
   return{prompt:`¿Dónde está «${p[1]}»?`,ans:p[0],options:opts(p[0],PAL.map(x=>x[0]),4),emojiOpts:true,hint:'Lee la palabra despacio, sílaba a sílaba.'}}},
 cuentos:{t:'Cuentos',i:'📖',d:'lee y responde',gen(l){const c=pick(l===1?CUENTOS.slice(0,3).concat(CUENTOS[5]):CUENTOS),q=pick(c.q);
   return{story:c,prompt:q[0],ans:q[1],options:shuffle(q.slice(1,l===1?4:5)),speak:c.x,hint:'Vuelve a leer el cuento y busca la respuesta. ¡Está escondida en una frase!'}}}},
 lessons:{
 silabas:[['¡Hola! Las palabras se pueden partir en trocitos llamados SÍLABAS.','👏'],['Mira: «ga-to». Dos palmadas: ga… to. ¡Tiene 2 sílabas!','🐱 ga · to'],['«ma-ri-po-sa» tiene 4 sílabas: ma… ri… po… sa.','🦋 ma · ri · po · sa'],['Y «sol» tiene solo 1: ¡sol! Ahora da tú las palmadas.','☀️ sol']],
 palabras:[['Cada dibujo tiene su palabra. ¡Vamos a leerlas!','🖼️'],['Este es un PATO: p-a-t-o.','🦆 pato'],['¡Ojo! «pato» y «gato» se parecen, pero empiezan distinto.','🦆 pato · 🐱 gato'],['Lee cada letra con calma y encontrarás el dibujo. ¡A jugar!','🔍']],
 cuentos:[['Vamos a leer cuentos cortitos. Puedes pulsar 🔊 para escucharlos.','📖'],['Mientras lees, piensa: ¿QUIÉN sale? ¿DÓNDE están? ¿QUÉ pasa?','👧 🏞️ ❓'],['Si no sabes una respuesta, vuelve a leer. ¡Los buenos lectores releen!','🔁📖'],['¡Ahora te toca leer a ti!','🌟']]}};

// ================= CATALÀ =================
const CAT=[['🐱','gat','m','gats','gat'],['🐶','gos','m','gossos','gos'],['🏠','casa','f','cases','ca-sa'],['🍎','poma','f','pomes','po-ma'],['🌙','lluna','f','llunes','llu-na'],['🌳','arbre','m','arbres','ar-bre'],['🌸','flor','f','flors','flor'],
 ['🚗','cotxe','m','cotxes','cot-xe'],['📖','llibre','m','llibres','lli-bre'],['🐟','peix','m','peixos','peix'],['🪑','cadira','f','cadires','ca-di-ra'],['⚽','pilota','f','pilotes','pi-lo-ta'],['🏫','escola','f','escoles','es-co-la'],
 ['🍊','taronja','f','taronges','ta-ron-ja'],['🍓','maduixa','f','maduixes','ma-dui-xa'],['🐄','vaca','f','vaques','va-ca'],['🐴','cavall','m','cavalls','ca-vall'],['🐦','ocell','m','ocells','o-cell'],['🧀','formatge','m','formatges','for-mat-ge'],
 ['⭐','estrella','f','estrelles','es-tre-lla'],['⛰️','muntanya','f','muntanyes','mun-ta-nya'],['🐸','granota','f','granotes','gra-no-ta'],['🐰','conill','m','conills','co-nill'],['🦋','papallona','f','papallones','pa-pa-llo-na'],
 ['👞','sabata','f','sabates','sa-ba-ta'],['🎂','pastís','m','pastissos','pas-tís'],['🍦','gelat','m','gelats','ge-lat'],['🍅','tomàquet','m','tomàquets','to-mà-quet'],['🐭','ratolí','m','ratolins','ra-to-lí'],['🥚','ou','m','ous','ou']];
const vowel=w=>/^[aeiouàèéíòóú]/i.test(w);
const ORTO=[['muntanya','muntaña','montanya'],['lluna','yuna','luna'],['cavall','caball','cavaill'],['ocell','osell','ocel'],['plaça','plasa','placa'],['cotxe','coche','cotche'],['maduixa','maduicha','madúxa'],
 ['rellotge','rellotje','reloje'],['gelat','jelat','helat'],['llibre','yibre','libre'],['formatge','formaje','formatje'],['taronja','taronxa','tarongja'],['escola','eskola','escuela'],['pastís','pastis','pasttís'],['peix','peis','pex']];
const FRASES=[{x:'En Pau té un gos petit que es diu Rex.',p:'👦🐶',q:[['Com es diu el gos?','Rex','Pau','Max','Bob'],['Com és el gos?','petit','gran','vermell','trist']]},
 {x:'La Marta menja una poma vermella.',p:'👧🍎',q:[['Què menja la Marta?','una poma','un plàtan','una pera','un gelat'],['De quin color és la poma?','vermella','groga','blava','verda']]},
 {x:'Avui plou i en Joan porta un paraigua blau.',p:'🌧️☂️',q:[['Quin temps fa avui?','plou','fa sol','neva','fa vent'],['De quin color és el paraigua?','blau','vermell','verd','negre']]},
 {x:"Els nens juguen a pilota al pati de l'escola.",p:'🧒⚽🏫',q:[['On juguen els nens?','al pati','a la platja','a casa','al bosc'],['A què juguen?','a pilota','a amagar','a cartes','a saltar']]},
 {x:'La gata dorm sobre el sofà.',p:'🐱🛋️',q:[['Qui dorm?','la gata','el gos','l\'ocell','el nen'],['On dorm la gata?','sobre el sofà','al llit','a la cuina','al jardí']]},
 {x:'Dissabte la Laia va a la muntanya amb la seva àvia.',p:'👧👵⛰️',q:[['Amb qui va la Laia?','amb la seva àvia','amb el seu pare','amb el seu gos','amb la seva germana'],['On va la Laia?','a la muntanya','a la platja','a l\'escola','al mercat'],['Quin dia hi va?','dissabte','dilluns','dimecres','divendres']]},
 {x:"L'ocell canta dalt de l'arbre.",p:'🐦🌳',q:[["On canta l'ocell?","dalt de l'arbre",'a terra','dins de casa','a l\'aigua'],['Què fa l\'ocell?','canta','dorm','menja','neda']]}];
function artOf(w,pl){if(pl)return w[2]==='m'?'els':'les';if(vowel(w[1]))return "l'";return w[2]==='m'?'el':'la'}
const CATALA={t:'Llengua catalana',i:'🐉',lang:'ca-ES',ui:'ca',color:'#ffc400',topics:{
 vocabulari:{t:'Vocabulari',i:'🖼️',d:'paraules amb dibuixos',gen(l){const p=pick(CAT);
   if(l>=2&&Math.random()<.35){const ps=shuffle(CAT).slice(0,3);return{type:'match',prompt:'Uneix cada paraula amb el seu dibuix',pairs:ps.map(p=>[p[1],p[0]]),hint:'Llegeix la paraula i busca el dibuix.'}}
   if(l===2)return{prompt:`On és «${p[1]}»?`,ans:p[0],options:opts(p[0],CAT.map(x=>x[0]),4),emojiOpts:true,speak:p[1],hint:'Llegeix la paraula a poc a poc.'};
   return{pic:p[0],prompt:'Com es diu en català?',ans:p[1],options:opts(p[1],CAT.map(x=>x[1]),l===1?3:4),speak:p[1],hint:`Comença per «${p[1][0].toUpperCase()}».`}}},
 articles:{t:'Articles',i:'🔤',d:'el, la, els, les, l\'',gen(l){const pl=l===2?true:l===1?false:Math.random()<.5;const pool=CAT.filter(w=>l===3||pl||!vowel(w[1]));const w=pick(pool);const ans=artOf(w,pl),word=pl?w[3]:w[1];
   const o=l===1?['el','la']:l===2?['els','les']:['el','la',"l'",'els','les'];
   return{pic:pl?w[0]+w[0]:w[0],prompt:`❓ ${word}`,ans,options:o,speak:(ans==="l'"?"l'":ans+' ')+word,hint:pl?'Si són moltes coses: ELS (masculí) o LES (femení).':(vowel(w[1])?"Davant de vocal fem servir L' (l'arbre, l'ocell).":'Pensa: és «un» o «una»? Un → EL, una → LA.')}}},
 sillabes:{t:'Síl·labes',i:'👏',d:'compta les síl·labes',gen(l){const pool=CAT.filter(w=>{const n=w[4].split('-').length;return l===1?n<=2:l===2?n<=3:n>=2});const w=pick(pool),sy=w[4].split('-');
   return{pic:w[0],prompt:`Quantes síl·labes té «${w[1]}»?`,ans:String(sy.length),options:['1','2','3','4'],speak:w[1],hint:`Pica de mans: ${sy.join(' · ')}`}}},
 frases:{t:'Frases',i:'💬',d:'llegeix i respon',gen(l){const f=pick(FRASES),q=pick(f.q);return{story:{t:'',p:f.p,x:f.x},prompt:q[0],ans:q[1],options:shuffle(q.slice(1,l===1?4:5)),speak:f.x,hint:'Torna a llegir la frase a poc a poc.'}}},
 ortografia:{t:'Ortografia',i:'✍️',d:'tria la paraula ben escrita',gen(l){const o=pick(ORTO);const e=(CAT.find(c=>c[1]===o[0])||[''])[0];
   return{pic:e||'✍️',prompt:'Quina està ben escrita?',ans:o[0],options:shuffle(o.slice(0,l===1?2:3)),speak:o[0],hint:'En català escrivim NY (muntanya), LL (lluna), TX (cotxe) i TG/TJ (rellotge, taronja).'}}}},
 lessons:{
 vocabulari:[['Hola! Avui aprendrem paraules en català.','🐉'],['Això és un GAT. I això és un GOS.','🐱 gat · 🐶 gos'],['Aquesta és una POMA i aquesta una MADUIXA.','🍎 poma · 🍓 maduixa'],['Escolta amb 🔊 i repeteix. Som-hi!','🔊']],
 articles:[['Davant de les paraules posem un article.','🔤'],['Si diem UN: EL gat, EL cotxe. Si diem UNA: LA casa, LA poma.','el 🐱 · la 🏠'],["Davant de vocal: L'arbre, L'ocell, L'escola.","l'🌳 · l'🐦"],['Si en són molts: ELS gats, LES cases.','els 🐱🐱 · les 🏠🏠']],
 sillabes:[['Les paraules es parteixen en síl·labes.','👏'],['«ca-sa»: dues palmades. Té 2 síl·labes.','🏠 ca · sa'],['«pa-pa-llo-na» en té 4!','🦋 pa · pa · llo · na'],['Ara pica de mans tu!','👏👏']],
 frases:[['Llegirem frases curtes i respondrem preguntes.','💬'],['Pensa: QUI? ON? QUÈ fa?','👧 🏫 ❓'],['Si dubtes, torna a llegir. Som-hi!','🔁']],
 ortografia:[['En català hi ha lletres especials.','✍️'],['NY com a muntanya, LL com a lluna.','⛰️ muntanya · 🌙 lluna'],['TX com a cotxe, TG com a rellotge.','🚗 cotxe · ⏰ rellotge'],['Ara tria la paraula ben escrita!','✅']]}};

// ================= SCIENCE (en) =================
const BONES={skull:['skull','Your skull protects your brain.','🧠','your head'],jaw:['jaw (mandible)','Your jaw helps you chew and talk. It is the only skull bone that moves.','😮','your mouth'],
 spine:['spine (backbone)','Your spine holds you up and protects your spinal cord. It is made of small bones called vertebrae.','🧍','your back'],
 ribs:['ribs','Your ribs make a cage that protects your heart and lungs. Most people have 12 pairs.','❤️','your chest'],
 sternum:['breastbone (sternum)','Your ribs join the breastbone at the front of your chest.','👕','the middle of your chest'],
 clavicle:['collarbone (clavicle)','Your collarbone connects your arm to your body.','🧥','below your neck'],
 scapula:['shoulder blade (scapula)','Your shoulder blade helps your arm move in all directions.','🤷','the top of your back'],
 humerus:['humerus','The humerus is the bone in your upper arm.','💪','your upper arm'],
 forearm:['radius and ulna','Two bones, the radius and the ulna, are in your forearm.','🤚','your forearm'],
 hand:['hand bones','Each hand has 27 bones, so you can write and grab things.','✋','your hand'],
 pelvis:['pelvis (hip bones)','Your pelvis holds up your body and helps protect the organs low in your tummy.','🩳','your hips'],
 femur:['femur','The femur is your thigh bone. It is the longest and strongest bone in your body.','🦵','your thigh'],
 patella:['kneecap (patella)','Your kneecap protects your knee joint.','🦿','the front of your knee'],
 tibia:['tibia (shinbone)','The tibia is your shinbone, at the front of your lower leg.','🦵','your shin'],
 fibula:['fibula','The fibula is a thin bone next to the tibia.','🦶','the side of your lower leg'],
 foot:['foot bones','Each foot has 26 bones to help you stand, walk and run.','🦶','your foot']};
const EASY_B=['skull','ribs','spine','femur','pelvis','hand','foot','jaw'];
const PROTECT=[['What does your skull protect?','your brain','your lungs','your stomach','your feet'],['What do your ribs protect?','your heart and lungs','your brain','your eyes','your knees'],
 ['What does your spine protect?','your spinal cord','your heart','your teeth','your ears'],['Which bone helps you chew?','the jaw','the femur','the kneecap','the ribs'],
 ['What does your kneecap protect?','your knee joint','your elbow','your brain','your heart'],['What are the three big jobs of the skeleton?','support, protect and move','eat, sleep and play','see, hear and smell','run, jump and swim'],
 ['What do muscles pull on to move your body?','bones','hair','skin','teeth'],['The spine is made of small bones called…','vertebrae','ribs','teeth','joints'],
 ['A place where two bones meet is called a…','joint','muscle','vein','nail'],['Which bones help you walk?','leg and foot bones','ribs','skull','collarbone']];
const FACTS=[['How many bones does an adult have?','206','106','26','500'],['Which is the longest bone in your body?','the femur','the humerus','the tibia','the spine'],
 ['Where is the smallest bone in your body?','in your ear','in your toe','in your nose','in your finger'],['Babies are born with more bones than adults. True or false?','True','False'],
 ['Bones are alive and they grow. True or false?','True','False'],['More than half of your bones are in your hands and feet. True or false?','True','False'],
 ['How many pairs of ribs do most people have?','12','6','20','2'],['Which food helps make strong bones?','milk and cheese','sweets','crisps','fizzy drinks'],
 ['Soft bone marrow inside some bones makes…','blood cells','hair','tears','teeth'],['How many bones are in each hand?','27','5','10','100']];
const SCIENCE={t:'Science',i:'🔬',lang:'en-GB',ui:'en',color:'#20c45a',topics:{
 bones:{t:'Name the bone',i:'🦴',d:'the human skeleton',skel:true,gen(l){const keys=Object.keys(BONES);const k=pick(l===1?EASY_B:keys),b=BONES[k];
   if(l===3&&window.T3D)return{type:'tap',bone:k,prompt:`Tap the ${b[0].split(' (')[0]}!`,ans:k,speak:`Tap the ${b[0]}`,hint:`It is in ${b[3]}.`};
   const pool=(l===1?EASY_B:keys).map(x=>BONES[x][0]);
   return{bone:k,pic:window.T3D?null:b[2],prompt:window.T3D?'Which bone is glowing pink?':`Which bone is in ${b[3]}?`,ans:b[0],options:opts(b[0],pool,l===1?3:4),speak:null,hint:`Look where it is: ${b[3]}.`}}},
 jobs:{t:'What does it do?',i:'🛡️',d:'protect, support, move',gen(l){const q=pick(l===1?PROTECT.slice(0,5):PROTECT);return{pic:'🦴',prompt:q[0],ans:q[1],options:shuffle(q.slice(1,l===1?4:5)),speak:q[0],hint:'Think about what is near that bone.'}}},
 facts:{t:'Bone facts',i:'💡',d:'206 bones and more',gen(l){const q=pick(FACTS);return{pic:'💡',prompt:q[0],ans:q[1],options:shuffle(q.slice(1,l===1?Math.min(4,q.length):5)),speak:q[0],hint:'Remember the lesson: adults have 206 bones, and the femur is the longest.'}}}},
 lessons:{
 bones:[['Hello! Today we will explore your SKELETON. It is made of bones.',null],['This is your SKULL. It protects your brain.','skull'],['These are your RIBS. They protect your heart and lungs.','ribs'],['Your SPINE, or backbone, holds you up.','spine'],['The HUMERUS is in your upper arm.','humerus'],['Your PELVIS is your hip bones.','pelvis'],['The FEMUR is your thigh bone, the longest bone of all!','femur'],['Now tap any bone to hear its name. Then let\'s play!',null]],
 jobs:[['Your skeleton has three big jobs.',null],['1. SUPPORT: it holds your body up, like a frame.','spine'],['2. PROTECT: the skull protects your brain, the ribs protect your heart and lungs.','ribs'],['3. MOVE: muscles pull on your bones so you can run and jump!','femur']],
 facts:[['Amazing bone facts!',null],['An adult has 206 bones. Babies have about 300, and some join together as they grow.','skull'],['The longest bone is the femur. The smallest bone is inside your ear!','femur'],['More than half of your bones are in your hands and feet.','hand'],['Milk, cheese and running around help keep your bones strong!',null]]}};

// ================= FRANÇAIS =================
const FR={salut:[['👋','bonjour','hola / buenos días'],['🙋','salut','¡hola! (entre amigos)'],['👋','au revoir','adiós'],['🙏','merci','gracias'],['🤲','s\'il te plaît','por favor'],['✅','oui','sí'],['❌','non','no'],['🙂','ça va ?','¿qué tal?'],['😴','bonne nuit','buenas noches'],['📛','je m\'appelle…','me llamo…']],
 nombres:['un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf','vingt'].map((w,i)=>[String(i+1),w,String(i+1)]),
 couleurs:[['🔴','rouge','rojo'],['🔵','bleu','azul'],['🟢','vert','verde'],['🟡','jaune','amarillo'],['🟠','orange','naranja'],['🟣','violet','morado'],['⚫','noir','negro'],['⚪','blanc','blanco'],['🟤','marron','marrón'],['🩷','rose','rosa']],
 animaux:[['🐱','le chat','el gato'],['🐶','le chien','el perro'],['🐟','le poisson','el pez'],['🐦','l\'oiseau','el pájaro'],['🐰','le lapin','el conejo'],['🐴','le cheval','el caballo'],['🐄','la vache','la vaca'],['🐷','le cochon','el cerdo'],
  ['🐭','la souris','el ratón'],['🦁','le lion','el león'],['🐘','l\'éléphant','el elefante'],['🐸','la grenouille','la rana'],['🦆','le canard','el pato'],['🐑','le mouton','la oveja'],['🐻','l\'ours','el oso']],
 famille:[['👩','la mère (maman)','la madre (mamá)'],['👨','le père (papa)','el padre (papá)'],['👦','le frère','el hermano'],['👧','la sœur','la hermana'],['👴','le grand-père','el abuelo'],['👵','la grand-mère','la abuela'],['👶','le bébé','el bebé'],['👨‍👩‍👧‍👦','la famille','la familia']]};
function frGen(key,l){let L=FR[key];if(key==='nombres'&&l===1)L=L.slice(0,10);const w=pick(L);const kind=l===1?pick(['mean','pic']):l===2?pick(['pic','listen','match']):pick(['listen','listen','match','pic']);
 if(kind==='match'){const ps=shuffle(L).slice(0,3);return{type:'match',prompt:'Une cada palabra francesa con su dibujo',pairs:ps.map(p=>[p[1],p[0]]),hint:'Pulsa una palabra y luego su dibujo.'}}
 if(kind==='mean')return{pic:w[0],prompt:`¿Qué significa «${w[1]}»?`,ans:w[2],options:opts(w[2],L.map(x=>x[2]),3),speak:w[1],hint:`Mira el dibujo: ${w[0]}`};
 if(kind==='listen')return{listen:w[1],prompt:TTS_OK?'🔊 Escucha y elige el dibujo':`Lee «${w[1]}» y elige el dibujo`,ans:w[0],options:opts(w[0],L.map(x=>x[0]),4),emojiOpts:true,speak:w[1],hint:`Es «${w[1]}»: ${w[2]}.`};
 return{pic:w[0],prompt:'¿Cómo se dice en francés?',ans:w[1],options:opts(w[1],L.map(x=>x[1]),l===1?3:4),speak:w[1],hint:`En español es «${w[2]}».`}}
const FRANCES={t:'Français',i:'🥐',lang:'fr-FR',ui:'es',color:'#4a7cff',topics:{
 salut:{t:'Saludos',i:'👋',d:'bonjour, merci…',gen:l=>frGen('salut',l)},nombres:{t:'Números 1-20',i:'🔢',d:'un, deux, trois…',gen:l=>frGen('nombres',l)},
 couleurs:{t:'Colores',i:'🎨',d:'rouge, bleu, vert…',gen:l=>frGen('couleurs',l)},animaux:{t:'Animales',i:'🐾',d:'le chat, le chien…',gen:l=>frGen('animaux',l)},famille:{t:'Familia',i:'👨‍👩‍👧',d:'maman, papa…',gen:l=>frGen('famille',l)}},
 lessons:{salut:[['Bonjour! Vamos a aprender a saludar en francés.','👋 bonjour'],['Para despedirte: «au revoir».','👋 au revoir'],['«merci» es gracias y «s\'il te plaît» es por favor.','🙏 merci'],['Pulsa 🔊 y repite. On y va!','🔊']],
  nombres:[['Contamos en francés: un, deux, trois…','1 2 3'],['quatre, cinq, six, sept…','4 5 6 7'],['huit, neuf, dix!','8 9 10'],['Y hasta vingt (20). ¡A practicar!','20']],
  couleurs:[['Les couleurs! Los colores.','🎨'],['rouge 🔴, bleu 🔵, vert 🟢','🔴 🔵 🟢'],['jaune 🟡, noir ⚫, blanc ⚪','🟡 ⚫ ⚪'],['¡Ahora tú!','🌈']],
  animaux:[['Les animaux! Los animales.','🐾'],['le chat 🐱, le chien 🐶','🐱 🐶'],['la vache 🐄, le cochon 🐷','🐄 🐷'],['¡Escucha y elige!','🔊']],
  famille:[['La famille! La familia.','👨‍👩‍👧‍👦'],['maman 👩 y papa 👨','👩 👨'],['le frère 👦 y la sœur 👧','👦 👧'],['grand-père 👴 y grand-mère 👵. ¡A jugar!','👴 👵']]}};

// ================= ENGLISH =================
const HOB=[['🛹','skateboarding','go skateboarding'],['🏓','playing table tennis','play table tennis'],['⛵','sailing','go sailing'],['⛸️','ice skating','go ice skating'],['🏄','surfing','go surfing'],
 ['🚴','cycling','go cycling'],['🪢','skipping',null],['♟️','playing chess','play chess'],['🥋','doing judo','do judo'],['🏀','playing basketball','play basketball']];
const HOB_BAD={skateboarding:['skatebording','skateboardin'],'playing table tennis':['playing tabel tennis','playing table tenis'],sailing:['saling','sailling'],'ice skating':['ice skateing','ice skatting'],
 surfing:['surffing','serfing'],cycling:['cyclying','cycleing'],skipping:['skiping','skipeing'],'playing chess':['playing ches','playing chees'],'doing judo':['doing yudo','doing judoo'],'playing basketball':['playing basketbal','playing baskettball']};
const ING=[['swim','swimming','double'],['skate','skating','e'],['ride','riding','e'],['skip','skipping','double'],['run','running','double'],['dance','dancing','e'],['read','reading','add'],['play','playing','add'],
 ['sail','sailing','add'],['surf','surfing','add'],['cycle','cycling','e'],['sit','sitting','double'],['write','writing','e'],['jump','jumping','add'],['cook','cooking','add'],['shop','shopping','double'],['make','making','e'],['draw','drawing','add'],['sing','singing','add'],['get','getting','double']];
const wrongIng=([b,c,r])=>r==='double'?[b+'ing',b+'eing']:r==='e'?[b+'ing',b.slice(0,-1)+b.slice(-2,-1)+'ing']:[b+b.slice(-1)+'ing',b+'eing'];
const GAPS=[['She doesn\'t like ___.','skate','skating'],['I like ___ in the sea.','swim','swimming'],['He is ___ a bike right now.','ride','riding'],['They are ___ in the playground.','skip','skipping'],
 ['I am ___ a book.','read','reading'],['We love ___ to music.','dance','dancing'],['My dad is ___ dinner.','cook','cooking'],['Do you like ___?','draw','drawing'],['Tom is ___ a letter.','write','writing'],['Look! The dog is ___.','run','running'],
 ['My sister likes ___ songs.','sing','singing'],['I don\'t like ___ chess.','play','playing']];
const ORDER=['I like skateboarding .','She doesn\'t like swimming .','He is riding a bike .','Do you like dancing ?','We are playing chess .','I don\'t go sailing .','Do you go cycling ?','My brother does judo .','They play basketball .','I am skipping now .'];
const ENGLISH={t:'English',i:'🇬🇧',lang:'en-GB',ui:'en',color:'#e0245e',topics:{
 ing:{t:'Grammar: -ing',i:'✍️',d:'I like skating · He is riding',gen(l){const k=pick(l===1?['spell','gap']:l===2?['spell','gap','order']:['gap','order','order','spell']);
   if(k==='spell'){const v=pick(ING);return{pic:'✍️',prompt:`${v[0]} + ing = ?`,ans:v[1],options:shuffle([v[1],...wrongIng(v)]).slice(0,3).concat([]).filter((x,i,a)=>a.indexOf(x)===i),speak:v[1],hint:v[2]==='e'?`Words ending in -e: drop the e, then add -ing (${v[0]} → ${v[1]}).`:v[2]==='double'?`Short word ending vowel + consonant: double the last letter (${v[0]} → ${v[1]}).`:`Just add -ing (${v[0]} → ${v[1]}).`}}
   if(k==='gap'){const g=pick(GAPS);const o=[g[2],g[1],g[1]+'s'];if(l>1)o.push(wrongIng(ING.find(x=>x[0]===g[1]))[0]);return{pic:null,prompt:g[0].replace('___','______'),ans:g[2],options:shuffle([...new Set(o)]),speak:g[0].replace('___',g[2]),hint:'After like / love / don\'t like, and after am / is / are, we use the -ing form.'}}
   const sent=pick(ORDER);return{type:'order',prompt:'Build the sentence!',words:sent.split(' '),ans:sent,speak:sent.replace(/ ([.?])/,'$1'),hint:`It starts with «${sent.split(' ')[0]}».`}}},
 hobbies:{t:'Vocabulary: Hobbies',i:'🛹',d:'surfing, judo, chess…',gen(l){const h=pick(HOB);const k=pick(l===1?['pic','pic','listen']:l===2?['listen','match','spell','pic']:['spell','listen','match']);
   if(k==='match'){const ps=shuffle(HOB).slice(0,l===3?4:3);return{type:'match',prompt:'Match the hobby with its picture',pairs:ps.map(p=>[p[1],p[0]]),hint:'Read each word and find its picture.'}}
   if(k==='listen')return{listen:h[1],prompt:TTS_OK?'🔊 Listen and choose the picture':`Read «${h[1]}» and choose the picture`,ans:h[0],options:opts(h[0],HOB.map(x=>x[0]),4),emojiOpts:true,speak:h[1],hint:`It is «${h[1]}».`};
   if(k==='spell')return{pic:h[0],prompt:'Which spelling is correct?',ans:h[1],options:shuffle([h[1],...HOB_BAD[h[1]]]),speak:h[1],hint:'Say it slowly and check every letter.'};
   return{pic:h[0],prompt:'What hobby is it?',ans:h[1],options:opts(h[1],HOB.map(x=>x[1]),l===1?3:4),speak:h[1],hint:'Look at the picture carefully.'}}},
 godo:{t:'go · play · do',i:'🗣️',d:'I go surfing · I don\'t go sailing',gen(l){const H=HOB.filter(x=>x[2]);const h=pick(H),verb=h[2].split(' ')[0],rest=h[2].split(' ').slice(1).join(' ');
   const k=pick(l===1?['verb','verb','neg']:l===2?['verb','neg','q']:['neg','q','q3','verb']);
   const rule='We GO + -ing sports (go surfing), PLAY games and ball sports (play chess), and DO judo and martial arts.';
   if(k==='verb')return{pic:h[0],prompt:`I ___ ${rest}.`,ans:verb,options:['go','play','do'],speak:`I ${h[2]}.`,hint:rule};
   if(k==='neg'){const he=l>1&&Math.random()<.5;const subj=he?pick(['She','He']):'I';const ans=he?(verb==='do'?'doesn\'t do':`doesn't ${verb}`):`don't ${verb}`;
    const o=he?[ans,`don't ${verb}`,`doesn't ${verb}s`]:[ans,`doesn't ${verb}`,`not ${verb}`];
    return{pic:'❌'+h[0],prompt:`${subj} ___ ${rest}.`,ans,options:shuffle(o),speak:`${subj} ${ans} ${rest}.`,hint:he?'With he / she we say DOESN\'T + verb.':'With I / you / we / they we say DON\'T + verb.'}}
   const yes=Math.random()<.5;
   if(k==='q'){const ans=yes?'Yes, I do.':'No, I don\'t.';return{pic:(yes?'✅':'❌')+h[0],prompt:`Do you ${h[2]}?`,ans,options:shuffle(['Yes, I do.','No, I don\'t.',yes?'Yes, I go.':'No, I not.']),speak:`Do you ${h[2]}? ${ans}`,hint:'Short answers: Yes, I do. / No, I don\'t.'}}
   const he=pick(['he','she']);const ans=yes?`Yes, ${he} does.`:`No, ${he} doesn't.`;
   return{pic:(yes?'✅':'❌')+h[0],prompt:`Does ${he} ${h[2]}?`,ans,options:shuffle([ans,yes?`Yes, ${he} do.`:`No, ${he} don't.`,yes?`No, ${he} doesn't.`:`Yes, ${he} does.`]),speak:`Does ${he} ${h[2]}?`,hint:'With he / she: Yes, he does. / No, she doesn\'t.'}}}},
 lessons:{
 ing:[['Hello! Today: the -ING form.','✍️'],['After LIKE we use -ing: I like skateboarding. She doesn\'t like swimming.','🛹 👍 · 🏊 👎'],['Now: I am riding a bike. He is reading. They are skipping.','🚴 📖 🪢'],
  ['Spelling 1: most verbs just add -ing: play → playing, read → reading.','play → playing'],['Spelling 2: verbs ending in -e lose the e: skate → skating, ride → riding.','skate → skating'],
  ['Spelling 3: short verbs like swim, skip, run double the last letter: swimming, skipping, running.','swim → swimming'],['Let\'s practise!','🌟']],
 hobbies:[['What do you like doing? Let\'s learn hobbies!','🛹 🏄 ⛵'],['skateboarding, surfing, sailing, ice skating','🛹 🏄 ⛵ ⛸️'],['cycling, skipping, doing judo','🚴 🪢 🥋'],['playing table tennis, playing chess, playing basketball','🏓 ♟️ 🏀'],['Tap 🔊 to listen and repeat!','🔊']],
 godo:[['Which verb do we use: GO, PLAY or DO?','🗣️'],['GO + -ing: I go surfing, I go sailing, I go cycling.','🏄 ⛵ 🚴'],['PLAY + games and ball sports: I play chess, I play basketball.','♟️ 🏀'],['DO + judo: I do judo.','🥋'],
  ['Negative: I don\'t go sailing. She doesn\'t go surfing.','❌⛵'],['Questions: Do you go cycling? Yes, I do. / No, I don\'t.','🚴 ❓ ✅ ❌'],['Your turn!','🌟']]}};
const SUBJ={mates:{t:'Mates',i:'🔢',color:'#ff8a00'},lectura:LECTURA,catala:CATALA,science:SCIENCE,english:ENGLISH,frances:FRANCES};
const UI={es:{praise:['¡Genial!','¡Muy bien!','¡Eres un crack!','¡Perfecto!','¡Así se hace!'],enc:['Casi, ¡inténtalo otra vez!','No pasa nada, equivocarse es aprender.'],up:'¡Subes al nivel',back:'⬅ Temas',hint:'💡 Pista',listen:'🔊 Escuchar',lesson:'🎓 Ver lección',next:'Siguiente ▶',go:'¡Ahora yo! ✏️',start:'¡Vamos allá! Si te atascas, pídeme una pista.',was:'La respuesta era'},
 ca:{praise:['Molt bé!','Genial!','Fantàstic!','Perfecte!','Ets un crac!'],enc:['Gairebé! Torna-ho a provar.','No passa res, equivocar-se és aprendre.'],up:'Puges al nivell',back:'⬅ Temes',hint:'💡 Pista',listen:'🔊 Escolta',lesson:'🎓 Lliçó',next:'Següent ▶',go:'Ara jo! ✏️',start:'Som-hi! Si et costa, demana una pista.',was:'La resposta era'},
 en:{praise:['Great job!','Well done!','Brilliant!','Perfect!','Super!'],enc:['Almost! Try again.','That\'s OK, mistakes help us learn.'],up:'Level up! Level',back:'⬅ Topics',hint:'💡 Hint',listen:'🔊 Listen',lesson:'🎓 Lesson',next:'Next ▶',go:'My turn! ✏️',start:'Let\'s go! Ask me for a hint if you need one.',was:'The answer was'}};

// ================= mascota virtual =================
const PETS={buho:{n:'Búho',e:'🦉',def:'Lupa'},capibara:{n:'Capibara',e:'🦫',def:'Capi'},gato:{n:'Gato',e:'🐱',def:'Michi'},bulldog:{n:'Bulldog francés',e:'🐶',def:'Bolo'},pinguino:{n:'Pingüino',e:'🐧',def:'Pingu'},hamster:{n:'Hámster',e:'🐹',def:'Bolita'}};
const UNLOCKS=[[2,'hat','gorro','🎉 Gorro de fiesta'],[3,'glasses','rosa','👓 Gafas rosas'],[4,'scarf','roja','🧣 Bufanda roja'],[5,'color','rosa','🎨 Color rosa'],[6,'glasses','sol','🕶️ Gafas de sol'],[7,'color','azul','🎨 Color azul'],
 [8,'hat','chistera','🎩 Chistera'],[9,'scarf','azul','🧣 Bufanda azul'],[10,'color','oro','🎨 Color dorado'],[12,'hat','corona','👑 Corona'],[14,'color','verde','🎨 Color verde'],[16,'color','lila','🎨 Color lila']];
const GOAL=10;
const xpNeed=l=>40+l*20;
const today=()=>new Date().toDateString();
function petDay(){const p=st&&st.pet;if(!p)return;if(p.day!==today()){const days=p.day?Math.round((new Date(today())-new Date(p.day))/864e5):0;p.mood=Math.max(50,p.mood-days*10);p.energy=Math.max(50,p.energy-days*10);p.day=today();p.done=0;p.snacks=p.snacks||0}}
window.petEmoji=()=>kid&&st&&st.pet?PETS[st.pet.sp].e:'🦉';
const petName=()=>kid&&st&&st.pet?esc(st.pet.name):'Lupa';
function applyPet(){if(!D3())return;D3().pet(kid&&st&&st.pet?{sp:st.pet.sp,acc:st.pet.acc}:{sp:'buho'})}
function petReward(stars){if(!st.pet)return;petDay();const p=st.pet;p.done++;p.total=(p.total||0)+1;p.mood=Math.min(100,p.mood+4);p.energy=Math.min(100,p.energy+3);p.snacks=(p.snacks||0)+(p.done%2?1:0);p.xp+=stars*5;
 let up=false;while(p.xp>=xpNeed(p.lvl)){p.xp-=xpNeed(p.lvl);p.lvl++;up=true;UNLOCKS.filter(u=>u[0]===p.lvl).forEach(u=>p.unlocked.push(u[3]))}
 if(p.done===GOAL)setTimeout(()=>{window.UIBurst&&UIBurst('🎯');sfx('levelup')},1600);
 if(up)setTimeout(()=>{D3()&&D3().owl('levelup');sfx('levelup');window.UIBurst&&UIBurst('🆙');const u=UNLOCKS.find(u=>u[0]===p.lvl);toast(`🎉 ¡${esc(p.name)} sube al nivel ${p.lvl}!${u?' Nuevo: '+u[3]:''}`)},1400);save()}
window.petReward=petReward;
function toast(m){let t=document.getElementById('toast');if(t)t.remove();t=document.createElement('div');t.id='toast';t.innerHTML=m;document.body.appendChild(t);setTimeout(()=>t.remove(),4200)}
function bars(p){const pc=Math.round(p.xp*100/xpNeed(p.lvl));return`<div class="petstats"><div class="lv">Nivel ${p.lvl}</div>
 <div class="pbar xp"><i style="width:${pc}%"></i><span>✨ XP ${p.xp}/${xpNeed(p.lvl)}</span></div>
 <div class="pbar mood"><i style="width:${p.mood}%"></i><span>😊 Ánimo</span></div><div class="pbar en"><i style="width:${p.energy}%"></i><span>⚡ Energía</span></div>
 <div class="pbar goal"><i style="width:${Math.min(100,p.done*100/GOAL)}%"></i><span>🎯 Hoy ${Math.min(p.done,GOAL)}/${GOAL} ejercicios</span></div></div>`}

function petPicker(change){view=()=>petPicker(change);header();const cur=st.pet;
 app.innerHTML=`<div class="tutor">${owlBox()}<div class="bubble">${kid.name}, ¡elige tu mascota! Crecerá cuando aprendas y te acompañará en las lecciones.</div></div>
 <div class="grid petgrid">${Object.entries(PETS).map(([k,v])=>`<button class="card kid petc${cur&&cur.sp===k?' sel':''}" data-p="${k}"><div class="av">${v.e}</div>${v.n}</button>`).join('')}</div>
 <div class="row"><input id="pname" class="pname" maxlength="14" placeholder="Nombre" value="${cur?esc(cur.name):''}"><button class="ok" id="pgo">¡Listo! ✔</button></div><div id="slot"></div>`;
 let sel=cur?cur.sp:null;
 app.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{sel=b.dataset.p;app.querySelectorAll('.petc').forEach(x=>x.classList.toggle('sel',x===b));const n=$('#pname');if(!n.dataset.typed)n.value=PETS[sel].def;sfx('pop');if(D3()){D3().pet({sp:sel});D3().owl('happy')}});
 $('#pname').oninput=e=>e.target.dataset.typed=1;
 $('#pgo').onclick=()=>{if(!sel)return toast('Toca una mascota primero 🙂');const name=($('#pname').value.trim()||PETS[sel].def).slice(0,14);
  if(cur){cur.sp=sel;cur.name=name}else st.pet={sp:sel,name,lvl:1,xp:0,mood:80,energy:80,done:0,day:today(),snacks:2,acc:{},unlocked:[],total:0};save();applyPet();kidHome()};
 if(D3()){D3().pet({sp:sel||'buho'});stage('#slot',260,'owl')}}

function kidHome(){if(!st.pet)return petPicker();petDay();save();view=kidHome;header();const p=st.pet;
 const subs=Object.keys(SUBJ),mine=kid.subs,others=subs.filter(s=>!mine.includes(s));
 const card=s=>`<button class="topic subj" data-s="${s}" style="--sc:${SUBJ[s].color}"><span class="si">${SUBJ[s].i}</span>${SUBJ[s].t}</button>`;
 app.innerHTML=`<div class="pethero"><div id="slot" class="petslot">${D3()?'':`<div class="pet2d">${PETS[p.sp].e}</div>`}</div><div class="petside"><h2>${PETS[p.sp].e} ${esc(p.name)}</h2>${bars(p)}
 <div class="cta">🌱 ¡Juega para que crezca!</div><div class="row"><button class="hint" id="room">🏠 Su casita</button></div></div></div>
 <h3 class="sh">⭐ Tus materias</h3><div class="grid sgrid">${mine.map(card).join('')}</div><h3 class="sh">✨ Más materias</h3><div class="grid sgrid">${others.map(card).join('')}</div>`;
 app.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sfx('pop');b.dataset.s==='mates'?menu():subjMenu(b.dataset.s)});$('#room').onclick=petRoom;
 applyPet();stage('#slot',320,'room');if(D3())D3().owl(p.mood>60?'happy':'talk')}

function petRoom(){view=petRoom;header();petDay();const p=st.pet;
 const opt=(slot,vals)=>`<div class="accrow"><b>${{hat:'Sombrero',glasses:'Gafas',scarf:'Bufanda',color:'Color'}[slot]}</b> <button class="acc${!p.acc[slot]?' on':''}" data-a="${slot}" data-v="">Nada</button>${vals.map(u=>{const ok=p.lvl>=u[0];return`<button class="acc${p.acc[slot]===u[2]?' on':''}" ${ok?'':'disabled'} data-a="${slot}" data-v="${u[2]}">${ok?u[3]:'🔒 nivel '+u[0]}</button>`}).join('')}</div>`;
 const by=s=>UNLOCKS.filter(u=>u[1]===s);
 app.innerHTML=`<div class="row" style="justify-content:space-between"><button class="back" id="bk">⬅ Volver</button><span>🏠 Casita de ${esc(p.name)} · nivel ${p.lvl}</span></div>
 <div id="slot"></div><div class="row"><button class="ok" id="feed">🍎 Dar merienda (${p.snacks||0})</button><button class="hint" id="pet">🤗 Mimitos</button><button class="back" id="chg">🔄 Cambiar mascota</button></div>
 <div class="card">${bars(p)}<p style="font-size:18px">Cada ejercicio hecho sube el ánimo y la energía. Cada 2 ejercicios ganas una merienda 🍎. Las estrellas dan XP para subir de nivel y desbloquear accesorios. ¡${esc(p.name)} nunca se pone mal: solo te espera con ganas!</p>
 ${['hat','glasses','scarf','color'].map(s=>opt(s,by(s))).join('')}</div>`;
 $('#bk').onclick=kidHome;$('#chg').onclick=()=>petPicker(true);
 $('#feed').onclick=()=>{if(!p.snacks){toast('Haz 2 ejercicios para ganar una merienda 🍎');D3()&&D3().owl('talk');return}p.snacks--;p.energy=Math.min(100,p.energy+15);p.mood=Math.min(100,p.mood+5);save();D3()&&D3().owl('eat');sfx('clink');petRoom()};
 $('#pet').onclick=()=>{p.mood=Math.min(100,p.mood+2);save();D3()&&D3().owl('happy');sfx('hoot')};
 app.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{p.acc[b.dataset.a]=b.dataset.v||undefined;save();sfx('pop');applyPet();petRoom()});
 applyPet();stage('#slot',340,'room')}

// ================= motor de materias =================
let scur=null,sSub=null,sTopic=null,sHint=0,sWrong=0;
const key=(s,t)=>s+'.'+t;
function tstate(s,t){const k=key(s,t);if(!st.topics[k])st.topics[k]={lvl:kid.curso===3&&s==='frances'?2:1,streak:0,miss:0,ok:0,ko:0};return st.topics[k]}
const U=()=>UI[SUBJ[sSub].ui]||UI.es;
function subjMenu(s){sSub=s;view=()=>subjMenu(s);header();const S=SUBJ[s],u=U();
 const greet={es:`¡Vamos con ${S.t}, ${kid.name}! ¿Qué tema quieres?`,ca:`Som-hi, ${kid.name}! Quin tema vols?`,en:`Let's do ${S.t}, ${kid.name}! Choose a topic.`}[S.ui];
 app.innerHTML=`<div class="row" style="justify-content:flex-start"><button class="back" id="bkm">⬅ Materias</button><span>${S.i} ${S.t}</span></div><div id="slot"></div><div class="tutor">${owlBox()}<div class="bubble"><b>${petName()}:</b> ${greet}</div></div><div class="grid">`+
 Object.entries(S.topics).map(([k,v])=>`<div class="tcell"><button class="topic" data-t="${k}">${v.i} ${v.t}<small>${v.d} · nivel ${tstate(s,k).lvl}/${MAXS}</small>${(st.lessons||{})[key(s,k)]?'':'<small class="new">🎓 ¡Nuevo!</small>'}</button><button class="lesbtn" data-l="${k}">${u.lesson}</button></div>`).join('')+`</div>`+
 (s==='science'?`<div class="row"><button class="ok" id="explore">🦴 Explore the skeleton</button></div>`:'');
 save();
 app.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>(st.lessons||{})[key(s,b.dataset.t)]?sStart(s,b.dataset.t):sLesson(s,b.dataset.t));
 app.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>sLesson(s,b.dataset.l));$('#bkm').onclick=kidHome;
 if(s==='science')$('#explore').onclick=explore;
 stage('#slot',200,'owl')}

function skelSay(k){const b=BONES[k];say(`🦴 <b>${b[0]}</b>: ${b[1]}`);speak(`${b[0]}. ${b[1]}`,'en-GB');D3()&&D3().skel.highlight(k,b[0].split(' (')[0])}
function explore(){sSub='science';view=explore;header();
 app.innerHTML=`<div class="row" style="justify-content:space-between"><button class="back" id="bk">⬅ Topics</button><span>🦴 Explore the skeleton</span></div><div class="tutor">${owlBox()}<div class="bubble" id="say"><b>${petName()}:</b> Tap any bone to hear its name!</div></div><div id="slot3"></div>
 <div class="row bonebtns">${Object.entries(BONES).map(([k,b])=>`<button class="back bb" data-b="${k}">${b[0].split(' (')[0]}</button>`).join('')}</div>`;
 $('#bk').onclick=()=>subjMenu('science');app.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>skelSay(x.dataset.b));
 if(D3()){stage('#slot3',420,'skeleton');D3().skel.onTap=k=>{sfx('pop');skelSay(k)}}}

function sLesson(s,t){sSub=s;sTopic=t;view=()=>sLesson(s,t);header();const S=SUBJ[s],L=S.lessons[t],u=U(),sk=s==='science';let i=0;
 app.innerHTML=`<div class="row" style="justify-content:space-between"><button class="back" id="bk">${u.back}</button><span>🎓 ${S.topics[t].i} ${S.topics[t].t}</span></div>
 <div class="tutor">${owlBox()}<div class="bubble" id="say"></div></div><div id="slot3"></div><div class="lcard" id="lc"></div><div class="dots" id="dots"></div>
 <div class="row">${TTS_OK?`<button class="back" id="sp">${u.listen}</button>`:''}<button class="ok" id="nx"></button></div>`;
 $('#bk').onclick=()=>subjMenu(s);
 if(D3())stage('#slot3',sk?400:200,sk?'skeleton':'owl');
 if(sk&&D3())D3().skel.onTap=k=>{sfx('pop');skelSay(k)};
 const step=()=>{const [txt,vis]=L[i];sfx('whoosh');say(`<b>${petName()}:</b> ${txt}`);D3()&&D3().owl('talk');
  if(sk){D3()?D3().skel.highlight(vis,vis&&BONES[vis][0].split(' (')[0]):0;$('#lc').innerHTML=vis&&!D3()?`<div class="lpic">${BONES[vis][2]}</div>`:'';$('#lc').style.display=D3()?'none':''}
  else $('#lc').innerHTML=`<div class="lpic">${esc(vis||'')}</div>`;
  $('#dots').innerHTML=L.map((_,j)=>`<i class="${j<=i?'on':''}"></i>`).join('');$('#nx').textContent=i===L.length-1?u.go:u.next};
 if(TTS_OK)$('#sp').onclick=()=>speak(L[i][0]+(s==='frances'?'':''),s==='frances'?'es-ES':S.lang);
 $('#nx').onclick=()=>{if(i<L.length-1){i++;step()}else{st.lessons=st.lessons||{};st.lessons[key(s,t)]=1;save();sStart(s,t)}};step()}

function sStart(s,t){sSub=s;sTopic=t;scur=SUBJ[s].topics[t].gen(tstate(s,t).lvl);sHint=0;sWrong=0;sRender()}
function sRender(msg){const s=sSub,t=sTopic,S=SUBJ[s],q=scur,tp=tstate(s,t),u=U();view=()=>sRender(msg);header();
 const story=q.story?`<div class="story"><div class="spic">${q.story.p}</div>${q.story.t?`<h3>${esc(q.story.t)}</h3>`:''}<p>${esc(q.story.x)}</p></div>`:'';
 const sk=(q.bone||q.type==='tap')&&D3();
 let body='';
 if(q.type==='match'){const R2=shuffle(q.pairs.map(p=>p[1]));body=`<div class="match"><div>${q.pairs.map((p,i)=>`<button class="mo ml" data-m="${i}">${esc(p[0])}</button>`).join('')}</div><div>${R2.map(e=>`<button class="mo mr emo" data-r="${e}">${e}</button>`).join('')}</div></div>`}
 else if(q.type==='order'){const W=shuffle(q.words.map((w,i)=>({w,i})));body=`<div class="bline" id="bl"></div><div class="chips">${W.map((x,j)=>`<button class="opt chip o${j%5}" data-w="${esc(x.w)}">${esc(x.w)}</button>`).join('')}</div>`}
 else if(q.type!=='tap')body=`<div class="opts${q.emojiOpts?' emo':''}">${q.options.map((o,i)=>`<button class="opt o${i%6}" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
 app.innerHTML=`<div class="row" style="justify-content:space-between"><button class="back" id="bk">${u.back}</button><span>${S.i} ${S.topics[t].t} · nivel ${tp.lvl}/${MAXS} · ${'🔥'.repeat(tp.streak)}</span></div>
 <div class="tutor">${owlBox()}<div class="bubble" id="say"><b>${petName()}:</b> ${msg||u.start}</div></div>${story}
 ${q.pic?`<div class="bigpic">${q.pic}</div>`:''}<div class="sq">${esc(q.prompt)}</div>${sk?'<div id="slot3"></div>':''}${body}
 <div class="row">${q.speak&&TTS_OK?`<button class="back" id="sp">${u.listen}</button>`:''}<button class="hint" id="hi">${u.hint}</button></div>`;
 $('#bk').onclick=()=>subjMenu(s);
 if(q.speak&&TTS_OK)$('#sp').onclick=()=>speak(q.speak,S.lang);
 $('#hi').onclick=()=>{D3()?D3().owl('hint'):sfx('hint');say(`<b>${petName()}:</b> 💡 ${esc(q.hint)}`);sHint++};
 if(q.listen&&TTS_OK)setTimeout(()=>speak(q.speak,S.lang),400);
 if(sk){stage('#slot3',380,'skeleton');D3().skel.highlight(q.type==='tap'?null:q.bone,null);D3().skel.onTap=k=>{if(q.type==='tap')answer(k===q.ans,null);else{sfx('pop');D3().skel.highlight(k,BONES[k][0].split(' (')[0])}}}
 app.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>answer(b.dataset.o===q.ans,b));
 if(q.type==='order'){const bl=$('#bl');const chk=()=>{const got=[...bl.children].map(c=>c.dataset.w);if(got.length<q.words.length)return;if(got.join(' ')===q.ans)answer(true,null);else{answer(false,null,true);[...bl.children].forEach(c=>{c.classList.add('shake');app.querySelector('.chips').appendChild(c)})}};
  app.querySelectorAll('.chip').forEach(c=>{c.onclick=()=>{sfx('pop');(c.parentNode===bl?app.querySelector('.chips'):bl).appendChild(c);chk()};
   c.addEventListener('dragstart',e=>e.dataTransfer.setData('t',''));c.draggable=true;c.ondragend=e=>{const r=bl.getBoundingClientRect();if(e.clientY>r.top&&e.clientY<r.bottom&&c.parentNode!==bl){bl.appendChild(c);sfx('pop');chk()}}})}
 if(q.type==='match'){let selL=null,done=0;
  app.querySelectorAll('.ml').forEach(b=>b.onclick=()=>{if(b.disabled)return;app.querySelectorAll('.ml').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');selL=b;sfx('pop');if(S.lang)speak(b.textContent,S.lang)});
  app.querySelectorAll('.mr').forEach(b=>b.onclick=()=>{if(!selL||b.disabled)return;const pair=q.pairs[+selL.dataset.m];
   if(pair[1]===b.dataset.r){selL.disabled=b.disabled=true;selL.classList.add('done');b.classList.add('done');selL.classList.remove('sel');selL=null;done++;sfx('drop');if(done===q.pairs.length)answer(true,null)}
   else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),500);answer(false,null,true)}})}
}
function answer(ok,btn,soft){const s=sSub,t=sTopic,q=scur,tp=tstate(s,t),u=U();
 if(ok){tp.ok++;tp.miss=0;tp.streak++;const earn=sWrong?1:(sHint?2:3);st.stars+=earn;let up='';
  if(tp.streak>=3&&tp.lvl<MAXS){tp.lvl++;tp.streak=0;up=` 🚀 ${u.up} ${tp.lvl}!`}
  st.log.push({t:Date.now(),topic:key(s,t),lvl:q.lvl,q:q.prompt,ok:true});petReward(earn);save();
  scur=SUBJ[s].topics[t].gen(tp.lvl);sHint=0;sWrong=0;sRender(`${pick(u.praise)} +${'⭐'.repeat(earn)}${up}`);
  if(D3())D3().celebrate(earn);sfx('correct');setTimeout(()=>sfx('sparkle',earn),500);if(up)setTimeout(()=>sfx('levelup'),1100);header();return}
 tp.ko++;sWrong++;tp.streak=0;tp.miss++;st.log.push({t:Date.now(),topic:key(s,t),lvl:q.lvl,q:q.prompt,ok:false});if(st.log.length>300)st.log.shift();
 if(btn){btn.disabled=true;btn.classList.add('shake','bad')}
 if(!soft&&tp.miss>=2&&tp.lvl>1){tp.lvl--;tp.miss=0;save();sfx('wrong');const was=q.type==='tap'?BONES[q.ans][0]:q.ans;scur=SUBJ[s].topics[t].gen(tp.lvl);sHint=0;sWrong=0;sRender(`${u.was} «${esc(was)}». 💪 ${esc(q.hint)}`);return}
 save();D3()?D3().owl('sad'):0;sfx('wrong');say(`<b>${petName()}:</b> ${pick(u.enc)} 💡 ${esc(q.hint)}`);sHint++}

// ---------- padres: filas extra ----------
window.parentsExtra=(k,s)=>{let h='';for(const sk of Object.keys(SUBJ))if(sk!=='mates'){const S=SUBJ[sk];for(const t in S.topics){const p=s.topics[key(sk,t)];if(!p)continue;const tot=p.ok+p.ko,pc=tot?Math.round(p.ok*100/tot):0;
 h+=`<tr><td>${S.i} ${S.t} · ${S.topics[t].t}</td><td>${p.lvl}/${MAXS}</td><td>${p.ok}</td><td>${p.ko}</td><td><div class="bar"><i style="width:${pc}%"></i></div>${tot?pc+'%':'—'}</td></tr>`}}
 const P=s.pet;h+=P?`<tr><td colspan="5">🐾 Mascota: ${PETS[P.sp].e} <b>${esc(P.name)}</b> (${PETS[P.sp].n}) · nivel ${P.lvl} · XP ${P.xp}/${xpNeed(P.lvl)} · ánimo ${P.mood}% · energía ${P.energy}% · hoy ${P.day===today()?P.done:0}/${GOAL} · total ${P.total||0} ejercicios · accesorios: ${(P.unlocked||[]).join(', ')||'ninguno aún'}</td></tr>`:'<tr><td colspan="5">🐾 Todavía no ha elegido mascota.</td></tr>';return h};
// nombres de temas para «últimos fallos»
for(const sk in SUBJ)if(SUBJ[sk].topics)for(const t in SUBJ[sk].topics)TOPICS[key(sk,t)]===undefined&&Object.defineProperty(TOPICS,key(sk,t),{value:{t:SUBJ[sk].t+' · '+SUBJ[sk].topics[t].t,i:SUBJ[sk].i},enumerable:false});
window.__subjtest=()=>{for(const sk in SUBJ){const S=SUBJ[sk];if(!S.topics)continue;for(const t in S.topics)for(let l=1;l<=MAXS;l++)for(let i=0;i<150;i++){const q=S.topics[t].gen(l);
 if(q.type==='match'){if(q.pairs.length<2)throw sk+t;continue}if(q.type==='order'){if(q.words.join(' ')!==q.ans)throw sk+t;continue}if(q.type==='tap')continue;if(!q.options.includes(q.ans))throw new Error(sk+'.'+t+l+JSON.stringify(q));if(new Set(q.options).size!==q.options.length)throw new Error('dup '+sk+t+JSON.stringify(q.options))}}return 'ok'};
