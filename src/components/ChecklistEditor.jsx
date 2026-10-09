import React from 'react';

export default function ChecklistEditor({ checklist = [], answers = [], onChange }) {
  const answerById = new Map(answers.map((answer) => [answer.questionId, answer]));
  return (
    <fieldset className="journal-checklist">
      <legend>Checklist and answers</legend>
      <div className="journal-checklist__items">
        {checklist.map((item) => {
          const answer = answerById.get(item.questionId) ?? { questionId: item.questionId, status: 'todo', text: '' };
          return (
            <div className="journal-checklist__item" key={item.questionId}>
              <div className="journal-checklist__prompt">
                <label htmlFor={`answer-${item.questionId}`}>{item.text}</label>
                <select
                  aria-label={`Status: ${item.text}`}
                  value={answer.status ?? 'todo'}
                  onChange={(event) => onChange(item.questionId, { status: event.target.value })}
                >
                  <option value="todo">Not started</option>
                  <option value="partial">Needs work</option>
                  <option value="done">Done</option>
                  <option value="na">Not applicable</option>
                </select>
              </div>
              <textarea
                id={`answer-${item.questionId}`}
                rows="3"
                value={answer.text ?? ''}
                placeholder="Write your answer..."
                onChange={(event) => onChange(item.questionId, { text: event.target.value })}
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
