/* Contenidos: unidades, fichas de teoría con su minitest y glosario.
   Datos laborales de la normativa estatal (Estatuto de los Trabajadores, LPRL 31/1995, LGSS) a fecha del curso 2026-27.
   Las cifras que cambian cada año (tipos de cotización, SMI) están marcadas para comprobarlas en el BOE. */
(function (G) {
  'use strict';

  const UNITS = [
    {
      id: 'u1',
      n: 1,
      title: 'Mi sector: el técnico ASIR',
      short: 'Sector profesional',
      icon: '🧭',
      ficha: {
        body: `
        <p>El Técnico Superior en <b>Administración de Sistemas Informáticos en Red</b> (ASIR) tiene una <b>competencia general</b>:
        configurar, administrar y mantener sistemas informáticos, garantizando la funcionalidad, la integridad de los recursos y
        servicios del sistema, con la calidad exigida y cumpliendo la reglamentación vigente.</p>
        <div class="cards">
          <div><code>Sistemas</code><small>servidores Linux y Windows Server, virtualización, copias</small></div>
          <div><code>Redes</code><small>direccionamiento, routers, switches, VLAN, servicios de red</small></div>
          <div><code>Seguridad</code><small>permisos, cortafuegos, actualizaciones, recuperación</small></div>
          <div><code>Soporte</code><small>atender incidencias, diagnosticar, documentar</small></div>
        </div>
        <h3>Ocupaciones del título</h3>
        <p>Técnico en administración de sistemas, responsable de informática, técnico de redes, técnico en servicios de Internet y de
        mensajería, administrador de bases de datos, supervisor de sistemas, personal de soporte técnico… Y con experiencia y
        certificaciones (CCNA, LPIC, AWS, Security+): cloud, ciberseguridad o DevOps.</p>
        <h3>Empleo público o privado</h3>
        <table class="t"><thead><tr><th></th><th>Privado</th><th>Público</th></tr></thead><tbody>
          <tr><td>Cómo se entra</td><td>Proceso de selección: CV, pruebas, entrevista</td><td>Oposición o concurso-oposición (mérito y capacidad)</td></tr>
          <tr><td>Estabilidad</td><td>Depende del contrato y de la empresa</td><td>Alta (funcionario de carrera)</td></tr>
          <tr><td>Salario y carrera</td><td>Más variable; se negocia</td><td>Tablas fijas; se sube por grupos y niveles</td></tr>
          <tr><td>Ejemplos ASIR</td><td>Consultoras, CPD, operadores, empresas de cualquier sector</td><td>Técnico auxiliar de informática en ayuntamientos, comunidades, Estado</td></tr>
        </tbody></table>
        <p class="note">Además de saber de redes y sistemas, las empresas piden <b>competencias personales y sociales</b>: resolver problemas,
        trabajar en equipo, comunicar a usuarios no técnicos, aprender continuamente y gestionar el estrés de las incidencias.</p>`,
        quiz: [
          { q: '¿Cuál es la forma habitual de acceder a un puesto de técnico informático en un ayuntamiento?', opts: ['Enviar el CV por LinkedIn', 'Una oposición o concurso-oposición', 'Hacer prácticas en empresa'], a: 1, why: 'El empleo público se rige por los principios de igualdad, mérito y capacidad: se accede por oposición, concurso o concurso-oposición.' },
          { q: 'Explicar a una usuaria por qué no puede instalar programas en su equipo es sobre todo una competencia…', opts: ['Técnica', 'Personal y social (comunicación)', 'Legal'], a: 1, why: 'Saber explicar cuestiones técnicas a personas no técnicas es una competencia de comunicación.' },
          { q: '¿Qué certificación está más relacionada con las redes Cisco?', opts: ['CCNA', 'LPIC', 'ITIL'], a: 0, why: 'CCNA (Cisco Certified Network Associate) es la certificación de redes de Cisco. LPIC es de Linux e ITIL de gestión de servicios.' },
        ],
      },
      games: ['brujula'],
    },
    {
      id: 'u2',
      n: 2,
      title: 'Prevención: conceptos básicos',
      short: 'Riesgos y daños',
      icon: '⛑️',
      ficha: {
        body: `
        <p>La <b>Ley 31/1995 de Prevención de Riesgos Laborales</b> (LPRL) obliga a la empresa a proteger la seguridad y la salud de
        su plantilla. La OMS define la <b>salud</b> como un estado de completo bienestar físico, mental y social, y no solo la ausencia
        de enfermedad.</p>
        <div class="anatomy">
          <span class="part a"><code>Peligro</code><small>lo que puede hacer daño: un cable pelado</small></span>
          <span class="sep">→</span>
          <span class="part b"><code>Riesgo</code><small>la posibilidad de sufrir el daño: electrocutarse</small></span>
          <span class="sep">→</span>
          <span class="part c"><code>Daño</code><small>la consecuencia: quemadura, parada cardiaca</small></span>
        </div>
        <h3>Los cuatro grupos de factores de riesgo</h3>
        <div class="cards">
          <div><code>Seguridad</code><small>lugares de trabajo, caídas, golpes, riesgo eléctrico, incendio</small></div>
          <div><code>Higiénicos</code><small>medioambientales: ruido, temperatura, iluminación, polvo, agentes químicos o biológicos</small></div>
          <div><code>Ergonómicos</code><small>posturas, carga física, manipular pesos, pantallas de visualización (PVD)</small></div>
          <div><code>Psicosociales</code><small>organización del trabajo: estrés, sobrecarga, interrupciones, acoso, tecnoestrés</small></div>
        </div>
        <h3>Los daños a la salud</h3>
        <p><b>Accidente de trabajo</b>: toda lesión corporal que sufre el trabajador por cuenta ajena con ocasión o por consecuencia
        del trabajo. También lo es el accidente <b>in itinere</b> (al ir o volver del trabajo) y <b>en misión</b> (en un desplazamiento
        por trabajo). No lo es si hay imprudencia temeraria o fuerza mayor ajena al trabajo.</p>
        <p><b>Enfermedad profesional</b>: la contraída a consecuencia del trabajo en las actividades del cuadro oficial (RD 1299/2006).
        Si no está en el cuadro pero se prueba que la causa es el trabajo, se trata como accidente de trabajo.</p>
        <p>Otros daños: <b>fatiga</b> física y mental, <b>insatisfacción laboral</b>, <b>estrés</b>, síndrome del trabajador quemado
        (<i>burnout</i>) y envejecimiento prematuro.</p>`,
        quiz: [
          { q: 'Un cable de red cruzando el pasillo de la sala de servidores es…', opts: ['Un daño', 'Un peligro (factor de riesgo de seguridad)', 'Una enfermedad profesional'], a: 1, why: 'El cable es el peligro; el riesgo es tropezar y caer; el daño sería el esguince o la contusión.' },
          { q: 'Te caes de la moto cuando vas al trabajo por tu camino habitual. Es…', opts: ['Accidente de trabajo in itinere', 'Accidente no laboral', 'Enfermedad profesional'], a: 0, why: 'El accidente al ir o volver del trabajo, por el trayecto habitual, es accidente de trabajo in itinere.' },
          { q: 'Atender 40 incidencias urgentes al día con interrupciones constantes es un riesgo…', opts: ['Ergonómico', 'Higiénico', 'Psicosocial'], a: 2, why: 'La sobrecarga, la presión de tiempo y las interrupciones son factores psicosociales (organización del trabajo).' },
        ],
      },
      games: ['inspector'],
    },
    {
      id: 'u3',
      n: 3,
      title: 'Evaluar y prevenir los riesgos',
      short: 'Evaluación y medidas',
      icon: '🎯',
      ficha: {
        body: `
        <p>La <b>evaluación de riesgos</b> es obligatoria. Se identifican los peligros, se <b>estima</b> cada riesgo combinando la
        <b>probabilidad</b> de que ocurra con la <b>gravedad</b> de sus consecuencias, y se <b>valora</b> para decidir qué hacer primero.
        Este es el método general del INSST:</p>
        <table class="t matrix"><thead><tr><th>Probabilidad ↓ / Consecuencias →</th><th>Ligeramente dañino</th><th>Dañino</th><th>Extremadamente dañino</th></tr></thead><tbody>
          <tr><th>Baja</th><td class="lv1">Trivial</td><td class="lv2">Tolerable</td><td class="lv3">Moderado</td></tr>
          <tr><th>Media</th><td class="lv2">Tolerable</td><td class="lv3">Moderado</td><td class="lv4">Importante</td></tr>
          <tr><th>Alta</th><td class="lv3">Moderado</td><td class="lv4">Importante</td><td class="lv5">Intolerable</td></tr>
        </tbody></table>
        <p><b>Intolerable</b>: no se empieza ni se continúa el trabajo. <b>Importante</b>: no se empieza hasta reducirlo.
        <b>Moderado</b>: hay que reducirlo en un plazo. <b>Tolerable</b>: no hace falta mejorar, pero sí comprobar. <b>Trivial</b>: no requiere acción.</p>
        <h3>El orden de las medidas</h3>
        <div class="flow pipe">
          <span class="box">1 · eliminar en el origen</span><span class="arrow">→</span>
          <span class="box">2 · protección colectiva</span><span class="arrow">→</span>
          <span class="box">3 · protección individual (EPI)</span>
        </div>
        <p>Siempre acompañadas de <b>información y formación</b>. El EPI (guantes dieléctricos, mascarilla, calzado de seguridad…) es
        el último recurso: protege solo a quien lo lleva puesto.</p>
        <h3>Pantallas de visualización (RD 488/1997)</h3>
        <p>Silla regulable con apoyo lumbar, borde superior de la pantalla a la altura de los ojos o algo por debajo, pantalla a unos
        40 cm o más, sin reflejos de ventanas, pies apoyados y <b>pausas</b> o cambios de actividad.</p>
        <p>Cuando un riesgo no se puede eliminar del todo, además se <b>señaliza</b>: lo verás en la unidad siguiente.</p>`,
        quiz: [
          { q: 'Probabilidad media y consecuencias extremadamente dañinas dan un riesgo…', opts: ['Moderado', 'Importante', 'Intolerable'], a: 1, why: 'En la matriz, media × extremadamente dañino = importante: no se empieza el trabajo hasta reducirlo.' },
          { q: 'Para el ruido del CPD, ¿qué medida va primero?', opts: ['Dar tapones a todo el mundo', 'Aislar o separar los equipos ruidosos', 'Poner una señal de ruido'], a: 1, why: 'Primero se actúa en el origen o con protección colectiva; el EPI (tapones) es el último recurso.' },
          { q: 'Trabajas 8 horas con el portátil en la mesa de la cocina. ¿Qué falla según la norma de pantallas?', opts: ['Nada, si la wifi va bien', 'La altura de la pantalla y la silla, y faltan pausas', 'Solo que el portátil es pequeño'], a: 1, why: 'RD 488/1997: pantalla a la altura de los ojos o algo por debajo, silla regulable y pausas o cambios de actividad.' },
        ],
      },
      games: ['matriz'],
    },
    {
      id: 'us',
      n: 4,
      title: 'Señalización de seguridad',
      short: 'Señales de seguridad',
      icon: '🚸',
      ficha: {
        body: `
        <p>La <b>señalización de seguridad</b> (RD 485/1997) avisa de un riesgo, prohíbe o exige un comportamiento, o indica dónde
        está una salida o un equipo de emergencia. Es obligatoria cuando un riesgo no se ha podido eliminar del todo, pero
        <b>no sustituye</b> a las medidas de prevención: las complementa.</p>
        <p>Cada tipo tiene su <b>forma</b> y su <b>color</b>, para que se entienda de un vistazo y en cualquier idioma.</p>
        <h3>Forma y color</h3>
        <table class="t signs-t"><thead><tr><th>Tipo</th><th>Forma</th><th>Colores</th><th>Ejemplo en un CPD</th></tr></thead><tbody>
          <tr><td><b>Prohibición</b></td><td>Círculo con banda diagonal</td><td>Borde y banda <b>rojos</b>, fondo blanco, dibujo negro</td><td>Prohibido fumar · Prohibido apagar con agua</td></tr>
          <tr><td><b>Advertencia</b></td><td>Triángulo</td><td>Fondo <b>amarillo</b>, borde y dibujo negros</td><td>Riesgo eléctrico en el cuadro y el SAI</td></tr>
          <tr><td><b>Obligación</b></td><td>Círculo</td><td>Fondo <b>azul</b>, dibujo blanco</td><td>Protección auditiva en la sala de máquinas</td></tr>
          <tr><td><b>Salvamento o socorro</b></td><td>Rectángulo o cuadrado</td><td>Fondo <b>verde</b>, dibujo blanco</td><td>Salida de emergencia · Primeros auxilios</td></tr>
          <tr><td><b>Lucha contra incendios</b></td><td>Rectángulo o cuadrado</td><td>Fondo <b>rojo</b>, dibujo blanco</td><td>Extintor · Pulsador de alarma</td></tr>
        </tbody></table>
        <div class="sign-row" data-signs="fumar electrico auditiva salida extintor"></div>
        <h3>Los colores de seguridad</h3>
        <div class="cards">
          <div><code>Rojo</code><small>prohibición, peligro y alarma, material contra incendios</small></div>
          <div><code>Amarillo</code><small>advertencia, atención, precaución</small></div>
          <div><code>Azul</code><small>obligación: un comportamiento o un EPI</small></div>
          <div><code>Verde</code><small>salvamento: salidas, primeros auxilios, situación de seguridad</small></div>
        </div>
        <p>Las <b>franjas amarillas y negras</b> (o rojas y blancas) a 45° marcan obstáculos y zonas con riesgo de caída o de golpes,
        como un hueco del falso suelo abierto.</p>
        <h3>No solo carteles</h3>
        <p>También hay señalización <b>luminosa</b> y <b>acústica</b> (la alarma de incendios o la de extinción automática por gas del CPD),
        <b>verbal</b> y <b>gestual</b>. En un CPD con extinción por gas, la señal de «evacuar al sonar la alarma» es vital: el gas
        desplaza el oxígeno.</p>
        <p class="note">Las señales tienen que verse bien, estar iluminadas, en buen estado y en el sitio del riesgo. Una salida
        señalizada pero bloqueada por cajas no sirve de nada.</p>`,
        quiz: [
          { q: 'Una señal triangular, amarilla y con borde negro indica…', opts: ['Una obligación', 'Una advertencia de peligro', 'Un equipo contra incendios'], a: 1, why: 'Triángulo amarillo con borde negro = advertencia (riesgo eléctrico, materias inflamables, caídas…).' },
          { q: 'La señal de «salida de emergencia» es…', opts: ['Un rectángulo verde con dibujo blanco', 'Un rectángulo rojo con dibujo blanco', 'Un círculo azul'], a: 0, why: 'Salvamento o socorro: rectángulo o cuadrado verde. El rojo cuadrado es para material contra incendios.' },
          { q: 'Si una zona del CPD está bien señalizada, ¿ya no hace falta proteger a nadie?', opts: ['Correcto: la señal basta', 'No: la señalización complementa a las medidas, no las sustituye', 'Solo si la señal es luminosa'], a: 1, why: 'La señalización avisa del riesgo que queda; primero hay que eliminarlo o reducirlo con medidas colectivas.' },
        ],
      },
      games: ['senales'],
    },
    {
      id: 'u4',
      n: 5,
      title: 'Gestión de la prevención y emergencias',
      short: 'Emergencias y primeros auxilios',
      icon: '🚑',
      ficha: {
        body: `
        <h3>Derechos y deberes</h3>
        <p>Tienes derecho a una protección eficaz: información, formación, consulta y participación, vigilancia de la salud y a
        <b>interrumpir tu actividad</b> ante un riesgo grave e inminente. Y el deber de usar bien equipos y EPI, no anular los
        dispositivos de seguridad e informar de inmediato de cualquier peligro.</p>
        <h3>Quién organiza la prevención en la empresa</h3>
        <div class="cards">
          <div><code>El empresario</code><small>en empresas pequeñas (hasta 10 trabajadores, o 25 con un solo centro), si no son actividades peligrosas y tiene formación</small></div>
          <div><code>Trabajadores designados</code><small>uno o varios de la plantilla</small></div>
          <div><code>Servicio propio</code><small>obligatorio con más de 500 trabajadores (250 en actividades peligrosas)</small></div>
          <div><code>Servicio ajeno o mancomunado</code><small>una entidad especializada, o compartido entre empresas</small></div>
        </div>
        <p>La plantilla participa a través de los <b>delegados de prevención</b>, y con 50 trabajadores o más se crea un
        <b>Comité de Seguridad y Salud</b>, paritario.</p>
        <h3>Primeros auxilios: P · A · S</h3>
        <div class="flow pipe">
          <span class="box">Proteger</span><span class="arrow">→</span>
          <span class="box">Avisar al 112</span><span class="arrow">→</span>
          <span class="box">Socorrer</span>
        </div>
        <p>Antes de tocar a alguien electrocutado, <b>corta la corriente</b>. Si está inconsciente y no respira: <b>RCP</b> de 30 compresiones
        y 2 insuflaciones, de 100 a 120 compresiones por minuto, y pide un DEA. Si respira: <b>posición lateral de seguridad</b>.
        Quemaduras: agua fría de 10 a 20 minutos, sin reventar ampollas. Hemorragia: presión directa con una gasa.</p>
        <h3>Extintores</h3>
        <p>Clases de fuego: A (sólidos), B (líquidos), C (gases), D (metales), F (aceites de cocina). En equipos eléctricos y en el CPD se
        usa <b>CO₂</b> (no conduce la electricidad ni deja residuo); nunca agua.</p>`,
        quiz: [
          { q: 'Encuentras a un compañero tendido junto a un rack con un cable pelado. ¿Qué haces primero?', opts: ['Tocarle para ver si responde', 'Cortar la corriente', 'Llamar a su familia'], a: 1, why: 'Proteger es lo primero: si tocas a una persona electrocutada con la corriente activa, la corriente pasa también a ti.' },
          { q: '¿A partir de cuántos trabajadores es obligatorio el Comité de Seguridad y Salud?', opts: ['25', '50', '500'], a: 1, why: 'Se constituye en las empresas o centros con 50 trabajadores o más (art. 38 LPRL).' },
          { q: 'Hay fuego en el SAI del CPD. ¿Qué extintor usas?', opts: ['De agua', 'De CO₂', 'Cualquiera'], a: 1, why: 'En fuegos con tensión eléctrica se usa CO₂: no conduce la electricidad ni daña los equipos.' },
        ],
      },
      games: ['emergencia'],
    },
    {
      id: 'u5',
      n: 6,
      title: 'El contrato de trabajo',
      short: 'Contratos',
      icon: '📜',
      ficha: {
        body: `
        <h3>Las fuentes del derecho laboral</h3>
        <p>De más a menos rango: <b>Constitución</b>, normas de la UE y tratados, <b>leyes</b> (Estatuto de los Trabajadores, LPRL…),
        reglamentos, <b>convenio colectivo</b>, <b>contrato</b> y usos y costumbres. Se aplican con estos principios:</p>
        <div class="cards">
          <div><code>Norma más favorable</code><small>si dos normas chocan, la que más beneficie al trabajador</small></div>
          <div><code>Norma mínima</code><small>el contrato puede mejorar la ley, nunca empeorarla</small></div>
          <div><code>Irrenunciabilidad</code><small>no puedes renunciar a tus derechos (vacaciones, salario…)</small></div>
          <div><code>Condición más beneficiosa</code><small>una mejora concedida a título personal se mantiene</small></div>
          <div><code>In dubio pro operario</code><small>si una norma es dudosa, se interpreta a favor del trabajador</small></div>
        </div>
        <h3>El contrato</h3>
        <p>Pueden firmarlo los mayores de 18 años, y los de 16 o 17 con permiso de sus padres o si viven de forma independiente.
        Puede ser verbal o escrito, pero muchos deben ser por escrito (formativos, temporales, a tiempo parcial…).
        El <b>periodo de prueba</b> es como máximo de <b>6 meses</b> para técnicos titulados y de <b>2 meses</b> para el resto
        (3 meses en empresas de menos de 25 trabajadores), y de 1 mes en contratos temporales de hasta 6 meses.</p>
        <h3>Modalidades (desde la reforma de 2021)</h3>
        <div class="cards">
          <div><code>Indefinido</code><small>la regla general; a jornada completa o parcial</small></div>
          <div><code>Fijo discontinuo</code><small>trabajos de temporada o intermitentes que se repiten</small></div>
          <div><code>Circunstancias de la producción</code><small>aumento ocasional e imprevisible: hasta 6 meses (12 por convenio). Previsible y breve: 90 días al año</small></div>
          <div><code>Sustitución</code><small>cubrir a alguien con derecho a reserva del puesto (baja, permiso por nacimiento…)</small></div>
          <div><code>Formación en alternancia</code><small>compaginar el trabajo con estudios relacionados; de 3 meses a 2 años</small></div>
          <div><code>Obtención de práctica profesional</code><small>dentro de los 3 años siguientes al título; de 6 meses a 1 año</small></div>
        </div>
        <p class="note">Encadenar contratos temporales más de 18 meses en un periodo de 24 convierte a la persona en <b>fija</b>.</p>`,
        quiz: [
          { q: 'El convenio dice 25 días de vacaciones y el Estatuto 30 días naturales. ¿Cuántos tienes?', opts: ['25', '30', 'Los que diga la empresa'], a: 1, why: 'El convenio no puede empeorar la ley (norma mínima): tienes al menos 30 días naturales.' },
          { q: 'Te contratan como técnico de sistemas recién titulado para coger experiencia. ¿Qué contrato encaja?', opts: ['Para la obtención de práctica profesional', 'De sustitución', 'Fijo discontinuo'], a: 0, why: 'Es el formativo pensado para estrenar el título, dentro de los 3 años siguientes a obtenerlo.' },
          { q: 'Periodo de prueba máximo para un técnico titulado (sin convenio que diga otra cosa):', opts: ['1 mes', '2 meses', '6 meses'], a: 2, why: 'El art. 14 ET fija hasta 6 meses para técnicos titulados y 2 meses para el resto.' },
        ],
      },
      games: ['contrato'],
    },
    {
      id: 'u6',
      n: 7,
      title: 'Jornada, descansos y permisos',
      short: 'Tiempo de trabajo',
      icon: '🗓️',
      ficha: {
        body: `
        <div class="cards">
          <div><code>40 h</code><small>jornada máxima semanal de trabajo efectivo (de promedio en el año)</small></div>
          <div><code>9 h</code><small>máximo de horas ordinarias al día (salvo convenio o acuerdo)</small></div>
          <div><code>12 h</code><small>descanso mínimo entre el final de una jornada y el inicio de la siguiente</small></div>
          <div><code>15 min</code><small>pausa si la jornada continuada pasa de 6 horas</small></div>
          <div><code>1,5 días</code><small>descanso semanal ininterrumpido (dos días para menores de 18)</small></div>
          <div><code>80 h</code><small>máximo de horas extraordinarias al año</small></div>
          <div><code>22–6 h</code><small>trabajo nocturno; los menores de 18 no pueden hacerlo</small></div>
          <div><code>30 días</code><small>naturales de vacaciones como mínimo; no se pueden cambiar por dinero</small></div>
        </div>
        <h3>Permisos retribuidos (art. 37.3 ET)</h3>
        <table class="t"><tbody>
          <tr><td>Matrimonio o pareja de hecho</td><td>15 días naturales</td></tr>
          <tr><td>Accidente, enfermedad grave, hospitalización o intervención con reposo de familiares hasta 2.º grado o convivientes</td><td>5 días</td></tr>
          <tr><td>Fallecimiento de familiar hasta 2.º grado</td><td>2 días (4 si hay que desplazarse)</td></tr>
          <tr><td>Traslado del domicilio habitual</td><td>1 día</td></tr>
          <tr><td>Fuerza mayor por motivos familiares urgentes</td><td>hasta 4 días al año (por horas)</td></tr>
          <tr><td>Deber público (votar en una mesa electoral…)</td><td>el tiempo indispensable</td></tr>
        </tbody></table>
        <p class="note">En sistemas son habituales las <b>guardias</b> y los turnos: el descanso de 12 horas y el semanal también cuentan
        cuando hay que cubrir el CPD. Y con el teletrabajo tienes <b>derecho a la desconexión digital</b>.</p>`,
        quiz: [
          { q: 'Sales del CPD a las 23:00. ¿A qué hora puedes empezar como pronto al día siguiente?', opts: ['A las 7:00', 'A las 11:00', 'A las 9:00'], a: 1, why: 'Entre jornadas debe haber al menos 12 horas de descanso: 23:00 + 12 h = 11:00.' },
          { q: '¿Puede la empresa pagarte las vacaciones en vez de dártelas?', opts: ['Sí, si tú quieres', 'No, salvo que el contrato termine sin haberlas disfrutado', 'Sí, siempre'], a: 1, why: 'Las vacaciones no se sustituyen por dinero; solo se pagan en el finiquito si no se han podido disfrutar.' },
          { q: 'Te mudas de piso. ¿Cuántos días de permiso retribuido tienes?', opts: ['1', '2', 'Ninguno'], a: 0, why: 'El Estatuto da 1 día por traslado del domicilio habitual (los convenios pueden mejorarlo).' },
        ],
      },
      games: ['cuadrante', 'legal'],
    },
    {
      id: 'u7',
      n: 8,
      title: 'El salario, la nómina y la Seguridad Social',
      short: 'Nómina',
      icon: '💶',
      ficha: {
        body: `
        <p>El <b>salario</b> son las percepciones por el trabajo: <b>salario base</b> y <b>complementos</b> (antigüedad, nocturnidad,
        plus de convenio, horas extra…). Hay al menos <b>dos pagas extra</b> al año, que pueden cobrarse aparte o prorrateadas cada mes.
        Las <b>percepciones extrasalariales</b> (dietas, gastos de locomoción) compensan gastos; dentro de ciertos límites no cotizan
        ni tributan. Nadie puede cobrar menos que el <b>salario mínimo interprofesional</b> (SMI), que se fija cada año.</p>
        <h3>Cómo se calcula una nómina</h3>
        <div class="flow pipe">
          <span class="box">Total devengado</span><span class="arrow">→</span>
          <span class="box">Bases de cotización</span><span class="arrow">→</span>
          <span class="box">Deducciones</span><span class="arrow">→</span>
          <span class="box">Líquido a percibir</span>
        </div>
        <table class="t"><thead><tr><th>Base</th><th>Qué lleva</th></tr></thead><tbody>
          <tr><td><b>BCCC</b> (contingencias comunes)</td><td>Remuneración del mes sin horas extra + prorrata de pagas extra (si no vienen ya prorrateadas). Sin dietas exentas.</td></tr>
          <tr><td><b>BCCP</b> (contingencias profesionales)</td><td>BCCC + horas extra</td></tr>
          <tr><td><b>Base IRPF</b></td><td>Lo que cobras ese mes sujeto a IRPF (sin dietas exentas ni prorratas no cobradas)</td></tr>
        </tbody></table>
        <h3>Lo que te descuentan (trabajador, 2026)</h3>
        <table class="t"><tbody>
          <tr><td>Contingencias comunes</td><td>4,70 % de la BCCC</td></tr>
          <tr><td>Mecanismo de Equidad Intergeneracional (MEI)</td><td>0,15 % de la BCCC</td></tr>
          <tr><td>Desempleo</td><td>1,55 % (indefinido) o 1,60 % (temporal) de la BCCP</td></tr>
          <tr><td>Formación profesional</td><td>0,10 % de la BCCP</td></tr>
          <tr><td>Horas extra</td><td>4,70 % de su importe (2 % si son por fuerza mayor)</td></tr>
          <tr><td>IRPF</td><td>el porcentaje de retención que corresponda, sobre la base IRPF</td></tr>
        </tbody></table>
        <p class="note">Los tipos cambian (el MEI sube un poco cada año). Antes de un examen, comprueba los del año en curso.</p>
        <h3>Seguridad Social</h3>
        <p>Te da de <b>alta</b> la empresa antes de empezar. Cubre la incapacidad temporal (enfermedad común: del 4.º al 20.º día el 60 %
        de la base reguladora y desde el 21.º el 75 %; accidente de trabajo: el 75 % desde el día siguiente), el nacimiento y cuidado de
        menor, la incapacidad permanente, la jubilación y el desempleo.</p>`,
        quiz: [
          { q: 'Las horas extra, ¿en qué base entran?', opts: ['Solo en la BCCC', 'En la BCCP', 'En ninguna'], a: 1, why: 'Las horas extra no van en la base de contingencias comunes, pero sí en la de contingencias profesionales (BCCP = BCCC + horas extra).' },
          { q: 'Tienes un contrato indefinido. ¿Qué tipo de desempleo te descuentan?', opts: ['1,55 %', '1,60 %', '4,70 %'], a: 0, why: 'Desempleo: 1,55 % en contratos indefinidos y 1,60 % en los de duración determinada.' },
          { q: 'Si las pagas extra no vienen prorrateadas, ¿se suman a la BCCC del mes?', opts: ['No, no cotizan', 'Sí, su prorrata (pagas al año ÷ 12)', 'Solo en junio y diciembre'], a: 1, why: 'Las pagas extra cotizan cada mes por su parte proporcional: (importe anual de pagas) ÷ 12.' },
        ],
      },
      games: ['nomina'],
    },
    {
      id: 'u8',
      n: 9,
      title: 'Cambios y fin del contrato',
      short: 'Despido y finiquito',
      icon: '🧮',
      ficha: {
        body: `
        <h3>Cambios en el contrato</h3>
        <p><b>Movilidad funcional</b> (cambiar de tareas), <b>geográfica</b> (cambiar de ciudad) y <b>modificación sustancial</b> de
        condiciones (horario, salario, turnos). Suspensión: el contrato se «congela» por incapacidad temporal, nacimiento y cuidado de menor,
        excedencia, un ERTE…</p>
        <h3>Extinción e indemnización</h3>
        <table class="t"><thead><tr><th>Causa</th><th>Indemnización</th></tr></thead><tbody>
          <tr><td>Fin de un contrato temporal</td><td>12 días de salario por año trabajado</td></tr>
          <tr><td>Despido objetivo (causas económicas, técnicas, organizativas o de producción…)</td><td>20 días por año, máximo 12 mensualidades</td></tr>
          <tr><td>Despido improcedente</td><td>33 días por año, máximo 24 mensualidades</td></tr>
          <tr><td>Despido disciplinario procedente</td><td>Nada</td></tr>
          <tr><td>Dimisión del trabajador</td><td>Nada (con el preaviso que fije el convenio)</td></tr>
        </tbody></table>
        <p>El <b>salario diario</b> se calcula como salario anual (con pagas extra) ÷ 365. Los periodos de menos de un año se prorratean por meses.</p>
        <h3>El finiquito</h3>
        <p>Siempre se cobra al terminar, sea cual sea la causa: los <b>días trabajados</b> del último mes, las <b>vacaciones no disfrutadas</b>
        y la <b>parte proporcional de las pagas extra</b> devengadas y no cobradas. Puedes firmarlo como «no conforme» y pedir que esté
        un representante de los trabajadores.</p>
        <h3>Prestación por desempleo</h3>
        <p>Hace falta haber cotizado al menos <b>360 días</b> en los últimos 6 años y haber perdido el empleo de forma involuntaria
        (la dimisión no da derecho). Se pide en el SEPE en los 15 días hábiles siguientes.</p>`,
        quiz: [
          { q: 'Un juez declara improcedente tu despido. ¿Cuántos días por año te corresponden?', opts: ['20', '33', '45'], a: 1, why: 'Para contratos posteriores a febrero de 2012, el improcedente se indemniza con 33 días por año, con un tope de 24 mensualidades.' },
          { q: 'Te despiden de forma disciplinaria y es procedente. ¿Cobras finiquito?', opts: ['Sí', 'No', 'Solo si lo dice el convenio'], a: 0, why: 'La indemnización es cero, pero el finiquito (salario pendiente, vacaciones y pagas) se cobra siempre.' },
          { q: 'Dejas el trabajo porque has encontrado otro peor pagado y luego te despiden de ese a los 3 días. Para el paro, la dimisión…', opts: ['Da derecho a prestación', 'No da derecho por sí misma', 'Da el doble'], a: 1, why: 'La baja voluntaria no es situación legal de desempleo; hace falta perder el empleo de forma involuntaria.' },
        ],
      },
      games: ['fin'],
    },
    {
      id: 'u9',
      n: 10,
      title: 'Mi proyecto profesional',
      short: 'Autoconocimiento y empleabilidad',
      icon: '🗺️',
      ficha: {
        body: `
        <p>La <b>empleabilidad</b> es tu capacidad de encontrar empleo, mantenerlo y adaptarte a los cambios. Empieza por
        <b>conocerte</b>: qué te interesa, qué se te da bien, qué valoras y qué te falta.</p>
        <h3>DAFO personal</h3>
        <div class="cards">
          <div><code>Debilidades</code><small>internas: lo que te falta (inglés técnico, experiencia…)</small></div>
          <div><code>Amenazas</code><small>externas: competencia, requisitos, cambios del sector</small></div>
          <div><code>Fortalezas</code><small>internas: lo que ya dominas (redes, Linux, trabajo en equipo…)</small></div>
          <div><code>Oportunidades</code><small>externas: demanda de técnicos, FCT, certificaciones, cloud</small></div>
        </div>
        <h3>Objetivos SMART</h3>
        <p>Específicos, Medibles, Alcanzables, Relevantes y con un Tiempo. No «aprender redes», sino «aprobar el examen CCNA 200-301
        antes de junio estudiando 4 horas a la semana».</p>
        <h3>Entorno personal de aprendizaje e identidad digital</h3>
        <p>Tu <b>PLE</b> son las fuentes, herramientas y personas con las que aprendes: documentación oficial, laboratorios
        (Packet Tracer, máquinas virtuales), foros, comunidades, cursos. Tu <b>identidad digital</b> es lo que se ve de ti en
        Internet: un perfil de LinkedIn cuidado y un GitHub con proyectos suman; publicaciones descuidadas restan.</p>
        <h3>Buscar empleo</h3>
        <p>CV (por ejemplo, Europass) adaptado a cada oferta, carta de presentación breve, portales de empleo y redes profesionales,
        y la entrevista: prepara ejemplos concretos con el método <b>STAR</b> (Situación, Tarea, Acción, Resultado).</p>`,
        quiz: [
          { q: '«No tengo experiencia en empresas» va en el DAFO como…', opts: ['Debilidad', 'Amenaza', 'Oportunidad'], a: 0, why: 'Es algo interno tuyo que te limita: una debilidad.' },
          { q: '¿Cuál es un objetivo SMART?', opts: ['Ser mejor en Linux', 'Sacar la LPIC-1 en junio estudiando 3 h a la semana', 'Trabajar de algo de informática'], a: 1, why: 'Es específico, medible (aprobar), alcanzable, relevante y tiene fecha.' },
          { q: 'En una entrevista te piden un ejemplo de cómo resolviste un problema. ¿Qué método ayuda?', opts: ['STAR', 'DAFO', 'PAS'], a: 0, why: 'STAR: Situación, Tarea, Acción y Resultado. Da respuestas concretas y ordenadas.' },
        ],
      },
      games: ['dafo'],
    },
  ];

  const FINAL = { id: 'escape', title: 'Escape room: el CPD cerrado', icon: '🔐' };

  const GLOSARIO = [
    ['Accidente de trabajo', 'Lesión corporal que sufre el trabajador por cuenta ajena con ocasión o por consecuencia del trabajo.'],
    ['In itinere', 'Accidente al ir o volver del trabajo por el trayecto habitual. Es accidente de trabajo.'],
    ['Enfermedad profesional', 'La contraída por el trabajo en actividades del cuadro oficial (RD 1299/2006).'],
    ['Peligro', 'Fuente o situación que puede causar daño.'],
    ['Señalización de seguridad', 'Indicación (cartel, color, luz, sonido, gesto o palabra) sobre un riesgo o sobre una obligación o prohibición, o que localiza salidas y equipos de emergencia (RD 485/1997). Complementa a la prevención, no la sustituye.'],
    ['Señal de advertencia', 'Triángulo amarillo con borde y dibujo negros: avisa de un peligro (riesgo eléctrico, materias inflamables…).'],
    ['Señal de obligación', 'Círculo azul con dibujo blanco: obliga a un comportamiento o a usar un EPI.'],
    ['Señal de salvamento', 'Rectángulo o cuadrado verde con dibujo blanco: salidas de emergencia, primeros auxilios.'],
    ['Riesgo laboral', 'Posibilidad de que un trabajador sufra un daño derivado del trabajo.'],
    ['Evaluación de riesgos', 'Identificar peligros, estimar probabilidad y gravedad y valorar el riesgo para decidir medidas.'],
    ['EPI', 'Equipo de protección individual. Último recurso tras eliminar el riesgo y la protección colectiva.'],
    ['PVD', 'Pantallas de visualización de datos. Las regula el RD 488/1997.'],
    ['Delegado de prevención', 'Representante de la plantilla con funciones en prevención de riesgos.'],
    ['Comité de Seguridad y Salud', 'Órgano paritario obligatorio en empresas o centros con 50 trabajadores o más.'],
    ['PAS', 'Proteger, Avisar (112) y Socorrer: el orden ante un accidente.'],
    ['RCP', 'Reanimación cardiopulmonar: 30 compresiones y 2 insuflaciones, a 100-120 por minuto.'],
    ['Estatuto de los Trabajadores', 'Ley básica de las relaciones laborales (RDL 2/2015).'],
    ['Convenio colectivo', 'Acuerdo entre representantes de trabajadores y empresarios que regula las condiciones de un sector o empresa.'],
    ['Periodo de prueba', 'Tiempo inicial en que cualquiera de las partes puede terminar el contrato sin preaviso ni indemnización.'],
    ['Contrato indefinido', 'Sin fecha de fin. Es la regla general desde la reforma de 2021.'],
    ['Fijo discontinuo', 'Indefinido para trabajos de temporada o intermitentes que se repiten.'],
    ['Contrato de sustitución', 'Para cubrir a una persona con derecho a reserva del puesto.'],
    ['Formación en alternancia', 'Contrato formativo que compagina trabajo y estudios.'],
    ['Práctica profesional', 'Contrato formativo para estrenar el título, dentro de los 3 años siguientes a obtenerlo.'],
    ['Jornada', 'Máximo de 40 horas semanales de trabajo efectivo de promedio en cómputo anual.'],
    ['Horas extraordinarias', 'Las que superan la jornada ordinaria. Máximo 80 al año.'],
    ['Vacaciones', 'Al menos 30 días naturales al año. No se sustituyen por dinero.'],
    ['SMI', 'Salario mínimo interprofesional, fijado por el Gobierno cada año.'],
    ['Devengos', 'Todo lo que cobras en la nómina antes de descuentos.'],
    ['BCCC', 'Base de cotización por contingencias comunes.'],
    ['BCCP', 'Base de cotización por contingencias profesionales: BCCC + horas extra.'],
    ['MEI', 'Mecanismo de Equidad Intergeneracional: una cotización adicional para las pensiones.'],
    ['IRPF', 'Impuesto sobre la renta. La empresa retiene un porcentaje cada mes.'],
    ['Líquido a percibir', 'Lo que cobras de verdad: total devengado menos deducciones.'],
    ['Finiquito', 'Liquidación al terminar el contrato: salario pendiente, vacaciones no disfrutadas y prorrata de pagas.'],
    ['Despido improcedente', 'El que no se ajusta a la ley o no se prueba la causa. 33 días por año, máximo 24 mensualidades.'],
    ['Despido objetivo', 'Por causas económicas, técnicas, organizativas, de producción o del trabajador. 20 días por año, máximo 12 mensualidades.'],
    ['ERTE', 'Expediente de regulación temporal de empleo: suspende contratos o reduce jornada temporalmente.'],
    ['Incapacidad temporal', 'Baja médica. La Seguridad Social paga un subsidio según la causa.'],
    ['DAFO', 'Debilidades, Amenazas, Fortalezas y Oportunidades.'],
    ['SMART', 'Objetivo Específico, Medible, Alcanzable, Relevante y con Tiempo.'],
    ['PLE', 'Entorno personal de aprendizaje: fuentes, herramientas y personas con las que aprendes.'],
    ['STAR', 'Situación, Tarea, Acción, Resultado: método para contar experiencias en una entrevista.'],
    ['Desconexión digital', 'Derecho a no responder comunicaciones de trabajo fuera de la jornada.'],
  ];

  G.IPE = { UNITS, FINAL, GLOSARIO };
})(typeof window !== 'undefined' ? window : globalThis);
