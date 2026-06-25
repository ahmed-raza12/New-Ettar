import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    CardContent,
    Button,
    IconButton,
    Select,
    MenuItem,
    Chip,
    Alert, 
    AlertTitle,
    Pagination,
    Divider,
    List,
    ListItem,
    ListItemText, 
    Snackbar,
    Drawer, 
    ListItemAvatar, 
    Avatar,
    useTheme,
    useMediaQuery,
    Breadcrumbs,
    Link as MuiLink,
    Fade,
    Zoom,
    Skeleton,
    InputAdornment,
    TextField,
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
    ChevronRight,
    FilterList as FilterIcon,
    Search as SearchIcon,
    Sort as SortIcon,
    Close, 
    Add, 
    Remove, 
    Delete,
    ShoppingBag,
    LocalOffer,
    AutoAwesome,
    WaterDrop,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/system';
import { getCart, removeFromCart, updateCartItem, addToCart } from '../utils/cart';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../admin/src/services/productService';
import bottleImage from '../assets/bottle-bg.png';
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

// Premium animation presets
const PREMIUM_CUBIC = 'cubic-bezier(0.25, 1, 0.5, 1)';

// Keyframe animations
const floatAnimation = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(1deg); }
    50% { transform: translateY(-8px) rotate(0deg); }
    75% { transform: translateY(-20px) rotate(-1deg); }
`;

const shimmerAnimation = keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
`;

const sparkleAnimation = keyframes`
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const dripAnimation = keyframes`
    0% { transform: translateY(-100%) scale(1); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(100px) scale(0.8); opacity: 0; }
`;

// Styled components
const FloatingBottle = styled(Box)(({ theme }) => ({
    animation: `${floatAnimation} 6s ease-in-out infinite`,
    transition: 'all 0.5s ease',
    '&:hover': {
        animationPlayState: 'paused',
        filter: 'drop-shadow(0 30px 60px rgba(140,90,43,0.5)) brightness(1.1)',
    },
}));

const SparkleParticle = styled(Box)(({ delay, size, left, top }) => ({
    position: 'absolute',
    width: size || 4,
    height: size || 4,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${KRAFT.paper} 0%, transparent 70%)`,
    animation: `${sparkleAnimation} 2s ease-in-out infinite`,
    animationDelay: delay || '0s',
    left: left || '50%',
    top: top || '50%',
    pointerEvents: 'none',
}));

const LogoText = styled(Typography)(({ theme }) => ({
    fontFamily: '"Playfair Display", Georgia, serif',
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
        fontSize: '0.625rem',
        backgroundColor: KRAFT.bronze,
        color: KRAFT.cream,
    }
});

const ProductCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: KRAFT.paper,
    boxShadow: '0 8px 24px rgba(33,26,18,0.12)',
    borderRadius: '4px',
    border: `1px solid ${KRAFT.paperDark}`,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: `all 0.4s ${PREMIUM_CUBIC}`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(33,26,18,0) 70%, rgba(33,26,18,0.04) 100%)',
        zIndex: 0,
    },
    '&:hover': {
        transform: 'translateY(-12px)',
        boxShadow: '0 24px 48px rgba(33,26,18,0.25)',
        borderColor: KRAFT.ink,
        '& .product-image': {
            transform: 'scale(1.08)',
        },
        '& .product-overlay': {
            opacity: 1,
        },
    },
}));

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
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [cartItems, setCartItems] = useState(getCart());
    const [cartOpen, setCartOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);

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
        // Trigger hero animation
        const timer = setTimeout(() => setHeroVisible(true), 200);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        const handleCartUpdate = () => {
            setCartItems(getCart());
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const handleAddToCart = useCallback((product, e) => {
        e.stopPropagation();
        setAddingToCart(product.id);
        addToCart(product);
        setSnackbarOpen(true);
        window.dispatchEvent(new Event('cartUpdated'));
        
        setTimeout(() => setAddingToCart(null), 600);
    }, []);

    const toggleCart = () => setCartOpen(!cartOpen);

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

    const filteredProducts = useMemo(() => {
        let filtered = products;
        
        // Category filter
        if (filter !== 'all') {
            if (filter === 'best') {
                filtered = filtered.filter(p => p.isBestSeller);
            } else {
                filtered = filtered.filter(p => p.category === filter);
            }
        }
        
        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    }, [products, filter, searchQuery]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
            case 'price-high':
                return sorted.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
            case 'newest':
                return sorted.sort((a, b) => b.id - a.id);
            case 'best':
                return sorted.sort((a, b) => (b.isBestSeller - a.isBestSeller) || (b.rating - a.rating));
            default:
                return sorted;
        }
    }, [filteredProducts, sortBy]);

    const productsPerPage = 8;
    const pageCount = Math.ceil(sortedProducts.length / productsPerPage);
    const paginatedProducts = useMemo(() => 
        sortedProducts.slice(
            (page - 1) * productsPerPage,
            page * productsPerPage
        ),
        [sortedProducts, page, productsPerPage]
    );

    // Reset page when filter changes
    const handleFilterChange = useCallback((newFilter) => {
        setFilter(newFilter);
        setPage(1);
    }, []);

    const handleSortChange = useCallback((e) => {
        setSortBy(e.target.value);
        setPage(1);
    }, []);

    const renderStars = useCallback((rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<Star key={i} fontSize="small" sx={{ color: KRAFT.bronze }} />);
            } else if (i - 0.5 <= rating) {
                stars.push(<StarHalf key={i} fontSize="small" sx={{ color: KRAFT.bronze }} />);
            } else {
                stars.push(<StarBorder key={i} fontSize="small" sx={{ color: KRAFT.paperDark }} />);
            }
        }
        return stars;
    }, []);

    const currentUrl = window.location.href;
    const pageTitle = 'Premium Fragrance Collections | AlMala Fragrance';
    const pageDescription = 'Explore our exclusive collection of premium fragrances. Find your perfect scent with our wide range of long-lasting perfumes and attars.';

    // Loading skeleton
    const ProductSkeleton = () => (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', bgcolor: KRAFT.paper }}>
                <Skeleton variant="rectangular" height={280} sx={{ bgcolor: KRAFT.paperLight }} />
                <CardContent>
                    <Skeleton width="40%" sx={{ bgcolor: KRAFT.paperLight }} />
                    <Skeleton width="80%" height={32} sx={{ bgcolor: KRAFT.paperLight }} />
                    <Skeleton width="100%" height={20} sx={{ bgcolor: KRAFT.paperLight }} />
                    <Skeleton width="60%" height={20} sx={{ bgcolor: KRAFT.paperLight }} />
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box component="main" sx={{
            bgcolor: KRAFT.cream,
            minHeight: '100vh',
            backgroundImage: `radial-gradient(rgba(33,26,18,0.03) 0.6px, transparent 0.6px)`,
            backgroundSize: '6px 6px',
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
                <script type="application/ld+json">
                    {JSON.stringify(generateBreadcrumbData())}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(generateProductListData(paginatedProducts))}
                </script>
            </Helmet>

            {/* Header Bar */}
            <AppBar 
                position="sticky" 
                elevation={0} 
                sx={{ 
                    backgroundColor: KRAFT.ink,
                    borderBottom: `1px solid ${KRAFT.bronze}`,
                    zIndex: 1200,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                    }}>
                        <Box
                            component="img"
                            src={logo}
                            alt="AL MALA Logo"
                            onClick={() => navigate('/')}
                            sx={{
                                height: { xs: 45, md: 60 },
                                width: 'auto',
                                cursor: 'pointer',
                                objectFit: 'contain',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'scale(1.08)' }
                            }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton 
                                sx={{ 
                                    color: KRAFT.cream,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.1)' }
                                }} 
                                onClick={toggleCart}
                            >
                                <CartBadge
                                    badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)}
                                >
                                    <ShoppingBag />
                                </CartBadge>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Enhanced Hero Section with Animated Bottle */}
            <Box sx={{
                position: 'relative',
                background: `linear-gradient(160deg, ${KRAFT.ink} 55%, ${KRAFT.bronze} 95%, ${KRAFT.paperDark} 100%)`,
                mb: 6,
                overflow: 'hidden',
                borderBottom: `3px solid ${KRAFT.bronze}`,
                minHeight: { xs: 'auto', md: 500 },
            }}>
                {/* Animated background particles */}
                <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    {/* Decorative pattern */}
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `radial-gradient(rgba(217,189,147,0.06) 0.8px, transparent 0.8px)`,
                        backgroundSize: '10px 10px',
                    }} />
                    
                    {/* Floating sparkle particles */}
                    {[...Array(15)].map((_, i) => (
                        <SparkleParticle
                            key={i}
                            delay={`${Math.random() * 3}s`}
                            size={Math.random() * 6 + 2}
                            left={`${Math.random() * 100}%`}
                            top={`${Math.random() * 100}%`}
                        />
                    ))}
                    
                    {/* Light rays */}
                    <Box sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '60%',
                        width: '300px',
                        height: '300px',
                        background: `radial-gradient(circle, rgba(140,90,43,0.2) 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                        animation: `${floatAnimation} 8s ease-in-out infinite`,
                    }} />
                </Box>
                
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Grid container alignItems="center">
                        <Grid item xs={12} md={6} sx={{ py: { xs: 6, md: 12 } }}>
                            <Fade in={heroVisible} timeout={800}>
                                <Box>
                                    {/* Stamp-style eyebrow */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Box sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: KRAFT.paper,
                                            animation: `${sparkleAnimation} 2s ease-in-out infinite`,
                                        }} />
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: KRAFT.paper,
                                                letterSpacing: '0.25em',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Premium Collection
                                        </Typography>
                                    </Box>

                                    <Typography variant="h2" sx={{
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontWeight: 700,
                                        mb: 1,
                                        fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem' },
                                        color: KRAFT.cream,
                                        lineHeight: 1.1,
                                    }}>
                                        Discover Your
                                    </Typography>
                                    <Typography variant="h2" sx={{
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontWeight: 700,
                                        color: KRAFT.paper,
                                        mb: 3,
                                        fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem' },
                                        lineHeight: 1.1,
                                    }}>
                                        Signature Scent
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        color: KRAFT.paperLight,
                                        fontSize: { xs: '1rem', sm: '1.15rem' },
                                        maxWidth: 450,
                                        lineHeight: 1.8,
                                        opacity: 0.9,
                                        mb: 4,
                                    }}>
                                        Explore our curated selection of luxury fragrances, each crafted to tell your unique story.
                                    </Typography>
                                    
                                    {/* Quick stats */}
                                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                        {[
                                            { icon: <AutoAwesome />, label: 'Premium Quality' },
                                            { icon: <WaterDrop />, label: 'Long Lasting' },
                                            { icon: <LocalOffer />, label: 'Best Prices' },
                                        ].map((stat, i) => (
                                            <Box key={i} sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 0.75,
                                                color: KRAFT.paperLight,
                                                opacity: 0.8,
                                            }}>
                                                {stat.icon}
                                                <Typography variant="caption" sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                                    {stat.label}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Fade>
                        </Grid>
                        
                        {/* Animated Bottle Image */}
                        <Grid item xs={12} md={6} sx={{
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 6,
                            position: 'relative',
                        }}>
                            <FloatingBottle>
                                <Box 
                                    component="img"
                                    src={bottleImage}
                                    alt="Luxury Perfume Bottle"
                                    sx={{
                                        width: '100%',
                                        maxWidth: 400,
                                        height: 'auto',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.4))',
                                        transition: 'all 0.5s ease',
                                    }}
                                />
                            </FloatingBottle>
                            
                            {/* Decorative drips */}
                            {[...Array(3)].map((_, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        position: 'absolute',
                                        bottom: '20%',
                                        left: `${30 + i * 20}%`,
                                        width: 2,
                                        height: 20,
                                        background: `linear-gradient(to bottom, ${KRAFT.bronze}, transparent)`,
                                        borderRadius: '0 0 50% 50%',
                                        animation: `${dripAnimation} ${2 + i}s ease-in infinite`,
                                        animationDelay: `${i * 0.7}s`,
                                        opacity: 0.6,
                                    }}
                                />
                            ))}
                        </Grid>
                    </Grid>
                </Container>

                {/* Bottom gradient border */}
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, transparent, ${KRAFT.bronze}, ${KRAFT.paper}, ${KRAFT.bronze}, transparent)`,
                }} />
            </Box>

            {/* Breadcrumbs & Search */}
            <Container maxWidth="lg" sx={{ mb: 3 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                }}>
                    <Breadcrumbs 
                        aria-label="breadcrumb"
                        sx={{
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
                        <Typography 
                            sx={{ 
                                color: KRAFT.ink,
                                fontFamily: '"Playfair Display", Georgia, serif',
                                fontSize: '0.85rem',
                            }}
                        >
                            Collections
                        </Typography>
                    </Breadcrumbs>
                    
                    {/* Search Field */}
                    <TextField
                        placeholder="Search fragrances..."
                        size="small"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: KRAFT.paperDark, fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            minWidth: { xs: '100%', sm: 250 },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: KRAFT.paper,
                                borderRadius: '4px',
                                fontFamily: '"Playfair Display", Georgia, serif',
                                fontSize: '0.85rem',
                                '& fieldset': {
                                    borderColor: KRAFT.paperDark,
                                },
                                '&:hover fieldset': {
                                    borderColor: KRAFT.bronze,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: KRAFT.bronze,
                                },
                            },
                        }}
                    />
                </Box>
            </Container>

            {/* Main Content */}
            <Container maxWidth="lg">
                {/* Filters and Sorting */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    mb: 4,
                    gap: 2,
                    p: 2.5,
                    bgcolor: KRAFT.paper,
                    borderRadius: '4px',
                    border: `1px solid ${KRAFT.paperDark}`,
                }}>
                    <Box>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontFamily: '"Playfair Display", Georgia, serif',
                                fontWeight: 700,
                                color: KRAFT.ink,
                                mb: 0.25,
                                fontSize: { xs: '1.3rem', md: '1.5rem' },
                            }}
                        >
                            {filter === 'all' ? 'All Fragrances' : filter === 'best' ? 'Best Sellers' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: KRAFT.bronze,
                                fontStyle: 'italic',
                                fontSize: '0.8rem',
                            }}
                        >
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Filter Chips */}
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                            {['all', 'best', 'men', 'women', 'unisex'].map((filterOption) => (
                                <Chip
                                    key={filterOption}
                                    label={filterOption === 'all' ? 'All' : filterOption === 'best' ? 'Best Sellers' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                                    onClick={() => handleFilterChange(filterOption)}
                                    variant={filter === filterOption ? 'filled' : 'outlined'}
                                    size="small"
                                    sx={{
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.06em',
                                        fontWeight: 600,
                                        borderColor: KRAFT.paperDark,
                                        color: filter === filterOption ? KRAFT.cream : KRAFT.ink,
                                        bgcolor: filter === filterOption ? KRAFT.bronze : 'transparent',
                                        '&:hover': {
                                            bgcolor: filter === filterOption ? KRAFT.bronze : KRAFT.paperLight,
                                            borderColor: KRAFT.bronze,
                                        },
                                        transition: `all 0.3s ${PREMIUM_CUBIC}`,
                                    }}
                                />
                            ))}
                        </Box>

                        {/* Sort Select */}
                        <Select
                            value={sortBy}
                            onChange={handleSortChange}
                            size="small"
                            startAdornment={<SortIcon sx={{ color: KRAFT.bronze, mr: 1, fontSize: 18 }} />}
                            sx={{
                                minWidth: 170,
                                fontFamily: '"Playfair Display", Georgia, serif',
                                fontSize: '0.8rem',
                                color: KRAFT.ink,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: KRAFT.paperDark,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: KRAFT.bronze,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: KRAFT.bronze,
                                },
                                '& .MuiSvgIcon-root': {
                                    color: KRAFT.bronze,
                                },
                            }}
                        >
                            <MenuItem value="default">Default Sorting</MenuItem>
                            <MenuItem value="price-low">Price: Low → High</MenuItem>
                            <MenuItem value="price-high">Price: High → Low</MenuItem>
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="best">Best Sellers</MenuItem>
                        </Select>
                    </Box>
                </Box>

                {/* Product Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {loading ? (
                        // Loading skeletons
                        [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
                    ) : error ? (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                                <Button onClick={() => window.location.reload()}>Try Again</Button>
                            </Box>
                        </Grid>
                    ) : paginatedProducts.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <SearchIcon sx={{ fontSize: 60, color: KRAFT.paperDark, mb: 2 }} />
                                <Typography sx={{ 
                                    color: KRAFT.ink, 
                                    fontFamily: '"Playfair Display", Georgia, serif',
                                    fontSize: '1.2rem',
                                    mb: 2,
                                }}>
                                    No products found
                                </Typography>
                                <Typography sx={{ color: 'rgba(33,26,18,0.6)', mb: 3 }}>
                                    {searchQuery ? 'Try adjusting your search terms.' : 'No products in this category yet.'}
                                </Typography>
                                <Button 
                                    onClick={() => { setFilter('all'); setSearchQuery(''); }}
                                    variant="outlined"
                                    sx={{ 
                                        borderColor: KRAFT.bronze,
                                        color: KRAFT.bronze,
                                        '&:hover': {
                                            borderColor: KRAFT.ink,
                                            bgcolor: 'rgba(140,90,43,0.08)',
                                        }
                                    }}
                                >
                                    View All Products
                                </Button>
                            </Box>
                        </Grid>
                    ) : (
                        paginatedProducts.map((product, index) => (
                            <Grid 
                                item 
                                xs={12} 
                                sm={6} 
                                md={4} 
                                lg={3} 
                                key={product.id}
                            >
                                <Zoom in={true} timeout={400 + index * 100}>
                                    <ProductCard
                                        component="article"
                                        itemScope
                                        itemType="https://schema.org/Product"
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    >
                                        {/* Badge */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                left: 12,
                                                zIndex: 2,
                                                bgcolor: 'transparent',
                                                border: `1.5px solid ${KRAFT.ink}`,
                                                color: KRAFT.ink,
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '999px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: 'auto',
                                                height: 26,
                                                backdropFilter: 'blur(4px)',
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.68rem',
                                                    whiteSpace: 'nowrap',
                                                    letterSpacing: '0.05em',
                                                }}
                                            >
                                                {product.badgeText || 'New'}
                                                {product.badgeText === 'sale' && product.discountedPrice && (
                                                    <> &nbsp;{Math.round(100 - (product.discountedPrice / product.price) * 100)}% Off</>
                                                )}
                                            </Typography>
                                        </Box>

                                        {/* Favorite Button */}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                bgcolor: `${KRAFT.cream}CC`,
                                                backdropFilter: 'blur(4px)',
                                                zIndex: 2,
                                                color: KRAFT.ink,
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    bgcolor: KRAFT.bronze,
                                                    color: KRAFT.cream,
                                                    transform: 'scale(1.15) rotate(8deg)',
                                                }
                                            }}
                                        >
                                            <FavoriteBorder fontSize="small" />
                                        </IconButton>

                                        <meta itemProp="brand" content="AlMala Fragrance" />
                                        <meta itemProp="category" content={product.category || 'Perfume'} />

                                        {/* Product Image with hover overlay */}
                                        <Box sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: 280,
                                            overflow: 'hidden',
                                            backgroundColor: KRAFT.cream,
                                        }}>
                                            <Box
                                                component="img"
                                                className="product-image"
                                                src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                                                alt={product.name}
                                                itemProp="image"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                                }}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: `transform 0.7s ${PREMIUM_CUBIC}`,
                                                }}
                                                loading="lazy"
                                            />
                                            
                                            {/* Quick view overlay */}
                                            <Box 
                                                className="product-overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    bgcolor: 'rgba(33,26,18,0.5)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/products/${product.id}`);
                                                    }}
                                                    sx={{
                                                        bgcolor: KRAFT.cream,
                                                        color: KRAFT.ink,
                                                        fontFamily: '"Playfair Display", Georgia, serif',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.08em',
                                                        fontSize: '0.75rem',
                                                        '&:hover': {
                                                            bgcolor: KRAFT.paper,
                                                        },
                                                    }}
                                                >
                                                    Quick View
                                                </Button>
                                            </Box>
                                        </Box>

                                        <Box sx={{ borderTop: `1.5px dashed ${KRAFT.paperDark}` }} />

                                        <CardContent sx={{ flexGrow: 1, p: 2.5, position: 'relative', zIndex: 1, bgcolor: KRAFT.cream }}>
                                            <Typography
                                                variant="overline"
                                                component="div"
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 0.5,
                                                    color: KRAFT.bronze,
                                                    letterSpacing: '0.12em',
                                                    fontSize: '0.65rem',
                                                }}
                                            >
                                                {product.category}
                                            </Typography>

                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="h3"
                                                itemProp="name"
                                                sx={{
                                                    fontFamily: '"Playfair Display", Georgia, serif',
                                                    fontWeight: 700,
                                                    mb: 0.5,
                                                    color: KRAFT.ink,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                {product.name}
                                            </Typography>

                                            {product.rating && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    {renderStars(product.rating)}
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            ml: 0.5,
                                                            color: 'rgba(33,26,18,0.5)',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    >
                                                        ({product.reviewCount || 0})
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    color: 'rgba(33,26,18,0.65)',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    minHeight: 36,
                                                    fontSize: '0.8rem',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {product.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto' }}>
                                                <Box>
                                                    {product.badgeText === 'sale' && product.discountedPrice ? (
                                                        <>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{ 
                                                                    fontWeight: 700, 
                                                                    lineHeight: 1,
                                                                    color: '#7A2E1D',
                                                                    fontSize: '1.1rem',
                                                                }}
                                                            >
                                                                Rs.{product.discountedPrice}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ 
                                                                    textDecoration: 'line-through',
                                                                    fontSize: '0.8rem',
                                                                    color: 'rgba(33,26,18,0.5)',
                                                                }}
                                                            >
                                                                Rs.{product.price}
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ 
                                                                fontWeight: 700,
                                                                color: KRAFT.ink,
                                                                fontSize: '1.1rem',
                                                            }}
                                                        >
                                                            Rs.{product.price}
                                                        </Typography>
                                                    )}
                                                </Box>

                                                <Button
                                                    variant="contained"
                                                    startIcon={addingToCart === product.id ? <CheckCircleSharp /> : <CartIcon />}
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    sx={{
                                                        borderRadius: '2px',
                                                        px: 2,
                                                        py: 0.75,
                                                        bgcolor: addingToCart === product.id ? '#2E7D32' : KRAFT.ink,
                                                        color: KRAFT.cream,
                                                        boxShadow: 'none',
                                                        letterSpacing: '0.04em',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        transition: `all 0.3s ${PREMIUM_CUBIC}`,
                                                        '&:hover': {
                                                            bgcolor: addingToCart === product.id ? '#2E7D32' : KRAFT.bronze,
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 6px 16px rgba(33,26,18,0.2)',
                                                        }
                                                    }}
                                                    aria-label={`Add ${product.name} to cart`}
                                                >
                                                    {addingToCart === product.id ? 'Added!' : 'Add'}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </ProductCard>
                                </Zoom>
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Pagination */}
                {pageCount > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 8 }}>
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={(e, value) => {
                                setPage(value);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            shape="rounded"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: KRAFT.ink,
                                    fontFamily: '"Playfair Display", Georgia, serif',
                                    borderColor: KRAFT.paperDark,
                                    '&.Mui-selected': {
                                        bgcolor: KRAFT.bronze,
                                        color: KRAFT.cream,
                                        '&:hover': {
                                            bgcolor: KRAFT.ink,
                                        }
                                    },
                                    '&:hover': {
                                        bgcolor: KRAFT.paperLight,
                                    }
                                },
                            }}
                            renderItem={(item) => (
                                <PaginationItem
                                    slots={{ previous: ChevronLeft, next: ChevronRight }}
                                    {...item}
                                />
                            )}
                        />
                    </Box>
                )}
            </Container>

            {/* Cart Drawer */}
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
                        borderLeft: `1px solid ${KRAFT.paperDark}`,
                    },
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden'
                }}>
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

                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 2,
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { background: KRAFT.paperLight },
                        '&::-webkit-scrollbar-thumb': { background: KRAFT.paperDark, borderRadius: '2px' }
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
                                <Typography variant="body1" sx={{ mb: 1, color: KRAFT.ink }}>
                                    Your cart is empty
                                </Typography>
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
                                        <ListItem sx={{ p: 1, alignItems: 'flex-start' }}>
                                            <ListItemAvatar sx={{ minWidth: 80 }}>
                                                <Avatar
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 70,
                                                        height: 70,
                                                        border: `1px solid ${KRAFT.paperDark}`,
                                                    }}
                                                />
                                            </ListItemAvatar>
                                            <Box sx={{ flex: 1, ml: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <ListItemText
                                                        primary={item.name}
                                                        secondary={item.description?.substring(0, 50) + '...'}
                                                        primaryTypographyProps={{
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem',
                                                            color: KRAFT.ink,
                                                            fontFamily: '"Playfair Display", Georgia, serif'
                                                        }}
                                                        secondaryTypographyProps={{ 
                                                            fontSize: '0.75rem',
                                                            color: 'rgba(33,26,18,0.6)',
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={() => removeItem(item.id)}
                                                        size="small"
                                                        sx={{ color: KRAFT.bronze, alignSelf: 'flex-start' }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
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

                    {cartItems.length > 0 && (
                        <Box sx={{
                            p: 2,
                            borderTop: `1px solid ${KRAFT.paperDark}`,
                            position: 'sticky',
                            bottom: 0,
                            bgcolor: KRAFT.cream
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
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
                                onClick={() => navigate('/check-out')}
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
                                sx={{ mt: 1, color: KRAFT.ink, fontSize: '0.8rem' }}
                            >
                                Continue Shopping
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    icon={<CheckCircleSharp fontSize="inherit" />}
                    severity="success"
                    variant="outlined"
                    sx={{
                        width: '100%',
                        color: KRAFT.ink,
                        backgroundColor: KRAFT.cream,
                        borderColor: KRAFT.bronze,
                        borderRadius: '4px',
                        boxShadow: '0 4px 20px rgba(33,26,18,0.2)',
                        '& .MuiAlert-icon': { color: KRAFT.bronze },
                    }}
                >
                    <AlertTitle sx={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>
                        Item Added
                    </AlertTitle>
                    <Typography variant="body2" sx={{ marginLeft: '8px', color: 'inherit' }}>
                        Successfully added to cart
                    </Typography>
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Custom PaginationItem
const PaginationItem = ({ type, selected, ...other }) => {
    if (type === 'previous' || type === 'next') {
        return (
            <IconButton 
                {...other}
                sx={{
                    color: KRAFT.ink,
                    border: `1px solid ${KRAFT.paperDark}`,
                    borderRadius: '4px',
                    '&:hover': { bgcolor: KRAFT.paperLight }
                }}
            >
                {type === 'previous' ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
        );
    }

    return (
        <Button
            variant={selected ? 'contained' : 'outlined'}
            {...other}
            sx={{
                minWidth: 40,
                height: 40,
                borderRadius: '4px',
                borderColor: selected ? KRAFT.bronze : KRAFT.paperDark,
                bgcolor: selected ? KRAFT.bronze : 'transparent',
                color: selected ? KRAFT.cream : KRAFT.ink,
                fontFamily: '"Playfair Display", Georgia, serif',
                '&:hover': {
                    bgcolor: selected ? KRAFT.ink : KRAFT.paperLight,
                    borderColor: selected ? KRAFT.ink : KRAFT.bronze,
                },
                ...other.sx,
            }}
        />
    );
};

export default ProductsPage;