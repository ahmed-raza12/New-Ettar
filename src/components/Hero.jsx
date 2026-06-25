// components/Hero.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getHeroData } from '../admin/src/services/heroService';
import defaultHeroImage from '../assets/hero1.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ---------------------------------------------------------------------------
// AL-MALA — "Kraft & Ink" theme
// Palette pulled directly from the packaging: unbleached kraft paper,
// deep ink-black linework, and a single bronze stamp accent.
// ---------------------------------------------------------------------------
const KRAFT = {
  paper: '#D9BD93',      // box face
  paperLight: '#E7D3AE',
  paperDark: '#B99564',
  ink: '#211A12',        // printed linework
  cream: '#F4ECDC',      // interior card stock
  bronze: '#8C5A2B',     // stamp accent
};

// Default fallback content
const DEFAULT_HERO = {
  title: 'Discover Your Signature Scent',
  subtitle: 'Artisan fragrances crafted with rare ingredients to elevate your presence and leave an unforgettable impression.',
  imageUrl: defaultHeroImage,
  ctaText: 'Shop Now',
  exploreText: 'Explore Collections',
  titleColor: KRAFT.cream,
  subtitleColor: KRAFT.paperLight,
  showTitle: true,
  showSubtitle: true,
  showButtons: true,
};

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await getHeroData();
        if (data) {
          setHeroData({
            ...DEFAULT_HERO,
            ...data,
            imageUrl: data.imageUrl || DEFAULT_HERO.imageUrl,
          });
        } else {
          setHeroData(DEFAULT_HERO);
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

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = heroData.imageUrl;
    img.onload = () => setImageLoaded(true);
  }, [heroData.imageUrl]);

  if (loading) {
    return (
      <Box
        sx={{
          height: { xs: '100vh', sm: '90vh' },
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: KRAFT.ink,
          gap: 3,
          position: 'relative',
          overflow: 'hidden',
          // Subtle loading pattern
          backgroundImage: `radial-gradient(rgba(217,189,147,0.08) 0.8px, transparent 0.8px)`,
          backgroundSize: '8px 8px',
        }}
      >
        {/* Loading animation */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2px solid ${KRAFT.bronze}`,
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: KRAFT.paperLight, 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase', 
            fontSize: '0.9rem',
            fontFamily: '"Playfair Display", Georgia, serif',
          }}
        >
          Wrapping the scent…
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '100vh', sm: '90vh' },
        minHeight: 600,
        bgcolor: KRAFT.ink,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Image with fade-in effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        <Box
          component="img"
          src={heroData.imageUrl}
          alt="Luxury fragrance bottles"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: { xs: '75% center', sm: 'center center' },
            filter: 'sepia(0.15) brightness(0.75) contrast(1.08)',
            animation: 'subtle-zoom 20s infinite alternate ease-in-out',
            '@keyframes subtle-zoom': {
              '0%': { transform: 'scale(1)' },
              '100%': { transform: 'scale(1.06)' }
            }
          }}
          loading="eager"
        />
      </Box>

      {/* Multi-layer gradient overlay for depth */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: `
            linear-gradient(
              105deg, 
              ${KRAFT.ink} 0%, 
              rgba(33,26,18,0.85) 25%, 
              rgba(33,26,18,0.5) 50%, 
              rgba(33,26,18,0.15) 75%, 
              rgba(33,26,18,0.02) 100%
            )
          `,
        }}
      />

      {/* Vignette effect */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: `
            radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(33,26,18,0.3) 100%
            )
          `,
        }}
      />

      {/* Paper grain texture overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.08,
          mixBlendMode: 'overlay',
          backgroundImage: `
            radial-gradient(rgba(255,255,255,0.3) 0.4px, transparent 0.4px),
            radial-gradient(rgba(0,0,0,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '4px 4px, 20px 20px',
        }}
      />

      {/* Decorative corner accents */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 32 },
          left: { xs: 16, md: 32 },
          width: { xs: 30, md: 50 },
          height: { xs: 30, md: 50 },
          borderTop: `2px solid ${KRAFT.bronze}`,
          borderLeft: `2px solid ${KRAFT.bronze}`,
          opacity: 0.4,
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 32 },
          right: { xs: 16, md: 32 },
          width: { xs: 30, md: 50 },
          height: { xs: 30, md: 50 },
          borderTop: `2px solid ${KRAFT.bronze}`,
          borderRight: `2px solid ${KRAFT.bronze}`,
          opacity: 0.4,
          zIndex: 2,
        }}
      />

      {/* Content */}
      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          px: { xs: 3, sm: 4, md: 8 },
          py: { xs: 4, sm: 0 }
        }}
      >
        <Box
          maxWidth="lg"
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
            mt: { xs: 4, sm: 0 },
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          {/* Stamp-style eyebrow badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              border: `1.5px solid ${KRAFT.bronze}`,
              borderRadius: '999px',
              px: 2.5,
              py: 0.75,
              mb: { xs: 3, md: 4 },
              mx: { xs: 'auto', sm: 0 },
              bgcolor: 'rgba(140,90,43,0.1)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(140,90,43,0.2)',
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: KRAFT.bronze,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }} 
            />
            <Typography
              variant="overline"
              sx={{
                color: KRAFT.paper,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                letterSpacing: '0.3em',
                lineHeight: 1,
                fontWeight: 600,
              }}
            >
              EXCLUSIVELY CUSTOM MADE
            </Typography>
          </Box>

          {/* Main Title */}
          {heroData.showTitle && (
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                color: heroData.titleColor,
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem', lg: '4.2rem' },
                lineHeight: 1.1,
                fontWeight: 700,
                mb: { xs: 2, sm: 3 },
                letterSpacing: '-0.01em',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                maxWidth: { md: '80%' },
              }}
            >
              {heroData.title}
            </Typography>
          )}

          {/* Subtitle */}
          {heroData.showSubtitle && (
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: heroData.subtitleColor,
                mb: { xs: 4, sm: 5 },
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                lineHeight: 1.7,
                fontWeight: 300,
                maxWidth: { xs: '100%', sm: '90%', md: '65%' },
                opacity: 0.9,
                textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            >
              {heroData.subtitle}
            </Typography>
          )}

          {/* CTA Buttons */}
          {heroData.showButtons && (
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', sm: 'flex-start' },
                alignItems: 'center',
              }}
            >
              {/* Primary CTA */}
              <Button
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                fullWidth={isMobile}
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/collections')}
                sx={{
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.5, sm: 1.75 },
                  borderRadius: '4px',
                  bgcolor: KRAFT.paper,
                  color: KRAFT.ink,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: `2px solid ${KRAFT.paper}`,
                  '&:hover': {
                    bgcolor: KRAFT.paperLight,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    transform: 'translateY(-2px)',
                    borderColor: KRAFT.paperLight,
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                {heroData.ctaText}
              </Button>

              {/* Secondary CTA */}
              <Button
                variant="outlined"
                sx={{
                  color: KRAFT.paperLight,
                  borderColor: KRAFT.paper,
                  borderWidth: '2px',
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.5, sm: 1.75 },
                  borderRadius: '4px',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    bgcolor: KRAFT.paper,
                    borderColor: KRAFT.paper,
                    color: KRAFT.ink,
                    borderWidth: '2px',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
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

      {/* Decorative side elements */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: -20, md: 0 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          opacity: 0.08,
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <Typography
          sx={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '8rem',
            fontWeight: 900,
            color: KRAFT.paper,
            letterSpacing: '0.2em',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          AL-MALA
        </Typography>
      </Box>

      {/* Bottom dashed "cut line" — echoes the box flap edge */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 0,
          borderTop: `2px dashed ${KRAFT.bronze}`,
          opacity: 0.6,
          zIndex: 2,
        }}
      />

      {/* Bottom decorative dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          gap: 1,
          opacity: 0.5,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: KRAFT.bronze,
            }}
          />
        ))}
      </Box>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': { transform: 'translateX(-50%) translateY(0)' },
            '40%': { transform: 'translateX(-50%) translateY(-10px)' },
            '60%': { transform: 'translateX(-50%) translateY(-5px)' },
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: KRAFT.paperLight,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontSize: '0.65rem',
            opacity: 0.7,
          }}
        >
          Scroll to explore
        </Typography>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRight: `2px solid ${KRAFT.bronze}`,
            borderBottom: `2px solid ${KRAFT.bronze}`,
            transform: 'rotate(45deg)',
            opacity: 0.6,
          }}
        />
      </Box>
    </Box>
  );
};

export default Hero;