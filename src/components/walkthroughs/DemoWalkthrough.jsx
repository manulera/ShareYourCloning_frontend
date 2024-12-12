import React, { useState } from 'react';
import Joyride from 'react-joyride';

const DemoWalkthrough = () => {
    const [run, setRun] = useState(false);

    const steps = [
        {
            target: '.app-name',
            content: 'Welcome to ShareYourCloning! This interface helps you design and document molecular cloning experiments.',
            title: 'Welcome',
            disableBeacon: true,
            disableOverlayClose: true,
            hideCloseButton: true,
            hideFooter: true,
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
        const { status } = data;
        if (status === 'finished' || status === 'skipped') {
            setRun(false);
        }
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
                Start Tour
            </button>
            <Joyride
                steps={steps}
                run={run}
                continuous
                showSkipButton
                showProgress
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
                callback={handleJoyrideCallback}
            />
        </div>
    );
};

export default DemoWalkthrough;
