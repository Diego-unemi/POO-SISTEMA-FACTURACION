import ProductManager from '/src/classes/manageProducts.js';

// Define la variable productManager en el ámbito global
const productManager = new ProductManager();

document.addEventListener("DOMContentLoaded", function() {
    const productForm = document.getElementById("productForm");

    productForm.addEventListener("submit", function(event) {
        event.preventDefault();
        let id = parseInt(document.getElementById("productId").value);
        let descrip = document.getElementById("productDescrip").value;
        let preci = parseInt(document.getElementById("productPrice").value);
        let stock = parseInt(document.getElementById("productStock").value);
        
        productManager.addProduct(id, descrip, preci, stock);
        document.getElementById("productForm").reset();
    });
    formReset();
    productManager.renderProducts();

});

   //funcion limpiar form
   function formReset() {
    const inputsToClear = [
        "productId",
        "productDescrip",
        "productPrice",
        "productStock",
    ];
    inputsToClear.forEach(inputId => {
        document.getElementById(inputId).value = "";
    });
}
 // cierra el modal al dar click en la X
 const closeMolarX = document.getElementById("closeMolarX");
 const editClientModal = document.getElementById("editClientModal");

 closeMolarX.addEventListener("click", function (e) {
     e.preventDefault();
     editClientModal.style.display = "none";
 })

// Seleccionar el campo de búsqueda y el botón de búsqueda
const findProductsNum = document.getElementById("findProductsNum");
const btnFindProducts = document.getElementById("btnFindProducts");

// Agregar un evento click al botón de búsqueda
btnFindProducts.addEventListener("click", function (e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del botón
    buscar(); // Llamar a la función buscar()
});

// Agregar un evento input al campo de búsqueda para detectar cambios en el texto
findProductsNum.addEventListener("input", function() {
    buscar(); // Llamar a la función buscar() cuando cambie el texto en el campo de búsqueda
});

// Función para buscar clientes por su número de cédula
function buscar() {
    const searchTerm = findProductsNum.value.trim().toLowerCase();
    const productRows = document.querySelectorAll("#productTableBody tr");
    let found = false;

    // Recorremos las filas de la tabla para buscar el término de búsqueda en el DNI
    productRows.forEach((row) => {
        const serialCell = row.querySelector("td:first-child").textContent.toLowerCase();

        // Verificar si el término de búsqueda coincide con el DNI de la fila actual
        if (serialCell.includes(searchTerm)) {
            found = true;
            row.scrollIntoView({ behavior: "smooth", block: "center" }); // Realizar animación de desplazamiento
            row.classList.add("highlight"); // Resaltar la fila encontrada
            setTimeout(() => {
                row.classList.remove("highlight"); // Eliminar el resaltado después de un tiempo
            }, 3000);
            row.style.display = ""; // Mostrar la fila encontrada
        } else {
            row.style.display = "none"; // Ocultar las filas que no coinciden con el término de búsqueda
        }
    });

    // Si se borra el término de búsqueda, mostrar todas las filas de la tabla
    if (searchTerm === "") {
        productRows.forEach((row) => {
            row.style.display = ""; // Mostrar todas las filas
        });
    }

    // Si no se encuentra ningún cliente con el DNI especificado, mostrar un mensaje
    if (!found && searchTerm !== "") {
        alert("No se encontró ningún cliente con ese número de cédula.");
    }
}

