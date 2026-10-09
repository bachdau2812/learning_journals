import React, { useRef, useState } from 'react';
import { useAppData } from '../app/AppDataProvider';
import { createDefaultAppData } from '../domain/persistence/schema';
import { exportAppData, mergeAppData, replaceAppData } from '../domain/persistence/backup';
import { deleteCustomProblem } from '../domain/journals/journal';
import ImportDialog from '../components/ImportDialog';
import useCatalog from '../data/catalog/useCatalog';
import { deleteCatalogItems } from '../domain/catalog/custom-items';

export default function SettingsPage() {
  const { catalog } = useCatalog();
  const { data, updateData, saveStatus, saveError } = useAppData() ?? {
    data: createDefaultAppData(), updateData: () => {}, saveStatus: 'saved', saveError: null,
  };
  const [message, setMessage] = useState('');
  const downloadRef = useRef(null);

  const exportBackup = () => {
    const blob = new Blob([exportAppData(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadRef.current = document.createElement('a');
    downloadRef.current.href = url;
    downloadRef.current.download = 'engineering-learning-journal-backup.json';
    downloadRef.current.click();
    URL.revokeObjectURL(url);
    setMessage('Backup exported.');
  };

  const importBackup = (incoming, mode) => {
    const next = mode === 'merge' ? mergeAppData(data, incoming) : replaceAppData(incoming);
    if (!next) {
      setMessage('The backup could not be imported.');
      return;
    }
    const result = updateData(next, { immediate: true });
    if (result && !result.ok) { setMessage(result.error); return; }
    setMessage(mode === 'merge' ? 'Backup merged.' : 'Local data replaced from backup.');
  };

  const clearData = () => {
    if (!window.confirm('Clear all local journal data? This cannot be undone unless you have a backup.')) return;
    const result = updateData(createDefaultAppData(), { immediate: true });
    if (result && !result.ok) { setMessage(result.error); return; }
    setMessage('Local data cleared.');
  };

  const removeCustomProblem = (problem) => {
    const pending = deleteCustomProblem(data, problem.id);
    if (pending.requiresConfirmation && !window.confirm(pending.warning)) return;
    const result = updateData((current) => deleteCatalogItems(current, [problem.id], catalog), { immediate: true });
    if (result && !result.ok) { setMessage(result.error); return; }
    setMessage('Custom problem deleted; its attempt history was kept.');
  };

  return (
    <main className="page-shell" aria-labelledby="page-title">
      <p className="eyebrow">Engineering Learning Journal</p>
      <h1 id="page-title">Settings</h1>
      <section className="notice" aria-labelledby="local-data-title">
        <h2 id="local-data-title">Local data</h2>
        <p>
          Your journal is stored in this browser for this site origin. Clearing browser data can remove it,
          and local data does not sync between devices.
        </p>
        <div className="backup-controls">
          <button className="button button--primary" type="button" onClick={exportBackup}>Export JSON backup</button>
          <ImportDialog onImport={importBackup} />
          <button className="button button--danger" type="button" onClick={clearData}>Clear local data</button>
        </div>
        <p className="muted">Save status: {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'error' ? 'Error' : 'Saved'}</p>
        {saveError ? <p className="journal-error" role="alert">{saveError}</p> : null}
        {message ? <p role="status">{message}</p> : null}
        {data.customProblems?.length ? <div className="custom-problem-list"><h3>Custom DSA problems</h3>{data.customProblems.map((problem) => <div className="custom-problem-row" key={problem.id}><span>{problem.title}</span><button className="button button--danger" type="button" onClick={() => removeCustomProblem(problem)}>Delete problem</button></div>)}</div> : null}
      </section>
    </main>
  );
}
