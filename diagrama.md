# Diagrama de clases

> GitHub y VS Code (con la extensión *Markdown Preview Mermaid Support*) renderizan este bloque automáticamente.
> También se puede pegar en https://mermaid.live

```mermaid
classDiagram
    direction LR

    class Shop {
        +String name
        -Map~id, InventoryEntry~ inventory
        +findProduct(id) Product
        +getStock(id) Number
        +hasStock(id, quantity) Boolean
        +getProducts(filters) InventoryEntry[]
        +search(text) InventoryEntry[]
        +getCategories() String[]
        +addProduct(worker, product, quantity)
        +removeProduct(worker, productId) Boolean
        +checkout(client) Order
    }

    class Product {
        +Number id
        +String title
        +String description
        +String category
        +String brand
        +Number price  «céntimos»
        +Number discountPercentage
        +Number rating
        +String thumbnail
        +String[] images
        +String[] tags
        +finalPrice() Number
        +priceEuro() Number
        +fromApi(json)$ Product
    }

    class User {
        <<abstract>>
        +Number id
        +String firstName
        +String lastName
        +String email
        +fullName() String
        +canManageStock() Boolean
        +fromApi(json)$ User
    }

    class Client {
        +Cart cart
        +Order[] orders
    }

    class Worker {
        +canManageStock() Boolean
    }

    class Cart {
        +Client client
        -Map~id, LineItem~ items
        +add(product, quantity)
        +remove(productId, quantity)
        +clear()
        +lines() LineItem[]
        +total() Number
        +totalQuantity() Number
        +isEmpty() Boolean
    }

    class LineItem {
        +Product product
        +Number quantity
        +Number unitPrice
        +subtotal() Number
    }

    class Order {
        +Number id
        +Client client
        +LineItem[] lines
        +Date date
        +String status
        +total() Number
    }

    User <|-- Client
    User <|-- Worker
    Shop "1" o-- "0..*" Product : inventario (con stock)
    Client "1" *-- "1" Cart : tiene
    Client "1" o-- "0..*" Order : realiza
    Cart "1" *-- "0..*" LineItem
    Order "1" *-- "1..*" LineItem
    LineItem "0..*" --> "1" Product
    Shop ..> Order : crea en checkout
    Shop ..> Worker : valida permisos
```

## Cómo leerlo

| Símbolo | Significa | En nuestro modelo |
|---|---|---|
| `<\|--` | Herencia (*es un*) | Un `Client` **es un** `User` |
| `*--` | Composición (el todo crea y destruye la parte) | El `Cart` no existe sin su `Client` |
| `o--` | Agregación (el todo usa partes que existen por sí solas) | Un `Product` existe aunque no esté en ninguna tienda |
| `-->` | Asociación (referencia) | Cada `LineItem` apunta a un `Product` |
| `..>` | Dependencia (lo usa puntualmente) | `Shop` crea un `Order` al hacer checkout |
| `$` | Método estático | `Product.fromApi(json)` |
| `+` / `-` | Público / privado (`#` en JS) | `inventory` solo se toca desde `Shop` |

## Estructura de datos interna de `Shop`

```js
inventory = Map {
  81 => { product: Product{ id: 81, title: "Blue & Black Check Shirt", price: 2999, ... }, stock: 3 },
  82 => { product: Product{ id: 82, ... }, stock: 1 },
}
```

Un único `Map` sustituye al par `products[]` + `stock Map` del primer borrador:
producto y stock no pueden desincronizarse y las búsquedas por id son O(1).