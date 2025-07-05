import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Badge
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

  // Get images from product or use default images
  const images = product?.images?.length > 0
    ? product.images
    : product?.image
      ? [product.image]
      : ['/placeholder-product.jpg'];

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

  return (
    <Box sx={{ flexGrow: 1, pb: 4 }}>
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

            {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => navigate('/cart')}>
                <CartBadge badgeContent={cartItems.length} color="primary">
                  <CartIcon />
                </CartBadge>
              </IconButton>
            </Box> */}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
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
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-product.jpg';
                }}
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
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            {product.brand && (
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {product.brand}
              </Typography>
            )}

            <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
              <Rating
                value={product.rating || 0}
                precision={0.5}
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body1" color="text.secondary">
                ({product.reviewCount || 0} reviews)
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ my: 3, color: 'primary.main' }}>
              ${product.price?.toFixed(2) || '0.00'}
            </Typography>

            <Typography variant="body1" paragraph>
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
                    color={true ? 'success.main' : 'error.main'}
                  >
                    {true ? 'In Stock' : 'Out of Stock'}
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
