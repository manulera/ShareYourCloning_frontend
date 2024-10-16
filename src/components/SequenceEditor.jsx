import React from 'react';
import { SimpleCircularOrLinearView } from '@teselagen/ove';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash-es';
import { convertToTeselaJson } from '../utils/sequenceParsers';
import OverhangsDisplay from './OverhangsDisplay';
import NewSourceBox from './sources/NewSourceBox';
import { cloningActions } from '../store/cloning';
import getTransformCoords from '../utils/transformCoords';
import { getPCRPrimers, getPrimerLinks } from '../store/cloning_utils';

const transformToRegion = (eventOutput) => {
  if (eventOutput.selectionLayer) {
    // When selecting a region
    return { selectionLayer: eventOutput.selectionLayer, caretPosition: -1 };
  }
  // When clicking a feature
  return { selectionLayer: { start: eventOutput.start, end: eventOutput.end }, caretPosition: -1 };
};

function SequenceEditor({ entityId }) {
  const isRootNode = useSelector((state) => !state.cloning.sources.some((source) => source.input.includes(entityId)));
  const editorName = `editor_${entityId}`;
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === entityId), isEqual);
  const linkedPrimers = useSelector(({ cloning }) => getPrimerLinks(cloning, entityId), isEqual);
  const pcrPrimers = useSelector(({ cloning }) => getPCRPrimers(cloning, entityId), isEqual);
  const seq = convertToTeselaJson(entity);
  // Filter out features of type "source"
  seq.features = seq.features.filter((f) => f.type !== 'source');
  seq.primers = [...seq.primers, ...linkedPrimers, ...pcrPrimers];
  const parentSource = useSelector((state) => state.cloning.sources.find((source) => source.output === entityId), isEqual);
  const stateSelectedRegion = useSelector((state) => state.cloning.selectedRegions.find((r) => r.id === entityId)?.selectedRegion, isEqual);
  const parentEntities = useSelector((state) => state.cloning.entities.filter((e) => parentSource.input.includes(e.id)), shallowEqual);
  const [rangeInParent, setRangeInParent] = React.useState(() => null);
  React.useEffect(() => {
    const callBack = getTransformCoords(parentSource, parentEntities, seq.size);
    // Here we have to set the state like this, since it's a function
    // otherwise, react calls the function with the previous state
    setRangeInParent(() => callBack);
  }, [parentSource, parentEntities]);

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
        // We add the current entity to the selectedRegions array
        const selectedRegions = [{ id: entityId, selectedRegion: newRegion }];
        // If possible, add the equivalent region in the parent entity
        parentEntityIds.forEach((id) => {
          const selectionLayerAssembly = rangeInParent(newRegion.selectionLayer, id);
          if (selectionLayerAssembly !== null) {
            selectedRegions.push({ id, selectedRegion: { selectionLayer: selectionLayerAssembly, caretPosition: -1 } });
          }
        });
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
      {/* <SimpleCircularOrLinearView {...{
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
      /> */}
      <OverhangsDisplay {...{ entity }} />
      {addSourceButton}
    </div>
  );
}

export default React.memo(SequenceEditor);
