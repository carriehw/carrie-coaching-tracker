(()=>{
'use strict';
const DB='coaching_tracker_v3';
const LANG='coaching_lang_v1';
const CURRENT='coaching_current_appt_v1';
const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];
const read=()=>{try{return JSON.parse(localStorage.getItem(DB)||'{}')}catch{return {items:[]}}};
const isEN=()=>localStorage.getItem(LANG)==='en';
const itemById=id=>(read().items||[]).find(x=>x.id===id);
const upcoming=()=>((read().items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>`${a.date||''}T${a.time||''}`.localeCompare(`${b.date||''}T${b.time||''}`)));
const newestUpcoming=()=>((read().items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]);
const remember=id=>{if(id)sessionStorage.setItem(CURRENT,id)};
const currentId=()=>sessionStorage.getItem(CURRENT)||'';
function dateZh(d){if(!d)return'';const x=new Date(d+'T00:00:00');if(Number.isNaN(x.getTime()))return d;return `${x.getFullYear()}年${x.getMonth()+1}月${x.getDate()}號`}
function savedInfoTarget(){
  if(!q('#saved')?.classList.contains('active'))return null;
  const text=q('#savedInfo')?.textContent||'';
  if(!text.trim())return null;
  const matches=upcoming().filter(a=>{
    const name=!a.name||text.includes(a.name);
    const time=!a.time||text.includes(a.time);
    const date=!a.date||text.includes(dateZh(a.date))||text.includes(a.date);
    return name&&time&&date;
  });
  return matches[0]||null;
}
function target(id){
  const direct=id?itemById(id):null;
  if(direct)return direct;
  const shown=savedInfoTarget();
  if(shown){remember(shown.id);return shown}
  const current=itemById(currentId());
  if(current)return current;
  return newestUpcoming()||null;
}
function bookingText(a){
  if(!a)return'';
  if(typeof window.bookingMessageV28==='function')return window.bookingMessageV28(a);
  if(typeof window.bookingMessageV26==='function')return window.bookingMessageV26(a);
  return'';
}
function refreshPreview(id){
  const a=target(id),p=q('#bookingPreviewV15');
  if(!a||!p)return;
  remember(a.id);
  p.textContent=bookingText(a);
  p.closest('.messagePreview')?.classList.remove('emptyPreview');
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text);return true}catch{}
  try{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();return ok}catch{return false}
}
function toast(t){const el=q('#toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
window.copyBookingMessage=async id=>{const a=target(id);if(!a)return;remember(a.id);toast(await copyText(bookingText(a))?(isEN()?'Booking message copied 💜':'預約訊息已複製 💜'):(isEN()?'Could not copy booking message':'未能複製預約訊息'))};
window.shareBookingMessage=async id=>{const a=target(id);if(!a)return;remember(a.id);const text=bookingText(a);if(navigator.share){try{await navigator.share({text});return}catch(e){if(e&&e.name==='AbortError')return}}toast(await copyText(text)?(isEN()?'Copied — ready to paste':'已複製，可貼到 WhatsApp'):(isEN()?'Could not open sharing':'未能開啟分享'))};
function icsDate(d){return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00'}
function icsClean(v){return String(v||'').replace(/([,;\\])/g,'\\$1').replace(/\n/g,'\\n')}
function onlineLabel(a){return ({zoom:'Zoom',meet:'Google Meet',teams:'Microsoft Teams',whatsapp:'WhatsApp Video Call',facetime:'FaceTime',other:isEN()?'Other online':'其他線上方式'})[a.onlineMethod]||(isEN()?'Online Coaching':'線上 Coaching')}
function calendarLocation(a){
  if(a.mode!=='online')return a.place||'';
  if(a.link)return a.link;
  const c=a.onlineContact||a.phone||'';
  return c?`${onlineLabel(a)} · ${c}`:onlineLabel(a);
}
function addCalendar(id){
  const a=target(id);if(!a||!a.date||!a.time)return;
  remember(a.id);
  const start=new Date(`${a.date}T${a.time}:00`);
  if(Number.isNaN(start.getTime()))return;
  const end=new Date(start.getTime()+Number(a.expect||60)*60000);
  const desc=a.mode==='online'?onlineLabel(a):(isEN()?'In-person Coaching':'面對面 Coaching');
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Coaching Journey//EN','BEGIN:VEVENT',`UID:${icsClean(a.id)}@coaching-journey`,`DTSTART:${icsDate(start)}`,`DTEND:${icsDate(end)}`,`SUMMARY:${icsClean('Coaching｜'+(a.name||''))}`,`LOCATION:${icsClean(calendarLocation(a))}`,`DESCRIPTION:${icsClean(desc)}`,'END:VEVENT','END:VCALENDAR'];
  const u=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}));
  const l=document.createElement('a');l.href=u;l.download=`Coaching-${a.name||'appointment'}-${a.date}.ics`;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);
}
window.addAppointmentToCalendarV29=addCalendar;
window.calendar=id=>addCalendar(id);
function enhanceSaved(){
  const card=q('#saved .card');if(!card)return;
  const a=savedInfoTarget()||target();if(a)remember(a.id);
  refreshPreview(a?.id);
  const cal=qa('#saved button').find(b=>(b.getAttribute('onclick')||'').includes('calendar')||/Apple.*(?:日曆|Calendar)|(?:日曆|Calendar).*Apple/i.test(b.textContent));
  if(cal){
    cal.id='v29CalendarSaved';
    cal.textContent=isEN()?'Add to Apple Calendar':'加入 Apple 日曆';
    cal.onclick=()=>addCalendar();
    const edit=q('#v20EditSaved');
    if(edit)edit.insertAdjacentElement('afterend',cal);else q('#savedInfo')?.insertAdjacentElement('afterend',cal);
    cal.style.marginTop='9px';
  }
}
function enhanceRecords(){
  if(!q('#upTab')?.classList.contains('sel'))return;
  const arr=upcoming(),cards=qa('#recordList .item');
  cards.forEach((card,i)=>{
    const a=arr[i];if(!a)return;
    let holder=card.querySelector('.v15Quick');
    if(!holder){holder=document.createElement('div');holder.className='v15Quick v22Actions';card.appendChild(holder)}
    if(holder.querySelector('.v29CalendarBtn'))return;
    const b=document.createElement('button');
    b.type='button';b.className='miniBtn v29CalendarBtn';b.textContent=isEN()?'Add to Calendar':'加入日曆';
    b.onclick=e=>{e.preventDefault();e.stopPropagation();addCalendar(a.id)};
    const cancel=holder.querySelector('.v22CancelBtn');
    if(cancel)holder.insertBefore(b,cancel);else holder.appendChild(b);
  });
}
const form=q('#apptForm');
if(form)form.addEventListener('submit',()=>{
  const editing=q('#appointment')?.classList.contains('v20-editing');
  if(editing)return;
  const a=newestUpcoming();
  if(a){remember(a.id);refreshPreview(a.id)}
  setTimeout(()=>{const x=newestUpcoming();if(x){remember(x.id);refreshPreview(x.id)}},45);
});
const baseEdit=window.editAppointmentV20;
if(typeof baseEdit==='function')window.editAppointmentV20=function(id){remember(id);return baseEdit.apply(this,arguments)};
const baseShow=window.show;
if(typeof baseShow==='function')window.show=function(id){
  const r=baseShow.apply(this,arguments);
  setTimeout(()=>{if(id==='saved')enhanceSaved();if(id==='records')enhanceRecords()},25);
  return r;
};
const baseSetTab=window.setTab;
if(typeof baseSetTab==='function')window.setTab=function(v){const r=baseSetTab.apply(this,arguments);if(v==='upcoming')setTimeout(enhanceRecords,25);return r};
setTimeout(()=>{if(q('#saved')?.classList.contains('active'))enhanceSaved();if(q('#records')?.classList.contains('active'))enhanceRecords()},80);
})();
