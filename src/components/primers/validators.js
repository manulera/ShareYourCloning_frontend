export function stringIsNotDNA(str) {
  return str.match(/[^agct]/i) !== null;
}

export function repeatedPrimerNames(primers) {
  const names = primers.map((p) => p.name);
  const repeatedNames = [];
  let thisName = '';
  while (names.length > 1) {
    thisName = names.shift();
    if (thisName !== '' && names.includes(thisName)) { repeatedNames.push(thisName); }
  }
  return repeatedNames;
}
