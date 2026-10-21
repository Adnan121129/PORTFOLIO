import type { Project } from '../types';

export const chatmate: Project = {
  slug: 'chatmate',
  index: 8,
  title: 'ChatMate',
  subtitle: 'Desktop chat application · Advanced Object-Oriented Programming (AOOP) course',
  tagline: 'Core OOP concepts, demonstrated through a working desktop chat app.',
  summary:
    'A desktop-based chat application developed for the Advanced Object-Oriented Programming (AOOP) course, demonstrating core OOP concepts through user authentication, real-time messaging, contact management and an interactive chat interface.',
  categories: ['desktop'],
  tags: [
    'Desktop application',
    'Object-oriented programming',
    'Authentication',
    'Real-time messaging',
  ],
  repo: 'https://github.com/Adnan121129/ChatMate.git',
  hue: 228,
  featured: false,
  illustration: 'chatmate',
  sections: [
    {
      id: 'overview',
      title: 'About the project',
      blocks: [
        {
          kind: 'paragraph',
          text: '“ChatMate” is a desktop-based chat application developed in my Advanced Object-Oriented Programming (AOOP) course. It demonstrates core OOP concepts through user authentication, real-time messaging, contact management, and an interactive chat interface.',
        },
      ],
    },
    {
      id: 'features',
      title: 'What it demonstrates',
      blocks: [
        {
          kind: 'list',
          style: 'check',
          items: [
            'User authentication',
            'Real-time messaging',
            'Contact management',
            'An interactive chat interface',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Scope of this summary',
          text: 'The supplied project description does not name the framework, database or deployment target, so none are listed here. The repository is the reference for implementation details.',
        },
      ],
    },
  ],
  seoDescription:
    'ChatMate: a desktop chat application built for an Advanced Object-Oriented Programming course, demonstrating OOP through authentication, real-time messaging, contact management and an interactive chat interface.',
  keywords: ['object-oriented programming', 'desktop application', 'chat application', 'AOOP'],
};
