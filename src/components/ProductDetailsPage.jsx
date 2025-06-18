import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingBag as CartIcon,
  FavoriteBorder as FavoriteIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Circle as DotIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { addToCart } from '../utils/cart';
import { getProductById } from '../admin/src/services/productService';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      // You might want to show a notification here
    }
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 4,
        mt: 2
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
        </Box>


        {/* Product Info */}
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          {product.brand && (
            <Typography variant="h6" color="text.secondary" gutterBottom>
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
          
          <Typography variant="h4" sx={{ my: 3, color: 'primary.main' }}>
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
                <Typography variant="body2" color="text.secondary">Scent Notes</Typography>
                <Typography variant="body1">
                  {product.scentNotes || 'Not specified'}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="text.secondary">Availability</Typography>
                <Typography 
                  variant="body1" 
                  color={product.inStock ? 'success.main' : 'error.main'}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Typography>
              </div>
            </Box>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CartIcon />}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              fullWidth
              sx={{ py: 1.5, flex: 3 }}
            >
              Add to Cart
            </Button>
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
  );
};

export default ProductDetailsPage;
