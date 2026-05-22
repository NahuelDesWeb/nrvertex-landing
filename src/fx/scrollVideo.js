import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScrollVideo() {
  const videoWrap = document.getElementById('nrv-scroll-video-wrap')
  if (!videoWrap) return

  // Lazy-load the video file when scrolling close to the section (supporting multiple sources)
  const video = videoWrap.querySelector('video')
  if (video) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const v = entry.target
          const sources = v.querySelectorAll('source')
          let loaded = false

          if (sources.length > 0) {
            sources.forEach(source => {
              if (source.dataset.src) {
                source.src = source.dataset.src
                source.removeAttribute('data-src')
                loaded = true
              }
            })
          } else if (v.dataset.src) {
            v.src = v.dataset.src
            v.removeAttribute('data-src')
            loaded = true
          }

          if (loaded) {
            v.load()
            v.play().catch(err => console.log('Video play deferred/interrupted:', err))
          }
          videoObserver.unobserve(v)
        }
      })
    }, { rootMargin: '300px' })
    videoObserver.observe(video)
  }

  const isMobile = window.innerWidth <= 768

  gsap.fromTo(videoWrap, 
    {
      width: isMobile ? '90%' : '70%',
      borderRadius: isMobile ? '16px' : '28px',
    },
    {
      width: '100%',
      borderRadius: isMobile ? '0px' : '12px',
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '.nrv-video-section',
        start: 'top 85%',   // Starts expanding when the section top reaches 85% viewport
        end: 'top 20%',     // Ends expanding when the section top reaches 20% viewport
        scrub: 1,           // Fluid transition directly bound to scrollbar progress
      }
    }
  )
}
