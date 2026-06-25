import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    FormControlLabel,
    Divider,
    Button,
    Card, Alert,
    CircularProgress,
    CardContent,
    Grid,
    Avatar,
    Checkbox,
    Breadcrumbs,
    Link as MuiLink,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    CreditCard,
    Lock,
    Phone,
    Email,
    Spa,
    ShoppingBag,
    LocalShipping,
    Payment,
    CheckCircle,
    ArrowBack,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getCart } from '../utils/cart';
import { createOrder } from '../admin/src/services/orderService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

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

const CheckoutForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        phone: '',
        saveInfo: false,
    });
    const [cartItems, setCartItems] = useState(getCart());

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/');
        }
    }, [cartItems, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const steps = ['Shopping Cart', 'Shipping Details', 'Payment'];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        
        const phoneRegex = /^0\d{10}$/;
        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Phone number must be like 03113209078';
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setLoading(false);
            return;
        }

        setFormErrors({});

        try {
            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    apartment: formData.apartment,
                    city: formData.city,
                    phone: formData.phone,
                    saveInfo: formData.saveInfo
                },
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    discountedPrice: item.discountedPrice,
                    image: item.images[0]
                })),
                subtotal,
                shipping,
                total,
                status: 'pending',
                paymentMethod: 'cod' // Cash on delivery
            };

            await createOrder(orderData);

            // Clear cart and redirect
            localStorage.removeItem('fragranceCart');
            window.dispatchEvent(new Event('cartUpdated'));
            
            navigate('/order-confirmation', {
                state: {
                    orderId: orderData.id,
                    customerName: `${formData.firstName} ${formData.lastName}`,
                    total: orderData.total
                }
            });
        } catch (err) {
            setError('Failed to place order. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            bgcolor: KRAFT.cream, 
            minHeight: '100vh',
            backgroundImage: `radial-gradient(rgba(33,26,18,0.03) 0.6px, transparent 0.6px)`,
            backgroundSize: '6px 6px',
        }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                {/* Header with Logo */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 3,
                    borderBottom: `2px solid ${KRAFT.paperDark}`,
                }}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/')}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="AL MALA Logo"
                            sx={{
                                height: { xs: 50, md: 65 },
                                width: 'auto',
                                objectFit: 'contain',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.08)'
                                }
                            }}
                        />
                        <Box sx={{ ml: 1 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontFamily: '"Playfair Display", Georgia, serif',
                                    fontWeight: 700,
                                    color: KRAFT.ink,
                                    lineHeight: 1.2,
                                }}
                            >
                                AL MALA
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: KRAFT.bronze,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Fragrance
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: KRAFT.paper,
                        px: 2,
                        py: 1,
                        borderRadius: '4px',
                        border: `1px solid ${KRAFT.paperDark}`,
                    }}>
                        <Lock sx={{ fontSize: 16, color: KRAFT.bronze }} />
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: KRAFT.ink,
                                fontFamily: '"Playfair Display", Georgia, serif',
                                fontWeight: 500,
                                fontSize: '0.85rem',
                            }}
                        >
                            Secure Checkout
                        </Typography>
                    </Box>
                </Box>

                {/* Breadcrumbs */}
                <Breadcrumbs 
                    aria-label="breadcrumb"
                    sx={{ 
                        mb: 4,
                        '& .MuiBreadcrumbs-separator': {
                            color: KRAFT.paperDark,
                        }
                    }}
                >
                    <MuiLink
                        component={Link}
                        to="/"
                        underline="hover"
                        sx={{ 
                            color: KRAFT.bronze,
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontSize: '0.85rem',
                            '&:hover': { color: KRAFT.ink }
                        }}
                    >
                        Home
                    </MuiLink>
                    <MuiLink
                        component={Link}
                        to="/collections"
                        underline="hover"
                        sx={{ 
                            color: KRAFT.bronze,
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontSize: '0.85rem',
                            '&:hover': { color: KRAFT.ink }
                        }}
                    >
                        Collections
                    </MuiLink>
                    <Typography 
                        sx={{ 
                            color: KRAFT.ink,
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                        }}
                    >
                        Checkout
                    </Typography>
                </Breadcrumbs>

                <Grid container spacing={4}>
                    {/* Left Column - Checkout Form */}
                    <Grid item xs={12} md={8}>
                        <Card 
                            sx={{ 
                                bgcolor: KRAFT.paper,
                                border: `1px solid ${KRAFT.paperDark}`,
                                borderRadius: '4px',
                                boxShadow: '0 8px 24px rgba(33,26,18,0.1)',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                {/* Stamp-style section header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: KRAFT.bronze,
                                        }}
                                    />
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            fontWeight: 700,
                                            color: KRAFT.ink,
                                            fontSize: { xs: '1.3rem', md: '1.5rem' },
                                        }}
                                    >
                                        Shipping Information
                                    </Typography>
                                </Box>

                                <Grid container spacing={2.5}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            error={Boolean(formErrors.firstName)}
                                            helperText={formErrors.firstName}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: KRAFT.cream,
                                                    borderRadius: '4px',
                                                    fontFamily: '"Playfair Display", Georgia, serif',
                                                    '& fieldset': {
                                                        borderColor: KRAFT.paperDark,
                                                        borderWidth: '1.5px',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: KRAFT.bronze,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: KRAFT.bronze,
                                                        borderWidth: '2px',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: KRAFT.ink,
                                                    fontFamily: '"Playfair Display", Georgia, serif',
                                                    '&.Mui-focused': {
                                                        color: KRAFT.bronze,
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            error={Boolean(formErrors.lastName)}
                                            helperText={formErrors.lastName}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: KRAFT.cream,
                                                    borderRadius: '4px',
                                                    fontFamily: '"Playfair Display", Georgia, serif',
                                                    '& fieldset': {
                                                        borderColor: KRAFT.paperDark,
                                                        borderWidth: '1.5px',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: KRAFT.bronze,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: KRAFT.bronze,
                                                        borderWidth: '2px',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: KRAFT.ink,
                                                    fontFamily: '"Playfair Display", Georgia, serif',
                                                    '&.Mui-focused': {
                                                        color: KRAFT.bronze,
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    error={Boolean(formErrors.address)}
                                    helperText={formErrors.address}
                                    sx={{
                                        mt: 2.5,
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: KRAFT.cream,
                                            borderRadius: '4px',
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            '& fieldset': {
                                                borderColor: KRAFT.paperDark,
                                                borderWidth: '1.5px',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: KRAFT.bronze,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: KRAFT.bronze,
                                                borderWidth: '2px',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: KRAFT.ink,
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            '&.Mui-focused': {
                                                color: KRAFT.bronze,
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Apartment, suite, etc. (optional)"
                                    name="apartment"
                                    value={formData.apartment}
                                    onChange={handleInputChange}
                                    sx={{
                                        mt: 2.5,
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: KRAFT.cream,
                                            borderRadius: '4px',
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            '& fieldset': {
                                                borderColor: KRAFT.paperDark,
                                                borderWidth: '1.5px',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: KRAFT.bronze,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: KRAFT.bronze,
                                                borderWidth: '2px',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: KRAFT.ink,
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            '&.Mui-focused': {
                                                color: KRAFT.bronze,
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    error={Boolean(formErrors.city)}
                                    helperText={formErrors.city}
                                    sx={{
                                        mt: 2.5,
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: KRAFT.cream,
                                            borderRadius: '4px',
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            '& fieldset': {
                                                borderColor: KRAFT.paperDark,
                                                borderWidth: '1.5px',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: KRAFT.bronze,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: KRAFT.bronze,
                                                borderWidth: '2px',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: KRAFT.ink,
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            '&.Mui-focused': {
                                                color: KRAFT.bronze,
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    error={Boolean(formErrors.phone)}
                                    helperText={formErrors.phone || 'Format: 03113209078'}
                                    sx={{
                                        mt: 2.5,
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: KRAFT.cream,
                                            borderRadius: '4px',
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            '& fieldset': {
                                                borderColor: KRAFT.paperDark,
                                                borderWidth: '1.5px',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: KRAFT.bronze,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: KRAFT.bronze,
                                                borderWidth: '2px',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: KRAFT.ink,
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            '&.Mui-focused': {
                                                color: KRAFT.bronze,
                                            },
                                        },
                                    }}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="saveInfo"
                                            checked={formData.saveInfo}
                                            onChange={handleInputChange}
                                            sx={{
                                                color: KRAFT.paperDark,
                                                '&.Mui-checked': {
                                                    color: KRAFT.bronze,
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography sx={{ 
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            color: KRAFT.ink,
                                            fontSize: '0.9rem',
                                        }}>
                                            Save this information for next time
                                        </Typography>
                                    }
                                    sx={{ mt: 3 }}
                                />
                            </CardContent>
                        </Card>

                        {/* Back to shopping button */}
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate('/collections')}
                            sx={{
                                mt: 3,
                                color: KRAFT.bronze,
                                fontFamily: '"Playfair Display", Georgia, serif',
                                '&:hover': {
                                    bgcolor: 'rgba(140,90,43,0.08)',
                                },
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Grid>

                    {/* Right Column - Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Card 
                            sx={{ 
                                position: 'sticky', 
                                top: 24,
                                bgcolor: KRAFT.paper,
                                border: `1px solid ${KRAFT.paperDark}`,
                                borderRadius: '4px',
                                boxShadow: '0 8px 24px rgba(33,26,18,0.12)',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                {/* Order Summary Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <ShoppingBag sx={{ color: KRAFT.bronze, fontSize: 20 }} />
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            fontWeight: 700,
                                            color: KRAFT.ink,
                                        }}
                                    >
                                        Order Summary
                                    </Typography>
                                </Box>

                                {/* Cart Items */}
                                <Box sx={{ mb: 3 }}>
                                    {cartItems.map((item, index) => (
                                        <Box 
                                            key={item.id} 
                                            sx={{ 
                                                display: 'flex', 
                                                mb: 2, 
                                                p: 1.5,
                                                bgcolor: KRAFT.cream,
                                                borderRadius: '4px',
                                                border: `1px solid ${KRAFT.paperDark}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': { 
                                                    bgcolor: KRAFT.paperLight,
                                                    transform: 'translateX(4px)',
                                                },
                                            }}
                                        >
                                            <Avatar
                                                src={item.images[0]}
                                                variant="rounded"
                                                sx={{ 
                                                    width: 60, 
                                                    height: 60, 
                                                    mr: 2,
                                                    border: `1px solid ${KRAFT.paperDark}`,
                                                }}
                                            />
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        color: KRAFT.ink,
                                                        fontFamily: '"Playfair Display", Georgia, serif',
                                                        fontSize: '0.9rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {item.name}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{
                                                        color: 'rgba(33,26,18,0.6)',
                                                        display: 'block',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    Qty: {item.quantity}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right', ml: 1 }}>
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        color: KRAFT.ink,
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    Rs.{(item.discountedPrice * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Price Breakdown */}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        mb: 1.5,
                                        pb: 1,
                                    }}>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ color: 'rgba(33,26,18,0.7)' }}
                                        >
                                            Subtotal
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ color: KRAFT.ink, fontWeight: 500 }}
                                        >
                                            Rs.{subtotal.toFixed(2)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        pb: 1,
                                    }}>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ color: 'rgba(33,26,18,0.7)' }}
                                        >
                                            Shipping
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                color: '#2E7D32',
                                                fontWeight: 500,
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            Free
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ 
                                    my: 2,
                                    borderStyle: 'dashed',
                                    borderColor: KRAFT.paperDark,
                                }} />

                                {/* Total */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    mb: 3,
                                    bgcolor: KRAFT.ink,
                                    mx: -1,
                                    px: 1,
                                    py: 2,
                                    borderRadius: '4px',
                                }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: KRAFT.cream,
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                        }}
                                    >
                                        Total
                                    </Typography>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: KRAFT.paper,
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                        }}
                                    >
                                        Rs.{total.toFixed(2)}
                                    </Typography>
                                </Box>

                                {/* Place Order Button */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={loading ? <CircularProgress size={20} sx={{ color: KRAFT.cream }} /> : <Lock />}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{
                                        bgcolor: KRAFT.bronze,
                                        color: KRAFT.cream,
                                        borderRadius: '4px',
                                        py: 1.75,
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontSize: '0.95rem',
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
                                        '&:disabled': {
                                            bgcolor: KRAFT.paperDark,
                                            borderColor: KRAFT.paperDark,
                                        },
                                    }}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </Button>

                                {error && (
                                    <Alert 
                                        severity="error" 
                                        sx={{ 
                                            mt: 2,
                                            bgcolor: 'transparent',
                                            border: `1px solid #d32f2f`,
                                            color: '#d32f2f',
                                            borderRadius: '4px',
                                            '& .MuiAlert-icon': {
                                                color: '#d32f2f',
                                            },
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                {/* Terms */}
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        textAlign: 'center', 
                                        display: 'block',
                                        mt: 2,
                                        color: 'rgba(33,26,18,0.6)',
                                        fontStyle: 'italic',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                                </Typography>

                                <Divider sx={{ 
                                    my: 3,
                                    borderStyle: 'dashed',
                                    borderColor: KRAFT.paperDark,
                                }} />

                                {/* Contact Support */}
                                <Box>
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            mb: 2,
                                            color: KRAFT.ink,
                                            fontFamily: '"Playfair Display", Georgia, serif',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        Need Assistance?
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 1.5,
                                        p: 1,
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: KRAFT.cream,
                                        },
                                    }}>
                                        <Box sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            bgcolor: KRAFT.cream,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 1.5,
                                            border: `1px solid ${KRAFT.paperDark}`,
                                        }}>
                                            <Phone sx={{ fontSize: 16, color: KRAFT.bronze }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'rgba(33,26,18,0.5)', display: 'block' }}>
                                                Phone
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: KRAFT.ink, fontWeight: 500 }}>
                                                +92 328 3601150
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 1,
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: KRAFT.cream,
                                        },
                                    }}>
                                        <Box sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            bgcolor: KRAFT.cream,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 1.5,
                                            border: `1px solid ${KRAFT.paperDark}`,
                                        }}>
                                            <Email sx={{ fontSize: 16, color: KRAFT.bronze }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'rgba(33,26,18,0.5)', display: 'block' }}>
                                                Email
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: KRAFT.ink, fontWeight: 500 }}>
                                                almalafragnance@gmail.com
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CheckoutForm;