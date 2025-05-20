import {order_detail_db} from "../db/DB.js";


$(document).ready(function() {
    loadOrderDetailTable();
});

export function loadOrderDetailTable() {
    let tbody = $('#orderDetailTableBody');
    tbody.empty(); // පරණ rows clear කරනවා

    order_detail_db.forEach(detail => {
        let row = `
        <tr>
            <td>${detail.orderId}</td>
            <td>${detail.customerId}</td>
            <td>${detail.itemId || '-'}</td>
            <td>${detail.paymentId}</td>
            <td>${detail.orderQty || '-'}</td>
            <td>${parseFloat(detail.totalAmount).toFixed(2)}</td>
        </tr>`;
        tbody.append(row);
    });
}
