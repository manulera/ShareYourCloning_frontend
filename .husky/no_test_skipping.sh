#!/usr/bin/env sh

echo -e "\033[1;34m>\033[0m Checking for \033[1;33mit.only()\033[0m or \033[1;33mit.skip()\033[0m in test files..."

E2E_TEST_FILES=$(find cypress/e2e -name "*.cy.js")
if grep -r 'it.only(' $E2E_TEST_FILES || grep -r 'it.skip(' $E2E_TEST_FILES; then
  echo "Error: Found it.only() or it.skip() in test files. Please remove them before committing."
  exit 1
fi

COMPONENT_TEST_FILES=$(find src -name "*.cy.jsx")
if grep -r 'it.only(' $COMPONENT_TEST_FILES || grep -r 'it.skip(' $COMPONENT_TEST_FILES; then
  echo "Error: Found it.only() or it.skip() in component test files. Please remove them before committing."
  exit 1
fi
