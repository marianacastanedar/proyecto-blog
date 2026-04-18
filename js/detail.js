import { getPostById, getUserById, deletePost } from "./api.js";
import { renderizarDetalle, renderDetalleLoading, renderDetalleError, mostrarToast, eliminarPostDeLista, mostrarModalConfirmar } from "./ui.js";
import { navegarALista, navegarAEditar } from "./router.js";

export async function cargarDetalle(id) {
    renderDetalleLoading();
    try {
        const post = await getPostById(id);
        const autor = await getUserById(post.userId);
        renderizarDetalle(post, autor);
    } catch {
        renderDetalleError();
    }
}

export async function manejarEliminar(id) {
    const confirmado = await mostrarModalConfirmar();
    if (!confirmado) return;

    try {
        await deletePost(id);
        eliminarPostDeLista(id);
        mostrarToast("Publicación eliminada correctamente.");
        setTimeout(() => navegarALista(), 1500);
    } catch {
        mostrarToast("Error al eliminar la publicación. Intentá de nuevo.");
    }
}