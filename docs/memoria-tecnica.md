# Memoria técnica — Tienda

> Versión 1.0 · Fases 1 (modelo), 2 (DOM) y diseño de la fase 3 (API) · Octubre 2026

---

## 1. Descripción del proyecto

Aplicación web de comercio electrónico. Un **cliente** puede consultar el catálogo paginado, buscar productos por texto, filtrarlos por categoría y añadirlos a su carrito, que respeta el stock disponible y muestra el total en euros.

El catálogo procede de la API pública **DummyJSON**. Durante las fases 1 y 2 se usa una copia local de sus datos (`data/products.json`) con el mismo formato que la API; la sección 8 describe cómo se sustituye por la llamada real.

La aplicación se entrega en **tres versiones** que hacen lo mismo con distinta organización del código (`sencilla/`, `v1/`, `v2/`), para poder estudiar la misma solución con distintos niveles de abstracción. Se describen en la sección 7.

### 1.1 Objetivos de aprendizaje

- Modelar un dominio real con clases, herencia, composición y métodos estáticos.
- Crear y modificar elementos del DOM, y responder a eventos (`click`, `submit`).
- Paginar y filtrar una lista de datos.
- Separar la **lógica de negocio** (clases del modelo) de la **presentación** (DOM) y del **acceso a datos** (JSON / API).
- Entender la diferencia entre **paginar en el cliente** y **paginar en el servidor**.

### 1.2 Alcance

| Dentro | Fuera |
|---|---|
| Catálogo paginado con imagen, precio y stock | Pasarela de pago real |
| Búsqueda por texto y filtro por categoría | Registro / login real (el cliente está simulado) |
| Carrito con control de stock y total | Pedidos, checkout e historial (ver ampliaciones, §11) |
| Carga del catálogo desde la API (fase 3) | Backend propio y base de datos |
| | Gestión de stock por trabajadores (ver ampliaciones, §11) |

---

## 2. Actores

| Actor | Descripción |
|---|---|
| **Cliente** | Usuario que navega por el catálogo y añade productos a su carrito. En la aplicación hay un único cliente simulado, creado en `index.js`. |
| **Sistema / API** | Fuente del catálogo (DummyJSON). En las fases 1 y 2, una copia local en `data/products.json`. |

---

## 3. Requisitos

### 3.1 Requisitos funcionales

| ID | Requisito | Prioridad | Estado |
|---|---|---|---|
| RF-01 | Mostrar el catálogo en tarjetas con imagen, título, descripción, precio y stock | Alta | ✅ Hecho |
| RF-02 | Paginar el catálogo de 10 en 10 | Alta | ✅ Hecho |
| RF-03 | Navegar entre páginas con botones *Previous* / *Next*, desactivados en los extremos | Alta | ✅ Hecho |
| RF-04 | Mostrar la página actual y el total de páginas ("Page X of Y") | Media | ✅ Hecho |
| RF-05 | Buscar productos por texto en el título, sin distinguir mayúsculas | Alta | ✅ Hecho |
| RF-06 | Filtrar productos por categoría, con opción para ver todas | Alta | ✅ Hecho |
| RF-07 | Combinar búsqueda y categoría; al filtrar se vuelve a la página 1 | Media | ✅ Hecho |
| RF-08 | Añadir un producto al carrito (una unidad por click) | Alta | ✅ Hecho |
| RF-09 | Impedir añadir más unidades de las que hay en stock, avisando al usuario | Alta | ✅ Hecho |
| RF-10 | Mostrar el número de artículos del carrito en un botón | Alta | ✅ Hecho |
| RF-11 | Mostrar/ocultar el detalle del carrito: líneas, cantidades, subtotales y total | Alta | ✅ Hecho |
| RF-12 | Cargar el catálogo desde la API de DummyJSON | Alta | 📐 Diseñado (§8), se implementa en la fase 3 |
| RF-13 | Mostrar un mensaje mientras se cargan los datos de la API | Media | 📐 Diseñado (§8), se implementa en la fase 3 |

### 3.2 Requisitos no funcionales

| ID | Requisito | Cómo se cumple |
|---|---|---|
| RNF-01 | JavaScript vanilla (ES2022+), sin frameworks. | Módulos ES nativos (`import`/`export`), sin dependencias. |
| RNF-02 | Las clases del modelo no acceden al DOM ni a `fetch`. | `core/` no usa `document` ni `fetch`. El DOM está en `index.js` y `ui/`; los datos, en `index.js` o en `repositories/`. |
| RNF-03 | Los importes se almacenan como **enteros en céntimos**. | `Product.fromJson()` convierte con `Math.round(price * 100)`. `formatPrice()` los muestra como `19.99€`. |
| RNF-04 | Los datos inválidos se señalan con errores (`throw`), no con `console.log`. | `checkProduct`, `checkClient`, `checkPositiveNumber` lanzan errores propios (`utils/errors.js`). En `v1`/`v2` también `NotEnoughStockError`. |
| RNF-05 | Código en inglés; documentación y comentarios en español. | Nombres de clases, métodos y variables en inglés. |
| RNF-06 | Interfaz usable en móvil. | CSS con `flex` en columna y *media query* a partir de 760 px. |
| RNF-07 | Se ejecuta en el navegador con un servidor local. | Live Server (instrucciones en el README). |

### 3.3 Historias de usuario

- **HU-01** — *Como cliente, quiero ver el catálogo por páginas para no tener una lista interminable.*
  - ✅ Al entrar se ven 10 productos y "Page 1 of 20".
  - ✅ *Previous* está desactivado en la página 1 y *Next* en la última.
- **HU-02** — *Como cliente, quiero filtrar por categoría para encontrar rápido lo que busco.*
  - ✅ Al elegir "smartphones" solo aparecen teléfonos.
  - ✅ Al elegir "All" vuelven a aparecer todos.
- **HU-03** — *Como cliente, quiero buscar por nombre.*
  - ✅ Buscar "iphone" en la categoría "smartphones" muestra 4 resultados en 1 página.
  - ✅ Una búsqueda sin resultados muestra la lista vacía y "Page 1 of 1".
- **HU-04** — *Como cliente, quiero que no me deje comprar más unidades de las que hay.*
  - ✅ "Green Chili Pepper" tiene stock 3: la cuarta pulsación de *Buy* muestra el aviso y el carrito se queda en 3 unidades de ese producto.
- **HU-05** — *Como cliente, quiero ver cuánto llevo gastado.*
  - ✅ Dos unidades de "Essence Mascara Lash Princess" (9.99 €) muestran 🛒 2 y "Total: 19.98€".

---

## 4. Reglas de negocio

| ID | Regla |
|---|---|
| RN-01 | Un producto se identifica por su `id` (el que da la API). Nunca hay dos entradas con el mismo id en la tienda. |
| RN-02 | El stock es un entero ≥ 0. |
| RN-03 | Un producto con stock 0 **sigue en el catálogo**. No se puede añadir al carrito (en `v1` y `v2` su botón *Buy* aparece desactivado). |
| RN-04 | Al añadir al carrito se comprueba que **unidades en el carrito + unidades nuevas ≤ stock**. |
| RN-05 | Añadir al carrito **no descuenta** stock: el stock solo bajaría al hacer un pedido (fuera de alcance, §11). |
| RN-06 | Si se añade un producto que ya está en el carrito, se suman las unidades a su línea y se actualiza el precio. |
| RN-07 | Quitar del carrito tantas unidades como hay (o más) elimina la línea. |
| RN-08 | La búsqueda ignora espacios al principio y al final y no distingue mayúsculas. Un filtro vacío significa "no filtrar por eso". |

---

## 5. API y mapeo de datos

### 5.1 Elección de la API

Se evaluaron tres APIs públicas de comercio electrónico:

| API | Productos | Stock | Sin API key | Valoración |
|---|---|---|---|---|
| **DummyJSON** | 194 productos en 24 categorías | ✅ | ✅ | **Elegida** |
| FakeStoreAPI | 20 productos | ❌ | ✅ | Muy simple, sin stock |
| Platzi Fake Store | Categorías genéricas | ❌ | ✅ (lectura) | Datos editables por cualquiera; a veces aparecen productos basura |

**Motivos:** DummyJSON devuelve el campo `stock`, que encaja directamente con nuestra lógica de inventario, y admite paginación (`limit`, `skip`), búsqueda y filtrado por categoría desde el servidor, lo que permite construir la versión `v2`.

### 5.2 Formato de un producto en DummyJSON

`GET https://dummyjson.com/products/{id}` (campos relevantes; se omiten `dimensions`, `meta`, `sku`, `reviews`, etc.)

```json
{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "…",
  "category": "beauty",
  "price": 9.99,
  "discountPercentage": 10.48,
  "rating": 2.56,
  "stock": 99,
  "brand": "Essence",
  "images": ["https://cdn.dummyjson.com/…/1.webp"],
  "thumbnail": "https://cdn.dummyjson.com/…/thumbnail.webp"
}
```

Los listados vienen envueltos: `{ "products": [...], "total": 194, "skip": 0, "limit": 30 }`. El campo `total` es el número de resultados **de la consulta completa**, no de la página: es lo que usa `v2` para saber cuántas páginas hay.

### 5.3 Mapeo API → modelo

| Campo API | Clase / propiedad | Transformación |
|---|---|---|
| `id` | `Product.id` | Ninguna. |
| `title` | `Product.title` | Ninguna. |
| `description` | `Product.description` | Ninguna. |
| `category` | `Product.category` | Ninguna (slug: `mens-shirts`). |
| `price` | `Product.price` | `Math.round(price * 100)` → céntimos. |
| `images[0]` | `Product.image` | Solo se guarda la primera imagen. |
| `stock` | `sencilla`/`v1`: `Shop.inventory.get(id).stock` · `v2`: `Product.stock` | Ninguna. Ver la decisión en §6.1. |
| `discountPercentage`, `rating`, `brand`, `tags`, `reviews` | — | No se usan (ver ampliaciones, §11). |

La conversión se centraliza en `Product.fromJson(json)`, para que si la API cambia solo haya que tocar un sitio.

> **Por qué `Math.round` y no `parseInt`:** `9.99 * 100` da `998.9999999999999` por cómo se representan los decimales. `parseInt` lo trunca a `998` (un céntimo menos); `Math.round` da `999`.

---

## 6. Diseño del modelo

Diagrama de clases completo: [`diagrama-clases.md`](diagrama-clases.md).

### 6.1 Decisiones de diseño

| Decisión | Motivo |
|---|---|
| `Shop.inventory` es un único `Map<id, InventoryEntry>` (`sencilla`, `v1`) | Producto y stock van juntos y no pueden desincronizarse. Buscar por id es inmediato. |
| En `v2` el stock va dentro de `Product` | Con una API, la tienda no tiene todos los productos en memoria: el stock llega con cada producto, tal como lo manda el servidor. |
| La categoría es una **propiedad**, no una subclase | Las subclases solo tienen sentido si cambian el comportamiento. Una camisa y un perfume se comportan igual; una clase por categoría obligaría a crear una clase nueva por cada categoría de la API. |
| `Cart` separado de `Shop` | El carrito pertenece al cliente. La tienda solo interviene para comprobar el stock. |
| `LineItem` guarda el precio | Así el total del carrito no depende de que el producto siga cargado o cambie de precio. |
| Precios en céntimos | `0.1 + 0.2 !== 0.3` en JavaScript. Con enteros los totales son exactos. |
| `formatPrice()` en `utils/functions.js` | Un único sitio para dar formato a los precios (`Product`, `Cart` y la interfaz lo usan). |
| Errores propios (`NotAProductError`, `NotEnoughStockError`…) | Quien llama decide cómo mostrarlos (en la interfaz, con `alert`). Con `console.log` la interfaz no se enteraría del fallo. |
| Las funciones de `ui/` solo crean elementos | Los eventos se conectan en `index.js`, que es el único archivo que conoce todas las piezas. |
| Los listeners se añaden **una sola vez** | Cada tarjeta recibe su listener al crearse; los botones fijos (paginación, carrito, formulario) se enganchan al arrancar. Ver problema 1 en §6.2. |

### 6.2 Revisión del código inicial

Problemas encontrados en la primera versión hecha en clase y cómo se resolvieron:

| # | Problema | Consecuencia | Solución |
|---|---|---|---|
| 1 | Cada cambio de página volvía a añadir `addEventListener` a todos los botones *Buy*, y `renderCart` añadía otro listener al carrito en cada repintado | Con scroll infinito, un click añadía el producto varias veces; el carrito acumulaba listeners | El listener se añade al crear cada tarjeta; los fijos, una vez al arrancar |
| 2 | `ShopManager` estaba en `core/` pero manipulaba el DOM | Se rompía la regla de oro (RNF-02) | Se elimina; la conexión entre piezas se hace en `index.js` |
| 3 | `parseInt(price * 100)` | Precios con un céntimo de menos (9.99 → 998) | `Math.round` |
| 4 | El formulario de filtros no hacía nada (y al pulsar *Search* recargaba la página) | No se podía filtrar | Evento `submit` con `event.preventDefault()` y filtrado en `Shop` |
| 5 | No había opción para "todas las categorías" | Al elegir una categoría no se podía volver atrás | Opción *All* con valor `""` |
| 6 | El stock de todos los productos era 5 fijo | Se ignoraba el stock real de la API | Se usa `json.stock` |
| 7 | El subtotal y el total del carrito se mostraban en céntimos | "Total: 1998" en vez de "19.98€" | `formatPrice()` |
| 8 | No se comprobaba el stock al añadir al carrito | Se podían añadir unidades sin límite | Comprobación de RN-04 |
| 9 | El paginador calculaba el nº de páginas una sola vez, en el constructor | Al filtrar, el número de páginas era incorrecto | Se recalcula siempre (`getTotalPages()` / getter `totalPages`) |
| 10 | Con scroll infinito, *Previous* volvía a añadir la página anterior al final | Productos duplicados | Con scroll infinito, *Previous* no hace nada |

---

## 7. Las tres versiones

Las tres versiones comparten el modelo (`Product`, `Cart`, `User`, `utils/`) y se diferencian en cómo se organiza la paginación y de dónde salen los datos.

### 7.1 `sencilla/` — todo a la vista

**Idea:** el estado de la página son dos variables y todo lo hace una función.

```js
const PRODUCTS_PER_PAGE = 10;
let currentPage = 1;
let productsToShow = shop.getProducts(); // al filtrar, aquí se guarda el resultado
```

- `showPage()` calcula qué productos tocan con `slice`, crea las tarjetas, les añade el listener de *Buy* y actualiza los botones de paginación.
- Los botones *Previous* / *Next* cambian `currentPage` y llaman a `showPage()`.
- El formulario está escrito en el HTML. Al enviarlo: `productsToShow = shop.filterProducts(texto, categoría)`, `currentPage = 1` y `showPage()`.
- `buyProduct()` comprueba el stock con un `if` y, si no hay, muestra un `alert` y sale con `return`.
- `ui/renderer.js` solo crea elementos (tarjeta, opciones del `<select>`, carrito). No decide qué pasa al hacer click.

`index.js` se lee de arriba abajo: datos → estado → elementos del HTML → funciones → eventos → inicio.

```mermaid
sequenceDiagram
    actor U as Usuario
    participant I as index.js
    participant S as Shop
    participant R as renderer.js

    U->>I: submit del formulario
    I->>S: filterProducts(texto, categoría)
    S-->>I: entradas filtradas
    Note over I: productsToShow = resultado<br/>currentPage = 1
    I->>I: showPage()
    Note over I: slice(inicio, fin)
    loop cada producto de la página
        I->>R: createProductCard(product, stock)
        R-->>I: tarjeta (article)
        Note over I: listener de Buy + append
    end
```

**Ventajas:** muy poco que aprender aparte del DOM; se puede seguir con el depurador paso a paso.
**Inconvenientes:** la paginación no se puede reutilizar para otra lista (usuarios, pedidos…) sin copiar el código.

### 7.2 `v1/` — paginador reutilizable, paginación en el cliente

**Idea:** sacar la paginación a una clase `Paginator` que no sabe nada de productos.

```js
const paginator = new Paginator({
    containerId: "product__list",
    items: shop.getProducts(),                                   // TODOS los datos
    renderItem: (entry) => createProductCard(entry, handleBuy),  // cómo pintar cada uno
    pageSize: 10,
    onChange: (p) => { /* actualizar botones y "Page X of Y" */ }
});
```

- El paginador recibe **todos** los elementos y corta la página con `slice`.
- `totalPages` es un *getter* que se recalcula a partir de `items.length`.
- Al filtrar: `paginator.setItems(shop.filterProducts(filtros))`, que vuelve a la página 1.
- `onChange` avisa a `index.js` después de cada pintado: el paginador no toca los botones.
- El constructor recibe un **objeto de opciones**: con 6 parámetros, el orden sería difícil de recordar.
- `renderFilterForm(sectionId, categorías, onSubmit)` crea el formulario y entrega `{ search, category }` mediante un *callback*, sin saber quién lo usa.
- La regla de stock pasa al modelo: `Shop.addToCart(cart, id, cantidad)` lanza `NotEnoughStockError`, y `index.js` la captura con `try/catch`.
- Opción `infiniteScroll: true`: *Next* añade la página debajo en vez de sustituirla.

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Formulario (renderer)
    participant I as index.js
    participant S as Shop
    participant P as Paginator

    U->>F: submit
    F->>I: onSubmit({ search, category })
    I->>S: filterProducts(filtros)
    S-->>I: entradas filtradas
    I->>P: setItems(entradas)
    Note over P: currentPage = 1<br/>slice(inicio, fin)
    loop cada elemento de la página
        P->>I: renderItem(entrada)
        I-->>P: tarjeta (article)
    end
    P->>I: onChange(paginator)
```

**Ventajas:** el mismo `Paginator` sirve para cualquier lista. Cada pieza tiene una sola responsabilidad.
**Inconvenientes:** hay que entender *callbacks*, objetos de opciones y *getters*. Sigue necesitando **todos** los datos en el navegador.

### 7.3 `v2/` — paginación en el servidor con repositorio

**Idea:** con una API real no se descargan los 194 productos para mostrar 10. Se pide **una página** y el servidor devuelve esa página y el **total** de resultados. `v2` simula ese funcionamiento sin necesidad de `fetch`.

**El repositorio** (`repositories/InMemoryProductRepository.js`) es el objeto que obtiene los datos. Cumple un **contrato** que también cumplirá el repositorio de la API:

```
search({ search, category, page, pageSize })  →  { items: Product[], total: number }
getById(id)                                    →  Product | null
getCategories()                                →  string[]
```

**`Shop`** ya no guarda productos: sabe dónde pedirlos. Sus métodos `search`, `getProduct` y `getCategories` delegan en el repositorio, y le queda la regla de negocio `addToCart`.

**El paginador** ya no recibe datos, sino una función para pedirlos:

```js
const paginator = new Paginator({
    containerId: "product__list",
    fetchPage: (params) => shop.search(params),   // el paginador pide, la tienda responde
    renderItem: (product) => createProductCard(product, handleBuy),
    pageSize: 10,
    onChange: (p) => { /* … */ }
});
```

- `load(page)` llama a `fetchPage({ ...params, page, pageSize })`, guarda el `total` de la respuesta y pinta los `items`.
- `totalPages` sale de `total`, no de los datos que tiene (que son solo una página).
- Los filtros son un objeto opaco: `setParams(filtros)` los guarda, se los pasa a `fetchPage` en cada petición y vuelve a la página 1. El paginador no sabe qué significan.

```mermaid
sequenceDiagram
    actor U as Usuario
    participant I as index.js
    participant P as Paginator
    participant S as Shop
    participant R as Repositorio

    U->>I: submit ({ search, category })
    I->>P: setParams(filtros)
    P->>P: load(1)
    P->>S: fetchPage({ search, category, page: 1, pageSize: 10 })
    S->>R: search(params)
    Note over R: filtra, corta la página<br/>y convierte a Product
    R-->>S: { items, total }
    S-->>P: { items, total }
    Note over P: total → totalPages
    loop cada producto de la página
        P->>I: renderItem(product)
    end
    P->>I: onChange(paginator)
```

**Ventajas:** es como se trabaja con APIs reales. Para pasar a la API solo se sustituye el repositorio (una línea en `index.js`); paginador, tienda e interfaz no cambian.
**Inconvenientes:** más archivos y más conceptos (contrato, repositorio, delegación).

### 7.4 Comparación

| | `sencilla/` | `v1/` | `v2/` |
|---|---|---|---|
| Dónde están todos los datos | Navegador | Navegador | "Servidor" (repositorio) |
| Quién corta la página | `showPage()` | `Paginator` | Repositorio |
| De dónde sale el nº de páginas | `productsToShow.length` | `items.length` | `total` de la respuesta |
| Qué se cambia al filtrar | `productsToShow` | `paginator.setItems(...)` | `paginator.setParams(...)` |
| Dónde está el stock | `InventoryEntry` en `Shop` | `InventoryEntry` en `Shop` | `Product.stock` |
| Comprobación de stock | `if` en `index.js` | `Shop.addToCart()` + `throw` | `Shop.addToCart()` + `throw` |
| Formulario | HTML | `renderFilterForm()` con callback | `renderFilterForm()` con callback |
| Archivos de JS | 8 | 9 | 10 |
| Conceptos nuevos | DOM, eventos, `slice` | + callbacks, objeto de opciones, getter | + repositorio, contrato, delegación |

**Archivos que cambian de `v1` a `v2`:** `core/Product.js` (stock), `core/Shop.js`, `ui/paginator.js`, `ui/renderer.js` (la tarjeta recibe un `Product`) e `index.js`, más la carpeta nueva `repositories/`. `Cart`, `User`, `utils/`, el HTML y el CSS son idénticos.

### 7.5 ¿Cuándo usar cada enfoque?

- **Paginación en el cliente** (`sencilla`, `v1`): cuando hay pocos datos (cientos) o ya se tienen todos. Filtrar es instantáneo y se pueden combinar filtros libremente.
- **Paginación en el servidor** (`v2`): cuando hay muchos datos (miles o más) o la API pagina obligatoriamente. Cada cambio de página o de filtro es una petición, y solo se puede filtrar por lo que la API permita.

---

## 8. Conexión con la API

Una **única función** de acceso a la API sirve para las tres versiones. La condición es que devuelva **lo que manda la API, sin adaptarlo** a ninguna versión; cada versión se adapta a ella con una o dos líneas.

### 8.1 `api.js`

Se crea en la raíz de cada versión (al lado de `index.js`):

```js
const BASE_URL = "https://dummyjson.com/products";

// Devuelve lo que manda DummyJSON: { products, total, skip, limit }
// pageSize = 0 → todos los productos (DummyJSON usa limit=0 para eso)
async function fetchProducts({ search = "", category = "", page = 1, pageSize = 0 } = {}) {
    const skip = (page - 1) * pageSize;
    let url = `${BASE_URL}?limit=${pageSize}&skip=${skip}`;

    if (search !== "") {
        url = `${BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${pageSize}&skip=${skip}`;
    } else if (category !== "") {
        url = `${BASE_URL}/category/${category}?limit=${pageSize}&skip=${skip}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Error loading products: " + response.status);
    }
    return await response.json();
}

async function fetchCategories() {
    const response = await fetch(`${BASE_URL}/category-list`);
    if (!response.ok) {
        throw new Error("Error loading categories: " + response.status);
    }
    return await response.json(); // ["beauty", "fragrances", ...]
}

export { fetchProducts, fetchCategories };
```

### 8.2 `sencilla/` y `v1/`: un solo cambio

Como paginan en el cliente, piden **todos** los productos una vez y siguen funcionando igual. `data` tiene la misma forma que `products.json`, así que el resto del código no cambia.

```js
// Antes
import data from "./data/products.json" with { type: "json" };

// Después
import { fetchProducts } from "./api.js";

document.getElementById("product__list").textContent = "Loading products...";
const data = await fetchProducts(); // limit=0 → los 194 productos
```

`await` se puede usar directamente en el nivel superior de `index.js` porque es un módulo (`type="module"`). El texto *"Loading products..."* desaparece cuando `showPage()` / `paginator.render()` vacían la lista para pintar la primera página.

### 8.3 `v2/`: un repositorio nuevo

Se crea `repositories/ApiProductRepository.js` con los mismos tres métodos que `InMemoryProductRepository`:

```js
import Product from "../core/Product.js";
import { fetchProducts, fetchCategories } from "../api.js";

class ApiProductRepository {
    async search(params) {
        const data = await fetchProducts(params);
        return {
            items: data.products.map(json => Product.fromJson(json)),
            total: data.total
        };
    }

    async getById(id) {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) return null;
        return Product.fromJson(await response.json());
    }

    async getCategories() {
        return await fetchCategories();
    }
}

export default ApiProductRepository;
```

En `index.js` se cambia la línea del bloque 1:

```js
const productRepository = new ApiProductRepository();
```

**Lo asíncrono se contagia hacia arriba.** Como el repositorio ahora devuelve promesas, quien lo usa tiene que esperar:

| Archivo | Cambio |
|---|---|
| `core/Shop.js` | `search`, `getProduct`, `getCategories` y `addToCart` pasan a ser `async`; dentro, `await this.products...` |
| `ui/paginator.js` | `async load(...)` y `const { items, total } = await this.fetchPage(...)` |
| `index.js` | `handleBuy` pasa a ser `async` (con `await shop.addToCart(...)` dentro del `try`); las categorías se cargan con `const categories = await shop.getCategories();` antes de `renderFilterForm` |

### 8.4 Limitación de la API

En DummyJSON, la búsqueda por texto (`/products/search?q=`) y el filtro por categoría (`/products/category/x`) son **endpoints distintos** y no se pueden combinar en una sola petición. En `fetchProducts`, si hay texto, manda la búsqueda y se ignora la categoría.

- En `sencilla/` y `v1/` no afecta: se descargan todos los productos y el filtrado lo hace `Shop.filterProducts()`, que sí combina ambos.
- En `v2/`, buscar "iphone" con la categoría "laptops" mostraría los iPhone igualmente. Es un buen ejemplo de que **el contrato lo define la aplicación y el repositorio se adapta a lo que la API permite**: si se quisiera combinar, el repositorio podría pedir la categoría y filtrar el texto en el cliente.

---

## 9. Pruebas realizadas

Las tres versiones se han probado con los mismos casos y dan los mismos resultados:

| # | Acción | Resultado esperado |
|---|---|---|
| 1 | Abrir la página | 10 tarjetas, "Page 1 of 20", *Previous* desactivado |
| 2 | Pulsar *Next* | 10 tarjetas nuevas, "Page 2 of 20" |
| 3 | Buscar "iphone" en "smartphones" | 4 productos (iPhone 5s, 6, 13 Pro y X), "Page 1 of 1", ambos botones desactivados |
| 4 | Buscar con texto vacío y categoría *All* | Vuelve el catálogo completo, "Page 1 of 20" |
| 5 | Pulsar *Buy* dos veces en "Essence Mascara Lash Princess" | 🛒 2, total 19.98€, subtotal de la línea 19.98€ |
| 6 | Pulsar *Buy* cuatro veces en "Green Chili Pepper" (stock 3) | Aviso "Not enough stock of Green Chili Pepper" en el cuarto click; el carrito suma solo 3 unidades |
| 7 | Buscar "zzzz" | Lista vacía, "Page 1 of 1", ambos botones desactivados |
| 8 | Pulsar el botón 🛒 | Se muestra / oculta el detalle del carrito |

Productos útiles para probar el stock: "Green Chili Pepper" (3), "Black & Brown Slipper" (3). Agotados (stock 0): "Sportbike Motorcycle", "Samsung Galaxy S8", "Volleyball", "Watch Gold for Women".

---

## 10. Decisiones tomadas

| Pregunta | Decisión |
|---|---|
| ¿Qué pasa si un cliente añade al carrito más unidades de las que hay en stock? | Se avisa **al añadir** (RN-04), no se espera a un checkout. |
| ¿Se aplican descuentos? | No. DummyJSON trae `discountPercentage`, pero se muestra el precio base (ver ampliaciones). |
| ¿Cómo se simula el usuario actual? | Un único `Client` creado en `index.js`. No hay login. |
| ¿Se guarda algo en `localStorage`? | No en esta entrega (ver ampliaciones). |
| ¿Tallas y colores? | Se descartan: DummyJSON no los trae. |
| ¿Qué categorías se muestran? | Todas las del catálogo de DummyJSON (24), no solo las de ropa. |
| ¿Cuántos productos por página? | 10 (constante `PRODUCTS_PER_PAGE` en `sencilla`, opción `pageSize` en `v1`/`v2`). |

---

## 11. Posibles ampliaciones

Fuera del alcance de esta entrega, ordenadas de más sencilla a más compleja:

1. **Quitar unidades desde el carrito.** `Cart.remove()` y `Cart.deleteItem()` ya existen; falta añadir botones en `renderCart` / `renderCartDetail`.
2. **Mostrar "agotado"** en la tarjeta en lugar de solo desactivar el botón.
3. **Precio con descuento:** añadir `discountPercentage` a `Product` y un método `getFinalPrice()` redondeado al céntimo.
4. **Solo categorías de ropa:** filtrar el catálogo a `mens-shirts`, `mens-shoes`, `tops`, `womens-dresses`, `womens-shoes`, `womens-bags`, etc.
5. **Persistir el carrito en `localStorage`.** Ojo: `JSON.stringify` pierde las clases, así que al leerlo hay que reconstruir los `Product` y `LineItem`.
6. **Pedidos (`Order`) y checkout:** validar el stock de todo el carrito, descontarlo (todo o nada), crear el pedido con los precios del momento y vaciar el carrito.
7. **Trabajadores (`Worker extends User`)** que puedan dar de alta productos y reponer stock.
8. **Página de detalle** de un producto con sus reseñas (`reviews`).
