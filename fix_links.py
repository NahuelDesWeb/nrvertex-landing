import os
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('href="#agenda"', 'href="agenda.html"')
content = content.replace('Agendá un llamado', 'Agendá por WhatsApp')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
