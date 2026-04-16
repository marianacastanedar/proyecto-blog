import { getPostById, getUserById, createPost, updatePost, deletePost } from "./api.js";
import { renderizarDetalle, renderDetalleLoading, renderDetalleError, renderizarFormularioCrear, renderizarFormularioEditar, renderEditarLoading, mostrarToast, agregarPostAlInicio, actualizarPostEnLista, eliminarPostDeLista } from "./ui.js";
import { validarFormularioCrear, validarFormularioEditar } from "./validation.js";

export function navegarADetalle(id) {
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-detalle").style.display = "block";
    document.getElementById("vista-crear").style.display = "none";
    document.getElementById("vista-editar").style.display = "none";

    mostrarDetalle(id);
}

export function navegarALista() {
    document.getElementById("vista-detalle").style.display = "none";
    document.getElementById("vista-crear").style.display = "none";
    document.getElementById("vista-editar").style.display = "none";
    document.getElementById("vista-lista").style.display = "block";
}

export function navegarACrear() {
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-detalle").style.display = "none";
    document.getElementById("vista-editar").style.display = "none";
    document.getElementById("vista-crear").style.display = "block";

    renderizarFormularioCrear();
    configurarFormularioCrear();
}

export function navegarADetalleConDatos(post, autor) {
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-crear").style.display = "none";
    document.getElementById("vista-editar").style.display = "none";
    document.getElementById("vista-detalle").style.display = "block";

    renderizarDetalle(post, autor);
}

export function navegarAEditar(post, autor) {
    document.getElementById("vista-lista").style.display = "none";
    document.getElementById("vista-detalle").style.display = "none";
    document.getElementById("vista-crear").style.display = "none";
    document.getElementById("vista-editar").style.display = "block";

    renderizarFormularioEditar(post, autor);
    configurarFormularioEditar(post, autor);
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

            agregarPostAlInicio(postNuevo);

            setTimeout(() => {
                navegarADetalleConDatos(postNuevo, autorFicticio);
            }, 1500);
        } catch (error) {
            mostrarToast("Error al crear el post. Intenta de nuevo.");
        }
    });
}

async function configurarFormularioEditar(post, autor) {
    document.getElementById("btn-cancelar-editar").addEventListener("click", () => {
        navegarADetalleConDatos(post, autor);
    });

    document.getElementById("btn-guardar-editar").addEventListener("click", async () => {
        const esValido = validarFormularioEditar();
        if (!esValido) return;

        const titulo = document.getElementById("edit-titulo").value.trim();
        const autorNombre = document.getElementById("edit-autor").value.trim();
        const contenido = document.getElementById("edit-contenido").value.trim();

        renderEditarLoading(true);

        try {
            const postActualizado = await updatePost(post.id, titulo, autorNombre, contenido);
            renderEditarLoading(false);

            const autorActualizado = { firstName: autorNombre, lastName: "" };
            const postFinal = { ...post, ...postActualizado };

            actualizarPostEnLista(postFinal, autorActualizado);

            navegarADetalleConDatos(postFinal, autorActualizado);
            mostrarToast("¡Post actualizado con éxito!");
        } catch (error) {
            renderEditarLoading(false);
            mostrarToast("Error al actualizar el post. Intenta de nuevo.");
        }
    });
}

export async function manejarEliminar(id) {
    const confirmado = confirm("¿Estás seguro de que querés eliminar esta publicación?");
    if (!confirmado) return;

    try {
        await deletePost(id);
        eliminarPostDeLista(id);
        mostrarToast("Publicación eliminada correctamente.");
        setTimeout(() => navegarALista(), 1500);
    } catch (error) {
        mostrarToast("Error al eliminar la publicación. Intentá de nuevo.");
    }
}