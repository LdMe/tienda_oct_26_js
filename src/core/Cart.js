import { checkClient, checkPositiveNumber, checkProduct } from "../utils/functions.js";
import { LineItem } from "./Product.js";

class Cart {
    constructor(client) {
        checkClient(client);
        this.client = client;
        this.items = new Map();
    }
    getLine(productId) {
        const item = this.items.get(productId) || null;
        return item;
    }
    getLines(){
        const values = this.items.values();
        const result =  Array.from(this.items.values());
        return result;
    }
    add(product, quantity) {
        checkProduct(product);
        checkPositiveNumber(quantity);
        let line = this.getLine(product.id);
        if (!line) {
            line = new LineItem(product, quantity, product.price);
            this.items.set(product.id,line);
        } else {
            line.quantity += quantity;
            line.price = product.price; // actualizamos el precio
        }
    }
    deleteItem(productId){
        this.items.delete(productId);
    }
    remove(productId,quantity){
        const item = this.getLine(productId);
        if(item){
            if(item.hasMoreStock(quantity)){
                item.quantity -= quantity;
            }else{
                this.deleteItem(productId);
            }
        }
    }
    clear(){
        this.items.clear();
    }

    getTotalPrice(formatted=false){
        const lines = this.getLines();
        const result = lines.reduce((accumulator,line)=> {
            const subtotal = line.getSubtotal();
            return accumulator + line.getSubtotal()
        },0)
        if(formatted){
            return (result/100).toFixed(2) +"€"
        }
        return result;
    }
    getTotalQuantity(){
        const lines = this.getLines();
        const result = lines.reduce((accumulator,line)=> {
            return accumulator + line.quantity
        },0)
        return result;
    }
    isEmpty(){
        return this.items.size === 0;
    }

}

export default Cart;