export function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'nrv-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize, { passive: true });

  const colors = [
    '#7c3aed', // Primary Violet
    '#a78bfa', // Light violet
    '#3b82f6', // Blue
    '#60a5fa', // Light blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899'  // Pink
  ];

  const particles = [];
  const particleCount = 120;

  class Particle {
    constructor() {
      this.x = width * 0.2 + Math.random() * width * 0.6; // random horizontal spawn in the middle 60%
      this.y = height + 10; // shoot from the bottom
      this.vx = (Math.random() - 0.5) * 12;
      this.vy = -Math.random() * 16 - 12; // initial upward velocity
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
      this.size = Math.random() * 8 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      if (this.y > height && this.vy > 0) {
        this.opacity = 0;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      // Draw rectangular confetti piece
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;
  const gravity = 0.4;
  const friction = 0.98;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity > 0) {
        p.vy += gravity;
        p.vx *= friction;
        p.update();
        p.draw();
        activeParticles++;
      }
    }

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.remove();
    }
  }

  animate();
}
