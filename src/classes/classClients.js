export class Client {
  constructor(first_name = "Consumidor", last_name = "Final", dni = "9999999999") {
    this.first_name = first_name;
    this.last_name = last_name;
    this._dni = dni;
  }

  get dni() {
    return this._dni;
  }

  set dni(value) {
    if ((value.length === 10 || value.length === 13) && validateCedula(value)) {
      this._dni = value;
    } else {
      this._dni = "9999999999";
    }
  }

  validateCedula(value) {
    if (value.includes(' ') || !(/^\d+$/.test(value)) || value.length !== 10) {
      return "Cédula inválida: Debe contener solo números y tener una longitud de 10 caracteres.";
    } else {
      let suma = 0;
      for (let i = 0; i < value.length - 1; i++) {
        let multiplicador = (i % 2 === 0) ? 2 : 1;
        let producto = parseInt(value[i]) * multiplicador;
        if (producto >= 10) {
          producto -= 9;
        }
        suma += producto;
      }
      let residuo = suma % 10;
      if (residuo === 0) {
        residuo = 10;
      }
      let verificador = 10 - residuo;
      if (verificador !== parseInt(value[value.length - 1])) {
        return "Cédula inválida: El dígito verificador no coincide.";
      }
    }
    return true;
  }

  saveClientData(data) {
    let dataCliente = JSON.parse(localStorage.getItem('KEY_dataCliente')) || [];
    dataCliente.push(data);
    localStorage.setItem('KEY_dataCliente', JSON.stringify(dataCliente));
  }

  buscar() {
    const searchTerm = findClientsTxt.value.trim().toLowerCase();
    const clientRows = document.querySelectorAll("#clientTableBody tr");
    let found = false;

    clientRows.forEach(row => {
      const dniCell = row.querySelector("td:first-child").textContent.toLowerCase();
      const match = dniCell.includes(searchTerm);
      row.style.display = match ? "" : "none";
      if (match) {
        found = true;
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        row.classList.add("highlight");
        setTimeout(() => row.classList.remove("highlight"), 3000);
      }
    });

    if (!searchTerm) {
      clientRows.forEach(row => row.style.display = "");
    }

    if (!found && searchTerm) {
      alert("No se encontró ningún cliente con ese número de cédula.");
    }
  }


  formReset() {
    document.getElementById("clientForm").reset();
  }

  attachEditButtonListeners(editClient) {
    document.querySelectorAll('.edit-btn').forEach((button, index) => {
      button.addEventListener('click', () => editClient(index));
    });
  }

  attachDeleteButtonListeners(deleteClient) {
    document.querySelectorAll('.delete-btn').forEach((button, index) => {
      button.addEventListener('click', () => deleteClient(index));
    });
  }

}

export class RegularClient extends Client {
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


export class VipClient extends Client {
  constructor(first_name = "Consumidor", last_name = "Final", dni = "9999999999") {
    super(first_name, last_name, dni);
    this._limit = 10000; // Límite de crédito del cliente VIP
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
