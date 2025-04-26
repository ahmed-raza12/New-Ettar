// admin/src/components/Layout/Layout.jsx
import { useState, useEffect } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme, CssBaseline } from '@mui/material';
import Sidebar from './layout/Sidebar';
import Topbar from './layout/Topbar';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 64;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile devices
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Tablets
  const isMedium = useMediaQuery(theme.breakpoints.between('md', 'lg')); // Medium screens
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse sidebar on tablet devices
  useEffect(() => {
    if (isTablet || isMedium) {
      setIsCollapsed(true); // Collapse sidebar on tablets and medium screens
    }
  }, [isTablet, isMedium]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      
      <Topbar
        handleDrawerToggle={handleDrawerToggle}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        isMobile={isMobile}
      />
      
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100%', 
            md: `calc(100% - ${isCollapsed ? collapsedWidth : drawerWidth}px)` 
          },
          height: '100vh',
          overflow: 'auto',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: { 
            xs: 0, 
            sm: `${isCollapsed ? collapsedWidth : drawerWidth}px` 
          },
        }}
      >
        <Toolbar /> {/* This provides spacing below the AppBar */}
        
        <Box 
          component="div" 
          sx={{ 
            p: { xs: 2, sm: 3 },
            maxWidth: '100%',
            height: 'calc(100% - 64px)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;