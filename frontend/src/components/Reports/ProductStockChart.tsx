import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProductData {
  name: string;
  quantity: number;
  total_purchased: number;
}

const ProductStockChart = () => {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "In Stock",
        data: [] as number[],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Total Purchased",
        data: [] as number[],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  });

  const [productData, setProductData] = useState<ProductData[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/reports/product-stock")
      .then((response) => {
        const { labels, quantities, purchased, products } = response.data;

        setChartData({
          labels,
          datasets: [
            {
              label: "In Stock",
              data: quantities,
              backgroundColor: "rgba(139, 69, 19, 0.6)", // SaddleBrown
            },
            {
              label: "Total Purchased",
              data: purchased,
              backgroundColor: "rgba(205, 133, 63, 0.6)", // Peru
            },
          ],
        });

        setProductData(products);
      })
      .catch((error) => {
        console.error("Error fetching product stock data", error);
      });
  }, []);

  return (
    <div className="container my-5">
      <style>
        {`
          .report-container {
            background-color: #f5f5dc; /* Beige / light brown */
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .report-title {
            color: #6b4c3b;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
          }

          .table thead th {
            background-color: #deb887; /* BurlyWood */
            color: #3e2723;
          }

          .table-striped tbody tr:nth-of-type(odd) {
            background-color: #fdf5e6; /* OldLace */
          }
        `}
      </style>

      <div className="report-container">
        <h2 className="report-title">📦 Product Stock & Purchase Report</h2>

        <div className="mb-4">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: "Product Stock vs Purchased",
                  color: "#6b4c3b",
                  font: {
                    size: 18,
                  },
                },
              },
            }}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stock Quantity</th>
                <th>Total Purchased</th>
              </tr>
            </thead>
            <tbody>
              {productData.length > 0 ? (
                productData.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.total_purchased ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-muted">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductStockChart;
