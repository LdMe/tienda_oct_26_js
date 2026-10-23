

function createProductArticle(productEntry) {
    const product = productEntry.product;
    const stock = productEntry.stock;
    const article = document.createElement("article");
    article.classList.add("product", "product-card");
    article.dataset.productId = product.id;

    const productTitle = document.createElement("h3");
    productTitle.textContent = product.title;
    productTitle.classList.add("product__title");

    const productImage = document.createElement("img");
    productImage.setAttribute("src", product.image);
    productImage.setAttribute("alt", `image of ${product.title}`);

    const productPrice = document.createElement("p");
    productPrice.textContent = product.getPriceEuro();

    const productDescription = document.createElement("p");
    productDescription.textContent = product.description;

    const productStock = document.createElement("p");
    productStock.textContent= "stock: "+stock;

    const productButton = document.createElement("button");
    productButton.textContent = "Buy";
    productButton.classList.add("buy-button");

    article.append(productImage, productTitle, productDescription, productPrice, productStock, productButton);
    return article;

}

function renderFilterForm(sectionId, categories) {
    const form = document.createElement("form");
    form.setAttribute("id", "filter-form");

    const searchLabel = document.createElement("label");
    searchLabel.textContent = "Search";
    searchLabel.setAttribute("for", "search-input")

    const searchInput = document.createElement("input");
    searchInput.setAttribute("id", "search-input");
    searchInput.setAttribute("name", "search");

    const categoryLabel = document.createElement("label");
    categoryLabel.textContent = "Category";
    categoryLabel.setAttribute("for", "category-select")

    const categorySelect = document.createElement("select");
    categorySelect.setAttribute("id", "category-select");
    categorySelect.setAttribute("name", "category");

    const categoryOptions = categories.map(c => {
        console.log("category",c);
        const option = document.createElement("option");
        option.value = c;
        option.textContent = c;
        return option;
    })
    console.log(categoryOptions)
    categorySelect.append(...categoryOptions);

    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";

    form.append(searchLabel,searchInput,categoryLabel,categorySelect,searchButton)

    const section = document.getElementById(sectionId);
    section.append(form);

}

function renderCart(cartSectionId,cart){
    
    const cartSection = document.getElementById(cartSectionId);
    const totalProducts = cart.getTotalQuantity();
    cartSection.innerText = `🛒${totalProducts}`; 
    cartSection.addEventListener("click",()=>{
        renderCartData("cart",cart);
    })  

}

function renderProductInCart(cartEntry){

    const article = document.createElement("article");
    article.classList.add("product-line");

    const productTitle = document.createElement("h3");
    productTitle.textContent = cartEntry.product.title;

    const productImage = document.createElement("img");
    productImage.setAttribute("src",cartEntry.product.image);

    const quantity = document.createElement("p");
    quantity.textContent="X"+cartEntry.quantity;

    const subtotal = document.createElement("p");
    subtotal.textContent = cartEntry.quantity * cartEntry.price;

    article.append(productTitle,productImage,quantity,subtotal);
    return article;


}
function renderCartData(cartSectionId,cart){
    const lines = cart.getLines();
    const linesHTML = lines.map(l => renderProductInCart(l));
    const cartSection = document.getElementById(cartSectionId)
    cartSection.replaceChildren();
    cartSection.append(...linesHTML);
    
    const total = document.createElement("p");
    total.classList.add("total");
    total.textContent = `Total: ${cart.getTotalPrice()}`
    cartSection.append(total)
    console.log(lines);
}

export {
    createProductArticle,
    renderFilterForm,
    renderCart
}