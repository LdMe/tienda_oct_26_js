

function createProductArticle({ id, title, price, image, description }) {

    const article = document.createElement("article");
    article.classList.add("product", "product-card");
    article.dataset.productId = id;

    const productTitle = document.createElement("h3");
    productTitle.textContent = title;
    productTitle.classList.add("product__title");

    const productImage = document.createElement("img");
    productImage.setAttribute("src", image);
    productImage.setAttribute("alt", `image of ${title}`);

    const productPrice = document.createElement("p");
    productPrice.textContent = price + "€";

    const productDescription = document.createElement("p");
    productDescription.textContent = description;

    const productButton = document.createElement("button");
    productButton.textContent = "Me gusta";

    productButton.addEventListener("click", () => {
        alert(`Te gusta ${title} con id ${id}`);
    })

    article.append(productImage, productTitle, productDescription, productPrice, productButton);
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

export {
    createProductArticle,
    renderFilterForm
}