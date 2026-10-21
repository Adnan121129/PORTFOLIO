import type { Research } from '../types';

export const energyEfficientFederatedLearning: Research = {
  slug: 'energy-efficient-federated-learning',
  index: 3,
  title: 'Energy-Efficient Federated Learning for Green Computing',
  shortTitle: 'Energy-efficient federated learning',
  area: ['Federated learning', 'Green computing', 'Sustainable AI'],
  summary:
    'A green-computing approach to federated learning that adapts model size to each client’s energy profile and filters unnecessary data processing — reporting up to 46.1% lower carbon emissions in simulation while maintaining global-model performance.',
  status: {
    label: 'Simulation study',
    detail:
      'Reported results come from simulations, not a production deployment. Publication status is not stated in the supplied material.',
  },
  abstractLabel: 'Abstract',
  abstract: [
    'Traditional Federated Learning (FL) systems, while providing privacy protection, often consume a massive amount of energy and hinder sustainable computing. In this study, we introduce a green computing-inspired energy-efficient federated learning model. We present two main strategies that this system uses to achieve its goal: Adaptive model size, allowing the models complexity to be adjusted according to client energy profiles; and Sustainable data utilisation, which avoids calculating unnecessary processing via intelligent filtering of the data. Simulations show that this approach significantly reduces carbon emissions – up to 46.1 percent – while maintaining the performance of global models. By discarding low-quality data, the framework can improve model performance, presenting a way forward for developing AI systems that balance high efficacy with environmental sustainability.',
  ],
  keywordsLabel: 'Index terms',
  keywords: [
    'Green Computing',
    'Federated Learning',
    'Energy Saving and Optimization',
    'Adaptive Model Sizing',
    'Sustainable AI Techniques For Eco-Friendly Use of Data',
  ],
  sections: [
    {
      id: 'context',
      title: 'Problem context',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Federated learning protects privacy by training across clients without centralising their data, but traditional FL systems often consume a massive amount of energy and work against sustainable computing.',
        },
      ],
    },
    {
      id: 'approach',
      title: 'Approach',
      blocks: [
        {
          kind: 'features',
          columns: 2,
          items: [
            {
              title: 'Adaptive model size',
              icon: 'gauge',
              points: ['Model complexity is adjusted according to each client’s energy profile.'],
            },
            {
              title: 'Sustainable data utilisation',
              icon: 'recycle',
              points: [
                'Intelligent filtering of the data avoids unnecessary processing; discarding low-quality data can also improve model performance.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'results',
      title: 'Reported results',
      blocks: [
        {
          kind: 'stats',
          items: [
            { value: 'up to 46.1%', label: 'lower carbon emissions in the study’s simulations' },
          ],
        },
        {
          kind: 'list',
          style: 'bullet',
          items: [
            'Global-model performance is reported as maintained while emissions fall.',
            'Removing low-quality data is reported to be able to improve model performance.',
          ],
        },
        {
          kind: 'callout',
          tone: 'caution',
          title: 'How to read this figure',
          text: '46.1% is the maximum reduction reported in simulation. It is not a measured result from a deployed system, and the simulation set-up was not included in the supplied material.',
        },
      ],
    },
    {
      id: 'contribution',
      title: 'Contribution',
      blocks: [
        {
          kind: 'paragraph',
          text: 'The work presents a way forward for AI systems that balance high efficacy with environmental sustainability, by treating client energy and data quality as first-class inputs to federated training.',
        },
      ],
    },
  ],
  seoDescription:
    'Research on energy-efficient federated learning for green computing: adaptive model sizing per client energy profile and sustainable data utilisation, reporting up to 46.1% lower carbon emissions in simulation.',
};
