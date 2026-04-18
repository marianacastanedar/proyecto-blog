import { createPost, updatePost } from "./api.js";
import { validarFormularioCrear, validarFormularioEditar } from "./validation.js";
import { mostrarToast, agregarPostAlInicio, actualizarPostEnLista, renderEditarLoading } from "./ui.js";
import { navegarADetalleConDatos, navegarALista } from "./router.js";
import { guardarPostEditado } from "./state.js";

export function configurarFormularioCrear() {
    document.getElementById("btn-guardar").addEventListener("click", async () => {
        if (!validarFormularioCrear()) return;

        const titulo = document.getElementById("input-titulo").value.trim();
        const autor = document.getElementById("input-autor").value.trim();
        const contenido = document.getElementById("input-contenido").value.trim();

        try {
            const postNuevo = await createPost(titulo, autor, contenido);
            mostrarToast("¡Post creado con éxito!");

            const postCompleto = {
                ...postNuevo,
                autor,
                esLocal: true,
                tags: postNuevo.tags ?? [],
                views: postNuevo.views ?? 0,
                reactions: postNuevo.reactions ?? { likes: 0, dislikes: 0 },
            };

            agregarPostAlInicio(postCompleto);
            setTimeout(() => navegarADetalleConDatos(
                postCompleto,
                { firstName: autor, lastName: "" }
            ), 1500);
        } catch {
            mostrarToast("Error al crear el post. Intenta de nuevo.");
        }
    });
}

export function configurarFormularioEditar(post, autor) {
    document.getElementById("btn-cancelar-editar").addEventListener("click", () => {
        navegarADetalleConDatos(post, autor);
    });

    document.getElementById("btn-guardar-editar").addEventListener("click", async () => {
        if (!validarFormularioEditar()) return;

        const titulo = document.getElementById("edit-titulo").value.trim();
        const autorNombre = document.getElementById("edit-autor").value.trim();
        const contenido = document.getElementById("edit-contenido").value.trim();

        renderEditarLoading(true);
        try {
            let postFinal;

            if (post.esLocal) {
                postFinal = {
                    ...post,
                    title: titulo,
                    body: contenido,
                    autor: autorNombre,
                };
            } else {
                const postActualizado = await updatePost(post.id, titulo, autorNombre, contenido);
                postFinal = { ...post, ...postActualizado };
            }

            renderEditarLoading(false);
            const autorActualizado = { firstName: autorNombre, lastName: "" };
            guardarPostEditado(postFinal, autorActualizado)
            actualizarPostEnLista(postFinal, autorActualizado);
            navegarADetalleConDatos(postFinal, autorActualizado);
            mostrarToast("¡Post actualizado con éxito!");
        } catch {
            renderEditarLoading(false);
            mostrarToast("Error al actualizar el post. Intenta de nuevo.");
        }
    });
}