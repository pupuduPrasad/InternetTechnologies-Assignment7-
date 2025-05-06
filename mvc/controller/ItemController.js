import {items_db} from "../db/DB.js";
import ItemModel from "../model/ItemModel.js";

let selectedItemIndex = -1;

function generateItemCode() {
    if (items_db.length === 0) {
        return "I001";
    } else {
        let lastItem = items_db[items_db.length - 1];
        let lastCode = lastItem.itemCode; // e.g., "I007"
        let number = parseInt(lastCode.substring(1)) + 1;
        return "I" + number.toString().padStart(3, "0");
    }
}


// load items
function loadItems() {
    $('table tbody').empty();
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

        $('table tbody').append(data);
    })
}

$('#saveItemBtn').on('click', function(){
    let itemName = $('#itemName').val();
    let itemPrice = $('#itemPrice').val();
    let itemQuantity = $('#itemQuantity').val();

    if(itemName === '' || itemPrice === '' || itemQuantity === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else {
        let itemCode = generateItemCode();
        let item_data = new ItemModel(itemCode, itemName, parseFloat(itemPrice), parseInt(itemQuantity));
        items_db.push(item_data);
        console.log(item_data);

        loadItems();
        clearForm();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});

// update
$('#updateItemBtn').on('click', function(){
    let itemCode = $('#itemCode').val();
    let itemName = $('#itemName').val();
    let itemPrice = $('#itemPrice').val();
    let itemQuantity = $('#itemQuantity').val();

    if(itemCode === '' || itemName === '' || itemPrice === '' || itemQuantity === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    } else if(selectedItemIndex === -1) {
        Swal.fire({
            title: 'Error!',
            text: 'No item selected',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    } else {
        // Update the item object
        items_db[selectedItemIndex].itemCode = itemCode;
        items_db[selectedItemIndex].itemName = itemName;
        items_db[selectedItemIndex].itemPrice = parseFloat(itemPrice);
        items_db[selectedItemIndex].itemQuantity = parseInt(itemQuantity);

        console.log("Updated item:", items_db[selectedItemIndex]);
        loadItems();
        clearForm();

        Swal.fire({
            title: "Updated Successfully!",
            icon: "success",
            draggable: true
        });
    }
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

$("table tbody").on('click', 'tr', function(){
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
    $("#itemName").val('');
    $("#itemPrice").val('');
    $("#itemQuantity").val('');
    $("#itemId").val('');

    $('#saveItemBtn').show();
    $('#updateItemBtn').hide();
    $('#deleteItemBtn').hide();
}

$('#refreshItemBtn').on('click', function(){
    clearForm();
});