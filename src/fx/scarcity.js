export function initScarcity() {
  const elements = document.querySelectorAll('[data-scarcity]');
  if (elements.length === 0) return;

  elements.forEach(el => {
    const rawCupos = el.getAttribute('data-cupos');
    const cupos = parseInt(rawCupos, 10);
    const validCupos = isNaN(cupos) ? 2 : Math.max(0, Math.min(3, cupos));

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const ahora = new Date();
    const mesActual = meses[ahora.getMonth()];

    // Capa 1 (Mes Dinámico)
    const mesEl = el.querySelector('[data-mes]');
    if (mesEl) {
      mesEl.textContent = `${mesActual}`;
    }

    // Capa 3 (Indicadores Visuales de Cupos)
    const cuposTextEl = el.querySelector('[data-cupos-text]');
    if (cuposTextEl) {
      cuposTextEl.textContent = validCupos;
    }

    // Si data-cupos="0", modificar el texto automáticamente
    if (validCupos === 0) {
      const textSpan = el.querySelector('span');
      if (textSpan) {
        textSpan.textContent = "Completo este mes. Reservá tu lugar para el próximo mes. →";
      }
    }

    const dotsEl = el.querySelector('[data-dots]');
    if (dotsEl) {
      const tomados = 3 - validCupos;
      let html = '';
      for (let i = 0; i < 3; i++) {
        if (i < tomados) {
          html += '<span class="nrv-dot nrv-dot--filled"></span>';
        } else {
          html += '<span class="nrv-dot nrv-dot--empty"></span>';
        }
      }
      dotsEl.innerHTML = html;
    }

    // Capa 2 (Contador rAF/Minuto)
    const timerEl = el.querySelector('[data-timer]');
    if (timerEl) {
      const updateTimer = () => {
        const now = new Date();
        const endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0, 23, 59, 59
        );
        const diff = endOfMonth - now;

        if (diff <= 0) {
          timerEl.textContent = 'Cupos renovados';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        timerEl.innerHTML = `<span style="color: rgba(255,255,255,0.75); font-weight: 500;">Cierra en:</span> <strong style="color: #FFFFFF; font-weight: 700;">${days}</strong>d <strong style="color: #FFFFFF; font-weight: 700;">${hours}</strong>h <strong style="color: #FFFFFF; font-weight: 700;">${mins}</strong>m`;
      };

      updateTimer();

      // Remplazo de setInterval usando requestAnimationFrame para resguardar rendimiento
      let lastUpdate = performance.now();
      const tick = (nowTime) => {
        if (nowTime - lastUpdate >= 60000) {
          updateTimer();
          lastUpdate = nowTime;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });

  // Disparar redibujado de elementos flotantes
  window.dispatchEvent(new Event('resize'));
}
