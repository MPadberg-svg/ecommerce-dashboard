import { useState } from 'react';

const EMPTY = { name: '', category: '', price: '', stock: '', image_url: '' };

export default function ProductModal({ initialValue, onClose, onSubmit }) {
  const [form, setForm] = useState(initialValue || EMPTY);

  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url || undefined,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{initialValue ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={submit} className="grid-form">
          <input name="name" placeholder="Name" value={form.name} onChange={update} required />
          <input name="category" placeholder="Category" value={form.category} onChange={update} required />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={update} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={update} required />
          <input name="image_url" type="url" placeholder="Image URL" value={form.image_url || ''} onChange={update} />
          <div className="row end">
            <button type="button" className="ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
