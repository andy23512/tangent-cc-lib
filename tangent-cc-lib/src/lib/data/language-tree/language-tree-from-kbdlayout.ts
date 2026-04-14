import type { LanguageTree } from '../../model/language-tree.models.js';

export const LANGUAGE_TREE_FROM_KBDLAYOUT: LanguageTree = [
  {
    kind: 'language',
    code: 'af',
    name: 'Afrikaans',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'sq',
    name: 'Albanian',
    layouts: [
      {
        id: 'albanian',
        name: 'Albanian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'gsw',
    name: 'Alsatian',
    layouts: [
      {
        id: 'swiss-german',
        name: 'Swiss German',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'gsw-FR',
        name: 'Alsatian (France)',
        layouts: [
          {
            id: 'french-legacy-azerty',
            name: 'French (Legacy, AZERTY)',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'ar',
    name: 'Arabic',
    layouts: [
      {
        id: 'arabic-101',
        name: 'Arabic (101)',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'ar-DZ',
        name: 'Arabic (Algeria)',
        layouts: [
          {
            id: 'arabic-102-azerty',
            name: 'Arabic (102) AZERTY',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'ar-MA',
        name: 'Arabic (Morocco)',
        layouts: [
          {
            id: 'arabic-102-azerty',
            name: 'Arabic (102) AZERTY',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'ar-SA',
        name: 'Arabic (Saudi Arabia)',
        layouts: [
          {
            id: 'arabic-101',
            name: 'Arabic (101)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'arabic-102',
            name: 'Arabic (102)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'arabic-102-azerty',
            name: 'Arabic (102) AZERTY',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'ar-TN',
        name: 'Arabic (Tunisia)',
        layouts: [
          {
            id: 'arabic-102-azerty',
            name: 'Arabic (102) AZERTY',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'hy',
    name: 'Armenian',
    layouts: [
      {
        id: 'armenian-eastern-legacy',
        name: 'Armenian Eastern (Legacy)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'armenian-phonetic',
        name: 'Armenian Phonetic',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'armenian-typewriter',
        name: 'Armenian Typewriter',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'armenian-western-legacy',
        name: 'Armenian Western (Legacy)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'as',
    name: 'Assamese',
    layouts: [
      {
        id: 'assamese-inscript',
        name: 'Assamese - INSCRIPT',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'az',
    name: 'Azerbaijani',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'az-Cyrl',
        name: 'Azerbaijani (Cyrillic)',
        layouts: [
          {
            id: 'azerbaijani-cyrillic',
            name: 'Azerbaijani Cyrillic',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'az-Latn',
        name: 'Azerbaijani (Latin)',
        layouts: [
          {
            id: 'azerbaijani-standard',
            name: 'Azerbaijani (Standard)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'azerbaijani-latin',
            name: 'Azerbaijani Latin',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'bn',
    name: 'Bangla',
    layouts: [
      {
        id: 'bangla',
        name: 'Bangla',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'bn-IN',
        name: 'Bengali (India)',
        layouts: [
          {
            id: 'bangla',
            name: 'Bangla',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'bangla-inscript',
            name: 'Bangla - INSCRIPT',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'bangla-inscript-legacy',
            name: 'Bangla - INSCRIPT (Legacy)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'ba',
    name: 'Bashkir',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ba-Cyrl',
        name: 'Bashkir',
        layouts: [
          {
            id: 'bashkir',
            name: 'Bashkir',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'eu',
    name: 'Basque',
    layouts: [
      {
        id: 'spanish',
        name: 'Spanish',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'be',
    name: 'Belarusian',
    layouts: [
      {
        id: 'belarusian',
        name: 'Belarusian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'bs',
    name: 'Bosnian (Latin)',
    layouts: [
      {
        id: 'standard',
        name: 'Standard',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'bs-Cyrl',
        name: 'Bosnian (Cyrillic)',
        layouts: [
          {
            id: 'bosnian-cyrillic',
            name: 'Bosnian (Cyrillic)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'br',
    name: 'Breton',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'br-Latn',
        name: 'Breton',
        layouts: [
          {
            id: 'french-legacy-azerty',
            name: 'French (Legacy, AZERTY)',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'bug',
    name: 'Bugis',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'bug-Bugi',
        name: 'Buginese',
        layouts: [
          {
            id: 'buginese',
            name: 'Buginese',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'bg',
    name: 'Bulgarian',
    layouts: [
      {
        id: 'bulgarian',
        name: 'Bulgarian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'bulgarian-latin',
        name: 'Bulgarian (Latin)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'bulgarian-phonetic-traditional',
        name: 'Bulgarian (Phonetic Traditional)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'bulgarian-phonetic',
        name: 'Bulgarian (Phonetic)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'bulgarian-typewriter',
        name: 'Bulgarian (Typewriter)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'my',
    name: 'Burmese',
    layouts: [
      {
        id: 'myanmar-phonetic-order',
        name: 'Myanmar (Phonetic order)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'myanmar-visual-order',
        name: 'Myanmar (Visual order)',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'ca',
    name: 'Catalan',
    layouts: [
      {
        id: 'spanish',
        name: 'Spanish',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'tzm',
    name: 'Central Atlas Tamazight (Tifinagh)',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'tzm-Latn',
        name: 'Central Atlas Tamazight (Latin)',
        layouts: [
          {
            id: 'central-atlas-tamazight',
            name: 'Central Atlas Tamazight',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'tzm-Tfng',
        name: 'Central Atlas Tamazight (Tifinagh)',
        layouts: [
          {
            id: 'tifinagh-basic',
            name: 'Tifinagh (Basic)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'tifinagh-extended',
            name: 'Tifinagh (Extended)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'tzm-Arab',
        name: 'Central Atlas Tamazight (Tifinagh)',
        layouts: [
          {
            id: 'arabic-102-azerty',
            name: 'Arabic (102) AZERTY',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'co',
    name: 'Corsican',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'co-Latn',
        name: 'Corsican',
        layouts: [
          {
            id: 'french-legacy-azerty',
            name: 'French (Legacy, AZERTY)',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'hr',
    name: 'Croatian',
    layouts: [
      {
        id: 'standard',
        name: 'Standard',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'cs',
    name: 'Czech',
    layouts: [
      {
        id: 'czech',
        name: 'Czech',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'czech-qwerty',
        name: 'Czech (QWERTY)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'czech-programmers',
        name: 'Czech Programmers',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'da',
    name: 'Danish',
    layouts: [
      {
        id: 'danish',
        name: 'Danish',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'tdd',
    name: 'Dehong Dai',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'tdd-Tale',
        name: 'Dehong Dai',
        layouts: [
          {
            id: 'tai-le',
            name: 'Tai Le',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'dv',
    name: 'Divehi',
    layouts: [
      {
        id: 'divehi-phonetic',
        name: 'Divehi Phonetic',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'divehi-typewriter',
        name: 'Divehi Typewriter',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'nl',
    name: 'Dutch',
    layouts: [
      {
        id: 'united-states-international',
        name: 'United States-International',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'nl-BE',
        name: 'Dutch (Belgium)',
        layouts: [
          {
            id: 'belgian-period',
            name: 'Belgian (Period)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'nl-NL',
        name: 'Dutch (Netherlands)',
        layouts: [
          {
            id: 'dutch',
            name: 'Dutch',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'united-states-international',
            name: 'United States-International',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'dz',
    name: 'Dzongkha',
    layouts: [
      {
        id: 'dzongkha',
        name: 'Dzongkha',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'en',
    name: 'English',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'en-CA',
        name: 'English (Canada)',
        layouts: [
          {
            id: 'canadian-french',
            name: 'Canadian French',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'canadian-multilingual-standard',
            name: 'Canadian Multilingual Standard',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'us',
            name: 'US',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'en-IN',
        name: 'English (India)',
        layouts: [
          {
            id: 'english-india',
            name: 'English (India)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'en-IE',
        name: 'English (Ireland)',
        layouts: [
          {
            id: 'irish',
            name: 'Irish',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'scottish-gaelic',
            name: 'Scottish Gaelic',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'en-NZ',
        name: 'English (New Zealand)',
        layouts: [
          {
            id: 'nz-aotearoa',
            name: 'NZ Aotearoa',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'en-GB',
        name: 'English (United Kingdom)',
        layouts: [
          {
            id: 'united-kingdom',
            name: 'United Kingdom',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'en-US',
        name: 'English (United States)',
        layouts: [
          {
            id: 'colemak',
            name: 'Colemak',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'united-states-dvorak',
            name: 'United States-Dvorak',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'united-states-dvorak-for-left-hand',
            name: 'United States-Dvorak for left hand',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'united-states-dvorak-for-right-hand',
            name: 'United States-Dvorak for right hand',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'united-states-international',
            name: 'United States-International',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'us',
            name: 'US',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'us-english-table-for-ibm-arabic-238-l',
            name: 'US English Table for IBM Arabic 238_L',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'et',
    name: 'Estonian',
    layouts: [
      {
        id: 'estonian',
        name: 'Estonian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'ett',
    name: 'Etruscan',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ett-Ital',
        name: 'Etruscan',
        layouts: [
          {
            id: 'old-italic',
            name: 'Old Italic',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'fo',
    name: 'Faroese',
    layouts: [
      {
        id: 'faeroese',
        name: 'Faeroese',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'danish',
        name: 'Danish',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'fil',
    name: 'Filipino',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'fi',
    name: 'Finnish',
    layouts: [
      {
        id: 'finnish',
        name: 'Finnish',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'fr',
    name: 'French',
    layouts: [
      {
        id: 'french-legacy-azerty',
        name: 'French (Legacy, AZERTY)',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'fr-BE',
        name: 'French (Belgium)',
        layouts: [
          {
            id: 'belgian-comma',
            name: 'Belgian (Comma)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'belgian-french',
            name: 'Belgian French',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'fr-CA',
        name: 'French (Canada)',
        layouts: [
          {
            id: 'canadian-french-legacy',
            name: 'Canadian French (Legacy)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'canadian-french',
            name: 'Canadian French',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'fr-FR',
        name: 'French (France)',
        layouts: [
          {
            id: 'french-legacy-azerty',
            name: 'French (Legacy, AZERTY)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'french-standard-azerty',
            name: 'French (Standard, AZERTY)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'french-standard-bpo',
            name: 'French (Standard, BÉPO)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'fr-LU',
        name: 'French (Luxembourg)',
        layouts: [
          {
            id: 'swiss-french',
            name: 'Swiss French',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'fr-CH',
        name: 'French (Switzerland)',
        layouts: [
          {
            id: 'swiss-french',
            name: 'Swiss French',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'fy',
    name: 'Frisian',
    layouts: [
      {
        id: 'united-states-international',
        name: 'United States-International',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'ff',
    name: 'Fulah',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ff-Adlm',
        name: 'Fulah (ADLaM)',
        layouts: [
          {
            id: 'adlam',
            name: 'ADLaM',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'ff-Latn',
        name: 'Fulah (Latin)',
        layouts: [
          {
            id: 'wolof',
            name: 'Wolof',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'gl',
    name: 'Galician',
    layouts: [
      {
        id: 'spanish',
        name: 'Spanish',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'ka',
    name: 'Georgian',
    layouts: [
      {
        id: 'georgian-ergonomic',
        name: 'Georgian (Ergonomic)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'georgian-legacy',
        name: 'Georgian (Legacy)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'georgian-mes',
        name: 'Georgian (MES)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'georgian-old-alphabets',
        name: 'Georgian (Old Alphabets)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'georgian-qwerty',
        name: 'Georgian (QWERTY)',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'de',
    name: 'German',
    layouts: [
      {
        id: 'german',
        name: 'German',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'de-DE',
        name: 'German (Germany)',
        layouts: [
          {
            id: 'german',
            name: 'German',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'german-ibm',
            name: 'German (IBM)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'german-extended-e1',
            name: 'German Extended (E1)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'german-extended-e2',
            name: 'German Extended (E2)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'de-LI',
        name: 'German (Liechtenstein)',
        layouts: [
          {
            id: 'swiss-german',
            name: 'Swiss German',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'de-CH',
        name: 'German (Switzerland)',
        layouts: [
          {
            id: 'swiss-german',
            name: 'Swiss German',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'gem',
    name: 'Germanic languages',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'gem-Runr',
        name: 'Futhark',
        layouts: [
          {
            id: 'futhark',
            name: 'Futhark',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'got',
    name: 'Gothic',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'got-Goth',
        name: 'Gothic',
        layouts: [
          {
            id: 'gothic',
            name: 'Gothic',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'el',
    name: 'Greek',
    layouts: [
      {
        id: 'greek',
        name: 'Greek',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'greek-220',
        name: 'Greek (220)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'greek-220-latin',
        name: 'Greek (220) Latin',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'greek-319',
        name: 'Greek (319)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'greek-319-latin',
        name: 'Greek (319) Latin',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'greek-latin',
        name: 'Greek Latin',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'greek-polytonic',
        name: 'Greek Polytonic',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'gn',
    name: 'Guarani',
    layouts: [
      {
        id: 'guarani',
        name: 'Guarani',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'gu',
    name: 'Gujarati',
    layouts: [
      {
        id: 'gujarati',
        name: 'Gujarati',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'ha',
    name: 'Hausa',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ha-Latn',
        name: 'Hausa (Latin)',
        layouts: [
          {
            id: 'hausa',
            name: 'Hausa',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'haw',
    name: 'Hawaiian',
    layouts: [
      {
        id: 'hawaiian',
        name: 'Hawaiian',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'he',
    name: 'Hebrew',
    layouts: [
      {
        id: 'hebrew',
        name: 'Hebrew',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'hebrew-standard',
        name: 'Hebrew (Standard)',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'he-IL',
        name: 'Hebrew (Israel)',
        layouts: [
          {
            id: 'hebrew-standard-2018',
            name: 'Hebrew (Standard, 2018)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'hi',
    name: 'Hindi',
    layouts: [
      {
        id: 'devanagari-inscript',
        name: 'Devanagari - INSCRIPT',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'hindi-traditional',
        name: 'Hindi Traditional',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'hu',
    name: 'Hungarian',
    layouts: [
      {
        id: 'hungarian',
        name: 'Hungarian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'hungarian-101-key',
        name: 'Hungarian 101-key',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'ccp',
    name: 'Chakma',
    layouts: [],
    children: [
      {
        kind: 'group',
        code: 'ccp-Cakm',
        name: 'Chakma (Chakma)',
        layouts: [],
        children: [
          {
            kind: 'language',
            code: 'ccp-Cakm-BD',
            name: 'Chakma (Chakma, Bangladesh)',
            layouts: [
              {
                id: 'us',
                name: 'US',
                isDefault: true,
                isDefaultFromOtherLanguage: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'chr',
    name: 'Cherokee',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'chr-Cher',
        name: 'Cherokee (Cherokee)',
        layouts: [
          {
            id: 'cherokee-nation',
            name: 'Cherokee Nation',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'cherokee-phonetic',
            name: 'Cherokee Phonetic',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'zh',
    name: 'Chinese',
    layouts: [],
    children: [
      {
        kind: 'group',
        code: 'zh-Hans',
        name: 'Chinese (Simplified)',
        layouts: [],
        children: [
          {
            kind: 'language',
            code: 'zh-Hans-CN',
            name: 'Chinese (Simplified, China)',
            layouts: [
              {
                id: 'chinese-simplified-us',
                name: 'Chinese (Simplified) - US',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
          {
            kind: 'language',
            code: 'zh-Hans-SG',
            name: 'Chinese (Simplified, Singapore)',
            layouts: [
              {
                id: 'chinese-simplified-singapore-us',
                name: 'Chinese (Simplified, Singapore) - US',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
        ],
      },
      {
        kind: 'group',
        code: 'zh-Hant',
        name: 'Chinese (Traditional)',
        layouts: [],
        children: [
          {
            kind: 'language',
            code: 'zh-Hant-HK',
            name: 'Chinese (Traditional, Hong Kong SAR)',
            layouts: [
              {
                id: 'chinese-traditional-hong-kong-sar-us',
                name: 'Chinese (Traditional, Hong Kong S.A.R.) - US',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
          {
            kind: 'language',
            code: 'zh-Hant-MO',
            name: 'Chinese (Traditional, Macao SAR)',
            layouts: [
              {
                id: 'chinese-traditional-macao-sar-us',
                name: 'Chinese (Traditional, Macao S.A.R.) - US',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
          {
            kind: 'language',
            code: 'zh-Hant-TW',
            name: 'Chinese (Traditional, Taiwan)',
            layouts: [
              {
                id: 'chinese-traditional-us',
                name: 'Chinese (Traditional) - US',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'is',
    name: 'Icelandic',
    layouts: [
      {
        id: 'icelandic',
        name: 'Icelandic',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'ig',
    name: 'Igbo',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ig-Latn',
        name: 'Igbo',
        layouts: [
          {
            id: 'igbo',
            name: 'Igbo',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'id',
    name: 'Indonesian',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'iu',
    name: 'Inuktitut',
    layouts: [],
    children: [
      {
        kind: 'group',
        code: 'iu-Cans',
        name: 'Inuktitut (Canadian Aboriginal Syllabics)',
        layouts: [
          {
            id: 'inuktitut-naqittaut',
            name: 'Inuktitut - Naqittaut',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
        children: [
          {
            kind: 'language',
            code: 'iu-Cans-CA',
            name: 'Inuktitut (Syllabics, Canada)',
            layouts: [
              {
                id: 'inuktitut-nattilik',
                name: 'Inuktitut - Nattilik',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
        ],
      },
      {
        kind: 'language',
        code: 'iu-Latn',
        name: 'Inuktitut (Latin)',
        layouts: [
          {
            id: 'inuktitut-latin',
            name: 'Inuktitut - Latin',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'ga',
    name: 'Irish',
    layouts: [
      {
        id: 'irish',
        name: 'Irish',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'xh',
    name: 'isiXhosa',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'zu',
    name: 'isiZulu',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'it',
    name: 'Italian',
    layouts: [
      {
        id: 'italian',
        name: 'Italian',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'it-IT',
        name: 'Italian (Italy)',
        layouts: [
          {
            id: 'italian',
            name: 'Italian',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'italian-142',
            name: 'Italian (142)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'it-CH',
        name: 'Italian (Switzerland)',
        layouts: [
          {
            id: 'swiss-french',
            name: 'Swiss French',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'ja',
    name: 'Japanese',
    layouts: [
      {
        id: 'japanese',
        name: 'Japanese',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'jv',
    name: 'Javanese',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'jv-Java',
        name: 'Javanese (Javanese)',
        layouts: [
          {
            id: 'javanese',
            name: 'Javanese',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'quc',
    name: 'K’iche’',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'quc-Latn',
        name: 'K’iche’',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'kl',
    name: 'Kalaallisut',
    layouts: [
      {
        id: 'greenlandic',
        name: 'Greenlandic',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'danish',
        name: 'Danish',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'kn',
    name: 'Kannada',
    layouts: [
      {
        id: 'kannada',
        name: 'Kannada',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'kr',
    name: 'Kanuri',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'kr-Latn',
        name: 'Kanuri (Latin)',
        layouts: [
          {
            id: 'us',
            name: 'US',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'ks',
    name: 'Kashmiri',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ks-Deva',
        name: 'Kashmiri (Devanagari)',
        layouts: [
          {
            id: 'hindi-traditional',
            name: 'Hindi Traditional',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'kk',
    name: 'Kazakh',
    layouts: [
      {
        id: 'kazakh',
        name: 'Kazakh',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'km',
    name: 'Khmer',
    layouts: [
      {
        id: 'khmer',
        name: 'Khmer',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'khmer-nida',
        name: 'Khmer (NIDA)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'rw',
    name: 'Kinyarwanda',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'sw',
    name: 'Kiswahili',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'kok',
    name: 'Konkani',
    layouts: [
      {
        id: 'devanagari-inscript',
        name: 'Devanagari - INSCRIPT',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'ko',
    name: 'Korean',
    layouts: [
      {
        id: 'korean',
        name: 'Korean',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'ku',
    name: 'Kurdish',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ku-Arab',
        name: 'Central Kurdish',
        layouts: [
          {
            id: 'central-kurdish',
            name: 'Central Kurdish',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'ky',
    name: 'Kyrgyz',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ky-Cyrl',
        name: 'Kyrgyz',
        layouts: [
          {
            id: 'kyrgyz-cyrillic',
            name: 'Kyrgyz Cyrillic',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'lo',
    name: 'Lao',
    layouts: [
      {
        id: 'lao',
        name: 'Lao',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'la',
    name: 'Latin',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'lv',
    name: 'Latvian',
    layouts: [
      {
        id: 'latvian',
        name: 'Latvian',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'latvian-qwerty',
        name: 'Latvian (QWERTY)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'latvian-standard',
        name: 'Latvian (Standard)',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'lis',
    name: 'Lisu',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'lis-Lisu',
        name: 'Lisu (Lisu)',
        layouts: [
          {
            id: 'lisu-basic',
            name: 'Lisu (Basic)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'lisu-standard',
            name: 'Lisu (Standard)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'lt',
    name: 'Lithuanian',
    layouts: [
      {
        id: 'lithuanian',
        name: 'Lithuanian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'lithuanian-ibm',
        name: 'Lithuanian IBM',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'lithuanian-standard',
        name: 'Lithuanian Standard',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'dsb',
    name: 'Lower Sorbian',
    layouts: [
      {
        id: 'sorbian-standard',
        name: 'Sorbian Standard',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'khb',
    name: 'Lü',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'khb-Talu',
        name: 'Xishuangbanna Dai',
        layouts: [
          {
            id: 'new-tai-lue',
            name: 'New Tai Lue',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'lb',
    name: 'Luxembourgish',
    layouts: [
      {
        id: 'luxembourgish',
        name: 'Luxembourgish',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'mk',
    name: 'Macedonian',
    layouts: [
      {
        id: 'macedonian',
        name: 'Macedonian',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'macedonian-standard',
        name: 'Macedonian - Standard',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'ms',
    name: 'Malay',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'ml',
    name: 'Malayalam',
    layouts: [
      {
        id: 'malayalam',
        name: 'Malayalam',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'mt',
    name: 'Maltese',
    layouts: [
      {
        id: 'maltese-47-key',
        name: 'Maltese 47-Key',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'maltese-48-key',
        name: 'Maltese 48-Key',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'mni',
    name: 'Manipuri',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'mni-Beng',
        name: 'Manipuri',
        layouts: [
          {
            id: 'bangla',
            name: 'Bangla',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'mi',
    name: 'Maori',
    layouts: [
      {
        id: 'maori',
        name: 'Maori',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'arn',
    name: 'Mapuche',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'arn-Latn',
        name: 'Mapuche',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'mr',
    name: 'Marathi',
    layouts: [
      {
        id: 'marathi',
        name: 'Marathi',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'moh',
    name: 'Mohawk',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'moh-Latn',
        name: 'Mohawk',
        layouts: [
          {
            id: 'us',
            name: 'US',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'mn',
    name: 'Mongolian',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'mn-Cyrl',
        name: 'Mongolian (Cyrillic)',
        layouts: [
          {
            id: 'mongolian-cyrillic',
            name: 'Mongolian Cyrillic',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'mn-Phag',
        name: 'Mongolian (Phags-pa)',
        layouts: [
          {
            id: 'phags-pa',
            name: 'Phags-pa',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'group',
        code: 'mn-Mong',
        name: 'Mongolian (Traditional Mongolian)',
        layouts: [
          {
            id: 'mongolian-mongolian-script',
            name: 'Mongolian (Mongolian Script)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'traditional-mongolian-standard',
            name: 'Traditional Mongolian (Standard)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
        children: [
          {
            kind: 'language',
            code: 'mn-Mong-CN',
            name: 'Mongolian (Traditional Mongolian, PRC)',
            layouts: [
              {
                id: 'traditional-mongolian-mns',
                name: 'Traditional Mongolian (MNS)',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'nqo',
    name: 'N’ko',
    layouts: [
      {
        id: 'nko',
        name: 'N’Ko',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'ne',
    name: 'Nepali',
    layouts: [
      {
        id: 'nepali',
        name: 'Nepali',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'se',
    name: 'Northern Sami',
    layouts: [],
    children: [
      {
        kind: 'group',
        code: 'se-Latn',
        name: 'Northern Sami',
        layouts: [
          {
            id: 'norwegian-with-sami',
            name: 'Norwegian with Sami',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
        children: [
          {
            kind: 'language',
            code: 'se-Latn-FI',
            name: 'Northern Sami (Finland)',
            layouts: [
              {
                id: 'finnish-with-sami',
                name: 'Finnish with Sami',
                isDefault: true,
                isDefaultFromOtherLanguage: true,
              },
            ],
          },
          {
            kind: 'language',
            code: 'se-Latn-NO',
            name: 'Northern Sami (Norway)',
            layouts: [
              {
                id: 'norwegian-with-sami',
                name: 'Norwegian with Sami',
                isDefault: true,
                isDefaultFromOtherLanguage: false,
              },
              {
                id: 'sami-extended-norway',
                name: 'Sami Extended Norway',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
          {
            kind: 'language',
            code: 'se-Latn-SE',
            name: 'Northern Sami (Sweden)',
            layouts: [
              {
                id: 'finnish-with-sami',
                name: 'Finnish with Sami',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
              {
                id: 'sami-extended-finland-sweden',
                name: 'Sami Extended Finland-Sweden',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
              {
                id: 'swedish-with-sami',
                name: 'Swedish with Sami',
                isDefault: true,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'nb',
    name: 'Norwegian (Bokmål)',
    layouts: [
      {
        id: 'norwegian',
        name: 'Norwegian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'nn',
    name: 'Norwegian (Nynorsk)',
    layouts: [
      {
        id: 'norwegian',
        name: 'Norwegian',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'oc',
    name: 'Occitan',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'oc-Latn',
        name: 'Occitan',
        layouts: [
          {
            id: 'french-legacy-azerty',
            name: 'French (Legacy, AZERTY)',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'or',
    name: 'Odia',
    layouts: [
      {
        id: 'odia',
        name: 'Odia',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'sga',
    name: 'Old Irish',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'sga-Ogam',
        name: 'Old Irish',
        layouts: [
          {
            id: 'ogham',
            name: 'Ogham',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'om',
    name: 'Oromo',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'osa',
    name: 'Osage',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'osa-Osge',
        name: 'Osage',
        layouts: [
          {
            id: 'osage',
            name: 'Osage',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'ps',
    name: 'Pashto',
    layouts: [
      {
        id: 'pashto-afghanistan',
        name: 'Pashto (Afghanistan)',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'fa',
    name: 'Persian',
    layouts: [
      {
        id: 'persian',
        name: 'Persian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'persian-standard',
        name: 'Persian (Standard)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'fa-AF',
        name: 'Persian (Afghanistan)',
        layouts: [
          {
            id: 'persian-standard',
            name: 'Persian (Standard)',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'pl',
    name: 'Polish',
    layouts: [
      {
        id: 'polish-214',
        name: 'Polish (214)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'polish-programmers',
        name: 'Polish (Programmers)',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'pt',
    name: 'Portuguese',
    layouts: [
      {
        id: 'portuguese-brazil-abnt',
        name: 'Portuguese (Brazil ABNT)',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'pt-BR',
        name: 'Portuguese (Brazil)',
        layouts: [
          {
            id: 'portuguese-brazil-abnt',
            name: 'Portuguese (Brazil ABNT)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'portuguese-brazil-abnt2',
            name: 'Portuguese (Brazil ABNT2)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'pt-PT',
        name: 'Portuguese (Portugal)',
        layouts: [
          {
            id: 'portuguese',
            name: 'Portuguese',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'pa',
    name: 'Punjabi (Gurmukhi)',
    layouts: [
      {
        id: 'punjabi',
        name: 'Punjabi',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'pa-Arab',
        name: 'Punjabi (Arabic)',
        layouts: [
          {
            id: 'urdu',
            name: 'Urdu',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'quz',
    name: 'Quechua',
    layouts: [
      {
        id: 'latin-american',
        name: 'Latin American',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'ro',
    name: 'Romanian',
    layouts: [
      {
        id: 'romanian-standard',
        name: 'Romanian (Standard)',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'ro-RO',
        name: 'Romanian (Romania)',
        layouts: [
          {
            id: 'romanian-legacy',
            name: 'Romanian (Legacy)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'romanian-programmers',
            name: 'Romanian (Programmers)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'romanian-standard',
            name: 'Romanian (Standard)',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'rm',
    name: 'Romansh',
    layouts: [
      {
        id: 'swiss-german',
        name: 'Swiss German',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'ru',
    name: 'Russian',
    layouts: [
      {
        id: 'russian',
        name: 'Russian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'russian-mnemonic',
        name: 'Russian - Mnemonic',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'russian-typewriter',
        name: 'Russian (Typewriter)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'sah',
    name: 'Sakha',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'sah-Cyrl',
        name: 'Sakha',
        layouts: [
          {
            id: 'sakha',
            name: 'Sakha',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'smn',
    name: 'Sami (Inari)',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'smn-Latn',
        name: 'Inari Sami',
        layouts: [
          {
            id: 'finnish-with-sami',
            name: 'Finnish with Sami',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'sms',
    name: 'Sami (Skolt)',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'sms-Latn',
        name: 'Skolt Sami',
        layouts: [
          {
            id: 'finnish-with-sami',
            name: 'Finnish with Sami',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'sma',
    name: 'Sami (Southern, Sweden)',
    layouts: [],
    children: [
      {
        kind: 'group',
        code: 'sma-Latn',
        name: 'Southern Sami',
        layouts: [
          {
            id: 'swedish-with-sami',
            name: 'Swedish with Sami',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
        children: [
          {
            kind: 'language',
            code: 'sma-Latn-NO',
            name: 'Southern Sami (Norway)',
            layouts: [
              {
                id: 'norwegian-with-sami',
                name: 'Norwegian with Sami',
                isDefault: true,
                isDefaultFromOtherLanguage: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'smj',
    name: 'Sami, (Lule, Sweden)',
    layouts: [],
    children: [
      {
        kind: 'group',
        code: 'smj-Latn',
        name: 'Lule Sami',
        layouts: [
          {
            id: 'swedish-with-sami',
            name: 'Swedish with Sami',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
        children: [
          {
            kind: 'language',
            code: 'smj-Latn-NO',
            name: 'Lule Sami (Norway)',
            layouts: [
              {
                id: 'norwegian-with-sami',
                name: 'Norwegian with Sami',
                isDefault: true,
                isDefaultFromOtherLanguage: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'sa',
    name: 'Sanskrit',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'sa-Deva',
        name: 'Sanskrit',
        layouts: [
          {
            id: 'devanagari-inscript',
            name: 'Devanagari - INSCRIPT',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'sat',
    name: 'Santali',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'sat-Olck',
        name: 'Santali (Ol Chiki)',
        layouts: [
          {
            id: 'ol-chiki',
            name: 'Ol Chiki',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'gd',
    name: 'Scottish Gaelic',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'gd-Latn',
        name: 'Scottish Gaelic',
        layouts: [
          {
            id: 'scottish-gaelic',
            name: 'Scottish Gaelic',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'sr',
    name: 'Serbian',
    layouts: [],
    children: [
      {
        kind: 'group',
        code: 'sr-Cyrl',
        name: 'Serbian (Cyrillic)',
        layouts: [
          {
            id: 'serbian-cyrillic',
            name: 'Serbian (Cyrillic)',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
        children: [
          {
            kind: 'language',
            code: 'sr-Cyrl-CS',
            name: 'Serbian (Cyrillic, Serbia and Montenegro (Former))',
            layouts: [
              {
                id: 'serbian-cyrillic',
                name: 'Serbian (Cyrillic)',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
        ],
      },
      {
        kind: 'group',
        code: 'sr-Latn',
        name: 'Serbian (Latin)',
        layouts: [
          {
            id: 'serbian-latin',
            name: 'Serbian (Latin)',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
        children: [
          {
            kind: 'language',
            code: 'sr-Latn-CS',
            name: 'Serbian (Latin, Serbia and Montenegro (Former))',
            layouts: [
              {
                id: 'serbian-latin',
                name: 'Serbian (Latin)',
                isDefault: false,
                isDefaultFromOtherLanguage: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'nso',
    name: 'Sesotho sa Leboa',
    layouts: [
      {
        id: 'sesotho-sa-leboa',
        name: 'Sesotho sa Leboa',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'tn',
    name: 'Setswana',
    layouts: [
      {
        id: 'setswana',
        name: 'Setswana',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'sd',
    name: 'Sindhi',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'sd-Arab',
        name: 'Sindhi (Arabic)',
        layouts: [
          {
            id: 'urdu',
            name: 'Urdu',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'sd-Deva',
        name: 'Sindhi (Devanagari)',
        layouts: [
          {
            id: 'hindi-traditional',
            name: 'Hindi Traditional',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'si',
    name: 'Sinhala',
    layouts: [
      {
        id: 'sinhala',
        name: 'Sinhala',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'sinhala-wij-9',
        name: 'Sinhala - Wij 9',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'sk',
    name: 'Slovak',
    layouts: [
      {
        id: 'slovak',
        name: 'Slovak',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'slovak-qwerty',
        name: 'Slovak (QWERTY)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'sl',
    name: 'Slovenian',
    layouts: [
      {
        id: 'slovenian',
        name: 'Slovenian',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'so',
    name: 'Somali (Latin)',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'so-Osma',
        name: 'Somali (Osmanya)',
        layouts: [
          {
            id: 'osmanya',
            name: 'Osmanya',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'srb',
    name: 'Sora',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'srb-Sora',
        name: 'Sora',
        layouts: [
          {
            id: 'sora',
            name: 'Sora',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'st',
    name: 'Sotho',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'es',
    name: 'Spanish',
    layouts: [
      {
        id: 'spanish',
        name: 'Spanish',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'es-AR',
        name: 'Spanish (Argentina)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-419',
        name: 'Spanish (Latin America)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-CL',
        name: 'Spanish (Chile)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-HN',
        name: 'Spanish (Honduras)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-GT',
        name: 'Spanish (Guatemala)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-SV',
        name: 'Spanish (El Salvador)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-EC',
        name: 'Spanish (Ecuador)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-DO',
        name: 'Spanish (Dominican Republic)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-CR',
        name: 'Spanish (Costa Rica)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-CO',
        name: 'Spanish (Colombia)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-BO',
        name: 'Spanish (Bolivia)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-MX',
        name: 'Spanish (Mexico)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-NI',
        name: 'Spanish (Nicaragua)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-PR',
        name: 'Spanish (Puerto Rico)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-PE',
        name: 'Spanish (Peru)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-PY',
        name: 'Spanish (Paraguay)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-PA',
        name: 'Spanish (Panama)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-ES',
        name: 'Spanish (Spain)',
        layouts: [
          {
            id: 'spanish',
            name: 'Spanish',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'spanish-variation',
            name: 'Spanish Variation',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-US',
        name: 'Spanish (United States)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-VE',
        name: 'Spanish (Venezuela)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
      {
        kind: 'language',
        code: 'es-UY',
        name: 'Spanish (Uruguay)',
        layouts: [
          {
            id: 'latin-american',
            name: 'Latin American',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'sv',
    name: 'Swedish',
    layouts: [
      {
        id: 'swedish',
        name: 'Swedish',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'syr',
    name: 'Syriac‎',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'syr-Syrc',
        name: 'Syriac‎',
        layouts: [
          {
            id: 'syriac',
            name: 'Syriac',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'syriac-phonetic',
            name: 'Syriac Phonetic',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'tg',
    name: 'Tajik',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'tg-Cyrl',
        name: 'Tajik (Cyrillic)',
        layouts: [
          {
            id: 'tajik',
            name: 'Tajik',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'ta',
    name: 'Tamil',
    layouts: [
      {
        id: 'tamil-99',
        name: 'Tamil 99',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
    children: [
      {
        kind: 'language',
        code: 'ta-IN',
        name: 'Tamil (India)',
        layouts: [
          {
            id: 'tamil',
            name: 'Tamil',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'tamil-99',
            name: 'Tamil 99',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'tamil-anjal',
            name: 'Tamil Anjal',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'tt',
    name: 'Tatar',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'tt-Cyrl',
        name: 'Tatar (Cyrillic)',
        layouts: [
          {
            id: 'tatar',
            name: 'Tatar',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'tatar-legacy',
            name: 'Tatar (Legacy)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'te',
    name: 'Telugu',
    layouts: [
      {
        id: 'telugu',
        name: 'Telugu',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'th',
    name: 'Thai',
    layouts: [
      {
        id: 'thai-kedmanee',
        name: 'Thai Kedmanee',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'thai-kedmanee-non-shiftlock',
        name: 'Thai Kedmanee (non-ShiftLock)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'thai-pattachote',
        name: 'Thai Pattachote',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'thai-pattachote-non-shiftlock',
        name: 'Thai Pattachote (non-ShiftLock)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'bo',
    name: 'Tibetan',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'bo-Tibt',
        name: 'Tibetan',
        layouts: [
          {
            id: 'tibetan-prc',
            name: 'Tibetan (PRC)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'tibetan-prc-updated',
            name: 'Tibetan (PRC) - Updated',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'ts',
    name: 'Tsonga',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'tr',
    name: 'Turkish',
    layouts: [
      {
        id: 'turkish-f',
        name: 'Turkish F',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'turkish-q',
        name: 'Turkish Q',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'group',
    code: 'tk',
    name: 'Turkmen',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'tk-Latn',
        name: 'Turkmen (Latin)',
        layouts: [
          {
            id: 'turkmen',
            name: 'Turkmen',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 'uk',
    name: 'Ukrainian',
    layouts: [
      {
        id: 'ukrainian',
        name: 'Ukrainian',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'ukrainian-enhanced',
        name: 'Ukrainian (Enhanced)',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'hsb',
    name: 'Upper Sorbian',
    layouts: [
      {
        id: 'sorbian-extended',
        name: 'Sorbian Extended',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'sorbian-standard',
        name: 'Sorbian Standard',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
      {
        id: 'sorbian-standard-legacy',
        name: 'Sorbian Standard (Legacy)',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'ur',
    name: 'Urdu',
    layouts: [
      {
        id: 'urdu',
        name: 'Urdu',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'ug',
    name: 'Uyghur',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'ug-Arab',
        name: 'Uyghur',
        layouts: [
          {
            id: 'uyghur',
            name: 'Uyghur',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
          {
            id: 'uyghur-legacy',
            name: 'Uyghur (Legacy)',
            isDefault: false,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    code: 'uz',
    name: 'Uzbek',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'uz-Cyrl',
        name: 'Uzbek (Cyrillic)',
        layouts: [
          {
            id: 'uzbek-cyrillic',
            name: 'Uzbek Cyrillic',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
      {
        kind: 'language',
        code: 'uz-Latn',
        name: 'Uzbek (Latin)',
        layouts: [
          {
            id: 'us',
            name: 'US',
            isDefault: true,
            isDefaultFromOtherLanguage: true,
          },
        ],
      },
    ],
  },
  {
    kind: 'language',
    code: 've',
    name: 'Venda',
    layouts: [
      {
        id: 'us',
        name: 'US',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'vi',
    name: 'Vietnamese',
    layouts: [
      {
        id: 'vietnamese',
        name: 'Vietnamese',
        isDefault: false,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'cy',
    name: 'Welsh',
    layouts: [
      {
        id: 'united-kingdom-extended',
        name: 'United Kingdom Extended',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
  {
    kind: 'language',
    code: 'wo',
    name: 'Wolof',
    layouts: [
      {
        id: 'wolof',
        name: 'Wolof',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'language',
    code: 'yi',
    name: 'Yiddish',
    layouts: [
      {
        id: 'hebrew-standard',
        name: 'Hebrew (Standard)',
        isDefault: true,
        isDefaultFromOtherLanguage: true,
      },
    ],
  },
  {
    kind: 'group',
    code: 'yo',
    name: 'Yoruba',
    layouts: [],
    children: [
      {
        kind: 'language',
        code: 'yo-Latn',
        name: 'Yoruba',
        layouts: [
          {
            id: 'yoruba',
            name: 'Yoruba',
            isDefault: true,
            isDefaultFromOtherLanguage: false,
          },
        ],
      },
    ],
  },
];
