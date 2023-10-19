export function stringIsNotDNA(str) {
  return str.match(/[^agct]/i) !== null;
}

