export function initReadingProgress() {
  let bar = document.getElementById('reading-progress')
  if (!bar) {
    bar = document.createElement('div')
    bar.id = 'reading-progress'
    document.body.prepend(bar)
  }
  
  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = 
          document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
        bar.style.width = `${Math.min(progress, 100)}%`
        ticking = false
      })
      ticking = true
    }
  }, { passive: true })
}
