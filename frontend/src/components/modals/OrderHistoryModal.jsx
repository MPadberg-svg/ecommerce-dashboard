export default function OrderHistoryModal({ customer, orders, loading, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Order History: {customer.email}</h3>
        {loading && <p>Loading orders...</p>}
        {!loading && (
          <ul className="stack-list">
            {orders.length === 0 && <li>No orders found.</li>}
            {orders.map((order) => (
              <li key={order.id}>
                #{order.id} · ${Number(order.total).toFixed(2)} · {order.status} ·{' '}
                {new Date(order.created_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
        <div className="row end">
          <button type="button" className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
