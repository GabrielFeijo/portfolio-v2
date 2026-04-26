import { calculateAge } from '../utils/date'

export const PANEL_IDS = ['about', 'skills', 'projects', 'experience', 'accomplishments', 'contact'] as const

export type PanelId = (typeof PANEL_IDS)[number]
export type PlanetIconName = 'User' | 'Zap' | 'Hammer' | 'Clock' | 'Trophy' | 'Radio'
export type AccomplishmentIconName = 'Trophy' | 'Rocket' | 'Zap' | 'GraduationCap' | 'Cloud' | 'Smartphone'
export type SkillCategory = 'frontend' | 'backend' | 'devops'
export const PROJECT_CATEGORIES = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Portfolio'] as const
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]
export const EXPERIENCE_TYPES = ['CLT', 'PJ', 'BOLSISTA'] as const
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number]

export interface DeveloperEducation {
  title: string
  institution: string
  period: string
  description: string
}

export interface DeveloperStat {
  label: string
  value: string
}

export interface DeveloperProfile {
  name: string
  title: string
  location: string
  age: number
  email: string
  github: string
  linkedin: string
  website: string
  profileImage: string
  tagline: string
  bio: string
  availability: string
  stats: DeveloperStat[]
  summary: string[]
  education: DeveloperEducation[]
}

export const DEVELOPER: DeveloperProfile = {
  name: 'Gabriel Feijó',
  title: 'Desenvolvedor Full Stack',
  location: 'Recife, Brasil',
  age: calculateAge(new Date(2002, 3, 6)),
  email: 'feijo6622@gmail.com',
  github: 'https://github.com/GabrielFeijo',
  linkedin: 'https://www.linkedin.com/in/gabriel-feijo/',
  website: 'https://gabrielfeijo.com.br',
  profileImage: '/gabrielfeijo.png',
  tagline: 'Desenvolvendo soluções tecnológicas para mudar o mundo de forma positiva.',
  bio: 'Desenvolvedor Full Stack com foco em interfaces bem construídas, backends escaláveis e experiências digitais que unem clareza, performance e valor real.',
  availability: 'Aberto para oportunidades, colaborações e conversas sobre tecnologia.',
  stats: [
    { label: 'Anos de experiência', value: '4+' },
    { label: 'Projetos em destaque', value: '10+' },
    { label: 'Stacks dominadas', value: '15+' },
  ],
  summary: [
    'Desde cedo, a curiosidade sobre como sites, sistemas e jogos funcionam foi o que me aproximou da programação. A partir de modificações em jogos e da vontade de entender o que acontecia por trás da interface, nasceu uma relação genuína com tecnologia.',
    'Hoje atuo como desenvolvedor full stack construindo aplicações web e soluções completas, do frontend ao backend, passando por arquitetura, integrações, deploy, observabilidade e qualidade de software.',
    'Gosto de ambientes em que produto, engenharia e experiência do usuário caminham juntos. Meu objetivo é criar software útil, sólido e agradável de usar.',
  ],
  education: [
    {
      title: 'Análise e Desenvolvimento de Sistemas',
      institution: 'Faculdade Senac',
      period: 'Concluído em 2023',
      description: 'Formação com base em programação, banco de dados, desenvolvimento web, mobile, arquitetura de sistemas e práticas colaborativas. Parte da jornada aconteceu no programa Embarque Digital, com vivência prática e mentoria próxima do mercado.',
    },
  ],
}

export interface Planet {
  id: PanelId
  name: string
  subtitle: string
  color: string
  glowColor: string
  ringColor?: string
  hasRings?: boolean
  size: number
  orbitRadius: number
  orbitSpeed: number
  rotationSpeed: number
  orbitY?: number
  orbitPhase?: number
  atmosphereColor: string
  icon: PlanetIconName
  description: string
  type: 'rocky' | 'gas' | 'ice' | 'lava' | 'crystal' | 'oceanic' | 'forest' | 'star'
}

export interface SkillItem {
  name: string
  level: number
  color: string
}

export interface SkillGroup {
  title: string
  items: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  github?: string
  live?: string
  color: string
  featured: boolean
  year: number
  category: ProjectCategory
  image?: string
  highlights?: string[]
}

export interface Experience {
  id: string
  role: string
  company: string
  period: string
  type: ExperienceType
  description: string
  achievements: string[]
  tech: string[]
  color: string
}

export interface Accomplishment {
  id: string
  icon: AccomplishmentIconName
  title: string
  description: string
  color: string
  category: string
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  year: number
  color: string
  image?: string
  description?: string
}

export const PLANETS: Planet[] = [
  {
    id: 'about',
    name: 'SOBRE',
    subtitle: 'Minha história',
    color: '#3B82F6',
    glowColor: '#60A5FA',
    atmosphereColor: '#1E40AF',
    size: 3.2,
    orbitRadius: 30,
    orbitSpeed: 0.12,
    rotationSpeed: 0.3,
    orbitY: 3,
    orbitPhase: 0.95,
    icon: 'User',
    type: 'oceanic',
    description: 'Visão geral sobre quem eu sou, minha trajetória e formação.',
  },
  {
    id: 'skills',
    name: 'HABILIDADES',
    subtitle: 'Stack e capacidades',
    color: '#10B981',
    glowColor: '#34D399',
    atmosphereColor: '#065F46',
    size: 3.6,
    orbitRadius: 44,
    orbitSpeed: 0.08,
    rotationSpeed: 0.5,
    orbitY: -5,
    orbitPhase: 2.1,
    icon: 'Zap',
    type: 'crystal',
    description: 'Competências técnicas, ferramentas e habilidades complementares.',
  },
  {
    id: 'projects',
    name: 'PROJETOS',
    subtitle: 'Projetos em destaque',
    color: '#F59E0B',
    glowColor: '#FBBF24',
    ringColor: '#F59E0B',
    hasRings: true,
    atmosphereColor: '#92400E',
    size: 4.2,
    orbitRadius: 60,
    orbitSpeed: 0.06,
    rotationSpeed: 0.2,
    orbitY: 8,
    orbitPhase: 3.15,
    icon: 'Hammer',
    type: 'lava',
    description: 'Produtos, experimentos e entregas construídas ao longo da jornada.',
  },
  {
    id: 'experience',
    name: 'EXPERIÊNCIA',
    subtitle: 'Minha caminhada',
    color: '#EF4444',
    glowColor: '#F87171',
    atmosphereColor: '#7F1D1D',
    size: 2.8,
    orbitRadius: 56,
    orbitSpeed: 0.045,
    rotationSpeed: 0.4,
    orbitY: -4,
    orbitPhase: 4.2,
    icon: 'Clock',
    type: 'rocky',
    description: 'Experiência profissional, responsabilidades e evolução técnica.',
  },
  {
    id: 'accomplishments',
    name: 'CONQUISTAS',
    subtitle: 'Conquistas e estudos',
    color: '#8B5CF6',
    glowColor: '#A78BFA',
    ringColor: '#8B5CF6',
    hasRings: true,
    atmosphereColor: '#4C1D95',
    size: 4.7,
    orbitRadius: 62,
    orbitSpeed: 0.03,
    rotationSpeed: 0.15,
    orbitY: 12,
    orbitPhase: 5.2,
    icon: 'Trophy',
    type: 'gas',
    description: 'Marcos relevantes, reconhecimento e formação complementar.',
  },
  {
    id: 'contact',
    name: 'CONTATO',
    subtitle: 'Vamos conversar',
    color: '#EC4899',
    glowColor: '#F472B6',
    atmosphereColor: '#831843',
    size: 2.4,
    orbitRadius: 38,
    orbitSpeed: 0.02,
    rotationSpeed: 0.6,
    orbitY: 3,
    orbitPhase: 6.0,
    icon: 'Radio',
    type: 'ice',
    description: 'Canais para contato, networking e novas oportunidades.',
  },
]

export const SKILLS: Record<SkillCategory, SkillItem[]> = {
  frontend: [
    { name: 'React', level: 95, color: '#61DAFB' },
    { name: 'TypeScript', level: 94, color: '#3178C6' },
    { name: 'Next.js', level: 90, color: '#FFFFFF' },
    { name: 'Tailwind CSS', level: 92, color: '#06B6D4' },
    { name: 'Framer Motion', level: 86, color: '#FF0055' },
    { name: 'React Native', level: 80, color: '#61DAFB' },
  ],
  backend: [
    { name: 'Node.js', level: 91, color: '#339933' },
    { name: 'NestJS', level: 88, color: '#E0234E' },
    { name: 'Express', level: 87, color: '#FFFFFF' },
    { name: 'PostgreSQL', level: 85, color: '#4169E1' },
    { name: 'MySQL', level: 82, color: '#4479A1' },
    { name: 'MongoDB', level: 80, color: '#47A248' },
  ],
  devops: [
    { name: 'Docker', level: 80, color: '#2496ED' },
    { name: 'AWS', level: 78, color: '#FF9900' },
    { name: 'Kubernetes', level: 74, color: '#326CE5' },
    { name: 'Rancher', level: 72, color: '#0075A8' },
    { name: 'Datadog / Grafana', level: 74, color: '#7B42BC' },
    { name: 'Azure DevOps', level: 76, color: '#0078D4' },
  ],
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Habilidades gerais',
    items: [
      'Trabalho em equipe',
      'Autonomia e proatividade',
      'Aprendizagem contínua',
      'Comunicação',
      'Desenvolvimento Web',
      'Desenvolvimento Mobile',
    ],
  },
  {
    title: 'Bibliotecas e UI',
    items: ['Shadcn/UI', 'Material UI', 'Next UI', 'Bootstrap', 'Ant Design', 'Figma'],
  },
  {
    title: 'Banco de dados e ORM',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Prisma', 'Sequelize', 'TypeORM'],
  },
  {
    title: 'Cloud, ferramentas e processos',
    items: [
      'AWS EC2',
      'AWS RDS',
      'AWS S3',
      'AWS Lambda',
      'CloudFront',
      'Oracle Functions',
      'Git e GitHub',
      'Jira',
      'Trello',
      'Scrum',
    ],
  },
]

export const PROJECTS: Project[] = [
  {
    id: 'arsenal_academy',
    name: 'Arsenal Academy',
    description: 'Plataforma de educação empreendedora voltada para universitários, com diagnóstico personalizado, trilhas em microlearning e acompanhamento da evolução de cada usuário.',
    tech: ['React', 'Next.js', 'TypeScript', 'NestJS', 'Sequelize', 'MySQL', 'AWS', 'Nginx'],
    color: '#00D4FF',
    featured: true,
    year: 2023,
    category: 'Full Stack',
    image: 'https://i.imgur.com/o0VuVZP.png',
    highlights: [
      'Diagnóstico automatizado do perfil empreendedor',
      'Trilhas de aprendizagem adaptadas ao usuário',
      'Ciclo completo de desenvolvimento do frontend ao backend',
    ],
  },
  {
    id: 'vscode_portfolio',
    name: 'VsCode Portfolio',
    description: 'Releitura da IDE Visual Studio Code transformada em portfólio interativo, com sistema de arquivos virtual, terminal funcional, temas e internacionalização.',
    tech: ['React', 'TypeScript', 'Vite', 'Material UI', 'Framer Motion', 'i18next', 'Express', 'MongoDB'],
    github: 'https://github.com/GabrielFeijo/VsCode-Portfolio',
    live: 'https://gabrielfeijo.com.br',
    color: '#00FF88',
    featured: true,
    year: 2024,
    category: 'Portfolio',
    image: 'https://i.imgur.com/BwtTCxP.png',
    highlights: [
      'Simulação fiel da interface do VS Code',
      'Terminal com comandos customizados',
      'Suporte a PT/EN e tema claro/escuro',
    ],
  },
  {
    id: 'arsenal_innovation_lp',
    name: 'Arsenal Inovação LP',
    description: 'Landing page institucional para startup do Porto Digital com foco em empreendedorismo e inovação na era digital.',
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    color: '#5EEAD4',
    featured: false,
    year: 2024,
    category: 'Frontend',
    image: 'https://i.imgur.com/DILF5PA.png',
  },
  {
    id: 'scoordena',
    name: 'SCoordena',
    description: 'Gerenciador de eventos criado como projeto final do curso de backend, com foco em organização, acompanhamento e experiência intuitiva para administradores e participantes.',
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Prisma', 'PostgreSQL', 'Vercel'],
    github: 'https://github.com/GabrielFeijo/SCoordena',
    live: 'https://scoordena.vercel.app/',
    color: '#FF8C00',
    featured: false,
    year: 2023,
    category: 'Full Stack',
    image: 'https://i.imgur.com/U9CwDca.png',
  },
  {
    id: 'recife_radars',
    name: 'Radares Recife',
    description: 'Mapa interativo construído com dados públicos da Prefeitura do Recife para consulta de radares e câmeras de trânsito em uma interface clara e navegável.',
    tech: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Leaflet', 'Vercel'],
    github: 'https://github.com/GabrielFeijo/radares-recife',
    live: 'https://radares-recife.vercel.app',
    color: '#6B21E8',
    featured: false,
    year: 2024,
    category: 'Frontend',
    image: 'https://i.imgur.com/mut6eMm.png',
  },
  {
    id: 'fsw_foods',
    name: 'FSW Foods',
    description: 'Aplicação inspirada no iFood desenvolvida durante a Full Stack Week, unindo fluxo de pedidos, boa experiência de navegação e integração full stack.',
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/GabrielFeijo/FSW-Foods',
    live: 'https://fswfoods.vercel.app/',
    color: '#FF1493',
    featured: true,
    year: 2024,
    category: 'Full Stack',
    image: 'https://i.imgur.com/fryZaL7.png',
  },
  {
    id: 'react_native_99pets',
    name: 'React Native 99Pets',
    description: 'Aplicativo mobile para tutores de pets, conectando serviços, pet shops e logística de transporte em uma experiência simples para o usuário final.',
    tech: ['React Native', 'JavaScript', 'Redux', 'Express', 'Node.js', 'MongoDB', 'Expo'],
    github: 'https://github.com/GabrielFeijo/React-Native-99Pets',
    color: '#FFB800',
    featured: false,
    year: 2022,
    category: 'Mobile',
    image: 'https://i.imgur.com/q1FlJWc.png',
  },
  {
    id: 'arsenal_project_v1',
    name: 'Projeto Arsenal V1',
    description: 'Primeira versão da solução da Arsenal, focada no diagnóstico automatizado do momento empreendedor e sugestão de jornada de aprendizado.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Java', 'Spring', 'MySQL', 'Heroku'],
    github: 'https://github.com/GabrielFeijo/Spring-Arsenal',
    color: '#F97316',
    featured: false,
    year: 2022,
    category: 'Backend',
    image: 'https://i.imgur.com/X9fbQ7Y.png',
  },
  {
    id: 'react_todo',
    name: 'React ToDo',
    description: 'Gerenciador de tarefas simples e direto, criado para praticar fluxo CRUD, organização de estado e integração entre frontend e backend.',
    tech: ['React', 'React Router', 'Vite', 'Express', 'Node.js', 'MongoDB'],
    github: 'https://github.com/GabrielFeijo/React-ToDo',
    live: 'https://gg-tasks.netlify.app/',
    color: '#38BDF8',
    featured: false,
    year: 2022,
    category: 'Full Stack',
    image: 'https://i.imgur.com/a8mNqoC.png',
  },
]

export const EXPERIENCE: Experience[] = [
  {
    id: 'cit',
    role: 'Desenvolvedor Full Stack',
    company: 'CI&T',
    period: '12/2025 — Atual',
    type: 'CLT',
    description: 'Atuação em squad responsável por soluções para uma das maiores empresas de telecomunicações do Brasil, trabalhando com microfrontends, BFF e foco em experiência do usuário.',
    achievements: [
      'Desenvolvimento de BFFs com NestJS e TypeScript',
      'Microfrontends em React com biblioteca proprietária do cliente',
      'Testes unitários com Jest, mutação com Stryker e componentes com Cypress + Cucumber',
      'Participação em code reviews, práticas DevSecOps e pipelines no Azure DevOps',
    ],
    tech: ['NestJS', 'TypeScript', 'React', 'Jest', 'Stryker', 'Cypress', 'Cucumber', 'Azure DevOps', 'Microfrontends'],
    color: '#00D4FF',
  },
  {
    id: 'loopert',
    role: 'Desenvolvedor Full Stack',
    company: 'Loopert',
    period: '08/2024 — 11/2025',
    type: 'PJ',
    description: 'Empresa especializada em soluções tecnológicas para o mercado de rádio, com foco em interfaces modernas, APIs robustas e integrações de alto impacto.',
    achievements: [
      'Integrações completas com as APIs da Meta para WhatsApp',
      'Uso de Valkey como camada de cache e CloudFront para distribuição',
      'Monitoramento com Datadog e Grafana',
      'Deploys orquestrados em Kubernetes e Rancher, além de migração para Oracle Functions',
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Express', 'Sequelize', 'PostgreSQL', 'Docker', 'Kubernetes', 'Rancher', 'Datadog'],
    color: '#00FF88',
  },
  {
    id: 'invoer',
    role: 'Desenvolvedor Full Stack',
    company: 'Invoer',
    period: '07/2024 — 11/2025',
    type: 'PJ',
    description: 'Desenvolvimento de soluções personalizadas para projetos com foco em Business Intelligence, Data Science e Engenharia de Dados.',
    achievements: [
      'Interfaces com React, Next.js, Tailwind CSS e Shadcn/UI',
      'Backends com NestJS, TypeScript, Sequelize e Prisma',
      'Ambientes Docker e deploy em AWS',
      'Entrega de produtos para diferentes cenários de dados e software sob medida',
    ],
    tech: ['React', 'Next.js', 'Tailwind CSS', 'Shadcn/UI', 'NestJS', 'TypeScript', 'Prisma', 'Sequelize', 'PostgreSQL', 'MySQL', 'Docker', 'AWS'],
    color: '#FF8C00',
  },
  {
    id: 'arsenal',
    role: 'Desenvolvedor Full Stack',
    company: 'Arsenal Inovação',
    period: '07/2023 — 07/2024',
    type: 'PJ',
    description: 'Responsável pela criação da Arsenal Academy, produto educacional focado em empreendedorismo para universitários, conduzindo frontend, backend e infraestrutura.',
    achievements: [
      'Criação da plataforma do zero',
      'Frontend com React, Next.js e Tailwind CSS',
      'Backend com NestJS, Sequelize e MySQL',
      'Infraestrutura em AWS com EC2, RDS e S3',
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'NestJS', 'Sequelize', 'MySQL', 'AWS', 'EC2', 'RDS', 'S3', 'Nginx'],
    color: '#6B21E8',
  },
  {
    id: 'senai_facepe_project',
    role: 'Desenvolvedor',
    company: 'SENAI - Projeto FACEPE',
    period: '01/2023 — 12/2023',
    type: 'BOLSISTA',
    description: 'Projeto de cartografia rápida para prevenção de riscos com monitoramento contínuo de encostas urbanas a partir de múltiplas fontes de dados.',
    achievements: [
      'Desenvolvimento do website com WordPress',
      'Integração do ThingsBoard para dados de sensores',
      'Mapas interativos com QGIS e QGISToWeb',
      'Fusão de dados de satélites, drones e sensores',
    ],
    tech: ['WordPress', 'ThingsBoard', 'QGIS', 'QGISToWeb', 'IoT', 'Sensores'],
    color: '#FF6B35',
  },
  {
    id: 'ferreira_costa',
    role: 'Auxiliar Administrativo',
    company: 'Home Center Ferreira Costa',
    period: '10/2021 — 02/2023',
    type: 'CLT',
    description: 'Atuação no time de trade marketing da filial Tamarineira, apoiando produção e execução de materiais visuais para loja.',
    achievements: [
      'Suporte no uso de Corel Draw e Photoshop',
      'Apoio à criação e edição de materiais de marketing',
      'Participação no processo de plotagem e aplicação em loja',
    ],
    tech: ['Corel Draw', 'Photoshop', 'Trade Marketing', 'Design de Materiais'],
    color: '#94A3B8',
  },
]

export const ACCOMPLISHMENTS: Accomplishment[] = [
  {
    id: 'top_10_embarque_digital',
    icon: 'Trophy',
    title: 'Top 10 Squads - Embarque Digital',
    description: 'Equipe entre as 10 melhores do Kick Off do Embarque Digital 2021.2 com proposta alinhada aos Objetivos de Desenvolvimento Sustentável da ONU.',
    color: '#FFB800',
    category: 'Porto Digital',
  },
  {
    id: 'top_12_riseup_porto_digital',
    icon: 'Rocket',
    title: 'Top 12 - RiseUp Porto Digital',
    description: 'Participação entre as 12 melhores squads da etapa RiseUp, desenvolvendo solução frontend para a Arsenal Inovação.',
    color: '#00FF88',
    category: 'Competição',
  },
  {
    id: 'top_12_growup_porto_digital',
    icon: 'Zap',
    title: 'Top 12 - GrowUp Porto Digital',
    description: 'Nova classificação entre as melhores squads, dessa vez evoluindo o backend e a integração da solução para a Arsenal.',
    color: '#6B21E8',
    category: 'Competição',
  },
  {
    id: 'ads_graduation',
    icon: 'GraduationCap',
    title: 'Graduação em ADS',
    description: 'Formação concluída em Análise e Desenvolvimento de Sistemas pela Faculdade Senac com passagem pelo programa Embarque Digital.',
    color: '#00D4FF',
    category: 'Formação',
  },
  {
    id: 'cloud_platform_experience',
    icon: 'Cloud',
    title: 'Experiência com Cloud e Plataforma',
    description: 'Vivência prática com AWS, Oracle Functions, CloudFront, Kubernetes, Rancher, observabilidade e pipelines.',
    color: '#F97316',
    category: 'Tecnologia',
  },
  {
    id: 'web_mobile_performance',
    icon: 'Smartphone',
    title: 'Atuação em Web e Mobile',
    description: 'Projetos em React, Next.js e React Native, cobrindo diferentes tipos de produto e contexto de entrega.',
    color: '#61DAFB',
    category: 'Stack',
  },
]

export const CERTIFICATES: Certificate[] = [
  {
    id: 'ads_degree',
    name: 'Diploma em Análise e Desenvolvimento de Sistemas',
    issuer: 'Faculdade Senac',
    year: 2023,
    color: '#2563EB',
    image: 'https://i.imgur.com/7Pecs4g.png',
    description: 'Graduação com base ampla em desenvolvimento de software, arquitetura de sistemas e gestão de projetos.',
  },
  {
    id: 'advanced_backend_development',
    name: 'Aperfeiçoamento em Desenvolvimento Back-end',
    issuer: 'Faculdade Senac',
    year: 2023,
    color: '#E0234E',
    image: 'https://i.imgur.com/2fgLfpg.png',
    description: 'Curso voltado para práticas server-side e construção de aplicações robustas e escaláveis.',
  },
  {
    id: 'beginner_programming',
    name: 'Iniciante em Programação',
    issuer: 'Oracle + Alura',
    year: 2022,
    color: '#FF0000',
    image: 'https://i.imgur.com/MnrT6YX.png',
    description: 'Formação inicial com fundamentos de programação e raciocínio lógico.',
  },
  {
    id: 'decola_tech_2nd_edition',
    name: 'Decola Tech 2a Edicao',
    issuer: 'Avanade + DIO',
    year: 2022,
    color: '#0078D4',
    image: 'https://i.imgur.com/QnTGDGP.png',
    description: 'Bootcamp com foco em desenvolvimento de software e práticas do mercado.',
  },
  {
    id: 'programming_logic_fundamentals',
    name: 'Fundamentos de Logica de Programacao',
    issuer: 'Fundacao Bradesco',
    year: 2021,
    color: '#CC092F',
    image: 'https://i.imgur.com/3pSKax4.png',
    description: 'Base conceitual para estruturas de decisão, repetição e resolução de problemas.',
  },
  {
    id: 'html_css',
    name: 'HTML e CSS',
    issuer: 'Fundacao Bradesco',
    year: 2021,
    color: '#E34F26',
    image: 'https://i.imgur.com/iItgqqo.png',
    description: 'Fundamentos de desenvolvimento web com estrutura e estilização de interfaces.',
  },
  {
    id: 'introduction_javascript',
    name: 'Introducao ao JavaScript',
    issuer: 'Fundacao Bradesco',
    year: 2021,
    color: '#F7DF1E',
    image: 'https://i.imgur.com/3EAw1ZV.png',
    description: 'Primeiros passos com JavaScript para páginas mais dinâmicas e interativas.',
  },
  {
    id: 'java_programming_language',
    name: 'Linguagem de Programacao Java',
    issuer: 'Fundacao Bradesco',
    year: 2021,
    color: '#EA580C',
    image: 'https://i.imgur.com/DZCtRXf.png',
    description: 'Fundamentos da linguagem Java como base para aplicações e sistemas.',
  },
]
