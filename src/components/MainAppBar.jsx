import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { AiFillGithub } from 'react-icons/ai';
import {
  Button, Tooltip, useMediaQuery, useTheme,
} from '@mui/material';
import './MainAppBar.css';
import ButtonWithMenu from './navbar_buttons/ButtonWithMenu';

function MainAppBar({
  exportData, loadData, showDescription, setShowDescription, showPrimers, setShowPrimers,
}) {
  const tooltipText = <div className="tooltip-text">See in GitHub</div>;
  const theme = useTheme();
  const wideMode = useMediaQuery(theme.breakpoints.up('md'));

  const fileMenu = [
    { display: 'Save to file', onClick: exportData },
    { display: 'Load from file', onClick: loadData },
    { display: 'Load example',
      onClick: () => fetch('examples/history.json').then((r) => r.json()).then((d) => loadData(d)),
    },
  ];

  const helpMenu = [
    { display: 'About', onClick: () => window.open('https://www.genestorian.org/') },
    { display: 'Demo video', onClick: () => window.open('https://www.youtube.com/watch?v=HRQb6s8m8_s') }
  ];

  return (
    <AppBar position="static" className="app-bar">
      <div className="app-name">Share Your Cloning</div>
      <Container maxWidth="s">
        <Toolbar disableGutters variant="dense" sx={{ justifyContent: 'center', minHeight: 50, height: 50 }}>
          <Box
            sx={{
              display: { md: 'flex', xs: 'flex' },
              flexDirection: { md: 'row', xs: 'column' },
              height: '100%',
            }}
            className={wideMode ? null : 'collapsed'}
          >
            <ButtonWithMenu menuItems={fileMenu}> File </ButtonWithMenu>
            <ButtonWithMenu menuItems={helpMenu}> Help </ButtonWithMenu>
            <Tooltip title={tooltipText} arrow placement="top">
              <Button className="github-icon" onClick={() => window.open('https://github.com/manulera/ShareYourCloning')}>
                <AiFillGithub />
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MainAppBar;
