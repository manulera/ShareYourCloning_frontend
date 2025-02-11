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
// import PrimerResultList from './PrimerResultList';
import OrientationPicker from './OrientationPicker';
import PrimerSpacerForm from './PrimerSpacerForm';
import usePrimerDesignSettings from './usePrimerDesignSettings';
import StepNavigation from './StepNavigation';
import PrimerDesignStepper from './PrimerDesignStepper';
import { getSubmissionPreventedMessage } from './utils';
import TabPanelSelectRoi from './TabPanelSelectRoi';
import TabPannelSettings from './TabPannelSettings';
import { PrimerDesignProvider } from './PrimerDesignContext';
import TabPanelResults from './TabPanelResults';

function changeValueAtIndex(current, index, newValue) {
  return current.map((_, i) => (i === index ? newValue : current[i]));
}

export default function PrimerDesignGibsonAssembly({ pcrSources }) {
  const templateSequencesIds = React.useMemo(() => pcrSources.map((pcrSource) => pcrSource.input[0]), [pcrSources]);
  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: 35, hybridizationLength: 20, targetTm: 55 });
  const steps = React.useMemo(() => [
    ...templateSequencesIds.map((id, index) => (
      { label: `Seq ${id}`, selectOrientation: true }
    )),
    { label: 'Other settings' },
    { label: 'Results' },
  ], [pcrSources]);

  // const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  // const sequenceIds = React.useMemo(() => pcrSources.map((pcrSource) => pcrSource.input[0]), [pcrSources]);
  // const { primers, error, designPrimers, setPrimers, rois, onTabChange, selectedTab, setSequenceProduct, handleNext, handleBack, handleSelectRegion } = usePrimerDesign('gibson_assembly', sequenceIds);

  // const dispatch = useDispatch();
  // const store = useStore();
  // const { updateStoreEditor } = useStoreEditor();

  // const [fragmentOrientations, setFragmentOrientations] = React.useState(templateSequencesIds.map(() => 'forward'));
  // const [circularAssembly, setCircularAssembly] = React.useState(false);
  // const [spacers, setSpacers] = React.useState(Array(pcrSources.length + 1).fill(''));

  // const submissionPreventedMessage = getSubmissionPreventedMessage({ rois, primerDesignSettings, spacers });
  // React.useEffect(() => {
  //   if (submissionPreventedMessage === '') {
  //     const { teselaJsonCache } = store.getState().cloning;
  //     const templateSequences = templateSequencesIds.map((id) => teselaJsonCache[id]);
  //     const newSequenceProduct = joinEntitiesIntoSingleSequence(templateSequences, rois.map((s) => s.selectionLayer), fragmentOrientations, spacers, circularAssembly);
  //     newSequenceProduct.name = 'Gibson Assembly product';
  //     setSequenceProduct(newSequenceProduct);
  //   } else {
  //     setSequenceProduct(null);
  //   }
  // }, [fragmentOrientations, rois, templateSequencesIds, spacers, circularAssembly, store, setSequenceProduct]);

  // const onCircularAssemblyChange = (event) => {
  //   setCircularAssembly(event.target.checked);
  //   if (event.target.checked) {
  //     // Remove the first spacer
  //     setSpacers((current) => current.slice(1));
  //   } else {
  //     // Add it again
  //     setSpacers((current) => ['', ...current]);
  //   }
  // };

  return (
    <PrimerDesignProvider designType="gibson_assembly" sequenceIds={templateSequencesIds} initialPrimerDesignSettings={primerDesignSettings}>
      <Box>
        <PrimerDesignStepper steps={steps} />
        {steps.slice(0, templateSequencesIds.length).map((step, index) => (
          <TabPanelSelectRoi
            key={step.label}
            step={step}
            index={index}
          />
        ))}
        <TabPannelSettings steps={steps} />
        <TabPanelResults />

        {/* {error && (<Alert severity="error" sx={{ width: 'fit-content', margin: 'auto', mb: 2 }}>{error}</Alert>)} */}
      </Box>
    </PrimerDesignProvider>
  );
}
