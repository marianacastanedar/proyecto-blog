
import { cargarPaginaPrincipal, cargarTags, inicializarEventos } from "./home.js";
import { navegarACrear } from "./router.js";

async function init() {
    await cargarTags();
    await cargarPaginaPrincipal();
    inicializarEventos();
    
    document.getElementById("btn-crear")
        .addEventListener("click", () =>
            navegarACrear());

}

init(); // init es la función que inicia el código
/*
import { navegarACrear } from "./router.js";

navegarACrear();

*/
