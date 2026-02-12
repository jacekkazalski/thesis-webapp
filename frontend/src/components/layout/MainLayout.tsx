import { Box, Theme, useMediaQuery } from '@mui/material';
import NavBar from '../NavBar';

import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <NavBar />
      <Box
        sx={{
          width: isSmallScreen ? '100%' : '80%',
          p: isSmallScreen ? 1 : 2,
          alignContent: 'center',
          mx: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
