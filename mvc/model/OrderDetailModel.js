export default class OrderDetailModel{
    constructor(orderId,customerId,date,paymentId,orderQty,totalAmount) {
        this.orderId=orderId;
        this.customerId=customerId;
        this.date=date;
        this.paymentId=paymentId;
        this.orderQty=orderQty;
        this.totalAmount=totalAmount;

    }

}