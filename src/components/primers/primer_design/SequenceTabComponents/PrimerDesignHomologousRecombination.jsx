import React from 'react';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import { isEqual } from 'lodash-es';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from '../../../navigation/TabPanel';
import { usePrimerDesign } from './usePrimerDesign';
import PrimerSettingsForm from './PrimerSettingsForm';
// import PrimerResultList from './PrimerResultList';
import OrientationPicker from './OrientationPicker';
import { simulateHomologousRecombination } from '../../../../utils/sequenceManipulation';
import PrimerSpacerForm from './PrimerSpacerForm';
import usePrimerDesignSettings from './usePrimerDesignSettings';
import PrimerDesignStepper from './PrimerDesignStepper';
import StepNavigation from './StepNavigation';
import { getSubmissionPreventedMessage } from './utils';
import TabPanelSelectRoi from './TabPanelSelectRoi';

export default function PrimerDesignHomologousRecombination({ homologousRecombinationTargetId, pcrSource }) {
  const templateSequenceId = pcrSource.input[0];
  const templateSequenceNames = useSelector((state) => [state.cloning.teselaJsonCache[templateSequenceId].name], isEqual);
  const sequenceIds = React.useMemo(() => [templateSequenceId, homologousRecombinationTargetId], [templateSequenceId, homologousRecombinationTargetId]);
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const { primers, error, designPrimers, setPrimers, rois, setSequenceProduct, onTabChange, selectedTab, handleSelectRegion, handleNext, handleBack } = usePrimerDesign('homologous_recombination', sequenceIds);

  const dispatch = useDispatch();
  const store = useStore();

  const { updateStoreEditor } = useStoreEditor();

  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: 80, hybridizationLength: 20, targetTm: 55 });

  const [insertionOrientation, setInsertionOrientation] = React.useState('forward');
  const [spacers, setSpacers] = React.useState(['', '']);
  const submissionPreventedMessage = getSubmissionPreventedMessage({ rois, primerDesignSettings, spacers });

  React.useEffect(() => {
    if (submissionPreventedMessage === '') {
      const { teselaJsonCache } = store.getState().cloning;
      const templateSequence = teselaJsonCache[templateSequenceId];
      const targetSequence = teselaJsonCache[homologousRecombinationTargetId];
      const sequenceProduct = simulateHomologousRecombination(templateSequence, targetSequence, rois.map((s) => s.selectionLayer), insertionOrientation === 'reverse', spacers);
      sequenceProduct.name = 'Homologous recombination product';
      setSequenceProduct(sequenceProduct);
    } else {
      setSequenceProduct(null);
    }
  }, [insertionOrientation, rois, templateSequenceId, homologousRecombinationTargetId, spacers, store, setSequenceProduct]);

  const addPrimers = () => {
    batch(() => {
      dispatch(addPrimersToPCRSource({ fwdPrimer: primers[0], revPrimer: primers[1], sourceId: pcrSource.id }));
      dispatch(setMainSequenceId(null));
      dispatch(setCurrentTab(0));
    });
    setPrimers([]);
    onTabChange(null, 0);
    document.getElementById(`source-${pcrSource.id}`)?.scrollIntoView();
    updateStoreEditor('mainEditor', null);
  };

  const onPrimerDesign = async () => {
    const params = {
      homology_length: primerDesignSettings.homologyLength,
      minimal_hybridization_length: primerDesignSettings.hybridizationLength,
      target_tm: primerDesignSettings.targetTm,
    };
    const serverError = await designPrimers(rois, params, [insertionOrientation, 'forward'], spacers);
    if (!serverError) {
      onTabChange(null, 3);
    }
  };

  const steps = React.useMemo(() => [
    { label: 'Amplified region',
      completed: rois[0] !== null,
      description: `Select the fragment of sequence ${templateSequenceId} to be amplified in the editor and click "Choose region"`,
      inputLabel: `Amplified region (sequence ${templateSequenceId})` },
    { label: 'Replaced region',
      completed: rois[1] !== null,
      description: 'Select the single position (insertion) or region (replacement) where recombination will introduce the amplified fragment',
      inputLabel: `Replaced region (sequence ${homologousRecombinationTargetId})`,
      allowSinglePosition: true,
    },
    { label: 'Other settings', completed: primers.length > 0, disabled: rois.some((region) => region === null), description: 'Set the primer design settings', inputLabel: 'Primer design settings' },
    { label: 'Results', disabled: primers.length === 0 },
  ], [rois, primers, templateSequenceId, homologousRecombinationTargetId]);

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
            value={insertionOrientation}
            onChange={(e) => setInsertionOrientation(e.target.value)}
            label="Orientation of insert"
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
