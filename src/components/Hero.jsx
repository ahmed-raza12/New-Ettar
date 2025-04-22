import { Box, Typography, Button, Container } from '@mui/material';

const Hero = () => {
  return (
    <Box 
      sx={{
        position: 'relative',
        height: '80vh',
        bgcolor: 'secondary.main',
        display: 'flex',
        alignItems: 'center',
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
          bgcolor: 'rgba(0,0,0,0.4)',
          zIndex: 1
        }}
      />
      
      {/* Content */}
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Box maxWidth="sm">
          <Typography 
            variant="h1" 
            gutterBottom 
            sx={{ 
              color: 'common.white',
              fontSize: { xs: '2.5rem', md: '3.75rem' }
            }}
          >
            Discover Your Signature Scent
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: 'common.white',
              mb: 4
            }}
          >
            Luxury fragrances crafted with the finest ingredients to elevate your everyday.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
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
                }
              }}
              size="large"
            >
              Explore Collections
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Background Image */}
      <Box 
        component="img"
        src="/src/assets/hero.png"
        alt="Luxury fragrance bottles"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </Box>
  );
};

export default Hero;