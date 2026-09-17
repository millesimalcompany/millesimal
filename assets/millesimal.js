/* ═══════════════════════════════════════════════════════════════════════
   MILLESIMAL — motion & interaction
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

  /* ── 6. the seven checks — live verdict machine ─────────────────── */
  var machine = $('#checks-machine');
  if (machine) {
    var CRITERIA = [
      { n: 'Role', plain: 'Right person',
        why: 'The attendee holds a role with documented authority, or direct functional responsibility, in the category being sold into. Assessed on the role, never on what the person claims about budget.',
        cite: 'Standard v1.0 · criterion 1' },
      { n: 'Fit', plain: 'Right company',
        why: 'The account matches the Ideal Customer Profile agreed in writing before outreach began. An ICP cannot be widened after the fact, and "close enough" is not a finding.',
        cite: 'Standard v1.0 · criterion 2' },
      { n: 'Awareness', plain: 'They knew who they were meeting',
        why: 'The attendee could state, in their own words, what the vendor does — before or at the start of the meeting. Recognition, not approval.',
        cite: 'Standard v1.0 · criterion 3' },
      { n: 'Need', plain: 'They said it themselves',
        why: 'The attendee described a problem or situation inside the vendor’s solution space. It need not be urgent or funded. It must be real, relevant, and in their own framing.',
        cite: 'Standard v1.0 · criterion 4' },
      { n: 'Consent', plain: 'They agreed to a sales call',
        why: 'The attendee knowingly agreed to a commercial conversation with this vendor. Gift cards, research framings and mistaken identity all fail here. This criterion protects the buyer’s brand, not only the invoice.',
        cite: 'Standard v1.0 · criterion 5' },
      { n: 'Attendance', plain: 'They turned up',
        why: 'The meeting happened, with the qualifying attendee present, for long enough to hold a real conversation. Two reschedules are permitted; a third voids the meeting either way.',
        cite: 'Standard v1.0 · criterion 6' },
      { n: 'Novelty', plain: 'New to the buyer',
        why: 'The account was not in the buyer’s active pipeline and was not on the suppression list supplied at campaign start. A buyer who supplies no list waives this objection.',
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
        sub.textContent = 'All seven criteria met. The meeting counts, the fee stands, and the agency’s cleared count rises by one.';
      } else if (failed.length === 1) {
        sub.textContent = 'Fails on ' + CRITERIA[failed[0]].n + '. Six of seven is not a qualified meeting — it is an unqualified meeting with a good excuse. The record names the criterion, because "failed on Fit" and "failed on Consent" say very different things about an agency.';
      } else {
        sub.textContent = 'Fails on ' + failed.map(function (i) { return CRITERIA[i].n; }).join(', ') + '. Each criterion is decided separately, so the record shows every one that failed rather than a single grade.';
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
      dTitle.textContent = (idx + 1) + '. ' + c.n + ' — ' + c.plain;
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

  /* ── 9. deep-link a preselected route into the form ─────────────── */
  var partySelect = $('#party');
  if (partySelect && location.hash) {
    var m = location.hash.match(/^#(?:start|ruling)-(buyer|agency|panel)$/);
    if (m) {
      partySelect.value = m[1];
      var target = $('#start');
      if (target) target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    }
  }
  $$('[data-route]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (partySelect) partySelect.value = a.getAttribute('data-route');
    });
  });

  /* ── 10. year stamp ─────────────────────────────────────────────── */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
