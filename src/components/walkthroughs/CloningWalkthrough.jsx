import React, { useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const CloningWalkthrough = () => {
    const [run, setRun] = useState(false);

    const steps = [
        {
            target: 'body',
            content: 'Welcome to the Cloning Tour! This tour will guide you through the cloning process using ShareYourCloning.',
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
            content: 'You can select the origin of your source using this dropdown menu.',
        }

    ];

    const handleJoyrideCallback = (data) => {
        const { status, type } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
        if (finishedStatuses.includes(status)) {
          setRun(false);
        }

        // Log step data
        console.groupCollapsed(type);
        console.log(data);
        console.groupEnd();
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
