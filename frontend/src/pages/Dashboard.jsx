import SalesLineChart from '../components/charts/SalesLineChart';
import RevenueDoughnutChart from '../components/charts/RevenueDoughnutChart';
import TopProductsBarChart from '../components/charts/TopProductsBarChart';
import OrderStatusPieChart from '../components/charts/OrderStatusPieChart';
import useFetch from '../hooks/useFetch';
import api from '../services/api';

export default function Dashboard() {
  const { data, loading, error } = useFetch(async () => {
    const { data: payload } = await api.get('/dashboard/stats');
    return payload.data || payload; 
  }, []);

  if (loading) return <div className="card">Loading dashboard...</div>;
  if (error) return <div className="card error">{error}</div>;

  // We add an extra safety check in case 'data' or 'data.charts' isn't loaded yet
  const chartsData = data?.charts || {};

  return (
    <div className="grid-cards">
      {/* Optional: If you want to show the summary stats, you now have access to data?.summary too! */}
      
      <section className="card">
        <h3>Sales Over Time (Last 30 Days)</h3>
        <SalesLineChart rows={chartsData.salesOverTime || []} />
      </section>
      <section className="card">
        <h3>Revenue by Category</h3>
        <RevenueDoughnutChart rows={chartsData.revenueByCategory || []} />
      </section>
      <section className="card">
        <h3>Top 5 Products</h3>
        <TopProductsBarChart rows={chartsData.topProducts || []} />
      </section>
      <section className="card">
        <h3>Order Status Distribution</h3>
        <OrderStatusPieChart rows={chartsData.orderStatus || []} />
      </section>
    </div>
  );
}