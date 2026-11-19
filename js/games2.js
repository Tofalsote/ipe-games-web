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
          L.who.map((w) => `<tr><th>${w}</th>${state.cells[w].map((c, i) => `<td><input type="text" value="${esc(c)}" data-w="${w}" data-d="${i}" aria-label="${w}, ${DIAS_L[i]}" spellcheck="false" autocomplete="off"></td>`).join('')}<td class="tot" data-tot="${w}"></td><td><label class="chk"><input type="checkbox" data-p="${w}"${state.pausa[w] ? ' checked' : ''}> 15 min</label></td></tr>`).join('') +
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
        root.querySelector('#cqOut').innerHTML = ok ? '<p class="fb ok">✓ Todo legal y cubierto. ¡Puedes pasar de nivel!</p>' : `<ul class="viol">${allV.map((x) => `<li>${x}</li>`).join('')}${ev.uncovered.map((i) => `<li><b>Cobertura</b>: el ${DIAS_L[i].toLowerCase()} queda alguna hora sin cubrir.</li>`).join('')}</ul>`;
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
    { t: 'Caja fuerte del plan de emergencia', story: 'La caja con la llave de la salida de emergencia se abre con: días naturales mínimos de vacaciones + días de permiso por matrimonio.', q: 'Suma de las dos cifras.', a: (v) => v.trim() === '45', hint: 'Vacaciones: 30 días naturales. Matrimonio: 15 días naturales.', sol: '45' },
    { t: 'Panel de la puerta', story: 'La puerta pregunta por el nivel de un riesgo con probabilidad alta y consecuencias extremadamente dañinas, el que obliga a parar el trabajo de inmediato.', q: 'Escribe el nivel de riesgo.', a: (v) => /^intolerable$/i.test(v.trim()), hint: 'Es el peor nivel de la matriz del INSST.', sol: 'Intolerable' },
    { t: 'La salida', story: 'Último candado: tres letras con el orden de actuación ante un accidente. Fuera te espera el punto de encuentro.', q: 'Las tres iniciales, en orden.', a: (v) => /^p\.?\s*a\.?\s*s\.?$/i.test(v.trim()), hint: 'Proteger, Avisar, Socorrer.', sol: 'PAS' },
  ];
  GAMES.escape = {
    title: 'Escape room: el CPD cerrado',
    icon: '🔐',
    tag: 'Todo lo aprendido para salir de la sala',
    mount(root, api) {
      let k;
      let hints;
      let errs;
      let t0;
      let timer;
      let showHint;
      function start() {
        k = 0;
        hints = 0;
        errs = 0;
        showHint = false;
        t0 = Date.now();
        clearInterval(timer);
        timer = setInterval(tick, 1000);
        draw();
        api.say('¡Estás encerrado en el CPD! Resuelve los candados para salir.', '');
      }
      function tick() {
        const el = root.querySelector('#escT');
        if (!el) return;
        const s = Math.floor((Date.now() - t0) / 1000);
        el.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      }
      function draw() {
        if (k >= CANDADOS.length) {
          clearInterval(timer);
          const s = Math.floor((Date.now() - t0) / 1000);
          const score = Math.max(30, 100 - hints * 10 - errs * 5);
          api.award('escape');
          api.done(score, '¡Fuera del CPD! Y con todos a salvo en el punto de encuentro.');
          root.innerHTML = `<div class="finish"><div class="big">🔓</div><div><b>¡Has escapado!</b><p>Tiempo: ${Math.floor(s / 60)} min ${s % 60} s · pistas: ${hints} · fallos: ${errs} · nota: ${score} %</p><button type="button" class="btn primary" data-start>Volver a jugar</button></div></div>`;
          return;
        }
        const c = CANDADOS[k];
        root.innerHTML =
          `<div class="esc-hud"><span>Candado <b>${k + 1}</b> de ${CANDADOS.length}</span><span>⏱ <b id="escT">0:00</b></span><span>Pistas: ${hints}</span></div>` +
          `<div class="esc-locks">${CANDADOS.map((x, i) => `<i class="${i < k ? 'open' : i === k ? 'now' : ''}">${i < k ? '🔓' : '🔒'}</i>`).join('')}</div>` +
          `<div class="esc-room"><h3>${esc(c.t)}</h3><p>${esc(c.story)}</p><label class="esc-in"><span>${esc(c.q)}</span><input type="text" id="escIn" autocomplete="off" spellcheck="false"></label>` +
          `<div class="row-btns"><button type="button" class="btn primary" data-try>Probar</button><button type="button" class="btn" data-hint>Pista (−10)</button></div>${showHint ? `<p class="fb">💡 ${esc(c.hint)}</p>` : ''}<p class="fb bad" id="escMsg" hidden></p></div>`;
        tick();
        const inp = root.querySelector('#escIn');
        if (inp) inp.focus();
      }
      function tryIt() {
        const v = root.querySelector('#escIn').value;
        if (CANDADOS[k].a(v)) {
          k++;
          showHint = false;
          api.say(k < CANDADOS.length ? '¡Clic! Candado abierto.' : '¡La puerta se abre!', 'happy');
          draw();
        } else {
          errs++;
          const m = root.querySelector('#escMsg');
          m.hidden = false;
          m.textContent = '✗ No se abre. Piensa en lo que has visto en las fichas.';
          api.say('Nada. Prueba otra vez o pide una pista.', 'oops');
        }
      }
      root.addEventListener('click', (e) => {
        if (e.target.closest('[data-start]')) return start();
        if (e.target.closest('[data-try]')) return tryIt();
        if (e.target.closest('[data-hint]') && !showHint) {
          hints++;
          showHint = true;
          draw();
        }
      });
      root.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.id === 'escIn') tryIt();
      });
      api.onLeave(() => clearInterval(timer));
      root.innerHTML = '<div class="esc-intro"><p class="lead">Viernes, 21:00. Has ido al CPD a revisar una alarma y la puerta se ha cerrado detrás de ti. El SAI empieza a echar humo. Para salir tendrás que usar todo lo que has aprendido: prevención, emergencias y derechos laborales.</p><button type="button" class="btn primary big" data-start>▶ Empezar</button></div>';
      api.say('El examen final, en forma de escape room. ¿Te atreves?', '');
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
