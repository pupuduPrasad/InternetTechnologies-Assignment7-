import {customers_db} from "../db/DB.js";
import CustomerModel from "../model/CustomerModel.js";
// global variable
let selectedCustomerIndex = -1;
$(document).ready(function() {
    $('#customerId').val(generateCustomerId());
    loadCustomer();
});


function generateCustomerId() {
    if (customers_db.length === 0) {
        return "C001";
    } else {
        let lastCustomer = customers_db[customers_db.length - 1];
        let lastId = lastCustomer.customerId;
        let number = parseInt(lastId.substring(1)) + 1;
        return "C" + number.toString().padStart(3, "0");
    }
}

// load customer
function loadCustomer() {
    $('#customer-tbody').empty();
    customers_db.map((customer, index) => {
        let customerId = customer.customerId;
        let fullName = customer.fullName;
        let address = customer.address;
        let email = customer.email;
        let contactNumber = customer.contactNumber;

        let data = `<tr>
                            <td>${customerId}</td>
                            <td>${fullName}</td>
                            <td>${address}</td>
                            <td>${email}</td>
                            <td>${contactNumber}</td>
                        </tr>`

        $('#customer-tbody').append(data);
    })
}
function validateCustomerInputs(fullName, address, email, contactNumber) {
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const addressRegex = /^.{5,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+94|0)?7\d{8}$/;

    if (!nameRegex.test(fullName)) {
        Swal.fire('Invalid Name', 'Please enter a valid full name (at least 3 characters,only use letters)', 'error');
        return false;
    }
    if (!addressRegex.test(address)) {
        Swal.fire('Invalid Address', 'Address must be at least 5 characters long.', 'error');
        return false;
    }
    if (!emailRegex.test(email)) {
        Swal.fire('Invalid Email', 'Please enter a valid email address.', 'error');
        return false;
    }
    if (!phoneRegex.test(contactNumber)) {
        Swal.fire('Invalid Contact', 'Please enter a valid Sri Lankan phone number.', 'error');
        return false;
    }

    return true;
}


// save
$('#saveBtn').on('click', function(){
    let customerId = generateCustomerId()
    $('#customerId').val(customerId);
    let fullName = $('#fullName').val().trim();
    let address = $('#address').val().trim();
    let email = $('#email').val().trim();
    let contactNumber = $('#contactNumber').val().trim();

    if (!validateCustomerInputs(fullName, address, email, contactNumber)) {
        return;
    }
    let customer_data = new CustomerModel(customerId, fullName, address, email, contactNumber);
    customers_db.push(customer_data);

    loadCustomer();
    clearForm();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success",
        draggable: true
    });
});

// update
$('#updateBtn').on('click', function(){
    let fullName = $('#fullName').val().trim();
    let address = $('#address').val().trim();
    let email = $('#email').val().trim();
    let contactNumber = $('#contactNumber').val().trim();

    if (!validateCustomerInputs(fullName, address, email, contactNumber)) {
        return;
    }

    if (selectedCustomerIndex === -1) {
        Swal.fire('Error!', 'No customer selected', 'error');
        return;
    }

    customers_db[selectedCustomerIndex].fullName = fullName;
    customers_db[selectedCustomerIndex].address = address;
    customers_db[selectedCustomerIndex].email = email;
    customers_db[selectedCustomerIndex].contactNumber = contactNumber;

    loadCustomer();
    clearForm();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        draggable: true
    });
});

// delete
$('#deleteBtn').on('click', function(){
    if(selectedCustomerIndex === -1) {
        Swal.fire({
            title: 'Error!',
            text: 'No customer selected',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else {
        // Confirm before deletion
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {

                customers_db.splice(selectedCustomerIndex, 1);
                loadCustomer();
                clearForm();

                selectedCustomerIndex = -1;

                Swal.fire(
                    'Deleted!',
                    'Customer has been deleted.',
                    'success'
                );
            }
        });
    }
});


$("#customer-tbody").on('click', 'tr', function(){
    let idx = $(this).index();
    console.log(idx);
    let obj = customers_db[idx];
    console.log(obj);

    // store the select index number
    selectedCustomerIndex = idx;

    let customerID = obj.customerId;
    let fullName = obj.fullName;
    let address = obj.address;
    let email = obj.email;
    let contactNumber = obj.contactNumber;

    $('#customerId').val(customerID);
    $("#fullName").val(fullName);
    $("#address").val(address);
    $("#email").val(email);
    $("#contactNumber").val(contactNumber);

    $('#saveBtn').hide();
    $('#updateBtn').show();
    $('#deleteBtn').show();
});

function clearForm() {
    $('#customerId').val(generateCustomerId());
    $("#fullName").val('');
    $("#address").val('');
    $("#email").val('');
    $("#contactNumber").val('');

    $('#saveBtn').show();
    $('#updateBtn').hide();
    $('#deleteBtn').hide();
}
$('#refreshBtn').on('click', function(){
    clearForm();
});
