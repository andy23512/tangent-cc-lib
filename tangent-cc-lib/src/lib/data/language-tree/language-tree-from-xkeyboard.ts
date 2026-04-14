import type { LanguageTree } from '../../model/language-tree.models.js';

export const LANGUAGE_TREE_FROM_XKEYBOARD: LanguageTree = [
  {
    kind: 'language',
    code: 'br',
    name: 'Breton',
    layouts: [
      {
        id: 'fr-bre@xkeyboard',
        name: 'Breton (France)',
        isDefault: true,
        isDefaultFromOtherLanguage: false,
      },
    ],
  },
];
