export type CourseSession = {
  phase: 'learn' | 'quiz' | 'review' | 'result';
  page: number;
  count: number;
  selected: string | null;
  score: number;
  revision: number;
};
export type CourseAction = { revision: number } & (
  | { type: 'next' }
  | { type: 'answer'; option: string; correct: boolean }
  | { type: 'review' }
  | { type: 'return' }
  | { type: 'restart' }
);
export function startCourseSession(count: number): CourseSession {
  return { phase: 'learn', page: 0, count, selected: null, score: 0, revision: 0 };
}
export function reduceCourseSession(state: CourseSession, action: CourseAction): CourseSession {
  // Events from the same rendered button cannot advance two pages or count an answer twice.
  if (action.revision !== state.revision) return state;
  const next = { ...state, revision: state.revision + 1 };
  switch (action.type) {
    case 'answer':
      if (state.phase !== 'quiz' || state.selected !== null) return state;
      return { ...next, selected: action.option, score: state.score + Number(action.correct) };
    case 'next':
      if (state.phase === 'learn')
        return state.page + 1 === state.count
          ? { ...next, phase: 'quiz', page: 0 }
          : { ...next, page: state.page + 1 };
      if (state.phase !== 'quiz' || state.selected === null) return state;
      return {
        ...next,
        page: state.page + 1,
        selected: null,
        phase: state.page + 1 === state.count ? 'result' : 'quiz',
      };
    case 'review':
      return state.phase === 'quiz' ? { ...next, phase: 'review' } : state;
    case 'return':
      return state.phase === 'review' ? { ...next, phase: 'quiz' } : state;
    case 'restart':
      return state.phase === 'result'
        ? { ...startCourseSession(state.count), revision: next.revision }
        : state;
  }
}
