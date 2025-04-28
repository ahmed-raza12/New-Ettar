import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Badge,
    Container,
    Divider,
    Button,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    Drawer, ListItemAvatar, Avatar,
    useTheme
} from '@mui/material';
import {
    Menu,
    Close, Add, Remove, Delete,
    ShoppingBag,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { getCart, removeFromCart, updateCartItem } from '../utils/cart';
import { useNavigate } from 'react-router-dom';

const AnnouncementBar = styled('div')({
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    padding: '8px 0',
    fontSize: '0.70rem',
    '@media (min-width: 600px)': {
        fontSize: '0.875rem'
    }
});

const LogoText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Playfair Display',
    fontWeight: 700,
    letterSpacing: '0.1em',
    fontSize: '1.5rem',
    [theme.breakpoints.up('md')]: {
        fontSize: '1.75rem'
    }
}));

const NavLink = styled(Typography)({
    position: 'relative',
    textTransform: 'uppercase',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#000',
    fontFamily: 'Playfair Display',
    cursor: 'pointer',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 0,
        height: '1px',
        bottom: 0,
        left: 0,
        backgroundColor: '#d1a570',
        transition: 'width 0.3s ease'
    },
    '&:hover:after': {
        width: '100%'
    }
});

const CartBadge = styled(Badge)({
    '& .MuiBadge-badge': {
        top: -5,
        right: -8,
        width: 18,
        height: 18,
        fontSize: '0.625rem'
    }
});

const MobileMenu = styled(Box)({
    maxHeight: 0,
    overflow: 'hidden',
    transition: 'max-height 0.5s ease-out',
    '&.open': {
        maxHeight: 500
    }
});

const Header = () => {
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [cartItems, setCartItems] = useState(getCart());

    useEffect(() => {
        const handleCartUpdate = () => {
            setCartItems(getCart());
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const toggleCart = () => {
        setCartOpen(!cartOpen);
    };

    // Update your removeItem and updateQuantity functions:
    const removeItem = (id) => {
        const updatedCart = removeFromCart(id);
        setCartItems(updatedCart);
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = updateCartItem(id, newQuantity);
        setCartItems(updatedCart);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleNavigation = (sectionId) => {
        setMobileMenuOpen(false); // Close mobile menu when navigating
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <>
            <AnnouncementBar>
                Free countrywide shipping on orders | 30-day returns
            </AnnouncementBar>

            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    zIndex: 1200
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0'
                    }}>
                        {/* Left Navigation - Desktop */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                            <NavLink onClick={() => handleNavigation('home')}>Home</NavLink>
                            <NavLink onClick={() => handleNavigation('products')}>Products</NavLink>
                        </Box>

                        {/* Mobile Menu Button */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <IconButton onClick={toggleMobileMenu}>
                                {mobileMenuOpen ? <Close /> : <Menu />}
                            </IconButton>
                        </Box>

                        {/* Logo */}
                        <Box sx={{
                            flex: 1,
                            textAlign: 'center',
                            [theme.breakpoints.up('md')]: {
                                flex: 'none',
                                width: 'auto'
                            }
                        }}>
                            <LogoText
                                component="a"
                                color='black'
                                fontSize={{ xs: '0.855rem', md: '1.75rem' }}
                                onClick={() => handleNavigation('home')}
                                sx={{ cursor: 'pointer' }}
                            >
                                𝒰 𝒟𝐼𝒩 𝐹𝑅𝒜𝒢𝑅𝒜𝒩𝒞𝐸
                            </LogoText>
                        </Box>

                        {/* Right Navigation - Desktop */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 4,
                            alignItems: 'center'
                        }}>
                            <NavLink onClick={() => handleNavigation('stories')}>Stories</NavLink>
                            <NavLink onClick={() => handleNavigation('contact')}>Contact</NavLink>

                            {/* Update both cart icons in the header */}
                            <IconButton onClick={toggleCart}>
                                <CartBadge
                                    badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)}
                                    color="primary"
                                >
                                    <ShoppingBag />
                                </CartBadge>
                            </IconButton>
                        </Box>

                        {/* Cart Icon - Mobile */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <IconButton onClick={toggleCart}>
                                <CartBadge
                                    badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)}
                                    color="primary"
                                >
                                    <ShoppingBag />
                                </CartBadge>
                            </IconButton>
                        </Box>
                    </Toolbar>

                    {/* Mobile Menu */}
                    <MobileMenu className={mobileMenuOpen ? 'open' : ''}>
                        <List>
                            <ListItem button onClick={() => handleNavigation('home')}>
                                <ListItemText
                                    primary="Shop"
                                    primaryTypographyProps={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.875rem',
                                        color: '#000',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItem>
                            <Divider />

                            <ListItem button onClick={() => handleNavigation('contact')}>
                                <ListItemText
                                    primary="Contact"
                                    primaryTypographyProps={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.875rem',
                                        color: '#000',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItem>
                            <Divider />

                            <ListItem button onClick={() => handleNavigation('stories')}>
                                <ListItemText
                                    primary="Stories"
                                    primaryTypographyProps={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.875rem',
                                        color: '#000',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItem>
                            <Divider />

                            <ListItem button onClick={() => handleNavigation('products')}>
                                <ListItemText
                                    primary="Products"
                                    primaryTypographyProps={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.875rem',
                                        color: '#000',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItem>
                        </List>
                    </MobileMenu>
                </Container>
            </AppBar>
            <Drawer
                anchor="right"
                open={cartOpen}
                onClose={toggleCart}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '100%', sm: 420 },
                        maxWidth: '100vw',
                        boxSizing: 'border-box',
                        height: '100%',
                        overflow: 'hidden',
                    },
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden'
                }}>
                    {/* Cart Header - Sticky */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        position: 'sticky',
                        top: 0,
                        bgcolor: 'background.paper',
                        zIndex: 1
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                            Your Cart ({cartItems.length})
                        </Typography>
                        <IconButton onClick={toggleCart} size="small">
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Cart Items - Scrollable */}
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 2,
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: theme.palette.grey[100],
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: theme.palette.grey[400],
                            borderRadius: '2px',
                        }
                    }}>
                        {cartItems.length === 0 ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                textAlign: 'center',
                                p: 3
                            }}>
                                <ShoppingBag sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="body1" sx={{ mb: 1 }}>Your cart is empty</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={toggleCart}
                                    sx={{ mt: 2 }}
                                >
                                    Continue Shopping
                                </Button>
                            </Box>
                        ) : (
                            <List disablePadding>
                                {cartItems.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <ListItem
                                            sx={{
                                                p: 1,
                                                alignItems: 'flex-start',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    transition: 'transform 0.3s ease'
                                                }
                                            }}
                                        >
                                            <ListItemAvatar sx={{ minWidth: 80 }}>
                                                <Avatar
                                                    src={item.image}
                                                    alt={item.name}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 70,
                                                        height: 70,
                                                        [theme.breakpoints.down('sm')]: {
                                                            width: 60,
                                                            height: 60
                                                        }
                                                    }}
                                                />
                                            </ListItemAvatar>
                                            <Box sx={{
                                                flex: 1,
                                                ml: 1,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start'
                                                }}>
                                                    <ListItemText
                                                        primary={item.name}
                                                        secondary={item.description}
                                                        primaryTypographyProps={{
                                                            fontWeight: 'medium',
                                                            fontSize: '0.95rem'
                                                        }}
                                                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                                    />
                                                    <IconButton
                                                        onClick={() => removeItem(item.id)}
                                                        size="small"
                                                        sx={{
                                                            ml: 1,
                                                            alignSelf: 'flex-start'
                                                        }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 1
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 1
                                                    }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            sx={{ p: 0.5 }}
                                                        >
                                                            <Remove fontSize="small" />
                                                        </IconButton>
                                                        <Typography sx={{ px: 1 }}>{item.quantity}</Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            sx={{ p: 0.5 }}
                                                        >
                                                            <Add fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        Rs.{(item.price * item.quantity).toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                        <Divider sx={{ my: 1 }} />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>

                    {/* Cart Footer - Sticky */}
                    {cartItems.length > 0 && (
                        <Box sx={{
                            p: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            position: 'sticky',
                            bottom: 0,
                            bgcolor: 'background.paper'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1
                            }}>
                                <Typography variant="subtitle1">Subtotal</Typography>
                                <Typography variant="subtitle1" fontWeight="medium">
                                    Rs.{subtotal.toFixed(2)}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{
                                mb: 2,
                                fontSize: '0.75rem'
                            }}>
                                Shipping and taxes calculated at checkout.
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={() => navigate('check-out')}
                                sx={{
                                    py: 1.5,
                                    backgroundColor: 'black',
                                    '&:hover': { backgroundColor: 'grey.800' },
                                    fontSize: '0.9rem'
                                }}
                            >
                                Checkout
                            </Button>
                            <Button
                                fullWidth
                                variant="text"
                                size="small"
                                onClick={toggleCart}
                                sx={{
                                    mt: 1,
                                    color: 'text.primary',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Continue Shopping
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default Header;