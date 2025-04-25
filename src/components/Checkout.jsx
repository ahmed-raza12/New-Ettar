import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Divider,
    Button,
    Card,
    CardContent,
    Grid,
    Avatar,
    IconButton,
    Checkbox
} from '@mui/material';
import {
    CreditCard,
    //   PayPal,
    Apple,
    Lock,
    Phone,
    Email,
    Spa
} from '@mui/icons-material';
import { getCart } from '../utils/cart';

const CheckoutForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        phone: '',
        saveInfo: false,
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });
    const [cartItems, setCartItems] = useState(getCart());
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        alert('Thank you for your purchase!');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
                        <Spa />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                        Essence Luxe
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
                                sx={{ mt: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
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
                                            src={item.image}
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
                                                ${item.price.toFixed(2)}
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
                                    <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
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
                                    ${total.toFixed(2)}
                                </Typography>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<Lock />}
                                onClick={handleSubmit}
                                sx={{
                                    bgcolor: 'primary.dark',
                                    '&:hover': { bgcolor: 'primary.main' },
                                    py: 1.5,
                                    mb: 2
                                }}
                            >
                                Complete Purchase
                            </Button>

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