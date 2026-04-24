'use strict';

// ===== NAV: sticky shadow + mobile toggle =====
const navWrapper = document.getElementById('top') && document.querySelector('.nav-wrapper');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navWrapper) {
  const onScroll = () => {
    navWrapper.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close drawer when a link is tapped
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-label', 'Open menu');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navWrapper.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });
}

// ===== TOAST helper =====
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message, type = 'success', duration = 4000) {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');

if (form) {
  const fields = {
    name: { el: form.querySelector('#name'), label: 'name' },
    business: { el: form.querySelector('#business'), label: 'business name' },
    email: { el: form.querySelector('#email'), label: 'email' },
    package: { el: form.querySelector('#package'), label: 'package selection' },
  };

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function setFieldError(field, message) {
    const el = field.el;
    el.classList.add('error');
    let errSpan = el.parentElement.querySelector('.field-error');
    if (!errSpan) {
      errSpan = document.createElement('span');
      errSpan.className = 'field-error';
      errSpan.setAttribute('role', 'alert');
      el.parentElement.appendChild(errSpan);
    }
    errSpan.textContent = message;
  }

  function clearFieldError(field) {
    const el = field.el;
    el.classList.remove('error');
    const errSpan = el.parentElement.querySelector('.field-error');
    if (errSpan) errSpan.textContent = '';
  }

  function validateAll() {
    let valid = true;

    Object.entries(fields).forEach(([key, field]) => {
      const val = field.el.value.trim();
      if (!val || val === '') {
        setFieldError(field, `Please enter your ${field.label}.`);
        valid = false;
      } else if (key === 'email' && !validateEmail(val)) {
        setFieldError(field, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearFieldError(field);
      }
    });

    return valid;
  }

  // Live error clearing
  Object.values(fields).forEach(field => {
    field.el.addEventListener('input', () => clearFieldError(field));
    field.el.addEventListener('change', () => clearFieldError(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateAll()) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Build mailto link as the submission method (no backend needed)
    const name = fields.name.el.value.trim();
    const business = fields.business.el.value.trim();
    const email = fields.email.el.value.trim();
    const pkg = fields.package.el.options[fields.package.el.selectedIndex].text;
    const message = form.querySelector('#message').value.trim();

    const subject = encodeURIComponent(`Website Quote Request — ${business}`);
    const body = encodeURIComponent(
      `Name: ${name}\nBusiness: ${business}\nEmail: ${email}\nPackage: ${pkg}\n\nMessage:\n${message || '(none)'}`
    );

    const mailtoLink = `mailto:qdwebservices22@gmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      showToast('Your email client should open! If not, email us directly at qdwebservices22@gmail.com', 'success', 6000);
      form.reset();
    }, 800);
  });
}

// ===== SMOOTH SCROLL POLYFILL for anchor links =====
// (Handles browsers where CSS scroll-behavior isn't supported)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
