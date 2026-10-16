import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { AppDataContext } from './AppDataProvider';
import '../styles/global.css';

function Harness({ initialEntries = ['/'] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <RouteRenderer />
    </MemoryRouter>
  );
}

function RouteRenderer() {
  return useRoutes(routes);
}

afterEach(cleanup);

describe('hierarchical learning navigation', () => {
  it('renders exactly the three primary learning area links on home', () => {
    render(<Harness />);
    expect(screen.getByRole('link', { name: /dsa/i })).toHaveAttribute('href', '/browse/dsa');
    expect(screen.getByRole('link', { name: /system design/i })).toHaveAttribute('href', '/browse/system-design');
    expect(screen.getByRole('link', { name: /cs fundamentals/i })).toHaveAttribute('href', '/browse/cs-fundamentals');
    expect(screen.getByRole('navigation', { name: /learning areas/i })).toHaveAccessibleName('Learning areas');
  });

  it('shows only immediate children while browsing a catalog node', () => {
    render(<Harness initialEntries={['/browse/dsa']} />);
    expect(screen.getByRole('main', { name: /data structures & algorithms/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /arrays & strings/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /array & hashing/i })).not.toBeInTheDocument();
  });

  it('supports back navigation from a child browse page', async () => {
    const user = userEvent.setup();
    render(<Harness initialEntries={['/browse/dsa-arrays-strings']} />);
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/browse/dsa');
    await user.click(screen.getByRole('link', { name: 'Back' }));
    expect(screen.getByRole('main', { name: /data structures & algorithms/i })).toBeInTheDocument();
  });

  it('routes a leaf directly to its journals without showing sibling cards', () => {
    render(<Harness initialEntries={['/topics/lld-oop-fundamentals--encapsulation-invariants']} />);
    expect(screen.getByRole('main', { name: /oop fundamentals journals/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new journal/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Overview' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /two pointers/i })).not.toBeInTheDocument();
  });

  it.each([
    ['dsa', /data structures & algorithms/i, /arrays & strings/i],
    ['dsa-arrays-strings', /arrays & strings/i, /array & hashing/i],
  ])('redirects topic URLs for non-leaf nodes to browse (%s)', (nodeId, heading, child) => {
    render(<Harness initialEntries={[`/topics/${nodeId}`]} />);
    expect(screen.getByRole('main', { name: heading })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: child })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'What to Learn' })).not.toBeInTheDocument();
  });

  it('keeps invalid topic IDs on the not found page', () => {
    render(<Harness initialEntries={['/topics/not-a-topic']} />);
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it.each(['system-design', 'cs-fundamentals'])('keeps the %s root focused on learning groups', (id) => {
    render(<Harness initialEntries={[`/browse/${id}`]} />);
    expect(screen.queryByRole('link', { name: 'Topic journals' })).not.toBeInTheDocument();
  });

  it('keeps a major topic journal view reachable alongside preserved custom descendants', async () => {
    const user = userEvent.setup();
    const data = { customTopics: [{ id: 'custom-strategy', parentId: 'lld-pattern-strategy', domain: 'system-design', type: 'topic', title: 'My strategy exercise', isCustom: true }], journalEntries: [{ id: 'major-note', topicId: 'lld-design-patterns', header: 'My pattern notes' }] };
    render(<AppDataContext.Provider value={{ data }}><Harness initialEntries={['/browse/lld-design-patterns']} /></AppDataContext.Provider>);
    expect(screen.getByRole('link', { name: 'My strategy exercise' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Topic journals' }));
    expect(screen.getByRole('heading', { name: 'My pattern notes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New journal' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/browse/lld-design-patterns');
  });

  it.each(['/browse/lld-oop-fundamentals', '/topics/lld-oop-fundamentals', '/browse/lld-oop-fundamentals--encapsulation-invariants', '/topics/lld-pattern-strategy'])('opens the nearest major topic journal view for %s', (path) => {
    render(<Harness initialEntries={[path]} />);
    expect(screen.getByRole('main', { name: /(?:oop fundamentals|design patterns) journals/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /encapsulation|strategy/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new journal/i })).toBeInTheDocument();
  });

  it('keeps the leaf journal view focused on writing', () => {
    render(<Harness initialEntries={['/topics/lld-oop-fundamentals--encapsulation-invariants']} />);
    expect(screen.getByRole('textbox', { name: /search topic journals/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add topic/i })).not.toBeInTheDocument();
  });

  it('navigates New journal to the journal editor with its topic ID', async () => {
    const user = userEvent.setup();
    render(<Harness initialEntries={['/topics/lld-oop-fundamentals--encapsulation-invariants']} />);
    await user.click(screen.getByRole('button', { name: /new journal/i }));
    expect(screen.getByLabelText('Header')).toBeInTheDocument();
  });

  it('defines two-column tablet and one-column mobile card breakpoints', () => {
    const css = Array.from(document.querySelectorAll('style')).map((style) => style.textContent).join('\n');
    expect(css).toMatch(/@media\s*\(max-width:\s*1023px\)[\s\S]*grid-template-columns:\s*repeat\(2/);
    expect(css).toMatch(/@media\s*\(max-width:\s*639px\)[\s\S]*grid-template-columns:\s*1fr/);
  });
});
