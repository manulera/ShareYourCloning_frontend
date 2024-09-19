import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Alert, Button, FormControl } from '@mui/material';
import { batch, useDispatch, useSelector } from 'react-redux';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from './TabPanel';
import { usePrimerDesign } from './usePrimerDesign';
import SequenceRoiSelect from './SequenceRoiSelect';
import PrimerSettingsForm from './PrimerSettingsForm';
import PrimerResultList from './PrimerResultList';
import OrientationPicker from './OrientationPicker';

export default function PrimerDesignHomologousRecombination({ homologousRecombinationTargetId, pcrSource }) {
  // TODO: shrinking horizontally removes tabs
  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion } = usePrimerDesign('homologous_recombination', 2);

  const templateSequenceId = pcrSource.input[0];

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [homologyLength, setHomologyLength] = React.useState(80);
  const [hybridizationLength, setHybridizationLength] = React.useState(20);
  const [insertionOrientation, setInsertionOrientation] = React.useState('');
  const [targetTm, setTargetTm] = React.useState(55);

  const dispatch = useDispatch();
  const { updateStoreEditor } = useStoreEditor();

  const { setMainSequenceId, setCurrentTab } = cloningActions;
  const { addPrimersToPCRSource } = cloningActions;

  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);

  React.useEffect(() => {
    // Focus on the correct sequence
    if (templateSequenceId && templateSequenceId === mainSequenceId) {
      setSelectedTab(0);
    } else if (homologousRecombinationTargetId && homologousRecombinationTargetId === mainSequenceId) {
      setSelectedTab(1);
    }
  }, [templateSequenceId, homologousRecombinationTargetId, mainSequenceId]);

  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      updateStoreEditor('mainEditor', templateSequenceId);
      dispatch(setMainSequenceId(templateSequenceId));
    } else if (newValue === 1) {
      updateStoreEditor('mainEditor', homologousRecombinationTargetId);
      dispatch(setMainSequenceId(homologousRecombinationTargetId));
    }
  };

  const addPrimers = () => {
    batch(() => {
      dispatch(addPrimersToPCRSource({ fwdPrimer: primers[0], revPrimer: primers[1], sourceId: pcrSource.id }));
      dispatch(setMainSequenceId(null));
      dispatch(setCurrentTab(0));
    });
    setPrimers([]);
    setSelectedTab(0);
    document.getElementById(`source-${pcrSource.id}`)?.scrollIntoView();
    updateStoreEditor('mainEditor', null);
  };

  const onPrimerDesign = () => {
    const params = {
      homology_length: homologyLength,
      minimal_hybridization_length: hybridizationLength,
      target_tm: targetTm,
      insert_forward: insertionOrientation === 'forward',
    };
    designPrimers([templateSequenceId, homologousRecombinationTargetId], rois, params, [insertionOrientation === 'forward', null]);
    setSelectedTab(3);
  };

  return (
    <Box className="primer-design" sx={{ width: '60%', minWidth: '600px', margin: 'auto', border: 1, borderRadius: 2, overflow: 'hidden', borderColor: 'primary.main', marginBottom: 5 }}>
      <Box sx={{ margin: 'auto', display: 'flex', height: 'auto', borderBottom: 2, borderColor: 'primary.main', backgroundColor: 'primary.main' }}>
        <Box component="h2" sx={{ margin: 'auto', py: 1, color: 'white' }}>Primer designer</Box>
      </Box>
      <Box>
        <Tabs value={selectedTab} onChange={onTabChange} centered>
          <Tab label="Amplified region" />
          <Tab label="Replaced region" />
          <Tab label="Other settings" />
          {primers.length === 2 && (<Tab label="Results" />)}
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <SequenceRoiSelect
            selectedRegion={rois[0]}
            onSelectRegion={() => onSelectRegion(0, false)}
            description={`Select the fragment of sequence ${templateSequenceId} to be amplified`}
            inputLabel={`Amplified region (sequence ${templateSequenceId})`}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <SequenceRoiSelect
            selectedRegion={rois[1]}
            onSelectRegion={() => onSelectRegion(1, true)}
            description="Select the single position (insertion) or region (replacement) where recombination will introduce the amplified fragment"
            inputLabel={`Replaced region (sequence ${homologousRecombinationTargetId})`}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <PrimerSettingsForm {...{ homologyLength, setHomologyLength, targetTm, setTargetTm, hybridizationLength, setHybridizationLength, insertionOrientation, setInsertionOrientation }} />
          <OrientationPicker
            value={insertionOrientation}
            onChange={(e) => setInsertionOrientation(e.target.value)}
            label="Orientation of insert"
            index={0}
          />
          { (rois.every((roi) => roi !== null) && insertionOrientation && targetTm && hybridizationLength && homologyLength) && (
          <FormControl>
            <Button variant="contained" onClick={onPrimerDesign} sx={{ marginBottom: 2, backgroundColor: 'primary.main' }}>Design primers</Button>
          </FormControl>
          )}

        </TabPanel>
        {primers.length === 2 && (
        <TabPanel value={selectedTab} index={3}>
          <PrimerResultList primers={primers} addPrimers={addPrimers} setPrimers={setPrimers} />
        </TabPanel>
        )}
        {error && (<Alert severity="error" sx={{ width: 'fit-content', margin: 'auto', mb: 2 }}>{error}</Alert>)}

      </Box>
    </Box>
  );
}
