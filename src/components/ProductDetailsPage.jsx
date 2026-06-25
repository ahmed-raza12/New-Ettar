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
  Link as MuiLink,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingBagOutlined as CartIcon,
  FavoriteBorder as FavoriteIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  ShoppingBag,
  CheckCircle,
  LocalShipping,
  SupportAgent,
  Verified,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { addToCart, getCart } from '../utils/cart';
import { getProductById } from '../admin/src/services/productService';

// ---------------------------------------------------------------------------
// AL-MALA — "Kraft & Ink" theme tokens
// Display face: Playfair Display (headlines only, used with restraint)
// UI/body face: Jost (clean geometric sans — labels, body copy, buttons)
// ---------------------------------------------------------------------------
const KRAFT = {
  paper: '#D9BD93',
  paperLight: '#E7D3AE',
  paperDark: '#B99564',
  ink: '#211A12',
  cream: '#F4ECDC',
  bronze: '#8C5A2B',
  rust: '#7A2E1D',
  moss: '#4B5E3A',
};

const FONT = {
  display: '"Playfair Display", Georgia, serif',
  sans: '"Jost", "Helvetica Neue", Arial, sans-serif',
};

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: FONT.display,
  fontWeight: 700,
  letterSpacing: '0.08em',
  fontSize: '1.4rem',
  color: KRAFT.cream,
  [theme.breakpoints.up('md')]: {
    fontSize: '1.65rem',
  },
}));

const CartBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    top: -5,
    right: -8,
    width: 18,
    height: 18,
    fontSize: '0.625rem',
    fontFamily: FONT.sans,
    backgroundColor: KRAFT.bronze,
    color: KRAFT.cream,
  },
});

// Fixed: responsive height now uses a real breakpoint query rather than a
// {xs,md} object literal, which styled() doesn't translate for plain CSS
// props (that shorthand only works inside `sx`). Previously this rendered
// at a single fixed height on every screen size.
const ImageSlider = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '380px',
  overflow: 'hidden',
  backgroundColor: KRAFT.cream,
  borderRadius: '4px',
  border: `1px solid ${KRAFT.paperDark}`,
  [theme.breakpoints.up('md')]: {
    height: '560px',
  },
}));

const NavigationButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(244, 236, 220, 0.92)',
  border: `1.5px solid ${KRAFT.paperDark}`,
  transition: 'all 0.25s ease',
  '&:hover': {
    backgroundColor: KRAFT.paper,
    borderColor: KRAFT.bronze,
  },
  zIndex: 3,
}));

const DotsContainer = styled(Box)({
  position: 'absolute',
  bottom: '14px',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  zIndex: 3,
});

// Signature "apothecary ticket" surface — a punched-edge stub used for the
// price block and trust badges. The notches + dashed seam are this page's
// one recurring, deliberate motif (echoes a fragrance sample label).
const TicketSurface = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: KRAFT.paper,
  border: `1px solid ${KRAFT.paperDark}`,
  borderRadius: '4px',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: theme.palette.background?.default || KRAFT.cream,
    top: '50%',
    transform: 'translateY(-50%)',
    boxShadow: `inset 0 0 0 1px ${KRAFT.paperDark}`,
  },
  '&::before': { left: -8 },
  '&::after': { right: -8 },
}));

// Generate product schema for structured data
const generateProductSchema = (product, images) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: images.map((img) => new URL(img, 'https://almalafragrance.com').toString()),
  description: product.description || 'Premium fragrance from AlMala Fragrance',
  brand: {
    '@type': 'Brand',
    name: product.brand || 'AlMala Fragrance',
  },
  offers: {
    '@type': 'Offer',
    price: product.price?.toString() || '0.00',
    priceCurrency: 'PKR',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    url: `https://almalafragrance.com/products/${product.id}`,
  },
  aggregateRating: product.rating
    ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount?.toString() || '0',
        bestRating: '5',
        worstRating: '1',
      }
    : undefined,
});

const generateBreadcrumbSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://almalafragrance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Collections', item: 'https://almalafragrance.com/collections' },
    { '@type': 'ListItem', position: 3, name: product.name, item: `https://almalafragrance.com/products/${product.id}` },
  ],
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
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const canonicalUrl = `https://almalafragrance.com/products/${productId}`;

  const images = useMemo(
    () =>
      product?.images?.length > 0
        ? product.images
        : product?.image
        ? [product.image]
        : ['/placeholder-product.jpg'],
    [product?.images, product?.image]
  );

  const mainImage = useMemo(() => (product ? images[currentImageIndex] || '' : ''), [product, images, currentImageIndex]);

  const imageUrl = useMemo(
    () => (mainImage.startsWith('http') ? mainImage : mainImage ? `https://almalafragrance.com${mainImage}` : ''),
    [mainImage]
  );

  const pageTitle = useMemo(
    () => (product ? `${product.name} | ${product.brand || 'AlMala Fragrance'}` : 'Loading...'),
    [product?.name, product?.brand]
  );

  const pageDescription = useMemo(
    () =>
      product?.description ||
      (product?.name ? `Discover ${product.name}, a premium fragrance by ${product.brand || 'AlMala Fragrance'}.` : 'Premium fragrances by AlMala'),
    [product?.description, product?.name, product?.brand]
  );

  const productSchema = useMemo(() => (product ? generateProductSchema(product, images) : null), [product, images]);
  const breadcrumbSchema = useMemo(() => (product ? generateBreadcrumbSchema(product) : null), [product]);

  useEffect(() => {
    const handleCartUpdate = () => setCartItems(getCart());
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleAddToCart = (product) => {
    if (!product) return;
    addToCart(product);
    setShowAddedToCart(true);
    window.dispatchEvent(new Event('cartUpdated'));
    setTimeout(() => setShowAddedToCart(false), 3000);
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
    if (productId) fetchProduct();
  }, [productId]);

  // Trigger the one quiet entrance fade once content is ready.
  useEffect(() => {
    if (!loading && product) {
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    }
  }, [loading, product]);

  const handleNextImage = () => setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  const handlePrevImage = () => setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goToImage = (index) => setCurrentImageIndex(index);

  const reduceMotionSx = {
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none !important',
      opacity: '1 !important',
      transform: 'none !important',
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          bgcolor: KRAFT.cream,
          gap: 3,
        }}
      >
        <CircularProgress sx={{ color: KRAFT.bronze }} />
        <Typography sx={{ color: KRAFT.ink, fontFamily: FONT.display, fontStyle: 'italic' }}>
          Unveiling the fragrance...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ bgcolor: KRAFT.cream, minHeight: '60vh', py: 8 }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 4,
              color: KRAFT.bronze,
              fontFamily: FONT.sans,
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(140,90,43,0.08)' },
            }}
          >
            Back to Products
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontFamily: FONT.display, color: KRAFT.ink, mb: 2 }}>
              {error || 'Product not found'}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/collections')}
              sx={{
                borderColor: KRAFT.bronze,
                color: KRAFT.bronze,
                fontFamily: FONT.sans,
                fontWeight: 600,
                '&:hover': { borderColor: KRAFT.ink, bgcolor: 'rgba(140,90,43,0.08)' },
              }}
            >
              Browse Collections
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const hasDiscount = product.discountedPrice && product.price > product.discountedPrice;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: KRAFT.cream,
        minHeight: '100vh',
        fontFamily: FONT.sans,
        backgroundImage: 'radial-gradient(rgba(33,26,18,0.03) 0.6px, transparent 0.6px)',
        backgroundSize: '6px 6px',
      }}
      itemScope
      itemType="https://schema.org/Product"
    >
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,500&display=swap"
          rel="stylesheet"
        />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="AlMala Fragrance" />
        <meta property="product:price:amount" content={product.price?.toString() || '0'} />
        <meta property="product:price:currency" content="PKR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
        {productSchema && <script type="application/ld+json">{JSON.stringify(productSchema)}</script>}
        {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
      </Helmet>

      {/* Header Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: KRAFT.ink, mb: 4, borderBottom: `2px solid ${KRAFT.bronze}` }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate(-1)} sx={{ color: KRAFT.cream }} aria-label="go back">
                <ArrowBackIcon />
              </IconButton>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <LogoText>Al Mala</LogoText>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ '& .MuiBreadcrumbs-separator': { color: KRAFT.paperDark } }}>
            <MuiLink
              component={Link}
              to="/"
              underline="hover"
              sx={{ color: KRAFT.bronze, fontFamily: FONT.sans, fontWeight: 500, fontSize: '0.82rem', '&:hover': { color: KRAFT.ink } }}
            >
              Home
            </MuiLink>
            <MuiLink
              component={Link}
              to="/collections"
              underline="hover"
              sx={{ color: KRAFT.bronze, fontFamily: FONT.sans, fontWeight: 500, fontSize: '0.82rem', '&:hover': { color: KRAFT.ink } }}
            >
              Collections
            </MuiLink>
            <Typography sx={{ color: KRAFT.ink, fontFamily: FONT.sans, fontWeight: 600, fontSize: '0.82rem' }}>
              {product.name}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 3, md: 6 },
          }}
        >
          {/* Gallery column: thumbnail rail sits beside the image on desktop, below it on mobile */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5 }}>
            {images.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  order: { xs: 2, md: 1 },
                  gap: 1.25,
                  overflowX: { xs: 'auto', md: 'visible' },
                  overflowY: { xs: 'visible', md: 'auto' },
                  py: { xs: 1, md: 0 },
                  maxHeight: { md: 560 },
                }}
              >
                {images.map((img, index) => (
                  <Box
                    key={index}
                    onClick={() => goToImage(index)}
                    sx={{
                      width: { xs: 72, md: 76 },
                      height: { xs: 72, md: 76 },
                      minWidth: { xs: 72, md: 76 },
                      borderRadius: '4px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: currentImageIndex === index ? `2px solid ${KRAFT.bronze}` : `1px solid ${KRAFT.paperDark}`,
                      opacity: currentImageIndex === index ? 1 : 0.65,
                      transition: 'all 0.25s ease',
                      '&:hover': { opacity: 1, transform: 'scale(1.04)', borderColor: KRAFT.bronze },
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            <ImageSlider sx={{ order: { xs: 1, md: 2 }, flex: 1 }}>
              {images.length > 1 && (
                <>
                  <NavigationButton onClick={handlePrevImage} sx={{ left: '10px' }} aria-label="previous image">
                    <ArrowBackIosIcon sx={{ color: KRAFT.ink }} />
                  </NavigationButton>
                  <NavigationButton onClick={handleNextImage} sx={{ right: '10px' }} aria-label="next image">
                    <ArrowForwardIosIcon sx={{ color: KRAFT.ink }} />
                  </NavigationButton>
                  <DotsContainer>
                    {images.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => goToImage(index)}
                        sx={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          bgcolor: index === currentImageIndex ? KRAFT.bronze : 'rgba(33,26,18,0.25)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: index === currentImageIndex ? 'scale(1.3)' : 'scale(1)',
                          '&:hover': { bgcolor: KRAFT.bronze },
                        }}
                      />
                    ))}
                  </DotsContainer>
                </>
              )}

              {/* Crossfade stack: every image is mounted and absolutely positioned;
                  only opacity changes, so switching images animates smoothly
                  instead of popping instantly. */}
              {images.map((img, index) => (
                <Box
                  key={img + index}
                  component="img"
                  src={img}
                  alt={`${product.name} - ${product.brand || 'AlMala Fragrance'}`}
                  itemProp={index === currentImageIndex ? 'image' : undefined}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image+Available';
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    margin: 'auto',
                    maxWidth: '92%',
                    maxHeight: '92%',
                    objectFit: 'contain',
                    opacity: index === currentImageIndex ? 1 : 0,
                    transition: 'opacity 0.45s ease',
                    pointerEvents: 'none',
                    ...reduceMotionSx,
                  }}
                />
              ))}
            </ImageSlider>
          </Box>

          {/* Product Info */}
          <Box
            sx={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              ...reduceMotionSx,
            }}
          >
            {product.category && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    bgcolor: KRAFT.paper,
                    color: KRAFT.ink,
                    border: `1px solid ${KRAFT.paperDark}`,
                    fontFamily: FONT.sans,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                  }}
                />
              </Box>
            )}

            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              itemProp="name"
              sx={{
                fontFamily: FONT.display,
                fontWeight: 700,
                color: KRAFT.ink,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.15,
              }}
            >
              {product.name}
            </Typography>

            {product.brand && (
              <Typography
                variant="body1"
                sx={{ color: KRAFT.bronze, mb: 2, fontFamily: FONT.display, fontStyle: 'italic', letterSpacing: '0.02em' }}
              >
                by {product.brand}
              </Typography>
            )}

            {product.rating && (
              <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }} itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                <Rating
                  value={product.rating || 0}
                  precision={0.5}
                  readOnly
                  sx={{ mr: 1, color: KRAFT.bronze, '& .MuiRating-iconFilled': { color: KRAFT.bronze } }}
                  aria-label={`Rating: ${product.rating || 0} out of 5`}
                />
                <Typography variant="body2" sx={{ color: 'rgba(33,26,18,0.6)', fontFamily: FONT.sans }}>
                  <span itemProp="ratingValue">{product.rating || 0}</span> out of <span itemProp="bestRating">5</span> (
                  <span itemProp="reviewCount">{product.reviewCount || 0}</span> reviews)
                </Typography>
                <meta itemProp="worstRating" content="1" />
              </Box>
            )}

            {/* Price ticket — the page's signature element */}
            <TicketSurface
              sx={{ my: 3, display: 'flex', alignItems: 'stretch' }}
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <Box sx={{ flex: 1, p: 3 }}>
                <Typography
                  variant="caption"
                  sx={{ color: KRAFT.bronze, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, display: 'block', mb: 0.5 }}
                >
                  Price
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: hasDiscount ? KRAFT.rust : KRAFT.ink, fontFamily: FONT.display, lineHeight: 1 }}
                >
                  <span itemProp="price" content={product.price?.toString() || '0.00'}>
                    Rs.{(product.discountedPrice || product.price)?.toFixed(2) || '0.00'}
                  </span>
                  <meta itemProp="priceCurrency" content="PKR" />
                  <link itemProp="availability" href="https://schema.org/InStock" />
                  <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />
                  <meta itemProp="url" content={canonicalUrl} />
                </Typography>
              </Box>

              {hasDiscount && (
                <>
                  <Box
                    sx={{
                      borderLeft: `2px dashed ${KRAFT.paperDark}`,
                      my: 1.5,
                    }}
                  />
                  <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.75 }}>
                    <Typography variant="caption" sx={{ color: KRAFT.bronze, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                      Was
                    </Typography>
                    <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'rgba(33,26,18,0.5)', fontFamily: FONT.sans }}>
                      Rs.{product.price}
                    </Typography>
                    <Chip
                      label={`${Math.round(100 - (product.discountedPrice / product.price) * 100)}% OFF`}
                      size="small"
                      sx={{ bgcolor: KRAFT.rust, color: KRAFT.cream, fontWeight: 700, fontSize: '0.68rem', height: 22, alignSelf: 'flex-start' }}
                    />
                  </Box>
                </>
              )}
            </TicketSurface>

            <Typography
              variant="body1"
              paragraph
              itemProp="description"
              sx={{ color: 'rgba(33,26,18,0.72)', lineHeight: 1.8, fontSize: '0.95rem', mb: 4, fontFamily: FONT.sans }}
            >
              {product.description || 'No description available.'}
            </Typography>

            <Divider sx={{ my: 3, borderColor: KRAFT.paperDark, borderStyle: 'dashed' }} />

            {/* Key Details */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontFamily: FONT.display, fontWeight: 600, color: KRAFT.ink, mb: 2 }}
              >
                Product Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box sx={{ p: 2, bgcolor: KRAFT.paper, borderRadius: '4px', border: `1px solid ${KRAFT.paperDark}` }}>
                  <Typography variant="caption" sx={{ color: KRAFT.bronze, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.5, fontWeight: 600 }}>
                    Size
                  </Typography>
                  <Typography variant="body1" sx={{ color: KRAFT.ink, fontWeight: 500, fontFamily: FONT.sans }}>
                    {product.size || '100ml'}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: KRAFT.paper, borderRadius: '4px', border: `1px solid ${KRAFT.paperDark}` }}>
                  <Typography variant="caption" sx={{ color: KRAFT.bronze, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.5, fontWeight: 600 }}>
                    Availability
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: KRAFT.moss, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.75, fontFamily: FONT.sans }}
                    itemProp="availability"
                    content="https://schema.org/InStock"
                  >
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: KRAFT.moss }} />
                    In Stock
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Trust badges — stamp-style, echoing the ticket motif */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
              {[
                { icon: <Verified sx={{ fontSize: 15 }} />, text: 'Authentic' },
                { icon: <LocalShipping sx={{ fontSize: 15 }} />, text: 'Free Shipping' },
                { icon: <SupportAgent sx={{ fontSize: 15 }} />, text: '24/7 Support' },
              ].map((badge, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.6,
                    px: 1.4,
                    py: 0.6,
                    borderRadius: '999px',
                    border: `1px dashed ${KRAFT.paperDark}`,
                    color: KRAFT.bronze,
                  }}
                >
                  {badge.icon}
                  <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.03em', fontFamily: FONT.sans }}>
                    {badge.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Box sx={{ flex: 3, position: 'relative' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={showAddedToCart ? <CheckCircle /> : <CartIcon />}
                  onClick={() => handleAddToCart(product)}
                  disabled={showAddedToCart}
                  fullWidth
                  sx={{
                    py: 1.75,
                    borderRadius: '4px',
                    bgcolor: showAddedToCart ? KRAFT.moss : KRAFT.ink,
                    color: KRAFT.cream,
                    fontFamily: FONT.sans,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontSize: '0.92rem',
                    border: `2px solid ${showAddedToCart ? KRAFT.moss : KRAFT.ink}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: showAddedToCart ? KRAFT.moss : KRAFT.bronze,
                      borderColor: showAddedToCart ? KRAFT.moss : KRAFT.bronze,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(33,26,18,0.3)',
                    },
                    '&:disabled': { bgcolor: KRAFT.moss, borderColor: KRAFT.moss, color: KRAFT.cream },
                  }}
                >
                  {showAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </Button>
                {showAddedToCart && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: -25,
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      color: KRAFT.moss,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      fontFamily: FONT.sans,
                    }}
                  >
                    ✓ Successfully added to your cart
                  </Typography>
                )}
              </Box>

              <IconButton
                aria-label="add to favorites"
                sx={{
                  border: `2px solid ${KRAFT.paperDark}`,
                  borderRadius: '4px',
                  height: '56px',
                  width: '56px',
                  color: KRAFT.ink,
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: KRAFT.bronze, color: KRAFT.cream, borderColor: KRAFT.bronze, transform: 'scale(1.05)' },
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