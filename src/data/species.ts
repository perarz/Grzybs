import type { Species, SpeciesId } from '@/features/atlas/types';

// Sources: Polish Wikipedia articles of each species, mp.pl (gyromitra poisoning),
// Lasy Państwowe "Bezpieczne grzybobranie" and sanepid (gov.pl) season calendars.

const AMATOXIN_POISONING =
  'Zawiera amatoksyny, które niszczą wątrobę. Pierwsze objawy pojawiają się dopiero po 8–16 godzinach, gdy trucizna już działa.';

// The Record type makes the compiler check that every SpeciesId has exactly one entry.
const SPECIES_DATA: Record<SpeciesId, Omit<Species, 'id'>> = {
  'boletus-edulis': {
    namePl: 'Borowik szlachetny',
    nameLatin: 'Boletus edulis',
    otherNames: ['prawdziwek'],
    edibility: 'edible',
    description:
      'Najbardziej ceniony grzyb w Polsce. Tworzy mikoryzę z wieloma drzewami, najchętniej ze świerkami – najliczniej rośnie w górskich świerczynach.',
    keyFeatures: [
      'Kapelusz jasno- do ciemnobrązowego, gładki.',
      'Rurki białe, z wiekiem żółtozielone.',
      'Trzon gruby, beczułkowaty, z jasną siateczką w górnej części.',
      'Miąższ biały, nie zmienia barwy po przekrojeniu.',
    ],
    features: {
      capColors: ['brown'],
      underside: 'pores',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['coniferous', 'deciduous'],
    months: [5, 6, 7, 8, 9, 10, 11],
    rarity: 'common',
  },
  'imleria-badia': {
    namePl: 'Podgrzybek brunatny',
    nameLatin: 'Imleria badia',
    otherNames: ['podgrzyb brunatny'],
    edibility: 'edible',
    edibilityNote: 'Na surowo trujący – jadalny dopiero po obróbce termicznej.',
    description:
      'Jeden z najczęściej zbieranych grzybów. Rośnie w lasach iglastych i mieszanych, najczęściej pod sosną i świerkiem, często w mchu.',
    keyFeatures: [
      'Kapelusz kasztanowobrązowy, w wilgoci lepki.',
      'Rurki kremowe do oliwkowożółtych – po uciśnięciu sinieją.',
      'Trzon bez siateczki, jaśniejszy od kapelusza, z brązowymi włókienkami.',
      'Miąższ na przekroju lekko sinieje.',
    ],
    features: {
      capColors: ['brown'],
      underside: 'pores',
      ring: false,
      volva: false,
      colorChange: true,
    },
    habitats: ['coniferous'],
    months: [7, 8, 9, 10, 11],
    rarity: 'common',
  },
  'leccinum-scabrum': {
    namePl: 'Koźlarz babka',
    nameLatin: 'Leccinum scabrum',
    otherNames: ['kozak'],
    edibility: 'edible',
    edibilityNote:
      'Najlepsze są młode owocniki – starsze mają gąbczasty kapelusz i zdrewniały trzon.',
    description:
      'Rośnie wyłącznie pod brzozami, z którymi tworzy mikoryzę – w lasach, ale też przy drogach i w parkach.',
    keyFeatures: [
      'Zawsze w pobliżu brzóz.',
      'Kapelusz szarobrązowy do brązowego.',
      'Trzon smukły, białawy, pokryty ciemnymi łuseczkami.',
      'Rurki białawe, z wiekiem szarawe; miąższ nie zmienia barwy.',
    ],
    features: {
      capColors: ['brown'],
      underside: 'pores',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['deciduous'],
    months: [6, 7, 8, 9, 10],
    rarity: 'common',
  },
  'leccinum-aurantiacum': {
    namePl: 'Koźlarz czerwony',
    nameLatin: 'Leccinum aurantiacum',
    otherNames: [],
    edibility: 'edible',
    description:
      'Rośnie wyłącznie pod osikami, w lasach i zaroślach. Podczas gotowania czernieje – to tylko zmiana koloru.',
    keyFeatures: [
      'Kapelusz pomarańczowy do rdzawoczerwonego.',
      'Trzon białawy, pokryty łuseczkami, które ciemnieją.',
      'Miąższ po przekrojeniu ciemnieje.',
      'Rośnie pod osikami.',
    ],
    features: {
      capColors: ['orange', 'red'],
      underside: 'pores',
      ring: false,
      volva: false,
      colorChange: true,
    },
    habitats: ['deciduous'],
    months: [6, 7, 8, 9, 10],
    rarity: 'common',
  },
  'suillus-luteus': {
    namePl: 'Maślak zwyczajny',
    nameLatin: 'Suillus luteus',
    otherNames: ['maślak'],
    edibility: 'edible',
    edibilityNote:
      'Przed przyrządzeniem zdejmij skórkę z kapelusza. U niektórych osób wywołuje dolegliwości żołądkowe – za pierwszym razem zjedz niewiele.',
    description:
      'Bardzo pospolity grzyb lasów sosnowych – tworzy mikoryzę z sosnami. Często rośnie gromadnie w młodnikach.',
    keyFeatures: [
      'Kapelusz czekoladowobrązowy, śliski i lepki.',
      'Rurki cytrynowożółte.',
      'Na trzonie błoniasty, białofioletowy pierścień.',
      'Rośnie pod sosnami.',
    ],
    features: {
      capColors: ['brown'],
      underside: 'pores',
      ring: true,
      volva: false,
      colorChange: false,
    },
    habitats: ['coniferous'],
    months: [5, 6, 7, 8, 9, 10, 11],
    rarity: 'common',
  },
  'cantharellus-cibarius': {
    namePl: 'Pieprznik jadalny',
    nameLatin: 'Cantharellus cibarius',
    otherNames: ['kurka'],
    edibility: 'edible',
    description:
      'Jeden z najczęściej występujących grzybów leśnych w Polsce. Rośnie w lasach liściastych i iglastych, często na piaszczystych glebach i wśród mchów.',
    keyFeatures: [
      'Cały owocnik żółty do żółtopomarańczowego.',
      'Pod kapeluszem grube, rozwidlone listewki zbiegające na trzon – nie blaszki.',
      'Kapelusz z wiekiem lejkowaty, z falistym brzegiem.',
      'Miąższ białawy, zwarty i włóknisty.',
    ],
    features: {
      capColors: ['yellow', 'orange'],
      underside: 'ridges',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['deciduous', 'coniferous'],
    months: [6, 7, 8, 9, 10, 11],
    rarity: 'common',
  },
  'macrolepiota-procera': {
    namePl: 'Czubajka kania',
    nameLatin: 'Macrolepiota procera',
    otherNames: ['kania'],
    edibility: 'edible',
    edibilityNote:
      'Zbieraj tylko dorosłe okazy z rozłożonym kapeluszem – młode, zamknięte łatwo pomylić z muchomorami. Zwykle je się same kapelusze.',
    description:
      'Okazały grzyb skrajów lasów, polan, łąk i przydroży. Lubi gleby gliniaste i bogate w wapń.',
    keyFeatures: [
      'Kapelusz duży (10–30 cm), z garbem na środku, pokryty brązowymi łuskami na jasnym tle.',
      'Pierścień gruby i ruchomy – daje się przesuwać po trzonie.',
      'Trzon wysoki, poniżej pierścienia z ciemnymi, poprzecznymi prążkami.',
      'Bulwiasta podstawa trzonu bez pochwy.',
    ],
    features: {
      capColors: ['brown', 'white'],
      underside: 'gills',
      ring: true,
      volva: false,
      colorChange: false,
    },
    habitats: ['deciduous', 'coniferous', 'meadow'],
    months: [7, 8, 9, 10],
    rarity: 'common',
  },
  'russula-virescens': {
    namePl: 'Gołąbek zielonawy',
    nameLatin: 'Russula virescens',
    otherNames: [],
    edibility: 'edible',
    description:
      'Jeden z najsmaczniejszych gołąbków. Rośnie w lasach liściastych i iglastych, najczęściej pod brzozami, bukami i dębami.',
    keyFeatures: [
      'Kapelusz zielonawy, matowy, skórka spękana w drobne poletka.',
      'Blaszki białe do kremowych, kruche.',
      'Trzon biały – bez pierścienia i bez pochwy.',
      'Miąższ biały i kruchy, łatwo się łamie.',
    ],
    features: {
      capColors: ['green'],
      underside: 'gills',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['deciduous', 'coniferous'],
    months: [7, 8, 9],
    rarity: 'common',
  },
  'agaricus-campestris': {
    namePl: 'Pieczarka polna',
    nameLatin: 'Agaricus campestris',
    otherNames: [],
    edibility: 'edible',
    description:
      'Rośnie na łąkach, pastwiskach i przydrożach – nie w lesie. Lubi miejsca nawożone, zwłaszcza obornikiem końskim.',
    keyFeatures: [
      'Kapelusz biały, jedwabisty.',
      'Blaszki u młodych różowe, potem czekoladowobrązowe – nigdy białe.',
      'Delikatny, błoniasty pierścień, u starszych zanika.',
      'Podstawa trzonu bez pochwy.',
    ],
    features: {
      capColors: ['white'],
      underside: 'gills',
      ring: true,
      volva: false,
      colorChange: false,
    },
    habitats: ['meadow'],
    months: [5, 6, 7, 8, 9, 10],
    rarity: 'common',
  },
  'armillaria-mellea': {
    namePl: 'Opieńka miodowa',
    nameLatin: 'Armillaria mellea',
    otherNames: ['opieńka'],
    edibility: 'edible',
    edibilityNote:
      'Na surowo lub niedogotowana jest trująca – przed przyrządzeniem obgotuj ją (ok. 5 minut) i wylej wywar.',
    description:
      'Rośnie kępami na pniach, korzeniach i gałęziach drzew liściastych. Jest też pasożytem atakującym żywe drzewa.',
    keyFeatures: [
      'Rośnie gęstymi kępami na drewnie.',
      'Kapelusz miodowożółty do brązowego, z drobnymi ciemnymi łuseczkami na środku.',
      'Na trzonie szeroki, błoniasty, żółtawy pierścień.',
      'Wysyp zarodników biały.',
    ],
    features: {
      capColors: ['yellow', 'brown'],
      underside: 'gills',
      ring: true,
      volva: false,
      colorChange: false,
    },
    habitats: ['deadWood'],
    months: [9, 10, 11],
    rarity: 'common',
  },
  'lactarius-deliciosus': {
    namePl: 'Mleczaj rydz',
    nameLatin: 'Lactarius deliciosus',
    otherNames: ['rydz'],
    edibility: 'edible',
    description:
      'Wysoko ceniony grzyb młodników i lasów sosnowych na piaszczystych glebach. Tworzy mikoryzę z sosnami.',
    keyFeatures: [
      'Wydziela pomarańczowe mleczko, które na powietrzu zielenieje.',
      'Uszkodzone miejsca zielenieją.',
      'Kapelusz pomarańczowy z ciemniejszymi pręgami, na środku wklęsły.',
      'Trzon z ciemniejszymi, jamkowatymi plamkami.',
    ],
    features: {
      capColors: ['orange'],
      underside: 'gills',
      ring: false,
      volva: false,
      colorChange: true,
    },
    habitats: ['coniferous'],
    months: [8, 9, 10, 11],
    rarity: 'common',
  },
  'morchella-esculenta': {
    namePl: 'Smardz jadalny',
    nameLatin: 'Morchella esculenta',
    otherNames: [],
    edibility: 'edible',
    edibilityNote: 'Na surowo toksyczny – jadalny dopiero po obróbce termicznej.',
    protectionNote:
      'W Polsce pod ochroną częściową. Na własne potrzeby wolno go zbierać tylko w ogrodach, uprawach ogrodniczych, szkółkach leśnych i na terenach zieleni.',
    description:
      'Wiosenny grzyb lasów liściastych, łęgów i łąk, często pod jesionami. W Polsce rzadki.',
    keyFeatures: [
      'Kapelusz jajowaty, pokryty głębokimi jamkami jak plaster miodu.',
      'Kapelusz i trzon w środku puste – po przekrojeniu widać jedną komorę.',
      'Pojawia się wiosną, w kwietniu i maju.',
    ],
    features: {
      capColors: ['brown', 'yellow'],
      underside: 'none',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['deciduous', 'meadow'],
    months: [4, 5],
    rarity: 'rare',
  },
  'lycoperdon-perlatum': {
    namePl: 'Purchawka chropowata',
    nameLatin: 'Lycoperdon perlatum',
    otherNames: [],
    edibility: 'edible',
    edibilityNote:
      'Jadalne są tylko młode owocniki, których wnętrze jest jeszcze białe i elastyczne.',
    description:
      'Bardzo pospolita w lasach i zaroślach. Dojrzała wyrzuca chmurę zarodników przez otworek na szczycie.',
    keyFeatures: [
      'Owocnik gruszkowaty, bez kapelusza i blaszek.',
      'Młoda biała, pokryta kolcami, które łatwo odpadają.',
      'Wnętrze młodej białe i jednolite; dojrzała wypełnia się oliwkowobrązowym proszkiem zarodników.',
    ],
    features: {
      capColors: ['white'],
      underside: 'none',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['deciduous', 'coniferous'],
    months: [6, 7, 8, 9, 10],
    rarity: 'common',
  },
  'tylopilus-felleus': {
    namePl: 'Goryczak żółciowy',
    nameLatin: 'Tylopilus felleus',
    otherNames: [],
    edibility: 'inedible',
    edibilityNote: 'Bardzo gorzki i lekko trujący – nawet mały kawałek psuje całą potrawę.',
    description:
      'Często mylony z borowikiem i podgrzybkiem. Rośnie w lasach iglastych na kwaśnych glebach, czasem na pniakach.',
    keyFeatures: [
      'Rurki młode białe, potem różowe.',
      'Trzon z wyraźną, brunatną siateczką o szerokich oczkach.',
      'Miąższ nie zmienia barwy po uszkodzeniu.',
      'Smak bardzo gorzki.',
    ],
    features: {
      capColors: ['brown'],
      underside: 'pores',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['coniferous'],
    months: [6, 7, 8, 9, 10],
    rarity: 'common',
  },
  'hygrophoropsis-aurantiaca': {
    namePl: 'Lisówka pomarańczowa',
    nameLatin: 'Hygrophoropsis aurantiaca',
    otherNames: ['fałszywa kurka'],
    edibility: 'inedible',
    edibilityNote: 'Uważana za niejadalną, bywa też opisywana jako trująca.',
    description:
      'Rośnie na ściółce i próchniejącym drewnie w lasach iglastych i mieszanych. Często mylona z kurką.',
    keyFeatures: [
      'Blaszki cienkie, gęste, wielokrotnie rozwidlone, pomarańczowe.',
      'Owocnik ciemniejszy i bardziej pomarańczowy niż kurka.',
      'Trzon cienki.',
      'Miąższ miękki, białawy lub kremowy.',
    ],
    features: {
      capColors: ['orange'],
      underside: 'gills',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['coniferous', 'deadWood'],
    months: [9, 10, 11],
    rarity: 'common',
  },
  'amanita-muscaria': {
    namePl: 'Muchomor czerwony',
    nameLatin: 'Amanita muscaria',
    otherNames: [],
    edibility: 'poisonous',
    poisoning:
      'Zawiera kwas ibotenowy i muscymol, które działają na ośrodkowy układ nerwowy. Objawy pojawiają się po 30 minutach do 2 godzin.',
    description:
      'Najbardziej rozpoznawalny grzyb w Polsce, bardzo pospolity. Rośnie w różnych lasach, szczególnie pod brzozami.',
    keyFeatures: [
      'Kapelusz czerwony z białymi kosmkami (deszcz może je zmyć).',
      'Blaszki i trzon białe.',
      'Na trzonie biały, zwisający pierścień.',
      'Bulwiasta podstawa z kilkoma rzędami brodawkowatych zgrubień.',
    ],
    features: {
      capColors: ['red', 'orange'],
      underside: 'gills',
      ring: true,
      volva: true,
      colorChange: false,
    },
    habitats: ['deciduous', 'coniferous'],
    months: [6, 7, 8, 9, 10, 11],
    rarity: 'common',
  },
  'amanita-pantherina': {
    namePl: 'Muchomor plamisty',
    nameLatin: 'Amanita pantherina',
    otherNames: [],
    edibility: 'poisonous',
    poisoning:
      'Silnie trujący. Zawiera te same toksyny co muchomor czerwony (kwas ibotenowy i muscymol), działające na ośrodkowy układ nerwowy.',
    description:
      'Pospolity w lasach liściastych, rzadziej iglastych. Bywa mylony z kanią – zdarzają się poważne zatrucia.',
    keyFeatures: [
      'Kapelusz brązowy (4–12 cm), z drobnymi białymi kosmkami.',
      'Blaszki białe, gęste.',
      'Pierścień gładki, bez prążków, u starszych zanika.',
      'Bulwa u nasady otoczona pochwą.',
    ],
    features: {
      capColors: ['brown'],
      underside: 'gills',
      ring: true,
      volva: true,
      colorChange: false,
    },
    habitats: ['deciduous', 'coniferous'],
    months: [6, 7, 8, 9, 10],
    rarity: 'common',
  },
  'hypholoma-fasciculare': {
    namePl: 'Maślanka wiązkowa',
    nameLatin: 'Hypholoma fasciculare',
    otherNames: [],
    edibility: 'poisonous',
    poisoning:
      'Wywołuje bóle brzucha, wymioty i biegunkę – najpóźniej 3 godziny po zjedzeniu. Zatrucia są rzadkie, bo grzyb jest bardzo gorzki.',
    description:
      'Bardzo pospolita. Rośnie dużymi kępami na pniakach drzew liściastych i iglastych niemal przez cały rok.',
    keyFeatures: [
      'Rośnie gęstymi kępami na pniakach.',
      'Kapelusz siarkowożółty, na środku pomarańczowy do rdzawego.',
      'Blaszki u młodych siarkowożółte, potem zielonkawe, w końcu fioletowoczarne.',
      'Brak pierścienia; smak bardzo gorzki.',
    ],
    features: {
      capColors: ['yellow'],
      underside: 'gills',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['deadWood'],
    months: [4, 5, 6, 7, 8, 9, 10, 11, 12],
    rarity: 'common',
  },
  'lactarius-torminosus': {
    namePl: 'Mleczaj wełnianka',
    nameLatin: 'Lactarius torminosus',
    otherNames: ['wełnianka'],
    edibility: 'poisonous',
    poisoning:
      'Na surowo wywołuje nudności, wymioty i biegunkę. W większości krajów Europy uważany za trujący.',
    description: 'Pospolity pod brzozami, w lasach i parkach, zwykle wśród mchów.',
    keyFeatures: [
      'Brzeg kapelusza podwinięty, z wełnistymi kosmkami.',
      'Kapelusz cielistoróżowy, z ciemniejszymi pręgami.',
      'Mleczko białe, nie zmienia barwy, bardzo ostre w smaku.',
      'Rośnie pod brzozami.',
    ],
    features: {
      capColors: ['pink'],
      underside: 'gills',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['deciduous'],
    months: [7, 8, 9, 10, 11],
    rarity: 'common',
  },
  'scleroderma-citrinum': {
    namePl: 'Tęgoskór pospolity',
    nameLatin: 'Scleroderma citrinum',
    otherNames: [],
    edibility: 'poisonous',
    poisoning: 'Zjedzony w większej ilości powoduje zatrucie z dolegliwościami żołądkowymi.',
    description:
      'Pospolity na piaszczystych, kwaśnych glebach – na obrzeżach lasów, w parkach i na pastwiskach.',
    keyFeatures: [
      'Owocnik kulisty lub bulwiasty, bez trzonu – przypomina ziemniak.',
      'Skórka gruba i twarda, żółtawa, pokryta płaskimi brodawkami.',
      'Wnętrze u młodych białe, potem czarne z fioletowym odcieniem i białymi żyłkami.',
    ],
    features: {
      capColors: ['yellow'],
      underside: 'none',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['deciduous', 'coniferous', 'meadow'],
    months: [6, 7, 8, 9, 10, 11],
    rarity: 'common',
  },
  'agaricus-xanthodermus': {
    namePl: 'Pieczarka karbolowa',
    nameLatin: 'Agaricus xanthodermus',
    otherNames: [],
    edibility: 'poisonous',
    poisoning:
      'Wywołuje silne zaburzenia trawienne z mdłościami i wymiotami, choć nie u wszystkich. Alkohol może nasilać zatrucie.',
    description:
      'Rośnie w parkach, ogrodach, przy drogach i w lasach, czasem dużymi skupiskami. Bywa mylona z jadalnymi pieczarkami.',
    keyFeatures: [
      'Kapelusz biały – po naciśnięciu żółknie.',
      'Nasada trzonu po potarciu lub przekrojeniu intensywnie chromowożółta.',
      'Nieprzyjemny zapach karbolu lub atramentu, mocniejszy przy gotowaniu.',
      'Blaszki najpierw różowe, potem czekoladowobrązowe.',
    ],
    features: {
      capColors: ['white'],
      underside: 'gills',
      ring: true,
      volva: false,
      colorChange: true,
    },
    habitats: ['meadow', 'deciduous', 'coniferous'],
    months: [5, 6, 7, 8, 9, 10],
    rarity: 'common',
  },
  'paxillus-involutus': {
    namePl: 'Krowiak podwinięty',
    nameLatin: 'Paxillus involutus',
    otherNames: [],
    edibility: 'poisonous',
    poisoning:
      'U części osób wywołuje reakcję odpornościową – organizm wytwarza przeciwciała przeciw własnym krwinkom. Zdarzają się zgony, także u osób, które wcześniej jadły go bez objawów.',
    description:
      'Rośnie gromadnie we wszystkich typach lasu. Jeszcze w latach 80. XX wieku uchodził za jadalny.',
    keyFeatures: [
      'Brzeg kapelusza mocno podwinięty, także u starszych okazów.',
      'Kapelusz żółtobrązowy do oliwkowobrązowego, z wiekiem wklęsły.',
      'Blaszki gęste, zbiegające na trzon – po uszkodzeniu brązowieją.',
    ],
    features: {
      capColors: ['brown'],
      underside: 'gills',
      ring: false,
      volva: false,
      colorChange: true,
    },
    habitats: ['deciduous', 'coniferous'],
    // TODO: verify – the sources only say "summer and autumn".
    months: [7, 8, 9, 10],
    rarity: 'common',
  },
  'amanita-phalloides': {
    namePl: 'Muchomor sromotnikowy',
    nameLatin: 'Amanita phalloides',
    otherNames: ['muchomor zielonawy'],
    edibility: 'deadly',
    poisoning: `${AMATOXIN_POISONING} Odpowiada za ok. 90% śmiertelnych zatruć grzybami na świecie; dawka śmiertelna to ok. 30 g.`,
    description:
      'Pospolity w całej Polsce, głównie w lasach liściastych i mieszanych, najczęściej pod dębami. Mylony z gołąbkiem zielonawym, gąską zielonką i młodymi pieczarkami.',
    keyFeatures: [
      'Kapelusz białozielonkawy, oliwkowy, szarozielony lub brunatnozielony – bez łusek.',
      'Blaszki białe.',
      'Na trzonie zwisający, biały do żółtawego pierścień.',
      'Bulwa u nasady w wysokiej, odstającej pochwie – często ukrytej w ściółce.',
    ],
    features: {
      capColors: ['green', 'white'],
      underside: 'gills',
      ring: true,
      volva: true,
      colorChange: false,
    },
    habitats: ['deciduous'],
    months: [6, 7, 8, 9, 10, 11],
    rarity: 'common',
  },
  'amanita-virosa': {
    namePl: 'Muchomor jadowity',
    nameLatin: 'Amanita virosa',
    otherNames: [],
    edibility: 'deadly',
    poisoning: AMATOXIN_POISONING,
    description:
      'Rzadki, zagrożony wymarciem. Rośnie głównie w górskich lasach iglastych pod świerkami i sosnami. Młode owocniki bywają mylone z pieczarkami.',
    keyFeatures: [
      'Cały owocnik biały.',
      'Kapelusz najpierw jajowaty, potem stożkowato-dzwonkowaty.',
      'Trzon z włóknistymi łuskami i pierścieniem, który może zanikać.',
      'Bulwiasta nasada w wyraźnej pochwie.',
    ],
    features: {
      capColors: ['white'],
      underside: 'gills',
      ring: true,
      volva: true,
      colorChange: false,
    },
    habitats: ['coniferous'],
    months: [7, 8, 9, 10],
    rarity: 'rare',
  },
  'galerina-marginata': {
    namePl: 'Hełmówka jadowita',
    nameLatin: 'Galerina marginata',
    otherNames: [],
    edibility: 'deadly',
    poisoning: 'Zawiera amanitynę – tę samą truciznę co muchomor sromotnikowy, niszczącą wątrobę.',
    description:
      'Pospolita na martwym drewnie, na niżu głównie bukowym, w górach świerkowym. Rośnie gromadnie, jak jadalne grzyby nadrzewne.',
    keyFeatures: [
      'Rośnie gromadnie na martwym drewnie.',
      'Kapelusz mały (1,5–5 cm), ochrowobrązowy, po wyschnięciu jaśnieje.',
      'Blaszki ochrowe, potem rdzawobrązowe; wysyp zarodników rdzawobrązowy.',
      'Na trzonie nietrwały pierścień, poniżej białe włókienka.',
    ],
    features: {
      capColors: ['brown'],
      underside: 'gills',
      ring: true,
      volva: false,
      colorChange: false,
    },
    habitats: ['deadWood'],
    months: [8, 9, 10, 11],
    rarity: 'common',
  },
  'gyromitra-esculenta': {
    namePl: 'Piestrzenica kasztanowata',
    nameLatin: 'Gyromitra esculenta',
    otherNames: [],
    edibility: 'deadly',
    poisoning:
      'Zawiera gyromitrynę, która w żołądku zmienia się w monometylohydrazynę – składnik paliwa rakietowego. Objawy po kilku–kilkunastu godzinach; ciężkie zatrucie niszczy wątrobę i układ nerwowy i może skończyć się śmiercią. Trujące są nawet opary z gotowania.',
    description:
      'Wiosenny grzyb lasów sosnowych, często na zrębach i piaszczystych glebach. Dość częsta – i mylona ze smardzem.',
    keyFeatures: [
      'Kapelusz nieregularny, pofałdowany jak mózg, brązowy do kasztanowego.',
      'Wnętrze podzielone na nieregularne komory – nie jedna pusta przestrzeń.',
      'Trzon krótki, brudnobiały, z wgłębieniami.',
      'Pojawia się wiosną, od marca do maja.',
    ],
    features: {
      capColors: ['brown', 'red'],
      underside: 'none',
      ring: false,
      volva: false,
      colorChange: false,
    },
    habitats: ['coniferous'],
    months: [3, 4, 5],
    rarity: 'common',
  },
};

// Object.keys always returns string[]; the Record type above guarantees these are exactly SpeciesIds.
const SPECIES_IDS = Object.keys(SPECIES_DATA) as SpeciesId[];

export function getSpecies(id: SpeciesId): Species {
  return { id, ...SPECIES_DATA[id] };
}

export const SPECIES: Species[] = SPECIES_IDS.map(getSpecies);

/** For ids from outside the code, e.g. a URL – returns undefined for an unknown id. */
export function findSpecies(id: string): Species | undefined {
  return SPECIES.find((species) => species.id === id);
}
