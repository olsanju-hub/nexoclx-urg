# NexoClx Urg

NexoClx Urg es una app independiente de la familia NexoClx para Urgencias hospitalarias. Su función es convertir temas clínicos en herramientas rápidas para gravedad, pruebas urgentes, tratamiento inicial, observación, ingreso, alta e interconsulta.

La familia NexoClx está formada por AP, Urg, 061 y Ped. No se deben fusionar apps ni crear un selector común.

## Identidad

- Contexto: Urgencias hospitalarias.
- Enfoque: gravedad, patología tiempo-dependiente, pruebas urgentes, tratamiento inicial, observación, ingreso, alta e interconsulta.
- Mantener colores, iconos, rutas, home, bottom nav y estética aprobada.

## Pertinencia de temas

Añadir un tema solo si Urg puede tomar una decisión real:

- estratificar gravedad;
- descartar o priorizar patología tiempo-dependiente;
- pedir pruebas urgentes;
- iniciar tratamiento urgente;
- decidir observación;
- decidir ingreso o alta;
- pedir interconsulta.

No añadir seguimiento crónico puro, educación prolongada, traslado extrahospitalario ni temas pediátricos si no corresponden al contexto de esta app.

## Cómo decidir si aplica

Antes de crear un tema, responder:

- ¿Urgencias cambia conducta con esta herramienta?
- ¿Qué datos, constantes o pruebas debe introducir el usuario?
- ¿Qué salida devuelve: gravedad, tratamiento, destino o interconsulta?
- ¿Hay fuente para criterios, dosis, pruebas y destino?

Si no hay utilidad real, no se añade y se documenta en el reporte.

## Herramienta clínica

Cada tema debe ser una herramienta:

- inputs, checklists o selectores;
- resultado de gravedad o escenario;
- pruebas urgentes iniciales;
- tratamiento y dosis si proceden;
- observación, ingreso, alta o interconsulta;
- resumen copiable;
- fuentes al final.

Si un bloque solo se lee, convertirlo en checklist, panel de decisión, cálculo real o detalle secundario.

## Tratamiento

El tratamiento urgente debe incluir fármaco, vía, dosis, rango o titulación si la fuente lo respalda. Si depende de protocolo local o subescenario no documentado, no inventar: mostrar solo conducta respaldada y documentar omisiones.

## Cálculos

No mencionar HEART, TIMI, GRACE, Wells, PERC, Geneva u otras escalas si no se calculan realmente. Si una escala es necesaria y tiene fórmula validada, crear campos, cálculo, interpretación y conducta.

No crear botones falsos ni calculadoras incompletas.

## Fuentes

Fuentes aceptables: guías de sociedades científicas, organismos oficiales, consensos publicados, documentos oficiales referenciados y fuentes internas ya trazables.

Fuentes preferentes: ESC/ESH, AHA/ACC, NICE, SEC, SEMES, AHA/ERC, CHEST y documentos nacionales o autonómicos publicados.

No usar blogs, webs comerciales, apuntes, contenido generado por IA, presentaciones sin respaldo, protocolos locales no publicados ni textos sin trazabilidad.

## Destino

Toda herramienta Urg debe indicar, si procede:

- reevaluación;
- observación;
- ingreso;
- alta con seguridad clínica documentada;
- interconsulta;
- circuito tiempo-dependiente.

## Estética

No rediseñar. Mantener patrón visual family-discovery-aesthetic, tipografía, cards, espaciados, bordes, sombras, navegación, home, bottom nav, rutas, iconos y colores.

## Reglas permanentes

- No poner temas por poner.
- No copiar contenido de AP, 061 o Ped sin adaptar al contexto Urg.
- No mostrar textos internos, pendientes, mocks ni placeholders.
- No mostrar contenido clínico sin fuente.
- No mencionar cálculos si no se calculan.
- No tocar Vercel.

## Validación antes de commit/push

- `npm run build` pasa.
- El tema aporta una decisión real en Urg.
- No hay contenido clínico visible sin fuente.
- No hay cálculos mencionados sin cálculo real.
- Tratamiento/dosis/escalones tienen fuente trazable.
- No se modifican colores, iconos, navegación ni estética global.
- No se mezclan apps.
- `report.json` documenta fuentes, omisiones, cálculos, riesgos y pertinencia.
