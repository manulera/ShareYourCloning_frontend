import React, { useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const CloningWalkthrough = () => {
    const [run, setRun] = useState(false);

    const steps = [
        {
            target: 'body',
            content: 'Welcome to the Cloning Tour! This tour will guide you through the cloning process using ShareYourCloning.\
            You don\'t need to interact with the page, just click on "Next" and I will do everything for you.',
            title: 'Welcome to the Cloning Tour!',
            placement: 'center',
            styles: {
                options: {
                    zIndex: 10000,
                },
            },

        },
        {
            target: '#source-1',
            content: 'This is a source, the base unit of information of SYC. A source can be a sequence imported as a file or from other services like NCBI.',
            title: 'Sources',
            placement: 'left',
            spotlightClicks: true,
            //spotlightPadding: 20,
            styles: {
                options: {
                    zIndex: 10000,
                    //spotlightShadow: '0 0 0 rgba(0, 0, 0, 0)',
                },
          },
        },
        {
            target: '#source-1 .select-source .MuiFormControl-root',
            content: 'This dropdown allows you to select the origin of your source.\
                      ',
            disableOverlayClose: true,
        },
        {
            target: '#source-1 .select-source .MuiFormControl-root',
            content: 'Good, we selected the database source',
            title: 'Database Source',
            placement: 'right',
            spotlightClicks: true,
            styles: {
                options: {
                    zIndex: 10000,
                },
            },
        }

    ];

    const handleJoyrideCallback = (data) => {
        const { status, type } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (data.index === 0 && type === 'step:after') {
            // Perform action after the first step
            console.log('First step completed');
        } else if (data.index === 1 && type === 'step:after') {
            // Select and click the dropdown menu from the first source
            const element = document.querySelector('li.source-1 .MuiSelect-select');
            if (element) {
                element.click();
            }
            console.log('Second step completed');
        } else if (data.index === 2 && type === 'step:after') {
            const element = document.querySelector('#source-1 .MuiSelect-nativeInput');
            if (element) {
                element.click();
            }
            // Perform action after the third step
            console.log('Third step completed');
        } else if (data.index === 3 && type === 'step:after') {
            const element = document.querySelector('#source-1 .select-source .MuiFormControl-root');
            // Perform action after the fourth step
            console.log('Fourth step completed');
        }
    
        if (finishedStatuses.includes(status)) {
          setRun(false);
        }
        console.log('Finished:', finishedStatuses.includes(status));
        // Log step data
        //console.groupCollapsed(type);
        //console.log(data);
        //console.groupEnd();
      };

    return (
        <div>
            <button 
                onClick={() => setRun(true)}
                style={{
                    position: 'fixed',
                    bottom: '50px',
                    right: '20px',
                    zIndex: 9999
                }}
            >
                Cloning Tour
            </button>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                run={run}
                showProgress
                showSkipButton
                steps={steps}
                styles={{
                    options: {
                        zIndex: 10000,
                        overlayColor: 'rgba(0, 0, 0, 0)',
                    },
                    spotlight: {
                        backgroundColor: 'rgba(0,0,0,0)',
                        border: '2px dashed red',
                    },
                }}
                
            />
        </div>
    );
};

export default CloningWalkthrough;
