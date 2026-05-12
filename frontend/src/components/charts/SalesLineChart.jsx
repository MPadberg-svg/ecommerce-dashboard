import './ChartsRegistry';
import { Line } from 'react-chartjs-2';

export default function SalesLineChart({ rows }) {
  const data = {
    labels: rows.map((item) => item.date),
    datasets: [
      {
        label: 'Revenue',
        data: rows.map((item) => Number(item.revenue)),
        borderColor: '#6366f1',
        backgroundColor: '#6366f1',
      },
    ],
  };
  return <Line data={data} />;
}
