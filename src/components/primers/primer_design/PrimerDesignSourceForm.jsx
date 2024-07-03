import { Alert, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { batch, useDispatch } from 'react-redux';
import SingleInputSelector from '../../sources/SingleInputSelector';
import { cloningActions } from '../../../store/cloning';
import useStoreEditor from '../../../hooks/useStoreEditor';

function PrimerDesignSourceForm({ source }) {
  const [primerDesignType, setPrimerDesignType] = React.useState('');
  const [template, setTemplate] = React.useState('');
  const { updateStoreEditor } = useStoreEditor();
  const { addTemplateChildAndSubsequentSource, setCurrentTab, setMainSequenceId } = cloningActions;
  const dispatch = useDispatch();
  const onSubmit = (event) => {
    event.preventDefault();
    const newSource = {
      input: [Number(template)],
      type: 'HomologousRecombinationSource',
      output: null,
    };
    const newEntity = {
      type: 'TemplateSequence',
      primer_design: true,
      circular: false,
    };

    batch(() => {
      dispatch(addTemplateChildAndSubsequentSource({ newSource, newEntity, sourceId: source.id }));
      dispatch(setMainSequenceId(source.input[0]));
      updateStoreEditor('mainEditor', source.input[0]);
      dispatch(setCurrentTab(3));
      // Scroll to the top of the page
      document.getElementById('shareyourcloning-app-tabs')?.scrollIntoView();
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <FormControl fullWidth>
        <InputLabel id="select-primer-design-type-label">Purpose of primers</InputLabel>
        <Select
          id="select-primer-design-type"
          value={primerDesignType}
          onChange={(event) => setPrimerDesignType(event.target.value)}
          label="Purpose of primers"
        >
          <MenuItem value="homologous_recombination">Homologous Recombination</MenuItem>
        </Select>
      </FormControl>
      <Alert severity="info" icon={false} sx={{ textAlign: 'left' }}>
        <p style={{ marginBottom: 4 }}>
          Use this to design primers to amplify a fragment of sequence
          {' '}
          {source.input[0]}
          {' '}
          and integrate it into another sequence (
          <strong>template sequence</strong>
          )
          via homologous recombination.
        </p>
        <p>
          If you haven&apos;t, import a
          {' '}
          <strong>template sequence</strong>
          , then select it below.
        </p>
      </Alert>
      <FormControl fullWidth>
        <SingleInputSelector
          label="Template sequence"
          selectedId={template}
          onChange={(e) => setTemplate(e.target.value)}
          inputEntityIds={[]}
        />
      </FormControl>
      {template && (
      <Button type="submit" variant="contained" color="success">
        Design primers
      </Button>
      )}
    </form>
  );
}

export default PrimerDesignSourceForm;
