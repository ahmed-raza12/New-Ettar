// admin/src/components/Products/ProductForm.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import { addProduct, updateProduct } from '../../services/productService';

const ProductForm = ({ open, onClose, productToEdit }) => {
  console.log('Editing product:', productToEdit);
  const [product, setProduct] = useState(productToEdit || {
    name: '',
    category: '',
    price: '',
    size: '100ml',
    images: ['', '', ''],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setProduct({
        name: productToEdit.name || '',
        category: productToEdit.category || '',
        price: productToEdit.price?.toString() || '',
        size: productToEdit.size || '100ml',
        images: Array.isArray(productToEdit.images) 
          ? [...productToEdit.images, '', ''].slice(0, 3) // Ensure we have exactly 3 images
          : ['', '', ''],
        description: productToEdit.description || ''
      });
    } else {
      // Reset form when adding new product
      setProduct({
        name: '',
        category: '',
        price: '',
        size: '100ml',
        images: ['', '', ''],
        description: ''
      });
    }
  }, [productToEdit, open]); // Also trigger on open change

  const categories = [
    'Eau de Parfum',
    'Eau de Toilette',
    'Eau de Cologne',
    'Perfume Oil'
  ];

  const sizes = ['30ml', '50ml', '100ml', '200ml'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...product.images];
    newImages[index] = value;
    setProduct(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        name: product.name,
        category: product.category,
        price: Number(product.price),
        size: product.size,
        images: product.images,
        description: product.description
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
      } else {
        await addProduct(productData);
      }
      onClose();
    } catch (err) {
      setError('Failed to save product. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {productToEdit ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={product.category}
                onChange={handleChange}
                margin="normal"
                required
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price (Rs.)"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Size"
                name="size"
                value={product.size}
                onChange={handleChange}
                margin="normal"
                required
              >
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {[0, 1, 2].map((index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Image ${index + 1} URL`}
                  value={product.images[index] || ''}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  margin="normal"
                  placeholder={`Enter image ${index + 1} URL`}
                />
                {product.images[index] && (
                  <Box mt={2} mb={2} display="flex" flexDirection="column" alignItems="center">
                    <Box 
                      component="img"
                      src={product.images[index]}
                      alt={`Preview ${index + 1}`}
                      sx={{ 
                        maxWidth: '100%',
                        maxHeight: 200,
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        p: 1,
                        mt: 1
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
                      }}
                    />
                    {!product.images[index].match(/\.(jpeg|jpg|gif|png)$/) && (
                      <Alert severity="warning" sx={{ mt: 1, width: '100%' }}>
                        The URL doesn't seem to point to a valid image file
                      </Alert>
                    )}
                  </Box>
                )}
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={product.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;