import { getPosts } from "./api.js";
import { renderizarPosts, renderLoading } from "./ui.js";

async function init() {
    renderLoading();
    const posts = await getPosts();
    renderizarPosts(posts);
}

init(); // init es la función que inicia el código
