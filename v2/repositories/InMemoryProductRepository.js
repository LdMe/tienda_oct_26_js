import Product from "../core/Product.js";

// Un REPOSITORIO es un objeto cuyo único trabajo es conseguir datos.
// El resto de la aplicación no sabe de dónde salen (un array, un JSON, una API...).
//
// CONTRATO que cumplen todos los repositorios de productos:
//   search({ search, category, page, pageSize })  -> { items: Product[], total: number }
//   getById(id)                                    -> Product | null
//   getCategories()                                -> string[]
//
// Esta versión trabaja con los datos en memoria y se comporta como lo hará
// la API: recibe JSON "crudo", filtra, corta la página y devuelve solo esa página
// junto con el TOTAL de resultados (para que el paginador sepa cuántas páginas hay).
// Mañana haremos ApiProductRepository con los mismos tres métodos usando fetch.

class InMemoryProductRepository {
    constructor(jsonProducts) {
        this.jsonProducts = jsonProducts; // datos tal cual vienen del JSON
    }

    search({ search = "", category = "", page = 1, pageSize = 10 } = {}) {
        const term = search.trim().toLowerCase();

        // 1. Filtrar (en una API esto lo haría el servidor)
        const filtered = this.jsonProducts
            .filter(p => category === "" || p.category === category)
            .filter(p => term === "" || p.title.toLowerCase().includes(term));

        // 2. Cortar solo la página pedida
        const start = (page - 1) * pageSize;
        const pageJson = filtered.slice(start, start + pageSize);

        // 3. Convertir a Product y devolver la página + el total
        return {
            items: pageJson.map(json => Product.fromJson(json)),
            total: filtered.length
        };
    }

    getById(id) {
        const json = this.jsonProducts.find(p => p.id === id);
        return json ? Product.fromJson(json) : null;
    }

    getCategories() {
        const categories = this.jsonProducts.map(p => p.category);
        return Array.from(new Set(categories));
    }
}

export default InMemoryProductRepository;
