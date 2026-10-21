// @vitest-environment jsdom
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MessageComposer,
  buildMessage,
  validateComposer,
} from '@/components/contact/message-composer';
import {
  ProjectLibraryView,
  filterLibrary,
  type LibraryItem,
} from '@/components/projects/project-library';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { categoryLabels, categoryOrder, projectSearchText, projects } from '@/content/projects';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

const items: LibraryItem[] = projects.map((project) => ({
  slug: project.slug,
  title: project.title,
  searchText: projectSearchText(project),
  categories: project.categories,
}));
const categories = categoryOrder.map((value) => ({ value, label: categoryLabels[value] }));
const cards = Object.fromEntries(
  projects.map((project) => [project.slug, <article key={project.slug}>{project.title}</article>]),
);

describe('project filtering', () => {
  it('matches every word across titles, tags, keywords and categories', () => {
    const slugs = (query: string, category: Parameters<typeof filterLibrary>[2] = 'all') =>
      filterLibrary(items, query, category).map((item) => item.slug);
    expect(slugs('')).toHaveLength(8);
    expect(slugs('power bi')).toEqual(['plantops-intelligence', 'greenfactory-bi']);
    expect(slugs('Next.js')).toContain('the-ottoman-empire');
    expect(slugs('pow')).toEqual(expect.arrayContaining(['plantops-intelligence', 'linguasi']));
    expect(slugs('POWER   BI')).toEqual(slugs('power bi'));
    expect(slugs('', 'mobile')).toEqual(['linguasi']);
    expect(slugs('', 'interactive-3d')).toEqual(['muhibbi-tea-house', 'the-ottoman-empire']);
    expect(slugs('no-such-technology')).toEqual([]);
  });

  it('filters the rendered cards, announces counts and recovers from an empty result', async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();
    render(
      <ProjectLibraryView
        items={items}
        cards={cards}
        categories={categories}
        onStateChange={onStateChange}
      />,
    );

    expect(screen.getByTestId('project-count')).toHaveTextContent('Showing all 8 projects');
    await user.click(screen.getByRole('button', { name: 'Mobile' }));
    expect(screen.getByRole('button', { name: 'Mobile' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(screen.getByTestId('project-results')).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByTestId('project-count')).toHaveTextContent(
      'Showing 1 of 8 projects in Mobile',
    );

    await user.type(screen.getByRole('searchbox', { name: 'Search projects' }), 'kubernetes');
    expect(screen.getByTestId('project-empty')).toHaveTextContent('No projects match.');
    expect(onStateChange).toHaveBeenLastCalledWith('kubernetes', 'mobile');

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByTestId('project-count')).toHaveTextContent('Showing all 8 projects');
    expect(screen.getByRole('searchbox', { name: 'Search projects' })).toHaveFocus();
  });
});

describe('message composer', () => {
  it('validates input before opening anything', async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<MessageComposer />);

    await user.click(screen.getByRole('button', { name: /Send via WhatsApp/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please fix these before continuing',
    );
    expect(screen.getByLabelText(/Your name/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/Message/)).toHaveAttribute('aria-invalid', 'true');
    expect(open).not.toHaveBeenCalled();
  });

  it('opens WhatsApp or Gmail with the drafted text and says what happened', async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<MessageComposer />);

    await user.type(screen.getByLabelText(/Your name/), 'Sam Reviewer');
    await user.selectOptions(screen.getByLabelText('Topic'), 'Research');
    await user.type(screen.getByLabelText(/Message/), 'I enjoyed the GreenFactory case study.');
    await user.click(screen.getByRole('button', { name: /Send via WhatsApp/ }));

    const text = buildMessage('Sam Reviewer', 'Research', 'I enjoyed the GreenFactory case study.');
    expect(open).toHaveBeenCalledWith(
      `https://wa.me/8801851633134?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Opened WhatsApp with your message — press send there to deliver it.',
    );

    await user.click(screen.getByRole('button', { name: /Send via Gmail/ }));
    const gmail = new URL(open.mock.calls[1][0] as string);
    expect(gmail.origin + gmail.pathname).toBe('https://mail.google.com/mail/');
    expect(gmail.searchParams.get('to')).toBe('mdadnan899@gmail.com');
    expect(gmail.searchParams.get('su')).toBe('Research — from Sam Reviewer');
    expect(gmail.searchParams.get('body')).toBe(text);
  });

  it('builds and validates messages', () => {
    expect(buildMessage(' Ana ', 'General enquiry', ' Hi there ')).toBe(
      'Hello Adnan,\n\nHi there\n\n— Ana\n(Topic: General enquiry)',
    );
    expect(validateComposer('A', 'short')).toEqual({
      name: 'Please enter your name (at least 2 characters).',
      message: 'Please write a message of at least 10 characters.',
    });
    expect(validateComposer('Ana', 'x'.repeat(2001)).message).toMatch(/under 2,000/);
  });
});

describe('theme toggle', () => {
  beforeEach(() => {
    // jsdom has no matchMedia; report "reduced motion" so the toggle skips view transitions.
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) =>
        ({
          matches: query.includes('reduce'),
          media: query,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
        }) as unknown as MediaQueryList,
    });
  });

  it('flips the theme, persists the choice and exposes the state', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', 'light');
    render(<ThemeToggle />);

    const toggle = screen.getByRole('button', { name: 'Dark theme' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await act(async () => {
      await user.click(toggle);
    });
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('keeps the visible label in the accessible name when labelled', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    render(<ThemeToggle showLabel />);
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
