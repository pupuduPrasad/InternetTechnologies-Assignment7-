export default class OrderModel {
    constructor(orderId, customerId, orderDate, itemCode, quantity, total) {
        this.orderId = orderId;        // Unique order identifier (e.g., O001)
        this.customerId = customerId;  // Customer ID reference
        this.orderDate = orderDate;    // Date of the order
        this.itemCode = itemCode;      // Item code reference
        this.quantity = quantity;      // Quantity ordered
        this.total = total;            // Total price (unit price * quantity)
    }
}