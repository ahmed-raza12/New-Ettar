// admin/src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
  Skeleton,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Pending as PendingIcon,
  Error as CancelledIcon,
  Inventory as ProcessingIcon
} from '@mui/icons-material';
import { getOrders, updateOrderStatus } from '../services/orderService';
import OrderDetailModal from '../components/Orders/OrderDetailModal';

// Styled components for premium look
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
  '& .MuiTableCell-head': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    color: theme.palette.text.secondary,
    fontWeight: 600,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: alpha(theme.palette.common.black, 0.02),
    transition: theme.transitions.create(['background-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.04),
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.common.black, 0.04),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const StyledChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return theme.palette.warning;
      case 'processing':
        return theme.palette.info;
      case 'shipped':
        return theme.palette.primary;
      case 'delivered':
        return theme.palette.success;
      case 'cancelled':
        return theme.palette.error;
      default:
        return theme.palette.grey;
    }
  };

  const statusColor = getStatusColor();

  return {
    backgroundColor: alpha(statusColor.main, 0.1),
    color: statusColor.main,
    fontWeight: 600,
    borderRadius: theme.shape.borderRadius * 3,
    border: `1px solid ${alpha(statusColor.main, 0.2)}`,
    '.MuiChip-label': {
      padding: '0 10px',
    },
  };
});

const StyledActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
  marginRight: theme.spacing(1),
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  
  const theme = useTheme();

  // Stats calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = () => {
    setLoading(true);
    const unsubscribe = getOrders(
      (data) => {
        setOrders(data);
        setLoading(false);
        setRefreshing(false);
      },
      (err) => {
        setError('Failed to load orders');
        setLoading(false);
        setRefreshing(false);
        console.error(err);
      }
    );
    
    return unsubscribe;
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Success toast could be added here
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
      // Error toast could be added here
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer.firstName + ' ' + order.customer.lastName)
        .toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <PendingIcon fontSize="small" />;
      case 'processing':
        return <ProcessingIcon fontSize="small" />;
      case 'shipped':
        return <ShippingIcon fontSize="small" />;
      case 'delivered':
        return <DeliveredIcon fontSize="small" />;
      case 'cancelled':
        return <CancelledIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {Array(6).fill(0).map((_, cellIndex) => (
          <TableCell key={`cell-${cellIndex}`}>
            <Skeleton animation="wave" height={24} width={cellIndex === 5 ? 80 : '80%'} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Order Management
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ExportIcon />}
            sx={{ 
              borderRadius: theme.shape.borderRadius * 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ 
              borderRadius: theme.shape.borderRadius * 3,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography color="text.secondary" variant="overline" sx={{ fontWeight: 600 }}>
                Total Orders
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {totalOrders}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                Lifetime orders
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography color="warning.main" variant="overline" sx={{ fontWeight: 600 }}>
                Pending Orders
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {pendingOrders}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                Awaiting processing
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography color="success.main" variant="overline" sx={{ fontWeight: 600 }}>
                Delivered Orders
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {deliveredOrders}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                Successfully completed
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography color="primary.main" variant="overline" sx={{ fontWeight: 600 }}>
                Total Revenue
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                ${totalRevenue.toFixed(2)}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                From all orders
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <SearchField
          size="small"
          placeholder="Search orders or customers..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              Status:
            </Typography>
          </Box>
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ 
              minWidth: 160,
              height: 40,
              borderRadius: theme.shape.borderRadius * 3,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Main Table */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Paper 
        elevation={0} 
        sx={{ 
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          borderRadius: theme.shape.borderRadius * 2,
        }}
      >
        <StyledTableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                renderSkeletons()
              ) : paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      {order.customer.firstName} {order.customer.lastName}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StyledChip
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        status={order.status}
                        size="small"
                        icon={getStatusIcon(order.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <StyledActionButton 
                            size="small"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </StyledActionButton>
                        </Tooltip>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          size="small"
                          sx={{
                            height: 36,
                            minWidth: 130,
                            ml: 1,
                            borderRadius: theme.shape.borderRadius * 3,
                            '& .MuiSelect-select': {
                              display: 'flex',
                              alignItems: 'center',
                              py: 0.5,
                              fontWeight: 500,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(
                                order.status === 'pending' ? theme.palette.warning.main :
                                order.status === 'processing' ? theme.palette.info.main :
                                order.status === 'shipped' ? theme.palette.primary.main :
                                order.status === 'delivered' ? theme.palette.success.main :
                                theme.palette.error.main,
                                0.3
                              ),
                            },
                          }}
                        >
                          <MenuItem value="pending" sx={{ display: 'flex', gap: 1 }}>
                            <PendingIcon fontSize="small" color="warning" /> Pending
                          </MenuItem>
                          <MenuItem value="processing" sx={{ display: 'flex', gap: 1 }}>
                            <ProcessingIcon fontSize="small" color="info" /> Processing
                          </MenuItem>
                          <MenuItem value="shipped" sx={{ display: 'flex', gap: 1 }}>
                            <ShippingIcon fontSize="small" color="primary" /> Shipped
                          </MenuItem>
                          <MenuItem value="delivered" sx={{ display: 'flex', gap: 1 }}>
                            <DeliveredIcon fontSize="small" color="success" /> Delivered
                          </MenuItem>
                          <MenuItem value="cancelled" sx={{ display: 'flex', gap: 1 }}>
                            <CancelledIcon fontSize="small" color="error" /> Cancelled
                          </MenuItem>
                        </Select>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              color: theme.palette.text.secondary,
            },
          }}
        />
      </Paper>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Box>
  );
};

export default Orders;