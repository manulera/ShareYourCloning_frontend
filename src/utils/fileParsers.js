import { stringIsNotDNA } from '../store/cloning_utils';

export const primerFromTsv = async (fileUploaded, existingNames) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const lines = event.target.result.split('\n');
      const headers = lines[0].split('\t');

      const requiredHeaders = ['name', 'sequence'];
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header),
      );

      // The number of tabs on headers and all lines should be > 1 and the same
      if (headers.length < 2) {
        const error = new Error('Headers should have at least 2 columns');
        reject(error);
        return;
      }

      // All lines should have the same number of tabs
      if (lines.some((line) => line.split('\t').length !== headers.length)) {
        const error = new Error('All lines should have the same number of columns');
        reject(error);
        return;
      }

      // Required headers should be present
      if (missingHeaders.length > 0) {
        const error = new Error(`Headers missing: ${missingHeaders.join(', ')}`);
        reject(error);
        return;
      }

      const primersToAdd = lines.slice(1).map((line) => {
        const values = line.split('\t');
        const obj = { error: '' };
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });

        if (existingNames.includes(obj.name)) {
          obj.error = 'existing';
        } else if (stringIsNotDNA(obj.sequence)) {
          obj.error = 'invalid';
          // TODO: Improvement: check for already existing sequences
          // While this is not a problem, it removes data redundancy
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
