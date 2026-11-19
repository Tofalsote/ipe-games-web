/* Interfaz común: portada, menú, fichas con minitest, puntos, rangos, logros, glosario y mascota.
   Cada juego vive en G.IPE_GAMES[id] = { title, icon, tag, mount(root, api) }. */
(function () {
  'use strict';
  const { UNITS, FINAL, GLOSARIO } = window.IPE;
  const GAMES = window.IPE_GAMES;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem('ipe.' + k);
        return v === null ? d : JSON.parse(v);
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem('ipe.' + k, JSON.stringify(v));
      } catch (e) {}
    },
  };

  /* rangos: tu trayectoria laboral, del paro a montar tu propia empresa; cada uno con su base legal */
  /* rangos: tu trayectoria laboral, del paro a montar tu propia empresa; cada uno con su base legal.
     XP máximo: 10 minitest × 40 + 12 juegos × 70 + 17 logros × 25 (+ 100 del logro oculto) = 1765.
     Umbrales afinados simulando una partida «buena» (2/3 en los minitest, 80 % en los juegos): cada rango
     llega al terminar su unidad y el último al acabarlo todo. La perfección se premia con el logro oculto. */
  const RANKS = [
    [0, 'Demandante de empleo', '📄', 'SEPE', 'Inscrito en el SEPE, con el CV recién hecho y muchas ganas.', 'Al empezar'],
    [130, 'Alumno en prácticas', '🏫', 'FP en empresa', 'Tu primera empresa: aprendes con un tutor y sin firmar contrato de trabajo.', 'Al terminar la unidad 1: ya sabes qué perfil IT buscas'],
    [240, 'Técnico en periodo de prueba', '⏳', 'Art. 14 ET', 'Ya tienes contrato, pero cualquiera de las partes puede terminarlo sin indemnización mientras dura la prueba.', 'Al terminar la unidad 2: sabes detectar los peligros'],
    [350, 'Técnico con contrato indefinido', '✍️', 'Art. 15 ET', 'Superada la prueba: el indefinido es la regla general desde la reforma de 2021.', 'Al terminar la unidad 3: sabes evaluar los riesgos'],
    [600, 'Delegado de prevención', '🦺', 'Art. 35 LPRL', 'Tus compañeros te eligen para vigilar la seguridad y la salud en el trabajo.', 'Al cerrar el bloque de prevención (unidades 2 a 5)'],
    [860, 'Miembro del comité de empresa', '🗳️', 'Art. 63 ET', 'Representas a la plantilla y negocias con la empresa, convenio incluido.', 'Al dominar contratos y jornada (unidades 6 y 7)'],
    [1100, 'Responsable del equipo IT', '🧑‍💼', 'Poder de dirección', 'Organizas guardias legales, evalúas los riesgos de tu equipo y revisas nóminas.', 'Al dominar nómina, despido y finiquito (unidades 8 y 9)'],
    [1340, 'Fundador de tu empresa IT', '🚀', 'Autoempleo', 'Ahora quien contrata, da de alta en la Seguridad Social y paga las nóminas eres tú.', 'Al completarlo todo: tu proyecto profesional y el escape room final'],
  ];
  const XP_MAX = 1765;
  /* logros con forma de acreditaciones del mundo laboral: cada uno lleva el documento o la figura real que imita */
  const BADGES = [
    { id: 'ficha', icon: '🪪', name: 'Alta en la Seguridad Social', ref: 'Primer día', how: 'Completa el minitest de una ficha.' },
    { id: 'fichas', icon: '🎓', name: 'Título de Técnico Superior', ref: 'ASIR', how: 'Completa los minitest de las diez unidades.' },
    { id: 'pleno', icon: '🏅', name: 'Matrícula de honor', ref: 'Expediente', how: 'Saca 3/3 en todos los minitest.' },
    { id: 'brujula', icon: '🧭', name: 'Currículum con rumbo', ref: 'Europass', how: 'Descubre tu perfil en la Brújula profesional.' },
    { id: 'inspector', icon: '🦺', name: 'Recurso preventivo', ref: 'Art. 32 bis LPRL', how: 'Encuentra todos los peligros de una escena sin fallar la clasificación.' },
    { id: 'matriz', icon: '📋', name: 'Evaluación firmada', ref: 'Método INSST', how: 'Coloca bien todos los riesgos en la matriz.' },
    { id: 'senales', icon: '🚸', name: 'Señalización revisada', ref: 'RD 485/1997', how: 'Acierta todas las señales de una ronda.' },
    { id: 'pas', icon: '⛑️', name: 'Equipo de primera intervención', ref: 'Plan de emergencia', how: 'Resuelve una emergencia sin ningún error.' },
    { id: 'prl', icon: '🏗️', name: 'Prevención de nivel básico', ref: 'RD 39/1997', how: 'Termina los juegos de prevención: Inspector, Matriz, Señales y Emergencia.' },
    { id: 'contrato', icon: '✍️', name: 'Firma con lupa', ref: 'Art. 15 ET', how: 'Acierta todos los contratos de una partida, trampa incluida.' },
    { id: 'cuadrante', icon: '⏰', name: 'Registro horario impecable', ref: 'Art. 34 ET', how: 'Supera los cuatro niveles del cuadrante.' },
    { id: 'legal', icon: '⚖️', name: 'Inspección de Trabajo', ref: 'ITSS', how: 'Encadena 10 aciertos en ¿Legal o ilegal?' },
    { id: 'nomina', icon: '🧾', name: 'Nómina cuadrada', ref: 'Recibo de salarios', how: 'Rellena una nómina sin ningún error.' },
    { id: 'fin', icon: '🤝', name: 'Saldo y finiquito', ref: 'Art. 49 ET', how: 'Calcula bien una indemnización y su finiquito.' },
    { id: 'laboral', icon: '💼', name: 'Graduado social', ref: 'Derecho laboral', how: 'Termina los juegos de contratos, jornada, nómina y fin de contrato.' },
    { id: 'dafo', icon: '🗺️', name: 'Plan de carrera', ref: 'Objetivos SMART', how: 'Completa tu DAFO y tus objetivos SMART.' },
    { id: 'escape', icon: '🚪', name: 'Evacuación completada', ref: 'Punto de encuentro', how: 'Escapa del CPD cerrado.' },
  ];

  /* logro oculto: no sale en la lista ni en el contador hasta que se consigue */
  const SECRET = { id: 'jubilacion', icon: '🏖️', name: 'Jubilación con la pensión máxima', ref: 'LGSS · Logro oculto', how: 'Lo has completado absolutamente todo: todas las fichas, todos los juegos y todos los logros. Has cotizado todos los años: te jubilas con el 100 % de la base reguladora.' };

  let xp = store.get('xp', 0);
  let badges = new Set(store.get('badges', []));
  const done = store.get('done', { fichas: {}, games: {} });
  const opened = new Set(store.get('open', ['u1']));
  const unitOfRoute = () => {
    const u = UNITS.find((x) => route === 'f/' + x.id || x.games.some((g) => route === 'g/' + g));
    return u ? u.id : route === 'g/' + FINAL.id ? 'fin' : null;
  };
  const isOpen = (k) => opened.has(k) || (unitOfRoute() === k && !opened.has('!' + k));
  const el = { sidebar: $('#sidebar'), panel: $('#panel'), say: $('#say'), buddy: $('#buddy'), stage: $('#stage'), toasts: $('#toasts') };
  let route = '';
  let cleanup = null;

  /* ---------- puntos, logros y avisos ---------- */
  function rankOf(v) {
    let i = 0;
    while (i + 1 < RANKS.length && v >= RANKS[i + 1][0]) i++;
    return i;
  }
  function renderHud() {
    const i = rankOf(xp);
    const next = RANKS[i + 1];
    $('#hudLevel').textContent = i + 1;
    $('#hudRank').textContent = RANKS[i][2] + ' ' + RANKS[i][1];
    $('#hud').title = `${RANKS[i][1]} (${RANKS[i][3]}): ${RANKS[i][4]} Pulsa para ver rangos y logros.`;
    $('#hudXp').textContent = next ? `${xp} / ${next[0]} XP` : `${xp} XP`;
    $('#hudFill').style.width = (next ? ((xp - RANKS[i][0]) / (next[0] - RANKS[i][0])) * 100 : 100) + '%';
    $('#badgeCount').textContent = badges.has(SECRET.id) ? `${BADGES.length}/${BADGES.length} + ${SECRET.icon}` : `${BADGES.filter((b) => badges.has(b.id)).length}/${BADGES.length}`;
  }
  function addXp(n) {
    if (!n) return;
    const before = rankOf(xp);
    xp += n;
    store.set('xp', xp);
    renderHud();
    const hud = $('#hud');
    hud.classList.remove('bump');
    void hud.offsetWidth;
    hud.classList.add('bump');
    if (rankOf(xp) > before) {
      toast(RANKS[rankOf(xp)][2], 'Subes de rango', `${RANKS[rankOf(xp)][1]} · ${RANKS[rankOf(xp)][3]}`);
      confetti(70);
    }
  }
  function award(id) {
    if (badges.has(id)) return;
    const b = BADGES.find((x) => x.id === id);
    if (!b) return;
    badges.add(id);
    store.set('badges', [...badges]);
    toast(b.icon, 'Logro desbloqueado', b.name);
    addXp(25);
    checkSecret();
  }
  function checkSecret() {
    if (badges.has(SECRET.id)) return;
    const all =
      BADGES.every((x) => badges.has(x.id)) &&
      UNITS.every((u) => done.fichas[u.id] != null && u.games.every((g) => done.games[g] != null)) &&
      done.games[FINAL.id] != null;
    if (!all) return;
    badges.add(SECRET.id);
    store.set('badges', [...badges]);
    setTimeout(() => {
      toast(SECRET.icon, '¡Logro oculto desbloqueado!', SECRET.name);
      confetti(160);
      say('¡Lo has completado TODO! Hay un logro oculto esperándote en 🏆. Te has ganado la jubilación.', 'happy');
      addXp(100);
    }, 900);
  }
  function toast(icon, title, text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${icon}</span><div><b>${esc(title)}</b><small>${esc(text)}</small></div>`;
    el.toasts.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3600);
    setTimeout(() => t.remove(), 4100);
  }
  function confetti(n) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#d93a24', '#ffcd38', '#2d5be3', '#12804e', '#17141f'];
    const box = document.createElement('div');
    box.className = 'confetti';
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${Math.random() * 0.35}s;animation-duration:${1.5 + Math.random()}s;--r:${Math.random() * 720 - 360}deg;--x:${Math.random() * 240 - 120}px`;
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3400);
  }
  function say(text, mood) {
    el.say.textContent = text;
    el.buddy.className = 'buddy';
    void el.buddy.offsetWidth;
    if (mood) el.buddy.classList.add(mood);
  }
  /* resultado de un juego (0-100): guarda el mejor y da XP la primera vez que se mejora */
  function gameDone(id, score, msg) {
    const prev = done.games[id];
    if (prev == null || score > prev) {
      done.games[id] = score;
      store.set('done', done);
      addXp(Math.round(score / 2) - (prev ? Math.round(prev / 2) : 0) + (prev == null ? 20 : 0));
    }
    if (score >= 100) confetti(90);
    if (['inspector', 'matriz', 'senales', 'emergencia'].every((g) => done.games[g] != null)) award('prl');
    if (['contrato', 'cuadrante', 'legal', 'nomina', 'fin'].every((g) => done.games[g] != null)) award('laboral');
    checkSecret();
    renderSidebar();
    if (msg) say(msg, score >= 60 ? 'happy' : 'oops');
  }

  /* ---------- menú ---------- */
  const unitParts = (u) => [done.fichas[u.id] != null].concat(u.games.map((g) => done.games[g] != null));
  const unitPct = (u) => unitParts(u).filter(Boolean).length + '/' + unitParts(u).length;
  const unitFrac = (u) => unitParts(u).filter(Boolean).length / unitParts(u).length;
  function renderSidebar() {
    const item = (href, icon, title, sub, isDone) =>
      `<li><button type="button" class="${route === href ? 'active' : ''}${isDone ? ' done' : ''}${href.startsWith('g/') ? ' game' : ''}" data-go="${href}"><span class="num">${isDone ? '✓' : icon}</span><span class="tx"><b>${esc(title)}</b><small>${esc(sub)}</small></span></button></li>`;
    let h = `<button type="button" class="nav-home${route === 'home' ? ' active' : ''}" data-go="home">🏠 Portada</button>`;
    for (const u of UNITS) {
      const k = u.id;
      h +=
        `<h2><button type="button" class="fold" data-fold="${k}" aria-expanded="${isOpen(k)}"><i aria-hidden="true">▾</i>${u.n} · ${esc(u.short)} <span>${unitPct(u)}</span></button></h2><ol class="${isOpen(k) ? '' : 'closed'}">` +
        item('f/' + u.id, 'F', 'Ficha y minitest', u.title, done.fichas[u.id] != null) +
        u.games.map((g) => item('g/' + g, GAMES[g].icon, GAMES[g].title, done.games[g] != null ? `Mejor: ${done.games[g]} %` : GAMES[g].tag, done.games[g] != null)).join('') +
        '</ol>';
    }
    h += `<h2><button type="button" class="fold" data-fold="fin" aria-expanded="${isOpen('fin')}"><i aria-hidden="true">▾</i>Final <span>${done.games[FINAL.id] != null ? '1/1' : '0/1'}</span></button></h2><ol class="${isOpen('fin') ? '' : 'closed'}">${item('g/' + FINAL.id, FINAL.icon, GAMES[FINAL.id].title, done.games[FINAL.id] != null ? 'Superado' : GAMES[FINAL.id].tag, done.games[FINAL.id] != null)}</ol>`;
    h += '<button type="button" class="link" id="btnWipe">Empezar de cero</button>';
    el.sidebar.innerHTML = h;
  }
  el.sidebar.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) return go(g.dataset.go);
    const f = e.target.closest('[data-fold]');
    if (f) {
      const k = f.dataset.fold;
      if (isOpen(k)) {
        opened.delete(k);
        if (unitOfRoute() === k) opened.add('!' + k);
      } else {
        opened.add(k);
        opened.delete('!' + k);
      }
      store.set('open', [...opened]);
      return renderSidebar();
    }
    if (e.target.id === 'btnWipe' && confirm('¿Borrar tus puntos, logros y resultados?')) {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('ipe.'))
          .forEach((k) => localStorage.removeItem(k));
      } catch (err) {}
      location.reload();
    }
  });

  /* ---------- pantallas ---------- */
  /* menú en móvil: cajón lateral que se abre con ☰ */
  const menuBtn = $('#btnMenu');
  const scrim = $('#scrim');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
    if (open) {
      const a = el.sidebar.querySelector('.active');
      if (a) a.scrollIntoView({ block: 'center' });
    }
  }
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
  });

  function go(r) {
    setMenu(false);
    for (const k of [...opened]) if (k[0] === '!') opened.delete(k);
    if (cleanup) {
      try {
        cleanup();
      } catch (e) {}
      cleanup = null;
    }
    route = r;
    store.set('route', r);
    try {
      history.replaceState(null, '', '#/' + r);
    } catch (e) {}
    renderSidebar();
    if (r.startsWith('f/')) showFicha(UNITS.find((u) => u.id === r.slice(2)) || UNITS[0]);
    else if (r.startsWith('g/') && GAMES[r.slice(2)]) showGame(r.slice(2));
    else showHome();
    el.stage.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  function showHome() {
    route = 'home';
    const total = UNITS.length + UNITS.reduce((a, u) => a + u.games.length, 0) + 1;
    const hecho = Object.keys(done.fichas).length + Object.keys(done.games).length;
    el.panel.innerHTML =
      `<div class="cover"><div><div class="eyebrow">Itinerario personal para la empleabilidad · 1.º ASIR</div>` +
      `<h1>Tu primer trabajo <em>empieza</em> aquí.</h1><p>Prevención de riesgos, contratos, jornada, nómina, finiquito y tu proyecto profesional, aplicados al día a día de un técnico de sistemas. Fichas cortas y juegos para practicar.</p>` +
      `<div class="actions"><button type="button" class="btn primary big" data-go="f/u1">Empezar: ${esc(UNITS[0].title)} →</button></div></div>` +
      `<div class="stamp"><b>${hecho}</b>de ${total}<br>hechos</div></div>` +
      '<div class="sec-title"><h2>Unidades</h2><span>ficha + juego</span></div><div class="units">' +
      UNITS.map(
        (u) =>
          `<button type="button" class="unit-card" data-go="${done.fichas[u.id] != null ? 'g/' + u.games[0] : 'f/' + u.id}"><span class="uc-top"><span class="uc-num">${u.n}</span><span class="uc-ico">${u.icon}</span></span>` +
          `<span class="uc-title">${esc(u.title)}</span><span class="uc-games">${u.games.map((g) => GAMES[g].icon + ' ' + esc(GAMES[g].title)).join(' · ')}</span><span class="uc-prog"><i class="bar"><i style="width:${(unitFrac(u) * 100).toFixed(0)}%"></i></i>${unitPct(u)}</span></button>`
      ).join('') +
      `<button type="button" class="unit-card final" data-go="g/escape"><span class="uc-top"><span class="uc-num">★</span><span class="uc-ico">🔐</span></span><span class="uc-title">Escape room: el CPD cerrado</span><span class="uc-games">Todo lo aprendido para salir de la sala</span></button></div>` +
      '<div class="sec-title"><h2>Cómo funciona</h2></div><div class="how"><div><b>Lee la ficha</b><p>Teoría corta con ejemplos de informática, y un minitest de tres preguntas.</p></div><div><b>Juega</b><p>Cada unidad tiene su juego: inspeccionar un CPD, montar turnos legales, rellenar una nómina…</p></div><div><b>Sube de rango</b><p>Ganas puntos, logros y mejoras tu nota. Tu progreso se queda en este navegador.</p></div></div>';
    say(hecho ? '¡Hola otra vez! Sigue por donde lo dejaste o repite un juego para mejorar tu nota.' : 'Soy Previ, tu delegado de prevención. Aquí aprenderás lo que necesita saber un técnico de sistemas cuando empieza a trabajar.', '');
  }
  el.panel.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g && !e.target.closest('.game-root')) go(g.dataset.go);
  });

  /* la ficha se reparte en pasos cortos (uno por apartado) y termina con el minitest, de pregunta en pregunta */
  function fichaSlides(body) {
    const box = document.createElement('div');
    box.innerHTML = body;
    const slides = [];
    let cur = { title: 'La idea', html: '' };
    for (const n of [...box.childNodes]) {
      if (n.nodeType === 1 && n.tagName === 'H3') {
        if (cur.html.trim()) slides.push(cur);
        cur = { title: n.textContent, html: '' };
      } else cur.html += n.nodeType === 1 ? n.outerHTML : n.textContent;
    }
    if (cur.html.trim()) slides.push(cur);
    return slides;
  }
  function showFicha(u) {
    const f = u.ficha;
    const prev = done.fichas[u.id];
    const slides = fichaSlides(f.body);
    const total = slides.length + 1;
    let k = 0;
    let qi = 0;
    let right = 0;
    let picked = null;
    function render() {
      const quiz = k === slides.length;
      let h =
        `<article class="sheet ficha"><div class="sheet-head"><b>${u.icon} Unidad ${u.n}</b><span>${esc(u.short)}</span><span>${quiz ? 'Minitest' : 'Ficha ' + (k + 1) + ' / ' + slides.length}</span></div><div class="sheet-main">` +
        `<h1>${esc(u.title)}</h1><div class="steps-dots">${Array.from({ length: total }, (x, i) => `<button type="button" class="${i === k ? 'on' : i < k ? 'seen' : ''}" data-step="${i}" aria-label="${i === slides.length ? 'Minitest' : esc(slides[i].title)}">${i === slides.length ? '?' : i + 1}</button>`).join('')}</div>`;
      if (!quiz) {
        h += `<section class="slide"><h2>${esc(slides[k].title)}</h2><div class="prose">${slides[k].html}</div></section>` +
          `<div class="slide-nav"><button type="button" class="btn" data-prev${k ? '' : ' disabled'}>← Anterior</button><button type="button" class="btn primary" data-nextslide>${k + 1 === slides.length ? 'Ir al minitest →' : 'Siguiente →'}</button></div>`;
      } else if (qi < f.quiz.length) {
        const q = f.quiz[qi];
        h += `<section class="slide quiz1"><small class="qn">Pregunta ${qi + 1} de ${f.quiz.length}${prev != null ? ' · tu mejor resultado: ' + prev + '/3' : ''}</small><h2>${esc(q.q)}</h2><div class="opts">` +
          q.opts.map((o, j) => `<button type="button" class="opt${picked != null ? (j === q.a ? ' ok' : j === picked ? ' bad' : '') : ''}" data-a="${j}"${picked != null ? ' disabled' : ''}>${esc(o)}</button>`).join('') +
          '</div>' + (picked != null ? `<p class="why">${picked === q.a ? '✓ ' : '✗ '}${esc(q.why)}</p><div class="slide-nav"><span></span><button type="button" class="btn primary" data-nextq>${qi + 1 < f.quiz.length ? 'Siguiente pregunta →' : 'Ver resultado →'}</button></div>` : '') + '</section>';
      } else {
        h += `<div class="finish${right >= 2 ? '' : ' fail'}"><div class="big">${right}/3</div><div><b>${right === 3 ? '¡Pleno!' : right === 2 ? 'Bien hecho.' : 'Repasa la ficha.'}</b><p>${right >= 2 ? 'Ya puedes ir al juego de la unidad.' : 'Vuelve a leer la ficha y repite el minitest.'}</p><div class="row-btns"><button type="button" class="btn" data-again>↻ Repetir minitest</button>${u.games.map((g) => `<button type="button" class="btn primary" data-go="g/${g}">${GAMES[g].icon} Jugar: ${esc(GAMES[g].title)} →</button>`).join('')}</div></div></div>`;
      }
      h += '</div></article>';
      el.panel.innerHTML = h;
      el.panel.querySelectorAll('[data-signs]').forEach((d) => {
        if (!window.IPE_SIGN) return;
        d.innerHTML = d.dataset.signs
          .split(' ')
          .map((id) => {
            const sg = (window.IPE_SIGNS || []).find((x) => x.id === id);
            return `<figure>${window.IPE_SIGN(id, 76)}<figcaption>${sg ? esc(sg.n) : ''}</figcaption></figure>`;
          })
          .join('');
      });
    }
    function finishQuiz() {
      if (prev == null || right > prev) {
        done.fichas[u.id] = right;
        store.set('done', done);
        addXp((right - (prev || 0)) * 10 + (prev == null ? 10 : 0));
      }
      award('ficha');
      if (UNITS.every((x) => done.fichas[x.id] != null)) award('fichas');
      if (UNITS.every((x) => done.fichas[x.id] === 3)) award('pleno');
      if (right === 3) confetti(50);
      checkSecret();
      renderSidebar();
      say(right === 3 ? '¡Tres de tres! A por el juego.' : right === 2 ? 'Bien. Si quieres, repite para el pleno.' : 'Repasa la ficha: la tienes justo encima.', right >= 2 ? 'happy' : 'oops');
    }
    const onClick = (e) => {
      if (!el.panel.querySelector('.ficha')) return;
      const st = e.target.closest('[data-step]');
      if (st) {
        k = +st.dataset.step;
        return render();
      }
      if (e.target.closest('[data-prev]') && k > 0) {
        k--;
        return render();
      }
      if (e.target.closest('[data-nextslide]')) {
        k++;
        el.stage.scrollTop = 0;
        window.scrollTo(0, 0);
        if (k === slides.length) say('Minitest: tres preguntas, una a una.', '');
        return render();
      }
      const o = e.target.closest('.quiz1 .opt');
      if (o && picked == null) {
        picked = +o.dataset.a;
        const ok = picked === f.quiz[qi].a;
        if (ok) right++;
        say(ok ? pick(['¡Bien!', 'Correcto.', 'Eso es.']) : 'Casi. Lee la explicación: es lo que entra en el examen.', ok ? 'happy' : 'oops');
        return render();
      }
      if (e.target.closest('[data-nextq]')) {
        qi++;
        picked = null;
        render();
        if (qi === f.quiz.length) finishQuiz();
        return;
      }
      if (e.target.closest('[data-again]')) {
        qi = 0;
        right = 0;
        picked = null;
        render();
      }
    };
    const onKey = (e) => {
      if (e.target.closest && e.target.closest('input, textarea, dialog[open]')) return;
      if (k >= slides.length) return;
      if (e.key === 'ArrowRight') el.panel.querySelector('[data-nextslide]').click();
      if (e.key === 'ArrowLeft' && k > 0) el.panel.querySelector('[data-prev]').click();
    };
    el.panel.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    cleanup = () => {
      el.panel.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
    render();
    say(`Unidad ${u.n}: ${slides.length} pasos cortos y un minitest. Usa «Siguiente» o las flechas del teclado.`, '');
  }

  function showGame(id) {
    const g = GAMES[id];
    el.panel.innerHTML = `<article class="sheet game-sheet"><div class="sheet-head"><b>${g.icon} ${esc(g.title)}</b><span>${esc(g.tag)}</span><span>${done.games[id] != null ? 'Mejor: ' + done.games[id] + ' %' : 'Sin jugar'}</span><button type="button" class="restart" id="gameRestart" title="Vuelve a empezar este juego desde cero si algo se ha quedado atascado. Tu mejor nota se conserva.">↻ Reiniciar</button></div><div class="sheet-main game-root" id="gameRoot"></div></article>`;
    $('#gameRestart').addEventListener('click', () => {
      if (!confirm('¿Reiniciar «' + g.title + '» desde cero? Se borra la partida en curso de este juego, pero tu mejor nota y tus logros se conservan.')) return;
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('ipe.g.' + id + '.'))
          .forEach((k) => localStorage.removeItem(k));
      } catch (err) {}
      if (cleanup) {
        try {
          cleanup();
        } catch (err) {}
        cleanup = null;
      }
      showGame(id);
      say('Juego reiniciado. ¡Empezamos de nuevo!', '');
    });
    const root = $('#gameRoot');
    const api = {
      say,
      xp: addXp,
      award,
      done: (score, msg) => gameDone(id, Math.max(0, Math.min(100, Math.round(score))), msg),
      store: { get: (k, d) => store.get('g.' + id + '.' + k, d), set: (k, v) => store.set('g.' + id + '.' + k, v) },
      esc,
      confetti,
      onLeave: (fn) => (cleanup = fn),
    };
    g.mount(root, api);
  }

  /* ---------- glosario y logros ---------- */
  const gloss = $('#gloss');
  function renderGloss(q) {
    q = (q || '').toLowerCase();
    const list = GLOSARIO.filter(([t, d]) => !q || (t + ' ' + d).toLowerCase().includes(q));
    $('#glossBody').innerHTML = list.length ? `<dl class="gloss">${list.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>` : '<p class="empty">No hay ningún término con esa búsqueda.</p>';
  }
  $('#btnGloss').addEventListener('click', () => {
    $('#glossSearch').value = '';
    renderGloss('');
    gloss.showModal();
  });
  $('#glossSearch').addEventListener('input', (e) => renderGloss(e.target.value));
  const trophy = $('#trophy');
  function openTrophies() {
    const i = rankOf(xp);
    $('#trophyBody').innerHTML =
      `<p class="xp-note">Llevas <b>${xp} XP</b> de ${XP_MAX} posibles. Se gana XP con los minitest (hasta 40 cada uno), los juegos (hasta 70) y los logros (25). Repetir solo suma si mejoras tu nota.</p>` +
      '<div class="ranks">' +
      RANKS.map(([min, name, icon, ref, desc, hito], k) => `<div class="${k < i ? 'past' : k === i ? 'now' : ''}"><header><b>${k + 1}</b><i aria-hidden="true">${icon}</i><small>${min} XP</small></header><span>${esc(name)}</span><em>${esc(ref)}</em><p>${esc(desc)}</p><p class="hito">🎯 ${esc(hito)}</p></div>`).join('') +
      '</div><div class="badge-grid">' +
      (badges.has(SECRET.id) ? `<article class="cred on secret"><header><small>${esc(SECRET.ref)}</small><em>Desbloqueado</em></header><span>${SECRET.icon}</span><b>${esc(SECRET.name)}</b><small>${esc(SECRET.how)}</small></article>` : '') +
      BADGES.map((b) => `<article class="cred${badges.has(b.id) ? ' on' : ''}"><header><small>${esc(b.ref)}</small><em>${badges.has(b.id) ? 'Concedido' : 'Pendiente'}</em></header><span>${badges.has(b.id) ? b.icon : '🔒'}</span><b>${esc(b.name)}</b><small>${esc(b.how)}</small></article>`).join('') +
      '</div>';
    trophy.showModal();
  }
  $('#hud').addEventListener('click', openTrophies);
  $('#btnTrophy').addEventListener('click', openTrophies);
  for (const d of [gloss, trophy])
    d.addEventListener('click', (e) => {
      if (e.target === d || e.target.closest('.dlg-close')) d.close();
    });

  /* ---------- tema ---------- */
  const theme = store.get('theme', null);
  if (theme) document.documentElement.dataset.theme = theme;
  $('#btnTheme').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    store.set('theme', next);
  });

  renderHud();
  const fromHash = (location.hash || '').replace(/^#\/?/, '');
  go(fromHash || store.get('route', 'home'));
  window.__ipe = { go, get route() { return route; }, done, award, finish: gameDone, get xp() { return xp; } };
})();
