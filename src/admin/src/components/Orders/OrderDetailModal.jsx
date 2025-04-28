// admin/src/components/Orders/OrderDetailModal.jsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Avatar,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Paper,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
  Fade,
  styled,
  alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  LocalShipping,
  CreditCard,
  Home,
  Phone,
  Email,
  Close,
  Print,
  Receipt,
  CalendarToday,
  MoreVert
} from '@mui/icons-material';

// Styled components for premium look
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden'
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.primary.dark, 0.8)
    : alpha(theme.palette.primary.light, 0.1),
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 600,
  borderRadius: 8,
  padding: theme.spacing(0.5, 0),
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
}));

const ItemCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
  }
}));

const OrderDetailModal = ({ order, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    if (order) {
      setAnimateIn(true);
    }
  }, [order]);

  if (!order) return null;

  // Format date nicely
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Status color based on order status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <StyledDialog 
      open={!!order} 
      onClose={() => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
      }} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 400 }}
    >
      <StyledDialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Receipt color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Order #{order.id}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ borderRadius: 1 }}>
          <Close />
        </IconButton>
      </StyledDialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: theme.spacing(3) }}>
          <Grid container spacing={3}>
            {/* Order Status Banner */}
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 2,
                  mb: 3,
                  background: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.8)
                    : alpha(theme.palette.grey[50], 0.8),
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <CardContent sx={{ p: theme.spacing(2, 3) }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formattedDate} at {formattedTime}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                      <StyledChip
                        label={order.status.toUpperCase()}
                        color={getStatusColor(order.status)}
                        variant="filled"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Customer Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: 'primary.main' }}>Customer Details</Box>
              </Typography>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        mr: 2,
                        background: theme.palette.primary.main,
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    >
                      {order.customer.firstName.charAt(0)}{order.customer.lastName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {order.customer.firstName} {order.customer.lastName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Email fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {order.customer.email || 'No email provided'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <List disablePadding>
                    <ListItem disableGutters sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Home fontSize="small" color="action" />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="body2" color="text.secondary">Shipping Address</Typography>}
                        secondary={
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {order.customer.address}, {order.customer.city}
                          </Typography>
                        }
                        disableTypography
                      />
                    </ListItem>
                    
                    <ListItem disableGutters sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Phone fontSize="small" color="action" />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="body2" color="text.secondary">Phone</Typography>}
                        secondary={
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {order.customer.phone || 'No phone provided'}
                          </Typography>
                        }
                        disableTypography
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
  
            {/* Order Summary */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: 'primary.main' }}>Order Summary</Box>
              </Typography>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <List disablePadding>
                    <ListItem disableGutters sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <CreditCard fontSize="small" color="action" />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="body2" color="text.secondary">Payment Method</Typography>}
                        secondary={
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            Credit Card ending in {order.paymentDetails?.lastFour || '****'}
                          </Typography>
                        }
                        disableTypography
                      />
                    </ListItem>
                    
                    <ListItem disableGutters sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <LocalShipping fontSize="small" color="action" />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="body2" color="text.secondary">Shipping Method</Typography>}
                        secondary={
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {order.shippingMethod || 'Standard Shipping'}
                          </Typography>
                        }
                        disableTypography
                      />
                    </ListItem>
                    
                    {order.trackingNumber && (
                      <ListItem disableGutters sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar sx={{ minWidth: 36 }}>
                          <LocalShipping fontSize="small" color="action" />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={<Typography variant="body2" color="text.secondary">Tracking Number</Typography>}
                          secondary={
                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                              {order.trackingNumber}
                            </Typography>
                          }
                          disableTypography
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
  
            {/* Order Items */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Box sx={{ color: 'primary.main' }}>Order Items</Box>
                <Chip 
                  label={`${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}`} 
                  size="small" 
                  sx={{ 
                    ml: 1, 
                    fontWeight: 'normal',
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main'
                  }}
                />
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {order.items.map((item, index) => (
                  <Fade in key={index} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                    <ItemCard>
                      <Box sx={{ display: 'flex', width: '100%', flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box 
                          sx={{ 
                            width: { xs: '100%', sm: 80 }, 
                            height: { xs: 120, sm: 80 },
                            mr: { sm: 2 }, 
                            mb: { xs: 2, sm: 0 },
                            position: 'relative',
                            borderRadius: 1,
                            overflow: 'hidden',
                            background: alpha(theme.palette.grey[500], 0.1)
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={item.image || '/placeholder-product.png'}
                            alt={item.name}
                            sx={{ 
                              height: '100%',
                              width: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
                              {item.name}
                            </Typography>
                            
                            {item.variant && (
                              <Typography variant="body2" color="text.secondary">
                                {item.variant}
                              </Typography>
                            )}
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mt: { xs: 2, sm: 0 }
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              Qty: {item.quantity} × Rs.{item.price.toFixed(2)}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="600">
                              Rs.{(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </ItemCard>
                  </Fade>
                ))}
              </Box>
            </Grid>
  
            {/* Order Total */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 2, 
                mt: 2,
                background: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.primary.dark, 0.05)
                  : alpha(theme.palette.primary.light, 0.05),
              }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    width: '100%' 
                  }}>
                    <Box sx={{ 
                      width: { xs: '100%', sm: 300 },
                      backgroundColor: theme.palette.background.paper,
                      p: 2,
                      borderRadius: 1
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                        <Typography>Rs.{order.subtotal.toFixed(2)}</Typography>
                      </Box>
                      
                      {order.tax && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Tax:</Typography>
                          <Typography>Rs.{order.tax.toFixed(2)}</Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Shipping:</Typography>
                        <Typography>
                          {order.shippingCost ? `Rs.${order.shippingCost.toFixed(2)}` : 'Free'}
                        </Typography>
                      </Box>
                      
                      {order.discount && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Discount:</Typography>
                          <Typography color="error.main">
                            -Rs.{order.discount.toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">Total:</Typography>
                        <Typography variant="subtitle1" fontWeight="600" color="primary.main">
                          Rs.{order.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: theme.spacing(2, 3),
        borderTop: `1px solid ${theme.palette.divider}`,
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.6)
          : alpha(theme.palette.grey[50], 0.8),
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          size={isMobile ? "medium" : "large"}
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={() => {/* Print functionality */}}
          color="primary"
          size={isMobile ? "medium" : "large"}
          startIcon={<Print />}
          sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            }
          }}
        >
          Print Invoice
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default OrderDetailModal;