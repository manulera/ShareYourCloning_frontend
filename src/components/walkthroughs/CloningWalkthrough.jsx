import React, { useState } from 'react';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';

function CloningWalkthrough() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

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
      // spotlightPadding: 20,
      styles: {
        options: {
          zIndex: 10000,
          // spotlightShadow: '0 0 0 rgba(0, 0, 0, 0)',
        },
      },
    },
    {
      title: 'Select source type',
      target: '#source-1 .select-source .MuiFormControl-root',
      content: 'You can select the origin of your source using this dropdown menu.',
      placement: 'left',
    },
    {
      title: 'Select source type (II)',
      target: 'li[data-value="GenomeCoordinatesSource"]',
      content: 'Let\'s select a genome region.',
      placement: 'left',
    },
    {
      title: 'Select type of genome region',
      target: '#source-1 form',
      content: 'You can choose from blah blah blah.',
      placement: 'left',
    },

  ];

  const handleJoyrideCallback = (data) => {
    const { type, index } = data;

    const nextStepIndex = index + (data.action === ACTIONS.PREV ? -1 : 1);
    console.log(index, data.step.title, data.action, data.status);

    // Here we open the dropdown menu before the step (fast so we don't need to await, but probably better to wait anyway)
    if (data.step.title === 'Select source type' && data.type === 'step:before') {
      const select = document.querySelector('#source-1 .select-source .MuiSelect-select');
      select?.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
      }));
    // Here we click on an option, and wait 300ms before showing the next step so that the element
    // is visible to the user. Probably it could be switched to a better approach that actually waits
    // for a given element to be visible.
    } else if (data.step.title === 'Select source type (II)' && data.type === 'step:after') {
      setRun(false);
      const menuItem = document.querySelector('li[data-value="GenomeCoordinatesSource"]');
      menuItem?.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }));
      setTimeout(() => {
        setStepIndex(nextStepIndex);
        setRun(true);
      }, 300);
    // In all other cases, we just move to the next step.
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND]).includes(type)) {
      setStepIndex(nextStepIndex);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setRun(true)}
        style={{
          position: 'fixed',
          bottom: '50px',
          right: '20px',
          zIndex: 9999,
        }}
      >
        Cloning Tour
      </button>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        run={run}
        stepIndex={stepIndex}
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
}

export default CloningWalkthrough;
