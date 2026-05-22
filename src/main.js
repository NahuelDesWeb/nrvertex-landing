// src/main.js - Optimizaciones de PageSpeed y TBT para NRVERTEX
import { initFormFlow } from './fx/formFlow.js';
import { initScarcity } from './fx/scarcity.js';
import { initSlideshows } from './fx/slideshow.js';
import { initLightbox } from './fx/lightbox.js';
import { initPageTransitions, collapsePageTransition } from './fx/pageTransition.js';

document.addEventListener('DOMContentLoaded', () => {

  // ============ PAGE TRANSITION (PANEL CINEMATOGRÁFICO) ============
  // Se inicializa aquí, en DOMContentLoaded, para capturar clicks ANTES
  // que cualquier otro handler (modal, etc.).
  initPageTransitions();
  if (sessionStorage.getItem('nrv-transition-incoming') === '1') {
    sessionStorage.removeItem('nrv-transition-incoming');
    requestAnimationFrame(() => requestAnimationFrame(() => collapsePageTransition()));
  }


  // ============ LENIS SMOOTH SCROLL (INICIALIZACIÓN DIFERIDA) ============
  const initLenis = () => {
    // Evitar iniciar Lenis en la página de contacto para permitir scroll nativo en el formulario
    if (document.querySelector('.contact-page')) {
      return;
    }
    const runInit = () => {
      import('lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Scroll suave para enlaces ancla vinculados a Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
              e.preventDefault();
              lenis.scrollTo(targetElement);
            }
          });
        });
      }).catch(err => console.warn('Lenis scroll load deferred or skipped:', err));
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => runInit(), { timeout: 2000 });
    } else {
      setTimeout(runInit, 150);
    }
  };
  initLenis();

  // ============ MOBILE MENU LOGIC ============
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-menu-overlay .btn-primary');

  if (mobileMenuBtn && mobileMenuOverlay) {
    const toggleMenu = () => {
      const isOpen = mobileMenuOverlay.classList.contains('open');
      if (isOpen) {
        mobileMenuOverlay.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
      } else {
        mobileMenuOverlay.classList.add('open');
        mobileMenuBtn.classList.add('active');
      }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenuOverlay.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  // ============ FAQ ACCORDION LOGIC ============
  const allFaqs = document.querySelectorAll('details.faq-item');
  allFaqs.forEach(faq => {
    const summary = faq.querySelector('summary');
    
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (faq.classList.contains('closing')) {
        return;
      }
      
      if (faq.hasAttribute('open')) {
        faq.classList.add('closing');
        setTimeout(() => {
          faq.removeAttribute('open');
          faq.classList.remove('closing');
        }, 500);
      } else {
        allFaqs.forEach(otherFaq => {
          if (otherFaq !== faq && otherFaq.hasAttribute('open') && !otherFaq.classList.contains('closing')) {
            otherFaq.classList.add('closing');
            setTimeout(() => {
              otherFaq.removeAttribute('open');
              otherFaq.classList.remove('closing');
            }, 500);
          }
        });
        faq.setAttribute('open', '');
      }
    });
  });

  // ============ FORM MODAL ============
  const formModal = document.getElementById('form-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const ctaTriggers = document.querySelectorAll('.cta-trigger');

  function openModal(e) {
    if (e) e.preventDefault();
    if (formModal) {
      formModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (formModal) {
      formModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (formModal && closeModalBtn) {
    // Excluir tarjetas de casos — tienen su propia navegación via pageTransition
    ctaTriggers.forEach(btn => {
      if (btn.classList.contains('result-card-new')) return;
      btn.addEventListener('click', openModal);
    });
    closeModalBtn.addEventListener('click', closeModal);
    formModal.addEventListener('click', (e) => {
      if (e.target === formModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ============ WHATSAPP FORM SUBMIT ============
  const waForm = document.getElementById('wa-form');
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('f_nombre').value;
      const email = document.getElementById('f_email').value;
      const tel = document.getElementById('f_tel').value;
      const web = document.getElementById('f_web').value || 'No indicó';
      const dueno = document.querySelector('input[name="f_dueno"]:checked')?.value || 'No indicó';
      const obj = document.getElementById('f_obj').value;
      const presupuesto = document.getElementById('f_presupuesto').value;
      const plazo = document.querySelector('input[name="f_plazo"]:checked')?.value || 'No indicó';

      const msg = encodeURIComponent(
        `¡Hola! Vengo desde la página web y quiero agendar una consulta.\n\n` +
        `👤 *Nombre:* ${nombre}\n` +
        `📧 *Email:* ${email}\n` +
        `📞 *Teléfono:* ${tel}\n` +
        `🌐 *Web:* ${web}\n` +
        `🏢 *¿Es dueño?:* ${dueno}\n` +
        `🎯 *Objetivo:* ${obj}\n` +
        `💰 *Presupuesto:* ${presupuesto}\n` +
        `⏱️ *Plazo:* ${plazo}`
      );

      window.open(`https://wa.me/5491172383806?text=${msg}`, '_blank');
      closeModal();
    });
  }

  // ============ FLOATING CTA VISIBILITY ============
  const floatingCta = document.getElementById('floating-cta');
  if (floatingCta) {
    const hero = document.querySelector('.hero');
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          floatingCta.classList.remove('visible');
        } else {
          floatingCta.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });
    if (hero) scrollObserver.observe(hero);
  }

  // ============ DYNAMIC NAVBAR POSITIONING ============
  // Computes the correct top position of the navbar wrapper dynamically
  // based on scroll position and the current height of the top announcement bar.
  const updateNavbarPosition = () => {
    const topBar = document.querySelector('.top-bar');
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    if (!navbarWrapper) return;

    const isMobile = window.innerWidth <= 768;
    const gap = isMobile ? 8 : 24;
    const topBarHeight = (topBar && topBar.offsetHeight > 0) ? topBar.offsetHeight : 0;
    
    const currentScroll = window.scrollY || window.pageYOffset || 0;
    const newTop = Math.max(gap, topBarHeight + gap - currentScroll);
    
    navbarWrapper.style.top = `${newTop}px`;
  };

  let navbarTicking = false;
  const handleScrollNavbar = () => {
    if (!navbarTicking) {
      window.requestAnimationFrame(() => {
        updateNavbarPosition();
        navbarTicking = false;
      });
      navbarTicking = true;
    }
  };

  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  window.addEventListener('resize', updateNavbarPosition);
  updateNavbarPosition();
  
  // Extra checks to capture layout flow after font loading/rendering finishes
  setTimeout(updateNavbarPosition, 100);
  setTimeout(updateNavbarPosition, 500);
});

// ============ CARGA ASÍNCRONA DIFERIDA DEL MÓDULO DE ANIMACIONES (POST-LCP) ============
window.addEventListener('load', () => {
  // 1. Prioridad Crítica: Escasez visual inmediata
  initScarcity();

  // 2. Prioridad Media (Diferir 50ms para liberar el hilo principal)
  setTimeout(() => {
    // Initialize screenshots slideshow rotation
    initSlideshows();

    // Initialize interactive responsive gallery lightbox
    initLightbox();

    if (document.getElementById('nrv-contact-form')) {
      initFormFlow();
    }
  }, 50);

  // Check testimonial screenshot proofs (low priority)
  setTimeout(() => {
    document.querySelectorAll('.nrv-testimonial-img').forEach(img => {
      const hideProof = () => {
        const proof = img.closest('.nrv-testimonial-proof');
        if (proof) proof.style.display = 'none';
      };

      if (!img.getAttribute('src') || img.getAttribute('src') === '' || img.getAttribute('src').endsWith('/')) {
        hideProof();
        return;
      }

      img.addEventListener('error', hideProof);

      if (img.complete && img.naturalWidth === 0) {
        hideProof();
      }
    });
  }, 100);

  // 3. Prioridad Baja / Efectos Cosméticos (Cargar y ejecutar de forma diferida)
  import('./animations.js').catch(err => console.warn('Animations module deferred load skipped:', err));
  import('./fx/index.js').then(({ initEffects }) => {
    initEffects();
  }).catch(err => console.warn('Effects module deferred load skipped:', err));
});

