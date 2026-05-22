export function initFloatingPreview() {
  // Solo en desktop
  if (window.innerWidth < 768) return

  const previews = document.querySelectorAll('[data-preview]')
  
  previews.forEach(el => {
    // Crear el contenedor flotante
    const container = document.createElement('div')
    container.className = 'floating-preview'
    container.innerHTML = 
      `<img src="${el.dataset.preview}" alt="" 
            loading="lazy" width="320" height="200">`
    document.body.appendChild(container)
    
    let isVisible = false
    let raf
    let mouseX = 0, mouseY = 0
    let currentX = 0, currentY = 0
    
    function animate() {
      currentX += (mouseX - currentX) * 0.1
      currentY += (mouseY - currentY) * 0.1
      container.style.transform = 
        `translate3d(${currentX}px, ${currentY}px, 0) rotate(-2deg)`
      if (isVisible) {
        raf = requestAnimationFrame(animate)
      }
    }
    
    el.addEventListener('mouseenter', () => {
      isVisible = true
      container.classList.add('is-visible')
      raf = requestAnimationFrame(animate)
    })
    
    el.addEventListener('mousemove', (e) => {
      mouseX = e.clientX + 24
      mouseY = e.clientY - 80
    })
    
    el.addEventListener('mouseleave', () => {
      isVisible = false
      container.classList.remove('is-visible')
      cancelAnimationFrame(raf)
    })
  })
}
