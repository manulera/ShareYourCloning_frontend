import React from 'react';
import { SimpleCircularOrLinearView } from '@teselagen/ove';
import { shallowEqual, useSelector } from 'react-redux';
import { convertToTeselaJson } from '../utils/sequenceParsers';
import OverhangsDisplay from './OverhangsDisplay';
import NewSourceBox from './sources/NewSourceBox';

function SequenceEditor({ entityId, isRootNode }) {
  console.log('SequenceEditor', entityId);
  const editorName = `editor_${entityId}`;
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === entityId), shallowEqual);
  const seq = convertToTeselaJson(entity);

  const addSourceButton = !isRootNode ? null : (
    <div className="hang-from-node">
      <div>
        <NewSourceBox {...{ inputEntitiesIds: [entityId] }} />
      </div>
    </div>
  );

  return (
    <div>
      <SimpleCircularOrLinearView {...{ sequenceData: seq, editorName, height: seq.circular ? null : 'auto' }} />
      <OverhangsDisplay {...{ entity }} />
      {addSourceButton}
    </div>
  );
}

export default React.memo(SequenceEditor);
