// -----------------------------
// Seguridad: Validar código de acceso
// -----------------------------
function validarCodigoAcceso() {
    const CODIGO_REQUERIDO = "1234567";
    
    // Obtener el código de acceso del usuario
    let codigoIngresado = prompt("Por favor, introduce el código de acceso para la fórmula del dermatólogo:");

    // Bucle de validación
    while (codigoIngresado !== CODIGO_REQUERIDO) {
        // Si el usuario cancela (codigoIngresado es null) o ingresa un código incorrecto
        if (codigoIngresado === null) {
            // Redirigir a una página segura (e.g., index.html) o mostrar un mensaje de error
            alert("Acceso cancelado. Serás redirigido a la página principal.");
            window.location.href = "index.html"; 
            return false; // Bloquear la ejecución
        }

        // Si el código es incorrecto
        alert("Código incorrecto. Intenta de nuevo.");
        codigoIngresado = prompt("Por favor, introduce el código de acceso para la fórmula del dermatólogo:");
    }

    // Código correcto
    console.log("Acceso concedido.");
    return true; // Permitir la ejecución normal
}


// -----------------------------
// Helpers: obtener productos
// -----------------------------
async function obtenerProductos() {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (!productos || productos.length === 0) {
        try {
            const resp = await fetch("./productos.json");
            if (resp.ok) {
                productos = await resp.json();
                localStorage.setItem("productos", JSON.stringify(productos));
            } else {
                console.error("No se pudo cargar productos.json:", resp.status);
                productos = [];
            }
        } catch (err) {
            console.error("Error fetch productos.json:", err);
            productos = [];
        }
    }

    return productos;
}

// -----------------------------
// Renderizar productos (con imagen, sin precio)
// -----------------------------
async function cargarProductosParaFormula(categoria = "todos") {
    const productos = await obtenerProductos();

    const contenedor =
        document.getElementById("contenedorProductosFormula") ||
        document.getElementById("contenedor-productos");

    if (!contenedor) {
        console.error("No existe el contenedor para productos en fórmula.");
        return;
    }

    contenedor.innerHTML = "";

    let filtrados = productos;
    if (categoria !== "todos") {
        filtrados = productos.filter(
            p => p.categoria && p.categoria.id === categoria
        );
    }

    filtrados.forEach(prod => {
        const div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <img class="producto-imagen" src="${prod.imagen}" alt="${escapeHtml(prod.titulo)}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${escapeHtml(prod.titulo)}</h3>

                <label style="margin-top:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" class="checkbox-producto" value="${prod.id}">
                    <span style="font-size:0.95rem;">Agregar a fórmula</span>
                </label>
            </div>
        `;

        contenedor.appendChild(div);
    });
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// -----------------------------
// Filtros
// -----------------------------
function activarBotonesCategoriasFormula() {
    const botones = document.querySelectorAll(".filtro-btn, .boton-categoria-formula");

    botones.forEach(boton => {
        boton.addEventListener("click", async () => {
            botones.forEach(b => b.classList.remove("active"));
            boton.classList.add("active");

            const categoria = boton.dataset.categoria;
            await cargarProductosParaFormula(categoria);
        });
    });
}

// -----------------------------
// Guardar fórmula
// -----------------------------
function guardarFormula() {
    const seleccionados = [...document.querySelectorAll(".checkbox-producto:checked")]
        .map(chk => chk.value);

    const comentarios =
        document.getElementById("comentariosFormula")?.value ||
        document.getElementById("notasFormula")?.value ||
        "";

    if (seleccionados.length === 0) {
        alert("Debe seleccionar al menos un producto.");
        return;
    }

    const codigo = Math.floor(1000000000 + Math.random() * 9000000000);

    const formula = {
        productos: seleccionados,
        comentarios: comentarios
    };

    localStorage.setItem("formula_" + codigo, JSON.stringify(formula));

    const salida = document.getElementById("codigoGenerado") || document.getElementById("codigoFormula");
    if (salida) {
        salida.innerHTML = `Fórmula guardada. Código: <span style="color:var(--clr-main);">${codigo}</span>`;
    } else {
        alert("Fórmula guardada. Código: " + codigo);
    }
}

// -----------------------------
// Inicialización
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    // ⚠️ REGLA AÑADIDA: Validar código de acceso antes de cargar cualquier contenido
    if (!validarCodigoAcceso()) {
        return; // Detiene la ejecución si el código es incorrecto o se cancela
    }
    
    cargarProductosParaFormula("todos");
    activarBotonesCategoriasFormula();

    const form = document.getElementById("formFormula");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarFormula();
        });
    }
});



