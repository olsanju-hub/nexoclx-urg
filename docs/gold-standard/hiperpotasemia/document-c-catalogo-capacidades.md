# Documento C - Catalogo de Capacidades

Asistente: Hiperpotasemia Gold Standard
Estado: borrador operativo v0.1
Tipo de documento: compartido
Fase: Fase 2 - Ingenieria de contenidos clinicos

Este documento declara capacidades operativas por contexto asistencial. No contiene umbrales clinicos, dosis ni reglas de tratamiento. Las reglas clinicas pertenecen al Documento B y el flujo funcional al Documento A.

## 1. Objetivo

Permitir que una regla clinica existente genere una conducta adaptada a lo que el contexto puede ejecutar.

Flujo conceptual:

`Regla aplicable -> capacidad disponible -> ofrecer conducta ejecutable`

`Regla aplicable -> capacidad no disponible -> ofrecer alternativa, escalada, derivacion o traslado`

## 2. Gobernanza operativa

| Campo | Valor |
|---|---|
| Identificador | `HK-CAP` |
| Version operativa | `0.1.0` |
| Estado | Borrador para validacion |
| Fecha de creacion | 2026-07-31 |
| Ambito | AP, Urg, 061, Ped |
| Responsable operativo | Pendiente de designacion |
| Limitacion principal | Las capacidades reales deben validarse con dotacion local, protocolos y cartera de servicios |

Cambiar una capacidad no debe modificar Documento A ni Documento B. Solo debe modificar la conducta derivada.

## 3. Estados de capacidad

| Estado | Significado |
|---|---|
| `disponible` | Puede ejecutarse en el contexto actual |
| `variable` | Depende del centro, turno, recurso, dotacion o protocolo local |
| `no_disponible` | No puede ejecutarse en ese contexto |
| `requiere_confirmacion` | Puede ejecutarse, pero exige confirmacion profesional explicita |
| `requiere_especialista` | Requiere interconsulta, equipo especifico o traslado |
| `desconocida` | No consta; el asistente debe preguntar o generar alternativa segura |

## 4. Capacidades normalizadas

| ID | Capacidad | Descripcion |
|---|---|---|
| `CAP-CTX-001` | Contexto clinico compartido | Lectura/escritura de datos del episodio |
| `CAP-VIG-001` | Vigencia de datos | Origen, fecha/hora, ambito y validez contextual |
| `CAP-ECG-001` | ECG 12 derivaciones | Obtener o incorporar ECG vigente |
| `CAP-ECG-002` | Monitor ECG continuo | Monitorizacion cardiaca continua |
| `CAP-LAB-001` | Analitica urgente | Potasio, creatinina, glucemia, gasometria o equivalentes segun contexto |
| `CAP-LAB-002` | Repetir muestra | Confirmar dato dudoso o hemolizado |
| `CAP-GLU-001` | Glucemia capilar | Medicion inmediata de glucemia |
| `CAP-IV-001` | Via IV | Administracion IV segura |
| `CAP-IO-001` | Via IO | Alternativa pediatrica/critica si no hay via IV |
| `CAP-MED-001` | Medicacion IV de urgencia | Medicacion definida en Documento B y protocolo local |
| `CAP-MED-002` | Nebulizacion | Administracion nebulizada |
| `CAP-MED-003` | Captador de potasio | Farmaco eliminador disponible segun formulario |
| `CAP-INF-001` | Perfusion controlada | Bomba o sistema seguro para infusion |
| `CAP-REN-001` | Calculo de funcion renal | Creatinina/eGFR vigente o estimable |
| `CAP-REN-002` | Nefrologia | Interconsulta nefrologica |
| `CAP-REN-003` | Dialisis | Acceso a dialisis urgente o centro capaz |
| `CAP-PED-001` | Peso pediatrico confirmado | Peso medido o estimado y confirmado |
| `CAP-PED-002` | Equipo pediatrico | Pediatria presencial o consultable |
| `CAP-PED-003` | UCIP | Capacidad de cuidados intensivos pediatricos |
| `CAP-OBS-001` | Observacion | Capacidad de vigilancia con reevaluacion |
| `CAP-UCI-001` | UCI | Cuidados intensivos adulto |
| `CAP-TRS-001` | Traslado sanitario | Transporte a otro recurso |
| `CAP-TRS-002` | Ambulancia SVA | Soporte vital avanzado prehospitalario |
| `CAP-HOSP-001` | Hospital util adulto | Centro con monitorizacion avanzada, nefrologia/dialisis/UCI si procede |
| `CAP-HOSP-002` | Hospital util pediatrico | Centro con pediatria/UCIP/dialisis pediatrica si procede |
| `CAP-COM-001` | Prealerta | Comunicacion previa con centro receptor |
| `CAP-CONF-001` | Confirmacion profesional | Confirmar decision antes de registrar accion critica |
| `CAP-SEG-001` | Seguridad medicacion alto riesgo | Doble comprobacion/local policy si aplica |
| `CAP-ALT-001` | Alta segura | Seguimiento, alarma y plan documentado |

## 5. Capacidades por contexto

### AP

| Capacidad | Estado por defecto | Conducta si falta |
|---|---|---|
| `CAP-CTX-001` | disponible | No iniciar asistente sin contexto minimo |
| `CAP-VIG-001` | disponible | Pedir confirmacion manual |
| `CAP-ECG-001` | variable | Derivar a Urg o activar 061 segun riesgo |
| `CAP-ECG-002` | no_disponible | Derivar/activar recurso si requiere monitorizacion |
| `CAP-LAB-001` | variable | Solicitar analitica o derivar si decision urgente |
| `CAP-LAB-002` | variable | Repetir muestra si posible o derivar |
| `CAP-GLU-001` | variable | Derivar si condiciona tratamiento urgente |
| `CAP-IV-001` | variable | No ofrecer tratamiento IV salvo protocolo/capacidad |
| `CAP-IO-001` | no_disponible | Activar 061 si via urgente necesaria |
| `CAP-MED-001` | variable | Derivar/activar 061 |
| `CAP-MED-002` | variable | Derivar/activar si imprescindible |
| `CAP-MED-003` | variable | Revisar formulario local o derivar |
| `CAP-INF-001` | no_disponible | Derivar |
| `CAP-REN-001` | variable | Solicitar creatinina o derivar |
| `CAP-REN-002` | variable | Derivar/consultar segun circuito local |
| `CAP-REN-003` | no_disponible | Derivar a hospital util |
| `CAP-PED-001` | variable | Confirmar peso o derivar si tratamiento urgente |
| `CAP-PED-002` | variable | Derivar a Ped/Urg |
| `CAP-PED-003` | no_disponible | Activar traslado |
| `CAP-OBS-001` | variable | Derivar si necesita vigilancia |
| `CAP-UCI-001` | no_disponible | Activar 061 o derivar |
| `CAP-TRS-001` | variable | Activar circuito local |
| `CAP-TRS-002` | variable | Activar 061 |
| `CAP-HOSP-001` | no_disponible | Seleccionar/derivar a hospital util |
| `CAP-HOSP-002` | no_disponible | Derivar a hospital pediatrico util |
| `CAP-COM-001` | variable | Contactar circuito local |
| `CAP-CONF-001` | disponible | Requerir confirmacion para decision critica |
| `CAP-SEG-001` | variable | Bloquear medicacion de alto riesgo si no existe seguridad |
| `CAP-ALT-001` | disponible | Generar plan de seguimiento |

### Urg

| Capacidad | Estado por defecto | Conducta si falta |
|---|---|---|
| `CAP-CTX-001` | disponible | Crear contexto minimo |
| `CAP-VIG-001` | disponible | Actualizar dato |
| `CAP-ECG-001` | disponible | Si no disponible, monitorizar y escalar |
| `CAP-ECG-002` | disponible | Si no disponible, escalar zona/recurso |
| `CAP-LAB-001` | disponible | Usar gasometria/POC o escalar |
| `CAP-LAB-002` | disponible | Repetir muestra |
| `CAP-GLU-001` | disponible | Medir antes de rama terapeutica |
| `CAP-IV-001` | disponible | Canalizar o escalar |
| `CAP-IO-001` | variable | Usar si critico y protocolo |
| `CAP-MED-001` | disponible | Si falta farmaco, alternativa/traslado |
| `CAP-MED-002` | disponible | Si falta, alternativa terapeutica |
| `CAP-MED-003` | variable | Si falta, usar alternativa o nefrologia |
| `CAP-INF-001` | disponible | Si falta, evitar perfusiones no seguras |
| `CAP-REN-001` | disponible | Calcular con dato vigente |
| `CAP-REN-002` | variable | Contactar centro de referencia |
| `CAP-REN-003` | variable | Traslado a centro con dialisis |
| `CAP-PED-001` | variable | Confirmar peso antes de dosis |
| `CAP-PED-002` | variable | Interconsulta pediatria/traslado |
| `CAP-PED-003` | variable | Traslado si requiere UCIP |
| `CAP-OBS-001` | disponible | Observacion con reevaluacion |
| `CAP-UCI-001` | variable | Traslado/interconsulta si no disponible |
| `CAP-TRS-001` | disponible | Activar traslado |
| `CAP-TRS-002` | variable | Solicitar SVA |
| `CAP-HOSP-001` | variable | Derivar si el centro no es util |
| `CAP-HOSP-002` | variable | Derivar si no hay capacidad pediatrica |
| `CAP-COM-001` | disponible | Prealerta/interconsulta |
| `CAP-CONF-001` | disponible | Confirmacion obligatoria |
| `CAP-SEG-001` | disponible | Aplicar seguridad medicacion |
| `CAP-ALT-001` | disponible | Alta si cumple criterios clinicos |

### 061

| Capacidad | Estado por defecto | Conducta si falta |
|---|---|---|
| `CAP-CTX-001` | disponible | Crear contexto prehospitalario minimo |
| `CAP-VIG-001` | disponible | Registrar hora/origen del dato |
| `CAP-ECG-001` | variable | Trasladar/monitorizar segun recurso |
| `CAP-ECG-002` | variable | Si no hay monitor, priorizar traslado |
| `CAP-LAB-001` | variable | No esperar analitica si riesgo critico |
| `CAP-LAB-002` | no_disponible | Confirmacion en hospital |
| `CAP-GLU-001` | variable | Si falta y condiciona tratamiento, trasladar/evitar rama no segura |
| `CAP-IV-001` | variable | Si falta, soporte y traslado |
| `CAP-IO-001` | variable | Usar en SVA si protocolo |
| `CAP-MED-001` | variable | Solo segun dotacion/protocolo |
| `CAP-MED-002` | variable | Solo si dotacion disponible |
| `CAP-MED-003` | no_disponible | Traslado para eliminacion definitiva |
| `CAP-INF-001` | variable | Evitar infusion si no hay seguridad |
| `CAP-REN-001` | variable | Usar antecedentes/datos previos con vigencia dudosa |
| `CAP-REN-002` | no_disponible | Prealerta a hospital util |
| `CAP-REN-003` | no_disponible | Traslado a hospital util |
| `CAP-PED-001` | variable | Estimar/confirmar peso si protocolo |
| `CAP-PED-002` | no_disponible | Prealerta pediatrica |
| `CAP-PED-003` | no_disponible | Hospital util pediatrico |
| `CAP-OBS-001` | no_disponible | No cerrar en observacion domiciliaria si riesgo |
| `CAP-UCI-001` | no_disponible | Hospital util adulto |
| `CAP-TRS-001` | disponible | Traslado |
| `CAP-TRS-002` | variable | Ajustar conducta al recurso SVB/SVA |
| `CAP-HOSP-001` | disponible | Seleccionar destino adecuado |
| `CAP-HOSP-002` | disponible | Seleccionar destino pediatrico adecuado |
| `CAP-COM-001` | disponible | Prealerta |
| `CAP-CONF-001` | disponible | Confirmacion profesional en registro |
| `CAP-SEG-001` | variable | Solo medicacion segura segun dotacion |
| `CAP-ALT-001` | no_disponible | No alta; si bajo riesgo, derivar circuito local |

### Ped

| Capacidad | Estado por defecto | Conducta si falta |
|---|---|---|
| `CAP-CTX-001` | disponible | Crear contexto pediatrico minimo |
| `CAP-VIG-001` | disponible | Actualizar dato dinamico |
| `CAP-ECG-001` | disponible | Si falta, escalar/trasladar segun riesgo |
| `CAP-ECG-002` | disponible | Escalar si no hay monitor |
| `CAP-LAB-001` | disponible | Si falta, usar POC/traslado segun riesgo |
| `CAP-LAB-002` | disponible | Repetir muestra |
| `CAP-GLU-001` | disponible | Medir antes de rama terapeutica |
| `CAP-IV-001` | disponible | Canalizar |
| `CAP-IO-001` | variable | Usar si critico y protocolo |
| `CAP-MED-001` | disponible | Si falta, traslado/alternativa |
| `CAP-MED-002` | disponible | Si falta, alternativa/traslado |
| `CAP-MED-003` | variable | Usar segun protocolo |
| `CAP-INF-001` | disponible | Bomba/seguridad pediatrica |
| `CAP-REN-001` | disponible | Calcular con datos pediatricos |
| `CAP-REN-002` | variable | Interconsulta nefrologia pediatrica |
| `CAP-REN-003` | variable | Traslado si no disponible |
| `CAP-PED-001` | disponible | Bloquear dosis si no hay peso confirmado/estimado |
| `CAP-PED-002` | disponible | Consultar pediatria |
| `CAP-PED-003` | variable | Traslado si precisa UCIP |
| `CAP-OBS-001` | disponible | Observacion pediatrica |
| `CAP-UCI-001` | no_disponible | Usar UCIP si aplica |
| `CAP-TRS-001` | disponible | Traslado |
| `CAP-TRS-002` | variable | Solicitar SVA pediatrico si procede |
| `CAP-HOSP-001` | no_disponible | No aplica como destino principal pediatrico |
| `CAP-HOSP-002` | variable | Hospital pediatrico util |
| `CAP-COM-001` | disponible | Prealerta/interconsulta |
| `CAP-CONF-001` | disponible | Confirmacion profesional |
| `CAP-SEG-001` | disponible | Doble comprobacion medicacion pediatrica |
| `CAP-ALT-001` | disponible | Alta con familia instruida si cumple criterios |

## 6. Reglas de derivacion por falta de capacidad

| Capacidad faltante | Conducta alternativa |
|---|---|
| ECG no disponible y sospecha moderada/severa | Derivar a Urg o trasladar segun contexto |
| Monitorizacion no disponible y ECG/riesgo alto | Escalar zona, activar traslado o prealerta |
| Glucemia no disponible y rama terapeutica la requiere | Bloquear dosis y obtener glucemia; si no posible, trasladar |
| Peso pediatrico no confirmado | Confirmar o estimar segun protocolo; bloquear dosis si no seguro |
| Via IV/IO no disponible y tratamiento urgente requerido | Activar recurso capaz o traslado |
| Medicacion de alto riesgo no disponible | No ofrecer administracion; activar alternativa/traslado |
| Nefrologia/dialisis no disponible y se requiere eliminacion definitiva | Traslado a hospital util |
| UCIP no disponible y paciente pediatrico critico | Traslado a hospital pediatrico util |
| Observacion no disponible | No cerrar como observacion; derivar/trasladar/alta solo si cumple seguridad |
| Confirmacion profesional no disponible | No registrar accion critica como ejecutada |

## 7. Confirmaciones profesionales

Siempre requieren confirmacion:

- medicacion IV de alto riesgo;
- via IO;
- procedimiento invasivo;
- traslado;
- seleccion de hospital util;
- interconsulta urgente;
- alta;
- ingreso;
- cambio de diagnostico principal;
- registro de conducta ejecutada.

La confirmacion debe conservar:

- profesional;
- fecha/hora;
- recomendacion aceptada, modificada o rechazada;
- razon si modifica o rechaza;
- conducta ejecutada si procede.

## 8. Metricas operativas

El asistente debe poder medir:

- reglas bloqueadas por falta de capacidad;
- alternativas generadas;
- tiempo hasta conducta ejecutable;
- porcentaje de conductas que cambian entre AP, Urg, 061 y Ped por capacidades;
- confirmaciones profesionales realizadas;
- conductas no ejecutadas por falta de recurso;
- traslados/prealertas generados.

## 9. Validacion de independencia A/B/C

Escenarios obligatorios:

- Anadir un nuevo farmaco disponible en 061 modifica solo Documento C y la conducta derivada.
- Cambiar el umbral de gravedad modifica solo Documento B.
- Cambiar un estado funcional del flujo modifica solo Documento A.
- Marcar dialisis como disponible en un centro modifica solo Documento C.
- Marcar ECG como no disponible en AP no modifica Documento A ni B.

## 10. Limitaciones v0.1

- Las capacidades son valores por defecto; requieren parametrizacion local.
- La disponibilidad real puede variar por centro, turno, dotacion, profesional y protocolo.
- El catalogo no sustituye autorizaciones profesionales ni protocolos locales.
- La implementacion debera permitir configurar capacidades sin cambiar reglas clinicas.
