import { cargarDetalle } from "./detail.js";
import { configurarFormularioCrear, configurarFormularioEditar } from "./forms.js";
import { renderizarDetalle, renderizarFormularioCrear, renderizarFormularioEditar } from "./ui.js";

export function navegarADetalle(id) {
    mostrarSolo("vista-detalle");
    cargarDetalle(id);
}

export function navegarALista() {
    mostrarSolo("vista-lista");
}

export function navegarACrear() {
    mostrarSolo("vista-crear");
    renderizarFormularioCrear();
    configurarFormularioCrear();
}

export function navegarADetalleConDatos(post, autor) {
    mostrarSolo("vista-detalle");
    renderizarDetalle(post, autor);
}

export function navegarAEditar(post, autor) {
    mostrarSolo("vista-editar");
    renderizarFormularioEditar(post, autor);
    configurarFormularioEditar(post, autor);
}

function mostrarSolo(vistaId) {
    ["vista-lista", "vista-detalle", "vista-crear", "vista-editar"].forEach(id => {
        document.getElementById(id).style.display = id === vistaId ? "block" : "none";
    });
}