export function renderizarPosts(posts, esFavorito = () => false) {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    posts.forEach(post => {
        const li = document.createElement("li");
        li.dataset.postId = post.id;
 
        const descripcion = post.body
            ? post.body.slice(0, 80) + (post.body.length > 80 ? "…" : "")
            : "";
 
        const activo = esFavorito(post.id) ? "true" : "false";
        const starIcon = esFavorito(post.id) ? "★" : "☆";
 
        li.innerHTML = `
            <button class="post-card-fav" data-favorito-id="${post.id}" data-activo="${activo}" title="Favorito">
                ${starIcon}
            </button>
            <p class="post-card-title">${post.title}</p>
            <p class="post-card-autor">${post.autor ?? "Autor"}</p>
            <p class="post-card-desc">${descripcion}</p>
            <button class="post-card-btn">Detalles</button>
        `;
 
        li.classList.add("post-card");

        li.addEventListener("click", (e) => {
            if (e.target.closest(".post-card-fav")) return;
            import("./router.js").then(router => {
                router.navegarADetalle(post.id);
            });
        });
 
        li.querySelector(".post-card-fav").addEventListener("click", (e) => {
            e.stopPropagation();
            import("./home.js").then(home => {
                home.manejarToggleFavorito(post.id);
                const btn = e.currentTarget;
                const ahora = btn.dataset.activo === "true";
                btn.dataset.activo = ahora ? "false" : "true";
                btn.textContent = ahora ? "☆" : "★";
            });
        });
 
        lista.appendChild(li);
    });
}

export function limpiarSugerencias() {
    const contenedor = document.getElementById("sugerencias");
    if (contenedor) contenedor.innerHTML = "";
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
        item.addEventListener("click", () => onSeleccionar(opcion));
        contenedor.appendChild(item);
    });
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
        <p class="detalle-autor">Por: ${autor.firstName} ${autor.lastName}</p>

        <button class="detalle-fav-btn" data-favorito-id="${post.id}" data-activo="false">
            ☆ Agregar a favoritos
        </button>

        <p class="detalle-meta">Vistas: ${post.views}</p>
        <p class="detalle-tags"><strong>Categoría:</strong> ${post.tags.join(", ")}</p>
        <p class="detalle-body">Contenido: ${post.body}</p>
        <p class="detalle-reactions">Me gusta: ${post.reactions.likes}</p>
        <p class="detalle-reactions">No me gusta: ${post.reactions.dislikes}</p>

        <div class="detalle-acciones">
            <div class="detalle-acciones-izq">
                <button id="btn-editar">Editar</button>
                <button id="btn-eliminar">Eliminar</button>
            </div>
            <button id="btn-regresar">Regresar a inicio</button>
        </div>
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
        import("./detail.js").then(detail => {
            detail.manejarEliminar(post.id);
        });
    });
}

export function renderDetalleLoading() {
    const contenedor = document.getElementById("detalle-contenido");
    contenedor.innerHTML = "<p>Cargando post...</p>";
}

export function renderDetalleError() {
    const contenedor = document.getElementById("detalle-contenido");
    contenedor.innerHTML = "<p>Error al cargar el post.</p>";
}

export function renderizarFormularioCrear() {
    const contenedor = document.getElementById("crear-contenido");

    contenedor.innerHTML = `
        <h1>¡Bienvenido!</h1>
        <p>Comparte tu post :)</p>

        <div class="form-inner">
            <div>
                <label for="input-titulo">Título</label>
                <input id="input-titulo" type="text" placeholder="Escribe un título para tu post :p" />
                <span id="error-titulo"></span>
            </div>

            <div>
                <label for="input-autor">Nombre del autor</label>
                <input id="input-autor" type="text" placeholder="Escribe tu nombre o apodo" />
                <span id="error-autor"></span>
            </div>

            <div>
                <label for="input-contenido">Contenido</label>
                <textarea id="input-contenido" placeholder="¡Cuéntanos que piensas! Recuerda agregar más de 20 caracteres"></textarea>
                <span id="error-contenido"></span>
            </div>

            <button id="btn-guardar">Guardar</button>
        </div>

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

        <div>
            <label for="edit-titulo">Título</label>
            <input id="edit-titulo" type="text" value="${post.title}" />
            <span id="edit-error-titulo"></span>
        </div>

        <div>
            <label for="edit-autor">Nombre del autor</label>
            <input id="edit-autor" type="text" value="${autor.firstName} ${autor.lastName}" />
            <span id="edit-error-autor"></span>
        </div>

        <div>
            <label for="edit-contenido">Contenido</label>
            <textarea id="edit-contenido">${post.body}</textarea>
            <span id="edit-error-contenido"></span>
        </div>

        <div class="editar-acciones">
            <button id="btn-guardar-editar">Guardar</button>
            <button id="btn-cancelar-editar">Cancelar</button>
        </div>
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
 
    // Función auxiliar para crear botón de número
    const crearBtnNumero = (num) => {
        const btn = document.createElement("button");
        btn.textContent = num;
        btn.dataset.pagina = num;
        if (num === paginaActual) btn.disabled = true;
        return btn;
    };
 
    // Función auxiliar para crear "..."
    const crearEllipsis = () => {
        const span = document.createElement("button");
        span.textContent = "…";
        span.classList.add("pag-ellipsis");
        span.disabled = true;
        return span;
    };
 
    // Botón anterior
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "‹";
    btnAnterior.dataset.pagina = "anterior";
    btnAnterior.classList.add("pag-arrow");
    btnAnterior.disabled = paginaActual === 1;
    contenedor.appendChild(btnAnterior);
 
    // Calcular qué números mostrar
    // Siempre mostramos: primera, última, y las 3 alrededor de la actual
    const paginas = new Set();
    paginas.add(1);
    paginas.add(totalPaginas);
    for (let i = Math.max(1, paginaActual - 1); i <= Math.min(totalPaginas, paginaActual + 1); i++) {
        paginas.add(i);
    }
 
    const paginasOrdenadas = [...paginas].sort((a, b) => a - b);
 
    let anterior = 0;
    paginasOrdenadas.forEach(num => {
        // Si hay un salto de más de 1, agregar "..."
        if (num - anterior > 1) {
            contenedor.appendChild(crearEllipsis());
        }
        contenedor.appendChild(crearBtnNumero(num));
        anterior = num;
    });

    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "›";
    btnSiguiente.dataset.pagina = "siguiente";
    btnSiguiente.classList.add("pag-arrow");
    btnSiguiente.disabled = paginaActual === totalPaginas;
    contenedor.appendChild(btnSiguiente);
}

export function agregarPostAlInicio(post) {
    const lista = document.getElementById("lista");
    const li = document.createElement("li");
    li.dataset.postId = post.id;
    li.textContent = post.title;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
        import("./router.js").then(router => {
            router.navegarADetalle(post.id);
        });
    });
    lista.insertBefore(li, lista.firstChild);
}

export function actualizarPostEnLista(postFinal, autorActualizado) {
    const li = document.querySelector(`[data-post-id="${postFinal.id}"]`);
    if (!li) return;
 
    const descripcion = postFinal.body
        ? postFinal.body.slice(0, 80) + (postFinal.body.length > 80 ? "…" : "")
        : "";
 
    const nombreAutor = autorActualizado.firstName
        ? `${autorActualizado.firstName} ${autorActualizado.lastName ?? ""}`.trim()
        : (postFinal.autor ?? "Autor");
 
    const favBtn = li.querySelector(".post-card-fav");
    const activo = favBtn ? favBtn.dataset.activo : "false";
    const starIcon = activo === "true" ? "★" : "☆";
 
    li.innerHTML = `
        <button class="post-card-fav" data-favorito-id="${postFinal.id}" data-activo="${activo}" title="Favorito">
            ${starIcon}
        </button>
        <p class="post-card-title">${postFinal.title}</p>
        <p class="post-card-autor">${nombreAutor}</p>
        <p class="post-card-desc">${descripcion}</p>
        <button class="post-card-btn">Detalles</button>
    `;
 
    li.addEventListener("click", (e) => {
        if (e.target.closest(".post-card-fav")) return;
        import("./router.js").then(router => {
            router.navegarADetalleConDatos(postFinal, autorActualizado);
        });
    });
 
    li.querySelector(".post-card-fav").addEventListener("click", (e) => {
        e.stopPropagation();
        import("./home.js").then(home => {
            home.manejarToggleFavorito(postFinal.id);
            const btn = e.currentTarget;
            const ahora = btn.dataset.activo === "true";
            btn.dataset.activo = ahora ? "false" : "true";
            btn.textContent = ahora ? "☆" : "★";
        });
    });
}

export function eliminarPostDeLista(postId) {
    const li = document.querySelector(`[data-post-id="${postId}"]`);
    if (li) li.remove();
}