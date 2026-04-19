/**
 * Tin Yat Kwok Portfolio - Main JavaScript
 */

(function() {
  'use strict';

  // ============================================
  // Mobile Navigation Toggle
  // ============================================

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const nav = document.querySelector('.nav');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
  }

// ============================================
// Scroll-based Navigation Hide/Show
// ============================================

let lastScrollY = window.scrollY || 0;
let scrollDirection = "up";
const scrollThreshold = 10;

function handleScroll() {
  const currentScrollY = window.scrollY;
  
  // Update "scrolled" class for background style
  if (nav) {
    if (currentScrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  
  // Always show nav at very top
  if (currentScrollY <= 0) {
    if (nav) nav.classList.remove("is-hidden");
    lastScrollY = currentScrollY;
    scrollDirection = "up";
    return;
  }
  
  const scrollDelta = currentScrollY - lastScrollY;
  
  // Only process if scroll threshold exceeded
  if (Math.abs(scrollDelta) < scrollThreshold) {
    return;
  }
  
  const newDirection = scrollDelta > 0 ? "down" : "up";
  
  if (newDirection !== scrollDirection) {
    scrollDirection = newDirection;
  }
  
  // Apply hide/show based on current direction
  if (nav) {
    if (scrollDirection === "down" && currentScrollY > 80) {
      nav.classList.add("is-hidden");
    } else if (scrollDirection === "up") {
      nav.classList.remove("is-hidden");
    }
  }
  
  lastScrollY = currentScrollY;
}

// Throttled scroll handler
let ticking = false;
window.addEventListener("scroll", function() {
  if (!ticking) {
    window.requestAnimationFrame(function() {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Initial scroll check
handleScroll();

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Handle Home link (href="#")
      if (href === '#' || !href) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(function() {
          lastScrollY = window.scrollY;
          scrollDirection = "up";
        }, 800);
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // Account for fixed navigation height
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Reset scroll tracking after smooth scroll completes
        setTimeout(function() {
          lastScrollY = window.scrollY;
          scrollDirection = "up";
        }, 800);
      }
    });
  });

  // ============================================
  // Intersection Observer for Section Animations
  // ============================================

  // Elements to animate on scroll - sections and their animated children
  const animateElements = document.querySelectorAll(
    'section, .case-study-card, .work-card, .value-item, .value-prop, .section-header, .trust-item, .logo-strip, .process-step, .result-card, .capability-row, .capability-card, .about-quote, .split-card, .testimonial-card'
  );

  function initScrollAnimations() {
    if (animateElements.length === 0 || !('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      animateElements.forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px', // Trigger slightly before element enters viewport
      threshold: 0.15 // Fire when 15% of element is visible
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after animation to prevent re-triggering
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // Initialize animations - wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  // ============================================
  // Card Hover Effects Enhancement
  // ============================================

  const cards = document.querySelectorAll('.case-study-card, .work-card');

  cards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.classList.add('is-hovered');
    });

    card.addEventListener('mouseleave', function() {
      this.classList.remove('is-hovered');
    });
  });

  // ============================================
  // Active Navigation Link on Scroll
  // ============================================
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + (nav ? nav.offsetHeight + 50 : 100);
    const allSections = document.querySelectorAll('section[id]');
    const currentPath = window.location.pathname;
    const isHomePage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.split('/').pop() === '';

    let currentActiveId = null;
    let closestSection = null;
    let minDistance = Infinity;

    // Find which section is currently in view
    allSections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.id;

      // Check if scroll position is within this section
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentActiveId = sectionId;
      }

      // Also track the closest section above current scroll for edge cases
      const distance = Math.abs(scrollPosition - sectionTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestSection = sectionId;
      }
    });

    // If no section is in view but we're not at top, use closest
    if (!currentActiveId && window.scrollY > 100) {
      currentActiveId = closestSection;
    }

    // Default to show no specific section at top (Home is active by default)
    // Let Home link be active when at top via its href="#" behavior
    if (isHomePage && window.scrollY < 100) {
      currentActiveId = 'home';
    } else if (isHomePage && window.scrollY < 300 && !currentActiveId) {
      // Near top but scrolled a bit - still show home
      currentActiveId = 'home';
    }

    // Update all nav links
    document.querySelectorAll('.nav-link').forEach(function(link) {
      link.classList.remove('active');

      const href = link.getAttribute('href');
      if (!href) return;

      // Handle different link formats
      let linkPath = '';
      let linkHash = '';

      if (href.includes('#')) {
        const parts = href.split('#');
        linkPath = parts[0];
        linkHash = parts[1];
      } else {
        linkPath = href;
      }

      // Check if this link should be active
      let shouldBeActive = false;

      if (isHomePage) {
        // On homepage: links like "#work" or "index.html#work" should match current section
        if (linkHash && linkHash === currentActiveId) {
          shouldBeActive = true;
        }
        // Also match links with empty path pointing to #
        if (!linkPath && linkHash === currentActiveId) {
          shouldBeActive = true;
        }
      }

      // All pages: exact hash match for current scroll position
      if (linkHash && linkHash === currentActiveId) {
        shouldBeActive = true;
      }

      // About page highlight when on about.html
      if (currentPath.includes('about.html') && (href.includes('about.html') || linkHash === 'about')) {
        shouldBeActive = true;
      }

      // Case studies highlight when on any case study page - ONLY active item on case studies
      if ((currentPath.includes('/case-studies/') || currentPath.includes('case-study-')) &&
          (linkHash === 'featured-work' || href.includes('index.html#featured-work'))) {
        shouldBeActive = true;
      }

      // Work highlight when on any works page
      if ((currentPath.includes('/works/') || currentPath.includes('work-')) &&
          (linkHash === 'selected-work' || href.includes('index.html#selected-work'))) {
        shouldBeActive = true;
      }

      // When on homepage: highlight based on scroll position
      if (isHomePage && (!currentPath.includes('/case-studies/') || !currentPath.includes('case-study-'))) {
        // Home link active when at top
        if (currentActiveId === 'home' && (href === '#' || href === 'index.html#' || (!linkHash && !linkPath))) {
          shouldBeActive = true;
        }

        // Case studies highlight when viewing featured-work section
        if (linkHash === 'featured-work' && currentActiveId === 'featured-work') {
          shouldBeActive = true;
        }

        // Work link highlight when viewing selected-work section
        if (linkHash === 'selected-work' && currentActiveId === 'selected-work') {
          shouldBeActive = true;
        }

        // About link highlight when viewing about section
        if (linkHash === 'about' && currentActiveId === 'about') {
          shouldBeActive = true;
        }

        // Contact link highlight when viewing contact section
        if (linkHash === 'contact' && currentActiveId === 'contact') {
          shouldBeActive = true;
        }
      }

      // About link highlight when on about.html page
      if (currentPath.includes('about.html') && href.includes('about.html')) {
        shouldBeActive = true;
      }

      if (shouldBeActive) {
        link.classList.add('active');
      }
    });
  }

  // Throttled scroll handler for active link
  let navLinkTicking = false;
  window.addEventListener('scroll', function() {
    if (!navLinkTicking) {
      window.requestAnimationFrame(function() {
        updateActiveNavLink();
        navLinkTicking = false;
      });
      navLinkTicking = true;
    }
  });

  // Initial check after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateActiveNavLink);
  } else {
    updateActiveNavLink();
  }

  // ============================================
  // Print Handler
  // ============================================

  document.querySelectorAll('a[href$=".pdf"]').forEach(function(pdfLink) {
    pdfLink.addEventListener('click', function(e) {
      // Let the download proceed normally
      // This is just for any additional tracking if needed
      const filename = this.getAttribute('href').split('/').pop();
      console.log('Downloading: ' + filename);
    });
  });

  // ============================================
  // Keyboard Navigation Enhancement
  // ============================================

  document.addEventListener('keydown', function(e) {
    // Escape key closes mobile navigation
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
      document.body.classList.remove('nav-open');
      navToggle.focus();
    }
  });

  // ============================================
  // Lazy Load Images (basic support)
  // ============================================

  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

})();
