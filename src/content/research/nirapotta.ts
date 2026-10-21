import type { Research } from '../types';

export const nirapotta: Research = {
  slug: 'nirapotta',
  index: 1,
  title:
    'Nirapotta: A Machine Learning-Powered Public Safety Application with Gesture-Based Triggers for South Asian Contexts',
  shortTitle: 'Nirapotta',
  area: ['Mobile safety', 'On-device ML', 'Human-computer interaction'],
  summary:
    'A public safety application for dense South Asian urban spaces that uses on-device machine learning to recognise predefined smartphone-sensor gestures and silently trigger emergency alarms.',
  status: {
    label: 'Working prototype',
    detail:
      'The abstract describes the outcome as a working prototype. It is not presented here as a deployed or validated emergency-response service. Publication status is not stated in the supplied material.',
  },
  abstractLabel: 'Abstract',
  abstract: [
    'Urban public security in densely populated areas, particularly the urban spaces of South Asia is a challenging problem requiring innovative technological solutions. Existing mobile safety measures rely on explicit activation methods that can be infeasible or dangerous under high stress. In this paper, the authors introduces “Nirapotta”, a ML based public safety application to tackle those limitations using an undercover automatic activation method. The primary objective of our project is to develop a robust system that would utilize on-device machine learning to recognize predefined gestures made from smartphone sensor in order to initiate emergency alarms silently: without the knowledge of an attacker. The procedure involves creating a custom dataset of inertial readings, developing a lightweight deep learning model that runs well on mobile phones, and embedding it in the cross platform application supporting two tier alarm system and live location based tracking. The significance of Nirapotta is its novel context-aware activation method and privacy preserving architecture to process sensitive data at local end. The research delivers a working prototype of a product that is an example of what can be the practical, user-centered approach to address personal security through technology and provides a novel contribution in both mobile safety and human-computer interaction.',
  ],
  keywordsLabel: 'Topics',
  keywords: [
    'On-device machine learning',
    '1D-CNN',
    'Gesture recognition',
    'Inertial sensors',
    'Public safety',
    'Flutter',
    'TensorFlow Lite',
    'Privacy-preserving architecture',
  ],
  sections: [
    {
      id: 'context',
      title: 'Problem context',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Urban public security in densely populated areas — particularly the urban spaces of South Asia — is a challenging problem. Existing mobile safety measures rely on explicit activation methods that can be infeasible or dangerous under high stress, so Nirapotta explores an undercover, automatic activation method instead.',
        },
      ],
    },
    {
      id: 'capabilities',
      title: 'What you can explore',
      blocks: [
        {
          kind: 'features',
          columns: 2,
          items: [
            {
              title: 'Instant Hands-Free SOS Activation',
              icon: 'activity',
              points: ['Real-time motion pattern recognition for stealth emergency triggering.'],
            },
            {
              title: 'On-Device Machine Learning',
              icon: 'cpu',
              points: [
                'Local sensor data processing ensuring ultra-low latency alerts without relying on continuous cloud connectivity.',
              ],
            },
            {
              title: 'Automated Emergency Dispatch',
              icon: 'map',
              points: [
                'Instant transmission of live geolocation coordinates to emergency contacts and predefined responder networks.',
              ],
            },
            {
              title: 'Robust Test & CI Automation',
              icon: 'git',
              points: [
                'Continuous integration and automated regression pipelines for high-reliability mobile performance.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'method',
      title: 'Method',
      blocks: [
        {
          kind: 'flow',
          label: 'Research procedure (from the abstract)',
          nodes: [
            'Custom dataset of inertial readings',
            'Lightweight deep-learning model for mobile phones',
            'Embedded in a cross-platform app with a two-tier alarm system and live location tracking',
          ],
        },
      ],
    },
    {
      id: 'how-it-works',
      title: 'How the system works',
      blocks: [
        {
          kind: 'diagram',
          diagram: 'nirapotta-flow',
          caption:
            'Sensor inputs are processed by the Flutter sensor pipeline and an on-device 1D-CNN. Only when a threshold is met does the emergency trigger fire, followed by geolocation dispatch and the SOS alert.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Continuous Data Sampling',
              points: [
                'Sensor pipelines stream real-time motion (accelerometer/gyroscope) and audio inputs locally on the mobile device.',
              ],
            },
            {
              title: 'Local Feature Extraction & Inference',
              points: [
                'The embedded machine learning model processes high-frequency spatial-temporal dynamics locally on the device.',
              ],
            },
            {
              title: 'Threshold & Trigger Verification',
              points: [
                'When motion signatures match emergency gesture parameters, an automated confirmation step runs to minimize false positives.',
              ],
            },
            {
              title: 'Alert Dispatch & Geo-Tracking',
              points: [
                'Upon confirmation, the application package bundles precise GPS coordinates and automatically dispatches emergency notifications to emergency contacts.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'architecture',
      title: 'Technical architecture',
      blocks: [
        {
          kind: 'stack',
          groups: [
            { label: 'Frontend / Cross-Platform Mobile', items: ['Flutter', 'Dart'] },
            {
              label: 'Machine Learning & Signal Processing',
              items: [
                '1D Convolutional Neural Network (1D-CNN)',
                'Python',
                'TensorFlow / TensorFlow Lite',
                'Google Colab',
              ],
            },
            {
              label: 'Data & Infrastructure',
              items: ['Google Antigravity', 'Embedded Local Storage', 'RESTful APIs'],
            },
            {
              label: 'DevOps & Testing',
              items: ['Git', 'GitHub Actions (CI/CD)', 'Automated Regression Testing Frameworks'],
            },
          ],
        },
        {
          kind: 'definitions',
          items: [
            {
              term: 'Sensor Streaming Engine',
              detail:
                'Background isolate threads in Dart/Flutter capturing dynamic motion metrics without draining battery resources.',
            },
            {
              term: '1D-CNN Motion Classifier',
              detail:
                'Specialized neural network model trained on continuous time-series accelerometer data to recognize specific emergency gestures.',
            },
            {
              term: 'Emergency Dispatch Engine',
              detail:
                'Instant payload creation containing timestamp, device state, and live GPS coordinates sent via SMS and network requests.',
            },
            {
              term: 'Reliability & Regression Suite',
              detail:
                'Automated unit and regression test scripts integrated into CI pipelines to guarantee system stability under critical conditions.',
            },
          ],
        },
      ],
    },
    {
      id: 'contribution',
      title: 'Contribution',
      blocks: [
        {
          kind: 'paragraph',
          text: 'The significance of Nirapotta is its novel context-aware activation method and privacy preserving architecture to process sensitive data at local end — a contribution to both mobile safety and human-computer interaction.',
        },
      ],
    },
    {
      id: 'my-contributions',
      title: 'My key contributions',
      blocks: [
        {
          kind: 'definitions',
          items: [
            {
              term: 'System Architecture & Development',
              detail:
                'Architected and engineered the mobile application frontend using Flutter & Dart.',
            },
            {
              term: 'ML Model Pipeline',
              detail:
                'Trained and fine-tuned the 1D-CNN deep learning architecture for accelerometer pattern classification in Google Colab, converting and embedding the model for low-latency on-device execution.',
            },
            {
              term: 'Continuous Integration & Testing',
              detail:
                'Set up automated regression testing and GitHub workflow automation alongside team collaborator Sunviraj to maintain codebase integrity.',
            },
          ],
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
            'Status: a working prototype, as described in the abstract.',
            'No accuracy, latency or false-positive figures were supplied, so none are reported here.',
            'This page does not present Nirapotta as a deployed emergency-response service or claim real-world validation.',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'Nirapotta: research on an on-device machine-learning public safety app for South Asian cities, using a 1D-CNN on smartphone sensor gestures to trigger silent SOS alarms with live location. Working prototype built with Flutter and TensorFlow Lite.',
};
