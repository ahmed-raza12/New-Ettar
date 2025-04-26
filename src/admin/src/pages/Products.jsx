// admin/src/pages/Products.jsx
import { Box, Button, Paper, Typography } from '@mui/material';
import ProductTable from '../components/Products/ProductTable';
import { useState } from 'react';
import ProductForm from '../components/Products/ProductForm';
import { Add as AddIcon } from '@mui/icons-material';

const Products = () => {
  const [openForm, setOpenForm] = useState(false);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">Product Management</Typography>
        <Button
          variant="contained"
          color="accent"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Product
        </Button>
      </Box>
      <Paper>
        <ProductTable />
      </Paper>
      <ProductForm 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
      />
    </Box>
  );
};

export default Products;