function loadLevel4(scene, bank){
  const questions=shuffle(bank.slice()).slice(0,10);
  let index=0, score=0, qTime=6000; let iv;
  const qDiv=document.createElement('div');
  const timer=document.createElement('div');
  const optDiv=document.createElement('div');
  scene.appendChild(timer); scene.appendChild(qDiv); scene.appendChild(optDiv);
  function show(){
    if(index>=questions.length){ clearInterval(iv); if(score>=8) nextLevel(); else gameOver(); return; }
    const q=questions[index]; qDiv.textContent=q.q; optDiv.innerHTML='';
    ['T','F'].forEach(o=>{ const b=document.createElement('button'); b.textContent=o; b.onclick=()=>{if(o===q.a) score++; else loseHeart(); index++; qTime=6000; show();}; optDiv.appendChild(b);});
  }
  iv=setInterval(()=>{qTime-=1000; timer.textContent=`${qTime/1000}s`; if(qTime<=0){loseHeart(); index++; qTime=6000; show();}},1000);
  show();
}
