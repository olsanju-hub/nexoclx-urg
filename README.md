# NexoClx Urg

NexoClx Urg es una app independiente de la familia NexoClx para Urgencias hospitalarias. Su función es convertir temas clínicos en herramientas rápidas para gravedad, pruebas urgentes, tratamiento inicial, observación, ingreso, alta e interconsulta.

## Qué temas pertenecen a Urg

Incluye un tema solo si Urgencias puede tomar una decisión real:

- estratificar gravedad;
- descartar o priorizar patología tiempo-dependiente;
- pedir pruebas urgentes;
- iniciar tratamiento urgente;
- decidir observación;
- decidir ingreso o alta;
- pedir interconsulta.

No añadir temas de seguimiento crónico puro, educación prolongada o traslado extrahospitalario si no cambian una decisión en Urgencias.

## Cómo construir una herramienta clínica

Cada tema debe ser una herramienta:

- pedir datos mínimos, constantes, hallazgos y pruebas;
- devolver nivel de gravedad o escenario;
- indicar pruebas iniciales;
- mostrar tratamiento y dosis si proceden;
- proponer observación, ingreso, alta o interconsulta;
- permitir copiar resumen de evolución/interconsulta;
- dejar fuentes trazables al final.

Si un bloque es solo lectura, convertirlo en checklist, selector, panel de resultado, cálculo real o detalle secundario.

## Tratamiento, dosis y escalada

El tratamiento urgente debe incluir fármaco, vía, dosis, rango o titulación si la fuente lo respalda. Si el tratamiento depende de protocolos locales o subescenarios no documentados, no inventar: mostrar solo conducta general respaldada y documentar omisiones en `report.json`.

## Cálculos

No mencionar HEART, TIMI, GRACE, Wells, PERC, Geneva u otras escalas si no se calculan realmente. Si una escala es necesaria y tiene fórmula validada, crear campos, cálculo, interpretación y conducta. No crear botones falsos ni calculadoras incompletas.

## Fuentes aceptables

Usar guías de sociedades científicas, organismos oficiales, consensos publicados y documentos oficiales referenciados. Fuentes preferentes: ESC/ESH, AHA/ACC, NICE, SEC, SEMES, AHA/ERC, CHEST y documentos oficiales nacionales o autonómicos.

No usar blogs, webs comerciales, apuntes, contenido generado por IA, presentaciones sin respaldo, protocolos locales no publicados ni textos sin trazabilidad.

## Estética y navegación

No rediseñar. Mantener colores, iconos, home, rutas, bottom nav, tipografía, cards, espaciado y patrón visual actual. Las interacciones deben usar los componentes existentes.

## Validación antes de commit/push

- `npm run build` pasa.
- Cada tema aporta una decisión real en Urg.
- No hay contenido clínico visible sin fuente.
- No hay cálculos mencionados sin cálculo real.
- No hay textos internos, pendientes, mocks ni placeholders visibles.
- No se modifican colores, iconos, navegación ni Vercel.
- `report.json` documenta fuentes, omisiones, cálculos, riesgos y pertinencia.
