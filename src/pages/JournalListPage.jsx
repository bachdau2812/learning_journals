import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../app/AppDataProvider';
import { createJournal } from '../domain/journals/journal';
import { filterJournals, sortJournals } from '../domain/journals/search';
import JournalList from '../components/JournalList';
import { setSpatialDirection } from '../components/SpatialLink';
import useCatalog from '../data/catalog/useCatalog';

export default function JournalListPage() {
  const appData = useAppData();
  const { getNode } = useCatalog();
  const data = appData?.data ?? { journalEntries: [] };
  const updateData = appData?.updateData ?? (() => {});
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ query: '', domain: '', journalType: '', reviewStatus: '', dateFrom: '', dateTo: '' });
  const [sort, setSort] = useState('newest');
  const enrichedEntries = useMemo(() => (data.journalEntries ?? []).map((entry) => {
    const problem = entry.problemId ? getNode(entry.problemId) : null;
    return { ...entry, problemTitle: entry.problemTitle ?? problem?.title, leetcodeId: entry.leetcodeId ?? problem?.leetcodeId };
  }), [data.journalEntries, getNode]);
  const entries = useMemo(() => sortJournals(filterJournals(enrichedEntries, filters), sort), [enrichedEntries, filters, sort]);
  const setFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }));
  const duplicate = (entry) => {
    const copy = createJournal({ ...entry, id: undefined, header: `${entry.header || 'Untitled journal'} (copy)`, createdAt: undefined, updatedAt: undefined });
    updateData((current) => ({ ...current, journalEntries: [...(current.journalEntries ?? []), copy] }));
    setSpatialDirection('forward');
    navigate(`/journals/${copy.id}`, { viewTransition: true });
  };
  const remove = (entry) => {
    if (!window.confirm(`Delete “${entry.header || 'Untitled journal'}”? This cannot be undone.`)) return;
    updateData((current) => ({ ...current, journalEntries: (current.journalEntries ?? []).filter((item) => item.id !== entry.id) }));
  };
  return (
    <main className="page-shell journal-list-page" aria-labelledby="journals-title">
      <p className="eyebrow">Engineering Learning Journal</p>
      <div className="journal-list-heading"><div><h1 id="journals-title">Journals</h1><p className="page-intro">Search and revisit every study attempt.</p></div><button className="button button--primary" type="button" onClick={() => { setSpatialDirection('forward'); navigate('/journals/new', { viewTransition: true }); }}>New journal</button></div>
      <details className="journal-filters" open>
        <summary>Search and filters</summary>
        <div className="journal-filter-grid">
          <label className="journal-field"><span>Search</span><input aria-label="Search journals" value={filters.query} onChange={(event) => setFilter('query', event.target.value)} placeholder="Header, problem, or ID" /></label>
          <label className="journal-field"><span>Domain</span><select value={filters.domain} onChange={(event) => setFilter('domain', event.target.value)}><option value="">All domains</option><option value="dsa">DSA</option><option value="system-design">System Design</option><option value="cs">CS Fundamentals</option><option value="others">Others</option></select></label>
          <label className="journal-field"><span>Layer</span><select value={filters.layer ?? ''} onChange={(event) => setFilter('layer', event.target.value)}><option value="">All layers</option><option value="lld">LLD</option><option value="hld">HLD</option><option value="distributed">Distributed</option></select></label>
          <label className="journal-field"><span>Topic</span><input value={filters.topicId ?? ''} onChange={(event) => setFilter('topicId', event.target.value)} placeholder="Topic ID" /></label>
          <label className="journal-field"><span>Journal type</span><input value={filters.journalType ?? ''} onChange={(event) => setFilter('journalType', event.target.value)} placeholder="Type" /></label>
          <label className="journal-field"><span>Review status</span><select value={filters.reviewStatus} onChange={(event) => setFilter('reviewStatus', event.target.value)}><option value="">All statuses</option><option value="not-reviewed">Not reviewed</option><option value="needs-work">Needs work</option><option value="reviewed">Reviewed</option></select></label>
          <label className="journal-field"><span>From</span><input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} /></label>
          <label className="journal-field"><span>To</span><input type="date" value={filters.dateTo} onChange={(event) => setFilter('dateTo', event.target.value)} /></label>
          <label className="journal-field"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest study date</option><option value="oldest">Oldest study date</option><option value="a-z">A–Z</option><option value="recently-updated">Recently updated</option></select></label>
        </div>
      </details>
      <JournalList entries={entries} onOpen={(id) => { setSpatialDirection('forward'); navigate(`/journals/${id}`, { viewTransition: true }); }} onDuplicate={duplicate} onDelete={remove} />
    </main>
  );
}
