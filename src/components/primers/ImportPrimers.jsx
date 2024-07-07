import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { primersActions } from '../../store/primers';
import { stringIsNotDNA } from './validators';

//TODO: refactor handleChange to use functionb primerFromTsv and avoid repetition
//import { primerFromTsv } from '../../utils/fileParsers';

function ImportPrimersButton() {
  const primers = useSelector((state) => state.primers.primers, shallowEqual);
  const dispatch = useDispatch();
  const { addPrimer: addAction } = primersActions;
  const existingNames = primers.map((p) => p.name);
  
  // Ref to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  const fileUploaded = null;
  
  // Function to simulate click on hidden file input
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  
  // Function to handle file selection
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);

    // Parse tsv file to JSON
    const reader = new FileReader();
    reader.readAsText(fileUploaded, 'UTF-8');

    reader.onload = (event) => {
      const lines = event.target.result.split('\n')
      const headers = lines[0].split('\t');
      const dataLines = lines.slice(1);

      const primersToAdd = dataLines.map((line) => {
        const values = line.split('\t');
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        // TODO: allow user to correct oligos
        //  - Automatically open the form with the data filled
        //  - (or) export tsv file with wrong oligos
        if (existingNames.includes(obj.name)) {
          console.log(`Primer with name ${obj.name} already exists`);
        } else if (stringIsNotDNA(obj.sequence)) {
          console.log(`Primer with name ${obj.name} has invalid sequence`);
          return null;
        }

        dispatch(addAction(obj));
        return obj;
      });
    };
    };
  
  return (
    <div>
      <Button
        onClick={handleClick}
        variant="contained"
        size="small"
      >Upload File
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}} // Hide the file input
      />
    </div>
  );
}

export default ImportPrimersButton;
