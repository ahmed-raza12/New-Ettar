// admin/src/components/Dashboard/TopProducts.jsx
import { Box, Typography, Avatar, Chip, List, ListItem } from '@mui/material';

const TopProducts = ({ orders, products }) => {
  if (!orders.length || !products.length) {
    return <Typography>No data available</Typography>;
  }

  // Calculate product sales
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = {
          quantity: 0,
          revenue: 0,
          ...products.find(p => p.id === item.id)
        };
      }
      productSales[item.id].quantity += item.quantity;
      productSales[item.id].revenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      {topProducts.map((product, index) => (
        <ListItem 
          key={product.id} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            py: 2,
            borderBottom: index !== topProducts.length - 1 ? '1px solid' : 'none',
            borderColor: 'divider'
          }}
        >
          <Avatar src={product.image} variant="rounded" sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.quantity} sold • ${product.revenue.toFixed(2)}
            </Typography>
          </Box>
          <Chip
            label={`#${index + 1}`}
            size="small"
            color="primary"
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TopProducts;