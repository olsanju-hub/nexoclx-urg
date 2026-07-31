# README_DEVELOPMENT.md

Documento interno de desarrollo de NexoClx Urg. No sustituye al README principal ni a la documentacion funcional o clinica.

## Estado del proyecto

- Fase actual: Fase 2 - Ingenieria de contenidos clinicos.
- Fase 1 - Arquitectura: cerrada y congelada.
- Gold Standard: Hiperpotasemia, en preparacion.
- Version del Gold Standard: pendiente de Documento A/B/C.
- Estado de validacion: no validado.
- Proximos hitos:
  1. Documento A - Especificacion Funcional de Hiperpotasemia.
  2. Documento B - Base de Conocimiento Clinica.
  3. Documento C - Catalogo de Capacidades.
  4. Validacion del piloto frente al contrato funcional.
  5. Declaracion de Gold Standard v1.0 si supera la validacion.

## Filosofia de NexoClx

NexoClx no es una biblioteca de protocolos. Es una plataforma de asistentes clinicos para reducir tiempo, errores y carga cognitiva en la toma de decisiones.

Principios:

- La app debe ayudar a decidir, no obligar a leer.
- Cada asistente debe terminar en una conducta clinica valida.
- No se crean herramientas si no modifican una decision clinica.
- No se duplica logica clinica.
- La arquitectura congelada no se reabre por preferencias de diseno ni casos aislados.
- Cualquier recomendacion debe ser trazable.
- Las acciones criticas requieren confirmacion profesional.

## Arquitectura congelada

La arquitectura se organiza en capas:

- Contexto clinico compartido: datos del paciente reutilizables con origen, fecha/hora, ambito y vigencia.
- Motores compartidos: logica clinica o matematica testeable de forma aislada.
- Flujos reutilizables: secuencias clinicas comunes como ABCDE, reevaluacion, analgesia, sedacion, oxigenoterapia, monitorizacion, interconsulta, traslado o alta segura.
- Entradas sindromicas: puertas de entrada que orientan sin resolver toda la patologia.
- Asistentes especificos: resuelven un problema clinico concreto.
- Microherramientas: calculos o selectores rapidos accesibles desde cualquier flujo.
- Navegacion clinica: grafo contextual que conserva datos y permite ida/vuelta entre asistentes, flujos y microherramientas.

## Modelo Gold Standard

Todo asistente debe expresarse mediante tres artefactos independientes:

- Documento A - Especificacion Funcional: estable. Define alcance, flujo, estados, bloqueos, dependencias, capacidades requeridas, UX, gobernanza, validacion y metricas. No contiene dosis, umbrales ni tratamientos concretos.
- Documento B - Base de Conocimiento Clinica: versionable. Contiene reglas identificadas, umbrales, tratamientos, dosis, contraindicaciones, fuentes, protocolos locales y vigencia.
- Documento C - Catalogo de Capacidades: compartido. Declara recursos, medicacion, pruebas, procedimientos, monitorizacion y requisitos de confirmacion disponibles por contexto asistencial.

Independencia obligatoria:

- Cambiar un umbral clinico debe modificar solo el Documento B.
- Anadir una capacidad debe modificar solo el Documento C y la conducta derivada.
- Cambiar el flujo funcional debe afectar solo al Documento A.

## Contrato funcional

Todo asistente debe definir:

- objetivo clinico y limites;
- contexto heredado y vigencia de datos;
- datos minimos y bloqueos;
- deteccion de gravedad cuando proceda;
- interpretacion e incertidumbre;
- reglas calculadas, recomendaciones, decision profesional y conducta ejecutada como conceptos separados;
- tratamiento, dosis, contraindicaciones y confirmaciones solo si aplican;
- reevaluacion si aplica;
- conducta final valida;
- fuentes trazables;
- gobernanza, versionado, pruebas y metricas.

Un asistente no se considera completo si tiene ramas sin salida, pide datos vigentes dos veces, genera acciones criticas sin confirmacion o no puede auditarse.

## Flujo obligatorio de desarrollo

1. Analizar alcance, archivos afectados, riesgos y dependencias.
2. Implementar de forma modular y reutilizando componentes existentes.
3. Ejecutar `npm run build`.
4. Validar comportamiento, navegacion, responsive, overflow y contrato funcional.
5. Commit con mensaje claro.
6. Push inmediato a la rama de trabajo.
7. Informar objetivo, archivos, hash, rama, build, comprobaciones, completado y pendiente.

No se avanza al siguiente objetivo funcional si el actual no cumple calidad.

## Reglas de Git

- Cada objetivo funcional terminado implica un commit.
- Cada commit implica push inmediato.
- No se acumulan cambios grandes.
- Los mensajes de commit deben ser claros y descriptivos.
- No se mezclan cambios no relacionados.
- No se revierten cambios ajenos sin peticion explicita.

## Estandares de calidad

Un asistente debe demostrar:

- expresion completa mediante documentos A/B/C;
- respeto del contrato funcional;
- reutilizacion de contexto, motores, flujos y microherramientas;
- ausencia de logica duplicada;
- trazabilidad completa;
- adaptacion a AP, Urg, 061 y Ped segun capacidades;
- alternativas cuando falta una capacidad;
- ausencia de ramas sin salida;
- conducta clinica valida en toda ruta;
- no pedir datos vigentes dos veces;
- casos de prueba superados;
- independencia entre documentos A/B/C;
- rendimiento y trazabilidad del Gold Standard.

## Estado de los asistentes

| Asistente | Estado | Version | Fase | Validacion | Observaciones |
|---|---|---|---|---|---|
| Hiperpotasemia Gold Standard | En especificacion | Pendiente | Fase 2 | No validado | Primer piloto; debe generar Documento A, B y C. |

## Registro de decisiones

| Fecha | Decision | Motivo |
|---|---|---|
| 2026-07-31 | Arquitectura general cerrada y congelada. | Evitar sobreingenieria y pasar a validacion practica. |
| 2026-07-31 | Fase 2 activada con Hiperpotasemia como Gold Standard. | Piloto suficientemente delimitado y capaz de tensionar contexto, motores, flujos, microherramientas, capacidades y seguridad. |
| 2026-07-31 | Modelo A/B/C obligatorio. | Separar arquitectura estable, conocimiento clinico versionable y capacidades operativas. |
| 2026-07-31 | Regla de aceptacion de asistentes fijada. | Ningun asistente puede desarrollarse fuera del Gold Standard. |
