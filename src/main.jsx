import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';
import CheckoutForm from './components/Checkout';
import ProductsPage from './components/Collections';
import AdminApp from './admin/src/App'; // Import the admin App component
import OrderConfirmation from './components/OrderConfirmation';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Main app routes */}
          <Route path="/" element={<App />} />
          <Route path="/check-out" element={<CheckoutForm />} />
          <Route path="/collections" element={<ProductsPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          
          {/* Admin routes - prefixed with /admin */}
          <Route path="/admin/*" element={<AdminApp />} />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);