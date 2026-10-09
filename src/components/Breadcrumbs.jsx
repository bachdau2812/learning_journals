import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.href ?? item.label}-${index}`}>
              {isCurrent || !item.href ? (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link to={item.href}>{item.label}</Link>
              )}
              {!isCurrent ? <span className="breadcrumbs__separator" aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
