import './ChartsRegistry';
import { Doughnut } from 'react-chartjs-2';

export default function RevenueDoughnutChart({ rows }) {
  const data = {
    labels: rows.map((item) => item.category),
    datasets: [
      {
        label: 'Revenue by Category',
        data: rows.map((item) => Number(item.revenue)),
        backgroundColor: ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'],
      },
    ],
  };
  return <Doughnut data={data} />;
}
