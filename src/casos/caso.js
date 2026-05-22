// src/casos/caso.js - Animaciones e interactividad avanzada para casos de estudio de NRVERTEX
// Nota: La transición de entrada (colapso del panel) la maneja main.js en DOMContentLoaded.

document.addEventListener('DOMContentLoaded', () => {

  // ============ 1. BARRA DE PROGRESO DE LECTURA (Delegado a src/fx/readingProgress.js) ============

  // ============ 2. ACTIVACIÓN DE TIMELINE ON SCROLL ============
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length > 0) {
    const timelineObserverOptions = {
      root: null,
      threshold: 0.3, // Activa cuando el 30% del item es visible
      rootMargin: '0px 0px -80px 0px'
    };

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-active');
          // Una vez activado, podemos dejar de observarlo para optimizar rendimiento
          timelineObserver.unobserve(entry.target);
        }
      });
    }, timelineObserverOptions);

    timelineItems.forEach((item, index) => {
      // Agregar delay dinámico por orden
      const card = item.querySelector('.timeline-card');
      if (card) {
        card.style.transitionDelay = `${index * 80}ms`;
      }
      timelineObserver.observe(item);
    });
  }


  // ============ 3. ANIMACIÓN DE CONTADORES NUMÉRICOS ============
  const animateCounter = (element) => {
    const targetStr = element.getAttribute('data-target');
    if (!targetStr) return;

    const target = parseFloat(targetStr);
    if (isNaN(target)) return;

    const duration = 1800; // Duración máxima en ms
    const startTime = performance.now();

    const updateCounter = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutExpo (salida suave y exponencial)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = ease * target;

      if (Number.isInteger(target)) {
        element.textContent = Math.floor(currentVal).toLocaleString('es-AR').replace(/,/g, '.');
      } else {
        element.textContent = currentVal.toFixed(1);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Asegurar que termine en el valor exacto
        element.textContent = target.toLocaleString('es-AR').replace(/,/g, '.');
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const counterElements = document.querySelectorAll('.large-metric-card .metric-num');
  
  if (counterElements.length > 0) {
    const counterObserverOptions = {
      root: null,
      threshold: 0.5 // Se activa cuando el 50% de la métrica ingresa a pantalla
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, counterObserverOptions);

    counterElements.forEach(el => counterObserver.observe(el));
  }


  // ============ 4. HOVER DINÁMICO EN MÉTRICAS HERO (MICRO-INTERACCIONES) ============
  const heroMetricItems = document.querySelectorAll('.hero-metric-item');
  heroMetricItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const val = item.querySelector('.hero-metric-val');
      if (val) {
        val.style.transform = 'scale(1.05)';
        val.style.textShadow = '0 0 15px rgba(157, 92, 245, 0.4)';
        val.style.transition = 'transform 0.3s ease, text-shadow 0.3s ease';
      }
    });

    item.addEventListener('mouseleave', () => {
      const val = item.querySelector('.hero-metric-val');
      if (val) {
        val.style.transform = 'scale(1)';
        val.style.textShadow = 'none';
      }
    });
  });

});
