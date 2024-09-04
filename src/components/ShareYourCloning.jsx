import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import axios from 'axios';
import DescriptionEditor from './DescriptionEditor';
import PrimerList from './primers/PrimerList';
import { cloningActions } from '../store/cloning';
import TabPannel from './navigation/TabPannel';
import CustomTab from './navigation/CustomTab';
import DataModelDisplayer from './DataModelDisplayer';
import CloningHistory from './CloningHistory';
import SequenceTab from './SequenceTab';
import ExternalServicesStatusCheck from './ExternalServicesStatusCheck';

// import PrimerDesigner from './primers/primer_design/PrimerDesigner';

function ShareYourCloning() {
  const dispatch = useDispatch();
  const { setCurrentTab: setCurrentTabAction, setKnownErrors, setConfig } = cloningActions;
  const setCurrentTab = (tab) => dispatch(setCurrentTabAction(tab));
  const stateLoaded = useSelector((state) => state.cloning.config.loaded);
  const network = useSelector((state) => state.cloning.network, shallowEqual);
  const currentTab = useSelector((state) => state.cloning.currentTab);

  const changeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  React.useEffect(() => {
    // Initialization function
    // Load application configuration
    axios.get('/config.json').then(({ data }) => {
      dispatch(setConfig(data));
    });
    // Load known errors from google sheet
    axios.get('https://docs.google.com/spreadsheets/d/11mQzwX9nUepHsOrjoGadvfQrYQwSumvsfq5lcjTDZuU/export?format=tsv')
      .then(({ data }) => {
        // Parse tsv file, split with any new line
        const rows = data.split(/\r\n|\n/);
        const knownErrors = {};
        rows.forEach((row) => {
          const [key, value] = row.split('\t');
          if (knownErrors[key]) {
            knownErrors[key].push(value);
          } else {
            knownErrors[key] = [value];
          }
        });
        dispatch(setKnownErrors(knownErrors));
      })
      .catch(((e) => { console.error(e); }));
  }, []);

  if (!stateLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <ExternalServicesStatusCheck />
      <Tabs value={currentTab} onChange={changeTab} aria-label="app-tabs" centered sx={{ mb: 3, pt: 1 }} id="shareyourcloning-app-tabs">
        <CustomTab label="Cloning" index={0} />
        <CustomTab label="Primers" index={1} />
        <CustomTab label="Description" index={2} />
        <CustomTab label="Sequence" index={3} />
        <CustomTab label="Data model" index={4} />
      </Tabs>
      <TabPannel index={1} value={currentTab} className="primer-tab-pannel">
        <div className="primer-list-container">
          <PrimerList />
        </div>
      </TabPannel>
      <TabPannel index={2} value={currentTab} className="description-tab-pannel">
        <div className="description-editor">
          <DescriptionEditor />
        </div>
      </TabPannel>
      {/* For some reason, putting this here is required for primer.color to work */}
      <TabPannel index={3} value={currentTab} className="main-editor-tab-pannel">
        <div className="main-sequence-editor">
          <SequenceTab />
        </div>
      </TabPannel>
      <TabPannel index={0} value={currentTab} className="cloning-tab-pannel">
        <div className="share-your-cloning">
          <CloningHistory network={network} />
        </div>
      </TabPannel>
      <TabPannel index={4} value={currentTab} className="data-model-tab-pannel">
        <DataModelDisplayer />
      </TabPannel>
    </div>
  );
}

export default ShareYourCloning;
