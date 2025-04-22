import { Container, Typography, Grid, Box, Paper, Rating } from '@mui/material';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Blogger",
    content: "The Noir Essence has become my signature scent. I receive compliments everywhere I go!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Executive",
    content: "I've tried many fragrances over the years, but Citrus Zest is by far the most refreshing and long-lasting.",
    rating: 4
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Interior Designer",
    content: "Floral Bloom is absolutely divine. It's the perfect balance of feminine and sophisticated.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <Box sx={{ py: 10, bgcolor: 'secondary.main' }}>
      <Container>
        <Typography 
          variant="h2" 
          align="center" 
          gutterBottom
          sx={{
            position: 'relative',
            mb: 8,
            color: 'primary.main',
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
          What Our Customers Say
        </Typography>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial) => (
            <Grid item key={testimonial.id} xs={12} md={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }}
              >
                <Rating 
                  value={testimonial.rating} 
                  readOnly 
                  sx={{ mb: 2 }}
                />
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ mb: 3, fontStyle: 'italic' }}
                >
                  "{testimonial.content}"
                </Typography>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;