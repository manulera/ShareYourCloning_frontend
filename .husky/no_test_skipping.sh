#!/usr/bin/env sh

echo "> Checking for it.only() or it.skip() in test files..."

if grep -r 'it.only(' cypress/e2e/*.cy.js || grep -r 'it.skip(' cypress/e2e/*.cy.js; then
  echo "Error: Found it.only() or it.skip() in test files. Please remove them before committing."
  exit 1
fi