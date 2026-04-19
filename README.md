# Proyecto #1: CRUD Application — blogged.

Aplicación web de tipo blog que implementa CRUD completo sobre una API REST, construida con HTML, CSS y JavaScript Vanilla.

## Descripción

**blogged.** permite listar, crear, editar y eliminar publicaciones consumiendo la API de [DummyJSON](https://dummyjson.com). La interfaz es navegable, con feedback visual al usuario en cada operación, organizada en módulos JavaScript con separación clara de responsabilidades.

## API utilizada

[DummyJSON](https://dummyjson.com) — API REST mock que soporta GET, POST, PATCH y DELETE de forma nativa.

| Verbo | Endpoint | Uso |
|-------|----------|-----|
| GET | `/posts?limit=&skip=` | Listar publicaciones paginadas |
| GET | `/posts/:id` | Detalle de una publicación |
| GET | `/users/:id` | Obtener autor por ID |
| POST | `/posts/add` | Crear nueva publicación |
| PATCH | `/posts/:id` | Editar publicación existente |
| DELETE | `/posts/:id` | Eliminar publicación |

## Funcionalidades

- Listado paginado de publicaciones (10 por página)
- Vista de detalle con todos los campos del post
- Crear publicación con validaciones desde JavaScript
- Editar publicación con formulario precargado
- Eliminar publicación con confirmación modal
- Búsqueda y filtrado por autor, categoría (tag) y texto
- Sistema de favoritos con paginación propia
- Feedback visual: spinner, toasts de éxito/error, estado vacío

## Sección adicional: Favoritos

Implementamos una sección de **Favoritos** que permite al usuario guardar posts de interés y consultarlos en una vista dedicada. Se eligió esta sección porque agrega valor real a la experiencia de lectura: el usuario puede marcar posts desde el listado o el detalle, y acceder a todos sus guardados desde la barra de navegación. Los favoritos se sincronizan visualmente entre la lista principal y la vista de favoritos.

## Estructura del proyecto

```
proyecto-blog/
├── index.html
├── .gitignore
├── README.md
├── css/
│   ├── main.css          ← estilos globales y variables
│   ├── components.css    ← cards, botones, formularios
│   └── layout.css        ← navegación y estructura de páginas
└── js/
    ├── api.js            ← todas las funciones fetch
    ├── ui.js             ← funciones que manipulan el DOM
    ├── validation.js     ← validaciones de formularios
    ├── router.js         ← lógica de navegación entre vistas
    ├── main.js           ← punto de entrada e inicialización
    ├── home.js           ← lógica de la vista principal
    ├── detail.js         ← lógica de la vista de detalle
    ├── forms.js          ← configuración de formularios
    ├── favorites.js      ← lógica de la vista de favoritos
    └── state.js          ← estado global de la aplicación
```

## Instrucciones para correr el proyecto

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/proyecto-blog.git
   ```
2. Abrí la carpeta en VS Code.
3. Instalá la extensión **Live Server** si no la tenés.
4. Hacé clic derecho sobre `index.html` → **Open with Live Server**.
5. La app abre en `http://127.0.0.1:5500/index.html`.

## Integrantes

| Nombre | Carné |
|--------|-------|
| Andrés Ismalej | 24005 |
| Mariana Castañeda | 24481 |

## Demo en video

[Ver video de demostración](https://youtu.be/AybkyXTz57I)

## Aplicación desplegada

[Ver app en producción](https://marianacastanedar.github.io/proyecto-blog)


## Screenshot

![Screenshot de la aplicación](https://github.com/marianacastanedar/proyecto-blog/blob/09bf974a042ed93001afe4a9c9c1b51f9e9118e2/images/Home.png)
