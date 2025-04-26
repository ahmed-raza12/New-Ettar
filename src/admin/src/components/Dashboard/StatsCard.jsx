// admin/src/components/Dashboard/StatsCard.jsx
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AttachMoney as DollarIcon,
  ShoppingBag as ShoppingIcon,
  LocalBar as BottleIcon,
  People as UsersIcon,
} from '@mui/icons-material';

const iconMap = {
  dollar: <DollarIcon />,
  shopping: <ShoppingIcon />,
  bottle: <BottleIcon />,
  users: <UsersIcon />,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const StatsCard = ({ title, value, change, icon }) => {
  return (
    <StyledPaper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h4" mt={1}>
            {value}
          </Typography>
          <Typography variant="caption" color="success.main" mt={0.5}>
            {change} from last month
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            p: 2,
            borderRadius: '50%',
            color: 'accent.main',
          }}
        >
          {iconMap[icon]}
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default StatsCard;