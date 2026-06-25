// admin/src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Divider,
  Fade,
  Zoom,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ShoppingBag, 
  LocalShipping, 
  Receipt,
  ArrowForward,
  Home,
  Email,
  Phone,
} from '@mui/icons-material';

// ---------------------------------------------------------------------------
// AL-MALA — "Kraft & Ink" theme tokens
// ---------------------------------------------------------------------------
const KRAFT = {
  paper: '#D9BD93',
  paperLight: '#E7D3AE',
  paperDark: '#B99564',
  ink: '#211A12',
  cream: '#F4ECDC',
  bronze: '#8C5A2B',
};

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Trigger entrance animation
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!state) {
    navigate('/');
    return null;
  }

  const orderSteps = [
    {
      icon: <Receipt sx={{ fontSize: 24 }} />,
      title: 'Order Confirmed',
      description: 'Your order has been placed successfully',
      completed: true,
    },
    {
      icon: <LocalShipping sx={{ fontSize: 24 }} />,
      title: 'Processing',
      description: 'We are preparing your order',
      completed: false,
    },
    {
      icon: <ShoppingBag sx={{ fontSize: 24 }} />,
      title: 'Out for Delivery',
      description: 'Your package is on the way',
      completed: false,
    },
    {
      icon: <Home sx={{ fontSize: 24 }} />,
      title: 'Delivered',
      description: 'Package delivered to your doorstep',
      completed: false,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: KRAFT.cream,
        backgroundImage: `radial-gradient(rgba(33,26,18,0.03) 0.6px, transparent 0.6px)`,
        backgroundSize: '6px 6px',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Fade in={showContent} timeout={800}>
          <Box>
            {/* Success Icon with Animation */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Zoom in={showContent} timeout={600}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: KRAFT.paper,
                    border: `3px solid ${KRAFT.bronze}`,
                    mb: 2,
                    position: 'relative',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: '0 0 0 0 rgba(140,90,43,0.4)',
                      },
                      '70%': {
                        boxShadow: '0 0 0 20px rgba(140,90,43,0)',
                      },
                      '100%': {
                        boxShadow: '0 0 0 0 rgba(140,90,43,0)',
                      },
                    },
                  }}
                >
                  <CheckCircle sx={{ fontSize: 60, color: KRAFT.bronze }} />
                </Box>
              </Zoom>
            </Box>

            {/* Main Content Card */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: KRAFT.paper,
                border: `1px solid ${KRAFT.paperDark}`,
                borderRadius: '4px',
                p: { xs: 3, md: 6 },
                boxShadow: '0 12px 40px rgba(33,26,18,0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative corner accents */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  width: 30,
                  height: 30,
                  borderTop: `2px solid ${KRAFT.bronze}`,
                  borderLeft: `2px solid ${KRAFT.bronze}`,
                  opacity: 0.3,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 30,
                  height: 30,
                  borderTop: `2px solid ${KRAFT.bronze}`,
                  borderRight: `2px solid ${KRAFT.bronze}`,
                  opacity: 0.3,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  width: 30,
                  height: 30,
                  borderBottom: `2px solid ${KRAFT.bronze}`,
                  borderLeft: `2px solid ${KRAFT.bronze}`,
                  opacity: 0.3,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  width: 30,
                  height: 30,
                  borderBottom: `2px solid ${KRAFT.bronze}`,
                  borderRight: `2px solid ${KRAFT.bronze}`,
                  opacity: 0.3,
                }}
              />

              {/* Stamp-style eyebrow */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.5,
                    border: `1.5px solid ${KRAFT.bronze}`,
                    borderRadius: '999px',
                    px: 2,
                    py: 0.5,
                  }}
                >
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: KRAFT.bronze }} />
                  <Typography
                    variant="overline"
                    sx={{
                      color: KRAFT.bronze,
                      fontSize: '0.7rem',
                      letterSpacing: '0.25em',
                      lineHeight: 1,
                      fontWeight: 600,
                    }}
                  >
                    ORDER CONFIRMED
                  </Typography>
                </Box>
              </Box>

              {/* Thank You Message */}
              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  color: KRAFT.ink,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                  mb: 1,
                }}
              >
                Thank You, {state.customerName?.split(' ')[0] || 'Valued Customer'}!
              </Typography>

              <Typography
                variant="body1"
                align="center"
                sx={{
                  color: 'rgba(33,26,18,0.7)',
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  maxWidth: 500,
                  mx: 'auto',
                  fontStyle: 'italic',
                }}
              >
                Your order has been placed successfully. We'll send you shipping confirmation 
                and tracking information once your package is on its way.
              </Typography>

              {/* Order Details Box */}
              <Box
                sx={{
                  bgcolor: KRAFT.ink,
                  borderRadius: '4px',
                  p: 3,
                  mb: 4,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: KRAFT.paperDark,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: '0.7rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Order Number
                  </Typography>
                  <Typography
                    sx={{
                      color: KRAFT.paper,
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontWeight: 600,
                      fontSize: '1.2rem',
                    }}
                  >
                    #{state.orderId}
                  </Typography>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: KRAFT.bronze,
                    display: { xs: 'none', sm: 'block' },
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: KRAFT.paperDark,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: '0.7rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    sx={{
                      color: KRAFT.paper,
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontWeight: 700,
                      fontSize: '1.5rem',
                    }}
                  >
                    Rs.{state.total.toFixed(2)}
                  </Typography>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: KRAFT.bronze,
                    display: { xs: 'none', sm: 'block' },
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: KRAFT.paperDark,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: '0.7rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Payment Method
                  </Typography>
                  <Typography
                    sx={{
                      color: KRAFT.paper,
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    Cash on Delivery
                  </Typography>
                </Box>
              </Box>

              {/* Order Progress Steps */}
              <Box sx={{ mb: 5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontWeight: 600,
                    color: KRAFT.ink,
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  What's Next?
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  {orderSteps.map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        position: 'relative',
                        p: 2,
                        bgcolor: step.completed ? KRAFT.cream : 'transparent',
                        borderRadius: '4px',
                        border: step.completed ? `1px solid ${KRAFT.bronze}` : `1px dashed ${KRAFT.paperDark}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: KRAFT.cream,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          color: step.completed ? KRAFT.bronze : KRAFT.paperDark,
                          mb: 1,
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontFamily: '"Playfair Display", Georgia, serif',
                          fontWeight: 600,
                          color: KRAFT.ink,
                          mb: 0.5,
                          fontSize: '0.85rem',
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(33,26,18,0.6)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Contact Information */}
              <Box
                sx={{
                  bgcolor: KRAFT.cream,
                  borderRadius: '4px',
                  p: 3,
                  mb: 4,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontWeight: 600,
                    color: KRAFT.ink,
                    mb: 2,
                  }}
                >
                  A confirmation message has been sent to your phone number.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                    flexWrap: 'wrap',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: 16, color: KRAFT.bronze }} />
                    <Typography variant="body2" sx={{ color: KRAFT.ink }}>
                      +92 328 3601150
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Email sx={{ fontSize: 16, color: KRAFT.bronze }} />
                    <Typography variant="body2" sx={{ color: KRAFT.ink }}>
                      almalafragnance@gmail.com
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ShoppingBag />}
                  onClick={() => navigate('/collections')}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: '4px',
                    bgcolor: KRAFT.bronze,
                    color: KRAFT.cream,
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    border: `2px solid ${KRAFT.bronze}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: KRAFT.ink,
                      borderColor: KRAFT.ink,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(33,26,18,0.3)',
                    },
                  }}
                >
                  Continue Shopping
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/')}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: '4px',
                    borderColor: KRAFT.ink,
                    borderWidth: '2px',
                    color: KRAFT.ink,
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: KRAFT.ink,
                      color: KRAFT.cream,
                      borderColor: KRAFT.ink,
                      borderWidth: '2px',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(33,26,18,0.3)',
                    },
                  }}
                >
                  Back to Home
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default OrderConfirmation;