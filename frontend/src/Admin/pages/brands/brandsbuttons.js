import { Button, Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Add, List } from '@mui/icons-material'; // Keep List for "All Brands"
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export default function Brandsbuttons() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2, // Spacing between buttons
        justifyContent: 'center', // Center buttons horizontally
        alignItems: 'center',   // Center buttons vertically (if they had different heights)
        flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on small screens, row on larger
        width: '100%', // Take full width of parent
        mb: 3, // Add some margin-bottom for spacing from the table below
      }}
    >
      <Link to="/admin-dashboard/brands" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          startIcon={<List />} // Using List icon for "All Brands"
          sx={{
            borderRadius: 2, // Slightly less rounded corners to match the example image
            fontWeight: 600,
            py: 1.2,
            px: 2.5,
            minWidth: 160, // Slightly increased min-width for better appearance
            width: { xs: '100%', sm: 'auto' }, // Full width on small screens, auto on larger
            // Using theme colors directly for more control, similar to the "Add Customer" button style
            backgroundColor: theme.palette.info.main, // Blue color similar to "Add Customer"
            color: theme.palette.info.contrastText, // White text for contrast
            boxShadow: `0 3px 5px 2px ${alpha(theme.palette.info.main, 0.3)}`,
            '&:hover': {
              backgroundColor: theme.palette.info.dark, // Darker blue on hover
              boxShadow: `0 4px 6px 3px ${alpha(theme.palette.info.main, 0.4)}`,
            },
          }}
        >
          All Brands
        </Button>
      </Link>
      <Link to="/admin-dashboard/brands/addbrand" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          startIcon={<Add />} // Using Add icon for "Add Brand"
          sx={{
            borderRadius: 2, // Slightly less rounded corners to match the example image
            fontWeight: 600,
            py: 1.2,
            px: 2.5,
            minWidth: 160, // Slightly increased min-width for better appearance
            width: { xs: '100%', sm: 'auto' }, // Full width on small screens, auto on larger
            // Using theme colors directly for more control, similar to "Add Supporter" button style
            backgroundColor: theme.palette.success.main, // Green color similar to "Add Supporter"
            color: theme.palette.success.contrastText, // White text for contrast
            boxShadow: `0 3px 5px 2px ${alpha(theme.palette.success.main, 0.3)}`,
            '&:hover': {
              backgroundColor: theme.palette.success.dark, // Darker green on hover
              boxShadow: `0 4px 6px 3px ${alpha(theme.palette.success.main, 0.4)}`,
            },
          }}
        >
          Add Brand
        </Button>
      </Link>
    </Box>
  );
}