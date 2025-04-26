// admin/src/components/Orders/OrderTable.jsx
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, Typography,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Avatar,
  } from '@mui/material';
  import { Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
  
  const orders = [
    {
      id: 'ORD-78945',
      customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      date: 'May 15, 2023',
      amount: '$245.00',
      status: 'Processing',
    },
    {
      id: 'ORD-78944',
      customer: { name: 'Michael Brown', email: 'michael@example.com' },
      date: 'May 14, 2023',
      amount: '$120.00',
      status: 'Delivered',
    },
    // Add more orders...
  ];
  
  const statusColors = {
    Processing: 'primary',
    Delivered: 'success',
    Pending: 'warning',
    Shipped: 'secondary',
    Cancelled: 'error',
  };
  
  const OrderTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    #{order.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{order.customer.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {order.customer.email}
                  </Typography>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={statusColors[order.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <VisibilityIcon color="primary" />
                  </IconButton>
                  <IconButton>
                    <EditIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default OrderTable;