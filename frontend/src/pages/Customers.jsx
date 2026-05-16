import { useState } from 'react';
import CustomersTable from '../components/tables/CustomersTable';
import OrderHistoryModal from '../components/modals/OrderHistoryModal';
import useFetch from '../hooks/useFetch';
import api from '../services/api';

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const { data, loading, error } = useFetch(async () => {
    const { data: payload } = await api.get('/customers');
    return payload.data; // Extract the data array from the paginated response
  }, []);

  const openHistory = async (customer) => {
    setSelectedCustomer(customer);
    setOrdersLoading(true);
    try {
      // Changed user_id to userId to match backend, and extracted payload.data
      const { data: payload } = await api.get('/orders', { params: { userId: customer.id } });
      setOrderHistory(payload.data); 
    } catch {
      setOrderHistory([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Customers</h2>
      {loading && <p>Loading customers...</p>}
      {error && <p className="error">{error}</p>}
      {data && <CustomersTable customers={data} onViewHistory={openHistory} />}
      {selectedCustomer && (
        <OrderHistoryModal
          customer={selectedCustomer}
          orders={orderHistory}
          loading={ordersLoading}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}