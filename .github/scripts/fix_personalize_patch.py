from pathlib import Path
p=Path('.github/scripts/personalize_patch.py')
s=p.read_text(encoding='utf-8')
s=s.replace('re.subn(pattern, replacement, s, count=1, flags=re.S)','re.subn(pattern, lambda m: replacement, s, count=1, flags=re.S)')
p.write_text(s,encoding='utf-8')
