import React from 'react';

function AssemblyPlanDisplayer({
  source,
}) {
  if (!source.assembly) {
    return null;
  }
  const mappedAssembly = source.assembly.map((a) => {
    const { left, right } = a;
    const { sequence: u, location: leftLocation, reverse_complemented: leftRc } = left;
    const { sequence: v, location: rightLocation, reverse_complemented: rightRc } = right;
    const uText = leftRc ? `rc(${u})` : `${u}`;
    const vText = rightRc ? `rc(${v})` : `${v}`;
    const locU = `${leftLocation.start}:${leftLocation.end}`;
    const locV = `${rightLocation.start}:${rightLocation.end}`;
    return `${uText}[${locU}]:${vText}[${locV}]`;
  });

  return (
    <div className="assembly-plan-displayer">
      {mappedAssembly.join(' - ')}
    </div>
  );
}

export default React.memo(AssemblyPlanDisplayer);
