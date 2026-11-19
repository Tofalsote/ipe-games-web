/* Juegos de las unidades 1 a 4: Brújula profesional, Inspector PRL, Matriz de riesgos y Emergencia (PAS). */
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

  /* =====================================================================
     1 · BRÚJULA PROFESIONAL: qué perfil IT encaja contigo
     ===================================================================== */
  const PERFILES = {
    sis: { n: 'Administración de sistemas', d: 'Servidores Linux y Windows, virtualización, copias de seguridad, automatizar con scripts.', puestos: 'Técnico de sistemas, administrador de servidores', cert: 'LPIC-1, Microsoft Azure Administrator, RHCSA', mod: 'Implantación de sistemas operativos, Administración de sistemas operativos' },
    red: { n: 'Redes y comunicaciones', d: 'Diseñar y mantener redes: routers, switches, VLAN, wifi, VPN, monitorización.', puestos: 'Técnico de redes, administrador de redes, NOC', cert: 'CCNA, CompTIA Network+', mod: 'Planificación y administración de redes, Servicios de red e Internet' },
    seg: { n: 'Ciberseguridad', d: 'Proteger sistemas: cortafuegos, permisos, vulnerabilidades, respuesta a incidentes.', puestos: 'Analista SOC, técnico de seguridad, pentester junior', cert: 'CompTIA Security+, eJPT, CCNA Security', mod: 'Seguridad y alta disponibilidad (y el curso de especialización en ciberseguridad)' },
    sop: { n: 'Soporte y atención al usuario', d: 'Resolver incidencias, ayudar a personas, documentar, gestionar tickets.', puestos: 'Técnico de soporte / helpdesk, técnico de campo', cert: 'CompTIA A+, ITIL Foundation', mod: 'Fundamentos de hardware, todos los de sistemas' },
    cld: { n: 'Cloud y DevOps', d: 'Infraestructura en la nube, contenedores, automatización y despliegues.', puestos: 'Técnico cloud, DevOps junior', cert: 'AWS Cloud Practitioner, Azure AZ-900, Docker / Kubernetes', mod: 'Administración de sistemas operativos, Implantación de aplicaciones web' },
    dat: { n: 'Bases de datos y web', d: 'Diseñar y administrar bases de datos y servicios web.', puestos: 'Administrador de bases de datos, técnico de entornos web', cert: 'Oracle, MySQL, certificaciones de PostgreSQL', mod: 'Gestión de bases de datos, Administración de sistemas gestores de bases de datos, Lenguajes de marcas' },
  };
  const PREG = [
    ['Me gusta montar y configurar servidores, dejarlos finos y automatizados.', { sis: 2, cld: 1 }],
    ['Disfruto entendiendo por dónde viaja un paquete y por qué no llega.', { red: 2, seg: 1 }],
    ['Me engancha buscar fallos de seguridad y pensar como un atacante.', { seg: 2 }],
    ['Me gusta ayudar a la gente y explicar cosas técnicas con calma.', { sop: 2 }],
    ['Prefiero escribir un script antes que repetir la misma tarea dos veces.', { cld: 2, sis: 1 }],
    ['Organizar datos y hacer consultas que respondan preguntas me parece interesante.', { dat: 2 }],
    ['Me veo trabajando en un CPD, entre racks y cables.', { red: 1, sis: 1 }],
    ['Me interesan los servicios en la nube (AWS, Azure) y los contenedores.', { cld: 2 }],
    ['Me gusta que cada día sea distinto, aunque haya urgencias.', { sop: 1, seg: 1 }],
    ['Me siento cómodo leyendo registros (logs) para encontrar qué ha pasado.', { seg: 1, sis: 1 }],
    ['Me gusta crear páginas o aplicaciones web y que funcionen rápido.', { dat: 1, cld: 1 }],
    ['Configurar routers y switches en Packet Tracer me resulta entretenido.', { red: 2 }],
  ];
  GAMES.brujula = {
    title: 'Brújula profesional',
    icon: '🧭',
    tag: 'Descubre qué perfil IT encaja contigo',
    mount(root, api) {
      const ans = api.store.get('ans', Array(PREG.length).fill(0));
      function render(showRes) {
        let h =
          '<p class="lead">Valora cada frase del 1 (nada que ver conmigo) al 5 (soy yo). No hay respuestas buenas ni malas: es autoconocimiento, una parte del módulo.</p><ol class="likert">' +
          PREG.map(
            ([t], i) =>
              `<li><p>${esc(t)}</p><div class="scale" role="radiogroup" aria-label="${esc(t)}">${[1, 2, 3, 4, 5].map((v) => `<button type="button" class="sc${ans[i] === v ? ' on' : ''}" data-i="${i}" data-v="${v}" aria-pressed="${ans[i] === v}">${v}</button>`).join('')}</div></li>`
          ).join('') +
          '</ol>';
        const left = ans.filter((v) => !v).length;
        h += `<div class="row-btns"><button type="button" class="btn primary" id="brRes"${left ? ' disabled' : ''}>Ver mi brújula →</button>${left ? `<small>Te faltan ${left}.</small>` : ''}</div><div id="brOut"></div>`;
        root.innerHTML = h;
        if (showRes) result();
      }
      function result() {
        const sc = {};
        const max = {};
        for (const k of Object.keys(PERFILES)) sc[k] = max[k] = 0;
        PREG.forEach(([, w], i) => {
          for (const k of Object.keys(w)) {
            sc[k] += w[k] * (ans[i] - 1);
            max[k] += w[k] * 4;
          }
        });
        const list = Object.keys(PERFILES)
          .map((k) => ({ k, p: Math.round((sc[k] / max[k]) * 100) }))
          .sort((a, b) => b.p - a.p);
        const top = PERFILES[list[0].k];
        $('#brOut').innerHTML =
          '<h3 class="h3">Tu brújula</h3><div class="bars">' +
          list.map((x) => `<div class="barrow"><span>${esc(PERFILES[x.k].n)}</span><i class="bar"><i style="width:${x.p}%"></i></i><b>${x.p}%</b></div>`).join('') +
          `</div><div class="finish"><div class="big">🧭</div><div><b>${esc(top.n)}</b><p>${esc(top.d)}</p><p><b>Puestos:</b> ${esc(top.puestos)}<br><b>Certificaciones:</b> ${esc(top.cert)}<br><b>Módulos del ciclo que más te van a gustar:</b> ${esc(top.mod)}</p>` +
          '<p class="note">Úsalo en tu DAFO (unidad 10): tus intereses son una fortaleza si los conviertes en objetivos.</p></div></div>';
        api.store.set('top', list[0].k);
        api.award('brujula');
        api.done(100, `Tu perfil más fuerte: ${top.n}. Anótalo para la unidad 10.`);
      }
      function $(s) {
        return root.querySelector(s);
      }
      root.addEventListener('click', (e) => {
        const b = e.target.closest('.sc');
        if (b) {
          ans[+b.dataset.i] = +b.dataset.v;
          api.store.set('ans', ans);
          for (const x of root.querySelectorAll(`.sc[data-i="${b.dataset.i}"]`)) {
            x.classList.toggle('on', x === b);
            x.setAttribute('aria-pressed', x === b);
          }
          const left = ans.filter((v) => !v).length;
          $('#brRes').disabled = !!left;
          return;
        }
        if (e.target.id === 'brRes') result();
      });
      render(false);
      api.say('Contesta con sinceridad: así sabrás hacia dónde orientar tus prácticas y certificaciones.', '');
    },
  };

  /* =====================================================================
     2 · INSPECTOR PRL: caza los riesgos en escenas ilustradas
     ===================================================================== */
  const TIPOS = { seguridad: 'Seguridad', higienico: 'Higiénico (medioambiental)', ergonomico: 'Ergonómico', psicosocial: 'Psicosocial' };
  const VAGA = (x) => ({ t: x || 'Tener más cuidado y prestar atención', ok: false, why: '«Tener cuidado» no es una medida: no elimina ni reduce el peligro.' });
  /* piezas de dibujo reutilizables */
  const P = {
    person(x, y, o) {
      o = o || {};
      const c = o.c || '#2d5be3';
      return `<g class="ppl"><circle cx="${x}" cy="${y - 62}" r="11" class="skin"/><path d="M${x} ${y - 50}v32" style="stroke:${c}" class="limb"/><path d="M${x} ${y - 44}l${o.armL || -16} ${o.armLy || 16}M${x} ${y - 44}l${o.armR || 16} ${o.armRy || 16}" style="stroke:${c}" class="limb"/><path d="M${x} ${y - 18}l-10 18M${x} ${y - 18}l10 18" class="limb leg"/>${o.hat ? `<path d="M${x - 13} ${y - 66}a13 12 0 0 1 26 0z" class="hat-y"/>` : ''}</g>`;
    },
    rack(x, y, h, o) {
      o = o || {};
      let s = `<rect x="${x}" y="${y}" width="90" height="${h}" rx="3" class="rack"/>`;
      for (let k = 0; k < Math.floor((h - 20) / 22); k++) s += `<rect x="${x + 8}" y="${y + 10 + k * 22}" width="74" height="16" rx="1" class="srv"/><circle cx="${x + 74}" cy="${y + 18 + k * 22}" r="2.2" class="${k % 3 ? 'ok-led' : 'act-led'}"/>`;
      if (o.open) s += `<path d="M${x + 90} ${y}l34 14v${h - 28}l-34 14z" class="rack-door"/>`;
      return s;
    },
    box(x, y, w, h) {
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="box"/><path d="M${x} ${y + h / 3}h${w}M${x + w / 2} ${y}v${h / 3}" class="box-l"/>`;
    },
    waves(x, y) {
      return `<path d="M${x} ${y}q10 -14 0 -28M${x + 12} ${y + 6}q16 -20 0 -40M${x + 24} ${y + 12}q22 -26 0 -52" class="waves"/>`;
    },
  };
  const SCENES = [
    {
      id: 'cpd',
      title: 'La sala de servidores (CPD)',
      intro: 'Primer día en el CPD de la empresa. Antes de tocar nada, haz una ronda de inspección.',
      art() {
        let s = '<rect width="800" height="300" class="wall"/><rect y="300" width="800" height="150" class="floor"/>';
        for (let x = 0; x < 800; x += 50) s += `<path d="M${x} 300v150" class="tile"/>`;
        for (let y = 340; y < 450; y += 40) s += `<path d="M0 ${y}h800" class="tile"/>`;
        s += P.rack(60, 50, 250) + P.rack(170, 50, 250, { open: true }) + P.rack(300, 50, 250);
        s += '<path d="M235 260q8 30 -6 46q-10 12 4 22" class="cable-y"/><path d="M233 328l-8 8M233 328l3 10M233 328l9 4" class="spark"/><text x="248" y="338" class="zap">⚡</text>';
        s += '<path d="M345 300c10 30 40 70 120 72s140 -6 200 10" class="cable-b"/><path d="M350 300c14 38 52 82 130 82s130 0 190 16" class="cable-y"/>';
        s += '<rect x="660" y="80" width="120" height="220" rx="4" class="crac"/>';
        for (let k = 0; k < 9; k++) s += `<path d="M672 ${100 + k * 18}h96" class="grill-l"/>`;
        s += '<text x="720" y="296" class="lbl">CLIMA</text>' + P.waves(620, 150);
        s += '<rect x="430" y="110" width="80" height="190" class="door"/><rect x="438" y="88" width="64" height="18" rx="2" class="exit"/><text x="470" y="101" class="exit-t">SALIDA</text>' + P.box(432, 230, 44, 70) + P.box(472, 250, 40, 50) + P.box(442, 196, 36, 34);
        s += '<rect x="18" y="232" width="22" height="60" rx="8" class="ext"/><rect x="22" y="222" width="14" height="12" class="ext-top"/><text x="29" y="270" class="ext-t">AGUA</text>';
        s += P.person(565, 372, { c: '#12804e', armL: 6, armLy: 30, armR: 22, armRy: 26 }) + '<rect x="560" y="378" width="56" height="26" class="srv-box"/><text x="588" y="396" class="lbl-s">30 kg</text>';
        return s;
      },
      hz: [
        { x: 236, y: 320, r: 34, n: 'Cable de alimentación pelado colgando del rack', peligro: 'Partes activas al descubierto en un equipo conectado.', tipos: ['seguridad'], dano: 'Electrocución, quemaduras, incluso la muerte.', med: [{ t: 'Dejar el equipo sin tensión, señalizarlo y que lo sustituya personal cualificado; revisar el cableado periódicamente', ok: true, why: 'Elimina el peligro en el origen y lo hace quien tiene formación y medios.' }, { t: 'Taparlo con cinta aislante y seguir trabajando', ok: false, why: 'Es una «reparación» improvisada sin formación ni medios: el riesgo sigue ahí.' }, VAGA('No tocar el cable y avisar al final del turno')] },
        { x: 500, y: 372, r: 44, n: 'Cables de red y corriente cruzando la zona de paso', peligro: 'Cables sueltos por el suelo, donde se camina.', tipos: ['seguridad'], dano: 'Tropiezos y caídas: contusiones, esguinces, fracturas.', med: [{ t: 'Recoger los cables por bandejas o el falso suelo y usar pasacables; mantener libres las zonas de paso', ok: true, why: 'Elimina el peligro: si el cable no está en el suelo, no se tropieza.' }, VAGA('Mirar al suelo al cruzar la sala'), { t: 'Poner calzado de seguridad a todo el personal', ok: false, why: 'El EPI va al final, y además no evita tropezar.' }] },
        { x: 680, y: 160, r: 50, n: 'Ruido constante de la refrigeración', peligro: 'Ruido de los equipos de climatización y ventiladores.', tipos: ['higienico'], dano: 'Fatiga, dolor de cabeza y, con exposición prolongada, pérdida de audición (hipoacusia).', med: [{ t: 'Medir el ruido; aislar o apantallar los equipos, limitar el tiempo dentro y, si hace falta, usar protectores auditivos', ok: true, why: 'Primero se mide y se actúa en el origen o con medidas colectivas; el EPI auditivo es complementario.' }, { t: 'Subir el volumen de la música para no oírlo', ok: false, why: 'Aumenta la exposición al ruido.' }, VAGA('Acostumbrarse: al final no se nota')] },
        { x: 470, y: 230, r: 48, n: 'Salida de emergencia bloqueada por cajas', peligro: 'Cajas apiladas delante de la puerta de evacuación.', tipos: ['seguridad'], dano: 'En una emergencia no se puede evacuar: atrapamientos, intoxicación por humo.', med: [{ t: 'Retirar las cajas de inmediato y mantener siempre libres y señalizadas las vías y salidas de evacuación', ok: true, why: 'Las salidas deben estar libres siempre: es una obligación, no una opción.' }, VAGA('Recordar que hay otra salida'), { t: 'Poner una señal de «Salida» más grande', ok: false, why: 'La señal no sirve de nada si la puerta está bloqueada.' }] },
        { x: 29, y: 255, r: 32, n: 'Extintor de agua junto a los racks', peligro: 'Medio de extinción inadecuado para equipos con tensión eléctrica.', tipos: ['seguridad'], dano: 'Electrocución al usarlo; el incendio no se apaga y se propaga.', med: [{ t: 'Sustituirlo por extintores de CO₂ adecuados al riesgo eléctrico, señalizados y revisados, y formar al personal', ok: true, why: 'En fuegos con tensión se usa CO₂; además hace falta formación y mantenimiento.' }, VAGA('Usarlo con cuidado si hay fuego'), { t: 'Quitarlo y no poner ninguno', ok: false, why: 'Sin medios de extinción el riesgo de incendio aumenta.' }] },
        { x: 585, y: 345, r: 46, n: 'Levantar solo un servidor de 30 kg para meterlo en el rack', peligro: 'Manipulación manual de una carga pesada con la espalda doblada.', tipos: ['ergonomico'], dano: 'Lumbalgias, hernias discales y otros trastornos musculoesqueléticos.', med: [{ t: 'Usar un elevador o carro de racks, o hacerlo entre dos personas con la espalda recta y la carga pegada al cuerpo; dar formación en manipulación de cargas', ok: true, why: 'Primero medios mecánicos o repartir la carga; después la técnica correcta y la formación.' }, VAGA('Hacerlo rápido para cansarse menos'), { t: 'Ponerse una faja lumbar y hacerlo solo', ok: false, why: 'La faja no sustituye a los medios mecánicos ni a la ayuda de otra persona.' }] },
      ],
    },
    {
      id: 'soporte',
      title: 'La oficina de soporte (helpdesk)',
      intro: 'El equipo de soporte pasa 8 horas delante de pantallas atendiendo incidencias. ¿Qué ves?',
      art() {
        let s = '<rect width="800" height="320" class="wall"/><rect y="320" width="800" height="130" class="floor2"/>';
        s += '<rect x="30" y="40" width="200" height="170" class="win"/><path d="M130 40v170M30 125h200" class="win-l"/><circle cx="80" cy="80" r="18" class="sun"/>';
        s += '<rect x="110" y="250" width="320" height="12" class="desk"/><path d="M120 262v120M420 262v120" class="desk-leg"/>';
        s += P.box(150, 206, 90, 22) + P.box(158, 186, 74, 20);
        s += '<rect x="140" y="100" width="110" height="80" rx="3" class="mon"/><rect x="148" y="108" width="94" height="64" class="scr"/><path d="M150 112l40 0l-30 50z" class="glare"/><rect x="186" y="180" width="18" height="8" class="mon"/>';
        s += '<rect x="268" y="236" width="80" height="12" rx="2" class="kbd"/>';
        s += '<rect x="300" y="300" width="60" height="10" class="chair"/><path d="M330 310v60M310 380h40" class="chair-l"/>';
        s += `<g class="ppl"><circle cx="300" cy="212" r="11" class="skin"/><path d="M302 224q14 34 26 76" class="limb" style="stroke:#d93a24"/><path d="M306 236l-26 6" class="limb" style="stroke:#d93a24"/><path d="M328 300l-30 4l-6 38" class="limb leg"/></g>`;
        s += '<rect x="460" y="60" width="210" height="130" rx="4" class="mon"/><rect x="470" y="70" width="190" height="110" class="scr dark"/><text x="565" y="104" class="dash">TICKETS ABIERTOS</text><text x="565" y="148" class="dash-n">37</text><text x="565" y="168" class="dash-s">12 urgentes · SLA vencido</text>';
        s += '<rect x="470" y="226" width="40" height="24" rx="4" class="phone"/><text x="490" y="222" class="ring">RING!</text><rect x="520" y="214" width="34" height="32" class="note-y"/><rect x="560" y="220" width="34" height="32" class="note-y"/>';
        s += '<rect x="370" y="402" width="70" height="14" rx="3" class="strip"/><rect x="440" y="402" width="70" height="14" rx="3" class="strip"/>';
        for (let k = 0; k < 6; k++) s += `<rect x="${374 + k * 22}" y="396" width="10" height="10" class="plug"/>`;
        s += '<path d="M470 396q4 -14 -4 -26q8 -10 0 -24" class="smoke"/>';
        s += '<rect x="610" y="270" width="110" height="140" class="cab"/><rect x="600" y="370" width="130" height="34" class="drawer"/><rect x="650" y="384" width="30" height="5" class="handle-d"/>';
        return s;
      },
      hz: [
        { x: 195, y: 140, r: 46, n: 'Reflejo de la ventana en la pantalla', peligro: 'La ventana de al lado deslumbra y se refleja en el monitor.', tipos: ['ergonomico', 'higienico'], dano: 'Fatiga visual, dolor de cabeza, posturas forzadas para evitar el reflejo.', med: [{ t: 'Colocar la pantalla perpendicular a la ventana y usar cortinas o estores regulables', ok: true, why: 'Es lo que pide el RD 488/1997 para PVD: evitar reflejos y deslumbramientos en origen.' }, { t: 'Subir el brillo al máximo', ok: false, why: 'Aumenta la fatiga visual y no elimina el reflejo.' }, VAGA('Entrecerrar los ojos cuando moleste')] },
        { x: 195, y: 205, r: 36, n: 'Monitor subido encima de cajas, demasiado alto', peligro: 'El borde superior queda muy por encima de los ojos.', tipos: ['ergonomico'], dano: 'Dolor cervical y de hombros por levantar la cabeza horas y horas.', med: [{ t: 'Poner un soporte regulable con el borde superior a la altura de los ojos o algo por debajo, a unos 40 cm o más', ok: true, why: 'Es la colocación correcta de una PVD.' }, VAGA('Estirar el cuello de vez en cuando'), { t: 'Bajar la silla al máximo', ok: false, why: 'Entonces los brazos quedan mal para el teclado: cambia un problema por otro.' }] },
        { x: 315, y: 262, r: 44, n: 'Postura encorvada en un taburete sin respaldo', peligro: 'Silla sin respaldo ni regulación, espalda doblada hacia la pantalla.', tipos: ['ergonomico'], dano: 'Lumbalgia, contracturas, trastornos musculoesqueléticos.', med: [{ t: 'Silla de trabajo regulable en altura con respaldo lumbar, reposapiés si hace falta y pausas o cambios de postura', ok: true, why: 'Equipo adecuado + organización (pausas) = prevención de PVD.' }, VAGA('Sentarse recto de vez en cuando'), { t: 'Un cojín de casa en la espalda', ok: false, why: 'No sustituye a una silla adecuada y regulable.' }] },
        { x: 565, y: 140, r: 62, n: '37 incidencias abiertas, 12 urgentes, el teléfono no para', peligro: 'Sobrecarga, presión de tiempo e interrupciones constantes.', tipos: ['psicosocial'], dano: 'Estrés, ansiedad, insomnio y, a la larga, burnout.', med: [{ t: 'Repartir la carga, priorizar con un sistema de tickets y SLA realistas, reforzar el equipo en picos y respetar pausas', ok: true, why: 'Los riesgos psicosociales se previenen cambiando la organización del trabajo.' }, VAGA('Ser más rápido contestando'), { t: 'Hacer horas extra todas las semanas hasta acabar', ok: false, why: 'Aumenta la carga y la fatiga: agrava el riesgo.' }] },
        { x: 440, y: 400, r: 44, n: 'Regletas encadenadas y sobrecargadas que echan humo', peligro: 'Demasiados equipos en regletas conectadas unas a otras.', tipos: ['seguridad'], dano: 'Sobrecalentamiento, incendio, electrocución.', med: [{ t: 'Desconectar, no encadenar regletas, repartir la carga en tomas suficientes y revisar la instalación con un electricista', ok: true, why: 'Elimina la causa (sobrecarga) y la revisa quien tiene la cualificación.' }, VAGA('Tocar la regleta de vez en cuando para ver si quema'), { t: 'Poner un ventilador apuntando a la regleta', ok: false, why: 'No elimina la sobrecarga y puede avivar un incendio.' }] },
        { x: 665, y: 388, r: 38, n: 'Cajón inferior abierto en la zona de paso', peligro: 'Cajón abierto a la altura de las piernas.', tipos: ['seguridad'], dano: 'Golpes y tropiezos: contusiones, caídas.', med: [{ t: 'Cerrar los cajones después de usarlos, mantener ordenado el puesto y no abrir varios a la vez', ok: true, why: 'Orden y limpieza: es la medida más simple y eficaz.' }, VAGA('Ir mirando al suelo'), { t: 'Quitar el archivador', ok: false, why: 'Desproporcionado: basta con cerrarlo y ordenar.' }] },
      ],
    },
    {
      id: 'cliente',
      title: 'Instalación en casa de un cliente',
      intro: 'Te mandan a cablear la oficina de un cliente. Son las 23:45 y estás solo.',
      art() {
        let s = '<rect width="800" height="330" class="wall"/><rect y="330" width="800" height="120" class="floor"/>';
        s += '<rect width="800" height="50" class="ceil"/>';
        for (let x = 0; x < 800; x += 80) s += `<path d="M${x} 0v50" class="tile"/>`;
        s += '<rect x="250" y="0" width="80" height="50" class="hole"/>';
        for (let k = 0; k < 14; k++) s += `<circle cx="${255 + ((k * 37) % 70)}" cy="${56 + ((k * 23) % 60)}" r="1.8" class="dust"/>`;
        s += '<path d="M240 330l40 -300M300 330l40 -300" class="ladder"/>';
        for (let k = 0; k < 9; k++) s += `<path d="M${243 + k * 4.4} ${310 - k * 33}h60" class="ladder"/>`;
        s += P.box(292, 300, 46, 30) + P.person(316, 160, { c: '#2d5be3', armL: -4, armLy: -36, armR: 8, armRy: -40, hat: false });
        s += '<rect x="20" y="90" width="190" height="130" class="win night"/><path d="M115 90v130" class="win-l"/><rect x="40" y="170" width="70" height="26" rx="6" class="van"/><circle cx="55" cy="198" r="7" class="wheel"/><circle cx="96" cy="198" r="7" class="wheel"/><text x="150" y="150" class="lbl-w">3 clientes más hoy</text>';
        s += '<circle cx="520" cy="110" r="34" class="clock"/><path d="M520 110v-22M520 110l18 8" class="hands"/><text x="520" y="168" class="lbl">23:45</text>';
        s += '<rect x="620" y="90" width="130" height="180" class="panel"/><rect x="632" y="104" width="106" height="150" class="panel-in"/>';
        for (let k = 0; k < 6; k++) s += `<rect x="${640 + (k % 3) * 32}" y="${116 + Math.floor(k / 3) * 46}" width="22" height="34" class="breaker"/>`;
        s += '<path d="M750 96l34 20v150l-34 6z" class="panel-door"/><text x="685" y="292" class="zap">⚡</text>';
        s += '<rect x="440" y="372" width="80" height="40" class="hole"/><path d="M440 372h80v40h-80z" class="hole-edge"/>';
        return s;
      },
      hz: [
        { x: 290, y: 190, r: 52, n: 'Escalera de mano apoyada sobre una caja', peligro: 'Escalera inestable, con un pie encima de una caja, trabajando en lo alto.', tipos: ['seguridad'], dano: 'Caída a distinto nivel: fracturas, traumatismos craneales.', med: [{ t: 'Usar una escalera adecuada en buen estado, apoyada en suelo firme, con alguien que la sujete, o mejor una plataforma o andamio', ok: true, why: 'Equipos de trabajo seguros y apoyo estable eliminan la causa de la caída.' }, VAGA('Subir despacio'), { t: 'Ponerse casco y seguir así', ok: false, why: 'El casco no evita la caída: la escalera sigue siendo inestable.' }] },
        { x: 290, y: 80, r: 40, n: 'Polvo y fibras al abrir el falso techo', peligro: 'Partículas en suspensión que caen sobre la cara.', tipos: ['higienico'], dano: 'Irritación de ojos y vías respiratorias, alergias.', med: [{ t: 'Ventilar, limpiar antes con aspiración y usar mascarilla y gafas de protección como EPI', ok: true, why: 'Se reduce la exposición y, como complemento, se protege con EPI.' }, VAGA('Aguantar la respiración al abrir'), { t: 'Soplar el polvo para quitarlo', ok: false, why: 'Lo pone en suspensión: aumenta la exposición.' }] },
        { x: 690, y: 180, r: 64, n: 'Cuadro eléctrico abierto que tienes que tocar', peligro: 'Elementos en tensión al alcance, sin ser electricista.', tipos: ['seguridad'], dano: 'Electrocución y quemaduras.', med: [{ t: 'No manipularlo: que lo haga un electricista; si hay que trabajar cerca, cortar la tensión, comprobarla y señalizar', ok: true, why: 'Solo personal cualificado y siguiendo el procedimiento de trabajo sin tensión.' }, VAGA('Tocar solo con una mano'), { t: 'Usar guantes de cocina gruesos', ok: false, why: 'No son aislantes certificados: protección falsa.' }] },
        { x: 480, y: 392, r: 42, n: 'Baldosa del falso suelo levantada y sin señalizar', peligro: 'Hueco abierto en el suelo de paso.', tipos: ['seguridad'], dano: 'Caídas, torceduras, fracturas.', med: [{ t: 'Volver a colocar la baldosa en cuanto termines o vallar y señalizar el hueco mientras esté abierto', ok: true, why: 'Protección colectiva y señalización del peligro.' }, VAGA('Acordarse de que está ahí'), { t: 'Taparlo con un cartón', ok: false, why: 'Esconde el peligro: alguien puede pisar el cartón.' }] },
        { x: 520, y: 120, r: 50, n: 'Trabajar solo, de noche y con prisa', peligro: 'Trabajo en solitario y nocturno, tras una jornada larga.', tipos: ['psicosocial'], dano: 'Fatiga, errores, accidentes sin nadie que pueda ayudar o avisar.', med: [{ t: 'Planificar las intervenciones en horario razonable, no trabajar solo en tareas con riesgo y tener un protocolo de contacto', ok: true, why: 'Los riesgos de la organización del trabajo se previenen organizándolo mejor.' }, VAGA('Tomar un café para aguantar'), { t: 'Hacerlo más rápido para acabar antes', ok: false, why: 'Las prisas aumentan los errores y los accidentes.' }] },
        { x: 110, y: 170, r: 48, n: 'Conducir la furgoneta de cliente en cliente con prisa', peligro: 'Desplazamientos por carretera durante la jornada.', tipos: ['seguridad'], dano: 'Accidente de tráfico (sería un accidente de trabajo «en misión»).', med: [{ t: 'Planificar rutas y tiempos realistas, vehículo revisado, descansos y no usar el móvil al volante', ok: true, why: 'La seguridad vial laboral se trabaja con la organización y el mantenimiento.' }, VAGA('Conducir con más atención'), { t: 'Contestar los tickets en los semáforos para ganar tiempo', ok: false, why: 'Distracción al volante: aumenta mucho el riesgo.' }] },
      ],
    },
    {
      id: 'tele',
      title: 'Teletrabajo en casa',
      intro: 'Día de teletrabajo. Tu casa también es tu lugar de trabajo, y la empresa debe evaluarlo.',
      art() {
        let s = '<rect width="800" height="320" class="wall dim"/><rect y="320" width="800" height="130" class="floor2"/>';
        s += '<rect x="620" y="50" width="140" height="130" class="win night"/><path d="M690 50v130" class="win-l"/><circle cx="720" cy="80" r="10" class="moon"/>';
        s += '<rect x="60" y="250" width="300" height="80" rx="12" class="sofa"/><rect x="60" y="200" width="300" height="60" rx="16" class="sofa-b"/><rect x="40" y="230" width="40" height="100" rx="12" class="sofa-b"/><rect x="340" y="230" width="40" height="100" rx="12" class="sofa-b"/>';
        s += `<g class="ppl"><circle cx="190" cy="196" r="11" class="skin"/><path d="M188 208q-6 30 14 58" class="limb" style="stroke:#8b5cf6"/><path d="M202 266l46 4l6 46" class="limb leg"/><path d="M192 226l40 18" class="limb" style="stroke:#8b5cf6"/></g>`;
        s += '<path d="M222 252l44 -8l6 22l-44 8z" class="laptop"/><path d="M226 254l36 -6" class="scr"/>';
        s += '<rect x="430" y="300" width="160" height="12" class="desk"/><path d="M440 312v60M580 312v60" class="desk-leg"/><rect x="480" y="270" width="34" height="30" rx="4" class="phone"/><rect x="456" y="210" width="120" height="50" rx="6" class="notif"/><text x="516" y="230" class="notif-t">23:12 · Jefe</text><text x="516" y="248" class="notif-t2">¿Reinicias el servidor YA?</text>';
        s += '<path d="M780 340q-120 40 -260 20q-120 -14 -150 30" class="cable-o"/><rect x="772" y="328" width="18" height="26" class="socket"/>';
        s += '<path d="M410 120l-30 60h60z" class="lamp"/><path d="M410 180v130" class="desk-leg"/><circle cx="410" cy="190" r="40" class="glow"/>';
        return s;
      },
      hz: [
        { x: 230, y: 250, r: 54, n: 'Portátil sobre las rodillas, hundido en el sofá', peligro: 'Postura forzada: cuello flexionado y espalda sin apoyo durante horas.', tipos: ['ergonomico'], dano: 'Dolor cervical y lumbar, trastornos musculoesqueléticos.', med: [{ t: 'Trabajar en una mesa y silla adecuadas, con pantalla y teclado externos o un soporte para el portátil, y hacer pausas', ok: true, why: 'Las normas de PVD también se aplican al teletrabajo; la empresa debe evaluar el puesto.' }, VAGA('Cambiar de lado del sofá cada hora'), { t: 'Ponerse más cojines', ok: false, why: 'No resuelve la postura de cuello ni la distancia a la pantalla.' }] },
        { x: 516, y: 236, r: 56, n: 'Mensajes del jefe a las 23:12 pidiendo cosas urgentes', peligro: 'Conexión permanente: la jornada no termina nunca.', tipos: ['psicosocial'], dano: 'Estrés, tecnoestrés, insomnio, conflicto con la vida personal.', med: [{ t: 'Aplicar el derecho a la desconexión digital con una política de la empresa y guardias organizadas y retribuidas para las urgencias', ok: true, why: 'La desconexión es un derecho y las urgencias se cubren con guardias organizadas, no con disponibilidad total.' }, VAGA('Contestar rápido para quitárselo de encima'), { t: 'Dejar el móvil en la mesilla por si acaso', ok: false, why: 'Mantiene la conexión permanente.' }] },
        { x: 600, y: 360, r: 50, n: 'Alargador cruzando el pasillo', peligro: 'Cable por el suelo de una zona de paso.', tipos: ['seguridad'], dano: 'Tropiezos, caídas, tirones del portátil.', med: [{ t: 'Trabajar cerca de un enchufe o llevar el cable pegado a la pared con pasacables', ok: true, why: 'Elimina el cable de la zona de paso.' }, VAGA('Saltarlo al pasar'), { t: 'Taparlo con una alfombra', ok: false, why: 'Oculta el peligro y puede recalentar el cable.' }] },
        { x: 410, y: 160, r: 46, n: 'Solo una lámpara pequeña en una habitación a oscuras', peligro: 'Iluminación insuficiente y gran contraste con la pantalla.', tipos: ['higienico', 'ergonomico'], dano: 'Fatiga visual, dolor de cabeza.', med: [{ t: 'Iluminación general suficiente y uniforme más luz de trabajo, sin reflejos en la pantalla', ok: true, why: 'Se corrige la condición ambiental en origen.' }, { t: 'Bajar el brillo de la pantalla al mínimo', ok: false, why: 'El contraste sigue y cansa la vista.' }, VAGA('Descansar la vista cuando duela')] },
      ],
    },
  ];
  GAMES.inspector = {
    title: 'Inspector PRL',
    icon: '🔍',
    tag: 'Caza los riesgos: CPD, soporte, cliente y teletrabajo',
    mount(root, api) {
      let sc = null;
      let st = null;
      let zoom = false; /* en el móvil, escena ampliada con desplazamiento lateral */
      const narrow = () => window.matchMedia('(max-width: 900px)').matches;
      const best = api.store.get('best', {});
      function menu() {
        root.innerHTML =
          '<p class="lead">Eres el nuevo técnico y te han pedido que hagas de inspector de prevención. En cada escena hay varios <b>peligros</b>: púlsalos, di de qué <b>tipo</b> son y elige la <b>medida</b> adecuada. Es justo lo que te piden en la práctica de PRL.</p><div class="scenes">' +
          SCENES.map((s, i) => `<button type="button" class="scene-card" data-sc="${i}"><svg viewBox="0 0 800 450" aria-hidden="true" class="art">${s.art()}</svg><b>${esc(s.title)}</b><small>${s.hz.length} peligros${best[s.id] != null ? ' · mejor: ' + best[s.id] + ' %' : ''}</small></button>`).join('') +
          '</div>';
      }
      function start(i) {
        sc = SCENES[i];
        st = { found: {}, pts: 0, miss: 0, cur: null, step: 0 };
        draw();
        api.say(sc.intro, '');
      }
      function draw() {
        const n = Object.keys(st.found).length;
        const old = root.querySelector('.insp-art');
        const sx = old ? old.scrollLeft : 0;
        root.innerHTML =
          `<div class="insp-head"><button type="button" class="link" data-back>← Escenas</button><b>${esc(sc.title)}</b><span class="count">${n} / ${sc.hz.length} peligros</span><button type="button" class="link zoom-btn" data-zoom aria-pressed="${zoom}">${zoom ? '🔍 Ver entera' : '🔍 Ampliar escena'}</button><button type="button" class="link" data-give>Me rindo</button></div>` +
          `<div class="insp"><div class="insp-art${zoom ? ' zoomed' : ''}"><svg viewBox="0 0 800 450" class="art" role="img" aria-label="${esc(sc.title)}: busca los peligros">${sc.art()}` +
          sc.hz.map((h, k) => `<g class="hot${st.found[k] ? ' found' : ''}${st.cur === k ? ' cur' : ''}" data-hz="${k}" tabindex="0" role="button" aria-label="${st.found[k] ? esc(h.n) : 'Zona por revisar'}"><circle cx="${h.x}" cy="${h.y}" r="${h.r}" class="hot-c"/>${st.found[k] ? `<circle cx="${h.x}" cy="${h.y}" r="13" class="mark ${st.found[k].ok ? 'ok' : 'meh'}"/><text x="${h.x}" y="${h.y + 5}" class="mark-t">${st.found[k].ok ? '✓' : '!'}</text>` : ''}</g>`).join('') +
          `</svg></div><aside class="insp-side" id="side">${side()}</aside></div>`;
        root.querySelector('.insp-art').scrollLeft = sx;
      }
      function side() {
        if (st.cur == null) {
          const left = sc.hz.length - Object.keys(st.found).length;
          if (!left) return finish();
          return `<p class="tip">Pulsa sobre la escena donde veas algo peligroso. Quedan <b>${left}</b>.</p>${st.miss ? `<p class="small">Pulsaciones en zonas sin peligro: ${st.miss}</p>` : ''}`;
        }
        const h = sc.hz[st.cur];
        let s = `<h4>${esc(h.n)}</h4><p class="small"><b>Peligro:</b> ${esc(h.peligro)}</p>`;
        if (st.step === 0) s += '<p class="q">¿Qué tipo de riesgo es?</p><div class="opts">' + Object.keys(TIPOS).map((t) => `<button type="button" class="opt" data-tipo="${t}">${TIPOS[t]}</button>`).join('') + '</div>';
        else {
          s += `<p class="fb ${st.tipoOk ? 'ok' : 'bad'}">${st.tipoOk ? '✓' : '✗'} Es un riesgo ${h.tipos.map((t) => TIPOS[t].toLowerCase()).join(' (y también ')}${h.tipos.length > 1 ? ')' : ''}. <b>Daños posibles:</b> ${esc(h.dano)}</p>`;
          if (st.step === 1) s += '<p class="q">¿Qué medida propones?</p><div class="opts">' + st.order.map((m, k) => `<button type="button" class="opt" data-med="${k}">${esc(m.t)}</button>`).join('') + '</div>';
          else {
            const m = st.order[st.medPick];
            s += `<p class="fb ${m.ok ? 'ok' : 'bad'}">${m.ok ? '✓ ' : '✗ '}${esc(m.why)}</p>`;
            if (!m.ok) s += `<p class="fb ok">La buena: ${esc(st.order.find((x) => x.ok).t)}.</p>`;
            s += '<button type="button" class="btn primary" data-cont>Seguir inspeccionando →</button>';
          }
        }
        return s;
      }
      function finish() {
        const max = sc.hz.length * 2;
        const score = Math.max(0, Math.round(((st.pts - st.miss * 0.25) / max) * 100));
        const prev = best[sc.id];
        if (prev == null || score > prev) {
          best[sc.id] = score;
          api.store.set('best', best);
        }
        const all = SCENES.map((s) => best[s.id] || 0);
        api.done(all.reduce((a, b) => a + b, 0) / SCENES.length, score >= 80 ? '¡Buen ojo! Esto es una evaluación de riesgos de verdad.' : 'Repasa los tipos de riesgo en la ficha de la unidad 2 y vuelve a intentarlo.');
        if (st.pts === max) api.award('inspector');
        return `<div class="finish${score >= 50 ? '' : ' fail'}"><div class="big">${score}%</div><div><b>Escena revisada</b><p>${st.pts / 2} de ${sc.hz.length} riesgos perfectos${st.miss ? ` · ${st.miss} pulsaciones en falso` : ''}.</p><button type="button" class="btn" data-back>Otra escena</button> <button type="button" class="btn" data-again>Repetir</button></div></div>`;
      }
      root.addEventListener('click', (e) => {
        const t = e.target;
        const scb = t.closest('[data-sc]');
        if (scb) return start(+scb.dataset.sc);
        if (t.closest('[data-back]')) return menu();
        if (t.closest('[data-again]')) return start(SCENES.indexOf(sc));
        if (!sc) return;
        if (t.closest('[data-give]')) {
          sc.hz.forEach((h, k) => {
            if (!st.found[k]) st.found[k] = { ok: false };
          });
          st.cur = null;
          return draw();
        }
        if (t.closest('[data-zoom]')) {
          zoom = !zoom;
          return draw();
        }
        const hz = t.closest('[data-hz]');
        if (hz && st.cur == null) {
          const k = +hz.dataset.hz;
          if (st.found[k]) return;
          st.cur = k;
          st.step = 0;
          st.order = shuffle(sc.hz[k].med);
          api.say('¡Peligro localizado! Ahora clasifícalo.', 'happy');
          draw();
          if (narrow()) $('#side').scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (t.closest('svg.art') && !hz && st.cur == null && Object.keys(st.found).length < sc.hz.length) {
          st.miss++;
          api.say('Ahí no hay nada peligroso. Fíjate en cables, posturas, ruidos, la organización del trabajo…', 'oops');
          $('#side').innerHTML = side();
          return;
        }
        const tp = t.closest('[data-tipo]');
        if (tp) {
          const h = sc.hz[st.cur];
          st.tipoOk = h.tipos.includes(tp.dataset.tipo);
          if (st.tipoOk) st.pts++;
          st.step = 1;
          api.say(st.tipoOk ? 'Bien clasificado.' : 'No es ese tipo. Lee por qué.', st.tipoOk ? 'happy' : 'oops');
          $('#side').innerHTML = side();
          return;
        }
        const md = t.closest('[data-med]');
        if (md) {
          st.medPick = +md.dataset.med;
          const m = st.order[st.medPick];
          if (m.ok) st.pts++;
          st.found[st.cur] = { ok: m.ok && st.tipoOk };
          st.step = 2;
          api.say(m.ok ? 'Medida concreta y eficaz. ¡Así se hace!' : 'Esa medida no funciona. Recuerda: eliminar en el origen, después protección colectiva y el EPI al final.', m.ok ? 'happy' : 'oops');
          $('#side').innerHTML = side();
          return;
        }
        if (t.closest('[data-cont]')) {
          st.cur = null;
          draw();
        }
      });
      root.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[data-hz]')) {
          e.preventDefault();
          e.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
      function $(s) {
        return root.querySelector(s);
      }
      menu();
      api.say('Elige una escena. Busca los peligros como si fueras el técnico de prevención.', '');
    },
  };

  /* =====================================================================
     3 · MATRIZ DE RIESGOS: probabilidad × consecuencias
     ===================================================================== */
  const NIVEL = { BLD: 'Trivial', BD: 'Tolerable', BED: 'Moderado', MLD: 'Tolerable', MD: 'Moderado', MED: 'Importante', ALD: 'Moderado', AD: 'Importante', AED: 'Intolerable' };
  const NIV_ORD = ['Trivial', 'Tolerable', 'Moderado', 'Importante', 'Intolerable'];
  const ACCION = { Trivial: 'No hace falta ninguna acción.', Tolerable: 'No hace falta mejorar, pero sí comprobar que se mantiene.', Moderado: 'Hay que reducirlo en un plazo determinado.', Importante: 'No se empieza el trabajo hasta reducirlo.', Intolerable: 'No se empieza ni se sigue trabajando: se prohíbe hasta eliminarlo.' };
  const RIESGOS = [
    { t: 'Cortes en los dedos con los bordes de las bandejas del rack al cablear.', p: 'A', c: 'LD', why: 'Se cablea a diario y son cortes superficiales.' },
    { t: 'Fatiga visual de los técnicos de soporte con 8 horas de pantalla sin pausas.', p: 'A', c: 'LD', why: 'Le pasa a casi todos (alta) y son molestias: ligeramente dañino.' },
    { t: 'Trastorno lumbar por levantar servidores de 30 kg sin elevador, cada semana.', p: 'M', c: 'D', why: 'Ocurrirá en algunas ocasiones y un trastorno musculoesquelético es dañino.' },
    { t: 'Electrocución al manipular un SAI averiado sin cortar la tensión (se hace a veces).', p: 'M', c: 'ED', why: 'Ocurre en algunas ocasiones y puede ser mortal: extremadamente dañino.' },
    { t: 'Caída de la escalera inestable desde 3 metros al pasar cable por el techo, en casi todas las instalaciones.', p: 'A', c: 'ED', why: 'Casi siempre se hace así y una caída desde 3 m puede causar fracturas mayores o la muerte.' },
    { t: 'Tropezar con un cable en el pasillo del CPD (pasa alguna vez) y torcerse un tobillo.', p: 'M', c: 'D', why: 'Algunas ocasiones; una torcedura importante o fractura menor es dañino.' },
    { t: 'Golpearse la cabeza con la puerta del armario de red, que casi nunca está abierta.', p: 'B', c: 'LD', why: 'Raras veces, y como mucho un chichón.' },
    { t: 'Pérdida de audición por el ruido de la sala de máquinas, que casi nadie visita.', p: 'B', c: 'D', why: 'Exposición rara (baja); la sordera es un daño dañino según el INSST.' },
    { t: 'Incendio de una batería de litio en el almacén, muy poco probable pero con riesgo de intoxicación grave por humo.', p: 'B', c: 'ED', why: 'Baja probabilidad, consecuencias extremadamente dañinas (intoxicación, lesiones fatales).' },
    { t: 'Burnout del técnico de guardia que cubre 24/7 todo el mes sin relevo.', p: 'A', c: 'D', why: 'Con esa organización ocurrirá casi seguro, y el burnout lleva a bajas: dañino.' },
  ];
  GAMES.matriz = {
    title: 'Matriz de riesgos',
    icon: '🎯',
    tag: 'Probabilidad × consecuencias (método INSST)',
    mount(root, api) {
      let cards;
      let place;
      let sel;
      let checked;
      function start() {
        cards = shuffle(RIESGOS).slice(0, 6);
        place = {};
        sel = null;
        checked = false;
        draw();
      }
      function cell(p, c) {
        const inside = cards.map((x, i) => [x, i]).filter(([, i]) => place[i] === p + c);
        return `<td class="mx-cell lv${NIV_ORD.indexOf(NIVEL[p + c]) + 1}" data-cell="${p}${c}"><small>${NIVEL[p + c]}</small>${inside.map(([x, i]) => `<span class="chip${checked ? (x.p + x.c === p + c ? ' ok' : ' bad') : ''}${sel === i ? ' on' : ''}" data-card="${i}">${i + 1}</span>`).join('')}</td>`;
      }
      function draw() {
        const free = cards.map((x, i) => i).filter((i) => !place[i]);
        let h =
          '<p class="lead">Coloca cada riesgo en su casilla: elige una tarjeta y luego la casilla (o arrástrala). Fíjate en las pistas de <b>frecuencia</b> y de <b>daño</b>.</p>' +
          '<details class="legend-box"><summary>¿Cómo se gradúan?</summary><p><b>Probabilidad</b>: alta (siempre o casi siempre) · media (en algunas ocasiones) · baja (raras veces).</p><p><b>Consecuencias</b>: ligeramente dañino (cortes y magulladuras pequeñas, molestias) · dañino (torceduras, fracturas menores, quemaduras, sordera, trastornos musculoesqueléticos) · extremadamente dañino (amputaciones, fracturas mayores, intoxicaciones, lesiones mortales).</p></details>' +
          '<div class="mx-wrap"><ol class="mx-cards">' +
          cards.map((x, i) => `<li class="mx-card${place[i] ? ' placed' : ''}${sel === i ? ' on' : ''}" data-card="${i}" draggable="${!checked}"><b>${i + 1}</b><span>${esc(x.t)}</span>${checked ? `<small class="${place[i] === x.p + x.c ? 'ok' : 'bad'}">${place[i] === x.p + x.c ? '✓' : '✗'} ${NIVEL[x.p + x.c]}: ${esc(x.why)}</small>` : ''}</li>`).join('') +
          '</ol><table class="mx"><thead><tr><th></th><th><span class="lg">Ligeramente<br></span><span class="sh">Lig. </span>dañino</th><th>Dañino</th><th><span class="lg">Extremadamente<br></span><span class="sh">Extr. </span>dañino</th></tr></thead><tbody>' +
          [['A', 'Alta'], ['M', 'Media'], ['B', 'Baja']].map(([p, n]) => `<tr><th>${n}</th>${['LD', 'D', 'ED'].map((c) => cell(p, c)).join('')}</tr>`).join('') +
          '</tbody></table></div>';
        if (!checked) h += `<div class="row-btns"><button type="button" class="btn primary" data-check${free.length ? ' disabled' : ''}>Comprobar</button>${free.length ? `<small>Faltan ${free.length} por colocar.</small>` : ''}</div>`;
        else {
          const ok = cards.filter((x, i) => place[i] === x.p + x.c).length;
          const order = cards.map((x, i) => [x, i]).sort((a, b) => NIV_ORD.indexOf(NIVEL[b[0].p + b[0].c]) - NIV_ORD.indexOf(NIVEL[a[0].p + a[0].c]));
          h += `<div class="finish${ok >= 4 ? '' : ' fail'}"><div class="big">${ok}/6</div><div><b>Orden de actuación</b><ol class="prio">${order.map(([x, i]) => `<li><b>${NIVEL[x.p + x.c]}</b> · ${i + 1}. ${esc(x.t)}<br><small>${ACCION[NIVEL[x.p + x.c]]}</small></li>`).join('')}</ol><button type="button" class="btn primary" data-new>Otra ronda</button></div></div>`;
        }
        root.innerHTML = h;
      }
      function put(i, cellId) {
        if (checked) return;
        place[i] = cellId;
        sel = null;
        draw();
      }
      root.addEventListener('click', (e) => {
        const cl = e.target.closest('[data-cell]');
        if (cl && sel != null) return put(sel, cl.dataset.cell);
        const c = e.target.closest('[data-card]');
        if (c && !checked) {
          sel = sel === +c.dataset.card ? null : +c.dataset.card;
          api.say(sel != null ? 'Ahora pulsa la casilla de la matriz donde va.' : '', '');
          return draw();
        }
        if (e.target.closest('[data-check]')) {
          checked = true;
          const ok = cards.filter((x, i) => place[i] === x.p + x.c).length;
          draw();
          if (ok === 6) api.award('matriz');
          api.done((ok / 6) * 100, ok === 6 ? '¡Evaluación perfecta! Ya sabes por dónde empezar a actuar.' : 'Revisa las que fallaste: la clave está en «cuántas veces» y «cuánto daño».');
          return;
        }
        if (e.target.closest('[data-new]')) start();
      });
      root.addEventListener('dragstart', (e) => {
        const c = e.target.closest('[data-card]');
        if (!c) return;
        try {
          e.dataTransfer.setData('text/plain', c.dataset.card);
        } catch (err) {}
      });
      root.addEventListener('dragover', (e) => {
        if (e.target.closest('[data-cell]')) e.preventDefault();
      });
      root.addEventListener('drop', (e) => {
        const cl = e.target.closest('[data-cell]');
        if (!cl) return;
        e.preventDefault();
        let v = null;
        try {
          v = e.dataTransfer.getData('text/plain');
        } catch (err) {}
        if (v !== '' && v != null) put(+v, cl.dataset.cell);
      });
      start();
      api.say('La matriz decide qué arreglar primero. Lee bien cada tarjeta: frecuencia y gravedad.', '');
    },
  };

  /* =====================================================================
     4 · EMERGENCIA: decisiones Proteger, Avisar, Socorrer
     ===================================================================== */
  const CASOS = [
    {
      id: 'elec',
      title: 'Electrocución en el CPD',
      icon: '⚡',
      nodes: [
        { t: 'Oyes un chasquido en la sala de servidores. Tu compañera está en el suelo junto al rack 3, con la mano cerca de un cable de alimentación pelado. No se mueve.', step: 'P', o: [['Corro a tocarla para ver si responde.', 0, 'Si sigue en contacto con la corriente, pasará también a ti y serán dos víctimas. Primero PROTEGER.'], ['Corto la corriente con el pulsador de emergencia del CPD o en el cuadro.', 1, 'Correcto: proteges a la víctima y a ti mismo antes de acercarte.'], ['Llamo al 112 desde la puerta y espero.', 0, 'Avisar es importante, pero la corriente sigue pasando: primero protege cortando la corriente.']] },
        { t: 'Corriente cortada. Te acercas: no responde cuando le hablas y la sacudes suavemente por los hombros.', step: 'A', o: [['La siento en una silla para que se recupere.', 0, 'Nunca muevas ni incorpores a una persona inconsciente.'], ['Llamo al 112 (o pido a alguien que llame) y que traigan el desfibrilador (DEA).', 1, 'AVISAR: 112 y pedir el DEA cuanto antes.'], ['Le doy agua para que reaccione.', 0, 'A una persona inconsciente no se le da nada por la boca: podría ahogarse.']] },
        { t: 'Le abres la vía aérea (frente-mentón) y miras, escuchas y sientes durante 10 segundos. No respira.', step: 'S', o: [['La pongo en posición lateral de seguridad.', 0, 'La posición lateral es para quien está inconsciente pero respira.'], ['Empiezo la RCP: 30 compresiones en el centro del pecho y 2 insuflaciones, a 100-120 por minuto.', 1, 'SOCORRER: RCP sin parar hasta que llegue ayuda o el DEA.'], ['Espero a la ambulancia sin tocarla.', 0, 'Cada minuto sin RCP reduce mucho la supervivencia.']] },
        { t: 'Llega un compañero con el DEA.', step: 'S', o: [['No lo uso: es solo para médicos.', 0, 'El DEA está pensado para que lo use cualquiera: va diciendo qué hacer.'], ['Lo enciendo, coloco los parches como indica y sigo sus instrucciones, haciendo RCP salvo cuando pide no tocarla.', 1, '¡Perfecto! RCP + DEA es lo que más vidas salva.']] },
      ],
      end: 'Después: se comunica el accidente, la empresa lo investiga y el cable lo sustituye personal cualificado. Nunca repares tú un cable pelado sin formación ni medios.',
    },
    {
      id: 'fuego',
      title: 'Fuego en el SAI',
      icon: '🔥',
      nodes: [
        { t: 'Sale humo de un SAI del CPD y ves pequeñas llamas en la parte de atrás.', step: 'P', o: [['Doy la alarma con el pulsador de incendios y aviso a los demás.', 1, 'Dar la alarma es lo primero: protege a todos.'], ['Abro la puerta y las ventanas para que salga el humo.', 0, 'Darle oxígeno aviva el fuego.'], ['Grabo un vídeo para el parte de incidencias.', 0, 'Pierdes un tiempo vital.']] },
        { t: 'Es un conato pequeño y tienes formación en extintores. ¿Cuál coges?', step: 'S', o: [['El de agua del pasillo.', 0, 'El agua conduce la electricidad: riesgo de electrocución.'], ['El de CO₂ que hay junto a la puerta del CPD.', 1, 'CO₂: no conduce la electricidad y no estropea los equipos.'], ['Uno de espuma.', 0, 'La espuma también conduce: no sirve con tensión eléctrica.']] },
        { t: '¿Cómo lo usas?', step: 'S', o: [['Me pongo entre el fuego y la pared para acorralarlo.', 0, 'Nunca te quedes sin salida: la salida debe estar a tu espalda.'], ['Quito el precinto, me coloco con la salida a la espalda y apunto a la base de las llamas en ráfagas cortas.', 1, 'Así se usa: a la base de las llamas y con la vía de escape detrás.'], ['Apunto a la parte de arriba de las llamas.', 0, 'Hay que apuntar a la base, donde está el combustible.']] },
        { t: 'El fuego no se apaga y el humo aumenta.', step: 'P', o: [['Sigo intentándolo: los servidores valen mucho dinero.', 0, 'Tu vida vale más que cualquier equipo.'], ['Bajo en el ascensor para ir más rápido.', 0, 'En un incendio nunca se usa el ascensor.'], ['Evacúo por la ruta señalizada, cierro la puerta al salir y voy al punto de encuentro.', 1, 'Correcto: cerrar la puerta frena el humo y el fuego.']] },
      ],
      end: 'El plan de emergencia de la empresa dice quién da la alarma, quién evacúa y dónde está el punto de encuentro. Léelo el primer día.',
    },
    {
      id: 'caida',
      title: 'Caída de la escalera',
      icon: '🪜',
      nodes: [
        { t: 'Un compañero se cae de la escalera al pasar cable por el falso techo. Está en el suelo, no responde, pero respira.', step: 'P', o: [['Compruebo que no hay más peligros (escalera, cables, cuadro eléctrico) y no lo muevo.', 1, 'PROTEGER: asegurar la zona sin mover al herido.'], ['Lo levanto y lo siento en una silla.', 0, 'Tras una caída puede tener una lesión de columna: moverlo puede agravarla.'], ['Le echo agua fría en la cara.', 0, 'No ayuda y puede provocar movimientos bruscos.']] },
        { t: 'Hay que avisar.', step: 'A', o: [['Escribo en el grupo de la empresa a ver quién sabe qué hacer.', 0, 'Pierdes tiempo: el número es el 112.'], ['Llamo al 112 y digo qué ha pasado, dónde estamos, cuántos heridos hay y cómo están.', 1, 'Así el 112 manda los recursos adecuados.'], ['Espero a que se despierte antes de llamar.', 0, 'Una pérdida de conocimiento tras un golpe es motivo para llamar ya.']] },
        { t: 'Sigue inconsciente y respira. Ha caído de altura: puede tener una lesión de columna.', step: 'S', o: [['Lo pongo en posición lateral de seguridad.', 0, 'Con sospecha de lesión de columna no se le mueve salvo que vomite o haya que mantener abierta la vía aérea.'], ['No lo muevo, le mantengo la cabeza alineada con el cuerpo, lo abrigo y vigilo que siga respirando.', 1, 'Correcto hasta que llegue la ambulancia.'], ['Le quito el casco y lo incorporo para que respire mejor.', 0, 'Mover cabeza y cuello puede agravar una lesión medular.']] },
      ],
      end: 'Una caída de la escalera es un accidente de trabajo. Y se podía haber evitado con una escalera estable o una plataforma.',
    },
    {
      id: 'corte',
      title: 'Corte con el rack',
      icon: '🩸',
      nodes: [
        { t: 'Te cortas la mano con el borde de una bandeja del rack y sangra bastante.', step: 'S', o: [['Hago presión directa sobre la herida con una gasa o un paño limpio.', 1, 'La presión directa detiene casi todas las hemorragias.'], ['Me pongo un torniquete enseguida.', 0, 'El torniquete es el último recurso, para hemorragias que no se pueden controlar de otro modo.'], ['La dejo sangrar para que se limpie.', 0, 'Primero se controla la hemorragia.']] },
        { t: 'La sangre atraviesa la gasa.', step: 'S', o: [['Quito la gasa empapada para ver cómo está.', 0, 'Al quitarla se arranca el coágulo y vuelve a sangrar.'], ['Pongo otra gasa encima sin quitar la primera, sigo presionando y elevo la mano.', 1, 'Correcto.']] },
        { t: 'Ya casi no sangra.', step: 'A', o: [['Me pongo una tirita y sigo, no es nada.', 0, 'Hay que comunicarlo: es un accidente de trabajo y puede necesitar puntos.'], ['Voy a que me valore el servicio médico o la mutua, y se comunica como accidente de trabajo.', 1, 'Bien: la mutua atiende los accidentes de trabajo y la empresa debe registrarlo e investigarlo.']] },
      ],
      end: 'Los bordes de los racks cortan: guantes de protección mecánica al cablear y bandejas con bordes protegidos.',
    },
  ];
  GAMES.emergencia = {
    title: 'Emergencia',
    icon: '🚑',
    tag: 'Decide paso a paso: Proteger, Avisar, Socorrer',
    mount(root, api) {
      let cs;
      let k;
      let err;
      let fb;
      const best = api.store.get('best', {});
      function menu() {
        cs = null;
        root.innerHTML =
          '<p class="lead">Cuatro emergencias en el trabajo de un técnico. Cada decisión cuenta: elige qué harías <b>primero</b>. Recuerda: <b>P · A · S</b>.</p><div class="casos">' +
          CASOS.map((c, i) => `<button type="button" class="caso" data-caso="${i}"><span>${c.icon}</span><b>${esc(c.title)}</b><small>${best[c.id] != null ? 'Mejor: ' + best[c.id] + ' %' : c.nodes.length + ' decisiones'}</small></button>`).join('') +
          '</div>';
      }
      function draw() {
        const n = cs.nodes[k];
        let h = `<div class="insp-head"><button type="button" class="link" data-back>← Emergencias</button><b>${cs.icon} ${esc(cs.title)}</b><span class="pas">${['P', 'A', 'S'].map((x) => `<i class="${n && n.step === x ? 'on' : ''}">${x}</i>`).join('')}</span><span class="count">${err} ${err === 1 ? 'error' : 'errores'}</span></div>`;
        if (!n) {
          const score = Math.max(0, 100 - err * 20);
          if (best[cs.id] == null || score > best[cs.id]) {
            best[cs.id] = score;
            api.store.set('best', best);
          }
          if (!err) api.award('pas');
          api.done(CASOS.reduce((a, c) => a + (best[c.id] || 0), 0) / CASOS.length, err ? 'Superada, pero con errores: en una emergencia real cada uno cuenta. Repítela.' : '¡Sangre fría y manual en mano! Perfecto.');
          h += `<div class="finish${score >= 60 ? '' : ' fail'}"><div class="big">${score}%</div><div><b>Emergencia resuelta</b><p>${esc(cs.end)}</p><button type="button" class="btn" data-back>Otra emergencia</button> <button type="button" class="btn" data-again>Repetir</button></div></div>`;
          root.innerHTML = h;
          return;
        }
        h += `<div class="em-scene"><p class="em-t">${esc(n.t)}</p><div class="opts">${n.order.map(([t, good], i) => `<button type="button" class="opt${fb && fb.i === i ? (fb.ok ? ' ok' : ' bad') : ''}" data-op="${i}"${fb && fb.ok ? ' disabled' : ''}>${esc(t)}</button>`).join('')}</div>${fb ? `<p class="fb ${fb.ok ? 'ok' : 'bad'}">${fb.ok ? '✓' : '✗'} ${esc(fb.t)}${fb.ok ? '' : ' Prueba otra opción.'}</p>` : ''}${fb && fb.ok ? `<div class="row-btns"><button type="button" class="btn primary" data-goon>${k + 1 < cs.nodes.length ? 'Continuar →' : 'Terminar →'}</button></div>` : ''}</div>`;
        root.innerHTML = h;
      }
      function start(i) {
        cs = CASOS[i];
        k = 0;
        err = 0;
        fb = null;
        for (const n of cs.nodes) n.order = shuffle(n.o);
        draw();
        api.say('Respira hondo y piensa: ¿qué va primero?', '');
      }
      root.addEventListener('click', (e) => {
        const c = e.target.closest('[data-caso]');
        if (c) return start(+c.dataset.caso);
        if (e.target.closest('[data-back]')) return menu();
        if (e.target.closest('[data-again]')) return start(CASOS.indexOf(cs));
        if (e.target.closest('[data-goon]')) {
          fb = null;
          k++;
          return draw();
        }
        const o = e.target.closest('[data-op]');
        if (!o || !cs || (fb && fb.ok)) return;
        const [, ok, why] = cs.nodes[k].order[+o.dataset.op];
        if (ok) {
          fb = { ok: true, t: why, i: +o.dataset.op };
          api.say('¡Bien hecho!', 'happy');
        } else {
          err++;
          fb = { ok: false, t: why, i: +o.dataset.op };
          api.say('¡Cuidado! Piénsalo otra vez.', 'oops');
        }
        draw();
      });
      menu();
      api.say('En una emergencia el orden lo es todo: Proteger, Avisar y Socorrer.', '');
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* =====================================================================
   4 · SEÑALES DE SEGURIDAD (RD 485/1997): señales dibujadas en SVG
   ===================================================================== */
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
  /* pictogramas en una caja de 100 × 100, con el color que toque */
  const PICT = {
    fumar: (c) => `<rect x="16" y="50" width="54" height="11" fill="${c}"/><rect x="72" y="50" width="11" height="11" fill="${c}" opacity=".55"/><path d="M78 44q-7-8 0-14t0-14" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    agua: (c) => `<path d="M34 84c-11-15 3-24 0-38 11 9 16 20 13 31 5-7 5-12 3-19 9 9 11 21 4 26Z" fill="${c}"/><path d="M66 18c-9 13-13 20-13 27a13 13 0 0 0 26 0c0-7-4-14-13-27Z" fill="${c}"/>`,
    movil: (c) => `<rect x="36" y="18" width="28" height="56" rx="5" fill="${c}"/><rect x="40" y="26" width="20" height="36" fill="#fff" opacity=".9"/><circle cx="50" cy="68" r="2.6" fill="#fff"/>`,
    electrico: (c) => `<path d="M56 30 39 60h11l-7 22 19-30H51l6-22Z" fill="${c}"/>`,
    inflamable: (c) => `<path d="M50 32c5 11 16 17 13 32a13 13 0 0 1-26 0c0-8 4-12 7-17 2 6 4 8 6 8-3-8 0-15 0-23Z" fill="${c}"/><rect x="34" y="78" width="32" height="5" fill="${c}"/>`,
    caida: (c) => `<path d="M26 82h16V70h14V58h18" stroke="${c}" stroke-width="5" fill="none"/><circle cx="40" cy="42" r="5" fill="${c}"/><path d="M43 47l9 10m-4-6 9-4m-5 10-6 8m6-8 9 4" stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    general: (c) => `<rect x="45" y="38" width="10" height="28" rx="3" fill="${c}"/><circle cx="50" cy="74" r="5.5" fill="${c}"/>`,
    gas: (c) => `<rect x="38" y="40" width="24" height="40" rx="9" fill="${c}"/><rect x="45" y="32" width="10" height="9" fill="${c}"/><path d="M60 52q8-4 4-12m4 22q10-4 6-16" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    auditiva: (c) => `<circle cx="50" cy="52" r="15" fill="${c}"/><path d="M27 88q23-22 46 0Z" fill="${c}"/><path d="M24 50a26 26 0 0 1 52 0" stroke="${c}" stroke-width="5" fill="none"/><rect x="17" y="42" width="13" height="24" rx="5" fill="${c}"/><rect x="70" y="42" width="13" height="24" rx="5" fill="${c}"/><path d="M30 54h4M66 54h4" stroke="${c}" stroke-width="3"/>`,
    guantes: (c) => `<rect x="34" y="44" width="30" height="36" rx="9" fill="${c}"/><rect x="34" y="22" width="7" height="28" rx="3.5" fill="${c}"/><rect x="42.5" y="18" width="7" height="30" rx="3.5" fill="${c}"/><rect x="51" y="20" width="7" height="28" rx="3.5" fill="${c}"/><rect x="59" y="26" width="6" height="24" rx="3" fill="${c}"/><rect x="62" y="48" width="18" height="8" rx="4" transform="rotate(-38 62 52)" fill="${c}"/>`,
    calzado: (c) => `<path d="M32 20h20v36l24 6q8 2 8 10v10H28V56Z" fill="${c}"/>`,
    casco: (c) => `<path d="M28 42a22 22 0 0 1 44 0Z" fill="${c}"/><rect x="22" y="40" width="56" height="7" rx="3" fill="${c}"/><circle cx="50" cy="60" r="12" fill="${c}"/><path d="M28 92q22-22 44 0Z" fill="${c}"/>`,
    salida: (c) => `<rect x="60" y="16" width="24" height="68" stroke="${c}" stroke-width="4" fill="none"/><circle cx="38" cy="26" r="6.5" fill="${c}"/><path d="M36 35l-6 18-12 6m12-6 11 10-4 17m-1-39 12 7 6-7m-17 0-10 5" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    auxilios: (c) => `<path d="M41 18h18v23h23v18H59v23H41V59H18V41h23Z" fill="${c}"/>`,
    lavaojos: (c) => `<path d="M18 52q32-26 64 0-32 26-64 0Z" fill="none" stroke="${c}" stroke-width="5"/><circle cx="50" cy="52" r="9" fill="${c}"/><path d="M40 18v10m10-12v12m10-10v10" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,
    extintor: (c) => `<rect x="38" y="36" width="24" height="50" rx="9" fill="${c}"/><rect x="43" y="26" width="13" height="11" fill="${c}"/><path d="M55 30q18-2 20 18" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 26h16" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,
    pulsador: (c) => `<path d="M50 20c-14 0-20 12-20 26v14l-6 8h52l-6-8V46c0-14-6-26-20-26Z" fill="${c}"/><circle cx="50" cy="76" r="5" fill="${c}"/>`,
  };
  const TIPOS = {
    prohibicion: { n: 'Prohibición', why: 'círculo con borde y banda rojos' },
    advertencia: { n: 'Advertencia', why: 'triángulo amarillo con borde negro' },
    obligacion: { n: 'Obligación', why: 'círculo azul con dibujo blanco' },
    salvamento: { n: 'Salvamento o socorro', why: 'rectángulo verde con dibujo blanco' },
    incendios: { n: 'Lucha contra incendios', why: 'rectángulo rojo con dibujo blanco' },
  };
  const SENALES = [
    { id: 'fumar', tipo: 'prohibicion', n: 'Prohibido fumar', sit: 'En el CPD hay cajas de cartón, cables y mucho aire forzado. Alguien quiere echarse un cigarro junto a los racks.' },
    { id: 'agua', tipo: 'prohibicion', n: 'Prohibido apagar con agua', sit: 'Junto al SAI y los racks con tensión, ¿qué señal evita que alguien coja un cubo de agua si hay fuego?' },
    { id: 'movil', tipo: 'prohibicion', n: 'Prohibido usar el teléfono móvil', sit: 'En la zona de baterías con gases se prohíben los aparatos que puedan dar chispa, como el móvil.' },
    { id: 'electrico', tipo: 'advertencia', n: 'Riesgo eléctrico', sit: 'En la puerta del cuadro eléctrico y en el armario del SAI hay partes con tensión.' },
    { id: 'inflamable', tipo: 'advertencia', n: 'Materias inflamables', sit: 'El almacén donde se guardan los disolventes de limpieza y el embalaje.' },
    { id: 'caida', tipo: 'advertencia', n: 'Caída a distinto nivel', sit: 'Han levantado varias baldosas del falso suelo para pasar cable y queda un hueco.' },
    { id: 'general', tipo: 'advertencia', n: 'Peligro en general', sit: 'Un peligro que no tiene dibujo propio: se pone el triángulo con la exclamación y un texto debajo.' },
    { id: 'gas', tipo: 'advertencia', n: 'Extinción automática por gas', sit: 'El CPD tiene un sistema que inunda la sala de gas para apagar el fuego: al sonar la alarma hay que salir.' },
    { id: 'auditiva', tipo: 'obligacion', n: 'Protección auditiva obligatoria', sit: 'La sala de máquinas con la climatización y los grupos electrógenos supera los 87 dB.' },
    { id: 'guantes', tipo: 'obligacion', n: 'Protección obligatoria de las manos', sit: 'Para manipular baterías del SAI y bordes cortantes de las bandejas del rack.' },
    { id: 'calzado', tipo: 'obligacion', n: 'Calzado de seguridad obligatorio', sit: 'Muelle de carga donde se descargan servidores de 30 kg.' },
    { id: 'casco', tipo: 'obligacion', n: 'Casco de protección obligatorio', sit: 'Instalación de cableado en una obra con andamios y cargas en altura.' },
    { id: 'salida', tipo: 'salvamento', n: 'Salida de emergencia', sit: 'Encima de la puerta por la que hay que evacuar el CPD.' },
    { id: 'auxilios', tipo: 'salvamento', n: 'Primeros auxilios', sit: 'Indica dónde está el botiquín de la planta.' },
    { id: 'lavaojos', tipo: 'salvamento', n: 'Lavaojos de emergencia', sit: 'Junto a la sala de baterías, por si salpica el electrolito a los ojos.' },
    { id: 'extintor', tipo: 'incendios', n: 'Extintor', sit: 'Indica dónde está el extintor de CO₂ del CPD.' },
    { id: 'pulsador', tipo: 'incendios', n: 'Pulsador de alarma de incendios', sit: 'Indica dónde está el botón para dar la alarma de incendio.' },
  ];
  /* dibuja una señal reglamentaria */
  function signSvg(id, size) {
    const sg = SENALES.find((x) => x.id === id);
    const t = sg.tipo;
    let h = `<svg class="sign" viewBox="0 0 100 100" width="${size || 120}" height="${size || 120}" role="img" aria-label="Señal">`;
    if (t === 'prohibicion') h += `<circle cx="50" cy="50" r="43" fill="#fff" stroke="#d0251b" stroke-width="9"/><g transform="translate(50 50) scale(.72) translate(-50 -50)">${PICT[id]('#111')}</g><path d="M20 20 80 80" stroke="#d0251b" stroke-width="9"/>`;
    else if (t === 'advertencia') h += `<path d="M50 8 95 88H5Z" fill="#ffcd00" stroke="#111" stroke-width="6" stroke-linejoin="round"/><g transform="translate(50 64) scale(.6) translate(-50 -52)">${PICT[id]('#111')}</g>`;
    else if (t === 'obligacion') h += `<circle cx="50" cy="50" r="46" fill="#1f5fbf"/><g transform="translate(50 50) scale(.8) translate(-50 -50)">${PICT[id]('#fff')}</g>`;
    else h += `<rect x="4" y="4" width="92" height="92" rx="5" fill="${t === 'salvamento' ? '#138a4b' : '#d0251b'}"/><g transform="translate(50 50) scale(.86) translate(-50 -50)">${PICT[id]('#fff')}</g>`;
    return h + '</svg>';
  }
  G.IPE_SIGN = signSvg; /* para la ficha */
  G.IPE_SIGNS = SENALES;

  GAMES.senales = {
    title: 'Señales de seguridad',
    icon: '🚸',
    tag: 'Reconoce cada señal por su forma, su color y su dibujo',
    mount(root, api) {
      let deck;
      let i;
      let pts;
      let max;
      let step; /* 0: elegir tipo · 1: elegir significado · 2: resuelto */
      let fb;
      let opts;
      function start() {
        /* 12 rondas: la mitad «¿qué señal es?» y la otra mitad «¿qué señal pondrías?» */
        deck = shuffle(SENALES).slice(0, 12).map((x, k) => ({ s: x, modo: k % 2 ? 'poner' : 'ver' }));
        i = 0;
        pts = 0;
        max = deck.reduce((a, r) => a + (r.modo === 'ver' ? 2 : 1), 0);
        prep();
        draw();
      }
      function prep() {
        step = 0;
        fb = null;
        const r = deck[i];
        if (!r) return;
        if (r.modo === 'ver') {
          const same = SENALES.filter((x) => x.tipo === r.s.tipo && x.id !== r.s.id);
          const other = SENALES.filter((x) => x.tipo !== r.s.tipo);
          opts = shuffle([r.s].concat(shuffle(same).slice(0, 1), shuffle(other).slice(0, same.length ? 1 : 2)));
        } else {
          /* tres señales para elegir: una del mismo tipo y otra que se confunde fácil */
          const same = SENALES.filter((x) => x.tipo === r.s.tipo && x.id !== r.s.id);
          const other = SENALES.filter((x) => x.tipo !== r.s.tipo);
          opts = shuffle([r.s].concat(shuffle(same).slice(0, 1), shuffle(other).slice(0, same.length ? 1 : 2)));
        }
      }
      function draw() {
        if (i >= deck.length) {
          const sc = Math.round((pts / max) * 100);
          api.done(sc, sc === 100 ? '¡Todas! Ya puedes revisar la señalización de cualquier CPD.' : `${pts} de ${max} puntos.`);
          if (sc === 100) api.award('senales');
          root.innerHTML = `<div class="finish${sc >= 60 ? '' : ' fail'}"><div class="big">${sc}%</div><div><b>${sc === 100 ? '¡Señalización perfecta!' : sc >= 60 ? 'Bien visto.' : 'Repasa la tabla de formas y colores.'}</b><p>${pts} de ${max} puntos.</p><button type="button" class="btn primary" data-new>Otra ronda</button> <button type="button" class="btn" data-go="f/us">Ver la ficha</button></div></div>`;
          return;
        }
        const r = deck[i];
        let h = `<div class="sg-hud"><span>Señal ${i + 1} de ${deck.length}</span><span>Puntos: <b>${pts}</b></span></div><div class="sg-bar"><i style="width:${(i / deck.length) * 100}%"></i></div>`;
        if (r.modo === 'ver') {
          h += `<div class="sg-card"><div class="sg-big" data-s="${r.s.id}">${signSvg(r.s.id, 170)}</div><div class="sg-q">`;
          if (step === 0) {
            h += '<p class="sg-ask">¿Qué <b>tipo</b> de señal es?</p><div class="sg-tipos">' + Object.entries(TIPOS).map(([k, t]) => `<button type="button" class="opt" data-tipo="${k}">${t.n}</button>`).join('') + '</div>';
          } else {
            h += `<p class="sg-tag">${TIPOS[r.s.tipo].n}</p><p class="sg-ask">¿Qué <b>significa</b>?</p><div class="opts">` +
              opts.map((o) => `<button type="button" class="opt${step === 2 ? (o.id === r.s.id ? ' ok' : fb && fb.pick === o.id ? ' bad' : '') : ''}" data-sig="${o.id}"${step === 2 ? ' disabled' : ''}>${esc(o.n)}</button>`).join('') + '</div>';
          }
        } else {
          h += `<div class="sg-card poner"><div class="sg-q"><p class="sg-tag">¿Qué señal pondrías?</p><p class="sg-sit">${esc(r.s.sit)}</p><div class="sg-pick">` +
            opts.map((o) => `<button type="button" class="sg-opt${step === 2 ? (o.id === r.s.id ? ' ok' : fb && fb.pick === o.id ? ' bad' : '') : ''}" data-sig="${o.id}"${step === 2 ? ' disabled' : ''} aria-label="${esc(o.n)}">${signSvg(o.id, 96)}${step === 2 ? `<small>${esc(o.n)}</small>` : ''}</button>`).join('') + '</div>';
        }
        if (fb) h += `<p class="fb ${fb.ok ? 'ok' : 'bad'}">${fb.ok ? '✓' : '✗'} ${fb.t}</p>`;
        if (step === 2) h += `<div class="row-btns"><button type="button" class="btn primary" data-next>${i + 1 < deck.length ? 'Siguiente señal →' : 'Ver resultado →'}</button></div>`;
        h += '</div></div>';
        root.innerHTML = h;
        const nx = root.querySelector('[data-next]');
        if (nx) nx.focus();
      }
      root.addEventListener('click', (e) => {
        const r = deck && deck[i];
        if (e.target.closest('[data-new]')) return start();
        if (e.target.closest('[data-next]')) {
          i++;
          prep();
          return draw();
        }
        const tb = e.target.closest('[data-tipo]');
        if (tb && r && r.modo === 'ver' && step === 0) {
          const ok = tb.dataset.tipo === r.s.tipo;
          if (ok) pts++;
          fb = { ok, t: ok ? `Es de ${TIPOS[r.s.tipo].n.toLowerCase()}: ${TIPOS[r.s.tipo].why}.` : `No: es de ${TIPOS[r.s.tipo].n.toLowerCase()} (${TIPOS[r.s.tipo].why}).` };
          api.say(ok ? 'Bien: forma y color.' : 'Fíjate en la forma y el color.', ok ? 'happy' : 'oops');
          step = 1;
          return draw();
        }
        const sb = e.target.closest('[data-sig]');
        if (sb && r && step !== 2 && (r.modo === 'poner' || step === 1)) {
          const ok = sb.dataset.sig === r.s.id;
          if (ok) pts++;
          const tip = TIPOS[r.s.tipo];
          fb = { ok, pick: sb.dataset.sig, t: r.modo === 'ver' ? (ok ? `«${esc(r.s.n)}». ${esc(r.s.sit)}` : `Es «${esc(r.s.n)}». ${esc(r.s.sit)}`) : (ok ? `«${esc(r.s.n)}»: ${tip.n.toLowerCase()}, ${tip.why}.` : `La correcta es «${esc(r.s.n)}» (${tip.n.toLowerCase()}: ${tip.why}).`) };
          api.say(ok ? '¡Esa es!' : 'Casi. Mira la explicación.', ok ? 'happy' : 'oops');
          step = 2;
          return draw();
        }
      });
      start();
      api.say('Forma + color = tipo de señal. El dibujo te dice el resto.', '');
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
