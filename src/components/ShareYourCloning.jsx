import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import MainSequenceEditor from './MainSequenceEditor';
import DescriptionEditor from './DescriptionEditor';
import PrimerList from './primers/PrimerList';
import { cloningActions } from '../store/cloning';
import TabPannel from './navigation/TabPannel';
import CustomTab from './navigation/CustomTab';
import DataModelDisplayer from './DataModelDisplayer';
import CloningHistory from './CloningHistory';
import PrimerDesigner from './primers/primer_design/PrimerDesigner';

function ShareYourCloning() {
  const dispatch = useDispatch();
  const { setCurrentTab: setCurrentTabAction } = cloningActions;
  const setCurrentTab = (tab) => dispatch(setCurrentTabAction(tab));
  const network = useSelector((state) => state.cloning.network, shallowEqual);
  const currentTab = useSelector((state) => state.cloning.currentTab);

  const changeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="app-container">
      <Tabs value={currentTab} onChange={changeTab} aria-label="app-tabs" centered sx={{ mb: 3 }} id="shareyourcloning-app-tabs">
        <CustomTab label="Cloning" index={0} />
        <CustomTab label="Primers" index={1} />
        <CustomTab label="Description" index={2} />
        <CustomTab label="Sequence" index={3} />
        <CustomTab label="Data model" index={4} />
        <CustomTab label="Primer design" index={5} />
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
      <TabPannel index={0} value={currentTab} className="cloning-tab-pannel">
        <div className="share-your-cloning">
          <CloningHistory network={network} />
        </div>
      </TabPannel>
      <TabPannel index={3} value={currentTab} className="main-editor-tab-pannel">
        <div className="main-sequence-editor">
          <MainSequenceEditor />
        </div>
      </TabPannel>
      <TabPannel index={4} value={currentTab} className="data-model-tab-pannel">
        <DataModelDisplayer />
      </TabPannel>
      <TabPannel index={5} value={currentTab} className="primer-designer-tab-pannel">
        <PrimerDesigner />
      </TabPannel>
    </div>
  );
}

export default ShareYourCloning;
