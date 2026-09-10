from pathlib import Path
import re
p=Path('index.html')
s=p.read_text(encoding='utf-8')
replacements={
"距離目標仲有":"距離目標還有",
"今日唔需要完成所有餘下時數":"今天不需要完成所有餘下時數",
"暫時未有預約。<br>今日可以由約下一個人開始 🌱":"暫時未有預約。<br>可以由安排下一節 Coaching 開始 🌱",
"暫時未有即將進行嘅預約。":"暫時未有即將進行的預約。",
"完成紀錄會出現喺呢度。":"完成後的紀錄會顯示在這裡。",
"歡迎返嚟":"歡迎回來",
"預計談話主題（選填）":"預計 Coaching 主題（選填）",
"完成節數":"已完成節數",
"不同 Coachee":"Coachee 人數",
"付費／交換小時":"付費／交換時數",
"付費／交換<br>小時":"付費／交換<br>時數"
}
for a,b in replacements.items():
    s=s.replace(a,b)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
if sw.exists():
    t=sw.read_text(encoding='utf-8')
    t=re.sub(r"coaching-v\d+","coaching-v9",t,count=1)
    sw.write_text(t,encoding='utf-8')
