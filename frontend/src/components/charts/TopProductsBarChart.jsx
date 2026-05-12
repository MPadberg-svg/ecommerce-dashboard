import './ChartsRegistry';
import { Bar } from 'react-chartjs-2';

export default function TopProductsBarChart({ rows }) {
  const data = {
    labels: rows.map((item) => item.name),
    datasets: [
      {
        label: 'Units Sold',
        data: rows.map((item) => Number(item.quantity_sold)),
        backgroundColor: '#14b8a6',
      },
    ],
  };
  return <Bar data={data} />;
}
