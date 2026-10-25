import { formatPrice } from "../utils/functions.js";

// ---------- Productos ----------

// Crea la tarjeta de un producto. No sabe qué pasa al pulsar "Buy":
// eso lo decide quien la llama, pasando la función onBuy.
function createProductCard({ product, stock }, onBuy) {
    const article = document.createElement("article");
    article.classList.add("product", "product-card");
    article.dataset.productId = product.id;

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = `image of ${product.title}`;

    const title = document.createElement("h3");
    title.textContent = product.title;
    title.classList.add("product__title");

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("p");
    price.textContent = product.getPriceEuro();

    const stockText = document.createElement("p");
    stockText.textContent = "stock: " + stock;

    const button = document.createElement("button");
    button.textContent = "Buy";
    button.classList.add("buy-button");
    button.disabled = stock === 0;
    button.addEventListener("click", () => onBuy(product.id));

    article.append(image, title, description, price, stockText, button);
    return article;
}

// ---------- Formulario de filtros ----------

// Pinta el formulario y, al enviarlo, llama a onSubmit({ search, category }).
// No sabe nada del paginador ni de la tienda.
function renderFilterForm(sectionId, categories, onSubmit) {
    const form = document.createElement("form");
    form.id = "filter-form";

    const searchLabel = document.createElement("label");
    searchLabel.textContent = "Search";
    searchLabel.htmlFor = "search-input";

    const searchInput = document.createElement("input");
    searchInput.id = "search-input";
    searchInput.name = "search";

    const categoryLabel = document.createElement("label");
    categoryLabel.textContent = "Category";
    categoryLabel.htmlFor = "category-select";

    const categorySelect = document.createElement("select");
    categorySelect.id = "category-select";
    categorySelect.name = "category";

    // Primera opción: valor vacío = todas las categorías
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All";

    const categoryOptions = categories.map(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        return option;
    });
    categorySelect.append(allOption, ...categoryOptions);

    const searchButton = document.createElement("button");
    searchButton.type = "submit";
    searchButton.textContent = "Search";

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // que no recargue la página
        onSubmit({
            search: searchInput.value,
            category: categorySelect.value
        });
    });

    form.append(searchLabel, searchInput, categoryLabel, categorySelect, searchButton);
    document.getElementById(sectionId).append(form);
}

// ---------- Carrito ----------

// Solo actualiza el texto del botón del carrito (🛒 3).
// El listener del click se pone UNA vez en index.js, no aquí:
// si lo pusiéramos aquí, cada vez que se repinta se añadiría otro listener.
function renderCartBadge(buttonId, cart) {
    document.getElementById(buttonId).textContent = `🛒 ${cart.getTotalQuantity()}`;
}

function createCartLine(line) {
    const article = document.createElement("article");
    article.classList.add("product-line");

    const image = document.createElement("img");
    image.src = line.product.image;
    image.alt = line.product.title;

    const title = document.createElement("h3");
    title.textContent = line.product.title;

    const quantity = document.createElement("p");
    quantity.textContent = "x" + line.quantity;

    const subtotal = document.createElement("p");
    subtotal.textContent = formatPrice(line.getSubtotal());

    article.append(image, title, quantity, subtotal);
    return article;
}

function renderCartDetail(sectionId, cart) {
    const section = document.getElementById(sectionId);
    section.replaceChildren();

    if (cart.isEmpty()) {
        section.textContent = "The cart is empty";
        return;
    }

    const lines = cart.getLines().map(line => createCartLine(line));

    const total = document.createElement("p");
    total.classList.add("total");
    total.textContent = `Total: ${cart.getTotalPrice(true)}`;

    section.append(...lines, total);
}

// ---------- Paginación ----------

function renderPageInfo(elementId, paginator) {
    document.getElementById(elementId).textContent =
        `Page ${paginator.currentPage} of ${paginator.totalPages}`;
}

export {
    createProductCard,
    renderFilterForm,
    renderCartBadge,
    renderCartDetail,
    renderPageInfo
}
