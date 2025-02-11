import React from 'react';
import { FormLabel, Box, FormControl, TextField, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { aliasedEnzymesByName, getReverseComplementSequenceString as reverseComplement } from '@teselagen/sequence-utils';
import EnzymeMultiSelect from '../../../form/EnzymeMultiSelect';
import { stringIsNotDNA } from '../../../../store/cloning_utils';
import ambiguousDnaBases from '../../../../utils/ambiguous_dna_bases.json';

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

function RestrictionSpacerForm({ setEnzymeSpacers, enzymePrimerDesignSettings, setEnzymePrimerDesignSettings }) {
  const [leftEnzyme, setLeftEnzyme] = React.useState(null);
  const [rightEnzyme, setRightEnzyme] = React.useState(null);
  const [leftEnzymeInverted, setLeftEnzymeInverted] = React.useState(false);
  const [rightEnzymeInverted, setRightEnzymeInverted] = React.useState(false);
  const [fillerBases, setFillerBases] = React.useState('TTT');
  const [checkUpdated, setCheckUpdated] = React.useState(false);
  const store = useStore();

  const updateUpstreamStateMaybe = () => {
    if ((leftEnzyme || rightEnzyme) && !stringIsNotDNA(fillerBases)) {
      const leftEnzymeSeq = leftEnzymeInverted ? reverseComplement(getRecognitionSequence(leftEnzyme)) : getRecognitionSequence(leftEnzyme);
      const rightEnzymeSeq = rightEnzymeInverted ? reverseComplement(getRecognitionSequence(rightEnzyme)) : getRecognitionSequence(rightEnzyme);
      const forwardPrimerStartingSeq = (leftEnzyme ? fillerBases : '') + leftEnzymeSeq;
      const reversePrimerStartingSeq = reverseComplement((rightEnzyme ? fillerBases : '') + rightEnzymeSeq);
      setEnzymeSpacers([forwardPrimerStartingSeq, reversePrimerStartingSeq]);
      setEnzymePrimerDesignSettings({
        left_enzyme: leftEnzyme,
        right_enzyme: rightEnzyme,
        left_enzyme_inverted: leftEnzymeInverted,
        right_enzyme_inverted: rightEnzymeInverted,
        filler_bases: fillerBases,
      });
    } else {
      setEnzymeSpacers(['', '']);
      setEnzymePrimerDesignSettings({});
    }
  };

  React.useEffect(() => {
    updateUpstreamStateMaybe();
  }, [checkUpdated]);

  const handleLeftEnzymeChange = (enzyme) => {
    setLeftEnzyme(enzyme);
    setLeftEnzymeInverted(false);
    setCheckUpdated((prev) => !prev);
  };

  const handleRightEnzymeChange = (enzyme) => {
    setRightEnzyme(enzyme);
    setRightEnzymeInverted(false);
    setCheckUpdated((prev) => !prev);
  };

  const handleLeftEnzymeInversionChange = (inverted) => {
    setLeftEnzymeInverted(inverted);
    setCheckUpdated((prev) => !prev);
  };

  const handleRightEnzymeInversionChange = (inverted) => {
    setRightEnzymeInverted(inverted);
    setCheckUpdated((prev) => !prev);
  };

  const handleFillerBasesChange = (e) => {
    setFillerBases(e.target.value);
    setCheckUpdated((prev) => !prev);
  };

  React.useEffect(() => {
    if (enzymePrimerDesignSettings && Object.keys(enzymePrimerDesignSettings).length) {
      setLeftEnzyme(enzymePrimerDesignSettings.left_enzyme);
      setRightEnzyme(enzymePrimerDesignSettings.right_enzyme);
      setLeftEnzymeInverted(enzymePrimerDesignSettings.left_enzyme_inverted);
      setRightEnzymeInverted(enzymePrimerDesignSettings.right_enzyme_inverted);
      setFillerBases(enzymePrimerDesignSettings.filler_bases);
    } else {
      setEnzymeSpacers(['', '']);
    }
  }, [enzymePrimerDesignSettings]);

  // When enzymes change, update the displayed enzymes in the editor
  React.useEffect(() => {
    const allEnzymes = [leftEnzyme, rightEnzyme].filter((enzyme) => enzyme !== null);
    const filteredRestrictionEnzymes = allEnzymes.map((enzyme) => ({
      canBeHidden: true,
      value: enzyme,
    }));
    updateEditor(store, 'mainEditor', { annotationVisibility: { cutsites: leftEnzyme || rightEnzyme }, restrictionEnzymes: { filteredRestrictionEnzymes, isEnzymeFilterAnd: false } });
  }, [leftEnzyme, rightEnzyme]);

  return (
    <>
      <FormLabel>Restriction enzyme sites</FormLabel>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl sx={{ width: '10em', mt: 1.5, mr: 2 }}>
            <EnzymeMultiSelect value={leftEnzyme} setEnzymes={handleLeftEnzymeChange} label="Left enzyme" multiple={false} />
          </FormControl>
          {leftEnzyme && !isEnzymePalyndromic(leftEnzyme) && (
          <FormControlLabel
            control={<Checkbox checked={leftEnzymeInverted} onChange={(e) => handleLeftEnzymeInversionChange(e.target.checked)} />}
            label="Invert site"
          />
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl sx={{ width: '10em', mt: 1.5, mr: 2 }}>
            <EnzymeMultiSelect value={rightEnzyme} setEnzymes={handleRightEnzymeChange} label="Right enzyme" multiple={false} />
          </FormControl>
          {rightEnzyme && !isEnzymePalyndromic(rightEnzyme) && (
          <FormControlLabel
            control={<Checkbox checked={rightEnzymeInverted} onChange={(e) => handleRightEnzymeInversionChange(e.target.checked)} />}
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
            onChange={handleFillerBasesChange}
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
  );
}

export default RestrictionSpacerForm;
