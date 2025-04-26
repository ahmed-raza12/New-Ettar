// admin/src/components/Dashboard/InventoryStatus.jsx
import { Box, LinearProgress, Typography, Stack } from '@mui/material';

const InventoryStatus = ({ products }) => {
  if (!products.length) {
    return <Typography>No inventory data</Typography>;
  }

  const lowStockThreshold = 10;
  const outOfStockItems = products.filter(p => p.stock <= 0).length;
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold).length;
  const inStockItems = products.filter(p => p.stock > lowStockThreshold).length;
  const totalItems = products.length;

  return (
    <Box>
      <Stack spacing={2}>
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">In Stock ({inStockItems})</Typography>
            <Typography variant="body2">
              {Math.round((inStockItems / totalItems) * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(inStockItems / totalItems) * 100}
            color="success"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Low Stock ({lowStockItems})</Typography>
            <Typography variant="body2">
              {Math.round((lowStockItems / totalItems) * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(lowStockItems / totalItems) * 100}
            color="warning"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Out of Stock ({outOfStockItems})</Typography>
            <Typography variant="body2">
              {Math.round((outOfStockItems / totalItems) * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(outOfStockItems / totalItems) * 100}
            color="error"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default InventoryStatus;