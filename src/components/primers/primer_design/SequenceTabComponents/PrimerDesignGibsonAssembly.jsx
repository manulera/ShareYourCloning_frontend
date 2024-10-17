import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Alert, Button, Checkbox, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import { batch, useDispatch, useStore } from 'react-redux';
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
import { stringIsNotDNA } from '../../../../store/cloning_utils';
import usePrimerDesignSettings from './usePrimerDesignSettings';

function changeValueAtIndex(current, index, newValue) {
  return current.map((_, i) => (i === index ? newValue : current[i]));
}

export default function PrimerDesignGibsonAssembly({ pcrSources }) {
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const sequenceIds = React.useMemo(() => pcrSources.map((pcrSource) => pcrSource.input[0]), [pcrSources]);
  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion, onTabChange, selectedTab, setSequenceProduct } = usePrimerDesign('gibson_assembly', sequenceIds);

  const dispatch = useDispatch();
  const store = useStore();
  const { updateStoreEditor } = useStoreEditor();

  const templateSequencesIds = React.useMemo(() => pcrSources.map((pcrSource) => pcrSource.input[0]), [pcrSources]);

  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: 35, hybridizationLength: 20, targetTm: 55 });
  const [fragmentOrientations, setFragmentOrientations] = React.useState(templateSequencesIds.map(() => 'forward'));
  const [circularAssembly, setCircularAssembly] = React.useState(false);
  const [spacers, setSpacers] = React.useState(Array(pcrSources.length + 1).fill(''));

  const spacersAreValid = React.useMemo(() => spacers.every((spacer) => !stringIsNotDNA(spacer)), [spacers]);
  React.useEffect(() => {
    if (rois.every((region) => region !== null) && spacersAreValid && fragmentOrientations.every((orientation) => orientation !== null)) {
      const { teselaJsonCache } = store.getState().cloning;
      const templateSequences = templateSequencesIds.map((id) => teselaJsonCache[id]);
      const newSequenceProduct = joinEntitiesIntoSingleSequence(templateSequences, rois.map((s) => s.selectionLayer), fragmentOrientations, spacers, circularAssembly);
      newSequenceProduct.name = 'Gibson Assembly product';
      setSequenceProduct(newSequenceProduct);
    } else {
      setSequenceProduct(null);
    }
  }, [fragmentOrientations, rois, templateSequencesIds, spacers, circularAssembly, spacersAreValid, store, setSequenceProduct]);

  const sequenceNames = React.useMemo(() => {
    const { teselaJsonCache } = store.getState().cloning;
    return templateSequencesIds.map((id) => teselaJsonCache[id].name);
  }, [templateSequencesIds, store]);

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
    onTabChange(null, 0);
    document.getElementById(`source-${pcrSources[0].id}`)?.scrollIntoView();
    updateStoreEditor('mainEditor', null);
  };

  const onPrimerDesign = async () => {
    const params = {
      homology_length: primerDesignSettings.homologyLength,
      minimal_hybridization_length: primerDesignSettings.hybridizationLength,
      target_tm: primerDesignSettings.targetTm,
      circular: circularAssembly,
    };
    const serverError = await designPrimers(rois, params, fragmentOrientations, spacers);

    if (!serverError) {
      onTabChange(null, templateSequencesIds.length + 1);
    }
  };

  return (
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
          <PrimerSettingsForm {...primerDesignSettings} />
          {rois.every((region) => region !== null) && (
            <>
              <Box sx={{ mt: 2 }}>
                <FormLabel>Fragment orientation</FormLabel>
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

          { (rois.every((region) => region !== null) && primerDesignSettings.valid && spacersAreValid) && (
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
  );
}
