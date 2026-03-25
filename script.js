// ===== SCROLL PROGRESS =====
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollProgress) scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);
themeToggle?.addEventListener('click', () => {
  const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});
function updateThemeIcon(theme) {
  const icon = themeToggle?.querySelector('i');
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== MOBILE MENU =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
navToggle?.addEventListener('click', () => {
  navMenu?.classList.toggle('active');
  navToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('active');
    navToggle?.classList.remove('active');
  });
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
  document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-to-top')?.classList.toggle('visible', window.scrollY > 500);
});

// ===== TYPING ANIMATION =====
const typedEl = document.getElementById('typed-text');
const roles = ['ML Engineer & MLOps','Fundador do CobrancaAuto','Agentes IA Autonomos','Desenvolvedor Full Stack','Especialista em Cybersecurity'];
let ri = 0, ci = 0, deleting = false;
function typeLoop() {
  if (!typedEl) return;
  const cur = roles[ri];
  typedEl.textContent = deleting ? cur.substring(0, ci--) : cur.substring(0, ci++);
  if (!deleting && ci === cur.length + 1) { setTimeout(() => { deleting = true; typeLoop(); }, 2000); return; }
  if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let start, dur = 1500;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(p * target) + '+';
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.classList.contains('about-stats')) {
      document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
    }
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.skill-category, .certificate-card, .project-card, .contact-card, .about-stats, .education-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== BACK TO TOP =====
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
