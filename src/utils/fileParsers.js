import { stringIsNotDNA } from '../store/cloning_utils';

export const primerFromTsv = async (fileUploaded, existingNames) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const lines = event.target.result.split('\n');
      const headers = lines[0].split('\t');
      
      const requiredHeaders = ['name', 'sequence'];
      const missingHeaders = requiredHeaders.filter(
        header => !headers.includes(header)
      );
      // TODO: Can we differentiate between:
      // - missing headers
      // - headers with wrong names
      // - wring parsing (e.g. csv instead of tsv)
      if (missingHeaders.length > 0) {
        const error = new Error(
          `Could not parse headers: ${missingHeaders.join(', ')}`
        );
        error.missingHeaders = missingHeaders;
        reject(error);
        return;
      }

      const dataLines = lines.slice(1);

      const primersToAdd = dataLines.map((line) => {
        const values = line.split('\t');
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });

        if (existingNames.includes(obj.name)) {
          console.log(`Primer with name ${obj.name} already exists`);
          obj.error = 'existing';
        } else if (stringIsNotDNA(obj.sequence)) {
          console.log(`Primer with name ${obj.name} has invalid sequence`);
          obj.error = 'invalid';
          // This implementation allows to add other errors in the future
          // Error codes can be used later to display different messages
          
          // TODO: Improvement: check for already existing sequences
          // While this is not a problem, it removes data redundancy
        } else {
          console.log(`Adding primer with name ${obj.name}`);
          obj.error = '';
        }

        return obj;
      });
      
      resolve(primersToAdd);
    };

    reader.onerror = () => {
      const error = new Error('Error reading file');
      error.fileError = true;
      reject(error);
    };
    
    reader.readAsText(fileUploaded, 'UTF-8');
  });
};
