import { calculateAge } from '../utils/date';

export const PANEL_IDS = [
  'about',
  'skills',
  'projects',
  'experience',
  'accomplishments',
  'contact',
] as const;

export type PanelId = (typeof PANEL_IDS)[number];
export type PlanetIconName = 'User' | 'Zap' | 'Hammer' | 'Clock' | 'Trophy' | 'Radio';
export type AccomplishmentIconName = 'Trophy' | 'Rocket' | 'Zap' | 'GraduationCap' | 'Cloud';
export type SkillCategory = 'frontend' | 'backend' | 'devops';
export const PROJECT_CATEGORIES = [
  'frontend',
  'backend',
  'full_stack',
  'mobile',
  'portfolio',
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export const SKILL_GROUP_IDS = [
  'languages',
  'frontend_ui',
  'backend_integrations',
  'data_persistence',
  'architecture_quality',
  'platform_cloud',
  'immersive_mobile',
] as const;
export type SkillGroupId = (typeof SKILL_GROUP_IDS)[number];
export const EXPERIENCE_TYPES = ['full_time', 'contract', 'scholarship'] as const;
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];

export interface DeveloperEducation {
  title: string;
  institution: string;
  period: string;
  description: string;
}

export interface DeveloperStat {
  id: 'years' | 'projects' | 'stacks';
  value: string;
}

export interface DeveloperProfile {
  name: string;
  age: number;
  email: string;
  github: string;
  linkedin: string;
  website: string;
  profileImage: string;
  stats: DeveloperStat[];
}

export const DEVELOPER: DeveloperProfile = {
  name: 'Gabriel Feijó',
  age: calculateAge(new Date(2002, 3, 6)),
  email: 'feijo6622@gmail.com',
  github: 'https://github.com/GabrielFeijo',
  linkedin: 'https://www.linkedin.com/in/gabriel-feijo/',
  website: 'https://gabrielfeijo.com.br',
  profileImage: '/gabrielfeijo.webp',
  stats: [
    { id: 'years', value: '4+' },
    { id: 'projects', value: '10+' },
    { id: 'stacks', value: '30+' },
  ],
};

export interface Planet {
  id: PanelId;
  color: string;
  glowColor: string;
  ringColor?: string;
  hasRings?: boolean;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  orbitY?: number;
  orbitPhase?: number;
  atmosphereColor: string;
  icon: PlanetIconName;
  type: 'rocky' | 'gas' | 'ice' | 'lava' | 'crystal' | 'oceanic' | 'forest' | 'star';
}

export interface SkillItem {
  name: string;
  color: string;
}

export interface SkillGroup {
  id: SkillGroupId;
}

export interface Project {
  id: string;
  tech: string[];
  github?: string;
  live?: string;
  color: string;
  featured: boolean;
  year: number;
  category: ProjectCategory;
}

export interface Experience {
  id: string;
  company: string;
  type: ExperienceType;
  tech: string[];
  color: string;
}

export interface Accomplishment {
  id: string;
  icon: AccomplishmentIconName;
  color: string;
}

export interface Certificate {
  id: string;
  issuer: string;
  year: number;
  color: string;
  image?: string;
}

export const PLANETS: Planet[] = [
  {
    id: 'about',
    color: '#3b82f6',
    glowColor: '#60a5fa',
    atmosphereColor: '#1e40af',
    size: 3.2,
    orbitRadius: 30,
    orbitSpeed: 0.12,
    rotationSpeed: 0.3,
    orbitY: 3,
    orbitPhase: 0.95,
    icon: 'User',
    type: 'oceanic',
  },
  {
    id: 'skills',
    color: '#10b981',
    glowColor: '#34d399',
    atmosphereColor: '#065f46',
    size: 3.6,
    orbitRadius: 44,
    orbitSpeed: 0.08,
    rotationSpeed: 0.5,
    orbitY: -5,
    orbitPhase: 2.1,
    icon: 'Zap',
    type: 'crystal',
  },
  {
    id: 'projects',
    color: '#f59e0b',
    glowColor: '#fbbf24',
    ringColor: '#f59e0b',
    hasRings: true,
    atmosphereColor: '#92400e',
    size: 4.2,
    orbitRadius: 60,
    orbitSpeed: 0.06,
    rotationSpeed: 0.2,
    orbitY: 8,
    orbitPhase: 3.15,
    icon: 'Hammer',
    type: 'lava',
  },
  {
    id: 'experience',
    color: '#ef4444',
    glowColor: '#f87171',
    atmosphereColor: '#7f1d1d',
    size: 2.8,
    orbitRadius: 56,
    orbitSpeed: 0.045,
    rotationSpeed: 0.4,
    orbitY: -4,
    orbitPhase: 4.2,
    icon: 'Clock',
    type: 'rocky',
  },
  {
    id: 'accomplishments',
    color: '#8b5cf6',
    glowColor: '#a78bfa',
    ringColor: '#8b5cf6',
    hasRings: true,
    atmosphereColor: '#4c1d95',
    size: 4.7,
    orbitRadius: 62,
    orbitSpeed: 0.03,
    rotationSpeed: 0.15,
    orbitY: 12,
    orbitPhase: 5.2,
    icon: 'Trophy',
    type: 'gas',
  },
  {
    id: 'contact',
    color: '#ec4899',
    glowColor: '#f472b6',
    atmosphereColor: '#831843',
    size: 2.4,
    orbitRadius: 38,
    orbitSpeed: 0.02,
    rotationSpeed: 0.6,
    orbitY: 3,
    orbitPhase: 6.0,
    icon: 'Radio',
    type: 'ice',
  },
];

export const SKILLS: Record<SkillCategory, SkillItem[]> = {
  frontend: [
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'React', color: '#61dafb' },
    { name: 'Next.js', color: '#ffffff' },
    { name: 'Tailwind CSS', color: '#06b6d4' },
    { name: 'React Native / Expo', color: '#61dafb' },
    { name: 'Three.js / R3F', color: '#8b5cf6' },
  ],
  backend: [
    { name: 'Node.js / NestJS', color: '#339933' },
    { name: 'REST / WebSocket', color: '#ffffff' },
    { name: 'PostgreSQL / Prisma', color: '#4169e1' },
    { name: 'Java / Spring Boot', color: '#f97316' },
    { name: 'Redis / BullMQ', color: '#dc382d' },
    { name: 'MongoDB / Mongoose', color: '#47a248' },
  ],
  devops: [
    { name: 'Docker / Compose', color: '#2496ed' },
    { name: 'Testing / Stryker', color: '#f59e0b' },
    { name: 'AWS', color: '#ff9900' },
    { name: 'CI/CD / Azure DevOps', color: '#0078d4' },
    { name: 'Kubernetes / Rancher', color: '#326ce5' },
    { name: 'Observability', color: '#7b42bc' },
  ],
};

export const SKILL_GROUPS: SkillGroup[] = SKILL_GROUP_IDS.map((id) => ({ id }));

export const PROJECTS: Project[] = [
  {
    id: 'hookroute',
    tech: [
      'Java',
      'Spring Boot',
      'NestJS',
      'Next.js',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Prometheus',
    ],
    color: '#ef4444',
    featured: true,
    year: 2026,
    category: 'full_stack',
  },
  {
    id: 'space_portfolio_v2',
    tech: [
      'React',
      'TypeScript',
      'Three.js',
      'React Three Fiber',
      'GLSL',
      'Zustand',
      'Vitest',
      'Playwright',
    ],
    live: 'https://v2.gabrielfeijo.com.br',
    color: '#8b5cf6',
    featured: true,
    year: 2026,
    category: 'portfolio',
  },
  {
    id: 'mta_analytics',
    tech: [
      'NestJS',
      'React',
      'TypeScript',
      'Lua',
      'WebSocket',
      'BullMQ',
      'Redis',
      'PostgreSQL',
      'Three.js',
      'Docker',
    ],
    github: 'https://github.com/GabrielFeijo/mta-analytics',
    color: '#06b6d4',
    featured: true,
    year: 2026,
    category: 'full_stack',
  },
  {
    id: 'ping_on_place',
    tech: [
      'React Native',
      'Expo',
      'TypeScript',
      'Expo Location',
      'Task Manager',
      'NativeWind',
      'Zustand',
    ],
    github: 'https://github.com/GabrielFeijo/ping-on-place',
    color: '#10b981',
    featured: false,
    year: 2026,
    category: 'mobile',
  },
  {
    id: 'code_collab',
    tech: [
      'Next.js',
      'TypeScript',
      'Monaco Editor',
      'Socket.IO',
      'Prisma',
      'PostgreSQL',
      'NextAuth',
      'Docker',
    ],
    github: 'https://github.com/GabrielFeijo/code-collab',
    color: '#7c3aed',
    featured: false,
    year: 2025,
    category: 'full_stack',
  },
  {
    id: 'arsenal_academy',
    tech: ['React', 'Next.js', 'TypeScript', 'NestJS', 'Sequelize', 'MySQL', 'AWS', 'Nginx'],
    color: '#00d4ff',
    featured: true,
    year: 2023,
    category: 'full_stack',
  },
  {
    id: 'vscode_portfolio',
    tech: [
      'React',
      'TypeScript',
      'Vite',
      'Material UI',
      'Framer Motion',
      'i18next',
      'Express',
      'MongoDB',
    ],
    github: 'https://github.com/GabrielFeijo/VsCode-Portfolio',
    live: 'https://gabrielfeijo.com.br',
    color: '#00ff88',
    featured: false,
    year: 2024,
    category: 'portfolio',
  },
  {
    id: 'recife_radars',
    tech: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Leaflet', 'Vercel'],
    github: 'https://github.com/GabrielFeijo/radares-recife',
    live: 'https://radares-recife.vercel.app',
    color: '#6b21e8',
    featured: false,
    year: 2024,
    category: 'frontend',
  },
  {
    id: 'arsenal_innovation_lp',
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    color: '#5eead4',
    featured: false,
    year: 2024,
    category: 'frontend',
  },
  {
    id: 'scoordena',
    tech: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'Prisma',
      'PostgreSQL',
      'Vercel',
    ],
    github: 'https://github.com/GabrielFeijo/SCoordena',
    live: 'https://scoordena.vercel.app/',
    color: '#ff8c00',
    featured: false,
    year: 2023,
    category: 'full_stack',
  },
  {
    id: 'react_native_99pets',
    tech: ['React Native', 'JavaScript', 'Redux', 'Express', 'Node.js', 'MongoDB', 'Expo'],
    github: 'https://github.com/GabrielFeijo/React-Native-99Pets',
    color: '#ffb800',
    featured: false,
    year: 2022,
    category: 'mobile',
  },
  {
    id: 'arsenal_project_v1',
    tech: ['HTML', 'CSS', 'JavaScript', 'Java', 'Spring', 'MySQL', 'Heroku'],
    github: 'https://github.com/GabrielFeijo/Spring-Arsenal',
    color: '#f97316',
    featured: false,
    year: 2022,
    category: 'backend',
  },
  {
    id: 'react_todo',
    tech: ['React', 'React Router', 'Vite', 'Express', 'Node.js', 'MongoDB'],
    github: 'https://github.com/GabrielFeijo/React-ToDo',
    live: 'https://gg-tasks.netlify.app/',
    color: '#38bdf8',
    featured: false,
    year: 2022,
    category: 'full_stack',
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: 'cit',
    company: 'CI&T',
    type: 'full_time',
    tech: [
      'NestJS',
      'TypeScript',
      'React',
      'Jest',
      'Stryker',
      'Cypress',
      'Cucumber',
      'Azure DevOps',
      'Microfrontends',
    ],
    color: '#00d4ff',
  },
  {
    id: 'loopert',
    company: 'Loopert',
    type: 'contract',
    tech: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Express',
      'Sequelize',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'Rancher',
      'Datadog',
    ],
    color: '#00ff88',
  },
  {
    id: 'invoer',
    company: 'Invoer',
    type: 'contract',
    tech: [
      'React',
      'Next.js',
      'Tailwind CSS',
      'Shadcn/UI',
      'NestJS',
      'TypeScript',
      'Prisma',
      'Sequelize',
      'PostgreSQL',
      'MySQL',
      'Docker',
      'AWS',
    ],
    color: '#ff8c00',
  },
  {
    id: 'arsenal',
    company: 'Arsenal Inovação',
    type: 'contract',
    tech: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'NestJS',
      'Sequelize',
      'MySQL',
      'AWS',
      'EC2',
      'RDS',
      'S3',
      'Nginx',
    ],
    color: '#6b21e8',
  },
  {
    id: 'senai_facepe_project',
    company: 'SENAI / FACEPE',
    type: 'scholarship',
    tech: ['WordPress', 'ThingsBoard', 'QGIS', 'QGISToWeb', 'IoT', 'Sensor Networks'],
    color: '#ff6b35',
  },
  {
    id: 'ferreira_costa',
    company: 'Home Center Ferreira Costa',
    type: 'full_time',
    tech: ['CorelDRAW', 'Photoshop', 'Trade Marketing', 'Graphic Design'],
    color: '#94a3b8',
  },
];

export const ACCOMPLISHMENTS: Accomplishment[] = [
  {
    id: 'top_10_embarque_digital',
    icon: 'Trophy',
    color: '#ffb800',
  },
  {
    id: 'top_12_riseup_porto_digital',
    icon: 'Rocket',
    color: '#00ff88',
  },
  {
    id: 'top_12_growup_porto_digital',
    icon: 'Zap',
    color: '#6b21e8',
  },
  {
    id: 'ads_graduation',
    icon: 'GraduationCap',
    color: '#00d4ff',
  },
  {
    id: 'resilient_architecture',
    icon: 'Cloud',
    color: '#f97316',
  },
  {
    id: 'software_quality',
    icon: 'Zap',
    color: '#61dafb',
  },
];

export const CERTIFICATES: Certificate[] = [
  {
    id: 'ads_degree',
    issuer: 'Faculdade Senac',
    year: 2023,
    color: '#2563eb',
    image: 'https://i.imgur.com/7Pecs4g.png',
  },
  {
    id: 'advanced_backend_development',
    issuer: 'Faculdade Senac',
    year: 2023,
    color: '#e0234e',
    image: 'https://i.imgur.com/2fgLfpg.png',
  },
  {
    id: 'decola_tech_2nd_edition',
    issuer: 'Avanade + DIO',
    year: 2022,
    color: '#0078d4',
    image: 'https://i.imgur.com/QnTGDGP.png',
  },
];
