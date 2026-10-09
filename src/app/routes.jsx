import React from 'react';
import HomePage from '../pages/HomePage';
import BrowsePage, { NotFoundPage } from '../pages/BrowsePage';
import TopicPage from '../pages/TopicPage';
import SettingsPage from '../pages/SettingsPage';
import JournalEditorPage from '../pages/JournalEditorPage';
import JournalListPage from '../pages/JournalListPage';
import OverviewPage from '../pages/OverviewPage';

const Placeholder = ({ title, children }) => (
  <main className="page-shell" aria-labelledby="page-title">
    <p className="eyebrow">Engineering Learning Journal</p>
    <h1 id="page-title">{title}</h1>
    {children}
  </main>
);



export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/browse/:nodeId', element: <BrowsePage /> },
  { path: '/topics/:topicId', element: <TopicPage /> },
  { path: '/journals', element: <JournalListPage /> },
  { path: '/journals/new', element: <JournalEditorPage /> },
  { path: '/journals/:journalId', element: <JournalEditorPage /> },
  { path: '/overview', element: <OverviewPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '*', element: <NotFoundPage /> },
];

