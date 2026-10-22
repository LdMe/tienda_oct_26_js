

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


export {
    createProductArticle
}