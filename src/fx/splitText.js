import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initSplitText() {
  // Seleccionar todos los elementos con [data-split]
  document.querySelectorAll('[data-split]').forEach(el => {
    const type = el.dataset.split // "words" | "chars" | "lines"
    
    // Si ya fue inicializado, omitir
    if (el.querySelector('.split-wrap')) return

    // Guardar texto original
    const originalText = el.textContent.trim()
    
    if (type === 'chars') {
      const chars = Array.from(originalText)
      el.innerHTML = chars.map(char => {
        if (char === ' ') {
          return ' '
        }
        return `<span class="split-wrap" style="overflow:hidden;display:inline-block">
          <span class="split-inner" style="display:inline-block;transform:translateY(110%)">
            ${char}
          </span>
        </span>`
      }).join('')
    } else {
      // Por defecto "words" o "lines"
      const words = originalText.split(/\s+/)
      el.innerHTML = words.map(word =>
        `<span class="split-wrap" style="overflow:hidden;display:inline-block">
          <span class="split-inner" style="display:inline-block;transform:translateY(110%)">
            ${word}
          </span>
        </span>`
      ).join(' ')
    }
    
    // Determinar delay y stagger
    const isMobile = window.innerWidth < 768
    const staggerTime = isMobile ? 0.03 : 0.06
    
    // Animar al hacer scroll con ScrollTrigger
    gsap.to(el.querySelectorAll('.split-inner'), {
      y: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: staggerTime,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        onComplete: () => {
          // Remover transform/will-change después de la animación para mejorar el renderizado y no interferir con contadores
          el.querySelectorAll('.split-inner').forEach(inner => {
            inner.style.transform = 'none'
            inner.style.willChange = 'auto'
          })
        }
      }
    })
  })
}
