document.addEventListener('DOMContentLoaded', function () {
    // Manejo de las SECTION del DOM --- no tocar
    const lastSectionId = localStorage.getItem('lastSectionId');
    showSection(lastSectionId || 'containerClientes');

    function showSection(sectionId) {
        document.querySelectorAll('main section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
        localStorage.setItem('lastSectionId', sectionId);
    }

    document.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', function () {
            const sectionId = this.getAttribute('data-section-id');
            showSection(sectionId);
        });
    });

    const btnSaveClient = document.getElementById("btnSaveClient");
    btnSaveClient.addEventListener('click', (event) => {
        event.preventDefault();
        dataCliente();
    });

    // funcion guardar cliente
    function dataCliente() {
        const dniClient = document.getElementById("dniClient").value;
        const dateUserName_Last = document.getElementById("dateUserName-Last").value;
        const gmailUser = document.getElementById("gmailUser").value;
        const descountUser = parseFloat(document.getElementById("descountUser").value);

        if (dniClient && dateUserName_Last && gmailUser) {
            if (isNaN(descountUser) || descountUser !== 0.10) {
                alert("Descuento no autorizado.");
                return;
            }
            let dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
            dataCliente.push({
                KEY_dniClient: dniClient,
                KEY_dateUserName_Last: dateUserName_Last,
                KEY_gmailUser: gmailUser,
                KEY_descountUser: descountUser,
            });
            localStorage.setItem('KEY_dataCliente', JSON.stringify(dataCliente));
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
            "dateUserName-Last",
            "gmailUser",
            "descountUser",
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
            row.innerHTML = `
                <td>${client.KEY_dniClient}</td>
                <td>${client.KEY_dateUserName_Last}</td>
                <td>${client.KEY_gmailUser}</td>
                <td>${client.KEY_descountUser}</td>
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

        document.getElementById('editDniClient').value = clientToEdit.KEY_dniClient;
        document.getElementById('editDateUserName-Last').value = clientToEdit.KEY_dateUserName_Last;
        document.getElementById('editGmailUser').value = clientToEdit.KEY_gmailUser;
        document.getElementById('editDescountUser').value = clientToEdit.KEY_descountUser;

        // Bloquear el input de descuento
        document.getElementById('editDescountUser').setAttribute('disabled', 'disabled');

        // Mostrar el modal
        document.getElementById('editClientModal').classList.add('show');
        document.getElementById('editClientModal').style.display = 'block';
        document.getElementById('editClientModal').setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Capturar el evento submit del formulario
        document.getElementById('editClientForm').addEventListener('submit', function (event) {
            event.preventDefault();

            // Obtener los nuevos valores del formulario
            const editedClient = {
                KEY_dniClient: document.getElementById('editDniClient').value,
                KEY_dateUserName_Last: document.getElementById('editDateUserName-Last').value,
                KEY_gmailUser: document.getElementById('editGmailUser').value,
                KEY_descountUser: parseFloat(document.getElementById('editDescountUser').value)
            };

            // Actualizar los datos del cliente en el array y en el localStorage
            dataCliente[index] = editedClient;
            localStorage.setItem('KEY_dataCliente', JSON.stringify(dataCliente));

            // Ocultar el modal
            document.getElementById('editClientModal').classList.remove('show');
            document.getElementById('editClientModal').style.display = 'none';
            document.getElementById('editClientModal').setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');

            // Volver a mostrar la tabla actualizada
            displayClients();

        });
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

    displayClients();
});
