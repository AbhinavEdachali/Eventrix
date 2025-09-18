import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { FiHome, FiBox, FiMapPin, FiUser, FiLogOut } from "react-icons/fi";
import backendGlobalRoute from "../../config/config";

ChartJS.register(
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const StockAnalysis = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stockData, setStockData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const response = await fetch(
          `${backendGlobalRoute}/api/get-product-names`
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          toast.error("Failed to fetch product names.");
        }
      } catch (error) {
        console.error("Error fetching product names:", error);
        toast.error("Error fetching product names.");
      }
    };

    fetchProductNames();
  }, []);

  const fetchStockDetails = async () => {
    try {
      const url = selectedProduct
        ? `${backendGlobalRoute}/api/remaining-stock/${selectedProduct}`
        : `${backendGlobalRoute}/api/all-added-products`;
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        setStockData(
          data.map((product) => ({
            product: product.product_name,
            stock: product.stock,
          }))
        );
        setLineChartData(
          data.map((product) => ({
            x: product.product_name,
            y: product.stock,
          }))
        );
      } else if (data.product_name) {
        setStockData([
          { product: data.product_name, stock: data.remaining_stock },
        ]);
        setLineChartData([{ x: data.product_name, y: data.remaining_stock }]);
      } else {
        setStockData([]);
        setLineChartData([]);
        toast.warning(data.message || "No stock data found.");
      }
    } catch (error) {
      console.error("Error fetching stock details:", error);
      toast.error("Error fetching stock details.");
    }
  };

  const generateExcelReport = () => {
    if (stockData.length === 0) {
      toast.warning("No data available to generate a report.");
      return;
    }

    const worksheetData = [
      ["Product Name", "Stock"],
      ...stockData.map((item) => [item.product, item.stock]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Analysis");

    XLSX.writeFile(workbook, "StockAnalysisReport.xlsx");
    toast.success("Excel report generated successfully!");
  };

  const barChartData = {
    labels: stockData.map((item) => item.product),
    datasets: [
      {
        label: "Stock",
        data: stockData.map((item) => item.stock),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const lineChartConfig = {
    labels: stockData.map((item) => item.product),
    datasets: [
      {
        label: "Stock Trends",
        data: stockData.map((item) => item.stock),
        borderColor: "#4BC0C0",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#FF6384",
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white mt-5 mb-5">
      <div className="container mx-auto flex gap-6 py-6 px-4 items-start">
        {/* Left Navigation */}

        {/* Right Content Section */}
        <div className="flex-grow bg-white rounded-lg shadow p-6">
          <Typography variant="h4" className="text-gray-800 mb-4">
            Stock Analysis
          </Typography>
          <ToastContainer />
          <Box mb={4} className="flex flex-wrap gap-4 items-center">
            <FormControl fullWidth sx={{ maxWidth: "250px" }}>
              <InputLabel>Select Product</InputLabel>
              <Select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                size="small"
              >
                <MenuItem value="">All Products</MenuItem>
                {products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.product_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #36A2EB, #9966FF)",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
              }}
              onClick={fetchStockDetails}
            >
              Apply
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #FF9F40, #FF6384)",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
              }}
              onClick={generateExcelReport}
            >
              Download Excel Report
            </Button>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bar Chart - Stock Levels
                  </Typography>
                  <Bar data={barChartData} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Line Chart - Stock Trends
                  </Typography>
                  <Line data={lineChartConfig} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;
