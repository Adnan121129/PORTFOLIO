import type { Research } from '../types';

export const detectingAiGeneratedMedia: Research = {
  slug: 'detecting-ai-generated-media',
  index: 4,
  title: 'Detecting AI-Generated Media (Video, Audio, and Image) for Privacy and Security',
  shortTitle: 'Detecting AI-generated media',
  area: ['Multimodal deep learning', 'Digital forensics', 'Security'],
  summary:
    'A multimodal framework for detecting deepfake video, AI-generated audio and synthetic images, combining a hybrid CNN–transformer model with cryptographic verification techniques.',
  status: {
    label: 'Proposed framework',
    detail:
      'The supplied abstract describes the framework and its focus areas but includes no benchmark figures, so none are shown. Publication status is not stated.',
  },
  abstractLabel: 'Abstract',
  abstract: [
    'The spread of AI-generated synthesized media represents a fundamental threat to digital trust, privacy, and security. This work contributes to the sensitive issue of realistic detection, by means of an extensive multi-modal framework aimed at deepfake videos, AI-driven audio and synthesized pictures. We introduce a novel hybrid model based on CNN-transformer with cryptographic verification techniques. The findings of this work have instant applications in digital forensics, cybersecurity, and media authentication, including the systematic investigation of detection schemes where their privacy-preserving implementation approaches are studied including performance comparison with existing state-of-the-art methods.',
  ],
  keywordsLabel: 'Index terms',
  keywords: [
    'deepfake detection',
    'synthetic media',
    'multi-modal deep learning',
    'digital forensics',
    'media authentication',
    'cybersecurity',
  ],
  sections: [
    {
      id: 'context',
      title: 'Problem context',
      blocks: [
        {
          kind: 'paragraph',
          text: 'AI-generated synthesized media — deepfake videos, AI-driven audio and synthesized pictures — is a fundamental threat to digital trust, privacy and security.',
        },
      ],
    },
    {
      id: 'approach',
      title: 'Approach',
      blocks: [
        {
          kind: 'features',
          columns: 3,
          items: [
            { title: 'Video', icon: 'monitor', points: ['Deepfake videos'] },
            { title: 'Audio', icon: 'mic', points: ['AI-driven audio'] },
            { title: 'Image', icon: 'image', points: ['Synthesized pictures'] },
          ],
        },
        {
          kind: 'definitions',
          items: [
            {
              term: 'Model',
              detail: 'A novel hybrid model based on a CNN–transformer architecture.',
            },
            {
              term: 'Verification',
              detail: 'Combined with cryptographic verification techniques.',
            },
            {
              term: 'Study focus',
              detail:
                'A systematic investigation of detection schemes, their privacy-preserving implementation approaches, and performance comparison with existing state-of-the-art methods.',
            },
          ],
        },
      ],
    },
    {
      id: 'applications',
      title: 'Applications',
      blocks: [
        {
          kind: 'chips',
          label: 'Areas the abstract names',
          items: ['Digital forensics', 'Cybersecurity', 'Media authentication'],
        },
      ],
    },
    {
      id: 'scope',
      title: 'Status & scope',
      blocks: [
        {
          kind: 'list',
          style: 'bullet',
          items: [
            'The abstract describes a performance comparison with state-of-the-art methods, but no benchmark values were supplied — so none are shown or implied here.',
            'Publication status is not stated in the supplied material.',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'Research on detecting AI-generated media: a multimodal framework for deepfake video, AI-generated audio and synthetic images using a hybrid CNN–transformer model with cryptographic verification for privacy and security.',
};
