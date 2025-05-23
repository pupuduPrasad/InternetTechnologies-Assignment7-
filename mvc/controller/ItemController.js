import {items_db} from "../db/DB.js";
import ItemModel from "../model/ItemModel.js";

let selectedItemIndex = -1;

$(document).ready(function() {
    $('#itemCode').val(generateItemCode());
    loadItems();
});

function generateItemCode() {
    if (items_db.length === 0) {
        return "I001";
    } else {
        let lastItem = items_db[items_db.length - 1];
        let lastCode = lastItem.itemCode;
        let number = parseInt(lastCode.substring(1)) + 1;
        return "I" + number.toString().padStart(3, "0");
    }
}


// load items
export function loadItems() {
    $('#item-tbody').empty();
    items_db.map((item, index) => {
        let itemCode = item.itemCode;
        let itemName = item.itemName;
        let itemPrice = item.itemPrice;
        let itemQuantity = item.itemQuantity;

        let data = `<tr>
                        <td>${itemCode}</td>
                        <td>${itemName}</td>
                        <td>$${itemPrice.toFixed(2)}</td>
                        <td>${itemQuantity}</td>
                    </tr>`

        $('#item-tbody').append(data);
    })
}

function validateItemInputs(itemName, itemPrice, itemQuantity) {
    const nameRegex = /^[A-Za-z0-9\s\-]{3,}$/;
    const price = parseFloat(itemPrice);
    const quantity = parseInt(itemQuantity);

    if (!nameRegex.test(itemName)) {
        Swal.fire('Invalid Name', 'Item name must be at least 3 characters', 'error');
        return false;
    }
    if (isNaN(price) || price <= 0) {
        Swal.fire('Invalid Price', 'Price must be a positive number.', 'error');
        return false;
    }
    if (isNaN(quantity) || quantity < 0) {
        Swal.fire('Invalid Quantity', 'Quantity must be a non-negative number.', 'error');
        return false;
    }

    return true;
}

// save
$('#saveItemBtn').on('click', function(){
    let itemCode = generateItemCode()
    $('#itemCode').val(itemCode);
    let itemName = $('#itemName').val().trim();
    let itemPrice = $('#itemPrice').val().trim();
    let itemQuantity = $('#itemQuantity').val().trim();

    if (!validateItemInputs(itemName, itemPrice, itemQuantity)) {
        return;
    }

    let item_data = new ItemModel(itemCode, itemName, parseFloat(itemPrice), parseInt(itemQuantity));
    items_db.push(item_data);

    loadItems();
    clearForm();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success",
        draggable: true
    });
});

// update
$('#updateItemBtn').on('click', function(){
    let itemName = $('#itemName').val().trim();
    let itemPrice = $('#itemPrice').val().trim();
    let itemQuantity = $('#itemQuantity').val().trim();

    if (!validateItemInputs(itemName, itemPrice, itemQuantity)) {
        return;
    }

    if (selectedItemIndex === -1) {
        Swal.fire('Error!', 'No item selected', 'error');
        return;
    }

    items_db[selectedItemIndex].itemName = itemName;
    items_db[selectedItemIndex].itemPrice = parseFloat(itemPrice);
    items_db[selectedItemIndex].itemQuantity = parseInt(itemQuantity);

    loadItems();
    clearForm();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        draggable: true
    });
});

// delete
$('#deleteItemBtn').on('click', function(){
    if(selectedItemIndex === -1) {
        Swal.fire({
            title: 'Error!',
            text: 'No item selected',
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

                items_db.splice(selectedItemIndex, 1);
                loadItems();
                clearForm();
                selectedItemIndex = -1;

                Swal.fire(
                    'Deleted!',
                    'Item has been deleted.',
                    'success'
                );
            }
        });
    }
});

$("#item-tbody").on('click', 'tr', function(){
    let idx = $(this).index();
    console.log(idx);
    let obj = items_db[idx];
    console.log(obj);

    // Store the selected index number
    selectedItemIndex = idx;

    let itemCode = obj.itemCode;
    let itemName = obj.itemName;
    let itemPrice = obj.itemPrice;
    let itemQuantity = obj.itemQuantity;

    $("#itemCode").val(itemCode);
    $("#itemName").val(itemName);
    $("#itemPrice").val(itemPrice);
    $("#itemQuantity").val(itemQuantity);

    $('#saveItemBtn').hide();
    $('#updateItemBtn').show();
    $('#deleteItemBtn').show();
});

// Clear form function
function clearForm() {
    $("#itemCode").val(generateItemCode());
    $("#itemName").val('');
    $("#itemPrice").val('');
    $("#itemQuantity").val('');

    $('#saveItemBtn').show();
    $('#updateItemBtn').hide();
    $('#deleteItemBtn').hide();
}

$('#refreshItemBtn').on('click', function(){
    clearForm();
});