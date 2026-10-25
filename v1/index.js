// index.js es el único sitio que conoce todas las piezas y las conecta.
// Cada pieza por separado (Shop, Cart, Paginator, renderer) no sabe de las demás.

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
import data from "./data/products.json" with { type: "json" };

// ---------- 1. Lógica de negocio ----------

const shop = new Shop("tienda pruebas");
data.products.forEach(json => shop.addProduct(Product.fromJson(json), json.stock));

const client = new Client(1, "Yisus", "Krais", "yisus.krais@god.com");
const cart = new Cart(client);

// ---------- 2. Elementos del DOM ----------

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const cartButton = document.getElementById("cart-button");
const cartSection = document.getElementById("cart");

// ---------- 3. Acciones ----------

function updateCart() {
    renderCartBadge("cart-button", cart);
    renderCartDetail("cart", cart);
}

function handleBuy(productId) {
    try {
        shop.addToCart(cart, productId, 1);
        updateCart();
    } catch (error) {
        alert(error.message);
    }
}

// ---------- 4. Paginador ----------

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

// ---------- 5. Eventos (se ponen una sola vez) ----------

renderFilterForm("search-menu", shop.getCategories(), (filters) => {
    paginator.setItems(shop.filterProducts(filters));
});

prevButton.addEventListener("click", () => paginator.previousPage());
nextButton.addEventListener("click", () => paginator.nextPage());
cartButton.addEventListener("click", () => cartSection.classList.toggle("hidden"));

// ---------- 6. Primer pintado ----------

paginator.render();
updateCart();
