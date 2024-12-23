import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Button, Tooltip } from '@mui/material';
import './MainAppBar.css';
import { useDispatch, useStore } from 'react-redux';
import axios from 'axios';
import ButtonWithMenu from './ButtonWithMenu';
import { downloadCloningStrategyAsSvg, exportStateThunk, loadData } from '../../utils/readNwrite';
import SelectExampleDialog from './SelectExampleDialog';
import DialogSubmitToElab from '../form/eLabFTW/DialogSubmitToElab';
import SelectTemplateDialog from './SelectTemplateDialog';
import FeedbackDialog from './FeedbackDialog';
import MiscDialog from './MiscDialog';
import { cloningActions } from '../../store/cloning';
import useStoreEditor from '../../hooks/useStoreEditor';
import useBackendRoute from '../../hooks/useBackendRoute';
import HistoryDownloadedDialog from '../HistoryLoadedDialog';
import VersionDialog from './VersionDialog';
import useAlerts from '../../hooks/useAlerts';

function MainAppBar() {
  const [openExampleDialog, setOpenExampleDialog] = React.useState(false);
  const [openTemplateDialog, setOpenTemplateDialog] = React.useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = React.useState(false);
  const [openMiscDialog, setOpenMiscDialog] = React.useState(false);

  const [openVersionDialog, setOpenVersionDialog] = React.useState(false);
  const [eLabDialogOpen, setELabDialogOpen] = React.useState(false);
  const [loadedHistory, setLoadedHistory] = React.useState(null);

  const backendRoute = useBackendRoute();
  const { updateStoreEditor } = useStoreEditor();
  const store = useStore();
  const dispatch = useDispatch();
  const { addAlert } = useAlerts();

  const exportData = () => {
    dispatch(exportStateThunk());
  };

  const tooltipText = <div className="tooltip-text">See in GitHub</div>;
  // Hidden input field, used to load files.
  const fileInputRef = React.useRef(null);
  const { setCurrentTab, setMainSequenceId } = cloningActions;
  const fileMenu = [
    { display: 'Save cloning history to file', onClick: exportData },
    { display: 'Load cloning history from file', onClick: () => { fileInputRef.current.click(); fileInputRef.current.value = ''; } },
    { display: 'Print cloning history to svg',
      onClick: async () => {
        await dispatch(setCurrentTab(0));
        downloadCloningStrategyAsSvg('history.svg');
      } },
    // elab-demo
    // { display: 'Submit to eLabFTW', onClick: () => setELabDialogOpen(true) },
  ];

  const handleCloseDialog = async (url, isTemplate) => {
    setOpenExampleDialog(false);
    setOpenTemplateDialog(false);
    if (url) {
      const { data } = await axios.get(url);
      if (isTemplate) {
        const segments = url.split('/');
        const kitUrl = segments[segments.length - 3];
        const rootGithubUrl = 'https://raw.githubusercontent.com/genestorian/ShareYourCloning-submission/master/submissions';
        data.sources = data.sources.map((s) => ((s.image === undefined || s.image[0] === null) ? s : {
          ...s, image: [`${rootGithubUrl}/${kitUrl}/${s.image[0]}`, s.image[1]],
        }));
      }
      loadData(data, isTemplate, dispatch, addAlert, backendRoute('validate'));
    }
  };

  // TODO: turn these into <a> elements.
  const helpMenu = [
    { display: 'Newsletter', onClick: () => window.open('https://eepurl.com/h9-n71') },
    { display: 'About the project', onClick: () => window.open('https://www.genestorian.org/') },
    { display: 'Demo video', onClick: () => window.open('https://www.youtube.com/watch?v=n0hedzvpW88') },
    { display: 'App version', onClick: () => setOpenVersionDialog(true) },
  ];

  const onFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (eventFileRead) => {
      let jsonObject = {};
      try {
        jsonObject = JSON.parse(eventFileRead.target.result);
      } catch (e) {
        addAlert({
          message: 'Input file should be a JSON file with the history',
          severity: 'error',
        });
        return;
      }
      const { cloning } = store.getState();
      // If no sequences have been loaded yet, simply load the history
      if (cloning.entities.length === 0) {
        loadData(jsonObject, false, dispatch, addAlert, backendRoute('validate'));
      } else {
        // Else ask the user whether they want to replace or append the history
        setLoadedHistory(jsonObject);
      }
    };
  };

  // If you want to load a particular example on page load, you can do it here.
  // React.useEffect(() => {
  //   const fetchExample = async () => {
  //     const { data } = await axios.get('examples/gateway_start.json');
  //     loadData(data, false, dispatch, addAlert, backendRoute('validate'));
  //     dispatch(setCurrentTab(3));
  //     // Wait for the primer designer to be rendered
  //     setTimeout(() => {
  //       // Click on button that says Open primer designer
  //       const primerDesignerButton = document.querySelector('.main-sequence-editor button');
  //       if (primerDesignerButton) {
  //         primerDesignerButton.click();
  //       }
  //     }, 300);
  //   };
  //   fetchExample();
  // }, []);

  return (
    <AppBar position="static" className="app-bar">
      <div className="app-name">Share Your Cloning</div>
      <Container maxWidth="s">
        <Toolbar disableGutters variant="dense" sx={{ justifyContent: 'center', minHeight: 50 }}>
          <Box
            sx={{
              display: { md: 'flex', xs: 'flex' },
              flexDirection: { md: 'row', xs: 'column' },
              height: '100%',
            }}
          >
            <ButtonWithMenu menuItems={fileMenu}> File </ButtonWithMenu>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChange} />
            <ButtonWithMenu menuItems={helpMenu}> About </ButtonWithMenu>
            <Button onClick={() => setOpenExampleDialog(true)}>Examples</Button>
            <Button onClick={() => setOpenTemplateDialog(true)}>Templates</Button>
            <Button onClick={() => setOpenFeedbackDialog(true)}>Feedback</Button>
            <Button onClick={() => setOpenMiscDialog(true)}>Misc</Button>
            <Tooltip title={tooltipText} arrow placement="right">
              <Button className="github-icon" onClick={() => window.open('https://github.com/manulera/ShareYourCloning')}>
                <GitHubIcon />
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
      <SelectExampleDialog onClose={handleCloseDialog} open={openExampleDialog} />
      {/* Conditional, since we only want to make request to github if templates want to be used */}
      {openTemplateDialog && <SelectTemplateDialog onClose={handleCloseDialog} open={openTemplateDialog} />}
      <FeedbackDialog open={openFeedbackDialog} setOpen={setOpenFeedbackDialog} />
      {/* This one conditionally rendered since it uses hooks etc. */}
      {openMiscDialog && <MiscDialog open={openMiscDialog} setOpen={setOpenMiscDialog} />}
      {/* elab-demo */}
      {/* (
      {eLabDialogOpen && (<DialogSubmitToElab dialogOpen={eLabDialogOpen} setDialogOpen={setELabDialogOpen} />)}
      ) */}
      <HistoryDownloadedDialog {...{ loadedHistory, setLoadedHistory }} />
      <VersionDialog open={openVersionDialog} setOpen={setOpenVersionDialog} />
    </AppBar>
  );
}

export default MainAppBar;
