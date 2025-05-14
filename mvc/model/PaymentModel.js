export default class PaymentModel{
    constructor(Id,method,total) {
        this.payId = Id;
        this.method = method;
        this.payTotal = total;
    }
}