import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import NavbarExportData from './navbar_buttons/NavbarExportData';
import NavBarLoadData from './navbar_buttons/NavBarLoadData';
import NavBarEditDescription from './navbar_buttons/NavBarEditDescription';
import NavBarLoadExample from './navbar_buttons/NavBarLoadExample';

function MainAppBar({
  exportData, loadData, showDescription, setShowDescription,
}) {
  return (
    <AppBar position="static" className="app-bar">
      <div className="app-name">Share Your Cloning</div>
      <Container maxWidth="s">
        <Toolbar disableGutters>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <NavbarExportData {...{ exportData }} />
            <NavBarLoadData {...{ loadData }} />
            <NavBarEditDescription {...{ showDescription, setShowDescription }} />
            <NavBarLoadExample {...{ loadData }} />
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MainAppBar;
