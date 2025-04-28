// admin/src/pages/OrderConfirmation.jsx
import { Box, Typography, Button, Container } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate('/');
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
      <Typography variant="h3" gutterBottom>
        Thank you for your order!
      </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Order #{state.orderId}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        A confirmation has been sent to your number.
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Total: Rs.{state.total.toFixed(2)}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ px: 4, py: 2 }}
        >
          Continue Shopping
        </Button>
        {/* <Button 
          variant="outlined" 
          onClick={() => navigate(`/order-tracking/${state.orderId}`)}
          sx={{ px: 4, py: 2 }}
        >
          Track Order
        </Button> */}
      </Box>
    </Container>
  );
};

export default OrderConfirmation;