export default class OrderModel {
    constructor(orderID, orderDate, customerName, items, total) {
        this.orderID = orderID;
        this.orderDate = orderDate;
        this.customerName = customerName;
        this.items = items;
        this.total = total;
    }
}