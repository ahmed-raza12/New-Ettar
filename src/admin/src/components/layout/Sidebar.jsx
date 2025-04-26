// admin/src/components/Layout/Sidebar.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
  Tooltip,
  useTheme,
  alpha,
  SwipeableDrawer
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingBag as OrdersIcon,
  LocalBar as ProductsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

// Use props for drawer widths so they match Layout
const StyledDrawer = styled(Drawer)(({ theme, width }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    width: width || 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    overflowX: 'hidden',
    boxShadow: '1px 0 10px rgba(0, 0, 0, 0.05)',
    borderRight: 'none',
  },
}));

const StyledCollapsedDrawer = styled(Drawer)(({ theme, width }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    width: width || 64,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    boxShadow: '1px 0 10px rgba(0, 0, 0, 0.05)',
    borderRight: 'none',
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  height: 64,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: '4px 10px',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
  },
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.18),
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: theme.palette.text.secondary,
  display: 'flex',
  justifyContent: 'center',
}));

const Sidebar = ({
  mobileOpen,
  handleDrawerToggle,
  isCollapsed,
  isMobile = false,
  drawerWidth = 240,
  collapsedWidth = 64
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const [productsOpen, setProductsOpen] = useState(false);

  const handleProductsClick = () => {
    if (!isCollapsed) {
      setProductsOpen(!productsOpen);
    } else {
      navigate('/admin/products');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Products', icon: <ProductsIcon />, path: '/admin/products' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' },
  ];

  const bottomMenuItems = [
    { text: 'Logout', icon: <LogoutIcon />, onClick: logout },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const Logo = (
    <LogoSection>
      {!isCollapsed || isMobile ? (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
            flexGrow: 1,
          }}
        >
          Admin
        </Typography>
      ) : (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            width: '100%',
            textAlign: 'center',
          }}
        >
          BM
        </Typography>
      )}
    </LogoSection>
  );

  const DrawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {Logo}
      <Divider sx={{ mx: 2, opacity: 0.6 }} />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          px: 3,
          py: 1.5,
          display: isCollapsed && !isMobile ? 'none' : 'block'
        }}
      >
        MAIN
      </Typography>

      <List component="nav" sx={{ px: isCollapsed && !isMobile ? 0 : 1 }}>
        {menuItems.map((item) => (
          <Box key={item.text}>
            {item.hasSubMenu ? (
              <>
                <Tooltip
                  title={isCollapsed && !isMobile ? item.text : ''}
                  placement="right"
                  arrow
                >
                  <ListItem disablePadding>
                    <StyledListItemButton
                      onClick={handleProductsClick}
                      selected={isActive(item.path)}
                      sx={{
                        justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                        px: isCollapsed && !isMobile ? 0 : 2,
                      }}
                    >
                      <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                      {(!isCollapsed || isMobile) && (
                        <>
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              fontSize: '0.9rem',
                              fontWeight: isActive(item.path) ? 600 : 500
                            }}
                          />
                          {productsOpen ? <ExpandLess /> : <ExpandMore />}
                        </>
                      )}
                    </StyledListItemButton>
                  </ListItem>
                </Tooltip>

                {(!isCollapsed || isMobile) && (
                  <Collapse in={productsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.text} disablePadding>
                          <StyledListItemButton
                            onClick={() => navigate(subItem.path)}
                            selected={location.pathname === subItem.path}
                            sx={{ pl: 6 }}
                          >
                            {subItem.icon && (
                              <StyledListItemIcon>{subItem.icon}</StyledListItemIcon>
                            )}
                            <ListItemText
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontSize: '0.85rem',
                                fontWeight: location.pathname === subItem.path ? 600 : 400
                              }}
                            />
                          </StyledListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </>
            ) : (
              <Tooltip
                title={isCollapsed && !isMobile ? item.text : ''}
                placement="right"
                arrow
              >
                <ListItem disablePadding>
                  <StyledListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isActive(item.path)}
                    sx={{
                      justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                      px: isCollapsed && !isMobile ? 0 : 2,
                    }}
                  >
                    <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                    {(!isCollapsed || isMobile) && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: isActive(item.path) ? 600 : 500
                        }}
                      />
                    )}
                  </StyledListItemButton>
                </ListItem>
              </Tooltip>
            )}
          </Box>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          px: 3,
          py: 1.5,
          display: isCollapsed && !isMobile ? 'none' : 'block'
        }}
      >
        ACCOUNT
      </Typography>

      <List sx={{ px: isCollapsed && !isMobile ? 0 : 1, mb: 2 }}>
        {bottomMenuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={isCollapsed && !isMobile ? item.text : ''}
            placement="right"
            arrow
          >
            <ListItem disablePadding>
              <StyledListItemButton
                onClick={item.onClick || (() => navigate(item.path))}
                sx={{
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                  px: isCollapsed && !isMobile ? 0 : 2,
                }}
              >
                <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                {(!isCollapsed || isMobile) && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  />
                )}
              </StyledListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {(!isCollapsed || isMobile) && (
        <Box
          sx={{
            mx: 2,
            mb: 3,
            mt: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            Premium Admin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Access all premium features and priority support
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      {isMobile && (
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onOpen={() => handleDrawerToggle()}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {DrawerContent}
        </SwipeableDrawer>
      )}

      {/* Desktop drawer */}
      {!isMobile && (
        isCollapsed ? (
          <StyledCollapsedDrawer
            variant="permanent"
            width={collapsedWidth}
            sx={{
              display: { xs: 'none', sm: 'block', md: 'block' }, // Show on tablets and medium screens
            }}
          >
            {DrawerContent}
          </StyledCollapsedDrawer>
        ) : (
          <StyledDrawer
            variant="permanent"
            width={drawerWidth}
            sx={{
              display: { xs: 'none', sm: 'block', md: 'block' },
            }}
          >
            {DrawerContent}
          </StyledDrawer>
        )
      )}
    </>
  );
};

export default Sidebar;