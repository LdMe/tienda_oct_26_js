import { checkPositiveNumber, checkProduct } from "../utils/functions.js";

class InventoryEntry {
    constructor(product, stock) {
        this.product = product;
        this.stock = stock;
    }
    getStock(){
        return this.stock;
    }
    hasStock(quantity){
        return this.stock >= quantity;
    }
}

class Shop {
    constructor(name) {
        this.name = name;
        this.inventory = new Map();
    }
    addProduct(product,quantity){
        checkProduct(product);
        checkPositiveNumber(quantity)

        const entry = new InventoryEntry(product,quantity);
        // const entry = {
        //     product,
        //     stock: quantity
        // }
        this.inventory.set(product.id,entry)
    }
    findProduct(id){
        return this.inventory.get(id) || null;
    }
    getStock(id){
        const inventoryEntry = this.findProduct(id);
        if(inventoryEntry){
            return inventoryEntry.getStock();
        } 
        return 0;
    }
    hasStock(id,quantity){
        const inventoryEntry = this.findProduct(id);
        if(inventoryEntry){
            return inventoryEntry.hasStock(quantity);
        } 
        return false;
    }
    getProducts(){
        return Array.from(this.inventory.values())
    }

}


export default Shop;