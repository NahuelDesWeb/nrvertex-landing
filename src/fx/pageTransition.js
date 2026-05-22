// src/fx/pageTransition.js
// ─── TRANSICIÓN CINEMATOGRÁFICA DE PANEL LATERAL ───────────────────────────
// Enfoque: 100% CSS transitions. Sin GSAP. Sin estado complejo.
// Funciona en desktop y móvil, en cualquier orden de carga.

// ── Construir y/o obtener el panel DOM ───────────────────────────────────────
function getOrBuildPanel() {
  let panel = document.getElementById('nrv-transition-panel');
  if (panel) return panel;

  panel = document.createElement('div');
  panel.id = 'nrv-transition-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="nrv-tp-inner">
      <div class="nrv-tp-label">Caso de Éxito</div>
      <div class="nrv-tp-divider"></div>
      <div class="nrv-tp-name" id="nrv-tp-name">—</div>
      <div class="nrv-tp-tag"  id="nrv-tp-tag">Ver caso completo</div>
      <div class="nrv-tp-bar-wrap"><div class="nrv-tp-bar" id="nrv-tp-bar"></div></div>
      <div class="nrv-tp-brand">NRVERTEX</div>
    </div>
    <div class="nrv-tp-stripe"></div>
  `;
  document.body.appendChild(panel);
  return panel;
}

// ── Transición de salida: panel entra desde la derecha ───────────────────────
export function triggerSlideTransition(href, caseName, caseDesc) {
  const panel = getOrBuildPanel();

  const nameEl = panel.querySelector('#nrv-tp-name');
  const tagEl  = panel.querySelector('#nrv-tp-tag');
  const barEl  = panel.querySelector('#nrv-tp-bar');

  if (nameEl) nameEl.textContent = caseName || '—';
  if (tagEl)  tagEl.textContent  = caseDesc  || 'Ver caso completo';

  // Asegurar panel visible pero fuera de pantalla (a la derecha)
  panel.style.cssText = 'display:flex; visibility:visible;';
  panel.classList.remove('nrv-panel--exit');
  panel.classList.remove('nrv-panel--enter');

  // Forzar reflow para que el browser registre la posición inicial
  void panel.offsetWidth;

  // Animar entrada
  panel.classList.add('nrv-panel--enter');

  // Animar la barra de progreso con delay
  if (barEl) {
    barEl.style.transition = 'none';
    barEl.style.transform = 'scaleX(0)';
    setTimeout(() => {
      barEl.style.transition = 'transform 0.9s ease 1.0s';
      barEl.style.transform = 'scaleX(1)';
    }, 20);
  }

  // Navegar cuando el usuario ha apreciado bien la transición (1850ms)
  sessionStorage.setItem('nrv-transition-incoming', '1');
  setTimeout(() => { window.location.href = href; }, 1850);
}

// ── Transición de entrada: panel sale hacia la izquierda ─────────────────────
export function collapsePageTransition() {
  const panel = getOrBuildPanel();

  // Panel ya está cubriendo la pantalla: fijarlo en enter sin transición
  panel.style.cssText = 'display:flex; visibility:visible;';
  panel.classList.remove('nrv-panel--exit');
  panel.classList.add('nrv-panel--enter');

  // Restaurar nombre del caso guardado
  const savedName = sessionStorage.getItem('nrv-transition-case-name') || '';
  const savedDesc = sessionStorage.getItem('nrv-transition-case-desc') || '';
  const nameEl = panel.querySelector('#nrv-tp-name');
  const tagEl  = panel.querySelector('#nrv-tp-tag');
  if (nameEl && savedName) nameEl.textContent = savedName;
  if (tagEl  && savedDesc) tagEl.textContent  = savedDesc;
  sessionStorage.removeItem('nrv-transition-case-name');
  sessionStorage.removeItem('nrv-transition-case-desc');

  // Forzar repaint para que el browser vea el panel en posición "enter"
  void panel.offsetWidth;

  // FOUC Prevention: revelar el contenido del sitio web justo antes de deslizar el panel
  document.documentElement.classList.remove('nrv-transition-active');
  const tempStyle = document.getElementById('nrv-fouc-temp-style');
  if (tempStyle) tempStyle.remove();

  // Pequeño delay y luego deslizar hacia la izquierda
  setTimeout(() => {
    panel.classList.add('nrv-panel--exit');
    // Ocultar tras completar la animación de salida
    setTimeout(() => {
      panel.style.display = 'none';
      panel.classList.remove('nrv-panel--enter', 'nrv-panel--exit');
    }, 1350);
  }, 80);
}

// ── Exportar alias para compatibilidad ───────────────────────────────────────
export const collapseSlideTransition = collapsePageTransition;

// ── Inicialización: registrar clicks en tarjetas ─────────────────────────────
export function initPageTransitions() {
  // Pre-construir el panel en el DOM (sin mostrarlo)
  getOrBuildPanel();

  // Wire up tarjetas de casos
  const cards = document.querySelectorAll('.result-card-new[href]');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Permitir Ctrl+Click / Cmd+Click para abrir en nueva pestaña
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      e.preventDefault();
      e.stopImmediatePropagation(); // Bloquear cualquier otro handler (modal, etc.)

      const href = card.getAttribute('href');
      if (!href) return;

      const nameEl = card.querySelector('.result-name, h3, h2');
      const descEl = card.querySelector('.result-description, p');
      const caseName = nameEl ? nameEl.textContent.trim() : 'Caso de Estudio';
      const caseDesc = descEl ? descEl.textContent.trim()  : '';

      // Guardar para mostrar en la página destino
      sessionStorage.setItem('nrv-transition-case-name', caseName);
      sessionStorage.setItem('nrv-transition-case-desc', caseDesc);

      triggerSlideTransition(href, caseName, caseDesc);
    });
  });

  // Soporte genérico [data-page-transition]
  document.querySelectorAll('[data-page-transition]').forEach(el => {
    el.addEventListener('click', e => {
      const href = el.getAttribute('href') || el.dataset.pageTransition;
      if (!href || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const name = el.dataset.transitionName || el.textContent.trim() || 'Caso de Estudio';
      sessionStorage.setItem('nrv-transition-case-name', name);
      triggerSlideTransition(href, name, '');
    });
  });
}
