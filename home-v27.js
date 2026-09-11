(()=>{
'use strict';
const DB='coaching_tracker_v3';
const LANG='coaching_lang_v1';
const q=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=()=>{try{return JSON.parse(localStorage.getItem(DB)||'{}')}catch{return {items:[]}}};
const isEN=()=>localStorage.getItem(LANG)==='en';
const when=a=>`${a.date||''}T${a.time||'00:00'}`;
function fmtDate(d){if(!d)return'';const x=new Date(d+'T00:00:00');if(Number.isNaN(x.getTime()))return d;return isEN()?x.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):`${x.getFullYear()}年${x.getMonth()+1}月${x.getDate()}日`}
function modeLabel(a){return a.mode==='online'?(isEN()?'Online':'線上'):(isEN()?'In person':'面對面')}
function hasStarted(a){if(!a.date)return false;const t=new Date(`${a.date}T${a.time||'23:59'}:00`);return !Number.isNaN(t.getTime())&&Date.now()>=t.getTime()}
function strings(){return isEN()?{
 badge:'Pending',edit:'Edit appointment',complete:'Complete record',more:n=>`${n} more appointment${n===1?'':'s'} · View all`,empty:'No upcoming appointments yet.<br>Schedule your next Coaching session to get started 🌱'
}:{
 badge:'待完成',edit:'修改預約',complete:'完成後補紀錄',more:n=>`另有 ${n} 個預約 · 查看全部`,empty:'暫時未有預約。<br>可以由安排下一節 Coaching 開始 🌱'
}}
function renderCompactHome(){
 const list=q('#homeList');if(!list)return;
 const s=read(),arr=(s.items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>when(a).localeCompare(when(b)));
 const copy=strings();
 list.classList.add('homeCompactList');
 if(!arr.length){list.innerHTML=`<div class="empty">${copy.empty}</div>`}else{
   list.innerHTML=arr.slice(0,2).map(a=>{
     const due=hasStarted(a),action=due?copy.complete:copy.edit;
     const job=a.job?`<span class="v27Job">${esc(a.job)}</span>`:'';
     return `<div class="item v27HomeItem" data-v27-id="${esc(a.id)}"><div class="v27HomeTop"><div class="v27HomeName"><h4>${esc(a.name)}</h4><div class="v27HomeMeta"><span>${esc(fmtDate(a.date))}${a.time?' · '+esc(a.time):''} · ${esc(modeLabel(a))}</span>${job}</div></div><span class="badge">${copy.badge}</span></div><div class="v27HomeActionRow"><button type="button" class="v27HomeAction${due?' isDue':''}" data-v27-action="${due?'complete':'edit'}" data-v27-id="${esc(a.id)}">${due?'✓ ': '✎ '}${action}</button></div></div>`
   }).join('')
 }
 let more=q('#v27MoreRow');
 if(arr.length>2){
   if(!more){more=document.createElement('div');more.id='v27MoreRow';more.className='v27MoreRow';list.insertAdjacentElement('afterend',more)}
   more.innerHTML=`<button type="button" class="v27MoreBtn">${copy.more(arr.length-2)}</button>`;
   more.querySelector('button').onclick=()=>{if(window.setTab)window.setTab('upcoming');if(window.show)window.show('records')};
 }else if(more){more.remove()}
 list.querySelectorAll('[data-v27-action]').forEach(btn=>{
   btn.addEventListener('click',e=>{
     e.preventDefault();e.stopPropagation();
     const id=btn.getAttribute('data-v27-id');
     if(btn.getAttribute('data-v27-action')==='complete')window.openComplete?.(id);
     else window.editAppointmentV20?.(id);
   })
 })
}
const baseShow=window.show;
if(typeof baseShow==='function')window.show=function(id){const r=baseShow.apply(this,arguments);if(id==='home')setTimeout(renderCompactHome,25);return r};
window.renderHomeV27=renderCompactHome;
setTimeout(renderCompactHome,40);
window.addEventListener('pageshow',()=>setTimeout(renderCompactHome,40));
})();
