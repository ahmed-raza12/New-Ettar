// components/Hero.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getHeroData } from '../admin/src/services/heroService';
import defaultHeroImage from '../assets/hero.jpg';

// Default fallback content
const DEFAULT_HERO = {
  title: 'Discover Your Signature Scent',
  subtitle: 'Artisan fragrances crafted with rare ingredients to elevate your presence and leave an unforgettable impression.',
  imageUrl: defaultHeroImage,
  ctaText: 'Shop Now',
  exploreText: 'Explore Collections',
  titleColor: '#C8A04D',
  subtitleColor: 'common.white',
  showTitle: true,
  showSubtitle: true,
  showButtons: true,
};

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await getHeroData();
        if (data) {
          // If image URL is relative, keep default image
          setHeroData({
            ...DEFAULT_HERO,
            ...data,
            imageUrl: data.imageUrl || DEFAULT_HERO.imageUrl,
          });
        } else {
          setHeroData(DEFAULT_HERO); // Use default if no data
        }
      } catch (err) {
        console.error("Error loading hero data, using default:", err);
        setHeroData(DEFAULT_HERO);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: { xs: '100vh', sm: '90vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'secondary.main',
        }}
      >
        <Typography variant="h6" color="common.white">
          Loading...
        </Typography>
      </Box>
    );
  }

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
      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
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
          {heroData.showTitle && (
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                color: heroData.titleColor,
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.2rem' },
                lineHeight: 1.1,
                fontWeight: 600,
                mb: { xs: 2, sm: 3 },
                letterSpacing: '-0.02em',
                textShadow: '0px 2px 4px #000000'
              }}
            >
              {heroData.title}
            </Typography>
          )}
          {heroData.showSubtitle && (
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: heroData.subtitleColor,
                mb: 5,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                lineHeight: 1.6,
                fontWeight: 300,
                maxWidth: { sm: '90%', md: '80%' },
                opacity: 0.85
              }}
            >
              {heroData.subtitle}
            </Typography>
          )}
          {heroData.showButtons && (
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
                {heroData.ctaText}
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
                {heroData.exploreText}
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Background Image */}
      <Box
        component="img"
        src={heroData.imageUrl}
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
          animation: 'subtle-zoom 15s infinite alternate',
          '@keyframes subtle-zoom': {
            '0%': { transform: 'scale(1)' },
            '100%': { transform: 'scale(1.05)' }
          }
        }}
        loading="eager"
      />
    </Box>
  );
};

export default Hero;