import { useOutletContext } from "react-router-dom";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import PageCard from "../../components/PageCard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ShopkeeperAnalyticsPage() {
  const { analytics } = useOutletContext();

  const chartData = {
    labels: analytics.map((d) => d._id),
    datasets: [
      {
        label: "Daily Revenue",
        data: analytics.map((d) => d.revenue),
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
      },
    ],
  };

  return (
    <PageCard title="Daily Sales Analytics">
      <Line data={chartData} />
    </PageCard>
  );
}
