import { initCursor } from './cursor'
import { initReadingProgress } from './readingProgress'
import { initSplitText } from './splitText'
import { initMagnetic } from './magnetic'
import { initMarquee } from './marquee'
import { initParallax } from './parallax'
import { initFloatingPreview } from './floatingPreview'
import { initScrollVideo } from './scrollVideo'
// initPageTransitions se carga directamente en main.js DOMContentLoaded

export function initEffects() {
  // Respetar prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  // Prioridad Media (Inicializar inmediatamente cuando se llama a initEffects)
  initReadingProgress()
  initSplitText()
  initParallax()
  initFloatingPreview()
  initScrollVideo()

  // Prioridad Baja (Efectos cosméticos - Cargar solo cuando el navegador esté libre)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initCursor()      // Módulo de cursor.js
      initMarquee()     // Módulo de marquee.js
      initMagnetic()    // Módulo de magnetic.js
    })
  } else {
    setTimeout(() => {
      initCursor()
      initMarquee()
      initMagnetic()
    }, 200)
  }
}

