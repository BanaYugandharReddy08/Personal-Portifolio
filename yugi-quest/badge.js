function generateBadge(name,xp,time){
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='150'>
  <rect width='100%' height='100%' fill='#222'/>
  <text x='150' y='40' fill='#fff' font-size='18' text-anchor='middle'>Certified Yugi Expert</text>
  <text x='150' y='80' fill='#fff' font-size='16' text-anchor='middle'>${name}</text>
  <text x='150' y='110' fill='#fff' font-size='14' text-anchor='middle'>XP: ${xp} Time: ${time}</text>
  </svg>`;
  const blob=new Blob([svg],{type:'image/svg+xml'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url; link.download='yugi_badge.svg';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  return url;
}
