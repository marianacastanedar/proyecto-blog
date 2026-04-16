export function renderizarPosts(posts, esFavorito = () => false) {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    posts.forEach(post => {
        const li = document.createElement("li");
        li.textContent = post.title;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
            import("./router.js").then(router => {
                router.navegarADetalle(post.id);
            });
        });

        lista.appendChild(li);
    });
}

export function renderLoading() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "<li>Cargando...</li>";
}

export function renderizarDetalle(post, autor) {
    const contenedor = document.getElementById("detalle-contenido");
 
    contenedor.innerHTML = `
        <h1>${post.title}</h1>
        <p>Por: ${autor.firstName} ${autor.lastName}</p>
        <p>Vistas: ${post.views}</p>
        <p>Categorías: ${post.tags.join(", ")}</p>
        <p>Contenido: ${post.body}</p>
        <p>Me gusta: ${post.reactions.likes}</p>
        <p>No me gusta: ${post.reactions.dislikes}</p>
        <button id="btn-editar">Editar</button>
        <button id="btn-eliminar">Eliminar</button>
        <button id="btn-regresar">Regresar</button>
    `;
 
    document.getElementById("btn-regresar").addEventListener("click", () => {
        import("./router.js").then(router => {
            router.navegarALista();
        });
    });
 
    document.getElementById("btn-editar").addEventListener("click", () => {
        import("./router.js").then(router => {
            router.navegarAEditar(post, autor);
        });
    });

    document.getElementById("btn-eliminar").addEventListener("click", () => {
    import("./router.js").then(router => {
        router.manejarEliminar(post.id);
    });
});
}

export function renderDetalleLoading() {
    const contenedor = document.getElementById("detalle-contenido");
    contenedor.innerHTML = "<p>Cargando post...</p>";
}

export function renderDetalleError() {
    const contenedor = document.getElementById("detalle-contenido");
    contenedor.innerHTML = "<p>Error al cargar el post. Intenta de nuevo.</p>";
}

export function renderizarFormularioCrear() {
    const contenedor = document.getElementById("crear-contenido");

    contenedor.innerHTML = `
        <h1>¡Bienvenido!</h1>
        <p>Comparte tu post :)</p>

        <label for="input-titulo">Título</label>
        <input id="input-titulo" type="text" placeholder="Escribe un título para tu post, necesitas mínimo 5 caracteres" />
        <span id="error-titulo"></span>

        <label for="input-autor">Nombre del autor</label>
        <input id="input-autor" type="text" placeholder="Escribe tu nombre o apodo" />
        <span id="error-autor"></span>

        <label for="input-contenido">Contenido</label>
        <textarea id="input-contenido" placeholder="¡Cuéntanos que piensas! Recuerda agregar más de 20 caracteres"></textarea>
        <span id="error-contenido"></span>

        <button id="btn-guardar">Guardar</button>
        <button id="btn-regresar-crear">Regresar</button>
    `;

    document.getElementById("btn-regresar-crear").addEventListener("click", () => {
        import("./router.js").then(router => {
            router.navegarALista();
        });
    });
}

export function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

export function renderizarFormularioEditar(post, autor) {
    const contenedor = document.getElementById("editar-contenido");
 
    contenedor.innerHTML = `
        <h1>Edita este post</h1>
        <p>Reescribe los campos para modificarlos</p>
 
        <label for="edit-titulo">Título</label>
        <input id="edit-titulo" type="text" value="${post.title}" />
        <span id="edit-error-titulo"></span>
 
        <label for="edit-autor">Nombre del autor</label>
        <input id="edit-autor" type="text" value="${autor.firstName} ${autor.lastName}" />
        <span id="edit-error-autor"></span>
 
        <label for="edit-contenido">Contenido</label>
        <textarea id="edit-contenido">${post.body}</textarea>
        <span id="edit-error-contenido"></span>
 
        <button id="btn-guardar-editar">Guardar</button>
        <button id="btn-cancelar-editar">Cancelar</button>
    `;
}
 
 
export function renderEditarLoading(activo) {
    const overlay = document.getElementById("editar-overlay");
    overlay.style.display = activo ? "flex" : "none";
}

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


function paginarEnCliente(posts) {
    const inicio = getSkip();
    return posts.slice(inicio, inicio + state.postsPorPagina);
}


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

    if (state.autorSeleccionado) {
        state.autorSeleccionado = null;
        state.paginaActual = 1;
    }

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