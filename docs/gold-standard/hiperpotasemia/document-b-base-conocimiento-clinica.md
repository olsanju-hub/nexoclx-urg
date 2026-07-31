# Documento B - Base de Conocimiento Clinica

Asistente: Hiperpotasemia Gold Standard
Estado: borrador clinico v0.1
Tipo de documento: versionable
Fase: Fase 2 - Ingenieria de contenidos clinicos

Este documento contiene reglas clinicas, umbrales, tratamientos, contraindicaciones, fuentes y vigencia para el asistente de Hiperpotasemia. Puede versionarse sin modificar el Documento A - Especificacion Funcional ni el Documento C - Catalogo de Capacidades.

## 1. Gobernanza clinica

| Campo | Valor |
|---|---|
| Identificador del asistente | `HK-GS` |
| Version clinica | `0.1.0` |
| Estado | Borrador para validacion |
| Fecha de creacion | 2026-07-31 |
| Proxima revision prevista | Antes de implementacion |
| Responsable clinico | Pendiente de designacion |
| Ambito | AP, Urg, 061, Ped |
| Limitacion principal | Requiere validacion local de farmacos disponibles, protocolos de administracion y criterios de derivacion |

Todo cambio en dosis, umbral, formula, escala, criterio de gravedad, tratamiento, derivacion, traslado, alta o fuente requiere nueva version clinica y analisis de impacto.

## 2. Fuentes

| ID fuente | Fuente | Ambito | Vigencia usada |
|---|---|---|---|
| `SRC-UKKA-2023` | UK Kidney Association. Clinical Practice Guideline: Management of Hyperkalaemia in Adults. Publicada 2023-12-19, revision 2026-10-19. https://www.ukkidney.org/health-professionals/guidelines/treatment-acute-hyperkalaemia-adults-0 | Adultos, hospital/comunidad | Fuente principal adultos |
| `SRC-RCUK-2025-ADULT` | Resuscitation Council UK. Special circumstances guidelines 2025. https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/special-circumstances-guidelines | Adultos, urgencia/peri-parada | Tratamiento agudo y reanimacion |
| `SRC-RCH-2024-PED` | Royal Children's Hospital Melbourne. Clinical Practice Guideline: Hyperkalaemia. Last updated August 2024. https://www.rch.org.au/clinicalguide/guideline_index/Hyperkalaemia/ | Pediatria | Fuente principal pediatrica inicial |
| `SRC-SEMES-SEC-SEN` | Recomendaciones para el manejo de la hiperpotasemia en Urgencias. Documento de consenso SEMES-SEC-SEN. https://emergenciasojs.portalsemes.org/index.php/emergencias/article/view/3475 | Espana, Urgencias | Fuente contextual nacional; requiere revision de texto completo/local antes de implementacion |
| `SRC-KDIGO-AHK` | KDIGO Acute Hyperkalemia conference report. https://kdigo.org/wp-content/uploads/2018/04/KDIGO-Acute-Hyperkalemia-conf-report-FINAL.pdf | Internacional, consenso | Soporte conceptual y analisis de practica |

Jerarquia aplicada:

1. protocolo local obligatorio si existe;
2. poblacion y contexto asistencial;
3. fuente nacional/autonomica aplicable;
4. guia clinica metodologicamente solida y vigente;
5. coherencia con reanimacion y seguridad farmacologica.

Si una fuente local contradice esta base, debe documentarse la discrepancia y versionarse la regla afectada.

## 3. Espacio de nombres

No se reutilizan identificadores eliminados.

| Prefijo | Uso |
|---|---|
| `HK-DX-*` | Diagnostico, confirmacion y pseudohiperpotasemia |
| `HK-RSK-*` | Riesgo y gravedad |
| `HK-ECG-*` | Interpretacion ECG |
| `HK-TX-*` | Tratamiento |
| `HK-RV-*` | Reevaluacion |
| `HK-ESC-*` | Escalada |
| `HK-DST-*` | Destino o conducta final |
| `HK-PED-*` | Reglas pediatricas especificas |
| `HK-061-*` | Reglas prehospitalarias |
| `HK-SAFE-*` | Seguridad, bloqueos y confirmaciones |

## 4. Reglas diagnosticas

| ID | Condicion | Hecho calculado | Fuente | Observaciones |
|---|---|---|---|---|
| `HK-DX-001` | Adulto con potasio serico `>=5.5 mmol/L` | Hiperpotasemia adulta | `SRC-UKKA-2023`, `SRC-RCH-2024-PED` | Usar muestra no hemolizada o confirmar si discordante |
| `HK-DX-002` | Nino con potasio serico `>5.5 mmol/L` | Hiperpotasemia pediatrica | `SRC-RCH-2024-PED` | Validar rangos locales por edad |
| `HK-DX-003` | Neonato con potasio serico `>6.0 mmol/L` | Hiperpotasemia neonatal segun referencia RCH | `SRC-RCH-2024-PED` | Requiere validacion neonatologia local |
| `HK-DX-004` | Potasio elevado con hemolisis, trombocitosis marcada, leucocitosis marcada o discordancia clinica/ECG | Sospecha de pseudohiperpotasemia | `SRC-RCH-2024-PED`, `SRC-UKKA-2023` | No retrasa tratamiento si hay riesgo critico |
| `HK-DX-005` | Potasio desconocido pero ECG compatible o contexto de alto riesgo | Sospecha critica de hiperpotasemia | `SRC-RCUK-2025-ADULT`, `SRC-RCH-2024-PED` | Permite actuar sin esperar confirmacion si riesgo vital |

## 5. Reglas de gravedad

### Adultos

| ID | Condicion | Hecho calculado | Fuente |
|---|---|---|---|
| `HK-RSK-001` | Adulto con K `5.5-5.9 mmol/L` y sin criterios criticos | Hiperpotasemia leve | `SRC-UKKA-2023` |
| `HK-RSK-002` | Adulto con K `6.0-6.4 mmol/L` y sin criterios criticos | Hiperpotasemia moderada | `SRC-UKKA-2023`, `SRC-RCUK-2025-ADULT` |
| `HK-RSK-003` | Adulto con K `>=6.5 mmol/L` | Hiperpotasemia severa | `SRC-UKKA-2023`, `SRC-RCUK-2025-ADULT` |
| `HK-RSK-004` | Cualquier K con ECG de riesgo o inestabilidad compatible | Hiperpotasemia critica funcional | `SRC-RCUK-2025-ADULT` |

### Pediatria

| ID | Condicion | Hecho calculado | Fuente |
|---|---|---|---|
| `HK-PED-001` | Nino con K `5.5-6.0 mmol/L` | Hiperpotasemia pediatrica leve | `SRC-RCH-2024-PED` |
| `HK-PED-002` | Nino con K `6.1-7.0 mmol/L` | Hiperpotasemia pediatrica moderada | `SRC-RCH-2024-PED` |
| `HK-PED-003` | Nino con K `>7.0 mmol/L` | Hiperpotasemia pediatrica severa | `SRC-RCH-2024-PED` |
| `HK-PED-004` | Cualquier K con ECG de riesgo, arritmia, sincope, debilidad severa o inestabilidad | Hiperpotasemia pediatrica critica funcional | `SRC-RCH-2024-PED` |

## 6. Reglas ECG

| ID | Condicion | Hecho calculado | Fuente |
|---|---|---|---|
| `HK-ECG-001` | T picudas compatibles | ECG compatible con hiperpotasemia | `SRC-RCH-2024-PED`, `SRC-RCUK-2025-ADULT` |
| `HK-ECG-002` | PR prolongado, aplanamiento o perdida de P | Alteracion de conduccion compatible | `SRC-RCH-2024-PED` |
| `HK-ECG-003` | QRS ancho | Riesgo arritmico alto | `SRC-RCH-2024-PED`, `SRC-RCUK-2025-ADULT` |
| `HK-ECG-004` | Bradicardia, bloqueo, TV/FV, PEA, asistolia o patron sinusoidal | Riesgo vital | `SRC-RCH-2024-PED`, `SRC-RCUK-2025-ADULT` |
| `HK-ECG-005` | ECG normal | ECG normal no excluye riesgo | `SRC-RCH-2024-PED` |

## 7. Reglas de seguridad y bloqueo

| ID | Condicion | Bloqueo o advertencia | Fuente |
|---|---|---|---|
| `HK-SAFE-001` | Tratamiento que requiere glucemia y glucemia no vigente | Bloquear dosis y solicitar glucemia | `SRC-RCUK-2025-ADULT`, `SRC-RCH-2024-PED` |
| `HK-SAFE-002` | Paciente pediatrico y peso no vigente | Bloquear dosis por kg; solicitar o estimar peso segun protocolo | `SRC-RCH-2024-PED` |
| `HK-SAFE-003` | Sospecha de toxicidad digitalica | Advertencia critica para calcio IV; requiere decision senior/protocolo local | `SRC-RCH-2024-PED`, `SRC-RCUK-2025-ADULT` |
| `HK-SAFE-004` | Calcio y bicarbonato por misma via simultanea | Bloqueo de administracion simultanea | `SRC-RCH-2024-PED`, `SRC-RCUK-2025-ADULT` |
| `HK-SAFE-005` | Accion critica propuesta | Requiere confirmacion profesional antes de registrar ejecucion | Contrato funcional NexoClx |
| `HK-SAFE-006` | Dato dinamico obsoleto o dudoso | No usar para conducta definitiva sin actualizacion o confirmacion | Contrato funcional NexoClx |

## 8. Recomendaciones terapeuticas adultas

Las recomendaciones se generan a partir de reglas y capacidades. La administracion siempre requiere confirmacion profesional.

| ID | Condicion de entrada | Recomendacion | Fuente | Capacidades minimas esperadas |
|---|---|---|---|---|
| `HK-TX-001` | ECG de riesgo o hiperpotasemia critica funcional | Estabilizar membrana con calcio IV segun formulacion disponible | `SRC-RCUK-2025-ADULT`, `SRC-UKKA-2023` | Via IV, monitorizacion, farmaco disponible |
| `HK-TX-002` | Adulto con hiperpotasemia moderada o severa | Desplazar potasio al espacio intracelular con insulina soluble y glucosa IV | `SRC-RCUK-2025-ADULT`, `SRC-UKKA-2023` | Via IV, glucemia vigente, monitorizacion glucemica |
| `HK-TX-003` | Adulto con hiperpotasemia moderada o severa | Anadir salbutamol nebulizado como adyuvante | `SRC-RCUK-2025-ADULT`, `SRC-UKKA-2023` | Nebulizacion, monitorizacion clinica |
| `HK-TX-004` | Hiperpotasemia moderada o severa, si disponible/local | Favorecer eliminacion con captador moderno de potasio segun protocolo | `SRC-RCUK-2025-ADULT`, `SRC-UKKA-2023` | Farmaco disponible, via enteral segura |
| `HK-TX-005` | Acidosis metabolica relevante o parada por hiperpotasemia segun contexto | Considerar bicarbonato segun protocolo | `SRC-RCUK-2025-ADULT`, `SRC-RCH-2024-PED` | Via IV, gasometria/contexto, no administracion simultanea con calcio por misma via |
| `HK-TX-006` | Falla renal grave, anuria, hiperpotasemia severa refractaria o rebote | Considerar dialisis urgente/interconsulta nefrologia | `SRC-RCUK-2025-ADULT`, `SRC-UKKA-2023` | Nefrologia/dialisis o traslado a centro util |
| `HK-TX-007` | Sospecha de aporte o farmaco causante | Suspender aportes de potasio y farmacos relacionados si clinicamente seguro | `SRC-RCH-2024-PED`, `SRC-UKKA-2023` | Revision medicacion, decision profesional |

### Dosis adultas versionables

| Regla | Valor vigente v0.1 | Fuente |
|---|---|---|
| `HK-TX-001A` | Cloruro calcico 10% 10 mL IV en 5 min | `SRC-RCUK-2025-ADULT` |
| `HK-TX-001B` | Si cloruro calcico no disponible: gluconato calcico 10% 30 mL IV en 10 min | `SRC-RCUK-2025-ADULT` |
| `HK-TX-002A` | Insulina soluble 10 unidades IV + glucosa 25 g IV | `SRC-RCUK-2025-ADULT` |
| `HK-TX-002B` | Si glucemia pretratamiento `<7 mmol/L`, seguir con glucosa 10% a 50 mL/h durante 5 h | `SRC-RCUK-2025-ADULT` |
| `HK-TX-003A` | Salbutamol nebulizado 10-20 mg | `SRC-RCUK-2025-ADULT` |
| `HK-TX-004A` | Zirconio ciclosilicato sodico 10 g VO | `SRC-RCUK-2025-ADULT` |
| `HK-TX-005A` | En parada hiperpotasemica: bicarbonato sodico 50 mmol IV por via separada o con lavado entre farmacos | `SRC-RCUK-2025-ADULT` |

## 9. Recomendaciones pediatricas

| ID | Condicion de entrada | Recomendacion | Fuente | Capacidades minimas esperadas |
|---|---|---|---|---|
| `HK-PED-TX-001` | Hiperpotasemia pediatrica moderada o severa | Monitorizacion cardiaca continua y via IV | `SRC-RCH-2024-PED` | Monitor ECG, via IV |
| `HK-PED-TX-002` | Muestra inicial criticamente alta y contexto compatible | Iniciar tratamiento sin esperar segunda muestra | `SRC-RCH-2024-PED` | Capacidad de tratamiento y monitorizacion |
| `HK-PED-TX-003` | ECG de riesgo o hiperpotasemia con riesgo vital | Estabilizar membrana con calcio IV/IO segun formulacion disponible | `SRC-RCH-2024-PED` | Peso vigente, via IV/IO, monitorizacion |
| `HK-PED-TX-004` | Hiperpotasemia pediatrica severa | Desplazar potasio con glucosa e insulina segun protocolo pediatrico | `SRC-RCH-2024-PED` | Peso vigente, glucemia, via IV, monitorizacion |
| `HK-PED-TX-005` | Hiperpotasemia pediatrica moderada/severa | Salbutamol nebulizado segun peso como opcion de desplazamiento | `SRC-RCH-2024-PED` | Peso vigente, nebulizacion |
| `HK-PED-TX-006` | Acidosis metabolica relevante | Considerar bicarbonato segun protocolo pediatrico | `SRC-RCH-2024-PED` | Gasometria/contexto, via IV, no simultaneo con calcio |
| `HK-PED-TX-007` | Severa, dialisis requerida o centro sin capacidad | Consultar/trasladar a equipo pediatrico/UCIP/centro terciario | `SRC-RCH-2024-PED` | Capacidad de consulta/traslado |

### Dosis pediatricas versionables

| Regla | Valor vigente v0.1 | Fuente |
|---|---|---|
| `HK-PED-TX-003A` | Gluconato calcico 10% 0.15 mmol/kg, maximo 6.6 mmol; equivalente RCH 0.68 mL/kg, maximo 30 mL | `SRC-RCH-2024-PED` |
| `HK-PED-TX-003B` | Cloruro calcico 10% 0.14 mmol/kg, maximo 6.8 mmol; equivalente RCH 0.2 mL/kg, maximo 10 mL | `SRC-RCH-2024-PED` |
| `HK-PED-TX-004A` | Glucosa 10% 5 mL/kg IV bolus si no hay hiponatremia | `SRC-RCH-2024-PED` |
| `HK-PED-TX-004B` | Insulina rapida 0.1 unidades/kg IV bolus, maximo 10 unidades | `SRC-RCH-2024-PED` |
| `HK-PED-TX-005A` | Salbutamol nebulizado 2.5 mg si peso `<=25 kg`; 5 mg si peso `>25 kg`; maximo 10-20 mg | `SRC-RCH-2024-PED` |
| `HK-PED-TX-006A` | Bicarbonato sodico 8.4% 1-3 mmol/kg en severa con acidosis; 1 mmol/kg en leve-moderada con acidosis | `SRC-RCH-2024-PED` |

## 10. Reevaluacion

| ID | Condicion | Reevaluacion | Fuente |
|---|---|---|---|
| `HK-RV-001` | Calcio administrado por ECG de riesgo | Reevaluar ECG y ritmo tras administracion; repetir/escala si no normaliza segun protocolo | `SRC-RCH-2024-PED`, `SRC-RCUK-2025-ADULT` |
| `HK-RV-002` | Insulina-glucosa administrada | Monitorizar glucemia de forma seriada por riesgo de hipoglucemia | `SRC-RCH-2024-PED`, `SRC-RCUK-2025-ADULT`, `SRC-UKKA-2023` |
| `HK-RV-003` | Tratamiento de desplazamiento o eliminacion iniciado | Repetir potasio segun protocolo local y contexto de riesgo | `SRC-UKKA-2023`, `SRC-RCH-2024-PED` |
| `HK-RV-004` | Rama pediatrica moderada/severa | Mantener monitorizacion cardiaca y control estrecho hasta estabilidad | `SRC-RCH-2024-PED` |
| `HK-RV-005` | K normalizado pero causa no corregida o riesgo de rebote | Mantener vigilancia o plan de repeticion | `SRC-UKKA-2023` |

## 11. Escalada y destino

| ID | Condicion | Recomendacion de destino | Fuente |
|---|---|---|---|
| `HK-ESC-001` | Parada o peri-parada | Abrir flujo PCR/peri-parada y tratar hiperpotasemia como causa reversible | `SRC-RCUK-2025-ADULT` |
| `HK-ESC-002` | Hiperpotasemia severa refractaria, anuria o necesidad de dialisis | Interconsulta nefrologia/UCI y valorar dialisis urgente | `SRC-RCUK-2025-ADULT`, `SRC-UKKA-2023` |
| `HK-ESC-003` | Pediatrico severo, dialisis requerida o centro sin recursos | Consultar UCIP/equipo pediatrico y trasladar si procede | `SRC-RCH-2024-PED` |
| `HK-061-001` | 061 con ECG de riesgo o K severa conocida | Prealerta y traslado a centro con monitorizacion avanzada | Derivado de fuentes adultas/ped y contrato 061 |
| `HK-061-002` | Sospecha de dialisis necesaria | Priorizar hospital util con nefrologia/dialisis/UCI o UCIP segun edad | `SRC-RCUK-2025-ADULT`, `SRC-RCH-2024-PED` |
| `HK-DST-001` | K normal y estable, asintomatico, ECG normal, causa identificada/tratada, seguimiento asegurado | Puede considerarse alta/seguimiento segun contexto | `SRC-RCH-2024-PED`, `SRC-UKKA-2023` |
| `HK-DST-002` | AP con K moderada/severa, ECG no disponible o dato no confirmable con seguridad | Derivacion urgente a Urg o activacion 061 segun gravedad | Derivado de fuentes y capacidades AP |

## 12. Matriz de dependencias

| Regla | Motores | Flujos | Microherramientas | Capacidades | Fuentes |
|---|---|---|---|---|---|
| `HK-DX-001` | Analitica | - | - | Analitica disponible | `SRC-UKKA-2023` |
| `HK-DX-004` | Analitica | Reevaluacion | Repetir muestra | Analitica disponible | `SRC-RCH-2024-PED`, `SRC-UKKA-2023` |
| `HK-RSK-003` | Analitica, ECG | Monitorizacion | ECG | ECG, monitor | `SRC-RCUK-2025-ADULT` |
| `HK-ECG-003` | ECG | Monitorizacion | Interpretacion ECG | ECG vigente | `SRC-RCH-2024-PED` |
| `HK-TX-001` | Dosis/farmaco | Monitorizacion, confirmacion | Dosis IV | Via IV, monitor, calcio | `SRC-RCUK-2025-ADULT` |
| `HK-TX-002` | Dosis, glucemia | Monitorizacion, confirmacion | Glucemia, dosis | Via IV, glucemia, insulina/glucosa | `SRC-RCUK-2025-ADULT` |
| `HK-TX-006` | Funcion renal | Interconsulta/traslado | eGFR | Nefrologia/dialisis o traslado | `SRC-UKKA-2023`, `SRC-RCUK-2025-ADULT` |
| `HK-PED-TX-003` | Peso/dosis pediatrica | Monitorizacion, confirmacion | Dosis pediatrica | Peso, via IV/IO, monitor, calcio | `SRC-RCH-2024-PED` |
| `HK-PED-TX-007` | Pediatrico base | Traslado/interconsulta | - | UCIP/pediatria/traslado | `SRC-RCH-2024-PED` |
| `HK-061-002` | Funcion renal, pediatrico si aplica | Traslado/prealerta | - | SVA, hospital util | `SRC-RCUK-2025-ADULT`, `SRC-RCH-2024-PED` |

## 13. Validacion clinica requerida antes de implementar

Casos obligatorios:

1. Adulto K leve, estable, ECG normal.
2. Adulto K moderada, ECG normal, ERC.
3. Adulto K severa con ECG de riesgo.
4. ECG de riesgo con K pendiente.
5. Muestra hemolizada discordante.
6. Glucemia no disponible antes de tratamiento con insulina.
7. Sospecha de toxicidad digitalica.
8. Anuria o dialisis probable.
9. AP sin ECG disponible.
10. 061 con K severa conocida.
11. Nino con K moderada.
12. Nino severo sin peso vigente.
13. Neonato con K elevado segun umbral neonatal.
14. Hipoglucemia tras tratamiento.
15. Rebote de potasio tras descenso.
16. Cambio de rama por nuevo ECG.
17. Embarazo.
18. Acidosis metabolica relevante.

Criterios de seguridad:

- No mostrar dosis pediatrica sin peso vigente o estimacion confirmada.
- No mostrar tratamiento con insulina sin glucemia vigente.
- No ignorar ECG de riesgo.
- No proponer alta con inestabilidad, ECG de riesgo o K severa no resuelta.
- No registrar accion critica sin confirmacion profesional.
- No usar dato obsoleto como vigente.
- No mezclar calcio y bicarbonato por la misma via sin separacion/lavado segun protocolo.
- No ocultar necesidad de escalada si dialisis probable.

## 14. Analisis de independencia A/B/C

Escenarios que debe superar este Documento B:

- Cambiar `HK-RSK-003` no debe modificar Documento A ni C.
- Cambiar una dosis `HK-TX-*A` no debe modificar Documento A.
- Cambiar disponibilidad de calcio, monitor o dialisis debe modificar Documento C, no esta base clinica.
- Cambiar el flujo de estados debe modificar Documento A, no los umbrales clinicos aqui definidos.

## 15. Limitaciones v0.1

- Pendiente validacion por responsable clinico.
- Pendiente adaptacion a protocolos locales de farmacos, presentaciones y administracion.
- Pendiente decidir fuente pediatrica local preferente si difiere de RCH.
- Pendiente revisar texto completo del consenso SEMES-SEC-SEN para integracion nacional definitiva.
- Pendiente confirmar estrategia de captadores de potasio disponibles en cada app/contexto.
