import './ChartsRegistry';
import { Pie } from 'react-chartjs-2';

export default function OrderStatusPieChart({ rows }) {
  const data = {
    labels: rows.map((item) => item.status),
    datasets: [
      {
        label: 'Order Status',
        data: rows.map((item) => Number(item.count)),
        backgroundColor: ['#f59e0b', '#0ea5e9', '#22c55e'],
      },
    ],
  };
  return <Pie data={data} />;
}
