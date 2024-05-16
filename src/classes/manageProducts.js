import Product from './product.js';

class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem("products")) || [];
    }

    saveProducts() {
        localStorage.setItem("products", JSON.stringify(this.products));
    }

    addProduct(id, descrip, preci, stock) {
        const newProduct = new Product(id, descrip, preci, stock);
        this.products.push(newProduct);
        this.saveProducts();
        this.renderProducts();
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.__id === id);
        if (index === -1) {
            alert("Producto no encontrado");
            return;
        }
        this.products.splice(index, 1);
        this.saveProducts();
        this.renderProducts();
    }

    editProduct(id) {
        const productToEdit = this.products.find(product => product.__id === id);
        if (!productToEdit) {
            alert("Producto no encontrado");
            return;
        }

        // Show the modal and populate the form fields with the product data
        document.getElementById('editSerial').value = productToEdit.__id;
        document.getElementById('editDescription').value = productToEdit.descrip;
        document.getElementById('editPrice').value = productToEdit.preci;
        document.getElementById('editStock').value = productToEdit.__stock;

        $('#editProductModal').modal('show');

        const editForm = document.getElementById('editProductForm');

        // Define the submit event handler for the edit form
        const handleEditSubmit = (event) => {
            event.preventDefault();
            const editedProduct = {
                __id: document.getElementById('editSerial').value,
                descrip: document.getElementById('editDescription').value,
                preci: parseFloat(document.getElementById('editPrice').value),
                __stock: parseInt(document.getElementById('editStock').value)
            };

            const index = this.products.findIndex(product => product.__id === id);
            if (index === -1) {
                alert("Producto no encontrado");
                return;
            }

            // Update the product in the products array
            this.products[index] = editedProduct;
            this.saveProducts();

            $('#editProductModal').modal('hide');
            this.renderProducts();

            // Remove the submit event listener after handling it once
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



