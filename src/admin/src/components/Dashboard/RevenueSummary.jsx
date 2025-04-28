// admin/src/components/Dashboard/RevenueSummary.jsx
import { Box, Paper, Typography } from '@mui/material';
import {
  AttachMoney as DollarIcon,
  CurrencyRupee as RupeeIcon,
  ShoppingBag as OrdersIcon,
  LocalBar as ProductsIcon,
  People as CustomersIcon
} from '@mui/icons-material';

const iconMap = {
  rupee: <RupeeIcon fontSize="large" />,
  orders: <OrdersIcon fontSize="large" />,
  products: <ProductsIcon fontSize="large" />,
  customers: <CustomersIcon fontSize="large" />
};

const RevenueSummary = ({ title, value, change, icon }) => {
  const formattedValue = title.includes('Revenue') 
    ? `Rs.${value.toLocaleString()}`
    : value.toLocaleString();

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h4" mt={1}>
            {formattedValue}
          </Typography>
          <Typography 
            variant="caption" 
            color={change >= 0 ? 'success.main' : 'error.main'}
            mt={0.5}
          >
            {change >= 0 ? '+' : ''}{change}% from last period
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            p: 2,
            borderRadius: '50%',
            color: 'accent.main',
          }}
        >
          {iconMap[icon]}
        </Box>
      </Box>
    </Paper>
  );
};

export default RevenueSummary;