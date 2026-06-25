import { Container, Box, Grid, Typography, Link, Divider } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';

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

const footerLinks = [
  // {
  //   title: "Shop",
  //   items: ["All Fragrances", "Men's Collection", "Women's Collection", "Gift Sets", "Travel Sizes"]
  // },
  {
    title: "About",
    items: ["Our Story", "Blog", "Press"]
  },
  {
    title: "Customer Care",
    items: ["Contact Us", "FAQs", "Privacy Policy"]
  }
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: KRAFT.ink,
        color: KRAFT.cream,
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        // Subtle dotted background pattern
        backgroundImage: `radial-gradient(rgba(217,189,147,0.06) 0.6px, transparent 0.6px)`,
        backgroundSize: '6px 6px',
        // Decorative top border
        borderTop: `3px solid ${KRAFT.bronze}`,
      }}
    >
      {/* Decorative corner accents */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          width: 30,
          height: 30,
          borderTop: `1.5px solid ${KRAFT.bronze}`,
          borderLeft: `1.5px solid ${KRAFT.bronze}`,
          opacity: 0.4,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 30,
          height: 30,
          borderTop: `1.5px solid ${KRAFT.bronze}`,
          borderRight: `1.5px solid ${KRAFT.bronze}`,
          opacity: 0.4,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          width: 30,
          height: 30,
          borderBottom: `1.5px solid ${KRAFT.bronze}`,
          borderLeft: `1.5px solid ${KRAFT.bronze}`,
          opacity: 0.4,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          width: 30,
          height: 30,
          borderBottom: `1.5px solid ${KRAFT.bronze}`,
          borderRight: `1.5px solid ${KRAFT.bronze}`,
          opacity: 0.4,
        }}
      />

      <Container>
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} md={3}>
            {/* Logo/Brand Name with decorative element */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: KRAFT.bronze,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  color: KRAFT.paper,
                  letterSpacing: '0.04em',
                }}
              >
                AlMala Fragrance
              </Typography>
            </Box>
            
            <Typography
              paragraph
              sx={{
                mb: 3,
                color: KRAFT.paperLight,
                fontSize: '0.9rem',
                lineHeight: 1.8,
                opacity: 0.85,
              }}
            >
              Crafting exceptional fragrances. Our perfumes are designed to evoke 
              emotions and create lasting memories.
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[
                { icon: <FacebookIcon />, href: 'https://www.facebook.com/almalafragrance/', label: 'Facebook' },
                { icon: <InstagramIcon />, href: 'https://www.instagram.com/almalafragrance/', label: 'Instagram' },
                { icon: <WhatsAppIcon />, href: 'https://wa.me/923283601150', label: 'WhatsApp' },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '4px',
                    border: `1.5px solid ${KRAFT.bronze}`,
                    color: KRAFT.paperLight,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: KRAFT.bronze,
                      color: KRAFT.cream,
                      borderColor: KRAFT.bronze,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(140,90,43,0.3)',
                    },
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Link Columns */}
          {footerLinks.map((section, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
              {/* Section Title with underline */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontWeight: 600,
                    color: KRAFT.paper,
                    letterSpacing: '0.05em',
                    fontSize: '1.1rem',
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -6,
                      left: 0,
                      width: '60%',
                      height: '2px',
                      bgcolor: KRAFT.bronze,
                    },
                  }}
                >
                  {section.title}
                </Typography>
              </Box>

              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <Link
                      href="#"
                      underline="none"
                      sx={{
                        display: 'inline-block',
                        py: 0.75,
                        color: KRAFT.paperLight,
                        fontSize: '0.9rem',
                        opacity: 0.8,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          bottom: 4,
                          left: 0,
                          width: 0,
                          height: '1px',
                          bgcolor: KRAFT.bronze,
                          transition: 'width 0.3s ease',
                        },
                        '&:hover': {
                          color: KRAFT.paper,
                          opacity: 1,
                          transform: 'translateX(4px)',
                          '&:before': {
                            width: '100%',
                          },
                        },
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact Column */}
          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 600,
                  color: KRAFT.paper,
                  letterSpacing: '0.05em',
                  fontSize: '1.1rem',
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -6,
                    left: 0,
                    width: '60%',
                    height: '2px',
                    bgcolor: KRAFT.bronze,
                  },
                }}
              >
                Contact Us
              </Typography>
            </Box>

            <Box component="address" sx={{ fontStyle: 'normal' }}>
              {/* Email with icon */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: KRAFT.bronze,
                    mt: 0.8,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      color: KRAFT.paperLight,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      mb: 0.25,
                      opacity: 0.6,
                    }}
                  >
                    Email
                  </Typography>
                  <Link
                    href="mailto:almalafragnance@gmail.com"
                    underline="none"
                    sx={{
                      color: KRAFT.paperLight,
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: KRAFT.paper,
                      },
                    }}
                  >
                    almalafragnance@gmail.com
                  </Link>
                </Box>
              </Box>

              {/* Phone with icon */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: KRAFT.bronze,
                    mt: 0.8,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      color: KRAFT.paperLight,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      mb: 0.25,
                      opacity: 0.6,
                    }}
                  >
                    Phone
                  </Typography>
                  <Link
                    href="tel:+923283601150"
                    underline="none"
                    sx={{
                      color: KRAFT.paperLight,
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: KRAFT.paper,
                      },
                    }}
                  >
                    +92 328 3601150
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Decorative Divider */}
        <Box sx={{ position: 'relative', my: 8 }}>
          <Divider
            sx={{
              bgcolor: KRAFT.bronze,
              opacity: 0.3,
              height: '1px',
            }}
          />
          {/* Center ornament */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: KRAFT.ink,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
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
                  opacity: 0.6,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: KRAFT.paperLight,
              opacity: 0.7,
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
            }}
          >
            &copy; {new Date().getFullYear()} Almala Fragrance. All rights reserved.
          </Typography>
          
          {/* Crafted with love */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              color: KRAFT.bronze,
              opacity: 0.6,
              fontSize: '0.75rem',
              fontStyle: 'italic',
            }}
          >
            Crafted with passion & precision
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;