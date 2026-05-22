export function initLightbox() {
  const evidenceSection = document.querySelector('.caso-evidencia');
  if (!evidenceSection) return;

  // Collect all images in evidence section
  const imgs = Array.from(evidenceSection.querySelectorAll('img.placeholder-img, img.nrv-slide'));
  if (imgs.length === 0) return;

  // Build lightbox HTML dynamically if it doesn't exist
  let lightbox = document.getElementById('nrv-lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'nrv-lightbox-modal';
    lightbox.className = 'nrv-lightbox';
    lightbox.innerHTML = `
      <div class="nrv-lightbox-backdrop"></div>
      <button class="nrv-lightbox-close" aria-label="Cerrar galería">
        <span class="material-symbols-outlined">close</span>
      </button>
      <button class="nrv-lightbox-nav prev" aria-label="Imagen anterior">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>
      <div class="nrv-lightbox-content">
        <img src="" alt="" class="nrv-lightbox-img">
        <p class="nrv-lightbox-caption"></p>
      </div>
      <button class="nrv-lightbox-nav next" aria-label="Siguiente imagen">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
      <div class="nrv-lightbox-counter">1 / 4</div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.nrv-lightbox-img');
  const lightboxCaption = lightbox.querySelector('.nrv-lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.nrv-lightbox-counter');
  const closeBtn = lightbox.querySelector('.nrv-lightbox-close');
  const prevBtn = lightbox.querySelector('.nrv-lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.nrv-lightbox-nav.next');
  const backdrop = lightbox.querySelector('.nrv-lightbox-backdrop');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.classList.add('nrv-lightbox-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('nrv-lightbox-open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const activeImg = imgs[currentIndex];
    if (!activeImg) return;

    lightboxImg.src = activeImg.src;
    lightboxImg.alt = activeImg.alt || '';

    // Caption priority:
    // 1. Custom data-caption attribute (stores individual slides details)
    // 2. Main slideshow text or image sibling caption
    let captionText = activeImg.getAttribute('data-caption');
    if (!captionText) {
      const siblingCaption = activeImg.closest('.image-placeholder-container')?.querySelector('.image-caption');
      if (siblingCaption) captionText = siblingCaption.textContent;
    }

    lightboxCaption.textContent = captionText || '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${imgs.length}`;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imgs.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    updateLightbox();
  }

  // Set up triggers on evidence click
  evidenceSection.querySelectorAll('.placeholder-border').forEach(border => {
    border.addEventListener('click', (e) => {
      if (e.target.classList.contains('nrv-dot')) return;

      const activeImg = border.querySelector('img.active') || border.querySelector('img');
      if (activeImg) {
        const index = imgs.indexOf(activeImg);
        if (index !== -1) {
          openLightbox(index);
        }
      }
    });
  });

  // Events listeners
  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Swipe support for touch devices
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNext(); // Swipe left
    } else if (touchEndX > touchStartX + swipeThreshold) {
      showPrev(); // Swipe right
    }
  }
}
