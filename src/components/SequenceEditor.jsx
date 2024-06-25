import React from 'react';
import { SimpleCircularOrLinearView } from '@teselagen/ove';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { isEqual } from 'lodash-es';
import { convertToTeselaJson } from '../utils/sequenceParsers';
import OverhangsDisplay from './OverhangsDisplay';
import NewSourceBox from './sources/NewSourceBox';
import { cloningActions } from '../store/cloning';

const transformToRegion = (eventOutput) => {
  if (eventOutput.selectionLayer) {
    // When selecting a region
    return { selectionLayer: eventOutput.selectionLayer, caretPosition: -1 };
  }
  // When clicking a feature
  return { selectionLayer: { start: eventOutput.start, end: eventOutput.end }, caretPosition: -1 };
};

function SequenceEditor({ entityId, isRootNode }) {
  const editorName = `editor_${entityId}`;
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === entityId), shallowEqual);
  const seq = convertToTeselaJson(entity);
  const store = useStore();
  const parentSource = useSelector((state) => state.cloning.sources.find((source) => source.output === entityId), isEqual);
  const stateSelectedRegion = useSelector((state) => state.cloning.selectedRegions.find((r) => r.id === entityId)?.selectedRegion, isEqual);

  const { setSelectedRegions } = cloningActions;
  const dispatch = useDispatch();
  const [selectedRegion, setSelectedRegion] = React.useState({ selectionLayer: { start: -1, end: -1 }, caretPosition: -1 });
  const [timeOutId, setTimeOutId] = React.useState(null);

  const { selectionLayer, caretPosition } = selectedRegion;

  React.useEffect(() => {
    if (stateSelectedRegion !== undefined) {
      setSelectedRegion(stateSelectedRegion);
    } else {
      setSelectedRegion({ selectionLayer: { start: -1, end: -1 }, caretPosition: -1 });
    }
  }, [stateSelectedRegion]);

  const updateSelectedRegion = (eventOutput, isCaret) => {
    if (isCaret) {
      // TODO: something here?
    } else {
      const newRegion = transformToRegion(eventOutput);
      const newTimeOutId = setTimeout(() => {
        const parentEntityIds = parentSource.input;
        const { entities } = store.getState().cloning;
        const selectedRegions = parentEntityIds.map((id) => ({ id, selectedRegion: newRegion }));
        selectedRegions.push({ id: entityId, selectedRegion: newRegion });
        dispatch(setSelectedRegions(selectedRegions));
      }, 500);
      setSelectedRegion(newRegion);
      setTimeOutId((prev) => {
        clearTimeout(prev);
        return newTimeOutId;
      });
    }
  };

  const addSourceButton = !isRootNode ? null : (
    <div className="hang-from-node">
      <div>
        <NewSourceBox {...{ inputEntitiesIds: [entityId] }} />
      </div>
    </div>
  );

  return (
    <div>
      <SimpleCircularOrLinearView {...{
        sequenceData: seq,
        editorName,
        height: seq.circular ? null : 'auto',
        withCaretEnabled: true,
        withSelectionEnabled: true,
        selectionLayer,
        selectionLayerUpdate: (a) => updateSelectedRegion(a, false),
        // TODO: this does not work
        caretPosition,
        caretPositionUpdate: (a) => updateSelectedRegion(a, true),
      }}
      />
      <OverhangsDisplay {...{ entity }} />
      {addSourceButton}
    </div>
  );
}

export default React.memo(SequenceEditor);
