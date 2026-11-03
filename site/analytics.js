// Site-wide GA4 events. The gtag config itself lives in each page's <head>.
(() => {
  const track = (name, params = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  };
  window.track = track;

  // Where on the page an element sits: header, footer, or the enclosing section's id or class.
  const locate = (el) => {
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    const section = el.closest('section');
    if (!section) return 'body';
    return section.id || section.classList[0] || 'section';
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const params = { link_location: locate(link), link_text: link.textContent.trim().slice(0, 100) };

    if (href.endsWith('.dmg')) track('download_click', params);
    else if (href === '/buy' || href.startsWith('/buy#')) track('pro_cta_click', params);
    else if (href.startsWith('mailto:')) track('contact_click', params);
    else if (href.startsWith('/decibar-vs-') || href === '/compare') track('compare_click', { ...params, destination: href });
  });

  // FAQ and help accordions: count questions people open, not ones that start open.
  document.querySelectorAll('details').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      const question = details.querySelector('summary')?.textContent.trim().slice(0, 100);
      track('faq_open', { question });
    });
  });

  if (document.body?.dataset.page === '404') track('page_not_found', { page_path: location.pathname });
})();
