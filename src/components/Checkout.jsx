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
    Checkbox
} from '@mui/material';
import {
    CreditCard,
    Lock,
    Phone,
    Email,
    Spa
} from '@mui/icons-material';
import { getCart } from '../utils/cart';
import { createOrder } from '../admin/src/services/orderService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const CheckoutForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
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


    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const errors = {};

        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        const phoneRegex = /^0\d{10}$/; // must start with 0 and have 11 digits

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Phone number must be like 03113209078';
        }
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
                    image: item.images[0]
                })),
                subtotal,
                total,
                status: 'pending',
                paymentMethod: 'credit_card' // You can make this dynamic
            };

            await createOrder(orderData);

            // Clear cart and redirect
            localStorage.removeItem('fragranceCart');
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        component="img"
                        src={logo}
                        alt="AL MALA Logo"
                        onClick={() => handleNavigation('home')}
                        sx={{
                            height: { xs: 60, md: 80 },
                            maxHeight: { xs: 80, md: 100 },
                            // height: 'auto',
                            width: 'auto',
                            cursor: 'pointer',
                            objectFit: 'cover',
                            maxWidth: '100%',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.20)'
                            }
                        }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                        AL MALA
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 1, width: 32, height: 32 }}>
                        <CreditCard fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Checkout</Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Left Column - Checkout Form */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                                Shipping Information
                            </Typography>

                            <Grid container spacing={2}>
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
                                sx={{ mt: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Apartment, suite, etc. (optional)"
                                name="apartment"
                                value={formData.apartment}
                                onChange={handleInputChange}
                                sx={{ mt: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                                error={Boolean(formErrors.city)}
                                sx={{ mt: 2 }}
                                helperText={formErrors.city}
                            />

                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                error={Boolean(formErrors.phone)}
                                helperText={formErrors.phone}
                                sx={{ mt: 2 }}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="saveInfo"
                                        checked={formData.saveInfo}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Save this information for next time"
                                sx={{ mt: 2 }}
                            />
                        </CardContent>
                    </Card>
                </Grid >

                {/* Right Column - Order Summary */}
                < Grid item xs={12} md={4} >
                    <Card sx={{ position: 'sticky', top: 16 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                                Order Summary
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                {cartItems.map(item => (
                                    <Box key={item.id} sx={{ display: 'flex', mb: 2, p: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                                        <Avatar
                                            src={item.images[0]}
                                            variant="rounded"
                                            sx={{ width: 60, height: 60, mr: 2 }}
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                Rs.{item.price.toFixed(2)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Qty: {item.quantity}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Subtotal</Typography>
                                    <Typography variant="body1">Rs.{subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Shipping</Typography>
                                    <Typography variant="body1">Free</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                                    Rs.{total.toFixed(2)}
                                </Typography>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{
                                    bgcolor: 'primary.dark',
                                    '&:hover': { bgcolor: 'primary.main' },
                                    py: 1.5,
                                    mb: 2
                                }}
                            >
                                {loading ? 'Processing...' : 'Complete Purchase'}
                            </Button>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                                By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Need Help?</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">+1 (800) 123-4567</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">support@essenceluxe.com</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid >
            </Grid >
        </Container >
    );
};

export default CheckoutForm;