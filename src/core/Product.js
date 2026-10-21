import { checkPositiveNumber, checkProduct } from "../utils/functions.js";

class LineItem{
    constructor(product,quantity,price){
        checkProduct(product);
        checkPositiveNumber(quantity);
        checkPositiveNumber(price);
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }
    getSubtotal(){
        return this.quantity * this.price;
    }
    hasMoreStock(quantity){
        return this.quantity > quantity;
    }
}

class Product {

    constructor(id,title,description,category,price,image){
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.image = image;
    }
    static fromJson({id,title,description,category,price,images}){
        const product = new Product(id,title,description,category,parseInt(price *100),images[0]);
        return product;
    }
    getPriceEuro(){
        return (this.price / 100).toFixed(2)+"€";
    }
}

export default Product;
export {
    LineItem,
    Product
}