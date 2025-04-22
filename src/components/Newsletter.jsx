import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed with:', email);
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
            position: 'relative',
            mb: 4,
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 3,
              bgcolor: 'accent.main'
            }
          }}
        >
          Stay Connected
        </Typography>
        
        <Typography variant="h6" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Subscribe to our newsletter for exclusive offers, new arrivals, and fragrance tips.
        </Typography>
        
        {subscribed ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              bgcolor: 'background.paper', 
              color: 'primary.main',
              textAlign: 'center',
              maxWidth: 500,
              mx: 'auto'
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Thank you for subscribing!
            </Typography>
            <Typography>
              Check your email for a special welcome offer.
            </Typography>
          </Paper>
        ) : (
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}
          >
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              variant="outlined"
              required
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
            <Button 
              type="submit" 
              variant="outlined"
              size="large"
              sx={{ 
                color: 'common.white', 
                borderColor: 'common.white',
                '&:hover': {
                  bgcolor: 'common.white',
                  color: 'primary.main',
                  borderColor: 'common.white'
                },
                whiteSpace: 'nowrap',
                px: 4
              }}
            >
              Subscribe
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Newsletter;