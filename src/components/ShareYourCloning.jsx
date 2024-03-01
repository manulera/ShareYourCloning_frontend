import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import MainSequenceEditor from './MainSequenceEditor';
import DescriptionEditor from './DescriptionEditor';
import PrimerList from './primers/PrimerList';
import NetWorkNode from './NetworkNode';
import NewSourceBox from './sources/NewSourceBox';
import { cloningActions } from '../store/cloning';
import TabPannel from './navigation/TabPannel';
import CustomTab from './navigation/CustomTab';
import DataModelDisplayer from './DataModelDisplayer';

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
      </Tabs>
      <TabPannel index={1} value={currentTab}>
        <div className="primer-list-container">
          <PrimerList />
        </div>
      </TabPannel>
      <TabPannel index={2} value={currentTab}>
        <div className="description-editor">
          <DescriptionEditor />
        </div>
      </TabPannel>
      <TabPannel index={0} value={currentTab}>
        <div className="tf-tree tf-ancestor-tree">
          <ul>
            {network.map((node) => (
              <NetWorkNode key={node.source.id} {...{ node, isRootNode: true }} />
            ))}
            {/* There is always a box on the right side to add a source */}
            <li key="new_source_box">
              <span className="tf-nc"><span className="node-text"><NewSourceBox /></span></span>
            </li>
          </ul>
        </div>
      </TabPannel>
      <TabPannel index={3} value={currentTab}>
        <div className="main-sequence-editor">
          <MainSequenceEditor />
        </div>
      </TabPannel>
      <TabPannel index={4} value={currentTab}>
        <DataModelDisplayer />
      </TabPannel>
    </div>
  );
}

export default ShareYourCloning;
