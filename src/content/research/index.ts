import type { Research } from '../types';
import { automaticGarbageDetection } from './automatic-garbage-detection';
import { detectingAiGeneratedMedia } from './detecting-ai-generated-media';
import { energyEfficientFederatedLearning } from './energy-efficient-federated-learning';
import { genderBiasSocialMediaComments } from './gender-bias-social-media-comments';
import { nirapotta } from './nirapotta';

/** Research items in the order of the source file (R/01 … R/05). */
export const research: Research[] = [
  nirapotta,
  automaticGarbageDetection,
  energyEfficientFederatedLearning,
  detectingAiGeneratedMedia,
  genderBiasSocialMediaComments,
];

export function getResearch(slug: string): Research | undefined {
  return research.find((item) => item.slug === slug);
}

export function getAdjacentResearch(slug: string): { previous: Research; next: Research } {
  const index = research.findIndex((item) => item.slug === slug);
  if (index === -1) throw new Error(`Unknown research slug: ${slug}`);
  return {
    previous: research[(index - 1 + research.length) % research.length],
    next: research[(index + 1) % research.length],
  };
}

export function formatResearchIndex(index: number): string {
  return `R/${String(index).padStart(2, '0')}`;
}
