import { MethodsModular } from "src/classes/classModularMethods.js";

const methodsModularInstance = new MethodsModular();

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
        Limpiar_Inputs();
    });

    function dataCliente() {
        const dniClient = document.getElementById("dniClient").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        
        if (dni && firstName && lastName) {
            let dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
            dataCliente.push({
                KEY_dniClient: dniClient,
                KEY_firstName: firstName,
                KEY_lastName: lastName,
                KEY_descont: 0.10,
            });
            localStorage.setItem('KEY_dataCliente', JSON.stringify(dataCliente));
        }
    }

    function Limpiar_Inputs() {
        const remove_inputs = [
            "dniClient",
            "firstName",
            "lastName",
        ];
        remove_inputs.forEach((remove_inputs) => {
            document.getElementById(remove_inputs).value = ""; 
        });
    }
});

