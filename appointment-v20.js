(()=>{
'use strict';
const DB='coaching_tracker_v3';
let editingId=null;
let currentSavedId=null;
const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];
function read(){try{return JSON.parse(localStorage.getItem(DB)||'{}')}catch{return {items:[]}}}
function write(s){localStorage.setItem(DB,JSON.stringify(s))}
function itemById(id){return (read().items||[]).find(x=>x.id===id)}
function latestUpcoming(){return (read().items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]}
function fmtDate(d){if(!d)return'';const x=new Date(d+'T00:00:00');return `${x.getFullYear()}年${x.getMonth()+1}月${x.getDate()}號`}
function duration(m){m=Number(m||0);if(m<60)return `${m}分鐘`;if(m===60)return '1小時';if(m%60===0)return `${m/60}小時`;return `${Math.floor(m/60)}小時${m%60}分鐘`}
function bookingMessage(a){if(!a)return'';const method=a.mode==='online'?'線上會面':'面對面';const loc=a.mode==='online'?(a.link||''):(a.place||'');return `感謝${a.name||''}嘅信任💜，以下係booking詳情：\n- 日期：${fmtDate(a.date)}\n- 時間：${a.time||''}（大概${duration(a.expect)}）\n- 見面方式：${method}\n- 地點/鏈結：${loc}\n\n期待我哋好快見面 🥰\n\n溫馨提示：Coaching 同平時隨性嘅傾偈有啲唔同，呢個係一個探索嘅旅程。過程中我唔會直接畀答案，而係會用一個陪伴同支持嘅角色同你一齊行。\n到時你只需要放輕鬆，帶住一個開放、坦誠嘅心過嚟就得啦 🙌🏻 我會堅守保密原則，呢度係一個安全、冇批判嘅空間，放心呈現最真實嘅自己就可以啦 🫶🏻\n\n到時見 💜`;}
async function copyText(text){try{await navigator.clipboard.writeText(text);return true}catch{}try{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();return ok}catch{return false}}
function toast(t){const el=q('#toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1700)}
function getTarget(id){return itemById(id||currentSavedId)||latestUpcoming()}
window.shareBookingMessage=async id=>{const a=getTarget(id);if(!a)return;const text=bookingMessage(a);if(navigator.share){try{await navigator.share({text});return}catch(e){if(e&&e.name==='AbortError')return}}toast(await copyText(text)?'預約訊息已複製':'未能開啟分享')};
window.copyBookingMessage=async id=>{const a=getTarget(id);if(!a)return;toast(await copyText(bookingMessage(a))?'預約訊息已複製 💜':'未能複製預約訊息')};
function savedSummary(a){return `<b>${escapeHtml(a.name||'')}</b>${a.job?' · '+escapeHtml(a.job):''}<br>${fmtDate(a.date)} ${escapeHtml(a.time||'')} · ${a.mode==='online'?'線上':'面對面'}${a.plan?'<br>預計主題：'+escapeHtml(a.plan):''}`}
function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function ensureSavedUI(){const card=q('#saved .card'),info=q('#savedInfo');if(!card||!info)return;let edit=q('#v20EditSaved');if(!edit){edit=document.createElement('button');edit.id='v20EditSaved';edit.type='button';edit.className='btn secondary';edit.textContent='✏️ 修改預約資料';info.insertAdjacentElement('afterend',edit)}
 const share=qa('#saved button').find(b=>b.textContent.trim()==='分享預約訊息');if(share)share.onclick=()=>window.shareBookingMessage(currentSavedId);
 const copy=qa('#saved button').find(b=>b.textContent.trim()==='複製預約訊息');if(copy)copy.onclick=()=>window.copyBookingMessage(currentSavedId);
}
function renderSaved(a){if(!a)return;currentSavedId=a.id;ensureSavedUI();const info=q('#savedInfo');if(info)info.innerHTML=savedSummary(a);const p=q('#bookingPreviewV15');if(p){p.textContent=bookingMessage(a);p.closest('.messagePreview')?.classList.remove('emptyPreview')}
 const edit=q('#v20EditSaved');if(edit)edit.onclick=()=>window.editAppointmentV20(a.id);
}
function setEditUI(on){const screen=q('#appointment'),title=q('#appointment .head h2'),support=q('#appointment .support'),submit=q('#apptForm button[type="submit"]');if(screen)screen.classList.toggle('v20-editing',on);if(title)title.textContent=on?'修改 Coaching 預約':'新增 Coaching 預約';if(support)support.innerHTML=on?'✏️ <b>更新預約資料</b><br>修改後會保留同一個預約，不會建立重複紀錄。':'💜 <b>先記下預約資料</b><br>Coaching 完成後，再回來補上實際時數、Feedback 和反思。';if(submit)submit.textContent=on?'儲存修改':'儲存預約'}
window.editAppointmentV20=id=>{const a=itemById(id);if(!a||a.status!=='upcoming')return;editingId=id;currentSavedId=id;setEditUI(true);q('#name').value=a.name||'';q('#phone').value=a.phone||'';q('#job').value=a.job||'';q('#date').value=a.date||'';q('#time').value=a.time||'';q('#expect').value=String(a.expect||60);q('#link').value=a.link||'';q('#place').value=a.place||'';q('#plan').value=a.plan||'';window.setMode(a.mode==='offline'?'offline':'online');window.show('appointment')};
const baseNew=window.newAppointment;window.newAppointment=function(){editingId=null;setEditUI(false);return baseNew()};
function saveEdit(e){e.preventDefault();const s=read(),a=(s.items||[]).find(x=>x.id===editingId);if(!a)return;const mode=q('#offline').classList.contains('sel')?'offline':'online';Object.assign(a,{name:q('#name').value.trim(),phone:q('#phone').value.trim(),job:q('#job').value.trim(),date:q('#date').value,time:q('#time').value,expect:Number(q('#expect').value||60),mode,link:q('#link').value.trim(),place:q('#place').value.trim(),plan:q('#plan').value.trim(),updatedAt:new Date().toISOString()});write(s);sessionStorage.setItem('coach_v20_saved',a.id);location.reload()}
const form=q('#apptForm');if(form){const baseSubmit=form.onsubmit;form.onsubmit=function(e){if(editingId)return saveEdit(e);baseSubmit.call(this,e);setTimeout(()=>{const a=latestUpcoming();if(a){currentSavedId=a.id;renderSaved(a)}},0)}}
function enhanceUpcoming(){const s=read(),arr=(s.items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>`${a.date||''}T${a.time||''}`.localeCompare(`${b.date||''}T${b.time||''}`));const cards=qa('#recordList .item');cards.forEach((card,i)=>{const a=arr[i];if(!a)return;let holder=card.querySelector('.v15Quick');if(!holder){holder=document.createElement('div');holder.className='v15Quick';card.appendChild(holder)}holder.classList.add('v20UpcomingActions');if(!holder.querySelector('.v20EditBtn')){const b=document.createElement('button');b.type='button';b.className='miniBtn v20EditBtn';b.textContent='修改預約';b.onclick=()=>window.editAppointmentV20(a.id);holder.appendChild(b)}})}
function enhanceHome(){const s=read(),arr=(s.items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>`${a.date||''}T${a.time||''}`.localeCompare(`${b.date||''}T${b.time||''}`)).slice(0,3);qa('#homeList .item').forEach((card,i)=>{const a=arr[i];if(!a||card.querySelector('.v20HomeEdit'))return;const b=document.createElement('button');b.type='button';b.className='v20HomeEdit';b.textContent='✏️ 修改預約';b.addEventListener('click',ev=>{ev.stopPropagation();window.editAppointmentV20(a.id)});card.appendChild(b)})}
const oldShow=window.show;window.show=function(id){const r=oldShow(id);setTimeout(()=>{if(id==='records')enhanceUpcoming();if(id==='home')enhanceHome();if(id==='saved'){const a=getTarget();if(a)renderSaved(a)}},0);return r};
const oldSetTab=window.setTab;window.setTab=function(v){const r=oldSetTab(v);setTimeout(()=>{if(v==='upcoming')enhanceUpcoming()},0);return r};
window.calendar=function(){const a=getTarget();if(!a)return;const start=new Date(`${a.date}T${a.time}:00`),end=new Date(start.getTime()+Number(a.expect||60)*60000);const f=d=>d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';const clean=v=>String(v||'').replace(/([,;\\])/g,'\\$1').replace(/\n/g,'\\n');const lines=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`UID:${a.id}@coach`,`DTSTART:${f(start)}`,`DTEND:${f(end)}`,`SUMMARY:${clean('Coaching｜'+a.name)}`,`LOCATION:${clean(a.mode==='online'?(a.link||'線上 Coaching'):(a.place||''))}`,'END:VEVENT','END:VCALENDAR'];const u=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/calendar'})),l=document.createElement('a');l.href=u;l.download=`Coaching-${a.name}-${a.date}.ics`;l.click();URL.revokeObjectURL(u)};
ensureSavedUI();enhanceHome();
const restored=sessionStorage.getItem('coach_v20_saved');if(restored){sessionStorage.removeItem('coach_v20_saved');const a=itemById(restored);if(a){currentSavedId=a.id;setTimeout(()=>{renderSaved(a);window.show('saved')},40)}}
})();
