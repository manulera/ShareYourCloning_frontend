import React from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createVectorEditor } from '@teselagen/ove';
import { getPrimerDesignObject } from '../../../store/cloning_utils';
import defaultMainEditorProps from '../../../config/defaultMainEditorProps';

function PrimerDesigner() {
  const dispatch = useDispatch();
  const primerDesignObject = useSelector((state) => getPrimerDesignObject(state.cloning), shallowEqual);
  const displayPrimerDesignObject = (typeof primerDesignObject === 'string');
  // For now we just handle the Homologous Recombination case
  const { finalSource, templateSequences, otherInputs } = primerDesignObject;
  const pcrTemplate = displayPrimerDesignObject && templateSequences[0];
  const homologousRecombinationTemplate = displayPrimerDesignObject && otherInputs[0];
  const nodeRef = React.useRef(null);
  React.useEffect(() => {
    const editorProps = {
      sequenceData: pcrTemplate.seq,
      ...defaultMainEditorProps,
    };
    const editorName = `primer-design-template-${pcrTemplate.id}`;
    const editor = createVectorEditor(nodeRef.current, { editorName, height: '800' });
    editor.updateEditor(editorProps);
  }, [pcrTemplate.seq]);

  if (typeof primerDesignObject === 'string') {
    return (
      <div>{primerDesignObject}</div>
    );
  }

  if (finalSource.type !== 'HomologousRecombinationSource') {
    return (
      <div>
        Not implemented yet for
        {' '}
        {finalSource.type}
      </div>
    );
  }

  if (templateSequences.length !== 1 || otherInputs.length !== 1) {
    return (
      <div>
        Only one PCRed sequence and a homologous recombination input should be provided
      </div>
    );
  }

  return (
    <div className="primer-designer">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="amplify-sequence-content"
          id="amplify-sequence-header"
          sx={{ backgroundColor: 'lightgray' }}
        >
          Region from sequence
          {' '}
          {pcrTemplate.id}
          {' '}
          to be amplified
        </AccordionSummary>
        <AccordionDetails>
          <div ref={nodeRef} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="homologous-recombination-content"
          id="homologous-recombination-header"
          sx={{ backgroundColor: 'lightgray' }}
        >
          Region from sequence
          {' '}
          {homologousRecombinationTemplate.id}
          {' '}
          to be replaced via integration of PCR product
        </AccordionSummary>
        <AccordionDetails>
          huehue
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="other-details-content"
          id="other-details-header"
          sx={{ backgroundColor: 'lightgray' }}
        >
          Further settings
        </AccordionSummary>
        <AccordionDetails>
          huehue
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default PrimerDesigner;
