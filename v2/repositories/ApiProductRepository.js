import Product from "../core/Product.js";
import { getCategories as getApiCategories,getProducts } from "../utils/api.js";
class ApiProductRepository {
    constructor() {
       
    }

    async search({ search = "", category = "", page = 1, pageSize = 10 } = {}) {
        const term = search.trim().toLowerCase();
        const {data,error} = await getProducts({q:term,category:category},page,pageSize);
        let results = data;
        if(error){
            alert("ha ocurrido un error");
            results ={
                total: 0,
                products: []
            }
        }
        return {
            total : results.total,
            items: results.products.map(p => Product.fromJson(p))
        }

    }

    getById(id) {
        const json = this.jsonProducts.find(p => p.id === id);
        return json ? Product.fromJson(json) : null;
    }

    getCategories() {
        const categories = getApiCategories();
        return categories;
    }
}

export default ApiProductRepository;
