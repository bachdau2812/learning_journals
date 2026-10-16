import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useCatalog from '../data/catalog/useCatalog';
import CatalogItemGrid from '../components/CatalogItemGrid';
import DsaBestPracticesPage from './DsaBestPracticesPage';
import SpatialLink, { SpatialEntryPlane } from '../components/SpatialLink';

export function NotFoundPage() {
  return <main className="page-shell"><h1>Page not found</h1><Link className="back-link" to="/">Return home</Link></main>;
}

export default function BrowsePage() {
  const [toolbarTarget, setToolbarTarget] = useState(null);
  const { nodeId } = useParams();
  const { getActiveNode, getAncestors, getChildren, getNode } = useCatalog();
  const node = getNode(nodeId);
  if (!node) return <NotFoundPage />;
  if (node.isArchived) return <Navigate to={`/topics/${getActiveNode(node.id).id}`} replace />;
  const children = getChildren(node.id);
  if (node.type === 'best-practices') return <DsaBestPracticesPage node={node} items={children} />;
  if (!children.length) return <Navigate to={`/topics/${node.id}`} replace />;
  const parent = getAncestors(node.id).at(-1);
  return (
    <main className="page-shell browse-page" aria-label={node.title}>
      <SpatialEntryPlane />
      <div className="browse-toolbar">
        <SpatialLink className="back-link" direction="back" to={parent ? `/browse/${parent.id}` : '/'}><ArrowLeft size={17} aria-hidden="true" /> Back</SpatialLink>
        <div className="browse-toolbar__actions">
          {node.domain !== 'dsa' && parent && parent.type !== 'root' ? <SpatialLink className="back-link" to={`/topics/${node.id}?view=journals`}>Topic journals</SpatialLink> : null}
          <div ref={setToolbarTarget} />
        </div>
      </div>
      <CatalogItemGrid key={node.id} parent={node} items={children} toolbarTarget={toolbarTarget} />
    </main>
  );
}
