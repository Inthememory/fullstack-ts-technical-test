import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    text: jest.fn().mockResolvedValue('[{"now":"2026-09-03"}]'),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the development instructions', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /full-stack typescript test/i })).toBeInTheDocument();
  expect(screen.getByText(/save to reload/i)).toBeInTheDocument();
  expect(await screen.findByText('[{"now":"2026-09-03"}]')).toBeInTheDocument();
});
