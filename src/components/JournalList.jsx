import React from 'react';
import { ArrowUpRight, CalendarDays, Copy, Pencil, Trash2, NotebookPen } from 'lucide-react';
import { dateLabel, journalTypeLabel, reviewLabel } from '../domain/journals/presentation';
import useResponsiveMotion from '../hooks/useResponsiveMotion';

export default function JournalList({ entries, onOpen, onDuplicate, onDelete }) {
  const listRef = useResponsiveMotion('.journal-list__item', entries.length);
  if (!entries.length) return <div className="journal-empty" role="status"><NotebookPen size={32} aria-hidden="true" /><h2>No journals yet</h2><p>No journals match these filters.</p></div>;
  return (
    <div className="journal-list" aria-label="Journal history" ref={listRef}>
      {entries.map((entry) => {
        const answers = entry.checklist?.length
          ? (entry.questionAnswers ?? []).filter((answer) => entry.checklist.some((item) => item.questionId === answer.questionId))
          : entry.questionAnswers ?? [];
        const completed = answers.filter((answer) => answer.status === 'done').length;
        return (
          <article className="journal-list__item" key={entry.id}>
            <div className="journal-card__top"><span className="journal-card__type">{journalTypeLabel(entry.journalType)}</span><span className={`review-badge review-badge--${entry.reviewStatus ?? 'not-reviewed'}`}>{reviewLabel(entry.reviewStatus)}</span></div>
            <h2><button className="journal-card__title" type="button" onClick={() => onOpen(entry.id)}>{entry.header || 'Untitled journal'}<ArrowUpRight size={20} aria-hidden="true" /></button></h2>
            <p className="journal-card__excerpt">{entry.takeaway || entry.others || 'An idea in progress. Open your journal to keep writing.'}</p>
            <div className="journal-card__footer">
              <div className="journal-card__meta"><span><CalendarDays size={14} aria-hidden="true" />{dateLabel(entry.studyDate)}</span>{answers.length ? <span>{completed}/{answers.length} complete</span> : null}{entry.reviewDate ? <span>Review {dateLabel(entry.reviewDate)}</span> : null}</div>
              <div className="journal-list__actions">
                <button className="journal-action" type="button" aria-label="Open" title="Open journal" onClick={() => onOpen(entry.id)}><ArrowUpRight size={17} aria-hidden="true" /></button>
                <button className="journal-action" type="button" aria-label="Edit" title="Edit journal" onClick={() => onOpen(entry.id)}><Pencil size={16} aria-hidden="true" /></button>
                <button className="journal-action" type="button" aria-label="Duplicate" title="Duplicate journal" onClick={() => onDuplicate(entry)}><Copy size={16} aria-hidden="true" /></button>
                <button className="journal-action journal-action--danger" type="button" aria-label="Delete" title="Delete journal" onClick={() => onDelete(entry)}><Trash2 size={16} aria-hidden="true" /></button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
