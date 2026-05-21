# NexoClx Urg

NexoClx Urg es una app web estática orientada a protocolos clínicos rápidos de guardia y urgencias, basada en bibliografía real de urgencias.  
Su objetivo no es replicar un libro en pantalla, sino convertir capítulos auditados en flujos breves de decisión, conectando protocolo, cálculos, tratamiento y referencia bibliográfica textual verificable.

URL pública principal en Vercel: `https://nexo-clx.vercel.app/`.

## README vivo

Este `README` es el índice maestro del proyecto.  
Cada cambio relevante en interfaz, navegación, módulos clínicos, cálculos, fichas farmacológicas, bibliografía o plantillas debe reflejarse aquí.

Debe mantenerse actualizado en cuatro capas:

- estructura funcional real de la app
- índice de lo implementado, lo auditado y lo pendiente
- relación entre protocolos, cálculos, tratamientos y bibliografía
- bitácora acumulativa de cambios relevantes

## Descripción actual de la app

NexoClx Urg es una herramienta web de apoyo rápido para médicos de guardia y urgencias. Está pensada para abrirse en móvil durante la asistencia, localizar un problema clínico en pocos toques y resolver la pregunta práctica del momento: qué sospechar, qué pruebas pedir ahora, qué decisión tomar, qué tratamiento iniciar y cuál es el destino seguro del paciente.

La app no funciona como un repositorio general de apuntes ni como una biblioteca de protocolos largos. Cada protocolo activo está convertido en una ficha clínica breve con cinco pestañas fijas:

1. `Sospecha`
2. `Pruebas`
3. `Decisión`
4. `Tratamiento`
5. `Destino`

Dentro de cada ficha, las pruebas, escalas, dosis, calculadoras, procedimientos y criterios de alta/ingreso aparecen en el punto donde cambian la conducta. El contenido ambulatorio solo se mantiene cuando forma parte de una decisión de urgencias: alta segura, tratamiento al alta, signos de alarma, revisión posterior o continuidad asistencial.

La experiencia visual actual es mobile-first, compacta y ligera. La navegación principal queda en `Inicio`, `Protocolos`, `Procedimientos` y `Cálculos`; la sección `Medicamentos` no está visible como módulo independiente. Las fichas farmacológicas siguen existiendo como soporte interno para mostrar pautas auditadas dentro de los protocolos, con dosis, vía, frecuencia, duración, límites, contraindicaciones y fuentes cuando procede.

Principios actuales del proyecto:

- decisión clínica rápida, no lectura larga
- protocolos exclusivamente orientados a urgencias
- interfaz compacta, con menos tarjetas y menos contenedores anidados
- contenido clínico visible solo cuando está verificado
- bibliografía textual y trazable, sin enlaces PDF públicos
- cálculos implementados solo cuando un protocolo o procedimiento real los necesita
- tratamientos integrados dentro del punto clínico donde se usan
- navegación contextual entre protocolo, procedimiento, cálculo, tratamiento y fuente

## Identidad, tono y estilo visual

Esta sección define cómo debe sentirse y verse NexoClx Urg. Sirve como briefing para copiar el estilo de la app sin abrir el código.

### Idea de producto

NexoClx Urg no es una web corporativa, una biblioteca médica ni un dashboard de gestión. Es una app clínica de guardia: sobria, rápida, escaneable y pensada para tomar decisiones en urgencias. La interfaz debe transmitir calma, precisión y utilidad inmediata.

La pregunta central de cada pantalla es:

`¿Qué necesito decidir ahora en urgencias?`

Por eso la app evita textos docentes largos, tarjetas decorativas, bloques de marketing, organigramas pesados y navegación profunda. Todo debe llevar rápido a una conducta clínica: prueba, cálculo, tratamiento, observación, ingreso, UCI, especialista, código o alta segura.

### Personalidad visual

- clínica, limpia y silenciosa
- mobile-first
- ligera, con pocas superficies
- más parecida a una ficha de guardia que a un panel de control
- sin aspecto de biblioteca, curso, dashboard o landing page
- sin decoración innecesaria
- con jerarquía clara entre información crítica, cálculo y destino

### Paleta actual

La paleta se mantiene clara y fría, con fondo gris-azulado muy suave, superficies blancas translúcidas y azul sanitario como acento principal.

| Uso | Color aproximado | Variable actual |
| --- | --- | --- |
| Fondo base | `#f2f2f7` / degradado gris-azulado claro | `--bg` |
| Superficie principal | blanco translúcido `rgba(255,255,255,0.62-0.90)` | `--surface-*` |
| Línea fina | gris iOS suave `rgba(60,60,67,0.10-0.18)` | `--line` |
| Texto principal | `#1c1c1e` | `--text` |
| Texto secundario | `#3c3c43` | `--text-soft` |
| Texto apagado | `#6c6c72` | `--text-muted` |
| Acento | azul `#0a84ff` | `--accent-500` |
| Éxito / alta segura | verde `#168a55` | `--success-500` |
| Alerta / crítico | rojo `#d70015` | `--danger-500` |

No introducir una paleta nueva. No virar la app a morado, crema, naranja, azul oscuro o dashboard oscuro. El azul se usa para navegación, pestaña activa, cálculos y acciones; el rojo solo para alarma real; el verde solo para destino seguro o respuesta favorable.

### Tipografía

- Fuente: `IBM Plex Sans`.
- Títulos compactos, sin hero grande salvo casos muy puntuales.
- Texto clínico en tamaños pequeños pero legibles.
- Sin letter spacing negativo.
- Los textos de botones y tabs deben caber en móvil sin partirse de forma rara.
- Las secciones clínicas deben parecer una ficha de trabajo, no una página editorial.

### Estructura visual

La app usa una sola superficie principal cuando es posible. Las listas se separan con líneas finas en vez de tarjetas pesadas. Los contenedores grandes deben ser pocos y discretos.

Reglas prácticas:

- usar separadores finos antes que tarjetas
- evitar tarjetas dentro de tarjetas
- evitar sombras salvo en navegación móvil o superficies principales muy leves
- radios moderados, no burbujas grandes en cada bloque
- padding compacto
- cabeceras pequeñas
- listas escaneables
- acciones clínicas cerca del punto donde cambian conducta
- tabs de protocolo visibles sin scroll horizontal
- menú móvil inferior claro y ocultable

### Componentes principales

| Componente | Estilo esperado | Uso |
| --- | --- | --- |
| Cabecera | fija, blanca translúcida, marca pequeña con icono y `NexoClx Urg` | orientación global |
| Home | buscador prominente, chips de especialidad, listas ligeras | entrada rápida |
| Lista de protocolos | filas con línea fina, título, especialidad/resumen y chevron | abrir ficha |
| Ficha clínica | una superficie principal con cabecera compacta y cinco tabs | protocolo/procedimiento |
| Tabs clínicas | `Sospecha`, `Pruebas`, `Decisión`, `Tratamiento`, `Destino` | navegación interna |
| Pautas de tratamiento | bloques en línea, no tarjetas pesadas; dosis en campos claros | tratamiento accionable |
| Botones de cálculo | pills azules discretos | abrir calculadora en contexto |
| Bibliografía | acordeón secundario, no protagonista | trazabilidad |
| Menú móvil | barra inferior translúcida, iconos, etiquetas cortas, botón ocultar | navegación principal |

### Tono de texto clínico

El texto debe sonar a guardia:

- “Pedir ahora…”
- “No retrasar…”
- “Alta solo si…”
- “Ingreso si…”
- “UCI si…”
- “Reevaluar…”
- “Evitar si…”

Evitar:

- introducciones largas
- epidemiología salvo que cambie conducta
- lenguaje de consulta programada
- seguimiento crónico como eje
- prevención extensa
- frases docentes que no ayudan en la decisión inmediata
- protocolos nuevos sin fuente o sin dosis verificadas

### Pantalla de protocolo ideal

Cada protocolo debe poder leerse en móvil así:

1. Cabecera: nombre del protocolo y especialidad.
2. Tabs: `Sospecha`, `Pruebas`, `Decisión`, `Tratamiento`, `Destino`.
3. Puntos cortos, máximo 4-5 visibles por pestaña.
4. `Ver más` solo para detalle secundario.
5. Calculadoras visibles donde cambian conducta.
6. Tratamiento con dosis, vía, frecuencia, duración/máximo si aplica, evitar si y reevaluación.
7. Destino con alta, observación, ingreso, UCI, especialista/código y alarmas.
8. Bibliografía textual al final como acordeón.

Si una pantalla parece una biblioteca, un dashboard o una ficha demasiado pesada, hay que reducir contenedores, repetir menos títulos y convertir tarjetas en filas o secciones con líneas.

## Estado actual

- Home simplificada a: `buscador` + `especialidades` + accesos breves a procedimientos y frecuentes, sin bloques de lectura largos.
- Pantalla propia de `Protocolos` con búsqueda, chips de especialidad y listas ligeras por bloque clínico.
- Vista de protocolo como ficha clínica compacta con `Sospecha`, `Pruebas`, `Decisión`, `Tratamiento` y `Destino`.
- Protocolos reales operativos: `fibrilación auricular`, `HTA en urgencias`, `síndrome coronario agudo`, `insuficiencia cardiaca aguda / edema agudo de pulmón`, `bradicardias`, `arritmias ventriculares`, `ictus isquémico`, `ictus hemorrágico`, `crisis convulsiva / epilepsia en urgencias`, `anafilaxia`, `asma`, `EPOC`, `sepsis / shock séptico`, `neumonía adquirida en la comunidad` y módulos de dolor abdominal repartidos por especialidad.
- Sección `Procedimientos` activa con `VMNI` y `Fluidoterapia IV en urgencias`.
- Cálculos activos: `CHA2DS2-VA`, `HAS-BLED`, `Cockcroft-Gault`, `CRB-65`, `CURB-65`, `Killip`, `NIHSS`, `ICH Score`, `Alvarado`, `BISAP`, dosis por peso de crisis/SCA/FA/ictus/heparina vascular/adrenalina, calculadoras de VMNI y calculadoras de fluidoterapia IV/balance.
- La sección `Medicamentos` deja de ser sección principal visible. Los tratamientos deben vivir dentro de cada protocolo como pautas concretas y auditadas.
- Icono unificado dentro y fuera de la app, con `manifest` web, `apple-touch-icon` y `service worker` para instalación PWA.
- Bibliografía activa: `ESC FA 2024` como referencia principal de FA, `ESC HTA 2024` como referencia principal de HTA, `ESC SCA 2023` como referencia principal de IAM/SCA, `ESC IC 2021/2023` como referencia de insuficiencia cardiaca aguda, `ESC TSV 2019`, `ESC Bradicardias 2021` y `ESC Arritmias ventriculares 2022` como referencias principales indexadas de sus módulos, `AHA/ASA ictus isquémico` como referencia principal del módulo de ictus isquémico, `AHA/ASA ictus hemorrágico 2022` como referencia principal del módulo de ictus hemorrágico, `Murillo 7.ª ed.`, `SEN Epilepsia 2023`, `NICE NG217` y `AES 2016` como fuentes del protocolo de crisis convulsiva/estatus, `NICE NG250 2025` como referencia principal de neumonía, y `Murillo 7.ª ed.` como obra base general y apoyo práctico.
- Plantilla de imagen inicial creada solo como estructura: `RX tórax sistemática`. No está conectada como flujo clínico visible.
- Despliegue público principal en Vercel: `https://nexo-clx.vercel.app/`.

## Estructura funcional de la app

### Secciones actuales

| Sección | Estado | Función real hoy | Relación con el resto |
| --- | --- | --- | --- |
| Home | Activa | Punto de entrada mínimo con `buscador`, `especialidades`, procedimientos y frecuentes. | Lleva a la especialidad o al resultado buscado sin pasos intermedios ni bloques redundantes. |
| Protocolos | Activa | Índice clínico principal con búsqueda, especialidades y listas ligeras. | Abre protocolo real, cálculo concreto o fuente principal desde la misma sección. |
| Vista de protocolo | Activa | Ficha clínica en cinco pestañas: `Sospecha`, `Pruebas`, `Decisión`, `Tratamiento`, `Destino`. | Es la vista principal de actuación en urgencias. |
| Módulo FA | Activo | Ficha clínica con estabilidad, frecuencia/ritmo, cardioversión, anticoagulación y destino. | Enlaza `CHA2DS2-VA`, `HAS-BLED` y `Cockcroft-Gault` desde el punto de decisión. |
| Insuficiencia cardiaca aguda / EAP | Activo | Ficha clínica para disnea congestiva, EAP hipertensivo, bajo gasto/shock, VMNI, diurético, nitratos y destino. | Enlaza `VMNI`, `SCA`, `HTA`, `Fluidoterapia IV`, `Balance simple`, `Velocidad de perfusión` y `Cockcroft-Gault`. |
| Módulo de bradicardias | Activo | Organigrama para repercusión, bradicardia sinusal / nodo, bloqueo AV y pacing. | El tratamiento farmacológico vive dentro del protocolo. |
| Módulo de arritmias ventriculares | Activo | Organigrama para pulso, inestabilidad, TV monomorfa y torsades / TV polimórfica. | El tratamiento farmacológico vive dentro del protocolo. |
| Módulos de ictus | Activos | `Ictus isquémico` e `ictus hemorrágico` con diagnóstico, tratamiento y destino. | Quedan agrupados en `Neurología` con bibliografía textual. |
| Crisis convulsiva / epilepsia | Activo | Ficha clínica para crisis autolimitada, crisis en curso, primera crisis, crisis provocada y estatus epiléptico. | Queda en `Neurología`, con relación secundaria funcional con urgencias y tratamiento escalonado con CIMA. |
| Anafilaxia | Activo | Ficha clínica para sospecha, pruebas mínimas, decisión de gravedad, adrenalina IM y destino. | Queda en `Urgencias` con calculadora directa de adrenalina IM por peso. |
| Crisis asmática | Activo | Ficha clínica para gravedad, pruebas útiles, broncodilatadores, corticoide precoz, magnesio y destino. | Queda en `Respiratorio` y enlaza soporte/VMNI si cambia conducta. |
| Agudización de EPOC | Activo | Ficha clínica para gasometría, oxígeno controlado, broncodilatadores, corticoide, antibiótico si criterios, VNI y destino. | Queda en `Respiratorio` y enlaza `Cockcroft-Gault` y VMNI cuando procede. |
| Sepsis / shock séptico | Activo | Ficha clínica para sospecha, pruebas, decisión, tratamiento inicial, fluidoterapia, foco y destino. | Enlaza `Fluidoterapia IV en urgencias`, `30 mL/kg sepsis`, `volumen pendiente` y `balance simple`. |
| Procedimientos | Activa | Índice técnico operativo con `VMNI` y `Fluidoterapia IV en urgencias`. | Enlaza procedimientos desde protocolos cuando cambian conducta. |
| VMNI | Activo | Procedimiento operativo para indicaciones, contraindicaciones, preparación, modos, ajustes, reevaluación y fracaso. | Incluye calculadoras propias de peso predicho, VT, PS, oxigenación y reevaluación. |
| Fluidoterapia IV en urgencias | Activo | Procedimiento operativo para indicación, elección de líquido, cantidad/ritmo, reevaluación y precauciones. | Incluye cálculo de bolo por peso, 30 mL/kg sepsis, volumen pendiente, mantenimiento, balance y velocidad de perfusión. |
| Dolor abdominal por escenarios | Activo | Protocolos de un vistazo para epigastrio, hipocondrio derecho, fosas iliacas, flanco, pelvis, peritonismo y sospecha vascular. | Cada cuadro queda en su especialidad principal: `Digestivo`, `Cirugía general`, `Urología`, `Ginecología` o `Vascular`. |
| Cálculos | Activa | Agrupa cálculos implementados en una lista compacta. | Los cálculos activos también se abren desde el protocolo o procedimiento. |
| Medicamentos | No visible como sección principal | Los datos farmacológicos pueden seguir existiendo como soporte interno mientras se integran pautas auditadas dentro de cada protocolo. | No debe mostrarse como módulo independiente ni como navegación principal. |
| Bibliografía | Activa | Da acceso a la obra base y a referencias estructuradas. | Cada módulo guarda sus referencias y páginas verificadas. |
| Plantillas de imagen | En desarrollo | Solo existe la estructura inicial para `RX tórax sistemática`. | Quedará conectada a bibliografía específica cuando esa fuente esté en el repo. |

### Lógica de navegación entre módulos

1. La `Home` funciona como entrada principal.
2. Desde `Home` se entra directamente a una `especialidad` o a un resultado concreto del `buscador`.
3. La pantalla `Protocolos` agrupa los módulos por bloque clínico y permite filtrar por especialidad.
4. Al abrir un protocolo implementado, la vista se renderiza como ficha clínica de urgencias con pestañas compactas.
5. Los módulos de `ictus` entran por `Neurología` y se resuelven como ficha de manejo urgente, no como capítulo de estudio.
6. Desde el protocolo se puede abrir un cálculo concreto o un procedimiento cuando cambia la conducta.
7. Los tratamientos farmacológicos deben mostrarse dentro del protocolo, no como dependencia de una sección externa de medicamentos.
8. Los mismos cálculos siguen existiendo en la sección general de `Cálculos`.
9. `Procedimientos` agrupa técnicas operativas y no sustituye protocolos locales ni valoración de UCI/Neumología.
10. Las fichas farmacológicas pueden mantenerse en datos internos si siguen siendo necesarias para no romper módulos existentes, pero no como sección principal visible.
11. La bibliografía se mantiene dentro del protocolo como acceso secundario, sin dominar la pantalla.

### Cómo se conectan los módulos

- `Home` prioriza navegación, no lectura.
- `Protocolos` es la puerta de entrada a módulos clínicos concretos.
- `Módulo FA` usa ficha clínica con calculadoras directas.
- `Módulos de ictus` siguen la misma lógica: dato clave, clasificación, conducta, tratamiento y destino.
- `Cálculos` solo se implementan cuando un protocolo real los necesita.
- Los tratamientos se construyen dentro de cada protocolo a partir de pautas auditadas: fármaco, dosis, vía, frecuencia, duración, máximos, contraindicaciones y ajustes cuando proceda.
- `Bibliografía` no vive como texto suelto dominante: cada módulo guarda referencias estructuradas y desplegables.
- `Plantillas` siguen una lógica paralela: estructura, fuente base y estado de desarrollo.

### Criterio clínico global

Todo protocolo debe funcionar como flujo clínico de guardia, no como capítulo resumido.

Estructura fija:

1. Diagnóstico
2. Tratamiento
3. Destino

Reglas:

- frases cortas y pasos accionables
- escalas enlazadas directamente desde el nodo donde cambian conducta, no mediante "ir a Escalas"
- tratamiento separado entre actuación en urgencias y, cuando proceda, tratamiento al alta
- dosis, vía, frecuencia y duración solo si están auditadas
- tratamientos con nombre del fármaco, dosis, vía y frecuencia, sin explicaciones innecesarias
- los tratamientos deben ser concretos y escalonados; si falta un dato del paciente, la app debe pedirlo antes de adaptar la conducta
- si no hay fuente auditada suficiente para una pauta, no inventar dosis ni mostrar notas internas al usuario
- criterios claros de alta, observación, ingreso, UCI o derivación
- bibliografía textual al final o en zona de fuentes

### Integración de la bibliografía en cada módulo

Murillo 7.ª edición es la base práctica inicial local de los protocolos de urgencias cuando el PDF está disponible en el workspace. Cada protocolo mantiene la referencia textual a Murillo cuando aplica, con capítulo y páginas verificadas si están disponibles. La bibliografía será textual y verificable, sin enlaces PDF públicos.

Ubicación local recomendada si hay que aportar el PDF sin publicarlo: `.local-biblio/urgencias-murillo-7ma.pdf`. La carpeta `.local-biblio/` queda ignorada por Git.

Las decisiones clínicas críticas se corroboran con guías europeas o americanas recientes y de alto rigor cuando existen: ESC en cardiología, AHA/ASA en ictus, NICE/ERS/ATS/BTS/IDSA en neumonía e infecciones respiratorias, EAU en urología, ACG/AGA/ESGE/EASL/WSES en digestivo y cirugía urgente, ACOG/RCOG en ginecología y SCCM/Surviving Sepsis Campaign en sepsis. Si Murillo y una guía más reciente difieren, el flujo clínico muestra directamente la conducta actualizada y la justificación queda en fuentes, no en mitad del protocolo.

No se usan Wikipedia, blogs, webs comerciales ni resúmenes sin respaldo como fuente clínica.

Cada módulo puede guardar una o varias referencias estructuradas. La app distingue:

- `Página índice`: página declarada por el índice del libro
- `Página real`: página verificada donde empieza el contenido útil

Cada referencia guarda:

- `referenceId`
- `indexPages`
- `verifiedPages`
- `internalId`
- `note`

La interfaz muestra referencias textuales verificables. No abre PDFs, no muestra rutas internas y no depende de `public/biblio/` para funcionar.

## Estructura técnica actual

- `src/App.jsx`
  - shell principal de la app
  - navegación entre `Home`, `Protocolos` y `Cálculos`
  - retorno contextual al origen cuando se abre un cálculo desde protocolo
  - agrupación y navegación por especialidad con acordeones
  - render de protocolos mediante `ClinicalFlowTree`
  - no debe contener contenido clínico duplicado de protocolos

- `src/main.jsx`
  - arranque de React
  - registro del `service worker` en producción

- `public/manifest.webmanifest`
  - configuración PWA
  - iconos de instalación
  - `start_url`, `scope` y colores de la app

- `public/sw.js`
  - service worker mínimo para instalación y caché básica del shell

- `src/data/bibliography.js`
  - catálogo bibliográfico
  - estructura común para todas las referencias

- `src/data/modules.js`
  - catálogo/meta de módulos
  - títulos, especialidades, resúmenes, estado de implementación y búsqueda
  - módulos visibles en `Protocolos`
  - agrupación por especialidad
  - actividad reciente
  - bibliografía base usada

- `src/data/protocolFlows.js`
  - fuente visible principal de los protocolos
  - define la estructura clínica renderizada: `Sospecha`, `Pruebas`, `Decisión`, `Tratamiento` y `Destino`
  - adapta los datos heredados al panel clínico compacto
  - integra referencias textuales y calculadoras directas cuando cambian conducta

- `src/data/protocols.js`
  - catálogo clínico/base heredada
  - mantiene metadatos, bibliografía y datos clínicos usados por `protocolFlows.js`
  - no debe competir con `protocolFlows.js` como fuente visible del protocolo

- `src/data/calculators.js`
  - catálogo de cálculos implementados
  - lógica funcional de las calculadoras disponibles
  - incluye calculadoras de dosis integradas cuando una pauta depende de peso, edad o función renal y cambia conducta práctica
  - auditoría completa de escalas detectadas en la obra base

- `src/data/medications.js`
  - apoyo interno para datos farmacológicos
  - uso clínico, dosis, vía, frecuencia, duración, IR, IH y fuentes
  - cuando una pauta usa una ficha CIMA verificada, el nombre del medicamento puede enlazar a esa ficha desde la tarjeta de tratamiento
  - no se muestra como sección principal ni como navegación independiente

- `src/data/imageTemplates.js`
  - auditoría y estructura de plantillas de imagen
  - primera plantilla en desarrollo: `RX tórax sistemática`

- La app no depende de una carpeta pública de PDFs para funcionar; mantiene bibliografía textual verificable.

## Índice funcional del proyecto

### Módulos clínicos

| Módulo | Capítulo | Página real | Estado | Qué existe hoy |
| --- | --- | ---: | --- | --- |
| Fibrilación auricular | Guía ESC 2024 + Cap. 23 | 185 | Creado | Flujo real por `Estabilidad`, `Contexto`, `Conducta` y `Anticoagulación`, con `ESC FA 2024` como referencia principal y Murillo como apoyo práctico. |
| HTA en urgencias | Caps. 32-33 | 246 | Creado | Flujo real para separar urgencia de emergencia hipertensiva, con conducta, tratamiento y bibliografía principal `ESC HTA 2024`. |
| Síndrome coronario agudo | Cap. 26 | 214 | Creado | Flujo real para ECG, hs-cTn, riesgo, reperfusión y antitrombosis, con bibliografía principal `ESC SCA 2023`. |
| Bradicardias | Documento ESC 2021 | 1 | Creado | Guía interactiva de guardia para repercusión clínica, bradicardia sinusal / nodo, bloqueo AV y necesidad de estimulación. |
| Arritmias ventriculares | Documento ESC 2022 | 1 | Creado | Guía interactiva de guardia para TV con pulso o sin pulso, TV monomorfa estable y torsades / TV polimórfica. |
| Insuficiencia cardiaca aguda / EAP | Cap. 19 + ESC IC 2021/2023 | 161 | Creado | Ficha clínica para disnea congestiva, EAP hipertensivo, bajo gasto/shock, VMNI, diurético, nitratos y destino. |
| Ictus isquémico | AHA/ASA 2026 + Cap. 64 | 442 | Creado | Ficha clínica para código ictus, TAC, ventana, trombólisis, trombectomía, PA, NIHSS y destino. |
| Ictus hemorrágico | AHA/ASA 2022 + Cap. 64 | 442 | Creado | Ficha clínica para TAC, PA, reversión de anticoagulación, neurocirugía/UCI e ICH Score. |
| Crisis convulsiva / epilepsia en urgencias | Cap. 63 + SEN/NICE/AES | 435 | Creado | Ficha clínica para crisis autolimitada, primera crisis, crisis provocada, estatus, tratamiento escalonado y destino. |
| Anafilaxia | Cap. 190 + NICE/RCUK | 1059 | Creado | Ficha clínica para diagnóstico clínico, adrenalina IM, soporte, observación y alta segura. |
| Crisis asmática | Cap. 40 + GINA/GEMA | 290 | Creado | Ficha clínica para gravedad, PEF/gasometría si procede, broncodilatadores, corticoide, magnesio y destino. |
| Agudización de EPOC | Cap. 41 + GOLD/GesEPOC | 294 | Creado | Ficha clínica para gasometría, oxígeno controlado, broncodilatadores, corticoide, antibiótico si criterios, VNI y destino. |
| Neumonía adquirida en la comunidad | NICE NG250 2025 + Cap. 42 | 300 | Creado | Flujo real para sospecha, diagnóstico, CRB/CURB-65, destino, antibiótico inicial, revisión IV a 48 h y seguimiento. |
| Sepsis / shock séptico | Cap. 107 + SSC 2021 | 640 | Creado | Ficha clínica para sospecha, lactato/cultivos, antibiótico precoz, fluidoterapia, foco, vasopresor/UCI y destino. |
| Abdomen quirúrgico | Cap. 50 | 340 | Creado | Mini-protocolo de cirugía general para apendicitis, perforación, obstrucción, peritonitis y complicación. |
| Hepatobiliar-pancreático | Cap. 50 | 340 | Creado | Mini-protocolo digestivo para cólico biliar, colecistitis, colangitis, hepatitis y pancreatitis. |
| Dolor urinario | Cap. 50 | 340 | Creado | Mini-protocolo urológico para cólico renal, pielonefritis, ITU complicada, retención y prostatitis. |
| Dolor ginecológico | Cap. 50 | 340 | Creado | Mini-protocolo ginecológico para ectópico, torsión, EPI, quiste complicado y gestación. |
| Dolor vascular | Cap. 50 | 340 | Creado | Mini-protocolo vascular para isquemia mesentérica, aneurisma, disección y embolia visceral. |
| Dolor infeccioso-digestivo | Cap. 50 | 340 | Creado | Mini-protocolo digestivo/infeccioso para gastroenteritis, colitis, diverticulitis y sepsis abdominal. |
| Taquicardia supraventricular | Guía ESC 2019 | 1 | Solo indexado | Referencia preparada para futuro módulo independiente de TSV. |
| Shock | Cap. 18 | 154 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Dolor torácico agudo | Cap. 25 | 207 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Coma | Cap. 62 | 428 | Solo indexado | Tema auditado, sin protocolo operativo. |

### Cálculos / escalas

| Cálculo / escala | Bloque clínico | Página real verificada | Estado | Observaciones |
| --- | --- | ---: | --- | --- |
| Aclaramiento de creatinina (Cockcroft-Gault) | Cap. 5 · Bioquímica sanguínea | 39 | Implementado | Se usa ya para revisar ajuste renal de anticoagulantes en FA. |
| CHA2DS2-VA | Guía ESC 2024 · Fibrilación auricular | 32 | Implementado | Integrado dentro del protocolo FA y también accesible desde `Cálculos`. |
| HAS-BLED | Guía ESC 2024 · Fibrilación auricular | 40 | Implementado | Integrado dentro del protocolo FA para vigilar riesgo hemorrágico y también accesible desde `Cálculos`. |
| CRB-65 | NICE NG250 2025 · Neumonía adquirida en la comunidad | 9 | Implementado | Integrado para orientar riesgo y destino en la valoración inicial de urgencias. |
| CURB-65 | NICE NG250 2025 · Neumonía adquirida en la comunidad | 11 | Implementado | Integrado para orientar riesgo y destino en ámbito hospitalario. |
| Killip | ESC SCA 2023 · Síndrome coronario agudo | — | Implementado | Integrado en la decisión de gravedad/destino de SCA. |
| NIHSS | AHA/ASA 2026 · Ictus isquémico | — | Implementado | Integrado en la decisión de código ictus, gravedad y comunicación clínica. |
| ICH Score | AHA/ASA 2022 · Ictus hemorrágico | — | Implementado | Integra Glasgow, volumen, localización, extensión intraventricular y edad para gravedad inicial. |
| Alvarado | WSES Apendicitis 2020 · Dolor abdominal agudo | — | Implementado | Integrado en abdomen quirúrgico si sospecha apendicitis sin peritonitis franca. |
| BISAP | ACG Pancreatitis 2024 · Pancreatitis aguda | — | Implementado | Integrado en hepatobiliar-pancreático para riesgo de pancreatitis grave. |
| Peso ideal / predicho | Procedimiento VMNI | — | Implementado | Integrado en VMNI para estimar volumen corriente objetivo. |
| Volumen corriente objetivo | Procedimiento VMNI | — | Implementado | Calcula rango de VT a partir de peso predicho y ml/kg. |
| Presión de soporte | Procedimiento VMNI | — | Implementado | Calcula PS = IPAP − EPAP. |
| PaO2/FiO2 | Procedimiento VMNI | — | Implementado | Índice de oxigenación integrado en VMNI. |
| SpO2/FiO2 | Procedimiento VMNI | — | Implementado | Índice aproximado integrado en VMNI, sin sustituir gasometría. |
| Reevaluación VMNI | Procedimiento VMNI | — | Implementado | Compara pH, PaCO2, FR y SatO2 para orientar respuesta a 1-2 h. |
| TFG estimado (CKD-EPI) | Cap. 5 · Bioquímica sanguínea | 39 | Pendiente | Auditado, pero fuera del alcance del primer módulo real. |
| Diferencia alveoloarterial de O2 (∆AaPO2) | Cap. 8 · Gasometría, pulsioximetría y capnografía | 66 | Pendiente | Detectado en bibliografía, no implementado. |
| GRACE | Cap. 26 · Síndrome coronario agudo | 220 | Pendiente | Escala detectada para futuro módulo. |
| Escala de coma de Glasgow | Cap. 62 · Coma | 429 | Pendiente | Detectada, no implementada. |
| Escala de Rankin modificada | Cap. 64 · Ictus | 442 | Pendiente | Detectada, no implementada. |
| Escala de Cincinnati | Cap. 64 · Ictus | 446 | Pendiente | Detectada, no implementada. |
| qSOFA / SOFA | Cap. 107 · Sepsis | 640 | Pendiente | Detectadas, no implementadas. |
| Modelo de Wells para TVP | Cap. 36 · Enfermedad tromboembólica venosa | 261 | No aplicable por ahora | Queda fuera del alcance actual. |
| Modelo de Wells para TEP | Cap. 39 · Tromboembolia pulmonar | 278 | No aplicable por ahora | Queda fuera del alcance actual. |
| PESI / sPESI | Cap. 39 · Tromboembolia pulmonar | 281 | No aplicable por ahora | Queda fuera del alcance actual. |
| Glasgow-Blatchford | Cap. 48 · Hemorragia digestiva alta | 329 | No aplicable por ahora | Queda fuera del alcance actual. |

### Fichas farmacológicas activas

| Fármaco | Familia | Módulo | Estado | Fuente principal |
| --- | --- | --- | --- | --- |
| Metoprolol | Control de frecuencia | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Verapamilo | Control de frecuencia | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Digoxina | Control de frecuencia | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Amiodarona | Control de frecuencia y ritmo | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Apixabán | Anticoagulación | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Dabigatrán | Anticoagulación | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Edoxabán | Anticoagulación | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Rivaroxabán | Anticoagulación | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Acenocumarol | Puente o AVK | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Enoxaparina | Puente o AVK | Fibrilación auricular | Implementado | ESC FA 2024 + CIMA + Murillo 7.ª ed. |
| Adenosina | TSV · conversión aguda | Taquicardia supraventricular | Implementado | ESC TSV 2019 + CIMA. |
| Atropina | Bradicardia sintomática | Bradicardias | Implementado | ESC Bradicardias 2021 + CIMA. |
| Amiodarona IV | QRS ancho / TV | Arritmias ventriculares | Implementado | ESC Arritmias ventriculares 2022 + CIMA. |
| Sulfato de magnesio IV | TV polimórfica / torsades | Arritmias ventriculares | Implementado | ESC Arritmias ventriculares 2022 + Murillo 7.ª ed. |
| Salbutamol | Broncodilatador SABA | Crisis asmática | Implementado | Murillo 7.ª ed. + GINA/GEMA + CIMA. |
| Bromuro de ipratropio | Broncodilatador SAMA | Crisis asmática | Implementado | Murillo 7.ª ed. + GEMA + CIMA. |
| Prednisona | Corticoide sistémico | Crisis asmática | Implementado | Murillo 7.ª ed. + GINA + CIMA. |
| Hidrocortisona | Corticoide IV | Crisis asmática | Implementado | Murillo 7.ª ed. + CIMA. |
| Sulfato de magnesio IV | Rescate broncodilatador | Crisis asmática | Implementado | Murillo 7.ª ed. + GINA + CIMA. |
| Salbutamol | Broncodilatador SABA | Agudización de EPOC | Implementado | Murillo 7.ª ed. + GOLD + CIMA. |
| Bromuro de ipratropio | Broncodilatador SAMA | Agudización de EPOC | Implementado | Murillo 7.ª ed. + GesEPOC + CIMA. |
| Prednisona | Corticoide sistémico | Agudización de EPOC | Implementado | Murillo 7.ª ed. + GOLD + CIMA. |
| Metilprednisolona | Corticoide IV | Agudización de EPOC | Implementado | Murillo 7.ª ed. + CIMA. |
| Amoxicilina/ácido clavulánico | Antibiótico | Agudización de EPOC | Implementado | Murillo 7.ª ed. + GesEPOC + CIMA. |
| Azitromicina | Antibiótico macrólido | Agudización de EPOC | Implementado | Murillo 7.ª ed. + CIMA. |
| Levofloxacino | Antibiótico fluoroquinolona | Agudización de EPOC | Implementado | Murillo 7.ª ed. + CIMA. |
| Ceftriaxona | Antibiótico IV | Agudización de EPOC | Implementado | Murillo 7.ª ed. + CIMA. |

### Plantillas de imagen

| Plantilla | Bibliografía base | Ubicación real | Estado | Observaciones |
| --- | --- | --- | --- | --- |
| RX tórax sistemática | Murillo 7.ª ed. · Cap. 10 Radiografía de tórax | `src/data/imageTemplates.js` | En desarrollo | Solo existe la estructura de plantilla. No se ha añadido una secuencia diagnóstica completa porque la bibliografía específica de radiología no está en el repo. |

### Bibliografía base usada

| Fuente | Estado | Observaciones |
| --- | --- | --- |
| *Guía ESC 2024 sobre el manejo de la fibrilación auricular* | Activa · principal en FA | Referencia textual principal del protocolo de FA. |
| *Guía ESC 2024 sobre el manejo de la presión arterial elevada y la hipertensión* | Activa · principal en HTA | Referencia textual principal del protocolo de HTA en urgencias. |
| *Guía ESC 2023 sobre el diagnóstico y tratamiento de los síndromes coronarios agudos* | Activa · principal en IAM/SCA | Referencia textual principal del protocolo de IAM / SCA. |
| *Guía ESC 2021 para el diagnóstico y tratamiento de la insuficiencia cardiaca aguda y crónica* | Activa · principal en ICA/EAP | Referencia textual principal del protocolo de insuficiencia cardiaca aguda / edema agudo de pulmón. |
| *Actualización focalizada ESC 2023 sobre insuficiencia cardiaca* | Activa · corroboración ICA/EAP | Referencia textual de actualización del marco ESC de insuficiencia cardiaca. |
| *Guía ESC 2019 sobre el tratamiento de pacientes con taquicardia supraventricular* | Activa · principal en TSV | Referencia textual actual para TSV, pendiente de módulo independiente. |
| *Comentarios a la guía ESC 2021 sobre estimulación cardiaca y terapia de resincronización* | Activa · principal en bradicardias | Referencia textual del módulo de `Bradicardias`. |
| *Comentarios a la guía ESC 2022 sobre arritmias ventriculares y prevención de muerte súbita* | Activa · principal en arritmias ventriculares | Referencia textual del módulo de `Arritmias ventriculares`. |
| *NICE NG250: Neumonía: diagnóstico y manejo* | Activa · principal en neumonía | Referencia textual actualizada para diagnóstico, destino, antibiótico, reevaluación y seguimiento de NAC. |
| *Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición* | Activa · base práctica | Obra base textual auditada y usada por la app. |
| *WSES Jerusalem guidelines 2020: diagnóstico y tratamiento de la apendicitis aguda* | Activa · corroboración quirúrgica | Referencia textual para abdomen quirúrgico. |
| *WSES 2020: manejo de la diverticulitis colónica aguda en urgencias* | Activa · corroboración digestivo-infecciosa | Referencia textual para diverticulitis y dolor infeccioso-digestivo. |
| *American College of Gastroenterology guideline 2024: manejo de la pancreatitis aguda* | Activa · corroboración digestiva | Referencia textual para dolor hepatobiliar-pancreático. |
| *EAU Guidelines on Urolithiasis, edición 2025* | Activa · corroboración urológica | Referencia textual para cólico renal y dolor de flanco. |
| *EAU Guidelines on Urological Infections, edición 2025* | Activa · corroboración urológica | Referencia textual para pielonefritis, ITU complicada y obstrucción infectada. |
| *ACOG Practice Bulletin No. 193: Tubal Ectopic Pregnancy, 2018; reafirmado 2025* | Activa · corroboración ginecológica | Referencia textual para dolor pélvico con sospecha de ectópico. |
| *Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021* | Activa · corroboración sepsis | Referencia textual para sepsis, shock y deterioro abdominal. |
| *Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention, 2025* | Activa · corroboración asma | Referencia textual para exacerbaciones asmáticas, gravedad y tratamiento inicial. |
| *Guía Española para el Manejo del Asma* | Activa · corroboración asma | Referencia textual española para clasificación y manejo de crisis asmática. |
| *Global Initiative for Chronic Obstructive Lung Disease. Global Strategy for Diagnosis, Management, and Prevention of COPD, 2025* | Activa · corroboración EPOC | Referencia textual para exacerbaciones, oxígeno, corticoide, antibiótico y soporte ventilatorio. |
| *GesEPOC 2021: guía española de la EPOC. Diagnóstico y tratamiento del síndrome de agudización* | Activa · corroboración EPOC | Referencia textual española para diagnóstico y tratamiento de la agudización. |
| *Philips Respironics V60/V60 Plus. Manual de usuario* | Local · no público | Fuente técnica local para modos, circuito, mascarilla/puerto, alarmas, fugas y Auto-Trak. El PDF queda en `.local-biblio/` y no se enlaza desde la app. |
| *Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure* | Activa · corroboración VMNI | Referencia textual para indicaciones y seguimiento de VMNI en insuficiencia respiratoria aguda. |
| *Documento español de consenso sobre soporte respiratorio no invasivo y terapia de alto flujo* | Activa · corroboración VMNI | Referencia textual para seguridad, organización y monitorización del soporte respiratorio no invasivo. |

## Índice clínico comprobado

### Convención de páginas

- `Página índice`: numeración mostrada en el índice del libro
- `Página real`: numeración impresa verificada sobre el contenido real
- `Página PDF histórica`: dato interno de auditoría anterior; no se usa para enlazar PDFs en la app pública

### Patologías / temas auditados

| Tema | Capítulo | Página índice | Página real verificada | Página PDF histórica | Estado | Observaciones |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Fibrilación y flúter auriculares | Cap. 23 | 184 | 185 | 210 | Implementado | El índice adelanta el capítulo una página; el arranque útil real está en p. 185. |
| Soporte vital básico en adultos | Cap. 1 | 2 | 2 | 27 | Auditado | Sin discrepancia. |
| Soporte vital avanzado en adultos | Cap. 2 | 7 | 7 | 32 | Auditado | Sin discrepancia. |
| Gasometría, pulsioximetría y capnografía | Cap. 8 | 64 | 64 | 89 | Auditado | Sin discrepancia. |
| Electrocardiografía de urgencias | Cap. 9 | 71 | 71 | 96 | Auditado | Sin discrepancia. |
| Radiografía de tórax | Cap. 10 | 83 | 83 | 108 | Auditado | Sin discrepancia. |
| Ecografía | Cap. 12 | 108 | 108 | 133 | Auditado | Sin discrepancia. |
| Shock | Cap. 18 | 154 | 154 | 179 | Auditado | El arranque conceptual está en la página indexada; el rótulo se repite en la siguiente. |
| Insuficiencia cardíaca | Cap. 19 | 161 | 161 | 186 | Auditado | Sin discrepancia. |
| Dolor torácico agudo | Cap. 25 | 207 | 207 | 232 | Auditado | El contenido arranca en la página indexada. |
| Síndrome coronario agudo | Cap. 26 | 214 | 214 | 239 | Auditado | El arranque conceptual está en la página indexada; el rótulo del capítulo aparece a continuación. |
| Dolor abdominal agudo | Cap. 50 | 340 | 340 | 365 | Auditado | Capítulo base; los protocolos operativos se dividen por escenario clínico y especialidad. |
| Náuseas, vómitos y diarrea | Cap. 51 | 358 | 358 | 383 | Auditado | Sin discrepancia. |
| Coma | Cap. 62 | 428 | 428 | 453 | Auditado | El arranque conceptual está en la página indexada; el rótulo del capítulo aparece en la siguiente. |
| Crisis epilépticas | Cap. 63 | 435 | 435 | 460 | Auditado | Sin discrepancia. |
| Ictus | Cap. 64 | 442 | 442 | 467 | Auditado | El arranque conceptual está en la página indexada; el rótulo del capítulo aparece en la siguiente. |
| Sepsis | Cap. 107 | 640 | 640 | 665 | Auditado | Sin discrepancia. |
| Ataque de asma | Cap. 40 | 290 | 290 | 315 | Implementado | Crisis asmática integrada como ficha clínica respiratoria. |
| EPOC agudizada | Cap. 41 | 294 | 294 | 319 | Implementado | Agudización de EPOC integrada como ficha clínica respiratoria. |

## Bitácora del proyecto

| Fecha | Cambio realizado | Sección afectada | Breve explicación |
| --- | --- | --- | --- |
| 2026-04-30 | Dolor abdominal por especialidades y bibliografía textual | Protocolos / bibliografía | Se eliminó la entrada transversal; cada tipo de dolor abdominal queda en su especialidad y la app deja de enlazar PDFs públicos. |
| 2026-04-29 | Dolor abdominal dividido por especialidad | Protocolos / Digestivo / Cirugía / Urología / Ginecología / Vascular | Se retiró el mapa único y se sustituyó por protocolos breves de guardia: clínica, diagnóstico, pruebas, tratamiento, destino y seguimiento. |
| 2026-04-28 | Protocolo de neumonía adquirida en la comunidad | Protocolos / bibliografía / cálculos | Se añadió NAC con NICE NG250 2025 como fuente principal actualizada, Murillo cap. 42 como base y CRB-65/CURB-65 para decisión de destino. |
| 2026-04-24 | FA como guía principal y protocolos por especialidad | Protocolos / bibliografía / cálculos | Se indexó `ESC FA 2024`, se pasó FA a `CHA2DS2-VA`, se revisó el flujo clínico y se agrupó la lista de protocolos por especialidad. |
| 2026-04-24 | Reindexación bibliográfica de HTA e IAM/SCA | Bibliografía / protocolos / medicamentos | Se añadieron `ESC HTA 2024` y `ESC SCA 2023` como referencias principales reales, se ajustaron enlaces y se revisó el contenido clínico relacionado. |
| 2026-04-05 | Montaje base del proyecto | Base técnica | Se creó la app con `Vite + React + Tailwind` y se dejó lista para build estático. |
| 2026-04-05 | Preparación de despliegue inicial | Infraestructura | Se configuró el primer despliegue estático. GitHub Pages ya no es el despliegue activo. |
| 2026-04-05 | Revisión de jerarquía visual | Home / shell | Se compactó la interfaz y se eliminó parte del aspecto de demo o dashboard genérico. |
| 2026-04-05 | Auditoría bibliográfica inicial | Bibliografía / datos | Se separaron `página índice`, `página real` y `página PDF` para no enlazar capítulos de forma errónea. |
| 2026-04-05 | Simplificación de la home | Home | Se rebajó el peso visual del libro y se dejó la bibliografía accesible sin dominar la interfaz. |
| 2026-04-05 | Construcción del primer protocolo real | Protocolos | Se creó el módulo clínico de `fibrilación auricular`. |
| 2026-04-05 | Integración de cálculos del protocolo | Protocolos / cálculos | Se implementaron `CHA2DS2-VASc`, `HAS-BLED` y `Cockcroft-Gault` y se enlazaron al flujo FA. |
| 2026-04-05 | Creación de fichas farmacológicas | Medicamentos | Se añadieron fichas completas del módulo FA con base principal en `CIMA AEMPS`. |
| 2026-04-05 | Ajuste de navegación móvil | Protocolo FA / shell | Se redujo el scroll, se compactaron bloques y se evitó desbordamiento horizontal. |
| 2026-04-05 | Primera bitácora del proyecto | README | Se documentó la evolución por fases para evitar que el repositorio quedara sin trazabilidad funcional. |
| 2026-04-05 | Reestructuración del README como documento vivo | README | Se rehízo el `README` para reflejar arquitectura, índice funcional, bibliografía y pendientes reales. |
| 2026-04-05 | Rearquitectura móvil de navegación | Home / Protocolos / módulo FA | La app pasó a abrir siempre en `Home`, se creó una pantalla propia de `Protocolos` y FA se dividió en subpantallas breves para reducir scroll. |
| 2026-04-05 | Corrección de icono PWA | PWA / branding | Se unificó el icono interno y externo y se añadieron `manifest`, `apple-touch-icon` y `service worker` para que la instalación use icono real. |
| 2026-05-18 | Protocolo de crisis convulsiva / epilepsia | Neurología / Urgencias | Se implementó como ficha clínica activa con diagnóstico, pruebas, decisión, tratamiento escalonado, destino, CIMA y bibliografía textual. |
| 2026-05-18 | Anafilaxia y dosis calculadas | Urgencias / cálculos / medicamentos | Se añadió Anafilaxia y calculadoras directas para adrenalina IM, antiepilépticos, FA, SCA, alteplasa en ictus y heparina vascular cuando dependen del peso. |
| 2026-05-18 | Crisis asmática | Respiratorio / medicamentos | Se añadió Asma como protocolo independiente con gravedad, pruebas útiles, broncodilatadores, corticoide precoz, magnesio y destino. |
| 2026-05-18 | Agudización de EPOC | Respiratorio / medicamentos | Se añadió EPOC como protocolo independiente con gasometría, oxígeno controlado, broncodilatadores, corticoide, antibiótico si criterios y VNI. |
| 2026-05-18 | Procedimientos y VMNI | Procedimientos / cálculos | Se añadió la sección Procedimientos, el procedimiento VMNI, calculadoras técnicas y enlaces desde Asma/EPOC. |

## Pendiente

### Pendiente funcional

- Hacer que la búsqueda evolucione de filtro simple a entrada clínica más útil.
- Seguir aligerando vistas si aparecen nuevas tarjetas o contenedores anidados.
- Mantener la regla de no implementar cálculos fuera de contexto de módulo.
- Mantener Medicamentos como soporte interno, sin reactivarlo como sección principal.

### Pendiente clínico

- Desarrollar protocolos reales para temas aún solo auditados, como `shock`, `dolor torácico agudo`, `coma` o `taquicardia supraventricular`.
- Mantener en cada nuevo protocolo la misma conexión entre decisión clínica, cálculos, medicación y bibliografía.
- Evitar siempre que la interfaz prometa una funcionalidad aún no implementada.
- Mantener el foco exclusivo de urgencias: lo ambulatorio solo como alta, continuidad, revisión o signos de alarma.

### Pendiente bibliográfico

- Incorporar al repo la nueva bibliografía específica de radiología cuando exista realmente en el workspace.
- Indexar esa nueva fuente con páginas verificadas, no asumidas.
- Completar la plantilla `RX tórax sistemática` solo cuando la fuente radiológica esté disponible y auditada.

## Requisitos

- Node.js 20+
- npm 10+

## Desarrollo local

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4174
```

Abrir `http://localhost:4174`.

## Build de producción

```bash
npm run build
```

La salida queda en `dist/`.

## Publicación en Vercel

GitHub Pages está desactivado y no debe usarse como despliegue público. El despliegue público principal es Vercel:

`https://nexo-clx.vercel.app/`

Flujo mínimo:

```bash
git add .
git commit -m "Tu cambio"
git push origin main
```

Vercel despliega automáticamente la rama `main`. GitHub Actions mantiene solo CI de build.
