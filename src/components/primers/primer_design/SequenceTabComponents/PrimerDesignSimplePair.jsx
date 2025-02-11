import * as React from 'react';
import { Box, Tab, Tabs, FormControl, Button, Alert, TextField, Tooltip, FormLabel, FormControlLabel, Checkbox } from '@mui/material';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import InfoIcon from '@mui/icons-material/Info';
import { aliasedEnzymesByName, getReverseComplementSequenceString as reverseComplement } from '@teselagen/sequence-utils';
import { updateEditor } from '@teselagen/ove';
import { cloningActions } from '../../../../store/cloning';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import TabPanel from '../../../navigation/TabPanel';
import { usePrimerDesign } from './usePrimerDesign';
import PrimerSettingsForm from './PrimerSettingsForm';
// import SequenceRoiSelect from './SequenceRoiSelect';
import PrimerResultList from './PrimerResultList';
import PrimerSpacerForm from './PrimerSpacerForm';
import EnzymeMultiSelect from '../../../form/EnzymeMultiSelect';
import { stringIsNotDNA } from '../../../../store/cloning_utils';
import ambiguousDnaBases from '../../../../utils/ambiguous_dna_bases.json';
import { joinEntitiesIntoSingleSequence } from '../../../../utils/sequenceManipulation';
import OrientationPicker from './OrientationPicker';
import usePrimerDesignSettings from './usePrimerDesignSettings';

const enzymeArray = Object.values(aliasedEnzymesByName);

function getRecognitionSequence(enzyme) {
  if (!enzyme) {
    return '';
  }
  const recognitionSeq = enzymeArray.find((e) => e.aliases.includes(enzyme))?.site;
  if (!recognitionSeq) {
    return '????';
  }
  return recognitionSeq.split('').map((base) => (base in ambiguousDnaBases ? ambiguousDnaBases[base] : base)).join('');
}

function isEnzymePalyndromic(enzyme) {
  const recognitionSeq = getRecognitionSequence(enzyme);
  return recognitionSeq === reverseComplement(recognitionSeq);
}

function PrimerDesignSimplePair({ pcrSource, restrictionLigation = false }) {
  const templateSequenceId = pcrSource.input[0];
  const { setMainSequenceId, setCurrentTab, addPrimersToPCRSource } = cloningActions;
  const sequenceIds = React.useMemo(() => [templateSequenceId], [templateSequenceId]);
  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion, selectedTab, onTabChange, setSequenceProduct } = usePrimerDesign('simple_pair', sequenceIds);

  const dispatch = useDispatch();
  const { updateStoreEditor } = useStoreEditor();

  const templateSequenceName = useSelector((state) => state.cloning.entities.find((e) => e.id === templateSequenceId).name);

  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: null, hybridizationLength: 20, targetTm: 55 });
  const [leftEnzyme, setLeftEnzyme] = React.useState(null);
  const [rightEnzyme, setRightEnzyme] = React.useState(null);
  const [leftEnzymeInverted, setLeftEnzymeInverted] = React.useState(false);
  const [rightEnzymeInverted, setRightEnzymeInverted] = React.useState(false);
  const [spacers, setSpacers] = React.useState(['', '']);
  const [fillerBases, setFillerBases] = React.useState('TTT');
  const [amplificationDirection, setAmplificationDirection] = React.useState('forward');

  const store = useStore();

  const spacersAreValid = React.useMemo(() => spacers.every((spacer) => !stringIsNotDNA(spacer)), [spacers]);
  const fillersAreValid = React.useMemo(() => !stringIsNotDNA(fillerBases), [fillerBases]);

  let canSubmit = rois[0] && spacersAreValid;
  if (restrictionLigation) {
    canSubmit = canSubmit && fillersAreValid && (leftEnzyme || rightEnzyme);
  }

  React.useEffect(() => {
    if (rois.every((region) => region !== null) && spacersAreValid && fillersAreValid) {
      const leftEnzymeSeq = leftEnzymeInverted ? reverseComplement(getRecognitionSequence(leftEnzyme)) : getRecognitionSequence(leftEnzyme);
      const rightEnzymeSeq = rightEnzymeInverted ? reverseComplement(getRecognitionSequence(rightEnzyme)) : getRecognitionSequence(rightEnzyme);
      const forwardPrimerStartingSeq = (leftEnzyme ? fillerBases : '') + leftEnzymeSeq + spacers[0];
      const reversePrimerStartingSeq = reverseComplement((rightEnzyme ? fillerBases : '') + rightEnzymeSeq + reverseComplement(spacers[1]));
      const { teselaJsonCache } = store.getState().cloning;
      const templateSequence = teselaJsonCache[templateSequenceId];
      const newSequenceProduct = joinEntitiesIntoSingleSequence([templateSequence], rois.map((s) => s.selectionLayer), [amplificationDirection], [forwardPrimerStartingSeq, reversePrimerStartingSeq], false, 'primer tail');
      newSequenceProduct.name = 'PCR product';
      setSequenceProduct(newSequenceProduct);
    } else {
      setSequenceProduct(null);
    }
  }, [fillerBases, rightEnzyme, leftEnzyme, spacers, rois, spacersAreValid, fillersAreValid, templateSequenceId, store, setSequenceProduct, amplificationDirection, leftEnzymeInverted, rightEnzymeInverted]);

  // When the user changes enzyme, reset the enzyme inversion state
  React.useEffect(() => {
    setLeftEnzymeInverted(false);
  }, [leftEnzyme]);
  React.useEffect(() => {
    setRightEnzymeInverted(false);
  }, [rightEnzyme]);

  // When enzymes change, update the displayed enzymes in the editor
  React.useEffect(() => {
    const allEnzymes = [leftEnzyme, rightEnzyme].filter((enzyme) => enzyme !== null);
    const filteredRestrictionEnzymes = allEnzymes.map((enzyme) => ({
      canBeHidden: true,
      value: enzyme,
    }));
    updateEditor(store, 'mainEditor', { annotationVisibility: { cutsites: leftEnzyme || rightEnzyme }, restrictionEnzymes: { filteredRestrictionEnzymes, isEnzymeFilterAnd: false } });
  }, [leftEnzyme, rightEnzyme]);

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
      left_enzyme: leftEnzyme,
      right_enzyme: rightEnzyme,
      left_enzyme_inverted: leftEnzymeInverted,
      right_enzyme_inverted: rightEnzymeInverted,
      filler_bases: fillerBases,
    };
    const serverError = await designPrimers(rois, params, [amplificationDirection], spacers);
    if (!serverError) {
      onTabChange(null, 2);
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
          <PrimerSettingsForm {...primerDesignSettings} />
          {restrictionLigation && (
            <>
              <FormLabel>Restriction enzyme sites</FormLabel>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <FormControl sx={{ width: '10em', mt: 1.5, mr: 2 }}>
                    <EnzymeMultiSelect value={leftEnzyme} setEnzymes={setLeftEnzyme} label="Left enzyme" multiple={false} />
                  </FormControl>
                  {leftEnzyme && !isEnzymePalyndromic(leftEnzyme) && (
                    <FormControlLabel
                      control={<Checkbox checked={leftEnzymeInverted} onChange={(e) => setLeftEnzymeInverted(e.target.checked)} />}
                      label="Invert site"
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <FormControl sx={{ width: '10em', mt: 1.5, mr: 2 }}>
                    <EnzymeMultiSelect value={rightEnzyme} setEnzymes={setRightEnzyme} label="Right enzyme" multiple={false} />
                  </FormControl>
                  {rightEnzyme && !isEnzymePalyndromic(rightEnzyme) && (
                    <FormControlLabel
                      control={<Checkbox checked={rightEnzymeInverted} onChange={(e) => setRightEnzymeInverted(e.target.checked)} />}
                      label="Invert site"
                    />
                  )}
                </Box>
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
              </Box>
            </>

          )}

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
          {
            canSubmit && (
              <Button variant="contained" onClick={onPrimerDesign} sx={{ marginTop: 2, marginBottom: 2, backgroundColor: 'primary.main' }}>Design primers</Button>
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

export default PrimerDesignSimplePair;
