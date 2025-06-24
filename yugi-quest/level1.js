function loadLevel1(scene, pairs){
  let matched=0; let first=null, second=null;
  const cards=[];
  pairs.forEach((p,i)=>{ cards.push({text:p.fact,id:i}); cards.push({text:p.category,id:i}); });
  shuffle(cards);
  const grid=document.createElement('div');
  grid.className='grid';
  cards.forEach(c=>{
    const div=document.createElement('div');
    div.className='card';
    div.textContent='?';
    div.dataset.id=c.id; div.dataset.value=c.text;
    div.addEventListener('click', flip);
    grid.appendChild(div);
  });
  scene.appendChild(grid);
  function flip(e){
    const card=e.currentTarget;
    if(card.classList.contains('flipped')||second) return;
    card.classList.add('flipped');
    card.textContent=card.dataset.value;
    if(!first) first=card; else {second=card; check();}
  }
  function check(){
    if(first.dataset.id===second.dataset.id){
      first.classList.add('sparkle'); second.classList.add('sparkle');
      addXP(100); matched++;
      setTimeout(()=>{first.style.visibility='hidden'; second.style.visibility='hidden'; reset(); if(matched===pairs.length) nextLevel();},500);
    } else {
      setTimeout(()=>{first.classList.remove('flipped'); second.classList.remove('flipped'); first.textContent='?'; second.textContent='?'; reset();},600);
    }
  }
  function reset(){first=null; second=null;}
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
