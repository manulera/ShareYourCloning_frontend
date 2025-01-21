import React from 'react';
import HistoryLoadedDialog from './HistoryLoadedDialog';
import useLoadSequenceOrHistoryFile from '../hooks/useLoadSequenceOrHistoryFile';

export default function SequenceOrHistoryFileLoader({ files }) {
  const { loadedContent, setLoadedContent } = useLoadSequenceOrHistoryFile(files);
  if (loadedContent) {
    return <HistoryLoadedDialog loadedContent={loadedContent} setLoadedContent={setLoadedContent} />;
  }
  return null;
}
