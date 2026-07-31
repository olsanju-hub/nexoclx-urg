# Documento A - Especificacion Funcional

Asistente: Hiperpotasemia Gold Standard
Estado: borrador funcional v0.1
Tipo de documento: estable
Fase: Fase 2 - Ingenieria de contenidos clinicos

Este documento define el comportamiento funcional del asistente de Hiperpotasemia. No contiene umbrales clinicos, dosis, tratamientos concretos ni recomendaciones dependientes de guias. Esos elementos pertenecen al Documento B - Base de Conocimiento Clinica.

## 1. Alcance funcional

### Objetivo

Guiar al profesional desde una sospecha, hallazgo o diagnostico de hiperpotasemia hasta una conducta clinica valida, adaptada al contexto asistencial y a las capacidades disponibles.

### Problemas que resuelve

- Confirmar si el asistente puede tomar decisiones con los datos disponibles.
- Detectar riesgo inmediato.
- Interpretar hallazgos relevantes sin duplicar motores.
- Dirigir a la conducta adecuada segun contexto y capacidades.
- Reutilizar ECG, analitica, funcion renal, peso, medicacion y decisiones previas si siguen vigentes.
- Diferenciar hecho calculado, recomendacion, decision profesional y conducta ejecutada.

### Problemas que no resuelve

- Seguimiento longitudinal completo de enfermedad renal cronica.
- Reestructuracion completa de tratamiento cronico fuera del episodio actual.
- Manejo integral de parada cardiorrespiratoria.
- Manejo integral de intoxicaciones o cetoacidosis si pasan a ser el diagnostico principal.
- Definicion de dosis, umbrales o tratamientos concretos, que pertenecen al Documento B.
- Definicion de capacidades por app, que pertenece al Documento C.

## 2. Entradas permitidas

El usuario puede iniciar el asistente desde:

- Diagnostico conocido: hiperpotasemia.
- Hallazgo analitico: potasio elevado.
- Hallazgo ECG: patron compatible con alteracion electrolitica.
- Entrada sindromica: paciente inestable, alteracion de consciencia, debilidad, arritmia, sincope, intoxicacion sospechada.
- Microherramienta: interpretacion ECG, eGFR, gasometria, osmolaridad, ajuste renal.
- Busqueda libre.

El asistente debe conservar la ruta de origen para poder volver al flujo previo tras emitir conducta o completar una microherramienta.

## 3. Contexto heredado

### Datos que debe intentar heredar

- edad;
- sexo;
- contexto asistencial;
- embarazo o lactancia;
- peso, talla y superficie corporal;
- alergias;
- constantes;
- Glasgow o TEP pediatrico;
- potasio disponible;
- creatinina y funcion renal calculada;
- glucemia;
- gasometria;
- ECG;
- analitica relevante;
- tratamiento habitual;
- medicacion potencialmente relacionada;
- comorbilidades relevantes;
- dialisis o terapia renal sustitutiva;
- via venosa disponible;
- monitorizacion disponible;
- decisiones ya tomadas.

### Metadatos obligatorios de cada dato heredado

Cada dato heredado debe conservar:

- origen;
- fecha y hora;
- ambito de obtencion;
- estado de vigencia;
- posibilidad de edicion por el usuario;
- relacion con una decision previa si procede.

### Estados de vigencia

- Vigente: puede utilizarse para la decision actual.
- Requiere confirmacion: existe, pero el asistente debe pedir confirmacion antes de usarlo.
- Obsoleto: no debe usarse para decidir.
- Dudoso: puede orientar, pero no cerrar conducta.
- No disponible: obliga a pedir dato, bloquear rama o generar conducta de obtencion.

El asistente no debe solicitar de nuevo un dato vigente. Si el dato no es vigente, debe explicar de forma breve por que necesita actualizarlo.

## 4. Datos minimos y bloqueos

### Datos minimos funcionales

El asistente debe determinar si dispone de:

- evidencia de hiperpotasemia o sospecha clinica suficiente;
- clasificacion adulto/pediatrico;
- ECG vigente o motivo por el que no esta disponible;
- estado clinico actual;
- glucemia vigente si una rama terapeutica la requiere;
- peso vigente si una rama pediatrica o posologica lo requiere;
- funcion renal o sospecha de deterioro renal;
- informacion sobre medicacion relevante.

### Bloqueos funcionales

El asistente debe bloquear o redirigir cuando:

- no existe dato suficiente para confirmar o sospechar hiperpotasemia;
- falta un dato imprescindible para calcular una dosis;
- falta una capacidad necesaria para ejecutar una recomendacion;
- el dato heredado no es vigente para la decision actual;
- hay contradiccion entre datos y el riesgo de actuar supera el beneficio;
- la situacion corresponde a parada o peri-parada y debe abrirse el flujo critico correspondiente.

### Conductas validas ante informacion insuficiente

La falta de informacion no debe dejar una rama sin salida. Puede terminar en:

- obtener analitica;
- repetir muestra;
- realizar ECG;
- confirmar peso;
- comprobar glucemia;
- activar recurso;
- derivar;
- trasladar;
- mantener vigilancia con reevaluacion definida;
- abrir otro asistente si el problema principal cambia.

## 5. Modelo interno de estados

El asistente debe implementarse como maquina de estados funcional.

| Estado | Objetivo | Salidas permitidas |
|---|---|---|
| INICIO | Recibir entrada y ruta de origen | VALIDAR_CONTEXTO |
| VALIDAR_CONTEXTO | Revisar datos heredados y vigencia | DATOS_INSUFICIENTES, EVALUAR_RIESGO |
| DATOS_INSUFICIENTES | Identificar dato faltante o no vigente | OBTENER_DATO, EVALUAR_RIESGO, CONDUCTA_FINAL |
| OBTENER_DATO | Guiar obtencion del dato necesario | VALIDAR_CONTEXTO, CONDUCTA_FINAL |
| EVALUAR_RIESGO | Determinar riesgo funcional y prioridad | FLUJO_CRITICO, INTERPRETAR, CONDUCTA_FINAL |
| FLUJO_CRITICO | Activar ABCDE, PCR/peri-parada u otro flujo | INTERPRETAR, ESCALAR, CONDUCTA_FINAL |
| INTERPRETAR | Ejecutar motores y reglas disponibles | RECOMENDAR, DATOS_INSUFICIENTES |
| RECOMENDAR | Generar recomendaciones condicionadas por capacidades | CONFIRMAR_DECISION, ESCALAR, CONDUCTA_FINAL |
| CONFIRMAR_DECISION | Registrar decision profesional sobre acciones criticas | EJECUTAR_CONDUCTA, RECOMENDAR |
| EJECUTAR_CONDUCTA | Registrar conducta realizada o planificada | REEVALUAR, CONDUCTA_FINAL |
| REEVALUAR | Comprobar respuesta y actualizar contexto | INTERPRETAR, ESCALAR, CONDUCTA_FINAL |
| ESCALAR | Derivar, trasladar, interconsultar o activar recurso | CONDUCTA_FINAL |
| CONDUCTA_FINAL | Emitir siguiente paso valido | FINALIZADO, VOLVER_ORIGEN |
| FINALIZADO | Cerrar episodio funcional | - |
| VOLVER_ORIGEN | Regresar al flujo desde el que fue llamado | - |

### Reglas de transicion

Cada transicion debe declarar:

- evento que la dispara;
- condicion;
- bloqueo si existe;
- accion generada;
- dato o regla que actualiza el contexto;
- necesidad de confirmacion profesional si procede.

No se permiten transiciones circulares sin cambio de estado, dato o decision.

## 6. Separacion entre hecho, recomendacion, decision y conducta

El asistente debe registrar cuatro niveles separados:

| Nivel | Definicion | Responsable |
|---|---|---|
| Regla calculada | Produce un hecho objetivo a partir de datos y reglas | Sistema |
| Recomendacion clinica | Propone una o varias actuaciones posibles | Sistema |
| Decision profesional | El profesional acepta, modifica o rechaza | Profesional |
| Conducta ejecutada | Accion realizada o registrada | Profesional/sistema segun confirmacion |

El asistente nunca debe registrar una accion critica como ejecutada sin confirmacion explicita.

## 7. Navegacion funcional

### Navegacion de entrada

El asistente puede abrirse como flujo principal o como asistente secundario llamado desde otro flujo.

Si se abre desde otro flujo, debe conservar:

- asistente o entrada de origen;
- motivo de llamada;
- datos transferidos;
- punto de retorno;
- conducta esperada al volver.

### Navegacion de salida

Salidas permitidas:

- conducta final y cierre;
- reevaluacion programada;
- apertura de flujo reutilizable;
- apertura de microherramienta;
- apertura de asistente relacionado;
- retorno al flujo de origen.

### Cambios automaticos de rama

Si un dato nuevo modifica la prioridad o el problema principal, el asistente debe:

- recalcular;
- mostrar el cambio de rama;
- conservar la ruta anterior;
- ofrecer continuar en la nueva rama o volver si procede;
- requerir confirmacion si cambia el diagnostico principal.

## 8. Capacidades requeridas

El asistente no decide solo por app. Decide por capacidades declaradas en el Documento C.

Cada recomendacion debe comprobar:

- capacidad necesaria;
- disponibilidad actual;
- profesional autorizado o requisito de confirmacion;
- alternativa si la capacidad no existe.

Ejemplos de capacidades que el Documento C debe poder declarar:

- ECG;
- monitorizacion;
- via IV;
- analitica urgente;
- glucemia capilar;
- medicacion disponible;
- perfusion;
- traslado;
- ambulancia SVA;
- observacion;
- ingreso;
- UCI o UCIP;
- dialisis o acceso a centro con dialisis;
- pediatria o UCIP;
- comunicacion/prealerta.

El Documento A solo define que deben consultarse capacidades; no define que capacidades tiene cada app.

## 9. Dependencias funcionales

### Motores esperados

- contexto clinico compartido;
- funcion renal;
- peso y dosis;
- pediatrico base;
- ECG;
- gasometria;
- analitica/electrolitos;
- perfusiones y unidades;
- trazabilidad de reglas.

### Flujos reutilizables esperados

- ABCDE;
- monitorizacion;
- reevaluacion;
- fluidoterapia;
- interconsulta;
- traslado y prealerta;
- alta segura;
- seguridad del paciente;
- confirmacion profesional de acciones criticas.

### Microherramientas esperadas

- eGFR;
- interpretacion ECG;
- glucemia y microherramienta terapeutica definida en Documento B si aplica;
- perfusiones;
- gasometria y anion gap;
- osmolaridad si aplica;
- checklist de medicacion relacionada;
- ajuste renal de farmacos.

Las dependencias concretas por regla pertenecen a la matriz del Documento B.

## 10. Bloques UX obligatorios

El asistente debe mantener el mismo orden visual:

1. Siguiente accion.
2. Alertas criticas o bloqueos.
3. Contexto heredado relevante.
4. Datos minimos faltantes.
5. Interpretacion calculada.
6. Recomendaciones.
7. Confirmaciones profesionales.
8. Reevaluacion.
9. Conducta final.
10. Trazabilidad y fuentes plegadas.

### Comportamiento UX

- Mostrar siempre el siguiente paso visible.
- Pedir primero solo lo necesario para gravedad o primera conducta.
- No repetir datos vigentes.
- Permitir dato no disponible cuando sea clinicamente aceptable.
- Diferenciar calculo, recomendacion, alerta, decision y conducta.
- Mostrar incertidumbre de forma explicita.
- Mostrar contraindicaciones como bloqueo o advertencia clara.
- Permitir volver al flujo anterior.
- Evitar pantallas de lectura.

## 11. Conductas finales funcionales

Una ruta puede finalizar en:

- obtener dato imprescindible;
- repetir prueba;
- reevaluar;
- vigilancia;
- abrir otro asistente;
- tratamiento pendiente de confirmacion;
- tratamiento confirmado;
- observacion;
- alta segura;
- derivacion;
- interconsulta;
- ingreso;
- UCI o UCIP;
- traslado;
- hospital util;
- activacion de recurso o codigo;
- procedimiento.

No se permite finalizar solo con un diagnostico o interpretacion.

## 12. Adaptacion por contexto asistencial

El flujo funcional debe ser comun, pero las conductas derivadas se adaptan por capacidades y contexto.

### AP

Prioriza:

- sospecha;
- confirmacion o repeticion de dato;
- deteccion de alarma;
- revision de medicacion;
- derivacion;
- seguimiento;
- activacion de 061 si riesgo critico.

### Urg

Prioriza:

- gravedad;
- ECG y analitica urgente;
- monitorizacion;
- tratamiento inicial;
- observacion;
- interconsulta;
- ingreso o alta segura.

### 061

Prioriza:

- escena;
- ABCDE;
- soporte;
- ECG si disponible;
- tratamiento segun capacidades y protocolo local;
- prealerta;
- traslado;
- hospital util.

### Ped

Prioriza:

- edad;
- peso vigente;
- TEP/ABCDE;
- dosis por kg;
- monitorizacion;
- pediatria/UCIP;
- comunicacion con familia;
- traslado si el recurso no cubre la necesidad.

## 13. Gobernanza funcional

El asistente debe tener ficha interna con:

- identificador unico;
- version funcional;
- estado;
- fecha de creacion;
- fecha de revision;
- apps afectadas;
- dependencias de Documento B y C;
- limitaciones conocidas;
- escenarios no cubiertos;
- cambios respecto a version previa.

El Documento A no debe modificarse por cambios de umbrales, dosis, fuentes clinicas o capacidades operativas.

## 14. Metricas de comportamiento

El piloto debe medir:

- tiempo hasta primera conducta;
- numero de datos solicitados;
- porcentaje de datos heredados reutilizados;
- numero de datos marcados como no vigentes;
- numero de recalculos;
- cambios automaticos de rama;
- microherramientas abiertas;
- bloqueos por datos insuficientes;
- bloqueos por falta de capacidad;
- confirmaciones profesionales solicitadas;
- porcentaje de rutas con conducta final;
- rutas que vuelven correctamente al flujo de origen.

## 15. Criterios funcionales de aceptacion

El Documento A se considera valido si:

- no contiene umbrales, dosis ni tratamientos concretos;
- el flujo puede ejecutarse con Documento B versionable;
- las conductas dependen del Documento C cuando requieren capacidad;
- no existen ramas sin salida;
- ninguna reevaluacion queda fuera del asistente;
- ningun dato vigente se solicita dos veces;
- las acciones criticas requieren confirmacion;
- se diferencia hecho, recomendacion, decision y conducta;
- el asistente puede abrirse y volver desde otro flujo;
- el cambio de un umbral clinico no obliga a modificar este documento;
- el cambio de una capacidad no obliga a modificar este documento.

## 16. Limitaciones registradas

- La validez temporal exacta de cada dato dinamico se parametrizara mediante reglas y contexto operativo.
- Las recomendaciones clinicas concretas dependen del Documento B.
- Las capacidades reales por app dependen del Documento C.
- La validacion final requiere Documento B y Documento C completos.
