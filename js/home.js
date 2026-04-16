import { getPosts, getPostsByTag, searchUsers, getPostsByUserId, getTags } from "./api.js";
import { state, getTotalPaginas, getSkip, toggleFavorito, esFavorito } from "./state.js";
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

        if (state.autorSeleccionado) {
            // Filtro por autor activo
            resultado = await getPostsByUserId(state.autorSeleccionado.id);
            resultado.posts = paginarEnCliente(resultado.posts);
            state.totalPosts = resultado.total;

        } else if (state.tagSeleccionado !== "") {
            // Filtro por categoría activo
            resultado = await getPostsByTag(state.tagSeleccionado);
            resultado.posts = paginarEnCliente(resultado.posts);
            state.totalPosts = resultado.total;

        } else {
            // Sin filtros: paginación del servidor
            resultado = await getPosts({
                limit: state.postsPorPagina,
                skip: getSkip(),
            });
            state.totalPosts = resultado.total;
        }

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

// ── Llenar dropdown de tags ───────────────────────────────────────────────────

export async function cargarTags() {
    try {
        const tags = await getTags();
        const select = document.getElementById("select-tag");

        tags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag.slug;
            option.textContent = tag.name;
            select.appendChild(option);
        });
    } catch (error) {
        // Si falla, el dropdown queda solo con "Todas las categorías"
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

let timeoutBusquedaAutor = null;

export async function manejarBusquedaAutor(event) {
    const valor = event.target.value.trim();

    if (valor === "") {
        state.autorSeleccionado = null;
        state.paginaActual = 1;
        limpiarSugerencias();
        await cargarPaginaPrincipal();
        return;
    }

    // Si había un autor seleccionado y cambió el texto, deseleccionarlo
    if (state.autorSeleccionado) {
        state.autorSeleccionado = null;
        state.paginaActual = 1;
    }

    // Debounce: espera 300ms antes de buscar
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

async function seleccionarAutor(usuario) {
    state.autorSeleccionado = {
        id: usuario.id,
        nombre: `${usuario.firstName} ${usuario.lastName}`,
    };
    state.paginaActual = 1;

    const input = document.getElementById("input-autor-busqueda");
    if (input) input.value = state.autorSeleccionado.nombre;
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

export function inicializarEventos() {
    document.getElementById("input-autor-busqueda")
        .addEventListener("input", manejarBusquedaAutor);

    document.getElementById("select-tag")
        .addEventListener("change", manejarFiltroTag);

    document.getElementById("select-orden")
        .addEventListener("change", manejarOrden);

    document.getElementById("contenedor-paginacion")
        .addEventListener("click", manejarPaginacion);
}