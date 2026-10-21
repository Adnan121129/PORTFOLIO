/**
 * Education, skills, experience and capability areas — copied from the brief.
 * Do not add graduation years, grades, proficiency levels or employers that were not supplied.
 */

export type Education = {
  institution: string;
  location: string;
  credential: string;
  detail?: string;
};

export const education: Education[] = [
  {
    institution: 'United International University (UIU)',
    location: 'Dhaka, Bangladesh',
    credential: 'Bachelor of Science in Computer Science & Engineering (BSCSE)',
    detail: 'Major: Data Science',
  },
  {
    institution: 'Govt. Hazi Muhammad Mohsin College',
    location: 'Chattogram, Bangladesh',
    credential: 'Higher Secondary Certificate (HSC)',
  },
  {
    institution: 'KAFCO School & College',
    location: 'Chattogram, Bangladesh',
    credential: 'Secondary School Certificate (SSC)',
  },
];

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'data-bi',
    label: 'Data Analysis & Business Intelligence',
    items: [
      'SQL',
      'Data Analysis',
      'MS Excel',
      'Data Cleaning',
      'Reporting',
      'Documentation',
      'Record-Keeping',
      'Administrative Work',
    ],
  },
  {
    id: 'languages',
    label: 'Programming Languages',
    items: ['Python', 'JavaScript', 'C++', 'Dart', 'PHP', 'HTML', 'CSS'],
  },
  {
    id: 'backend',
    label: 'Backend & Full-Stack Development',
    items: ['Node.js', 'SQL Databases', 'React Native', 'Flutter', 'Firebase'],
  },
  {
    id: 'ml',
    label: 'Machine Learning & AI',
    items: [
      'PyTorch',
      'TensorFlow Lite',
      'CNNs (ResNet-50, XceptionNet)',
      'Federated Learning',
      'Google Colab',
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Platforms',
    items: ['Git', 'Jira', 'LaTeX', 'MS Office', 'Power BI'],
  },
];

export type Activity = {
  id: string;
  role: string;
  organisation: string;
  period?: string;
  group: 'technical' | 'professional' | 'leadership' | 'competition';
  points: string[];
};

export const activities: Activity[] = [
  {
    id: 'uiu-app-forum',
    role: 'Active Member',
    organisation: 'UIU App Forum',
    period: '2022–2026',
    group: 'technical',
    points: [
      'Engaged in collaborative technical initiatives and peer learning environments focused on modern application development.',
    ],
  },
  {
    id: 'uiu-project-showcases',
    role: 'Project Exhibitor',
    organisation: 'UIU Project Showcases',
    group: 'technical',
    points: [
      'Designed and presented a hardware-software integrated “Tilt Detector” device for structural health monitoring of earthquake-affected buildings.',
      'Demonstrated various full-stack software development projects to university faculty and peers.',
    ],
  },
  {
    id: 'grameenphone-academy',
    role: 'Excellence Online Program',
    organisation: 'Grameenphone Academy',
    group: 'professional',
    points: [
      'Completed specialized modules on Project-Based Excel, Corporate Presentation Skills, Interview Strategies, and LinkedIn Profile Optimization.',
      'Enhanced professional communication, behavioral interviewing techniques using the STAR method, and personal branding strategies for industry readiness.',
    ],
  },
  {
    id: 'event-organizer',
    role: 'Event Organizer',
    organisation: 'Govt. Hazi Muhammad Mohsin College',
    group: 'leadership',
    points: [
      'Planned, coordinated, and executed the college farewell ceremony, managing logistics and leading a team of student volunteers.',
    ],
  },
  {
    id: 'scout-commander',
    role: 'Scout Commander',
    organisation: 'KAFCO School & College',
    group: 'leadership',
    points: [
      'Directed and mentored a scout troop, fostering teamwork, discipline, and early foundational leadership skills.',
    ],
  },
  {
    id: 'national-olympiads',
    role: 'Participant',
    organisation: 'National Olympiads',
    group: 'competition',
    points: [
      'Competed in the Math Olympiad and Physics Olympiad, demonstrating strong quantitative analysis and complex problem-solving abilities.',
    ],
  },
];

export const activityGroupLabels: Record<Activity['group'], string> = {
  technical: 'Technical community',
  professional: 'Professional development',
  leadership: 'Leadership & Community Volunteering',
  competition: 'Competitions',
};

export type Capability = {
  id: string;
  title: string;
  description: string;
  /** Skills from the supplied skills list. */
  skills: string[];
  /** Project or research slugs that demonstrate the capability. */
  evidence: { kind: 'project' | 'research'; slug: string }[];
};

/**
 * "What I work across" — each area is grounded in the supplied skills and the work
 * listed in the case studies; the evidence links point to the pages that show it.
 */
export const capabilities: Capability[] = [
  {
    id: 'mis-bi',
    title: 'MIS & Business Intelligence',
    description:
      'Management information systems where every record is captured once, validated against business rules and approved — then rolled up into KPIs, alerts, reports and Power BI star schemas that agree with the application.',
    skills: ['SQL', 'Power BI', 'Reporting', 'MS Excel', 'Documentation'],
    evidence: [
      { kind: 'project', slug: 'plantops-intelligence' },
      { kind: 'project', slug: 'greenfactory-bi' },
    ],
  },
  {
    id: 'data-analysis',
    title: 'Data analysis & reporting',
    description:
      'Cleaning, reconciling and explaining data: matched-month ratios, “missing is never zero” rules, data-quality matrices, annotated datasets and reports people can trace back to source records.',
    skills: ['Data Analysis', 'Data Cleaning', 'SQL', 'MS Excel', 'Record-Keeping'],
    evidence: [
      { kind: 'project', slug: 'greenfactory-bi' },
      { kind: 'project', slug: 'plantops-intelligence' },
      { kind: 'research', slug: 'gender-bias-social-media-comments' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & full‑stack engineering',
    description:
      'REST APIs, relational data models and workflows with server-enforced permissions, transactions, row locking, audit trails and real-time updates — plus the web and mobile front ends that sit on top.',
    skills: ['Python', 'JavaScript', 'SQL Databases', 'Node.js', 'React Native', 'Flutter'],
    evidence: [
      { kind: 'project', slug: 'omnimanager' },
      { kind: 'project', slug: 'linguasi' },
      { kind: 'project', slug: 'muhibbi-tea-house' },
    ],
  },
  {
    id: 'applied-ml',
    title: 'Applied ML & computer vision',
    description:
      'Computer-vision pipelines, on-device models, federated learning and NLP classification — designed as decision support with validation around the model rather than blind trust in it.',
    skills: [
      'PyTorch',
      'TensorFlow Lite',
      'CNNs (ResNet-50, XceptionNet)',
      'Federated Learning',
      'Google Colab',
    ],
    evidence: [
      { kind: 'project', slug: 'infravision-ai' },
      { kind: 'research', slug: 'nirapotta' },
      { kind: 'research', slug: 'automatic-garbage-detection' },
    ],
  },
  {
    id: 'product-design',
    title: 'Product & system design',
    description:
      'Specification first: roles and permissions, state machines, data dictionaries, accessibility and documentation — so a system’s behaviour is decided before it is coded.',
    skills: ['Jira', 'Git', 'LaTeX', 'Documentation', 'MS Office'],
    evidence: [
      { kind: 'project', slug: 'linguasi' },
      { kind: 'project', slug: 'the-ottoman-empire' },
      { kind: 'project', slug: 'muhibbi-tea-house' },
    ],
  },
];
