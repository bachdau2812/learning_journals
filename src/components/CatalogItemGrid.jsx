import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckSquare, X, Trash2, LockKeyhole } from 'lucide-react';
import { useAppData } from '../app/AppDataProvider';
import useCatalog from '../data/catalog/useCatalog';
import { collectCatalogBranch, deleteCatalogItems } from '../domain/catalog/custom-items';
import NavigationCard from './NavigationCard';
import AddCatalogItem from './AddCatalogItem';
import useResponsiveMotion from '../hooks/useResponsiveMotion';

export default function CatalogItemGrid({ parent, items, toolbarTarget }) {
  const { catalog } = useCatalog();
  const appData = useAppData();
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [error, setError] = useState('');
  const editable = items.filter((item) => item.isCustom === true);
  const gridRef = useResponsiveMotion('.navigation-card:not(.catalog-add-button):not(.catalog-protected-card)', `${items.length}:${selecting}`);
  useEffect(() => { setSelected((current) => new Set([...current].filter((id) => items.some((item) => item.id === id && item.isCustom === true)))); }, [items]);
  const cancel = () => { setSelecting(false); setSelected(new Set()); setError(''); };
  const toggle = (id) => setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const remove = () => {
    const ids = [...selected].filter((id) => editable.some((item) => item.id === id));
    if (!ids.length) return;
    const branch = collectCatalogBranch(ids, catalog);
    if (!window.confirm(`Delete ${ids.length} selected item${ids.length === 1 ? '' : 's'}${branch.size > ids.length ? ` and ${branch.size - ids.length} nested item${branch.size - ids.length === 1 ? '' : 's'}` : ''}? Existing journals will stay in Journals.`)) return;
    const result = appData?.updateData((current) => deleteCatalogItems(current, ids, catalog), { immediate: true });
    if (!result?.ok) { setError(result?.error ?? 'The selected items could not be deleted.'); return; }
    cancel();
  };
  return (
    <section className="catalog-items" aria-label={`${parent.title} topics`}>
      {toolbarTarget ? createPortal(<div className="catalog-selection-toolbar">
        {selecting ? <><label className="catalog-select-all"><input type="checkbox" checked={editable.length > 0 && selected.size === editable.length} onChange={(event) => setSelected(event.target.checked ? new Set(editable.map((item) => item.id)) : new Set())} />Select all custom items</label><span className="catalog-selection-count" role="status">{selected.size} selected</span><button className="catalog-delete" type="button" disabled={!selected.size} onClick={remove}><Trash2 size={16} aria-hidden="true" />Delete selected</button><button className="catalog-select-button" type="button" onClick={cancel}><X size={16} aria-hidden="true" />Cancel</button></> : <button className="catalog-select-button" type="button" disabled={!editable.length} title={editable.length ? 'Select your custom items' : 'Built-in items cannot be deleted'} onClick={() => setSelecting(true)}><CheckSquare size={16} aria-hidden="true" />Select items</button>}
      </div>, toolbarTarget) : null}
      {error ? <p className="journal-error" role="alert">{error}</p> : null}
      <div className="navigation-grid" ref={gridRef}>
        {items.map((item) => selecting ? item.isCustom === true ? <label className={`navigation-card catalog-select-card${selected.has(item.id) ? ' catalog-select-card--selected' : ''}`} key={item.id}><span className="area-card__top"><span className="navigation-card__icon"><CheckSquare size={25} strokeWidth={1.5} aria-hidden="true" /></span><input type="checkbox" aria-label={`Select ${item.title}`} checked={selected.has(item.id)} onChange={() => toggle(item.id)} /></span><span className="navigation-card__title">{item.title}</span></label> : <div className="navigation-card catalog-protected-card" key={item.id}><span className="area-card__top"><span className="navigation-card__icon"><LockKeyhole size={23} strokeWidth={1.5} aria-hidden="true" /></span><span className="catalog-protected-label">Built-in</span></span><span className="navigation-card__title">{item.title}</span></div> : <NavigationCard key={item.id} node={item} href={item.children?.length || item.type === 'best-practices' ? `/browse/${item.id}` : `/topics/${item.id}`} />)}
        <AddCatalogItem parent={parent} />
      </div>
    </section>
  );
}
