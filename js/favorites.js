import { state, esFavorito, toggleFavorito, getFavoritos, getTotalPaginasFavoritos } from "./state.js";
import { renderizarPosts, renderPaginacion, mostrarToast } from "./ui.js";

const POSTS_POR_PAGINA = 10;

export function cargarVistaFavoritos() {
    renderizarFavoritos();
    inicializarEventosFavoritos();
}

function renderizarFavoritos() {
    const todos = getFavoritos();
    const totalPaginas = getTotalPaginasFavoritos(POSTS_POR_PAGINA);

    if (state.paginaFavoritos > totalPaginas && totalPaginas > 0) {
        state.paginaFavoritos = 1;
    }

    const inicio = (state.paginaFavoritos - 1) * POSTS_POR_PAGINA;
    const pagina = todos.slice(inicio, inicio + POSTS_POR_PAGINA);

    const lista = document.getElementById("lista-favoritos");
    const vacio = document.getElementById("favoritos-vacio");
    const contenedorPag = document.getElementById("contenedor-paginacion-favoritos");

    if (todos.length === 0) {
        lista.innerHTML = "";
        vacio.style.display = "block";
        contenedorPag.innerHTML = "";
        return;
    }

    vacio.style.display = "none";

    renderizarPostsEnLista(pagina, lista);
    renderPaginacionFavoritos(state.paginaFavoritos, totalPaginas, contenedorPag);
}


function renderizarPostsEnContenedor(posts, lista) {
    lista.innerHTML = "";

    posts.forEach(post => {
        const li = document.createElement("li");
        li.dataset.postId = post.id;
        li.classList.add("post-card");

        const descripcion = post.body
            ? post.body.slice(0, 80) + (post.body.length > 80 ? "…" : "")
            : "";

        li.innerHTML = `
            <button class="post-card-fav" data-favorito-id="${post.id}" data-activo="true" title="Quitar de favoritos">
                ★
            </button>
            <p class="post-card-title">${post.title}</p>
            <p class="post-card-autor">${post.autor ?? "Autor"}</p>
            <p class="post-card-desc">${descripcion}</p>
            <button class="post-card-btn">Detalles</button>
        `;

        li.addEventListener("click", (e) => {
            if (e.target.closest(".post-card-fav")) return;
            import("./router.js").then(router => {
                router.navegarADetalle(post.id);
            });
        });

        li.querySelector(".post-card-fav").addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorito(post);
            mostrarToast("Post quitado de favoritos.");

            sincronizarEstrellaEnHome(post.id, false);

            renderizarFavoritos();
        });

        lista.appendChild(li);
    });
}

function renderPaginacionEnContenedor(paginaActual, totalPaginas, contenedor) {
    contenedor.innerHTML = "";
    if (totalPaginas <= 1) return;
 
    const crearBtnNumero = (num) => {
        const btn = document.createElement("button");
        btn.textContent = num;
        btn.dataset.pagina = num;
        if (num === paginaActual) btn.disabled = true;
        return btn;
    };
 
    const crearEllipsis = () => {
        const btn = document.createElement("button");
        btn.textContent = "…";
        btn.classList.add("pag-ellipsis");
        btn.disabled = true;
        return btn;
    };
 
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "‹";
    btnAnterior.dataset.pagina = "anterior";
    btnAnterior.classList.add("pag-arrow");
    btnAnterior.disabled = paginaActual === 1;
    contenedor.appendChild(btnAnterior);
 
    const paginas = new Set([1, totalPaginas]);
    for (let i = Math.max(1, paginaActual - 1); i <= Math.min(totalPaginas, paginaActual + 1); i++) {
        paginas.add(i);
    }
 
    let anterior = 0;
    [...paginas].sort((a, b) => a - b).forEach(num => {
        if (num - anterior > 1) contenedor.appendChild(crearEllipsis());
        contenedor.appendChild(crearBtnNumero(num));
        anterior = num;
    });
 
    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "›";
    btnSiguiente.dataset.pagina = "siguiente";
    btnSiguiente.classList.add("pag-arrow");
    btnSiguiente.disabled = paginaActual === totalPaginas;
    contenedor.appendChild(btnSiguiente);;
}

function inicializarEventosFavoritos() {
    const contenedor = document.getElementById("contenedor-paginacion-favoritos");

    const nuevo = contenedor.cloneNode(true);
    contenedor.parentNode.replaceChild(nuevo, contenedor);

    nuevo.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-pagina]");
        if (!btn) return;

        const pagina = btn.dataset.pagina;
        const total = getTotalPaginasFavoritos(POSTS_POR_PAGINA);

        if (pagina === "anterior" && state.paginaFavoritos > 1) {
            state.paginaFavoritos--;
        } else if (pagina === "siguiente" && state.paginaFavoritos < total) {
            state.paginaFavoritos++;
        } else if (pagina !== "anterior" && pagina !== "siguiente") {
            state.paginaFavoritos = parseInt(pagina);
        }

        renderizarFavoritos();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("btn-regresar-favoritos")
        .addEventListener("click", () => {
            import("./router.js").then(router => router.navegarALista());
        });
}

export function sincronizarEstrellaEnHome(postId, esFav) {
    const cardHome = document.querySelector(`#lista [data-post-id="${postId}"] .post-card-fav`);
    if (!cardHome) return;
    cardHome.dataset.activo = esFav ? "true" : "false";
    cardHome.textContent = esFav ? "★" : "☆";
}
