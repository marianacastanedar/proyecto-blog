export function validarFormularioCrear() {
    let esValido = true;

    const titulo = document.getElementById("input-titulo").value.trim();
    const autor = document.getElementById("input-autor").value.trim();
    const contenido = document.getElementById("input-contenido").value.trim();

    limpiarErrores();

    if (titulo.length < 5) {
        mostrarError("error-titulo", "El título debe tener mínimo 5 caracteres");
        esValido = false;
    }

    if (autor.length === 0) {
        mostrarError("error-autor", "El nombre del autor es obligatorio");
        esValido = false;
    }

    if (contenido.length < 20) {
        mostrarError("error-contenido", "El contenido debe tener mínimo 20 caracteres");
        esValido = false;
    }

    return esValido;
}

function mostrarError(idElemento, mensaje) {
    const el = document.getElementById(idElemento);
    if (el) el.textContent = mensaje;
}

function limpiarErrores() {
    ["error-titulo", "error-autor", "error-contenido"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });
}