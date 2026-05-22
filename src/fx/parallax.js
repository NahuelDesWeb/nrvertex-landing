export function initParallax() {
  // Solo en desktop (no en mobile — afecta performance)
  if (window.innerWidth < 768) return
  
  const elements = document.querySelectorAll('[data-parallax]')
  
  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        elements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.15
          const rect = el.getBoundingClientRect()
          
          // Solo animar si el elemento está visible en pantalla
          if (rect.bottom < 0 || rect.top > window.innerHeight) return
          
          const centerY = rect.top + rect.height / 2
          const viewportCenter = window.innerHeight / 2
          const offset = (centerY - viewportCenter) * speed
          el.style.transform = `translate3d(0, ${offset}px, 0)`
        })
        ticking = false
      })
      ticking = true
    }
  }, { passive: true })
}
