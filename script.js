/* ===================================
   GLAMOUR SALON WAH CANTT — JS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Hero BG Animation ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) setTimeout(() => heroBg.classList.add('animated'), 100);

  /* ---- Scroll Progress Bar ---- */
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrollTop / docHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }, { passive: true });

  /* ---- Sticky Navbar ---- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Active Nav Link on Scroll ---- */
  const navLinks = document.querySelectorAll('.nav-link:not(.btn-book)');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ---- Hamburger Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinksMenu = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksMenu.classList.toggle('open');
  });

  // Close menu on nav link click
  navLinksMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksMenu.classList.remove('open');
    });
  });

  /* ---- Dark / Light Mode ---- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('gs-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('gs-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  /* ---- Smooth Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Typing Text Effect ---- */
  const typingEl = document.getElementById('typingText');
  const phrases = [
    'Glamour Salon',
    'Wah Cantt',
    'Premium Grooming',
    'Expert Barbers'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    typingTimeout = setTimeout(typeEffect, delay);
  }

  if (typingEl) typeEffect();

  /* ---- Scroll Animations (Intersection Observer) ---- */
  const animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animEls.forEach(el => observer.observe(el));

  /* ---- Counter Animation ---- */
  const counters = document.querySelectorAll('.counter-num');
  let counterStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counterStarted) {
      counterStarted = true;
      counters.forEach(counter => animateCounter(counter));
    }
  }, { threshold: 0.3 });

  const countersSection = document.querySelector('.counters-grid');
  if (countersSection) counterObserver.observe(countersSection);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }

  /* ---- Gallery Filter ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ---- Lightbox ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryItems = [];
  let currentLightboxIndex = 0;

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
      currentLightboxIndex = currentGalleryItems.indexOf(item);
      openLightbox(currentGalleryItems[currentLightboxIndex]);
    });
  });

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay p');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);

  lightboxPrev.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    openLightbox(currentGalleryItems[currentLightboxIndex]);
  });

  lightboxNext.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryItems.length;
    openLightbox(currentGalleryItems[currentLightboxIndex]);
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* ---- Testimonials Slider ---- */
  const track = document.getElementById('testimonialsTrack');
  const testiPrev = document.getElementById('testiPrev');
  const testiNext = document.getElementById('testiNext');
  const testiDotsContainer = document.getElementById('testiDots');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];

  let testiIndex = 0;
  let testiAuto;
  const visibleCount = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
  const maxIndex = Math.max(0, cards.length - visibleCount);

  // Create dots
  const dotCount = maxIndex + 1;
  const dots = [];
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.classList.add('testi-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTesti(i));
    testiDotsContainer.appendChild(dot);
    dots.push(dot);
  }

  function goToTesti(index) {
    testiIndex = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${testiIndex * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === testiIndex));
  }

  if (testiPrev) testiPrev.addEventListener('click', () => { goToTesti(testiIndex - 1); resetAuto(); });
  if (testiNext) testiNext.addEventListener('click', () => { goToTesti(testiIndex + 1 > maxIndex ? 0 : testiIndex + 1); resetAuto(); });

  function startAuto() {
    testiAuto = setInterval(() => {
      goToTesti(testiIndex + 1 > maxIndex ? 0 : testiIndex + 1);
    }, 4000);
  }

  function resetAuto() {
    clearInterval(testiAuto);
    startAuto();
  }

  if (cards.length > 0) startAuto();

  /* ---- Appointment Form ---- */
  const form = document.getElementById('appointmentForm');
  const successModal = document.getElementById('successModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalDetails = document.getElementById('modalDetails');

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }

  function clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('show'); }
  }

  function validateForm() {
    let valid = true;
    ['nameError', 'phoneError', 'emailError', 'serviceError', 'dateError', 'timeError'].forEach(id => clearError(id));

    const name = document.getElementById('fullName').value.trim();
    if (!name || name.length < 2) { showError('nameError', 'Please enter your full name (min 2 characters)'); valid = false; }

    const phone = document.getElementById('phone').value.trim();
    if (!phone || !/^[\d\s+\-()]{10,15}$/.test(phone)) { showError('phoneError', 'Please enter a valid phone number'); valid = false; }

    const email = document.getElementById('email').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('emailError', 'Please enter a valid email address'); valid = false; }

    const service = document.getElementById('service').value;
    if (!service) { showError('serviceError', 'Please select a service'); valid = false; }

    const date = document.getElementById('date').value;
    if (!date) { showError('dateError', 'Please select a preferred date'); valid = false; }

    const time = document.getElementById('time').value;
    if (!time) { showError('timeError', 'Please select a preferred time'); valid = false; }

    return valid;
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm()) return;

      const data = {
        name: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        service: document.getElementById('service').options[document.getElementById('service').selectedIndex].text,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        notes: document.getElementById('notes').value.trim(),
        bookingId: 'GS-' + Date.now().toString().slice(-6),
        bookedAt: new Date().toLocaleString()
      };

      // Save to local storage
      const existing = JSON.parse(localStorage.getItem('gs-appointments') || '[]');
      existing.push(data);
      localStorage.setItem('gs-appointments', JSON.stringify(existing));

      // Show modal
      modalDetails.innerHTML = `
        <div><strong>Booking ID:</strong> ${data.bookingId}</div>
        <div><strong>Name:</strong> ${data.name}</div>
        <div><strong>Service:</strong> ${data.service}</div>
        <div><strong>Date:</strong> ${data.date}</div>
        <div><strong>Time:</strong> ${formatTime(data.time)}</div>
        <div><strong>Phone:</strong> ${data.phone}</div>
      `;

      successModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      form.reset();
    });
  }

  function formatTime(timeStr) {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      successModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      successModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  /* ---- FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- Lazy Loading Images ---- */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.complete) {
            img.style.opacity = '1';
          } else {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
              img.style.transition = 'opacity 0.4s';
              img.style.opacity = '1';
            });
          }
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /* ---- Image Error Fallback ---- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.background = '#1a1a1a';
      img.style.minHeight = '200px';
    });
  });

  console.log('%cGlamour Salon Wah Cantt', 'font-size:20px;color:#D4AF37;font-weight:bold;');
  console.log('%cBest Men\'s Grooming Experience', 'font-size:12px;color:#888;');
});
