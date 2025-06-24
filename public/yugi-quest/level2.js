function loadLevel2(scene, events){
  let currentDrag=null; let sub=90000;
  const timer=document.createElement('div');
  scene.appendChild(timer);
  const container=document.createElement('div');
  container.id='timelineContainer';
  events=shuffle(events.slice());
  events.forEach(ev=>{
    const div=document.createElement('div');
    div.className='draggable';
    div.draggable=true;
    div.textContent=ev.event;
    div.dataset.year=ev.year;
    container.appendChild(div);
  });
  scene.appendChild(container);

  container.addEventListener('dragstart',e=>{currentDrag=e.target;});
  container.addEventListener('dragover',e=>e.preventDefault());
  container.addEventListener('drop',e=>{
    e.preventDefault();
    if(e.target.classList.contains('draggable')){
      container.insertBefore(currentDrag,e.target.nextSibling);
      check();
    }
  });

  const iv=setInterval(()=>{sub-=1000; timer.textContent=`${Math.ceil(sub/1000)}s`; if(sub<=0){clearInterval(iv); gameOver();}},1000);

  function check(){
    const years=[...container.children].map(c=>+c.dataset.year);
    const sorted=[...years].sort((a,b)=>a-b);
    if(years.every((y,i)=>y===sorted[i])){
      clearInterval(iv);
      addXP(200);
      nextLevel();
    }else{
      loseHeart();
      container.classList.add('sparkle');
      setTimeout(()=>container.classList.remove('sparkle'),300);
      if(container.children.length>1){
        const i=Math.floor(Math.random()*container.children.length);
        const j=Math.floor(Math.random()*container.children.length);
        container.insertBefore(container.children[i], container.children[j]);
      }
    }
  }
}
