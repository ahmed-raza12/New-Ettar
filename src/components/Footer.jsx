import { Container, Box, Grid, Typography, Link, Divider } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';

const footerLinks = [
  {
    title: "Shop",
    items: ["All Fragrances", "Men's Collection", "Women's Collection", "Gift Sets", "Travel Sizes"]
  },
  {
    title: "About",
    items: ["Our Story", "Ingredients", "Sustainability", "Blog", "Press"]
  },
  {
    title: "Customer Care",
    items: ["Contact Us", "FAQs", "Shipping & Returns", "Track Order", "Privacy Policy"]
  }
];

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'common.white', py: 8 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Scentify
            </Typography>
            <Typography paragraph sx={{ mb: 2 }}>
              Luxury fragrances crafted with passion and precision.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
            </Box>
          </Grid>

          {footerLinks.map((section, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Link 
                      href="#" 
                      color="inherit" 
                      underline="hover"
                      sx={{ display: 'inline-block', py: 0.5 }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </Box>
            </Grid>
          ))}

          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <address style={{ fontStyle: 'normal' }}>
              <Typography paragraph sx={{ mb: 1 }}>
                123 Fragrance Lane
              </Typography>
              <Typography paragraph sx={{ mb: 1 }}>
                New York, NY 10001
              </Typography>
              <Typography paragraph sx={{ mb: 1 }}>
                Email: info@scentify.com
              </Typography>
              <Typography>
                Phone: (555) 123-4567
              </Typography>
            </address>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, bgcolor: 'primary.light' }} />

        <Typography variant="body2" align="center">
          &copy; {new Date().getFullYear()} Scentify. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;