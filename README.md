# IPE Games

FOL / **Itinerario personal para la empleabilidad I** para el ciclo de grado superior de
**Administración de Sistemas Informáticos en Red (ASIR)**, jugando. Todo pasa en el navegador:
no necesita instalación, servidor ni Internet.

## Abrirla

1. Descomprime el zip entero (no abras `index.html` desde dentro del zip).
2. Haz doble clic en `index.html`.

## Qué tiene

Nueve unidades, cada una con su **ficha** de teoría corta (con ejemplos de un técnico de sistemas)
y un **minitest**, y un **juego** distinto:

| Unidad | Juego |
| --- | --- |
| 1 · Mi sector: el técnico ASIR | 🧭 **Brújula profesional**: qué perfil IT encaja contigo (sistemas, redes, ciberseguridad, soporte, cloud, datos) |
| 2 · Prevención: conceptos básicos | 🔍 **Inspector PRL**: caza los peligros en un CPD, una oficina de soporte, una instalación en cliente y el teletrabajo; clasifícalos y elige la medida |
| 3 · Evaluar y prevenir los riesgos | 🎯 **Matriz de riesgos**: probabilidad × consecuencias (método INSST) y orden de actuación |
| 4 · Gestión de la prevención y emergencias | 🚑 **Emergencia**: decisiones Proteger-Avisar-Socorrer en cuatro casos (electrocución, fuego en el SAI, caída, corte) |
| 5 · El contrato de trabajo | 📜 **¿Qué contrato es?**: modalidades tras la reforma de 2021 |
| 6 · Jornada, descansos y permisos | 🗓️ **El cuadrante**: monta turnos legales para cubrir el CPD · ⚖️ **¿Legal o ilegal?** |
| 7 · Salario, nómina y Seguridad Social | 💶 **Tu nómina**: rellena bases, cotizaciones, IRPF y líquido |
| 8 · Cambios y fin del contrato | 🧮 **Fin de contrato**: indemnización y finiquito |
| 9 · Mi proyecto profesional | 🗺️ **Mi DAFO y hoja de ruta**: DAFO personal, objetivos SMART y descarga de la hoja de ruta |
| Final | 🔐 **Escape room: el CPD cerrado**: cuenta atrás de 2:30 con la sala animada (el fuego se propaga, humo, baliza, sirenas) |

Más: puntos, 8 rangos, 16 logros con forma de acreditación (Recurso preventivo, Delegado de prevención…), botón ↻ Reiniciar en cada juego, glosario, tema claro y oscuro, y Previ, la mascota con casco.

## Datos legales

Basados en la normativa estatal (Estatuto de los Trabajadores, Ley 31/1995 de PRL, LGSS) a fecha del curso 2026-27.
Los tipos de cotización del trabajador usados en la nómina son los de 2026 (contingencias comunes 4,70 %,
MEI 0,15 %, desempleo 1,55 % o 1,60 %, formación profesional 0,10 %). Cambian cada año: compruébalos en el BOE.
Los convenios colectivos pueden mejorar estos mínimos.

## Dónde tocar

| Archivo | Contenido |
| --- | --- |
| `js/content.js` | Unidades, fichas, minitest y glosario |
| `js/games1.js` | Brújula, Inspector PRL (escenas ilustradas), Matriz de riesgos y Emergencia |
| `js/games2.js` | Contratos, Cuadrante, Legal o ilegal, Nómina, Fin de contrato, DAFO y Escape room |
| `js/app.js` | Portada, menú, fichas, puntos, rangos, logros y glosario |
| `css/style.css` | Diseño (al final, el bloque propio de IPE Games) |

El progreso se guarda en el navegador de cada persona (`localStorage`, claves `ipe.*`).
