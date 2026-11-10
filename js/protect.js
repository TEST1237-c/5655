// ========================
// Y8X SOURCE — Protection
// ========================

(function() {

  // ---- Disable right click ----
  document.addEventListener('contextmenu', e => e.preventDefault());

  // ---- Disable keyboard shortcuts ----
  document.addEventListener('keydown', e => {
    // F12
    if (e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl+Shift+I/J/C/K (DevTools)
    if (e.ctrlKey && e.shiftKey && ['i','j','c','k'].includes(e.key.toLowerCase())) {
      e.preventDefault(); return false;
    }
    // Ctrl+U (view source), Ctrl+S (save), Ctrl+A (select all), Ctrl+P (print)
    if (e.ctrlKey && ['u','s','a','p'].includes(e.key.toLowerCase())) {
      e.preventDefault(); return false;
    }
    // Ctrl+F (find — reveals structure)
    if (e.ctrlKey && e.key.toLowerCase() === 'f') {
      e.preventDefault(); return false;
    }
  });

  // ---- Disable text selection ----
  document.addEventListener('selectstart', e => e.preventDefault());

  // ---- Disable drag ----
  document.addEventListener('dragstart', e => e.preventDefault());

  // ---- Disable copy/cut ----
  document.addEventListener('copy', e => e.preventDefault());
  document.addEventListener('cut',  e => e.preventDefault());

  // ---- DevTools detection (size-based) ----
  // Triggers when DevTools is opened as a separate panel
  const threshold = 160;
  function detectDevTools() {
    const widthDiff  = window.outerWidth  - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > threshold || heightDiff > threshold) {
      document.body.innerHTML = '';
      window.location.href = 'about:blank';
    }
  }

  setInterval(detectDevTools, 1000);
  window.addEventListener('resize', detectDevTools);

  // ---- DevTools detection (debugger timing trick) ----
  setInterval(function() {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const end = performance.now();
    // If devtools is open, debugger pauses and time delta is large
    if (end - start > 100) {
      document.body.innerHTML = '';
      window.location.href = 'about:blank';
    }
  }, 2000);

  // ---- Disable print ----
  window.addEventListener('beforeprint', e => {
    document.body.style.display = 'none';
  });
  window.addEventListener('afterprint', e => {
    document.body.style.display = '';
  });

  // ---- Block view-source via URL check ----
  if (window.location.protocol === 'view-source:') {
    window.location.href = 'about:blank';
  }

  // ---- Disable image saving ----
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('contextmenu', e => e.preventDefault());
  });

  // Also apply to future images
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.tagName === 'IMG') {
          node.setAttribute('draggable', 'false');
          node.addEventListener('contextmenu', e => e.preventDefault());
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
