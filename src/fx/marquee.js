export function initMarquee() {
  document.querySelectorAll('[data-marquee]').forEach(track => {
    // Evitar duplicaciones si ya fue inicializado
    if (track.dataset.marqueeInit === 'true') return
    track.dataset.marqueeInit = 'true'

    // Duplicar el contenido para el loop infinito
    const content = track.innerHTML
    track.innerHTML = content + content
    
    const speed = parseFloat(track.dataset.marqueeSpeed) || 40
    let position = 0
    let isPaused = false
    
    track.addEventListener('mouseenter', () => isPaused = true)
    track.addEventListener('mouseleave', () => isPaused = false)
    
    function animate() {
      if (!isPaused) {
        position -= speed / 60
        // scrollWidth de la pista duplicada dividido por 2 es el ancho del contenido original
        const halfWidth = track.scrollWidth / 2
        if (Math.abs(position) >= halfWidth) {
          position = 0
        }
        track.style.transform = `translate3d(${position}px, 0, 0)`
      }
      requestAnimationFrame(animate)
    }
    animate()
  })
}
