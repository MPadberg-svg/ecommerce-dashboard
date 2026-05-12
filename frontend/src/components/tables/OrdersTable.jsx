export default function OrdersTable({ orders, canManage, onStatusChange }) {
  const getNextStatus = (status) => {
    if (status === 'Pending') return 'Shipped';
    if (status === 'Shipped') return 'Delivered';
    return null;
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            {canManage && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const next = getNextStatus(order.status);
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer_email}</td>
                <td>${Number(order.total).toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                {canManage && (
                  <td>
                    <button type="button" className="ghost" disabled={!next} onClick={() => onStatusChange(order.id, next)}>
                      {next ? `Move to ${next}` : 'Complete'}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
