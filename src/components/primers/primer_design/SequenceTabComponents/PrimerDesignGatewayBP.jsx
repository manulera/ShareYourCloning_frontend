import { isEqual } from 'lodash-es';
import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Tabs, Tab, Alert, Button, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { parseFeatureLocation } from '@teselagen/bio-parsers';
import { getReverseComplementSequenceString } from '@teselagen/sequence-utils';
import TabPanel from './TabPanel';
import SequenceRoiSelect from './SequenceRoiSelect';
import PrimerSettingsForm from './PrimerSettingsForm';
import PrimerResultList from './PrimerResultList';
import { usePrimerDesign } from './usePrimerDesign';
import usePrimerDesignSettings from './usePrimerDesignSettings';
import { stringIsNotDNA } from '../../../../store/cloning_utils';
import PrimerSpacerForm from './PrimerSpacerForm';

import useGatewaySites from '../../../../hooks/useGatewaySites';
import RetryAlert from '../../../form/RetryAlert';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import OrientationPicker from './OrientationPicker';

const gatewayOverlaps = {
  1: 'tGTACAAAaaa',
  2: 'tGTACAAGaaa',
  3: 'tGTATAATaaa',
  4: 'tGTATAGAaaa',
  5: 'tGTATACAaaa',
};

const knownCombinations = [
  {
    sites: ['attP1', 'attP2'],
    spacers: ['ACAAGTTTGTACAAAAAAGCAGGCTNN', 'ACCACTTTGTACAAGAAAGCTGGGTN'],
    orientation: [true, false],
    message: 'Spacers from pDONR™221',
  },
];

function SiteSelect({ donorSites, site, setSite, label }) {
  return (
    <FormControl sx={{ minWidth: '10em' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={site ? `${site.siteName}-${site.location}` : ''}
        onChange={(e) => setSite(
          donorSites.find(({ siteName, location }) => `${siteName}-${location}` === e.target.value),
        )}
        label={label}
      >
        {donorSites.map(({ siteName, location }) => (
          <MenuItem key={`${siteName}-${location}`} value={`${siteName}-${location}`}>
            {siteName}
            {' '}
            {location}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function simulateGatewayBP(templateSequence, donorVectorSequence, leftSite, rightSite, insertionOrientation, spacers) {
  const leftSiteNumber = leftSite.siteName.slice(-1);
  const rightSiteNumber = rightSite.siteName.slice(-1);
  const leftSiteLocation = parseFeatureLocation(leftSite.location, 0, 0, 0, 1, donorVectorSequence.sequence.length)[0];
  const rightSiteLocation = parseFeatureLocation(rightSite.location, 0, 0, 0, 1, donorVectorSequence.sequence.length)[0];

  return null;
}

function ComponentWrapper({ children, requestStatus, retry, donorSites }) {
  if (requestStatus.status === 'success') {
    if (donorSites.length < 2) {
      return <Alert severity="error">The sequence must have at least two AttP sites</Alert>;
    }
    return children;
  }
  if (requestStatus.status === 'loading') {
    return <div>Loading...</div>;
  }
  if (requestStatus.status === 'error') {
    return <RetryAlert onRetry={retry} sx={{ margin: 'auto', width: '80%', my: 2 }}>{requestStatus.message}</RetryAlert>;
  }
  return null;
}

function PrimerDesignGatewayBP({ donorVectorId, pcrSource, greedy }) {
  const [donorSites, setDonorSites] = React.useState([]);
  const [insertionOrientation, setInsertionOrientation] = React.useState('forward');
  const [spacers, setSpacers] = React.useState(['', '']);
  const [leftSite, setLeftSite] = React.useState(null);
  const [rightSite, setRightSite] = React.useState(null);

  const spacersAreValid = React.useMemo(() => spacers.every((spacer) => !stringIsNotDNA(spacer)), [spacers]);

  const templateSequenceId = pcrSource.input[0];
  const sequenceIds = React.useMemo(() => [templateSequenceId, donorVectorId], [templateSequenceId, donorVectorId]);
  const templateSequenceNames = useSelector((state) => [state.cloning.teselaJsonCache[templateSequenceId].name], isEqual);
  const donorVectorSequence = useSelector((state) => state.cloning.teselaJsonCache[donorVectorId], isEqual);
  const templateSequence = useSelector((state) => state.cloning.teselaJsonCache[templateSequenceId], isEqual);

  const { primers, error, designPrimers, setPrimers, rois, onSelectRegion, setSequenceProduct, onTabChange, selectedTab } = usePrimerDesign('gateway_bp', sequenceIds);
  const primerDesignSettings = usePrimerDesignSettings({ homologyLength: 80, hybridizationLength: 20, targetTm: 55 });
  const { requestStatus, attemptAgain, sites } = useGatewaySites({ target: donorVectorId, greedy });
  const { updateStoreEditor } = useStoreEditor();

  // Update the donor sites when they are loaded
  React.useEffect(() => {
    if (requestStatus.status === 'success') {
      setDonorSites(sites.filter(({ siteName }) => siteName.startsWith('attP')));
    }
  }, [sites]);

  // Update the store editor when the left and right site are selected
  React.useEffect(() => {
    if (leftSite && rightSite) {
      const leftSiteLocation = parseFeatureLocation(leftSite.location, 0, 0, 0, 1, donorVectorSequence.sequence.length)[0];
      const rightSiteLocation = parseFeatureLocation(rightSite.location, 0, 0, 0, 1, donorVectorSequence.sequence.length)[0];
      const selectionLayer = { start: leftSiteLocation.start, end: rightSiteLocation.end };
      updateStoreEditor('mainEditor', null, selectionLayer);
    }
  }, [leftSite, rightSite, donorSites]);

  React.useEffect(() => {
    if (rois[0] !== null && insertionOrientation && spacersAreValid && leftSite && rightSite) {
      const sequenceProduct = simulateGatewayBP(templateSequence, donorVectorSequence, leftSite, rightSite, insertionOrientation, spacers);
      setSequenceProduct(null);
      return;
      sequenceProduct.name = 'Gateway BP product';
      setSequenceProduct(sequenceProduct);
    }
    setSequenceProduct(null);
  }, [insertionOrientation, rois, templateSequence, donorVectorSequence, spacers, leftSite, rightSite]);

  React.useEffect(() => {
    if (leftSite && rightSite) {
      const leftFormatted = { siteName: leftSite.siteName, forward: leftSite.location.includes('(+)') };
      const rightFormatted = { siteName: rightSite.siteName, forward: rightSite.location.includes('(+)') };
      const knownCombination = 
      const knownCombination = knownCombinations.find(({ sites, orientation }) => isEqual(sites[0], leftFormatted) && isEqual(sites[1], rightFormatted) && orientation.includes(insertionOrientation));
      if (knownCombination) {
        setSpacers([knownCombination.fwd, getReverseComplementSequenceString(knownCombination.rvs)]);
      }
    }
  }, [leftSite, rightSite]);

  const onSiteSelectLeft = React.useCallback((site) => {
    setLeftSite(site);
    if (rightSite === null || isEqual(rightSite, site)) {
      // Find the first different one
      const differentSite = donorSites.find(({ location }) => location !== site.location);
      setRightSite(differentSite);
    }
  }, [rightSite, leftSite, donorSites]);

  const onSiteSelectRight = React.useCallback((site) => {
    setRightSite(site);
    if (leftSite === null || isEqual(leftSite, site)) {
      // Find the first different one
      const differentSite = donorSites.find(({ location }) => location !== site.location);
      setLeftSite(differentSite);
    }
  }, [leftSite]);

  console.log(leftSite, rightSite);

  const onPrimerDesign = () => {

  };
  const addPrimers = (primers) => {

  };

  // This should not happen in the normal flow, but it can happen if loading state from a file:

  return (
    <ComponentWrapper requestStatus={requestStatus} retry={attemptAgain} donorSites={donorSites}>
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
          <Box>

            <Box sx={{ my: 2, '& > div': { mx: 1 } }}>
              <SiteSelect donorSites={donorSites} site={leftSite} setSite={onSiteSelectLeft} label="Left AttP site" />
              <SiteSelect donorSites={donorSites} site={rightSite} setSite={onSiteSelectRight} label="Right AttP site" />
            </Box>

          </Box>
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
            open
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
    </ComponentWrapper>
  );
}

export default PrimerDesignGatewayBP;
