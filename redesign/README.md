# Rediseño NRVERTEX (borrador)

Propuesta de rediseño total de la home. Es una página estática e independiente: **no forma parte del build de Vite ni del deploy de Netlify**, así que no afecta al sitio en producción.

- `index.html`: página completa (HTML, CSS y JS en un solo archivo, sin dependencias).
- `img/`: capturas reales de Google de los casos FloreríaLiz y AlbornozObras.
- `media/`: videos verticales (celular 390×844 a 2x) de florerializ.com.ar y albarenas.com.ar, en WebM y MP4, con su póster.

Para verla localmente: `cd redesign && python3 -m http.server 4321` y abrir http://localhost:4321
