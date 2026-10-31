import type { LookalikePair } from '@/features/atlas/types';

// Each pair is listed once; the species screen finds pairs from either side.
export const LOOKALIKE_PAIRS: LookalikePair[] = [
  {
    species: ['boletus-edulis', 'tylopilus-felleus'],
    differences: [
      { trait: 'Rurki', first: 'białe, z wiekiem żółtozielone', second: 'białe, z wiekiem różowe' },
      {
        trait: 'Siateczka na trzonie',
        first: 'jasna, delikatna, w górnej części',
        second: 'brunatna, wyraźna, o szerokich oczkach',
      },
      { trait: 'Smak', first: 'łagodny', second: 'bardzo gorzki' },
    ],
  },
  {
    species: ['imleria-badia', 'tylopilus-felleus'],
    differences: [
      { trait: 'Rurki', first: 'żółtawe, po uciśnięciu sinieją', second: 'białe do różowych' },
      {
        trait: 'Trzon',
        first: 'bez siateczki, z brązowymi włókienkami',
        second: 'z brunatną, wyraźną siateczką',
      },
      { trait: 'Smak', first: 'łagodny', second: 'bardzo gorzki' },
    ],
  },
  {
    species: ['leccinum-scabrum', 'tylopilus-felleus'],
    differences: [
      { trait: 'Trzon', first: 'pokryty ciemnymi łuseczkami', second: 'z brunatną siateczką' },
      { trait: 'Rurki', first: 'białawe do szarawych', second: 'białe do różowych' },
      { trait: 'Gdzie rośnie', first: 'zawsze pod brzozami', second: 'lasy iglaste, kwaśne gleby' },
    ],
  },
  {
    species: ['cantharellus-cibarius', 'hygrophoropsis-aurantiaca'],
    differences: [
      {
        trait: 'Pod kapeluszem',
        first: 'grube, rozwidlone listewki',
        second: 'cienkie, gęste, rozwidlone blaszki',
      },
      { trait: 'Barwa', first: 'żółta do żółtopomarańczowej', second: 'ciemniejsza, pomarańczowa' },
      { trait: 'Trzon', first: 'gruby, zwarty', second: 'cienki' },
      { trait: 'Miąższ', first: 'zwarty, włóknisty', second: 'miękki' },
    ],
  },
  {
    species: ['macrolepiota-procera', 'amanita-phalloides'],
    differences: [
      {
        trait: 'Kapelusz',
        first: 'z brązowymi łuskami i garbem',
        second: 'gładki, zielonkawy, bez łusek',
      },
      { trait: 'Pierścień', first: 'gruby, ruchomy', second: 'zwisający, przyrośnięty' },
      { trait: 'Nasada trzonu', first: 'bulwa bez pochwy', second: 'bulwa w wysokiej pochwie' },
    ],
  },
  {
    species: ['macrolepiota-procera', 'amanita-pantherina'],
    differences: [
      {
        trait: 'Kapelusz',
        first: 'brązowe łuski na jasnym tle, 10–30 cm',
        second: 'białe kosmki na brązowym tle, 4–12 cm',
      },
      { trait: 'Pierścień', first: 'gruby, ruchomy', second: 'gładki, przyrośnięty, zanika' },
      { trait: 'Nasada trzonu', first: 'bulwa bez pochwy', second: 'bulwa otoczona pochwą' },
    ],
  },
  {
    species: ['russula-virescens', 'amanita-phalloides'],
    differences: [
      { trait: 'Kapelusz', first: 'matowy, skórka spękana w poletka', second: 'gładki' },
      { trait: 'Pierścień', first: 'brak', second: 'zwisający, biały' },
      { trait: 'Nasada trzonu', first: 'bez pochwy', second: 'bulwa w wysokiej pochwie' },
      { trait: 'Miąższ', first: 'kruchy, łatwo się łamie', second: 'włóknisty' },
    ],
  },
  {
    species: ['agaricus-campestris', 'amanita-phalloides'],
    differences: [
      { trait: 'Blaszki', first: 'różowe, potem czekoladowe', second: 'białe' },
      { trait: 'Nasada trzonu', first: 'bez pochwy', second: 'bulwa w wysokiej pochwie' },
      { trait: 'Gdzie rośnie', first: 'łąki i pastwiska', second: 'lasy, najczęściej pod dębami' },
    ],
  },
  {
    species: ['agaricus-campestris', 'amanita-virosa'],
    differences: [
      { trait: 'Blaszki', first: 'różowe, potem czekoladowe', second: 'zawsze białe' },
      { trait: 'Nasada trzonu', first: 'bez pochwy', second: 'bulwa w wyraźnej pochwie' },
      { trait: 'Gdzie rośnie', first: 'łąki i pastwiska', second: 'lasy, głównie iglaste' },
    ],
  },
  {
    species: ['agaricus-campestris', 'agaricus-xanthodermus'],
    differences: [
      {
        trait: 'Nasada trzonu po przekrojeniu',
        first: 'biała',
        second: 'intensywnie chromowożółta',
      },
      { trait: 'Zapach', first: 'przyjemny, grzybowy', second: 'karbolu lub atramentu' },
      { trait: 'Pierścień', first: 'delikatny, zanika', second: 'wyraźny, zwisający' },
    ],
  },
  {
    species: ['armillaria-mellea', 'hypholoma-fasciculare'],
    differences: [
      {
        trait: 'Blaszki',
        first: 'białawe do kremowych',
        second: 'siarkowożółte, potem zielonkawe i fioletowoczarne',
      },
      { trait: 'Pierścień', first: 'szeroki, błoniasty', second: 'brak' },
      { trait: 'Wysyp zarodników', first: 'biały', second: 'fioletowoszary' },
    ],
  },
  {
    species: ['armillaria-mellea', 'galerina-marginata'],
    differences: [
      {
        trait: 'Kapelusz',
        first: 'z ciemnymi łuseczkami na środku',
        second: 'gładki, mały (1,5–5 cm)',
      },
      { trait: 'Blaszki', first: 'białawe do kremowych', second: 'ochrowe, potem rdzawobrązowe' },
      { trait: 'Wysyp zarodników', first: 'biały', second: 'rdzawobrązowy' },
    ],
  },
  {
    species: ['lactarius-deliciosus', 'lactarius-torminosus'],
    differences: [
      { trait: 'Mleczko', first: 'pomarańczowe, zielenieje', second: 'białe, nie zmienia barwy' },
      { trait: 'Brzeg kapelusza', first: 'gładki', second: 'z wełnistymi kosmkami' },
      { trait: 'Gdzie rośnie', first: 'pod sosnami', second: 'pod brzozami' },
    ],
  },
  {
    species: ['morchella-esculenta', 'gyromitra-esculenta'],
    differences: [
      {
        trait: 'Kapelusz',
        first: 'regularne jamki jak plaster miodu',
        second: 'pofałdowany jak mózg',
      },
      { trait: 'Wnętrze', first: 'jedna pusta komora', second: 'kilka nieregularnych komór' },
      {
        trait: 'Gdzie rośnie',
        first: 'lasy liściaste, łęgi, pod jesionami',
        second: 'lasy sosnowe, zręby, piaski',
      },
    ],
  },
  {
    species: ['lycoperdon-perlatum', 'scleroderma-citrinum'],
    differences: [
      { trait: 'Kształt', first: 'gruszkowaty', second: 'kulisty, jak ziemniak' },
      {
        trait: 'Skórka',
        first: 'cienka, z odpadającymi kolcami',
        second: 'gruba, twarda, z płaskimi brodawkami',
      },
      {
        trait: 'Wnętrze',
        first: 'białe u młodej, potem oliwkowy proszek',
        second: 'fioletowoczarne z białymi żyłkami',
      },
    ],
  },
  {
    // A young amanita still closed in its volva ("egg") looks like a puffball from the outside.
    species: ['lycoperdon-perlatum', 'amanita-phalloides'],
    differences: [
      {
        trait: 'Po przekrojeniu na pół',
        first: 'jednolicie białe wnętrze',
        second: 'widać zarys kapelusza, blaszek i trzonu',
      },
      { trait: 'Powierzchnia', first: 'z drobnymi kolcami', second: 'gładka (to pochwa)' },
    ],
  },
];
