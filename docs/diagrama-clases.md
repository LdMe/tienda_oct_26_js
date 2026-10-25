# Diagrama de clases

> GitHub y VS Code (con la extensión *Markdown Preview Mermaid Support*) renderizan estos bloques automáticamente.
> También se pueden pegar en https://mermaid.live

Las tres versiones comparten las mismas clases de modelo (`Product`, `LineItem`, `Cart`, `User`, `Client`). Lo que cambia es `Shop` y, en `v1` y `v2`, la clase `Paginator`.

## 1. Modelo común y `Shop` en `sencilla/` y `v1/`

```mermaid
classDiagram
    direction LR

    class Shop {
        +String name
        -Map~id, InventoryEntry~ inventory
        +addProduct(product, stock)
        +findProduct(id) InventoryEntry
        +getStock(id) Number
        +hasStock(id, quantity) Boolean
        +getProducts() InventoryEntry[]
        +getCategories() String[]
        +filterProducts(...) InventoryEntry[]
        +addToCart(cart, productId, quantity) «solo v1»
    }

    class InventoryEntry {
        +Product product
        +Number stock
        +hasStock(quantity) Boolean
    }

    class Product {
        +Number id
        +String title
        +String description
        +String category
        +Number price «céntimos»
        +String image
        +getPriceEuro() String
        +fromJson(json)$ Product
    }

    class User {
        +Number id
        +String firstName
        +String lastName
        +String email
        +getFullName() String
        +fromJson(json)$ User
    }

    class Client {
        +Order[] orders
        +fromJson(json)$ Client
    }

    class Cart {
        +Client client
        -Map~id, LineItem~ items
        +getLine(productId) LineItem
        +getLines() LineItem[]
        +getQuantity(productId) Number
        +add(product, quantity)
        +remove(productId, quantity)
        +deleteItem(productId)
        +clear()
        +getTotalPrice(formatted) Number
        +getTotalQuantity() Number
        +isEmpty() Boolean
    }

    class LineItem {
        +Product product
        +Number quantity
        +Number price «céntimos»
        +getSubtotal() Number
    }

    User <|-- Client
    Shop "1" *-- "0..*" InventoryEntry : inventory
    InventoryEntry "1" --> "1" Product
    Cart "1" --> "1" Client : client
    Cart "1" *-- "0..*" LineItem : items
    LineItem "0..*" --> "1" Product
    Shop ..> Cart : addToCart (v1)
```

`filterProducts` recibe los filtros de forma distinta según la versión:

- `sencilla/`: `filterProducts(search, category)` (dos parámetros).
- `v1/`: `filterProducts({ search, category })` (un objeto, el mismo que entrega el formulario).

## 2. `Shop` y repositorio en `v2/`

En `v2` la tienda no guarda productos: los pide a un repositorio. El stock pasa a `Product` (como lo manda la API) y desaparece `InventoryEntry`. `Cart`, `LineItem`, `User` y `Client` son iguales que en el diagrama anterior.

```mermaid
classDiagram
    direction LR

    class Shop {
        +String name
        +ProductRepository products
        +search(params) SearchResult
        +getProduct(id) Product
        +getCategories() String[]
        +addToCart(cart, productId, quantity)
    }

    class ProductRepository {
        <<interface>>
        +search(params) SearchResult
        +getById(id) Product
        +getCategories() String[]
    }

    class InMemoryProductRepository {
        -Object[] jsonProducts
        +search(params) SearchResult
        +getById(id) Product
        +getCategories() String[]
    }

    class ApiProductRepository {
        «fase 3»
        +search(params) Promise~SearchResult~
        +getById(id) Promise~Product~
        +getCategories() Promise~String[]~
    }

    class SearchResult {
        <<object>>
        +Product[] items
        +Number total
    }

    class Product {
        +Number id
        +String title
        +String description
        +String category
        +Number price «céntimos»
        +String image
        +Number stock
        +getPriceEuro() String
        +fromJson(json)$ Product
    }

    Shop "1" --> "1" ProductRepository : products
    ProductRepository <|.. InMemoryProductRepository
    ProductRepository <|.. ApiProductRepository
    InMemoryProductRepository ..> Product : crea con fromJson
    ApiProductRepository ..> Product : crea con fromJson
    ProductRepository ..> SearchResult : devuelve
    SearchResult --> Product : items
```

`ProductRepository` no existe como archivo: JavaScript no tiene interfaces. Es el **contrato** (los tres métodos y lo que devuelven) que cumplen los dos repositorios, y por eso se pueden intercambiar cambiando una sola línea de `index.js`.

## 3. `Paginator` en `v1/` y `v2/`

Mismo nombre y mismos métodos públicos para navegar; cambia de dónde saca los datos.

```mermaid
classDiagram
    direction LR

    class PaginatorV1 {
        «v1/ui/paginator.js»
        +HTMLElement container
        +Array items
        +Function renderItem
        +Number pageSize
        +Boolean infiniteScroll
        +Function onChange
        +Number currentPage
        +totalPages Number «getter: items.length»
        +hasNext() Boolean
        +hasPrevious() Boolean
        +setItems(items)
        +render(append)
        +nextPage()
        +previousPage()
    }

    class PaginatorV2 {
        «v2/ui/paginator.js»
        +HTMLElement container
        +Function fetchPage
        +Function renderItem
        +Number pageSize
        +Boolean infiniteScroll
        +Function onChange
        +Object params
        +Number currentPage
        +Number total
        +totalPages Number «getter: total»
        +hasNext() Boolean
        +hasPrevious() Boolean
        +setParams(params)
        +load(page, append)
        +nextPage()
        +previousPage()
    }
```

| | `v1` | `v2` |
|---|---|---|
| Recibe | `items`: todos los datos | `fetchPage`: una función que devuelve `{ items, total }` |
| Corta la página | Él mismo, con `slice` | Quien responde a `fetchPage` |
| Cambiar los datos / filtros | `setItems(items)` | `setParams(params)` |
| Pintar | `render(append)` | `load(page, append)` |

En `sencilla/` no hay clase `Paginator`: el mismo trabajo lo hacen las variables `currentPage` y `productsToShow` y la función `showPage()` de `index.js`.

## 4. Cómo leer los diagramas

| Símbolo | Significa | En nuestro modelo |
|---|---|---|
| `<\|--` | Herencia (*es un*) | Un `Client` **es un** `User` |
| `<\|..` | Implementa (cumple un contrato) | `InMemoryProductRepository` cumple el contrato de `ProductRepository` |
| `*--` | Composición (la parte no tiene sentido sin el todo) | Una `InventoryEntry` solo existe dentro de una `Shop`; un `LineItem`, dentro de un `Cart` |
| `-->` | Asociación (referencia) | Cada `LineItem` apunta a un `Product` |
| `..>` | Dependencia (lo usa puntualmente) | El repositorio usa `Product.fromJson` para crear productos |
| `$` | Método estático | `Product.fromJson(json)` |
| `+` / `-` | Público / de uso interno | `inventory` e `items` solo se deberían tocar desde su clase |

## 5. Estructuras de datos internas

`Shop.inventory` en `sencilla/` y `v1/`:

```js
inventory = Map {
  1  => InventoryEntry { product: Product { id: 1, title: "Essence Mascara Lash Princess", price: 999, ... }, stock: 99 },
  26 => InventoryEntry { product: Product { id: 26, title: "Green Chili Pepper", price: 99, ... }, stock: 3 },
  ...
}
```

`Cart.items` (todas las versiones):

```js
items = Map {
  1 => LineItem { product: Product { id: 1, ... }, quantity: 2, price: 999 },
}
// getTotalPrice()     → 1998
// getTotalPrice(true) → "19.98€"
```

Respuesta de `search` en `v2/` (`InMemoryProductRepository` y, en la fase 3, `ApiProductRepository`):

```js
{
  items: [ Product { id: 121, title: "iPhone 5s", ... }, ... ], // solo la página pedida
  total: 4                                                      // resultados de toda la búsqueda
}
```

Usar un `Map` con el `id` como clave hace que buscar un producto o una línea del carrito sea inmediato, sin recorrer arrays.
