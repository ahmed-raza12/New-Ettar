import { Box, Typography, Button, Container, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  return (
    <Box 
      sx={{
        position: 'relative',
        height: { xs: '100vh', sm: '90vh' },
        minHeight: '550px',
        bgcolor: 'secondary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Gradient Overlay for more depth and luxury feel */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(67, 65, 65, 0.6) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 1
        }}
      />
      
      {/* Content */}
      <Container 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 4, sm: 0 }
        }}
      >
        <Box 
          maxWidth="md" 
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
            mt: { xs: 4, sm: 0 }
          }}
        >
          {/* Subtle accent line above heading */}
          <Box 
            sx={{ 
              width: { xs: '60px', sm: '80px' },
              height: '3px',
              bgcolor: 'primary.light',
              mb: 3,
              mx: { xs: 'auto', sm: 0 }
            }} 
          />
          
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'common.white',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              letterSpacing: '0.2em',
              mb: 2,
              display: 'block',
              opacity: 0.9
            }}
          >
            LUXURY FRAGRANCES
          </Typography>
          
          <Typography 
            variant="h1" 
            gutterBottom 
            sx={{ 
              color: 'common.white',
              fontSize: { 
                xs: '2.2rem',
                sm: '3rem', 
                md: '3.2rem' 
              },
              lineHeight: 1.1,
              fontWeight: 600,
              mb: { xs: 2, sm: 3 },
              letterSpacing: '-0.02em',
              color: '#C8A04D',
              textShadow: '0px 2px 4px #000000'
            }}
          >
            Discover Your Signature Scent
          </Typography>
          
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: 'common.white',
              mb: 5,
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              lineHeight: 1.6,
              fontWeight: 300,
              maxWidth: { sm: '90%', md: '80%' },
              opacity: 0.85
            }}
          >
            Artisan fragrances crafted with rare ingredients to elevate your presence and leave an unforgettable impression.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            <Button 
              variant="contained" 
              color="primary"
              size={isMobile ? 'medium' : 'large'}
              fullWidth={isMobile}
              sx={{
                px: { xs: 4, sm: 5 },
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: '2px',
                color: '#C8A04D',
                boxShadow: '0 4px 12px rgba(244, 146, 146, 0.15)',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
            >
              Shop Now
            </Button>
            
            <Button 
              variant="outlined" 
              sx={{ 
                color: '#C8A04D', 
                borderColor: '#C8A04D',
                borderWidth: '1.5px',
                px: { xs: 4, sm: 5 },
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: '2px',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: '#C8A04D',
                  borderColor: '#C8A04D',
                  color: '#fff',
                  borderWidth: '1.5px'
                },
                transition: 'all 0.3s ease'
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
      
      {/* Background Image with enhanced styling */}
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
          objectPosition: { xs: '70% center', sm: 'center center' },
          filter: 'brightness(0.85)',
          transition: 'transform 8s ease-in-out',
          animation: 'subtle-zoom 15s infinite alternate',
          '@keyframes subtle-zoom': {
            '0%': {
              transform: 'scale(1)'
            },
            '100%': {
              transform: 'scale(1.05)'
            }
          }
        }}
        loading="eager" // Critical for hero section
      />
    </Box>
  );
};

export default Hero;