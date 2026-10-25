# 👕 Tienda — Proyecto JS (POO + DOM + API)

Aplicación web de una tienda online en **JavaScript vanilla**, sin frameworks. Muestra un catálogo de productos paginado, permite filtrarlo por texto y categoría y añadir productos a un carrito que respeta el stock disponible.

El proyecto se ha construido por fases, siguiendo el temario del bootcamp:

1. **Modelo de dominio con POO** → clases que representan la lógica de negocio (`Product`, `Shop`, `Cart`…).
2. **Manipulación del DOM** → catálogo, paginación, filtros y carrito en pantalla.
3. **Consumo de API** → el catálogo se carga desde [DummyJSON](https://dummyjson.com/docs/products).

> ⚠️ Regla de oro del proyecto: **las clases del modelo no saben nada del DOM ni de `fetch`.**
> Por eso las mismas clases sirven para las tres versiones del proyecto.

---

## 🧭 Las tres versiones

El repositorio contiene **tres versiones de la misma aplicación**. Hacen lo mismo de cara al usuario; cambia cómo está organizado el código por dentro. Están pensadas para leerse en este orden:

| Carpeta | Para quién | Idea principal |
|---|---|---|
| [`sencilla/`](sencilla/) | Primer contacto con el DOM | Todo directo: unas variables para el estado, unas funciones y los eventos. Sin clases de interfaz. |
| [`v1/`](v1/) | Cuando la sencilla está clara | Se separa la paginación en una clase **`Paginator` reutilizable**. Los datos se paginan **en el cliente**. |
| [`v2/`](v2/) | Para entender cómo se trabaja con una API | La paginación se hace **"en el servidor"**: el paginador pide una página y recibe solo esa página y el total. Los datos llegan a través de un **repositorio**. |

### ¿En qué se diferencian?

| | `sencilla/` | `v1/` | `v2/` |
|---|---|---|---|
| ¿Quién tiene todos los productos? | El navegador | El navegador | El "servidor" (simulado con `InMemoryProductRepository`) |
| ¿Quién corta la página? | `showPage()` en `index.js` con `slice` | La clase `Paginator` con `slice` | El repositorio; el paginador solo pide la página |
| ¿Cómo se sabe el nº de páginas? | `productsToShow.length` | `items.length` | El `total` que devuelve el repositorio |
| ¿Dónde está el stock? | En `Shop` (`InventoryEntry`) | En `Shop` (`InventoryEntry`) | En `Product` (como lo manda la API) |
| Formulario de filtros | Escrito en el HTML | Creado con JS | Creado con JS |
| Comprobación de stock al comprar | `if` en `index.js` | `Shop.addToCart()` con `throw` | `Shop.addToCart()` con `throw` |
| Líneas de JS (sin datos) | ~480 | ~590 | ~625 |

Explicación detallada de cada versión y de las decisiones de diseño en la [memoria técnica](docs/memoria-tecnica.md#7-las-tres-versiones).

---

## 🎯 Funcionalidades

Las tres versiones implementan lo mismo:

- [x] Catálogo de 194 productos (24 categorías) en tarjetas: imagen, nombre, descripción, precio y stock
- [x] Paginación de 10 en 10 con botones *Previous* / *Next* y texto "Page X of Y"
- [x] Los botones de paginación se desactivan en la primera y la última página
- [x] Búsqueda por texto en el título (sin distinguir mayúsculas)
- [x] Filtro por categoría (con opción *All*), combinable con la búsqueda
- [x] Al filtrar se vuelve a la página 1
- [x] Añadir productos al carrito con el botón *Buy*
- [x] No se puede añadir más unidades de las que hay en stock (se avisa con un `alert`)
- [x] Contador del carrito (🛒 N) y desplegable con líneas, subtotales y total en euros
- [x] Precios almacenados en céntimos y mostrados con formato `19.99€`

`v1/` y `v2/` además desactivan el botón *Buy* de los productos agotados y admiten **scroll infinito** (opción `infiniteScroll: true` del paginador).

---

## ▶️ Cómo ponerlo en marcha

Los proyectos usan **módulos de JavaScript** (`import` / `export`) y cargan un JSON con `import ... with { type: "json" }`. Por eso **no funcionan abriendo el `index.html` con doble click** (`file://`): el navegador bloquea los módulos. Hay que servirlos con un servidor local, y lo más cómodo es **Live Server** en VS Code.

### Requisitos

- [Visual Studio Code](https://code.visualstudio.com/)
- Extensión **Live Server** (de Ritwick Dey)
- Un navegador actualizado (Chrome / Edge 123+, Firefox 138+ o Safari 17.2+), necesario para la sintaxis `with { type: "json" }`

### Instalar Live Server (solo la primera vez)

1. Abre VS Code.
2. Ve a la pestaña **Extensiones** (`Ctrl+Shift+X`, en Mac `Cmd+Shift+X`).
3. Busca **Live Server** e instala la de *Ritwick Dey*.

### Arrancar una versión

1. En VS Code: **File → Open Folder…** y abre la carpeta raíz del proyecto (`tienda/`).
2. En el explorador de archivos, entra en la carpeta de la versión que quieras:
   - `sencilla/index.html`
   - `v1/index.html`
   - `v2/index.html`
3. Haz **click derecho sobre ese `index.html` → "Open with Live Server"**.
4. Se abre el navegador en una dirección como:

   | Versión | URL |
   |---|---|
   | Sencilla | `http://127.0.0.1:5500/sencilla/index.html` |
   | v1 | `http://127.0.0.1:5500/v1/index.html` |
   | v2 | `http://127.0.0.1:5500/v2/index.html` |

5. Con Live Server en marcha, cada vez que guardes un archivo la página se recarga sola.

Para cambiar de versión no hace falta parar nada: abre en el navegador la URL de la otra carpeta (o repite el paso 3 con su `index.html`). Para parar el servidor, pulsa **"Port: 5500"** en la barra inferior de VS Code.

> También se puede abrir directamente una sola carpeta (por ejemplo `v1/`) con *Open Folder* y pulsar **"Go Live"** en la barra inferior. En ese caso la URL será `http://127.0.0.1:5500/index.html`.

### Si algo no funciona

| Síntoma | Causa y solución |
|---|---|
| Página en blanco y en la consola (`F12`) sale un error de **CORS** o `file://` | Has abierto el HTML con doble click. Ábrelo con Live Server. |
| Error `Unexpected identifier 'with'` o `assert` | El navegador es antiguo y no entiende `import ... with { type: "json" }`. Actualízalo. |
| Error `Failed to load module script ... MIME type` | El archivo no se está sirviendo desde Live Server o la ruta del `import` está mal escrita (las rutas distinguen mayúsculas). |
| No aparecen productos y no hay errores | Comprueba que existe `data/products.json` dentro de la carpeta de la versión. |

---

## 🗂️ Estructura

```
tienda/
├── README.md
├── docs/
│   ├── memoria-tecnica.md      # requisitos, decisiones de diseño, las tres versiones, API
│   └── diagrama-clases.md      # UML en Mermaid
│
├── sencilla/
│   ├── index.html              # incluye el formulario de filtros y la paginación
│   ├── index.js                # estado + funciones + eventos (todo a la vista)
│   ├── core/                   # modelo: Product, Shop, Cart, User
│   ├── ui/renderer.js          # crea tarjetas, opciones del select y el carrito
│   ├── utils/                  # validaciones, formato de precio y errores
│   ├── data/products.json      # catálogo (copia de DummyJSON)
│   └── css/style.css
│
├── v1/
│   ├── index.html
│   ├── index.js                # conecta modelo, paginador y renderer
│   ├── core/                   # igual que sencilla + Shop.addToCart()
│   ├── ui/
│   │   ├── paginator.js        # clase Paginator (recibe todos los datos)
│   │   └── renderer.js         # tarjetas, formulario, carrito, info de página
│   ├── utils/  data/  css/
│
└── v2/
    ├── index.html
    ├── index.js
    ├── core/                   # Shop ya no guarda productos: usa un repositorio
    ├── repositories/
    │   └── InMemoryProductRepository.js   # "API falsa": filtra y pagina
    ├── ui/
    │   ├── paginator.js        # clase Paginator (pide páginas con fetchPage)
    │   └── renderer.js
    ├── utils/  data/  css/
```

Cada versión es **independiente**: tiene su propia copia de `core/`, `utils/`, `data/` y `css/`, para poder abrirla y entenderla sin mirar las demás.

---

## 🌐 API

Usamos **DummyJSON** porque es gratuita, no requiere registro ni API key y sus productos incluyen **stock, marca, descuento, valoraciones e imágenes**. El archivo `data/products.json` es una copia del catálogo completo de DummyJSON (`{ products, total, skip, limit }`), así que tiene exactamente el mismo formato que la respuesta de la API.

| Uso | Endpoint |
|---|---|
| Todos los productos | `GET https://dummyjson.com/products?limit=0` |
| Paginación | `GET https://dummyjson.com/products?limit=10&skip=20` |
| Buscar | `GET https://dummyjson.com/products/search?q=shirt` |
| Productos de una categoría | `GET https://dummyjson.com/products/category/mens-shirts` |
| Lista de categorías | `GET https://dummyjson.com/products/category-list` |
| Un producto | `GET https://dummyjson.com/products/{id}` |

Cómo se conecta cada versión a la API real (una única función `fetchProducts` sirve para las tres) en la [memoria técnica](docs/memoria-tecnica.md#8-conexión-con-la-api).

---

## 🧱 Modelo

Ver el diagrama completo en [`docs/diagrama-clases.md`](docs/diagrama-clases.md).

| Clase | Responsabilidad |
|---|---|
| `Product` | Datos de un artículo. Precio en céntimos. `fromJson()` lo crea a partir del JSON de la API. |
| `Shop` | Catálogo de la tienda: productos, stock, categorías y filtros. En `v2` delega en un repositorio. |
| `InventoryEntry` | Un producto + su stock (`sencilla` y `v1`). |
| `User` → `Client` | Usuarios. El cliente es quien tiene carrito. |
| `Cart` | Productos que el cliente quiere comprar: añadir, quitar, vaciar, totales. |
| `LineItem` | Una línea del carrito: producto + cantidad + precio. |
| `Paginator` | (`v1` y `v2`) Muestra una lista de N en N. No sabe nada de productos. |
| `InMemoryProductRepository` | (`v2`) Obtiene los datos: filtra, pagina y devuelve `{ items, total }`. |

---

## 👥 Autoría

Proyecto del bootcamp Full Stack — <!-- nombre del equipo / alumnos -->
