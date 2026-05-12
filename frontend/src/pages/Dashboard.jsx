import SalesLineChart from '../components/charts/SalesLineChart';
import RevenueDoughnutChart from '../components/charts/RevenueDoughnutChart';
import TopProductsBarChart from '../components/charts/TopProductsBarChart';
import OrderStatusPieChart from '../components/charts/OrderStatusPieChart';
import useFetch from '../hooks/useFetch';
import api from '../services/api';

export default function Dashboard() {
  const { data, loading, error } = useFetch(async () => {
    const { data: payload } = await api.get('/dashboard/stats');
    return payload;
  }, []);

  if (loading) return <div className="card">Loading dashboard...</div>;
  if (error) return <div className="card error">{error}</div>;

  return (
    <div className="grid-cards">
      <section className="card">
        <h3>Sales Over Time (Last 30 Days)</h3>
        <SalesLineChart rows={data.salesOverTime} />
      </section>
      <section className="card">
        <h3>Revenue by Category</h3>
        <RevenueDoughnutChart rows={data.revenueByCategory} />
      </section>
      <section className="card">
        <h3>Top 5 Products</h3>
        <TopProductsBarChart rows={data.topProducts} />
      </section>
      <section className="card">
        <h3>Order Status Distribution</h3>
        <OrderStatusPieChart rows={data.orderStatus} />
      </section>
    </div>
  );
}
