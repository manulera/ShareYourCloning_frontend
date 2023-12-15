import React from 'react';

function AssemblyPlanDisplayer({
  source,
}) {
  if (!['sticky_ligation', 'gibson_assembly'].includes(source.type)) {
    return null;
  }
  const mappedAssembly = source.assembly.map((a) => {
    const u = source.input[Math.abs(a[0]) - 1];
    const uText = a[0] > 0 ? `${u}` : `rc(${u})`;
    const v = source.input[Math.abs(a[1]) - 1];
    const vText = a[1] > 0 ? `${v}` : `rc(${v})`;
    const locU = a[2].replace('complement(', '').replace(')', '');
    const locV = a[3].replace('complement(', '').replace(')', '');
    return `${uText}[${locU}] - ${vText}[${locV}]`;
  });

  return (
    <div className="assembly-plan-displayer">
      {mappedAssembly.join(':')}
    </div>
  );
}

export default AssemblyPlanDisplayer;
