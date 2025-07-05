import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  IconButton,
  useTheme, CircularProgress,
  useMediaQuery,
  Snackbar, Alert, AlertTitle,
  Fade
} from '@mui/material';
import {
  KeyboardArrowLeft as ArrowBackIcon,
  KeyboardArrowRight as ArrowForwardIcon,
  FavoriteBorder as FavoriteIcon,
  CheckCircleSharp,
  ShoppingBagOutlined as CartIcon
} from '@mui/icons-material';
import { addToCart } from '../utils/cart';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../admin/src/services/productService';

const ProductShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState('next');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const [cart, setCart] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fragranceCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0 && currentIndex >= products.length) {
      setCurrentIndex(0);
    }

    preloadAllImages();
  }, [products]);

  // Update the addToCart function to properly update localStorage
  const handleAddToCart = (product) => {
    const updatedCart = addToCart(product);
    setSnackbarOpen(true);
    // Notify other components (like Header) about the cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Auto play settings
  const autoPlayDelay = 5000; // 5 seconds
  const [autoPlay, setAutoPlay] = useState(true);

  // Handle auto play
  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, autoPlayDelay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, currentIndex]);

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    setAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setAutoPlay(true);
  };

  const handleNext = () => {
    if (sliding || !products || products.length === 0) return;
    setDirection('next');
    setSliding(true);

    // Preload next image with proper load handling
    const nextIndex = (currentIndex + 1) % products.length;
    const product = products[nextIndex];
    
    // Get the first image from images array or fallback to image property
    const imageUrl = Array.isArray(product?.images) && product.images.length > 0 
      ? product.images[0] 
      : product?.image;

    if (!product || !imageUrl) {
      console.error('Missing product or product image at index:', nextIndex);
      setSliding(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Only advance to next slide after image is loaded
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        setSliding(false);
      }, 500);
    };

    img.onerror = () => {
      // Handle image load error
      console.error(`Failed to load image for product ${product.name}`);
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        setSliding(false);
      }, 500);
    };

    // Set source after attaching event handlers
    img.src = imageUrl;
  };

  // Apply similar safety checks to handlePrev and goToSlide
  const handlePrev = () => {
    if (sliding || !products || products.length === 0) return;
    setDirection('prev');
    setSliding(true);

    const prevIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    const product = products[prevIndex];
    
    // Get the first image from images array or fallback to image property
    const imageUrl = Array.isArray(product?.images) && product.images.length > 0 
      ? product.images[0] 
      : product?.image;

    if (!product || !imageUrl) {
      console.error('Missing product or product image at index:', prevIndex);
      setSliding(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setCurrentIndex(prevIndex);
      setTimeout(() => {
        setSliding(false);
      }, 500);
    };

    img.onerror = () => {
      console.error(`Failed to load image for product ${product.name}`);
      setCurrentIndex(prevIndex);
      setTimeout(() => {
        setSliding(false);
      }, 500);
    };

    img.src = imageUrl;
  };

  const goToSlide = (index) => {
    if (sliding || index === currentIndex || !products || products.length === 0) return;
    
    const product = products[index];
    
    // Get the first image from images array or fallback to image property
    const imageUrl = Array.isArray(product?.images) && product.images.length > 0 
      ? product.images[0] 
      : product?.image;

    if (!product || !imageUrl) {
      console.error('Missing product or product image at index:', index);
      return;
    }

    setDirection(index > currentIndex ? 'next' : 'prev');
    setSliding(true);

    const img = new Image();
    img.onload = () => {
      setCurrentIndex(index);
      setTimeout(() => {
        setSliding(false);
      }, 400);
    };

    img.onerror = () => {
      console.error(`Failed to load image for product ${products[index].name}`);
      setCurrentIndex(index);
      setTimeout(() => {
        setSliding(false);
      }, 400);
    };

    img.src = products[index].image;
  };

  // Update the preloadAllImages function with safety checks
  const preloadAllImages = () => {
    if (!products || products.length === 0) return;

    products.forEach(product => {
      if (product && product.image) {
        const img = new Image();
        img.src = product.image;
      }
    });
  };

  // Fix the getVisibleProducts function to handle empty products
  const getVisibleProducts = () => {
    if (!products || products.length === 0) {
      return [];
    }

    if (isMobile) {
      return [
        { ...products[currentIndex], position: 'center' }
      ];
    } else if (isTablet) {
      // For tablets, show 2 products
      let visible = [];
      for (let i = 0; i < Math.min(2, products.length); i++) {
        const index = (currentIndex + i) % products.length;
        visible.push({
          ...products[index],
          position: i === 0 ? 'center-left' : 'center-right'
        });
      }
      return visible;
    } else {
      // For desktop, show 3 products, but only if we have enough products
      let visible = [];
      if (products.length >= 3) {
        const prevIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
        const nextIndex = (currentIndex + 1) % products.length;

        visible.push({ ...products[prevIndex], position: 'left' });
        visible.push({ ...products[currentIndex], position: 'center' });
        visible.push({ ...products[nextIndex], position: 'right' });
      } else if (products.length === 2) {
        // Only 2 products available
        visible.push({ ...products[0], position: 'left' });
        visible.push({ ...products[1], position: 'center' });
      } else if (products.length === 1) {
        // Only 1 product available
        visible.push({ ...products[0], position: 'center' });
      }
      return visible;
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setAutoPlay(false); // Pause autoplay on touch
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
    setAutoPlay(true); // Resume autoplay after touch
  };

  const visibleProducts = getVisibleProducts();

  // Enhanced slide animation styles
  const getSlideStyle = (position) => {
    if (isMobile) {
      if (sliding) {
        return {
          transform: direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)',
          opacity: 0,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        };
      }
      return {
        transform: 'translateX(0)',
        opacity: 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      };
    } else if (isTablet) {
      // Tablet styles
      const baseStyles = {
        transform: position === 'center-left' ? 'translateX(5%)' : 'translateX(-5%)',
        opacity: 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      };

      if (sliding) {
        return {
          ...baseStyles,
          transform: direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)',
          opacity: 0
        };
      }
      return baseStyles;
    } else {
      // Desktop styles with enhanced 3D effect
      const positionStyles = {
        left: {
          transform: 'translateX(-10%) scale(0.85) perspective(1000px) rotateY(5deg)',
          opacity: 1,
          filter: 'blur(0)',
          zIndex: 1
        },
        center: {
          transform: 'translateX(0) scale(1) perspective(1000px) rotateY(0deg)',
          opacity: 1,
          filter: 'blur(0)',
          zIndex: 3
        },
        right: {
          transform: 'translateX(10%) scale(0.85) perspective(1000px) rotateY(-5deg)',
          opacity: 1,
          filter: 'blur(0)',
          zIndex: 1
        }
      };

      if (sliding) {
        const slideStyles = { transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' };

        if (direction === 'next') {
          return {
            ...positionStyles[position],
            ...slideStyles,
            transform: position === 'center' ? positionStyles.left.transform :
              position === 'right' ? positionStyles.center.transform :
                'translateX(-30%) scale(0.7) perspective(1000px) rotateY(10deg)',
            opacity: position === 'right' ? positionStyles.center.opacity :
              position === 'center' ? positionStyles.left.opacity : 0,
            filter: position === 'right' ? positionStyles.center.filter :
              position === 'center' ? positionStyles.left.filter : 'blur(2px)',
            zIndex: position === 'right' ? positionStyles.center.zIndex :
              position === 'center' ? positionStyles.left.zIndex : 0
          };
        } else {
          return {
            ...positionStyles[position],
            ...slideStyles,
            transform: position === 'center' ? positionStyles.right.transform :
              position === 'left' ? positionStyles.center.transform :
                'translateX(30%) scale(0.7) perspective(1000px) rotateY(-10deg)',
            opacity: position === 'left' ? positionStyles.center.opacity :
              position === 'center' ? positionStyles.right.opacity : 0,
            filter: position === 'left' ? positionStyles.center.filter :
              position === 'center' ? positionStyles.right.filter : 'blur(2px)',
            zIndex: position === 'left' ? positionStyles.center.zIndex :
              position === 'center' ? positionStyles.right.zIndex : 0
          };
        }
      }

      return {
        ...positionStyles[position],
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      };
    }
  };

  return (
    <Box
      sx={{
        py: 10,
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(to bottom, rgba(245,245,245,0.8), rgba(245,245,245,0.4))',
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            position: 'relative',
            mb: {
              xs: 3,
              sm: 5,
              md: 6
            },
            fontWeight: 700,
            fontSize: {
              xs: '2rem',    // Small mobile screens
              sm: '2.5rem',  // Larger mobile/small tablet screens
              md: '3rem',    // Medium screens (tablets)
              lg: '3.5rem',  // Large screens (desktop)
            },
            backgroundImage: 'linear-gradient(45deg, #333, #666)',
            backgroundClip: 'text',
            color: 'transparent',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: {
                xs: 30,  // Smaller line on mobile
                sm: 80,  // Medium line on tablets
                md: 100, // Full width line on desktop
              },
              height: 3,
              backgroundImage: 'linear-gradient(to right, #333, #666)',
              borderRadius: 4
            }
          }}
        >
          Our Signature Scents
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography>No products available</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: isMobile ? 580 : isTablet ? 550 : 600,
              mx: 'auto',
              mb: 6
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={sliderRef}
          >
            {/* Custom progress indicator */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 200,
                height: 2,
                bgcolor: 'rgba(0,0,0,0.1)',
                borderRadius: 5,
                overflow: 'hidden',
                zIndex: 3
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${100 / products.length}%`,
                  bgcolor: 'primary.main',
                  borderRadius: 5,
                  position: 'absolute',
                  left: `${(currentIndex / products.length) * 100}%`,
                  transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </Box>

            {/* Navigation arrows for all devices */}
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                pointerEvents: 'none',
                px: { xs: 1, md: 0 }
              }}
            >
              <IconButton
                onClick={handlePrev}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(5px)',
                  color: 'text.primary',
                  transition: 'all 0.2s',
                  width: { xs: 40, md: 56 },
                  height: { xs: 40, md: 56 },
                  pointerEvents: 'auto',
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'common.white',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(5px)',
                  color: 'text.primary',
                  transition: 'all 0.2s',
                  width: { xs: 40, md: 56 },
                  height: { xs: 40, md: 56 },
                  pointerEvents: 'auto',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'common.white',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>

            {/* Dots indicator for mobile and tablet */}
            {(isMobile || isTablet) && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  position: 'absolute',
                  bottom: -60,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2
                }}
              >
                {products.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => goToSlide(index)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: currentIndex === index ? 'primary.main' : 'grey.300',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      transform: currentIndex === index ? 'scale(1.5)' : 'scale(1)',
                      '&:hover': {
                        bgcolor: currentIndex === index ? 'primary.dark' : 'grey.400',
                      }
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Products slider */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                position: 'relative',
                perspective: 1000
              }}
            >
              {visibleProducts.map((product) => (
                // <Fade key={product.id} in={!sliding} timeout={400}>
                <Box
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  sx={{
                    width: isMobile ? '90%' : isTablet ? '45%' : '30%',
                    minWidth: isMobile ? '90%' : isTablet ? 300 : 350,
                    maxWidth: isMobile ? '90%' : isTablet ? 350 : 450,
                    position: isMobile ? 'absolute' : 'relative',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...getSlideStyle(product.position),
                    cursor: 'pointer'
                  }}
                >
                  <Card
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
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {/* Favorite button */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation when clicking the favorite button
                        // Add favorite functionality here if needed
                      }}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <FavoriteIcon fontSize="small" />
                    </IconButton>

                    <CardMedia
                      key={`${product.id}-${currentIndex}-${Date.now()}`}
                      component="img"
                      image={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                      sx={{
                        height: 300,
                        objectFit: 'cover',
                        transition: 'all 0.5s',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        '&:hover': {
                          transform: 'scale(1.03) translateZ(0)'
                        }
                      }}
                      loading="eager"
                      decoding="async"
                    />
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
                        variant="h5"
                        component="h3"
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
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                          Rs.{product.price}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CartIcon />}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when clicking the button
                            handleAddToCart(product);
                          }}
                          sx={{
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
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                // </Fade>
              ))}
            </Box>
          </Box>
        )}
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 6,
              borderWidth: 2,
              fontWeight: 600,
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                borderWidth: 2,
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }
            }}
            onClick={() => navigate('/collections')}
          >
            View All Products
          </Button>
        </Box>
      </Container>
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

export default ProductShowcase;