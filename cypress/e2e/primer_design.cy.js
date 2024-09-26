import { addSource, clearInputValue, clickMultiSelectOption, loadExample, setInputValue } from './common_functions';

describe('Test primer designer functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Homologous recombination primer design', () => {
    loadExample('Integration of cassette by homologous recombination');

    // Delete the source that says "PCR with primers"
    cy.contains('li', 'PCR with primers').find('[data-testid="DeleteIcon"]').first().click();
    addSource('PCRSource');

    // Click on design primers
    cy.get('button').contains('Design primers').click();

    clickMultiSelectOption('Purpose of primers', 'Homologous Recombination', 'li');
    clickMultiSelectOption('Target sequence', '6', 'li');
    cy.get('button').contains('Design primers').click();

    // We should be now on the Sequence tab
    cy.get('button.MuiTab-root.Mui-selected').contains('Sequence').should('exist');

    // Go back to the cloning tab and check that the button is displayed
    cy.get('button.MuiTab-root').contains('Cloning').click();
    cy.get('button').contains('Design primers').should('have.length', 1);

    // Click it, should bring us back to the Sequence tab
    cy.get('button').contains('Design primers').click();
    cy.get('button.MuiTab-root.Mui-selected').contains('Sequence').should('exist');

    // Moving between tabs displays the right sequence
    cy.contains('span', 'pFA6a-5FLAG-hphMX6').should('be.visible');

    cy.get('button.MuiTab-root').contains('Replaced region').click();
    cy.contains('span', 'pFA6a-5FLAG-hphMX6').should('exist');
    cy.contains('span', 'CU329670').should('be.visible');

    cy.get('button.MuiTab-root').contains('Other settings').click();
    cy.contains('span', 'pFA6a-5FLAG-hphMX6').should('exist');
    cy.contains('span', 'CU329670').should('exist');

    // It should not be possible to submit without settings the regions
    cy.contains('button', 'Design primers').should('exist');

    // Back to the first tab
    cy.get('button.MuiTab-root').contains('Amplified region').click();

    // Click before having selected anything, should show an error
    cy.get('button').contains('Set from selection').click();
    cy.get('div.MuiAlert-standardError').contains('You have to select a region in the sequence editor');

    // We should not be able to select a single position in the sequence
    // Click on the name, that should set a single position selection
    cy.contains('span', 'pFA6a-5FLAG-hphMX6').click({ force: true });
    cy.get('button').contains('Set from selection').click();
    cy.get('div.MuiAlert-standardError').contains('Select a region (not a single position) to amplify');

    // Click on the hphMX6 feature
    cy.contains('svg', 'hphMX6').click();
    cy.get('button').contains('Set from selection').click();

    // We still should not be able to submit
    cy.get('button.MuiTab-root').contains('Other settings').click();
    cy.contains('button', 'Design primers').should('exist');

    // Go to replaced region tab, and select a single position
    cy.get('button.MuiTab-root').contains('Replaced region').click();
    cy.contains('span', 'CU329670').click({ force: true });
    cy.get('button').contains('Set from selection').click();

    // There should be no error message, but there is an info one, so we need that class
    cy.get('div.MuiAlert-standardError').should('not.exist');

    // Go to "Other settings" tab
    cy.get('button.MuiTab-root').contains('Other settings').click();
    // They will turn into 80, 50, 20 when written, since it's a number input and they write on top of the zero
    const newValues = [8, 5, 2];
    ['Homology length', 'Target hybridization Tm', 'Min. hybridization length'].forEach((label, index) => {
      setInputValue(label, '0', '.primer-design');
      cy.get('button').contains('Design primers').should('exist');
      setInputValue(label, newValues[index], '.primer-design');
      cy.get('button').contains('Design primers').should('be.visible');
    });

    // Get an error for very high hyb. length
    setInputValue('Min. hybridization length', '100000', '.primer-design');
    cy.get('button').contains('Design primers').click();
    cy.get('div.MuiAlert-standardError').should('exist');
    clearInputValue('Min. hybridization length', '.primer-design');
    setInputValue('Min. hybridization length', '2', '.primer-design');

    // Design the primers
    cy.get('button').contains('Design primers').click();

    // We should be now in the Results tab
    cy.get('button.MuiTab-root.Mui-selected').contains('Results').should('exist');

    // These should be two primers: forward and reverse
    cy.get('.primer-design-form input').first().should('have.value', 'forward');
    cy.get('.primer-design-form input').eq(2).should('have.value', 'reverse');
    cy.contains('button', 'Save primers').click();

    // This should have sent us to the Cloning tab
    cy.get('button.MuiTab-root.Mui-selected').contains('Cloning').should('exist');

    // They should be present in the primers tab
    cy.get('button.MuiTab-root').contains('Primers').click();
    cy.contains('td', 'forward').should('exist');
    cy.contains('td', 'reverse').should('exist');

    // Do the PCR
    cy.get('button.MuiTab-root').contains('Cloning').click();
    cy.get('button').contains('Perform PCR').click();

    // Do the recombination
    cy.get('button').contains('Recombine').click();

    // There should be no errors shown
    cy.get('div.MuiAlert-standardError').should('not.exist');

    cy.contains('li', 'PCR with primers forward and reverse').should('exist');
    cy.contains('li', 'Homologous recombination').should('exist');
  });

  it('Gibson assembly primer design', () => {
    loadExample('Gibson assembly');

    // Delete both sources that say "PCR with primers"
    cy.contains('li', 'PCR with primers').find('[data-testid="DeleteIcon"]').first().click();
    cy.contains('li', 'PCR with primers').find('[data-testid="DeleteIcon"]').first().click();
    addSource('PCRSource');

    // Click on design primers
    cy.get('button').contains('Design primers').click();
    clickMultiSelectOption('Purpose of primers', 'Gibson Assembly', 'li');
    clickMultiSelectOption('Input sequences', '4', 'li');

    cy.get('button').contains('Design primers').click();

    // We should be now in the Sequence tab
    cy.get('button.MuiTab-root.Mui-selected').contains('Sequence').should('exist');

    // There should be three tabs: Seq 2, Seq 4 and Other settings
    cy.get('.main-sequence-editor button.MuiTab-root').should('have.length', 3);
    cy.get('.main-sequence-editor button.MuiTab-root.Mui-selected').contains('Seq 2').should('exist');
    cy.get('.main-sequence-editor button.MuiTab-root').contains('Seq 4').should('exist');
    cy.get('.main-sequence-editor button.MuiTab-root').contains('Other settings').should('exist');

    // We cannot submit without setting the regions
    cy.get('button.MuiTab-root').contains('Other settings').click();
    cy.contains('.main-sequence-editor button', 'Design primers').should('not.exist');

    // The current tab should be "Seq 2" and it displays the sequence pREP42-MCS+
    cy.get('.main-sequence-editor button.MuiTab-root').first().click();
    cy.get('.main-sequence-editor').should('contain', 'pREP42-MCS+');
    // Error if setting without selection
    cy.get('button').contains('Set from selection').click();
    cy.get('div.MuiAlert-standardError').should('exist');
    // Error if setting with single position selection
    cy.get('.main-sequence-editor').contains('pREP42-MCS+').click({ force: true });
    cy.get('button').contains('Set from selection').click();
    cy.get('div.MuiAlert-standardError').should('exist');
    // Select ars1 feature
    cy.contains('svg', 'ars1').click();
    cy.get('button').contains('Set from selection').click();
    cy.get('div.MuiAlert-standardError').should('not.exist');

    // Go to next tab
    cy.get('.main-sequence-editor button.MuiTab-root').contains('Seq 4').click();
    cy.get('.main-sequence-editor').should('contain', 'NC_003424');
    // select ase1 region
    cy.contains('svg', 'ase1').first().click();
    cy.get('button').contains('Set from selection').click();
    cy.get('div.MuiAlert-standardError').should('not.exist');

    // Go to Other settings tab
    cy.get('.main-sequence-editor button.MuiTab-root').contains('Other settings').click();

    // Initially ars1 is not reversed
    cy.contains('svg g', 'ars1').should('not.have.class', 'ann-reverse');

    // Click on the Reverse radio button
    cy.get('table span').contains('Reverse').first().click({ force: true });
    cy.contains('svg g', 'ars1').should('have.class', 'ann-reverse');

    // Click on the Circular assembly button
    cy.get('span').contains('Circular assembly').click({ force: true });

    // Submit a high hybridization to get an error
    setInputValue('Min. hybridization length', '100000', '.primer-design');
    cy.get('button').contains('Design primers').click();
    cy.get('div.MuiAlert-standardError').should('exist');
    clearInputValue('Min. hybridization length', '.primer-design');
    setInputValue('Min. hybridization length', '2', '.primer-design');

    // Design the primers
    cy.get('.main-sequence-editor button').contains('Design primers').click();

    // There should be the correct names of the primers
    cy.get('.primer-design-form input').first().should('have.value', 'pREP42-MCS+_fwd');
    cy.get('.primer-design-form input').eq(2).should('have.value', 'pREP42-MCS+_rvs');
    cy.get('.primer-design-form input').eq(4).should('have.value', 'NC_003424_fwd');
    cy.get('.primer-design-form input').eq(6).should('have.value', 'NC_003424_rvs');

    // Save the primers
    cy.get('button').contains('Save primers').click();

    // This should have sent us to the Cloning tab
    cy.get('button.MuiTab-root.Mui-selected').contains('Cloning').should('exist');

    // Do the PCRs
    cy.get('button').contains('Perform PCR').first().click();
    cy.get('button').contains('Perform PCR').last().click();

    // Do the Gibson assembly
    cy.get('button').contains('Submit').first().click();

    // There should be no errors shown
    cy.get('div.MuiAlert-standardError').should('not.exist');

    cy.contains('li', 'PCR with primers pREP42-MCS+_fwd and pREP42-MCS+_rvs').should('exist');
    cy.contains('li', 'PCR with primers NC_003424_fwd and NC_003424_rvs').should('exist');
    cy.contains('li', 'Gibson assembly').should('exist');
  });
});