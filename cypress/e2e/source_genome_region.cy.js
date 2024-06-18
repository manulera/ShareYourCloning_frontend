import { clearInputValue, clickMultiSelectOption, setInputValue } from './common_functions';

describe('GenomeRegion Source', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="GenomeCoordinatesSource"]').click();
  });
  it('works for reference genome', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="reference_genome"]').click();
    cy.get('#tags-standard').click();
    cy.get('div[role="presentation"]').contains('Type at least 3 characters to search');
    cy.get('#tags-standard').clear('p');
    cy.get('#tags-standard').type('pombe');
    cy.get('#tags-standard-option-0', { timeout: 20000 }).click();
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .should('have.value', 'GCA_000002945.3');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').click();
    cy.get('div[role="presentation"]').contains('Type at least 3 characters to search');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').clear('a');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').type('ase1');
    cy.get('#tags-standard-option-0', { timeout: 20000 }).click();
    cy.get('label').contains('Gene coordinates').siblings('div').children('input')
      .should('have.value', 'CU329670.1 (1878189..1880726)');
    cy.get('label').contains('Downstream bases').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Downstream bases').siblings('div').children('input')
      .type('2000');
    cy.get(':nth-child(5) > .MuiButton-root').click();
    cy.get('#source-1 a', { timeout: 20000 }).contains('GCA_000002945.3').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_000002945.3');
    cy.get('#source-1 a').contains('CU329670.1').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/CU329670.1');
    // TODO: Test link to gene id
    // cy.get('#source-1 a').contains('2543372').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/gene/2543372');
    cy.get('li#sequence-2').contains('CU329670');
    cy.get('li#sequence-2').contains('5538 bps');
  });
  it('works for other assembly', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="other_assembly"]').click();
    // Select an input field that is after a label that contains the text "assembly ID"
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .type('GCF_000002945.1');
    cy.get('label', { timeout: 20000 }).contains('Species').siblings('div').children('input')
      .should('have.value', 'Schizosaccharomyces pombe - 4896');
    cy.get('label').contains('Gene').siblings('div').click();
    cy.get('div[role="presentation"]').contains('Type at least 3 characters to search');
    cy.get('label').contains('Gene').siblings('div').children('input')
      .type('ase1');
    //   Only when the gene is selected, the submit button appears
    cy.get('li#source-1 button.MuiButtonBase-root[type="submit"]').should('not.exist');
    cy.get('div[role="presentation"]').contains('ase1', { timeout: 20000 }).click();
    cy.get('label').contains('Gene').siblings('div').children('input')
      .should('have.value', 'ase1 SPAPB1A10.09 antiparallel microtubule cross-linking factor Ase1');
    cy.get('label').contains('Gene coordinates').siblings('div').children('input')
      .should('have.value', 'NC_003424.3 (1878009..1880726)');
    cy.get(':nth-child(5) > .MuiButton-root').click();
    cy.get('#source-1 a', { timeout: 20000 }).contains('GCF_000002945.1').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000002945.1');
    cy.get('#source-1 a').contains('NC_003424.3').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NC_003424.3');
    cy.get('#source-1 a').contains('2543372').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/gene/2543372');
    cy.get('#source-1 div').contains('SPAPB1A10.09');
    cy.get('li#sequence-2').contains('NC_003424');
    cy.get('li#sequence-2').contains('4718 bps');
  });
  it('gives the right warnings and errors for other assembly', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="other_assembly"]').click();
    // Select an input field that is after a label that contains the text "assembly ID"
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .type('blah');
    cy.get('#source-1').contains('Assembly ID does not exist', { timeout: 20000 });
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .clear('');
    cy.contains('Assembly ID does not exist').should('not.exist');
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .type('GCF_000002945.1');
    cy.get('label').contains('Gene').siblings('div').children('input')
      .type('dummy');
    cy.get('div[role="presentation"]').contains('No results found', { timeout: 20000 });
    cy.get('label').contains('Gene').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Gene').siblings('div').children('input')
      .type('ase1');
    // Only when the gene is selected, the submit button appears
    cy.get('li#source-1 button.MuiButtonBase-root[type="submit"]').should('not.exist');
    cy.get('div[role="presentation"]').contains('ase1', { timeout: 20000 });
    cy.get('div[role="presentation"]').contains('ase1').click();
    cy.get('label').contains('Upstream bases').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Upstream bases').siblings('div').children('input')
      .type('187800900');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('.submit-backend-api .loading-progress').should('not.exist', { timeout: 20000 });
    cy.get('.MuiAlert-message').should('be.visible');
  });
  it('works for sequence accession', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="custom_coordinates"]').click();
    // Shows species and assembly ID if sequence accession belongs to assembly
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('NC_003424.3');
    cy.get('label').contains('Species', { timeout: 20000 }).siblings('div').children('input')
      .should('have.value', 'Schizosaccharomyces pombe - 4896');
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .should('have.value', 'GCF_000002945.1');
    // Shows warning otherwise. This in an important check, before
    // the previously set assembly and species were not being cleared.
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('DQ208311.2');
    cy.get('.MuiAlert-message', { timeout: 20000 }).contains('not linked to an assembly');
    cy.get('label').contains('Start').siblings('div').children('input')
      .type('1');
    cy.get('label').contains('End').siblings('div').children('input')
      .type('20');
    cy.get('label').contains('Strand').siblings('div.MuiInputBase-root ').click();
    cy.get('li[data-value="plus"]').click();
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('li#sequence-2 .veLinearView', { timeout: 20000 }).contains('DQ208311');
    cy.get('li#sequence-2 .veLinearView').contains('20 bps');
  });
  it('gives the right errors and warnings for sequence accesion', () => {
    // TODO: move some of this to component tests (e.g. coordinates constraints)
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="custom_coordinates"]').click();
    // Shows species and assembly ID if sequence accession belongs to assembly
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('blah');
    cy.get('li#source-1').contains('Sequence accession does not exist', { timeout: 20000 });
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .clear();
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('NC_003424.3');
    // Clears form if sequence accession changes
    cy.get('li#source-1 label').contains('Start').siblings('div').children('input')
      .type('1');
    cy.get('label').contains('End').siblings('div').children('input')
      .type('20');
    cy.get('label').contains('Strand').siblings('div.MuiInputBase-root ').click();
    cy.get('li[data-value="plus"]').click();
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('blah');
    cy.contains('Sequence accession does not exist', { timeout: 20000 });
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('NC_003424.3');
    cy.get('label').contains('Start', { timeout: 20000 }).siblings('div').children('input')
      .should('have.value', '');
    cy.get('label').contains('End').siblings('div').children('input')
      .should('have.value', '');
    cy.get('label').contains('Strand').siblings('div').children('input')
      .should('have.value', '');
    // Frontend form validation

    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('label').contains('Start').siblings('p').contains('Field required');
    cy.get('label').contains('Start').siblings('div').children('input')
      .type('0');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('label').contains('End').siblings('p').contains('Field required');
    cy.get('label').contains('End').siblings('div').children('input')
      .type('20');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('label').contains('Strand').siblings('p').contains('Field required');
    cy.get('label').contains('Strand').siblings('div.MuiInputBase-root ').click();
    cy.get('li[data-value="plus"]').click();
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('label').contains('Start').siblings('p').contains('Start must be greater than zero');
    cy.get('label').contains('Start').siblings('div').children('input')
      .clear();
    cy.get('label').contains('Start').siblings('div').children('input')
      .type('20');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('label').contains('End').siblings('p').contains('End must be greater than start');
    cy.get('label').contains('Start').siblings('div').children('input')
      .clear();
    // Server error if coordinates fall outside of sequence
    cy.get('label').contains('Start').siblings('div').children('input')
      .type('5579130');
    cy.get('label').contains('End').siblings('div').children('input')
      .clear();
    cy.get('label').contains('End').siblings('div').children('input')
      .type('5579135');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('.MuiAlert-message', { timeout: 20000 }).should('be.visible');
  });
  it('searchs in the new assembly after changing species', () => {
    clickMultiSelectOption('Type of region', 'Locus in reference', 'li#source-1');
    setInputValue('Species', 'pombe', 'li#source-1');
    clickMultiSelectOption('Species', 'Schizosaccharomyces pombe', 'li#source-1', { timeout: 20000 });
    // Ase1 should be there
    setInputValue('Gene', 'ase1', 'li#source-1');
    clickMultiSelectOption('Gene', 'ase1', 'li#source-1', { timeout: 20000 });

    // Change to coli
    clearInputValue('Species', 'li#source-1');
    // There should not be Assembly ID field
    cy.get('li#source-1 label').contains('Assembly ID').should('not.exist');
    setInputValue('Species', 'coli', 'li#source-1');
    clickMultiSelectOption('Species', 'Escherichia coli', 'li#source-1', { timeout: 20000 });
    // Ase1 should not be there
    setInputValue('Gene', 'ase1', 'li#source-1');
    cy.get('div[role="presentation"]').contains('No results found', { timeout: 20000 }).should('exist');
  });
});
