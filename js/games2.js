/* Juegos de las unidades 5 a 9 y el final: ¿Qué contrato es?, El cuadrante, ¿Legal o ilegal?, Tu nómina,
   Fin de contrato, Mi DAFO y hoja de ruta, y la escape room del CPD. */
(function (G) {
  'use strict';
  const GAMES = (G.IPE_GAMES = G.IPE_GAMES || {});
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const r2 = (x) => Math.round((x + Number.EPSILON) * 100) / 100;
  const pc = (x) => x.toFixed(2).replace('.', ',') + ' %';
  const eur = (x) => r2(x).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const num = (s) => {
    s = String(s || '').trim().replace(/\s|€/g, '');
    if (!s) return NaN;
    if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    else s = s.replace(/,/g, '');
    return parseFloat(s);
  };

  /* =====================================================================
     5 · ¿QUÉ CONTRATO ES?
     ===================================================================== */
  const MODS = {
    ind: 'Indefinido',
    fd: 'Fijo discontinuo',
    cp: 'Circunstancias de la producción',
    sus: 'Sustitución',
    alt: 'Formación en alternancia',
    pp: 'Obtención de práctica profesional',
    obra: 'Obra o servicio',
  };
  const CASOS_C = [
    ['Una empresa de soporte necesita reforzar su helpdesk durante 4 meses por un pico de trabajo imprevisto al implantar un ERP.', 'cp', 'Aumento ocasional e imprevisible de la actividad: hasta 6 meses (12 si lo amplía el convenio).'],
    ['Hay que cubrir a Laura, técnica de sistemas, mientras disfruta del permiso por nacimiento y cuidado de menor.', 'sus', 'Sustituir a una persona con derecho a reserva del puesto.'],
    ['Acabaste ASIR hace 6 meses y te contratan para estrenar el título como técnico junior.', 'pp', 'Es el contrato formativo para quien tiene el título desde hace menos de 3 años.'],
    ['Estudias 2.º de ASIR y una empresa te contrata a media jornada para trabajar en lo que estudias, con un tutor.', 'alt', 'Compagina trabajo y formación relacionada: formación en alternancia.'],
    ['Un CPD contrata a un técnico de sistemas para un puesto estable, sin fecha de fin.', 'ind', 'Es la regla general: el contrato indefinido.'],
    ['Una universidad necesita técnicos de soporte cada año de septiembre a noviembre, para las matrículas.', 'fd', 'Trabajo que se repite en fechas ciertas: fijo discontinuo.'],
    ['Un hotel de costa contrata cada verano al mismo técnico para su red wifi.', 'fd', 'Actividad de temporada que se repite cada año: fijo discontinuo.'],
    ['El inventario anual de equipos se hace cada diciembre durante dos semanas y ya está previsto.', 'cp', 'Situación ocasional y previsible de duración reducida: máximo 90 días al año, no seguidos.'],
    ['Hay que cubrir un puesto de técnico mientras dura el proceso de selección para contratar a alguien fijo.', 'sus', 'La sustitución también sirve para cubrir un puesto durante su proceso de selección, como máximo 3 meses.'],
    ['Para un proyecto de migración a la nube que durará 2 años, la empresa quiere el contrato «de obra o servicio».', 'ind', 'El contrato por obra o servicio desapareció con la reforma de 2021: un proyecto largo no justifica un temporal, así que lo normal es el indefinido.'],
    ['Estudias el curso de especialización en ciberseguridad y te contratan para aplicar lo que aprendes en el SOC de la empresa.', 'alt', 'Trabajo + formación del sistema educativo relacionada con el puesto: formación en alternancia.'],
    ['Encadenas tres contratos temporales en la misma empresa durante 20 meses dentro de un periodo de 24.', 'ind', 'Más de 18 meses en 24 con contratos temporales: pasas a ser fijo.'],
  ];
  GAMES.contrato = {
    title: '¿Qué contrato es?',
    icon: '📜',
    tag: 'Elige la modalidad para cada situación',
    mount(root, api) {
      let deck;
      let i;
      let ok;
      let ans;
      function start() {
        deck = shuffle(CASOS_C).slice(0, 8);
        i = 0;
        ok = 0;
        ans = null;
        draw();
      }
      function draw() {
        if (i >= deck.length) {
          const sc = (ok / deck.length) * 100;
          if (ok === deck.length) api.award('contrato');
          api.done(sc, ok === deck.length ? '¡Pleno! Podrías trabajar en una asesoría laboral.' : 'Repasa la tabla de modalidades de la ficha 5.');
          root.innerHTML = `<div class="finish${ok >= 5 ? '' : ' fail'}"><div class="big">${ok}/${deck.length}</div><div><b>Partida terminada</b><p>Recuerda: desde 2022 la regla es el indefinido, y el temporal necesita una causa concreta.</p><button type="button" class="btn primary" data-new>Otra partida</button></div></div>`;
          return;
        }
        const [t, a, why] = deck[i];
        root.innerHTML =
          `<div class="pips">${deck.map((x, k) => `<i class="${k < i ? 'ok' : k === i ? 'now' : ''}"></i>`).join('')}</div>` +
          `<div class="card-big"><small>Situación ${i + 1} de ${deck.length}</small><p>${esc(t)}</p></div><div class="opts grid2">` +
          Object.keys(MODS).map((k) => `<button type="button" class="opt${ans ? (k === a ? ' ok' : k === ans ? ' bad' : '') : ''}" data-m="${k}"${ans ? ' disabled' : ''}>${MODS[k]}${k === 'obra' ? ' <small>(¿existe?)</small>' : ''}</button>`).join('') +
          '</div>' +
          (ans ? `<p class="fb ${ans === a ? 'ok' : 'bad'}">${ans === a ? '✓' : '✗'} ${esc(why)}</p><button type="button" class="btn primary" data-next>Siguiente →</button>` : '');
      }
      root.addEventListener('click', (e) => {
        const m = e.target.closest('[data-m]');
        if (m && !ans) {
          ans = m.dataset.m;
          const good = ans === deck[i][1];
          if (good) ok++;
          api.say(good ? 'Correcto.' : ans === 'obra' ? 'Trampa: el contrato de obra o servicio ya no existe.' : 'No es ese. Lee la explicación.', good ? 'happy' : 'oops');
          return draw();
        }
        if (e.target.closest('[data-next]')) {
          i++;
          ans = null;
          return draw();
        }
        if (e.target.closest('[data-new]')) start();
      });
      start();
      api.say('Ocho situaciones reales del sector. Ojo, que hay alguna trampa.', '');
    },
  };

  /* =====================================================================
     6a · EL CUADRANTE: turnos legales para cubrir el CPD
     ===================================================================== */
  const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const DIAS_L = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const NIVELES = [
    {
      t: 'Arregla el horario de Ana',
      intro: 'El helpdesk abre de lunes a viernes de 9 a 17. Ana tiene este horario, que incumple varias normas. Corrígelo para que cubra el horario y sea legal.',
      who: ['Ana'],
      init: { Ana: ['8-19', '8-19', '8-19', '8-19', '8-19', '9-14', ''] },
      need: [[9, 17], [9, 17], [9, 17], [9, 17], [9, 17], null, null],
    },
    {
      t: 'Guardia de sábado',
      intro: 'Luis trabaja de lunes a viernes de 9 a 17 y ahora debe cubrir también el sábado de 10 a 14. Reajusta su semana sin pasarte de la jornada legal y sin quitarle el descanso semanal.',
      who: ['Luis'],
      init: { Luis: ['9-17', '9-17', '9-17', '9-17', '9-17', '10-14', ''] },
      need: [[9, 13], [9, 13], [9, 13], [9, 13], [9, 13], [10, 14], null],
      note: 'De lunes a viernes basta con que esté de 9 a 13; el resto de horas las repartes tú.',
    },
    {
      t: 'Turnos del CPD',
      intro: 'El CPD necesita a alguien de 7 a 23 de lunes a viernes. Organiza a Ana y Luis en turnos de mañana y tarde. ¡Cuidado si los cambias de turno a mitad de semana!',
      who: ['Ana', 'Luis'],
      init: { Ana: ['', '', '', '', '', '', ''], Luis: ['', '', '', '', '', '', ''] },
      need: [[7, 23], [7, 23], [7, 23], [7, 23], [7, 23], null, null],
    },
    {
      t: 'Semana de migración',
      intro: 'Migración de servidores: hay que cubrir de 8 a 20 de lunes a sábado. Tienes a Ana, Luis y Marta. Que nadie pase de 40 horas ni de 9 al día y todos tengan su descanso.',
      who: ['Ana', 'Luis', 'Marta'],
      init: { Ana: ['', '', '', '', '', '', ''], Luis: ['', '', '', '', '', '', ''], Marta: ['', '', '', '', '', '', ''] },
      need: [[8, 20], [8, 20], [8, 20], [8, 20], [8, 20], [8, 20], null],
    },
  ];
  /* «9-14 16-19» → [[9,14],[16,19]]; admite 8:30 y 8.5 */
  function parseCell(s) {
    s = String(s || '').trim();
    if (!s) return [];
    const out = [];
    for (const part of s.split(/[\s,;y]+/).filter(Boolean)) {
      const m = /^(\d{1,2}(?:[:.,]\d{1,2})?)\s*-\s*(\d{1,2}(?:[:.,]\d{1,2})?)$/.exec(part);
      if (!m) return null;
      const h = (x) => {
        const [a, b] = x.split(/[:.,]/);
        return +a + (b ? (/[:]/.test(x) ? +b / 60 : +('0.' + b)) : 0);
      };
      const a = h(m[1]);
      const b = h(m[2]);
      if (!(a >= 0 && b <= 24 && b > a)) return null;
      out.push([a, b]);
    }
    out.sort((x, y) => x[0] - y[0]);
    for (let k = 1; k < out.length; k++) if (out[k][0] < out[k - 1][1]) return null;
    return out;
  }
  const fmtH = (x) => (Number.isInteger(x) ? x + ' h' : Math.floor(x) + ':' + String(Math.round((x % 1) * 60)).padStart(2, '0') + ' h');
  function checkWorker(name, cells, pausa) {
    const v = [];
    const days = cells.map(parseCell);
    days.forEach((d, i) => {
      if (d === null) v.push(`${DIAS_L[i]}: no entiendo «${cells[i]}». Escribe tramos como 9-17 o 9-14 16-19.`);
    });
    if (v.length) return { v, days, total: 0 };
    let total = 0;
    days.forEach((d, i) => {
      const h = d.reduce((a, [x, y]) => a + (y - x), 0);
      total += h;
      if (h > 9) v.push(`${DIAS_L[i]}: ${fmtH(h)} en un día. Máximo 9 h ordinarias (art. 34.3 ET).`);
      for (const [x, y] of d) if (y - x > 6 && !pausa) v.push(`${DIAS_L[i]}: tramo de ${fmtH(y - x)} seguido sin pausa. Más de 6 h exige 15 min de pausa (art. 34.4 ET): marca la casilla de pausa.`);
    });
    if (total > 40) v.push(`${fmtH(total)} a la semana. Máximo 40 h (art. 34.1 ET).`);
    /* descanso entre jornadas y semanal, con la semana repitiéndose */
    const work = [];
    days.forEach((d, i) => {
      if (d.length) work.push({ i, s: i * 24 + d[0][0], e: i * 24 + d[d.length - 1][1] });
    });
    if (work.length) {
      let maxGap = 0;
      for (let k = 0; k < work.length; k++) {
        const a = work[k];
        const b = work[(k + 1) % work.length];
        const gap = k + 1 < work.length ? b.s - a.e : b.s + 168 - a.e;
        maxGap = Math.max(maxGap, gap);
        if (gap < 12) v.push(`Entre ${DIAS_L[a.i].toLowerCase()} y ${DIAS_L[b.i].toLowerCase()} solo hay ${fmtH(gap)} de descanso. Mínimo 12 h entre jornadas (art. 34.3 ET).`);
      }
      if (maxGap < 36) v.push(`El descanso semanal más largo es de ${fmtH(maxGap)}. Hace falta día y medio seguido, 36 h (art. 37.1 ET).`);
    }
    return { v, days, total };
  }
  GAMES.cuadrante = {
    title: 'El cuadrante',
    icon: '🗓️',
    tag: 'Organiza turnos legales en el CPD',
    mount(root, api) {
      let lv = 0;
      const doneLv = api.store.get('lv', []);
      let state;
      function load(n) {
        lv = n;
        const L = NIVELES[lv];
        state = { cells: JSON.parse(JSON.stringify(L.init)), pausa: Object.fromEntries(L.who.map((w) => [w, false])) };
        draw();
        api.say(L.intro, '');
      }
      function evaluate() {
        const L = NIVELES[lv];
        const res = {};
        for (const w of L.who) res[w] = checkWorker(w, state.cells[w], state.pausa[w]);
        const uncovered = [];
        L.need.forEach((n, i) => {
          if (!n) return;
          for (let h = n[0]; h < n[1]; h += 0.5) {
            const cov = L.who.some((w) => (res[w].days[i] || []).some(([a, b]) => a <= h && b >= h + 0.5));
            if (!cov) {
              uncovered.push(i);
              break;
            }
          }
        });
        return { res, uncovered: [...new Set(uncovered)] };
      }
      function timeline(ev) {
        const L = NIVELES[lv];
        const colors = { Ana: '#2d5be3', Luis: '#12804e', Marta: '#c98a00' };
        let s = '<svg viewBox="0 0 760 230" class="tl" role="img" aria-label="Cobertura de la semana">';
        for (let h = 0; h <= 24; h += 2) s += `<path d="M${60 + h * 28} 18v206" class="tl-grid"/><text x="${60 + h * 28}" y="13" class="tl-h">${h}</text>`;
        DIAS.forEach((d, i) => {
          const y = 22 + i * 29;
          s += `<text x="40" y="${y + 18}" class="tl-d">${d}</text>`;
          const n = L.need[i];
          if (n) s += `<rect x="${60 + n[0] * 28}" y="${y}" width="${(n[1] - n[0]) * 28}" height="26" class="tl-need${ev.uncovered.includes(i) ? ' bad' : ''}"/>`;
          L.who.forEach((w, k) => {
            for (const [a, b] of ev.res[w].days[i] || []) s += `<rect x="${60 + a * 28}" y="${y + 3 + k * (20 / L.who.length)}" width="${(b - a) * 28}" height="${20 / L.who.length}" rx="2" style="fill:${colors[w]}"/>`;
          });
        });
        s += '</svg>';
        return s + `<div class="tl-legend">${L.who.map((w) => `<span><i style="background:${colors[w]}"></i>${w}</span>`).join('')}<span><i class="need"></i>hay que cubrir</span><span><i class="need bad"></i>sin cubrir</span></div>`;
      }
      /* la tabla se pinta una vez por nivel; al escribir solo se refrescan totales, gráfico y avisos (no se pierde el cursor) */
      function draw() {
        const L = NIVELES[lv];
        root.innerHTML =
          `<div class="lv-tabs">${NIVELES.map((n, k) => `<button type="button" class="${k === lv ? 'on' : ''}${doneLv.includes(k) ? ' done' : ''}" data-lv="${k}">${doneLv.includes(k) ? '✓ ' : ''}${k + 1}. ${esc(n.t)}</button>`).join('')}</div>` +
          `<p class="lead">${esc(L.intro)}</p>${L.note ? `<p class="note">${esc(L.note)}</p>` : ''}` +
          '<p class="small">Escribe los tramos de cada día: <code>9-17</code>, <code>7-15</code>, o jornada partida <code>9-14 16-19</code>. Vacío = libre. Se comprueba mientras escribes.</p>' +
          `<div class="tbl-wrap"><table class="cq"><thead><tr><th></th>${DIAS_L.map((d, i) => `<th>${d}${L.need[i] ? `<small>cubrir ${L.need[i][0]}–${L.need[i][1]}</small>` : ''}</th>`).join('')}<th>Total</th><th>Pausa</th></tr></thead><tbody>` +
          L.who.map((w) => `<tr><th>${w}</th>${state.cells[w].map((c, i) => `<td data-l="${DIAS_L[i]}${L.need[i] ? ' · cubrir ' + L.need[i][0] + '–' + L.need[i][1] : ''}"><input type="text" value="${esc(c)}" data-w="${w}" data-d="${i}" aria-label="${w}, ${DIAS_L[i]}" spellcheck="false" autocomplete="off"></td>`).join('')}<td class="tot" data-tot="${w}" data-l="Total semana"></td><td data-l="Pausa"><label class="chk"><input type="checkbox" data-p="${w}"${state.pausa[w] ? ' checked' : ''}> 15 min</label></td></tr>`).join('') +
          '</tbody></table></div><div id="cqTl"></div><div class="cq-out" id="cqOut" aria-live="polite"></div>' +
          '<div class="row-btns"><button type="button" class="btn primary" data-ok disabled>Arregla lo que está en rojo</button><button type="button" class="btn" data-reset>Empezar de nuevo</button></div>';
        refresh();
      }
      function refresh() {
        const L = NIVELES[lv];
        const ev = evaluate();
        const allV = L.who.flatMap((w) => ev.res[w].v.map((x) => `<b>${w}</b>: ${esc(x)}`));
        const ok = !allV.length && !ev.uncovered.length;
        for (const w of L.who) {
          const td = root.querySelector(`[data-tot="${w}"]`);
          td.textContent = fmtH(ev.res[w].total);
          td.classList.toggle('bad', ev.res[w].total > 40);
        }
        root.querySelectorAll('[data-w]').forEach((inp) => inp.classList.toggle('bad', parseCell(inp.value) === null));
        root.querySelector('#cqTl').innerHTML = timeline(ev);
        const items = allV.concat(ev.uncovered.map((i) => `<b>Cobertura</b>: el ${DIAS_L[i].toLowerCase()} queda alguna hora sin cubrir.`));
        const MAXV = 4;
        root.querySelector('#cqOut').innerHTML = ok
          ? '<p class="fb ok">✓ Todo legal y cubierto. ¡Puedes pasar de nivel!</p>'
          : `<p class="viol-n">${items.length === 1 ? '1 cosa por arreglar' : items.length + ' cosas por arreglar'}</p><ul class="viol">${items.slice(0, MAXV).map((x) => `<li>${x}</li>`).join('')}</ul>${items.length > MAXV ? `<details class="viol-more"><summary>Ver ${items.length - MAXV} más</summary><ul class="viol">${items.slice(MAXV).map((x) => `<li>${x}</li>`).join('')}</ul></details>` : ''}`;
        const b = root.querySelector('[data-ok]');
        b.disabled = !ok;
        b.textContent = ok ? '✓ Cuadrante legal: siguiente nivel →' : 'Arregla lo que está en rojo';
      }
      root.addEventListener('input', (e) => {
        const inp = e.target.closest('[data-w]');
        if (!inp) return;
        state.cells[inp.dataset.w][+inp.dataset.d] = inp.value;
        refresh();
      });
      root.addEventListener('change', (e) => {
        const p = e.target.closest('[data-p]');
        if (p) {
          state.pausa[p.dataset.p] = p.checked;
          refresh();
        }
      });
      root.addEventListener('click', (e) => {
        const b = e.target.closest('[data-lv]');
        if (b) return load(+b.dataset.lv);
        if (e.target.closest('[data-reset]')) return load(lv);
        if (e.target.closest('[data-ok]')) {
          if (!doneLv.includes(lv)) doneLv.push(lv);
          api.store.set('lv', doneLv);
          api.done((doneLv.length / NIVELES.length) * 100, doneLv.length === NIVELES.length ? '¡Todos los cuadrantes legales! Eres el terror de Recursos Humanos.' : 'Cuadrante legal. ¡Al siguiente!');
          if (doneLv.length === NIVELES.length) api.award('cuadrante');
          api.confetti(50);
          if (lv + 1 < NIVELES.length) load(lv + 1);
          else {
            draw();
            root.querySelector('#cqOut').innerHTML = '<p class="fb ok">🏆 ¡Has superado los cuatro cuadrantes! Puedes repetir cualquier nivel con las pestañas de arriba.</p>';
          }
        }
      });
      load(Math.min(doneLv.length, NIVELES.length - 1));
    },
  };
  GAMES.cuadrante._check = checkWorker;
  GAMES.cuadrante._parse = parseCell;

  /* =====================================================================
     6b · ¿LEGAL O ILEGAL?
     ===================================================================== */
  const FRASES = [
    ['Tu contrato de técnico titulado tiene un periodo de prueba de 8 meses (y el convenio no dice nada).', false, 'Para técnicos titulados el máximo es de 6 meses (art. 14 ET).'],
    ['Al terminar el contrato te pagan los días de vacaciones que no has disfrutado.', true, 'Es la única situación en que las vacaciones se pagan en dinero: en el finiquito.'],
    ['Este año llevas 100 horas extra.', false, 'El máximo legal son 80 horas extra al año (art. 35 ET).'],
    ['Tu convenio te da 32 días naturales de vacaciones.', true, 'El convenio puede mejorar el mínimo de 30 días.'],
    ['Sales del CPD a las 22:00 y te citan a las 8:00 del día siguiente.', false, 'Solo hay 10 horas: el descanso entre jornadas es de 12 como mínimo.'],
    ['Con 17 años te ponen en el turno de noche del CPD.', false, 'Los menores de 18 no pueden hacer trabajo nocturno.'],
    ['Firmas una cláusula para cobrar tus vacaciones en vez de disfrutarlas.', false, 'Las vacaciones no se pueden sustituir por dinero y los derechos son irrenunciables.'],
    ['Te contratan «por obra o servicio» para un proyecto de dos años.', false, 'Esa modalidad desapareció con la reforma laboral de 2021.'],
    ['Por tu boda te dan 15 días naturales de permiso retribuido.', true, 'Es lo que fija el art. 37.3 ET.'],
    ['Por mudarte de piso te dan 1 día de permiso.', true, 'Un día por traslado del domicilio habitual.'],
    ['Una empresa contrata a un chico de 15 años como técnico de soporte.', false, 'La edad mínima para trabajar es de 16 años.'],
    ['Trabajas 7 horas seguidas sin ninguna pausa.', false, 'Con más de 6 horas de jornada continuada hay que tener al menos 15 minutos de pausa.'],
    ['Tu nómina tiene dos pagas extra al año.', true, 'El ET obliga a al menos dos gratificaciones extraordinarias.'],
    ['Durante el periodo de prueba te pagan menos que el salario mínimo.', false, 'Nadie puede cobrar menos que el SMI, tampoco en periodo de prueba.'],
    ['La empresa evalúa los riesgos de tu puesto de teletrabajo en casa.', true, 'La evaluación de riesgos también es obligatoria en teletrabajo.'],
    ['Te niegas a subir a una escalera rota y tu jefe te sanciona por ello.', false, 'Ante un riesgo grave e inminente puedes interrumpir la actividad, y no se te puede sancionar por eso.'],
    ['La empresa te descuenta de la nómina el precio de las botas de seguridad.', false, 'El coste de la prevención nunca puede recaer en el trabajador: los EPI son gratis.'],
    ['Tienes día y medio de descanso semanal seguido.', true, 'Es el descanso semanal mínimo (art. 37.1 ET).'],
    ['Encadenas contratos temporales 20 meses en 24 y la empresa te dice que sigues siendo temporal.', false, 'Más de 18 meses en 24 con contratos temporales te convierten en fijo.'],
    ['Te declaran el despido improcedente y te ofrecen 20 días por año.', false, 'El despido improcedente se indemniza con 33 días por año (máximo 24 mensualidades).'],
    ['Una empresa de 60 trabajadores no tiene Comité de Seguridad y Salud.', false, 'Con 50 o más trabajadores es obligatorio.'],
    ['Te tuerces el tobillo yendo al trabajo y la mutua lo trata como accidente de trabajo.', true, 'Es accidente in itinere, que cuenta como accidente de trabajo.'],
    ['Tu jefe te exige contestar correos a las 23:00 aunque no estás de guardia.', false, 'Tienes derecho a la desconexión digital fuera de tu jornada.'],
    ['Tu contrato temporal es de 4 meses y tiene 3 meses de periodo de prueba.', false, 'En temporales de hasta 6 meses, el periodo de prueba no puede pasar de 1 mes (salvo convenio).'],
    ['Por el fallecimiento de tu abuelo te dan 2 días, y 4 porque tienes que viajar.', true, 'Familiares hasta 2.º grado: 2 días, ampliables a 4 con desplazamiento.'],
    ['Tu contrato indefinido a jornada completa se hizo de palabra.', true, 'El contrato puede ser verbal salvo los que la ley exige por escrito.'],
    ['Dimites para irte de viaje y cobras el paro al volver.', false, 'La baja voluntaria no da derecho a la prestación por desempleo.'],
    ['La empresa no te da de alta en la Seguridad Social hasta que pasas el periodo de prueba.', false, 'El alta debe hacerse antes de empezar a trabajar.'],
    ['El convenio permite repartir la jornada y un día trabajas 10 horas y otro 6, respetando 12 horas de descanso.', true, 'Por convenio o acuerdo se puede distribuir la jornada de forma irregular respetando los descansos.'],
    ['Te dan de baja por enfermedad común y desde el 4.º día cobras el 60 % de la base reguladora.', true, 'Es lo que paga la incapacidad temporal por enfermedad común del día 4 al 20.'],
  ];
  GAMES.legal = {
    title: '¿Legal o ilegal?',
    icon: '⚖️',
    tag: 'Juzga situaciones laborales: tres vidas',
    mount(root, api) {
      let deck;
      let i;
      let lives;
      let streak;
      let best;
      let ok;
      let shown; /* respuesta de la tarjeta actual, mientras se lee la explicación */
      function start() {
        deck = shuffle(FRASES).slice(0, 15);
        i = 0;
        lives = 3;
        streak = 0;
        best = 0;
        ok = 0;
        shown = null;
        draw();
      }
      function draw() {
        if (!shown && (i >= deck.length || lives <= 0)) {
          const sc = (ok / deck.length) * 100;
          api.done(sc, lives <= 0 ? 'Te has quedado sin vidas. ¡Otra ronda!' : `${ok} de ${deck.length}. Mejor racha: ${best}.`);
          root.innerHTML = `<div class="finish${ok >= 10 ? '' : ' fail'}"><div class="big">${ok}/${deck.length}</div><div><b>${lives <= 0 ? 'Sin vidas' : '¡Fin de la sesión!'}</b><p>Mejor racha: ${best} seguidas.</p><button type="button" class="btn primary" data-new>Jugar otra vez</button></div></div>`;
          return;
        }
        const [t, truth, why] = deck[i];
        let h =
          `<div class="lg-hud"><span>${'❤️'.repeat(lives)}${'🖤'.repeat(3 - lives)}</span><span>Racha <b>${streak}</b></span><span>${i + 1} / ${deck.length}</span></div>` +
          `<div class="card-big${shown ? (shown.good ? ' right' : ' wrong') : ''}"><small>${shown ? (truth ? '✓ Es legal' : '✗ Es ilegal') : '¿Esto es legal?'}</small><p>${esc(t)}</p>${shown ? `<p class="verdict">${esc(why)}</p>` : ''}</div>`;
        if (shown) h += `<p class="fb ${shown.good ? 'ok' : 'bad'}">${shown.good ? '¡Has acertado!' : 'Has fallado: pierdes una vida.'}</p><div class="row-btns"><button type="button" class="btn primary big" data-cont>${i + 1 < deck.length && lives > 0 ? 'Siguiente →' : 'Ver resultado →'}</button></div>`;
        else h += '<div class="lg-btns"><button type="button" class="btn big no" data-v="0">✗ Ilegal</button><button type="button" class="btn big yes" data-v="1">Legal ✓</button></div><p class="small">Teclas: ← ilegal · → legal</p>';
        root.innerHTML = h;
        const c = root.querySelector('[data-cont]');
        if (c) c.focus();
      }
      function answer(v) {
        if (!deck || shown || i >= deck.length || lives <= 0) return;
        const good = v === deck[i][1];
        if (good) {
          ok++;
          streak++;
          best = Math.max(best, streak);
          if (streak === 10) api.award('legal');
        } else {
          lives--;
          streak = 0;
        }
        shown = { good };
        api.say(good ? (streak >= 3 ? `¡Racha de ${streak}!` : 'Correcto.') : 'Fallo. Lee la explicación.', good ? 'happy' : 'oops');
        draw();
      }
      function next() {
        if (!shown) return;
        shown = null;
        i++;
        draw();
      }
      root.addEventListener('click', (e) => {
        const b = e.target.closest('[data-v]');
        if (b) return answer(b.dataset.v === '1');
        if (e.target.closest('[data-cont]')) return next();
        if (e.target.closest('[data-new]')) start();
      });
      const key = (e) => {
        if (e.target.closest && e.target.closest('input, textarea, dialog[open]')) return;
        if (shown && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          return next();
        }
        if (e.key === 'ArrowLeft') answer(false);
        if (e.key === 'ArrowRight') answer(true);
      };
      document.addEventListener('keydown', key);
      api.onLeave(() => document.removeEventListener('keydown', key));
      start();
      api.say('Quince situaciones. Tres fallos y fuera. ¿Cuántas seguidas eres capaz?', '');
    },
  };

  /* =====================================================================
     7 · TU NÓMINA
     ===================================================================== */
  const TIPOS26 = { cc: 4.7, mei: 0.15, desInd: 1.55, desTemp: 1.6, fp: 0.1, he: 4.7 };
  const NOMINAS = [
    { id: 'n1', t: 'Técnica de soporte, contrato indefinido', who: 'Lucía, técnica de soporte en una consultora. Contrato indefinido.', base: 1450, plus: [['Plus de convenio', 120]], pagas: { n: 2, imp: 1570, prorr: false }, he: 0, dietas: 0, irpf: 10, temp: false },
    { id: 'n2', t: 'Técnico de sistemas temporal con horas extra', who: 'Hugo, técnico de sistemas con un contrato por circunstancias de la producción. Este mes ha hecho 8 horas extra a 15 €.', base: 1300, plus: [['Plus de transporte', 60]], pagas: { n: 2, imp: 1300, prorr: true }, he: 120, dietas: 0, irpf: 8, temp: true },
    { id: 'n3', t: 'Técnica de campo con dietas', who: 'Sara, técnica de campo con contrato indefinido. Viaja a clientes y cobra 90 € en dietas exentas.', base: 1800, plus: [['Plus de convenio', 200]], pagas: { n: 2, imp: 2000, prorr: false }, he: 0, dietas: 90, irpf: 15, temp: false },
  ];
  function calcNomina(c) {
    const salariales = c.base + c.plus.reduce((a, [, v]) => a + v, 0);
    const prorrata = r2((c.pagas.n * c.pagas.imp) / 12);
    const devengado = r2(salariales + (c.pagas.prorr ? prorrata : 0) + c.he + c.dietas);
    const bccc = r2(salariales + prorrata);
    const bccp = r2(bccc + c.he);
    const birpf = r2(devengado - c.dietas);
    const d = {
      cc: r2((bccc * TIPOS26.cc) / 100),
      mei: r2((bccc * TIPOS26.mei) / 100),
      des: r2((bccp * (c.temp ? TIPOS26.desTemp : TIPOS26.desInd)) / 100),
      fp: r2((bccp * TIPOS26.fp) / 100),
      he: r2((c.he * TIPOS26.he) / 100),
      irpf: r2((birpf * c.irpf) / 100),
    };
    const total = r2(Object.values(d).reduce((a, b) => a + b, 0));
    return { salariales, prorrata, devengado, bccc, bccp, birpf, d, total, liquido: r2(devengado - total) };
  }
  GAMES.nomina = {
    title: 'Tu nómina',
    icon: '💶',
    tag: 'Rellena una nómina real paso a paso',
    mount(root, api) {
      let c;
      let k;
      let vals;
      let checked;
      let hints;
      function fields() {
        const s = [
          ['devengado', 'Total devengado', k.devengado, 'Suma de todos los devengos del mes (salariales, prorrata si viene incluida, horas extra y dietas).'],
          ['bccc', 'Base de contingencias comunes (BCCC)', k.bccc, `Remuneración sin horas extra ni dietas exentas${c.pagas.prorr ? ' (la prorrata ya va incluida)' : ' + prorrata de pagas: ' + c.pagas.n + ' × ' + c.pagas.imp + ' ÷ 12'}.`],
          ['bccp', 'Base de contingencias profesionales (BCCP)', k.bccp, 'BCCC + horas extra.'],
          ['birpf', 'Base IRPF', k.birpf, 'Total devengado sin las dietas exentas.'],
          ['cc', `Contingencias comunes · ${pc(TIPOS26.cc)}`, k.d.cc, `${pc(TIPOS26.cc)} de la BCCC.`],
          ['mei', `MEI · ${pc(TIPOS26.mei)}`, k.d.mei, `${pc(TIPOS26.mei)} de la BCCC.`],
          ['des', `Desempleo · ${pc(c.temp ? TIPOS26.desTemp : TIPOS26.desInd)}`, k.d.des, `${c.temp ? 'Contrato temporal: 1,60 %' : 'Contrato indefinido: 1,55 %'} de la BCCP.`],
          ['fp', `Formación profesional · ${pc(TIPOS26.fp)}`, k.d.fp, `${pc(TIPOS26.fp)} de la BCCP.`],
        ];
        if (c.he) s.push(['he', `Horas extra · ${pc(TIPOS26.he)}`, k.d.he, `${pc(TIPOS26.he)} del importe de las horas extra.`]);
        s.push(['irpf', `IRPF · ${pc(c.irpf)}`, k.d.irpf, `${pc(c.irpf)} de la base IRPF.`], ['total', 'Total a deducir', k.total, 'Suma de todas las deducciones.'], ['liquido', 'Líquido a percibir', k.liquido, 'Total devengado − total a deducir.']);
        return s;
      }
      function menu() {
        c = null;
        root.innerHTML =
          `<p class="lead">Tres nóminas de técnicos. Tú rellenas las casillas: bases, cotizaciones, IRPF y lo que cobra de verdad. Tipos del trabajador en 2026 (compruébalos cada año en el BOE).</p><div class="casos">` +
          NOMINAS.map((n, i) => `<button type="button" class="caso" data-n="${i}"><span>💶</span><b>${esc(n.t)}</b><small>${api.store.get(n.id, null) != null ? 'Mejor: ' + api.store.get(n.id) + ' %' : 'Sin hacer'}</small></button>`).join('') +
          '</div>';
      }
      function start(i) {
        c = NOMINAS[i];
        k = calcNomina(c);
        vals = {};
        checked = false;
        hints = false;
        draw();
        api.say('Empieza por el total devengado y sigue hacia abajo. Puedes usar la calculadora del móvil.', '');
      }
      function draw() {
        const F = fields();
        const okN = checked ? F.filter(([id, , v]) => Math.abs(num(vals[id]) - v) <= 0.02).length : 0;
        const row = ([id, label, v, hint]) => {
          const st = checked ? (Math.abs(num(vals[id]) - v) <= 0.02 ? 'ok' : 'bad') : '';
          return `<tr class="${st}"><td>${esc(label)}${hints ? `<small class="hint">${esc(hint)}</small>` : ''}</td><td class="money"><input type="text" inputmode="decimal" data-f="${id}" value="${esc(vals[id] || '')}" placeholder="0,00" aria-label="${esc(label)}"${checked ? ' readonly' : ''}>${st === 'bad' ? `<small class="sol">${eur(v)}</small>` : ''}</td></tr>`;
        };
        root.innerHTML =
          `<div class="insp-head"><button type="button" class="link" data-back>← Nóminas</button><b>${esc(c.t)}</b></div><p class="small">${esc(c.who)}</p>` +
          `<div class="payslip"><div class="ps-head"><span>RECIBO INDIVIDUAL DE SALARIOS</span><span>Mes: noviembre 2026 · 30 días</span></div><table><tbody>` +
          '<tr class="sec"><td colspan="2">I. DEVENGOS</td></tr>' +
          `<tr><td>Salario base</td><td class="money">${eur(c.base)}</td></tr>` +
          c.plus.map(([n, v]) => `<tr><td>${esc(n)}</td><td class="money">${eur(v)}</td></tr>`).join('') +
          (c.pagas.prorr ? `<tr><td>Prorrata de pagas extra (${c.pagas.n} × ${eur(c.pagas.imp)} ÷ 12)</td><td class="money">${eur(k.prorrata)}</td></tr>` : `<tr class="muted"><td>Pagas extra: ${c.pagas.n} de ${eur(c.pagas.imp)}, se cobran aparte (no prorrateadas)</td><td class="money">—</td></tr>`) +
          (c.he ? `<tr><td>Horas extraordinarias</td><td class="money">${eur(c.he)}</td></tr>` : '') +
          (c.dietas ? `<tr><td>Dietas (percepción extrasalarial exenta)</td><td class="money">${eur(c.dietas)}</td></tr>` : '') +
          row(fields()[0]) +
          '<tr class="sec"><td colspan="2">BASES</td></tr>' + F.slice(1, 4).map(row).join('') +
          '<tr class="sec"><td colspan="2">II. DEDUCCIONES</td></tr>' + F.slice(4, F.length - 2).map(row).join('') +
          row(F[F.length - 2]) +
          '<tr class="sec"><td colspan="2">LÍQUIDO</td></tr>' + row(F[F.length - 1]) +
          '</tbody></table></div>' +
          `<div class="row-btns">${checked ? `<span class="big-n">${okN}/${F.length}</span><button type="button" class="btn" data-again>Repetir</button><button type="button" class="btn" data-back>Otra nómina</button>` : '<button type="button" class="btn primary" data-check>Comprobar</button>'}<button type="button" class="btn" data-hint>${hints ? 'Ocultar' : 'Ver'} fórmulas</button></div>` +
          '<p class="small">Escribe los importes con coma o punto decimal (1.234,56 o 1234.56). Redondea cada deducción a dos decimales.</p>';
        if (checked) {
          const sc = (okN / F.length) * 100;
          const prev = api.store.get(c.id, null);
          if (prev == null || sc > prev) api.store.set(c.id, Math.round(sc));
          const all = NOMINAS.map((n) => api.store.get(n.id, 0) || 0);
          api.done(all.reduce((a, b) => a + b, 0) / NOMINAS.length, okN === F.length ? '¡Nómina perfecta! Ya no te la cuela nadie.' : 'Mira en rojo lo que falla: la solución está debajo de cada casilla.');
          if (okN === F.length) api.award('nomina');
        }
      }
      root.addEventListener('input', (e) => {
        const f = e.target.closest('[data-f]');
        if (f) vals[f.dataset.f] = f.value;
      });
      root.addEventListener('click', (e) => {
        const n = e.target.closest('[data-n]');
        if (n) return start(+n.dataset.n);
        if (e.target.closest('[data-back]')) return menu();
        if (e.target.closest('[data-again]')) return start(NOMINAS.indexOf(c));
        if (e.target.closest('[data-hint]')) {
          hints = !hints;
          return draw();
        }
        if (e.target.closest('[data-check]')) {
          checked = true;
          draw();
        }
      });
      menu();
      api.say('La nómina se lee de arriba abajo: lo que ganas, sobre qué se cotiza, lo que te quitan y lo que cobras.', '');
    },
  };
  GAMES.nomina._calc = calcNomina;
  GAMES.nomina._cases = NOMINAS;

  /* =====================================================================
     8 · FIN DE CONTRATO: indemnización y finiquito
     ===================================================================== */
  const FINES = [
    { id: 'f1', t: 'Se acaba el contrato temporal', story: 'Marcos tenía un contrato por circunstancias de la producción de 9 meses. Termina el 15 de abril. Salario: 1.500 € al mes con 2 pagas extra de 1.500 €. Le quedan 7 días de vacaciones sin disfrutar.', mes: 1500, dias: 15, vac: 7, mesesPaga: 3.5, causa: 'temporal', anios: 0.75 },
    { id: 'f2', t: 'Despido objetivo', story: 'La empresa cierra el departamento de soporte por causas organizativas. Elena lleva 4 años. Salario: 1.800 € al mes con 2 pagas extra de 1.800 €. La despiden el 31 de octubre: 31 días trabajados, 5 días de vacaciones pendientes y 4 meses de la paga de diciembre devengados.', mes: 1800, dias: 31, vac: 5, mesesPaga: 4, causa: 'objetivo', anios: 4 },
    { id: 'f3', t: 'Despido improcedente', story: 'Un juez declara improcedente el despido de Iván, administrador de sistemas con 6 años y 6 meses de antigüedad. Salario: 2.000 € al mes con 2 pagas extra de 2.000 €. Despido el 20 de marzo: 20 días trabajados, 10 de vacaciones pendientes y 3 meses de la paga de junio.', mes: 2000, dias: 20, vac: 10, mesesPaga: 3, causa: 'improcedente', anios: 6.5 },
    { id: 'f4', t: 'Despido disciplinario procedente', story: 'Iván se descargaba datos de clientes en un USB personal. Despido disciplinario procedente el 10 de febrero tras 2 años. Salario: 1.600 € al mes con 2 pagas extra de 1.600 €. 10 días trabajados, 3 de vacaciones pendientes y 1 mes de la paga de junio.', mes: 1600, dias: 10, vac: 3, mesesPaga: 1, causa: 'disciplinario', anios: 2 },
  ];
  const DIAS_IND = { temporal: 12, objetivo: 20, improcedente: 33, disciplinario: 0 };
  const TOPE = { objetivo: 12, improcedente: 24 };
  function calcFin(c) {
    const anual = c.mes * 14;
    const diario = anual / 365;
    let ind = diario * DIAS_IND[c.causa] * c.anios;
    if (TOPE[c.causa]) ind = Math.min(ind, (anual / 12) * TOPE[c.causa]);
    const fDias = r2((c.mes / 30) * Math.min(c.dias, 30));
    const fVac = r2((c.mes / 30) * c.vac);
    const fPaga = r2((c.mes * c.mesesPaga) / 6);
    return { diario: r2(diario), ind: r2(ind), fDias, fVac, fPaga, fin: r2(fDias + fVac + fPaga) };
  }
  GAMES.fin = {
    title: 'Fin de contrato',
    icon: '🧮',
    tag: 'Calcula la indemnización y el finiquito',
    mount(root, api) {
      let c;
      let k;
      let vals;
      let checked;
      const tol = (v) => Math.max(0.05, Math.abs(v) * 0.002);
      function menu() {
        c = null;
        root.innerHTML =
          '<p class="lead">Cuatro finales de contrato. Calcula lo que le corresponde a cada persona. Reglas: salario diario para la indemnización = salario anual con pagas ÷ 365; para el finiquito, el salario del mes ÷ 30; las pagas se devengan por semestres (cada una en 6 meses).</p><div class="casos">' +
          FINES.map((f, i) => `<button type="button" class="caso" data-f="${i}"><span>🧮</span><b>${esc(f.t)}</b><small>${api.store.get(f.id, null) != null ? 'Mejor: ' + api.store.get(f.id) + ' %' : 'Sin hacer'}</small></button>`).join('') +
          '</div>';
      }
      function start(i) {
        c = FINES[i];
        k = calcFin(c);
        vals = {};
        checked = false;
        draw();
      }
      function draw() {
        const F = [
          ['diario', 'Salario diario para la indemnización (anual ÷ 365)', k.diario],
          ['ind', `Indemnización (${DIAS_IND[c.causa]} días por año${TOPE[c.causa] ? `, tope ${TOPE[c.causa]} mensualidades` : ''})`, k.ind],
          ['fDias', 'Finiquito: salario de los días trabajados del mes', k.fDias],
          ['fVac', 'Finiquito: vacaciones no disfrutadas', k.fVac],
          ['fPaga', 'Finiquito: parte proporcional de la paga extra', k.fPaga],
          ['fin', 'Total finiquito', k.fin],
        ];
        const okN = F.filter(([id, , v]) => Math.abs(num(vals[id]) - v) <= tol(v)).length;
        root.innerHTML =
          `<div class="insp-head"><button type="button" class="link" data-back>← Casos</button><b>${esc(c.t)}</b></div><div class="card-big"><p>${esc(c.story)}</p></div>` +
          '<table class="calc"><tbody>' +
          F.map(([id, label, v]) => {
            const st = checked ? (Math.abs(num(vals[id]) - v) <= tol(v) ? 'ok' : 'bad') : '';
            return `<tr class="${st}"><td>${esc(label)}</td><td class="money"><input type="text" inputmode="decimal" data-v="${id}" value="${esc(vals[id] || '')}" placeholder="0,00"${checked ? ' readonly' : ''} aria-label="${esc(label)}">${st === 'bad' ? `<small class="sol">${eur(v)}</small>` : ''}</td></tr>`;
          }).join('') +
          '</tbody></table>' +
          `<div class="row-btns">${checked ? `<span class="big-n">${okN}/${F.length}</span><button type="button" class="btn" data-again>Repetir</button><button type="button" class="btn" data-back>Otro caso</button>` : '<button type="button" class="btn primary" data-check>Comprobar</button>'}</div>` +
          (checked ? `<p class="note">Indemnización: ${eur(k.diario)} × ${DIAS_IND[c.causa]} días × ${String(c.anios).replace('.', ',')} años${TOPE[c.causa] ? ` (sin superar ${TOPE[c.causa]} mensualidades)` : ''} = <b>${eur(k.ind)}</b>. Finiquito = ${eur(k.fDias)} + ${eur(k.fVac)} + ${eur(k.fPaga)} = <b>${eur(k.fin)}</b>. ${c.causa === 'disciplinario' ? 'Aunque el despido disciplinario procedente no se indemniza, el finiquito se cobra siempre.' : ''}</p>` : '<p class="small">Se acepta la pequeña diferencia de usar el salario diario redondeado.</p>');
        if (checked) {
          const sc = (okN / F.length) * 100;
          const prev = api.store.get(c.id, null);
          if (prev == null || sc > prev) api.store.set(c.id, Math.round(sc));
          const all = FINES.map((f) => api.store.get(f.id, 0) || 0);
          api.done(all.reduce((a, b) => a + b, 0) / FINES.length, okN === F.length ? 'Cuentas claras. Así se revisa un finiquito antes de firmar.' : 'Revisa las casillas en rojo. Recuerda: firma el finiquito como «no conforme» si no te salen las cuentas.');
          if (okN === F.length) api.award('fin');
        }
      }
      root.addEventListener('input', (e) => {
        const f = e.target.closest('[data-v]');
        if (f) vals[f.dataset.v] = f.value;
      });
      root.addEventListener('click', (e) => {
        const n = e.target.closest('[data-f]');
        if (n) return start(+n.dataset.f);
        if (e.target.closest('[data-back]')) return menu();
        if (e.target.closest('[data-again]')) return start(FINES.indexOf(c));
        if (e.target.closest('[data-check]')) {
          checked = true;
          draw();
        }
      });
      menu();
      api.say('Antes de firmar un finiquito, haz las cuentas. Aquí practicas.', '');
    },
  };
  GAMES.fin._calc = calcFin;
  GAMES.fin._cases = FINES;

  /* =====================================================================
     9 · MI DAFO Y HOJA DE RUTA
     ===================================================================== */
  const SUG = {
    F: ['Me defiendo con Linux', 'Configuro redes en Packet Tracer', 'Trabajo bien en equipo', 'Aprendo rápido por mi cuenta', 'Tengo paciencia con los usuarios', 'Soy ordenado documentando'],
    D: ['Inglés técnico flojo', 'Sin experiencia en empresa', 'Me cuesta hablar en público', 'Me agobio con las urgencias', 'Poco Windows Server', 'No tengo perfil de LinkedIn'],
    O: ['Mucha demanda de técnicos de sistemas y cloud', 'La formación en empresa del ciclo', 'Certificaciones asequibles (CCNA, LPIC, AZ-900)', 'Teletrabajo en IT', 'Cursos de especialización en ciberseguridad', 'Comunidades y eventos tecnológicos'],
    A: ['Muchos candidatos con experiencia', 'Automatización de tareas básicas', 'La tecnología cambia muy rápido', 'Ofertas con muchos requisitos', 'Contratos temporales en soporte', 'Competencia de titulados universitarios'],
  };
  const QN = { D: 'Debilidades', A: 'Amenazas', F: 'Fortalezas', O: 'Oportunidades' };
  const QD = { D: 'internas · lo que te falta', A: 'externas · lo que te puede frenar', F: 'internas · lo que ya tienes', O: 'externas · lo que puedes aprovechar' };
  GAMES.dafo = {
    title: 'Mi DAFO y hoja de ruta',
    icon: '🗺️',
    tag: 'Autoconocimiento y objetivos SMART',
    mount(root, api) {
      const st = api.store.get('st', { q: { D: [], A: [], F: [], O: [] }, goals: [{ que: '', como: '', cuando: '', paso: '' }] });
      let target = 'F';
      let draftTxt = '';
      const save = () => api.store.set('st', st);
      const smart = (g) => ({
        S: g.que.trim().split(/\s+/).length >= 4,
        M: /\d|aprobar|certific|terminar|publicar|conseguir/i.test(g.como + ' ' + g.que),
        A: g.paso.trim().length >= 8,
        R: g.que.trim().length > 0,
        T: /\d{4}|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|semana|mes|trimestre|curso/i.test(g.cuando),
      });
      function draw() {
        const top = (window.localStorage && (() => {
          try {
            return JSON.parse(localStorage.getItem('ipe.g.brujula.top'));
          } catch (e) {
            return null;
          }
        })()) || null;
        const quad = (k) =>
          `<div class="dq dq-${k}${target === k ? ' on' : ''}" data-q="${k}"><h4>${QN[k]}<small>${QD[k]}</small></h4><ul>${st.q[k].map((t, i) => `<li>${esc(t)}<button type="button" class="x" data-del="${k}:${i}" aria-label="Quitar">✕</button></li>`).join('')}</ul></div>`;
        const okDafo = Object.keys(st.q).every((k) => st.q[k].length >= 2);
        let h =
          '<p class="lead">Tu DAFO personal como técnico ASIR. Elige un cuadrante (se marca en amarillo) y añade ideas: las sugeridas o las tuyas. Pon al menos dos en cada uno.</p>' +
          (top ? '<p class="note">En la Brújula profesional salió que lo tuyo es <b>' + esc({ sis: 'administración de sistemas', red: 'redes', seg: 'ciberseguridad', sop: 'soporte', cld: 'cloud y DevOps', dat: 'bases de datos y web' }[top] || top) + '</b>: úsalo en tus fortalezas y en tus objetivos.</p>' : '') +
          `<div class="dafo">${['D', 'A', 'F', 'O'].map(quad).join('')}</div>` +
          `<div class="sug"><b>Ideas para «${QN[target]}»:</b> ${SUG[target].filter((t) => !st.q[target].includes(t)).map((t) => `<button type="button" class="chipb" data-add="${esc(t)}">+ ${esc(t)}</button>`).join('')}</div>` +
          `<div class="row-btns"><input type="text" id="dfIn" value="${esc(draftTxt)}" placeholder="Escribe tu propia idea para ${QN[target].toLowerCase()}…" maxlength="80"><button type="button" class="btn" data-addown>Añadir</button></div>` +
          '<h3 class="h3">Objetivos SMART</h3><p class="small">Específico, Medible, Alcanzable, Relevante y con Tiempo. Rellena al menos uno completo.</p>';
        st.goals.forEach((g, i) => {
          const s = smart(g);
          h +=
            `<div class="goal"><div class="smart">${Object.keys(s).map((x) => `<i class="${s[x] ? 'on' : ''}" title="${{ S: 'Específico', M: 'Medible', A: 'Alcanzable', R: 'Relevante', T: 'Con tiempo' }[x]}">${x}</i>`).join('')}</div>` +
            `<label>Qué quiero conseguir<input type="text" data-g="${i}:que" value="${esc(g.que)}" placeholder="Aprobar la certificación CCNA 200-301"></label>` +
            `<label>Cómo sabré que lo he logrado<input type="text" data-g="${i}:como" value="${esc(g.como)}" placeholder="Tener el certificado / nota de 825 o más"></label>` +
            `<label>Cuándo<input type="text" data-g="${i}:cuando" value="${esc(g.cuando)}" placeholder="Junio de 2027"></label>` +
            `<label>Primer paso (esta semana)<input type="text" data-g="${i}:paso" value="${esc(g.paso)}" placeholder="Estudiar 4 horas a la semana con Packet Tracer"></label></div>`;
        });
        const okGoal = st.goals.some((g) => Object.values(smart(g)).every(Boolean));
        h += `<div class="row-btns">${st.goals.length < 3 ? '<button type="button" class="btn" data-goal>+ Otro objetivo</button>' : ''}<button type="button" class="btn primary" data-export${okDafo && okGoal ? '' : ' disabled'}>Descargar mi hoja de ruta</button>${okDafo && okGoal ? '' : `<small>${okDafo ? '' : 'Faltan ideas en algún cuadrante. '}${okGoal ? '' : 'Falta un objetivo SMART completo.'}</small>`}</div>`;
        root.innerHTML = h;
        if (okDafo && okGoal) {
          api.award('dafo');
          api.done(100);
        }
      }
      root.addEventListener('click', (e) => {
        const q = e.target.closest('[data-q]');
        const del = e.target.closest('[data-del]');
        if (del) {
          const [k, i] = del.dataset.del.split(':');
          st.q[k].splice(+i, 1);
          save();
          return draw();
        }
        if (q) {
          target = q.dataset.q;
          return draw();
        }
        const a = e.target.closest('[data-add]');
        if (a) {
          st.q[target].push(a.dataset.add);
          save();
          return draw();
        }
        if (e.target.closest('[data-addown]')) {
          const v = root.querySelector('#dfIn').value.trim();
          if (v) {
            st.q[target].push(v.slice(0, 80));
            draftTxt = '';
            save();
            draw();
          }
          return;
        }
        if (e.target.closest('[data-goal]')) {
          st.goals.push({ que: '', como: '', cuando: '', paso: '' });
          save();
          return draw();
        }
        if (e.target.closest('[data-export]')) {
          const txt =
            'MI HOJA DE RUTA · TÉCNICO ASIR\n\n' +
            ['F', 'D', 'O', 'A'].map((k) => QN[k].toUpperCase() + '\n' + st.q[k].map((t) => ' - ' + t).join('\n')).join('\n\n') +
            '\n\nOBJETIVOS SMART\n' +
            st.goals.filter((g) => g.que).map((g, i) => `${i + 1}. ${g.que}\n   Cómo lo mediré: ${g.como}\n   Cuándo: ${g.cuando}\n   Primer paso: ${g.paso}`).join('\n') +
            '\n';
          try {
            const el = document.createElement('a');
            el.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
            el.download = 'mi-hoja-de-ruta.txt';
            document.body.appendChild(el);
            el.click();
            el.remove();
            api.say('Descargada. Guárdala: te servirá para la carta de presentación y la entrevista.', 'happy');
          } catch (err) {
            api.say('Tu navegador no deja descargar. Copia el texto a mano.', 'oops');
          }
        }
      });
      root.addEventListener('input', (e) => {
        if (e.target.id === 'dfIn') draftTxt = e.target.value;
        const g = e.target.closest('[data-g]');
        if (!g) return;
        const [i, f] = g.dataset.g.split(':');
        st.goals[+i][f] = g.value;
        save();
        /* actualizar solo las marcas S-M-A-R-T y el botón, sin repintar (no se pierde el cursor) */
        const s = smart(st.goals[+i]);
        const box = root.querySelectorAll('.goal')[+i];
        if (box) box.querySelectorAll('.smart i').forEach((el, k) => el.classList.toggle('on', !!s['SMART'[k]]));
        const okDafo = Object.keys(st.q).every((k) => st.q[k].length >= 2);
        const okGoal = st.goals.some((x) => Object.values(smart(x)).every(Boolean));
        const ex = root.querySelector('[data-export]');
        if (ex) ex.disabled = !(okDafo && okGoal);
        if (okDafo && okGoal) {
          api.award('dafo');
          api.done(100);
        }
      });
      root.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.id === 'dfIn') root.querySelector('[data-addown]').click();
      });
      draw();
      api.say('Aquí no hay respuestas correctas: es tu plan. Sé sincero contigo.', '');
    },
  };

  /* =====================================================================
     FINAL · ESCAPE ROOM: EL CPD CERRADO
     ===================================================================== */
  const CANDADOS = [
    { t: 'Caja del extintor', story: 'Son las 21:00, el CPD se ha cerrado contigo dentro y huele a quemado: el SAI echa humo. La caja del extintor tiene un candado de letras con el agente extintor adecuado para equipos con tensión.', q: 'Escribe el agente extintor (3 caracteres).', a: (v) => /^co(2|₂)$/i.test(v.replace(/\s/g, '')), hint: 'No es agua ni espuma: es un gas que no conduce la electricidad.', sol: 'CO2' },
    { t: 'Armario del cuadro eléctrico', story: 'Fuego apagado. Para entrar al cuadro y cortar la tensión del SAI, el armario pide un número: las horas mínimas de descanso entre el final de una jornada y el inicio de la siguiente.', q: 'Código de 2 cifras.', a: (v) => v.trim() === '12', hint: 'Si sales a las 23:00, no puedes entrar antes de las 11:00.', sol: '12' },
    { t: 'Teléfono del puesto de guardia', story: 'Hay un compañero mareado por el humo. El teléfono interno solo deja marcar un número de 3 cifras: el de emergencias.', q: 'Número de emergencias.', a: (v) => v.trim() === '112', hint: 'Es el número único europeo.', sol: '112' },
    { t: 'Tu compañero, en el suelo', story: 'El compañero del humo se ha desplomado: no responde y no respira con normalidad. El 112 te pide que empieces la RCP mientras llegan: ¿cuántas compresiones haces antes de cada 2 ventilaciones?', q: 'Número de compresiones.', a: (v) => v.trim() === '30', hint: 'El ritmo es 30:2, a unas 100-120 compresiones por minuto.', sol: '30' },
    { t: 'La señal de salida', story: 'Sin corriente, la señal de SALIDA se ha apagado y con el humo no se ve. Su batería de emergencia se activa con el color de las señales de salvamento o socorro.', q: 'Escribe el color.', a: (v) => /^verde$/i.test(v.trim()), hint: 'Es el color de las salidas de emergencia y de los primeros auxilios.', sol: 'Verde' },
    { t: 'Caja fuerte del plan de emergencia', story: 'La caja con la llave de la salida de emergencia se abre con: días naturales mínimos de vacaciones + días de permiso por matrimonio.', q: 'Suma de las dos cifras.', a: (v) => v.trim() === '45', hint: 'Vacaciones: 30 días naturales. Matrimonio: 15 días naturales.', sol: '45' },
    { t: 'Panel de la puerta', story: 'La puerta pregunta por el nivel de un riesgo con probabilidad alta y consecuencias extremadamente dañinas, el que obliga a parar el trabajo de inmediato.', q: 'Escribe el nivel de riesgo.', a: (v) => /^intolerable$/i.test(v.trim()), hint: 'Es el peor nivel de la matriz del INSST.', sol: 'Intolerable' },
    { t: 'La salida', story: 'Último candado: tres letras con el orden de actuación ante un accidente. Fuera te espera el punto de encuentro.', q: 'Las tres iniciales, en orden.', a: (v) => /^p\.?\s*a\.?\s*s\.?$/i.test(v.trim()), hint: 'Proteger, Avisar, Socorrer.', sol: 'PAS' },
  ];
  /* ---------- escena animada del CPD (SVG): se pinta una vez y se actualiza por clases y variables CSS ---------- */
  const ESC_TOTAL = 150; /* segundos: 2:30 */
  const ESC_FALLO = 10;
  const ESC_PISTA = 20;
  /* focos que se van encendiendo según se acaba el tiempo (fracción de tiempo consumido), cada vez más cerca de la salida */
  const ESC_SPREAD = [
    { at: 0.15, x: 470, y: 300, s: 0.55 },
    { at: 0.3, x: 430, y: 300, s: 0.7 },
    { at: 0.42, x: 380, y: 94, s: 0.6 },
    { at: 0.52, x: 360, y: 300, s: 0.75 },
    { at: 0.62, x: 600, y: 300, s: 0.65 },
    { at: 0.72, x: 296, y: 94, s: 0.6 },
    { at: 0.8, x: 292, y: 300, s: 0.8 },
    { at: 0.88, x: 700, y: 300, s: 0.7 },
    { at: 0.94, x: 240, y: 300, s: 0.85 },
    { at: 0.7, x: 420, y: 304, s: 1.9, big: true }, /* el gran incendio del centro */
    { at: 0.86, x: 560, y: 304, s: 1.6, big: true },
  ];
  /* dónde se para el personaje y dónde se marca el objetivo de cada candado */
  const ESC_SPOT = [
    { px: 222, tx: 212, ty: 196, tr: 40 }, /* extintor */
    { px: 618, tx: 632, ty: 156, tr: 48 }, /* cuadro eléctrico */
    { px: 700, tx: 726, ty: 238, tr: 30 }, /* teléfono */
    { px: 560, tx: 618, ty: 334, tr: 44 }, /* compañero en el suelo */
    { px: 118, tx: 92, ty: 105, tr: 34 }, /* señal de salida */
    { px: 735, tx: 738, ty: 158, tr: 36 }, /* caja fuerte */
    { px: 172, tx: 166, ty: 214, tr: 24 }, /* panel de la puerta */
    { px: 92, tx: 92, ty: 210, tr: 62 }, /* la puerta */
  ];
  function escScene() {
    let s = '<svg class="esc-svg" viewBox="0 0 800 400" role="img" aria-label="El CPD: racks, el SAI ardiendo, la puerta con ocho candados">';
    s += '<defs><linearGradient id="escSmoke" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3640" stop-opacity=".95"/><stop offset="1" stop-color="#5b5560" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="escBeam" cx="0" cy="0.5" r="1"><stop offset="0" stop-color="#ff2b1a" stop-opacity=".55"/><stop offset="1" stop-color="#ff2b1a" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="escGlow"><stop offset="0" stop-color="#ffb02e" stop-opacity=".55"/><stop offset="1" stop-color="#ffb02e" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="escExit" x1="0" x2="1"><stop offset="0" stop-color="#7dffb0" stop-opacity=".9"/><stop offset="1" stop-color="#7dffb0" stop-opacity="0"/></linearGradient></defs>';
    /* sala */
    s += '<rect width="800" height="300" class="e-wall"/><rect y="300" width="800" height="100" class="e-floor"/>';
    for (let x = 0; x <= 800; x += 50) s += `<path d="M${x} 300 L${400 + (x - 400) * 1.6} 400" class="e-tile"/>`;
    s += '<path d="M0 330H800M0 362H800" class="e-tile"/><rect y="296" width="800" height="6" class="e-skirt"/>';
    /* ventana con la calle (sirenas al llamar al 112) */
    s += '<g class="e-window"><rect x="690" y="34" width="92" height="62" class="e-win"/><rect x="690" y="34" width="92" height="62" class="e-siren"/><path d="M736 34v62M690 65h92" class="e-frame"/></g>';
    /* puerta de salida con ocho candados */
    s += '<rect x="44" y="96" width="96" height="18" rx="2" class="e-exit"/><rect x="40" y="92" width="104" height="26" rx="4" class="e-exitglow"/><text x="92" y="109" class="e-exit-t">SALIDA</text>';
    s += '<rect x="34" y="118" width="116" height="182" class="e-doorframe"/><rect x="40" y="124" width="104" height="176" class="e-doorway"/><rect x="40" y="124" width="104" height="176" class="e-exitlight"/>';
    s += '<g class="e-door"><rect x="40" y="124" width="104" height="176" class="e-doorleaf"/><rect x="52" y="138" width="80" height="60" class="e-doorpanel"/><rect x="118" y="214" width="18" height="6" rx="3" class="e-handle"/>';
    for (let i = 0; i < 8; i++) s += `<g class="e-pad" data-pad="${i}" transform="translate(${56 + (i % 4) * 24} ${232 + Math.floor(i / 4) * 30})"><path d="M-6 0v-6a6 6 0 0 1 12 0v6" class="e-shackle"/><rect x="-8" y="0" width="16" height="13" rx="2" class="e-padbody"/></g>`;
    s += '</g>';
    /* teclado de la puerta */
    s += '<g class="e-keypad"><rect x="156" y="196" width="22" height="36" rx="2" class="e-kp"/>';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) s += `<rect x="${160 + c * 8}" y="${208 + r * 7}" width="5" height="4" class="e-key"/>`;
    s += '<circle cx="167" cy="202" r="2.6" class="e-kpled"/></g>';
    /* caja del extintor */
    /* señal de extintor (lucha contra incendios: cuadrado rojo, dibujo blanco) y su armario */
    s += '<g class="e-cabinet"><rect x="200" y="126" width="24" height="20" rx="2" class="e-sign"/><rect x="209" y="131" width="6" height="12" rx="2.5" class="e-sign-p"/><rect x="210" y="129" width="4" height="3" class="e-sign-p"/><path d="M214 131q5 0 5 5" class="e-sign-h"/>' +
      '<rect x="190" y="150" width="44" height="94" rx="3" class="e-cab"/><rect x="196" y="156" width="32" height="82" rx="2" class="e-glass"/>' +
      '<g class="e-ext-in"><rect x="205" y="172" width="14" height="56" rx="6" class="e-ext"/><rect x="208" y="165" width="8" height="8" class="e-exthead"/><path d="M216 168q9 2 7 16" class="e-hose"/><rect x="205" y="196" width="14" height="10" class="e-label"/></g></g>';
    /* racks */
    for (let r = 0; r < 3; r++) {
      const x = 270 + r * 66;
      s += `<rect x="${x}" y="92" width="58" height="208" class="e-rack"/>`;
      for (let u = 0; u < 12; u++) {
        s += `<rect x="${x + 5}" y="${100 + u * 16}" width="48" height="12" class="e-unit"/>`;
        s += `<rect x="${x + 42}" y="${104 + u * 16}" width="4" height="4" class="e-led" style="animation-delay:-${((r * 12 + u) * 0.37) % 1.9}s"/>`;
        s += `<rect x="${x + 34}" y="${104 + u * 16}" width="4" height="4" class="e-led g" style="animation-delay:-${((r * 7 + u) * 0.53) % 2.3}s"/>`;
      }
    }
    /* SAI en llamas */
    s += '<g class="e-ups"><rect x="490" y="226" width="78" height="74" class="e-upsbox"/><rect x="498" y="236" width="30" height="12" class="e-upslcd"/><circle cx="555" cy="242" r="3" class="e-upsled"/><text x="529" y="290" class="e-tiny d">SAI</text></g>';
    s += '<g class="e-smokepuffs">' + [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${512 + (i % 3) * 16}" cy="226" r="${12 + (i % 2) * 6}" class="e-puff" style="animation-delay:-${i * 0.55}s"/>`).join('') + '</g>';
    s += '<g class="e-fire"><ellipse cx="529" cy="222" rx="70" ry="40" fill="url(#escGlow)" class="e-glow"/>' +
      '<path d="M500 228c-6-22 8-30 6-48 12 10 16 22 14 34 4-8 4-16 2-24 12 12 18 26 12 38Z" class="e-flame f1"/>' +
      '<path d="M516 228c-8-28 10-40 8-62 14 14 20 30 16 46 6-8 8-18 6-28 12 16 16 32 6 44Z" class="e-flame f2"/>' +
      '<path d="M532 228c-4-18 8-26 8-40 10 10 14 22 10 32 5-5 6-12 6-18 8 12 10 20 2 26Z" class="e-flame f3"/>' +
      '<path d="M512 228c-2-12 6-18 6-28 8 8 10 18 6 28Z M532 228c-2-10 6-16 6-24 6 8 8 16 4 24Z" class="e-flame core"/></g>';
    /* focos de propagación */
    s += '<g class="e-spread">' + ESC_SPREAD.map((f, i) => `<g class="e-spot${f.big ? ' big' : ''}" data-spot="${i}" transform="translate(${f.x} ${f.y}) scale(${f.s})"><g class="e-spot-in"><ellipse cx="0" cy="-8" rx="40" ry="22" fill="url(#escGlow)" class="e-glow"/><path d="M-22 0c-5-16 6-22 5-36 9 8 12 17 10 26 3-6 3-12 2-18 9 9 13 20 9 28Z" class="e-flame f1"/><path d="M-8 0c-6-21 8-30 6-46 10 10 15 22 12 34 4-6 6-13 4-21 9 12 12 24 5 33Z" class="e-flame f2"/><path d="M-4 0c-2-9 4-14 4-21 6 6 8 13 4 21Z" class="e-flame core"/></g></g>`).join('') + '</g>';
    /* resplandor naranja que crece con el fuego */
    s += '<rect width="800" height="400" class="e-heat"/>';
    /* nube de CO2 al usar el extintor */
    s += '<g class="e-co2">' + [0, 1, 2, 3, 4].map((i) => `<circle cx="${470 + i * 14}" cy="${214 - (i % 2) * 12}" r="${14 + i * 3}" class="e-cloud" style="animation-delay:${i * 0.12}s"/>`).join('') + '<rect x="456" y="257" width="14" height="42" rx="6" class="e-ext held"/><rect x="459" y="250" width="8" height="8" class="e-exthead"/><path d="M466 253q12-6 20-20" class="e-hose"/></g>';
    /* cuadro eléctrico */
    s += '<g class="e-panel"><rect x="602" y="112" width="60" height="88" class="e-pbox"/><path d="M632 124l-7 14h7l-6 14 12-18h-7l5-10Z" class="e-bolt"/><rect x="624" y="160" width="16" height="30" class="e-slot"/><rect x="626" y="162" width="12" height="12" class="e-lever"/></g>';
    /* caja fuerte del plan de emergencia */
    s += '<g class="e-safe"><rect x="708" y="128" width="62" height="58" class="e-safebox"/><rect x="714" y="134" width="50" height="46" class="e-safein"/><text x="739" y="164" class="e-key-g">🗝</text><g class="e-safedoor"><rect x="714" y="134" width="50" height="46" class="e-safefront"/><circle cx="739" cy="157" r="9" class="e-dial"/><path d="M739 150v7" class="e-dialmark"/></g></g>';
    /* el compañero que se ha desmayado */
    s += '<g class="e-mate"><g class="e-mate-down"><circle cx="652" cy="338" r="8" class="e-head"/><path d="M644 338H596M628 338l-10 -10M628 338l-10 10M600 338l-14-6M600 338l-14 6" class="e-body"/></g><g class="e-mate-up"><circle cx="640" cy="300" r="8" class="e-head"/><path d="M640 308v20l-22 6M640 318l-12 10M640 328l18 6" class="e-body"/><text x="660" y="292" class="e-ok">¡Uf!</text></g></g>';
    /* mesa y teléfono */
    s += '<rect x="676" y="248" width="112" height="8" class="e-desk"/><path d="M684 256v44M780 256v44" class="e-deskleg"/><g class="e-phone"><rect x="712" y="234" width="30" height="14" rx="3" class="e-tel"/><path d="M710 234q17-12 34 0" class="e-handset"/></g>';
    s += '<g class="e-call"><rect x="690" y="196" width="70" height="26" rx="4" class="e-bubble"/><path d="M712 222l6 8 4-8Z" class="e-bubble"/><text x="725" y="214" class="e-call-t">112 ☎</text></g>';
    /* baliza de emergencia */
    s += '<g class="e-beacon"><g class="e-beam"><path d="M400 22 L780 -40 L780 90Z" fill="url(#escBeam)"/><path d="M400 22 L20 -40 L20 90Z" fill="url(#escBeam)"/></g><rect x="388" y="4" width="24" height="10" class="e-bbase"/><path d="M390 14a10 10 0 0 1 20 0v8h-20Z" class="e-bdome"/></g>';
    /* oscuridad al cortar la corriente y humo del techo */
    s += '<rect width="800" height="400" class="e-dark"/>';
    s += '<rect width="800" height="300" fill="url(#escSmoke)" class="e-smoke"/>';
    /* extinción automática por gas: boquillas en el techo (en un CPD no se apaga con agua) */
    const NOZ = [170, 340, 520, 690];
    s += '<g class="e-gas"><rect width="800" height="400" class="e-fog"/>' +
      NOZ.map((x, n) => [0, 1, 2, 3, 4].map((k) => `<circle cx="${x + (k - 2) * 9}" cy="16" r="${16 + k * 3}" class="e-gc" style="animation-delay:${n * 0.12 + k * 0.18}s"/>`).join('')).join('') +
      '</g>';
    s += '<g class="e-nozzles">' + NOZ.map((x) => `<g><rect x="${x - 4}" y="0" width="8" height="10" class="e-noz"/><path d="M${x - 9} 10h18l-4 6h-10Z" class="e-noz"/></g>`).join('') + '</g>';
    /* objetivo actual */
    s += '<circle class="e-target" r="40" cx="0" cy="0"/>';
    /* el personaje (tú) */
    s += '<g class="e-me"><g class="e-me-in"><circle cx="0" cy="-74" r="9" class="e-head"/><path d="M-9 -78q9-12 18 0Z" class="e-helmet"/><path d="M0 -64v30M0 -56l-12 14M0 -56l12 14M0 -34l-9 28M0 -34l9 28" class="e-body"/></g></g>';
    s += '<text x="400" y="200" class="e-big" id="escBig"></text>';
    return s + '</svg>';
  }

  GAMES.escape = {
    title: 'Escape room: el CPD cerrado',
    icon: '🔐',
    tag: 'Cuenta atrás de 2:30 para salir del CPD en llamas',
    mount(root, api) {
      let k = 0;
      let hints = 0;
      let errs = 0;
      let endAt = 0;
      let timer = null;
      let showHint = false;
      let state = 'intro'; /* intro · play · win · lose */
      const best = () => api.store.get('best', null);
      root.innerHTML =
        '<div class="esc-play"><div class="esc-stage"><div class="esc-top"><div class="esc-clock" id="escClock" aria-live="off"><span id="escT">2:30</span><small>hasta que el fuego llene la sala</small><b class="esc-pen" id="escPen"></b></div>' +
        `<div class="esc-locks" id="escLocks" aria-label="Candados">${CANDADOS.map((x, i) => `<i data-l="${i}" title="${esc(x.t)}">🔒</i>`).join('')}</div></div>` +
        `${escScene()}</div><div id="escPanel"></div></div>`;
      const svg = root.querySelector('.esc-svg');
      const panel = root.querySelector('#escPanel');
      const remaining = () => Math.max(0, (endAt - Date.now()) / 1000);
      /* que todo quepa sin scroll: la escena se queda con el alto libre de la ventana */
      function fit() {
        if (!root.isConnected) return;
        const top = svg.getBoundingClientRect().top + (document.getElementById('stage').scrollTop || 0) + window.scrollY;
        const free = window.innerHeight - top - panel.offsetHeight - 30;
        const maxByWidth = svg.parentNode.clientWidth / 2;
        let h = Math.round(Math.max(150, Math.min(free, maxByWidth)));
        const set = () => {
          svg.style.height = h + 'px';
          svg.style.width = h * 2 + 'px';
          svg.style.maxWidth = '100%';
        };
        set();
        /* lo que aún sobre por márgenes del diseño se le quita a la escena */
        const st = document.getElementById('stage');
        const over = Math.max(st.scrollHeight - st.clientHeight, document.documentElement.scrollHeight - window.innerHeight);
        if (over > 0 && h > 150) {
          h = Math.max(150, h - over - 2);
          set();
        }
      }
      window.addEventListener('resize', fit);
      const fmt = (t) => {
        const s = Math.ceil(t);
        return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      };
      function sync() {
        /* clases de estado según los candados abiertos */
        svg.classList.toggle('playing', state === 'play');
        svg.classList.toggle('fire-out', k >= 1);
        svg.classList.toggle('no-power', k >= 2);
        svg.classList.toggle('called', k >= 3);
        svg.classList.toggle('mate-ok', k >= 4);
        svg.classList.toggle('sign-on', k >= 5);
        svg.classList.toggle('safe-open', k >= 6);
        svg.classList.toggle('door-ok', k >= 7);
        svg.classList.toggle('door-open', k >= 8);
        svg.classList.toggle('lost', state === 'lose');
        svg.classList.toggle('gas', state === 'win');
        svg.querySelectorAll('.e-pad').forEach((p, i) => p.classList.toggle('open', i < k));
        root.querySelectorAll('#escLocks i').forEach((x, i) => {
          x.textContent = i < k ? '🔓' : '🔒';
          x.className = i < k ? 'open' : i === k && state === 'play' ? 'now' : '';
        });
        const spot = ESC_SPOT[Math.min(k, ESC_SPOT.length - 1)];
        const me = svg.querySelector('.e-me');
        const px = state === 'intro' ? 420 : k >= CANDADOS.length ? 70 : spot.px;
        me.style.transform = `translate(${px}px, 330px)`;
        me.classList.toggle('gone', k >= CANDADOS.length);
        const tg = svg.querySelector('.e-target');
        tg.setAttribute('cx', spot.tx);
        tg.setAttribute('cy', spot.ty);
        tg.setAttribute('r', spot.tr);
        tg.classList.toggle('on', state === 'play' && k < CANDADOS.length);
        tick();
      }
      function tick() {
        const t = state === 'play' ? remaining() : state === 'intro' ? ESC_TOTAL : remaining();
        const frac = 1 - t / ESC_TOTAL; /* 0 al empezar, 1 sin tiempo */
        const fire = state === 'intro' ? 0.55 : 0.7 + frac * 0.9;
        const smoke = state === 'lose' ? 1 : (k >= 1 ? 0.8 : 1) * (0.12 + frac * 0.9);
        svg.style.setProperty('--fire', fire.toFixed(3));
        svg.style.setProperty('--smoke', smoke.toFixed(3));
        svg.style.setProperty('--smokeh', (0.25 + frac * 0.75).toFixed(3));
        svg.style.setProperty('--heat', state === 'intro' ? 0 : (frac * 0.35).toFixed(3));
        svg.style.setProperty('--grow', (0.6 + frac * 1.5).toFixed(3));
        svg.querySelectorAll('.e-spot').forEach((g, i) => g.classList.toggle('on', state !== 'intro' && frac >= ESC_SPREAD[i].at)); /* al ganar siguen encendidas: las apaga el gas */
        root.querySelector('#escT').textContent = fmt(t);
        const clock = root.querySelector('#escClock');
        clock.classList.toggle('panic', state === 'play' && t <= 30);
        clock.classList.toggle('warn', state === 'play' && t <= 75 && t > 30);
        if (state === 'play' && t <= 0) lose();
      }
      function penalty(sec, why) {
        endAt -= sec * 1000;
        const p = root.querySelector('#escPen');
        p.textContent = `−${sec} s`;
        p.title = why;
        p.classList.remove('show');
        void p.offsetWidth;
        p.classList.add('show');
        tick();
      }
      function start() {
        k = 0;
        hints = 0;
        errs = 0;
        showHint = false;
        state = 'play';
        endAt = Date.now() + ESC_TOTAL * 1000;
        clearInterval(timer);
        timer = setInterval(tick, 250);
        svg.querySelector('#escBig').textContent = '';
        sync();
        drawPanel();
        api.say('¡Cuenta atrás en marcha! Cada fallo resta 15 s y cada pista 30 s.', '');
      }
      function lose() {
        state = 'lose';
        clearInterval(timer);
        sync();
        setTimeout(() => {
          if (state === 'lose') svg.querySelector('#escBig').textContent = 'HAS MUERTO';
        }, 1100);
        panel.innerHTML = `<div class="finish fail esc-dead"><div class="big">☠️</div><div><b>Has muerto: el humo te ha intoxicado</b><p>En los incendios, la mayoría de las muertes las causa el humo, no las llamas. En la vida real: sal agachado (el aire limpio está abajo), toca las puertas antes de abrirlas, ciérralas al salir, nunca uses el ascensor y ve al punto de encuentro. Has abierto ${k} de ${CANDADOS.length} candados.</p><button type="button" class="btn primary" data-start>↻ Intentarlo otra vez</button></div></div>`;
        fit();
        api.say('Se acabó el tiempo… Repasa y vuelve a intentarlo.', 'oops');
      }
      function win() {
        state = 'win';
        clearInterval(timer);
        const left = remaining();
        sync();
        const score = Math.min(100, Math.round(40 + left)); /* 100 % con 1:00 o más de margen */
        const b = best();
        if (b == null || left > b) api.store.set('best', Math.round(left));
        api.award('escape');
        api.done(score, '¡Has sobrevivido! El sistema de extinción por gas apagó el fuego y todos estáis en el punto de encuentro.');
        setTimeout(() => {
          if (state === 'win') svg.querySelector('#escBig').textContent = '¡HAS SOBREVIVIDO!';
        }, 1900);
        panel.innerHTML = `<div class="finish"><div class="big">🔓</div><div><b>¡Has sobrevivido! Saliste con ${fmt(left)} de margen.</b><p>Fallos: ${errs} · pistas: ${hints} · nota: ${score} %${b != null ? ` · tu mejor margen: ${fmt(Math.max(b, left))}` : ''}</p><p class="small">💨 En un CPD el fuego no se apaga con agua, que destrozaría los equipos y conduce la electricidad: un sistema de extinción automática por gas inunda la sala desde el techo. Antes de dispararse suena una alarma, y hay que salir: la sala debe quedar vacía.</p><p class="small">La nota depende del tiempo que te sobra: con 1:00 o más, 100 %.</p><button type="button" class="btn primary" data-start>Volver a jugar</button></div></div>`;
        fit();
      }
      function drawPanel() {
        const c = CANDADOS[k];
        panel.innerHTML =
          `<div class="esc-room"><h3><small class="esc-n">Candado ${k + 1}/${CANDADOS.length}</small> ${esc(c.t)}</h3><p>${esc(c.story)}</p>` +
          `<div class="esc-ask"><label for="escIn">${esc(c.q)}</label><div class="esc-row"><input type="text" id="escIn" autocomplete="off" spellcheck="false" autocapitalize="off"><button type="button" class="btn primary" data-try>Probar</button><button type="button" class="btn" data-hint${showHint ? ' disabled' : ''}>Pista (−${ESC_PISTA} s)</button></div></div>` +
          `${showHint ? `<p class="fb">💡 ${esc(c.hint)}</p>` : ''}<p class="fb bad" id="escMsg" hidden></p></div>`;
        fit();
        const inp = panel.querySelector('#escIn');
        if (inp && !window.matchMedia('(max-width: 900px)').matches) inp.focus();
      }
      function tryIt() {
        if (state !== 'play') return;
        const inp = panel.querySelector('#escIn');
        const v = inp.value;
        if (!v.trim()) return inp.focus();
        if (CANDADOS[k].a(v)) {
          k++;
          showHint = false;
          if (k >= CANDADOS.length) return win();
          sync();
          drawPanel();
          api.say(['¡SAI apagado con CO₂! Pero el fuego sigue por los cables: corta la corriente, rápido.', '¡Corriente cortada! Solo queda la luz de emergencia.', '¡Ayuda en camino! Pero tu compañero se ha desplomado…', '¡Respira! Tu compañero vuelve en sí.', '¡La señal de salida se enciende! Ya ves la puerta.', '¡La llave de la salida! Ahora el panel de la puerta.', '¡Panel en verde! Último candado.'][k - 1], 'happy');
        } else {
          errs++;
          penalty(ESC_FALLO, 'Fallo');
          const m = panel.querySelector('#escMsg');
          m.hidden = false;
          m.textContent = `✗ No se abre. −${ESC_FALLO} s. Piensa en lo que has visto en las fichas.`;
          fit();
          inp.select();
          api.say('¡Nada! El humo sigue bajando…', 'oops');
        }
      }
      root.addEventListener('click', (e) => {
        if (e.target.closest('[data-start]')) return start();
        if (e.target.closest('[data-try]')) return tryIt();
        if (e.target.closest('[data-hint]') && !showHint && state === 'play') {
          hints++;
          showHint = true;
          penalty(ESC_PISTA, 'Pista');
          drawPanel();
        }
      });
      root.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.id === 'escIn') tryIt();
      });
      api.onLeave(() => {
        clearInterval(timer);
        window.removeEventListener('resize', fit);
      });
      sync();
      panel.innerHTML = `<div class="esc-intro"><p class="lead">Viernes, 21:00. Has ido al CPD a revisar una alarma y la puerta se ha cerrado detrás de ti. El SAI empieza a arder. Tienes <b>2:30</b> antes de que el humo y las llamas llenen la sala: abre los ocho candados con lo que has aprendido.</p><p class="small">Cada fallo resta ${ESC_FALLO} s y cada pista ${ESC_PISTA} s.${best() != null ? ` Tu mejor margen: ${fmt(best())}.` : ''}</p><button type="button" class="btn primary big" data-start>▶ Empezar la cuenta atrás</button></div>`;
      requestAnimationFrame(fit);
      setTimeout(fit, 300);
      api.say('El examen final, en forma de escape room. ¿Te atreves?', '');
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
