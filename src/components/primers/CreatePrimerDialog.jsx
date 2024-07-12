import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { cloningActions } from '../../store/cloning';
import useStoreEditor from '../../hooks/useStoreEditor';
import CreatePrimerFromSequenceForm from './CreatePrimerFromSequenceForm';
import { getStructuredBases } from '../../utils/getStructuredBases';
import { convertToTeselaJson } from '../../utils/sequenceParsers';
import DraggableDialogPaper from '../DraggableDialogPaper';

function CreatePrimerDialog({ primerSequence, setPrimerSequence, position, setPosition }) {
  const [name, setName] = React.useState('');
  const store = useStore();
  const existingPrimerNames = useSelector((state) => state.cloning.primers.map((p) => p.name), shallowEqual);
  const entity = useSelector((state) => state.cloning.entities.find((e) => e.id === state.cloning.mainSequenceId));
  const { addPrimerAndLinkToEntity } = cloningActions;
  const { updateStoreEditor } = useStoreEditor();
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addPrimerAndLinkToEntity({ primer: { name, sequence: primerSequence }, entityId: entity.id, position }));
    setPrimerSequence('');
    setPosition(null);
    setName('');
    updateStoreEditor('mainEditor', entity.id);
  };

  const { sequence: fullSequence } = convertToTeselaJson(entity);
  // getStructuredBases();

  React.useEffect(() => {
    if (primerSequence && position) {
      const editorState = store.getState().VectorEditor.mainEditor;
      const dummyPrimer = {
        id: 'shareyourcloningDummyPrimer',
        name,
        ...position,
        type: 'primer_bind',
        primerBindsOn: '3prime',
        forward: position.strand === 1,
        bases: primerSequence,
      };
      editorState.sequenceData.primers.shareyourcloningDummyPrimer = dummyPrimer;
      editorState.panelsShown[0].forEach((p) => {
        if (p.id === 'sequence') {
          p.active = true;
        } else { p.active = false; }
      });
      updateEditor(store, 'mainEditor', editorState);
    }
  }, [primerSequence, position]);

  return (
    <Dialog aria-labelledby="draggable-dialog-title" open={primerSequence !== ''} onClose={() => { setPrimerSequence(''); setPosition(null); }} PaperComponent={DraggableDialogPaper}>
      <DialogTitle sx={{ textAlign: 'center', fontSize: 'x-large', cursor: 'move' }}> Create primer </DialogTitle>
      <DialogContent sx={{ minWidth: '600px' }}>
        <form onSubmit={onSubmit}>
          <CreatePrimerFromSequenceForm
            primer={{ name, sequence: primerSequence }}
            setName={setName}
            setSequence={setPrimerSequence}
            existingPrimerNames={existingPrimerNames}
          />
          <div style={{ textAlign: 'center' }}>
            {name && !existingPrimerNames.includes(name) && (
            <Button variant="contained" type="submit">Save primer</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePrimerDialog;
