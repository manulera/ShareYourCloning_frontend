import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash-es';
import SourceFile from './SourceFile';
import SourceRepositoryId from './SourceRepositoryId';
import SourceRestriction from './SourceRestriction';
import SourceAssembly from './SourceAssembly';
import SourceTypeSelector from './SourceTypeSelector';
import SourceBox from './SourceBox';
import SourcePCRorHybridization from './SourcePCRorHybridization';
import SourceHomologousRecombination from './SourceHomologousRecombination';
import SourceGenomeRegion from './SourceGenomeRegion';
import SourceManuallyTyped from './SourceManuallyTyped';
import ELabFTWSource from './ELabFTWSource';
import SourcePolymeraseExtension from './SourcePolymeraseExtension';
import CollectionSource from './CollectionSource';
import KnownSourceErrors from './KnownSourceErrors';
import useBackendAPI from '../../hooks/useBackendAPI';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import { cloningActions } from '../../store/cloning';

// There are several types of source, this components holds the common part,
// which for now is a select element to pick which kind of source is created
function Source({ source }) {
  const { id: sourceId, type: sourceType } = source;
  let specificSource = null;
  const templateOnlySources = ['CollectionSource'];
  const knownErrors = useSelector((state) => state.cloning.knownErrors, isEqual);
  const { requestStatus, sendPostRequest, sources, entities } = useBackendAPI();
  const { addEntityAndUpdateItsSource, updateEntityAndItsSource } = cloningActions;
  const [chosenFragment, setChosenFragment] = React.useState(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    // If there is only a single product, commit the result, else allow choosing via MultipleOutputsSelector
    const dispatchedAction = source.output === null ? addEntityAndUpdateItsSource : updateEntityAndItsSource;
    if (sources.length === 1) {
      dispatch(dispatchedAction({ newSource: { ...sources[0], id: sourceId }, newEntity: entities[0] }));
    } else if (chosenFragment !== null) {
      dispatch(dispatchedAction({ newSource: { ...sources[chosenFragment], id: sourceId }, newEntity: entities[chosenFragment] }));
    }
  }, [sources, entities, chosenFragment]);

  switch (sourceType) {
    /* eslint-disable */
    case 'UploadedFileSource':
      specificSource = <SourceFile {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'RestrictionEnzymeDigestionSource':
      specificSource = <SourceRestriction {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'RepositoryIdSource':
      specificSource = <SourceRepositoryId {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'AddGeneIdSource':
      specificSource = <SourceRepositoryId {...{ source, requestStatus, sendPostRequest, initialSelectedRepository: 'addgene' }} />; break;
    case 'LigationSource':
      specificSource = <SourceAssembly {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'GibsonAssemblySource':
      specificSource = <SourceAssembly {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'HomologousRecombinationSource':
      specificSource = <SourceHomologousRecombination {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'PCRSource':
      specificSource = <SourcePCRorHybridization {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'RestrictionAndLigationSource':
      specificSource = <SourceAssembly {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'GenomeCoordinatesSource':
      specificSource = <SourceGenomeRegion {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'ManuallyTypedSource':
      specificSource = <SourceManuallyTyped {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'CRISPRSource':
      specificSource = <SourceHomologousRecombination {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'OligoHybridizationSource':
      specificSource = <SourcePCRorHybridization {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'PolymeraseExtensionSource':
      specificSource = <SourcePolymeraseExtension {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'elabftw':
      specificSource = <ELabFTWSource {...{ source, requestStatus, sendPostRequest }} />; break;
    case 'CollectionSource':
      specificSource = <CollectionSource {...{ source, requestStatus, sendPostRequest }} />; break;
    default:
      break;
    /* eslint-enable */
  }

  return (
    <SourceBox {...{ sourceId }}>
      {!templateOnlySources.includes(sourceType) && (<SourceTypeSelector {...{ source }} />)}
      {sourceType && knownErrors[sourceType] && <KnownSourceErrors errors={knownErrors[sourceType]} />}
      {specificSource}
      {sources.length > 1 && (<MultipleOutputsSelector {...{ sources, entities, sourceId, onFragmentChosen: setChosenFragment }} />)}
    </SourceBox>
  );
}

export default React.memo(Source);
