# NexoClx

NexoClx es una app web estática para consulta clínica inicial basada en bibliografía real de urgencias.  
Su objetivo no es replicar un libro en pantalla, sino convertir capítulos auditados en módulos rápidos de uso clínico, conectando protocolo, cálculos, medicación y referencia bibliográfica verificable.

## README vivo

Este `README` es el índice maestro del proyecto.  
Cada cambio relevante en interfaz, navegación, módulos clínicos, cálculos, fichas farmacológicas, bibliografía o plantillas debe reflejarse aquí.

Debe mantenerse actualizado en cuatro capas:

- estructura funcional real de la app
- índice de lo implementado, lo auditado y lo pendiente
- relación entre protocolos, cálculos, medicamentos y bibliografía
- bitácora acumulativa de cambios relevantes

## Qué es NexoClx

NexoClx busca ofrecer una interfaz clínica breve, usable en móvil y basada en fuentes reales. La app parte de bibliografía auditada y avanza módulo por módulo.

Principios actuales del proyecto:

- interfaz compacta y directa
- contenido clínico solo cuando está verificado
- bibliografía presente, pero no dominante
- cálculos implementados solo cuando un módulo real los necesita
- fichas farmacológicas con fuente explícita
- navegación contextual entre protocolo, cálculo y medicación

## Estado actual

- Home simplificada a: `buscador` + `especialidades`, sin bloques duplicados ni accesos rápidos redundantes.
- Pantalla propia de `Especialidades` con acordeones por bloque clínico para evitar una lista plana interminable.
- Protocolos reales operativos: `fibrilación auricular`, `HTA en urgencias`, `síndrome coronario agudo`, `bradicardias`, `arritmias ventriculares`, `ictus isquémico`, `ictus hemorrágico` y `neumonía adquirida en la comunidad`.
- Cálculos activos: `CHA2DS2-VA`, `HAS-BLED`, `Cockcroft-Gault`, `CRB-65` y `CURB-65`.
- Fichas farmacológicas activas para FA, HTA, SCA, arritmias agudas e ictus enlazadas desde protocolo y desde `Medicamentos`.
- Icono unificado dentro y fuera de la app, con `manifest` web, `apple-touch-icon` y `service worker` para instalación PWA.
- Bibliografía activa: `ESC FA 2024` como referencia principal de FA, `ESC HTA 2024` como referencia principal de HTA, `ESC SCA 2023` como referencia principal de IAM/SCA, `ESC TSV 2019`, `ESC Bradicardias 2021` y `ESC Arritmias ventriculares 2022` como referencias principales indexadas de sus módulos, `AHA/ASA ictus isquémico` como referencia principal del módulo de ictus isquémico, `AHA/ASA ictus hemorrágico 2022` como referencia principal del módulo de ictus hemorrágico, `NICE NG250 2025` como referencia principal de neumonía, y `Murillo 7.ª ed.` como obra base general y apoyo práctico.
- Plantilla de imagen inicial creada solo como estructura: `RX tórax sistemática`.
- Despliegue activo en GitHub Pages: `https://olsanju-hub.github.io/NexoClx/`.

## Estructura funcional de la app

### Secciones actuales

| Sección | Estado | Función real hoy | Relación con el resto |
| --- | --- | --- | --- |
| Home | Activa | Punto de entrada mínimo con `buscador` y rejilla de `especialidades`. | Lleva a la especialidad o al resultado buscado sin pasos intermedios ni bloques redundantes. |
| Especialidades | Activa | Índice clínico principal con acordeones por bloque y recursos relacionados. | Abre protocolo real, cálculo relacionado, medicamento relacionado o fuente principal desde la misma especialidad. |
| Módulo FA | Activo | Flujo clínico dividido en `Estabilidad`, `Contexto`, `Conducta` y `Anticoagulación`. | Embebe o enlaza cálculos, medicación y fuente principal sin saturar una sola pantalla. |
| Módulo de bradicardias | Activo | Flujo breve para repercusión, bradicardia sinusal / nodo, bloqueo AV y necesidad de pacing. | Embebe atropina y procedimiento de marcapasos transcutáneo cuando cambia la conducta. |
| Módulo de arritmias ventriculares | Activo | Flujo breve para pulso, inestabilidad, TV monomorfa y torsades / TV polimórfica. | Embebe amiodarona IV, magnesio IV y electricidad urgente cuando corresponde. |
| Módulos de ictus | Activos | `Ictus isquémico` e `ictus hemorrágico` con flujo corto de ventana, imagen, reperfusión, PA y reversión. | Quedan agrupados en `Neurología` y enlazan medicación y fuente principal. |
| Cálculos | Activa | Agrupa cálculos implementados y muestra auditoría de pendientes. | Los cálculos activos también se abren desde el protocolo. |
| Medicamentos | Activa | Reúne fichas farmacológicas completas del módulo activo. | Cada ficha puede abrirse desde el protocolo y volver a él. |
| Bibliografía | Activa | Da acceso a la obra base y a referencias estructuradas. | Cada módulo guarda sus referencias y páginas verificadas. |
| Plantillas de imagen | En desarrollo | Solo existe la estructura inicial para `RX tórax sistemática`. | Quedará conectada a bibliografía específica cuando esa fuente esté en el repo. |

### Lógica de navegación entre módulos

1. La `Home` funciona como entrada principal.
2. Desde `Home` se entra directamente a una `especialidad` o a un resultado concreto del `buscador`.
3. La pantalla `Especialidades` agrupa los módulos por bloque clínico y muestra recursos relacionados para que el crecimiento no se convierta en una lista plana.
4. Al abrir `fibrilación auricular`, la navegación prioriza vistas cortas y no una página continua.
5. Los módulos de `ictus` entran por `Neurología` y se resuelven como flujo corto de manejo urgente, no como capítulo de estudio.
6. Desde el protocolo se puede abrir un cálculo concreto o una ficha farmacológica concreta.
7. Si un cálculo o un medicamento se abre desde el protocolo, la interfaz conserva botón claro de retorno al protocolo y a la subsección de origen.
8. Los mismos cálculos siguen existiendo en la sección general de `Cálculos`.
9. Las mismas fichas siguen existiendo en la sección general de `Medicamentos`.
10. La bibliografía se mantiene accesible desde cabecera y dentro del protocolo como acceso secundario.

### Cómo se conectan los módulos

- `Home` prioriza navegación, no lectura.
- `Especialidades` es la puerta de entrada a módulos clínicos concretos.
- `Módulo FA` ya no se resuelve como pantalla única; se reparte en subpantallas cortas.
- `Módulos de ictus` siguen la misma lógica: dato clave, clasificación, conducta y tratamiento.
- `Cálculos` solo se implementan cuando un protocolo real los necesita.
- `Medicamentos` se construyen a partir de los fármacos realmente usados en un protocolo activo.
- `Bibliografía` no vive como texto suelto al final: cada módulo guarda referencias estructuradas.
- `Plantillas` siguen una lógica paralela: estructura, fuente base y estado de desarrollo.

### Integración de la bibliografía en cada módulo

Cada módulo puede enlazar una o varias referencias estructuradas. La app distingue:

- `Página índice`: página declarada por el índice del libro
- `Página real`: página verificada donde empieza de verdad el contenido útil
- `Página PDF`: página física del archivo usada para `#page=`

Cada referencia guarda:

- `referenceId`
- `filePath`
- `indexPages`
- `verifiedPages`
- `pdfPages`
- `href`
- `internalId`
- `note`

La interfaz prioriza `verifiedPages` para mostrar la ubicación real del contenido y usa `pdfPages` solo para construir el enlace al PDF cuando hace falta.

## Estructura técnica actual

- `src/App.jsx`
  - shell principal de la app
  - navegación entre `Home`, `Especialidades`, `Cálculos` y `Medicamentos`
  - retorno contextual al origen cuando se abre cálculo o fármaco desde protocolo
  - agrupación y navegación por especialidad con acordeones
  - control de subpantallas cortas dentro del módulo de `fibrilación auricular`
  - flujos operativos de `bradicardias` y `arritmias ventriculares`
  - flujos operativos de `ictus isquémico` e `ictus hemorrágico`

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
  - generador de enlaces al PDF
  - estructura común para todas las referencias

- `src/data/modules.js`
  - índice clínico auditado
  - módulos visibles en `Protocolos`
  - agrupación por especialidad
  - actividad reciente
  - bibliografía base usada

- `src/data/protocols.js`
  - protocolos clínicos reales
  - actualmente contiene `fibrilación auricular`, `HTA en urgencias`, `síndrome coronario agudo`, `bradicardias`, `arritmias ventriculares`, `ictus isquémico` e `ictus hemorrágico`

- `src/data/calculators.js`
  - catálogo de cálculos implementados
  - auditoría completa de escalas detectadas en la obra base

- `src/data/medications.js`
  - fichas farmacológicas del módulo activo
  - uso clínico, dosis, vía, frecuencia, duración, IR, IH y fuentes

- `src/data/imageTemplates.js`
  - auditoría y estructura de plantillas de imagen
  - primera plantilla en desarrollo: `RX tórax sistemática`

- `public/biblio/urgencias-murillo-7ma.pdf`
  - obra base activa auditada y enlazada por la app

- `public/biblio/HTA 2024.pdf`
  - guía principal actual para `HTA en urgencias`

- `public/biblio/SCA 2023.pdf`
  - guía principal actual para `IAM / síndrome coronario agudo`

- `public/biblio/FA 2024.pdf`
  - guía principal actual para `fibrilación auricular`

- `public/biblio/TSV 2019.pdf`
  - guía principal actual indexada para `TSV`

- `public/biblio/est car 2021.pdf`
  - documento principal actual indexado para `bradicardias`

- `public/biblio/ arritmias ventriculares y la prevención de la muerte cardiaca súbita 2022.pdf`
  - documento principal actual indexado para `arritmias ventriculares`

## Índice funcional del proyecto

### Módulos clínicos

| Módulo | Capítulo | Página real | Estado | Qué existe hoy |
| --- | --- | ---: | --- | --- |
| Fibrilación auricular | Guía ESC 2024 + Cap. 23 | 185 | Creado | Flujo real por `Estabilidad`, `Contexto`, `Conducta` y `Anticoagulación`, con `ESC FA 2024` como referencia principal y Murillo como apoyo práctico. |
| HTA en urgencias | Caps. 32-33 | 246 | Creado | Flujo real para separar urgencia de emergencia hipertensiva, con conducta, tratamiento y bibliografía principal `ESC HTA 2024`. |
| Síndrome coronario agudo | Cap. 26 | 214 | Creado | Flujo real para ECG, hs-cTn, riesgo, reperfusión y antitrombosis, con bibliografía principal `ESC SCA 2023`. |
| Bradicardias | Documento ESC 2021 | 1 | Creado | Guía interactiva de guardia para repercusión clínica, bradicardia sinusal / nodo, bloqueo AV y necesidad de estimulación. |
| Arritmias ventriculares | Documento ESC 2022 | 1 | Creado | Guía interactiva de guardia para TV con pulso o sin pulso, TV monomorfa estable y torsades / TV polimórfica. |
| Neumonía adquirida en la comunidad | NICE NG250 2025 + Cap. 42 | 300 | Creado | Flujo real para sospecha, diagnóstico, CRB/CURB-65, destino, antibiótico inicial, revisión IV a 48 h y seguimiento. |
| Insuficiencia cardiaca | Cap. 19 | 161 | Solo indexado | Tema auditado para futura integración del protocolo de `ICC`. |
| Taquicardia supraventricular | Guía ESC 2019 | 1 | Solo indexado | Referencia preparada para futuro módulo independiente de TSV. |
| Shock | Cap. 18 | 154 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Dolor torácico agudo | Cap. 25 | 207 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Ictus | Cap. 64 | 442 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Sepsis | Cap. 107 | 640 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Coma | Cap. 62 | 428 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Dolor abdominal agudo | Cap. 50 | 340 | Solo indexado | Tema auditado, sin protocolo operativo. |

### Cálculos / escalas

| Cálculo / escala | Bloque clínico | Página real verificada | Estado | Observaciones |
| --- | --- | ---: | --- | --- |
| Aclaramiento de creatinina (Cockcroft-Gault) | Cap. 5 · Bioquímica sanguínea | 39 | Implementado | Se usa ya para revisar ajuste renal de anticoagulantes en FA. |
| CHA2DS2-VA | Guía ESC 2024 · Fibrilación auricular | 32 | Implementado | Integrado dentro del protocolo FA y también accesible desde `Cálculos`. |
| HAS-BLED | Guía ESC 2024 · Fibrilación auricular | 40 | Implementado | Integrado dentro del protocolo FA para vigilar riesgo hemorrágico y también accesible desde `Cálculos`. |
| CRB-65 | NICE NG250 2025 · Neumonía adquirida en la comunidad | 9 | Implementado | Integrado para orientar riesgo y destino en atención inicial / ámbito ambulatorio. |
| CURB-65 | NICE NG250 2025 · Neumonía adquirida en la comunidad | 11 | Implementado | Integrado para orientar riesgo y destino en ámbito hospitalario. |
| TFG estimado (CKD-EPI) | Cap. 5 · Bioquímica sanguínea | 39 | Pendiente | Auditado, pero fuera del alcance del primer módulo real. |
| Diferencia alveoloarterial de O2 (∆AaPO2) | Cap. 8 · Gasometría, pulsioximetría y capnografía | 66 | Pendiente | Detectado en bibliografía, no implementado. |
| GRACE | Cap. 26 · Síndrome coronario agudo | 220 | Pendiente | Escala detectada para futuro módulo. |
| Clase Killip | Cap. 26 · Síndrome coronario agudo | 220 | Pendiente | Clasificación detectada para futuro módulo. |
| Escala de Alvarado modificada | Cap. 50 · Dolor abdominal agudo | 349 | Pendiente | Detectada, no implementada. |
| Escala de coma de Glasgow | Cap. 62 · Coma | 429 | Pendiente | Detectada, no implementada. |
| NIHSS | Cap. 64 · Ictus | 446 | Pendiente | Detectada, no implementada. |
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

### Plantillas de imagen

| Plantilla | Bibliografía base | Ubicación real | Estado | Observaciones |
| --- | --- | --- | --- | --- |
| RX tórax sistemática | Murillo 7.ª ed. · Cap. 10 Radiografía de tórax | `src/data/imageTemplates.js` | En desarrollo | Solo existe la estructura de plantilla. No se ha añadido una secuencia diagnóstica completa porque la bibliografía específica de radiología no está en el repo. |

### Bibliografía base usada

| Fuente | Ubicación | Estado | Observaciones |
| --- | --- | --- | --- |
| *Guía ESC 2024 sobre el manejo de la fibrilación auricular* | `public/biblio/FA 2024.pdf` | Activa · principal en FA | Referencia principal actual del protocolo de FA. |
| *Guía ESC 2024 sobre el manejo de la presión arterial elevada y la hipertensión* | `public/biblio/HTA 2024.pdf` | Activa · principal en HTA | Referencia principal actual del protocolo de HTA en urgencias. |
| *Guía ESC 2023 sobre el diagnóstico y tratamiento de los síndromes coronarios agudos* | `public/biblio/SCA 2023.pdf` | Activa · principal en IAM/SCA | Referencia principal actual del protocolo de IAM / SCA. |
| *Guía ESC 2019 sobre el tratamiento de pacientes con taquicardia supraventricular* | `public/biblio/TSV 2019.pdf` | Activa · principal en TSV | Referencia principal actual para TSV, pendiente de módulo independiente. |
| *Comentarios a la guía ESC 2021 sobre estimulación cardiaca y terapia de resincronización* | `public/biblio/est car 2021.pdf` | Activa · principal en bradicardias | Referencia principal del módulo de `Bradicardias`. |
| *Comentarios a la guía ESC 2022 sobre el tratamiento de pacientes con arritmias ventriculares y la prevención de la muerte cardiaca súbita* | `public/biblio/ arritmias ventriculares y la prevención de la muerte cardiaca súbita 2022.pdf` | Activa · principal en arritmias ventriculares | Referencia principal del módulo de `Arritmias ventriculares`. |
| *NICE NG250: Neumonía: diagnóstico y manejo* | `public/biblio/neumonia-nice-ng250-2025.pdf` | Activa · principal en neumonía | Referencia principal actualizada para diagnóstico, destino, antibiótico, reevaluación y seguimiento de NAC. |
| *Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición* | `public/biblio/urgencias-murillo-7ma.pdf` | Activa | Obra base auditada y usada por la app. |
| Bibliografía específica de radiología | No detectada en este workspace | No disponible en workspace | Sigue pendiente de incorporación real al repositorio. |

## Índice clínico comprobado

### Convención de páginas

- `Página índice`: numeración mostrada en el índice del libro
- `Página real`: numeración impresa verificada sobre el contenido real
- `Página PDF`: página física del archivo para construir enlaces `#page=`

### Patologías / temas auditados

| Tema | Capítulo | Página índice | Página real verificada | Página PDF | Estado | Observaciones |
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
| Dolor abdominal agudo | Cap. 50 | 340 | 340 | 365 | Auditado | El contenido arranca en la página indexada. |
| Náuseas, vómitos y diarrea | Cap. 51 | 358 | 358 | 383 | Auditado | Sin discrepancia. |
| Coma | Cap. 62 | 428 | 428 | 453 | Auditado | El arranque conceptual está en la página indexada; el rótulo del capítulo aparece en la siguiente. |
| Crisis epilépticas | Cap. 63 | 435 | 435 | 460 | Auditado | Sin discrepancia. |
| Ictus | Cap. 64 | 442 | 442 | 467 | Auditado | El arranque conceptual está en la página indexada; el rótulo del capítulo aparece en la siguiente. |
| Sepsis | Cap. 107 | 640 | 640 | 665 | Auditado | Sin discrepancia. |

## Bitácora del proyecto

| Fecha | Cambio realizado | Sección afectada | Breve explicación |
| --- | --- | --- | --- |
| 2026-04-28 | Protocolo de neumonía adquirida en la comunidad | Protocolos / bibliografía / cálculos | Se añadió NAC con NICE NG250 2025 como fuente principal actualizada, Murillo cap. 42 como base y CRB-65/CURB-65 para decisión de destino. |
| 2026-04-24 | FA como guía principal y protocolos por especialidad | Protocolos / bibliografía / cálculos | Se indexó `ESC FA 2024`, se pasó FA a `CHA2DS2-VA`, se revisó el flujo clínico y se agrupó la lista de protocolos por especialidad. |
| 2026-04-24 | Reindexación bibliográfica de HTA e IAM/SCA | Bibliografía / protocolos / medicamentos | Se añadieron `ESC HTA 2024` y `ESC SCA 2023` como referencias principales reales, se ajustaron enlaces y se revisó el contenido clínico relacionado. |
| 2026-04-05 | Montaje base del proyecto | Base técnica | Se creó la app con `Vite + React + Tailwind` y se dejó lista para build estático. |
| 2026-04-05 | Preparación de despliegue | Infraestructura | Se configuró publicación continua en GitHub Pages. |
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

## Pendiente

### Pendiente funcional

- Construir el siguiente protocolo real a partir de los temas ya auditados después de FA, HTA y SCA.
- Hacer que la búsqueda evolucione de filtro simple a entrada clínica más útil.
- Seguir ampliando `Medicamentos` hacia los próximos módulos clínicos reales.
- Mantener la regla de no implementar cálculos fuera de contexto de módulo.

### Pendiente clínico

- Desarrollar protocolos reales para `sepsis`, `shock` o `ICC`.
- Mantener en cada nuevo protocolo la misma conexión entre decisión clínica, cálculos, medicación y bibliografía.
- Evitar siempre que la interfaz prometa una funcionalidad aún no implementada.

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

## Publicación en GitHub Pages

El proyecto ya incluye `.github/workflows/deploy-pages.yml`.

Flujo mínimo:

```bash
git add .
git commit -m "Tu cambio"
git push origin main
```

GitHub Actions compila y publica automáticamente la rama `main`.
