import { Container, Typography, Grid, Box, Paper, Rating } from '@mui/material';

const testimonials = [
  {
    id: 1,
    name: "Ayesha Khan",
    role: "Lifestyle Influencer",
    content: "Noir Essence meri pehchaan ban chuki hai. Har jagah se taarif milti hai!",
    rating: 5
  },
  {
    id: 2,
    name: "Omar Farooq",
    role: "Corporate Manager",
    content: "Main ne bohat se perfumes try kiye hain, lekin Citrus Zest sabse zyada fresh aur long-lasting hai.",
    rating: 4
  },
  {
    id: 3,
    name: "Zainab Ali",
    role: "Home Decor Consultant",
    content: "Floral Bloom ek lajawab khushboo hai — naazuk bhi aur classy bhi.",
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
            mb: {
              xs: 5,
              sm: 5,
              md: 6
            },
            fontWeight: 700,
            fontSize: {
              xs: '1.6rem',    // Small mobile screens
              sm: '2.5rem',  // Larger mobile/small tablet screens
              md: '3rem',    // Medium screens (tablets)
              lg: '3.5rem',  // Large screens (desktop)
            },
            backgroundImage: 'linear-gradient(45deg, #333, #666)',
            backgroundClip: 'text',
            color: 'transparent',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: {
                xs: 40,  // Smaller line on mobile
                sm: 80,  // Medium line on tablets
                md: 100, // Full width line on desktop
              },
              height: 3,
              backgroundImage: 'linear-gradient(to right, #333, #666)',
              borderRadius: 4
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