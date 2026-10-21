import type { Research } from '../types';

export const genderBiasSocialMediaComments: Research = {
  slug: 'gender-bias-social-media-comments',
  index: 5,
  title: 'Unveiling Gender Bias in Social Media Comments',
  shortTitle: 'Gender bias in social media comments',
  area: ['Natural language processing', 'Multilingual text', 'Sentiment & toxicity'],
  summary:
    'NLP research analysing gender bias, toxicity, abusive language and sentiment in Bangla, English and Banglish YouTube comments directed at Bangladeshi male and female influencers.',
  status: {
    label: 'Applied research project',
    detail:
      'Dataset size, annotation-agreement figures and findings were not included in the supplied material, so none are stated. Publication status is not stated.',
  },
  abstractLabel: 'Project summary',
  abstract: [
    'An NLP-based research project analyzing gender bias, toxicity, abusive language, and sentiment in YouTube comments targeting Bangladeshi male and female influencers.',
    'The project focused on Bangla, English, and Banglish (code-mixed) comments across Educational, Comedy, Food Vlogging, Lifestyle, and Fitness influencer categories. I collected and preprocessed YouTube comment data, performed annotation and ground-truth validation, and applied Machine Learning and Natural Language Processing techniques for sentiment and toxic-comment classification.',
    'The study explored differences in the nature and severity of negative comments directed toward male and female influencers, including abusive, mocking, sarcastic, and harassing content. The work combined data preparation, annotation, multilingual text processing and classification into one applied research pipeline.',
  ],
  keywordsLabel: 'Topics',
  keywords: [
    'Python',
    'NLP',
    'Machine Learning',
    'Sentiment Analysis',
    'Text Classification',
    'Toxicity Detection',
    'Bangla / Banglish Text Processing',
    'Data Preprocessing & Annotation',
    'Scikit-learn',
    'Transformers',
  ],
  sections: [
    {
      id: 'scope-of-data',
      title: 'Data scope',
      blocks: [
        {
          kind: 'chips',
          label: 'Languages',
          items: ['Bangla', 'English', 'Banglish (code-mixed)'],
        },
        {
          kind: 'chips',
          label: 'Influencer categories',
          items: ['Educational', 'Comedy', 'Food Vlogging', 'Lifestyle', 'Fitness'],
        },
      ],
    },
    {
      id: 'pipeline',
      title: 'Research pipeline',
      blocks: [
        {
          kind: 'flow',
          label: 'One applied research pipeline',
          nodes: [
            'Collect YouTube comments',
            'Preprocess',
            'Annotate & validate ground truth',
            'Multilingual text processing',
            'Sentiment & toxic-comment classification',
            'Compare comments directed at male vs female influencers',
          ],
        },
      ],
    },
    {
      id: 'analysis',
      title: 'Analysis focus',
      blocks: [
        {
          kind: 'paragraph',
          text: 'The study explored differences in the nature and severity of negative comments directed toward male and female influencers.',
        },
        {
          kind: 'chips',
          label: 'Kinds of negative content examined',
          items: ['Abusive', 'Mocking', 'Sarcastic', 'Harassing'],
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
            'Sample sizes, model scores and conclusions were not part of the supplied material, so this page does not state them.',
            'No ethics-review or publication claims are made.',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'NLP research on gender bias, toxicity, abusive language and sentiment in Bangla, English and Banglish YouTube comments about Bangladeshi influencers — data collection, annotation and multilingual classification.',
};
