import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Alert, Button, FormControl, FormControlLabel, FormLabel, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import { batch, shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import axios from 'axios';
import { isEqual } from 'lodash-es';
import { cloningActions } from '../../../store/cloning';
import error2String from '../../../utils/error2String';
import PrimerResultForm from './PrimerResultForm';
import useStoreEditor from '../../../hooks/useStoreEditor';

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

function selectedRegion2SequenceLocation({ selectionLayer, caretPosition }) {
  if (caretPosition === -1) {
    return { start: selectionLayer.start, end: selectionLayer.end + 1 };
  }
  return { start: caretPosition, end: caretPosition };
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

      <Typography component="div">{children}</Typography>

      )}
    </div>
  );
}

export default function PrimerDesignForm({ pcrTemplateId, homologousRecombinationTargetId }) {
  // TODO: extra constrains -> amplify should have length > 0, replace does not matter
  // TODO: shrinking horizontally removes tabs

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [homologyLength, setHomologyLength] = React.useState(80);
  const [hybridizationLength, setHybridizationLength] = React.useState(20);
  const [amplifyRegion, setAmplifyRegion] = React.useState(null);
  const [amplifyError, setAmplifyError] = React.useState('');
  const [replaceRegion, setReplaceRegion] = React.useState(null);
  const [insertionOrientation, setInsertionOrientation] = React.useState('');
  const [targetTm, setTargetTm] = React.useState(55);
  const [error, setError] = React.useState('');
  const [fwdPrimer, setFwdPrimer] = React.useState(null);
  const [revPrimer, setRevPrimer] = React.useState(null);

  const dispatch = useDispatch();
  const store = useStore();
  const { updateStoreEditor } = useStoreEditor();

  const { setMainSequenceId, setCurrentTab } = cloningActions;
  const { addPrimer } = cloningActions;

  // TODO? selectedRegion could be accessed from the store when the user selects a region
  const existingPrimerNames = useSelector((state) => state.cloning.primers.map((p) => p.name), shallowEqual);
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const selectedRegion = useSelector((state) => state.cloning.mainSequenceSelection, isEqual);

  const primersAreValid = fwdPrimer?.name && revPrimer?.name && !existingPrimerNames.includes(fwdPrimer.name) && !existingPrimerNames.includes(revPrimer.name);

  const updateForwardPrimerName = (name) => {
    setFwdPrimer((prev) => ({ ...prev, name }));
  };

  const updateReversePrimerName = (name) => {
    setRevPrimer((prev) => ({ ...prev, name }));
  };

  React.useEffect(() => {
    // Focus on the correct sequence
    if (pcrTemplateId && pcrTemplateId === mainSequenceId) {
      setSelectedTab(0);
    } else if (homologousRecombinationTargetId && homologousRecombinationTargetId === mainSequenceId) {
      setSelectedTab(1);
    }
  }, [pcrTemplateId, homologousRecombinationTargetId, mainSequenceId]);

  // TODO: make this a hook
  const designPrimers = async () => {
    // Access the state
    const { cloning: { entities } } = store.getState();
    const pcrTemplate = entities.find((e) => e.id === pcrTemplateId);
    const homologousRecombinationTarget = entities.find((e) => e.id === homologousRecombinationTargetId);
    // Make post request
    const replaceLocation = selectedRegion2SequenceLocation(replaceRegion);
    const amplifyLocation = selectedRegion2SequenceLocation(amplifyRegion);

    const requestData = {
      pcr_template: {
        sequence: pcrTemplate,
        location: amplifyLocation,
      },
      homologous_recombination_target: {
        sequence: homologousRecombinationTarget,
        location: replaceLocation,
      },
    };
    const config = {
      params: {
        homology_length: homologyLength,
        minimal_hybridization_length: hybridizationLength,
        insert_forward: !insertionOrientation ? null : insertionOrientation === 'forward',
        target_tm: targetTm,
      },
    };
    const url = new URL('/primer_design/homologous_recombination', import.meta.env.VITE_REACT_APP_BACKEND_URL).href;
    try {
      const resp = await axios.post(url, requestData, config);
      setError('');
      setFwdPrimer(resp.data.forward_primer);
      setRevPrimer(resp.data.reverse_primer);
      setSelectedTab(3);
    } catch (thrownError) {
      setError(error2String(thrownError));
    }
  };
  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      updateStoreEditor('mainEditor', pcrTemplateId);
      dispatch(setMainSequenceId(pcrTemplateId));
    } else if (newValue === 1) {
      updateStoreEditor('mainEditor', homologousRecombinationTargetId);
      dispatch(setMainSequenceId(homologousRecombinationTargetId));
    }
  };

  const openPrimerDesigner = () => {
    updateStoreEditor('mainEditor', pcrTemplateId);
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

  const addPrimers = () => {
    batch(() => {
      dispatch(addPrimer({ ...fwdPrimer }));
      dispatch(addPrimer({ ...revPrimer }));
      dispatch(setMainSequenceId(null));
      dispatch(setCurrentTab(0));
    });
    setAmplifyRegion(null);
    setReplaceRegion(null);
    setFwdPrimer(null);
    setRevPrimer(null);
    setSelectedTab(0);
    updateStoreEditor('mainEditor', null);
  };

  if (![pcrTemplateId, homologousRecombinationTargetId].includes(mainSequenceId)) {
    return (
      <div>
        <Button sx={{ mb: 4 }} variant="contained" color="success" onClick={openPrimerDesigner}>Open primer designer</Button>
      </div>
    );
  }

  return (
    <Box className="primer-design" sx={{ width: '60%', minWidth: '600px', margin: 'auto', border: 1, borderRadius: 2, overflow: 'hidden', borderColor: 'primary.main', marginBottom: 5 }}>
      <Box sx={{ margin: 'auto', display: 'flex', height: 'auto', borderBottom: 2, borderColor: 'primary.main', backgroundColor: 'primary.main' }}>
        <Box component="h2" sx={{ margin: 'auto', py: 1, color: 'white' }}>Primer designer</Box>
      </Box>
      <Box>
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
          centered
          scrollButtons="auto"
        >
          <Tab label="Amplified region" />
          <Tab label="Replaced region" />
          <Tab label="Other settings" />
          {fwdPrimer && revPrimer && (<Tab label="Results" />)}

        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <div>
            <Alert severity="info">Select the region to be amplified by PCR</Alert>
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
            <Alert severity="info">Select the single position (insertion) or region (replacement) where recombination will introduce the amplified fragment</Alert>
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
                  label="Homology length"
                  value={homologyLength}
                  onChange={(e) => { setHomologyLength(Number(e.target.value)); }}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">bp</InputAdornment>,
                    sx: { width: '10em' },
                  }}

                />
              </FormControl>
            </div>
            <div>
              <FormControl sx={{ py: 1, mr: 2 }}>
                <TextField
                  label="Target hybridization Tm"
                  value={targetTm}
                  onChange={(e) => { setTargetTm(Number(e.target.value)); }}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                    sx: { width: '10em' },
                  }}
                />
              </FormControl>

              <FormControl sx={{ py: 1 }}>
                <TextField
                  sx={{ minWidth: 'max-content' }}
                  label="Min. hybridization length"
                  value={hybridizationLength}
                  onChange={(e) => { setHybridizationLength(Number(e.target.value)); }}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">bp</InputAdornment>,
                    sx: { width: '10em' },
                  }}
                />
              </FormControl>
            </div>
            <div>
              <FormControl sx={{ marginBottom: 2 }}>
                <FormLabel id="insertion-orientation-label">Orientation of insert</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="insertion-orientation-label"
                  name="radio-buttons-group"
                  onChange={(e) => setInsertionOrientation(e.target.value)}
                  value={insertionOrientation}
                >
                  <FormControlLabel value="forward" control={<Radio />} label="Forward" />
                  <FormControlLabel value="reverse" control={<Radio />} label="Reverse" />
                </RadioGroup>
              </FormControl>
            </div>
            { (amplifyRegion && replaceRegion && insertionOrientation && targetTm && hybridizationLength && homologyLength) && (
              <FormControl>
                <Button variant="contained" onClick={designPrimers} sx={{ marginBottom: 2, backgroundColor: 'primary.main' }}>Design primers</Button>
              </FormControl>
            )}

          </div>
        </TabPanel>
        {fwdPrimer && revPrimer && (
        <TabPanel value={selectedTab} index={3}>
          <PrimerResultForm
            updatePrimerName={updateForwardPrimerName}
            primer={fwdPrimer}
            existingPrimerNames={existingPrimerNames}
          />
          <PrimerResultForm
            updatePrimerName={updateReversePrimerName}
            primer={revPrimer}
            existingPrimerNames={existingPrimerNames}
          />
            {primersAreValid && (
            <Button
              variant="contained"
              color="primary"
              onClick={addPrimers}
              sx={{ mb: 2 }}
            >
              Save primers
            </Button>
            )}
        </TabPanel>
        )}
        {error && (<Alert severity="error" sx={{ width: 'fit-content', margin: 'auto', mb: 2 }}>{error}</Alert>)}

      </Box>
    </Box>
  );
}
