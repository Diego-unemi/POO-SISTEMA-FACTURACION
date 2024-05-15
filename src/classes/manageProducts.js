import Product from './product.js';

class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem("products")) || [];
    }

    saveProducts() {
        localStorage.setItem("products", JSON.stringify(this.products));
    }

    addProduct(id, descrip, preci, stock) {
        this.products.push(new Product(id, descrip, preci, stock));
        this.saveProducts();
        this.renderProducts();
    }

    deleteProduct(id) {
        this.products = this.products.filter(product => product.__id !== id);
        this.saveProducts();
        this.renderProducts();
    }

    editProduct(id) {
        const productToEdit = this.products.find(product => product.__id === id);
        if (!productToEdit) {
            console.error("Producto no encontrado");
            return;
        }

        document.getElementById('editSerial').value = productToEdit.__id;
        document.getElementById('editDescription').value = productToEdit.descrip;
        document.getElementById('editPrice').value = productToEdit.preci;
        document.getElementById('editStock').value = productToEdit.__stock;

        $('#editProductModal').modal('show');

        const editForm = document.getElementById('editProductForm');

        // Definir el manejador de eventos 'submit' para el formulario de edición
        const handleEditSubmit = (event) => {
            event.preventDefault();
            const editedProduct = {
                __id: document.getElementById('editSerial').value,
                descrip: document.getElementById('editDescription').value,
                preci: document.getElementById('editPrice').value,
                __stock: document.getElementById('editStock').value
            };

            const index = this.products.findIndex(product => product.__id === editedProduct.__id);
            if (index === -1) {
                console.error("Producto no encontrado");
                return;
            }

            this.products[index] = editedProduct;
            this.saveProducts();

            $('#editProductModal').modal('hide');
            this.renderProducts();

            // Remover el manejador de eventos 'submit' después de manejarlo una vez
            editForm.removeEventListener('submit', handleEditSubmit);
        };

        editForm.addEventListener('submit', handleEditSubmit);
    }

    renderProducts() {
        const productTable = document.getElementById("productTableBody");
        productTable.innerHTML = "";
        this.products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.__id}</td>
                <td>${product.descrip}</td>
                <td>${product.preci}</td>
                <td>${product.__stock}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm edit-btn">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm delete-btn">Eliminar</button>
                </td>
            `;
            row.querySelector('.edit-btn').addEventListener('click', () => this.editProduct(product.__id));
            row.querySelector('.delete-btn').addEventListener('click', () => this.deleteProduct(product.__id));
            productTable.appendChild(row);
        });
    }
}

export default ProductManager;



