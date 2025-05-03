import {items_db} from "../db/DB.js";
import ItemModel from "../model/ItemModel.js";


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