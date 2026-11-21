import { useReducer, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { courseQuestions, courseUnits, type CourseStep } from '@/features/learn/course';
import { reduceCourseSession, startCourseSession } from '@/features/learn/courseSession';
import { spacing, useTheme } from '@/theme';
import { LearningQuestionCard } from './LearningQuestionCard';
import { CourseLessonCard } from './CourseLessonCard';
import { CourseSpecimenPhoto } from './CourseSpecimenPhoto';
import { CourseResult } from './CourseResult';

export function CourseQuizTask({
  step,
  onComplete,
  onAdvance,
}: {
  step: CourseStep;
  onComplete: () => Promise<void>;
  onAdvance: () => void;
}) {
  const { colors } = useTheme();
  const [material] = useState(() => ({
    units: courseUnits(step),
    questions: courseQuestions(step),
  }));
  const [session, dispatch] = useReducer(
    reduceCourseSession,
    material.units.length,
    startCourseSession,
  );
  const { phase, page, selected } = session;
  const unit = material.units[page];
  const question = material.questions[page];
  function move(type: 'next' | 'review' | 'return' | 'restart') {
    dispatch({ type, revision: session.revision });
    onAdvance();
  }
  if (phase === 'result')
    return (
      <CourseResult
        score={session.score}
        total={session.count}
        onComplete={onComplete}
        onRestart={() => move('restart')}
      />
    );
  const reading = phase === 'learn' || phase === 'review';
  return (
    <View style={styles.content}>
      <View style={styles.phase}>
        <FieldIcon name={reading ? 'book' : 'search'} size={spacing.xl} color={colors.glow} />
        <AppText variant="label" color="accent">
          {reading ? (phase === 'review' ? 'Przypomnij sobie' : 'Poznaj') : 'Sprawdź się'} ·{' '}
          {page + 1}/{session.count}
        </AppText>
      </View>
      {reading ? (
        <>
          <CourseLessonCard key={unit.id} unit={unit} />
          <Button
            label={
              phase === 'review'
                ? 'Wróć do pytania'
                : page + 1 === session.count
                  ? 'Teraz spróbuj sam'
                  : 'Następna wskazówka'
            }
            onPress={() => move(phase === 'review' ? 'return' : 'next')}
          />
        </>
      ) : (
        <>
          {unit.visual === 'photo' && unit.id.endsWith(':identity') && (
            <CourseSpecimenPhoto key={unit.id} id={unit.speciesIds[0]} revealName={false} />
          )}
          <LearningQuestionCard
            key={`question:${question.id}`}
            question={question}
            selected={selected ?? undefined}
            last={page === session.count - 1}
            onAnswer={(option) =>
              dispatch({
                type: 'answer',
                revision: session.revision,
                option,
                correct: option === question.correctOptionId,
              })
            }
            onNext={() => move('next')}
          />
          <Button label="Przypomnij wskazówkę" variant="secondary" onPress={() => move('review')} />
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  phase: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
