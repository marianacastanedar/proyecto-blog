import { getPosts, getPostsByTag, searchUsers, getPostsByUserId, getTags, getAllUsers } from "./api.js";
import { state, getTotalPaginas, getSkip, toggleFavorito, esFavorito, getPostEditado } from "./state.js"; import {
    renderizarPosts,
    renderLoading,
    renderError,
    renderVacio,
    renderPaginacion,
    renderSugerencias,
    limpiarSugerencias,
} from "./ui.js";

let usuariosCache = null;

async function obtenerUsuariosMap() {
    if (usuariosCache) return usuariosCache;
    try {
        const usuarios = await getAllUsers();
        usuariosCache = {};
        usuarios.forEach(u => {
            usuariosCache[u.id] = `${u.firstName} ${u.lastName}`;
        });
    } catch {
        usuariosCache = {};
    }
    return usuariosCache;
}

async function enriquecerConAutor(posts) {
    const usuariosMap = await obtenerUsuariosMap();
    return posts.map(post => ({
        ...post,
        autor: usuariosMap[post.userId] ?? "Autor desconocido",
    }));
}

export async function cargarPaginaPrincipal() {
    renderLoading();

    try {
        let resultado;

        if (state.autorSeleccionado) {
            resultado = await getPostsByUserId(state.autorSeleccionado.id);
            resultado.posts = paginarEnCliente(resultado.posts);
            state.totalPosts = resultado.total;

        } else if (state.tagSeleccionado !== "") {
            resultado = await getPostsByTag(state.tagSeleccionado);
            resultado.posts = paginarEnCliente(resultado.posts);
            state.totalPosts = resultado.total;

        } else {
            resultado = await getPosts({
                limit: state.postsPorPagina,
                skip: getSkip(),
            });
            state.totalPosts = resultado.total;
        }

        resultado.posts = await enriquecerConAutor(resultado.posts);

        resultado.posts = resultado.posts.map(post => {
            const editado = getPostEditado(post.id);
            return editado ? editado.post : post;
        });

        if (resultado.posts.length === 0) {
            renderVacio();
        } else {
            renderizarPosts(resultado.posts, esFavorito);
        }

        renderPaginacion(state.paginaActual, getTotalPaginas());

    } catch (error) {
        renderError("No se pudieron cargar los posts. Revisá tu conexión e intentá de nuevo.");
    }
}

let todosLosTags = [];

export async function cargarTags() {
    try {
        todosLosTags = await getTags();
    } catch {
        todosLosTags = [];
    }
}

function buscarSugerenciasTags(valor) {
    return todosLosTags.filter(tag =>
        tag.name.toLowerCase().includes(valor.toLowerCase())
    );
}


function paginarEnCliente(posts) {
    const inicio = getSkip();
    return posts.slice(inicio, inicio + state.postsPorPagina);
}

let timeoutBusqueda = null;

export function manejarCambioTipoFiltro() {

    state.autorSeleccionado = null;
    state.tagSeleccionado = "";
    state.paginaActual = 1;
    limpiarSugerencias();

    const input = document.getElementById("input-busqueda");
    input.value = "";

    const tipo = document.getElementById("select-tipo-filtro").value;

    if (tipo === "ninguno") {
        input.disabled = true;
        input.placeholder = "Sin filtro activo";
        cargarPaginaPrincipal();
        return;
    }

    input.disabled = false;
    input.placeholder = tipo === "autor" ? "Buscar por autor..." : "Buscar por categoría...";

    cargarPaginaPrincipal();
}

export async function manejarBusqueda(event) {
    const tipo = document.getElementById("select-tipo-filtro").value;
    if (tipo === "ninguno") return;

    const valor = event.target.value.trim();

    if (valor === "") {
        state.autorSeleccionado = null;
        state.tagSeleccionado = "";
        state.paginaActual = 1;
        limpiarSugerencias();
        await cargarPaginaPrincipal();
        return;
    }

    // Deseleccionar si cambió el texto
    if (tipo === "autor" && state.autorSeleccionado) {
        state.autorSeleccionado = null;
        state.paginaActual = 1;
    }
    if (tipo === "categoria" && state.tagSeleccionado) {
        state.tagSeleccionado = "";
        state.paginaActual = 1;
    }

    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(async () => {
        if (tipo === "autor") {
            try {
                const resultado = await searchUsers(valor);
                renderSugerencias(resultado.users.map(u => ({
                    id: u.id,
                    label: `${u.firstName} ${u.lastName}`,
                    original: u
                })), seleccionarOpcion);
            } catch {
                limpiarSugerencias();
            }
        } else {
            const tagsFiltrados = buscarSugerenciasTags(valor);
            renderSugerencias(tagsFiltrados.map(t => ({
                id: t.slug,
                label: t.name,
                original: t
            })), seleccionarOpcion);
        }
    }, 300);
}

async function seleccionarOpcion(opcion) {
    const tipo = document.getElementById("select-tipo-filtro").value;
    const input = document.getElementById("input-busqueda");

    if (tipo === "autor") {
        state.autorSeleccionado = {
            id: opcion.original.id,
            nombre: opcion.label,
        };
    } else {
        state.tagSeleccionado = opcion.original.slug;
    }

    state.paginaActual = 1;
    input.value = opcion.label;
    limpiarSugerencias();

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
}

export function inicializarEventos() {
    document.getElementById("select-tipo-filtro")
        .addEventListener("change", manejarCambioTipoFiltro);

    document.getElementById("input-busqueda")
        .addEventListener("input", manejarBusqueda);

    document.getElementById("contenedor-paginacion")
        .addEventListener("click", manejarPaginacion);
}