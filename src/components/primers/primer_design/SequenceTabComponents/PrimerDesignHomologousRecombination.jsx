import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Alert, Button, FormControl } from '@mui/material';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import { isEqual } from 'lodash-es';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from './TabPanel';
import { usePrimerDesign } from './usePrimerDesign';
import SequenceRoiSelect from './SequenceRoiSelect';
import PrimerSettingsForm from './PrimerSettingsForm';
import PrimerResultList from './PrimerResultList';
import OrientationPicker from './OrientationPicker';
import { simulateHomologousRecombination } from '../../../../utils/sequenceManipulation';
import PrimerSpacerForm from './PrimerSpacerForm';
import { stringIsNotDNA } from '../../../../store/cloning_utils';
import usePrimerDesignSettings from './usePrimerDesignSettings';

export default function PrimerDesignHomologousRecombination({ homologousRecombinationTargetId, pcrSource }) {
  const templateSequenceId = pcrSource.input[0];
  const templateSequenceNames = useSelector((state) => [state.cloning.teselaJsonCache[templateSequenceId].name], isEqual);
  const sequenceIds = React.useMemo(() => [templateSequenceId, homologousRecombinationTargetId], [templateSequenceId, homologousRecombinationTargetId]);
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion, setSequenceProduct, onTabChange, selectedTab } = usePrimerDesign('homologous_recombination', sequenceIds);

  const dispatch = useDispatch();
  const store = useStore();

  const { updateStoreEditor } = useStoreEditor();

  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: 80, hybridizationLength: 20, targetTm: 55 });

  const [insertionOrientation, setInsertionOrientation] = React.useState('forward');
  const [spacers, setSpacers] = React.useState(['', '']);
  const spacersAreValid = React.useMemo(() => spacers.every((spacer) => !stringIsNotDNA(spacer)), [spacers]);

  React.useEffect(() => {
    if (rois.every((roi) => roi !== null) && insertionOrientation && spacersAreValid) {
      const { teselaJsonCache } = store.getState().cloning;
      const templateSequence = teselaJsonCache[templateSequenceId];
      const targetSequence = teselaJsonCache[homologousRecombinationTargetId];
      const sequenceProduct = simulateHomologousRecombination(templateSequence, targetSequence, rois.map((s) => s.selectionLayer), insertionOrientation === 'reverse', spacers);
      sequenceProduct.name = 'Homologous recombination product';
      setSequenceProduct(sequenceProduct);
    } else {
      setSequenceProduct(null);
    }
  }, [insertionOrientation, rois, templateSequenceId, homologousRecombinationTargetId, spacers]);

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

  return (

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
        { rois.every((roi) => roi !== null) && insertionOrientation && primerDesignSettings.valid && (
          <FormControl>
            <Button variant="contained" onClick={onPrimerDesign} sx={{ my: 2, backgroundColor: 'primary.main' }}>Design primers</Button>
          </FormControl>
        )}
        {error && (<Alert severity="error" sx={{ width: 'fit-content', margin: 'auto', mb: 2 }}>{error}</Alert>)}

      </TabPanel>
      {primers.length === 2 && (
        <TabPanel value={selectedTab} index={3}>
          <PrimerResultList primers={primers} addPrimers={addPrimers} setPrimers={setPrimers} />
        </TabPanel>
      )}

    </Box>

  );
}
