export default class OrderModel{
    constructor(orderCode,customerName,itemName,qty,price,total) {
        this.orderCode = orderCode;
        this.customerName = customerName;
        this.itemName = itemName;
        this.qty = qty;
        this.price = price;
        this.total = total;
    }
}