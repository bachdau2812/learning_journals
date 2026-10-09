import React from 'react';
import { ArrowUpRight, Braces, Network, Cpu } from 'lucide-react';
import useResponsiveMotion from '../hooks/useResponsiveMotion';
import SpatialLink from '../components/SpatialLink';

const areas = [
  { title: 'DSA', icon: Braces, tone: 'mint', path: '/browse/dsa' },
  { title: 'System Design', icon: Network, tone: 'blue', path: '/browse/system-design' },
  { title: 'CS Fundamentals', icon: Cpu, tone: 'peach', path: '/browse/cs-fundamentals' },
];

export default function HomePage() {
  const gridRef = useResponsiveMotion('.area-card', areas.length);
  return (
    <main className="home-page" aria-label="Engineering Learning Journal">
      <nav className="area-grid" aria-label="Learning areas" ref={gridRef}>
        {areas.map((area) => (
          <SpatialLink className={`area-card spatial-card area-card--${area.tone}`} data-spatial-id={area.path.slice(1)} to={area.path} key={area.title}>
            <span className="spatial-card__plane" aria-hidden="true" />
            <span className="area-card__top"><span className="area-card__icon"><area.icon size={38} strokeWidth={1.5} aria-hidden="true" /></span><ArrowUpRight className="card-arrow" size={23} aria-hidden="true" /></span>
            <span className="area-card__title">{area.title}</span>
          </SpatialLink>
        ))}
      </nav>
    </main>
  );
}
