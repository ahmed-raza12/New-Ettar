import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Badge,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    IconButton,
    Select,
    MenuItem,
    Chip,
    Alert, AlertTitle,
    Pagination,
    Divider,
    List,
    ListItem,
    ListItemText, Snackbar,
    Drawer, ListItemAvatar, Avatar,
    useTheme,
    useMediaQuery,
    Breadcrumbs,
    Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
    FavoriteBorder,
    Star,
    CheckCircleSharp,
    ShoppingBagOutlined as CartIcon,
    StarHalf,
    StarBorder,
    ChevronLeft,
    ChevronRight
} from '@mui/icons-material';
import { styled } from '@mui/system';
import {
    Menu,
    Close, Add, Remove, Delete,
    ShoppingBag,
} from '@mui/icons-material';
import { getCart, removeFromCart, updateCartItem, addToCart } from '../utils/cart';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../admin/src/services/productService';
import heroImage from '../assets/hero.jpg';
import logo from '../assets/logo.png';

const LogoText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Playfair Display',
    fontWeight: 700,
    letterSpacing: '0.1em',
    fontSize: '1.5rem',
    [theme.breakpoints.up('md')]: {
        fontSize: '1.75rem'
    }
}));

const CartBadge = styled(Badge)({
    '& .MuiBadge-badge': {
        top: -5,
        right: -8,
        width: 18,
        height: 18,
        fontSize: '0.625rem'
    }
});
// Generate breadcrumb structured data
const generateBreadcrumbData = () => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
        {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://almalafragrance.com/'
        },
        {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Collections',
            'item': 'https://almalafragrance.com/collections'
        }
    ]
});

// Generate product list structured data
const generateProductListData = (products) => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': products.map((product, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
            '@type': 'Product',
            'name': product.name,
            'url': `https://almalafragrance.com/products/${product.id}`,
            'image': product.imageUrl || 'https://almalafragrance.com/placeholder.jpg',
            'description': product.description || 'Premium fragrance from AlMala Fragrance',
            'brand': {
                '@type': 'Brand',
                'name': 'AlMala Fragrance'
            },
            'offers': {
                '@type': 'Offer',
                'price': product.price,
                'priceCurrency': 'PKR',
                'availability': product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            }
        }
    }))
});

const ProductsPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [page, setPage] = useState(1);
    const [cartItems, setCartItems] = useState(getCart());
    const [cartOpen, setCartOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = getProducts((data) => {
            setProducts(data);
            setLoading(false);
        }, (error) => {
            setError('Failed to load products');
            setLoading(false);
            console.error(error);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        const handleCartUpdate = () => {
            setCartItems(getCart());
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const handleAddToCart = (product) => {
        const updatedCart = addToCart(product);
        setSnackbarOpen(true);
        // Notify other components (like Header) about the cart update
        window.dispatchEvent(new Event('cartUpdated'));
    };

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

    const subtotal = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    const filteredProducts = products.filter(product => {
        if (filter === 'all') return true;
        if (filter === 'best') return product.isBestSeller;
        return product.category === filter;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return b.id - a.id;
            case 'best':
                return (b.isBestSeller - a.isBestSeller) || (b.rating - a.rating);
            default:
                return 0;
        }
    });

    const productsPerPage = 8;
    const pageCount = Math.ceil(sortedProducts.length / productsPerPage);
    const paginatedProducts = sortedProducts.slice(
        (page - 1) * productsPerPage,
        page * productsPerPage
    );

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<Star key={i} fontSize="small" color="primary" />);
            } else if (i - 0.5 <= rating) {
                stars.push(<StarHalf key={i} fontSize="small" color="primary" />);
            } else {
                stars.push(<StarBorder key={i} fontSize="small" color="primary" />);
            }
        }
        return stars;
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Generate current page URL for canonical
    const currentUrl = window.location.href;
    const pageTitle = 'Premium Fragrance Collections | AlMala Fragrance';
    const pageDescription = 'Explore our exclusive collection of premium fragrances. Find your perfect scent with our wide range of long-lasting perfumes and attars.';

    // Get current filter for meta description
    const filterDescription = filter === 'all' ? '' : ` ${filter} `;

    return (
        <Box component="main" sx={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
            minHeight: '100vh',
        }}>
            {/* SEO Meta Tags */}
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={currentUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={currentUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(generateBreadcrumbData())}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(generateProductListData(paginatedProducts))}
                </script>
            </Helmet>
            <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#1C1C1C', color: '#fff' }}>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between', // Changed from 'normal' to 'space-between'
                    alignItems: 'center',
                    width: '100%'
                }}>
                    {/* Empty Box to balance the layout */}
                    <Box sx={{ width: 40 }} /> {/* This creates space on the left equal to the cart icon */}

                    {/* Centered Logo */}
                    <Box>
                        <Box
                            component="img"
                            src={logo}
                            alt="AL MALA Logo"
                            onClick={() => handleNavigation('home')}
                            sx={{
                                height: { xs: 70, md: 90 },
                                maxHeight: { xs: 90, md: 120 },
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
                        <meta itemProp="brand" content="AlMala Fragrance" />
                        <meta itemProp="category" content="Perfume" />
                    </Box>

                    {/* Cart Icon - Right aligned */}
                    <Box sx={{ display: 'flex', pr: 2 }}>
                        <IconButton sx={{ color: '#fff' }} onClick={toggleCart}>
                            <CartBadge
                                badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)}
                                color="secondary"
                                sx={{ color: '#fff' }}
                            >
                                <ShoppingBag />
                            </CartBadge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Hero Section */}
            <Box sx={{
                position: 'relative',
                backgroundImage: 'linear-gradient(50deg, #0f0f0f 60%, #c8a04d 40%)', color: 'white',
                mb: 6,
                overflow: 'hidden'
            }}>
                <Container maxWidth="lg">
                    <Grid container>
                        <Grid item xs={12} md={6} sx={{
                            py: 8,
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <Typography variant="h2" sx={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 'bold',
                                mb: 2,
                                fontSize: { xs: '2rem', sm: '3.7rem' },
                                color: '#fff',
                            }}>
                                Our Fragrance
                            </Typography>
                            <Typography variant="h2" sx={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 'bold',
                                color: '#c8a04d',
                                mb: 3,
                                fontSize: { xs: '2rem', sm: '3.7rem' },
                            }}>
                                Collection
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: '#ddd',
                                fontSize: { xs: '1rem', sm: '1.5rem' },
                                maxWidth: 'md'
                            }}>
                                Discover our exquisite range of premium fragrances crafted with the finest ingredients from around the world.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'relative'
                        }}>
                            <Box component="img"
                                src={heroImage}
                                alt="Perfume bottles"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    opacity: 0.9,
                                    position: 'absolute'
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg">
                {/* Filters and Sorting */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    mb: 4
                }}>
                    <Box sx={{ mb: isMobile ? 2 : 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                            All Fragrances
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Showing {filteredProducts.length} products
                        </Typography>
                    </Box>
                </Box>

                {/* Product Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {paginatedProducts.map((product) => (
                        <Grid onClick={() => navigate(`/products/${product.id}`)} sx={{
                            height: '100%',
                        }} item xs={12} sm={6} md={3} lg={3} key={product.id}>
                            <Card
                                component="article"
                                itemScope
                                itemType="https://schema.org/Product"
                                sx={{
                                    width: '100%',
                                    height: '90%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    borderRadius: 3,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.02) 100%)',
                                        zIndex: 0
                                    },
                                    '&:hover': {
                                        transform: product.position === 'center' ? 'translateY(-10px)' : 'translateY(-5px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                        cursor: 'pointer',
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        zIndex: 2,
                                        bgcolor: 'error.main',
                                        color: 'common.white',
                                        px: 1.5,
                                        py: 0.7,
                                        borderRadius: 5,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: 'auto',
                                        height: 28,
                                        '& span': {
                                            fontSize: '0.7rem !important',
                                            whiteSpace: 'nowrap'
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            fontSize: '0.7rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {product.badgeText || 'New'}
                                        {product.badgeText === 'sale' && (
                                            <> &nbsp;{Math.round(100 - (product.discountedPrice / product.price) * 100)}% Off</>
                                        )}
                                    </Typography>
                                </Box>
                                <meta itemProp="brand" content="AlMala Fragrance" />
                                <meta itemProp="category" content={product.category || 'Perfume'} />
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: 300,
                                    overflow: 'hidden',
                                    backgroundColor: 'background.paper',
                                    '&:hover img': {
                                        transform: 'scale(1.03)'
                                    }
                                }}>
                                    <img
                                        src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            willChange: 'transform',
                                            transform: 'translateZ(0)',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0
                                        }}
                                        loading="eager"
                                        decoding="async"
                                    />
                                </Box>
                                <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative', zIndex: 1 }}>
                                    <Typography
                                        variant="overline"
                                        component="div"
                                        color="primary"
                                        sx={{ fontWeight: 600, mb: 1 }}
                                    >
                                        {product.category}
                                    </Typography>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h3"
                                        itemProp="name"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {product.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 3,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            height: 40
                                        }}
                                    >
                                        {product.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
                                            {product.badgeText === 'sale' && product.discountedPrice ? (
                                                <>
                                                    {/* Discounted Price (top) */}
                                                    <Typography
                                                        variant="h6"
                                                        color="error.main"
                                                        sx={{ fontWeight: 700, lineHeight: 1 }}
                                                    >
                                                        Rs.{product.discountedPrice}
                                                    </Typography>
                                                    {/* Original Price (bottom, struck through) */}
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ textDecoration: 'line-through', fontSize: '0.9rem' }}
                                                    >
                                                        Rs.{product.price}
                                                    </Typography>
                                                </>
                                            ) : (
                                                /* Regular Price (not on sale) */
                                                <Typography
                                                    variant="h6"
                                                    color="primary"
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    Rs.{product.price}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation(); // ✅ Stops the click from bubbling up to parent
                                                handleAddToCart(product);
                                            }} sx={{
                                                borderRadius: 6,
                                                px: 3,
                                                py: 1,
                                                transition: 'all 0.3s',
                                                background: 'linear-gradient(45deg, #333, #666)',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                                                }
                                            }}
                                            aria-label={`Add ${product.name} to cart`}
                                        >
                                            Add to Cart
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        shape="rounded"
                        color="primary"
                        renderItem={(item) => (
                            <PaginationItem
                                slots={{ previous: ChevronLeft, next: ChevronRight }}
                                {...item}
                            />
                        )}
                    />
                </Box>
            </Container>
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
                                                    src={item.images[0]}
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
                                                        Rs.{(item.discountedPrice * item.quantity).toFixed(2)}
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
                                onClick={() => navigate('/check-out')}
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }
                }}
            >
                <Alert
                    icon={<CheckCircleSharp fontSize="inherit" />}
                    severity="success"
                    variant="outlined"
                    sx={{
                        width: '100%',
                        color: '#2e7d32',
                        backgroundColor: 'rgba(237, 247, 237, 0.9)',
                        '& .MuiAlert-icon': {
                            color: '#4caf50',
                            alignItems: 'center'
                        },
                        '& .MuiAlert-message': {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 0'
                        }
                    }}
                >
                    <AlertTitle sx={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}>
                        Item Added
                    </AlertTitle>
                    <Typography variant="body2" sx={{
                        marginLeft: '8px',
                        color: 'inherit'
                    }}>
                        Successfully added to cart
                    </Typography>
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Custom PaginationItem to match the design
const PaginationItem = ({ type, selected, ...other }) => {
    if (type === 'previous' || type === 'next') {
        return (
            <IconButton {...other}>
                {type === 'previous' ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
        );
    }

    return (
        <Button
            variant={selected ? 'contained' : 'outlined'}
            color={selected ? 'primary' : 'inherit'}
            {...other}
        />
    );
};

export default ProductsPage;