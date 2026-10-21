import { describe, expect, it } from 'vitest';
import { activities, capabilities, education, skillGroups } from '@/content/profile';
import {
  featuredProjectSlugs,
  getAdjacentProjects,
  getProject,
  moreProjectSlugs,
  projects,
} from '@/content/projects';
import { getResearch, research } from '@/content/research';
import type { Block, Project } from '@/content/types';

/** Every string anywhere inside a value (used to scan content for URLs and claims). */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

function testsBlock(project: Project): Extract<Block, { kind: 'tests' }> | undefined {
  return project.sections
    .flatMap((section) => section.blocks)
    .find((block) => block.kind === 'tests') as Extract<Block, { kind: 'tests' }> | undefined;
}

describe('projects', () => {
  it('includes all eight projects from the brief, in order, with unique slugs and indices', () => {
    expect(projects.map((project) => project.slug)).toEqual([
      'plantops-intelligence',
      'infravision-ai',
      'linguasi',
      'omnimanager',
      'greenfactory-bi',
      'muhibbi-tea-house',
      'the-ottoman-empire',
      'chatmate',
    ]);
    expect(projects.map((project) => project.title)).toEqual([
      'PlantOps Intelligence',
      'InfraVision AI',
      'LinguaSI',
      'OmniManager',
      'GreenFactory BI',
      'Muhibbi Tea House',
      'The Ottoman Empire · 1299–1922',
      'ChatMate',
    ]);
    expect(new Set(projects.map((project) => project.index)).size).toBe(projects.length);
    const listed = [...featuredProjectSlugs, ...moreProjectSlugs].sort();
    expect(listed).toEqual(projects.map((project) => project.slug).sort());
  });

  it('gives every project the fields a case study needs', () => {
    for (const project of projects) {
      expect(project.subtitle, project.slug).not.toBe('');
      expect(project.summary.length, project.slug).toBeGreaterThan(40);
      expect(project.sections.length, project.slug).toBeGreaterThanOrEqual(2);
      expect(project.tags.length, project.slug).toBeGreaterThan(0);
      expect(project.seoDescription.length, project.slug).toBeLessThanOrEqual(320);
      const sectionIds = project.sections.map((section) => section.id);
      expect(new Set(sectionIds).size, `${project.slug} section ids`).toBe(sectionIds.length);
    }
  });

  it('uses exactly the repository links supplied (and none for OmniManager)', () => {
    const repos = Object.fromEntries(projects.map((project) => [project.slug, project.repo]));
    expect(repos).toEqual({
      'plantops-intelligence': 'https://github.com/Adnan121129/PlantOps-Intelligence.git',
      'infravision-ai': 'https://github.com/Adnan121129/InfraVision-AI.git',
      linguasi: 'https://github.com/Adnan121129/LinguaSI.git',
      omnimanager: undefined,
      'greenfactory-bi': 'https://github.com/Adnan121129/GreenFactory-BI.git',
      'muhibbi-tea-house': 'https://github.com/Adnan121129/MUHIBBI-TEA-HOUSE.git',
      'the-ottoman-empire': 'https://github.com/Adnan121129/The-Ottoman-Empire.git',
      chatmate: 'https://github.com/Adnan121129/ChatMate.git',
    });
  });

  it('does not invent live-demo or other external links', () => {
    const urls = projects.flatMap((project) =>
      strings(project).flatMap((text) => text.match(/https?:\/\/\S+/g) ?? []),
    );
    for (const url of urls)
      expect(url).toMatch(/^https:\/\/github\.com\/Adnan121129\/[\w.-]+\.git$/);
  });

  it('keeps the supplied test figures and explains how totals relate to them', () => {
    const figures = (slug: string) =>
      testsBlock(getProject(slug)!)?.items.map((item) => item.value);
    expect(figures('plantops-intelligence')).toEqual(['76', '20', 'E2E', 'Lint']);
    expect(figures('linguasi')).toEqual(['159', '64', 'E2E']);
    expect(figures('omnimanager')).toEqual(['136', '54', '5']);
    expect(figures('greenfactory-bi')).toEqual(['109', '44', 'E2E']);
    expect(testsBlock(getProject('plantops-intelligence')!)?.note).toContain('100 automated tests');
    expect(testsBlock(getProject('linguasi')!)?.note).toContain('223');
  });

  it('labels synthetic datasets and demo models clearly', () => {
    const noticeTitles = (slug: string) =>
      getProject(slug)?.notices?.map((notice) => notice.title) ?? [];
    expect(noticeTitles('plantops-intelligence')).toContain('Synthetic demo dataset');
    expect(noticeTitles('greenfactory-bi')).toContain('Synthetic demo dataset');
    expect(noticeTitles('infravision-ai')).toContain('Current status: demo detection model');
  });

  it('links each case study to a previous and next project, wrapping around', () => {
    expect(getAdjacentProjects('plantops-intelligence').previous.slug).toBe('chatmate');
    expect(getAdjacentProjects('chatmate').next.slug).toBe('plantops-intelligence');
  });
});

describe('research', () => {
  it('includes the five research items with their own slugs', () => {
    expect(research.map((item) => item.slug)).toEqual([
      'nirapotta',
      'automatic-garbage-detection',
      'energy-efficient-federated-learning',
      'detecting-ai-generated-media',
      'gender-bias-social-media-comments',
    ]);
    for (const item of research) {
      expect(getResearch(item.slug)).toBe(item);
      expect(item.abstract.length, item.slug).toBeGreaterThan(0);
      expect(item.status.detail.length, item.slug).toBeGreaterThan(0);
    }
  });

  it('never presents an item as published or peer-reviewed', () => {
    for (const item of research) {
      expect(item.status.label).not.toMatch(
        /published|peer[- ]?review|accepted|journal|conference/i,
      );
      expect(item.status.detail).not.toMatch(
        /\bwas published\b|\bis published\b|peer[- ]?reviewed/i,
      );
    }
  });
});

describe('profile', () => {
  it('keeps education, skills, activities and capability evidence consistent', () => {
    expect(education.map((entry) => entry.credential)).toEqual([
      'Bachelor of Science in Computer Science & Engineering (BSCSE)',
      'Higher Secondary Certificate (HSC)',
      'Secondary School Certificate (SSC)',
    ]);
    expect(skillGroups.flatMap((group) => group.items)).toContain('Power BI');
    expect(activities).toHaveLength(6);
    for (const capability of capabilities) {
      for (const evidence of capability.evidence) {
        const target =
          evidence.kind === 'project' ? getProject(evidence.slug) : getResearch(evidence.slug);
        expect(target, `${capability.id} → ${evidence.slug}`).toBeDefined();
      }
    }
  });
});
