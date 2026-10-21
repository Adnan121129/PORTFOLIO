import type { Project } from '../types';

export const infravisionAi: Project = {
  slug: 'infravision-ai',
  index: 2,
  title: 'InfraVision AI',
  subtitle: 'AI-Powered Predictive Infrastructure Maintenance Platform',
  tagline: 'Turning inspection photos into structural health intelligence.',
  summary:
    'A full-stack platform where inspectors upload photos of bridges, roads, tunnels and buildings; a background computer-vision pipeline flags candidate defects, rates severity and maintains a 0–100 health score — with engineers confirming or rejecting every finding.',
  categories: ['ai-ml', 'full-stack'],
  tags: [
    'Python',
    'Django',
    'Django REST Framework',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'PostgreSQL',
    'Celery',
    'Redis',
    'OpenCV',
    'PyTorch',
    'Docker',
  ],
  repo: 'https://github.com/Adnan121129/InfraVision-AI.git',
  hue: 38,
  featured: true,
  illustration: 'infravision',
  stats: [
    { value: '0–100', label: 'health score per asset' },
    { value: '4', label: 'severity levels, Low to Critical' },
    { value: '7', label: 'live processing stages per upload' },
    { value: '10', label: 'filterable analytics charts' },
    { value: '4', label: 'user roles with JWT authentication' },
  ],
  notices: [
    {
      tone: 'caution',
      title: 'Current status: demo detection model',
      text: 'The platform currently runs with a demo detection model based on classical image processing. It is clearly labelled in the app, so the full workflow can be shown without trained AI weights. The ResNet-50 model is not yet trained on a real crack dataset and no accuracy figures are claimed; AI output is decision support that engineers confirm or reject, not an autonomous structural assessment.',
    },
  ],
  sections: [
    {
      id: 'overview',
      title: 'About the project',
      blocks: [
        {
          kind: 'paragraph',
          text: 'InfraVision AI is a full-stack web platform for monitoring the condition of infrastructure such as bridges, roads, tunnels, buildings, towers and industrial structures.',
        },
        {
          kind: 'paragraph',
          text: 'Infrastructure is usually inspected by people looking at it and writing reports, which is slow, subjective and hard to track over time. InfraVision AI automates the first part of that process. Inspectors upload photos from drones, fixed cameras or phones, and a computer-vision pipeline finds structural defects such as cracks, spalling, corrosion and rust. It rates each defect’s severity and turns the results into a 0–100 health score for every asset.',
        },
        {
          kind: 'paragraph',
          text: 'Every result is stored. Engineers can see how each structure changes over time, receive maintenance alerts, and decide which repairs come first. The AI acts as decision support: engineers can confirm or reject each detection before acting on it.',
        },
      ],
    },
    {
      id: 'features',
      title: 'What you can explore',
      blocks: [
        {
          kind: 'features',
          items: [
            {
              title: 'Executive dashboard',
              icon: 'dashboard',
              points: [
                'Key figures (total, healthy, at-risk and critical assets), a health distribution chart, a 12-month health trend, recent inspections, urgent alerts, the processing queue and AI model status.',
              ],
            },
            {
              title: 'AI inspection workflow',
              icon: 'upload',
              points: [
                'Drag-and-drop image upload with progress bars and a live processing timeline: Uploading → Stored → Queued → Preprocessing → AI Inference → Analyzing → Completed.',
              ],
            },
            {
              title: 'Inspection results',
              icon: 'image',
              points: [
                'Original and AI-annotated images side by side, with bounding boxes, defect type, confidence, severity (Low / Medium / High / Critical) and overall health score.',
              ],
            },
            {
              title: 'Asset management',
              icon: 'building',
              points: [
                'A searchable, filterable register of structures, each with its own page showing details, health history, inspection timeline, defect history, maintenance history and a system-generated risk analysis.',
              ],
            },
            {
              title: 'AI analysis review',
              icon: 'scan',
              points: [
                'A gallery of every detected defect, where engineers confirm or reject results.',
              ],
            },
            {
              title: 'Alert center',
              icon: 'bell',
              points: [
                'Maintenance alerts raised automatically from severe findings, sharp health drops and overdue inspections, with an Open → Investigating → Resolved workflow.',
              ],
            },
            {
              title: 'Analytics',
              icon: 'chart',
              points: [
                'Ten interactive charts covering health trends, defects by type and severity, inspections per month, critical incidents, risk distribution, AI confidence, processing time and maintenance trends, all filterable by date, asset, type and severity.',
              ],
            },
            {
              title: 'Infrastructure map',
              icon: 'map',
              points: [
                'Every asset on an interactive map, colour-coded by health, with quick-view pop-ups.',
              ],
            },
            {
              title: 'System architecture page',
              icon: 'network',
              points: ['An animated diagram explaining how data moves through the system.'],
            },
            {
              title: 'Administration',
              icon: 'shield',
              points: [
                'User and role management, plus configurable health thresholds and alert rules.',
              ],
            },
          ],
        },
        {
          kind: 'flow',
          label: 'Live processing timeline',
          nodes: [
            'Uploading',
            'Stored',
            'Queued',
            'Preprocessing',
            'AI Inference',
            'Analyzing',
            'Completed',
          ],
        },
        {
          kind: 'flow',
          label: 'Alert workflow',
          nodes: ['Open', 'Investigating', 'Resolved'],
        },
      ],
    },
    {
      id: 'how-it-works',
      title: 'How the system works',
      blocks: [
        {
          kind: 'diagram',
          diagram: 'infravision-pipeline',
          caption:
            'Request path versus background path. The web request only validates and stores; heavy image processing runs in a separate worker and reports progress back over WebSockets.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Upload',
              points: ['A user uploads inspection images through the React dashboard.'],
            },
            {
              title: 'Validate and store',
              points: [
                'The Django REST API checks each file (type, size, image validity), saves the original to object storage (S3/MinIO) and records the inspection in a PostgreSQL database.',
              ],
            },
            {
              title: 'Queue',
              points: [
                'Instead of processing the image during the web request, the API places a job in a task queue (Celery with Redis), so the website stays fast.',
              ],
            },
            {
              title: 'AI processing',
              points: [
                'A separate worker service picks up the job and runs it through an image-processing pipeline. The steps are noise reduction, colour and lighting correction, contrast and edge enhancement, defect detection, then severity and health scoring.',
              ],
            },
            {
              title: 'Save results',
              points: [
                'The detected defects, with their locations, confidence, severity and processing details, are saved to the database. The asset’s health score, risk level and alerts update automatically.',
              ],
            },
            {
              title: 'Live updates',
              points: [
                'The browser receives real-time status messages over WebSockets, so users watch the inspection progress live and see a notification when it finishes.',
              ],
            },
          ],
        },
        {
          kind: 'flow',
          label: 'Worker image-processing pipeline',
          nodes: [
            'Noise reduction',
            'Colour & lighting correction',
            'Contrast & edge enhancement',
            'Defect detection',
            'Severity & health scoring',
          ],
        },
        {
          kind: 'paragraph',
          text: 'The AI component is a separate, replaceable module. A new or improved model can be plugged in without changing the rest of the application.',
        },
      ],
    },
    {
      id: 'stack',
      title: 'How I built it',
      blocks: [
        {
          kind: 'stack',
          groups: [
            {
              label: 'Frontend',
              items: [
                'React with TypeScript',
                'Tailwind CSS for a custom dark, industrial-style design system',
                'Recharts for the charts, Leaflet for the interactive map',
                'React Router for navigation, Axios for API calls',
                'Reusable components (tables, cards, modals, upload zone, image viewer, bounding-box overlay, processing timeline)',
              ],
            },
            {
              label: 'Backend',
              items: [
                'Python with Django and Django REST Framework',
                'JWT authentication with four user roles: Administrator, Engineer, Inspector and Viewer',
                'PostgreSQL database',
                'Celery and Redis for background processing',
                'Django Channels (WebSockets) for real-time updates',
                'S3-compatible object storage (MinIO) for images',
                'Auto-generated API documentation (Swagger/OpenAPI)',
              ],
            },
            {
              label: 'AI / Computer vision',
              items: [
                'OpenCV image-preprocessing pipeline made of plug-in stages',
                'PyTorch model structure (ResNet-50, transfer learning) designed for crack datasets such as SDNET2018, plus a training script',
                'Rule-based severity scoring and a health index',
              ],
            },
            {
              label: 'DevOps and quality',
              items: [
                'Docker and Docker Compose, so the whole system starts with one command',
                'Automated tests for the backend, the AI module and the frontend',
                'GitHub Actions for continuous integration',
              ],
            },
          ],
        },
        {
          kind: 'chips',
          label: 'The four user roles',
          items: ['Administrator', 'Engineer', 'Inspector', 'Viewer'],
        },
      ],
    },
    {
      id: 'highlights',
      title: 'Key highlights',
      blocks: [
        {
          kind: 'list',
          style: 'check',
          items: [
            'Asynchronous architecture: heavy AI work runs in the background, never blocking the website',
            'Real-time progress tracking and notifications',
            'Role-based access control and secure login',
            'A modular AI pipeline that can be upgraded without touching the web app',
            'Fully containerised: database, storage, queue, workers and website run together with Docker',
          ],
        },
      ],
    },
    {
      id: 'status',
      title: 'Current status and next steps',
      blocks: [
        {
          kind: 'paragraph',
          text: 'The platform currently runs with a demo detection model based on classical image processing. It is clearly labelled in the app, so the full workflow can be shown without trained AI weights. Next steps:',
        },
        {
          kind: 'list',
          style: 'number',
          items: [
            'Train the ResNet-50 model on a real crack dataset (SDNET2018) and deploy it',
            'Measure and report model accuracy',
            'Deploy the platform online',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'InfraVision AI: a Django, Celery and React platform that turns infrastructure inspection photos into defect findings, severity ratings and 0–100 asset health scores, with engineer review. Currently runs a clearly labelled classical-image-processing demo model.',
  keywords: [
    'infrastructure inspection',
    'computer vision',
    'structural health monitoring',
    'Celery',
    'Django Channels',
    'OpenCV',
    'PyTorch',
    'ResNet-50',
  ],
};
