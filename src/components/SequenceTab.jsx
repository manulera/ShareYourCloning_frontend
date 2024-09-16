import React, { useEffect } from 'react';
import MainSequenceEditor from './MainSequenceEditor';
import PrimerDesigner from './primers/primer_design/PrimerDesigner';
import CreatePrimerDialog from './primers/CreatePrimerDialog';
import { useDispatch } from 'react-redux';

function SequenceTab({ isActive }) {
  const [primerSequence, setPrimerSequence] = React.useState('');
  const [position, setPosition] = React.useState(null);
  const onCreatePrimer = ({ sequence, position: newPos }) => {
    setPrimerSequence(sequence);
    setPosition(newPos);
  };

  useEffect(() => {
    // Add or remove the sequence-active class based on isActive
    if (isActive) {
      document.body.classList.add('sequence-active');
    } else {
      document.body.classList.remove('sequence-active');
    }

    return () => {
      document.body.classList.remove('sequence-active'); // Clean up on unmount
    };
  }, [isActive]);

  return (
    <>
      <PrimerDesigner />
      <MainSequenceEditor onCreatePrimer={onCreatePrimer} />
      {position && <CreatePrimerDialog {...{ primerSequence, setPrimerSequence, position, setPosition }} />}
    </>
  );
}

export default SequenceTab;
