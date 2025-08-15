import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import { Box, Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function App() {
  useEffect(() => {
    console.log('Current cart:', localStorage.getItem('fragranceCart'));
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>AlMala Fragrance - Premium Fragrances Collection</title>
        <meta name="description" content="Discover our exclusive collection of premium fragrances. Shop the finest Ettar perfumes with authentic scents and long-lasting fragrance experience." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://almalafragrance.com/" />
        <meta property="og:title" content="AlMala Fragrance - Premium Fragrances Collection" />
        <meta property="og:description" content="Discover our exclusive collection of premium fragrances. Shop the finest Ettar perfumes with authentic scents and long-lasting fragrance experience." />
        <meta property="og:image" content="https://almalafragrance.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://almalafragrance.com/" />
        <meta property="twitter:title" content="AlMala Fragrance - Premium Fragrances Collection" />
        <meta property="twitter:description" content="Discover our exclusive collection of premium fragrances. Shop the finest Ettar perfumes with authentic scents and long-lasting fragrance experience." />
        <meta property="twitter:image" content="https://almalafragrance.com/twitter-card.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://almalafragrance.com/" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Language and Region */}
        <html lang="en" />
      </Helmet>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box id="home">
          <Hero />
        </Box>
        <Box id="products">
          <ProductShowcase />
        </Box>
        {/* <Box id="stories">
          <Testimonials />
        </Box> */}
        <Box id="contact">
          <Newsletter />
        </Box>
      </Box>
      <Footer />
      <Fab
        color="success"
        aria-label="Chat on WhatsApp"
        sx={{
          position: 'fixed',
          bottom: 20, // Distance from the bottom
          right: 20,  // Distance from the right
          bgcolor: '#25D366', // WhatsApp green color
          '&:hover': { bgcolor: '#20b858' }, // Hover effect
        }}
        onClick={() =>
          window.open(
            'https://wa.me/923283601150',
            '_blank'
          )
        }
      >
        <WhatsAppIcon />
      </Fab>
    </Box>
  );
}

export default App;