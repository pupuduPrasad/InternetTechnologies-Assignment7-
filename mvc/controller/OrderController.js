import {orders_db} from "../db/DB";
import OrderModel from "../model/OrderModel.js";

let selectedOrderIndex = -1;

function generateOrderCode() {
    if (orders_db.length === 0) {
        return "O001";
    } else {
        let lastOrder = orders_db[orders_db.length - 1];
        let lastCode = lastOrder.orderId; // e.g., "O007"
        let number = parseInt(lastCode.substring(1)) + 1;
        return "O" + number.toString().padStart(3, "0");
    }
}

// Load all customers to the dropdown
function loadCustomers() {
    $('#custId').empty();
    $('#custId').append('<option selected disabled>Select customer</option>');

    customers_db.map((customer) => {
        let customerId = customer.custId;
        let customerName = customer.custName;

        let option = `<option value="${customerId}">${customerName}</option>`;
        $('#custId').append(option);
    });
}

// Load all items to the dropdown
function loadItems() {
    $('#itemSelect').empty();
    $('#itemSelect').append('<option selected disabled>Select item</option>');

    items_db.map((item) => {
        let itemCode = item.itemCode;
        let itemName = item.itemName;
        let itemPrice = item.itemPrice;

        let option = `<option value="${itemCode}" data-price="${itemPrice}">${itemName} - ${itemPrice.toFixed(2)}</option>`;
        $('#itemSelect').append(option);
    });
}

// Calculate item total when item or quantity changes
function calculateItemTotal() {
    let selectedItem = $('#itemSelect option:selected');
    let unitPrice = parseFloat(selectedItem.data('price')) || 0;
    let quantity = parseInt($('#quantity').val()) || 0;

    let total = unitPrice * quantity;
    $('#itemTotal').val(total.toFixed(2));
}

// Load orders to the table
function loadOrders() {
    $('table tbody').empty();
    orders_db.map((order) => {
        let orderId = order.orderId;
        let orderDate = order.orderDate;
        let customerName = getCustomerName(order.customerId);
        let itemName = getItemName(order.itemCode);
        let unitPrice = getItemPrice(order.itemCode);
        let quantity = order.quantity;
        let total = order.total;

        let data = `<tr>
                        <td>${orderId}</td>
                        <td>${orderDate}</td>
                        <td>${customerName}</td>
                        <td>${itemName}</td>
                        <td>${unitPrice.toFixed(2)}</td>
                        <td>${quantity}</td>
                        <td>${total.toFixed(2)}</td>
                    </tr>`;

        $('table tbody').append(data);
    });
}

// Helper functions to get names from IDs
function getCustomerName(custId) {
    let customer = customers_db.find(c => c.custId === custId);
    return customer ? customer.custName : 'Unknown';
}

function getItemName(itemCode) {
    let item = items_db.find(i => i.itemCode === itemCode);
    return item ? item.itemName : 'Unknown';
}

function getItemPrice(itemCode) {
    let item = items_db.find(i => i.itemCode === itemCode);
    return item ? item.itemPrice : 0;
}

// Initialize the page
$(document).ready(function() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    $('#orderDate').val(today);

    // Load initial data
    loadCustomers();
    loadItems();
    loadOrders();

    // Initially hide update button
    $('#updateOrderBtn').hide();

    // Event listeners for item selection and quantity
    $('#itemSelect').on('change', function() {
        calculateItemTotal();
    });

    $('#quantity').on('input', function() {
        calculateItemTotal();
    });

    // Place Order Button
    $('#placeOrderBtn').on('click', function() {
        let customerId = $('#custId').val();
        let orderDate = $('#orderDate').val();
        let itemCode = $('#itemSelect').val();
        let quantity = $('#quantity').val();
        let total = $('#itemTotal').val();

        if (!customerId || !orderDate || !itemCode || !quantity) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill all required fields',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // Check if quantity is valid
        if (parseInt(quantity) <= 0) {
            Swal.fire({
                title: 'Error!',
                text: 'Quantity must be greater than 0',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // Check item stock
        let selectedItem = items_db.find(item => item.itemCode === itemCode);
        if (parseInt(quantity) > selectedItem.itemQuantity) {
            Swal.fire({
                title: 'Error!',
                text: 'Not enough stock available',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // Create new order
        let orderId = generateOrderCode();
        let order_data = new OrderModel(
            orderId,
            customerId,
            orderDate,
            itemCode,
            parseInt(quantity),
            parseFloat(total)
        );

        // Add to orders database
        orders_db.push(order_data);
        console.log("New order:", order_data);

        // Update item quantity in stock
        selectedItem.itemQuantity -= parseInt(quantity);

        // Refresh the orders table
        loadOrders();
        clearForm();

        Swal.fire({
            title: "Order Placed Successfully!",
            icon: "success",
            draggable: true
        });
    });

    // Update Order Button
    $('#updateOrderBtn').on('click', function() {
        let customerId = $('#custId').val();
        let orderDate = $('#orderDate').val();
        let itemCode = $('#itemSelect').val();
        let quantity = $('#quantity').val();
        let total = $('#itemTotal').val();

        if (!customerId || !orderDate || !itemCode || !quantity) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill all required fields',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        if (selectedOrderIndex === -1) {
            Swal.fire({
                title: 'Error!',
                text: 'No order selected',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // Get the original order to restore stock
        let originalOrder = orders_db[selectedOrderIndex];
        let originalItem = items_db.find(item => item.itemCode === originalOrder.itemCode);

        // Restore the original quantity to stock
        originalItem.itemQuantity += originalOrder.quantity;

        // Check if new quantity is valid for the selected item
        let selectedItem = items_db.find(item => item.itemCode === itemCode);
        if (parseInt(quantity) > selectedItem.itemQuantity) {
            // Revert stock change
            originalItem.itemQuantity -= originalOrder.quantity;

            Swal.fire({
                title: 'Error!',
                text: 'Not enough stock available',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // Update the order
        orders_db[selectedOrderIndex].customerId = customerId;
        orders_db[selectedOrderIndex].orderDate = orderDate;
        orders_db[selectedOrderIndex].itemCode = itemCode;
        orders_db[selectedOrderIndex].quantity = parseInt(quantity);
        orders_db[selectedOrderIndex].total = parseFloat(total);

        // Update the item stock
        selectedItem.itemQuantity -= parseInt(quantity);

        console.log("Updated order:", orders_db[selectedOrderIndex]);
        loadOrders();
        clearForm();

        Swal.fire({
            title: "Order Updated Successfully!",
            icon: "success",
            draggable: true
        });
    });

    // Cancel Order Button
    $('#cancelOrderBtn').on('click', function() {
        if (selectedOrderIndex === -1) {
            Swal.fire({
                title: 'Error!',
                text: 'No order selected',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // Confirm before cancellation
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to cancel this order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Return items to stock
                let order = orders_db[selectedOrderIndex];
                let item = items_db.find(item => item.itemCode === order.itemCode);
                item.itemQuantity += order.quantity;

                // Remove order
                orders_db.splice(selectedOrderIndex, 1);
                loadOrders();
                clearForm();
                selectedOrderIndex = -1;

                Swal.fire(
                    'Cancelled!',
                    'Order has been cancelled.',
                    'success'
                );
            }
        });
    });

    // New Order Button (Reset)
    $('#newOrderBtn').on('click', function() {
        clearForm();
    });

    // Row click event for selecting orders
    $("table tbody").on('click', 'tr', function() {
        let idx = $(this).index();
        console.log("Selected row index:", idx);
        selectedOrderIndex = idx;

        let order = orders_db[idx];
        console.log("Selected order:", order);

        // Fill the form with order data
        $('#custId').val(order.customerId);
        $('#orderDate').val(order.orderDate);
        $('#itemSelect').val(order.itemCode);
        $('#quantity').val(order.quantity);
        $('#itemTotal').val(order.total.toFixed(2));

        // Show update button and hide place order button
        $('#placeOrderBtn').hide();
        $('#updateOrderBtn').show();
    });
});

// Clear form function
function clearForm() {
    $('#custId').val('Select customer');
    $('#itemSelect').val('Select item');
    $('#quantity').val('');
    $('#itemTotal').val('');

    // Set date to today
    const today = new Date().toISOString().split('T')[0];
    $('#orderDate').val(today);

    // Reset selected order
    selectedOrderIndex = -1;

    // Show place order button and hide update button
    $('#placeOrderBtn').show();
    $('#updateOrderBtn').hide();
}