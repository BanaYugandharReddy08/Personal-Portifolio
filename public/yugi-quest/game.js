const GAME_DATA = {
  memoryPairs: [
    {fact:'Built first website at 13', category:'Early Passion'},
    {fact:'Graduated CS 2018', category:'Education'},
    {fact:'Joined XYZ Corp', category:'Career'},
    {fact:'Lead Developer 2021', category:'Milestone'},
    {fact:'Enjoys hiking', category:'Hobby'},
    {fact:'Speaks Japanese', category:'Languages'}
  ],
  timeline: [
    {year:2015, event:'Started Internship'},
    {year:2018, event:'CS Degree'},
    {year:2019, event:'First Job'},
    {year:2021, event:'Promotion'},
    {year:2023, event:'Joined Yugi Quest'}
  ],
  techUnscramble: [
    'import React from "react";',
    'const App = () => {',
    '  return <h1>Hello React</h1>;',
    '};',
    'export default App;'
  ],
  quizBank: [
    {q:'HTML stands for HyperText Markup Language', a:'T'},
    {q:'CSS positions elements only', a:'F'},
    {q:'JavaScript can manipulate the DOM', a:'T'},
    {q:'React is a backend framework', a:'F'},
    {q:'<> is the AND operator in JS', a:'F'},
    {q:'Flexbox helps align items', a:'T'},
    {q:'const creates a variable', a:'T'},
    {q:'NaN === NaN evaluates to true', a:'F'},
    {q:'querySelector returns an array', a:'F'},
    {q:'addEventListener attaches events', a:'T'}
  ]
};

const GAME = {
  state: 'splash',
  hearts: 3,
  xp: 0,
  timeLeft: 300000,
  timer: null,
  player: 'Guest'
};

function qs(id){return document.getElementById(id);}
function formatTime(ms){
  const t = Math.max(0, Math.floor(ms/1000));
  const m = String(Math.floor(t/60)).padStart(1,'0');
  const s = String(t%60).padStart(2,'0');
  return `${m}:${s}`;
}

function updateHeader(){
  qs('hearts').textContent='♥'.repeat(GAME.hearts);
  qs('timer').textContent=formatTime(GAME.timeLeft);
  qs('xp').textContent=GAME.xp+' XP';
}

function startTimer(){
  if(GAME.timer) clearInterval(GAME.timer);
  GAME.timer=setInterval(()=>{
    if(GAME.state.startsWith('level')){
      GAME.timeLeft-=100;
      if(GAME.timeLeft<=0){
        gameOver();
      }
      updateHeader();
    }
  },100);
}

function startGame(){
  GAME.hearts=3; GAME.xp=0; GAME.timeLeft=300000;
  GAME.player=qs('playerName').value.trim()||'Guest';
  qs('overlay-splash').setAttribute('aria-hidden','true');
  startTimer();
  nextLevel();
}

function nextLevel(){
  if(GAME.state==='splash') GAME.state='level1';
  else if(GAME.state==='level1') GAME.state='level2';
  else if(GAME.state==='level2') GAME.state='level3';
  else if(GAME.state==='level3') GAME.state='level4';
  else if(GAME.state==='level4'){ victory(); return; }
  loadCurrentLevel();
}

function loadCurrentLevel(){
  const scene=qs('scene');
  scene.innerHTML='';
  if(GAME.state==='level1') loadLevel1(scene, GAME_DATA.memoryPairs);
  if(GAME.state==='level2') loadLevel2(scene, GAME_DATA.timeline);
  if(GAME.state==='level3') loadLevel3(scene, GAME_DATA.techUnscramble);
  if(GAME.state==='level4') loadLevel4(scene, GAME_DATA.quizBank);
  updateHeader();
}

function loseHeart(){
  GAME.hearts=Math.max(0, GAME.hearts-1);
  if(GAME.hearts===0) gameOver();
  updateHeader();
}

function addXP(val){
  GAME.xp+=val; updateHeader();
}

function victory(){
  GAME.state='victory';
  clearInterval(GAME.timer);
  qs('end-title').textContent='Victory!';
  qs('overlay-end').setAttribute('aria-hidden','false');
  const badge=generateBadge(GAME.player,GAME.xp,formatTime(GAME.timeLeft));
  qs('shareBadge').src=badge; qs('shareBadge').style.display='block';
  saveHighScore();
}

function gameOver(){
  GAME.state='gameover';
  clearInterval(GAME.timer);
  qs('end-title').textContent='Game Over';
  qs('overlay-end').setAttribute('aria-hidden','false');
  saveHighScore();
}

function updateHighScore(){
  const hs=JSON.parse(localStorage.getItem('yugiHS')||'null');
  if(hs) qs('highscore').textContent=`High Score: ${hs.xp} XP - ${hs.time}`;
}

function saveHighScore(){
  const hs=JSON.parse(localStorage.getItem('yugiHS')||'null');
  if(!hs || GAME.xp>hs.xp){
    localStorage.setItem('yugiHS',JSON.stringify({xp:GAME.xp,time:formatTime(GAME.timeLeft)}));
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  qs('startBtn').addEventListener('click', startGame);
  qs('restartBtn').addEventListener('click', ()=>location.reload());
  updateHeader();
  updateHighScore();
});
