export default class OrderDetailModel{
    constructor(orderId,customerId,itemId,paymentId,orderQty,totalAmount) {
        this.orderId=orderId;
        this.customerId=customerId;
        this.itemId=itemId;
        this.paymentId=paymentId;
        this.orderQty=orderQty;
        this.totalAmount=totalAmount;

    }

}