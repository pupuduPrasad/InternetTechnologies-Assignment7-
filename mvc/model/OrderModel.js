export default class OrderModel{
    constructor(itemCode,itemName,qty,price,total) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.qty = qty;
        this.price = price;
        this.total = total;
    }
}