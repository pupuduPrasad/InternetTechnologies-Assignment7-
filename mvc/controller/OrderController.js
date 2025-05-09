import {customers_db,items_db, orders_db} from "../db/DB.js";
import {loadItems} from "./ItemController.js";
import OrderModel from "../model/OrderModel";

$(document).ready(function() {
    $('#invoiceNo').val(generatePayID())
    loadOrderTable();
});

$('#searchCustomer').on('click',function () {
    searchCustomer();
})