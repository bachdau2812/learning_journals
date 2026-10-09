import React, { useState } from 'react';
import { inspectImport } from '../domain/persistence/backup';

export default function ImportDialog({ onImport }) {
  const [inspection, setInspection] = useState(null);
  const [reading, setReading] = useState(false);

  const chooseFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setReading(true);
    try {
      const result = inspectImport(await file.text());
      setInspection(result);
    } catch {
      setInspection({ valid: false, error: 'Could not read this file.', counts: null, data: null });
    } finally {
      setReading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="backup-import">
      <label className="button" htmlFor="backup-file">Choose JSON backup</label>
      <input id="backup-file" className="sr-only" type="file" accept="application/json,.json" onChange={chooseFile} />
      {reading ? <p className="muted" role="status">Reading backup…</p> : null}
      {inspection?.valid ? (
        <div className="backup-preview" role="status">
          <p>Backup ready: {inspection.counts.journalEntries} journals, {inspection.counts.attempts} attempts, {inspection.counts.customProblems} custom problems, {inspection.counts.customTopics} custom topics.</p>
          <div className="backup-actions">
            <button className="button button--primary" type="button" onClick={() => onImport(inspection.data, 'merge')}>Merge backup</button>
            <button className="button" type="button" onClick={() => onImport(inspection.data, 'replace')}>Replace local data</button>
          </div>
        </div>
      ) : inspection ? <p className="journal-error" role="alert">{inspection.error}</p> : null}
    </div>
  );
}
