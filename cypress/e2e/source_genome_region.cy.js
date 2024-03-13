describe('GenomeRegion Source', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="genome_region"]').click();
    cy.intercept('**').as('request');
  });
  it('works for reference genome', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="reference_genome"]').click();
    cy.get('#tags-standard').click();
    cy.get('div[role="presentation"]').contains('Type at least 3 characters to search');
    cy.get('#tags-standard').clear('p');
    cy.get('#tags-standard').type('pombe');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('#tags-standard-option-0').click();
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .should('have.value', 'GCF_000002945.1');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').click();
    cy.get('div[role="presentation"]').contains('Type at least 3 characters to search');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').clear('a');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').type('ase1');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').click();
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('#tags-standard-option-0').click();
    cy.get('label').contains('Gene coordinates').siblings('div').children('input')
      .should('have.value', 'NC_003424.3 (1878009..1880726)');
    cy.get('label').contains('Downstream bases').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Downstream bases').siblings('div').children('input')
      .type('2000');
    cy.get(':nth-child(5) > .MuiButton-root').click();
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('#source-1 a').contains('GCF_000002945.1').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000002945.1');
    cy.get('#source-1 a').contains('NC_003424.3').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NC_003424.3');
    cy.get('#source-1 a').contains('2543372').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/gene/2543372');
    cy.get('[style="text-align: center;"]').click();
    cy.get('[style="text-align: center;"] > :nth-child(3)').should('have.text', '5718 bps');
    cy.get('[style="text-align: center;"] > :nth-child(1)').should('have.text', 'NC_003424 ');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1)').contains('5718 bps');
  });
  it('works for reference genome + extra basepairs', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="reference_genome"]').click();
    cy.get('#tags-standard').click();
    cy.get('div[role="presentation"]').contains('Type at least 3 characters to search');
    cy.get('#tags-standard').clear('p');
    cy.get('#tags-standard').type('pombe');
    cy.get('#tags-standard-option-0').click();
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .should('have.value', 'GCF_000002945.1');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').click();
    cy.get('div[role="presentation"]').contains('Type at least 3 characters to search');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').clear('a');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').type('ase1');
    cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-standard').click();
    cy.get('#tags-standard-option-0').click();
    cy.get('label').contains('Gene coordinates').siblings('div').children('input')
      .should('have.value', 'NC_003424.3 (1878009..1880726)');
    cy.get(':nth-child(5) > .MuiButton-root').click();
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('#source-1 a').contains('GCF_000002945.1').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000002945.1');
    cy.get('#source-1 a').contains('NC_003424.3').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NC_003424.3');
    cy.get('#source-1 a').contains('2543372').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/gene/2543372');
    cy.get('[style="text-align: center;"]').click();
    cy.get('[style="text-align: center;"] > :nth-child(3)').should('have.text', '4718 bps');
    cy.get('[style="text-align: center;"] > :nth-child(1)').click();
    cy.get('[style="text-align: center;"] > :nth-child(1)').should('have.text', 'NC_003424 ');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1)').contains('4718 bps');
  });
  it('works for other assembly', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="other_assembly"]').click();
    // Select an input field that is after a label that contains the text "assembly ID"
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .type('GCF_000002945.1');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('label').contains('Species').siblings('div').children('input')
      .should('have.value', 'Schizosaccharomyces pombe - 4896');
    cy.get('label').contains('Gene').siblings('div').click();
    cy.get('div[role="presentation"]').contains('Type at least 3 characters to search');
    cy.get('label').contains('Gene').siblings('div').children('input')
      .type('ase1');
    //   Only when the gene is selected, the submit button appears
    cy.get('li#source-1 button.MuiButtonBase-root[type="submit"]').should('not.exist');
    cy.get('div[role="presentation"]').contains('ase1').click();
    cy.get('label').contains('Gene').siblings('div').children('input')
      .should('have.value', 'ase1 SPAPB1A10.09 antiparallel microtubule cross-linking factor Ase1');
    cy.get('label').contains('Gene coordinates').siblings('div').children('input')
      .should('have.value', 'NC_003424.3 (1878009..1880726)');
    cy.get(':nth-child(5) > .MuiButton-root').click();
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('#source-1 a').contains('GCF_000002945.1').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000002945.1');
    cy.get('#source-1 a').contains('NC_003424.3').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NC_003424.3');
    cy.get('#source-1 a').contains('2543372').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/gene/2543372');
    cy.get('#source-1 div').contains('SPAPB1A10.09');
    cy.get('[style="text-align: center;"]').click();
    cy.get('[style="text-align: center;"] > :nth-child(3)').should('have.text', '4718 bps');
    cy.get('[style="text-align: center;"] > :nth-child(1)').click();
    cy.get('[style="text-align: center;"] > :nth-child(1)').should('have.text', 'NC_003424 ');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1)').contains('4718 bps');
  });
  it('gives the right warnings and errors for other assembly', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="other_assembly"]').click();
    // Select an input field that is after a label that contains the text "assembly ID"
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .type('blah');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.contains('Assembly ID does not exist');
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .clear('');
    cy.contains('Assembly ID does not exist').should('not.exist');
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .type('GCF_000002945.1');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('label').contains('Gene').siblings('div').children('input')
      .type('dummy');
    cy.get('div[role="presentation"]').contains('No results found');
    cy.get('label').contains('Gene').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Gene').siblings('div').children('input')
      .type('ase1');
    // Only when the gene is selected, the submit button appears
    cy.get('li#source-1 button.MuiButtonBase-root[type="submit"]').should('not.exist');
    cy.get('div[role="presentation"]').contains('ase1');
    cy.get('div[role="presentation"]').contains('ase1').click();
    cy.get('label').contains('Upstream bases').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Upstream bases').siblings('div').children('input')
      .type('187800900');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('.MuiAlert-message').should('be.visible');
  });
  it('works for sequence accession', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="custom_coordinates"]').click();
    // Shows species and assembly ID if sequence accession belongs to assembly
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('NC_003424.3');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('label').contains('Species').siblings('div').children('input')
      .should('have.value', 'Schizosaccharomyces pombe - 4896');
    cy.get('label').contains('Assembly ID').siblings('div').children('input')
      .should('have.value', 'GCF_000002945.1');
    // Shows warning otherwise. This in an important check, before
    // the previously set assembly and species were not being cleared.
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('DQ208311.2');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('.MuiAlert-message').contains('not linked to an assembly');
    cy.get('label').contains('Start').siblings('div').children('input')
      .type('1');
    cy.get('label').contains('End').siblings('div').children('input')
      .type('20');
    cy.get('label').contains('Strand').siblings('div.MuiInputBase-root ').click();
    cy.get('li[data-value="plus"]').click();
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('li#sequence-2 .veLinearView').contains('DQ208311');
    cy.get('li#sequence-2 .veLinearView').contains('20 bps');
  });
  it('gives the right errors and warnings for sequence accesion', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').eq(1).click();
    cy.get('li[data-value="custom_coordinates"]').click();
    // Shows species and assembly ID if sequence accession belongs to assembly
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('blah');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.contains('Sequence accession does not exist');
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .clear();
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('NC_003424.3');
    cy.wait('@request', { requestTimeout: 20000 });
    // Clears form if sequence accession changes
    cy.get('label').contains('Start').siblings('div').children('input')
      .type('1');
    cy.get('label').contains('End').siblings('div').children('input')
      .type('20');
    cy.get('label').contains('Strand').siblings('div.MuiInputBase-root ').click();
    cy.get('li[data-value="plus"]').click();
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('blah');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.contains('Sequence accession does not exist');
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .clear('');
    cy.get('label').contains('Sequence accession').siblings('div').children('input')
      .type('NC_003424.3');
    cy.wait('@request', { requestTimeout: 20000 });
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('label').contains('Start').siblings('div').children('input')
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
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get('.MuiAlert-message').should('be.visible');
  });
});
