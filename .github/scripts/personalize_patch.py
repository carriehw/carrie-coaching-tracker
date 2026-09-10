from pathlib import Path
import re

p = Path('index.html')
s = p.read_text(encoding='utf-8')

css = r'''
/* UI_POLISH_V3 */
html,body{width:100%;max-width:100%;overflow-x:hidden;-webkit-text-size-adjust:100%}
body{background:#f7f6fb}
.app{width:100%;max-width:520px;padding:calc(18px + env(safe-area-inset-top)) 16px calc(82px + env(safe-area-inset-bottom))}
.card{border:1px solid #ece8f2;border-radius:24px;padding:18px 16px 20px;box-shadow:0 8px 28px rgba(63,48,100,.055)}
.support{border-radius:20px;padding:14px 15px;color:#3f3947;background:linear-gradient(135deg,#f8e3eb,#eee9ff);border:1px solid #eee6f4}
label{font-size:14px;line-height:1.3;margin:15px 0 8px;color:#25212b;letter-spacing:.01em}
input,select,textarea{display:block;width:100%;max-width:100%;min-width:0;border:1.5px solid #dfdbe7;background:#fff;border-radius:16px;color:#211d27;font-size:16px;line-height:1.25;box-shadow:0 1px 0 rgba(41,29,70,.02);-webkit-tap-highlight-color:transparent}
input,select{height:54px;min-height:54px;padding:0 14px}
textarea{min-height:108px;padding:14px;line-height:1.5}
input::placeholder,textarea::placeholder{color:#98939e;opacity:1}
input:focus,select:focus,textarea:focus{border-color:#8f7bea;box-shadow:0 0 0 4px rgba(114,91,226,.10)}
input[type=date],input[type=time]{-webkit-appearance:none;appearance:none;min-height:54px;height:54px;padding:0 14px;background:#fff}
input[type=date]::-webkit-date-and-time-value,input[type=time]::-webkit-date-and-time-value{text-align:left;min-height:20px}
select{-webkit-appearance:auto;appearance:auto;padding-right:34px}
#apptForm .two:not(.seg){grid-template-columns:1fr;gap:0}
#apptForm .seg{grid-template-columns:1fr 1fr;gap:10px}
.seg button{min-height:50px;border-radius:15px;border:1.5px solid #ded9e8;background:#fff;color:#4b4652;font-size:15px}
.seg button.sel{background:linear-gradient(135deg,#6f57df,#7a63e5);border-color:#6f57df;color:#fff;box-shadow:0 6px 14px rgba(111,87,223,.18)}
.formSectionTitle{display:flex;align-items:center;gap:10px;margin:5px 0 12px;padding:11px 12px;border-radius:16px;background:#f7f4ff;border:1px solid #ece6fb;color:#3f3658;font-weight:800;font-size:14px}
.formSectionTitle span{display:grid;place-items:center;width:30px;height:30px;flex:0 0 30px;border-radius:10px;background:#e9e2ff;color:#6751cf;font-size:12px}
.formSectionTitle.sectionGap{margin-top:24px}
.lockLabel{text-align:left;margin:0 0 7px;font-size:12px;color:#514b5f}
.lockName{margin-bottom:12px}.lockName input{height:52px;text-align:left;font-size:16px}
.btn{min-height:50px;border-radius:16px;font-size:15px}
.primary{background:linear-gradient(135deg,#6e55de,#8d78ea)}
.tabs{padding:5px 10px calc(5px + env(safe-area-inset-bottom));border-top:1px solid #ebe7f0;box-shadow:0 -7px 24px rgba(45,35,76,.05)}
.tab{min-height:50px;padding:4px 2px;font-size:11px;border-radius:14px}
.tab b{height:22px;display:grid;place-items:center;margin:0 auto 2px;font-size:0}
.tab svg{width:21px;height:21px;stroke:currentColor;stroke-width:1.9;fill:none;stroke-linecap:round;stroke-linejoin:round}
.tab.active{color:#654fd2;background:#f6f3ff}
@media(max-width:380px){.app{padding-left:13px;padding-right:13px}.heroRow{align-items:flex-start}.ring{width:92px;height:92px}.ring:after{width:70px;height:70px}.hero h2{font-size:21px}.stats{gap:7px}.stat b{font-size:20px}}
'''
if '/* UI_POLISH_V3 */' not in s:
    s = s.replace('</style>', css + '\n</style>', 1)

old = '<div id="lock" class="lock"><div class="lockCard"><div class="lockMark">🔐</div><h2 id="pinTitle">解鎖 Coaching Journey</h2><p id="pinHelp">你的 Coaching 資料只會儲存在這部裝置，不會上傳到 GitHub。</p><div class="pinWrap">'
new = '<div id="lock" class="lock"><div class="lockCard"><div class="lockMark">🔐</div><h2 id="pinTitle">歡迎來到 Coaching Journey</h2><p id="pinHelp">你的 Coaching 資料只會儲存在這部裝置，不會上傳到 GitHub。</p><div id="nameField" class="lockName"><label class="lockLabel" for="userName">你的名稱</label><input id="userName" type="text" maxlength="30" autocomplete="name" placeholder="例如：Carrie"></div><div class="pinWrap">'
if old in s:
    s = s.replace(old, new, 1)

s = s.replace('<h1>Hi Carrie 👋</h1><p>你正在用對話，創造更有意義的影響 💜</p>', '<h1 id="welcomeName">Hi 👋</h1><p>每一節 Coaching，都在累積你的經驗與信心 💜</p>', 1)
s = s.replace('第一步已經行咗出嚟。', '旅程已經開始，一步一步累積。')
s = s.replace('💜 <b>第一步｜先記低預約資料</b><br>Coach 完之後，再返嚟補完整紀錄。', '💜 <b>先記下預約資料</b><br>Coaching 完成後，再回來補上完整紀錄。')
s = s.replace('又向 100 小時行近一步。你只需要一節一節累積 💜', '又向 100 小時靠近一步。每一節，都算數。💜')
s = s.replace('今次談話主題', '本節 Coaching 主題')
s = s.replace('對方已同意錄音／錄影？', '如有錄音／錄影，對方是否已同意？')
s = s.replace('Coachee 給你的 Feedback', 'Coachee 的 Feedback')
s = s.replace('可貼上對方的文字 Feedback', '可以貼上對方的文字 Feedback')
s = s.replace('今次做得好的是？下次想改善的是？我學到什麼？', '這次做得好的是？下次想改善什麼？我學到什麼？')
s = s.replace('付費形式 <span class="req">*</span>', '交換／付費方式 <span class="req">*</span>')
s = s.replace('Coach 完，完成紀錄', '完成後補紀錄')
s = s.replace('測試版資料只儲存在這部裝置。建議定期匯出備份。', '目前資料只儲存在這部裝置。建議定期匯出備份。')
s = s.replace('🔐 Coaching 資料只存在你這部裝置；GitHub 只存放 App 程式。', '🔐 你的 Coaching 資料只會儲存在這部裝置，不會公開上傳。')

marker = '<form id="apptForm" class="card">'
if marker in s and 'Coachee 基本資料</div>' not in s:
    s = s.replace(marker, marker + '<div class="formSectionTitle"><span>01</span><div>Coachee 基本資料</div></div>', 1)
target = '<label>日期 <span class="req">*</span></label>'
if target in s and '預約安排</div>' not in s:
    s = s.replace(target, '<div class="formSectionTitle sectionGap"><span>02</span><div>預約安排</div></div>' + target, 1)
target = '<label>預計談話主題（選填）</label>'
if target in s and '談話準備</div>' not in s:
    s = s.replace(target, '<div class="formSectionTitle sectionGap"><span>03</span><div>談話準備</div></div>' + target, 1)

marker = '<form id="completeForm" class="card">'
if marker in s and '本節紀錄</div>' not in s:
    s = s.replace(marker, marker + '<div class="formSectionTitle"><span>01</span><div>本節紀錄</div></div>', 1)
target = '<label>錄音／錄影</label>'
if target in s and '錄音與同意</div>' not in s:
    s = s.replace(target, '<div class="formSectionTitle sectionGap"><span>02</span><div>錄音與同意</div></div>' + target, 1)
target = '<label>Coachee 的 Feedback</label>'
if target in s and 'Feedback 與反思</div>' not in s:
    s = s.replace(target, '<div class="formSectionTitle sectionGap"><span>03</span><div>Feedback 與反思</div></div>' + target, 1)
target = '<label>交換／付費方式 <span class="req">*</span></label>'
if target in s and '交換／付費紀錄</div>' not in s:
    s = s.replace(target, '<div class="formSectionTitle sectionGap"><span>04</span><div>交換／付費紀錄</div></div>' + target, 1)

s = s.replace('<div class="card"><label>ACC 目標總時數</label>', '<div class="card"><label>你的名稱</label><input id="settingsName" type="text" maxlength="30" autocomplete="name"><label>ACC 目標總時數</label>', 1)

oldnav = '<nav class="tabs"><button class="tab active" data-s="home" onclick="show(\'home\')"><b>⌂</b>主頁</button><button class="tab" data-s="records" onclick="show(\'records\')"><b>▣</b>預約</button><button class="tab" data-s="stats" onclick="show(\'stats\')"><b>▥</b>統計</button><button class="tab" data-s="settings" onclick="show(\'settings\')"><b>⚙</b>設定</button></nav>'
newnav = '''<nav class="tabs"><button class="tab active" data-s="home" onclick="show('home')"><b><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/></svg></b>主頁</button><button class="tab" data-s="records" onclick="show('records')"><b><svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/></svg></b>預約</button><button class="tab" data-s="stats" onclick="show('stats')"><b><svg viewBox="0 0 24 24"><path d="M5 19V10M12 19V5M19 19v-7"/></svg></b>統計</button><button class="tab" data-s="settings" onclick="show('settings')"><b><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.08-1l2-1.5-2-3.4-2.45 1A7 7 0 0 0 14.7 6L14.4 3h-4.8l-.3 3a7 7 0 0 0-1.77 1.1l-2.45-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .34.03.67.08 1l-2 1.5 2 3.4 2.45-1A7 7 0 0 0 9.3 18l.3 3h4.8l.3-3a7 7 0 0 0 1.77-1.1l2.45 1 2-3.4-2-1.5c.05-.33.08-.66.08-1Z"/></svg></b>設定</button></nav>'''
if oldnav in s:
    s = s.replace(oldnav, newnav, 1)

s = s.replace("const DB='coaching_tracker_v2',PIN='coaching_pin_v1';", "const DB='coaching_tracker_v2',PIN='coaching_pin_v1',USER='coaching_user_name_v1';", 1)
s = s.replace("function render(){let h=total()", "function render(){let user=(localStorage.getItem(USER)||'').trim();if($('welcomeName'))$('welcomeName').textContent=user?`Hi ${user} 👋`:'Hi 👋';if($('settingsName'))$('settingsName').value=user;let h=total()", 1)
s = s.replace("p>=100?'你做到啦！🎉':p>=75?'最後直路，繼續行。':p>=50?'已經過咗一半！':p>=25?'你已經建立緊節奏。':'旅程已經開始，一步一步累積。'", "p>=100?'100 小時達成！🎉':p>=75?'進入最後直路，繼續前進。':p>=50?'已經走過一半，繼續累積。':p>=25?'你已經建立起自己的節奏。':'旅程已經開始，一步一步累積。'", 1)
oldq = "['今日唔需要完成餘下時數，<strong>只需要約下一個人。</strong>','每一次認真聆聽，都係你成為更好 Coach 嘅證據。🌱','一節一節累積，100 小時就會由目標變成紀錄。💜','繼續出現、繼續練習。<strong>你比昨日更接近 ACC。</strong>']"
newq = "['今日唔需要完成所有餘下時數，<strong>專注下一節 Coaching 就好。</strong>','每一次認真聆聽，都在累積你作為 Coach 的能力。🌱','一節一節累積，100 小時會由目標慢慢變成紀錄。💜','持續出現、持續練習。<strong>你比昨天更接近 ACC。</strong>']"
s = s.replace(oldq, newq, 1)
s = s.replace("'暫時未有預約。<br>今日可以由約下一個人開始 🌱'", "'暫時未有預約。<br>可以由安排下一節 Coaching 開始 🌱'", 1)
s = s.replace("`距離目標仲有 ${r.toFixed(1).replace('.0','')} 小時。每完成一次，都係真正嘅累積。`", "`距離目標還有 ${r.toFixed(1).replace('.0','')} 小時。每完成一節，都在累積你的 Coaching 經驗。`", 1)
s = s.replace("`今次已累積 <b>${mins(a.actual)} 小時</b>。<br>你而家共有 <b>${h} 小時</b>，距離目標仲有 <b>${r.toFixed(1).replace('.0','')} 小時</b>。💜`", "`本節已累積 <b>${mins(a.actual)} 小時</b>。<br>你目前共有 <b>${h} 小時</b>，距離目標還有 <b>${r.toFixed(1).replace('.0','')} 小時</b>。💜`", 1)
s = s.replace("function saveSettings(){state.target=+$('target').value||100;state.base=+$('base').value||0;save();toast('設定已儲存 💜')}", "function saveSettings(){let n=($('settingsName')?.value||'').trim();if(n)localStorage.setItem(USER,n);state.target=+$('target').value||100;state.base=+$('base').value||0;save();toast('設定已儲存 💜')}", 1)

pattern = r"function prepareLock\(\)\{.*?\}function lockNow\(\)\{.*?\}"
replacement = r'''function prepareLock(){let r=pinRec(),user=(localStorage.getItem(USER)||'').trim(),nf=$('nameField');if(sessionStorage.getItem('coach_unlocked')==='1'){$('lock').classList.add('hidden');return}if(!r){$('pinTitle').textContent='開始你的 ACC Coaching Journey';$('pinHelp').textContent='先輸入你的名稱，再設定 4–6 位數字 PIN。之後首頁會用你的名稱顯示。';nf.classList.remove('hidden');$('userName').value=user;$('pinBtn').textContent='設定並開始'}else if(!user){$('pinTitle').textContent='歡迎返嚟';$('pinHelp').textContent='先輸入你的名稱，再用現有 PIN 解鎖。';nf.classList.remove('hidden');$('pinBtn').textContent='儲存名稱並解鎖'}else{$('pinTitle').textContent=`歡迎返嚟，${user}`;$('pinHelp').textContent='輸入你的私人 PIN 解鎖。';nf.classList.add('hidden');$('userName').value=user;$('pinBtn').textContent='解鎖'}}async function handlePin(){let v=$('pin').value.trim(),r=pinRec(),stored=(localStorage.getItem(USER)||'').trim(),typed=($('userName')?.value||'').trim();$('pinError').textContent='';if(!stored&&!typed){$('pinError').textContent='請先輸入你的名稱';return}if(!/^\d{4,6}$/.test(v)){$('pinError').textContent='請輸入 4–6 位數字 PIN';return}if(!r){let sl=salt();localStorage.setItem(PIN,JSON.stringify({salt:sl,hash:await hash(v,sl)}));localStorage.setItem(USER,typed);sessionStorage.setItem('coach_unlocked','1');$('lock').classList.add('hidden');render();toast('設定完成，歡迎你 💜')}else if(await hash(v,r.salt)===r.hash){if(!stored&&typed)localStorage.setItem(USER,typed);sessionStorage.setItem('coach_unlocked','1');$('lock').classList.add('hidden');$('pin').value='';render()}else{$('pinError').textContent='PIN 不正確，請再試一次';$('pin').value=''}}function lockNow(){sessionStorage.removeItem('coach_unlocked');$('lock').classList.remove('hidden');$('pin').value='';prepareLock()}'''
s2, n = re.subn(pattern, replacement, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('Could not replace lock functions')
s = s2

p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
if sw.exists():
    t = sw.read_text(encoding='utf-8')
    t = re.sub(r"coaching-v\d+", "coaching-v8", t, count=1)
    sw.write_text(t, encoding='utf-8')
