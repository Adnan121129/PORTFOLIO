import type { Research } from '../types';

export const automaticGarbageDetection: Research = {
  slug: 'automatic-garbage-detection',
  index: 2,
  title:
    'Automatic Detection of Garbage in Urban Areas: A Hybrid Classical DIP and Machine Learning Approach',
  shortTitle: 'Automatic garbage detection in urban areas',
  area: ['Computer vision', 'Digital image processing', 'Urban monitoring'],
  summary:
    'A CPU-only framework that combines classical digital image processing, fused colour–texture–shape features and an SVM classifier to tell Garbage scenes from Clean ones — aimed at existing CCTV edge devices in places like Dhaka.',
  status: {
    label: 'Study with reported results',
    detail:
      'Results are those reported in the study’s abstract; exact metrics were not included in the supplied material. Publication status is not stated.',
  },
  abstractLabel: 'Abstract',
  abstract: [
    'The problem of unmanaged urban solid waste in densely populated areas continues to represent a significant threat to public health, infrastructure, and the environment. Using manual techniques to monitor littered (i.e., dirty) areas is typically reactive, expensive to scale, and subject to ambiguity due to possible inconsistencies in judgment between different observers. This study presents an automatic trash detection framework that utilizes a combination of classical Digital Image Processing (DIP) preprocessing, a custom feature extraction approach, and Support Vector Machine (SVM) classification techniques. The DIP preprocessing phase employs a number of techniques such as bilateral denoising, Contrast-Limited Adaptive Histogram Equalization (CLAHE), Multi-Mode Edge Detection (MMED), and Morphological Refinement (MR), and generates clearer and more detailed representations of urban scene images. All three feature channels—chromatic HSV histograms, Local Binary Pattern texture descriptors, and Hu moment statistics based on shape—are fused together to create a compact feature vector that encodes the visual characteristics of waste accumulation. The benchmark dataset used for testing was a balanced dataset comprising images from the public TACO (Trash Annotations in Context) dataset, and our results indicate that the SVM-based approach achieves near-perfect classification performance across both Garbage and Clean scenes and significantly outperforms a MobileNetV2 deep learning baseline, particularly in data-constrained situations. We also present a detailed analysis of class imbalance inherent in image datasets annotated with masks of garbage and methods for overcoming this class imbalance using Synthetic Minority Over-sampling Technique (SMOTE). This system relies solely on CPU during inference, which means it can be deployed without any prior work. The system will also work in resource constrained environments such as Dhaka, Bangladesh, where it can be deployed directly on inexpensive edge devices that already exist as part of the CCTV system.',
  ],
  keywordsLabel: 'Index terms',
  keywords: [
    'garbage detection',
    'urban waste monitoring',
    'digital image processing',
    'support vector machine',
    'CLAHE',
    'local binary patterns',
    'TACO dataset',
    'MobileNetV2',
    'transfer learning',
    'SMOTE',
    'class imbalance',
  ],
  sections: [
    {
      id: 'context',
      title: 'Problem context',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Unmanaged urban solid waste in densely populated areas threatens public health, infrastructure and the environment. Monitoring littered areas manually is reactive, expensive to scale and inconsistent between observers — a particular problem in resource-constrained cities such as Dhaka, Bangladesh.',
        },
      ],
    },
    {
      id: 'method',
      title: 'Method',
      blocks: [
        {
          kind: 'diagram',
          diagram: 'garbage-pipeline',
          caption:
            'Classical DIP preprocessing produces clearer scene representations; three feature channels are fused into one compact vector and classified by an SVM.',
        },
        {
          kind: 'definitions',
          items: [
            {
              term: 'DIP preprocessing',
              detail:
                'Bilateral denoising, Contrast-Limited Adaptive Histogram Equalization (CLAHE), Multi-Mode Edge Detection (MMED) and Morphological Refinement (MR).',
            },
            {
              term: 'Feature extraction',
              detail:
                'Chromatic HSV histograms, Local Binary Pattern (LBP) texture descriptors and Hu moment shape statistics, fused into a compact feature vector that encodes the visual characteristics of waste accumulation.',
            },
            {
              term: 'Classification',
              detail: 'A Support Vector Machine (SVM) classifies each scene as Garbage or Clean.',
            },
            {
              term: 'Class imbalance',
              detail:
                'A detailed analysis of the imbalance inherent in image datasets annotated with garbage masks, and the use of the Synthetic Minority Over-sampling Technique (SMOTE) to overcome it.',
            },
          ],
        },
      ],
    },
    {
      id: 'results',
      title: 'Evaluation (as reported)',
      blocks: [
        {
          kind: 'list',
          style: 'bullet',
          items: [
            'Benchmark: a balanced dataset comprising images from the public TACO (Trash Annotations in Context) dataset.',
            'Reported result: near-perfect classification performance across both Garbage and Clean scenes.',
            'Reported comparison: significantly outperforms a MobileNetV2 deep-learning baseline, particularly in data-constrained situations.',
          ],
        },
        {
          kind: 'callout',
          tone: 'caution',
          title: 'How to read these results',
          text: 'These are the study’s own reported findings on its benchmark. Exact accuracy figures were not included in the supplied abstract and are not reproduced here, and no independent replication or generalisation to other cameras or cities is claimed.',
        },
      ],
    },
    {
      id: 'contribution',
      title: 'Contribution & deployment angle',
      blocks: [
        {
          kind: 'paragraph',
          text: 'The system relies solely on the CPU during inference. The abstract positions this as making deployment feasible in resource-constrained environments such as Dhaka, directly on inexpensive edge devices that already exist as part of CCTV systems.',
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
            'Status: a study with reported experimental results. Publication status is not stated in the supplied material.',
            'Deployment on existing CCTV edge devices is described as feasible; it is not presented as a completed deployment.',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'Research on automatic garbage detection in urban scenes with classical image processing (bilateral denoising, CLAHE, edge detection, morphology), fused HSV, LBP and Hu-moment features and an SVM, evaluated on a balanced TACO-derived dataset.',
};
