import { useMemo, useState } from 'react';
import ProductModal from '../components/modals/ProductModal';
import ProductTable from '../components/tables/ProductTable';
import useFetch from '../hooks/useFetch';
import api from '../services/api';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);

  const query = useMemo(() => ({ search, category, page, limit: 10 }), [search, category, page]);

  const { data, loading, error, refetch } = useFetch(async () => {
    const { data: payload } = await api.get('/products', { params: query });
    return payload;
  }, [query]);

  const onSave = async (payload) => {
    if (modalProduct?.id) {
      await api.put(`/products/${modalProduct.id}`, payload);
    } else {
      await api.post('/products', payload);
    }
    setModalProduct(null);
    await refetch();
  };

  const onDelete = async (id) => {
    await api.delete(`/products/${id}`);
    await refetch();
  };

  return (
    <div className="card">
      <div className="row between wrap">
        <h2>Products</h2>
        <button type="button" onClick={() => setModalProduct({})}>
          Add Product
        </button>
      </div>
      <div className="row wrap">
        <input placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} />
        <input placeholder="Filter category" value={category} onChange={(event) => setCategory(event.target.value)} />
      </div>
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {data?.data && <ProductTable products={data.data} onEdit={setModalProduct} onDelete={onDelete} />}
      <div className="row end">
        <button type="button" className="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span>Page {data?.page || page}</span>
        <button
          type="button"
          className="ghost"
          disabled={Boolean(data && data.page * data.limit >= data.total)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
      {modalProduct !== null && (
        <ProductModal
          initialValue={modalProduct.id ? modalProduct : undefined}
          onClose={() => setModalProduct(null)}
          onSubmit={onSave}
        />
      )}
    </div>
  );
}
