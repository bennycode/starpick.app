// Picks the page language (?hl=en|de, otherwise the browser's language) and the light or dark mode
// (the visitor's pick from the sun/moon button, otherwise the system's). Runs in <head>, before the
// page is drawn, so nothing flashes up. Without JavaScript both languages show and the mode follows
// the system.
(function () {
  var param = new URLSearchParams(location.search).get('hl');
  var hl = param === 'de' || param === 'en' ? param : /^de\b/i.test(navigator.language || '') ? 'de' : 'en';
  var root = document.documentElement;
  root.setAttribute('data-hl', hl);
  root.lang = hl;

  // A picked mode is remembered; storage can be unavailable (private mode), then it lasts this page.
  var theme = null;
  try { theme = localStorage.getItem('theme'); } catch (e) {}
  function applyTheme() {
    if (theme !== 'light' && theme !== 'dark') return;
    root.setAttribute('data-theme', theme);
    // The screenshots pick light or dark with a media query; point it at the picked mode.
    document.querySelectorAll('source[data-dark]').forEach(function (source) {
      source.media = theme === 'dark' ? 'all' : 'not all';
    });
  }
  applyTheme();
  document.addEventListener('DOMContentLoaded', function () {
    // Keep the language when moving between pages.
    document.querySelectorAll('a[href^="/"]').forEach(function (a) {
      if (a.hasAttribute('data-switch')) return;
      var url = new URL(a.getAttribute('href'), location.origin);
      url.searchParams.set('hl', hl);
      a.setAttribute('href', url.pathname + url.search + url.hash);
    });
    document.querySelectorAll('a[data-switch]').forEach(function (a) {
      var url = new URL(location.href);
      url.searchParams.set('hl', a.getAttribute('data-switch'));
      a.setAttribute('href', url.pathname + url.search + url.hash);
      if (a.getAttribute('data-switch') === hl) a.setAttribute('aria-current', 'true');
    });
    document.querySelectorAll('source[media="(prefers-color-scheme: dark)"]').forEach(function (source) {
      source.setAttribute('data-dark', '');
    });
    applyTheme();
    var button = document.querySelector('button.theme');
    if (button) {
      button.setAttribute('aria-label', hl === 'de' ? 'Hell oder dunkel' : 'Light or dark mode');
      button.addEventListener('click', function () {
        var current = theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        theme = current === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('theme', theme); } catch (e) {}
        applyTheme();
      });
    }
    var title = document.querySelector('meta[name="title-' + hl + '"]');
    if (title) document.title = title.getAttribute('content');
  });
})();
