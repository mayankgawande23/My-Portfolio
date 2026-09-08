/**
 * DEVELOPER PORTFOLIO - CORE JAVASCRIPT
 * Pure Vanilla JS - Performance-optimized, framework-free
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initProfileCard();
  initHeroTitleRotator();
  initDevActionRotator();
  initHeroCanvas();
  initCard3DTilt();
  initScrollAnimations();
  initContactForm();
  initEmailCopy();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // default dark
  document.documentElement.setAttribute('data-theme', initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. Header & Navigation (Scrollspy, Mobile Drawer & Sticky States)
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('mainHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksWrapper = document.getElementById('navLinksWrapper');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const brandLogo = document.getElementById('brandLogo');

  // Helper to open/close mobile navigation
  function closeMobileMenu() {
    mobileToggle?.classList.remove('active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    navLinksWrapper?.classList.remove('open');
    navMenu?.classList.remove('open');
    navBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const isOpening = !navLinksWrapper?.classList.contains('open');
    mobileToggle?.classList.toggle('active', isOpening);
    mobileToggle?.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
    navLinksWrapper?.classList.toggle('open', isOpening);
    navMenu?.classList.toggle('open', isOpening);
    navBackdrop?.classList.toggle('active', isOpening);
    document.body.style.overflow = isOpening ? 'hidden' : '';
  }

  // Header background on scroll and robust active section scrollspy
  function handleScroll() {
    const scrollY = window.pageYOffset || window.scrollY || 0;

    // Header scrolled elevation
    if (scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scrollspy: update active link based on scroll position
    const totalHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const isAtBottom = viewportHeight + scrollY >= totalHeight - 60;

    if (scrollY < 80) {
      // Top of page is Home
      setActiveLink('#home');
      return;
    }

    if (isAtBottom) {
      // Scrolled to bottom is Contact
      setActiveLink('#contact');
      return;
    }

    // Check intersecting section
    let activeId = null;
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 140;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        activeId = `#${sec.getAttribute('id')}`;
      }
    });

    if (activeId) {
      setActiveLink(activeId);
    }
  }

  function setActiveLink(hash) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial scroll position check
  handleScroll();

  // Mobile menu interactions
  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking any nav link or brand logo
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  if (brandLogo) {
    brandLogo.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  // Close menu when clicking mobile resume button
  const mobileNavResume = document.getElementById('mobileNavResume');
  if (mobileNavResume) {
    mobileNavResume.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinksWrapper?.classList.contains('open')) {
      closeMobileMenu();
      mobileToggle?.focus();
    }
  });

  // Close mobile menu if window is resized past mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinksWrapper?.classList.contains('open')) {
      closeMobileMenu();
    }
  }, { passive: true });

  // Back to Top Button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mouse cursor spotlight tracking
  const cursorSpotlight = document.getElementById('cursorSpotlight');
  if (cursorSpotlight && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      cursorSpotlight.style.left = `${e.clientX}px`;
      cursorSpotlight.style.top = `${e.clientY}px`;
    }, { passive: true });
  }
}

/* --------------------------------------------------------------------------
   2a. Personal Profile Card ("Mayank" Navbar Interaction)
   -------------------------------------------------------------------------- */
function initProfileCard() {
  const brandWrapper = document.getElementById('brandWrapper');
  const brandLogo = document.getElementById('brandLogo');
  const profileCard = document.getElementById('profileCard');

  if (!brandWrapper || !brandLogo || !profileCard) return;

  let isPinned = false;     // True if toggled open via click/tap/keyboard
  let hoverTimeout = null;  // Smooth mouseleave debounce timer
  let isHovered = false;

  function showCard(pinned = false) {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    if (pinned) {
      isPinned = true;
    }
    profileCard.classList.add('active');
    profileCard.setAttribute('aria-hidden', 'false');
    brandLogo.setAttribute('aria-expanded', 'true');
  }

  function hideCard(force = false) {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    if (force || !isPinned) {
      isPinned = false;
      profileCard.classList.remove('active');
      profileCard.setAttribute('aria-hidden', 'true');
      brandLogo.setAttribute('aria-expanded', 'false');
    }
  }

  // 1. Desktop hover interaction
  brandWrapper.addEventListener('mouseenter', () => {
    isHovered = true;
    showCard(false);
  });

  brandWrapper.addEventListener('mouseleave', () => {
    isHovered = false;
    if (!isPinned) {
      hoverTimeout = setTimeout(() => {
        if (!isHovered && !isPinned) {
          hideCard(false);
        }
      }, 150);
    }
  });

  // 2. Click / Tap interaction on "Mayank"
  brandLogo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isActive = profileCard.classList.contains('active');

    if (isActive) {
      if (isPinned) {
        // Was opened/pinned by click -> close it
        hideCard(true);
      } else {
        // Was opened only by hover -> clicking pins it open
        isPinned = true;
        brandLogo.setAttribute('aria-expanded', 'true');
      }
    } else {
      // Was closed -> click opens and pins it
      showCard(true);
    }
  });

  // Prevent clicks inside the profile card from closing it
  profileCard.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // 3. Click anywhere outside closes the card
  document.addEventListener('click', (e) => {
    if (!brandWrapper.contains(e.target)) {
      if (profileCard.classList.contains('active')) {
        hideCard(true);
      }
    }
  });

  // 4. Keyboard accessibility (Escape, Enter, Space)
  brandLogo.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (profileCard.classList.contains('active')) {
        e.preventDefault();
        hideCard(true);
        brandLogo.focus();
      }
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      const isActive = profileCard.classList.contains('active');
      if (isActive) {
        hideCard(true);
      } else {
        showCard(true);
      }
    }
  });

  profileCard.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      hideCard(true);
      brandLogo.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   2b. Hero Title Text Rotator
   -------------------------------------------------------------------------- */
function initHeroTitleRotator() {
  const rotator = document.getElementById('heroTitleRotator');
  if (!rotator) return;

  const items = rotator.querySelectorAll('.rotator-item');
  if (items.length < 2) return;

  // Check user preference for reduced motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) return;

  let currentIndex = 0;
  let intervalId = null;

  function rotateTitle() {
    const current = items[currentIndex];
    const nextIndex = (currentIndex + 1) % items.length;
    const next = items[nextIndex];

    // Current smoothly exits upward with fade
    current.classList.remove('active');
    current.classList.add('exit');

    // Slight stagger so exit begins before next enters for a crisp, professional transition
    setTimeout(() => {
      current.classList.remove('exit');
      next.classList.remove('exit');
      next.classList.add('active');
    }, 120);

    currentIndex = nextIndex;
  }

  function startRotation() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(rotateTitle, 2800);
  }

  function stopRotation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  startRotation();

  // Pause rotation when tab is hidden, resume when active
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopRotation();
    } else {
      startRotation();
    }
  });

  // Handle dynamic changes to prefers-reduced-motion
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        stopRotation();
        items.forEach((item, index) => {
          item.classList.remove('exit');
          if (index === 0) item.classList.add('active');
          else item.classList.remove('active');
        });
      } else {
        startRotation();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2b. Developer Action Visual Animation (Hero Interactive Card)
   -------------------------------------------------------------------------- */
function initDevActionRotator() {
  const card = document.getElementById('heroInteractiveCard');
  const stage = document.getElementById('devActionStage');
  if (!card || !stage) return;

  const slides = stage.querySelectorAll('.dev-action-slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  let intervalId = null;
  let isHovered = false;
  const DISPLAY_DURATION = 2600; // 2.6s per phrase (within requested 2-3s window)
  const TRANSITION_DELAY = 120;  // subtle upward stagger

  // Accessibility: respect prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    return; // Leave first slide static and active
  }

  function advanceSlide() {
    if (isHovered || document.hidden) return;

    const currentSlide = slides[currentIndex];
    currentIndex = (currentIndex + 1) % slides.length;
    const nextSlide = slides[currentIndex];

    // Current phrase fades out with subtle upward movement
    currentSlide.classList.remove('active');
    currentSlide.classList.add('exit');

    // Next phrase fades in with subtle upward movement
    setTimeout(() => {
      currentSlide.classList.remove('exit');
      nextSlide.classList.add('active');
    }, TRANSITION_DELAY);
  }

  function startRotation() {
    if (intervalId || mediaQuery.matches) return;
    intervalId = setInterval(advanceSlide, DISPLAY_DURATION);
  }

  function stopRotation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Hover behavior: pause on hover, resume on leave
  card.addEventListener('mouseenter', () => {
    isHovered = true;
    stopRotation();
  });

  card.addEventListener('mouseleave', () => {
    isHovered = false;
    startRotation();
  });

  // Pause when tab is hidden, resume when visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopRotation();
    } else if (!isHovered) {
      startRotation();
    }
  });

  // Handle dynamic OS changes to prefers-reduced-motion
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        stopRotation();
        slides.forEach((slide, idx) => {
          slide.classList.remove('exit');
          slide.classList.toggle('active', idx === 0);
        });
      } else {
        startRotation();
      }
    });
  }

  startRotation();
}

/* --------------------------------------------------------------------------
   3. Interactive Hero Background Canvas
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];
  const particleCount = 45;
  const connectionDistance = 120;

  const mouse = {
    x: null,
    y: null,
    radius: 140
  };

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.6)' : 'rgba(79, 70, 229, 0.4)';
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * (isDark ? 0.25 : 0.15);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${alpha})` : `rgba(79, 70, 229, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  resize();
  createParticles();
  render();
}

/* --------------------------------------------------------------------------
   4. 3D Tilt Effect on Interactive Cards
   -------------------------------------------------------------------------- */
function initCard3DTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (window.innerWidth < 992) return; // Disable on touch devices for smoothness

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll-Triggered Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   EMAILJS CONFIGURATION & INSTRUCTIONS
   --------------------------------------------------------------------------
   To enable live email delivery directly to mayankgawande23@gmail.com:
   1. Sign up or log in at https://www.emailjs.com/
   2. In "Email Services", add a service (e.g., Gmail) and copy your Service ID.
   3. In "Email Templates", create a template and copy your Template ID.
      Recommended EmailJS Template Settings:
      - Subject: {{subject}}
      - Content:
          Portfolio Contact Form Submission
          ---------------------------------
          Name: {{from_name}}
          Email: {{from_email}}
          Subject: {{subject}}

          Message:
          {{message}}
      - To Email: mayankgawande23@gmail.com
      - Reply-To: {{reply_to}} (allows direct reply to the visitor)
   4. In "Account" -> "General" -> API Keys, copy your Public Key.
   --------------------------------------------------------------------------
   REPLACE THE PLACEHOLDER VALUES BELOW WITH YOUR ACTUAL EMAILJS CREDENTIALS:
   ========================================================================== */
// Support environment variables from Vercel/Vite (.env prefixed with VITE_) with fallback to existing credentials
const EMAILJS_PUBLIC_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_PUBLIC_KEY) ? import.meta.env.VITE_EMAILJS_PUBLIC_KEY : '6-neXpIEGPuifCKLZ';
const EMAILJS_SERVICE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_SERVICE_ID) ? import.meta.env.VITE_EMAILJS_SERVICE_ID : 'service_8j2cjea';
const EMAILJS_TEMPLATE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_TEMPLATE_ID) ? import.meta.env.VITE_EMAILJS_TEMPLATE_ID : 'template_vy9yubu';
const PORTFOLIO_RECIPIENT_EMAIL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PORTFOLIO_RECIPIENT_EMAIL) ? import.meta.env.VITE_PORTFOLIO_RECIPIENT_EMAIL : 'mayankgawande23@gmail.com';

/* --------------------------------------------------------------------------
   6. Contact Form Interactive Handler (EmailJS Client-Side Integration)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form) return;

  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const subjectInput = document.getElementById('messageSubject');
  const messageInput = document.getElementById('messageBody');
  const honeypotInput = document.getElementById('formWebsite');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  let isSubmitting = false;
  let alertTimeout = null;

  // Initialize EmailJS Browser SDK if valid public key is set
  if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    try {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    } catch (e) {
      console.warn('EmailJS initialization note:', e);
    }
  }

  // Clear specific field validation on user input
  function attachFieldListener(inputEl, errorEl) {
    if (!inputEl) return;
    inputEl.addEventListener('input', () => {
      inputEl.classList.remove('invalid');
      if (errorEl) errorEl.classList.remove('visible');
      if (alertBox && alertBox.classList.contains('error')) {
        alertBox.style.display = 'none';
      }
    });
  }

  attachFieldListener(nameInput, nameError);
  attachFieldListener(emailInput, emailError);
  attachFieldListener(subjectInput, subjectError);
  attachFieldListener(messageInput, messageError);

  function showAlert(type, message) {
    if (!alertBox) return;
    if (alertTimeout) {
      clearTimeout(alertTimeout);
      alertTimeout = null;
    }

    alertBox.className = `form-status-alert ${type}`;

    if (type === 'success') {
      alertBox.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${message}</span>
      `;
    } else {
      alertBox.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${message}</span>
      `;
    }

    alertBox.style.display = 'flex';

    if (type === 'success') {
      alertTimeout = setTimeout(() => {
        alertBox.style.display = 'none';
      }, 7000);
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent multiple submissions simultaneously
    if (isSubmitting) return;

    // Honeypot check: If bot filled hidden field, simulate success silently
    if (honeypotInput && honeypotInput.value.trim() !== '') {
      form.reset();
      showAlert('success', "Message sent successfully! I'll get back to you soon.");
      return;
    }

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const subjectVal = subjectInput ? subjectInput.value.trim() : '';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    let isValid = true;
    let firstInvalidField = null;

    // Validate Name
    if (!nameVal) {
      isValid = false;
      if (nameInput) nameInput.classList.add('invalid');
      if (nameError) nameError.classList.add('visible');
      if (!firstInvalidField) firstInvalidField = nameInput;
    } else {
      if (nameInput) nameInput.classList.remove('invalid');
      if (nameError) nameError.classList.remove('visible');
    }

    // Validate Email
    if (!emailVal || !validateEmail(emailVal)) {
      isValid = false;
      if (emailInput) emailInput.classList.add('invalid');
      if (emailError) {
        emailError.textContent = !emailVal ? 'Please enter your email address.' : 'Please enter a valid email address (e.g. name@example.com).';
        emailError.classList.add('visible');
      }
      if (!firstInvalidField) firstInvalidField = emailInput;
    } else {
      if (emailInput) emailInput.classList.remove('invalid');
      if (emailError) emailError.classList.remove('visible');
    }

    // Validate Subject
    if (!subjectVal) {
      isValid = false;
      if (subjectInput) subjectInput.classList.add('invalid');
      if (subjectError) subjectError.classList.add('visible');
      if (!firstInvalidField) firstInvalidField = subjectInput;
    } else {
      if (subjectInput) subjectInput.classList.remove('invalid');
      if (subjectError) subjectError.classList.remove('visible');
    }

    // Validate Message
    if (!messageVal) {
      isValid = false;
      if (messageInput) messageInput.classList.add('invalid');
      if (messageError) messageError.classList.add('visible');
      if (!firstInvalidField) firstInvalidField = messageInput;
    } else {
      if (messageInput) messageInput.classList.remove('invalid');
      if (messageError) messageError.classList.remove('visible');
    }

    // If validation fails, focus the first erroneous input without reloading or clearing data
    if (!isValid) {
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    // Enter loading state on button
    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Sending...
      `;
    }

    // Prepare template parameters
    const templateParams = {
      from_name: nameVal,
      name: nameVal,
      from_email: emailVal,
      email: emailVal,
      reply_to: emailVal, // Ensures replying in Gmail directly replies to the sender
      subject: subjectVal,
      message: messageVal,
      to_name: 'Mayank Gawande',
      recipient_email: PORTFOLIO_RECIPIENT_EMAIL,
      source: 'Portfolio Contact Form'
    };

    // Check if configuration placeholders are still present
    const isConfigured = 
      EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
      EMAILJS_SERVICE_ID && EMAILJS_SERVICE_ID !== 'YOUR_EMAILJS_SERVICE_ID' &&
      EMAILJS_TEMPLATE_ID && EMAILJS_TEMPLATE_ID !== 'YOUR_EMAILJS_TEMPLATE_ID';

    if (!isConfigured) {
      // Re-enable button and preserve form input values
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message <span>→</span>`;
      }
      showAlert(
        'error',
        'EmailJS configuration required: Please replace YOUR_EMAILJS_PUBLIC_KEY, YOUR_EMAILJS_SERVICE_ID, and YOUR_EMAILJS_TEMPLATE_ID in js/script.js with your EmailJS credentials.'
      );
      return;
    }

    try {
      // Send message via EmailJS Browser SDK
      if (window.emailjs && typeof window.emailjs.send === 'function') {
        await window.emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          { publicKey: EMAILJS_PUBLIC_KEY }
        );
      } else {
        // Fallback to direct EmailJS HTTP client endpoint
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: templateParams
          })
        });

        if (!response.ok) {
          const errMsg = await response.text();
          throw new Error(errMsg || `Email transmission failed with code ${response.status}`);
        }
      }

      // Success: Clear form inputs, show success notification, temporarily update button
      form.reset();
      showAlert('success', "Message sent successfully! I'll get back to you soon.");

      if (submitBtn) {
        submitBtn.innerHTML = `Message Sent ✓`;
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Send Message <span>→</span>`;
          isSubmitting = false;
        }, 3000);
      } else {
        isSubmitting = false;
      }

    } catch (err) {
      console.error('EmailJS sending error:', err);

      // Failure: Preserve user's entered form values, restore button, show error
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message <span>→</span>`;
      }
      showAlert(
        'error',
        'Something went wrong. Please try again later, or contact me directly at mayankgawande23@gmail.com.'
      );
    }
  });
}

/* --------------------------------------------------------------------------
   7. Copy Email Helper
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'mayankgawande23@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = 'Copied!';
      copyBtn.style.color = 'var(--accent-success)';
      copyBtn.style.borderColor = 'var(--accent-success)';

      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 2000);
    });
  });
}
