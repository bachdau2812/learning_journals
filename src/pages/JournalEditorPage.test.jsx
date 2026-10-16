import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { AppDataProvider } from '../app/AppDataProvider';
import { routes } from '../app/routes';
import { createDefaultAppData } from '../domain/persistence/schema';
import { writeAppData } from '../domain/persistence/storage';

function RouteRenderer() { return useRoutes(routes); }
async function enterText(user, name, text) {
  await user.click(screen.getByRole('textbox', { name }));
  await user.paste(text);
}
function openEditor(path, data = createDefaultAppData()) {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  writeAppData(storage, data);
  return render(<AppDataProvider storage={storage}><MemoryRouter initialEntries={[path]}><RouteRenderer /></MemoryRouter></AppDataProvider>);
}
afterEach(cleanup);

describe('self-authored journal questions', () => {
  it('does not display a built-in follow-up question for a new case journal', () => {
    openEditor('/journals/new?domain=system-design&layer=lld&topicId=lld-case-parking-lot');
    expect(screen.queryByText('How would simultaneous entry and exit change the design?')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('textbox', { name: /^Question \d+$/ })).toHaveLength(0);
  });
  it('starts empty, edits questions and answers, and preserves them across metadata changes', async () => {
    const user = userEvent.setup();
    openEditor('/journals/new?domain=cs&topicId=cs-networking-tcp-udp&journalType=cs-knowledge');
    expect(screen.queryAllByRole('textbox', { name: /^Question \d+$/ })).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Add question' }));
    await enterText(user, 'Question 1', 'Why does TCP retransmit?');
    await enterText(user, 'Answer 1', 'To recover lost packets.');
    await user.selectOptions(screen.getByLabelText('Journal type'), 'cs-lab');
    await user.selectOptions(screen.getByLabelText('Domain'), 'system-design');
    await user.selectOptions(screen.getByLabelText('System Design layer'), 'hld');
    expect(screen.getByRole('textbox', { name: 'Question 1' })).toHaveValue('Why does TCP retransmit?');
    expect(screen.getByRole('textbox', { name: 'Answer 1' })).toHaveValue('To recover lost packets.');
    expect(screen.getAllByRole('textbox', { name: /^Question \d+$/ })).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Add question' }));
    await enterText(user, 'Question 2', 'What is congestion control?');
    await enterText(user, 'Answer 2', 'Limit load on the network.');
    await user.click(screen.getByRole('button', { name: 'Remove question 1' }));
    expect(screen.getByRole('textbox', { name: 'Question 1' })).toHaveValue('What is congestion control?');
    expect(screen.getByRole('textbox', { name: 'Answer 1' })).toHaveValue('Limit load on the network.');
    await user.click(screen.getByRole('button', { name: 'Remove question 1' }));
    expect(screen.queryAllByRole('textbox', { name: /^Question \d+$/ })).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Add question' })).toBeInTheDocument();
  });

  it('keeps legacy questions editable without injecting more questions', async () => {
    const user = userEvent.setup();
    const data = createDefaultAppData();
    data.journalEntries = [{ id: 'legacy', domain: 'cs', journalType: 'cs-knowledge', header: 'Legacy note', checklist: [{ questionId: 'legacy-q', text: 'Original question' }], questionAnswers: [{ questionId: 'legacy-q', text: 'Saved answer', status: 'done' }] }];
    openEditor('/journals/legacy', data);
    expect(screen.getByRole('textbox', { name: 'Question 1' })).toHaveValue('Original question');
    expect(screen.getByRole('textbox', { name: 'Answer 1' })).toHaveValue('Saved answer');
    await user.clear(screen.getByRole('textbox', { name: 'Question 1' }));
    await enterText(user, 'Question 1', 'My revised question');
    expect(screen.getByRole('textbox', { name: 'Answer 1' })).toHaveValue('Saved answer');
    expect(screen.getAllByRole('textbox', { name: /^Question \d+$/ })).toHaveLength(1);
  });

  it('does not refill an existing journal with an empty checklist', () => {
    const data = createDefaultAppData();
    data.journalEntries = [{ id: 'empty', domain: 'dsa', journalType: 'dsa-problem-solving', checklist: [], questionAnswers: [] }];
    openEditor('/journals/empty', data);
    expect(screen.queryAllByRole('textbox', { name: /^Answer \d+$/ })).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Add question' })).toBeInTheDocument();
  });

  it.each([{ checklist: undefined }, { checklist: [] }])('recovers only existing legacy answers when checklist is $checklist', ({ checklist }) => {
    const data = createDefaultAppData();
    data.journalEntries = [{ id: 'legacy-answers', domain: 'dsa', journalType: 'dsa-problem-solving', checklist, questionAnswers: [{ questionId: 'dsa.recognition', text: 'Saved recognition notes', status: 'done' }, { questionId: 'unknown-old-id', text: 'Saved custom answer', status: 'partial' }] }];
    openEditor('/journals/legacy-answers', data);
    expect(screen.getByRole('textbox', { name: 'Question 1' })).toHaveValue('What signals reveal the pattern and when does it apply?');
    expect(screen.getByRole('textbox', { name: 'Answer 1' })).toHaveValue('Saved recognition notes');
    expect(screen.getByRole('textbox', { name: 'Answer 2' })).toHaveValue('Saved custom answer');
    expect(screen.getAllByRole('textbox', { name: /^Question \d+$/ })).toHaveLength(2);
  });
});
