import { Box, Typography, Button, Container, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';
const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  return (
    <Box 
      sx={{
        position: 'relative',
        height: { xs: '90vh', sm: '80vh' }, // Taller on mobile for better visibility
        minHeight: '500px', // Ensure it doesn't get too small
        bgcolor: 'secondary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
        overflow: 'hidden'
      }}
    >
      {/* Overlay */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.3)',
          zIndex: 1
        }}
      />
      
      {/* Content */}
      <Container 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          px: { xs: 3, sm: 4 }, // More padding on mobile
          py: { xs: 4, sm: 0 } // Vertical padding on mobile
        }}
      >
        <Box 
          maxWidth="sm" 
          sx={{
            textAlign: { xs: 'center', sm: 'left' }, // Center text on mobile
            mt: { xs: 4, sm: 0 } // Add top margin on mobile if needed
          }}
        >
          <Typography 
            variant="h1" 
            gutterBottom 
            sx={{ 
              color: 'common.white',
              fontSize: { 
                xs: '2rem', // Smaller on very small devices
                sm: '2.5rem', 
                md: '3.75rem' 
              },
              lineHeight: 1.2,
              fontWeight: 700,
              mb: { xs: 2, sm: 3 }
            }}
          >
            Discover Your Signature Scent
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: 'common.white',
              mb: 4,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }, // Adjust subtitle size
              lineHeight: 1.5
            }}
          >
            Luxury fragrances crafted with the finest ingredients to elevate your everyday.
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons vertically on mobile
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            <Button 
              variant="contained" 
              color="primary"
              size={isMobile ? 'medium' : 'large'} // Slightly smaller on mobile
              fullWidth={isMobile} // Full width on mobile
            >
              Shop Now
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                color: 'common.white', 
                borderColor: 'common.white',
                '&:hover': {
                  bgcolor: 'common.white',
                  color: 'primary.main',
                  borderColor: 'common.white'
                },
                whiteSpace: 'nowrap' // Prevent button text from wrapping
              }}
              size={isMobile ? 'medium' : 'large'}
              fullWidth={isMobile}
              onClick={() => navigate('/collections')}
            >
              Explore Collections
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Background Image - with mobile-specific optimizations */}
      <Box 
        component="img"
        src={heroImage}
        alt="Luxury fragrance bottles"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: { xs: 'center center', sm: 'center center' } // Adjust focus point if needed
        }}
        loading="lazy" // Better performance
      />
    </Box>
  );
};

export default Hero;