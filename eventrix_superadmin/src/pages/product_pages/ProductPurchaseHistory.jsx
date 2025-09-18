import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  ArcElement,
  LineElement,
  PointElement
);

import backendGlobalRoute from "../../config/config";

const ProductPurchaseHistory = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState("");

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

  const fetchPurchaseHistory = async () => {
    if (!startDate || !endDate) {
      toast.warning("Please select a date range.");
      return;
    }

    try {
      const url = `${backendGlobalRoute}/api/get-product-purchase-history?productId=${selectedProduct}&startDate=${startDate}&endDate=${endDate}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.purchaseHistory) {
        const salesData = Object.entries(data.purchaseHistory).map(
          ([name, value]) => ({
            product: name,
            sales: value,
          })
        );

        setPurchaseHistory(salesData);

        const total = salesData.reduce((sum, item) => sum + item.sales, 0);
        setTotalSales(total);

        const startMonth = new Date(startDate).toLocaleString("default", {
          month: "long",
        });
        const endMonth = new Date(endDate).toLocaleString("default", {
          month: "long",
        });
        setSelectedMonths(`${startMonth} - ${endMonth}`);

        toast.success("Purchase history fetched successfully!");
      } else {
        setPurchaseHistory([]);
        setTotalSales(0);
        setSelectedMonths("");
        toast.warning(data.message || "No purchase history found.");
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      toast.error("Error fetching purchase history.");
    }
  };

  const generateExcelReport = () => {
    if (purchaseHistory.length === 0) {
      toast.warning("No data available to generate a report.");
      return;
    }

    const worksheetData = [
      [`Purchase History Report (${selectedMonths})`],
      ["Total Sales", totalSales],
      ["Product Name", "Units Sold"],
      ...purchaseHistory.map((item) => [item.product, item.sales]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Product Purchase History"
    );

    XLSX.writeFile(workbook, "ProductPurchaseHistoryReport.xlsx");
    toast.success("Excel report generated successfully!");
  };

  const chartData = {
    labels: purchaseHistory.map((item) => item.product),
    datasets: [
      {
        label: "Units Sold",
        data: purchaseHistory.map((item) => item.sales),
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

  const lineChartData = {
    labels: purchaseHistory.map((item) => item.product),
    datasets: [
      {
        label: "Sales Trend",
        data: purchaseHistory.map((item) => item.sales),
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="flex flex-col">
      <div className="flex-grow flex flex-col justify-between w-full mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" className="text-gray-800">
            Product Purchase History
          </Typography>
          <Typography variant="h6" className="text-gray-600">
            Total Sales: {totalSales}
          </Typography>
        </div>
        <Typography variant="body1" className="text-gray-600 mb-4">
          {selectedMonths && `Showing purchase history for ${selectedMonths}`}
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
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ maxWidth: "200px" }}
          />
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ maxWidth: "200px" }}
          />
          <Button variant="contained" onClick={fetchPurchaseHistory}>
            Apply
          </Button>
          <Button variant="contained" onClick={generateExcelReport}>
            Download Excel Report
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bar Chart
                </Typography>
                <div style={{ height: "400px", width: "100%" }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Line Chart - Sales Trend
                </Typography>
                <div style={{ height: "400px", width: "100%" }}>
                  <Line data={lineChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doughnut Chart
                </Typography>
                <div style={{ height: "400px", width: "100%" }}>
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pie Chart
                </Typography>
                <div style={{ height: "400px", width: "100%" }}>
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ProductPurchaseHistory;
