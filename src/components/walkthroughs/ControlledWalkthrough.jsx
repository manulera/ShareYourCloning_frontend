// import React, { useState } from 'react';
// import { useMount, useSetState } from 'react-use';
// import Joyride, { ACTIONS, CallBackProps, EVENTS, Events, STATUS, Step } from 'react-joyride';

// const ControlledWalkthrough = () => {
//     //const [run, setRun] = useState(false);
//     //const [stepIndex, setStepIndex] = useState(0);
//     //const [steps, setSteps] = useState([]);
//     const [{ run, stepIndex, steps }, setState] = useSetState({
//         run: false,
//         stepIndex: 0,
//         steps: [],
//     });

//     // I could maybe avoid using useMount and just use setState in the component
//     useMount(() => {
//         setState({
//             steps : [
//                 {
//                     // TODO: Check that there is a #source-1 element
//                     target: 'body',  // General target
//                     title: 'How to submit a file',
//                     content: 'This tour will guide you through the process of importing sequences from a file.',
//                     disableBeacon: true,  // We don't need to direct the user to a specific element
//                     disableSpotlight: true,  // We don't need to highlight a specific element.
//                     placement: 'center',  // Place tooltip in the center, removes arrow
//                     styles: {
//                         options: {
//                             // Since we don't interact with the page on this step, we will "hide" the page with an overlay
//                             overlayColor: 'rgba(0, 0, 0, 0.5)',  // Color overlayed on the rest of the page
//                         },
//                     },
//                 },
//                 {
//                     // TODO: When clicking on the "source type" dropdown, this opens,
//                     // but goes beyond the spotlight and gets hidden by the overlay.
//                     // The spotlight only changes when the joyride step changes, so we need to
//                     // manually change the spotlight to the dropdown menu.
//                     target: '#source-1',
//                     content: 'This is a source, the base unit of information of SYC. To import a file, select "Submit file" from the "Source type" dropdown menu.',
//                     spotlightClicks: true,  // Allow the user to click through the spotlight (for instance, a button that is behind)
//                     styles: {
//                         options: {
//                             zIndex: 10000,
//                             //overlayColor: 'rgba(255, 0, 255, 0.5)',  // Color overlayed on the rest of the page
//                         },
//                         spotlight: {
//                             backgroundColor: 'rgba(0,255,0,0.1)',  // Color of the highlighted element (spotlight)
//                         },
//                     },
//                 },
//                 {
//                     target: '#source-1',
//                     content: 'Once selected, click on the "SELECT FILE" button to choose a file from your computer.',
//                 },
//                 {
//                     // TODO: Check that source-2 exists, and otherwise stop the "next" button
//                     target: '#source-2',
//                     content: 'Your file is now successfully imported! Now you can continue with your cloning strategy.',
//                 },

//             ],
//         });
//     })

//     const handleJoyrideCallback = (data) => {
//         const { action, index, status, type } = data;

//         if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
//             // Need to set our running state to false, so we can restart if we click start again.
//             setState({ run: false, stepIndex: 0 });
//         } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
//             const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
//             // Here goes the logic for all steps
//             // If the step is 3 and there is no element #source-2, then we go back to step 2 and write something on the console
//             if (index === 3 && !document.getElementById('source-2')) {
//                 console.log('Element #source-2 not found');
//                 setState({ stepIndex: 2 });
//             }

//             // if (sidebarOpen && index === 0) {
//             //     setTimeout(() => {
//             //         setState({ run: true });
//             //     }, 400);
//             // } else if (sidebarOpen && index === 1) {
//             //     setState({
//             //         run: false,
//             //         sidebarOpen: false,
//             //         stepIndex: nextStepIndex,
//             //     });

//             //     setTimeout(() => {
//             //         setState({ run: true });
//             //     }, 400);
//             // } else if (index === 2 && action === ACTIONS.PREV) {
//             //     setState({
//             //         run: false,
//             //         sidebarOpen: true,
//             //         stepIndex: nextStepIndex,
//             //     });

//             //     setTimeout(() => {
//             //         setState({ run: true });
//             //     }, 400);
//             // } else {
//             //     // Update state to advance the tour
//             //     setState({
//             //         sidebarOpen: false,
//             //         stepIndex: nextStepIndex,
//             //     });
//             // }
//         }

//         // Log step data
//         //logGroup(type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type, data);
//         console.groupCollapsed(type);
//         console.log(data);
//         console.groupEnd();
//     };

//     return (
//         <div>
//             <button
//                 onClick={() => setRun(true)}
//                 style={{
//                     position: 'fixed',
//                     top: '300px',
//                     right: '20px',
//                     zIndex: 9999
//                 }}
//             >
//                 Controlled Walkthrough
//             </button>
//             <Joyride
//                 callback={handleJoyrideCallback}
//                 continuous
//                 run={run}
//                 showProgress
//                 showSkipButton
//                 steps={steps}
//                 styles={{
//                     options: {
//                         zIndex: 10000,
//                         //overlayColor: 'rgba(0, 0, 0, 0)',  // Color overlayed on the rest of the page
//                     },
//                     spotlight: {
//                         //backgroundColor: 'rgba(0,0,0,0)',  // Color of the highlighted element (spotlight)
//                         border: '2px dashed red', borderRadius: '15px',  // Border of the highlighted element (spotlight) with rounded corners
//                     },
//                 }}

//             />
//         </div>
//     );
// };

// export default ControlledWalkthrough;
