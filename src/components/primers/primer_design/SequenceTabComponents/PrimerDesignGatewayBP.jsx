import { isEqual } from 'lodash-es';
import React from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Box, Alert } from '@mui/material';

import TabPanel from './TabPanel';
import PrimerSettingsForm from './PrimerSettingsForm';
import PrimerResultList from './PrimerResultList';
import { usePrimerDesign } from './usePrimerDesign';
import usePrimerDesignSettings from './usePrimerDesignSettings';
import PrimerSpacerForm from './PrimerSpacerForm';

import useStoreEditor from '../../../../hooks/useStoreEditor';
import OrientationPicker from './OrientationPicker';
import { joinEntitiesIntoSingleSequence } from '../../../../utils/sequenceManipulation';
import { cloningActions } from '../../../../store/cloning';
import PrimerDesignStepper from './PrimerDesignStepper';
import TabPanelSelectRoi from './TabPanelSelectRoi';
import StepNavigation from './StepNavigation';
import { getSubmissionPreventedMessage } from './utils';

const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;

function PrimerDesignGatewayBP({ donorVectorId, pcrSource }) {
  const [amplificationOrientation, setAmplificationOrientation] = React.useState('forward');
  const [knownCombination, setKnownCombination] = React.useState(null);
  const [spacers, setSpacers] = React.useState(['', '']);

  const templateSequenceId = pcrSource.input[0];
  const sequenceIds = React.useMemo(() => [templateSequenceId, donorVectorId], [templateSequenceId, donorVectorId]);
  const templateSequenceNames = useSelector((state) => [state.cloning.teselaJsonCache[templateSequenceId].name], isEqual);
  const templateSequence = useSelector((state) => state.cloning.teselaJsonCache[templateSequenceId], isEqual);

  const { primers, error, designPrimers, setPrimers, rois, setSequenceProduct, onTabChange, selectedTab, handleSelectRegion, handleBack, handleNext } = usePrimerDesign('simple_pair', sequenceIds);
  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: null, hybridizationLength: 20, targetTm: 55 });

  const { updateStoreEditor } = useStoreEditor();
  const dispatch = useDispatch();

  const handleKnownCombinationChange = (newKnownCombination) => {
    setKnownCombination(newKnownCombination);
    if (newKnownCombination) {
      setSpacers(newKnownCombination.spacers);
    }
  };

  const submissionPreventedMessage = getSubmissionPreventedMessage({ rois, primerDesignSettings, spacers, knownCombination });

  React.useEffect(() => {
    if (submissionPreventedMessage === '') {
      const newSequenceProduct = joinEntitiesIntoSingleSequence([templateSequence], [rois[0].selectionLayer], [amplificationOrientation], [spacers[0], spacers[1]], false, 'primer tail');
      newSequenceProduct.name = 'PCR product';
      const leftFeature = {
        start: knownCombination.translationFrame[0],
        end: spacers[0].length - 1,
        type: 'CDS',
        name: 'translation frame',
        strand: 1,
        forward: true,
      };
      const nbAas = Math.floor((spacers[1].length - knownCombination.translationFrame[1]) / 3);
      const rightStart = newSequenceProduct.sequence.length - knownCombination.translationFrame[1] - nbAas * 3;
      const rightFeature = {
        start: rightStart,
        end: newSequenceProduct.sequence.length - knownCombination.translationFrame[1] - 1,
        type: 'CDS',
        name: 'translation frame',
        strand: 1,
        forward: true,
      };
      newSequenceProduct.features.push(leftFeature);
      newSequenceProduct.features.push(rightFeature);
      setSequenceProduct(newSequenceProduct);
      return;
    }
    setSequenceProduct(null);
  }, [amplificationOrientation, rois, templateSequence, spacers, knownCombination]);

  const onPrimerDesign = async () => {
    const params = {
      minimal_hybridization_length: primerDesignSettings.hybridizationLength,
      target_tm: primerDesignSettings.targetTm,
    };
    const serverError = await designPrimers(rois, params, [amplificationOrientation], spacers);
    if (!serverError) {
      onTabChange(null, 3);
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
    onTabChange(null, 0);
    document.getElementById(`source-${pcrSource.id}`)?.scrollIntoView();
    updateStoreEditor('mainEditor', null);
  };
  const steps = React.useMemo(() => [
    {
      label: 'Amplified region',
      completed: rois[0] !== null,
    },
    {
      label: 'Replaced region',
      completed: rois[1] !== null,
      mode: 'gateway',
      knownCombination,
      handleKnownCombinationChange,
    },
    { label: 'Other settings', disabled: rois.some((region) => region === null), completed: primers.length > 0 },
    { label: 'Results', disabled: primers.length === 0 },
  ], [rois, primers.length, knownCombination]);

  return (
    <Box>
      <PrimerDesignStepper
        selectedTab={selectedTab}
        steps={steps}
        onTabChange={onTabChange}
      />
      {steps.slice(0, 2).map((step, index) => (
        <TabPanelSelectRoi
          key={step.label}
          step={step}
          index={index}
          selectedTab={selectedTab}
          handleSelectRegion={handleSelectRegion}
          handleBack={handleBack}
          handleNext={handleNext}
          templateSequencesIds={sequenceIds}
          rois={rois}
        />
      ))}
      <TabPanel value={selectedTab} index={2}>
        <PrimerSettingsForm {...primerDesignSettings} />
        <Box sx={{ pt: 2 }}>
          <OrientationPicker
            value={amplificationOrientation}
            onChange={(e) => setAmplificationOrientation(e.target.value)}
            label="Amplification orientation"
            index={0}
          />
        </Box>
        <PrimerSpacerForm
          spacers={spacers}
          setSpacers={setSpacers}
          fragmentCount={1}
          circularAssembly={false}
          sequenceNames={templateSequenceNames}
          sequenceIds={pcrSource.input}
          open
        />

        <StepNavigation
          handleBack={handleBack}
          handleNext={handleNext}
          onStepCompletion={onPrimerDesign}
          stepCompletionText="Design primers"
          nextDisabled={primers.length === 0}
          stepCompletionToolTip={submissionPreventedMessage}
          allowStepCompletion={submissionPreventedMessage === ''}
        />
        {error && (<Alert severity="error" sx={{ width: 'fit-content', margin: 'auto', mb: 2 }}>{error}</Alert>)}

      </TabPanel>

      <TabPanel value={selectedTab} index={3}>
        <PrimerResultList primers={primers} addPrimers={addPrimers} setPrimers={setPrimers} handleBack={handleBack} />
      </TabPanel>

    </Box>
  );
}

export default PrimerDesignGatewayBP;
