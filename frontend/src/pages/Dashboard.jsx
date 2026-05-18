import SalesLineChart from '../components/charts/SalesLineChart';
import RevenueDoughnutChart from '../components/charts/RevenueDoughnutChart';
import TopProductsBarChart from '../components/charts/TopProductsBarChart';
import OrderStatusPieChart from '../components/charts/OrderStatusPieChart';
import ErrorBoundary from '../components/ErrorBoundary';
import useFetch from '../hooks/useFetch';
import api from '../services/api';

export default function Dashboard() {
  const { data, loading, error } = useFetch(async () => {
    const { data: payload } = await api.get('/dashboard/stats');
    return payload.data || payload; 
  }, []);

  if (loading) return <div className="card">Loading dashboard...</div>;
  if (error) return <div className="card error">{error}</div>;

  // Safely extract our nested data structures
  const chartsData = data?.charts || {};
  const summaryData = data?.summary || {};

  // Professional currency formatter
  const formatCurrency = (value) => {
    const numericValue = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericValue);
  };

  return (
    <div className="dashboard-container">
      {/* KPI Summary Row */}
      <div className="grid-cards" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <section className="card" style={{ borderLeft: '4px solid #4CAF50' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Revenue</h4>
          <h2 style={{ margin: 0 }}>{formatCurrency(summaryData.total_revenue)}</h2>
        </section>
        
        <section className="card" style={{ borderLeft: '4px solid #2196F3' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Orders</h4>
          <h2 style={{ margin: 0 }}>{summaryData.total_orders || 0}</h2>
        </section>
        
        <section className="card" style={{ borderLeft: '4px solid #9C27B0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Customers</h4>
          <h2 style={{ margin: 0 }}>{summaryData.total_customers || 0}</h2>
        </section>
      </div>

      {/* Analytics Visualizers */}
      <div className="grid-cards">
        <section className="card">
          <h3>Sales Over Time (Last 30 Days)</h3>
          <ErrorBoundary>
            <SalesLineChart rows={chartsData.salesOverTime || []} />
          </ErrorBoundary>
        </section>

        <section className="card">
          <h3>Revenue by Category</h3>
          <ErrorBoundary>
            <RevenueDoughnutChart rows={chartsData.revenueByCategory || []} />
          </ErrorBoundary>
        </section>

        <section className="card">
          <h3>Top 5 Products</h3>
          <ErrorBoundary>
            <TopProductsBarChart rows={chartsData.topProducts || []} />
          </ErrorBoundary>
        </section>

        <section className="card">
          <h3>Order Status Distribution</h3>
          <ErrorBoundary>
            <OrderStatusPieChart rows={chartsData.orderStatus || []} />
          </ErrorBoundary>
        </section>
      </div>
    </div>
  );
}