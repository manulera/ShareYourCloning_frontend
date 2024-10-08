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
import { getSequenceName } from '../../../../store/cloning_utils';

export default function PrimerDesignHomologousRecombination({ homologousRecombinationTargetId, pcrSource }) {
  const templateSequenceId = pcrSource.input[0];
  const templateSequenceNames = useSelector((state) => [getSequenceName(state.cloning.entities.find((e) => e.id === templateSequenceId))], isEqual);
  const sequenceIds = React.useMemo(() => [templateSequenceId, homologousRecombinationTargetId], [templateSequenceId, homologousRecombinationTargetId]);
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion, setSequenceProduct, onTabChange, selectedTab } = usePrimerDesign('homologous_recombination', sequenceIds);

  const dispatch = useDispatch();
  const store = useStore();

  const { updateStoreEditor } = useStoreEditor();

  const [homologyLength, setHomologyLength] = React.useState(80);
  const [hybridizationLength, setHybridizationLength] = React.useState(20);
  const [insertionOrientation, setInsertionOrientation] = React.useState('forward');
  const [targetTm, setTargetTm] = React.useState(55);
  const [spacers, setSpacers] = React.useState(['', '']);

  React.useEffect(() => {
    if (rois.every((roi) => roi !== null) && insertionOrientation) {
      const { entities } = store.getState().cloning;
      const templateEntity = entities.find((e) => e.id === templateSequenceId);
      const targetEntity = entities.find((e) => e.id === homologousRecombinationTargetId);
      const sequenceProduct = simulateHomologousRecombination(templateEntity, targetEntity, rois.map((s) => s.selectionLayer), insertionOrientation === 'reverse', spacers);
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
      homology_length: homologyLength,
      minimal_hybridization_length: hybridizationLength,
      target_tm: targetTm,
    };
    const serverError = await designPrimers(rois, params, [insertionOrientation === 'forward', null], spacers);
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
        <PrimerSettingsForm {...{ homologyLength, setHomologyLength, targetTm, setTargetTm, hybridizationLength, setHybridizationLength, insertionOrientation, setInsertionOrientation }} />
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
        { (rois.every((roi) => roi !== null) && insertionOrientation && targetTm && hybridizationLength && homologyLength) && (
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
