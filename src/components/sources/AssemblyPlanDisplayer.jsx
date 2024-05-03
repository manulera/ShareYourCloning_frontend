import React from 'react';

function AssemblyPlanDisplayer({
  source,
}) {
  if (!['LigationSource', 'GibsonAssemblySource'].includes(source.type)) {
    return null;
  }
  const mappedAssembly = source.assembly.map((a) => {
    const { left_fragment, right_fragment, left_location, right_location } = a;

    const u = source.input[Math.abs(left_fragment) - 1];
    const uText = left_fragment > 0 ? `${u}` : `rc(${u})`;
    const v = source.input[Math.abs(right_fragment) - 1];
    const vText = right_fragment > 0 ? `${v}` : `rc(${v})`;
    const locU = `${left_location.start}:${left_location.end}`;
    const locV = `${right_location.start}:${right_location.end}`;
    return `${uText}[${locU}]:${vText}[${locV}]`;
  });

  return (
    <div className="assembly-plan-displayer">
      {mappedAssembly.join(' - ')}
    </div>
  );
}

export default AssemblyPlanDisplayer;
