import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { FormControl } from '@mui/base';
import MultipleInputsSelector from './MultipleInputsSelector';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import EnzymeMultiSelect from '../form/EnzymeMultiSelect';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import { classNameToEndPointMap } from '../../utils/sourceFunctions';

// A component representing the ligation or gibson assembly of several fragments
function SourceAssembly({ source, requestStatus, sendPostRequest }) {
  const assemblyType = source.type;
  const { id: sourceId, input: inputEntityIds } = source;
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const [minimalHomology, setMinimalHomology] = React.useState(20);
  const [allowPartialOverlap, setAllowPartialOverlap] = React.useState(false);
  const [circularOnly, setCircularOnly] = React.useState(false);
  const [bluntLigation, setBluntLigation] = React.useState(false);
  const [enzymes, setEnzymes] = React.useState([]);

  const preventSubmit = (assemblyType === 'RestrictionAndLigationSource' && enzymes.length === 0);

  const flipAllowPartialOverlap = () => {
    setAllowPartialOverlap(!allowPartialOverlap);
    if (!allowPartialOverlap) {
      setBluntLigation(false);
    }
  };

  const flipBluntLigation = () => {
    setBluntLigation(!bluntLigation);
    if (!bluntLigation) {
      setAllowPartialOverlap(false);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source: { id: sourceId, input: inputEntities.map((e) => e.id) },
      sequences: inputEntities,
    };
    if (assemblyType === 'GibsonAssemblySource') {
      const config = { params: {
        minimal_homology: minimalHomology,
        circular_only: circularOnly,
      } };
      sendPostRequest({ endpoint: 'gibson_assembly', requestData, config, source });
    } else if (assemblyType === 'RestrictionAndLigationSource') {
      if (enzymes.length === 0) { return; }
      requestData.source.restriction_enzymes = enzymes;
      const config = { params: {
        allow_partial_overlap: allowPartialOverlap,
        circular_only: circularOnly,
      } };
      sendPostRequest({ endpoint: 'restriction_and_ligation', requestData, config, source });
    } else {
      const config = { params: {
        allow_partial_overlap: allowPartialOverlap,
        circular_only: circularOnly,
        blunt: bluntLigation,
      } };
      sendPostRequest({ endpoint: classNameToEndPointMap[assemblyType], requestData, config, source });
    }
  };

  return (
    <div className="assembly">
      <form onSubmit={onSubmit}>
        <FormControl>
          <MultipleInputsSelector {...{
            inputEntityIds, sourceId, sourceType: assemblyType,
          }}
          />
        </FormControl>
        { (assemblyType === 'GibsonAssemblySource') && (
        // I don't really understand why fullWidth is required here
        <FormControl>
          <TextField
            fullWidth
            label="Minimal homology length (in bp)"
            value={minimalHomology}
            onChange={(e) => { setMinimalHomology(e.target.value); }}
            type="number"
            defaultValue={20}
          />
        </FormControl>
        )}
        { (assemblyType === 'RestrictionAndLigationSource') && (
        <EnzymeMultiSelect setEnzymes={setEnzymes} />
        )}
        { ['RestrictionAndLigationSource', 'GibsonAssemblySource', 'LigationSource'].includes(assemblyType) && (
          <FormControl fullWidth style={{ textAlign: 'left' }}>
            <FormControlLabel control={<Checkbox checked={circularOnly} onChange={() => setCircularOnly(!circularOnly)} />} label="Circular assemblies only" />
          </FormControl>
        )}
        { ['RestrictionAndLigationSource', 'LigationSource'].includes(assemblyType) && (
          <FormControl fullWidth style={{ textAlign: 'left' }}>
            <FormControlLabel control={<Checkbox checked={allowPartialOverlap} onChange={flipAllowPartialOverlap} />} label="Allow partial overlaps" />
          </FormControl>
        )}
        { (assemblyType === 'LigationSource') && (
        <FormControl fullWidth style={{ textAlign: 'left' }}>
          <FormControlLabel control={<Checkbox checked={bluntLigation} onChange={flipBluntLigation} />} label="Blunt ligation" />
        </FormControl>
        )}
        {!preventSubmit && <SubmitButtonBackendAPI requestStatus={requestStatus}>Submit</SubmitButtonBackendAPI>}
      </form>
    </div>
  );
}

export default SourceAssembly;
