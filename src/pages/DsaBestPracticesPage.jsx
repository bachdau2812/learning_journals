import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, NotebookPen } from 'lucide-react';
import CatalogItemGrid from '../components/CatalogItemGrid';
import { dsaBestPracticeGuides } from '../data/catalog/dsa-best-practices';
import useResponsiveMotion from '../hooks/useResponsiveMotion';
import SpatialLink, { SpatialEntryPlane } from '../components/SpatialLink';

export default function DsaBestPracticesPage({ node, items }) {
  const [toolbarTarget, setToolbarTarget] = useState(null);
  const guideGridRef = useResponsiveMotion('.best-practice-card', dsaBestPracticeGuides.length);
  return (
    <main className="page-shell browse-page best-practices-page" aria-label={node.title}>
      <SpatialEntryPlane />
      <div className="browse-toolbar">
        <SpatialLink className="back-link" direction="back" to="/browse/dsa"><ArrowLeft size={17} aria-hidden="true" /> Back</SpatialLink>
        <div className="browse-toolbar__actions" ref={setToolbarTarget} />
      </div>
      <header className="best-practices-intro">
        <h1>Best Practices</h1>
        <p>Bảy bước để hiểu đề, chọn cách giải, chứng minh và trình bày lời giải rõ ràng trong buổi phỏng vấn.</p>
        <Link className="best-practices-journal-link" to={`/topics/${node.id}?view=journals`}><NotebookPen size={17} aria-hidden="true" />Ghi journal cho Best Practices</Link>
      </header>
      <div className="best-practices-grid" ref={guideGridRef}>
        {dsaBestPracticeGuides.map((guide) => (
          <article className="best-practice-card" key={guide.id}>
            <h2>{guide.title}</h2>
            <p className="best-practice-card__summary">{guide.summary}</p>
            <ul>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ul>
            <div className="best-practice-card__example"><span>Ví dụ · Two Sum</span><p>{guide.example}</p></div>
          </article>
        ))}
      </div>
      {items.length ? <h2 className="best-practices-custom-title">Chủ đề tự thêm</h2> : null}
      <CatalogItemGrid parent={node} items={items} toolbarTarget={toolbarTarget} />
    </main>
  );
}
