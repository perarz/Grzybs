import { AlertBanner } from '@/components/AlertBanner';
import type { Lookalike } from '@/features/atlas/findLookalikes';
import type { Species } from '@/features/atlas/types';
import { isDangerous } from '@/features/safety/danger';

type SpeciesWarningsProps = {
  species: Species;
  lookalikes: Lookalike[];
};

/** Poisoning, dangerous lookalikes, eating conditions and protection – whatever applies. */
export function SpeciesWarnings({ species, lookalikes }: SpeciesWarningsProps) {
  // Only a species worth picking needs a lookalike warning – a poisonous one is the danger itself.
  const dangerousLookalikes = isDangerous(species.edibility)
    ? []
    : lookalikes.filter((lookalike) => isDangerous(lookalike.species.edibility));
  const hasDeadlyLookalike = dangerousLookalikes.some(
    (lookalike) => lookalike.species.edibility === 'deadly',
  );
  const lookalikeNames = dangerousLookalikes
    .map((lookalike) => lookalike.species.namePl.toLowerCase())
    .join(', ');

  return (
    <>
      {species.poisoning ? (
        <AlertBanner
          tone={species.edibility === 'deadly' ? 'danger' : 'warning'}
          title="Objawy zatrucia"
        >
          {species.poisoning}
        </AlertBanner>
      ) : null}
      {dangerousLookalikes.length > 0 ? (
        <AlertBanner
          tone={hasDeadlyLookalike ? 'danger' : 'warning'}
          title={dangerousLookalikes.length > 1 ? 'Groźne sobowtóry' : 'Groźny sobowtór'}
        >
          Podobne trujące gatunki: {lookalikeNames}. Porównaj różnice niżej, zanim coś zbierzesz.
        </AlertBanner>
      ) : null}
      {species.edibilityNote ? (
        <AlertBanner tone="info" title="Jadalność">
          {species.edibilityNote}
        </AlertBanner>
      ) : null}
      {species.protectionNote ? (
        <AlertBanner tone="info" title="Gatunek chroniony">
          {species.protectionNote}
        </AlertBanner>
      ) : null}
    </>
  );
}
