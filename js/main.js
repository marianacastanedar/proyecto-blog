import { getPosts } from "./api.js";
import { renderizarPosts } from "./ui.js";

async function init() {
  const posts = await getPosts();
  renderizarPosts(posts);
}

init(); // init es la función que inicia el código
