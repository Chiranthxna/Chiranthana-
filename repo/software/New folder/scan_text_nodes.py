from pathlib import Path
import re

def scan_file(filename):
    text = Path(filename).read_text(encoding='utf-8')
    fragments = re.findall(r'>\s*([^<]+?)\s*<', text)
    results = []
    for frag in fragments:
        stripped = frag.strip()
        if not stripped:
            continue
        if re.fullmatch(r'[#%\d\s.,:;!?()\[\]"\'\-\/\\]+', stripped):
            continue
        # ignore HTML entities and attribute text blocks
        if stripped.startswith('&') and stripped.endswith(';'):
            continue
        # ignore when tag has data-i18n attribute on same opening tag
        # approximate by checking if previous 200 chars contain data-i18n before last '>'
        idx = text.find('>' + frag + '<')
        if idx != -1:
            prev = text[max(0, idx-200):idx]
            if 'data-i18n=' in prev:
                continue
        results.append(stripped)
    return sorted(set(results))

for fname in ['health-risks.html','safety-measures.html']:
    print('---', fname)
    for line in scan_file(fname):
        print(line)
