function buscarFormula() {
    const codigo = document.getElementById("codigoConsulta").value.trim();
    const data = localStorage.getItem("formula_" + codigo);

    const resultado = document.getElementById("resultado");

    if (!codigo) {
        resultado.innerHTML = "<p>Ingresa un código válido.</p>";
        return;
    }

    if (!data) {
        resultado.innerHTML = "<p>No se encontró la fórmula.</p>";
        return;
    }

    const formula = JSON.parse(data);
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    let html = `<h3><i class="bi bi-bag-heart"></i> Productos recomendados</h3>`;
    html += `<div class="contenedor-productos">`;

    formula.productos.forEach(id => {
        const prod = productos.find(p => p.id == id);
        if (prod) {

            html += `
            <div class="producto">
                <img class="producto-imagen" src="${prod.imagen}" alt="${prod.titulo}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${prod.titulo}</h3>
                </div>
            </div>`;
        }
    });

    html += `</div>`;

    html += `
        <h3 style="margin-top:25px;"><i class="bi bi-chat-square-text"></i> Comentarios del dermatólogo</h3>
        <p class="comentarios-box">${formula.comentarios || "Sin comentarios."}</p>

        <button onclick="enviarFormulaAlCarrito('${codigo}')" 
                class="boton-carrito" 
                style="margin-top:20px; display:inline-block;">
            <i class="bi bi-cart-fill"></i> Enviar al carrito
        </button>
    `;

    resultado.innerHTML = html;
}

/* ============================================================
   AGREGAR AL CARRITO LOS PRODUCTOS DE LA FORMULA
   ============================================================ */
function enviarFormulaAlCarrito(codigo) {

    const data = localStorage.getItem("formula_" + codigo);
    if (!data) return;

    const formula = JSON.parse(data);
    const productosCatalogo = JSON.parse(localStorage.getItem("productos")) || [];

    // Carrito actual
    let carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    formula.productos.forEach(id => {
        const prod = productosCatalogo.find(p => p.id == id);
        if (!prod) return;

        // Verificar si ya existe en el carrito
        const existe = carrito.find(p => p.id == prod.id);

        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({
                id: prod.id,
                titulo: prod.titulo,
                precio: prod.precio,
                imagen: prod.imagen,
                cantidad: 1
            });
        }
    });

    // Guardar carrito actualizado
    localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));

    // Redirigir
    window.location.href = "Carrito.html";
}

