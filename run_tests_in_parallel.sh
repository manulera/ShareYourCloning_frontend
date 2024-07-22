# Delete all screenshots and run all tests in parallel
rm -f cypress/screenshots/*/*.png
rmdir cypress/screenshots/*
find cypress/e2e -name '*.cy.js' | parallel --group -j4 yarn cypress run --config trashAssetsBeforeRuns=false --spec {}
