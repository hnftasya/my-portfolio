/* ============================================================
   MAIN.JS — Portfolio Interactions
   ============================================================ */

'use strict';

// ==================== NAVBAR ====================

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const navItems  = document.querySelectorAll('.nav-link');

// Scroll → frosted glass
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run once on load

// Hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu on link click
navItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ==================== ACTIVE NAV HIGHLIGHT (IntersectionObserver) ====================

const sections = document.querySelectorAll('section[id], nav[id]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, {
  rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 20}px 0px -60% 0px`,
  threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));

// ==================== SCROLL REVEAL (IntersectionObserver) ====================

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optionally stop observing after reveal
      // revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ==================== CONTACT FORM VALIDATION ====================

const form        = document.getElementById('contact-form');
const nameInput   = document.getElementById('contact-name');
const emailInput  = document.getElementById('contact-email-input');
const messageArea = document.getElementById('contact-message');
const btnText     = form.querySelector('.btn-text');
const btnLoading  = form.querySelector('.btn-loading');
const formSuccess = document.getElementById('form-success');

function setError(inputEl, errorId, msg) {
  const errorEl = document.getElementById(errorId);
  errorEl.textContent = msg;
  inputEl.classList.toggle('error', !!msg);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let valid = true;

  const name = nameInput.value.trim();
  if (!name) {
    setError(nameInput, 'error-name', 'Please enter your name.');
    valid = false;
  } else if (name.length < 2) {
    setError(nameInput, 'error-name', 'Name must be at least 2 characters.');
    valid = false;
  } else {
    setError(nameInput, 'error-name', '');
  }

  const email = emailInput.value.trim();
  if (!email) {
    setError(emailInput, 'error-email', 'Please enter your email address.');
    valid = false;
  } else if (!validateEmail(email)) {
    setError(emailInput, 'error-email', 'Please enter a valid email address.');
    valid = false;
  } else {
    setError(emailInput, 'error-email', '');
  }

  const message = messageArea.value.trim();
  if (!message) {
    setError(messageArea, 'error-message', 'Please write a message.');
    valid = false;
  } else if (message.length < 10) {
    setError(messageArea, 'error-message', 'Message must be at least 10 characters.');
    valid = false;
  } else {
    setError(messageArea, 'error-message', '');
  }

  return valid;
}

// Real-time validation on blur
[nameInput, emailInput, messageArea].forEach(el => {
  el.addEventListener('blur', validateForm);
  el.addEventListener('input', () => {
    // Clear error as user types
    const errorId = 'error-' + el.id.replace('contact-', '').replace('-input', '');
    const errorEl = document.getElementById(errorId);
    if (errorEl && el.value.trim()) {
      errorEl.textContent = '';
      el.classList.remove('error');
    }
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm()) return;

  // Simulate submission (no backend)
  btnText.hidden = true;
  btnLoading.hidden = false;
  form.querySelector('button[type="submit"]').disabled = true;

  setTimeout(() => {
    btnText.hidden = false;
    btnLoading.hidden = true;
    form.querySelector('button[type="submit"]').disabled = false;
    formSuccess.hidden = false;
    form.reset();

    // Hide success after 5s
    setTimeout(() => { formSuccess.hidden = true; }, 5000);
  }, 1200);
});

// ==================== SMOOTH SCROLL (for older browsers) ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ==================== TIMELINE: fade-in dots ====================

const timelineDots = document.querySelectorAll('.timeline-dot');

const dotObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'dotAppear 0.5s cubic-bezier(0.16,1,0.3,1) both';
    }
  });
}, { threshold: 0.5 });

timelineDots.forEach(dot => dotObserver.observe(dot));

// Add keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes dotAppear {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

console.log('%c✨ Portfolio of Hanifah Tasya', 'font-size:16px; font-weight:bold; color:#E8A0BF;');
console.log('%cBuilt with HTML, CSS & JavaScript', 'color:#64748B; font-size:12px;');
