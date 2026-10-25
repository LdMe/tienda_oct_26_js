import Product from "../core/Product.js";
import { fetchProducts, fetchProductById, fetchCategories } from "../api.js";

// Repositorio que obtiene los productos de DummyJSON.
// Cumple el MISMO contrato que InMemoryProductRepository, pero todos sus métodos
// son async (devuelven promesas), porque tiene que esperar a la red:
//   search({ search, category, page, pageSize })  -> Promise<{ items: Product[], total: number }>
//   getById(id)                                    -> Promise<Product | null>
//   getCategories()                                -> Promise<string[]>

class ApiProductRepository {

    async search({ search = "", category = "", page = 1, pageSize = 10 } = {}) {
        // Caso especial: la API no permite combinar texto y categoría en una petición.
        // Pedimos TODOS los resultados de la búsqueda, filtramos la categoría
        // y cortamos la página aquí. El contrato se cumple igual.
        if (search !== "" && category !== "") {
            const data = await fetchProducts({ search: search }); // pageSize 0 → todos
            const filtered = data.products.filter(p => p.category === category);
            const start = (page - 1) * pageSize;
            return {
                items: filtered.slice(start, start + pageSize).map(json => Product.fromJson(json)),
                total: filtered.length
            };
        }

        // Caso normal: la API filtra y pagina por nosotros
        const data = await fetchProducts({ search, category, page, pageSize });
        return {
            items: data.products.map(json => Product.fromJson(json)),
            total: data.total
        };
    }

    async getById(id) {
        const json = await fetchProductById(id);
        return json ? Product.fromJson(json) : null;
    }

    async getCategories() {
        return await fetchCategories();
    }
}

export default ApiProductRepository;
