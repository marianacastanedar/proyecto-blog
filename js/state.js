export const state = {
    paginaActual: 1,
    postsPorPagina: 10,
    totalPosts: 0,

    autorSeleccionado: null,
    tagSeleccionado: "",
    ordenarPor: "default",

    favoritos: {},

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

export function toggleFavorito(post) {
    const id = post.id;
    if (state.favoritos[id]) {
        delete state.favoritos[id];
    } else {
        state.favoritos[id] = post;
    }
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