export default function CustomersTable({ customers, onViewHistory }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Orders</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.email}</td>
              <td>{customer.order_count}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>
                <button type="button" className="ghost" onClick={() => onViewHistory(customer)}>
                  View Order History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
