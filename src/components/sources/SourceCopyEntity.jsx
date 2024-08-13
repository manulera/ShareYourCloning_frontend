import { Button, FormControl } from '@mui/material';
import React from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import SingleInputSelector from './SingleInputSelector';
import { cloningActions } from '../../store/cloning';

function SourceCopyEntity({ source }) {
  const [id, setId] = React.useState(null);
  const { addEmptySource, deleteSourceAndItsChildren } = cloningActions;
  const allEntityIds = useSelector((state) => state.cloning.entities.map((entity) => entity.id), shallowEqual);
  const dispatch = useDispatch();
  const store = useStore();

  const onSubmit = (e) => {
    e.preventDefault();
    // Check if the entity we want to copy is already input of a
    // source in the network, if not we add it twice.
    const { cloning } = store.getState();
    if (!cloning.sources.some((s) => s.input.includes(id))) {
      dispatch(addEmptySource([id]));
    }
    dispatch(addEmptySource([id]));
    dispatch(deleteSourceAndItsChildren(source.id));
  };

  return (
    <form onSubmit={onSubmit}>
      <FormControl fullWidth>
        <SingleInputSelector
          label="Sequence to copy"
          selectedId={id}
          onChange={(e) => setId(e.target.value)}
          inputEntityIds={allEntityIds}
        />
      </FormControl>
      <Button type="submit" variant="contained" style={{ marginTop: 15 }}>Copy sequence</Button>
    </form>
  );
}

export default SourceCopyEntity;
