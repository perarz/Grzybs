export type SpeciesId =
  | 'boletus-edulis'
  | 'imleria-badia'
  | 'leccinum-scabrum'
  | 'leccinum-aurantiacum'
  | 'suillus-luteus'
  | 'cantharellus-cibarius'
  | 'macrolepiota-procera'
  | 'russula-virescens'
  | 'agaricus-campestris'
  | 'armillaria-mellea'
  | 'lactarius-deliciosus'
  | 'morchella-esculenta'
  | 'lycoperdon-perlatum'
  | 'tylopilus-felleus'
  | 'hygrophoropsis-aurantiaca'
  | 'amanita-muscaria'
  | 'amanita-pantherina'
  | 'hypholoma-fasciculare'
  | 'lactarius-torminosus'
  | 'scleroderma-citrinum'
  | 'agaricus-xanthodermus'
  | 'paxillus-involutus'
  | 'amanita-phalloides'
  | 'amanita-virosa'
  | 'galerina-marginata'
  | 'gyromitra-esculenta';

export type Edibility = 'edible' | 'inedible' | 'poisonous' | 'deadly';

export type CapColor = 'white' | 'yellow' | 'orange' | 'red' | 'pink' | 'brown' | 'green';

/** Gills, pores (tubes), chanterelle ridges – or nothing, as in puffballs and morels. */
export type Underside = 'gills' | 'pores' | 'ridges' | 'none';

export type Habitat = 'deciduous' | 'coniferous' | 'meadow' | 'deadWood';

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Rarity = 'common' | 'rare';

/** Features a picker can check in the forest – used by the atlas filter. */
export type SpeciesFeatures = {
  capColors: CapColor[];
  underside: Underside;
  ring: boolean;
  /** A sack (or its remains on a bulb) at the stem base – the classic amanita warning sign. */
  volva: boolean;
  /** Flesh, pores, gills or milk clearly change color when cut or bruised. */
  colorChange: boolean;
};

export type Species = {
  id: SpeciesId;
  namePl: string;
  nameLatin: string;
  otherNames: string[];
  edibility: Edibility;
  /** A condition for eating, e.g. "only after cooking". */
  edibilityNote?: string;
  /** What the poisoning looks like – for poisonous and deadly species. */
  poisoning?: string;
  protectionNote?: string;
  description: string;
  keyFeatures: string[];
  features: SpeciesFeatures;
  habitats: Habitat[];
  months: Month[];
  rarity: Rarity;
};

export type LookalikeDifference = {
  trait: string;
  first: string;
  second: string;
};

/** Two species people confuse. The first is the one they want to pick, the second the mistake. */
export type LookalikePair = {
  species: [SpeciesId, SpeciesId];
  differences: LookalikeDifference[];
};
