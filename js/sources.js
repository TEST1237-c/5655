// ========================
// Y8X SOURCE — SOURCES PAGE
// ========================

const cards = Array.from(document.querySelectorAll('#sourcesGrid .source-card'));
const searchInput = document.getElementById('searchInput');
const sortSelect  = document.getElementById('sortSelect');
const filterPills = document.querySelectorAll('.filter-pill');
const langPills   = document.querySelectorAll('.lang-pill');
const resultsCount = document.getElementById('resultsCount');
const emptyState  = document.getElementById('emptyState');
const viewGrid    = document.getElementById('viewGrid');
const viewList    = document.getElementById('viewList');
const grid        = document.getElementById('sourcesGrid');
const resetBtn    = document.getElementById('resetFilters');

let activeFilter = 'all';
let activeLang   = 'all';
let searchQuery  = '';
let sortMode     = 'recent';

// ---- Filter & sort ----
function applyFilters() {
  let visible = cards.filter(card => {
    const matchCat  = activeFilter === 'all' || card.dataset.cat  === activeFilter;
    const matchLang = activeLang   === 'all' || card.dataset.lang === activeLang;
    const q = searchQuery;
    const name = card.dataset.name.toLowerCase();
    const desc = card.querySelector('.source-desc')?.textContent.toLowerCase() || '';
    const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase()).join(' ');
    const matchQ = !q || name.includes(q) || desc.includes(q) || tags.includes(q);
    return matchCat && matchLang && matchQ;
  });

  if (sortMode === 'popular') visible.sort((a, b) => +b.dataset.downloads - +a.dataset.downloads);
  else if (sortMode === 'starred') visible.sort((a, b) => +b.dataset.stars - +a.dataset.stars);
  else if (sortMode === 'name')    visible.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));

  cards.forEach(c => { c.style.display = 'none'; });
  visible.forEach(c => { c.style.display = ''; grid.appendChild(c); });

  // Translated result count
  const n = visible.length;
  if (typeof t === 'function') {
    // Use i18n if available
    const lang = getLang ? getLang() : 'fr';
    const labels = {
      fr: `${n} source${n !== 1 ? 's' : ''} trouvée${n !== 1 ? 's' : ''}`,
      en: `${n} source${n !== 1 ? 's' : ''} found`,
      es: `${n} fuente${n !== 1 ? 's' : ''} encontrada${n !== 1 ? 's' : ''}`,
    };
    resultsCount.textContent = labels[lang] || labels.fr;
  } else {
    resultsCount.textContent = `${n} source${n !== 1 ? 's' : ''} trouvée${n !== 1 ? 's' : ''}`;
  }

  // Show/hide empty state
  if (n === 0) {
    emptyState.style.display = 'block';
    // Pick the right empty message (no results vs no sources at all)
    const hasCards = cards.length > 0;
    const h3 = emptyState.querySelector('h3');
    const p  = emptyState.querySelector('p');
    if (h3) h3.dataset.i18n = hasCards ? 'sp_empty_title' : 'sp_empty2_title';
    if (p)  p.dataset.i18n  = hasCards ? 'sp_empty_desc'  : 'sp_empty2_desc';
    if (typeof applyTranslations === 'function') applyTranslations();
  } else {
    emptyState.style.display = 'none';
  }
}

// ---- Category pills ----
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    applyFilters();
  });
});

// ---- Language pills (source filter, not UI lang) ----
langPills.forEach(pill => {
  pill.addEventListener('click', () => {
    langPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeLang = pill.dataset.lang;
    applyFilters();
  });
});

// ---- Search ----
if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase().trim();
    applyFilters();
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchQuery = '';
      applyFilters();
    }
  });
}

// ---- Sort ----
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    sortMode = sortSelect.value;
    applyFilters();
  });
}

// ---- View toggle ----
if (viewGrid) viewGrid.addEventListener('click', () => {
  viewGrid.classList.add('active');
  viewList.classList.remove('active');
  grid.classList.remove('list-view');
});

if (viewList) viewList.addEventListener('click', () => {
  viewList.classList.add('active');
  viewGrid.classList.remove('active');
  grid.classList.add('list-view');
});

// ---- Reset button ----
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (searchInput) { searchInput.value = ''; }
    searchQuery  = '';
    activeFilter = 'all';
    activeLang   = 'all';
    if (sortSelect) sortSelect.value = 'recent';
    sortMode = 'recent';
    filterPills.forEach(p => p.classList.toggle('active', p.dataset.filter === 'all'));
    langPills.forEach(p => p.classList.toggle('active', p.dataset.lang === 'all'));
    applyFilters();
  });
}

// Re-run filters when language changes so the result label updates
document.addEventListener('y8x-lang-changed', applyFilters);

// ---- Initial render ----
applyFilters();
