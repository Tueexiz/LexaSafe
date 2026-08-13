/**
 * LEXASAFE - STUDIO APPLICATION CORE & ADVANCED ANIMATION ENGINE
 * Native Smooth Scroll • Canvas Interactif • 3D Card Tilt • Magnetic Buttons • Scroll Progress • Kinetic Reveal
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. Initialisation des Icônes Lucide ────────────────────────────
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ─── 2. Lueur Élégante Autour de la Souris (Cursor Ambient Glow) ──
  let cursorGlow = document.getElementById('cursor-ambient-glow');
  if (!cursorGlow) {
    cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-ambient-glow';
    cursorGlow.className = 'cursor-ambient-glow';
    document.body.appendChild(cursorGlow);
  }

  let mouseX = -1000, mouseY = -1000;
  let glowX = -1000, glowY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursorGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    if (cursorGlow) {
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    }
    requestAnimationFrame(renderCursorGlow);
  }
  renderCursorGlow();

  // ─── 3. Smooth Mousewheel Gliding Scroll Engine ───────────────────
  let scrollTarget = window.scrollY || document.documentElement.scrollTop;
  let scrollCurrent = scrollTarget;
  let isWheelScrolling = false;

  window.addEventListener('wheel', (e) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    scrollTarget = Math.max(0, Math.min(maxScroll, scrollTarget + e.deltaY * 0.95));

    if (!isWheelScrolling) {
      isWheelScrolling = true;
      requestAnimationFrame(smoothWheelLoop);
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (!isWheelScrolling) {
      scrollTarget = window.scrollY || document.documentElement.scrollTop;
      scrollCurrent = scrollTarget;
    }
  }, { passive: true });

  function smoothWheelLoop() {
    const diff = scrollTarget - scrollCurrent;
    if (Math.abs(diff) > 0.6) {
      scrollCurrent += diff * 0.085; // Damping lerp
      window.scrollTo(0, scrollCurrent);
      requestAnimationFrame(smoothWheelLoop);
    } else {
      scrollCurrent = scrollTarget;
      window.scrollTo(0, scrollCurrent);
      isWheelScrolling = false;
    }
  }

  // ─── 4. Scroll Progress Bar & Floating Header ─────────────────────
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('capsule-progress-bar');
  let ticking = false;

  function onScrollUpdate() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

    // Header Shadow & Background
    if (scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Progress Bar Fill
    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // Kinetic Scroll Update
    updateKineticScroll();

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollUpdate);
      ticking = true;
    }
  }, { passive: true });
  onScrollUpdate();

  // ─── 3. Canvas Interactif Cyber Constellation (Hero) ─────────────
  const canvas = document.getElementById('hero-interactive-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    const maxDistance = 125;
    let mouse = { x: -1000, y: -1000, radius: 150 };

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.radius = Math.random() * 2 + 1.2;
        this.baseColor = Math.random() > 0.3 ? 'rgba(29, 78, 216, ' : 'rgba(5, 150, 105, ';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interaction avec la souris
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.8;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + '0.6)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        // Liens entre particules proches
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(29, 78, 216, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Ligne vers le curseur
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const alpha = (1 - mdist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }

        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    resizeCanvas();
    initParticles();
    animateParticles();
  }

  // ─── 4. Effet 3D Tilt & Specular Shine (GPU Acceleré) ────────────
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    if (!card.querySelector('.card-shine')) {
      const shine = document.createElement('div');
      shine.className = 'card-shine';
      card.appendChild(shine);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--shine-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--shine-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // ─── 5. Boutons Magnétiques (Magnetic Pull Effect) ────────────────
  const magneticButtons = document.querySelectorAll('[data-magnetic]');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // ─── 6. Intersection Observer & Scroll Animations ─────────────────
  document.documentElement.classList.add('js-ready');

  // Démarrage immédiat des compteurs du Hero
  document.querySelectorAll('.hero-metrics-strip [data-counter]').forEach(cnt => {
    startCounterAnimation(cnt);
  });

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          const counters = entry.target.querySelectorAll('[data-counter]');
          counters.forEach((cnt) => startCounterAnimation(cnt));

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 100px 0px' });

    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150) {
        el.classList.add('visible');
      }
      observer.observe(el);
    });
  }

  // ─── 7. Compteurs Chiffrés Animés (Stats Counters) ───────────────
  function startCounterAnimation(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseInt(el.dataset.counter, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * target);

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // ─── 8. Mot-Clé Rotatif Dynamique (Hero) ─────────────────────────
  const rotatorEl = document.getElementById('hero-rotator-word');
  const keywords = [
    'Réquisitions Judiciaires',
    'Injonctions e-Evidence',
    'Urgences 8h Pénales',
    'Enquêtes Numériques',
    'Audits & Scellements eIDAS'
  ];
  let keywordIdx = 0;

  if (rotatorEl) {
    setInterval(() => {
      rotatorEl.style.opacity = '0';
      rotatorEl.style.transform = 'translateY(-8px) scale(0.95)';

      setTimeout(() => {
        keywordIdx = (keywordIdx + 1) % keywords.length;
        rotatorEl.textContent = keywords[keywordIdx];
        rotatorEl.style.opacity = '1';
        rotatorEl.style.transform = 'translateY(0) scale(1)';
      }, 250);
    }, 2400);
  }

  // ─── 9. Kinetic Scroll Word-by-Word Reveal ───────────────────────
  const kineticWords = document.querySelectorAll('.kinetic-word');
  const kineticSection = document.getElementById('kinetic-statement');

  function updateKineticScroll() {
    if (!kineticSection || kineticWords.length === 0) return;

    const rect = kineticSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalWords = kineticWords.length;

    const scrollProgress = (windowH * 0.75 - rect.top) / (rect.height + windowH * 0.4);
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    const activeWordCount = Math.floor(clampedProgress * totalWords);

    kineticWords.forEach((word, idx) => {
      if (idx <= activeWordCount) {
        word.classList.add('active', 'lit');
      } else {
        word.classList.remove('active', 'lit');
      }
    });
  }

  // ─── 10. Accordéon FAQ Dynamique ──────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-question-btn') || item.querySelector('.faq-question-trigger');
    const answer = item.querySelector('.faq-answer') || item.querySelector('.faq-answer-collapse');

    if (trigger && answer) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Fermer les autres items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            const otherAnswer = otherItem.querySelector('.faq-answer') || otherItem.querySelector('.faq-answer-collapse');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Basculer l'item cliqué
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 24 + 'px';
        } else {
          item.classList.remove('open');
          answer.style.maxHeight = null;
        }
      });
    }
  });

  // ─── 11. Menu Mobile Plein Écran ──────────────────────────────────
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openMobileMenu);
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // ─── 12. Smooth Scroll pour les Liens d'Ancre ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
