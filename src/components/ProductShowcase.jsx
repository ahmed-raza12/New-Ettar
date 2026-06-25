import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  IconButton,
  useTheme, 
  CircularProgress,
  useMediaQuery,
  Snackbar, 
  Alert, 
  AlertTitle,
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

// Fluid high-end animation curve used by luxury apparel brands
const PREMIUM_CUBIC = 'cubic-bezier(0.25, 1, 0.5, 1)';

const ProductShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoPlay, setAutoPlay] = useState(true);

  const ANIMATION_DURATION = 650; // Sweeping, premium feel
  const AUTO_PLAY_DELAY = 5000;
  const MIN_SWIPE_DISTANCE = 50;

  // Memoized image preloader to eliminate multi-render churn
  const preloadAllImages = useCallback((items) => {
    if (!items || items.length === 0) return;
    items.forEach(product => {
      if (product?.image) {
        const img = new Image();
        img.src = product.image;
      }
      if (Array.isArray(product?.images)) {
        product.images.forEach(imgUrl => {
          const img = new Image();
          img.src = imgUrl;
        });
      }
    });
  }, []);

  // Fetch products and kick off a one-time preloader trigger
  useEffect(() => {
    const unsubscribe = getProducts((data) => {
      setProducts(data);
      setLoading(false);
      preloadAllImages(data);
    }, (error) => {
      setError('Failed to load products');
      setLoading(false);
      console.error(error);
    });

    return () => unsubscribe();
  }, [preloadAllImages]);

  // Enforce index boundaries safely if data structure mutations occur
  useEffect(() => {
    if (products.length > 0 && currentIndex >= products.length) {
      setCurrentIndex(0);
    }
  }, [products, currentIndex]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (isAnimating) return;
    addToCart(product);
    setSnackbarOpen(true);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleNext = useCallback(() => {
    if (isAnimating || !products || products.length <= 1) return;
    
    setIsAnimating(true);
    setDirection('next');
    setCurrentIndex(prev => (prev + 1) % products.length);
    
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  }, [isAnimating, products]);

  const handlePrev = useCallback(() => {
    if (isAnimating || !products || products.length <= 1) return;
    
    setIsAnimating(true);
    setDirection('prev');
    setCurrentIndex(prev => prev === 0 ? products.length - 1 : prev - 1);
    
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  }, [isAnimating, products]);

  // Autoplay handler
  useEffect(() => {
    if (autoPlay && products.length > 1) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, AUTO_PLAY_DELAY);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, handleNext, products.length]);

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex || !products || products.length <= 1) return;
    
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
    
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  };

  // Compute layout structure on critical path indices mutations
  const visibleProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    if (isMobile) {
      return [{ ...products[currentIndex], position: 'center' }];
    }
    
    if (isTablet) {
      const visible = [];
      for (let i = 0; i < Math.min(2, products.length); i++) {
        const index = (currentIndex + i) % products.length;
        visible.push({
          ...products[index],
          position: i === 0 ? 'center-left' : 'center-right'
        });
      }
      return visible;
    }
    
    if (products.length >= 3) {
      const prevIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
      const nextIndex = (currentIndex + 1) % products.length;
      
      return [
        { ...products[prevIndex], position: 'left' },
        { ...products[currentIndex], position: 'center' },
        { ...products[nextIndex], position: 'right' }
      ];
    }
    
    if (products.length === 2) {
      return [
        { ...products[0], position: 'left' },
        { ...products[1], position: 'center' }
      ];
    }
    
    return [{ ...products[0], position: 'center' }];
  }, [products, currentIndex, isMobile, isTablet]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setAutoPlay(false);
  };

  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > MIN_SWIPE_DISTANCE) handleNext();
    else if (distance < -MIN_SWIPE_DISTANCE) handlePrev();

    setTouchStart(null);
    setTouchEnd(null);
    setAutoPlay(true);
  };

  // Dynamic style engine translating stage positions into beautiful transitions
  const getCardAnimationStyle = (position) => {
    const baseTransition = `all ${ANIMATION_DURATION}ms ${PREMIUM_CUBIC}`;
    
    if (isMobile) {
      return {
        position: 'absolute',
        width: '100%',
        transform: 'translateX(0) scale(1)',
        opacity: 1,
        transition: baseTransition,
        pointerEvents: isAnimating ? 'none' : 'auto',
      };
    }
    
    if (isTablet) {
      const positions = {
        'center-left': { transform: 'translateX(8%) scale(0.96)', opacity: 0.95, zIndex: 1 },
        'center-right': { transform: 'translateX(-8%) scale(0.96)', opacity: 0.95, zIndex: 1 }
      };
      
      return {
        position: 'relative',
        ...positions[position],
        transition: baseTransition,
        pointerEvents: isAnimating ? 'none' : 'auto',
      };
    }
    
    // Luxury 3D Depth stage layout updates
    // NOTE: no blur() here on purpose — blur on the side cards is what made
    // them look "blurry" during/after the slide. Depth is conveyed with
    // scale/opacity/brightness only, which keeps the side cards crisp.
    const positions = {
      left: {
        transform: 'translateX(-105%) scale(0.82) rotateY(12deg) translateZ(-150px)',
        opacity: 0.6,
        zIndex: 1,
        filter: 'brightness(0.9)',
      },
      center: {
        transform: 'translateX(0) scale(1.04) rotateY(0deg) translateZ(50px)',
        opacity: 1,
        zIndex: 5,
        filter: 'brightness(1)',
      },
      right: {
        transform: 'translateX(105%) scale(0.82) rotateY(-12deg) translateZ(-150px)',
        opacity: 0.6,
        zIndex: 1,
        filter: 'brightness(0.9)',
      }
    };
    
    return {
      position: 'absolute',
      ...positions[position],
      transition: baseTransition,
      transformStyle: 'preserve-3d',
      pointerEvents: isAnimating || position !== 'center' ? 'none' : 'auto',
    };
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 12 },
        bgcolor: KRAFT.cream,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `radial-gradient(${KRAFT.ink}12 0.8px, transparent 0.8px)`,
        backgroundSize: '8px 8px',
      }}
    >
      <Container maxWidth="xl">
        {/* Global Brand Header */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              border: `1px solid ${KRAFT.bronze}80`,
              borderRadius: '999px',
              px: 2.5,
              py: 0.75,
              bgcolor: `${KRAFT.cream}80`,
              backdropFilter: 'blur(4px)'
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: KRAFT.bronze }} />
            <Typography
              variant="overline"
              sx={{ color: KRAFT.bronze, fontSize: '0.7rem', letterSpacing: '0.3em', fontWeight: 600, lineHeight: 1 }}
            >
              AL-MALA FRAGRANCES
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            position: 'relative',
            mb: { xs: 6, md: 10 },
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
            color: KRAFT.ink,
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 0,
              borderTop: `2px dashed ${KRAFT.bronze}`,
            }
          }}
        >
          Our Signature Scents
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 450 }}>
            <CircularProgress size={32} sx={{ color: KRAFT.bronze }} />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 450 }}>
            <Typography color="error" sx={{ fontFamily: 'serif', italic: true }}>{error}</Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 450 }}>
            <Typography sx={{ color: KRAFT.ink, opacity: 0.6 }}>No signature blends available</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: isMobile ? 590 : isTablet ? 560 : 640,
              mx: 'auto',
              perspective: '1600px',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            ref={sliderRef}
          >
            {/* Linear Progress Indicator */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -40,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 160,
                height: 2,
                bgcolor: `${KRAFT.ink}15`,
                borderRadius: 1,
                overflow: 'hidden',
                zIndex: 3
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${100 / products.length}%`,
                  bgcolor: KRAFT.bronze,
                  position: 'absolute',
                  left: `${(currentIndex / products.length) * 100}%`,
                  transition: `left ${ANIMATION_DURATION}ms ${PREMIUM_CUBIC}`
                }}
              />
            </Box>

            {/* Dynamic Navigation System */}
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                pointerEvents: 'none',
                px: { xs: 2, xl: 6 }
              }}
            >
              <IconButton
                onClick={handlePrev}
                disabled={isAnimating}
                sx={{
                  bgcolor: KRAFT.cream,
                  border: `1px solid ${KRAFT.paperDark}`,
                  boxShadow: '0 6px 20px rgba(33,26,18,0.08)',
                  color: KRAFT.ink,
                  width: { xs: 44, md: 54 },
                  height: { xs: 44, md: 54 },
                  pointerEvents: 'auto',
                  transition: `all 0.3s ${PREMIUM_CUBIC}`,
                  '&:hover': {
                    bgcolor: KRAFT.ink,
                    color: KRAFT.cream,
                    borderColor: KRAFT.ink,
                    transform: 'scale(1.08) translateX(-2px)',
                  },
                  '&:disabled': { opacity: 0.3 }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={isAnimating}
                sx={{
                  bgcolor: KRAFT.cream,
                  border: `1px solid ${KRAFT.paperDark}`,
                  boxShadow: '0 6px 20px rgba(33,26,18,0.08)',
                  color: KRAFT.ink,
                  width: { xs: 44, md: 54 },
                  height: { xs: 44, md: 54 },
                  pointerEvents: 'auto',
                  transition: `all 0.3s ${PREMIUM_CUBIC}`,
                  '&:hover': {
                    bgcolor: KRAFT.ink,
                    color: KRAFT.cream,
                    borderColor: KRAFT.ink,
                    transform: 'scale(1.08) translateX(2px)',
                  },
                  '&:disabled': { opacity: 0.3 }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>

            {/* Interactive Carousel Stage */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}
            >
              {visibleProducts.map((product) => (
                <Box
                  // IMPORTANT: key by product.id ONLY (not position).
                  // Keying by position made React unmount/remount a fresh
                  // DOM node every time a card moved slot, which skipped
                  // the CSS transition entirely (no slide, just a jump-cut).
                  // Keying by id lets React keep the same node so the
                  // transform/opacity transition actually animates.
                  key={product.id}
                  onClick={() => !isAnimating && product.position === 'center' && navigate(`/products/${product.id}`)}
                  sx={{
                    width: isMobile ? '100%' : isTablet ? '47%' : '31%',
                    maxWidth: isMobile ? '100%' : isTablet ? 360 : 420,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...getCardAnimationStyle(product.position),
                  }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      height: '94%',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: KRAFT.paper,
                      boxShadow: product.position === 'center' 
                        ? '0 25px 50px -12px rgba(33,26,18,0.25)' 
                        : '0 12px 30px -10px rgba(33,26,18,0.15)',
                      borderRadius: '2px',
                      border: `1px solid ${KRAFT.paperDark}`,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: `transform 0.4s ${PREMIUM_CUBIC}, box-shadow 0.4s ${PREMIUM_CUBIC}, border-color 0.4s`,
                      '&:hover': product.position === 'center' ? {
                        transform: 'translateY(-12px)',
                        borderColor: KRAFT.ink,
                        boxShadow: '0 35px 60px -15px rgba(33,26,18,0.4)',
                        '& .product-image': { transform: 'scale(1.06)' },
                        '& .cart-btn': { bgcolor: KRAFT.bronze }
                      } : {},
                    }}
                  >
                    {/* Editorial Quality Ribbon Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 2,
                        border: `1px solid ${KRAFT.ink}`,
                        color: KRAFT.ink,
                        px: 1.8,
                        py: 0.4,
                        borderRadius: '0px',
                        bgcolor: `${KRAFT.cream}CC`,
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                        {product.badgeText || 'Signature'}
                        {product.badgeText === 'sale' && product.discountedPrice && (
                          <> &nbsp;{Math.round(100 - (product.discountedPrice / product.price) * 100)}% Off</>
                        )}
                      </Typography>
                    </Box>
                    
                    {/* Favorite Micro-Action */}
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); }}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: `${KRAFT.cream}A0`,
                        backdropFilter: 'blur(4px)',
                        zIndex: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: KRAFT.ink,
                        border: `1px solid transparent`,
                        '&:hover': {
                          bgcolor: KRAFT.ink,
                          color: KRAFT.cream,
                          borderColor: KRAFT.ink,
                          transform: 'scale(1.1) rotate(8deg)'
                        }
                      }}
                    >
                      <FavoriteIcon fontSize="small" />
                    </IconButton>

                    {/* Fluid Image Stage Frame */}
                    <Box sx={{
                      position: 'relative',
                      width: '100%',
                      height: 310,
                      overflow: 'hidden',
                      backgroundColor: KRAFT.cream,
                    }}>
                      <Box
                        component="img"
                        className="product-image"
                        src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x400?text=Al-Mala+Blend';
                        }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: `transform 0.8s ${PREMIUM_CUBIC}`,
                        }}
                        loading="lazy"
                      />
                      {/* Deep internal shadow overlay for depth definition */}
                      <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(33,26,18,0.05) 0%, rgba(33,26,18,0) 20%, rgba(33,26,18,0.12) 100%)',
                        pointerEvents: 'none'
                      }} />
                    </Box>
                    
                    <Box sx={{ borderTop: `1px dashed ${KRAFT.paperDark}` }} />
                    
                    {/* Content Architecture Block */}
                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', bgcolor: KRAFT.cream }}>
                      <Typography
                        variant="overline"
                        component="div"
                        sx={{ fontWeight: 700, mb: 0.5, color: KRAFT.bronze, letterSpacing: '0.15em', fontSize: '0.68rem' }}
                      >
                        {product.category}
                      </Typography>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontFamily: '"Playfair Display", Georgia, serif',
                          fontWeight: 700,
                          mb: 1,
                          color: KRAFT.ink,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 3,
                          color: `${KRAFT.ink}B2`,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 36,
                          lineHeight: 1.5,
                          fontSize: '0.825rem'
                        }}
                      >
                        {product.description}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {product.badgeText === 'sale' && product.discountedPrice ? (
                            <>
                              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1, color: '#7A2E1D', fontSize: '1.2rem' }}>
                                Rs.{product.discountedPrice}
                              </Typography>
                              <Typography variant="caption" sx={{ textDecoration: 'line-through', opacity: 0.5, color: KRAFT.ink }}>
                                Rs.{product.price}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h6" sx={{ fontWeight: 700, color: KRAFT.ink, fontSize: '1.15rem' }}>
                              Rs.{product.price}
                            </Typography>
                          )}
                        </Box>
                        
                        <Button
                          variant="contained"
                          className="cart-btn"
                          startIcon={<CartIcon sx={{ fontSize: '1.1rem !important' }} />}
                          onClick={(e) => handleAddToCart(product, e)}
                          sx={{
                            borderRadius: '0px',
                            px: 2.5,
                            py: 1,
                            bgcolor: KRAFT.ink,
                            color: KRAFT.cream,
                            boxShadow: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            transition: `all 0.3s ${PREMIUM_CUBIC}`,
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0 8px 20px rgba(140,90,43,0.2)'
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        
        {/* Footer Collection Link CTA */}
        <Box sx={{ textAlign: 'center', mt: { xs: 12, md: 14 } }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 5,
              py: 1.75,
              borderRadius: '0px',
              borderWidth: '1px !important',
              borderColor: KRAFT.ink,
              color: KRAFT.ink,
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: `all 0.4s ${PREMIUM_CUBIC}`,
              '&:hover': {
                bgcolor: KRAFT.ink,
                color: KRAFT.cream,
                transform: 'translateY(-4px)'
              }
            }}
            onClick={() => navigate('/collections')}
          >
            View All Products
          </Button>
        </Box>
      </Container>
      
      {/* Toast Notification Structure */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '0px',
            boxShadow: '0 20px 40px rgba(33,26,18,0.15)',
            background: KRAFT.cream,
            border: `1px solid ${KRAFT.paperDark}`
          }
        }}
      >
        <Alert
          icon={<CheckCircleSharp fontSize="inherit" />}
          severity="success"
          variant="outlined"
          sx={{
            width: '100%',
            color: KRAFT.ink,
            backgroundColor: 'transparent',
            borderColor: KRAFT.bronze,
            borderRadius: '0px',
            '& .MuiAlert-icon': { color: KRAFT.bronze },
            '& .MuiAlert-message': { display: 'flex', alignItems: 'center', py: 0.5 }
          }}
        >
          <AlertTitle sx={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Added
          </AlertTitle>
          <Typography variant="body2" sx={{ ml: 1.5, color: 'inherit', fontSize: '0.8rem', opacity: 0.85 }}>
            Blend successfully added to your cart selection.
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductShowcase;