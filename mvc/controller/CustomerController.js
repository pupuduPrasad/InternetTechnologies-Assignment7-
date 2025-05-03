import {customers_db} from "../db/DB.js";
import CustomerModel from "../model/CustomerModel.js";
// global variable
let selectedCustomerIndex = -1;

// load customer
function loadCustomer() {
    $('#customer-tbody').empty();
    customers_db.map((item, index) => {
        let fullName = item.fullName;
        let address = item.address;
        let email = item.email;
        let contactNumber = item.contactNumber;

        let data = `<tr>
                            <td>${index + 1}</td>
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
    } else {


        let customer_data = new CustomerModel(fullName, address, email, contactNumber);
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
            text: 'No customer selected for update',
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


$("#customer-tbody").on('click', 'tr', function(){
    let idx = $(this).index();
    console.log(idx);
    let obj = customers_db[idx];
    console.log(obj);

    // store the select index number
    selectedCustomerIndex = idx;

    let fullName = obj.fullName;
    let address = obj.address;
    let email = obj.email;
    let contactNumber = obj.contactNumber;

    $("#fullName").val(fullName);
    $("#address").val(address);
    $("#email").val(email);
    $("#contactNumber").val(contactNumber);

    $('#saveBtn').hide();
    $('#updateBtn').show();
    $('#deleteBtn').show();
});

function clearForm() {
    $("#fullName").val('');
    $("#address").val('');
    $("#email").val('');
    $("#contactNumber").val('');

    // Show save button, hide update and delete buttons
    $('#saveBtn').show();
    $('#updateBtn').hide();
    $('#deleteBtn').hide();
}

