import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppData } from '../app/AppDataProvider';
import JournalEditor from '../components/JournalEditor';
import { createCustomProblem, createJournal, getJournalTemplate, restoreJournalQuestions, updateJournal } from '../domain/journals/journal';
import { createDefaultAppData } from '../domain/persistence/schema';
import useCatalog from '../data/catalog/useCatalog';
import { setSpatialDirection } from '../components/SpatialLink';

function JournalEditorContent() {
  const { journalId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getAncestors, getNode } = useCatalog();
  const appData = useAppData();
  const { data, updateData, saveStatus, saveError } = appData ?? {
    data: createDefaultAppData(),
    updateData: () => {},
    saveStatus: 'saved',
    saveError: null,
  };
  const existing = useMemo(() => data.journalEntries?.find((entry) => entry.id === journalId), [data.journalEntries, journalId]);
  const selectedTopicId = searchParams.get('topicId') ?? existing?.topicId;
  const catalogTopic = getNode(selectedTopicId);
  const layerFromCatalog = getAncestors(selectedTopicId).map((node) => node.id).find((id) => ['system-design-lld', 'system-design-hld', 'system-design-distributed'].includes(id));
  const inferredLayer = layerFromCatalog?.replace('system-design-', '') ?? null;
  const createdRef = useRef(false);
  const [customProblemError, setCustomProblemError] = useState('');
  const [journal, setJournal] = useState(() => {
    if (existing) return restoreJournalQuestions(existing, catalogTopic?.questions);
    const domain = searchParams.get('domain') ?? catalogTopic?.domain ?? 'others';
    const layer = searchParams.get('layer') ?? inferredLayer;
    const journalType = searchParams.get('journalType') ?? (domain === 'dsa' ? 'dsa-problem-solving' : domain === 'cs' ? 'cs-knowledge' : domain === 'system-design' ? `system-design-${layer ?? 'lld'}-study` : 'others');
    return createJournal({
      ...getJournalTemplate({ domain, journalType, layer, topicId: searchParams.get('topicId'), problemId: searchParams.get('problemId') }),
      problemTitle: searchParams.get('problemId') ? getNode(searchParams.get('problemId'))?.title : undefined,
      leetcodeId: searchParams.get('problemId') ? getNode(searchParams.get('problemId'))?.leetcodeId : undefined,
      header: searchParams.get('header') ?? '',
    });
  });

  useEffect(() => {
    if (journalId || existing || createdRef.current) return;
    createdRef.current = true;
    updateData((current) => ({ ...current, journalEntries: [...(current.journalEntries ?? []), journal] }));
    if (appData) navigate(`/journals/${journal.id}`, { replace: true });
  }, [appData, existing, journal, navigate, updateData]);

  if (journalId && !existing) return <main className="page-shell"><p className="eyebrow">Journal</p><h1>Journal not found</h1><button className="button" type="button" onClick={() => navigate('/journals')}>Back to journals</button></main>;

  const saveChanges = (changes) => {
    const patch = { checklist: journal.checklist ?? [], questionAnswers: journal.questionAnswers ?? [], ...changes };
    setJournal((current) => ({ ...current, ...patch }));
    updateData((current) => updateJournal(current, journal.id, patch));
  };

  const onChange = (field, value) => {
    if (field === 'domain') {
      const nextLayer = value === 'system-design' ? (journal.layer ?? 'lld') : null;
      const nextType = value === 'dsa' ? 'dsa-problem-solving' : value === 'cs' ? 'cs-knowledge' : value === 'system-design' ? `system-design-${nextLayer}-study` : 'others';
      saveChanges({ domain: value, layer: nextLayer, journalType: nextType });
      return;
    }
    if (field === 'journalType') {
      const nextLayer = value.startsWith('system-design-') ? value.split('-')[2] : journal.layer;
      saveChanges({ journalType: value, layer: nextLayer });
      return;
    }
    if (field === 'layer') {
      const kind = journal.journalType.split('-').at(-1) ?? 'study';
      saveChanges({ layer: value, journalType: `system-design-${value}-${kind}` });
      return;
    }
    saveChanges({ [field]: value });
  };
  const onCreateCustomProblem = () => {
    try {
      const problem = createCustomProblem({
        title: journal.problemTitle,
        url: journal.problemUrl,
        difficulty: journal.difficulty,
        patternIds: String(journal.patternIdsText ?? '').split(',').map((value) => value.trim()).filter(Boolean),
      });
      problem.parentId = journal.topicId ?? 'dsa';
      problem.domain = 'dsa';
      problem.type = 'problem';
      const patch = { problemId: problem.id, problemTitle: problem.title, difficulty: problem.difficulty, isCustom: true };
      setCustomProblemError('');
      setJournal((current) => ({ ...current, ...patch }));
      updateData((current) => updateJournal({ ...current, customProblems: [...(current.customProblems ?? []), problem] }, journal.id, patch));
    } catch (error) {
      setCustomProblemError(error.message);
    }
  };
  const checklist = journal.checklist ?? [];
  return <JournalEditor journal={journal} topic={catalogTopic} checklist={checklist} saveStatus={saveStatus} saveError={saveError} customProblemError={customProblemError} onCreateCustomProblem={onCreateCustomProblem} onChange={onChange} onQuestionsChange={saveChanges} onBack={() => { setSpatialDirection('back'); navigate(catalogTopic ? `/topics/${catalogTopic.id}?view=journals` : '/journals', { viewTransition: true }); }} />;
}

export default function JournalEditorPage() {
  const { journalId } = useParams();
  const [params] = useSearchParams();
  return <JournalEditorContent key={journalId ?? params.toString()} />;
}
