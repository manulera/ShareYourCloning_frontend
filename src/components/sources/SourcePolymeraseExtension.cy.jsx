import React from 'react';
import SourcePolymeraseExtension from './SourcePolymeraseExtension';
import initialState from '../../../cypress/test_starting_point/component/source_polymerase_extension.json';
import { loadStateThunk } from '../../utils/readNwrite';
import store from '../../store';

describe('<SourcePolymeraseExtension />', () => {
  it('works with normal case', () => {
    // see: https://on.cypress.io/mounting-react
    const editableInitialState = structuredClone(initialState);
    editableInitialState.sequences[0].overhang_crick_3prime = -3;
    store.dispatch(loadStateThunk(editableInitialState));
    cy.mount(<SourcePolymeraseExtension sourceId={3} />);
    cy.intercept('POST', '/polymerase_extension').as('polymeraseExtension');
    cy.get('button').contains('Extend with polymerase').click();
    cy.wait('@polymeraseExtension').its('request.body').should('deep.equal', {
      sequences: [editableInitialState.sequences[0]],
      source: { input: [2], id: 3 },
    });
  });
  it('prevents submission if no overhangs', () => {
    store.dispatch(loadStateThunk(initialState));
    cy.mount(<SourcePolymeraseExtension sourceId={3} />);
    cy.get('button').should('not.exist');
    cy.get('.MuiAlert-message').contains('Invalid input: no 5\' overhangs.');
  });
});
