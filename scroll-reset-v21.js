(()=>{
'use strict';

/* Coaching Journey v21 — always enter a screen from the top on iPhone Safari. */
try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch{}

function resetTop(){
  document.documentElement.scrollTop=0;
  document.body.scrollTop=0;
  window.scrollTo({top:0,left:0,behavior:'auto'});
}
function resetAfterLayout(){
  requestAnimationFrame(()=>requestAnimationFrame(resetTop));
}

/* Every in-app screen change should start at the top, not inherit the previous scroll position. */
const baseShow=window.show;
if(typeof baseShow==='function'){
  window.show=function(id){
    const result=baseShow(id);
    resetAfterLayout();
    return result;
  };
}

/* First login / unlock hides the full-height PIN screen. Safari otherwise preserves
   the old scroll offset, which can land the user at the bottom of the home screen. */
const lock=document.getElementById('lock');
if(lock){
  const observer=new MutationObserver(()=>{
    if(lock.classList.contains('hidden')) resetAfterLayout();
  });
  observer.observe(lock,{attributes:true,attributeFilter:['class']});
  if(lock.classList.contains('hidden')) resetAfterLayout();
}
})();
