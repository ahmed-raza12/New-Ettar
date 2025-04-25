import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import { Box } from '@mui/material';

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
    </Box>
  );
}

export default App;