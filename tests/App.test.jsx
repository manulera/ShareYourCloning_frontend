import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import store from '../src/store';


test('Tests what is on the screen when the app loads', () => {
  render(<Provider store={store}>
    <App />
  </Provider>);

  const title = screen.getByText(/share your cloning/i);
  expect(title).toBeInTheDocument();
});
