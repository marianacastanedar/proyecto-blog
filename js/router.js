import { getPostById, getUserById, createPost } from "./api.js";
import { renderizarDetalle, renderDetalleLoading, renderDetalleError, renderizarFormularioCrear, mostrarToast } from "./ui.js";
import { validarFormularioCrear } from "./validation.js";

export function navegarADetalle(id) {
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-detalle").style.display = "block";
    document.getElementById("vista-crear").style.display = "none";

    mostrarDetalle(id);
}

export function navegarALista() {
    document.getElementById("vista-detalle").style.display = "none";
    document.getElementById("vista-crear").style.display = "none";
    document.getElementById("vista-lista").style.display = "block";
}

export function navegarACrear() {
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-detalle").style.display = "none";
    document.getElementById("vista-crear").style.display = "block";

    renderizarFormularioCrear();
    configurarFormularioCrear();
}
export function navegarADetalleConDatos(post, autor) {
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-crear").style.display = "none";
    document.getElementById("vista-detalle").style.display = "block";

    renderizarDetalle(post, autor);
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

async function configurarFormularioCrear() {
    document.getElementById("btn-guardar").addEventListener("click", async () => {
        const esValido = validarFormularioCrear();
        if (!esValido) return;

        const titulo = document.getElementById("input-titulo").value.trim();
        const autor = document.getElementById("input-autor").value.trim();
        const contenido = document.getElementById("input-contenido").value.trim();

        try {
            const postNuevo = await createPost(titulo, autor, contenido);
            mostrarToast("¡Post creado con éxito!");

            const autorFicticio = { firstName: autor, lastName: "" };

            setTimeout(() => {
                navegarADetalleConDatos(postNuevo, autorFicticio);
            }, 1500);
        } catch (error) {
            mostrarToast("Error al crear el post. Intenta de nuevo.");
        }
    });
}