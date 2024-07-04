import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash-es';
import { getPrimerDesignObject } from '../../../store/cloning_utils';
import PrimerDesignForm from './PrimerDesignForm';

function PrimerDesigner() {
  const primerDesignObject = useSelector((state) => getPrimerDesignObject(state.cloning), isEqual);
  const { finalSource, templateSequencesIds, otherInputIds, pcrSources } = primerDesignObject;
  if (templateSequencesIds.length === 0 || otherInputIds.length === 0 || pcrSources.length === 0) {
    return null;
  }
  return (
    <PrimerDesignForm
      pcrTemplateId={templateSequencesIds && templateSequencesIds[0]}
      homologousRecombinationTargetId={otherInputIds && otherInputIds[0]}
      pcrSource={pcrSources && pcrSources[0]}
    />
  );
}

export default React.memo(PrimerDesigner);
