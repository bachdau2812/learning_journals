import React from 'react';
import { ArrowUpRight, Braces, Network, Cpu, NotebookPen } from 'lucide-react';
import SpatialLink from './SpatialLink';

export default function NavigationCard({ node, href }) {
  if (!node) return null;
  const Icon = node.type === 'problem' ? NotebookPen : node.domain === 'dsa' ? Braces : node.domain === 'system-design' ? Network : Cpu;
  return (
    <SpatialLink className="navigation-card spatial-card" data-spatial-id={node.id} to={href}>
      <span className="spatial-card__plane" aria-hidden="true" />
      <span className="area-card__top"><span className="navigation-card__icon"><Icon size={28} strokeWidth={1.5} aria-hidden="true" /></span><ArrowUpRight className="card-arrow" size={19} aria-hidden="true" /></span>
      <span className="navigation-card__title">{node.title}</span>
    </SpatialLink>
  );
}
