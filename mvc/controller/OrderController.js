// OrderController.js
import { customers_db, items_db, orders_db, payment_db, order_detail_db } from "../db/DB.js";
import { loadItems } from "./ItemController.js";
import { loadOrderDetailTable } from "./orderDetailController.js";
import OrderModel from "../model/OrderModel.js";
import OrderDetailModel from "../model/OrderDetailModel.js";
import PaymentModel from "../model/PaymentModel.js";

$(document).ready(function () {
    $('#invoiceNo').val(generatePayID());
    $('#orderCode').val(generateOrderID());
    loadOrderTable();
    loadDate();
});

function validateOrderQuantity(orderQuantity) {
    const quantity = parseInt(orderQuantity);

    if (isNaN(quantity) || quantity < 0) {
        Swal.fire('Invalid Quantity', 'Quantity must be a non-negative number.', 'error');
        return false;
    }

    return true;
}

function generateOrderID() {
    if (order_detail_db.length === 0) {
        return "ORD001";
    }

    let lastId = order_detail_db[order_detail_db.length - 1].orderId;
    let numberPart = parseInt(lastId.substring(4));
    let newId = numberPart + 1;
    return "ORD" + newId.toString().padStart(3, '0');
}

function generatePayID() {
    if (payment_db.length === 0) {
        return "PAY001";
    }
    let lastId = payment_db[payment_db.length - 1].payId;
    let numberPart = parseInt(lastId.substring(3));
    let newId = numberPart + 1;
    return "PAY" + newId.toString().padStart(3, '0');
}

function loadDate() {
    $('#invoiceDate').val(new Date().toISOString().split('T')[0]);
}

$('#searchCustomer').on('click',function () {
    searchCustomer();
});
function searchCustomer() {
    const id = $('#searchCustomerInput').val().trim();
    const customer = customers_db.find(c => c.customerId === id);

    if (customer) {
        $('#loadCid').val(customer.customerId);
        $('#loadCName').val(customer.fullName);
        $('#loadCAddress').val(customer.address);
        $('#loadCPhone').val(customer.contactNumber);
    } else {
        Swal.fire("Oops...", "Customer ID does not exist", "error");
    }
}

$('#resetCustomerDetails').on('click', () => {
    resetCustomer();
    setEnableCustomer();
});

function resetCustomer() {
    $('#orderCode').val(generateOrderID())
    $('#searchCustomerInput').val('');
    $('#loadCid').val('');
    $('#loadCName').val('');
    $('#loadCAddress').val('');
    $('#loadCPhone').val('');
}

$('#searchItem').on('click',function () {
    searchItem();
});
function searchItem() {
    const id = $('#itemIDInput').val().trim();
    const item = items_db.find(i => i.itemCode === id);

    if (item) {
        $('#loadItemId').val(item.itemCode);
        $('#loadItemName').val(item.itemName);
        $('#loadItemQty').val(item.itemQuantity);
        $('#loadItemPrice').val(item.itemPrice);
    } else {
        Swal.fire("Oops...", "Item ID does not exist", "error");
    }
}

$('#resetItemDetails').on('click', resetItem);

function resetItem() {
    $('#itemIDInput').val('');
    $('#loadItemId').val('');
    $('#loadItemName').val('');
    $('#loadItemQty').val('');
    $('#loadItemPrice').val('');
    $('#quantity').val('');
}

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

$('#addToOrder').on('click', function () {
    const itemCode = $('#loadItemId').val();
    const itemName = $('#loadItemName').val();
    const price = parseFloat($('#loadItemPrice').val());
    const needQty = parseInt($('#quantity').val());
    const item = items_db.find(i => i.itemCode === itemCode);

    if (!item || !validateOrderQuantity(needQty) || item.itemQuantity < needQty) {
        Swal.fire("Oops...", "Invalid item or quantity", "error");
        return;
    }

    const existingOrder = orders_db.find(o => o.itemCode === itemCode);
    if (existingOrder) {
        existingOrder.qty += needQty;
        existingOrder.total = existingOrder.qty * existingOrder.price;
    } else {
        orders_db.push(new OrderModel(itemCode, itemName, needQty, price, price * needQty));
    }

    item.itemQuantity -= needQty;
    loadItems();
    setDisableCustomer();
    resetItem();
    loadOrderTable();
    updateTotalAmount();

    Swal.fire("Success", "Item added to order", "success");
});

function updateTotalAmount() {
    const total = orders_db.reduce((sum, order) => sum + order.total, 0);
    $('#loadTotal').text(total.toFixed(2));
    $('#loadSubTotal').text(total.toFixed(2));
}

$('#discountAmount').on('input', function () {
    const total = parseFloat($('#loadTotal').text()) || 0;
    const discount = parseFloat($('#discountAmount').val()) || 0;
    const subTotal = total - discount;
    $('#loadSubTotal').text(subTotal.toFixed(2));

    const cash = parseFloat($('#cashAmount').val());
    if (!isNaN(cash)) {
        $('#balanceAmount').val((cash - subTotal).toFixed(2));
    }
});

$('#cashAmount').on('input', function () {
    const subTotal = parseFloat($('#loadSubTotal').text()) || 0;
    const cash = parseFloat($('#cashAmount').val());
    $('#balanceAmount').val(!isNaN(cash) ? (cash - subTotal).toFixed(2) : "Invalid input");
});

function loadOrderTable() {
    $('#order-body').empty();
    orders_db.forEach(({ itemCode, itemName, qty, price, total }) => {
        $('#order-body').append(`<tr>
            <td>${itemCode}</td><td>${itemName}</td>
            <td>${qty}</td><td>${price}</td><td>${total.toFixed(2)}</td>
        </tr>`);
    });
}

$('#addPayment').on('click', function () {
    const orderId = $('#orderCode').val();
    const date = $('#invoiceDate').val();
    const method = $('#paymentMethod').val();
    const totalAmount = parseFloat($('#loadTotal').text());
    const customerID = $('#loadCid').val();
    const paymentId = generatePayID();
    const discount = parseFloat($('#discountAmount').val()) || 0;
    const cash = parseFloat($('#cashAmount').val());
    const subTotal = parseFloat($('#loadSubTotal').text());

    if (!customerID || totalAmount <= 0 || isNaN(totalAmount) || isNaN(cash) || cash < subTotal) {
        Swal.fire("Error", "Invalid payment or customer details", "error");
        return;
    }

    // Add payment
    payment_db.push(new PaymentModel(paymentId, date, method, totalAmount));

    // Create single order detail record
    const totalQuantity = orders_db.reduce((sum, order) => sum + order.qty, 0);
    const itemsSummary = orders_db.map(order =>
        `${order.itemCode}(${order.qty})`
    ).join(', ');

    const orderDetail = new OrderDetailModel(
        orderId,
        customerID,
        date,
        paymentId,
        totalQuantity,
        subTotal.toFixed(2),
        itemsSummary
    );

    order_detail_db.push(orderDetail);

    resetAll();
    setEnableCustomer();
    loadOrderDetailTable();
    Swal.fire("Success", "Order Placed Successfully!", "success");
});

$('#resetPaymentDetails').on('click', resetAll);

function resetAll() {
    $('#invoiceNo').val(generatePayID());
    $('#orderCode').val(generateOrderID());
    $('#paymentMethod').val('Cash');
    $('#cashAmount, #discountAmount, #balanceAmount').val('');
    $('#loadTotal, #loadSubTotal').text('');
    loadDate();
    $('#order-body').empty();
    orders_db.length = 0;
}