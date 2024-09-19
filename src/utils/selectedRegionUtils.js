export function selectedRegion2String(selectedRegion) {
  if (!selectedRegion) {
    // We return a space so that the label of the TextField
    // shows up on top of the TextField
    return ' ';
  }
  const { selectionLayer, caretPosition } = selectedRegion;
  if (caretPosition === -1) {
    return `${selectionLayer.start + 1} - ${selectionLayer.end + 1}`;
  }

  return `insertion at ${caretPosition}`;
}

export function selectedRegion2SequenceLocation({ selectionLayer, caretPosition }) {
  if (caretPosition === -1) {
    return { start: selectionLayer.start, end: selectionLayer.end + 1 };
  }
  return { start: caretPosition, end: caretPosition };
}
