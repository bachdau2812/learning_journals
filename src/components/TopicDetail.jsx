import React, { useMemo, useState } from 'react';
import { getNode } from '../data/catalog';

const statuses = [
  ['understood', 'Understood'],
  ['partial', 'Partial'],
  ['need-review', 'Need Review'],
];

function ItemList({ items = [], className = '' }) {
  if (!items.length) return <p className="muted">No items added yet.</p>;
  return <ul className={className}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export default function TopicDetail({
  topic,
  progress = {},
  onCreateJournal,
  onToggleConcept,
  onQuestionStatusChange,
}) {
  const [openConcepts, setOpenConcepts] = useState(() => progress.openConcepts ?? {});
  const questionStatuses = progress.questions ?? {};
  const completedConcepts = progress.concepts ?? {};
  const concepts = topic?.concepts ?? [];
  const questions = topic?.questions ?? [];
  const resources = topic?.resources ?? [];
  const practice = (topic?.practice ?? topic?.problems ?? []).map((item) => {
    if (typeof item !== 'string') return item;
    return getNode(item)?.title ?? item;
  });
  const contexts = topic?.contexts ?? [];
  const overview = topic?.description || contexts[0] || 'Build a durable mental model, then apply it through focused practice.';
  const conceptGroups = useMemo(() => {
    if (!concepts.length) return [];
    return [{ id: 'core', title: 'Core concepts', items: concepts }];
  }, [concepts]);

  if (!topic) return null;

  const updateConcept = (id) => {
    const next = !openConcepts[id];
    setOpenConcepts((current) => ({ ...current, [id]: next }));
  };

  const updateConceptCompletion = (id, completed) => {
    onToggleConcept?.(id, completed);
  };

  const totalConcepts = conceptGroups.reduce((total, group) => total + group.items.length, 0);
  const completedCount = conceptGroups.reduce(
    (total, group) => total + group.items.filter((item) => completedConcepts[item] === true).length,
    0,
  );

  return (
    <article className="topic-detail">
      <section className="topic-section topic-section--overview" aria-labelledby="topic-overview-heading">
        <h2 id="topic-overview-heading">Overview</h2>
        <p>{overview}</p>
        {contexts.length > 0 ? <p className="topic-context">Use cases: {contexts.join(' · ')}</p> : null}
        <button type="button" className="button button--primary" onClick={() => onCreateJournal?.(topic)}>
          Create journal entry
        </button>
      </section>

      <section className="topic-section" aria-labelledby="topic-learn-heading">
        <h2 id="topic-learn-heading">What to Learn</h2>
        <p className="topic-progress" aria-label="Concept progress">
          {completedCount}/{totalConcepts} concepts complete
        </p>
        <div className="concept-groups">
          {conceptGroups.map((group) => (
            <details key={group.id} open={openConcepts[group.id] !== false}>
              <summary onClick={(event) => { event.preventDefault(); updateConcept(group.id); }}>
                {group.title} <span aria-hidden="true">{openConcepts[group.id] === false ? '+' : '−'}</span>
              </summary>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>
                    <label className="concept-item">
                      <input
                        type="checkbox"
                        aria-label={`Mark ${item} complete`}
                        checked={completedConcepts[item] === true}
                        onChange={(event) => updateConceptCompletion(item, event.target.checked)}
                      />
                      <span>{item}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="topic-questions-heading">
        <h2 id="topic-questions-heading">Key Questions</h2>
        {questions.length ? (
          <ul className="question-list">
            {questions.map((question) => (
              <li key={question}>
                <span>{question}</span>
                <label>
                  <span className="sr-only">Status for {question}</span>
                  <select
                    value={questionStatuses[question] ?? ''}
                    onChange={(event) => onQuestionStatusChange?.(question, event.target.value)}
                  >
                    <option value="">Set status</option>
                    {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        ) : <p className="muted">No questions added yet.</p>}
      </section>

      <section className="topic-section" aria-labelledby="topic-practice-heading">
        <h2 id="topic-practice-heading">Practice</h2>
        <ItemList items={practice} />
      </section>

      <section className="topic-section" aria-labelledby="topic-resources-heading">
        <h2 id="topic-resources-heading">Learning Resources</h2>
        {resources.length ? <ul>{resources.map((resource) => <li key={resource}><a href={resource} target="_blank" rel="noreferrer">{resource}</a></li>)}</ul> : <p className="muted">No resources added yet.</p>}
      </section>

      <section className="topic-section" aria-labelledby="topic-related-heading">
        <h2 id="topic-related-heading">Related Journals</h2>
        <p className="muted">Your related journal entries will appear here.</p>
        <button type="button" className="button" onClick={() => onCreateJournal?.(topic)}>Start a journal entry</button>
      </section>
    </article>
  );
}
