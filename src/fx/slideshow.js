export function initSlideshows() {
  const containers = document.querySelectorAll('[data-slideshow]');
  containers.forEach(container => {
    const slides = container.querySelectorAll('.nrv-slide');
    const dots = container.querySelectorAll('.nrv-dot');
    
    // Find the badge and caption elements in the parent containers
    const parentBorder = container.closest('.placeholder-border');
    const parentContainer = container.closest('.image-placeholder-container');
    
    const badge = parentBorder ? parentBorder.querySelector('[id^="nrv-slideshow-badge"]') : null;
    const caption = parentContainer ? parentContainer.querySelector('[id^="nrv-slideshow-caption"]') : null;
    
    if (slides.length <= 1) return;
    
    let currentIndex = 0;
    let timer = null;
    
    function showSlide(index) {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      const activeSlide = slides[index];
      if (activeSlide) {
        const slideBadge = activeSlide.getAttribute('data-badge');
        const slideCaption = activeSlide.getAttribute('data-caption');
        
        if (badge && slideBadge) {
          badge.textContent = `${slideBadge} (CLIC PARA CAMBIAR)`;
        }
        if (caption && slideCaption) {
          caption.textContent = slideCaption;
        }
      }
      
      currentIndex = index;
    }
    
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }
    
    function startTimer() {
      stopTimer();
      timer = setInterval(nextSlide, 4000); // Cycles every 4 seconds
    }
    
    function stopTimer() {
      if (timer) clearInterval(timer);
    }
    
    // Auto start
    startTimer();
    
    // Click on slide to swap
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('nrv-dot')) return;
      nextSlide();
      startTimer(); // reset timer
    });
    
    // Click on dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(index);
        startTimer(); // reset timer
      });
    });
  });
}
