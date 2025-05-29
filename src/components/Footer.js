import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = ({ isAuthPage = false }) => {
  const currentYear = new Date().getFullYear();



  const socialLinks = [
    { icon: Facebook, href: 'https://moviemaze-facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://moviemaze-twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://moviemaze-instagram.com', label: 'Instagram' },
    { icon: YouTube, href: 'https://moviemaze-youtube.com', label: 'YouTube' }
  ];

  // Simple footer for auth pages (login/signup)
  if (isAuthPage) {
    return (
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f0f 100%)',
          color: 'white',
          mt: 'auto',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Typography variant="body2" color="grey.400">
              © {currentYear} MovieMaze@All rights reserved.
            </Typography>
            
            <Box display="flex" gap={3} flexWrap="wrap">
              <Link href="/privacy" underline="none" sx={{ color: 'grey.400', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>
                Privacy Policy
              </Link>
              <Link href="/terms" underline="none" sx={{ color: 'grey.400', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>
                Terms of Service
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  // Full footer for other pages
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f0f 100%)',
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={12}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(45deg, #e04848, #22958a)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              MovieMaze
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'grey.300', lineHeight: 1.6 }}>
              Your ultimate destination for discovering amazing movies. Explore trending films, 
              search by genre, and find your next favorite movie with our comprehensive database.
            </Typography>
            
            {/* Contact Info */}
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Email sx={{ fontSize: 18, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  contact@moviemaze.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone sx={{ fontSize: 18, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn sx={{ fontSize: 18, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  No 89, Main Road, Colombo 10
                </Typography>
              </Box>
            </Stack>

            {/* Social Media Icons */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Follow Us
              </Typography>
              <Box display="flex" gap={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: 'grey.400',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <social.icon />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>


        </Grid>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        {/* Bottom Footer */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="body2" color="grey.400">
            © {currentYear} MovieMaze@All rights reserved.
          </Typography>
          
          <Box display="flex" gap={3} flexWrap="wrap">
            <Link href="/privacy" underline="none" sx={{ color: 'grey.400', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>
              Privacy Policy
            </Link>
            <Link href="/terms" underline="none" sx={{ color: 'grey.400', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>
              Terms of Service
            </Link>
            <Link href="/cookies" underline="none" sx={{ color: 'grey.400', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;