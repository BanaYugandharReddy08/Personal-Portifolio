function loadLevel3(scene, lines){
  if(GAME.hearts>2) GAME.hearts=2; updateHeader();
  const correct=lines.slice();
  const scrambled=shuffle(lines.slice());
  const list=document.createElement('ul');
  scrambled.forEach(l=>{ const li=document.createElement('li'); li.textContent=l; list.appendChild(li); });
  scene.appendChild(list);
  let idx=0;
  function highlight(){[...list.children].forEach((li,i)=>{li.style.background=i===idx?'#555':'';});}
  highlight();
  document.addEventListener('keydown',keyHandler);
  const done=document.createElement('button'); done.textContent='Done'; scene.appendChild(done);
  const bugBox=document.createElement('div'); scene.appendChild(bugBox);
  done.addEventListener('click',check);

  function keyHandler(e){
    if(e.key==='ArrowUp'&&idx>0){
      const node=list.children[idx]; list.insertBefore(node,list.children[idx-1]); idx--; highlight();
    } else if(e.key==='ArrowDown'&&idx<list.children.length-1){
      const node=list.children[idx]; list.insertBefore(list.children[idx+1],node); idx++; highlight();
    }
  }
  function check(){
    const arr=[...list.children].map(li=>li.textContent);
    if(arr.join('')===correct.join('')){ addXP(300); document.removeEventListener('keydown',keyHandler); nextLevel(); }
    else { spawnBug(); }
  }
  function spawnBug(){
    const bug=document.createElement('div'); bug.className='bug'; bugBox.appendChild(bug);
    bug.addEventListener('click',()=>bug.remove());
  }
}
