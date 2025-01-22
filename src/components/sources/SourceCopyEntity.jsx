import { Button, FormControl } from '@mui/material';
import React from 'react';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import SingleInputSelector from './SingleInputSelector';
import { copyEntityThunk } from '../../utils/thunks';
import { cloningActions } from '../../store/cloning';

const { deleteSourceAndItsChildren } = cloningActions;

function SourceCopyEntity({ source }) {
  const [id, setId] = React.useState(null);
  const allEntityIds = useSelector((state) => state.cloning.entities.map((entity) => entity.id), shallowEqual);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    batch(() => {
      dispatch(deleteSourceAndItsChildren(source.id));
      dispatch(copyEntityThunk(id, source.id));
    });
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
