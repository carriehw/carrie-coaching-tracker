(()=>{
'use strict';
const DB='coaching_tracker_v3';
const LANG='coaching_lang_v1';
const q=s=>document.querySelector(s);
let editingIdV28=null;
let pendingNewV28=null;
const read=()=>{try{return JSON.parse(localStorage.getItem(DB)||'{}')}catch{return {items:[]}}};
const write=s=>localStorage.setItem(DB,JSON.stringify(s));
const isEN=()=>localStorage.getItem(LANG)==='en';
const itemById=id=>(read().items||[]).find(x=>x.id===id);
const latestUpcoming=()=>((read().items||[]).filter(x=>x.status==='upcoming').sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]);
const copy=()=>isEN()?{
  platform:'Online method',link:'Meeting link',contact:'Contact details (optional)',hintLink:'You can add or update the link later.',hintWhatsApp:'Leave blank to use the contact phone above.',hintFaceTime:'Phone, Apple ID or email. Leave blank if you will contact them directly.',hintOther:'For example: WeChat, LINE, Telegram, or other contact details.',other:'Other',choose:'Choose a method'
}:{
  platform:'線上方式',link:'會議連結',contact:'聯絡方式（選填）',hintLink:'連結亦可以稍後再補上或修改。',hintWhatsApp:'如留空，會沿用上面填寫的聯絡電話。',hintFaceTime:'可填電話、Apple ID 或 Email；如你會直接聯絡對方亦可留空。',hintOther:'例如 WeChat、LINE、Telegram 或其他聯絡資料。',other:'其他',choose:'選擇線上方式'
};
const methodName=v=>({zoom:'Zoom',meet:'Google Meet',teams:'Microsoft Teams',whatsapp:'WhatsApp Video Call',facetime:'FaceTime',other:isEN()?'Other':'其他'})[v]||'';
function inferMethod(a){
  if(a?.onlineMethod)return a.onlineMethod;
  const link=String(a?.link||'').toLowerCase();
  if(link.includes('zoom.'))return'zoom';
  if(link.includes('meet.google.'))return'meet';
  if(link.includes('teams.')||link.includes('microsoft.com'))return'teams';
  return'other';
}
function ensureUI(){
  const host=q('#onlineField');if(!host||q('#onlineMethodV28'))return;
  const oldLink=q('#link')?.value||'';
  const t=copy();
  host.innerHTML=`<div class="v28OnlineBlock"><label for="onlineMethodV28">${t.platform}</label><select id="onlineMethodV28"><option value="zoom">Zoom</option><option value="meet">Google Meet</option><option value="teams">Microsoft Teams</option><option value="whatsapp">WhatsApp Video Call</option><option value="facetime">FaceTime</option><option value="other">${t.other}</option></select><div id="onlineLinkWrapV28" class="v28OnlineSub"><label for="link">${t.link}</label><input id="link" type="url" inputmode="url" placeholder="https://"><div id="onlineLinkHintV28" class="v28OnlineHint">${t.hintLink}</div></div><div id="onlineContactWrapV28" class="v28OnlineSub hidden"><label id="onlineContactLabelV28" for="onlineContactV28">${t.contact}</label><input id="onlineContactV28" type="text" autocomplete="off"><div id="onlineContactHintV28" class="v28OnlineHint"></div></div></div>`;
  q('#link').value=oldLink;
  q('#onlineMethodV28').addEventListener('change',updateMethodUI);
  updateMethodUI();
}
function updateMethodUI(){
  ensureUI();
  const v=q('#onlineMethodV28')?.value||'zoom',t=copy();
  const linkWrap=q('#onlineLinkWrapV28'),contactWrap=q('#onlineContactWrapV28'),label=q('#onlineContactLabelV28'),hint=q('#onlineContactHintV28'),contact=q('#onlineContactV28');
  const usesLink=['zoom','meet','teams'].includes(v);
  linkWrap?.classList.toggle('hidden',!usesLink);
  contactWrap?.classList.toggle('hidden',usesLink);
  if(!usesLink&&label&&hint){
    if(v==='whatsapp'){label.textContent=isEN()?'WhatsApp contact (optional)':'WhatsApp 聯絡方式（選填）';hint.textContent=t.hintWhatsApp;if(contact)contact.placeholder=isEN()?'Phone number if different from above':'如不同於上面電話，可在此填寫';}
    else if(v==='facetime'){label.textContent=isEN()?'FaceTime contact (optional)':'FaceTime 聯絡方式（選填）';hint.textContent=t.hintFaceTime;if(contact)contact.placeholder=isEN()?'Phone / Apple ID / email':'電話 / Apple ID / Email';}
    else{label.textContent=t.contact;hint.textContent=t.hintOther;if(contact)contact.placeholder=isEN()?'Platform or contact details':'平台或聯絡資料';}
  }
}
function resetOnline(){ensureUI();q('#onlineMethodV28').value='zoom';q('#link').value='';q('#onlineContactV28').value='';updateMethodUI()}
function loadOnline(a){
  ensureUI();if(!a)return resetOnline();
  q('#onlineMethodV28').value=inferMethod(a);
  q('#link').value=a.link||'';
  q('#onlineContactV28').value=a.onlineContact||'';
  updateMethodUI();
}
function currentData(){
  ensureUI();
  const method=q('#onlineMethodV28')?.value||'zoom';
  const usesLink=['zoom','meet','teams'].includes(method);
  if(!usesLink&&q('#link'))q('#link').value='';
  return {onlineMethod:method,onlineContact:usesLink?'':(q('#onlineContactV28')?.value||'').trim()};
}
function patchItem(id,data){
  if(!id)return;const s=read(),a=(s.items||[]).find(x=>x.id===id);if(!a)return;
  if(a.mode==='online')Object.assign(a,data);else{delete a.onlineMethod;delete a.onlineContact;}
  write(s);
}
const baseNew=window.newAppointment;
if(typeof baseNew==='function')window.newAppointment=function(){editingIdV28=null;const r=baseNew.apply(this,arguments);setTimeout(resetOnline,0);return r};
const baseEdit=window.editAppointmentV20;
if(typeof baseEdit==='function')window.editAppointmentV20=function(id){editingIdV28=id;const a=itemById(id);const r=baseEdit.apply(this,arguments);setTimeout(()=>loadOnline(a),0);return r};
ensureUI();
const form=q('#apptForm');
if(form)form.addEventListener('submit',()=>{
  const offline=q('#offline')?.classList.contains('sel');
  const data=offline?{}:currentData();
  if(editingIdV28){patchItem(editingIdV28,data);return}
  pendingNewV28=data;
  setTimeout(()=>{const a=latestUpcoming();if(a&&pendingNewV28){patchItem(a.id,pendingNewV28);pendingNewV28=null;refreshPreviewV28(a.id)}},20);
},true);
function fmtDate(d){if(!d)return'';const x=new Date(d+'T00:00:00');return `${x.getFullYear()}年${x.getMonth()+1}月${x.getDate()}號`}
function duration(m){m=Number(m||0);if(m<60)return`${m}分鐘`;if(m===60)return'1小時';if(m%60===0)return`${m/60}小時`;return`${Math.floor(m/60)}小時${m%60}分鐘`}
function bookingMessage(a){
  if(!a)return'';
  const name=a.name||'';
  let detail='';
  if(a.mode==='online'){
    if(a.onlineMethod){
      const platform=methodName(a.onlineMethod);
      const method=`線上 · ${platform}`;
      if(['zoom','meet','teams'].includes(a.onlineMethod))detail=`- 見面方式：${method}\n- 地點/鏈結：${a.link||'待提供'}`;
      else if(a.onlineMethod==='whatsapp'){
        const c=a.onlineContact||a.phone||'';detail=`- 見面方式：${method}${c?`\n- 聯絡方式：${c}`:''}`;
      }else if(a.onlineMethod==='facetime'){
        const c=a.onlineContact||a.phone||'';detail=`- 見面方式：${method}${c?`\n- 聯絡方式：${c}`:''}`;
      }else{
        const c=a.onlineContact||a.link||'';detail=`- 見面方式：${method}${c?`\n- 聯絡方式：${c}`:''}`;
      }
    }else detail=`- 見面方式：線上會面${a.link?`\n- 地點/鏈結：${a.link}`:''}`;
  }else detail=`- 見面方式：面對面\n- 地點/鏈結：${a.place||''}`;
  return `感謝${name}嘅信任💜，以下係booking詳情：\n- 日期：${fmtDate(a.date)}\n- 時間：${a.time||''}（大概${duration(a.expect)}）\n${detail}\n\n期待同${name}見面 🥰\n\n溫馨提示：Coaching 同平時隨性嘅傾偈有啲唔同，呢個係一個探索嘅旅程。過程中我唔會直接畀答案，而係會用一個陪伴同支持嘅角色同你一齊行。\n我會堅守保密原則，呢度係一個安全、冇批判嘅空間，到時只需要放輕鬆，帶住一個開放、坦誠嘅心，呈現最真實嘅自己就可以啦 🫶🏻\n\n到時見 💜`;
}
async function copyText(text){try{await navigator.clipboard.writeText(text);return true}catch{}try{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();return ok}catch{return false}}
function toast(t){const el=q('#toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1700)}
function target(id){return itemById(id)||latestUpcoming()}
function refreshPreviewV28(id){const a=target(id),p=q('#bookingPreviewV15');if(a&&p){p.textContent=bookingMessage(a);p.closest('.messagePreview')?.classList.remove('emptyPreview')}}
window.bookingMessageV28=bookingMessage;
window.copyBookingMessage=async id=>{const a=target(id);if(!a)return;toast(await copyText(bookingMessage(a))?'預約訊息已複製 💜':'未能複製預約訊息')};
window.shareBookingMessage=async id=>{const a=target(id);if(!a)return;const text=bookingMessage(a);if(navigator.share){try{await navigator.share({text});return}catch(e){if(e&&e.name==='AbortError')return}}toast(await copyText(text)?'已複製，可貼到 WhatsApp':'未能開啟分享')};
const oldShow=window.show;
if(typeof oldShow==='function')window.show=function(id){const r=oldShow.apply(this,arguments);if(id==='appointment')setTimeout(ensureUI,0);if(id==='saved')setTimeout(()=>refreshPreviewV28(),35);return r};
setTimeout(()=>{if(q('#saved')?.classList.contains('active'))refreshPreviewV28()},60);
})();
