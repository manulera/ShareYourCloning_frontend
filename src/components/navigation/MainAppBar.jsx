import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Alert, Button, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import './MainAppBar.css';
import { useDispatch } from 'react-redux';
import ButtonWithMenu from './ButtonWithMenu';
import { exportStateThunk, fileReceivedToJson, loadStateThunk, resetStateThunk } from '../../utils/readNwrite';
import SelectExampleDialog from './SelectExampleDialog';
import DialogSubmitToElab from '../form/eLabFTW/DialogSubmitToElab';

function MainAppBar() {
  const [openExampleDialog, setOpenExampleDialog] = React.useState(false);
  const [loadedFileError, setLoadedFileError] = React.useState('');
  const [eLabDialogOpen, setELabDialogOpen] = React.useState(false);
  const dispatch = useDispatch();
  const exportData = () => {
    dispatch(exportStateThunk());
  };
  const loadData = (newState) => {
    dispatch(loadStateThunk(newState)).catch((e) => {
      // TODO: this should be handled by the store
      dispatch(resetStateThunk());
      setLoadedFileError('JSON file in wrong format');
    });
  };
  const tooltipText = <div className="tooltip-text">See in GitHub</div>;
  const theme = useTheme();
  const wideMode = useMediaQuery(theme.breakpoints.up('md'));
  // Hidden input field, used to load files.
  const fileInputRef = React.useRef(null);
  const fileMenu = [
    { display: 'Save to file', onClick: exportData },
    { display: 'Load from file', onClick: () => { fileInputRef.current.click(); fileInputRef.current.value = ''; } },
    // elab-demo
    // { display: 'Submit to eLabFTW', onClick: () => setELabDialogOpen(true) },
  ];

  const handleCloseDialog = (fileName) => {
    if (fileName) {
      setOpenExampleDialog(false);
      fetch(`examples/${fileName}`).then((r) => r.json()).then((d) => loadData(d));
    }
  };

  // TODO: turn these into <a> elements.
  const helpMenu = [
    { display: 'About', onClick: () => window.open('https://www.genestorian.org/') },
    { display: 'Demo video', onClick: () => window.open('https://www.youtube.com/watch?v=HRQb6s8m8_s') },
  ];

  const onFileChange = (e) => {
    fileReceivedToJson(e, loadData, (err) => setLoadedFileError(err));
  };

  return (
    <AppBar position="static" className="app-bar">
      {loadedFileError && (<Alert variant="filled" severity="error" sx={{ position: 'absolute', zIndex: 999 }} onClose={() => { setLoadedFileError(''); }}>{loadedFileError}</Alert>)}
      <div className="app-name">Share Your Cloning</div>
      <Container maxWidth="s">
        <Toolbar disableGutters variant="dense" sx={{ justifyContent: 'center', minHeight: 50 }}>
          <Box
            sx={{
              display: { md: 'flex', xs: 'flex' },
              flexDirection: { md: 'row', xs: 'column' },
              height: '100%',
            }}
            className={wideMode ? null : 'collapsed'}
          >
            <ButtonWithMenu menuItems={fileMenu}> File </ButtonWithMenu>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChange} />
            <ButtonWithMenu menuItems={helpMenu}> Help </ButtonWithMenu>
            <Button onClick={() => setOpenExampleDialog(true)}>Examples</Button>
            <Tooltip title={tooltipText} arrow placement="right">
              <Button className="github-icon" onClick={() => window.open('https://github.com/manulera/ShareYourCloning')}>
                <GitHubIcon />
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
      <SelectExampleDialog onClose={handleCloseDialog} open={openExampleDialog} />
      {/* elab-demo */}
      {/* <DialogSubmitToElab dialogOpen={eLabDialogOpen} setDialogOpen={setELabDialogOpen} /> */}
    </AppBar>
  );
}

export default MainAppBar;
