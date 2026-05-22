// src/fx/cursor.js - Custom Magnetic and Morphing Cursor for NRVERTEX
import { gsap } from 'gsap';

export function initCursor() {
  // 1. Detect if it's a touch device or small screen to prevent custom cursor
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  const isSmallScreen = window.innerWidth < 1024;
  if (isTouchDevice || isSmallScreen) {
    return;
  }

  // 2. Create/get the cursor element
  let cursor = document.getElementById('nrv-cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = 'nrv-cursor';
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  } else {
    cursor.className = 'custom-cursor'; // ensure class is set
  }

  // Activar el cursor personalizado agregando la clase correspondiente al body
  document.body.classList.add('custom-cursor-active');

  // Set initial position offscreen or at center
  gsap.set(cursor, {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  // State
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let cursorLoc = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let activeTarget = null;
  let activeTargetCenterX = 0;
  let activeTargetCenterY = 0;
  let isHovering = false;
  let isOverInput = false;
  let isMagnetic = false;

  // Track mouse position and reveal custom cursor smoothly on first movement to prevent disappearance
  let hasMoved = false;
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      gsap.set(cursor, {
        x: e.clientX,
        y: e.clientY
      });
      cursorLoc.x = e.clientX;
      cursorLoc.y = e.clientY;
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    }
  });

  // Handle visibility states
  document.addEventListener('mouseleave', () => {
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
  });
  document.addEventListener('mouseenter', () => {
    if (!isOverInput) {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    }
  });

  // GSAP quickSetters for positioning
  const setX = gsap.quickSetter(cursor, 'x', 'px');
  const setY = gsap.quickSetter(cursor, 'y', 'px');

  // GSAP Ticker for smooth follow
  gsap.ticker.add(() => {
    let targetX = mouse.x;
    let targetY = mouse.y;

    if (activeTarget && isHovering && isMagnetic) {
      // Magnetic snapping logic: pull towards cached untranslated center
      // Elastic pull towards the center: 75% pull, 25% mouse position
      targetX = activeTargetCenterX + (mouse.x - activeTargetCenterX) * 0.25;
      targetY = activeTargetCenterY + (mouse.y - activeTargetCenterY) * 0.25;
    }

    // Interpolation (lerp) with deltaRatio to account for variable refresh rates
    const dt = 1 - Math.pow(1 - 0.16, gsap.ticker.deltaRatio());
    cursorLoc.x += (targetX - cursorLoc.x) * dt;
    cursorLoc.y += (targetY - cursorLoc.y) * dt;

    setX(cursorLoc.x);
    setY(cursorLoc.y);
  });

  // Setup interactive triggers
  document.addEventListener('mouseover', (e) => {
    // 1. Check if hovering over input, textarea, or select to intelligently hide cursor
    const isInputField = e.target.closest('input, textarea, select');
    if (isInputField) {
      isOverInput = true;
      gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.15 });
      return;
    }

    // 2. Check if hovering over cases comparison image triggers
    const imgTarget = e.target.closest('[data-cursor-image]');
    if (imgTarget) {
      activeTarget = imgTarget;
      isHovering = true;
      isMagnetic = false;
      cursor.classList.add('cursor--image');
      cursor.setAttribute('data-label', imgTarget.dataset.cursorImage || 'VER');
      
      gsap.to(cursor, {
        width: 80,
        height: 80,
        borderRadius: '50%',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      return;
    }

    // 3. Find closest interactive element
    const interactiveTarget = e.target.closest('a, button, .btn-primary, .cta-trigger, .typeform-option-item, .custom-dropdown-trigger, .custom-dropdown-option, .nrv-dot, .nav-links a, .result-card-new');
    
    // 4. Find closest large text element (headings for lens effect)
    const largeTextTarget = e.target.closest('h1, h2, .section-title, .hero-title, .italic-accent, .bento-card-title, .highlight-title, .reveal-up.blur-text, .result-name');

    if (interactiveTarget) {
      activeTarget = interactiveTarget;
      isHovering = true;

      // Handle card hover separately (smooth monochrome, no green inversion)
      if (interactiveTarget.classList.contains('result-card-new')) {
        cursor.classList.add('cursor--card-hover');
        isMagnetic = false; // Cards are not magnetic
        
        // Cache coordinates to avoid jittering
        const currentX = gsap.getProperty(interactiveTarget, 'x') || 0;
        const currentY = gsap.getProperty(interactiveTarget, 'y') || 0;
        const rect = interactiveTarget.getBoundingClientRect();
        activeTargetCenterX = rect.left - currentX + rect.width / 2;
        activeTargetCenterY = rect.top - currentY + rect.height / 2;

        gsap.to(cursor, {
          width: 70,
          height: 70,
          borderRadius: '50%',
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        return;
      }

      cursor.classList.add('hover-active');
      const rect = interactiveTarget.getBoundingClientRect();
      
      // Determine if we should wrap/morph the element
      const isBigCTA = (interactiveTarget.classList.contains('btn-primary') || 
                       interactiveTarget.classList.contains('cta-trigger') ||
                       interactiveTarget.tagName === 'BUTTON' ||
                       interactiveTarget.classList.contains('typeform-option-item') ||
                       interactiveTarget.classList.contains('custom-dropdown-trigger')) &&
                       !interactiveTarget.classList.contains('result-card-new');
      
      const isNavLink = interactiveTarget.closest('.nav-links') || interactiveTarget.closest('.mobile-menu-overlay') || interactiveTarget.classList.contains('nav-brand');

      // Calculate and cache untranslated center coordinates to avoid jittering
      const currentX = gsap.getProperty(interactiveTarget, 'x') || 0;
      const currentY = gsap.getProperty(interactiveTarget, 'y') || 0;
      activeTargetCenterX = rect.left - currentX + rect.width / 2;
      activeTargetCenterY = rect.top - currentY + rect.height / 2;

      if (isBigCTA || isNavLink) {
        isMagnetic = true; // Only big buttons/CTAs and nav links are magnetic!
        
        // Morph cursor into the element's shape
        const computedStyle = window.getComputedStyle(interactiveTarget);
        const borderRadius = computedStyle.borderRadius || '8px';
        
        // Add padding around dimensions so the cursor wraps the text neatly
        const morphWidth = rect.width + 16;
        const morphHeight = rect.height + 10;

        cursor.classList.add('hover-wrap');
        
        gsap.to(cursor, {
          width: morphWidth,
          height: morphHeight,
          borderRadius: borderRadius,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // Add a sutil rubber pull effect on the button itself
        gsap.to(interactiveTarget, {
          x: (mouse.x - activeTargetCenterX) * 0.08,
          y: (mouse.y - activeTargetCenterY) * 0.08,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        isMagnetic = false; // standard text links, etc. are not magnetic
        
        // Standard circle scale up
        cursor.classList.remove('hover-wrap');
        gsap.to(cursor, {
          width: 48,
          height: 48,
          borderRadius: '50%',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    } else if (largeTextTarget) {
      activeTarget = largeTextTarget;
      isHovering = true;
      isMagnetic = false;
      cursor.classList.add('cursor--large-text');

      const rect = largeTextTarget.getBoundingClientRect();
      activeTargetCenterX = rect.left + rect.width / 2;
      activeTargetCenterY = rect.top + rect.height / 2;

      gsap.to(cursor, {
        width: 100,
        height: 100,
        borderRadius: '50%',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });

  document.addEventListener('mouseout', (e) => {
    // 1. Check if we left an input field
    const isInputField = e.target.closest('input, textarea, select');
    if (isInputField) {
      isOverInput = false;
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.2 });
      return;
    }

    // 2. Check if we left image target
    const imgTarget = e.target.closest('[data-cursor-image]');
    if (imgTarget && activeTarget === imgTarget) {
      activeTarget = null;
      isHovering = false;
      cursor.classList.remove('cursor--image');
      cursor.removeAttribute('data-label');
      
      gsap.to(cursor, {
        width: 20,
        height: 20,
        borderRadius: '50%',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      return;
    }

    const interactiveTarget = e.target.closest('a, button, .btn-primary, .cta-trigger, .typeform-option-item, .custom-dropdown-trigger, .custom-dropdown-option, .nrv-dot, .nav-links a, .result-card-new');
    const largeTextTarget = e.target.closest('h1, h2, .section-title, .hero-title, .italic-accent, .bento-card-title, .highlight-title, .reveal-up.blur-text, .result-name');

    if (interactiveTarget && activeTarget === interactiveTarget) {
      // Reset interactive target position
      gsap.to(interactiveTarget, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      activeTarget = null;
      isHovering = false;
      isMagnetic = false;
      cursor.classList.remove('hover-active', 'hover-wrap', 'cursor--card-hover');
      
      // Reset cursor size and shape
      gsap.to(cursor, {
        width: 20,
        height: 20,
        borderRadius: '50%',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    } else if (largeTextTarget && activeTarget === largeTextTarget) {
      activeTarget = null;
      isHovering = false;
      isMagnetic = false;
      cursor.classList.remove('cursor--large-text');
      
      gsap.to(cursor, {
        width: 20,
        height: 20,
        borderRadius: '50%',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });

  // Track target magnetic movement when cursor stays inside and mouse moves
  document.addEventListener('mousemove', (e) => {
    if (activeTarget && isHovering && isMagnetic) {
      gsap.to(activeTarget, {
        x: (mouse.x - activeTargetCenterX) * 0.08,
        y: (mouse.y - activeTargetCenterY) * 0.08,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });
}
