import { useState } from 'react';
import { Container, Typography, Box, Link, TextField, Button, Paper } from '@mui/material';

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
    <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'common.white' }}>
      <Container>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: { xs: 5, sm: 5, md: 6 },
            fontWeight: 700,
            fontSize: {
              xs: '1.6rem',
              sm: '2.5rem',
              md: '3rem',
              lg: '3.5rem',
            },
            backgroundImage: 'linear-gradient(45deg, #fff, #eee)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Join the Fragrance Circle
        </Typography>

        <Typography variant="h6" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Be part of our exclusive fragrance community. Follow our whatsapp group for exclusive offers, tips, and special gifts.
        </Typography>


        {/* WhatsApp Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link
            href="https://wa.me/+1234567890" // Replace with your WhatsApp Channel or number
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: 'none',
              display: 'inline-block',
              padding: '12px 20px',
              backgroundColor: '#25d366',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#128c7e',
              },
            }}
          >
            <Typography variant="button" sx={{ color: 'white' }}>
              Follow on WhatsApp
            </Typography>
          </Link>
        </Box>

      </Container>
    </Box>
  );
};

export default FragranceCircle;
