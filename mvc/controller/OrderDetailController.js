import {order_detail_db} from "../db/DB.js";


$(document).ready(function() {
    loadOrderDetailTable();
});
export function loadOrderDetailTable() {
    $('#orderDetailTableBody').empty();
    order_detail_db.map((orderDetails) => {
        let orderId = orderDetails.orderId;
        let customerId = orderDetails.customerId;
        let oDate = orderDetails.date;
        let paymentId = orderDetails.paymentId;
        let orderQty = orderDetails.orderQty;
        let totalAmount = orderDetails.totalAmount;
        let data = `<tr>
                       <td>${orderId}</td>
                       <td>${customerId}</td>
                       <td>${oDate}</td>
                       <td>${paymentId}</td>
                       <td>${orderQty}</td>
                       <td>${totalAmount}</td>
                   </tr>`;
        $('#orderDetailTableBody').append(data);
    });
}
