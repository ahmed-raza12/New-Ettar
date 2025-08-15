import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Rating,
  useTheme,
  useMediaQuery,
  Container,
  CircularProgress,
  AppBar,
  Toolbar,
  Badge,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingBagOutlined as CartIcon,
  FavoriteBorder as FavoriteIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Circle as DotIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { addToCart, getCart } from '../utils/cart';
import { getProductById } from '../admin/src/services/productService';

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

// Reuse the styled components from ProductDetails.jsx
const ImageSlider = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: { xs: '300px', md: '500px' },
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const ProductImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  zIndex: 2,
}));

const DotsContainer = styled(Box)({
  position: 'absolute',
  bottom: '10px',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  zIndex: 2,
});

const Dot = styled(DotIcon)(({ active, theme }) => ({
  fontSize: '10px',
  color: active ? theme.palette.primary.main : theme.palette.grey[400],
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

// Generate product schema for structured data
const generateProductSchema = (product, images, currentImageIndex) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: images.map(img => new URL(img, 'https://almalafragrance.com').toString()),
  description: product.description || 'Premium fragrance from AlMala Fragrance',
  brand: {
    '@type': 'Brand',
    name: product.brand || 'AlMala Fragrance'
  },
  offers: {
    '@type': 'Offer',
    price: product.price?.toString() || '0.00',
    priceCurrency: 'PKR',
    availability: true ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    url: `https://almalafragrance.com/products/${product.id}`
  },
  aggregateRating: product.rating ? {
    '@type': 'AggregateRating',
    ratingValue: product.rating.toString(),
    reviewCount: product.reviewCount?.toString() || '0',
    bestRating: '5',
    worstRating: '1'
  } : undefined
});

// Generate breadcrumb schema for structured data
const generateBreadcrumbSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://almalafragrance.com/'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Collections',
      item: 'https://almalafragrance.com/collections'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: product.name,
      item: `https://almalafragrance.com/products/${product.id}`
    }
  ]
});

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState(getCart());
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Generate canonical URL
  const canonicalUrl = `https://almalafragrance.com/products/${productId}`;
  
  // Get images from product or use default images
  const images = useMemo(() => 
    product?.images?.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : ['/placeholder-product.jpg'],
    [product?.images, product?.image]
  );
  
  // Get current image URL
  const mainImage = useMemo(() => 
    product ? (images[currentImageIndex] || '') : '',
    [product, images, currentImageIndex]
  );
  
  const imageUrl = useMemo(() => 
    mainImage.startsWith('http') ? mainImage : mainImage ? `https://almalafragrance.com${mainImage}` : '',
    [mainImage]
  );
  
  // Page metadata
  const pageTitle = useMemo(
    () => product ? `${product.name} | ${product.brand || 'AlMala Fragrance'}` : 'Loading...',
    [product?.name, product?.brand]
  );
  
  const pageDescription = useMemo(
    () => product?.description || (product?.name ? `Discover ${product.name}, a premium fragrance by ${product.brand || 'AlMala Fragrance'}.` : 'Premium fragrances by AlMala'),
    [product?.description, product?.name, product?.brand]
  );
  
  // Generate structured data using useMemo
  const productSchema = useMemo(() => 
    product ? generateProductSchema(product, images, currentImageIndex) : null,
    [product, images, currentImageIndex]
  );

  const breadcrumbSchema = useMemo(() => 
    product ? generateBreadcrumbSchema(product) : null,
    [product]
  );

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCart());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleAddToCart = (product) => {
    if (!product) return;
    
    addToCart(product);
    setShowAddedToCart(true);
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowAddedToCart(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }


  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
        <Typography variant="h5" color="error">
          {error || 'Product not found'}
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, pb: 4 }} itemScope itemType="https://schema.org/Product">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="AlMala Fragrance" />
        <meta property="product:price:amount" content={product.price?.toString() || '0'} />
        <meta property="product:price:currency" content="PKR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
        
        {/* Structured Data */}
        {productSchema && (
          <script type="application/ld+json">
            {JSON.stringify(productSchema)}
          </script>
        )}
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
      </Helmet>
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', mb: 4, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <LogoText>Al Mala</LogoText>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Box sx={{ mt: 2, mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/" color="inherit">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/collections" color="inherit">
              Collections
            </MuiLink>
            <Typography color="text.primary">{product.name}</Typography>
          </Breadcrumbs>
        </Box>
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
          mt: 0
        }}>
          {/* Image Slider */}
          <Box>
            <ImageSlider>
              {images.length > 1 && (
                <>
                  <NavigationButton
                    onClick={handlePrevImage}
                    sx={{ left: '10px' }}
                    aria-label="previous image"
                  >
                    <ArrowBackIosIcon />
                  </NavigationButton>

                  <NavigationButton
                    onClick={handleNextImage}
                    sx={{ right: '10px' }}
                    aria-label="next image"
                  >
                    <ArrowForwardIosIcon />
                  </NavigationButton>

                  <DotsContainer>
                    {images.map((_, index) => (
                      <Dot
                        key={index}
                        active={index === currentImageIndex}
                        onClick={() => goToImage(index)}
                      />
                    ))}
                  </DotsContainer>
                </>
              )}

              <ProductImage
                src={images[currentImageIndex]}
                alt={`${product.name} - ${product.brand || 'AlMala Fragrance'}`}
                title={`${product.name} - ${product.brand || 'AlMala Fragrance'}`}
                itemProp="image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image+Available';
                }}
                loading="eager"
                decoding="async"
                width="500"
                height="500"
              />
            </ImageSlider>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 2, mt: 0, overflowX: 'auto', py: 1 }}>
                {images.map((img, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      minWidth: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: currentImageIndex === index ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      opacity: currentImageIndex === index ? 1 : 0.7,
                      transition: 'all 0.2s',
                      '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Product Info */}
          <Box>
            <Typography variant="h4" component="h1" gutterBottom itemProp="name">
              {product.name}
            </Typography>

            {product.brand && (
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {product.brand}
              </Typography>
            )}

            <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }} itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
              <Rating
                value={product.rating || 0}
                precision={0.5}
                readOnly
                sx={{ mr: 1 }}
                aria-label={`Rating: ${product.rating || 0} out of 5`}
              />
              <Typography variant="body1" color="text.secondary">
                <span itemProp="ratingValue">{product.rating || 0}</span> out of <span itemProp="bestRating">5</span> 
                (<span itemProp="reviewCount">{product.reviewCount || 0}</span> reviews)
              </Typography>
              <meta itemProp="worstRating" content="1" />
            </Box>

            <Typography 
              variant="h5" 
              sx={{ my: 3, color: 'primary.main' }}
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <span itemProp="price" content={product.price?.toString() || '0.00'}>PKR {product.price?.toFixed(2) || '0.00'}</span>
              <meta itemProp="priceCurrency" content="PKR" />
              <link itemProp="availability" href="https://schema.org/InStock" />
              <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />
              <meta itemProp="url" content={canonicalUrl} />
            </Typography>

            <Typography variant="body1" paragraph itemProp="description">
              {product.description || 'No description available.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Key Details */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Details</Typography>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}>
                <div>
                  <Typography variant="body2" color="text.secondary">Size</Typography>
                  <Typography variant="body1">{product.size || '100ml'}</Typography>
                </div>
                <div>
                  <Typography variant="body2" color="text.secondary">Availability</Typography>
                  <Typography
                    variant="body1"
                    color="success.main"
                    itemProp="availability"
                    content="https://schema.org/InStock"
                  >
                    In Stock
                  </Typography>
                </div>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Box sx={{ flex: 3, position: 'relative' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CartIcon />}
                  onClick={() => handleAddToCart(product)}
                  disabled={showAddedToCart}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {showAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </Button>
                {showAddedToCart && (
                  <Typography 
                    variant="caption" 
                    sx={{
                      position: 'absolute',
                      bottom: -22,
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      color: 'success.main',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓ Added to your cart
                  </Typography>
                )}
              </Box>
              <IconButton
                color="primary"
                sx={{
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: 1,
                  flex: 1,
                  height: '56px',
                  width: '56px'
                }}
              >
                <FavoriteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetailsPage;
