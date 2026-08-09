import {
  ACCOMPLISHMENTS,
  CERTIFICATES,
  DEVELOPER,
  EXPERIENCE,
  EXPERIENCE_TYPES,
  PANEL_IDS,
  PLANETS,
  PROJECTS,
  PROJECT_CATEGORIES,
  SKILL_GROUPS,
  SKILL_GROUP_IDS,
} from '@/data/portfolio';
import en from '@/locales/en.json';
import pt from '@/locales/pt.json';
import { describe, expect, it } from 'vitest';

interface ProjectTranslation {
  description: string;
  highlights: string[];
  name: string;
}

function expectTranslationIds(resources: object, ids: string[]) {
  expect(Object.keys(resources).sort()).toEqual([...ids].sort());
}

describe('portfolio data', () => {
  it('contains all expected panel ids', () => {
    expect(PANEL_IDS).toEqual([
      'about',
      'skills',
      'projects',
      'experience',
      'accomplishments',
      'contact',
    ]);
  });

  it('keeps planets aligned with panel ids', () => {
    expect(PLANETS.map((planet) => planet.id)).toEqual(PANEL_IDS);
  });

  it('has valid developer profile baseline', () => {
    expect(DEVELOPER.name.length).toBeGreaterThan(3);
    expect(DEVELOPER.age).toBeGreaterThanOrEqual(18);
    expect(DEVELOPER.github).toContain('github.com');
  });

  it('defines known project categories', () => {
    expect(PROJECT_CATEGORIES).toContain('full_stack');
  });

  it('keeps complementary skill groups identified by stable locale-neutral ids', () => {
    expect(SKILL_GROUPS.map((group) => group.id)).toEqual(SKILL_GROUP_IDS);
  });

  it.each([
    ['pt', pt],
    ['en', en],
  ])('has complete %s translations for every skill group', (_, locale) => {
    const titles = locale.skill_groups as Record<string, string>;
    const items = locale.skills.group_items as Record<string, string[]>;

    expect(Object.keys(titles).sort()).toEqual([...SKILL_GROUP_IDS].sort());
    expect(Object.keys(items).sort()).toEqual([...SKILL_GROUP_IDS].sort());

    SKILL_GROUPS.forEach((group) => {
      expect(titles[group.id].length).toBeGreaterThan(0);
      expect(items[group.id].length).toBeGreaterThan(0);
      expect(new Set(items[group.id]).size).toBe(items[group.id].length);
    });
  });

  it('prioritizes the strongest recent GitHub projects', () => {
    expect(PROJECTS.map((project) => project.id)).toEqual(
      expect.arrayContaining([
        'hookroute',
        'space_portfolio_v2',
        'mta_analytics',
        'ping_on_place',
        'code_collab',
        'arsenal_academy',
        'vscode_portfolio',
        'arsenal_innovation_lp',
        'scoordena',
        'recife_radars',
        'react_native_99pets',
        'arsenal_project_v1',
        'react_todo',
      ])
    );
  });

  it('keeps project metadata consistent', () => {
    const ids = PROJECTS.map((project) => project.id);

    expect(new Set(ids).size).toBe(ids.length);

    PROJECTS.forEach((project) => {
      expect(project.tech.length).toBeGreaterThan(0);
      expect(project.color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it.each([
    ['pt', pt.projects_items],
    ['en', en.projects_items],
  ])('has complete %s translations for every listed project', (_, resources) => {
    const translations = resources as Record<string, ProjectTranslation>;

    expect(Object.keys(translations).sort()).toEqual(PROJECTS.map((project) => project.id).sort());

    PROJECTS.forEach((project) => {
      const translation = translations[project.id];

      expect(translation.name.length).toBeGreaterThan(0);
      expect(translation.description.length).toBeGreaterThan(0);
      expect(translation.highlights.length).toBeGreaterThanOrEqual(3);
    });
  });

  it.each([
    ['pt', pt],
    ['en', en],
  ])('keeps all localized portfolio collections complete in %s', (_, locale) => {
    expectTranslationIds(locale.planets, [...PANEL_IDS]);
    expectTranslationIds(
      locale.experience_items,
      EXPERIENCE.map((item) => item.id)
    );
    expectTranslationIds(
      locale.accomplishments_items,
      ACCOMPLISHMENTS.map((item) => item.id)
    );
    expectTranslationIds(
      locale.certificates_items,
      CERTIFICATES.map((item) => item.id)
    );
    expectTranslationIds(locale.experience.types, [...EXPERIENCE_TYPES]);

    expect(locale.developer.summary.length).toBeGreaterThan(0);
    expect(locale.developer.education.length).toBeGreaterThan(0);

    EXPERIENCE.forEach((experience) => {
      const translation =
        locale.experience_items[experience.id as keyof typeof locale.experience_items];
      expect(translation.role.length).toBeGreaterThan(0);
      expect(translation.period.length).toBeGreaterThan(0);
      expect(translation.description.length).toBeGreaterThan(0);
      expect(translation.achievements.length).toBeGreaterThan(0);
    });
  });
});
