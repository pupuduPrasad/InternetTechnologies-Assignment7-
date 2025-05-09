export default class OrderModel{
    constructor(orderCode,orderDate,customerName,itemName,qty,price,total) {
        this.orderCode = orderCode;
        this.orderDate = orderDate;
        this.customerName = customerName;
        this.itemName = itemName;
        this.qty = qty;
        this.price = price;
        this.total = total;
    }
}