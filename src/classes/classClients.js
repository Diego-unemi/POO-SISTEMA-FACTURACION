export class RegularClient extends Client {
  constructor(dateUserName_Last = "Cliente", gmailUser = "Final", dniClient = "9999999999", card = false) {
    super(dateUserName_Last, gmailUser, dniClient);
    this.__discount = card ? 0.10 : 0;
  }

  get discount() {
    return this.__discount;
  }

  toString() {
    return `Client:${this.dateUserName_Last} ${this.gmailUser} Descuento:${this.discount}`;
  }

  getJson() {
    return {"dni": this.dniClient, "nombre": this.dateUserName_Last, "apellido": this.gmailUser, "valor": this.discount};
  }
}