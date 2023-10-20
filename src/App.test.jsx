import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Tests what is on the screen when the app loads', () => {
  render(<App />);

  const title = screen.getByText(/shareyourcloning/i);
  expect(title).toBeInTheDocument();
});
