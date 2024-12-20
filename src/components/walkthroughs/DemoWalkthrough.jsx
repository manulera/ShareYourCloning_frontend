import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Joyride, { STATUS } from 'react-joyride';
import { cloningActions } from '../../store/cloning';

const DemoWalkthrough = () => {
    const [run, setRun] = useState(false);
    const dispatch = useDispatch();
    const { setCurrentTab: setCurrentTabAction } = cloningActions;
    const setCurrentTab = (tab) => dispatch(setCurrentTabAction(tab));

    const steps = [
        {
            target: '.app-name',
            content: 'Welcome to ShareYourCloning! This interface helps you design and document molecular cloning experiments.',
            title: 'Welcome',
            disableBeacon: true,
            disableOverlayClose: false,
            placement: 'bottom',
            spotlightClicks: true,
            styles: {
                options: {
                zIndex: 10000,
                },
          },
        },
        {
            target: '.app-bar .MuiToolbar-root',
            content: 'Use these controls to manage your cloning projects. You can save/load files, view examples, and access templates.',
            title: 'Main Controls',
            placement: 'bottom',
        },
        {
            target: '#tab-0',
            content: 'The Cloning tab shows your experiment history as a visual tree. Each node represents a step in your cloning strategy.',
            title: 'Cloning History',
            placement: 'bottom',
        },
        {
            target: '#tab-1',
            content: 'Design and manage your PCR primers here. The app helps you optimize primer design for various cloning methods.',
            title: 'Primers Tab',
            placement: 'bottom',
        },
        {
            target: '#tab-2',
            content: 'Document your experiment with detailed descriptions. This helps others understand your cloning strategy.',
            title: 'Description',
            placement: 'bottom',
        },
        {
            target: '#tab-3',
            content: 'View and edit DNA sequences. You can analyze features, restrictions sites, and more.',
            title: 'Sequence View',
            placement: 'bottom',
        },
        {
            target: '#tab-4',
            content: 'Examine the underlying data model of your cloning strategy.',
            title: 'Data Model',
            placement: 'bottom',
        }
    ];

    const handleJoyrideCallback = (data) => {
        const { status, type } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
        if (finishedStatuses.includes(status)) {
          setRun(false);
        }

        // Try to navigate the tabs programmatically
        if (type === 'step:before') {
            if (data.step.target.startsWith('#tab')) {
                const newValue = parseInt(data.step.target.split('-')[1], 10);
                setCurrentTab(newValue);
            }
        }
        // Go back to the first tab after the tour
        // TODO: may want to have a final step that displays one last tooltip in the main page
        if (status === STATUS.FINISHED) {
            setCurrentTab(0);
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
                    bottom: '20px',
                    right: '20px',
                    zIndex: 9999
                }}
            >
                Overview Tour
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
                        primaryColor: '#3f51b5',
                        backgroundColor: '#ffffff',
                        arrowColor: '#ffffff',
                        textColor: '#333',
                    },
                    tooltip: {
                        padding: 15,
                    },
                    buttonNext: {
                        backgroundColor: '#3f51b5',
                    },
                    buttonBack: {
                        marginRight: 10,
                    }
                }}
                
            />
        </div>
    );
};

export default DemoWalkthrough;
