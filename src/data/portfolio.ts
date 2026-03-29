export const DEVELOPER = {
  name: 'Gabriel Feijó',
  title: 'Full Stack Developer',
  location: 'Recife, Brazil 🇧🇷',
  bio: 'Desenvolvedor Full Stack apaixonado de Recife, criando soluções web modernas com React, TypeScript, Node.js e tecnologias de ponta. Transformando problemas complexos em experiências digitais elegantes.',
  tagline: 'Engineering the Digital Universe, One Component at a Time',
  email: 'feijo6622@gmail.com',
  github: 'https://github.com/GabrielFeijo',
  linkedin: 'https://www.linkedin.com/in/gabriel-feijo/',
  website: 'https://gabrielfeijo.com.br',
}

export interface Planet {
  id: string
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
  atmosphereColor: string
  icon: string
  description: string
  type: 'rocky' | 'gas' | 'ice' | 'lava' | 'crystal' | 'oceanic' | 'forest' | 'star'
}

export interface SkillItem {
  name: string
  level: number
  color: string
}

export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  github: string
  live: string
  color: string
  featured: boolean
  year: number
  category: string
}

export interface Experience {
  id: string
  role: string
  company: string
  period: string
  type: string
  description: string
  achievements: string[]
  tech: string[]
  color: string
}

export interface Accomplishment {
  icon: string
  title: string
  description: string
  color: string
  category: string
}

export interface Certificate {
  name: string
  issuer: string
  year: number
  color: string
}

export const PLANETS: Planet[] = [
  {
    id: 'about',
    name: 'ORIGIN',
    subtitle: 'Biography',
    color: '#3B82F6', 
    glowColor: '#60A5FA',
    atmosphereColor: '#1D4ED8',
    size: 2.8,
    orbitRadius: 28,
    orbitSpeed: 0.12,
    rotationSpeed: 0.3,
    orbitY: 0.5,
    icon: '👤',
    type: 'oceanic',
    description: 'The narrative core — access the biological and professional records.',
  },
  {
    id: 'skills',
    name: 'NEXUS',
    subtitle: 'Arsenal',
    color: '#10B981', 
    glowColor: '#34D399',
    atmosphereColor: '#065F46',
    size: 3.2,
    orbitRadius: 42,
    orbitSpeed: 0.08,
    rotationSpeed: 0.5,
    orbitY: -0.8,
    icon: '⚡',
    type: 'crystal',
    description: 'Central synaptic node containing classified technology knowledge.',
  },
  {
    id: 'projects',
    name: 'FORGE',
    subtitle: 'Artifacts',
    color: '#F59E0B', 
    glowColor: '#FBBF24',
    ringColor: '#F59E0B',
    hasRings: true,
    atmosphereColor: '#92400E',
    size: 3.8,
    orbitRadius: 60,
    orbitSpeed: 0.06,
    rotationSpeed: 0.2,
    orbitY: 1.2,
    icon: '🛠️',
    type: 'lava',
    description: 'The industrial furnace where visions are tempered into reality.',
  },
  {
    id: 'experience',
    name: 'CHRONOS',
    subtitle: 'Timeline',
    color: '#EF4444', 
    glowColor: '#F87171',
    atmosphereColor: '#7F1D1D',
    size: 2.4,
    orbitRadius: 82,
    orbitSpeed: 0.045,
    rotationSpeed: 0.4,
    orbitY: -1.5,
    icon: '⏳',
    type: 'rocky',
    description: 'Archive of established operational missions and professional growth.',
  },
  {
    id: 'accomplishments',
    name: 'AETHER',
    subtitle: 'Logbook',
    color: '#8B5CF6', 
    glowColor: '#A78BFA',
    ringColor: '#8B5CF6',
    hasRings: true,
    atmosphereColor: '#4C1D95',
    size: 4.2,
    orbitRadius: 108,
    orbitSpeed: 0.03,
    rotationSpeed: 0.15,
    orbitY: 0.8,
    icon: '🏆',
    type: 'gas',
    description: 'Registry of galactic recognition, awards, and major milestones.',
  },
  {
    id: 'contact',
    name: 'BEACON',
    subtitle: 'Transceiver',
    color: '#EC4899', 
    glowColor: '#F472B6',
    atmosphereColor: '#831843',
    size: 2.0,
    orbitRadius: 138,
    orbitSpeed: 0.02,
    rotationSpeed: 0.6,
    orbitY: -0.5,
    icon: '📡',
    type: 'ice',
    description: 'Sub-space communication array for deep universe contact.',
  },
]

export const SKILLS: Record<string, SkillItem[]> = {
  frontend: [
    { name: 'React', level: 95, color: '#61DAFB' },
    { name: 'TypeScript', level: 92, color: '#3178C6' },
    { name: 'Next.js', level: 88, color: '#FFFFFF' },
    { name: 'Framer Motion', level: 85, color: '#FF0055' },
    { name: 'TailwindCSS', level: 90, color: '#06B6D4' },
    { name: 'Material UI', level: 87, color: '#007FFF' },
  ],
  backend: [
    { name: 'Node.js', level: 90, color: '#339933' },
    { name: 'NestJS', level: 85, color: '#E0234E' },
    { name: 'Express', level: 88, color: '#FFFFFF' },
    { name: 'PostgreSQL', level: 83, color: '#4169E1' },
    { name: 'MongoDB', level: 80, color: '#47A248' },
    { name: 'MySQL', level: 78, color: '#4479A1' },
  ],
  devops: [
    { name: 'Docker', level: 75, color: '#2496ED' },
    { name: 'Git', level: 95, color: '#F05032' },
    { name: 'AWS', level: 72, color: '#FF9900' },
    { name: 'Vercel', level: 88, color: '#FFFFFF' },
    { name: 'REST APIs', level: 93, color: '#00D4FF' },
    { name: 'Jest', level: 80, color: '#C21325' },
  ],
}

export const PROJECTS: Project[] = [
  {
    id: 'arsenal-academy',
    name: 'Arsenal Academy',
    description: 'Plataforma de educação empreendedora voltada para universitários. Diagnóstico personalizado que identifica necessidades individuais e oferece trilhas de aprendizagem em microlearning. Stack completa com React, Next.js, NestJS, MySQL e AWS.',
    tech: ['React', 'Next.js', 'TypeScript', 'NestJS', 'Sequelize', 'MySQL', 'AWS', 'Nginx'],
    github: 'https://github.com/GabrielFeijo',
    live: 'https://arsenalinovacao.com.br',
    color: '#00D4FF',
    featured: true,
    year: 2023,
    category: 'Full Stack',
  },
  {
    id: 'vscode-portfolio',
    name: 'VSCode Portfolio',
    description: 'Portfolio interativo simulando o IDE do Visual Studio Code. Funcionalidades incluem navegação por sistema de arquivos, terminal interativo com comandos, temas dark/light, suporte i18n (PT/EN), sistema de avaliação e edição markdown em tempo real.',
    tech: ['React', 'TypeScript', 'Material UI', 'Framer Motion', 'i18next', 'NestJS', 'MongoDB'],
    github: 'https://github.com/GabrielFeijo/VsCode-Portfolio',
    live: 'https://gabrielfeijo.com.br',
    color: '#00FF88',
    featured: true,
    year: 2024,
    category: 'Portfolio',
  },
  {
    id: 'scoordena',
    name: 'SCoordena',
    description: 'Gerenciador de eventos desenvolvido como projeto final do curso de backend. Sistema para facilitar organização, gerenciamento e acompanhamento de eventos com interface intuitiva para administradores e participantes.',
    tech: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Prisma', 'PostgreSQL', 'Vercel'],
    github: 'https://github.com/GabrielFeijo',
    live: 'https://scoordena.vercel.app/',
    color: '#FF8C00',
    featured: false,
    year: 2023,
    category: 'Full Stack',
  },
  {
    id: 'radares-recife',
    name: 'Radares Recife',
    description: 'Projeto de mapeamento interativo utilizando dados públicos da Prefeitura do Recife. Mapa dinâmico com Leaflet mostrando localização de radares e câmeras de trânsito com detalhes específicos e links para Google Maps.',
    tech: ['TypeScript', 'React', 'Next.js', 'TailwindCSS', 'Leaflet', 'Vercel'],
    github: 'https://github.com/GabrielFeijo',
    live: 'https://radares-recife.vercel.app',
    color: '#6B21E8',
    featured: false,
    year: 2024,
    category: 'Frontend',
  },
  {
    id: 'fsw-foods',
    name: 'FSW Foods',
    description: 'Aplicativo de delivery inspirado no iFood, desenvolvido durante a Full Stack Week. Permite que usuários façam pedidos com interface amigável e integração completa de frontend e backend para uma experiência eficiente.',
    tech: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/GabrielFeijo',
    live: 'https://fswfoods.vercel.app/',
    color: '#FF1493',
    featured: true,
    year: 2024,
    category: 'Full Stack',
  },
  {
    id: 'react-native-99pets',
    name: 'React Native 99Pets',
    description: 'Aplicativo mobile para tutores de pets que não têm tempo para ir ao pet shop. O usuário cadastra o pet, escolhe um serviço e um parceiro motorista vai buscar o animal. Stack com React Native, Redux, Express e MongoDB.',
    tech: ['React Native', 'JavaScript', 'Redux', 'Express', 'NodeJS', 'MongoDB', 'Expo'],
    github: 'https://github.com/GabrielFeijo/React-Native-99Pets',
    live: '#',
    color: '#FFB800',
    featured: false,
    year: 2022,
    category: 'Mobile',
  },
]

export const EXPERIENCE: Experience[] = [
  {
    id: 'cit',
    role: 'Full Stack Developer',
    company: 'CI&T',
    period: '12/2025 — Presente',
    type: 'CLT',
    description: 'Atuação como Desenvolvedor FullStack integrando um squad que desenvolve soluções para uma das maiores empresas de telecomunicações do Brasil. Arquitetura moderna baseada em microfrontends e BFF, contribuindo desde o refinamento técnico até a entrega de soluções escaláveis e orientadas à experiência do usuário.',
    achievements: [
      'Desenvolvimento de BFFs com NestJS e TypeScript para grande telecom brasileira',
      'Microfrontends em React utilizando biblioteca de componentes proprietária do cliente',
      'Implementação de testes unitários com Jest, mutação com Stryker e componentes com Cypress/Cucumber/Gherkin',
      'Participação em code reviews, práticas DevSecOps e pipelines no Azure DevOps',
    ],
    tech: ['NestJS', 'TypeScript', 'React', 'Jest', 'Stryker', 'Cypress', 'Cucumber', 'Azure DevOps', 'Microfrontends'],
    color: '#00D4FF',
  },
  {
    id: 'loopert',
    role: 'Full Stack Developer',
    company: 'Loopert',
    period: '08/2024 — 11/2025',
    type: 'CLT',
    description: 'Empresa especializada em soluções tecnológicas para o mercado de rádio. Desenvolvimento de interfaces modernas focadas na experiência do usuário e APIs robustas. Integrações completas com APIs da Meta para WhatsApp, manutenção de serviços Lambda e migração para Oracle Functions.',
    achievements: [
      'Integrações completas com APIs da Meta para WhatsApp',
      'Implementação de Valkey como camada de cache e CloudFront para distribuição de conteúdo',
      'Monitoramento com Datadog e Grafana, deploys orchestrados com Kubernetes e Rancher',
      'Migração de serviços AWS Lambda para Oracle Functions garantindo alta disponibilidade',
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Express', 'Sequelize', 'PostgreSQL', 'Docker', 'Kubernetes', 'Rancher', 'Datadog'],
    color: '#00FF88',
  },
  {
    id: 'invoer',
    role: 'Full Stack Developer',
    company: 'Invoer',
    period: '07/2024 — 11/2025',
    type: 'CLT',
    description: 'Empresa especializada em produtos de software com foco em Business Intelligence, Data Science e Engenharia de Dados. Desenvolvimento de soluções personalizadas para diversos projetos com interfaces modernas e backends robustos hospedados na AWS.',
    achievements: [
      'Construção de interfaces com React, Next.js, TailwindCSS e ShadCN/UI',
      'Backend com Nest.js + TypeScript, Sequelize/Prisma para PostgreSQL e MySQL',
      'Ambientes Docker para desenvolvimento e produção hospedados na AWS',
      'Entrega de múltiplos projetos de BI e Data Engineering',
    ],
    tech: ['React', 'Next.js', 'TailwindCSS', 'ShadCN/UI', 'NestJS', 'TypeScript', 'Prisma', 'Sequelize', 'PostgreSQL', 'MySQL', 'Docker', 'AWS'],
    color: '#FF8C00',
  },
  {
    id: 'arsenal',
    role: 'Full Stack Developer',
    company: 'Arsenal Inovação',
    period: '07/2023 — 07/2024',
    type: 'CLT',
    description: 'Startup nascida no Porto Digital, Recife. Desenvolvedor Fullstack responsável pela criação da Arsenal Academy, plataforma de educação empreendedora voltada para universitários. Responsável pelo ciclo completo de desenvolvimento, frontend e backend.',
    achievements: [
      'Criação da Arsenal Academy do zero — plataforma de educação empreendedora completa',
      'Interfaces dinâmicas e responsivas com React, Next.js e Tailwind CSS',
      'Arquitetura backend sólida e escalável com Nest.js, Sequelize e MySQL',
      'Infraestrutura AWS com EC2, RDS e S3 para performance e escalabilidade',
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'NestJS', 'Sequelize', 'MySQL', 'AWS', 'EC2', 'RDS', 'S3', 'Nginx'],
    color: '#6B21E8',
  },
  {
    id: 'senai-facepe',
    role: 'Developer',
    company: 'SENAI - Projeto FACEPE',
    period: '01/2023 — 12/2023',
    type: 'Projeto',
    description: 'Plataforma de monitoramento contínuo para prevenção de desastres decorrentes de precipitações intensas em encostas urbanas. Fusão de dados de satélites, drones e sensores para informações estratégicas.',
    achievements: [
      'Desenvolvimento do website do projeto utilizando WordPress',
      'Integração do ThingsBoard para visualização de dados de sensores em tempo real',
      'Construção de mapas interativos com QGIS e QGISToWeb',
      'Fusão de dados de múltiplas fontes: satélites, drones e sensores IoT',
    ],
    tech: ['WordPress', 'ThingsBoard', 'QGIS', 'QGISToWeb', 'IoT', 'Sensores'],
    color: '#FF6B35',
  },
]

export const ACCOMPLISHMENTS: Accomplishment[] = [
  {
    icon: '🏆',
    title: 'Top 10 Squads — Embarque Digital',
    description: 'Ficamos entre as 10 melhores squads do Kick Off Embarque Digital 2021.2 no Porto Digital, Recife',
    color: '#FFB800',
    category: 'Award',
  },
  {
    icon: '🎓',
    title: 'Graduação ADS — Faculdade Senac',
    description: 'Análise e Desenvolvimento de Sistemas com participação no programa Embarque Digital 2023',
    color: '#00D4FF',
    category: 'Education',
  },
  {
    icon: '🚀',
    title: 'Top 12 — RiseUp Porto Digital',
    description: 'Equipe entre as 12 melhores squads da competição de tecnologia e inovação RiseUp do Porto Digital 2022',
    color: '#00FF88',
    category: 'Award',
  },
  {
    icon: '⚡',
    title: 'Top 12 — GrowUp Porto Digital',
    description: 'Equipe entre as 12 melhores squads do GrowUp Porto Digital 2022, desenvolvendo backend para Arsenal Inovação',
    color: '#6B21E8',
    category: 'Award',
  },
  {
    icon: '☁️',
    title: 'Kubernetes & Cloud Expert',
    description: 'Experiência com Kubernetes, Rancher, AWS Lambda, Oracle Functions e CloudFront em produção',
    color: '#FF8C00',
    category: 'Milestone',
  },
  {
    icon: '🤝',
    title: '4+ Anos de Experiência',
    description: '4+ anos de desenvolvimento fullstack profissional em empresas como CI&T, Loopert e Invoer',
    color: '#FF1493',
    category: 'Experience',
  },
  {
    icon: '📱',
    title: 'React Native Developer',
    description: 'Desenvolvimento de aplicações mobile com React Native publicadas nas stores',
    color: '#61DAFB',
    category: 'Mobile',
  },
  {
    icon: '✍️',
    title: 'Open Source Contributor',
    description: 'Múltiplos projetos open source no GitHub com centenas de commits e contribuições para a comunidade',
    color: '#FFB800',
    category: 'Content',
  },
]

export const CERTIFICATES: Certificate[] = [
  {
    name: 'Aperfeiçoamento em Desenvolvimento Back-end',
    issuer: 'Faculdade Senac',
    year: 2023,
    color: '#E0234E',
  },
  {
    name: 'Decola Tech 2ª Edição',
    issuer: 'Avanade + DIO',
    year: 2022,
    color: '#0078D4',
  },
  {
    name: 'Iniciante em Programação',
    issuer: 'Oracle + Alura',
    year: 2022,
    color: '#FF0000',
  },
  {
    name: 'Fundamentos de Lógica de Programação',
    issuer: 'Fundação Bradesco',
    year: 2021,
    color: '#CC092F',
  },
  {
    name: 'HTML e CSS',
    issuer: 'Fundação Bradesco',
    year: 2021,
    color: '#E34F26',
  },
  {
    name: 'Introdução ao JavaScript',
    issuer: 'Fundação Bradesco',
    year: 2021,
    color: '#F7DF1E',
  },
]