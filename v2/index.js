// index.js es el único sitio que conoce todas las piezas y las conecta.
// Cada pieza por separado (repositorio, Shop, Cart, Paginator, renderer) no sabe de las demás.

import Shop from "./core/Shop.js";
import Cart from "./core/Cart.js";
import { Client } from "./core/User.js";
import InMemoryProductRepository from "./repositories/InMemoryProductRepository.js";
import Paginator from "./ui/paginator.js";
import {
    createProductCard,
    renderFilterForm,
    renderCartBadge,
    renderCartDetail,
    renderPageInfo
} from "./ui/renderer.js";
import data from "./data/products.json" with { type: "json" };

// ---------- 1. Acceso a datos ----------
// Esta es la ÚNICA línea que cambiará cuando usemos la API:
//   const productRepository = new ApiProductRepository("https://dummyjson.com");
const productRepository = new InMemoryProductRepository(data.products);

// ---------- 2. Lógica de negocio ----------

const shop = new Shop("tienda pruebas", productRepository);

const client = new Client(1, "Yisus", "Krais", "yisus.krais@god.com");
const cart = new Cart(client);

// ---------- 3. Elementos del DOM ----------

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const cartButton = document.getElementById("cart-button");
const cartSection = document.getElementById("cart");

// ---------- 4. Acciones ----------

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

// ---------- 5. Paginador ----------

const paginator = new Paginator({
    containerId: "product__list",
    fetchPage: (params) => shop.search(params),   // el paginador pide, la tienda responde
    renderItem: (product) => createProductCard(product, handleBuy),
    pageSize: 10,
    onChange: (p) => {
        prevButton.disabled = !p.hasPrevious();
        nextButton.disabled = !p.hasNext();
        renderPageInfo("page-info", p);
    }
});

// ---------- 6. Eventos (se ponen una sola vez) ----------

renderFilterForm("search-menu", shop.getCategories(), (filters) => {
    paginator.setParams(filters); // el paginador guarda los filtros y pide la página 1
});

prevButton.addEventListener("click", () => paginator.previousPage());
nextButton.addEventListener("click", () => paginator.nextPage());
cartButton.addEventListener("click", () => cartSection.classList.toggle("hidden"));

// ---------- 7. Primer pintado ----------

paginator.load(1);
updateCart();
