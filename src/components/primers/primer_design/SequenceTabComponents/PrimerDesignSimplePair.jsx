import React from 'react';
import { Box, Alert } from '@mui/material';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { getReverseComplementSequenceString as reverseComplement } from '@teselagen/sequence-utils';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from '../../../navigation/TabPanel';
import { usePrimerDesign } from './usePrimerDesign';
import PrimerSettingsForm from './PrimerSettingsForm';
// import PrimerResultList from './PrimerResultList';
import PrimerSpacerForm from './PrimerSpacerForm';
import { stringIsNotDNA } from '../../../../store/cloning_utils';
import { joinEntitiesIntoSingleSequence } from '../../../../utils/sequenceManipulation';
import OrientationPicker from './OrientationPicker';
import usePrimerDesignSettings from './usePrimerDesignSettings';
import PrimerDesignStepper from './PrimerDesignStepper';
import TabPanelSelectRoi from './TabPanelSelectRoi';
import { getSubmissionPreventedMessage } from './utils';
import StepNavigation from './StepNavigation';
import RestrictionSpacerForm from './RestrictionSpacerForm';

function PrimerDesignSimplePair({ pcrSource, restrictionLigation = false }) {
  const templateSequenceId = pcrSource.input[0];
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const sequenceIds = React.useMemo(() => [templateSequenceId], [templateSequenceId]);
  const { primers, error, designPrimers, setPrimers, rois, selectedTab, onTabChange, setSequenceProduct, handleBack, handleNext, handleSelectRegion } = usePrimerDesign('simple_pair', sequenceIds);

  const dispatch = useDispatch();
  const { updateStoreEditor } = useStoreEditor();

  const templateSequenceName = useSelector((state) => state.cloning.entities.find((e) => e.id === templateSequenceId).name);

  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: null, hybridizationLength: 20, targetTm: 55 });
  const [spacers, setSpacers] = React.useState(['', '']);
  const [enzymeSpacers, setEnzymeSpacers] = React.useState(['', '']);
  const [enzymePrimerDesignSettings, setEnzymePrimerDesignSettings] = React.useState({});
  const [amplificationDirection, setAmplificationDirection] = React.useState('forward');

  const store = useStore();

  const spacersAreValid = React.useMemo(() => spacers.every((spacer) => !stringIsNotDNA(spacer)), [spacers]);

  const submissionPreventedMessage = getSubmissionPreventedMessage({ rois, primerDesignSettings, spacers, enzymeSpacers });

  React.useEffect(() => {
    if (submissionPreventedMessage === '') {
      const forwardPrimerStartingSeq = enzymeSpacers[0] + spacers[0];
      const reversePrimerStartingSeq = enzymeSpacers[1] + reverseComplement(spacers[1]);
      const { teselaJsonCache } = store.getState().cloning;
      const templateSequence = teselaJsonCache[templateSequenceId];
      const newSequenceProduct = joinEntitiesIntoSingleSequence([templateSequence], rois.map((s) => s.selectionLayer), [amplificationDirection], [forwardPrimerStartingSeq, reversePrimerStartingSeq], false, 'primer tail');
      newSequenceProduct.name = 'PCR product';
      setSequenceProduct(newSequenceProduct);
    } else {
      setSequenceProduct(null);
    }
  }, [spacers, rois, templateSequenceId, store, setSequenceProduct, amplificationDirection, enzymeSpacers]);

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
    onTabChange(null, 0);
    document.getElementById(`source-${pcrSource.id}`)?.scrollIntoView();
    updateStoreEditor('mainEditor', null);
    updateEditor(store, 'mainEditor', { annotationVisibility: { cutsites: false } });
  };

  const onPrimerDesign = async () => {
    const params = {
      minimal_hybridization_length: primerDesignSettings.hybridizationLength,
      target_tm: primerDesignSettings.targetTm,
      ...enzymePrimerDesignSettings,
    };
    const serverError = await designPrimers(rois, params, [amplificationDirection], spacers);
    if (!serverError) {
      onTabChange(null, 2);
    }
  };

  const steps = React.useMemo(() => [
    { label: 'Amplified region', completed: rois[0] !== null },
    { label: 'Other settings', completed: submissionPreventedMessage === '', disabled: !rois[0] },
    { label: 'Results', completed: primers.length > 0, disabled: primers.length === 0 },
  ], [rois, spacersAreValid, primers, submissionPreventedMessage]);

  return (
    <Box>
      <PrimerDesignStepper
        selectedTab={selectedTab}
        onTabChange={onTabChange}
        steps={steps}
      />
      <TabPanelSelectRoi
        step={steps[0]}
        index={0}
        selectedTab={selectedTab}
        handleSelectRegion={handleSelectRegion}
        handleNext={handleNext}
        handleBack={handleBack}
        templateSequencesIds={sequenceIds}
        rois={rois}
      />
      <TabPanel value={selectedTab} index={1}>
        <Box sx={{ width: '80%', margin: 'auto' }}>
          <PrimerSettingsForm {...primerDesignSettings} />
          {restrictionLigation && <RestrictionSpacerForm setEnzymeSpacers={setEnzymeSpacers} enzymePrimerDesignSettings={enzymePrimerDesignSettings} setEnzymePrimerDesignSettings={setEnzymePrimerDesignSettings} />}

          <PrimerSpacerForm
            spacers={spacers}
            setSpacers={setSpacers}
            fragmentCount={1}
            circularAssembly={false}
            sequenceNames={[templateSequenceName]}
            sequenceIds={[templateSequenceId]}
          />
          <OrientationPicker
            value={amplificationDirection}
            onChange={(e) => setAmplificationDirection(e.target.value)}
            label="Amplification direction"
            index={0}
          />
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
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
      <TabPanel value={selectedTab} index={2}>
        <PrimerResultList primers={primers} addPrimers={addPrimers} setPrimers={setPrimers} handleBack={handleBack} />
      </TabPanel>
    </Box>

  );
}

export default PrimerDesignSimplePair;
