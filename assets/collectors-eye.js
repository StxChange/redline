/* Collector's Eye — daily Redline quiz.
   No backend: the puzzle is seeded from today's date so every player
   gets the same five questions; progress and streaks live in localStorage. */
(function () {
  'use strict';

  function track() { if (typeof gtag === 'function') gtag.apply(null, arguments); }

  // ---------- Daily seed ----------
  // Local date string, e.g. "2026-06-12" — players think in local days.
  var now = new Date();
  var TODAY = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
  var EPOCH = new Date(2026, 5, 12); // puzzle #1 = launch day
  var PUZZLE_NUM = Math.max(1, Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - EPOCH) / 86400000) + 1);

  function hashString(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ---------- Sweet 16 sprite data (4x4 grid in Sweet16Cars.png) ----------
  var SPRITE_CARS = [
    { name: 'Beatnik Bandit', x: 0, y: 0 }, { name: 'Custom Barracuda', x: 33.33, y: 0 },
    { name: 'Custom Camaro', x: 66.67, y: 0 }, { name: 'Custom Corvette', x: 100, y: 0 },
    { name: 'Custom Cougar', x: 0, y: 33.33 }, { name: 'Custom El Dorado', x: 33.33, y: 33.33 },
    { name: 'Custom Firebird', x: 66.67, y: 33.33 }, { name: 'Custom Fleetside', x: 100, y: 33.33 },
    { name: 'Custom Mustang', x: 0, y: 66.67 }, { name: 'Custom T-Bird', x: 33.33, y: 66.67 },
    { name: 'Custom Volkswagen', x: 66.67, y: 66.67 }, { name: 'Deora', x: 100, y: 66.67 },
    { name: 'Ford J-Car', x: 0, y: 100 }, { name: 'Hot Heap', x: 33.33, y: 100 },
    { name: 'Python', x: 66.67, y: 100 }, { name: 'Silhouette', x: 100, y: 100 }
  ];

  // ---------- Question bank ----------
  // Each: q, options (first is correct — shuffled per-day), explain, link {href, label} optional.
  var BANK = [
    { q: 'Spectraflame paint gets its signature shimmer from…',
      options: ['Translucent candy lacquer over polished metal', 'Thick metallic enamel', 'Glitter mixed into the paint', 'Chrome plating under a matte clear coat'],
      explain: 'Light passes through the tinted lacquer and bounces off the polished zamac body — the depth flat paint can’t fake.',
      link: { href: 'identify.html', label: 'Authentication guide' } },
    { q: 'A 50-year-old red Spectraflame car has darkened to a brownish “root beer” shade. This is…',
      options: ['Toning — natural aging, considered honest condition', 'Definitely a repaint', 'Heat damage that makes it worthless', 'Proof it’s a counterfeit'],
      explain: 'Reds tone toward root-beer brown with age. Many collectors prefer a toned original over a shiny restoration.' },
    { q: 'Perfectly crisp, bright red wheel stripes on a heavily play-worn body most likely mean…',
      options: ['The wheels are reproductions or replacements', 'The car was stored wheels-up', 'It’s a rare factory error', 'The stripes were always that durable'],
      explain: 'Wheel wear should match body wear — repro wheels are the single most common restoration.' },
    { q: 'Under a UV flashlight, one patch of paint glows differently from the rest of the body. That suggests…',
      options: ['A modern touch-up or spot repaint', 'Original factory primer', 'Normal Spectraflame behavior', 'The car was waxed recently'],
      explain: 'Modern paint usually fluoresces differently than 50-year-old lacquer — a cheap UV light makes touch-ups jump out.' },
    { q: 'The rivets holding the base on look drilled out and mushroomed. That means…',
      options: ['The car has been taken apart', 'It’s an early production run', 'It’s a Hong Kong casting', 'Nothing — rivets vary at the factory'],
      explain: 'Factory rivets are uniform. Drilled or re-mushroomed posts mean the body and base have been separated.' },
    { q: 'The earliest 1968 Redlines rolled on…',
      options: ['Bearing-style “deep dish” wheels', 'Capped wheels', 'Rubber slick tires', 'Five-spoke mag wheels'],
      explain: 'The first 1968 production used bearing-style deep-dish wheels; capped styles came later.' },
    { q: 'Your toned original is dull. Should you polish it?',
      options: ['No — you’ll destroy the original paint and most of the value', 'Yes, gently with metal polish', 'Yes, but only the roof', 'Only if it’s a common casting'],
      explain: 'Spectraflame is delicate lacquer. Polishing toning off is one of the most common ways value gets destroyed.' },
    { q: 'A classic warning sign of a resealed blister pack is…',
      options: ['A bright, clean blister on a yellowed card', 'Even yellowing across card and blister', 'Crisp period-correct card printing', 'Glue contained to the factory seal line'],
      explain: 'Original packaging ages together. A fresh blister on an old card means it’s been apart.' },
    { q: 'A paint chip on an original Spectraflame car should reveal…',
      options: ['Bright bare metal', 'Gray primer', 'A different color underneath', 'White plastic'],
      explain: 'Spectraflame was sprayed straight over polished zamac — no primer. Primer under a chip means repaint.' },
    { q: 'To be considered complete, the Custom Fleetside needs…',
      options: ['Its black plastic bed cover', 'A spare wheel', 'An opening hood', 'A driver figure'],
      explain: 'Fleetsides missing the bed cover are incomplete — and repro covers are common.',
      link: { href: 'sweet16.html', label: 'Sweet 16 guide' } },
    { q: 'Which two countries appear on Redline base stampings?',
      options: ['U.S.A. and Hong Kong', 'U.S.A. and Japan', 'U.S.A. and Mexico', 'England and Hong Kong'],
      explain: 'Redlines were produced in US and Hong Kong factories — often with different details, colors and values.' },
    { q: 'GM threatened legal action over which casting being released before the real car debuted?',
      options: ['Custom Corvette', 'Custom Camaro', 'Custom Firebird', 'Custom El Dorado'],
      explain: 'The Hot Wheels Custom Corvette hit shelves before GM officially revealed the 1968 Corvette.',
      link: { href: 'sweet16.html', label: 'Sweet 16 guide' } },
    { q: 'How many cars launched Hot Wheels in 1968?',
      options: ['16', '12', '20', '8'],
      explain: 'The original sixteen — the “Sweet 16” — launched the brand in 1968.' },
    { q: 'The Beatnik Bandit was designed by…',
      options: ['Ed “Big Daddy” Roth', 'Harry Bradley', 'Ira Gilford', 'Carroll Shelby'],
      explain: 'It’s based on Roth’s real bubble-top show car — one of only a few Sweet 16 cars not from Harry Bradley.' },
    { q: 'The Python was based on a real show car built by…',
      options: ['Bill Cushenberry', 'George Barris', 'Ed Roth', 'The Alexander Brothers'],
      explain: 'Bill Cushenberry built the original — and the Python’s rare “Cheetah” base variant is worth $4,000+.' },
    { q: 'Which Sweet 16 casting was designed by Ira Gilford?',
      options: ['Custom Volkswagen', 'Deora', 'Hot Heap', 'Silhouette'],
      explain: 'The Custom Volkswagen — the only Sweet 16 car designed by Gilford.' },
    { q: 'How many of the Sweet 16 did Harry Bradley design?',
      options: ['11', '16', '7', '4'],
      explain: 'Bradley, a former GM designer, penned 11 of the original sixteen castings.' },
    { q: 'By how much did 1968 Hot Wheels sales exceed Mattel’s projections?',
      options: ['7×', '2×', '20×', 'They missed projections'],
      explain: 'The 1968 launch beat sales projections roughly sevenfold and reshaped the toy industry.' },
    { q: 'The “Redline” name comes from…',
      options: ['The red stripe on the tires', 'The red Mattel logo', 'A red line on the package', 'The first car’s paint color'],
      explain: 'Hot Wheels wheels carried a red sidewall stripe from 1968 until 1977 — collectors named the whole era after it.' },
    { q: 'Which casting’s “Cheetah” base variant is one of the rarest Hot Wheels ever made?',
      options: ['Python', 'Deora', 'Ford J-Car', 'Beatnik Bandit'],
      explain: 'A few early Pythons were stamped “Cheetah” before the name changed — they bring $4,000+ today.' },
    { q: 'The rarest color for the Beatnik Bandit is…',
      options: ['Hot Pink', 'Aqua', 'Blue', 'Red'],
      explain: 'Hot Pink Beatnik Bandits are valued at over $3,000.',
      link: { href: 'sweet16.html', label: 'Sweet 16 guide' } },
    { q: 'The rarest US color for the Custom Camaro is…',
      options: ['Gold', 'Blue', 'Green', 'Purple'],
      explain: 'Gold commands the highest value among US Camaros; the White Enamel version is a prototype.' },
    { q: 'The White Enamel Custom Camaro is considered…',
      options: ['A prototype with only a handful known', 'A common store variant', 'A 1970s re-release', 'A factory error worth less'],
      explain: 'Only a handful are known to exist — it’s one of the great Camaro grails.' },
    { q: 'The Deora was based on a custom show truck built by…',
      options: ['The Alexander Brothers', 'Ed Roth', 'Bill Cushenberry', 'Dean Jeffries'],
      explain: 'The Alexander Brothers built the radical cab-forward Deora show truck Bradley adapted.' },
    { q: 'Casting #6216 belongs to…',
      options: ['Python', 'Silhouette', 'Custom Barracuda', 'Hot Heap'],
      explain: 'Python carries #6216 — casting numbers are stamped right into Redline history.' },
    { q: 'Hong Kong Custom Volkswagens missing which feature are among the rarest Redlines?',
      options: ['The sunroof', 'The headlights', 'The rear seat', 'The bumpers'],
      explain: 'No-sunroof Hong Kong VWs are among the rarest variants in the entire Redline era.' },
    { q: 'What was the last year of the original red-striped wheels?',
      options: ['1977', '1972', '1968', '1981'],
      explain: 'Mattel dropped the red stripe in 1977, closing the Redline era collectors chase today.' }
  ];

  // ---------- Build today's puzzle (deterministic) ----------
  var rng = mulberry32(hashString(TODAY));

  function buildQuestions() {
    var questions = [];
    // 1 casting-ID question from the sprite sheet
    var carIdx = Math.floor(rng() * SPRITE_CARS.length);
    var car = SPRITE_CARS[carIdx];
    var others = seededShuffle(SPRITE_CARS.filter(function (c) { return c !== car; }), rng).slice(0, 3)
      .map(function (c) { return c.name; });
    questions.push({
      q: 'Which Sweet 16 casting is this?',
      sprite: car,
      options: [car.name].concat(others),
      explain: 'It’s the ' + car.name + '. Study all sixteen in the Sweet 16 guide.',
      link: { href: 'sweet16.html', label: 'Sweet 16 guide' }
    });
    // 4 from the authored bank
    questions = questions.concat(seededShuffle(BANK, rng).slice(0, 4));
    // shuffle question order, then each question's options (remembering the correct one)
    questions = seededShuffle(questions, rng);
    questions.forEach(function (qn) {
      var correct = qn.options[0];
      qn.shuffled = seededShuffle(qn.options, rng);
      qn.correctIndex = qn.shuffled.indexOf(correct);
    });
    return questions;
  }

  var questions = buildQuestions();

  // ---------- State ----------
  var STATE_KEY = 'ce_state';
  var STATS_KEY = 'ce_stats';

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private browsing */ }
  }

  var state = load(STATE_KEY, null);
  if (!state || state.date !== TODAY) state = { date: TODAY, answers: [] };
  var stats = load(STATS_KEY, { played: 0, streak: 0, best: 0, lastCompleted: null });

  // ---------- DOM ----------
  var bodyEl = document.getElementById('ceBody');
  var progressEl = document.getElementById('ceProgress');
  document.getElementById('cePuzzleNum').textContent = 'Puzzle #' + PUZZLE_NUM;

  function renderStats() {
    document.getElementById('statPlayed').textContent = stats.played;
    document.getElementById('statStreak').textContent = stats.streak;
    document.getElementById('statBest').textContent = stats.best;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function renderQuestion() {
    var idx = state.answers.length;
    var qn = questions[idx];
    progressEl.textContent = 'Question ' + (idx + 1) + ' of ' + questions.length;
    bodyEl.innerHTML = '';

    if (qn.sprite) {
      var img = el('div', 'ce-sprite');
      img.style.backgroundPosition = qn.sprite.x + '% ' + qn.sprite.y + '%';
      img.setAttribute('role', 'img');
      img.setAttribute('aria-label', 'Mystery Sweet 16 casting');
      bodyEl.appendChild(img);
    }
    bodyEl.appendChild(el('p', 'ce-question', qn.q));

    var opts = el('div', 'ce-options');
    qn.shuffled.forEach(function (text, i) {
      var btn = el('button', 'ce-option');
      btn.type = 'button';
      btn.textContent = text;
      btn.addEventListener('click', function () { answer(i, btn); });
      opts.appendChild(btn);
    });
    bodyEl.appendChild(opts);
  }

  function answer(i, btn) {
    var idx = state.answers.length;
    var qn = questions[idx];
    var correct = i === qn.correctIndex;

    var buttons = bodyEl.querySelectorAll('.ce-option');
    buttons.forEach(function (b, bi) {
      b.disabled = true;
      if (bi === qn.correctIndex) b.classList.add('ce-correct');
    });
    if (!correct) btn.classList.add('ce-wrong');

    state.answers.push(correct);
    save(STATE_KEY, state);
    track('event', 'quiz_answer', { puzzle: PUZZLE_NUM, question: idx + 1, correct: correct });

    var explain = el('div', 'ce-explain ' + (correct ? 'ce-explain-good' : 'ce-explain-bad'));
    explain.appendChild(el('p', null,
      '<strong>' + (correct ? 'Correct!' : 'Not quite.') + '</strong> ' + qn.explain +
      (qn.link ? ' <a href="' + qn.link.href + '">' + qn.link.label + ' →</a>' : '')));
    var next = el('button', 'ce-next');
    next.type = 'button';
    next.textContent = state.answers.length < questions.length ? 'Next question →' : 'See results →';
    next.addEventListener('click', function () {
      if (state.answers.length < questions.length) renderQuestion();
      else finish();
    });
    explain.appendChild(next);
    bodyEl.appendChild(explain);
    next.focus();
  }

  function yesterdayOf(dateStr) {
    var parts = dateStr.split('-');
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function finish() {
    if (stats.lastCompleted !== TODAY) {
      stats.played++;
      stats.streak = stats.lastCompleted === yesterdayOf(TODAY) ? stats.streak + 1 : 1;
      stats.best = Math.max(stats.best, stats.streak);
      stats.lastCompleted = TODAY;
      save(STATS_KEY, stats);
      var score = state.answers.filter(Boolean).length;
      track('event', 'quiz_complete', { puzzle: PUZZLE_NUM, score: score, streak: stats.streak });
    }
    renderStats();
    renderResults();
  }

  function shareText() {
    var score = state.answers.filter(Boolean).length;
    var squares = state.answers.map(function (a) { return a ? '🟩' : '🟥'; }).join('');
    return 'Collector’s Eye #' + PUZZLE_NUM + ' — ' + score + '/' + questions.length + '\n' +
      squares + (stats.streak > 1 ? '  🔥 ' + stats.streak + '-day streak' : '') + '\n' +
      'https://www.redlinepricing.com/collectors-eye.html';
  }

  function renderResults() {
    var score = state.answers.filter(Boolean).length;
    progressEl.textContent = 'Done for today';
    bodyEl.innerHTML = '';

    var verdict = score === 5 ? 'Dead mint. A true collector’s eye.' :
                  score === 4 ? 'Sharp eye — nearly flawless.' :
                  score === 3 ? 'Solid. The details come with practice.' :
                  score === 2 ? 'Some toning on that knowledge — keep studying.' :
                  'Time for a trip through the guides.';

    bodyEl.appendChild(el('div', 'ce-score', score + '<span>/' + questions.length + '</span>'));
    bodyEl.appendChild(el('div', 'ce-squares',
      state.answers.map(function (a) { return a ? '🟩' : '🟥'; }).join('')));
    bodyEl.appendChild(el('p', 'ce-verdict', verdict));

    var share = el('button', 'ce-share');
    share.type = 'button';
    share.textContent = '📋 Share result';
    share.addEventListener('click', function () {
      track('event', 'quiz_share', { puzzle: PUZZLE_NUM, score: score });
      var text = shareText();
      if (navigator.share) {
        navigator.share({ text: text }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          share.textContent = '✓ Copied!';
          setTimeout(function () { share.textContent = '📋 Share result'; }, 2000);
        });
      }
    });
    bodyEl.appendChild(share);

    var links = el('div', 'ce-result-links');
    if (score < questions.length) {
      links.appendChild(el('p', null,
        'Sharpen up with the <a href="identify.html">authentication guide</a> and the <a href="sweet16.html">Sweet 16 guide</a>, then come back tomorrow.'));
    } else {
      links.appendChild(el('p', null,
        'Knowledge like that deserves a properly tracked collection. <a href="https://www.etsy.com/listing/4487272371/hot-wheels-collection-tracker" target="_blank" rel="noopener" onclick="gtag(\'event\',\'etsy_click\',{item:\'collectors-eye-results\'})">Get the Collection Tracker →</a>'));
    }
    bodyEl.appendChild(links);

    var countdown = el('p', 'ce-countdown');
    bodyEl.appendChild(countdown);
    function tick() {
      var n = new Date();
      var midnight = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
      var ms = midnight - n;
      var h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
      countdown.textContent = 'Next puzzle in ' + h + 'h ' + m + 'm';
    }
    tick();
    setInterval(tick, 30000);
  }

  // ---------- Boot ----------
  renderStats();
  if (state.answers.length >= questions.length) {
    renderResults();
  } else {
    if (state.answers.length === 0) track('event', 'quiz_start', { puzzle: PUZZLE_NUM });
    renderQuestion();
  }
})();
