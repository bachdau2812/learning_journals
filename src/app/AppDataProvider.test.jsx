import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { AppDataProvider, useAppData } from './AppDataProvider';
import { createDefaultAppData } from '../domain/persistence/schema';

function memoryStorage() {
  let value = null;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; },
    get value() { return value; },
  };
}

function Probe() {
  const { data, updateData, updateProgress, saveStatus, saveError } = useAppData();
  return (
    <div>
      <output data-testid="status">{saveStatus}</output>
      <output data-testid="error">{saveError ?? ''}</output>
      <output data-testid="journal">{data.journalEntries[0]?.title ?? ''}</output>
      <button onClick={() => updateProgress('topic-a', { questions: { 'question-unknown': 'done' } })}>update</button>
      <button onClick={() => updateData({ journalEntries: [{ id: 'j1', title: 'Saved note' }] })}>journal</button>
    </div>
  );
}

afterEach(() => cleanup());

describe('AppDataProvider', () => {
  it('debounces updates, writes them, and reloads the journal through a new provider', async () => {
    vi.useFakeTimers();
    const storage = memoryStorage();
    const view = render(<AppDataProvider storage={storage}><Probe /></AppDataProvider>);
    expect(screen.getByTestId('status')).toHaveTextContent('saved');
    await act(async () => { screen.getByRole('button', { name: 'journal' }).click(); });
    expect(screen.getByTestId('status')).toHaveTextContent('saving');
    await act(async () => { vi.advanceTimersByTime(599); });
    expect(storage.value).toBeNull();
    await act(async () => { vi.advanceTimersByTime(1); });
    expect(screen.getByTestId('status')).toHaveTextContent('saved');
    expect(storage.value).toContain('Saved note');
    view.unmount();
    render(<AppDataProvider storage={storage}><Probe /></AppDataProvider>);
    expect(screen.getByTestId('journal')).toHaveTextContent('Saved note');
    vi.useRealTimers();
  });

  it('reports a failed write as error instead of saved', async () => {
    vi.useFakeTimers();
    const storage = memoryStorage();
    storage.setItem = () => { const error = new Error('full'); error.name = 'QuotaExceededError'; throw error; };
    render(<AppDataProvider storage={storage}><Probe /></AppDataProvider>);
    await act(async () => { screen.getByRole('button', { name: 'update' }).click(); });
    await act(async () => { vi.advanceTimersByTime(600); });
    expect(screen.getByTestId('status')).toHaveTextContent('error');
    expect(screen.getByTestId('error')).toHaveTextContent(/storage is full/i);
    vi.useRealTimers();
  });

  it('flushes pending data when unmounted before the debounce elapses', async () => {
    vi.useFakeTimers();
    const storage = memoryStorage();
    const view = render(<AppDataProvider storage={storage}><Probe /></AppDataProvider>);
    await act(async () => { screen.getByRole('button', { name: 'journal' }).click(); });
    expect(storage.value).toBeNull();
    view.unmount();
    expect(storage.value).toContain('Saved note');
    vi.useRealTimers();
  });

  it('reports a blocked localStorage getter as an initial error', () => {
    const error = new Error('denied');
    error.name = 'SecurityError';
    const getter = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw error;
    });
    try {
      render(<AppDataProvider><Probe /></AppDataProvider>);
      expect(screen.getByTestId('status')).toHaveTextContent('error');
      expect(screen.getByTestId('error')).toHaveTextContent(/blocked journal storage/i);
    } finally {
      getter.mockRestore();
      cleanup();
    }
  });
});
