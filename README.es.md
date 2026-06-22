# Árbol de conocimiento Físico-Matemático

[English version](./README.md)

Mapa accesible, bilingüe y disponible sin conexión de los prerrequisitos necesarios para aprender matemáticas y física.

![Ruta de aprendizaje enfocada en el grafo interactivo](./docs/screenshot.png)

## Qué incluye

La aplicación representa un currículo como grafo acíclico dirigido. Sus 90 temas conectan fundamentos matemáticos, métodos científicos transversales y física, desde aritmética hasta teoría cuántica de campos y cosmología.

No tiene dependencias de ejecución ni requiere un framework: utiliza HTML, CSS, SVG y JavaScript estándar. Esto reduce la superficie de mantenimiento y hace que el código sea fácil de revisar y desplegar.

### Funciones principales

- Grafo interactivo con desplazamiento, zoom, ajuste automático, búsqueda y filtros.
- Vista alternativa en lista, completamente navegable con teclado.
- Interfaz y contenido en español e inglés.
- Estados de aprendizaje, favoritos, temas desbloqueados, recomendaciones y rutas hacia objetivos concretos.
- Progreso local con importación y exportación JSON; sin cuenta, analítica ni peticiones a terceros.
- Temas claro, oscuro y automático; diseño adaptable y soporte de movimiento reducido.
- Aplicación web instalable y disponible sin conexión.
- Enlaces compartibles a temas y rutas enfocadas.

### Calidad del repositorio

- Validación de referencias, traducciones, taxonomías y ausencia de ciclos.
- Pruebas unitarias de recorrido del grafo, búsqueda, recomendaciones y persistencia.
- Comprobaciones de sintaxis, formato, enlaces locales y caché offline.
- Compilación estática reproducible en `dist/`.
- CI, análisis CodeQL y despliegue automático a GitHub Pages.
- Plantillas de incidencias y PR, Dependabot, política de seguridad y guía de contribución.

## Uso local

Se necesita Node.js 22 o posterior. No se descargan paquetes de terceros.

```bash
npm ci
npm run dev
```

Abre `http://127.0.0.1:4173`.

Ejecuta toda la batería de calidad:

```bash
npm run check
```

Genera la versión desplegable:

```bash
npm run build
```

## Estructura

- `src/data/topics.js`: currículo bilingüe y taxonomía.
- `src/lib/`: algoritmos puros de grafo, búsqueda, almacenamiento y URL.
- `src/app.js`: estado e interacciones de la interfaz.
- `tests/`: pruebas con el runner integrado de Node.js.
- `scripts/`: servidor, compilación y validadores.
- `docs/`: arquitectura y guía de edición de contenido.
- `.github/`: automatización, seguridad y colaboración.

Antes de modificar el currículo, consulta la [guía de contenido](./docs/CONTENT_GUIDE.md). Para cambios de código, lee [CONTRIBUTING.md](./CONTRIBUTING.md).

## Privacidad

El progreso se guarda únicamente en el navegador, bajo una clave versionada de `localStorage`. La aplicación no incorpora analítica, anuncios, cookies, fuentes remotas, contenido embebido ni llamadas a API. Borrar los datos del sitio elimina el progreso salvo que se haya exportado antes.

## Licencia

Proyecto publicado bajo la [licencia MIT](./LICENSE).
