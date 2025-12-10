import { Button, Tooltip, Box, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PersonAdd as CustomerIcon,
  SupervisorAccount as ManagerIcon,
  SupportAgent as SupporterIcon,
  LocalShipping as DeliverIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

export default function Topbuttons() {
  const theme = useTheme();
  
  const buttonStyles = {
    minWidth: '160px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: theme.shadows[2],
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
    },
    transition: 'all 0.2s ease-in-out',
    px: 2,
    py: 1.5
  };

  const buttonData = [
    { 
      role: 'customer', 
      label: 'Add Customer', 
      icon: <CustomerIcon />,
      color: 'primary'
    },
    
    { 
      role: 'supporter', 
      label: 'Add Supporter', 
      icon: <SupporterIcon />,
      color: 'success'
    },
    
    { 
      role: 'admin', 
      label: 'Add Admin', 
      icon: <AdminIcon />,
      color: 'error'
    }
  ];

  return (
    <Box 
      sx={{
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
        justifyContent: 'center',
        mb: 4,
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}
    >
      {buttonData.map((button) => (
        <Tooltip key={button.role} title={`Add new ${button.role}`} arrow>
          <Link 
            to={`/admin-dashboard/users/adduser?role=${button.role}`} 
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="contained"
              color={button.color}
              startIcon={button.icon}
              sx={buttonStyles}
            >
              {button.label}
            </Button>
          </Link>
        </Tooltip>
      ))}
    </Box>
  );
}