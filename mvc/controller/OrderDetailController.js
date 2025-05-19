import { orders_db, payment_db, order_detail_db} from "../db/DB.js";



$(document).ready(function() {
    loadOrderDetailTable();
});

/*---------------------Load table--------------------*/
function loadOrderDetailTable() {
    $('#orderDetailTableBody').empty();
    order_detail_db.map((orderDetail) => {
        let orderId = orderDetail.orderId;
        let customerId = orderDetail.customerId;
        let itemId = orderDetail.itemId;
        let paymentId = orderDetail.paymentId;
        let orderQty = orderDetail.orderQty;
        let totalAmount = orderDetail.totalAmount;
        let data = `<tr>
                       <td>${orderId}</td>
                       <td>${customerId}</td>
                       <td>${itemId}</td>
                       <td>${paymentId}</td>
                       <td>${orderQty}</td>
                       <td>${totalAmount}</td>
                   </tr>`;
        $('#orderDetailTableBody').append(data);
    });
}