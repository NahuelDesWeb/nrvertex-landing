with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

wa_link = 'href="https://wa.me/5491172383806?text=Hola,%20quiero%20agendar%20un%20llamado%20para%20escalar%20mi%20negocio." target="_blank"'
content = content.replace(wa_link, 'href="agenda.html"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
