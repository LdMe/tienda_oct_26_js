class Shop {
    constructor(name) {
        this.name = name;
        this.products = [];
        this.stock = new Map();
    }
    getStock(id) {
        return this.stock.get(id) || 0;
    }
    setStock(id,quantity) {
        this.stock.set(id, quantity);
    }
    deleteStock(id){
        this.stock.delete(id);
    }
    findProduct(id){
        return this.products.find((p) => p.id === id)
    }
    addProduct(product, quantity = 1) {
        if (product instanceof Product) {
            const oldProduct = this.findProduct(product.id) // buscamos si el producto ya está en la lista
            if (oldProduct) {
                let stock = this.getStock(product.id) // sacamos el stock de ese producto
                stock += quantity; // sumamos quantity al stock
                this.setStock(product.id, stock); // volvemos a guardar el stock de ese producto
            } else {
                this.products.push(product);
                this.setStock(product.id, quantity);
            }
        } else {
            console.log("No es un producto");
        }
    }
    removeProduct(product, quantity = 1) {
        if (product instanceof Product) {
            const oldProduct = this.findProduct(product.id) // buscamos si el producto ya está en la lista
            if (oldProduct) {
                let stock = this.getStock(product.id)
                if(stock === 0){ // error de gestión (no hay stock, pero mantenemos el producto en la lista)
                    const index = this.products.findIndex((p)=>p.id === product.id);
                    if(index !== -1){
                        this.products.splice(index,1); //eliminar de la lista de productos
                    }
                }
                else if(quantity > stock){
                    console.log(`No te flipes, no hay tanto stock. Tú pides ${quantity} y solo hay ${stock}`)
                    
                }else if(quantity === stock){
                    // borrar producto de la lista
                    const index = this.products.findIndex((p)=>p.id === product.id);
                    if(index !== -1){
                        this.products.splice(index,1); //eliminar de la lista de productos
                    }
                    // borrar stock del producto
                    this.deleteStock(product.id);
                    return true;
                }else{
                    this.setStock(product.id,stock-quantity);
                    return true;
                }

            } else {
                console.log("No existe el producto");
                
            }
        } else {
            console.log("No es un producto");
        }
        return false
    }
    getProducts() {
        return this.products.map(product=>{
            const stock = this.getStock(product.id)
            return {
                ...product,
                stock:stock
            }
        });
    }
}

class User {

    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}
class Worker extends User {
}

class Client extends User {
}

class Product {
    static totalProducts = 0;
    constructor(name, price, category) {
        this.id = ++Product.totalProducts;
        this.name = name;
        this.price = price;
        this.category = category;
    }
    get priceEuro() {
        return this.price / 100;
    }
}
class Shirt extends Product {
    constructor(name, price) {
        super(name, price, "shirt");
    }
}

const tienda1 = new Shop("tienda 1");
const tienda2 = new Shop("tienda 2");

const client1 = new Client("Jesús", "mimail@mail.com");
const worker1 = new Worker("Danel", "worker@empresa.tech");

const product1 = new Product("Zapatos elegantes de cuero", 5450, "zapatos"); // añadimos una línea de producto
const product2 = new Product("Camiseta a cuadros", 4500, "camiseta");
const product3 = new Product("Pantalones de pana", 4500, "pantalones");

tienda1.addProduct(product1, 5);
tienda1.addProduct(product2,2)
tienda1.removeProduct(product1,5)
console.log(tienda1.getProducts());

