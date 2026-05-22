export function initMagnetic() {
  // Aplicar a todos los elementos con [data-magnetic]
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = parseFloat(el.dataset.magneticStrength) || 0.4
    let centerX = 0
    let centerY = 0

    el.addEventListener('mouseenter', () => {
      // Cache the original center coordinates by resetting transform temporarily
      const currentTransform = el.style.transform
      const currentTransition = el.style.transition
      el.style.transform = 'none'
      el.style.transition = 'none'
      
      const rect = el.getBoundingClientRect()
      centerX = rect.left + rect.width / 2
      centerY = rect.top + rect.height / 2
      
      el.style.transform = currentTransform
      el.style.transition = currentTransition
    })
    
    el.addEventListener('mousemove', (e) => {
      if (centerX === 0 && centerY === 0) {
        const rect = el.getBoundingClientRect()
        centerX = rect.left + rect.width / 2
        centerY = rect.top + rect.height / 2
      }
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      
      el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
      el.style.transition = 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
    })
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0, 0, 0)'
      el.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      centerX = 0
      centerY = 0
    })
  })
}
