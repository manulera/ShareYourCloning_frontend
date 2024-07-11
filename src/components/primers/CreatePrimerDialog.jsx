import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PrimerResultForm from './primer_design/PrimerResultForm';
import { cloningActions } from '../../store/cloning';
import useStoreEditor from '../../hooks/useStoreEditor';

function CreatePrimerDialog({ primerSequence, setPrimerSequence, position }) {
  const [name, setName] = React.useState('');
  const existingPrimerNames = useSelector((state) => state.cloning.primers.map((p) => p.name), shallowEqual);
  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);
  const { addPrimerAndLinkToEntity } = cloningActions;
  const { updateStoreEditor } = useStoreEditor();
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addPrimerAndLinkToEntity({ primer: { name, sequence: primerSequence }, entityId: mainSequenceId, position }));
    setPrimerSequence('');
    setName('');
    updateStoreEditor('mainEditor', mainSequenceId);
  };

  return (
    <Dialog open={primerSequence !== ''} onClose={() => setPrimerSequence('')} className="load-example-dialog">
      <DialogTitle sx={{ textAlign: 'center', fontSize: 'x-large' }}> Create primer </DialogTitle>
      <DialogContent sx={{ minWidth: '600px' }}>
        <form onSubmit={onSubmit}>
          <PrimerResultForm
            primer={{ name, sequence: primerSequence }}
            updatePrimerName={setName}
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
