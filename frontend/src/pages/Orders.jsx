import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import api from '../services/api';
import OrdersTable from '../components/tables/OrdersTable';

export default function Orders() {
  const { user } = useAuth();

  const { data, loading, error, refetch } = useFetch(async () => {
    const { data: payload } = await api.get('/orders');
    return payload;
  }, []);

  const onStatusChange = async (id, status) => {
    await api.put(`/orders/${id}`, { status });
    await refetch();
  };

  return (
    <div className="card">
      <h2>Orders</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p className="error">{error}</p>}
      {data && <OrdersTable orders={data} canManage={user?.role === 'admin'} onStatusChange={onStatusChange} />}
    </div>
  );
}
