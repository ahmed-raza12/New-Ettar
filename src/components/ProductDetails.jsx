import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
  Rating,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingBag as CartIcon,
  FavoriteBorder as FavoriteIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  Circle as DotIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { addToCart } from '../utils/cart';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '90%', md: '80%' },
  maxWidth: '1200px',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  overflow: 'hidden',
};

const ImageSlider = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: { xs: '100%', md: '50%' },
  height: { xs: '300px', md: 'auto' },
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

const ProductDetails = ({ product, open, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // If no product is provided, don't render anything
  if (!product) return null;

  // Get images from product or use default images
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || '/placeholder-product.jpg'];

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
    addToCart(product);
    // You might want to show a notification here
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-details-modal"
      aria-describedby="product-details-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 3,
            color: 'text.primary',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Image Slider */}
        <ImageSlider>
          {images.length > 1 && (
            <>
              <NavigationButton
                onClick={handlePrevImage}
                sx={{ left: '10px' }}
                aria-label="previous image"
              >
                <ArrowBackIcon />
              </NavigationButton>
              
              <NavigationButton
                onClick={handleNextImage}
                sx={{ right: '10px' }}
                aria-label="next image"
              >
                <ArrowForwardIcon />
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

        {/* Product Info */}
        <Box sx={{ 
          p: 4, 
          width: { xs: '100%', md: '50%' },
          overflowY: 'auto',
          maxHeight: '90vh',
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          {product.brand && (
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {product.brand}
            </Typography>
          )}
          
          <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
            <Rating 
              value={product.rating || 0} 
              precision={0.5} 
              readOnly 
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({product.reviewCount || 0} reviews)
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ my: 2, color: 'primary.main' }}>
            ${product.price?.toFixed(2) || '0.00'}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {product.description || 'No description available.'}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Key Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Details:</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
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
              sx={{ py: 1.5 }}
            >
              Add to Cart
            </Button>
            <IconButton 
              color="primary" 
              sx={{ border: `1px solid ${theme.palette.primary.main}`, borderRadius: 1 }}
            >
              <FavoriteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductDetails;
