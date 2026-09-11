(()=>{
'use strict';
const DB='coaching_tracker_v3';
const CURRENT_APPT_KEY='coaching_current_appt_v1';
const q=s=>document.querySelector(s);
function read(){try{return JSON.parse(localStorage.getItem(DB)||'{}')}catch{return {items:[]}}}
function itemById(id){return (read().items||[]).find(x=>x.id===id)}
function latestUpcoming(){return (read().items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]}
function currentAppointment(){const id=sessionStorage.getItem(CURRENT_APPT_KEY)||'';return itemById(id)||latestUpcoming()}
function fmtDate(d){if(!d)return'';const x=new Date(d+'T00:00:00');return `${x.getFullYear()}年${x.getMonth()+1}月${x.getDate()}號`}
function duration(m){m=Number(m||0);if(m<60)return `${m}分鐘`;if(m===60)return '1小時';if(m%60===0)return `${m/60}小時`;return `${Math.floor(m/60)}小時${m%60}分鐘`}
function bookingMessage(a){
  if(!a)return'';
  const name=a.name||'';
  const method=a.mode==='online'?'線上會面':'面對面';
  const loc=a.mode==='online'?(a.link||''):(a.place||'');
  return `感謝${name}嘅信任💜，以下係booking詳情：\n- 日期：${fmtDate(a.date)}\n- 時間：${a.time||''}（大概${duration(a.expect)}）\n- 見面方式：${method}\n- 地點/鏈結：${loc}\n\n期待同${name}見面 🥰\n\n溫馨提示：Coaching 同平時隨性嘅傾偈有啲唔同，呢個係一個探索嘅旅程。過程中我唔會直接畀答案，而係會用一個陪伴同支持嘅角色同你一齊行。\n我會堅守保密原則，呢度係一個安全、冇批判嘅空間，到時只需要放輕鬆，帶住一個開放、坦誠嘅心，呈現最真實嘅自己就可以啦 🫶🏻\n\n到時見 💜`;
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text);return true}catch{}
  try{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();return ok}catch{return false}
}
function toast(t){const el=q('#toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1700)}
function getTarget(id){return itemById(id)||currentAppointment()}
function refreshPreview(id){const a=getTarget(id);const p=q('#bookingPreviewV15');if(a&&p){p.textContent=bookingMessage(a);p.closest('.messagePreview')?.classList.remove('emptyPreview')}}
window.bookingMessageV26=bookingMessage;
window.copyBookingMessage=async id=>{const a=getTarget(id);if(!a)return;toast(await copyText(bookingMessage(a))?'預約訊息已複製 💜':'未能複製預約訊息')};
window.shareBookingMessage=async id=>{const a=getTarget(id);if(!a)return;const text=bookingMessage(a);if(navigator.share){try{await navigator.share({text});return}catch(e){if(e&&e.name==='AbortError')return}}toast(await copyText(text)?'已複製，可貼到 WhatsApp':'未能開啟分享')};
const oldShow=window.show;
if(typeof oldShow==='function'){
  window.show=function(id){const r=oldShow.apply(this,arguments);if(id==='saved')setTimeout(()=>refreshPreview(),35);return r};
}
setTimeout(()=>{if(q('#saved')?.classList.contains('active'))refreshPreview()},60);
})();
