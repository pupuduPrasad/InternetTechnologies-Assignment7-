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
        let lastId = lastCustomer.customerId; // e.g., "C005"
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

// save
$('#saveBtn').on('click', function(){
    let customerId = $('#customerId').val();
    let fullName = $('#fullName').val();
    let address = $('#address').val();
    let email = $('#email').val();
    let contactNumber = $('#contactNumber').val();

    if(customerId === '' ||fullName === '' || address === '' || email === '' || contactNumber === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else {
        let customerId = generateCustomerId(); // Generate new ID
        let customer_data = new CustomerModel(customerId, fullName, address, email, contactNumber);
        customers_db.push(customer_data);
        console.log(customer_data);

        loadCustomer();
        clearForm();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});

// update
$('#updateBtn').on('click', function(){
    let fullName = $('#fullName').val();
    let address = $('#address').val();
    let email = $('#email').val();
    let contactNumber = $('#contactNumber').val();

    if(fullName === '' || address === '' || email === '' || contactNumber === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    } else if(selectedCustomerIndex === -1) {
        Swal.fire({
            title: 'Error!',
            text: 'No customer selected',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    } else {
        // Update the customer object
        customers_db[selectedCustomerIndex].fullName = fullName;
        customers_db[selectedCustomerIndex].address = address;
        customers_db[selectedCustomerIndex].email = email;
        customers_db[selectedCustomerIndex].contactNumber = contactNumber;

        console.log("Updated customer:", customers_db[selectedCustomerIndex]);
        loadCustomer();
        clearForm();

        Swal.fire({
            title: "Updated Successfully!",
            icon: "success",
            draggable: true
        });
    }
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
