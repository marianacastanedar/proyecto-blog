export function renderizarPosts(posts) {
    const lista = document.getElementById("lista");

    lista.innerHTML = "";

    posts.forEach(post => {
        const li = document.createElement("li");
        li.textContent = post.title;

        lista.appendChild(li);
    });
}

//spinner básico
export function renderLoading() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "<li>Cargando...</li>";
}

