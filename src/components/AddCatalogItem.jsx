import React, { useEffect, useId, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../app/AppDataProvider';
import useCatalog from '../data/catalog/useCatalog';
import { createCatalogItem } from '../domain/catalog/custom-items';
import { createInkRipple } from '../hooks/useResponsiveMotion';

export default function AddCatalogItem({ parent, compact = false }) {
  const appData = useAppData();
  const navigate = useNavigate();
  const { getChildren, getAncestors } = useCatalog();
  const children = getChildren(parent.id);
  const defaultType = parent.domain === 'dsa' && (parent.type === 'pattern' || children.some((child) => child.type === 'problem')) ? 'problem' : 'topic';
  const initial = () => ({ title: '', type: defaultType, url: '', context: '', questions: '', difficulty: '' });
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const dialog = useRef(null);
  const id = useId();
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal();
    if (!open && dialog.current.open) dialog.current.close();
  }, [open]);
  const show = () => { setValues(initial()); setError(''); setOpen(true); };
  const close = () => setOpen(false);
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = (event) => {
    event.preventDefault();
    try {
      const node = createCatalogItem(values, parent, getChildren(parent.id), getAncestors(parent.id));
      const collection = node.type === 'problem' ? 'customProblems' : 'customTopics';
      const result = appData?.updateData((current) => ({ ...current, [collection]: [...(current[collection] ?? []), node] }), { immediate: true });
      if (!result?.ok) { setError(result?.error ?? 'This item could not be saved. Please try again.'); return; }
      close();
      if (compact) navigate(`/browse/${parent.id}`);
    } catch (reason) { setError(reason.message); }
  };
  const label = defaultType === 'problem' ? 'Add problem' : parent.domain === 'dsa' ? 'Add topic / problem' : 'Add topic';
  const moveMagnet = (event) => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const range = compact ? 45 : 125;
    const strength = Math.max(0, 1 - Math.hypot(x, y) / range);
    button.style.setProperty('--magnet-x', `${(x / range * strength * 12).toFixed(1)}px`);
    button.style.setProperty('--magnet-y', `${(y / range * strength * 12).toFixed(1)}px`);
  };
  const resetMagnet = (event) => {
    event.currentTarget.style.removeProperty('--magnet-x');
    event.currentTarget.style.removeProperty('--magnet-y');
  };
  return (
    <>
      <button className={compact ? 'catalog-add-button' : 'navigation-card catalog-add-button catalog-add-button--slot'} type="button" onClick={show} onPointerMove={moveMagnet} onPointerLeave={resetMagnet} onPointerDown={createInkRipple} data-open={open} aria-label={label} title={label} aria-haspopup="dialog">
        <span className="catalog-add-mark" aria-hidden="true"><Plus size={compact ? 25 : 34} strokeWidth={2} /></span>
      </button>
      <dialog className="catalog-dialog" ref={dialog} aria-labelledby={`${id}-title`} onCancel={close} onClose={close} onClick={(event) => { if (event.target === dialog.current) close(); }}>
        {open ? <form onSubmit={save}>
          <header className="catalog-dialog__heading"><div><span className="catalog-dialog__parent">{parent.title}</span><h2 id={`${id}-title`}>Add {values.type === 'problem' ? 'a problem' : values.type === 'case' ? 'a practice case' : values.type === 'lab' ? 'a lab' : 'a topic'}</h2></div><button className="journal-action" type="button" onClick={close} aria-label="Close dialog"><X size={20} aria-hidden="true" /></button></header>
          <div className="journal-form-stack">
            <label className="journal-field"><span>Title</span><input name="title" value={values.title} onChange={change} placeholder={defaultType === 'problem' ? 'e.g. My next array problem' : 'e.g. A concept to explore'} maxLength={120} required autoFocus /></label>
            <label className="journal-field"><span>Item type</span><select name="type" value={values.type} onChange={change}><option value="topic">Topic</option>{parent.domain === 'dsa' ? <option value="problem">Problem</option> : parent.domain === 'system-design' ? <option value="case">Practice case</option> : <option value="lab">Practical lab</option>}</select></label>
            {values.type === 'problem' ? <label className="journal-field"><span>Difficulty</span><select name="difficulty" value={values.difficulty} onChange={change}><option value="">Unspecified</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label> : null}
            <label className="journal-field"><span>Reference URL <small>optional</small></span><input name="url" type="url" value={values.url} onChange={change} placeholder="https://..." /></label>
            <details className="catalog-dialog__details"><summary>Context &amp; questions <span>optional</span></summary><div className="journal-form-stack">
              <label className="journal-field"><span>Scenario or problem statement</span><textarea name="context" rows="3" value={values.context} onChange={change} placeholder="What would you like to study or solve?" /></label>
              <label className="journal-field"><span>Questions</span><textarea name="questions" rows="3" value={values.questions} onChange={change} placeholder="One question per line" /></label>
            </div></details>
          </div>
          {error ? <p className="journal-error" role="alert">{error}</p> : null}
          <footer className="catalog-dialog__actions"><button className="button" type="button" onClick={close}>Cancel</button><button className="button button--primary" type="submit"><Plus size={17} aria-hidden="true" />Save item</button></footer>
        </form> : null}
      </dialog>
    </>
  );
}
