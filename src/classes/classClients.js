// clientes.js

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
    if (value.length === 10 || value.length === 13) {
      this._dni = value;
    } else {
      this._dni = "9999999999";
    }
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
