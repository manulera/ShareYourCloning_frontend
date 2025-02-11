import React from 'react';
import Box from '@mui/material/Box';
import { Alert, Checkbox, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import { batch, useDispatch, useStore } from 'react-redux';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from '../../../navigation/TabPanel';
import { joinEntitiesIntoSingleSequence } from '../../../../utils/sequenceManipulation';
import { usePrimerDesign } from './usePrimerDesign';
import PrimerSettingsForm from './PrimerSettingsForm';
import PrimerResultList from './PrimerResultList';
import OrientationPicker from './OrientationPicker';
import PrimerSpacerForm from './PrimerSpacerForm';
import usePrimerDesignSettings from './usePrimerDesignSettings';
import StepNavigation from './StepNavigation';
import PrimerDesignStepper from './PrimerDesignStepper';
import { getSubmissionPreventedMessage } from './utils';
import TabPanelSelectRoi from './TabPanelSelectRoi';

function changeValueAtIndex(current, index, newValue) {
  return current.map((_, i) => (i === index ? newValue : current[i]));
}

export default function PrimerDesignGibsonAssembly({ pcrSources }) {
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const sequenceIds = React.useMemo(() => pcrSources.map((pcrSource) => pcrSource.input[0]), [pcrSources]);
  const { primers, error, designPrimers, setPrimers, rois, onTabChange, selectedTab, setSequenceProduct, handleNext, handleBack, handleSelectRegion } = usePrimerDesign('gibson_assembly', sequenceIds);

  const dispatch = useDispatch();
  const store = useStore();
  const { updateStoreEditor } = useStoreEditor();

  const templateSequencesIds = React.useMemo(() => pcrSources.map((pcrSource) => pcrSource.input[0]), [pcrSources]);

  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: 35, hybridizationLength: 20, targetTm: 55 });
  const [fragmentOrientations, setFragmentOrientations] = React.useState(templateSequencesIds.map(() => 'forward'));
  const [circularAssembly, setCircularAssembly] = React.useState(false);
  const [spacers, setSpacers] = React.useState(Array(pcrSources.length + 1).fill(''));

  const submissionPreventedMessage = getSubmissionPreventedMessage({ rois, primerDesignSettings, spacers });
  React.useEffect(() => {
    if (submissionPreventedMessage === '') {
      const { teselaJsonCache } = store.getState().cloning;
      const templateSequences = templateSequencesIds.map((id) => teselaJsonCache[id]);
      const newSequenceProduct = joinEntitiesIntoSingleSequence(templateSequences, rois.map((s) => s.selectionLayer), fragmentOrientations, spacers, circularAssembly);
      newSequenceProduct.name = 'Gibson Assembly product';
      setSequenceProduct(newSequenceProduct);
    } else {
      setSequenceProduct(null);
    }
  }, [fragmentOrientations, rois, templateSequencesIds, spacers, circularAssembly, store, setSequenceProduct]);

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

  const steps = React.useMemo(() => [
    ...templateSequencesIds.map((id, index) => (
      { label: `Seq ${id}`, completed: rois[index] !== null, selectOrientation: true }
    )),
    { label: 'Other settings', disabled: rois.some((region) => region === null), completed: primers.length > 0 },
    { label: 'Results', disabled: primers.length === 0 },
  ], [rois, primers]);

  return (
    <Box>
      <PrimerDesignStepper
        selectedTab={selectedTab}
        steps={steps}
        onTabChange={onTabChange}
      />
      {steps.slice(0, templateSequencesIds.length).map((step, index) => (
        <TabPanelSelectRoi
          key={step.label}
          step={step}
          index={index}
          selectedTab={selectedTab}
          handleSelectRegion={handleSelectRegion}
          handleBack={handleBack}
          handleNext={handleNext}
          templateSequencesIds={templateSequencesIds}
          rois={rois}
        />
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
        </Box>
        <StepNavigation
          handleBack={handleBack}
          handleNext={handleNext}
          onStepCompletion={onPrimerDesign}
          stepCompletionText="Design primers"
          nextDisabled={primers.length === 0}
          stepCompletionToolTip={submissionPreventedMessage}
          allowStepCompletion={submissionPreventedMessage === ''}
        />
      </TabPanel>
      <TabPanel value={selectedTab} index={templateSequencesIds.length + 1}>
        <PrimerResultList primers={primers} addPrimers={addPrimers} setPrimers={setPrimers} handleBack={handleBack} />
      </TabPanel>

      {error && (<Alert severity="error" sx={{ width: 'fit-content', margin: 'auto', mb: 2 }}>{error}</Alert>)}
    </Box>
  );
}
