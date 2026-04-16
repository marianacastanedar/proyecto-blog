import { getPostById, getUserById } from "./api.js";
import { renderizarDetalle, renderDetalleLoading, renderDetalleError } from "./ui.js";

export function navegarADetalle(id) {
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-detalle").style.display = "block";

    mostrarDetalle(id);
}

export function navegarALista() {
    document.getElementById("vista-detalle").style.display = "none";
    document.getElementById("vista-lista").style.display = "block";
}

async function mostrarDetalle(id) {
    renderDetalleLoading();
    try {
        const post = await getPostById(id);
        const autor = await getUserById(post.userId);
        renderizarDetalle(post, autor);
    } catch (error) {
        renderDetalleError();
    }
}