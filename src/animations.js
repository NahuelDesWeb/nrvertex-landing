// src/animations.js - Animaciones diferidas para maximizar el PageSpeed

function initAnimations() {
  // Typwriter / Letter-by-letter writing animation for contact page heading
  const contactHeading = document.querySelector('.contact-info h1');
  if (contactHeading) {
    splitLetters(contactHeading);
  }

  // Letter-by-letter writing animation for final CTA heading
  const finalCtaHeading = document.querySelector('.final-cta h2');
  if (finalCtaHeading) {
    splitLetters(finalCtaHeading);
  }

  function splitLetters(el) {
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    let idx = 0;

    function processNode(node, container) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const parts = text.split(/(\s+)/);
        
        parts.forEach(part => {
          if (!part) return;
          if (/\s+/.test(part)) {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'char-span char-space';
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.style.setProperty('--char-idx', idx++);
            container.appendChild(spaceSpan);
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word-wrap';
            
            const chars = Array.from(part);
            chars.forEach(char => {
              const charSpan = document.createElement('span');
              charSpan.className = 'char-span';
              charSpan.textContent = char;
              charSpan.style.setProperty('--char-idx', idx++);
              wordSpan.appendChild(charSpan);
            });
            
            container.appendChild(wordSpan);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        const children = Array.from(node.childNodes);
        children.forEach(child => processNode(child, clone));
        container.appendChild(clone);
      }
    }

    nodes.forEach(node => processNode(node, el));
  }

  // 1. Reveal animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-up, .reveal-blur, .reveal-scale, .reveal-left, .reveal-right').forEach((el) => {
    revealObserver.observe(el);
  });

  // 2. WORD-BY-WORD STAGGER — section titles
  function splitWords(el) {
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    el.classList.add('word-split');
    let idx = 0;

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/\s+/).filter(Boolean).forEach(word => {
          const sp = document.createElement('span');
          sp.className = 'sw';
          sp.style.setProperty('--wd', `${idx * 50}ms`);
          sp.textContent = word;
          el.appendChild(sp);
          el.appendChild(document.createTextNode(' '));
          idx++;
        });
      } else {
        const sp = document.createElement('span');
        sp.className = 'sw';
        sp.style.setProperty('--wd', `${idx * 50}ms`);
        sp.appendChild(node.cloneNode(true));
        el.appendChild(sp);
        el.appendChild(document.createTextNode(' '));
        idx++;
      }
    });
  }

  document.querySelectorAll('.section-title').forEach(el => splitWords(el));

  const wordObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('words-in');
        wordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.word-split').forEach(el => wordObserver.observe(el));

  // 3. ANIMATED COUNTERS — result pills
  function animateCounter(el) {
    const original = el.textContent.trim();
    const numMatch = original.match(/([\d]+(?:[.,][\d]+)*)/);
    if (!numMatch) return;

    const numStr = numMatch[1];
    const isDotThousands = numStr.includes('.') && numStr.split('.').pop().length === 3;
    const numVal = isDotThousands
      ? parseInt(numStr.replace(/\./g, ''), 10)
      : parseFloat(numStr.replace(',', '.'));

    if (isNaN(numVal)) return;

    const before = original.slice(0, original.indexOf(numStr));
    const after  = original.slice(original.indexOf(numStr) + numStr.length);
    const duration = 1600;
    const startTime = performance.now();

    el.classList.add('counting');

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * numVal;

      let formatted;
      if (isDotThousands) {
        formatted = Math.round(current).toLocaleString('es-AR').replace(/,/g, '.');
      } else if (!Number.isInteger(numVal)) {
        formatted = current.toFixed(1);
      } else {
        formatted = Math.round(current).toString();
      }

      el.textContent = `${before}${formatted}${after}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = original;
        el.classList.remove('counting');
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.result-pill').forEach(pill => counterObserver.observe(pill));

  // 4. SEQUENTIAL CARD STAGGER
  const cardGroups = new Map();
  document.querySelectorAll('.result-card-new').forEach(card => {
    const parent = card.parentElement;
    if (!cardGroups.has(parent)) cardGroups.set(parent, []);
    cardGroups.get(parent).push(card);
  });
  cardGroups.forEach(cards => {
    cards.forEach((card, i) => {
      const existing = parseFloat(card.style.transitionDelay) || 0;
      card.style.transitionDelay = `${existing + i * 130}ms`;
    });
  });
}

// Inicialización segura para cargas síncronas o asíncronas
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initAnimations();
} else {
  document.addEventListener('DOMContentLoaded', initAnimations);
}
