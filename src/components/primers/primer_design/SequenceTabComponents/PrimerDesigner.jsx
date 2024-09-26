import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash-es';
import { Button } from '@mui/material';
import { getPrimerDesignObject } from '../../../../store/cloning_utils';
import PrimerDesignHomologousRecombination from './PrimerDesignHomologousRecombination';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import { cloningActions } from '../../../../store/cloning';
import PrimerDesignGibsonAssembly from './PrimerDesignGibsonAssembly';
import PrimerDesignRestrictionLigation from './PrimerDesignRestrictionLigation';

function PrimerDesigner() {
  const { updateStoreEditor } = useStoreEditor();
  const dispatch = useDispatch();
  const { setMainSequenceId, setSelectedTab } = cloningActions;

  const { finalSource, otherInputIds, pcrSources, outputSequences } = useSelector((state) => getPrimerDesignObject(state.cloning), isEqual);
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);

  const templateSequencesIds = pcrSources.map((pcrSource) => pcrSource.input[0]);
  const openPrimerDesigner = () => {
    updateStoreEditor('mainEditor', templateSequencesIds[0]);
    dispatch(setMainSequenceId(templateSequencesIds[0]));
    setSelectedTab(0);
  };

  // Nothing to design
  if (templateSequencesIds.length === 0) {
    return null;
  }

  // The network supports design of primers, but the current main sequence is not part of it
  if (![...templateSequencesIds, ...otherInputIds].includes(mainSequenceId)) {
    return (
      <div>
        <Button sx={{ mb: 4 }} variant="contained" color="success" onClick={openPrimerDesigner}>Open primer designer</Button>
      </div>
    );
  }

  // Check conditions for different types of primer design
  if (finalSource === null && pcrSources.length === 1 && outputSequences[0].primer_design === 'restriction_ligation') {
    return <PrimerDesignRestrictionLigation />;
  }
  if (finalSource?.type === 'GibsonAssemblySource') {
    return <PrimerDesignGibsonAssembly pcrSources={pcrSources} />;
  }
  if (finalSource?.type === 'HomologousRecombinationSource' && otherInputIds.length === 1 && pcrSources.length === 1) {
    return (
      <PrimerDesignHomologousRecombination
        homologousRecombinationTargetId={otherInputIds[0]}
        pcrSource={pcrSources[0]}
      />
    );
  }
}

export default React.memo(PrimerDesigner);
