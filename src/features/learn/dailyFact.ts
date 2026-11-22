import type { Species } from '@/features/atlas/types';

function firstSentence(text: string) {
  return text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text;
}

/** One thing worth remembering about a species – a sentence from the atlas, no facts of its own. */
export function dailyFact(species: Species) {
  return firstSentence(
    species.poisoning ?? species.edibilityNote ?? species.protectionNote ?? species.description,
  );
}
