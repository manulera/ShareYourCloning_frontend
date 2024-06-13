import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Alert, Button, FormControl, TextField } from '@mui/material';
import { useDispatch, useStore } from 'react-redux';
import { cloningActions } from '../../../store/cloning';

function selectedRegion2String(selectedRegion) {
  if (!selectedRegion) {
    // We return a space so that the label of the TextField
    // shows up on top of the TextField
    return ' ';
  }
  const { selectionLayer, caretPosition } = selectedRegion;
  if (caretPosition === -1) {
    return `${selectionLayer.start} - ${selectionLayer.end}`;
  }

  return `insertion at ${caretPosition}`;
}

function selectedRegion2PythonRange({ selectionLayer, caretPosition }) {
  if (caretPosition === -1) {
    return [selectionLayer.start, selectionLayer.end + 1];
  }
  return [caretPosition, caretPosition];
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (

      <Typography>{children}</Typography>

      )}
    </div>
  );
}

export default function PrimerDesignForm({ selectedRegion, pcrTemplateId, homologousRecombinationTargetId, mainSequenceId }) {
  // TODO: extra constrains -> amplify should have length > 0, replace does not matter
  const dispatch = useDispatch();
  const { setMainSequenceId } = cloningActions;
  const store = useStore();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [HomologyLength, setHomologyLength] = React.useState(80);
  const [hybridizationLength, setHybridizationLength] = React.useState(20);
  const [amplifyRegion, setAmplifyRegion] = React.useState(null);
  const [amplifyError, setAmplifyError] = React.useState('');
  const [replaceRegion, setReplaceRegion] = React.useState(null);

  const designPrimers = async () => {
    console.log('Designing primers', amplifyRegion, replaceRegion, HomologyLength, hybridizationLength, pcrTemplateId, homologousRecombinationTargetId);
    // Access the state
    const { cloning: { entities } } = store.getState();
    const pcrTemplate = entities.find((e) => e.id === pcrTemplateId);
    const homologousRecombinationTarget = entities.find((e) => e.id === homologousRecombinationTargetId);
    // Make post request
    const replaceRange = selectedRegion2PythonRange(replaceRegion);
    const amplifyRange = selectedRegion2PythonRange(amplifyRegion);

    const requestData = {
      pcr_template: {
        sequence: pcrTemplate,
        range: amplifyRange,
      },
      homologous_recombination_target: {
        sequence: homologousRecombinationTarget,
        range: replaceRange,
      },
    };
  };

  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      dispatch(setMainSequenceId(pcrTemplateId));
    } else if (newValue === 1) {
      dispatch(setMainSequenceId(homologousRecombinationTargetId));
    }
  };

  const openPrimerDesigner = () => {
    dispatch(setMainSequenceId(pcrTemplateId));
    setSelectedTab(0);
  };

  const onAmplifyRegionChange = () => {
    const { caretPosition } = selectedRegion;
    if (caretPosition === -1) {
      setAmplifyError('');
      setAmplifyRegion(selectedRegion);
    } else {
      setAmplifyRegion(null);
      setAmplifyError('Select a region (not a single position) to amplify');
    }
  };

  const onReplaceRegionChange = () => {
    setReplaceRegion(selectedRegion);
  };

  if (![pcrTemplateId, homologousRecombinationTargetId].includes(mainSequenceId)) {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={openPrimerDesigner}>Open primer designer</Button>
      </div>
    );
  }

  return (
    <Box sx={{ width: '60%', margin: 'auto', border: 2, borderRadius: 4, overflow: 'hidden', borderColor: 'gray', marginBottom: 5 }}>
      <Box sx={{ margin: 'auto', display: 'flex', height: 'auto', borderBottom: 2, borderColor: 'primary.main' }}>
        <Box component="h2" sx={{ margin: 'auto', color: 'primary.main', py: 1 }}>Primer design</Box>
      </Box>
      <Box>
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Amplified region" />
          <Tab label="Replaced region" />
          <Tab label="Other settings" />

        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <div>
            {amplifyError && (<Alert severity="error">{amplifyError}</Alert>)}
            <div>
              <FormControl sx={{ py: 2 }}>
                <TextField
                  label={`Amplified region (sequence ${pcrTemplateId})`}
                  value={selectedRegion2String(amplifyRegion)}
                  disabled
                />
              </FormControl>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={onAmplifyRegionChange}
                sx={{ mb: 2 }}
              >
                Set from selection
              </Button>
            </div>

          </div>

        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <div>
            <Alert severity="info">Select a single position for insertion, region for replacement</Alert>
            <div>
              <FormControl sx={{ py: 2 }}>
                <TextField
                  label={`Replaced region (sequence ${homologousRecombinationTargetId})`}
                  value={selectedRegion2String(replaceRegion)}
                  disabled
                />
              </FormControl>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={onReplaceRegionChange}
                sx={{ mb: 2 }}
              >
                Set from selection
              </Button>
            </div>
          </div>

        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <div>
            <div>
              <FormControl sx={{ py: 2 }}>
                <TextField
                  label="Homology length (in bp)"
                  value={HomologyLength}
                  onChange={(e) => { setHomologyLength(Number(e.target.value)); }}
                  type="number"
                />
              </FormControl>
            </div>
            <div>
              <FormControl sx={{ py: 2 }}>
                <TextField
                  label="Hybridization length (in bp)"
                  value={hybridizationLength}
                  onChange={(e) => { setHybridizationLength(Number(e.target.value)); }}
                  type="number"
                />
              </FormControl>
            </div>
            {amplifyRegion && replaceRegion && (
              <FormControl>
                <Button variant="contained" onClick={designPrimers} sx={{ my: 2, backgroundColor: 'primary.main' }}>Design primers</Button>
              </FormControl>
            )}

          </div>
        </TabPanel>

      </Box>
    </Box>
  );
}
