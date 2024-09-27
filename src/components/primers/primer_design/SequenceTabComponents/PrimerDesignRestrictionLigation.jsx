import * as React from 'react';
import { Box, Tab, Tabs, FormControl, FormLabel, Button, Alert } from '@mui/material';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from './TabPanel';
import { usePrimerDesign } from './usePrimerDesign';
import PrimerSettingsForm from './PrimerSettingsForm';
import SequenceRoiSelect from './SequenceRoiSelect';
import PrimerResultList from './PrimerResultList';
import PrimerSpacerForm from './PrimerSpacerForm';
import EnzymeMultiSelect from '../../../form/EnzymeMultiSelect';

function PrimerDesignRestrictionLigation({ pcrSource }) {
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion } = usePrimerDesign('restriction_ligation', 1);

  const dispatch = useDispatch();
  const store = useStore();
  const { updateStoreEditor } = useStoreEditor();

  const templateSequenceId = pcrSource.input[0];

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [hybridizationLength, setHybridizationLength] = React.useState(20);
  const [targetTm, setTargetTm] = React.useState(55);
  const [leftEnzyme, setLeftEnzyme] = React.useState(null);
  const [rightEnzyme, setRightEnzyme] = React.useState(null);
  const [spacers, setSpacers] = React.useState(['', '']);

  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);

  React.useEffect(() => {
    if (templateSequenceId === mainSequenceId) {
      setSelectedTab(0);
    }
  }, [templateSequenceId, mainSequenceId]);

  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      updateStoreEditor('mainEditor', templateSequenceId);
      dispatch(setMainSequenceId(templateSequenceId));
    } else {
      updateStoreEditor('mainEditor', null);
    }
  };

  const addPrimers = () => {
    batch(() => {
      dispatch(addPrimersToPCRSource({
        fwdPrimer: primers[0],
        revPrimer: primers[1],
        sourceId: pcrSource.id,
      }));
      dispatch(setMainSequenceId(null));
      dispatch(setCurrentTab(0));
    });
    setPrimers([]);
    setSelectedTab(0);
    document.getElementById(`source-${pcrSource.id}`)?.scrollIntoView();
    updateStoreEditor('mainEditor', null);
  };

  const onPrimerDesign = async () => {
    const params = {
      minimal_hybridization_length: hybridizationLength,
      target_tm: targetTm,
      left_enzymes: leftEnzyme,
      right_enzymes: rightEnzyme,
    };
    const serverError = await designPrimers([templateSequenceId], rois, params, ['forward'], spacers);

    if (!serverError) {
      setSelectedTab(2);
    }
  };

  return (
    <Box>
      <Tabs value={selectedTab} onChange={onTabChange} variant="scrollable" scrollButtons="auto">
        <Tab label={`Seq ${templateSequenceId}`} />
        <Tab label="Other settings" />
        {primers.length > 0 && <Tab label="Results" />}
      </Tabs>
      <TabPanel value={selectedTab} index={0}>
        <SequenceRoiSelect selectedRegion={rois[0]} onSelectRegion={() => onSelectRegion(0)} description={`Select the fragment of sequence ${templateSequenceId} to be amplified`} inputLabel={`Amplified region (sequence ${templateSequenceId})`} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Box sx={{ width: '80%', margin: 'auto' }}>
          <PrimerSettingsForm {...{ hybridizationLength, setHybridizationLength, targetTm, setTargetTm, setHomologyLength: null }} />

          <Box sx={{ pt: 2 }}>
            <FormLabel>Restriction enzymes</FormLabel>
            <Box sx={{ pt: 1 }}>
              <FormControl sx={{ width: '10em', mr: 2 }}>
                <EnzymeMultiSelect value={leftEnzyme} setEnzymes={setLeftEnzyme} label="Left enzyme" multiple={false} />
              </FormControl>
              <FormControl sx={{ width: '10em' }}>
                <EnzymeMultiSelect value={rightEnzyme} setEnzymes={setRightEnzyme} label="Right enzyme" multiple={false} />
              </FormControl>
            </Box>
          </Box>

          <PrimerSpacerForm
            spacers={spacers}
            setSpacers={setSpacers}
            fragmentCount={1}
            circularAssembly={false}
            sequenceNames={['Left spacer', 'Right spacer']}
            sequenceIds={[`${templateSequenceId}_left`, `${templateSequenceId}_right`]}
          />
          <Button variant="contained" onClick={onPrimerDesign} sx={{ marginTop: 2, marginBottom: 2, backgroundColor: 'primary.main' }}>Design Primers</Button>
        </Box>
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {primers.length > 0 && (
        <>
          <PrimerResultList primers={primers} />
          <Button variant="contained" onClick={addPrimers} sx={{ mt: 3 }}>Add Primers</Button>
        </>
        )}
      </TabPanel>
    </Box>

  );
}

export default PrimerDesignRestrictionLigation;
