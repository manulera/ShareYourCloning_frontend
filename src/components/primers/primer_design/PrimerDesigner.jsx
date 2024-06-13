import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash-es';
import { getPrimerDesignObject } from '../../../store/cloning_utils';
import PrimerDesignForm from './PrimerDesignForm';

function PrimerDesigner({ selectedRegion }) {
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const primerDesignObject = useSelector((state) => getPrimerDesignObject(state.cloning), isEqual);
  const { finalSource, templateSequencesIds, otherInputIds } = primerDesignObject;
  if (templateSequencesIds.length === 0 || otherInputIds.length === 0) {
    return null;
  }
  return (
    <PrimerDesignForm
      selectedRegion={selectedRegion}
      pcrTemplateId={templateSequencesIds && templateSequencesIds[0]}
      homologousRecombinationTargetId={otherInputIds && otherInputIds[0]}
      mainSequenceId={mainSequenceId}
    />
  );
}

export default React.memo(PrimerDesigner);
