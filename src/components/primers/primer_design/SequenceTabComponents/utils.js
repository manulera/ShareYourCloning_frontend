export function getSubmissionPreventedMessage(rois, primerDesignSettings, spacersAreValid) {
  if (rois.some((region) => region === null)) {
    return 'Not all regions have been selected';
  } if (!primerDesignSettings.valid) {
    return 'Primer design settings are not valid';
  } if (!spacersAreValid) {
    return 'Spacer sequences are not valid';
  }
  return '';
}
