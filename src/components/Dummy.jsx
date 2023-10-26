import React from 'react';
import { Tab, Tabs } from '@mui/material';

function CustomTab2() {
  return (<Tab label="Label2" id="tab-2" aria-controls="tab-panel-2" />);
}
const CustomTab3 = React.forwardRef((props, ref) => (<Tab itemRef={ref} label="Label3" id="tab-3" aria-controls="tab-panel-3" />));

function Dummy() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const changeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Tabs value={currentTab} onChange={changeTab} aria-label="app-tabs">
      <Tab label="Label0" id="tab-0" aria-controls="tab-panel-0" />
      <Tab label="Label1" id="tab-1" aria-controls="tab-panel-1" />
      {CustomTab2()}
      <CustomTab3 />
    </Tabs>
  );
}

export default Dummy;
