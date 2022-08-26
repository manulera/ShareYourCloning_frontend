import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { AiFillGithub } from 'react-icons/ai';
import {
  Button, Tooltip, useMediaQuery, useTheme,
} from '@mui/material';

import NavbarExportData from './navbar_buttons/NavbarExportData';
import NavBarLoadData from './navbar_buttons/NavBarLoadData';
import NavBarEditDescription from './navbar_buttons/NavBarEditDescription';
import NavBarLoadExample from './navbar_buttons/NavBarLoadExample';
import NavBarShowPrimers from './navbar_buttons/NavBarShowPrimers';

function MainAppBar({
  exportData, loadData, showDescription, setShowDescription, showPrimers, setShowPrimers,
}) {
  const tooltipText = <div className="tooltip-text">See in GitHub</div>;
  const theme = useTheme();
  const wideMode = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <AppBar position="static" className="app-bar">
      <div className="app-name">Share Your Cloning</div>
      <Container maxWidth="s">
        <Toolbar disableGutters>

          <Box
            sx={{
              flexGrow: 1,
              display: { md: 'flex', xs: 'flex' },
              flexDirection: { md: 'row', xs: 'column' },
            }}
            className={wideMode ? null : 'collapsed'}
          >
            <a href="https://www.youtube.com/watch?v=HRQb6s8m8_s" target="_blank" rel="noopener noreferrer">
              <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <>Demo video</>
              </Button>
            </a>
            <NavbarExportData {...{ exportData }} />
            <NavBarLoadData {...{ loadData }} />
            <NavBarEditDescription {...{ showDescription, setShowDescription }} />
            <NavBarShowPrimers {...{ showPrimers, setShowPrimers }} />
            <NavBarLoadExample {...{ loadData }} />
            <Tooltip title={tooltipText} arrow placement="top">
              <a href="https://github.com/manulera/ShareYourCloning" target="_blank" rel="noopener noreferrer">
                <Button className="github-icon" sx={{ my: 2 }}>
                  <AiFillGithub />
                </Button>
              </a>
            </Tooltip>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MainAppBar;
