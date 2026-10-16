import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ChecklistEditor({ checklist = [], answers = [], onChange, onQuestionChange, onRemove }) {
  const answerById = new Map(answers.map((answer) => [answer.questionId, answer]));
  return (
    <fieldset className="journal-checklist">
      <legend>Your questions and answers</legend>
      <div className="journal-checklist__items">
        {checklist.map((item, index) => {
          const answer = answerById.get(item.questionId) ?? { questionId: item.questionId, status: 'todo', text: '' };
          return (
            <div className="journal-checklist__item" key={item.questionId}>
              <div className="journal-checklist__prompt">
                <label className="journal-field journal-question-field" htmlFor={`question-${item.questionId}`}>
                  <span>Question {index + 1}</span>
                  <textarea id={`question-${item.questionId}`} rows="2" value={item.text ?? ''} placeholder="What do you want to explore?" onChange={(event) => onQuestionChange(item.questionId, event.target.value)} />
                </label>
                <div className="journal-question-actions">
                  <select
                    aria-label={`Status for question ${index + 1}`}
                    value={answer.status ?? 'todo'}
                    onChange={(event) => onChange(item.questionId, { status: event.target.value })}
                  >
                    <option value="todo">Not started</option>
                    <option value="partial">Needs work</option>
                    <option value="done">Done</option>
                    <option value="na">Not applicable</option>
                  </select>
                  <button className="journal-action journal-action--danger" type="button" aria-label={`Remove question ${index + 1}`} title="Remove question" onClick={() => onRemove(item.questionId)}><Trash2 size={17} aria-hidden="true" /></button>
                </div>
              </div>
              <label className="journal-field" htmlFor={`answer-${item.questionId}`}>
                <span>Answer {index + 1}</span>
                <textarea
                  id={`answer-${item.questionId}`}
                  rows="3"
                  value={answer.text ?? ''}
                  placeholder="Write your answer..."
                  onChange={(event) => onChange(item.questionId, { text: event.target.value })}
                />
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
