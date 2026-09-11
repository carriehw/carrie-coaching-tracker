(()=>{
'use strict';
const DB='coaching_tracker_v3';
const BACKUP_KEY='coaching_last_backup_v1';
const CURRENT_APPT_KEY='coaching_current_appt_v1';
const ROUTE_KEY='coaching_v22_route';
const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];
function read(){try{return JSON.parse(localStorage.getItem(DB)||'{}')}catch{return {items:[]}}}
function write(s){localStorage.setItem(DB,JSON.stringify(s))}
function toast(t){const el=q('#toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
function latestUpcoming(){return (read().items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]}
function fmtBackup(iso){if(!iso)return '未曾備份';const d=new Date(iso);if(Number.isNaN(d.getTime()))return '未曾備份';return d.toLocaleDateString('zh-HK',{year:'numeric',month:'numeric',day:'numeric'});}
function rememberCurrent(id){if(id)sessionStorage.setItem(CURRENT_APPT_KEY,id)}
function currentId(){return sessionStorage.getItem(CURRENT_APPT_KEY)||''}

function cancelAppointment(id){const s=read(),a=(s.items||[]).find(x=>x.id===id&&x.status==='upcoming');if(!a)return;const ok=window.confirm(`確定取消 ${a.name||'這個 Coachee'} 嘅預約？\n\n取消後會由「即將進行」移除，亦唔會影響你已完成嘅 Coaching 時數。`);if(!ok)return;s.items=(s.items||[]).filter(x=>x.id!==id);write(s);if(currentId()===id)sessionStorage.removeItem(CURRENT_APPT_KEY);sessionStorage.setItem(ROUTE_KEY,'records');location.reload()}
window.cancelAppointmentV22=cancelAppointment;

function enhanceSaved(){const card=q('#saved .card');if(!card||q('#v22CancelSaved'))return;const b=document.createElement('button');b.id='v22CancelSaved';b.type='button';b.className='btn v22DangerBtn';b.textContent='取消這個預約';b.onclick=()=>{const id=currentId()||(latestUpcoming()?.id||'');if(id)cancelAppointment(id)};card.appendChild(b)}

function enhanceUpcoming(){const s=read();const arr=(s.items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>`${a.date||''}T${a.time||''}`.localeCompare(`${b.date||''}T${b.time||''}`));const cards=qa('#recordList .item');cards.forEach((card,i)=>{const a=arr[i];if(!a)return;let holder=card.querySelector('.v15Quick');if(!holder){holder=document.createElement('div');holder.className='v15Quick v22Actions';card.appendChild(holder)}else holder.classList.add('v22Actions');if(!holder.querySelector('.v22CancelBtn')){const b=document.createElement('button');b.type='button';b.className='miniBtn v22CancelBtn';b.textContent='取消預約';b.onclick=e=>{e.stopPropagation();cancelAppointment(a.id)};holder.appendChild(b)}})}

function enhanceBackup(){const settings=q('#settings');if(!settings)return;const card=qa('#settings .card').find(c=>c.textContent.includes('資料備份'));if(!card)return;let status=q('#v22BackupStatus');if(!status){status=document.createElement('div');status.id='v22BackupStatus';status.className='v22BackupStatus';const actions=card.querySelector('.actionsStack');card.insertBefore(status,actions||null)}const last=localStorage.getItem(BACKUP_KEY);status.innerHTML=`<b>上次備份：${fmtBackup(last)}</b><span>${last?'已記錄最近一次匯出時間。':'建議完成幾節 Coaching 後，或者換電話前匯出一次。'}</span>`}

const originalExport=window.exportData;
if(typeof originalExport==='function'){
  window.exportData=function(){const result=originalExport.apply(this,arguments);localStorage.setItem(BACKUP_KEY,new Date().toISOString());enhanceBackup();toast('備份已匯出，日期已記錄 💜');return result};
}

const originalEdit=window.editAppointmentV20;
if(typeof originalEdit==='function'){
  window.editAppointmentV20=function(id){rememberCurrent(id);return originalEdit(id)};
}

const form=q('#apptForm');
if(form){form.addEventListener('submit',()=>{setTimeout(()=>{const a=latestUpcoming();if(a)rememberCurrent(a.id)},20)})}

const originalShow=window.show;
if(typeof originalShow==='function'){
  window.show=function(id){const r=originalShow.apply(this,arguments);setTimeout(()=>{if(id==='saved')enhanceSaved();if(id==='records')enhanceUpcoming();if(id==='settings')enhanceBackup()},0);return r};
}
const originalSetTab=window.setTab;
if(typeof originalSetTab==='function'){
  window.setTab=function(v){const r=originalSetTab.apply(this,arguments);setTimeout(()=>{if(v==='upcoming')enhanceUpcoming()},0);return r};
}

enhanceSaved();enhanceBackup();
const route=sessionStorage.getItem(ROUTE_KEY);if(route){sessionStorage.removeItem(ROUTE_KEY);setTimeout(()=>{window.setTab?.('upcoming');window.show?.('records');toast('預約已取消')},60)}
})();
