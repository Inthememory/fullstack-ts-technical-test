import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders booking playground title', () => {
  render(<App />);
  const titleElement = screen.getByText(/campaign booking playground/i);
  expect(titleElement).toBeInTheDocument();
});
