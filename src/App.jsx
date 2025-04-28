import React, { useEffect } from 'react';
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
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box id="home">
          <Hero />
        </Box>
        <Box id="products">
          <ProductShowcase />
        </Box>
        <Box id="stories">
          <Testimonials />
        </Box>
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
            'https://wa.me/923171775644',
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