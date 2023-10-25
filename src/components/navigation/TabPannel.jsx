import React from 'react';

const TabPanel = React.forwardRef(({ children, value, index, ...other }, ref) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tab-panel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {/* {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
      )} */}
    {children}
  </div>
));

export default TabPanel;
