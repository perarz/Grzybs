import { useRef, useState } from 'react';

import { createSession, type LearningMode } from './learning';

export type RecordLearningResult = (
  mode: LearningMode,
  score: number,
  total: number,
  sessionId: string,
) => Promise<void>;

function newRound(mode: LearningMode) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    questions: createSession(mode),
  };
}

export function useLearningSession(mode: LearningMode, record: RecordLearningResult) {
  const [round, setRound] = useState(() => newRound(mode));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const cursor = useRef({ roundId: round.id, index: 0 });
  const answerLocked = useRef(false);
  const saveLocked = useRef(false);
  const nextLocked = useRef(false);
  const question = round.questions[index];
  const selected = answers[index];
  const score = answers.filter((answer, i) => answer === round.questions[i].correctOptionId).length;

  function answer(optionId: string) {
    if (
      cursor.current.roundId !== round.id ||
      cursor.current.index !== index ||
      answerLocked.current ||
      finished ||
      !question.options.some((option) => option.id === optionId)
    )
      return;
    answerLocked.current = true;
    nextLocked.current = false;
    setAnswers((previous) => [...previous, optionId]);
  }

  async function save() {
    if (saveLocked.current || saveState === 'saved') return;
    saveLocked.current = true;
    setSaveState('saving');
    try {
      await record(mode, score, round.questions.length, round.id);
      setSaveState('saved');
    } catch {
      setSaveState('error');
    } finally {
      saveLocked.current = false;
    }
  }

  function next() {
    if (
      !selected ||
      nextLocked.current ||
      cursor.current.roundId !== round.id ||
      cursor.current.index !== index
    )
      return;
    nextLocked.current = true;
    if (index === round.questions.length - 1) {
      setFinished(true);
      void save();
    } else {
      cursor.current.index = index + 1;
      answerLocked.current = false;
      setIndex((previous) => previous + 1);
    }
  }

  function restart() {
    if (saveLocked.current) return;
    const nextRound = newRound(mode);
    cursor.current = { roundId: nextRound.id, index: 0 };
    setRound(nextRound);
    setIndex(0);
    setAnswers([]);
    setFinished(false);
    setSaveState('idle');
    answerLocked.current = false;
    nextLocked.current = false;
  }

  return {
    question,
    selected,
    index,
    total: round.questions.length,
    score,
    finished,
    saveState,
    answer,
    next,
    save,
    restart,
  };
}
