
// Obtenet los productos guardados en el carrito
let productosEnCarrito = localStorage.getItem("productos-en-carrito");

// Convertit el JSON almacenado a un array usable
productosEnCarrito = JSON.parse(productosEnCarrito);

// ============================================================
//  REFERENCIAR A LOS ELEMENTOS DEL DOM
// ============================================================

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");

let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// ============================================================
//  FUNCIÓN PRINCIPAL: CARGAR PRODUCTOS EN EL CARRITO
// ============================================================

function cargarProductosCarrito() {

    // Condicion si hay productos en el carrito
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        // Mostrar contenedores correctos
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        // Limpiar contenido previo
        contenedorCarritoProductos.innerHTML = "";

        // Crear visualmente cada producto
        productosEnCarrito.forEach(producto => {

            const div = document.createElement("div");
            div.classList.add("carrito-producto");

            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}">
                    <i class="bi bi-trash-fill"></i>
                </button>
            `;

            contenedorCarritoProductos.append(div);
        });

        // Actualizar botones y total cada vez que se recarga el carrito
        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        // condicion si no hay productos: mostrar mensaje vacío
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

// Llamar la función al cargar la página
cargarProductosCarrito();

// ============================================================
//  ACTUALIZAR BOTONES DE ELIMINAR
// ============================================================

function actualizarBotonesEliminar() {
    // Selecciona nuevamente los botones ya generados en el DOM
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    // Asigna evento a cada botón
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// ============================================================
//  ELIMINAR UN PRODUCTO DEL CARRITO
// ============================================================

function eliminarDelCarrito(e) {

    // Notificación tipo toast
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        }
    }).showToast();

    const idBoton = e.currentTarget.id;

    // Buscar el id del objeto a eliminar
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    // Eliminar elemento del array
    productosEnCarrito.splice(index, 1);

    // Recargar carrito
    cargarProductosCarrito();

    // Guardar cambios
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// ============================================================
//  VACIAR CARRITO COMPLETO
// ============================================================

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {

            // Vaciar completamente el array
            productosEnCarrito.length = 0;

            // Guardar carrito vacío
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Recargar UI
            cargarProductosCarrito();
        }
    });
}

// ============================================================
//  CALCULAR TOTAL A PAGAR
// ============================================================

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce(
        (acc, producto) => acc + (producto.precio * producto.cantidad), 0
    );

    total.innerText = `$${totalCalculado}`;
}

// ============================================================
//  FINALIZAR COMPRA
// ============================================================

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {

    // Vaciar carrito completamente
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Mostrar mensaje de compra
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}
