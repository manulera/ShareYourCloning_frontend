import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Alert, Button, Checkbox, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from './TabPanel';
import { joinEntitiesIntoSingleSequence } from '../../../../utils/sequenceManipulation';
import { usePrimerDesign } from './usePrimerDesign';
import PrimerSettingsForm from './PrimerSettingsForm';
import SequenceRoiSelect from './SequenceRoiSelect';
import PrimerResultList from './PrimerResultList';
import OrientationPicker from './OrientationPicker';
import PrimerSpacerForm from './PrimerSpacerForm';
import { getSequenceName, stringIsNotDNA } from '../../../../store/cloning_utils';

function changeValueAtIndex(current, index, newValue) {
  return current.map((_, i) => (i === index ? newValue : current[i]));
}

export default function PrimerDesignGibsonAssembly({ pcrSources }) {
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion } = usePrimerDesign('gibson_assembly', pcrSources.length);

  const dispatch = useDispatch();
  const store = useStore();
  const { updateStoreEditor } = useStoreEditor();

  const templateSequencesIds = React.useMemo(() => pcrSources.map((pcrSource) => pcrSource.input[0]), [pcrSources]);

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [homologyLength, setHomologyLength] = React.useState(35);
  const [hybridizationLength, setHybridizationLength] = React.useState(20);
  const [fragmentOrientations, setFragmentOrientations] = React.useState(templateSequencesIds.map(() => 'forward'));
  const [targetTm, setTargetTm] = React.useState(55);
  const [circularAssembly, setCircularAssembly] = React.useState(false);
  const [spacers, setSpacers] = React.useState(Array(pcrSources.length + 1).fill(''));

  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const spacersAreValid = React.useMemo(() => spacers.every((spacer) => !stringIsNotDNA(spacer)), [spacers]);
  const sequenceProduct = React.useMemo(() => {
    if (rois.every((region) => region !== null) && spacersAreValid && fragmentOrientations.every((orientation) => orientation !== null)) {
      const { entities } = store.getState().cloning;
      const templateEntities = templateSequencesIds.map((id) => entities.find((e) => e.id === id));
      return joinEntitiesIntoSingleSequence(templateEntities, rois.map((s) => s.selectionLayer), fragmentOrientations, spacers, circularAssembly);
    }
    return null;
  }, [fragmentOrientations, rois, templateSequencesIds, spacers, circularAssembly, spacersAreValid]);

  const sequenceNames = React.useMemo(() => {
    const { entities } = store.getState().cloning;
    return templateSequencesIds.map((id) => getSequenceName(entities.find((e) => e.id === id)));
  }, [templateSequencesIds, store]);

  React.useEffect(() => {
    // Focus on the correct sequence
    const mainTab = templateSequencesIds.findIndex((id) => id === mainSequenceId);
    if (mainTab !== -1) {
      setSelectedTab(mainTab);
    }
  }, [templateSequencesIds, mainSequenceId]);

  React.useEffect(() => {
    if (sequenceProduct && selectedTab === templateSequencesIds.length) {
      updateEditor(store, 'mainEditor', { sequenceData: sequenceProduct });
    }
  }, [sequenceProduct, selectedTab]);

  const onCircularAssemblyChange = (event) => {
    setCircularAssembly(event.target.checked);
    if (event.target.checked) {
      // Remove the first spacer
      setSpacers((current) => current.slice(1));
    } else {
      // Add it again
      setSpacers((current) => ['', ...current]);
    }
  };

  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue < templateSequencesIds.length) {
      updateStoreEditor('mainEditor', templateSequencesIds[newValue]);
      dispatch(setMainSequenceId(templateSequencesIds[newValue]));
    } else if (rois.every((region) => region !== null)) {
      updateEditor(store, 'mainEditor', { sequenceData: sequenceProduct });
    } else {
      updateStoreEditor('mainEditor', null);
    }
  };

  const addPrimers = () => {
    batch(() => {
      pcrSources.forEach((pcrSource, index) => {
        dispatch(addPrimersToPCRSource({
          fwdPrimer: primers[index * 2],
          revPrimer: primers[index * 2 + 1],
          sourceId: pcrSource.id,
        }));
      });
      dispatch(setMainSequenceId(null));
      dispatch(setCurrentTab(0));
    });
    setPrimers([]);
    setSelectedTab(0);
    document.getElementById(`source-${pcrSources[0].id}`)?.scrollIntoView();
    updateStoreEditor('mainEditor', null);
  };

  const onPrimerDesign = async () => {
    const params = {
      homology_length: homologyLength,
      minimal_hybridization_length: hybridizationLength,
      target_tm: targetTm,
      circular: circularAssembly,
    };
    const serverError = await designPrimers(templateSequencesIds, rois, params, fragmentOrientations, spacers);

    if (!serverError) {
      setSelectedTab(templateSequencesIds.length + 1);
    }
  };

  return (
    <Box className="primer-design" sx={{ width: '60%', minWidth: '600px', margin: 'auto', border: 1, borderRadius: 2, overflow: 'hidden', borderColor: 'primary.main', marginBottom: 5 }}>
      <Box sx={{ margin: 'auto', display: 'flex', height: 'auto', borderBottom: 2, borderColor: 'primary.main', backgroundColor: 'primary.main' }}>
        <Box component="h2" sx={{ margin: 'auto', py: 1, color: 'white' }}>Primer designer</Box>
      </Box>
      <Box>
        <Tabs value={selectedTab} onChange={onTabChange} variant="scrollable" scrollButtons="auto">
          {templateSequencesIds.map((id) => (
            <Tab key={id} label={`Seq ${id}`} />
          ))}
          <Tab label="Other settings" />
          {primers.length && (<Tab label="Results" />)}
        </Tabs>
        {templateSequencesIds.map((id, index) => (
          <TabPanel key={id} value={selectedTab} index={index}>
            <SequenceRoiSelect selectedRegion={rois[index]} onSelectRegion={() => onSelectRegion(index)} description={`Select the fragment of sequence ${id} to be amplified`} inputLabel={`Amplified region (sequence ${id})`} />
          </TabPanel>
        ))}
        <TabPanel value={selectedTab} index={templateSequencesIds.length}>
          <Box sx={{ width: '80%', margin: 'auto' }}>
            <PrimerSettingsForm {...{ homologyLength, setHomologyLength, targetTm, setTargetTm, hybridizationLength, setHybridizationLength, fragmentOrientations, setFragmentOrientations }} />
            {rois.every((region) => region !== null) && (
            <>
              <Box sx={{ mt: 3, mb: 3 }}>
                <FormLabel sx={{ mb: 2 }}>Fragment orientation</FormLabel>
                {/* Per fragment */}
                {templateSequencesIds.map((id, index) => (
                  <OrientationPicker
                    key={id}
                    value={fragmentOrientations[index]}
                    onChange={(e) => setFragmentOrientations((current) => changeValueAtIndex(current, index, e.target.value))}
                    label={sequenceNames[index] && sequenceNames[index] !== 'name' ? `Seq. ${id} (${sequenceNames[index]})` : `Seq. ${id}`}
                    index={index}
                  />
                ))}
              </Box>
              <PrimerSpacerForm
                spacers={spacers}
                setSpacers={setSpacers}
                fragmentCount={pcrSources.length}
                circularAssembly={circularAssembly}
                sequenceNames={sequenceNames}
                sequenceIds={templateSequencesIds}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <FormControl>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={circularAssembly}
                        onChange={onCircularAssemblyChange}
                        name="circular-assembly"
                      />
                    )}
                    label="Circular assembly"
                  />
                </FormControl>
              </Box>
            </>
            )}

            { (rois.every((region) => region !== null) && targetTm && hybridizationLength && homologyLength && spacersAreValid) && (
            <FormControl>
              <Button variant="contained" onClick={onPrimerDesign} sx={{ marginTop: 2, marginBottom: 2, backgroundColor: 'primary.main' }}>Design primers</Button>
            </FormControl>
            )}
          </Box>
        </TabPanel>
        {primers.length > 0 && (
          <TabPanel value={selectedTab} index={templateSequencesIds.length + 1}>
            <PrimerResultList primers={primers} addPrimers={addPrimers} setPrimers={setPrimers} />
          </TabPanel>
        )}
        {error && (<Alert severity="error" sx={{ width: 'fit-content', margin: 'auto', mb: 2 }}>{error}</Alert>)}

      </Box>
    </Box>
  );
}