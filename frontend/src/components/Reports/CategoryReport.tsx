import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getAllProducts } from "../../services/productService";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

const CategoryReport: React.FC = () => {
  const [categoryData, setCategoryData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const products = await getAllProducts();

      const normalized = products.map((product: any) => ({
        ...product,
        category:
          typeof product.category === "object" && product.category !== null
            ? product.category.name
            : product.category || "Uncategorized",
      }));

      const categoryCount: Record<string, number> = {};
      normalized.forEach((product: Product) => {
        categoryCount[product.category] =
          (categoryCount[product.category] || 0) + 1;
      });

      setCategoryData(categoryCount);
    } catch (err) {
      console.error("Error fetching category data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Number of Products",
        data: Object.values(categoryData),
        backgroundColor: [
          "#D2B48C", // Tan
          "#A0522D", // Sienna
          "#8B4513", // SaddleBrown
          "#DEB887", // BurlyWood
          "#CD853F", // Peru
          "#F4A460", // SandyBrown
          "#D2691E", // Chocolate
          "#BC8F8F", // RosyBrown
        ],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="container my-5">
      <style>
        {`
          .report-card {
            background-color: #f5f5dc; /* Light brown background */
            border: 1px solid #deb887;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease-in-out;
          }

          .report-card:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }

          .report-title {
            color: #6b4c3b; /* Darker brown */
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
          }

          .chart-wrapper {
            max-width: 500px;
            margin: 0 auto;
          }
        `}
      </style>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="report-card">
            <h4 className="report-title">📊 Category Product Report</h4>
            {loading ? (
              <p className="text-center text-muted">Loading chart...</p>
            ) : (
              <div className="chart-wrapper">
                <Pie data={chartData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryReport;
