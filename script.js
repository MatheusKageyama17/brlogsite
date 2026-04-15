// =============================================
// BR LOG® – Interactive JavaScript
// =============================================

(function() {
  'use strict';

  // ---- Navbar scroll behavior ----
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Mobile menu toggle ----
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    mobileDrawer.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when link clicked
  document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
      mobileDrawer.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    });
  });

  // Close drawer on outside click
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      mobileDrawer.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ---- Text Reveal Animation on Load ----
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    heroTitle.classList.remove('animate-fade-up');
    heroTitle.style.opacity = '1';
    heroTitle.style.visibility = 'visible';
    heroTitle.style.transform = 'none';
    heroTitle.style.filter = 'none';
    
    const textRaw1 = "Onde as empresas";
    const textRaw2 = "moram com qualidade";
    const textRaw3 = "e segurança.";
    
    let charIndex = 0;
    function createSpans(text) {
      return text.split(' ').map(word => {
        const chars = word.split('').map(char => {
          const delay = 0.2 + (charIndex++ * 0.025);
          return `<span class="anim-char" style="animation-delay:${delay}s">${char}</span>`;
        }).join('');
        charIndex++; // account for space delay
        return `<span style="white-space: nowrap;">${chars}</span>`;
      }).join(' ');
    }

    heroTitle.innerHTML = createSpans(textRaw1) + '<br />' + 
                          '<span class="gradient-text" style="display:inline-block;">' + createSpans(textRaw2) + '</span><br />' + 
                          createSpans(textRaw3);
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Intersection observer – fade-up animations ----
  const fadeEls = document.querySelectorAll('.animate-fade-up');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObserver.observe(el));

  // ---- Animate on scroll for cards/grids ----
  const revealEls = document.querySelectorAll('.social-card, .pillar, .mode-card, .stat-item, .infra-card, .ad-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          entry.target.style.filter = 'blur(0)';
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px) scale(0.98)';
    el.style.filter = 'blur(4px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // ---- Counter animation for stats ----
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, 0, target, 1600);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- Contact form – redirect to WhatsApp ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name     = document.getElementById('name').value.trim();
      const empresa  = document.getElementById('empresa').value.trim();
      const phone    = document.getElementById('phone').value.trim();
      const interest = document.getElementById('interest').value;
      const message  = document.getElementById('message').value.trim();

      if (!name || !phone) {
        shakeForm(contactForm);
        return;
      }

      const interestLabels = {
        'lote': 'Adquirir um lote em Dourados',
        'campo-grande': 'Lote em Campo Grande',
        'parceria': 'Parceria / Vender minha área',
        'expansao': 'Expansão para outro estado',
        'outro': 'Outro'
      };

      let text = `Olá! Meu nome é *${name}*`;
      if (empresa) text += ` da empresa *${empresa}*`;
      text += `.`;
      if (interest && interestLabels[interest]) text += `\n\n*Interesse:* ${interestLabels[interest]}`;
      if (message) text += `\n\n*Mensagem:* ${message}`;
      text += `\n\nAguardo retorno. Obrigado!`;

      const url = `https://api.whatsapp.com/send?phone=5567999890089&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');

      // Success feedback
      const btn = document.getElementById('form-submit-btn');
      btn.textContent = '✓ Redirecionando...';
      btn.style.background = '#25D366';
      setTimeout(() => {
        btn.innerHTML = 'Enviar Mensagem <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  function shakeForm(form) {
    form.style.animation = 'shake 0.4s ease';
    form.addEventListener('animationend', () => { form.style.animation = ''; }, { once: true });
  }

  // ---- Lazy load images with fade-in (cache-safe) ----
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.transition = 'opacity 0.5s ease';
        if (img.complete && img.naturalWidth > 0) {
          // Already loaded (cached) – ensure visible
          img.style.opacity = '1';
        } else {
          img.style.opacity = '0';
          img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
          img.addEventListener('error', () => { img.style.opacity = '1'; }, { once: true });
        }
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '300px' });
  lazyImages.forEach(img => {
    // Pre-check: if already loaded before observer fires
    if (img.complete && img.naturalWidth > 0) {
      img.style.opacity = '1';
    }
    imageObserver.observe(img);
  });

  // ---- Parallax subtle effect on hero ----
  const heroImg = document.querySelector('.hero__img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        heroImg.style.transform = `translateY(${sy * 0.25}px)`;
      }
    }, { passive: true });
  }

  // ---- Add shake keyframe dynamically ----
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(styleSheet);

  // ---- WhatsApp FAB pulse on load ----
  const fab = document.getElementById('whatsapp-fab');
  if (fab) {
    setTimeout(() => {
      fab.style.animation = 'fab-bounce 0.6s ease';
    }, 2000);
    const fabStyle = document.createElement('style');
    fabStyle.textContent = `
      @keyframes fab-bounce {
        0%, 100% { transform: scale(1); }
        30% { transform: scale(1.18); }
        60% { transform: scale(0.93); }
        80% { transform: scale(1.08); }
      }
    `;
    document.head.appendChild(fabStyle);
  }

  // ---- Lightbox for Campo Grande render image ----
  const fullscreenBtn = document.getElementById('cg-fullscreen-btn');
  const renderWrap    = document.getElementById('cg-render-wrap');
  const lightbox      = document.getElementById('cg-lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  function openLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (fullscreenBtn)  fullscreenBtn.addEventListener('click', openLightbox);
  if (renderWrap)     renderWrap.addEventListener('click', (e) => { if (e.target === renderWrap || e.target.classList.contains('emp-render-img')) openLightbox(); });
  if (lightboxClose)  lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  console.log('BR LOG® – Site carregado com sucesso!');
})();
