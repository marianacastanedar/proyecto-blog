// ── Estado global de la aplicación ───────────────────────────────────────────

export const state = {
    // Paginación
    paginaActual: 1,
    postsPorPagina: 10,
    totalPosts: 0,

    // Filtros
    textoBusqueda: "",
    tagSeleccionado: "",
    ordenarPor: "default", // "default" | "likes" | "views" | "title"

    // Favoritos: guardados en localStorage para que persistan entre sesiones
    favoritos: cargarFavoritos(),
};

// ── Helpers de paginación ─────────────────────────────────────────────────────

export function getTotalPaginas() {
    return Math.ceil(state.totalPosts / state.postsPorPagina);
}

export function getSkip() {
    return (state.paginaActual - 1) * state.postsPorPagina;
}

// ── Helpers de favoritos ──────────────────────────────────────────────────────

function cargarFavoritos() {
    try {
        const guardados = localStorage.getItem("favoritos");
        return guardados ? JSON.parse(guardados) : [];
    } catch {
        return [];
    }
}

export function toggleFavorito(postId) {
    const index = state.favoritos.indexOf(postId);
    if (index === -1) {
        state.favoritos.push(postId);
    } else {
        state.favoritos.splice(index, 1);
    }
    guardarFavoritos();
}

export function esFavorito(postId) {
    return state.favoritos.includes(postId);
}

function guardarFavoritos() {
    try {
        localStorage.setItem("favoritos", JSON.stringify(state.favoritos));
    } catch {
        console.error("No se pudieron guardar los favoritos.");
    }
}