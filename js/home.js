import { getPosts, searchPosts, getPostsByTag, searchUsers, getPostsByUserId } from "./api.js";
import { state, getTotalPaginas, getSkip, resetFiltros, toggleFavorito, esFavorito } from "./state.js";
import {
    renderizarPosts,
    renderLoading,
    renderError,
    renderVacio,
    renderPaginacion,
    renderSugerenciasAutor,
    limpiarSugerencias,
} from "./ui.js";

// ── Carga principal ───────────────────────────────────────────────────────────

export async function cargarPaginaPrincipal() {
    renderLoading();

    try {
        let resultado;

        if (state.tipoFiltro === "autor" && state.autorSeleccionado) {
            // Autor seleccionado: traemos sus posts desde la API
            resultado = await getPostsByUserId(state.autorSeleccionado.id);
            resultado.posts = paginarEnCliente(resultado.posts);

        } else if (state.tipoFiltro === "tag" && state.tagSeleccionado !== "") {
            // Filtro por tag
            resultado = await getPostsByTag(state.tagSeleccionado);
            resultado.posts = paginarEnCliente(resultado.posts);

        } else if (state.tipoFiltro === "titulo" && state.textoBusqueda !== "") {
            // Búsqueda por título
            resultado = await searchPosts(state.textoBusqueda);
            resultado.posts = paginarEnCliente(resultado.posts);

        } else {
            // Sin filtros activos: paginación del servidor
            resultado = await getPosts({
                limit: state.postsPorPagina,
                skip: getSkip(),
            });
        }

        state.totalPosts = resultado.total;

        const postsOrdenados = ordenarPosts(resultado.posts);

        if (postsOrdenados.length === 0) {
            renderVacio();
        } else {
            renderizarPosts(postsOrdenados, esFavorito);
        }

        renderPaginacion(state.paginaActual, getTotalPaginas());

    } catch (error) {
        renderError("No se pudieron cargar los posts. Revisá tu conexión e intentá de nuevo.");
    }
}

// ── Paginación en cliente ─────────────────────────────────────────────────────

function paginarEnCliente(posts) {
    const inicio = getSkip();
    return posts.slice(inicio, inicio + state.postsPorPagina);
}

// ── Ordenamiento en cliente ───────────────────────────────────────────────────

function ordenarPosts(posts) {
    const copia = [...posts];

    switch (state.ordenarPor) {
        case "likes":
            return copia.sort((a, b) => b.reactions.likes - a.reactions.likes);
        case "views":
            return copia.sort((a, b) => b.views - a.views);
        case "title":
            return copia.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return copia;
    }
}

// ── Manejadores de eventos ────────────────────────────────────────────────────

export function manejarCambioTipoFiltro(event) {
    resetFiltros();
    state.tipoFiltro = event.target.value;

    // Limpiar el input de búsqueda y sugerencias
    const inputBusqueda = document.getElementById("input-busqueda");
    const selectTag = document.getElementById("select-tag");

    if (inputBusqueda) inputBusqueda.value = "";
    if (selectTag) selectTag.value = "";

    limpiarSugerencias();

    // Mostrar u ocultar el selector de tags según el tipo
    actualizarVisibilidadFiltros();

    cargarPaginaPrincipal();
}

export function actualizarVisibilidadFiltros() {
    const contenedorInput = document.getElementById("contenedor-input-busqueda");
    const contenedorTag = document.getElementById("contenedor-select-tag");

    if (!contenedorInput || !contenedorTag) return;

    if (state.tipoFiltro === "tag") {
        contenedorInput.style.display = "none";
        contenedorTag.style.display = "inline-block";
    } else {
        contenedorInput.style.display = "inline-block";
        contenedorTag.style.display = "none";

        // Actualizar placeholder según el tipo
        const inputBusqueda = document.getElementById("input-busqueda");
        if (inputBusqueda) {
            inputBusqueda.placeholder =
                state.tipoFiltro === "autor"
                    ? "Buscar por nombre de autor..."
                    : "Buscar por título...";
        }
    }
}

// Búsqueda por título (igual que antes)
export async function manejarBusqueda(event) {
    const valor = event.target.value.trim();

    if (state.tipoFiltro === "autor") {
        await manejarBusquedaAutor(valor);
        return;
    }

    // Búsqueda por título
    state.textoBusqueda = valor;
    state.paginaActual = 1;
    await cargarPaginaPrincipal();
}

// Búsqueda por autor: muestra sugerencias mientras escribe
let timeoutBusquedaAutor = null;

async function manejarBusquedaAutor(valor) {
    // Si limpió el input, resetear autor y recargar
    if (valor === "") {
        state.autorSeleccionado = null;
        state.textoBusqueda = "";
        state.paginaActual = 1;
        limpiarSugerencias();
        await cargarPaginaPrincipal();
        return;
    }

    // Si hay un autor ya seleccionado y cambió el texto, deseleccionar
    if (state.autorSeleccionado) {
        state.autorSeleccionado = null;
        state.paginaActual = 1;
    }

    // Debounce para no hacer fetch en cada tecla
    clearTimeout(timeoutBusquedaAutor);
    timeoutBusquedaAutor = setTimeout(async () => {
        try {
            const resultado = await searchUsers(valor);
            renderSugerenciasAutor(resultado.users, seleccionarAutor);
        } catch {
            limpiarSugerencias();
        }
    }, 300);
}

// Cuando el usuario hace click en una sugerencia de autor
async function seleccionarAutor(usuario) {
    state.autorSeleccionado = {
        id: usuario.id,
        nombre: `${usuario.firstName} ${usuario.lastName}`,
    };
    state.textoBusqueda = "";
    state.paginaActual = 1;

    // Poner el nombre en el input y cerrar sugerencias
    const inputBusqueda = document.getElementById("input-busqueda");
    if (inputBusqueda) inputBusqueda.value = state.autorSeleccionado.nombre;
    limpiarSugerencias();

    await cargarPaginaPrincipal();
}

export async function manejarFiltroTag(event) {
    state.tagSeleccionado = event.target.value;
    state.paginaActual = 1;
    await cargarPaginaPrincipal();
}

export async function manejarOrden(event) {
    state.ordenarPor = event.target.value;
    state.paginaActual = 1;
    await cargarPaginaPrincipal();
}

export async function manejarPaginacion(event) {
    const btn = event.target.closest("[data-pagina]");
    if (!btn) return;

    const pagina = btn.dataset.pagina;
    const total = getTotalPaginas();

    if (pagina === "anterior" && state.paginaActual > 1) {
        state.paginaActual--;
    } else if (pagina === "siguiente" && state.paginaActual < total) {
        state.paginaActual++;
    } else if (pagina !== "anterior" && pagina !== "siguiente") {
        state.paginaActual = parseInt(pagina);
    }

    await cargarPaginaPrincipal();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export function manejarToggleFavorito(postId) {
    toggleFavorito(postId);

    const boton = document.querySelector(`[data-favorito-id="${postId}"]`);
    if (boton) {
        boton.dataset.activo = esFavorito(postId) ? "true" : "false";
    }
}