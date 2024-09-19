import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

import PrimerDesignHomologousRecombination from './PrimerDesignHomologousRecombination';
import PrimerDesignGibsonAssembly from './PrimerDesignGibsonAssembly';

function PrimerDesignSourceForm({ source }) {
  const [primerDesignType, setPrimerDesignType] = React.useState('');

  return (
    <>
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
          <MenuItem value="gibson_assembly">Gibson Assembly</MenuItem>
        </Select>
      </FormControl>
      {['homologous_recombination', 'crispr'].includes(primerDesignType)
      && (
        <PrimerDesignHomologousRecombination source={source} primerDesignType={primerDesignType} />
      )}
      {primerDesignType === 'gibson_assembly' && (
        <PrimerDesignGibsonAssembly source={source} />
      )}
    </>

  );
}

export default PrimerDesignSourceForm;
