import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { primersActions } from '../store/primers';
import { stringIsNotDNA } from '../components/primers/validators';

export const primerFromTsv = async (fileUploaded) => {
  const primers = useSelector((state) => state.primers.primers, shallowEqual);
  const dispatch = useDispatch();
  const { addPrimer: addAction } = primersActions;
  const existingNames = primers.map((p) => p.name);

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
  // log something to console
  console.log(primersToAdd);
  return primersToAdd;
};
