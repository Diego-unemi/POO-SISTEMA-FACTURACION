// clientes.js

class Client {
    constructor(first_name = "Consumidor", last_name = "Final", dni = "9999999999") {
        this.first_name = first_name;
        this.last_name = last_name;
        this._dni = dni;
    }

    get dni() {
        return this._dni;
    }

    set dni(value) {
        if (value.length === 10 || value.length === 13) {
            this._dni = value;
        } else {
            this._dni = "9999999999";
        }
    }
}

class RegularClient extends Client {
    constructor(first_name = "Cliente", last_name = "Final", dni = "9999999999", card = false) {
        super(first_name, last_name, dni);
        this._discount = card ? 0.10 : 0;
    }

    get discount() {
        return this._discount;
    }

    toString() {
        return `Cliente: ${this.first_name} ${this.last_name} Descuento: ${this.discount}`;
    }
}



class VipClient extends Client {
    constructor(first_name = "Consumidor", last_name = "Final", dni = "9999999999") {
        super(first_name, last_name, dni);
        this._limit = 10000;
    }

    get limit() {
        return this._limit;
    }

    set limit(value) {
        this._limit = (value < 10000 || value > 20000) ? 10000 : value;
    }

    toString() {
        return `Cliente: ${this.first_name} ${this.last_name} Cupo: ${this.limit}`;
    }
}





    const btnSaveClient = document.getElementById("btnSaveClient");
    btnSaveClient.addEventListener('click', (event) => {
        event.preventDefault();
        dataCliente();
    });

    function dataCliente() {
        const dni = document.getElementById("dniClient").value;
        const first_name = document.getElementById("datUserName").value;
        const last_name = document.getElementById("datUserLastname").value;
        const limit = parseFloat(document.getElementById("vipCredito").value);
        const type = document.getElementById("Reg_Vip").value.toLowerCase().trim();

        if (dni && first_name && last_name) {
            if (type === 'regular') {
                
                const regularClient = new RegularClient(first_name, last_name, dni, true);

                const clientData = {
                    KEY_dni: regularClient.dni,
                    KEY_first_name: regularClient.first_name,
                    KEY_last_name: regularClient.last_name,
                    KEY_discount: regularClient.discount,
                };

                let dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
                dataCliente.push(clientData);
                localStorage.setItem('KEY_dataCliente', JSON.stringify(dataCliente));

            } else if (type === 'vip' && !isNaN(limit)) { 
              
                if (limit < 10000 || limit > 20000) {
                    alert("El límite de crédito debe estar entre $10,000 y $20,000.");
                    return;
                }

                const vipClient = new VipClient(first_name, last_name, dni);
                vipClient.limit = limit;

                const clientData = {
                    KEY_dni: vipClient.dni,
                    KEY_first_name: vipClient.first_name,
                    KEY_last_name: vipClient.last_name,
                    KEY_limit: vipClient.limit,
                };

                let dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
                dataCliente.push(clientData);
                localStorage.setItem('KEY_dataCliente', JSON.stringify(dataCliente));

            } else {
                alert("Por favor, ingrese 'vip' o 'regular' para el tipo de cliente y un límite de crédito válido.");
                return;
            }

            formReset();
            displayClients();

        } else {
            alert("Por favor, complete todos los campos correctamente.");
        }
    }

    //funcion limpiar form
    function formReset() {
        const inputsToClear = [
            "dniClient",
            "datUserName",
            "datUserLastname",
            "regDiscount",
            "Reg_Vip",
            "vipCredito",
        ];
        inputsToClear.forEach(inputId => {
            document.getElementById(inputId).value = "";
        });
    }

    // funcion se encarga de mostrar a los clientes en la tabla
    function displayClients() {
        const clientTableBody = document.getElementById("clientTableBody");
        clientTableBody.innerHTML = ''; // Limpiar la tabla antes de mostrar los nuevos datos
        const dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
        dataCliente.forEach((client, index) => {

            const row = document.createElement("tr");
            let limitCell = '';
            let discountCell = '';

            // Validar si es cliente VIP o Regular y asignar el valor a la celda correspondiente
            if (client.KEY_limit) {
                limitCell = `<td>${client.KEY_limit} VIP</td>`;
            } else if (client.KEY_discount) {
                discountCell = `<td>${client.KEY_discount} Regular</td>`;
            }

            row.innerHTML = `
                <td>${client.KEY_dni}</td>
                <td>${client.KEY_first_name}</td>
                <td>${client.KEY_last_name}</td>
                ${limitCell}
                ${discountCell}
                <td>
                    <button type="button" class="btn btn-primary btn-sm edit-btn">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm delete-btn">Eliminar</button>
                </td>
            `;
            clientTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach((button, index) => {
            button.addEventListener('click', () => editClient(index));
        });

        document.querySelectorAll('.delete-btn').forEach((button, index) => {
            button.addEventListener('click', () => deleteClient(index));
        });
    }

    // funcion para editar los datos del cliente
    function editClient(index) {
        const dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
        const clientToEdit = dataCliente[index];

        // Llenar los campos comunes del formulario
        document.getElementById('editDni').value = clientToEdit.KEY_dni;
        document.getElementById('editDateUserName').value = clientToEdit.KEY_first_name;
        document.getElementById('editDateUserLastname').value = clientToEdit.KEY_last_name;

        // Mostrar el modal
        $('#editClientModal').modal('show');

        // Capturar el evento submit del formulario
        document.getElementById('editClientForm').addEventListener('submit', function (event) {
            event.preventDefault();

            // Obtener los nuevos valores del formulario
            const editedClient = {
                KEY_dni: document.getElementById('editDni').value,
                KEY_first_name: document.getElementById('editDateUserName').value,
                KEY_last_name: document.getElementById('editDateUserLastname').value
            };

            if (clientToEdit.KEY_limit !== undefined) { 
                const newLimit = parseFloat(document.getElementById('vipCredito').value);
      
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

    // cierra el modal al dar click en la X
    const closeMolarX = document.getElementById("closeMolarX");
    const editClientModal = document.getElementById("editClientModal");

    closeMolarX.addEventListener("click", function (e) {
        e.preventDefault();
        editClientModal.style.display = "none";
    })


    // Agrega un evento click al botón "VIP"
    document.getElementById("btnShowVip").addEventListener("click", function () {
        const dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
        showClients(dataCliente, 'vip');
    });

    // Agrega un evento click al botón "Regular Cliente"
    document.getElementById("btnShowRegular").addEventListener("click", function () {
        const dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
        showClients(dataCliente, 'regular');
    });

    // Función para mostrar clientes según el tipo
    function showClients(dataCliente, type) {
        const clientTableBody = document.getElementById("clientTableBody");
        clientTableBody.innerHTML = ''; // Limpiar la tabla antes de mostrar los nuevos datos

        dataCliente.forEach(client => {
            // Verificar el tipo de cliente y si coincide con el tipo deseado
            if ((type === 'vip' && client.KEY_limit) || (type === 'regular' && client.KEY_discount)) {
                const row = document.createElement("tr");
                let limitCell = '';
                let discountCell = '';

                if (client.KEY_limit) {
                    limitCell = `<td>${client.KEY_limit} VIP</td>`;
                } else if (client.KEY_discount) {
                    discountCell = `<td>${client.KEY_discount} Regular</td>`;
                }

                row.innerHTML = `
                <td>${client.KEY_dni}</td>
                <td>${client.KEY_first_name}</td>
                <td>${client.KEY_last_name}</td>
                ${limitCell}
                ${discountCell}
                <td>
                    <button type="button" class="btn btn-primary btn-sm edit-btn">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm delete-btn">Eliminar</button>
                </td>
            `;
                clientTableBody.appendChild(row);
            }
        });

        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.edit-btn').forEach((button, index) => {
            button.addEventListener('click', () => editClient(index));
        });

        document.querySelectorAll('.delete-btn').forEach((button, index) => {
            button.addEventListener('click', () => deleteClient(index));
        });
    }


   const findClientsTxt = document.getElementById("findClientsTxt");

   findClientsTxt.addEventListener("input", function() {
       buscar(); 
   });

   // Función para buscar clientes por su número de cédula
   function buscar() {
       const searchTerm = findClientsTxt.value.trim().toLowerCase();
       const clientRows = document.querySelectorAll("#clientTableBody tr");
       let found = false;

       // Recorremos las filas de la tabla para buscar el término de búsqueda en el DNI
       clientRows.forEach((row) => {
           const dniCell = row.querySelector("td:first-child").textContent.toLowerCase();

           // Verificar si el término de búsqueda coincide con el DNI de la fila actual
           if (dniCell.includes(searchTerm)) {
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
           clientRows.forEach((row) => {
               row.style.display = ""; // Mostrar todas las filas
           });
       }

       // Si no se encuentra ningún cliente con el DNI especificado, mostrar un mensaje
       if (!found && searchTerm !== "") {
           alert("No se encontró ningún cliente con ese número de cédula.");
       }
   }

    displayClients();

