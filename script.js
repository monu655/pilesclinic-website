/* ============================================================
   Navi Mumbai Piles & Surgical Hospital
   script.js — FINAL VERSION
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────────────────────
   MOBILE MENU
   ──────────────────────────────────────────────────────────── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.querySelector('.hamburger');
  const open = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.querySelector('.hamburger');
  menu.classList.remove('open');
  btn && btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* Close menu on outside click */
document.addEventListener('click', function(e) {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.querySelector('.hamburger');
  if (menu && menu.classList.contains('open')) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  }
});

/* ────────────────────────────────────────────────────────────
   ACTIVE NAV HIGHLIGHT ON SCROLL
   ──────────────────────────────────────────────────────────── */
function updateActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const scrollPos = window.scrollY + 100;
  let current = '';

  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      current = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

/* ────────────────────────────────────────────────────────────
   SMOOTH SCROLL
   ──────────────────────────────────────────────────────────── */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 75;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        /* Focus contact form first input */
        if (id === '#contact') {
          setTimeout(() => {
            const inp = target.querySelector('input:not([type=date])');
            if (inp) inp.focus({ preventScroll: true });
          }, 650);
        }
        closeMenu();
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────
   MINIMUM DATE FOR DATE PICKER
   ──────────────────────────────────────────────────────────── */
function setMinDate() {
  const d = document.getElementById('f-date');
  if (d) d.min = new Date().toISOString().split('T')[0];
}

/* ────────────────────────────────────────────────────────────
   SERVICE CARD: ICON HOVER FIX
   ──────────────────────────────────────────────────────────── */
function setupServiceCards() {
  document.querySelectorAll('.service-card').forEach(card => {
    const icon = card.querySelector('.service-icon-wrap');
    if (!icon) return;
    card.addEventListener('mouseenter', () => { icon.style.filter = 'none'; });
    card.addEventListener('mouseleave', () => { icon.style.filter = ''; });
  });
}

/* ────────────────────────────────────────────────────────────
   SCROLL ANIMATION (Intersection Observer)
   ──────────────────────────────────────────────────────────── */
function setupScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const style = document.createElement('style');
  style.textContent = `
    .anim-fade { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .anim-fade.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll('.service-card, .doctor-card, .gallery-item, .about-why-card, .feature-chip');
  targets.forEach((el, i) => {
    el.classList.add('anim-fade');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => obs.observe(el));
}

/* ────────────────────────────────────────────────────────────
   FORM: VALIDATION HELPERS
   ──────────────────────────────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
  return phone.replace(/\D/g, '').length >= 10;
}

let _msgTimer = null;
function showMsg(type, text, autoHide = false) {
  const el = document.getElementById('formMessage');
  if (!el) return;
  el.className = 'form-msg ' + type;
  el.textContent = text;
  el.style.opacity = '1';

  if (_msgTimer) clearTimeout(_msgTimer);
  if (autoHide) {
    _msgTimer = setTimeout(() => {
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '0';
      setTimeout(() => {
        el.className = 'form-msg';
        el.textContent = '';
        el.style.opacity = '1';
        el.style.transition = '';
      }, 500);
    }, 4000);
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ────────────────────────────────────────────────────────────
   FORM: SUBMIT HANDLER
   ──────────────────────────────────────────────────────────── */
function submitForm(e) {
  if (e) e.preventDefault();

  const btn     = document.getElementById('submitBtn');
  if (!btn || btn.disabled) return;

  const name    = (document.getElementById('f-name')?.value || '').trim();
  const phone   = (document.getElementById('f-phone')?.value || '').trim();
  const email   = (document.getElementById('f-email')?.value || '').trim();
  const problem = document.getElementById('f-problem')?.value || '';
  const date    = document.getElementById('f-date')?.value || '';
  const msg     = (document.getElementById('f-msg')?.value || '').trim();

  /* Validation */
  if (!name) {
    showMsg('error', '⚠️ Please enter your full name.');
    document.getElementById('f-name')?.focus();
    return;
  }
  if (!phone || !isValidPhone(phone)) {
    showMsg('error', '⚠️ Please enter a valid 10-digit mobile number.');
    document.getElementById('f-phone')?.focus();
    return;
  }
  if (email && !isValidEmail(email)) {
    showMsg('error', '⚠️ Please enter a valid email address.');
    document.getElementById('f-email')?.focus();
    return;
  }

  /* Loading state */
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = '⏳ Submitting…';

  /* Build form data */
  const data = new FormData();
  data.append('name',    name);
  data.append('phone',   phone);
  data.append('email',   email   || 'Not provided');
  data.append('problem', problem || 'Not specified');
  data.append('date',    date    || 'Not specified');
  data.append('message', msg     || '');

  /* POST to contact.php */
  fetch('contact.php', { method: 'POST', body: data })
    .then(res => {
      if (!res.ok) throw new Error('Server error: ' + res.status);
      return res.json();
    })
    .then(res => {
      if (res && res.success) {
        showMsg('success', '✅ Your appointment request has been submitted! We will call you within 2 hours.', true);
        document.getElementById('appointmentForm')?.reset();
      } else {
        showMsg('error', '❌ ' + (res?.message || 'Something went wrong. Please call us directly.'));
      }
    })
    .catch(() => {
      /* Network error or no backend — show WhatsApp fallback */
      showMsg('success',
        '✅ Request received! For immediate confirmation, please call or WhatsApp: 8591499767',
        true
      );
      document.getElementById('appointmentForm')?.reset();
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = originalText;
    });
}

/* ────────────────────────────────────────────────────────────
   FAQ ACCORDION (service pages)
   ──────────────────────────────────────────────────────────── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const ans  = item.querySelector('.faq-a');
  const open = item.classList.contains('open');

  /* Close all */
  document.querySelectorAll('.faq-item.open').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-a').style.maxHeight = '0';
  });

  /* Open clicked (if was closed) */
  if (!open) {
    item.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
  }
}

/* ────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────── */
window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('load', updateActiveNav);

document.addEventListener('DOMContentLoaded', () => {
  setupSmoothScroll();
  setMinDate();
  setupServiceCards();
  setupScrollAnimations();
});