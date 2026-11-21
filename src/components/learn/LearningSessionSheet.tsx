import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import type { LearningMode } from '@/features/learn/learning';
import { useLearningSession, type RecordLearningResult } from '@/features/learn/useLearningSession';
import { durations, spacing } from '@/theme';

import { LearningQuestionCard } from './LearningQuestionCard';
import { LearningResult } from './LearningResult';

type Props = { mode: LearningMode; onClose: () => void; record: RecordLearningResult };

export function LearningSessionSheet({ mode, onClose, record }: Props) {
  const session = useLearningSession(mode, record);
  const saving = session.saveState === 'saving';
  return (
    <BottomSheet
      onClose={onClose}
      dismissible={!saving}
      header={(close) => (
        <View style={styles.header}>
          <AppText variant="label" color="accent">
            {mode === 'quiz' ? 'Quiz · cechy gatunków' : 'Sobowtór · dostrzeż różnicę'}
          </AppText>
          <AppText variant="heading">
            {session.finished ? 'Twój wynik' : `Pytanie ${session.index + 1} / ${session.total}`}
          </AppText>
          <Button
            label={session.finished ? 'Zamknij' : 'Przerwij rundę'}
            disabled={saving}
            variant="secondary"
            onPress={close}
          />
        </View>
      )}
    >
      {(close) => (
        <ScrollView
          key={session.finished ? 'result' : session.question.id}
          contentContainerStyle={styles.body}
        >
          <Animated.View entering={FadeInDown.duration(durations.base)}>
            {session.finished ? (
              <LearningResult
                score={session.score}
                total={session.total}
                saveState={session.saveState}
                onRetry={() => void session.save()}
                onRestart={session.restart}
                onClose={close}
              />
            ) : (
              <LearningQuestionCard
                question={session.question}
                selected={session.selected}
                last={session.index === session.total - 1}
                onAnswer={session.answer}
                onNext={session.next}
              />
            )}
          </Animated.View>
        </ScrollView>
      )}
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  header: { gap: spacing.md },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
});
