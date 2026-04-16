export function renderizarPosts(posts) {
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
        <button id="btn-regresar">Regresar</button>
    `;

    document.getElementById("btn-regresar").addEventListener("click", () => {
        import("./router.js").then(router => {
            router.navegarALista();
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