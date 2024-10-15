import React from 'react';
import primerDesignMinimalValues from './primerDesignMinimalValues.json';

export default function usePrimerDesignSettings({ homologyLength: homol, hybridizationLength: hybl, targetTm: tm }) {
  const [homologyLength, setHomologyLength] = React.useState(homol);
  const [hybridizationLength, setHybridizationLength] = React.useState(hybl);
  const [targetTm, setTargetTm] = React.useState(tm);

  const [valid, setValid] = React.useState(false);

  React.useEffect(() => {
    setHomologyLength(homol);
    setHybridizationLength(hybl);
    setTargetTm(tm);
  }, [homol, hybl, tm]);

  React.useEffect(() => {
    setValid(
      (homologyLength === null || homologyLength >= primerDesignMinimalValues.homology_length)
      && hybridizationLength >= primerDesignMinimalValues.hybridization_length
      && targetTm >= primerDesignMinimalValues.target_tm,
    );
  }, [homologyLength, hybridizationLength, targetTm]);

  return {
    homologyLength,
    setHomologyLength,
    hybridizationLength,
    setHybridizationLength,
    targetTm,
    setTargetTm,
    valid,
  };
}
