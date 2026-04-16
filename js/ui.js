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

export function limpiarSugerencias() {
    const contenedor = document.getElementById("sugerencias");
    if (contenedor) contenedor.innerHTML = "";
}

export function renderLoading() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "<li>Cargando...</li>";
}

export function renderError(mensaje) {
    const lista = document.getElementById("lista");
    lista.innerHTML = `<li>${mensaje}</li>`;
}

export function renderVacio() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "<li>No se encontraron publicaciones.</li>";
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

export function renderPaginacion(paginaActual, totalPaginas) {
    const contenedor = document.getElementById("contenedor-paginacion");
    contenedor.innerHTML = "";

    if (totalPaginas <= 1) return;

    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.dataset.pagina = "anterior";
    btnAnterior.disabled = paginaActual === 1;
    contenedor.appendChild(btnAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.dataset.pagina = i;
        if (i === paginaActual) btn.disabled = true;
        contenedor.appendChild(btn);
    }

    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "Siguiente";
    btnSiguiente.dataset.pagina = "siguiente";
    btnSiguiente.disabled = paginaActual === totalPaginas;
    contenedor.appendChild(btnSiguiente);
}

export function renderSugerencias(opciones, onSeleccionar) {
    const contenedor = document.getElementById("sugerencias");
    contenedor.innerHTML = "";

    if (opciones.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    opciones.forEach(opcion => {
        const item = document.createElement("div");
        item.textContent = opcion.label;
        item.style.cursor = "pointer";
        item.addEventListener("click", () => onSeleccionar(opcion));
        contenedor.appendChild(item);
    });
}