// index.js es el único sitio que conoce todas las piezas y las conecta.
// Cada pieza por separado (repositorio, Shop, Cart, Paginator, renderer, storage) no sabe de las demás.

import Shop from "./core/Shop.js";
import Cart from "./core/Cart.js";
import { Client } from "./core/User.js";
import ApiProductRepository from "./repositories/ApiProductRepository.js";
// import InMemoryProductRepository from "./repositories/InMemoryProductRepository.js";
// import data from "./data/products.json" with { type: "json" };
import Paginator from "./ui/paginator.js";
import {
    createProductCard,
    renderFilterForm,
    renderCartBadge,
    renderCartDetail,
    renderPageInfo
} from "./ui/renderer.js";
import { saveCart, loadCartLines } from "./storage.js";

// ---------- 1. Acceso a datos ----------
// Esta es la ÚNICA línea que hay que cambiar para elegir de dónde salen los datos.
// Sin conexión, descomenta los dos imports de arriba y usa la otra línea.
const productRepository = new ApiProductRepository();
// const productRepository = new InMemoryProductRepository(data.products);

// ---------- 2. Lógica de negocio ----------

const shop = new Shop("tienda pruebas", productRepository);

const client = new Client(1, "Yisus", "Krais", "yisus.krais@god.com");
const cart = new Cart(client);

// ---------- 3. Elementos del DOM ----------

const productList = document.getElementById("product__list");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const cartButton = document.getElementById("cart-button");
const cartSection = document.getElementById("cart");
const emptyCartButton = document.getElementById("empty-cart-button");

// ---------- 4. Acciones ----------

function updateCart() {
    saveCart(cart);
    renderCartBadge("cart-button", cart);
    renderCartDetail("cart-lines", cart, handleRemove);
}

// async porque addToCart tiene que pedir el producto a la API
async function handleBuy(productId) {
    try {
        await shop.addToCart(cart, productId, 1);
        updateCart();
    } catch (error) {
        alert(error.message);
    }
}

function handleRemove(productId) {
    cart.remove(productId, 1);
    updateCart();
}

// En esta versión la tienda no tiene todos los productos: para recuperar
// el carrito guardado hay que pedir cada producto a la API (getById).
async function restoreCart() {
    for (const saved of loadCartLines()) {
        try {
            await shop.addToCart(cart, saved.id, saved.quantity);
        } catch (error) {
            console.warn("Saved cart line discarded:", error.message);
        }
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

// ---------- 6. Arranque ----------
// "await" en el nivel superior funciona porque index.js es un módulo.

productList.textContent = "Loading products...";

let categories = [];
try {
    categories = await shop.getCategories();
} catch (error) {
    console.error(error); // sin categorías el filtro solo tendrá "All"
}

renderFilterForm("search-menu", categories, (filters) => {
    paginator.setParams(filters); // el paginador guarda los filtros y pide la página 1
});

prevButton.addEventListener("click", () => paginator.previousPage());
nextButton.addEventListener("click", () => paginator.nextPage());
cartButton.addEventListener("click", () => cartSection.classList.toggle("hidden"));
emptyCartButton.addEventListener("click", () => {
    cart.clear();
    updateCart();
});

await paginator.load(1);
await restoreCart();
updateCart();
