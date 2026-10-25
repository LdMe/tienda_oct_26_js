// index.js es el único sitio que conoce todas las piezas y las conecta.
// Cada pieza por separado (Shop, Cart, Paginator, renderer, api, storage) no sabe de las demás.

import Shop from "./core/Shop.js";
import Product from "./core/Product.js";
import Cart from "./core/Cart.js";
import { Client } from "./core/User.js";
import Paginator from "./ui/paginator.js";
import {
    createProductCard,
    renderFilterForm,
    renderCartBadge,
    renderCartDetail,
    renderPageInfo
} from "./ui/renderer.js";
import { fetchProducts } from "./api.js";
import { saveCart, loadCartLines } from "./storage.js";

// ---------- 1. Elementos del DOM ----------

const productList = document.getElementById("product__list");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const cartButton = document.getElementById("cart-button");
const cartSection = document.getElementById("cart");
const emptyCartButton = document.getElementById("empty-cart-button");

// ---------- 2. Datos (desde la API) ----------
// Paginamos en el cliente: pedimos TODOS los productos una vez.
// "await" en el nivel superior funciona porque index.js es un módulo.

productList.textContent = "Loading products...";

let data;
try {
    data = await fetchProducts(); // sin parámetros → limit=0 → todos
    // Sin conexión, se puede usar la copia local en su lugar:
    // data = (await import("./data/products.json", { with: { type: "json" } })).default;
} catch (error) {
    productList.textContent = "Could not load the products. Please try again later.";
    throw error;
}

// ---------- 3. Lógica de negocio ----------

const shop = new Shop("tienda pruebas");
data.products.forEach(json => shop.addProduct(Product.fromJson(json), json.stock));

const client = new Client(1, "Yisus", "Krais", "yisus.krais@god.com");
const cart = new Cart(client);

// Recuperamos el carrito guardado. addToCart vuelve a comprobar el stock:
// si algo ya no existe o no hay bastante, esa línea se descarta.
loadCartLines().forEach(saved => {
    try {
        shop.addToCart(cart, saved.id, saved.quantity);
    } catch (error) {
        console.warn("Saved cart line discarded:", error.message);
    }
});

// ---------- 4. Acciones ----------

function updateCart() {
    saveCart(cart);
    renderCartBadge("cart-button", cart);
    renderCartDetail("cart-lines", cart, handleRemove);
}

function handleBuy(productId) {
    try {
        shop.addToCart(cart, productId, 1);
        updateCart();
    } catch (error) {
        alert(error.message);
    }
}

function handleRemove(productId) {
    cart.remove(productId, 1);
    updateCart();
}

// ---------- 5. Paginador ----------

const paginator = new Paginator({
    containerId: "product__list",
    items: shop.getProducts(),
    renderItem: (entry) => createProductCard(entry, handleBuy),
    pageSize: 10,
    onChange: (p) => {
        prevButton.disabled = !p.hasPrevious();
        nextButton.disabled = !p.hasNext();
        renderPageInfo("page-info", p);
    }
});

// ---------- 6. Eventos (se ponen una sola vez) ----------

renderFilterForm("search-menu", shop.getCategories(), (filters) => {
    paginator.setItems(shop.filterProducts(filters));
});

prevButton.addEventListener("click", () => paginator.previousPage());
nextButton.addEventListener("click", () => paginator.nextPage());
cartButton.addEventListener("click", () => cartSection.classList.toggle("hidden"));
emptyCartButton.addEventListener("click", () => {
    cart.clear();
    updateCart();
});

// ---------- 7. Primer pintado ----------

paginator.render();
updateCart();
