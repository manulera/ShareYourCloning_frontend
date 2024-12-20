import React, { useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const SubmitWalkthrough = () => {
    const [run, setRun] = useState(false);

    const steps = [
        {
            // TODO: Check that there is a #source-1 element
            target: 'body',  // General target
            title: 'How to submit a file',
            content: 'This tour will guide you through the process of importing sequences from a file.',
            disableBeacon: true,  // We don't need to direct the user to a specific element
            disableSpotlight: true,  // We don't need to highlight a specific element.
            placement: 'center',  // Place tooltip in the center, removes arrow
            styles: {
                options: {
                    // Since we don't interact with the page on this step, we will "hide" the page with an overlay
                    overlayColor: 'rgba(0, 0, 0, 0.5)',  // Color overlayed on the rest of the page
                },
            },
        },
        {
            // TODO: When clicking on the "source type" dropdown, this opens, 
            // but goes beyond the spotlight and gets hidden by the overlay.
            // The spotlight only changes when the joyride step changes, so we need to
            // manually change the spotlight to the dropdown menu.
            target: '#source-1',
            content: 'This is a source, the base unit of information of SYC. To import a file, select "Submit file" from the "Source type" dropdown menu.',
            spotlightClicks: true,  // Allow the user to click through the spotlight (for instance, a button that is behind)
            styles: {
                options: {
                    zIndex: 10000,
                    //overlayColor: 'rgba(255, 0, 255, 0.5)',  // Color overlayed on the rest of the page
                },
                spotlight: {
                    backgroundColor: 'rgba(0,255,0,0.1)',  // Color of the highlighted element (spotlight)
                },
            },
        },
        {
            target: '#source-1',
            content: 'Once selected, click on the "SELECT FILE" button to choose a file from your computer.',
        },
        {
            // TODO: Check that source-2 exists, and otherwise stop the "next" button
            target: '#source-2',
            content: 'Your file is now successfully imported! Now you can continue with your cloning strategy.',
        },

    ];

    const handleJoyrideCallback = (data) => {
        const { status, type } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
        if (finishedStatuses.includes(status)) {
          setRun(false);
        }

        // Step 1
        if (type === 'step:before' && data.step.target === '#source-1') {
            const targetElement = document.querySelector(data.step.target);
            targetElement.addEventListener('click', () => {
                // Update the spotlight to ensure it covers the entire dropdown menu
                // This is a placeholder for the actual logic to update the spotlight
                // The actual implementation might involve modifying the state or props of the Joyride component
                console.log('Updating spotlight for source-1 dropdown menu');
            });
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
                    top: '200px',
                    right: '20px',
                    zIndex: 9999
                }}
            >
                Submit Walkthrough
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
                        //overlayColor: 'rgba(0, 0, 0, 0)',  // Color overlayed on the rest of the page
                    },
                    spotlight: {
                        //backgroundColor: 'rgba(0,0,0,0)',  // Color of the highlighted element (spotlight)
                        border: '2px dashed red', borderRadius: '15px',  // Border of the highlighted element (spotlight) with rounded corners
                    },
                }}
                
            />
        </div>
    );
};

export default SubmitWalkthrough;
