# NexoClx

NexoClx es una app web estática orientada a protocolos clínicos rápidos en formato de organigrama interactivo, basada en bibliografía real de urgencias.  
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

## Qué es NexoClx

NexoClx busca ofrecer una interfaz clínica breve, usable en móvil y basada en fuentes reales. La app parte de bibliografía auditada y avanza módulo por módulo.

Principios actuales del proyecto:

- interfaz compacta y directa
- contenido clínico solo cuando está verificado
- bibliografía presente, pero no dominante
- cálculos implementados solo cuando un módulo real los necesita
- fichas farmacológicas con fuente explícita
- navegación contextual entre protocolo, cálculo y tratamiento

## Estado actual

- Home simplificada a: `buscador` + `especialidades`, sin bloques duplicados ni accesos rápidos redundantes.
- Pantalla propia de `Protocolos` con organigramas clínicos para todos los protocolos implementados y acordeones por bloque clínico para evitar una lista plana interminable.
- Protocolos reales operativos migrados a ficha clínica: `fibrilación auricular`, `HTA en urgencias`, `síndrome coronario agudo`, `bradicardias`, `arritmias ventriculares`, `ictus isquémico`, `ictus hemorrágico`, `crisis convulsiva / epilepsia en urgencias`, `neumonía adquirida en la comunidad` y módulos de dolor abdominal repartidos por especialidad.
- Cálculos activos: `CHA2DS2-VA`, `HAS-BLED`, `Cockcroft-Gault`, `CRB-65`, `CURB-65`, `Killip`, `NIHSS`, `ICH Score`, `Alvarado` y `BISAP`.
- La sección `Medicamentos` deja de ser sección principal visible. Los tratamientos deben vivir dentro de cada protocolo como pautas concretas y auditadas.
- Icono unificado dentro y fuera de la app, con `manifest` web, `apple-touch-icon` y `service worker` para instalación PWA.
- Bibliografía activa: `ESC FA 2024` como referencia principal de FA, `ESC HTA 2024` como referencia principal de HTA, `ESC SCA 2023` como referencia principal de IAM/SCA, `ESC TSV 2019`, `ESC Bradicardias 2021` y `ESC Arritmias ventriculares 2022` como referencias principales indexadas de sus módulos, `AHA/ASA ictus isquémico` como referencia principal del módulo de ictus isquémico, `AHA/ASA ictus hemorrágico 2022` como referencia principal del módulo de ictus hemorrágico, `Murillo 7.ª ed.`, `SEN Epilepsia 2023`, `NICE NG217` y `AES 2016` como fuentes del protocolo de crisis convulsiva/estatus, `NICE NG250 2025` como referencia principal de neumonía, y `Murillo 7.ª ed.` como obra base general y apoyo práctico.
- Plantilla de imagen inicial creada solo como estructura: `RX tórax sistemática`.
- Despliegue público principal en Vercel: `https://nexo-clx.vercel.app/`.

## Estructura funcional de la app

### Secciones actuales

| Sección | Estado | Función real hoy | Relación con el resto |
| --- | --- | --- | --- |
| Home | Activa | Punto de entrada mínimo con `buscador` y rejilla de `especialidades`. | Lleva a la especialidad o al resultado buscado sin pasos intermedios ni bloques redundantes. |
| Protocolos | Activa | Índice clínico principal con organigrama interactivo para cada protocolo implementado. | Abre protocolo real, cálculo concreto o fuente principal desde la misma sección. |
| Módulo FA | Activo | Organigrama con diagnóstico, tratamiento, calculadoras directas y destino. | Enlaza `CHA2DS2-VA`, `HAS-BLED` y `Cockcroft-Gault` desde el nodo correspondiente. |
| Módulo de bradicardias | Activo | Organigrama para repercusión, bradicardia sinusal / nodo, bloqueo AV y pacing. | El tratamiento farmacológico vive dentro del protocolo. |
| Módulo de arritmias ventriculares | Activo | Organigrama para pulso, inestabilidad, TV monomorfa y torsades / TV polimórfica. | El tratamiento farmacológico vive dentro del protocolo. |
| Módulos de ictus | Activos | `Ictus isquémico` e `ictus hemorrágico` con diagnóstico, tratamiento y destino. | Quedan agrupados en `Neurología` con bibliografía textual. |
| Crisis convulsiva / epilepsia | Activo | Ficha clínica para crisis autolimitada, crisis en curso, primera crisis, crisis provocada y estatus epiléptico. | Queda en `Neurología`, con relación secundaria funcional con urgencias y tratamiento escalonado con CIMA. |
| Dolor abdominal por escenarios | Activo | Protocolos de un vistazo para epigastrio, hipocondrio derecho, fosas iliacas, flanco, pelvis, peritonismo y sospecha vascular. | Cada cuadro queda en su especialidad principal: `Digestivo`, `Cirugía general`, `Urología`, `Ginecología` o `Vascular`. |
| Cálculos | Activa | Agrupa cálculos implementados y muestra auditoría de pendientes. | Los cálculos activos también se abren desde el protocolo. |
| Medicamentos | No visible como sección principal | Los datos farmacológicos pueden seguir existiendo como soporte interno mientras se integran pautas auditadas dentro de cada protocolo. | No debe mostrarse como módulo independiente ni como navegación principal. |
| Bibliografía | Activa | Da acceso a la obra base y a referencias estructuradas. | Cada módulo guarda sus referencias y páginas verificadas. |
| Plantillas de imagen | En desarrollo | Solo existe la estructura inicial para `RX tórax sistemática`. | Quedará conectada a bibliografía específica cuando esa fuente esté en el repo. |

### Lógica de navegación entre módulos

1. La `Home` funciona como entrada principal.
2. Desde `Home` se entra directamente a una `especialidad` o a un resultado concreto del `buscador`.
3. La pantalla `Especialidades` agrupa los módulos por bloque clínico y muestra recursos relacionados para que el crecimiento no se convierta en una lista plana.
4. Al abrir un protocolo implementado, la vista se renderiza como organigrama clínico con nodos expandibles.
5. Los módulos de `ictus` entran por `Neurología` y se resuelven como organigrama de manejo urgente, no como capítulo de estudio.
6. Desde el protocolo se puede abrir un cálculo concreto cuando cambia la conducta.
7. Los tratamientos farmacológicos deben mostrarse dentro del protocolo, no como dependencia de una sección externa de medicamentos.
8. Los mismos cálculos siguen existiendo en la sección general de `Cálculos`.
9. Las fichas farmacológicas pueden mantenerse en datos internos si siguen siendo necesarias para no romper módulos existentes, pero no como sección principal visible.
10. La bibliografía se mantiene accesible desde cabecera y dentro del protocolo como acceso secundario.

### Cómo se conectan los módulos

- `Home` prioriza navegación, no lectura.
- `Especialidades` es la puerta de entrada a módulos clínicos concretos.
- `Módulo FA` ya no se resuelve como pantalla única; usa organigrama clínico con calculadoras directas.
- `Módulos de ictus` siguen la misma lógica: dato clave, clasificación, conducta, tratamiento y destino.
- `Cálculos` solo se implementan cuando un protocolo real los necesita.
- Los tratamientos se construyen dentro de cada protocolo a partir de pautas auditadas: fármaco, dosis, vía, frecuencia, duración, máximos, contraindicaciones y ajustes cuando proceda.
- `Bibliografía` no vive como texto suelto al final: cada módulo guarda referencias estructuradas.
- `Plantillas` siguen una lógica paralela: estructura, fuente base y estado de desarrollo.

### Criterio clínico global

Todo protocolo debe funcionar como organigrama clínico de guardia, no como capítulo resumido.

Estructura fija:

1. Diagnóstico
2. Tratamiento
3. Seguimiento / destino

Reglas:

- frases cortas y pasos accionables
- escalas enlazadas directamente desde el nodo donde cambian conducta, no mediante "ir a Escalas"
- tratamiento separado en `Tratamiento en Urgencias` y, cuando proceda, `Tratamiento en Atención Primaria`
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
| Neumonía adquirida en la comunidad | NICE NG250 2025 + Cap. 42 | 300 | Creado | Flujo real para sospecha, diagnóstico, CRB/CURB-65, destino, antibiótico inicial, revisión IV a 48 h y seguimiento. |
| Abdomen quirúrgico | Cap. 50 | 340 | Creado | Mini-protocolo de cirugía general para apendicitis, perforación, obstrucción, peritonitis y complicación. |
| Hepatobiliar-pancreático | Cap. 50 | 340 | Creado | Mini-protocolo digestivo para cólico biliar, colecistitis, colangitis, hepatitis y pancreatitis. |
| Dolor urinario | Cap. 50 | 340 | Creado | Mini-protocolo urológico para cólico renal, pielonefritis, ITU complicada, retención y prostatitis. |
| Dolor ginecológico | Cap. 50 | 340 | Creado | Mini-protocolo ginecológico para ectópico, torsión, EPI, quiste complicado y gestación. |
| Dolor vascular | Cap. 50 | 340 | Creado | Mini-protocolo vascular para isquemia mesentérica, aneurisma, disección y embolia visceral. |
| Dolor infeccioso-digestivo | Cap. 50 | 340 | Creado | Mini-protocolo digestivo/infeccioso para gastroenteritis, colitis, diverticulitis y sepsis abdominal. |
| Insuficiencia cardiaca | Cap. 19 | 161 | Solo indexado | Tema auditado para futura integración del protocolo de `ICC`. |
| Taquicardia supraventricular | Guía ESC 2019 | 1 | Solo indexado | Referencia preparada para futuro módulo independiente de TSV. |
| Shock | Cap. 18 | 154 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Dolor torácico agudo | Cap. 25 | 207 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Ictus | Cap. 64 | 442 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Sepsis | Cap. 107 | 640 | Solo indexado | Tema auditado, sin protocolo operativo. |
| Coma | Cap. 62 | 428 | Solo indexado | Tema auditado, sin protocolo operativo. |

### Cálculos / escalas

| Cálculo / escala | Bloque clínico | Página real verificada | Estado | Observaciones |
| --- | --- | ---: | --- | --- |
| Aclaramiento de creatinina (Cockcroft-Gault) | Cap. 5 · Bioquímica sanguínea | 39 | Implementado | Se usa ya para revisar ajuste renal de anticoagulantes en FA. |
| CHA2DS2-VA | Guía ESC 2024 · Fibrilación auricular | 32 | Implementado | Integrado dentro del protocolo FA y también accesible desde `Cálculos`. |
| HAS-BLED | Guía ESC 2024 · Fibrilación auricular | 40 | Implementado | Integrado dentro del protocolo FA para vigilar riesgo hemorrágico y también accesible desde `Cálculos`. |
| CRB-65 | NICE NG250 2025 · Neumonía adquirida en la comunidad | 9 | Implementado | Integrado para orientar riesgo y destino en atención inicial / ámbito ambulatorio. |
| CURB-65 | NICE NG250 2025 · Neumonía adquirida en la comunidad | 11 | Implementado | Integrado para orientar riesgo y destino en ámbito hospitalario. |
| Killip | ESC SCA 2023 · Síndrome coronario agudo | — | Implementado | Integrado en la decisión de gravedad/destino de SCA. |
| NIHSS | AHA/ASA 2026 · Ictus isquémico | — | Implementado | Integrado en la decisión de código ictus, gravedad y comunicación clínica. |
| ICH Score | AHA/ASA 2022 · Ictus hemorrágico | — | Implementado | Integra Glasgow, volumen, localización, extensión intraventricular y edad para gravedad inicial. |
| Alvarado | WSES Apendicitis 2020 · Dolor abdominal agudo | — | Implementado | Integrado en abdomen quirúrgico si sospecha apendicitis sin peritonitis franca. |
| BISAP | ACG Pancreatitis 2024 · Pancreatitis aguda | — | Implementado | Integrado en hepatobiliar-pancreático para riesgo de pancreatitis grave. |
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

## Pendiente

### Pendiente funcional

- Construir el siguiente protocolo real a partir de los temas ya auditados después de FA, HTA y SCA.
- Hacer que la búsqueda evolucione de filtro simple a entrada clínica más útil.
- Integrar tratamientos dentro de cada protocolo y retirar progresivamente dependencias visibles de fichas farmacológicas externas.
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
