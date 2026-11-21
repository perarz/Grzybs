import type { FieldIconName } from '@/components/icons/FieldIcon';

/** A practical rule of mushroom picking, taught in the course and checked with a field situation. */
export type FieldRule = {
  id: string;
  title: string;
  text: string;
  icon: FieldIconName;
  /** A situation from the forest: the question that checks the rule in practice. */
  situation: {
    prompt: string;
    options: { id: string; label: string }[];
    correctId: string;
    explanation: string;
  };
  source: string;
};

const GIS = 'https://www.gov.pl/web/gis/bezpieczne-grzybobranie';
const GIS_GUIDE = 'https://www.gov.pl/web/gis/dla-milosnikow-zbierania-grzybow2';
const LASY = 'https://www.lasy.gov.pl/pl/informacje/zakazy-wstepu-do-lasow';

// Rules paraphrase the Chief Sanitary Inspectorate (GIS) and Lasy Państwowe – see `source`.
export const FIELD_RULES = {
  sure: {
    id: 'sure',
    title: 'Tylko pewniaki',
    text: 'Do koszyka trafiają wyłącznie grzyby, które rozpoznajesz bez wątpliwości. Nawet doświadczeni grzybiarze się mylą.',
    icon: 'check',
    situation: {
      prompt: 'Grzyb wygląda prawie jak kania, ale coś Ci się nie zgadza. Co robisz?',
      options: [
        { id: 'leave', label: 'Zostawiam go w lesie' },
        { id: 'take', label: 'Biorę – w domu się okaże' },
        { id: 'taste', label: 'Próbuję kawałek' },
      ],
      correctId: 'leave',
      explanation:
        'Przy najmniejszej wątpliwości grzyb zostaje. Kanię najczęściej myli się z muchomorem sromotnikowym.',
    },
    source: GIS,
  },
  pores: {
    id: 'pores',
    title: 'Na początek: rurki',
    text: 'Początkujący powinni zbierać grzyby z rurkami (gąbką) pod kapeluszem, a blaszkowe zostawić, dopóki dobrze ich nie poznają.',
    icon: 'search',
    situation: {
      prompt: 'To Twoje pierwsze grzybobranie. Które grzyby najbezpieczniej zbierać?',
      options: [
        { id: 'pores', label: 'Z gąbką (rurkami) pod kapeluszem' },
        { id: 'gills', label: 'Z blaszkami pod kapeluszem' },
        { id: 'white', label: 'Najbielsze, bo najmłodsze' },
      ],
      correctId: 'pores',
      explanation:
        'Wśród grzybów z blaszkami są najgroźniejsze muchomory. Na start trzymaj się rurek.',
    },
    source: GIS,
  },
  basket: {
    id: 'basket',
    title: 'Koszyk, nie reklamówka',
    text: 'Zbieraj do przewiewnego koszyka. W reklamówce grzyby zaparzają się i szybko psują – wtedy nawet jadalne mogą zaszkodzić.',
    icon: 'mushrooms',
    situation: {
      prompt: 'Pakujesz się do lasu. W co zbierzesz grzyby?',
      options: [
        { id: 'basket', label: 'Wiklinowy koszyk' },
        { id: 'bag', label: 'Foliowa reklamówka' },
        { id: 'box', label: 'Szczelnie zamknięte pudełko' },
      ],
      correctId: 'basket',
      explanation: 'Koszyk przepuszcza powietrze. W folii grzyby parują i się psują.',
    },
    source: GIS,
  },
  twist: {
    id: 'twist',
    title: 'Wykręć cały grzyb',
    text: 'Grzyb delikatnie wykręć z podłoża razem z dolną częścią trzonu – to po niej rozpoznaje się m.in. muchomory. Nie niszcz przy tym grzybni.',
    icon: 'refresh',
    situation: {
      prompt: 'Jak wyjąć grzyba z ziemi?',
      options: [
        { id: 'twist', label: 'Delikatnie wykręcić cały, z nasadą trzonu' },
        { id: 'cut', label: 'Uciąć nożem tuż nad ziemią' },
        { id: 'dig', label: 'Rozgrzebać ściółkę wokół' },
      ],
      correctId: 'twist',
      explanation: 'Cały trzon ułatwia rozpoznanie, a nienaruszona grzybnia wyda kolejne owocniki.',
    },
    source: GIS,
  },
  small: {
    id: 'small',
    title: 'Za małe zostaw',
    text: 'Nie zbieraj bardzo małych grzybów, które nie mają jeszcze wyraźnych cech gatunku – trudno je pewnie rozpoznać.',
    icon: 'search',
    situation: {
      prompt: 'Widzisz malutkiego grzyba, kapelusz jeszcze zamknięty. Co robisz?',
      options: [
        { id: 'leave', label: 'Zostawiam, niech urośnie' },
        { id: 'take', label: 'Biorę, małe są najsmaczniejsze' },
      ],
      correctId: 'leave',
      explanation: 'U młodych owocników cechy gatunku nie są jeszcze widoczne – łatwo o pomyłkę.',
    },
    source: GIS,
  },
  taste: {
    id: 'taste',
    title: 'Nie próbuj na smak',
    text: 'Grzybów nie rozpoznaje się, próbując ich. Nie ufaj też radom przypadkowych grzybiarzy ani grzybom z nieznanego źródła.',
    icon: 'info',
    situation: {
      prompt: 'Kolega mówi: „Polizaj, jak nie gorzki, to jadalny”. Co na to?',
      options: [
        { id: 'no', label: 'Nie – smak niczego nie dowodzi' },
        { id: 'yes', label: 'Sprawdzę, to szybki test' },
      ],
      correctId: 'no',
      explanation:
        'Śmiertelnie trujący sromotnikowy nie jest gorzki. Smak nie odróżnia jadalnych od trujących.',
    },
    source: GIS,
  },
  sanepid: {
    id: 'sanepid',
    title: 'Masz wątpliwość? Sanepid',
    text: 'Grzyboznawca w stacji sanitarno-epidemiologicznej bezpłatnie oceni, czy grzyby są jadalne.',
    icon: 'info',
    situation: {
      prompt: 'Nie jesteś pewien kilku grzybów z koszyka. Gdzie je sprawdzisz za darmo?',
      options: [
        { id: 'sanepid', label: 'U grzyboznawcy w sanepidzie' },
        { id: 'forum', label: 'Na forum ze zdjęcia' },
        { id: 'neighbour', label: 'U sąsiada grzybiarza' },
      ],
      correctId: 'sanepid',
      explanation: 'Grzyboznawcy w stacjach sanepidu oceniają grzyby bezpłatnie.',
    },
    source: GIS_GUIDE,
  },
  children: {
    id: 'children',
    title: 'Nie dla dzieci',
    text: 'Grzyby są ciężkostrawne. Nie podawaj ich małym dzieciom; nie zaleca się ich też kobietom w ciąży i karmiącym ani osobom starszym.',
    icon: 'info',
    situation: {
      prompt: 'Robisz sos z prawdziwków. Czy podać go trzylatkowi?',
      options: [
        { id: 'no', label: 'Nie, grzyby nie są dla małych dzieci' },
        { id: 'yes', label: 'Tak, prawdziwek jest jadalny' },
      ],
      correctId: 'no',
      explanation: 'Sanepid odradza podawanie grzybów małym dzieciom – nawet jadalnych.',
    },
    source: GIS,
  },
  poisoning: {
    id: 'poisoning',
    title: 'Objawy mogą przyjść późno',
    text: 'Zatrucie może dać objawy po kilku, a nawet kilkunastu godzinach. Dzwoń pod 112 lub jedź do szpitala; do lekarza powinien też każdy, kto jadł tę potrawę. Nie podawaj mleka ani alkoholu.',
    icon: 'info',
    situation: {
      prompt: 'Kilka godzin po obiedzie z grzybów ktoś ma nudności. Co robisz?',
      options: [
        { id: 'call', label: 'Dzwonię 112, do lekarza idą wszyscy, którzy jedli' },
        { id: 'milk', label: 'Podaję mleko i czekam' },
        { id: 'wait', label: 'Czekam do jutra, to pewnie niestrawność' },
      ],
      correctId: 'call',
      explanation:
        'Późne objawy to znak ostrzegawczy. Mleko i alkohol przyspieszają wchłanianie toksyn.',
    },
    source: GIS,
  },
  closed: {
    id: 'closed',
    title: 'Gdzie nie wchodzić',
    text: 'W lesie stale obowiązuje zakaz wstępu na uprawy leśne do 4 m wysokości, do ostoi zwierząt i na źródliska. Nadleśniczy może też okresowo zamknąć las, np. przy dużym zagrożeniu pożarowym.',
    icon: 'lock',
    situation: {
      prompt: 'Za ogrodzeniem rosną młode, gęste sosenki – i widać tam grzyby. Wolno wejść?',
      options: [
        { id: 'no', label: 'Nie, na młode uprawy obowiązuje zakaz wstępu' },
        { id: 'yes', label: 'Tak, las jest dla wszystkich' },
      ],
      correctId: 'no',
      explanation:
        'Uprawy leśne do 4 m wysokości są stale zamknięte. Za złamanie zakazu grozi mandat.',
    },
    source: LASY,
  },
} satisfies Record<string, FieldRule>;

export type FieldRuleId = keyof typeof FIELD_RULES;
