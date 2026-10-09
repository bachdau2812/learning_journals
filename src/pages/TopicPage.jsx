import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Search, NotebookPen } from 'lucide-react';
import useCatalog from '../data/catalog/useCatalog';
import { useAppData } from '../app/AppDataProvider';
import { createJournal } from '../domain/journals/journal';
import { normalizeSearchText, sortJournals } from '../domain/journals/search';
import JournalList from '../components/JournalList';
import { NotFoundPage } from './BrowsePage';
import SpatialLink, { setSpatialDirection, SpatialEntryPlane } from '../components/SpatialLink';

export default function TopicPage() {
  const { topicId } = useParams();
  const [params] = useSearchParams();
  const { getAncestors, getChildren, getNode } = useCatalog();
  const topic = getNode(topicId);
  const navigate = useNavigate();
  const appData = useAppData();
  const [query, setQuery] = useState('');
  const entries = useMemo(() => sortJournals((appData?.data?.journalEntries ?? []).filter((entry) =>
    (entry.topicId === topicId || entry.problemId === topicId) && normalizeSearchText(entry.header).includes(normalizeSearchText(query))), 'recently-updated'), [appData?.data?.journalEntries, topicId, query]);
  if (!topic) return <NotFoundPage />;
  const hasChildren = getChildren(topic.id).length > 0;
  if (hasChildren && params.get('view') !== 'journals') return <Navigate to={`/browse/${topic.id}`} replace />;
  const parent = getAncestors(topic.id).at(-1);
  const createEntry = () => {
    const params = new URLSearchParams({ topicId: topic.id, domain: topic.domain });
    if (topic.type === 'problem') params.set('problemId', topic.id);
    if (topic.domain === 'dsa' && topic.type !== 'problem') params.set('journalType', 'dsa-concept-learning');
    if (topic.type === 'lab' && topic.domain === 'cs') params.set('journalType', 'cs-lab');
    if ((topic.type === 'case' || getAncestors(topic.id).some((node) => node.type === 'case')) && topic.domain === 'system-design') {
      const layer = getAncestors(topic.id).find((item) => ['system-design-hld', 'system-design-lld', 'system-design-distributed'].includes(item.id))?.id.replace('system-design-', '') ?? 'hld';
      params.set('journalType', `system-design-${layer}-practice`);
    }
    setSpatialDirection('forward');
    navigate(`/journals/new?${params}`, { viewTransition: true });
  };
  const duplicate = (entry) => {
    const copy = createJournal({ ...entry, id: undefined, createdAt: undefined, header: `${entry.header || 'Untitled journal'} (copy)` });
    appData?.updateData((current) => ({ ...current, journalEntries: [...current.journalEntries, copy] }));
    setSpatialDirection('forward');
    navigate(`/journals/${copy.id}`, { viewTransition: true });
  };
  const remove = (entry) => {
    if (!window.confirm(`Delete "${entry.header || 'Untitled journal'}"? This cannot be undone.`)) return;
    appData?.updateData((current) => ({ ...current, journalEntries: current.journalEntries.filter((item) => item.id !== entry.id) }));
  };
  return (
    <main className="page-shell topic-journals-page" aria-label={`${topic.title} journals`}>
      <SpatialEntryPlane />
      <SpatialLink className="back-link" direction="back" to={hasChildren ? `/browse/${topic.id}` : parent ? `/browse/${parent.id}` : '/'}><ArrowLeft size={17} aria-hidden="true" /> Back</SpatialLink>
      <div className="topic-journal-toolbar">
        <label className="journal-search"><Search size={18} aria-hidden="true" /><input aria-label="Search topic journals" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a journal..." /></label>
        <button type="button" className="button button--primary" onClick={createEntry}><Plus size={18} aria-hidden="true" /> New journal</button>
      </div>
      {entries.length ? <JournalList entries={entries} onOpen={(id) => { setSpatialDirection('forward'); navigate(`/journals/${id}`, { viewTransition: true }); }} onDuplicate={duplicate} onDelete={remove} /> : (
        <div className="journal-empty" role="status"><span className="journal-empty__icon"><NotebookPen size={35} strokeWidth={1.5} aria-hidden="true" /></span><h2>{query ? 'No matching journals' : 'Your next idea starts here.'}</h2><p>{query ? 'Try a different title.' : 'Write your first journal for this topic.'}</p>{!query ? <button className="button" type="button" onClick={createEntry}>Write a journal</button> : null}</div>
      )}
    </main>
  );
}
