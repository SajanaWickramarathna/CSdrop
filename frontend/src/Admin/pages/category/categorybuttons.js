import { Button, Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Add , List} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export default function Categorybuttons() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2, // Spacing between buttons
        justifyContent: 'center', // Center buttons horizontally
        alignItems: 'center',    // Center buttons vertically (if they had different heights)
        flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on small screens, row on larger
        width: '100%', // Take full width of parent
        mb: 3, // Add some margin-bottom for spacing from the table below
      }}
    >
      <Link to="/admin-dashboard/category" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          startIcon={<List/>}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            py: 1.2,
            px: 2.5,
            minWidth: 160,
            width: { xs: '100%', sm: 'auto' },
            backgroundColor: theme.palette.info.main, // Blue color similar to "All Brands"
            color: theme.palette.info.contrastText,
            boxShadow: `0 3px 5px 2px ${alpha(theme.palette.info.main, 0.3)}`,
            '&:hover': {
              backgroundColor: theme.palette.info.dark,
              boxShadow: `0 4px 6px 3px ${alpha(theme.palette.info.main, 0.4)}`,
            },
          }}
        >
          All Category
        </Button>
      </Link>
      <Link to="/admin-dashboard/category/addcategory" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          startIcon={<Add/>}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            py: 1.2,
            px: 2.5,
            minWidth: 160,
            width: { xs: '100%', sm: 'auto' },
            backgroundColor: theme.palette.success.main, // Green color similar to "Add Brand"
            color: theme.palette.success.contrastText,
            boxShadow: `0 3px 5px 2px ${alpha(theme.palette.success.main, 0.3)}`,
            '&:hover': {
              backgroundColor: theme.palette.success.dark,
              boxShadow: `0 4px 6px 3px ${alpha(theme.palette.success.main, 0.4)}`,
            },
          }}
        >
          Add Category
        </Button>
      </Link>
    </Box>
  )
}