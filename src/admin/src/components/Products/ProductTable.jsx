// admin/src/components/Products/ProductTable.jsx
import { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getProducts, deleteProduct } from '../../services/productService';
import ProductForm from './ProductForm';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const unsubscribe = getProducts((data) => {
      setProducts(data);
      setLoading(false);
    }, (error) => {
      setError('Failed to load products');
      setLoading(false);
      console.error(error);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct({
      ...product,
      price: product.price.toString(),
      // Ensure we have an array of images, fallback to empty array if not present
      images: Array.isArray(product.images) ? product.images : [product.image || '']
    });
    setOpenForm(true);
  };
  

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditProduct(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {Array.isArray(product.images) ? (
                      product.images.slice(0, 3).map((img, index) => (
                        img && (
                          <Avatar
                            key={index}
                            variant="rounded"
                            src={img}
                            sx={{ width: 40, height: 40, border: '1px solid #ddd' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                            }}
                          />
                        )
                      ))
                    ) : (
                      <Avatar
                        variant="rounded"
                        src={product.image}
                        sx={{ width: 40, height: 40, border: '1px solid #ddd' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.size}
                  </Typography>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>Rs.{product.price}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>
                  <Chip
                    label="In Stock" // You would calculate this based on inventory
                    color="success"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ProductForm
        open={openForm}
        onClose={handleCloseForm}
        productToEdit={editProduct}
      />
    </>
  );
};

export default ProductTable;