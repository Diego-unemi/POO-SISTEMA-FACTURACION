import { Client, RegularClient, VipClient } from "../../classes/classClients.js";

const clientInst = new Client();

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("findClientsTxt").addEventListener("input", clientInst.buscar);

    // cierra el modal al dar click en la X
    document.getElementById("closeMolarX").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("editClientModal").style.display = "none";
    });

    document.getElementById("clientForm").addEventListener('submit', function (event) {
        event.preventDefault();
        dataCliente();
    });

    // guardar cliente
    function dataCliente() {
        const dni = document.getElementById("dniClient").value.trim();
        const first_name = document.getElementById("datUserName").value.trim();
        const last_name = document.getElementById("datUserLastname").value.trim();
        const limit = parseFloat(document.getElementById("vipCredito").value);
        const type = document.getElementById("Reg_Vip").value.toLowerCase().trim();

        const cedulaValidation = clientInst.validateCedula(dni);
        if (cedulaValidation !== true) return alert(cedulaValidation);

        if (!dni || !first_name || !last_name) return alert("Por favor, complete todos los campos correctamente.");

        if (type !== 'regular' && type !== 'vip') return alert("Por favor, ingrese 'vip' o 'regular' para el tipo de cliente.");

        if (type === 'vip' && (isNaN(limit) || limit < 10000 || limit > 20000)) {
            return alert("El límite de crédito debe estar entre $10,000 y $20,000 para clientes VIP.");
        }

        const client = type === 'regular' ? new RegularClient(first_name, last_name, dni, true) : new VipClient(first_name, last_name, dni);
        if (type === 'vip') client.limit = limit;

        const clientData = {
            KEY_dni: client.dni,
            KEY_first_name: client.first_name,
            KEY_last_name: client.last_name,
            KEY_discount: client instanceof RegularClient ? client.discount : undefined,
            KEY_limit: client instanceof VipClient ? client.limit : undefined,
        };

        clientInst.saveClientData(clientData);
        clientInst.formReset();
        displayClients();
    }

    // mostrar clientes en la tabla
    function displayClients() {
        const clientTableBody = document.getElementById("clientTableBody");
        clientTableBody.innerHTML = '';

        const dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];

        dataCliente.forEach(client => {
            const { KEY_dni, KEY_first_name, KEY_last_name, KEY_limit, KEY_discount } = client;

            const limitCell = KEY_limit ? `<td>${KEY_limit} VIP</td>` : '';
            const discountCell = KEY_discount ? `<td>${KEY_discount} Regular</td>` : '';

            const row = `
                <tr>
                    <td>${KEY_dni}</td>
                    <td>${KEY_first_name}</td>
                    <td>${KEY_last_name}</td>
                    ${limitCell}
                    ${discountCell}
                    <td>
                        <button type="button" class="btn btn-primary btn-sm edit-btn">Editar</button>
                        <button type="button" class="btn btn-danger btn-sm delete-btn">Eliminar</button>
                    </td>
                </tr>
            `;
            clientTableBody.insertAdjacentHTML('beforeend', row);
        });

        clientInst.attachEditButtonListeners(editClient);
        clientInst.attachDeleteButtonListeners(deleteClient);
    }

    // funcion para editar los datos del cliente
    function editClient(index) {
        const dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
        const clientToEdit = dataCliente[index];

        // Llenar los campos comunes del formulario
        document.getElementById('editDni').value = clientToEdit.KEY_dni;
        document.getElementById('editDateUserName').value = clientToEdit.KEY_first_name;
        document.getElementById('editDateUserLastname').value = clientToEdit.KEY_last_name;
        document.getElementById('editVip').value = clientToEdit.KEY_limit;


        // Mostrar el modal
        $('#editClientModal').modal('show');

        // Capturar el evento submit del formulario
        document.getElementById('editClientForm').addEventListener('submit', function (event) {
            event.preventDefault();

            // Obtener los nuevos valores del formulario
            const editedClient = {
                KEY_dni: document.getElementById('editDni').value,
                KEY_first_name: document.getElementById('editDateUserName').value,
                KEY_last_name: document.getElementById('editDateUserLastname').value,
                KEY_limit: document.getElementById('editVip').value,
            };

            if (clientToEdit.KEY_limit !== undefined) {
                const newLimit = parseFloat(document.getElementById('editVip').value);

                editedClient.KEY_limit = (isNaN(newLimit) || newLimit < 10000 || newLimit > 20000) ? 10000 : newLimit;
            } else {
                const newDiscount = parseFloat(document.getElementById('editDiscount').value);
                editedClient.KEY_discount = newDiscount;
            }

            dataCliente[index] = editedClient;
            localStorage.setItem('KEY_dataCliente', JSON.stringify(dataCliente));

            $('#editClientModal').modal('hide');

            displayClients();
        });

        if (clientToEdit.KEY_limit !== undefined) {
            document.getElementById('discountFormGroup').style.display = 'none';
            document.getElementById('vipCreditFormGroup').style.display = 'block';
            document.getElementById('vipCredito').value = clientToEdit.KEY_limit;
        } else {
            document.getElementById('vipCreditFormGroup').style.display = 'none';
            document.getElementById('discountFormGroup').style.display = 'block';
            document.getElementById('editDiscount').value = clientToEdit.KEY_discount;
        }
    }

    // funcion eliminar cliente
    function deleteClient(index) {
        let dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
        dataCliente.splice(index, 1);
        localStorage.setItem('KEY_dataCliente', JSON.stringify(dataCliente));
        displayClients();
    }

    // Agrega eventos click a los botones "VIP" y "Regular Cliente"
    ['btnShowVip', 'btnShowRegular'].forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', function () {
            showClients(JSON.parse(localStorage.getItem('KEY_dataCliente')) || [], buttonId === 'btnShowVip' ? 'vip' : 'regular');
        });
    });

    function showClients(dataCliente, type) {
        const clientTableBody = document.getElementById("clientTableBody");
        clientTableBody.innerHTML = '';

        dataCliente.forEach(client => {
            const isVip = type === 'vip' && client.KEY_limit;
            const isRegular = type === 'regular' && client.KEY_discount;

            if (isVip || isRegular) {
                const limitOrDiscount = isVip ? `${client.KEY_limit} VIP` : `${client.KEY_discount} Regular`;

                const row = document.createElement("tr");
                row.innerHTML = `
              <td>${client.KEY_dni}</td>
              <td>${client.KEY_first_name}</td>
              <td>${client.KEY_last_name}</td>
              <td>${limitOrDiscount}</td>
              <td>
                <button type="button" class="btn btn-primary btn-sm edit-btn">Editar</button>
                <button type="button" class="btn btn-danger btn-sm delete-btn">Eliminar</button>
              </td>
            `;
                clientTableBody.appendChild(row);
            }
        });

        // Corrección: Llama a los métodos de la clase Client con this
        clientInst.attachEditButtonListeners(editClient);
        clientInst.attachDeleteButtonListeners(deleteClient);
    }

    displayClients();
});
