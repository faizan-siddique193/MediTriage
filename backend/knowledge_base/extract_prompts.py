import zipfile, re, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
z = os.path.join(ROOT, 'MediTriage_Fixed_Copilot_Prompts.docx')
out = os.path.join(os.path.dirname(__file__), 'medi_prompts.txt')
with zipfile.ZipFile(z) as docx:
    xml = docx.read('word/document.xml').decode('utf-8')
    text = re.sub('<[^<]+>', ' ', xml)
    open(out, 'w', encoding='utf-8').write(text)
print('wrote', out)
