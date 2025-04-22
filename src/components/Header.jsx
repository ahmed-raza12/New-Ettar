import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Badge,
    Container,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Person as PersonIcon,
    ShoppingCart as ShoppingCartIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import logo from '../assets/logo.jpeg'
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const NavigationLinks = () => (
        <>
            <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{
                    mx: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)', // Light background on hover
                        transform: 'scale(1.05)', // Slight scale effect
                        color: 'primary.main'
                    }
                }}
            >
                Home
            </Button>
            <Button
                component={Link}
                to="/shop"
                color="inherit"
                sx={{
                    mx: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)', // Light background on hover
                        transform: 'scale(1.05)', // Slight scale effect
                        color: 'primary.main'
                    }
                }}
            >
                Shop
            </Button>
            <Button
                component={Link}
                to="/collections"
                color="inherit"
                sx={{
                    mx: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)', // Light background on hover
                        transform: 'scale(1.05)', // Slight scale effect
                        color: 'primary.main'
                    }
                }}
            >
                Collections
            </Button>
            <Button
                component={Link}
                to="/about"
                color="inherit"
                sx={{
                    mx: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)', // Light background on hover
                        transform: 'scale(1.05)', // Slight scale effect
                        color: 'primary.main'
                    }
                }}
            >
                About
            </Button>
            <Button
                component={Link}
                to="/contact"
                color="inherit"
                sx={{
                    mx: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)', // Light background on hover
                        transform: 'scale(1.05)', // Slight scale effect
                        color: 'primary.main'
                    }
                }}
            >
                Contact
            </Button>
        </>
    );

    const HeaderIcons = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
                color="inherit"
                sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                }}
            >
                <SearchIcon />
            </IconButton>
            <IconButton
                color="inherit"
                sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                }}
            >
                <PersonIcon />
            </IconButton>
            <IconButton
                color="inherit"
                sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                }}
            >
                <Badge badgeContent={3} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
        </Box>
    );

    return (
        <AppBar
            position="sticky"
            color="default"
            elevation={2}
            sx={{
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255,255,255,0.8)'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1
                    }}
                >
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="Scentify Logo"
                            sx={{
                                height: 40,
                                objectFit: 'contain'
                            }}
                        />
                    </Typography>

                    {/* Desktop Navigation */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <NavigationLinks />
                            <HeaderIcons />
                        </Box>
                    )}

                    {/* Mobile Navigation */}
                    {isMobile && (
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleMenu}
                            sx={{ ml: 'auto' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </Container>

            {/* Mobile Drawer Menu */}
            <Drawer
                anchor="right"
                open={isMenuOpen}
                onClose={toggleMenu}
                sx={{
                    display: { md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: '80%', // Reduced from 100%
                        maxWidth: 320,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        left: 'auto', // Align to right side
                        right: 0,
                        backgroundColor: 'background.default'
                    }
                }}
            >
                <Box sx={{ height: '100%', p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">Menu</Typography>
                        <IconButton onClick={toggleMenu}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <List>
                        <ListItem
                            button
                            component={Link}
                            to="/"
                            onClick={toggleMenu}
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/shop"
                            onClick={toggleMenu}
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemText primary="Shop" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/collections"
                            onClick={toggleMenu}
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemText primary="Collections" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/about"
                            onClick={toggleMenu}
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemText primary="About" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/contact"
                            onClick={toggleMenu}
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemText primary="Contact" />
                        </ListItem>
                    </List>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 3,
                            mt: 4
                        }}
                    >
                        <HeaderIcons />
                    </Box>
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default Header;