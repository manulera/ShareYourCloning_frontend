import { Alert, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { batch, useDispatch } from 'react-redux';
import SingleInputSelector from '../../sources/SingleInputSelector';
import { cloningActions } from '../../../store/cloning';
import useStoreEditor from '../../../hooks/useStoreEditor';

function PrimerDesignSourceForm({ source }) {
  const [primerDesignType, setPrimerDesignType] = React.useState('');
  const [target, setTarget] = React.useState('');
  const { updateStoreEditor } = useStoreEditor();
  const { addTemplateChildAndSubsequentSource, setCurrentTab, setMainSequenceId } = cloningActions;
  const dispatch = useDispatch();
  const onSubmit = (event) => {
    event.preventDefault();
    const newSource = {
      input: [Number(target)],
      type: primerDesignType === 'homologous_recombination' ? 'HomologousRecombinationSource' : 'CRISPRSource',
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
          <MenuItem value="crispr">CRISPR</MenuItem>
        </Select>
      </FormControl>
      {['homologous_recombination', 'crispr'].includes(primerDesignType)
      && (
        <>
          <Alert severity="info" icon={false} sx={{ textAlign: 'left' }}>
            <p style={{ marginBottom: 4 }}>
              Use this to design
              {' '}
              <strong>primers with homology arms</strong>
              {' '}
              to amplify a fragment of sequence
              {' '}
              {source.input[0]}
              {' '}
              and insert it into a
              {' '}
              <strong>target sequence</strong>
              {' '}
              via
              {' '}
              {primerDesignType === 'homologous_recombination' ? 'homologous recombination' : 'CRISPR cut + homologous repair'}
              .
            </p>
            <p>
              If you haven&apos;t, import a
              {' '}
              <strong>target sequence</strong>
              , then select it below.
            </p>
          </Alert>
          <FormControl fullWidth>
            <SingleInputSelector
              label="Target sequence"
              selectedId={target}
              onChange={(e) => setTarget(e.target.value)}
              inputEntityIds={[]}
            />
          </FormControl>
        </>
      )}

      {target && (
      <Button type="submit" variant="contained" color="success">
        Design primers
      </Button>
      )}
    </form>
  );
}

export default PrimerDesignSourceForm;
