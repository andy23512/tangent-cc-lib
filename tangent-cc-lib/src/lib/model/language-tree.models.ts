export interface LanguageLayoutRef {
  id: string;
  name: string;
  isDefault: boolean;
  isDefaultFromOtherLanguage: boolean;
}

export interface LanguageTreeGroupNode {
  kind: 'group';
  code: string;
  name: string;
  layouts: LanguageLayoutRef[];
  children: LanguageTreeNode[];
}

export interface LanguageTreeLeafNode {
  kind: 'language';
  code: string;
  name: string;
  layouts: LanguageLayoutRef[];
}

export type LanguageTreeNode = LanguageTreeGroupNode | LanguageTreeLeafNode;
export type LanguageTree = LanguageTreeNode[];
