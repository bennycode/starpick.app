// Picks the page language: ?hl=en|de, otherwise the browser's language. Runs in <head>, before the
// page is drawn, so the other language never flashes up. Without JavaScript both languages show.
(function () {
  var param = new URLSearchParams(location.search).get('hl');
  var hl = param === 'de' || param === 'en' ? param : /^de\b/i.test(navigator.language || '') ? 'de' : 'en';
  var root = document.documentElement;
  root.setAttribute('data-hl', hl);
  root.lang = hl;
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
    var title = document.querySelector('meta[name="title-' + hl + '"]');
    if (title) document.title = title.getAttribute('content');
  });
})();
