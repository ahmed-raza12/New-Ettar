// admin/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  getOrders,
  getProducts 
} from '../services';
import { useNavigate } from 'react-router-dom';
// import SalesChart from '../components/Dashboard/SalesChart';
import TopProducts from '../components/Dashboard/TopProducts';
import RecentOrders from '../components/Dashboard/RecentOrders';
import InventoryStatus from '../components/Dashboard/InventoryStatus';
import RevenueSummary from '../components/Dashboard/RevenueSummary';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    productsSold: 0,
    newCustomers: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch orders
        const ordersUnsubscribe = getOrders((ordersData) => {
          setOrders(ordersData);
          calculateStats(ordersData, products);
        });

        // Fetch products
        const productsUnsubscribe = getProducts((productsData) => {
          setProducts(productsData);
          calculateStats(orders, productsData);
        });

        return () => {
          ordersUnsubscribe();
          productsUnsubscribe();
        };
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (orders, products) => {
    if (!orders.length || !products.length) return;

    // Calculate total revenue (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(order => order.createdAt > thirtyDaysAgo);
    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate total orders (last 30 days)
    const totalOrders = recentOrders.length;

    // Calculate products sold
    const productsSold = recentOrders.reduce(
      (sum, order) => sum + order.items.reduce(
        (itemSum, item) => itemSum + item.quantity, 0
      ), 0
    );

    // Calculate new customers (simplified - in a real app you'd track customers separately)
    const newCustomers = recentOrders.length; 

    setStats({
      totalRevenue,
      totalOrders,
      productsSold,
      newCustomers
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <RevenueSummary 
            title="Total Revenue" 
            value={stats.totalRevenue} 
            change={12} // This would be calculated in a real app
            icon="rupee"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <RevenueSummary 
            title="Total Orders" 
            value={stats.totalOrders} 
            change={8} 
            icon="orders"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <RevenueSummary 
            title="Products Sold" 
            value={stats.productsSold} 
            change={15} 
            icon="products"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <RevenueSummary 
            title="New Customers" 
            value={stats.newCustomers} 
            change={5} 
            icon="customers"
          />
        </Grid>
      </Grid>

      {/* Charts and Data */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Sales Overview (Last 30 Days)
            </Typography>
            <RecentOrders orders={orders.slice(0, 5)} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Selling Products
            </Typography>
            <TopProducts orders={orders} products={products} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;