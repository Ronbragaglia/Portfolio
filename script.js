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

// ===== ACTIVE NAV + SCROLL EVENTS =====
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
const roles = [
  'ML Engineer & MLOps',
  'Fundador do CobrancaAuto',
  'Agentes IA Autonomos',
  'Desenvolvedor Full Stack',
  'Especialista em Cybersecurity'
];
let ri = 0, ci = 0, deleting = false;
function typeLoop() {
  if (!typedEl) return;
  const cur = roles[ri];
  typedEl.textContent = deleting ? cur.substring(0, ci--) : cur.substring(0, ci++);
  if (!deleting && ci === cur.length + 1) {
    setTimeout(() => { deleting = true; typeLoop(); }, 2000);
    return;
  }
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

document.querySelectorAll('.skill-category, .certificate-card, .contact-card, .about-stats, .education-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== BACK TO TOP =====
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== LANGUAGE COLORS =====
const langColors = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'Jupyter Notebook': '#DA5B0B',
  Shell: '#89e051',
  Vue: '#41b883',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  default: '#8b5cf6'
};

const skipRepos = ['Ronbragaglia', 'Portfolio'];
let allRepos = [];

// ===== FALLBACK DESCRIPTIONS =====
const repoDesc = {
  'Cobranca-auto': 'SaaS multi-tenant de cobranças automáticas via WhatsApp + Stripe para PMEs. Em produção.',
  'assistente_com-banco': 'Assistente de IA com memória persistente integrado a banco de dados SQL via LangChain.',
  'Azure-Voice-Language-Lab': 'Lab de reconhecimento de voz e análise de linguagem natural com Azure AI Services.',
  'code-generator-ai': 'Gerador de código com IA generativa — prompt → código pronto com explicação.',
  'Assistente-de-Voz-Inteligente': 'Assistente de voz com NLP, reconhecimento de intenções e respostas contextuais.',
  'DocuGen-AI': 'Gerador automático de documentos técnicos e relatórios usando LLMs.',
  'Automação-de-Busca-de-Empregos': 'Bot que automatiza busca, filtragem e candidatura a vagas com scraping + IA.',
};

// ===== RENDER REPO CARD =====
function renderCard(repo) {
  const lang = repo.language || 'Other';
  const color = langColors[lang] || langColors.default;
  const raw = repo.description || repoDesc[repo.name] || '';
  const desc = raw.length > 90 ? raw.substring(0, 90) + '...' : (raw || 'Projeto open source — acesse o repositório para mais detalhes.');
  const name = repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
  const updated = new Date(repo.updated_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  const stars = repo.stargazers_count > 0
    ? '<span class="repo-stars"><i class="fas fa-star"></i> ' + repo.stargazers_count + '</span>'
    : '';
  const liveLink = repo.homepage
    ? '<a href="' + repo.homepage + '" target="_blank" rel="noopener noreferrer" class="project-link project-link-live"><i class="fas fa-external-link-alt"></i> Demo</a>'
    : '';

  return '<article class="project-card fade-in" data-lang="' + lang + '">' +
    '<div class="project-image"><div class="project-placeholder repo-placeholder"><i class="fab fa-github"></i></div></div>' +
    '<div class="project-content">' +
    '<div class="project-header"><h3 class="repo-name">' + name + '</h3>' + stars + '</div>' +
    '<p class="project-description">' + desc + '</p>' +
    '<div class="project-tags">' +
    '<span class="tag tag-lang" style="background:' + color + '22;color:' + color + ';border:1px solid ' + color + '44">' +
    '<span class="lang-dot" style="background:' + color + '"></span>' + lang + '</span>' +
    '<span class="tag tag-date"><i class="fas fa-clock"></i> ' + updated + '</span>' +
    '</div>' +
    '<div class="project-links">' + liveLink +
    '<a href="' + repo.html_url + '" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fab fa-github"></i> Ver Codigo</a>' +
    '</div></div></article>';
}

// ===== RENDER WITH FILTER =====
function renderRepos(filter) {
  const grid = document.getElementById('github-projects');
  if (!grid) return;
  const filtered = filter === 'all' ? allRepos : allRepos.filter(r => r.language === filter);
  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;grid-column:1/-1;padding:2rem">Nenhum projeto encontrado.</p>';
    return;
  }
  grid.innerHTML = filtered.map(renderCard).join('');
  grid.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== FETCH GITHUB REPOS =====
async function loadGithubRepos() {
  const grid = document.getElementById('github-projects');
  if (!grid) return;
  try {
    const res = await fetch('https://api.github.com/users/Ronbragaglia/repos?sort=updated&per_page=100');
    if (!res.ok) throw new Error('API error');
    const repos = await res.json();
    allRepos = repos
      .filter(r => !r.fork && !skipRepos.includes(r.name))
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
    renderRepos('all');
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;grid-column:1/-1;padding:2rem">Nao foi possivel carregar os repositorios. <a href="https://github.com/Ronbragaglia" target="_blank" style="color:var(--primary)">Ver no GitHub</a></p>';
  }
}

// ===== FILTER BUTTONS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderRepos(btn.dataset.filter);
  });
});

loadGithubRepos();
