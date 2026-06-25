import { useState } from 'react';
import { Container, Typography, Box, Link, TextField, Button, Paper } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

const FragranceCircle = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Joined the Fragrance Circle with:', email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: KRAFT.ink,
        position: 'relative',
        overflow: 'hidden',
        // Subtle dotted background pattern
        backgroundImage: `radial-gradient(rgba(217,189,147,0.08) 0.8px, transparent 0.8px)`,
        backgroundSize: '8px 8px',
        // Decorative top border
        borderTop: `3px solid ${KRAFT.bronze}`,
        borderBottom: `3px solid ${KRAFT.bronze}`,
      }}
    >
      {/* Decorative corner accents */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 40,
          height: 40,
          borderTop: `2px solid ${KRAFT.bronze}`,
          borderLeft: `2px solid ${KRAFT.bronze}`,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderTop: `2px solid ${KRAFT.bronze}`,
          borderRight: `2px solid ${KRAFT.bronze}`,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 40,
          height: 40,
          borderBottom: `2px solid ${KRAFT.bronze}`,
          borderLeft: `2px solid ${KRAFT.bronze}`,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 40,
          height: 40,
          borderBottom: `2px solid ${KRAFT.bronze}`,
          borderRight: `2px solid ${KRAFT.bronze}`,
          opacity: 0.6,
        }}
      />

      <Container maxWidth="md">
        {/* Stamp-style eyebrow badge */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              border: `1.5px solid ${KRAFT.paper}`,
              borderRadius: '999px',
              px: 2.5,
              py: 0.75,
              bgcolor: 'rgba(140,90,43,0.15)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: KRAFT.paper,
              }}
            />
            <Typography
              variant="overline"
              sx={{
                color: KRAFT.paper,
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                lineHeight: 1,
                fontWeight: 600,
              }}
            >
              EXCLUSIVE COMMUNITY
            </Typography>
          </Box>
        </Box>

        {/* Main heading with gradient */}
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: { xs: 3, md: 4 },
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: {
              xs: '1.8rem',
              sm: '2.5rem',
              md: '3rem',
              lg: '3.5rem',
            },
            color: KRAFT.paper,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: 60, sm: 100, md: 120 },
              height: 0,
              borderTop: `2px dashed ${KRAFT.bronze}`,
            },
          }}
        >
          Join the Fragrance Circle
        </Typography>

        {/* Description text */}
        <Typography
          variant="body1"
          align="center"
          sx={{
            mb: 5,
            maxWidth: 650,
            mx: 'auto',
            color: KRAFT.paperLight,
            fontSize: { xs: '0.95rem', md: '1.1rem' },
            lineHeight: 1.8,
            opacity: 0.9,
            px: { xs: 2, md: 0 },
          }}
        >
          Be part of our exclusive fragrance community. Follow our WhatsApp channel 
          for early access to new releases, exclusive offers, fragrance tips, 
          and special member-only gifts.
        </Typography>

        {/* WhatsApp Button */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link
            href="https://whatsapp.com/channel/0029VbBSuJV7tkj4wrCNAr2Z"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none' }}
          >
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                px: 5,
                py: 1.75,
                borderRadius: '4px',
                bgcolor: KRAFT.bronze,
                color: KRAFT.cream,
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                boxShadow: '0 4px 16px rgba(140,90,43,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `1.5px solid ${KRAFT.paperDark}`,
                '&:hover': {
                  bgcolor: KRAFT.paper,
                  color: KRAFT.ink,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 24px rgba(217,189,147,0.35)',
                  borderColor: KRAFT.paper,
                },
              }}
            >
              Follow on WhatsApp
            </Button>
          </Link>
        </Box>

        {/* Bottom decorative element */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 5,
            opacity: 0.4,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: KRAFT.paper,
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FragranceCircle;