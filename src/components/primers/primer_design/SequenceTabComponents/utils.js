import { stringIsNotDNA } from '../../../../store/cloning_utils';

export function getSubmissionPreventedMessage({ rois, primerDesignSettings, spacers, enzymeSpacers = null, knownCombination = true }) {
  if (rois.some((region) => region === null)) {
    return 'Not all regions have been selected';
  } if (!primerDesignSettings.valid) {
    return 'Primer design settings not valid';
  } if (enzymeSpacers !== null && (enzymeSpacers.some((enzymeSpacer) => stringIsNotDNA(enzymeSpacer)) || enzymeSpacers.every((enzymeSpacer) => enzymeSpacer === ''))) {
    return 'Enzymes not selected or filler sequences not valid';
  } if (spacers.some((spacer) => stringIsNotDNA(spacer))) {
    return 'Spacer sequences not valid';
  } if (!knownCombination) {
    return 'No valid combination of donor sites found';
  }
  return '';
}
