import * as React from 'react';
import { Box, Tab, Tabs, FormControl, FormLabel, Button, Alert, TextField, Tooltip } from '@mui/material';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import InfoIcon from '@mui/icons-material/Info';
import { aliasedEnzymesByName, getReverseComplementSequenceString as reverseComplement } from '@teselagen/sequence-utils';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from '../../../navigation/TabPanel';
import { usePrimerDesign } from './usePrimerDesign';
import PrimerSettingsForm from './PrimerSettingsForm';
import SequenceRoiSelect from './SequenceRoiSelect';
import PrimerResultList from './PrimerResultList';
import PrimerSpacerForm from './PrimerSpacerForm';
import EnzymeMultiSelect from '../../../form/EnzymeMultiSelect';
import { stringIsNotDNA } from '../../../../store/cloning_utils';
import ambiguousDnaBases from '../../../../utils/ambiguous_dna_bases.json';
import { joinEntitiesIntoSingleSequence } from '../../../../utils/sequenceManipulation';

const enzymeArray = Object.values(aliasedEnzymesByName);

function getRecognitionSequence(enzyme) {
  if (!enzyme) {
    return '';
  }
  const recogSeq = enzymeArray.find((e) => e.aliases.includes(enzyme))?.site;
  if (!recogSeq) {
    return '????';
  }
  return recogSeq.split('').map((base) => (base in ambiguousDnaBases ? ambiguousDnaBases[base] : base)).join('');
}

function PrimerDesignRestrictionLigation({ pcrSource }) {
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion } = usePrimerDesign('restriction_ligation', 1);

  const dispatch = useDispatch();
  const { updateStoreEditor } = useStoreEditor();

  const templateSequenceId = pcrSource.input[0];
  const templateSequenceName = useSelector((state) => state.cloning.entities.find((e) => e.id === templateSequenceId).name);

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [hybridizationLength, setHybridizationLength] = React.useState(20);
  const [targetTm, setTargetTm] = React.useState(55);
  const [leftEnzyme, setLeftEnzyme] = React.useState(null);
  const [rightEnzyme, setRightEnzyme] = React.useState(null);
  const [spacers, setSpacers] = React.useState(['', '']);
  const [fillerBases, setFillerBases] = React.useState('TTT');
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);

  const store = useStore();

  React.useEffect(() => {
    if (templateSequenceId === mainSequenceId) {
      setSelectedTab(0);
    }
  }, [templateSequenceId, mainSequenceId]);

  const forwardPrimerStartingSeq = (leftEnzyme ? fillerBases : '') + getRecognitionSequence(leftEnzyme) + spacers[0];
  const reversePrimerStartingSeq = (rightEnzyme ? fillerBases : '') + reverseComplement(getRecognitionSequence(rightEnzyme)) + reverseComplement(spacers[1]);
  const spacersAreValid = React.useMemo(() => spacers.every((spacer) => !stringIsNotDNA(spacer)), [spacers]);
  const startingSequencesAreValid = React.useMemo(() => !stringIsNotDNA(forwardPrimerStartingSeq) && !stringIsNotDNA(reversePrimerStartingSeq), [forwardPrimerStartingSeq, reversePrimerStartingSeq]);

  const sequenceProduct = React.useMemo(() => {
    if (rois.every((region) => region !== null) && startingSequencesAreValid) {
      const templateEntity = store.getState().cloning.entities.find((e) => e.id === templateSequenceId);

      return joinEntitiesIntoSingleSequence([templateEntity], rois.map((s) => s.selectionLayer), ['forward'], [forwardPrimerStartingSeq, reversePrimerStartingSeq], false);
    }
    return null;
  }, [forwardPrimerStartingSeq, reversePrimerStartingSeq, rois]);

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
      left_enzyme: leftEnzyme,
      right_enzyme: rightEnzyme,
      filler_bases: fillerBases,
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
            <Box>
              <FormControl sx={{ width: '10em', mt: 1.5, mr: 2 }}>
                <EnzymeMultiSelect value={leftEnzyme} setEnzymes={setLeftEnzyme} label="Left enzyme" multiple={false} />
              </FormControl>
              <FormControl sx={{ width: '10em', mt: 1.5, mr: 2 }}>
                <EnzymeMultiSelect value={rightEnzyme} setEnzymes={setRightEnzyme} label="Right enzyme" multiple={false} />
              </FormControl>
              <FormControl sx={{ width: '10em', mt: 1.5 }}>
                <TextField
                  label={(
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      5&apos; filler bases
                      <Tooltip arrow placement="top" title="These bases are added to the 5&apos; end of the primer to ensure proper restriction enzyme digestion.">
                        <InfoIcon sx={{ fontSize: '1.2em', ml: 0.5 }} />
                      </Tooltip>
                    </Box>
                  )}
                  value={fillerBases}
                  onChange={(e) => setFillerBases(e.target.value)}
                  variant="outlined"
                  inputProps={{
                    id: 'sequence',
                  }}
                  error={stringIsNotDNA(fillerBases)}
                  helperText={stringIsNotDNA(fillerBases) ? 'Invalid DNA sequence' : ''}
                />
              </FormControl>
              { forwardPrimerStartingSeq && (
              <Box>
                Forward primer starting sequence:
                {forwardPrimerStartingSeq}
              </Box>
              ) }
              { reversePrimerStartingSeq && (
              <Box>
                Reverse primer starting sequence:
                {reversePrimerStartingSeq}
              </Box>
              ) }
            </Box>
          </Box>

          <PrimerSpacerForm
            spacers={spacers}
            setSpacers={setSpacers}
            fragmentCount={1}
            circularAssembly={false}
            sequenceNames={[templateSequenceName]}
            sequenceIds={[templateSequenceId]}
          />
          {
            (leftEnzyme || rightEnzyme) && rois[0] && spacersAreValid && (
              <Button variant="contained" onClick={onPrimerDesign} sx={{ marginTop: 2, marginBottom: 2, backgroundColor: 'primary.main' }}>Design Primers</Button>
            )
          }
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        {primers.length > 0 && (
          <PrimerResultList primers={primers} addPrimers={addPrimers} setPrimers={setPrimers} />
        )}
      </TabPanel>
    </Box>

  );
}

export default PrimerDesignRestrictionLigation;
