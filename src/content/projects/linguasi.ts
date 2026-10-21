import type { Project } from '../types';

export const linguasi: Project = {
  slug: 'linguasi',
  index: 3,
  title: 'LinguaSI',
  subtitle: 'AI-powered English and IELTS practice platform',
  tagline: 'Learn English. Master IELTS. Let intelligence adapt to you.',
  summary:
    'A web app, an iOS/Android app and one shared API, connected by an intelligence layer — SI Core — that remembers every mistake a learner makes and explains why each next exercise was chosen.',
  categories: ['ai-ml', 'full-stack', 'mobile'],
  tags: [
    'Full-stack',
    'AI',
    'EdTech',
    'Web',
    'Mobile',
    'FastAPI',
    'PostgreSQL',
    'Next.js',
    'React Native',
    'Expo',
    'TypeScript',
  ],
  repo: 'https://github.com/Adnan121129/LinguaSI.git',
  hue: 292,
  featured: true,
  illustration: 'linguasi',
  stats: [
    { value: '3', label: 'apps' },
    { value: '8', label: 'AI agents' },
    { value: '92', label: 'API operations' },
    { value: '40', label: 'database tables' },
    { value: '223', label: 'automated tests' },
    { value: '3 + mock', label: 'AI providers + mock mode' },
  ],
  notices: [
    {
      tone: 'info',
      title: 'Practice indicators, not official scores',
      text: 'Bands are labelled AI Estimated practice indicators, never official IELTS scores. All learning content is original.',
    },
  ],
  sections: [
    {
      id: 'overview',
      title: 'About the project',
      blocks: [
        {
          kind: 'paragraph',
          text: 'LinguaSI is a full-stack learning platform for English learners preparing for IELTS. Most practice tools give a score and move on. LinguaSI remembers every mistake a learner makes, in every skill, and uses that history to decide what they should practise next. Each recommendation explains why it was chosen.',
        },
        {
          kind: 'paragraph',
          text: 'An intelligence layer called SI Core connects all the modules. Writing, speaking, reading, listening, vocabulary and grammar all update one shared learner profile. That way progress, mistakes and recommendations stay in sync on the web and on the phone.',
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
              title: 'Personal dashboard',
              icon: 'dashboard',
              points: [
                'AI-estimated band, CEFR level, streak, XP level and weekly study goal',
                'A daily mission built from your weakest areas',
                'A “Why this?” explanation on every recommendation',
              ],
            },
            {
              title: 'Writing tutor and examiner',
              icon: 'pen',
              points: [
                'IELTS-style Task 1 and Task 2 practice with a timer, word count and autosave',
                'An estimated band for each of the four criteria',
                'Every error highlighted inside your own essay, with a correction and an explanation',
                'A short drill built from your own mistakes',
              ],
            },
            {
              title: 'Speaking mock tests',
              icon: 'mic',
              points: [
                'Full Parts 1–3 with an examiner voice and follow-up questions',
                'A Part 2 preparation timer and audio recording',
                'Measured fluency: speaking speed, pauses, fillers and word variety',
                'Pronunciation marked “not assessed” when the audio evidence isn’t there, instead of guessing',
              ],
            },
            {
              title: 'Reading and listening',
              icon: 'book',
              points: [
                'Practice sets in IELTS question types, adapted to your level',
                'Every answer linked to the exact sentence that proves it',
                'Transcripts for listening',
              ],
            },
            {
              title: 'Adaptive vocabulary',
              icon: 'languages',
              points: [
                'Spaced repetition, with exercises that change as a word moves from new to mastered',
                'Words taken from your own essays and speaking',
                'Collocations and example sentences for each word',
              ],
            },
            {
              title: 'Progress analytics',
              icon: 'trending',
              points: [
                'Charts titled by the question they answer, such as “Am I making fewer mistakes?”',
                'A table view for every chart',
                'Skill gaps compared with your target band',
              ],
            },
            {
              title: 'SI Tutor and English Lab',
              icon: 'message',
              points: [
                'A chat tutor that gives hints before answers and knows your history',
                'Role-play conversations, a daily phrase, grammar and sentence-building exercises',
              ],
            },
            {
              title: 'Motivation',
              icon: 'trophy',
              points: [
                'XP and levels, streaks with streak freezes, achievements, weekly challenges and daily missions',
              ],
            },
            {
              title: 'Mobile app',
              icon: 'smartphone',
              points: [
                'The same learner and the same data on iOS and Android, with light and dark themes',
              ],
            },
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
          diagram: 'linguasi-architecture',
          caption:
            'Three apps, one API. The FastAPI backend owns data, business rules and AI calls; the website reaches it through its own server, and the mobile app calls it directly.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Three apps, one API',
              points: [
                'A FastAPI backend owns all data, business rules and AI calls.',
                'The Next.js website talks to the API through its own server. Sign-in tokens live in httpOnly cookies and never reach the browser’s JavaScript.',
                'The React Native app calls the API directly, with tokens kept in the phone’s secure storage.',
              ],
            },
            {
              title: 'Every activity ends the same way',
              points: [
                'Take an essay as an example: deterministic analytics engines measure it — word count, structure and 109 rule-based grammar checks.',
                'An AI examiner evaluates it.',
                'SI Core updates the learner profile, which drives skill scores, mistakes, vocabulary, XP, missions, achievements and the next recommendation.',
              ],
            },
            {
              title: 'SI Core',
              points: ['Eight specialised agents share one compact learner profile.'],
            },
            {
              title: 'The AI is checked, not trusted blindly',
              points: [
                'AI output must match a typed schema (15 AI tasks), with one repair attempt.',
                'A mistake the AI quotes must actually exist in the learner’s text, or it’s discarded.',
                'Bands are clamped to valid values.',
                'The AI evaluates and explains, while the platform’s own code measures, validates and decides.',
              ],
            },
            {
              title: 'Provider-agnostic AI',
              points: [
                'It works with Anthropic Claude, OpenAI or Google Gemini.',
                'A built-in Mock AI Mode runs the whole product with no API key and no cost.',
              ],
            },
            {
              title: 'Security and privacy',
              points: [
                'Passwords are hashed with Argon2.',
                'Access tokens are short-lived JWTs. Refresh tokens rotate, and the system detects reuse of a stolen one.',
                'Requests are rate-limited.',
                'AI keys are kept only on the server.',
                'Essays, transcripts and audio never appear in logs.',
                'Deleting an account removes all of the learner’s data.',
              ],
            },
          ],
        },
        {
          kind: 'flow',
          label: 'How an essay is processed',
          nodes: [
            'Deterministic analytics (word count, structure, 109 grammar checks)',
            'AI examiner evaluation',
            'SI Core updates the learner profile',
            'Next recommendation',
          ],
        },
        {
          kind: 'chips',
          label: 'SI Core’s eight specialised agents',
          items: [
            'Writing examiner',
            'Speaking examiner',
            'Error analyst',
            'Vocabulary engine',
            'Practice generator',
            'Tutor',
            'Learning planner',
            'Progress analyst',
          ],
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
              label: 'Backend',
              items: [
                'Python with FastAPI',
                'SQLAlchemy 2 and Alembic migrations',
                'PostgreSQL 16 (40 tables)',
                'Pydantic for validation',
                'Argon2 and JWT authentication',
                '92 documented API operations',
              ],
            },
            {
              label: 'Web frontend',
              items: [
                'Next.js 16 (App Router) with React 19 and TypeScript',
                'Tailwind CSS 4, light and dark themes',
                'TanStack Query for data fetching',
                'Recharts for charts',
                'Web Speech API and MediaRecorder for speaking',
              ],
            },
            {
              label: 'Mobile app',
              items: [
                'React Native with Expo and Expo Router, TypeScript',
                'react-native-svg for charts',
                'expo-audio for recording',
                'expo-secure-store for tokens',
              ],
            },
            {
              label: 'AI layer',
              items: [
                'A provider abstraction over Anthropic Claude, OpenAI and Gemini',
                'Structured JSON output with schema validation',
                'A deterministic mock provider',
                'Optional speech-to-text and text-to-speech',
              ],
            },
            {
              label: 'DevOps',
              items: [
                'Docker and Docker Compose, with nginx serving the mobile web preview',
                'One-click start scripts for Windows, macOS and Linux',
                'Six GitHub Actions workflows: backend, web, mobile, end-to-end, Docker, and start-script tests on Windows and macOS',
                'Ready to deploy to Vercel, Railway or Render, with EAS builds for the mobile apps',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'testing',
      title: 'Testing & quality',
      blocks: [
        {
          kind: 'tests',
          items: [
            {
              value: '159',
              label: 'API tests · pytest',
              detail: 'Unit, API and integration',
            },
            {
              value: '64',
              label: 'Web and mobile unit tests · Vitest & Jest',
            },
            {
              value: 'E2E',
              label: 'Learner journey · Playwright',
              detail: 'An end-to-end test of the whole learner journey in a real browser',
            },
          ],
          note: 'The headline figure of 223 automated tests equals the 159 API tests plus the 64 web and mobile unit tests; the Playwright learner-journey test is listed in addition.',
        },
      ],
    },
    {
      id: 'process',
      title: 'Development process',
      blocks: [
        {
          kind: 'list',
          style: 'number',
          items: [
            'Wrote a detailed product specification first.',
            'Built the API and data model.',
            'Built SI Core and the AI layer.',
            'Built the web app.',
            'Built the mobile app.',
            'Added tests, CI and Docker.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Testing caught real bugs along the way, such as a broken sign-up redirect and race conditions under parallel requests. Each fix came with a regression test.',
        },
      ],
    },
  ],
  seoDescription:
    'LinguaSI: an AI-powered English and IELTS practice platform — web, iOS/Android and one FastAPI backend — where SI Core’s eight agents adapt practice to each learner. 92 API operations, 40 tables, 223 automated tests.',
  keywords: [
    'IELTS',
    'EdTech',
    'adaptive learning',
    'FastAPI',
    'Next.js',
    'React Native',
    'Expo',
    'AI tutor',
  ],
};
