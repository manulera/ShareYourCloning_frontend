import { Button, FormControl } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleInputSelector from './SingleInputSelector';
import { cloningActions } from '../../store/cloning';

function SourceCopyEntity({ source }) {
  const [id, setId] = React.useState(null);
  const { addEmptySource } = cloningActions;
  const allEntityIds = useSelector((state) => state.cloning.entities.map((entity) => entity.id));
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addEmptySource([id]));
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
