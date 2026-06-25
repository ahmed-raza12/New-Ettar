import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
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

// ---------------------------------------------------------------------------
// AL-MALA — "Kraft & Ink" theme tokens (matches the packaging box exactly)
// ---------------------------------------------------------------------------
const KRAFT = {
    paper: '#D9BD93',
    paperLight: '#E7D3AE',
    paperDark: '#B99564',
    ink: '#211A12',
    cream: '#F4ECDC',
    bronze: '#8C5A2B',
};

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
    fontFamily: '"Playfair Display", Georgia, serif',
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
    color: KRAFT.cream,
    fontFamily: '"Playfair Display", Georgia, serif',
    cursor: 'pointer',
    letterSpacing: '0.04em',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 0,
        height: '1px',
        bottom: -4,
        left: 0,
        backgroundColor: KRAFT.bronze,
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
        fontSize: '0.625rem',
        backgroundColor: '#8C5A2B',
        color: '#F4ECDC'
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

    const removeItem = (id) => {
        const updatedCart = removeFromCart(id);
        setCartItems(updatedCart);
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = updateCartItem(id, newQuantity);
        setCartItems(updatedCart);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleNavigation = (sectionId) => {
        setMobileMenuOpen(false);
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
            {/* Announcement bar — bronze stamp-ink stripe, like the foil line on the box */}
            <AnnouncementBar sx={{
                backgroundColor: KRAFT.bronze,
                color: KRAFT.cream,
                fontSize: '0.70rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
            }}>
                Al-Mala Fragrance is your destination for luxury perfumes at budget-friendly prices.
            </AnnouncementBar>

            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: KRAFT.ink,
                    borderBottom: `1px solid ${KRAFT.bronze}`,
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
                            <IconButton sx={{ color: KRAFT.cream }} onClick={toggleMobileMenu}>
                                {mobileMenuOpen ? <Close /> : <Menu />}
                            </IconButton>
                        </Box>

                        {/* Logo */}
                        <Box
                            component="img"
                            src={logo}
                            alt="AL MALA Logo"
                            onClick={() => handleNavigation('home')}
                            sx={{
                                height: { xs: 40, md: 60 },
                                maxHeight: { xs: 60, md: 80 },
                                width: 'auto',
                                cursor: 'pointer',
                                objectFit: 'cover',
                                maxWidth: '100%',
                                transition: 'transform 0.3s ease',
                                transform: 'scale(1.20)',
                                '&:hover': {
                                    transform: 'scale(1.20)'
                                }
                            }}
                        />

                        {/* Right Navigation - Desktop */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 4,
                            alignItems: 'center'
                        }}>
                            <NavLink onClick={() => handleNavigation('stories')}>Stories</NavLink>
                            <NavLink onClick={() => handleNavigation('contact')}>Contact</NavLink>

                            <IconButton sx={{ color: KRAFT.cream }} onClick={toggleCart}>
                                <CartBadge
                                    badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)}
                                >
                                    <ShoppingBag />
                                </CartBadge>
                            </IconButton>
                        </Box>

                        {/* Cart Icon - Mobile */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <IconButton sx={{ color: KRAFT.cream }} onClick={toggleCart}>
                                <CartBadge
                                    badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)}
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
                                        color: KRAFT.cream,
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItem>
                            <Divider sx={{ borderColor: 'rgba(244,236,220,0.15)' }} />

                            <ListItem button onClick={() => handleNavigation('contact')}>
                                <ListItemText
                                    primary="Contact"
                                    primaryTypographyProps={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.875rem',
                                        color: KRAFT.cream,
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItem>
                            <Divider sx={{ borderColor: 'rgba(244,236,220,0.15)' }} />

                            <ListItem button onClick={() => handleNavigation('stories')}>
                                <ListItemText
                                    primary="Stories"
                                    primaryTypographyProps={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.875rem',
                                        color: KRAFT.cream,
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItem>
                            <Divider sx={{ borderColor: 'rgba(244,236,220,0.15)' }} />

                            <ListItem button onClick={() => handleNavigation('products')}>
                                <ListItemText
                                    primary="Products"
                                    primaryTypographyProps={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.875rem',
                                        color: KRAFT.cream,
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItem>
                        </List>
                    </MobileMenu>
                </Container>
            </AppBar>

            {/* Cart Drawer — recolored to read like the inside of the box: cream stock, ink type, bronze accents */}
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
                        backgroundColor: KRAFT.cream,
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
                        borderBottom: `1px solid ${KRAFT.paperDark}`,
                        position: 'sticky',
                        top: 0,
                        bgcolor: KRAFT.cream,
                        zIndex: 1
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            fontFamily: '"Playfair Display", Georgia, serif',
                            color: KRAFT.ink
                        }}>
                            Your Cart ({cartItems.length})
                        </Typography>
                        <IconButton onClick={toggleCart} size="small" sx={{ color: KRAFT.ink }}>
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
                            background: KRAFT.paperLight,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: KRAFT.paperDark,
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
                                <ShoppingBag sx={{ fontSize: 48, color: KRAFT.paperDark, mb: 2 }} />
                                <Typography variant="body1" sx={{ mb: 1, color: KRAFT.ink }}>Your cart is empty</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={toggleCart}
                                    sx={{
                                        mt: 2,
                                        borderColor: KRAFT.ink,
                                        color: KRAFT.ink,
                                        borderRadius: '2px',
                                        '&:hover': {
                                            bgcolor: KRAFT.ink,
                                            color: KRAFT.cream,
                                            borderColor: KRAFT.ink
                                        }
                                    }}
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
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 70,
                                                        height: 70,
                                                        border: `1px solid ${KRAFT.paperDark}`,
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
                                                            fontWeight: 600,
                                                            fontSize: '0.95rem',
                                                            color: KRAFT.ink,
                                                            fontFamily: '"Playfair Display", Georgia, serif'
                                                        }}
                                                        secondaryTypographyProps={{ fontSize: '0.8rem', color: 'rgba(33,26,18,0.6)' }}
                                                    />
                                                    <IconButton
                                                        onClick={() => removeItem(item.id)}
                                                        size="small"
                                                        sx={{
                                                            ml: 1,
                                                            alignSelf: 'flex-start',
                                                            color: KRAFT.bronze
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
                                                        border: `1px solid ${KRAFT.paperDark}`,
                                                        borderRadius: '2px'
                                                    }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            sx={{ p: 0.5, color: KRAFT.ink }}
                                                        >
                                                            <Remove fontSize="small" />
                                                        </IconButton>
                                                        <Typography sx={{ px: 1, color: KRAFT.ink }}>{item.quantity}</Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            sx={{ p: 0.5, color: KRAFT.ink }}
                                                        >
                                                            <Add fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                    <Typography variant="body1" fontWeight={600} sx={{ color: KRAFT.ink }}>
                                                        Rs.{(item.discountedPrice * item.quantity).toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                        <Divider sx={{ my: 1, borderStyle: 'dashed', borderColor: KRAFT.paperDark }} />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>

                    {/* Cart Footer - Sticky */}
                    {cartItems.length > 0 && (
                        <Box sx={{
                            p: 2,
                            borderTop: `1px solid ${KRAFT.paperDark}`,
                            position: 'sticky',
                            bottom: 0,
                            bgcolor: KRAFT.cream
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1
                            }}>
                                <Typography variant="subtitle1" sx={{ color: KRAFT.ink }}>Subtotal</Typography>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ color: KRAFT.ink }}>
                                    Rs.{subtotal.toFixed(2)}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{
                                mb: 2,
                                fontSize: '0.75rem',
                                color: 'rgba(33,26,18,0.6)'
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
                                    backgroundColor: KRAFT.ink,
                                    borderRadius: '2px',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    '&:hover': { backgroundColor: KRAFT.bronze },
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
                                    color: KRAFT.ink,
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