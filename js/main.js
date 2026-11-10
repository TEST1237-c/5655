// ========================
// Y8X SOURCE — MAIN JS
// ========================

// ---- Navbar scroll effect ----
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Mobile menu toggle ----
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (toggle) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '65px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(10,10,15,0.98)';
    navLinks.style.padding = '16px 24px';
    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.07)';

    if (!isOpen) {
      navLinks.style.display = 'flex';
    } else {
      navLinks.style.display = 'none';
    }
  });
}

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-link');

const observerOptions = {
  rootMargin: '-40% 0px -55% 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ---- Animated counters ----
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('fr-FR');
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-count]').forEach(el => {
  counterObserver.observe(el);
});

// ---- Smooth card entrance animation ----
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.source-card, .category-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease';
  cardObserver.observe(card);
});

// ---- Buttons placeholder toast ----
document.querySelectorAll('.btn-primary, .btn-download, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Only trigger for non-link buttons
    if (btn.tagName === 'BUTTON') {
      e.preventDefault();
      showToast('Fonctionnalité bientôt disponible 🚀');
    }
  });
});

function showToast(message) {
  const existing = document.querySelector('.y8x-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'y8x-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #1c1c2a;
    color: #e8e8f0;
    border: 1px solid rgba(108,99,255,0.35);
    padding: 12px 22px;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    animation: slideInToast 0.3s ease;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Add toast animation style
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInToast {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
`;
document.head.appendChild(style);
