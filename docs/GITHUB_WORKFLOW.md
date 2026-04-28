# Flujo de trabajo en GitHub

Este proyecto usa GitHub como sistema de trabajo, no solo como copia del codigo.

## Reglas simples

1. `main` siempre debe estar estable.
2. Cada cambio concreto empieza con un issue.
3. Cada issue se trabaja en una rama propia.
4. Todo cambio entra por pull request.
5. La app debe compilar antes de mezclar.
6. El despliegue a GitHub Pages se hace desde `main`.

## Ramas

Usa nombres cortos y con intencion:

- `feature/modulo-sepsis`
- `fix/calculo-cockcroft`
- `content/biblio-ictus`
- `docs/readme-modulos`
- `chore/limpieza-pwa`

Evita trabajar directamente en `main`.

## Issues

Tipos recomendados:

- `Bug`: algo funciona mal.
- `Mejora`: nueva funcionalidad o mejora visible.
- `Tarea`: trabajo tecnico, contenido, bibliografia o mantenimiento.

Cada issue debe responder:

- que hay que hacer
- por que importa
- que queda dentro del alcance
- como se comprobara

## Project

Un tablero simple es suficiente:

- `Backlog`: ideas o tareas aceptadas, aun sin empezar.
- `Ready`: tareas claras y preparadas para trabajar.
- `In progress`: trabajo activo.
- `Review`: pull request abierto.
- `Done`: mezclado en `main`.

Campos utiles:

- `Type`: bug, mejora, tarea, contenido, documentacion.
- `Area`: app, contenido clinico, calculos, medicamentos, bibliografia, PWA.
- `Priority`: alta, media, baja.

## Pull requests

Un PR debe ser pequeno y tener una razon clara.

Antes de abrirlo:

```bash
npm run build
```

El PR debe explicar:

- que cambia
- por que cambia
- como se comprobo
- si afecta a contenido clinico, bibliografia, calculos o medicamentos

## Validaciones automaticas

El workflow `CI` se ejecuta en cada pull request contra `main` y en cada push a `main`.

Actualmente comprueba:

- instalacion limpia con `npm ci`
- compilacion con `npm run build`

Cuando el proyecto crezca, se pueden anadir:

- lint
- tests unitarios
- tests de interfaz
- auditoria de enlaces o referencias bibliograficas

## Despliegue

El workflow `Deploy GitHub Pages` publica la app cuando hay cambios en `main`.

Flujo recomendado:

1. Crear issue.
2. Crear rama desde `main`.
3. Hacer cambios.
4. Abrir PR.
5. Esperar CI correcta.
6. Revisar y mezclar.
7. GitHub Pages despliega desde `main`.

## Rutina diaria

```bash
git switch main
git pull
git switch -c feature/nombre-del-cambio
```

Despues de trabajar:

```bash
npm run build
git status
git add .
git commit -m "Describe el cambio"
git push -u origin feature/nombre-del-cambio
```

Luego abre un pull request en GitHub y enlazalo con el issue usando `Closes #numero`.
