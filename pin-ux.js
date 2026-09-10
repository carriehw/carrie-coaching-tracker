(()=>{
  const input=document.getElementById('pin');
  if(!input || document.getElementById('pinEyeBtn')) return;

  input.type='password';
  input.autocomplete='off';
  input.style.paddingRight='54px';

  const wrap=document.createElement('div');
  wrap.style.position='relative';
  wrap.style.width='100%';
  input.parentNode.insertBefore(wrap,input);
  wrap.appendChild(input);

  const btn=document.createElement('button');
  btn.id='pinEyeBtn';
  btn.type='button';
  btn.setAttribute('aria-label','顯示 PIN');
  btn.setAttribute('title','顯示 PIN');
  btn.style.cssText='position:absolute;right:10px;top:50%;transform:translateY(-50%);width:40px;height:40px;border:0;background:transparent;border-radius:12px;display:grid;place-items:center;color:#5f586c;padding:0;cursor:pointer;z-index:2';
  const eyeOpen='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const eyeClosed='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.1 3.2"/><path d="M6.6 6.6C3.5 8.6 2 12 2 12s3.5 8 10 8a9.8 9.8 0 0 0 4.1-.9"/></svg>';
  btn.innerHTML=eyeOpen;
  wrap.appendChild(btn);

  btn.addEventListener('click',()=>{
    const showing=input.type==='text';
    input.type=showing?'password':'text';
    btn.innerHTML=showing?eyeOpen:eyeClosed;
    btn.setAttribute('aria-label',showing?'顯示 PIN':'隱藏 PIN');
    btn.setAttribute('title',showing?'顯示 PIN':'隱藏 PIN');
    input.focus();
    try{input.setSelectionRange(input.value.length,input.value.length)}catch{}
  });
})();
