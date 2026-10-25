// Paginador genérico: no sabe nada de productos, tiendas ni filtros.
//
// Versión 2 (servidor): NO recibe los datos. Recibe una función fetchPage
// a la que pide "dame la página N" y que le devuelve { items, total }.
// Cortar la página es trabajo de quien tiene los datos, no del paginador.
//
// CONTRATO de fetchPage (puede ser async):
//   fetchPage({ page, pageSize, ...params })  ->  { items, total }
//
// Los params (filtros) son un objeto que el paginador guarda y reenvía
// sin saber qué significan.
class Paginator {
    constructor({ containerId, fetchPage, renderItem, pageSize = 10, infiniteScroll = false, onChange = () => {} }) {
        this.container = document.getElementById(containerId);
        this.fetchPage = fetchPage;       // ({ page, pageSize, ...params }) => { items, total }
        this.renderItem = renderItem;     // item => nodo del DOM
        this.pageSize = pageSize;
        this.infiniteScroll = infiniteScroll;
        this.onChange = onChange;         // se llama después de cada carga
        this.params = {};
        this.currentPage = 1;
        this.total = 0;                   // lo sabemos por la respuesta, no por los datos
        this.isLoading = false;           // evita pedir otra página mientras llega una
    }

    get totalPages() {
        return Math.max(1, Math.ceil(this.total / this.pageSize));
    }

    hasNext() {
        return this.currentPage < this.totalPages;
    }

    hasPrevious() {
        return this.currentPage > 1;
    }

    // Pide una página y la pinta.
    // append = true: añade debajo (scroll infinito). false: sustituye la página.
    async load(page, append = false) {
        if (this.isLoading) return; // doble click mientras carga: lo ignoramos
        this.isLoading = true;

        try {
            const { items, total } = await this.fetchPage({
                ...this.params,
                page: page,
                pageSize: this.pageSize
            });

            this.currentPage = page;
            this.total = total;

            if (!append) {
                this.container.replaceChildren();
            }
            const nodes = items.map(item => this.renderItem(item));
            this.container.append(...nodes);
        } catch (error) {
            this.container.textContent = "Could not load the data. Please try again later.";
            console.error(error);
        } finally {
            // finally se ejecuta siempre, haya ido bien o mal
            this.isLoading = false;
        }

        this.onChange(this);
    }

    // Nuevos filtros: volvemos a la página 1 y limpiamos
    async setParams(params) {
        this.params = params;
        await this.load(1);
    }

    async nextPage() {
        if (this.hasNext()) {
            await this.load(this.currentPage + 1, this.infiniteScroll);
        }
    }

    async previousPage() {
        // Con scroll infinito no tiene sentido "volver": las páginas anteriores ya se ven
        if (!this.infiniteScroll && this.hasPrevious()) {
            await this.load(this.currentPage - 1);
        }
    }
}

export default Paginator;
