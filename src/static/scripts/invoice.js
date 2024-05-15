document.addEventListener("DOMContentLoaded", function () {
  mostrarFechas();

  document.getElementById("cedulaInput").addEventListener("input", buscarCliente);

  document.getElementById("aggFilaDescripInvoice").addEventListener("click", agregarFila);

  document.addEventListener("input", function (event) {
    if (event.target.classList.contains("findSerialInvoice")) {
      buscarProducto(event);
    } else if (event.target.classList.contains("cantInvoice")) {
      calcularTotal();
    }
  });

  document.getElementById("config_tax_rate").addEventListener("input", calcularTotal);

  var numeroFactura = localStorage.getItem("key_NumIncremental") || "00001";
  document.getElementById("facturaIncremental").textContent = numeroFactura;

  document.getElementById("guardarFactura").addEventListener("click", guardarFactura);
});

function mostrarFechas() {
  var fechaActual = new Date();
  var fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);

  var fechaActualFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
  var fechaVencimientoFormateada = `${fechaVencimiento.getDate()}/${fechaVencimiento.getMonth() + 1}/${fechaVencimiento.getFullYear()}`;

  document.getElementById("fechaActual").textContent = fechaActualFormateada;
  document.getElementById("fechaVencimiento").textContent = fechaVencimientoFormateada;
}

function validateCedulaDecorator() {
  const cedulaValidation = clientInst.validateCedula(dni);
  if (cedulaValidation !== true) return alert(cedulaValidation);
}

function buscarCliente() {
  var cedula = this.value;
  if (cedula.length === 10) {
    var dataCliente = JSON.parse(localStorage.getItem("KEY_dataCliente"));
    if (dataCliente) {
      var clienteEncontrado = dataCliente.find(cliente => cliente.KEY_dni === cedula);
      if (clienteEncontrado) {
        document.getElementById("nombreCompleto").textContent = clienteEncontrado.KEY_first_name + " " + clienteEncontrado.KEY_last_name;
        document.getElementById("tipoCliente").textContent = clienteEncontrado.KEY_limit ? "VIP" : "Regular";
        document.getElementById("descuento").textContent = clienteEncontrado.KEY_limit ? clienteEncontrado.KEY_limit : clienteEncontrado.KEY_discount;
      } else {
        alert("NO EXISTE");
      }
    } else {
      alert("No hay datos de clientes almacenados.");
    }
  } else {
    document.getElementById("nombreCompleto").textContent = "";
    document.getElementById("tipoCliente").textContent = "";
    document.getElementById("descuento").textContent = "";
  }
}

function agregarFila() {
  var table = document.getElementById("invoiceTable").getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(-1);
  newRow.innerHTML = `
      <td><a class="control removeRow">x</a><input class="findSerialInvoice" type="text"/></td>
      <td><span class="descripInvoice"></span></td>
      <td><span class="precioInvoice"></span></td>
      <td><input class="cantInvoice" type="text"/></td>
      <td><span class="preTotalInvoice"></span></td>
    `;
}

function buscarProducto(event) {
  var serial = event.target.value;
  if (serial.length === 4) {
    var dataProduct = JSON.parse(localStorage.getItem("dataProducto"));
    if (dataProduct) {
      var product = dataProduct.find(product => product.key_serial === serial);
      if (product) {
        var row = event.target.parentNode.parentNode;
        row.getElementsByClassName("descripInvoice")[0].textContent = product.key_descrip;
        row.getElementsByClassName("precioInvoice")[0].textContent = product.key_precio;
      } else {
        alert("Producto no encontrado");
      }
    } else {
      alert("No hay datos de productos almacenados.");
    }
  } else {
    var row = event.target.parentNode.parentNode;
    row.getElementsByClassName("descripInvoice")[0].textContent = "";
    row.getElementsByClassName("precioInvoice")[0].textContent = "";
  }
}

function calcularTotal() {
  var subtotal = 0;
  var rows = document.getElementById("invoiceTable").getElementsByTagName("tbody")[0].rows;
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var price = parseFloat(row.querySelector(".precioInvoice").textContent);
    var quantity = parseFloat(row.querySelector(".cantInvoice").value);
    var total = price * quantity;
    row.querySelector(".preTotalInvoice").textContent = total.toFixed(2);
    subtotal += total;
  }

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);

  var ivaPercentage = parseFloat(document.getElementById("config_tax_rate").value);
  var totalIVA = subtotal * (ivaPercentage / 100);

  document.getElementById("IVA").textContent = totalIVA.toFixed(2);

  // Sumar subtotal y IVA para obtener el total
  var totalConIVA = subtotal + totalIVA;
  document.getElementById("totalPrice").textContent = totalConIVA.toFixed(2);
}

function guardarFactura() {
  var factura = {
    key_numInvoice: localStorage.getItem("key_NumIncremental"),
    key_dniClient: document.getElementById("cedulaInput").value,
    key_nameLast: document.getElementById("nombreCompleto").textContent,
    key_typeClient: document.getElementById("tipoCliente").textContent,
    key_discountReg: document.getElementById("descuento").textContent,
    key_subTotal: document.getElementById("subtotal").textContent,
    key_iva: document.getElementById("IVA").textContent,
    key_totalFinal: document.getElementById("totalPrice").textContent,

    key_datailsProduct: []
  };

  if (factura.key_typeClient === "VIP") {
    factura.limite = factura.key_discountReg;
    delete factura.key_discountReg;
  }

  var detalles = [];
  var filas = document.querySelectorAll("#invoiceTable tbody tr");
  filas.forEach(function (fila) {
    var detalle = {
      key_serialProduct: fila.querySelector(".findSerialInvoice").value,
      key_descrip: fila.querySelector(".descripInvoice").textContent,
      key_precio: fila.querySelector(".precioInvoice").textContent,
      key_cuantity: fila.querySelector(".cantInvoice").value,
      key_total: fila.querySelector(".preTotalInvoice").textContent
    };
    detalles.push(detalle);
  });

  factura.key_datailsProduct = detalles;

  var facturasGuardadas = JSON.parse(localStorage.getItem("key_Invoices")) || [];
  facturasGuardadas.push(factura);
  localStorage.setItem("key_Invoices", JSON.stringify(facturasGuardadas));

  incrementarNumeroFactura();

  document.getElementById("cedulaInput").value = "";
  document.getElementById("nombreCompleto").textContent = "";
  document.getElementById("tipoCliente").textContent = "";
  document.getElementById("descuento").textContent = "";
  document.getElementById("subtotal").textContent = "";
  document.getElementById("IVA").textContent = "";
  document.getElementById("totalPrice").textContent = "";

  document.querySelectorAll("#invoiceTable tbody tr").forEach(function (fila) {
    fila.remove();
  });

  alert("Factura guardada correctamente.");
}

function incrementarNumeroFactura() {
  var numeroFactura = localStorage.getItem("key_NumIncremental") || "00001";
  var nuevoNumeroFactura = (parseInt(numeroFactura) + 1).toString().padStart(5, '0');
  localStorage.setItem("key_NumIncremental", nuevoNumeroFactura);
  document.getElementById("facturaIncremental").textContent = nuevoNumeroFactura;
}
