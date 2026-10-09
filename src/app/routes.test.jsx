import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';

function RouteHarness() {
  return useRoutes(routes);
}

describe('application routes', () => {
  it('renders the home page landmark', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RouteHarness />
      </MemoryRouter>,
    );

    expect(screen.getByRole('main', { name: /engineering learning journal/i })).toBeInTheDocument();
  });

  it('renders a not found page for unknown paths', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <RouteHarness />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
