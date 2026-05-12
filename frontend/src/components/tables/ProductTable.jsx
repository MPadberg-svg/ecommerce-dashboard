export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>
                <button type="button" className="ghost" onClick={() => onEdit(product)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => onDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
