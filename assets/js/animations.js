/**
 * Scroll Animations for Portfolio
 * Selected variants: 1A, 2B, 3A, 4D, 5A, 6B, 7A, 8A, 9D
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const config = {
    threshold: 0.05,
    rootMargin: '0px 0px 100px 0px',
    counterDuration: 1500,
    timelineDuration: 2000,
    typewriterSpeed: 50,
    parallaxRange: 30
  };

  // ============================================
  // INTERSECTION OBSERVER
  // ============================================
  const animatedSections = document.querySelectorAll(
    '.anim-logo-strip, .anim-why-work, .anim-case-studies, .anim-selected-work, ' +
    '.anim-results, .anim-process, .anim-capabilities, .anim-about, .anim-contact'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        handleSectionAnimations(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: config.rootMargin,
    threshold: config.threshold
  });

  animatedSections.forEach(section => observer.observe(section));

  // ============================================
  // SECTION HANDLERS
  // ============================================
  function handleSectionAnimations(section) {
    const classes = section.classList;

    if (classes.contains('anim-results')) handleResults(section);
    if (classes.contains('anim-process')) handleProcess(section);
    if (classes.contains('anim-capabilities')) handleCapabilities(section);
    if (classes.contains('anim-about')) handleAbout(section);
    if (classes.contains('anim-contact')) handleContact(section);
    if (classes.contains('anim-selected-work')) handleSelectedWork(section);
    if (classes.contains('anim-case-studies')) handleCaseStudies(section);
  }

  // 3A: Case Studies - Card hover effects
  function handleCaseStudies(section) {
    const cards = section.querySelectorAll('.anim-case-study-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.transition = 'transform 0.3s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // 5A: Results - Counter Animation
  function handleResults(section) {
    const counters = section.querySelectorAll('.anim-counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const decimals = parseInt(counter.dataset.decimals) || 0;
      const prefix = counter.dataset.prefix || '';
      const suffix = counter.dataset.suffix || '';
      animateCounter(counter, target, decimals, prefix, suffix);
    });
  }

  function animateCounter(el, target, decimals, prefix, suffix) {
    const start = performance.now();
    const duration = config.counterDuration;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + (target * ease).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // 6B: Process - Timeline Progress
  function handleProcess(section) {
    const connector = section.querySelector('.process-connector');
    const steps = section.querySelectorAll('.anim-process-step');
    if (!connector) return;

    const start = performance.now();
    const duration = config.timelineDuration;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      connector.style.setProperty('--progress', (ease * 100) + '%');

      const active = Math.floor(progress * steps.length);
      steps.forEach((step, i) => {
        if (i < active) {
          const num = step.querySelector('.process-step-number');
          if (num) {
            num.style.borderColor = '#1B66FF';
            num.style.backgroundColor = '#EAF1FF';
            num.style.color = '#1B66FF';
          }
        }
      });

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // 7A: Capabilities - Typewriter
  function handleCapabilities(section) {
    const categories = section.querySelectorAll('.anim-cap-category');
    categories.forEach((cat, i) => {
      const text = cat.textContent;
      cat.textContent = '';
      setTimeout(() => typeWriter(cat, text, 0), i * 400);
    });
  }

  function typeWriter(el, text, i) {
    if (i < text.length) {
      el.textContent += text[i];
      setTimeout(() => typeWriter(el, text, i + 1), config.typewriterSpeed);
    }
  }

  // 8A: About - Parallax
  function handleAbout(section) {
    const portrait = section.querySelector('.anim-about-portrait img') ||
                    section.querySelector('.anim-about-portrait');
    if (!portrait) return;

    function update() {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));
      const offset = (progress - 0.5) * config.parallaxRange;
      portrait.style.transform = `translateY(${offset}px)`;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // 9D: Contact - Ripple
  function handleContact(section) {
    const content = section.querySelector('.contact-content');
    if (!content) return;

    content.style.position = 'relative';
    content.style.overflow = 'hidden';

    // Create initial ripples
    [
      { delay: 0, size: 100 },
      { delay: 300, size: 150 },
      { delay: 600, size: 200 }
    ].forEach(({ delay, size }) => {
      setTimeout(() => createRipple(content, size), delay);
    });

    // Button click ripples
    section.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        createButtonRipple(this, e.clientX - rect.left, e.clientY - rect.top);
      });
    });
  }

  function createRipple(container, size) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute; left: 50%; top: 50%;
      width: ${size}px; height: ${size}px;
      margin: -${size/2}px 0 0 -${size/2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(27,102,255,0.15) 0%, transparent 70%);
      transform: scale(0);
      animation: rippleExpand 2s ease-out forwards;
      pointer-events: none;
    `;
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 2000);
  }

  function createButtonRipple(btn, x, y) {
    const ripple = document.createElement('span');
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    ripple.style.cssText = `
      position: absolute; left: ${x - size/2}px; top: ${y - size/2}px;
      width: ${size}px; height: ${size}px; border-radius: 50%;
      background: rgba(255,255,255,0.4); transform: scale(0);
      animation: btnRipple 0.6s ease-out; pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // 4D: Selected Work - Highlight
  function handleSelectedWork(section) {
    const cards = section.querySelectorAll('.anim-work-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cards.forEach(c => c.classList.remove('is-highlighted'));
        card.classList.add('is-highlighted');
        card.style.transform = 'translateY(-6px) scale(1.02)';
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-highlighted');
        card.style.transform = '';
      });
    });
  }

  // ============================================
  // KEYFRAMES INJECTION
  // ============================================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleExpand { to { transform: scale(4); opacity: 0; } }
    @keyframes btnRipple { to { transform: scale(2); opacity: 0; } }
  `;
  document.head.appendChild(style);

})();
