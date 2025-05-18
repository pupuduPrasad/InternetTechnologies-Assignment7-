import {customers_db, items_db, orders_db, payment_db, order_detail_db} from "../db/DB.js";
import {loadItems} from "./ItemController.js";
import OrderModel from "../model/OrderModel.js";
import OrderDetailModel from "../model/OrderDetailModel.js";
import PaymentModel from "../model/PaymentModel.js";

/*-----------------Load Page---------------------------*/
$(document).ready(function() {
    $('#invoiceNo').val(generatePayID());
    $('#orderCode').val(generateOrderID());
    loadOrderTable();
    loadDateAndTime();
});

/*--------------------------Generate next OrderId----------------------------*/
function generateOrderID() {
    if (orders_db.length === 0) {
        return "ORD001";
    }
    let lastOrder = orders_db[orders_db.length - 1];
    if (!lastOrder || !lastOrder.orderCode) {
        return "ORD001";
    }

    let lastId = lastOrder.orderCode;
    let numberPart = parseInt(lastId.substring(3));
    let newId = numberPart + 1;
    return "ORD" + newId.toString().padStart(3, '0');
}

/*--------------------Load date and Time -------------------------*/
function loadDateAndTime() {
    const now = new Date();

    const date = now.toISOString().split('T')[0];
    $('#invoiceDate').val(date);

    const time = now.toTimeString().split(' ')[0].substring(0,5);
    $('#invoiceTime').val(time);
}

/*--------------------Search Customer In the DB--------------------------------*/
$('#searchCustomer').on('click',function () {
    searchCustomer();
});

function searchCustomer() {
    let id = $('#searchCustomerInput').val().trim();
    if (!id){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Search an ID first",
        });
        return;
    }
    const c = customers_db.find(cust => cust.customerId === id);
    if (c){
        $('#loadCid').val(c.customerId);
        $('#loadCName').val(c.fullName);
        $('#loadCAddress').val(c.address);
        $('#loadCPhone').val(c.contactNumber);
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Id does not Exist",
        });
    }
}

/*--------------------Reset BTN in Customer---------------------------*/
function resetCustomer() {
    $('#orderCode').val(generateOrderID());
    $('#searchCustomerInput').val('');
    $('#loadCid').val('');
    $('#loadCName').val('');
    $('#loadCAddress').val('');
    $('#loadCPhone').val('');
}

$('#resetCustomerDetails').on('click',function () {
    resetCustomer();
    setEnableCustomer();
});

/*--------------------Search Item In the DB--------------------------------*/
$('#searchItem').on('click',function () {
    searchItem();
});

function searchItem() {
    let id = $('#itemIDInput').val().trim();
    if (!id){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Search an ID first",
        });
        return;
    }
    const c = items_db.find(item => item.itemCode === id);
    if (c){
        $('#loadItemId').val(c.itemCode);
        $('#loadItemName').val(c.itemName);
        $('#loadItemQty').val(c.itemQuantity);
        $('#loadItemPrice').val(c.itemPrice);
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Id does not Exist",
        });
    }
}

/*-------------------Reset BTN in Item------------------------*/
function resetItem() {
    $('#itemIDInput').val('');
    $('#loadItemId').val('');
    $('#loadItemName').val('');
    $('#loadItemQty').val('');
    $('#loadItemPrice').val('');
    $('#quantity').val('');
}

$('#resetItemDetails').on('click',function () {
    resetItem();
});

/*-------------------------Customer Form BTN changing--------------------------------*/
function setDisableCustomer() {
    $('#searchCustomer').prop('disabled', true);
    $('#resetCustomerDetails').prop('disabled', true);
    $('#searchCustomerInput').prop('readonly', true);
}

function setEnableCustomer() {
    $('#searchCustomer').prop('disabled', false);
    $('#resetCustomerDetails').prop('disabled', false);
    $('#searchCustomerInput').prop('readonly', false);
}

/*----------------Add to Order / OrderDetails---------------------------*/
$('#addToOrder').on('click', function () {
    let itemCode = $('#loadItemId').val();
    let itemName = $('#loadItemName').val();
    let price = parseFloat($('#loadItemPrice').val());
    let needQty = parseInt($('#quantity').val());
    let item = items_db.find(item => item.itemCode === itemCode);

    if (!item) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No Item Found",
        });
        return;
    }

    if (item.itemQuantity < needQty) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Not enough Quantity",
        });
        return;
    }

    let index = order_detail_db.findIndex(item => item.itemCode === itemCode);

    if (index !== -1) {
        // Update existing item quantity and total
        order_detail_db[index].qty += needQty;
        order_detail_db[index].total = order_detail_db[index].qty * order_detail_db[index].price;
    } else {
        // Add new item to order details
        let total = price * needQty;
        let order_data = new OrderModel(itemCode, itemName, needQty, price, total);
        order_detail_db.push(order_data);
    }

    // Update item quantity in database
    item.itemQuantity -= needQty;
    loadItems();
    setDisableCustomer();
    resetItem();
    loadOrderTable();
    updateTotalAmount();

    Swal.fire({
        title: "Data Saved Successfully!",
        icon: "success",
        draggable: true
    });
});

/*-------------------Get Total Amount------------------------*/
function updateTotalAmount() {
    let total = 0;
    order_detail_db.forEach(entry => {
        total += entry.total;
    });
    $('#loadTotal').text(total.toFixed(2));
    $('#loadSubTotal').text(total.toFixed(2));
}

/*--------------------Get Sub Total-----------------*/
$('#discountAmount').on('input', function() {
    let total = parseFloat($('#loadTotal').text());
    let discount = parseFloat($('#discountAmount').val());

    if (isNaN(discount)) {
        discount = 0;
    }
    let subTotal = total - discount;
    $('#loadSubTotal').text(subTotal.toFixed(2));
});

/*--------------------LoadBalance---------------------*/
$('#cashAmount').on('input', function() {
    let cash = parseFloat($('#cashAmount').val());
    let total = parseFloat($('#loadSubTotal').text());

    if (isNaN(cash) || isNaN(total)) {
        $('#balanceAmount').val("Invalid input");
    } else {
        let balance = cash - total;
        $('#balanceAmount').val(balance.toFixed(2));
    }
});

/*---------------------Load table--------------------*/
function loadOrderTable() {
    $('#order-body').empty();
    order_detail_db.map((orderDetail) => {
        let itemCode = orderDetail.itemCode;
        let itemName = orderDetail.itemName;
        let qty = orderDetail.qty;
        let price = orderDetail.price;
        let total = orderDetail.total;
        let data = `<tr>
                       <td>${itemCode}</td>
                       <td>${itemName}</td>
                       <td>${qty}</td>
                       <td>${price}</td>
                       <td>${total}</td>
                   </tr>`;
        $('#order-body').append(data);
    });
}

/*--------------------------Generate next PayId----------------------------*/
function generatePayID() {
    if (payment_db.length === 0) {
        return "PAY001";
    }
    let lastId = payment_db[payment_db.length - 1].payId;
    let numberPart = parseInt(lastId.substring(3));
    let newId = numberPart + 1;
    return "PAY" + newId.toString().padStart(3, '0');
}

/*------------------------Add Payment-----------------------------*/
$('#addPayment').on('click', function() {
    let paymentId = generatePayID();
    $('#invoiceNo').val(paymentId);
    let date = $('#invoiceDate').val();
    let time = $('#invoiceTime').val();
    let method = $('#paymentMethod').val();
    let totalAmount = parseFloat($('#loadTotal').text());
    let customerID = $('#loadCid').val();

    if (!customerID || customerID === '') {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select a customer first!",
        });
        return;
    }

    if (order_detail_db.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please add items to the order first!",
        });
        return;
    }

    if (paymentId === '' || date === '' || time === '' || method === '' || totalAmount <= 0 || isNaN(totalAmount)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all payment details!",
        });
        return;
    }

    // Create the payment record
    let payment_data = new PaymentModel(paymentId, date, time, method, totalAmount);
    payment_db.push(payment_data);

    // Create the order record
    let orderCode = $('#orderCode').val();

    // Create the main order
    let order_data = new OrderDetailModel(orderCode, customerID, paymentId, totalAmount);
    orders_db.push(order_data);


    reset();
    setEnableCustomer();
    resetCustomer();

    Swal.fire({
        title: "Order Placed Successfully!",
        icon: "success",
        draggable: true
    });
});

/*-------------Reset Payment Details----------------------*/
$('#resetPaymentDetails').on('click', function() {
    reset();
});

function reset() {
    let id = generatePayID();
    $('#invoiceNo').val(id);
    $('#paymentMethod').val('Cash');
    $('#cashAmount').val('');
    $('#discountAmount').val('');
    $('#balanceAmount').val('');
    $('#loadTotal').text('');
    $('#loadSubTotal').text('');
    loadDateAndTime();
    $('#order-body').empty();
    order_detail_db.length = 0;
}