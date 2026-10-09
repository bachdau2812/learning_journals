import React from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../app/AppDataProvider';
import useCatalog from '../data/catalog/useCatalog';
import { calculateOverview } from '../domain/progress/progress';

export default function OverviewPage() {
  const data = useAppData()?.data ?? { journalEntries: [] };
  const { catalog } = useCatalog();
  const overview = calculateOverview(data, catalog);
  return (
    <main className="page-shell overview-page" aria-labelledby="overview-title">
      <p className="eyebrow">Engineering Learning Journal</p><h1 id="overview-title">Overview</h1>
      <p className="page-intro">A quiet view of what you have practiced and what deserves another pass.</p>
      <div className="overview-grid">
        <section className="overview-section" aria-labelledby="overview-dsa"><h2 id="overview-dsa">DSA</h2><p>{overview.dsa.uniqueAttempted} unique problems · {overview.dsa.totalAttempts} attempts · {overview.dsa.uniqueSolved} solved</p><p className="muted">{overview.dsa.independentSolveRate == null ? 'Solve results will show a rate after your first recorded result.' : `${Math.round(overview.dsa.independentSolveRate * 100)}% independent solve rate`}</p></section>
        <section className="overview-section" aria-labelledby="overview-system"><h2 id="overview-system">System Design</h2><p>{overview.systemDesign.topics} topics · {overview.systemDesign.notes} notes · {overview.systemDesign.practice} practice journals</p></section>
        <section className="overview-section" aria-labelledby="overview-cs"><h2 id="overview-cs">CS Fundamentals</h2><p>{overview.cs.topics} topics · {overview.cs.notes} notes · {overview.cs.labs} labs</p></section>
      </div>
      <section className="overview-section" aria-labelledby="continue-title"><h2 id="continue-title">Continue learning</h2>{overview.continueLearning ? <Link to={`/journals/${overview.continueLearning.id}`}>{overview.continueLearning.header || 'Open your latest journal'}</Link> : <p className="muted">Create a journal to see your next step here.</p>}</section>
      <section className="overview-section" aria-labelledby="review-title"><h2 id="review-title">Topics to review</h2>{overview.topicsToReview.length ? <ul>{overview.topicsToReview.map((entry) => <li key={entry.id}><Link to={`/journals/${entry.id}`}>{entry.header || entry.topicId || 'Untitled journal'}</Link></li>)}</ul> : <p className="muted">Nothing is due for review.</p>}</section>
    </main>
  );
}
