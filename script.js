const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const scenes=$$('.scene');
const song=$('#song'),musicControl=$('#musicControl'),musicToggle=$('#musicToggle'),musicStatus=$('#musicStatus');
const answerEndpoint=(window.PROPOSAL_CONFIG&&window.PROPOSAL_CONFIG.answerEndpoint||'').trim();
song.volume=.34;

function showScene(id){scenes.forEach(scene=>scene.classList.toggle('is-active',scene.id===id));window.scrollTo({top:0,behavior:'smooth'});}
async function playSong(){try{await song.play();musicControl.hidden=false;musicToggle.textContent='❚❚';musicStatus.textContent='playing softly'}catch{musicControl.hidden=false;musicToggle.textContent='♪';musicStatus.textContent='tap to play'}}
musicToggle.addEventListener('click',()=>{if(song.paused)playSong();else{song.pause();musicToggle.textContent='♪';musicStatus.textContent='paused'}});

const envelope=$('#openEnvelope');
function openFirstScene(){envelope.classList.add('is-open');playSong();confetti(28);setTimeout(()=>showScene('sceneCode'),520)}
envelope.addEventListener('click',openFirstScene);$('#startButton').addEventListener('click',openFirstScene);

$('#hintButton').addEventListener('click',()=>{$('#codeHint').hidden=false});
$('#codeForm').addEventListener('submit',e=>{e.preventDefault();const value=$('#birthdayCode').value.replace(/\D/g,'');if(value==='0111'){ $('#codeError').textContent='That’s you. ♡';confetti(24);setTimeout(()=>showScene('sceneTruths'),450)}else{$('#codeError').textContent='That key did not fit. Try her birthday in DDMM.';$('#birthdayCode').select()}});
$('#birthdayCode').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,4);$('#codeError').textContent=''});

const openedKeys=new Set();const dots=$$('.key-dot');
$$('.truth-card').forEach(card=>card.addEventListener('click',()=>{const key=Number(card.dataset.key);card.classList.add('is-open');openedKeys.add(key);dots.forEach((dot,i)=>dot.classList.toggle('filled',openedKeys.has(i)));$('#keyStatusText').textContent=`${openedKeys.size} of 3 keys collected`;if(openedKeys.size===3){const btn=$('#truthContinue');btn.disabled=false;btn.textContent='Unlock the last lock →';confetti(18)}}));
$('#truthContinue').addEventListener('click',()=>showScene('sceneHold'));

const hold=$('#holdHeart'),ring=$('#ringProgress'),label=$('#holdLabel');
const circumference=2*Math.PI*52;ring.style.strokeDasharray=circumference;ring.style.strokeDashoffset=circumference;
let raf=null,startTime=null,holding=false;const HOLD_MS=1900;
function resetHold(){holding=false;startTime=null;if(raf)cancelAnimationFrame(raf);raf=null;ring.style.strokeDashoffset=circumference;hold.classList.remove('is-holding');label.textContent='press & hold'}
function tick(ts){if(!holding)return;if(!startTime)startTime=ts;const p=Math.min(1,(ts-startTime)/HOLD_MS);ring.style.strokeDashoffset=circumference*(1-p);label.textContent=p<1?'keep holding…':'unlocked ♡';if(p>=1){holding=false;confetti(55);setTimeout(()=>showScene('sceneQuestion'),380);return}raf=requestAnimationFrame(tick)}
function beginHold(e){e.preventDefault();if(holding)return;holding=true;hold.classList.add('is-holding');raf=requestAnimationFrame(tick)}
hold.addEventListener('pointerdown',beginHold);hold.addEventListener('pointerup',resetHold);hold.addEventListener('pointerleave',resetHold);hold.addEventListener('pointercancel',resetHold);hold.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!holding){beginHold(e)}});hold.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')resetHold()});

async function notifyAnswer(answer){
  const payload={answer,person:'Elgene Jamelia Januarie',question:'Will you be my girlfriend?',submitted_at:new Date().toISOString(),page:location.href};
  if(!answerEndpoint){console.warn('Answer notification endpoint is not configured. Add it in config.js.');return {ok:false,configured:false};}
  try{
    const response=await fetch(answerEndpoint,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(payload)});
    return {ok:response.ok,configured:true};
  }catch(error){console.error('Answer notification failed',error);return {ok:false,configured:true};}
}

let chosenAnswer='';
$$('.answer').forEach(button=>button.addEventListener('click',async()=>{
  if(chosenAnswer)return;chosenAnswer=button.dataset.answer;
  $$('.answer').forEach(b=>b.disabled=true);
  const result=$('#answerResult');
  if(chosenAnswer.startsWith('Yes')){result.innerHTML='<strong>Okay… wow. 🥹</strong><span>Give me a second to pretend I am calm.</span>';confetti(190)}
  else if(chosenAnswer.includes('time')){result.innerHTML='<strong>That is completely okay. ♡</strong><span>Take the time you need. I meant it when I said the answer should be yours.</span>'}
  else{result.innerHTML='<strong>Thank you for being honest with me.</strong><span>I would rather have your real answer than one you felt pushed into.</span>'}
  const sendResult=await notifyAnswer(chosenAnswer);
  sessionStorage.setItem('proposalAnswer',chosenAnswer);
  setTimeout(()=>finishAnswer(chosenAnswer,sendResult),1300);
}));

function finishAnswer(answer,sendResult){
  if(answer.startsWith('Yes')){$('#endingKicker').textContent='SO… IT’S US?';$('#endingTitle').textContent='You genuinely just made my day.';$('#endingCopy').textContent='The website was the dramatic part. What matters is that I get to choose you properly — and, apparently, call you my girlfriend now. 🤎'}
  else if(answer.includes('time')){$('#endingKicker').textContent='NO PRESSURE';$('#endingTitle').textContent='Take the time you need.';$('#endingCopy').textContent='I wanted to be honest about what I want, not rush you into it. The question can wait until your answer feels like your own.'}
  else{$('#endingKicker').textContent='THANK YOU FOR YOUR HONESTY';$('#endingTitle').textContent='I still mean what I said about caring about you.';$('#endingCopy').textContent='A real answer matters more to me than a forced yes. Thank you for treating the question honestly.'}
  showScene('sceneEnding');
}

$('#replayButton').addEventListener('click',()=>{openedKeys.clear();$$('.truth-card').forEach(c=>c.classList.remove('is-open'));dots.forEach(d=>d.classList.remove('filled'));$('#keyStatusText').textContent='0 of 3 keys collected';$('#truthContinue').disabled=true;$('#truthContinue').textContent='All three keys first ♡';chosenAnswer='';$$('.answer').forEach(b=>b.disabled=false);$('#answerResult').innerHTML='';$('#birthdayCode').value='';$('#codeError').textContent='';resetHold();showScene('sceneEnvelope')});

function confetti(n=80){const colors=['#a64f5e','#cf8993','#c6a16d','#fff','#7e2937'];for(let i=0;i<n;i++){const p=document.createElement('i');p.className='confetti';p.style.left=`${Math.random()*100}vw`;p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.setProperty('--dur',`${2.3+Math.random()*2.6}s`);p.style.setProperty('--drift',`${-130+Math.random()*260}px`);p.style.animationDelay=`${Math.random()*.25}s`;document.body.appendChild(p);setTimeout(()=>p.remove(),5600)}}
