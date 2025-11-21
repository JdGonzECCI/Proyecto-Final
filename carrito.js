// Obtiene los productos guardados previamente en el carrito desde localStorage
let productosEnCarrito = localStorage.getItem("productos-en-carrito");

// Convierte la cadena JSON almacenada en localStorage a un arreglo usable
productosEnCarrito = JSON.parse(productosEnCarrito);

// ============================================================
//  REFERENCIAR A LOS ELEMENTOS DEL DOM
// ============================================================

// Se referencia el mensaje de carrito vacío
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
// Se referencia el contenedor donde se mostrarán los productos
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
// Se referencia el contenedor de acciones del carrito
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
// Se referencia el mensaje que aparece al finalizar la compra
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");

// Se referencia todos los botones que eliminan productos
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

// Se referencia el botón para vaciar el carrito
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
// Se referencia el contenedor donde se muestra el total
const contenedorTotal = document.querySelector("#total");
// Se referencia el botón para finalizar la compra
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// ============================================================
//  FUNCIÓN PRINCIPAL: CARGAR PRODUCTOS EN EL CARRITO
// ============================================================

function cargarProductosCarrito() {

    // Se verifica si existen productos en el carrito
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        // Muestra los elementos correspondientes cuando hay productos
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        // Limpia el contenido previo del contenedor
        contenedorCarritoProductos.innerHTML = "";

        // Genera visualmente cada producto dentro del carrito
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

        // Se actualizan los botones de eliminar y el total
        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        // Cuando el carrito está vacío, se muestra el mensaje correspondiente
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// Se ejecuta la función principal al cargar la página
cargarProductosCarrito();

// ============================================================
//  ACTUALIZAR BOTONES DE ELIMINAR
// ============================================================

function actualizarBotonesEliminar() {
    // Se vuelven a seleccionar los botones generados dinámicamente
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    // Se asigna el evento de eliminación a cada botón
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// ============================================================
//  ELIMINAR UN PRODUCTO DEL CARRITO
// ============================================================

function eliminarDelCarrito(e) {

    // Muestra una notificación tipo toast al eliminar un producto
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

    // Obtiene el id del botón presionado
    const idBoton = e.currentTarget.id;

    // Busca el índice del producto dentro del array
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    // Elimina el producto del arreglo
    productosEnCarrito.splice(index, 1);

    // Recarga el carrito en la interfaz
    cargarProductosCarrito();

    // Guarda los cambios actualizados en localStorage
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// ============================================================
//  VACIAR CARRITO COMPLETO
// ============================================================

// Agrega el evento al botón de vaciar carrito
botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {

    // Muestra un mensaje de confirmación para evitar borrados accidentales
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {

            // Se vacía el arreglo completamente
            productosEnCarrito.length = 0;

            // Se actualiza el localStorage con el carrito vacío
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Se recarga el contenido visual del carrito
            cargarProductosCarrito();
        }
    });
}

// ============================================================
//  CALCULAR TOTAL A PAGAR
// ============================================================

function actualizarTotal() {
    // Calcula el total sumando precio * cantidad de cada producto
    const totalCalculado = productosEnCarrito.reduce(
        (acc, producto) => acc + (producto.precio * producto.cantidad), 0
    );

    // Muestra el total en la interfaz
    total.innerText = `$${totalCalculado}`;
}

// ============================================================
//  FINALIZAR COMPRA
// ============================================================

// Evento del botón "Comprar ahora"
botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {

    // Vacía por completo el arreglo del carrito
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Cambia la interfaz mostrando el mensaje final de compra
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}
