export const state = {
    // Paginación
    paginaActual: 1,
    postsPorPagina: 10,
    totalPosts: 0,

    autorSeleccionado: null,

    tagSeleccionado: "",
    
    ordenarPor: "default",

    favoritos: cargarFavoritos(),

    paginaFavoritos: 1,
};

export function getTotalPaginas() {
    return Math.ceil(state.totalPosts / state.postsPorPagina);
}

export function getSkip() {
    return (state.paginaActual - 1) * state.postsPorPagina;
}

export function resetFiltros() {
    state.autorSeleccionado = null;
    state.tagSeleccionado = "";
    state.paginaActual = 1;
}

function cargarFavoritos() {
    try {
        const guardados = localStorage.getItem("favoritos");
        if (!guardados) return {};

        const parsed = JSON.parse(guardados);

        // Si el formato guardado es un array (formato viejo),
        // lo borra del localStorage y devuelve objeto vacío
        if (Array.isArray(parsed)) {
            localStorage.removeItem("favoritos");
            return {};
        }

        return parsed;
    } catch {
        return {};
    }
}

function guardarFavoritos() {
    try {
        localStorage.setItem("favoritos", JSON.stringify(state.favoritos));
    } catch {
        console.error("No se pudieron guardar los favoritos.");
    }
}

export function toggleFavorito(post) {
    const id = post.id;
    if (state.favoritos[id]) {
        delete state.favoritos[id];
    } else {
        state.favoritos[id] = post;
    }
    guardarFavoritos();
}

export function esFavorito(postId) {
    return !!state.favoritos[postId];
}
 
export function getFavoritos() {
    return Object.values(state.favoritos);
}
 
export function getTotalFavoritos() {
    return Object.keys(state.favoritos).length;
}
 
export function getTotalPaginasFavoritos(postsPorPagina) {
    return Math.ceil(getTotalFavoritos() / postsPorPagina);
}