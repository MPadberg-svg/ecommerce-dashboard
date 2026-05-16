import { useAuth } from '../context/AuthContext'; // Updated import path
import useFetch from '../hooks/useFetch';
import api from '../services/api';
import OrdersTable from '../components/tables/OrdersTable';

export default function Orders() {
  const { user } = useAuth();

  const { data, loading, error, refetch } = useFetch(async () => {
    const { data: payload } = await api.get('/orders');
    return payload.data; // Extract the data array from the paginated response
  }, []);

  const onStatusChange = async (id, status) => {
    // Updated to match the specific PATCH route we built
    await api.patch(`/orders/${id}/status`, { status });
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