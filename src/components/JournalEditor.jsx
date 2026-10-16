import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, Check, LoaderCircle, AlertCircle, Bookmark, Link2, Feather, Plus } from 'lucide-react';
import ChecklistEditor from './ChecklistEditor';
import { journalTypeLabel } from '../domain/journals/presentation';
import { addJournalQuestion, removeJournalQuestion } from '../domain/journals/journal';

function Field({ label, name, value, onChange, ...props }) {
  return <label className="journal-field"><span>{label}</span><input name={name} value={value ?? ''} onChange={(event) => onChange(name, event.target.value)} {...props} /></label>;
}

function JournalTitle({ value, onChange }) {
  const field = useRef(null);
  const resize = useCallback(() => {
    if (!field.current) return;
    field.current.style.height = 'auto';
    field.current.style.height = `${field.current.scrollHeight}px`;
  }, []);
  useLayoutEffect(resize, [resize, value]);
  useEffect(() => {
    window.addEventListener('resize', resize);
    document.fonts?.ready.then(resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);
  return <label className="editor-title-field"><span className="sr-only">Header</span><textarea ref={field} rows="1" name="header" value={value ?? ''} onChange={(event) => onChange('header', event.target.value)} placeholder="Give your thoughts a title..." autoFocus required aria-required="true" /></label>;
}

const artifactFields = {
  lld: [['classDiagram', 'Class diagram'], ['sourceCode', 'Source code'], ['testResults', 'Test results'], ['designDecisions', 'Design decisions']],
  hld: [['architectureDiagram', 'Architecture diagram'], ['capacityEstimation', 'Capacity estimation'], ['assumptions', 'Assumptions'], ['designDecisions', 'Design decisions'], ['tradeoffs', 'Trade-offs']],
  distributed: [['reproductionSteps', 'Reproduction steps'], ['testResults', 'Test results'], ['logs', 'Logs'], ['metrics', 'Metrics'], ['failureAnalysis', 'Failure analysis'], ['sourceCode', 'Source code']],
  lab: [['commands', 'Commands'], ['sourceCode', 'Source code'], ['environment', 'Environment'], ['testData', 'Test data'], ['logs', 'Logs'], ['measurements', 'Measurements'], ['conclusion', 'Conclusion']],
};

export default function JournalEditor({ journal, topic, checklist, saveStatus, saveError, customProblemError, onCreateCustomProblem, onChange, onQuestionsChange, onBack }) {
  const updateAnswer = useCallback((questionId, patch) => {
    const answers = (journal.questionAnswers ?? []).map((answer) => answer.questionId === questionId ? { ...answer, ...patch } : answer);
    if (!answers.some((answer) => answer.questionId === questionId)) answers.push({ questionId, status: 'todo', text: '', ...patch });
    onChange('questionAnswers', answers);
  }, [journal.questionAnswers, onChange]);
  const topicTitle = topic?.title;
  const focus = topic?.interviewFocus;
  const sourceLinks = (focus?.sourceLinks ?? []).filter((source) => /^https?:\/\//i.test(source.url));
  const artifacts = journal.journalType === 'cs-lab' ? artifactFields.lab : journal.journalType?.endsWith('practice') ? artifactFields[journal.layer] : null;
  const completed = (journal.questionAnswers ?? []).filter((answer) => answer.status === 'done' && checklist.some((item) => item.questionId === answer.questionId)).length;
  return (
    <main className="page-shell journal-editor-page" aria-labelledby="journal-title">
      <div className="editor-toolbar">
        <button className="back-link button-reset" type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" /> Back to journals</button>
        <span className={`save-indicator save-indicator--${saveStatus}`} role="status" aria-live="polite">
          {saveStatus === 'saving' ? <LoaderCircle size={15} className="saving-spinner" aria-hidden="true" /> : saveStatus === 'error' ? <AlertCircle size={15} aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save error' : 'Saved'}
        </span>
      </div>
      {saveError ? <p role="alert" className="journal-error">{saveError}</p> : null}
      <div className="editor-paper">
        <header className="journal-editor-header">
          <span className="editor-note-type"><Feather size={15} aria-hidden="true" />{journalTypeLabel(journal.journalType)}{topicTitle ? ` / ${topicTitle}` : ''}</span>
          <h1 id="journal-title" className="sr-only">Journal entry</h1>
          <JournalTitle value={journal.header} onChange={onChange} />
        </header>
        {focus ? <details className="editor-interview-focus"><summary>{topic.isCustom ? 'Your topic context' : 'Interview focus & references'}</summary><div>{focus.scenario ? <p>{focus.scenario}</p> : null}{sourceLinks.length ? <ul>{sourceLinks.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<Link2 size={13} aria-hidden="true" /></a></li>)}</ul> : null}</div></details> : null}
        <section className="journal-section editor-metadata" aria-label="Journal information">
          <div className="journal-form-grid">
            <Field label="Study date" name="studyDate" type="date" value={journal.studyDate} onChange={onChange} required />
            <label className="journal-field"><span>Domain</span><select value={journal.domain} onChange={(event) => onChange('domain', event.target.value)}><option value="dsa">DSA</option><option value="system-design">System Design</option><option value="cs">CS Fundamentals</option><option value="others">Others</option></select></label>
            <label className="journal-field"><span>Journal type</span><select value={journal.journalType} onChange={(event) => onChange('journalType', event.target.value)}>
              {journal.domain === 'dsa' ? <><option value="dsa-problem-solving">Problem solving</option><option value="dsa-concept-learning">Concept learning</option><option value="dsa-review">Review</option></> : null}
              {journal.domain === 'system-design' ? <><option value={`system-design-${journal.layer ?? 'lld'}-study`}>Knowledge study</option><option value={`system-design-${journal.layer ?? 'lld'}-practice`}>Practice</option><option value={`system-design-${journal.layer ?? 'lld'}-review`}>Review</option></> : null}
              {journal.domain === 'cs' ? <><option value="cs-knowledge">Knowledge</option><option value="cs-lab">Practical lab</option></> : null}
              {journal.domain === 'others' ? <option value="others">Personal note</option> : null}
            </select></label>
            {journal.domain === 'system-design' ? <label className="journal-field"><span>System Design layer</span><select value={journal.layer ?? 'lld'} onChange={(event) => onChange('layer', event.target.value)}><option value="lld">Low-Level Design</option><option value="hld">High-Level Design</option><option value="distributed">Distributed Systems</option></select></label> : null}
            {journal.domain === 'dsa' ? <>
              <Field label="Duration (minutes)" name="duration" type="number" min="0" value={journal.duration} onChange={onChange} placeholder="30" />
              <Field label="Language" name="language" value={journal.language} onChange={onChange} placeholder="Java, Python..." />
              <label className="journal-field"><span>Result</span><select value={journal.result ?? ''} onChange={(event) => onChange('result', event.target.value)}><option value="">Select result</option><option>Solved independently</option><option>Solved with hint</option><option>Viewed solution</option><option>Unsolved</option></select></label>
            </> : null}
          </div>
        </section>
        {journal.domain === 'dsa' && journal.journalType === 'dsa-problem-solving' && !journal.problemId ? <details className="custom-problem-form"><summary><Plus size={16} aria-hidden="true" /> Add a custom problem</summary><div className="journal-form-grid">
          <Field label="Problem title" name="problemTitle" value={journal.problemTitle} onChange={onChange} /><Field label="Problem URL" name="problemUrl" type="url" value={journal.problemUrl} onChange={onChange} placeholder="https://..." /><Field label="Difficulty" name="difficulty" value={journal.difficulty} onChange={onChange} placeholder="Easy, Medium, or Hard" /><Field label="Pattern IDs" name="patternIdsText" value={journal.patternIdsText} onChange={onChange} placeholder="arrays, two-pointers" />
        </div><button className="button" type="button" onClick={onCreateCustomProblem}>Save custom problem</button>{customProblemError ? <p className="journal-error" role="alert">{customProblemError}</p> : null}</details> : null}
        <section className="journal-section editor-answers" aria-label="Your questions">
          <div className="editor-section-heading"><span>Your questions</span>{checklist.length ? <span>{completed}/{checklist.length} complete</span> : null}</div>
          {checklist.length ? (
            <ChecklistEditor
              checklist={checklist}
              answers={journal.questionAnswers}
              onChange={updateAnswer}
              onQuestionChange={(questionId, text) => onChange('checklist', checklist.map((item) => item.questionId === questionId ? { ...item, text } : item))}
              onRemove={(questionId) => onQuestionsChange(removeJournalQuestion(journal, questionId))}
            />
          ) : <p className="muted journal-questions-empty">Add a question you want to explore, then write your answer.</p>}
          <button className="button journal-add-question" type="button" onClick={() => onQuestionsChange(addJournalQuestion(journal))}><Plus size={17} aria-hidden="true" />Add question</button>
        </section>
        <section className="journal-section journal-form-stack editor-reflections" aria-label="Reflections">
          <label className="journal-field"><span className="editor-field-heading"><Bookmark size={17} aria-hidden="true" />Key takeaways</span><textarea rows="5" placeholder="The ideas you want to remember." value={journal.takeaway ?? ''} onChange={(event) => onChange('takeaway', event.target.value)} /></label>
          <label className="journal-field"><span className="editor-field-heading"><Link2 size={17} aria-hidden="true" />References</span><textarea rows="2" placeholder="One URL or reference per line" value={(journal.references ?? []).join('\n')} onChange={(event) => onChange('references', event.target.value.split(/\n/))} /></label>
        </section>
        {artifacts ? <details className="editor-artifacts"><summary>Practice notes &amp; evidence</summary><div className="journal-form-stack">{artifacts.map(([name, label]) => <label className="journal-field" key={name}><span>{label}</span><textarea rows="3" value={journal[name] ?? ''} onChange={(event) => onChange(name, event.target.value)} /></label>)}</div></details> : null}
      </div>
      <div className="editor-bottom"><button className="button button--primary" type="button" onClick={onBack}><Check size={17} aria-hidden="true" /> Done</button></div>
    </main>
  );
}
