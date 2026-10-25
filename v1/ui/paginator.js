// Paginador genérico: no sabe nada de productos, tiendas ni filtros.
// Solo sabe: "tengo una lista, la muestro de N en N con la función renderItem".
//
// Versión 1 (cliente): recibe TODOS los datos y corta la página él mismo.
class Paginator {
    constructor({ containerId, items = [], renderItem, pageSize = 10, infiniteScroll = false, onChange = () => {} }) {
        this.container = document.getElementById(containerId);
        this.renderItem = renderItem;     // item => nodo del DOM
        this.pageSize = pageSize;
        this.infiniteScroll = infiniteScroll;
        this.onChange = onChange;         // se llama después de cada render
        this.items = items;
        this.currentPage = 1;
    }

    // Se calcula cada vez: si cambian los items, cambia el número de páginas
    get totalPages() {
        return Math.max(1, Math.ceil(this.items.length / this.pageSize));
    }

    hasNext() {
        return this.currentPage < this.totalPages;
    }

    hasPrevious() {
        return this.currentPage > 1;
    }

    // Cambiar los datos (por ejemplo, al filtrar): volvemos a la página 1 y limpiamos
    setItems(items) {
        this.items = items;
        this.currentPage = 1;
        this.render();
    }

    // append = true: añade debajo (scroll infinito). false: sustituye la página.
    render(append = false) {
        const start = (this.currentPage - 1) * this.pageSize;
        const pageItems = this.items.slice(start, start + this.pageSize);

        if (!append) {
            this.container.replaceChildren();
        }
        const nodes = pageItems.map(item => this.renderItem(item));
        this.container.append(...nodes);

        this.onChange(this);
    }

    nextPage() {
        if (this.hasNext()) {
            this.currentPage++;
            this.render(this.infiniteScroll);
        }
    }

    previousPage() {
        // Con scroll infinito no tiene sentido "volver": las páginas anteriores ya se ven
        if (!this.infiniteScroll && this.hasPrevious()) {
            this.currentPage--;
            this.render();
        }
    }
}

export default Paginator;
