// admin/src/components/Dashboard/RecentOrders.jsx
import { Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error'
};

const RecentOrders = ({ orders }) => {
  if (!orders.length) {
    return <Typography>No recent orders</Typography>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell>#{order.id.slice(0, 8)}</TableCell>
              <TableCell>
                {(new Date(order.createdAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Chip
                  label={order.status}
                  color={statusColors[order.status] || 'default'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentOrders;