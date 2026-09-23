/* ═══════════════════════════════════════════════════════════════════════
   MILLESIMAL · motion and interaction
   Progressive enhancement only. Every element resolves to its final
   state if JS never runs, and again if prefers-reduced-motion is set.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── 1. nav state + scroll progress ─────────────────────────────── */
  var nav = $('.nav');
  var bar = $('.progress');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ── 2. reveal on enter, with stagger ───────────────────────────── */
  var reveals = $$('[data-reveal]');
  if (REDUCED || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    $$('.split').forEach(function (el) { el.classList.add('in'); });
  } else {
    reveals.forEach(function (el) {
      var d = parseInt(el.getAttribute('data-reveal'), 10);
      if (d) el.style.setProperty('--rd-delay', d + 'ms');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });

    /* headline: split into masked lines, then release */
    $$('.split').forEach(function (el) {
      var lines = $$('.ln > span', el);
      lines.forEach(function (s, i) { s.style.setProperty('--d', (i * 88) + 'ms'); });
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io2.unobserve(e.target);
        });
      }, { threshold: 0.2 });
      io2.observe(el);
    });
  }

  /* ── 3. number tickers ──────────────────────────────────────────── */
  function tickTo(el, to, ms) {
    if (REDUCED) { el.textContent = to; return; }
    var from = parseInt(el.textContent, 10) || 0;
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min((now - t0) / ms, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  window.millesimalTick = tickTo;

  $$('[data-count]').forEach(function (el) {
    var to = parseInt(el.getAttribute('data-count'), 10);
    if (REDUCED || !('IntersectionObserver' in window)) { el.textContent = to; return; }
    el.textContent = '0';
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tickTo(e.target, to, 1150);
        io3.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    io3.observe(el);
  });

  /* ── 4. hallmark strike on first view ───────────────────────────── */
  $$('[data-strike]').forEach(function (el) {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var io4 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('struck');
        io4.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    io4.observe(el);
  });

  /* ── 5. copy-to-clipboard (the diffusion mechanic) ──────────────── */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = document.getElementById(btn.getAttribute('data-copy'));
      if (!src) return;
      var text = (src.innerText || src.textContent || '').trim();
      var done = function () {
        var was = btn.querySelector('.copy-label');
        btn.classList.add('done');
        if (was) { was.dataset.was = was.textContent; was.textContent = 'Copied'; }
        setTimeout(function () {
          btn.classList.remove('done');
          if (was && was.dataset.was) was.textContent = was.dataset.was;
        }, 2100);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else { fallback(text, done); }
    });
  });
  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:absolute;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }

  /* ── 6. the seven checks: live verdict machine ─────────────────── */
  var machine = $('#checks-machine');
  if (machine) {
    var CRITERIA = [
      { n: 'Role', plain: 'Right person',
        why: 'The attendee has documented authority, or direct responsibility, for what is being sold. We check the role itself, never what the person says about budget.',
        cite: 'Standard v1.0 · criterion 1' },
      { n: 'Fit', plain: 'Right company',
        why: 'The company matches the customer profile agreed in writing before outreach began. The profile cannot be widened afterwards, and "close enough" does not count.',
        cite: 'Standard v1.0 · criterion 2' },
      { n: 'Awareness', plain: 'They knew who they were meeting',
        why: 'Before or at the start of the meeting, the attendee could say in their own words what the vendor does. They need to know it, not like it.',
        cite: 'Standard v1.0 · criterion 3' },
      { n: 'Need', plain: 'They said it themselves',
        why: 'The attendee described a real problem the vendor can help with, in their own words. It does not need to be urgent or funded.',
        cite: 'Standard v1.0 · criterion 4' },
      { n: 'Consent', plain: 'They agreed to a sales call',
        why: 'The attendee knowingly agreed to a sales conversation with this vendor. Gift cards, fake research calls and mistaken identity all fail. This protects the buyer’s reputation as well as the invoice.',
        cite: 'Standard v1.0 · criterion 5' },
      { n: 'Attendance', plain: 'They turned up',
        why: 'The meeting happened, the right person was there, and it lasted long enough for a real conversation. Two reschedules are allowed. A third cancels the meeting.',
        cite: 'Standard v1.0 · criterion 6' },
      { n: 'Novelty', plain: 'New to the buyer',
        why: 'The company was not already in the buyer’s pipeline or on the exclusion list supplied at the start. A buyer who supplied no list cannot object on this ground.',
        cite: 'Standard v1.0 · criterion 7' }
    ];

    var btns = $$('.check', machine);
    var big = $('#verdict-big', machine);
    var sub = $('#verdict-sub', machine);
    var dial = $('#dial-num', machine);
    var dTitle = $('#detail-title', machine);
    var dBody = $('#detail-body', machine);
    var dCite = $('#detail-cite', machine);
    var cells = $$('#mini-strip .strip-cell', machine);

    function state() {
      return btns.map(function (b) { return b.getAttribute('aria-pressed') === 'true'; });
    }

    var pinned = 0;

    function render(focusIdx) {
      var s = state();
      var failed = [];
      s.forEach(function (v, i) { if (!v) failed.push(i); });
      var ok = failed.length === 0;

      big.textContent = ok ? 'QUALIFIED' : 'NOT QUALIFIED';
      big.className = 'verdict-big ' + (ok ? 'ok' : 'no');

      if (ok) {
        sub.textContent = 'All seven criteria met. The meeting counts, the fee stands, and the agency’s count of cleared meetings goes up by one.';
      } else if (failed.length === 1) {
        sub.textContent = 'Fails on ' + CRITERIA[failed[0]].n + '. Six out of seven does not qualify. The record names the criterion, because failing on Fit and failing on Consent say very different things about an agency.';
      } else {
        sub.textContent = 'Fails on ' + failed.map(function (i) { return CRITERIA[i].n; }).join(', ') + '. Each criterion is decided on its own, so the record shows every one that failed.';
      }

      cells.forEach(function (c, i) {
        c.classList.toggle('pass', s[i]);
        c.classList.toggle('fail', !s[i]);
      });

      btns.forEach(function (b, i) {
        var lbl = b.querySelector('.lbl');
        if (lbl) lbl.textContent = s[i] ? 'Pass' : 'Fail';
      });

      var rating = ok ? 1000 : Math.max(0, Math.round(1000 * (7 - failed.length) / 7));
      tickTo(dial, rating, 460);

      var idx = (typeof focusIdx === 'number') ? focusIdx : (failed.length ? failed[0] : 0);
      var c = CRITERIA[idx];
      dTitle.textContent = (idx + 1) + '. ' + c.n + ': ' + c.plain;
      dBody.textContent = c.why;
      dCite.textContent = c.cite;
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        pinned = i;
        render(i);
      });
      /* hover and keyboard focus preview a criterion without stealing the pin */
      b.addEventListener('mouseenter', function () { render(i); });
      b.addEventListener('focus', function () { render(i); });
    });

    var list = $('.check-list', machine);
    if (list) list.addEventListener('mouseleave', function () { render(pinned); });

    var reset = $('#checks-reset', machine);
    if (reset) reset.addEventListener('click', function () {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', 'true'); });
      pinned = 0;
      render(0);
    });

    var breakIt = $('#checks-break', machine);
    if (breakIt) breakIt.addEventListener('click', function () {
      btns.forEach(function (b, i) { b.setAttribute('aria-pressed', i === 1 ? 'false' : 'true'); });
      pinned = 1;
      render(1);
    });

    render(0);
  }

  /* ── 7. rulings switcher ────────────────────────────────────────── */
  var rulings = $('#rulings-switch');
  if (rulings) {
    var tabs = $$('[data-ruling]', rulings);
    var panes = $$('[data-pane]', rulings);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var id = t.getAttribute('data-ruling');
        tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); });
        panes.forEach(function (p) {
          var on = p.getAttribute('data-pane') === id;
          p.hidden = !on;
          if (on) { p.classList.remove('in'); void p.offsetWidth; p.classList.add('in'); }
        });
      });
    });
  }

  /* ── 8. form: route + async submit ──────────────────────────────── */
  $$('form[data-async]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var ok = form.parentNode.querySelector('.form-ok');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (btn) { btn.disabled = true; btn.dataset.was = btn.textContent; btn.textContent = 'Sending…'; }
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('bad');
        form.style.display = 'none';
        if (ok) ok.classList.add('show');
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.was || 'Send'; }
        var err = form.querySelector('.form-note');
        if (err) err.innerHTML = 'That did not send. Email <a href="mailto:hello@millesimal.uk" style="color:var(--judge)">hello@millesimal.uk</a> and it will be picked up the same way.';
      });
    });
  });

  /* ── 9. route every "submit" link to the form, preselected ─────────
     #submit-buyer / #submit-agency / #submit-panel (and the legacy
     #start-*, #ruling-*, #panel-form) select the party, retitle the form
     for that visitor, scroll it into view and put the cursor in email. */
  var partySelect = $('#party');
  var block = $('#submit');
  var COPY = {
    buyer:  { t: 'Send the meeting you are arguing about.', l: 'The meeting, and which check is in dispute', p: 'Which criterion is in dispute, and what the two of you disagree about.', c: 'Send the meeting', i: 'Tell us about the meeting and the criterion you disagree on. If the evidence is not enough to decide, we will tell you and not charge.', col: 'var(--buyer)' },
    agency: { t: 'Run a founding Diagnostic.', l: 'Your agency, and who you book meetings for', p: 'Roughly how many meetings you book a month, for which kinds of buyer, and whether clients have rejected any recently. Please do not send meeting notes yet. We will agree how first.', c: 'Request a Diagnostic', i: 'Send 20 of last month’s meetings as written notes. You get a private report within a week. It is free for the first two agencies, and nothing is published.', col: 'var(--agency)' },
    panel:  { t: 'Ask to join the v1.1 review panel.', l: 'Where you would push back on the Standard', p: 'Your role, and the criterion you think is wrong, unfair or unworkable in your market.', c: 'Ask to join', i: 'Panel members are named, credited and free to disagree in public. It costs nothing, and you do not have to adopt the Standard.', col: 'var(--prospect)' },
    other:  { t: 'Send one meeting, or ask one question.', l: 'The meeting, or the question', p: 'Which criterion is in dispute, and what the two of you disagree about.', c: 'Send it', i: 'Everything goes to one inbox and gets a reply from a person. If the evidence is not enough to decide, we will tell you and not charge.', col: 'var(--judge)' }
  };
  function setRoute(r) {
    if (!partySelect || !COPY[r]) return;
    partySelect.value = r;
    var k = COPY[r];
    var t = $('[data-form-title]'), l = $('[data-form-label]'), c = $('[data-form-cta]'), m = $('#msg');
    if (t) t.textContent = k.t;
    if (l) l.textContent = k.l;
    if (c) c.textContent = k.c;
    if (m) m.placeholder = k.p;
    var ii = $('[data-form-intro]'); if (ii) ii.textContent = k.i;
    if (block) { block.style.setProperty('--route-c', k.col); block.classList.add('routed'); }
  }
  function fromHash() {
    var m = location.hash.match(/^#(?:submit|start|ruling)-(buyer|agency|panel)$/);
    var r = m ? m[1] : (location.hash === '#panel-form' ? 'panel' : (location.hash === '#submit' ? partySelect && partySelect.value : null));
    if (!r || !block) return;
    setRoute(r);
    /* show the form at once (no reveal offset), then scroll to an exact position */
    $$('[data-reveal]', block).forEach(function (el) { el.style.transition = 'none'; el.classList.add('in'); });
    var go = function () {
      var tgt = window.innerWidth <= 1040 ? ($('.submit-panel', block) || block) : block;
      var y = tgt.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 88;
      window.scrollTo({ top: Math.max(0, y), behavior: REDUCED ? 'auto' : 'smooth' });
      var e = $('#email');
      if (e && window.matchMedia('(hover:hover) and (pointer:fine)').matches) setTimeout(function () { e.focus({ preventScroll: true }); }, REDUCED ? 0 : 700);
    };
    if (document.readyState === 'complete') requestAnimationFrame(go);
    else window.addEventListener('load', function () { setTimeout(go, 30); }, { once: true });
  }
  if (partySelect) {
    partySelect.addEventListener('change', function () { setRoute(partySelect.value); });
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }
  $$('[data-route]').forEach(function (a) {
    a.addEventListener('click', function () {
      /* same-page link to the hash already in the URL: hashchange will not fire */
      if (block && a.getAttribute('href') === location.hash) { fromHash(); }
    });
  });

  /* ── 10. year stamp ─────────────────────────────────────────────── */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
