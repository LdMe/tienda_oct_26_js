# 👕 Tienda de Ropa — Proyecto JS (POO + DOM + API)

Aplicación web de una tienda de ropa en **JavaScript vanilla**. Se construye por fases, siguiendo el temario del bootcamp:

1. **Modelo de dominio con POO** (fase actual) → clases que representan la lógica de negocio, probadas por consola.
2. **Manipulación del DOM** → catálogo, filtros, carrito y pedidos en pantalla.
3. **Consumo de API** → el catálogo se carga desde [DummyJSON](https://dummyjson.com/docs/products).

> ⚠️ Regla de oro del proyecto: **las clases del modelo no saben nada del DOM ni de `fetch`.**
> Así se pueden probar en consola hoy y reutilizar sin cambios en las fases 2 y 3.

---

## 🎯 Funcionalidades

### Fase 1 — Modelo (POO)
- [x] Crear productos con el formato de la API (`Product.fromApi`)
- [x] Gestionar el inventario de una tienda: alta, reposición, baja y consulta de stock
- [x] Solo los trabajadores pueden modificar el stock
- [x] Carrito por cliente: añadir, quitar, vaciar, total
- [x] Checkout: valida stock de todo el carrito, descuenta stock y genera un pedido
- [x] Filtrar por categoría, buscar por texto, listar categorías

### Fase 2 — DOM
- [ ] Mostrar el catálogo en tarjetas (imagen, nombre, precio, descuento, "agotado")
- [ ] Filtro por categoría y buscador
- [ ] Carrito lateral con contador y total
- [ ] Botón de comprar y resumen del pedido
- [ ] Persistir el carrito en `localStorage`

### Fase 3 — API
- [ ] Cargar productos de las categorías de ropa de DummyJSON
- [ ] Estados de carga y error
- [ ] Paginación con `limit` y `skip`
- [ ] (Extra) Página de detalle con reseñas (`reviews`)

---

## 🗂️ Estructura

```
tienda-ropa/
├── README.md
├── package.json            # "type": "module" para usar import/export en Node
├── docs/
│   ├── memoria-tecnica.md  # requisitos, decisiones de diseño, API
│   └── diagrama-clases.md  # UML en Mermaid
└── src/
    ├── model.js            # clases de dominio (Shop, Product, User, Cart, Order…)
    └── demo.js             # prueba del modelo por consola
```

En las fases siguientes se añadirán `index.html`, `src/api.js` (solo `fetch`) y `src/ui.js` (solo DOM).

---

## ▶️ Cómo ejecutarlo

Requisitos: Node.js 18 o superior.

```bash
node src/demo.js
```

Salida esperada:

```
Total carrito (€): 78.97
Pedido 1 total (€): 78.97
[ 'Blue & Black Check Shirt: 3', 'Gigabyte Aorus Men Tshirt: 1' ]
Error esperado → Stock insuficiente de "Gigabyte Aorus Men Tshirt": pides 5, hay 1
Error esperado → Solo un trabajador puede gestionar el stock
```

---

## 🌐 API

Usamos **DummyJSON** porque es gratuita, no requiere registro ni API key y sus productos incluyen **stock, marca, descuento, valoraciones e imágenes**.

| Uso | Endpoint |
|---|---|
| Productos de una categoría | `GET https://dummyjson.com/products/category/mens-shirts` |
| Lista de categorías | `GET https://dummyjson.com/products/category-list` |
| Buscar | `GET https://dummyjson.com/products/search?q=shirt` |
| Paginación | `GET https://dummyjson.com/products?limit=10&skip=20` |
| Un producto | `GET https://dummyjson.com/products/{id}` |

Categorías de ropa y complementos que usamos: `mens-shirts`, `mens-shoes`, `mens-watches`, `tops`, `womens-dresses`, `womens-shoes`, `womens-bags`, `womens-jewellery`, `womens-watches`, `sunglasses`.

Detalle del formato y del mapeo a nuestras clases en [`docs/memoria-tecnica.md`](docs/memoria-tecnica.md#5-api-y-mapeo-de-datos).

---

## 🧱 Modelo

Ver el diagrama completo en [`docs/diagrama-clases.md`](docs/diagrama-clases.md).

| Clase | Responsabilidad |
|---|---|
| `Product` | Datos de un artículo. Precio en céntimos. Calcula precio final con descuento. |
| `Shop` | Inventario (producto + stock) y proceso de venta (`checkout`). |
| `User` → `Client` / `Worker` | Usuarios. El trabajador puede gestionar stock; el cliente tiene carrito y pedidos. |
| `Cart` | Productos que el cliente quiere comprar. No toca el stock. |
| `LineItem` | Una línea: producto + cantidad + precio unitario. |
| `Order` | Pedido cerrado. Guarda el precio del momento de la compra. |

---

## 👥 Autoría

Proyecto del bootcamp Full Stack — <!-- nombre del equipo / alumnos -->