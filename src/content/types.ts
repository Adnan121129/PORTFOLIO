/**
 * Content model for projects, research and profile data.
 *
 * All portfolio content lives in typed modules under src/content so it can be edited
 * without touching layout components. Every fact comes from the supplied source file
 * (Portfolio_Prompt.txt); nothing here should be invented.
 */

export type ProjectCategory =
  'mis-bi' | 'ai-ml' | 'full-stack' | 'mobile' | 'interactive-3d' | 'desktop';

export type Stat = {
  value: string;
  label: string;
};

export type Feature = {
  title: string;
  /** Lucide icon name (see components/content/icon.tsx). */
  icon?: IconName;
  points: string[];
};

export type Step = {
  title: string;
  points: string[];
};

export type StackGroup = {
  label: string;
  items: string[];
};

export type TestFigure = {
  /** e.g. "76" or "E2E" — never computed, always copied from the source. */
  value: string;
  label: string;
  detail?: string;
};

export type Block =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[]; style?: 'bullet' | 'check' | 'number' }
  | { kind: 'questions'; items: string[] }
  | { kind: 'features'; items: Feature[]; columns?: 2 | 3 }
  | { kind: 'steps'; items: Step[] }
  | {
      kind: 'flow';
      label: string;
      nodes: string[];
      /** Exit states shown after the main sequence, e.g. "Cancelled". */
      exits?: string[];
      caption?: string;
    }
  | { kind: 'chips'; label: string; items: string[] }
  | { kind: 'stack'; groups: StackGroup[] }
  | { kind: 'stats'; items: Stat[]; label?: string }
  | { kind: 'tests'; items: TestFigure[]; note?: string }
  | { kind: 'callout'; tone: 'info' | 'caution' | 'data'; title: string; text: string }
  | { kind: 'definitions'; items: { term: string; detail: string }[] }
  | { kind: 'diagram'; diagram: DiagramName; caption: string }
  | { kind: 'quote'; paragraphs: string[]; label: string };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
};

export type Notice = {
  tone: 'data' | 'caution' | 'info';
  title: string;
  text: string;
};

export type Project = {
  slug: string;
  index: number;
  title: string;
  /** Descriptor line under the title (e.g. "Power Plant Management Information System…"). */
  subtitle: string;
  tagline: string;
  /** Card summary, 1–2 sentences. */
  summary: string;
  categories: ProjectCategory[];
  /** Badges shown on cards and in the case-study header. */
  tags: string[];
  /** Repository URL exactly as supplied, or undefined when none was supplied. */
  repo?: string;
  /** Hue (0–360) for the per-project accent used in illustrations. */
  hue: number;
  featured: boolean;
  illustration: IllustrationName;
  stats?: Stat[];
  notices?: Notice[];
  sections: Section[];
  seoDescription: string;
  keywords: string[];
};

export type ResearchStatus = {
  label: string;
  detail: string;
};

export type Research = {
  slug: string;
  index: number;
  title: string;
  shortTitle: string;
  area: string[];
  summary: string;
  status: ResearchStatus;
  /** "Abstract" for paper-style abstracts, "Project summary" otherwise. */
  abstractLabel: string;
  abstract: string[];
  keywords: string[];
  keywordsLabel: string;
  sections: Section[];
  seoDescription: string;
};

export type IllustrationName =
  | 'plantops'
  | 'infravision'
  | 'linguasi'
  | 'omnimanager'
  | 'greenfactory'
  | 'muhibbi'
  | 'ottoman'
  | 'chatmate';

export type DiagramName =
  | 'plantops-data-flow'
  | 'infravision-pipeline'
  | 'linguasi-architecture'
  | 'nirapotta-flow'
  | 'garbage-pipeline';

export type IconName =
  | 'dashboard'
  | 'clipboard'
  | 'cog'
  | 'wrench'
  | 'package'
  | 'users'
  | 'wallet'
  | 'bell'
  | 'file'
  | 'lightbulb'
  | 'palette'
  | 'upload'
  | 'image'
  | 'building'
  | 'scan'
  | 'chart'
  | 'map'
  | 'network'
  | 'shield'
  | 'pen'
  | 'mic'
  | 'book'
  | 'languages'
  | 'trending'
  | 'message'
  | 'trophy'
  | 'smartphone'
  | 'kanban'
  | 'contact'
  | 'timer'
  | 'gauge'
  | 'receipt'
  | 'signature'
  | 'door'
  | 'radar'
  | 'monitor'
  | 'zap'
  | 'droplet'
  | 'recycle'
  | 'factory'
  | 'cloud'
  | 'coins'
  | 'target'
  | 'database'
  | 'cup'
  | 'store'
  | 'globe'
  | 'clock'
  | 'swords'
  | 'landmark'
  | 'crown'
  | 'git'
  | 'search'
  | 'sparkles'
  | 'lock'
  | 'activity'
  | 'cpu';
