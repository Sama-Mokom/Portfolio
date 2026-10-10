/** Public profile only. Personal identifiers and internal employment context are excluded. */
export const profile = {
  name: "Nkeng Sama Mokom",
  shortName: "Mokom",
  title: "Software engineer",
  tagline: "Building systems for the conditions I live in.",
  location: "Buea, Cameroon",
  base: "Buea · currently on attachment in Yaoundé",
  timezone: "WAT · UTC+1",
  email: "yungkaparaz@gmail.com",
  github: "https://github.com/Sama-Mokom",
  linkedin: "https://www.linkedin.com/in/sama-mokom-784161283",
  availability:
    "Open to conversations about graduate engineering roles, frontend and backend projects, and integration work.",
  lastUpdated: "2026-09-21",
};

export const introduction = [
  "I’m Mokom, a Software Engineer. I build across the stack, with my deepest work in backend behaviour: who can change a record, what happens when two requests arrive together, and whether the history still tells the truth afterwards.",
  "My interest in computing started with an old desktop that broke often enough to make opening it feel normal. I learned to diagnose hardware, and I still enjoy repairing devices. After my Advanced Levels, software videos from ThePrimeAgen helped turn that curiosity toward programming and a Computer Engineering degree.",
  "The projects I return to tend to be close to home: university document requests, mobile-network measurement and the small integrations that make a workflow less frustrating. I want to understand the systems I build, including the parts that did not work the first time.",
];

export const education = {
  degree: "B.Eng. Computer Engineering",
  institution: "University of Buea",
  period: "Final year · expected graduation 2027",
  detail: "Faculty of Engineering and Technology · Cameroon",
  coursework: [
    "Advanced databases: PostgreSQL schemas, audit triggers, role modelling and transaction behaviour.",
    "Software verification and validation: defect analysis, static analysis, unit, integration and security testing.",
    "Cloud computing: AWS EC2 and S3, Google App Engine, container experiments and deployment fundamentals.",
    "Human–computer interaction: usability, user-centred design and interface evaluation.",
    "Mobile development: NetInsight requirements, specification and database design in a five-person team.",
  ],
};

export const experience = [
  {
    company: "V-Groups",
    role: "Software development intern · second stint",
    period: "August 2026 — January 2027",
    location: "Yaoundé, Cameroon",
    description:
      "A six-month industrial attachment focused on custom applications and integration work with GoHighLevel, alongside CampusDesk and this portfolio.",
    contributions: [
      "Building familiarity with the development workflow through GoHighLevel applications, CRM automation and platform integrations.",
      "Working with workflows, OAuth 2.0, webhooks and custom workflow actions.",
      "Studying cloud concepts independently, with CampusDesk's Docker and AWS deployment planning as a practical next step.",
    ],
    technologies: ["GoHighLevel", "PHP", "Laravel", "OAuth 2.0", "Webhooks"],
  },
  {
    company: "Njomi Tech Solutions",
    role: "Junior developer",
    period: "Approximately six months · ended March 2026",
    location: "Remote · Douala, Cameroon",
    description:
      "Contributed reviewed changes to EducLynk, a tutor-finding platform built with React, TypeScript and Laravel.",
    contributions: [
      "Helped improve user-onboarding speed by 30% through onboarding-related contributions.",
      "Corrected stale filter and pagination state, introduced server-side search, and improved responsive layouts.",
      "Diagnosed an OAuth configuration issue and worked through issues and pull requests for team review.",
    ],
    technologies: ["React", "TypeScript", "Laravel", "Tailwind CSS"],
  },
  {
    company: "V-Groups",
    role: "Software development intern · first stint",
    period: "Earlier internship · onboarding",
    location: "Yaoundé, Cameroon",
    description:
      "An onboarding-focused introduction to the company's technology stack through X-Clusive, an e-commerce learning project.",
    contributions: [
      "Built X-Clusive with Vue 3, Node.js and PostgreSQL to learn the stack.",
      "Developed practical familiarity with frontend interfaces, API integration and relational data modelling.",
    ],
    technologies: ["Vue 3", "Node.js", "PostgreSQL", "Render"],
  },
];

export const skillGroups = [
  {
    title: "Backend & data",
    level: "My deepest hands-on work",
    technologies: [
      "Laravel / PHP",
      "Node.js / Express",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "API design",
    ],
  },
  {
    title: "Frontend",
    level: "Production contributions and project work",
    technologies: [
      "React",
      "Vue 3",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "React Native / Expo",
    ],
  },
  {
    title: "Quality & modelling",
    level: "Project work and formal coursework",
    technologies: [
      "PHPUnit / Pest",
      "Vitest",
      "Vue Test Utils",
      "Playwright",
      "SQL modelling",
      "UML / DFD",
      "IEEE 830 specifications",
    ],
  },
  {
    title: "Infrastructure & integration",
    level: "Practical labs, integration work and current learning",
    technologies: [
      "Docker",
      "AWS EC2 / S3",
      "Git",
      "OAuth 2.0",
      "Webhooks",
      "GoHighLevel",
    ],
  },
  {
    title: "Exploration",
    level: "Limited or domain-specific experience",
    technologies: [
      "NestJS / Prisma — exploratory",
      "MQL5 — experimental systems",
      "Python — coursework and tooling",
    ],
  },
];

export const journey = [
  {
    period: "Foundations",
    title: "Understanding the machine",
    description:
      "Hardware curiosity developed into C programming, operating systems, mathematics and a Computer Engineering degree.",
  },
  {
    period: "2025 — early 2026",
    title: "Learning to build across the stack",
    description:
      "X-Clusive, team coursework and my first hackathon connected individual technologies to applications other people could run.",
  },
  {
    period: "Early 2026",
    title: "Working in a real codebase",
    description:
      "EducLynk brought reviewed changes, state bugs, search behaviour and the responsibility of maintaining an existing product.",
  },
  {
    period: "Now",
    title: "Choosing depth deliberately",
    description:
      "CampusDesk is where I work through concurrency, audit history and permissions. Cloud and delivery pipelines are the next practical layer.",
  },
];

export const interests = [
  "I follow Manchester United through the good seasons and the difficult ones. Away from football, a science-fiction thriller is a reliable choice; Attack on Titan is my favourite anime.",
  "My music moves comfortably from Sinatra and Louis Armstrong to Afrobeats, hip-hop, alternative rock, gospel and worship. I like the range more than the idea of settling on one genre.",
  "Education access matters to me. I volunteer with the Grow You Grow Me Foundation and produced its launch pamphlet in April 2026.",
];

export const values = [
  "Understanding is part of the deliverable. I would rather work through the reason a design is correct than only reach the point where it appears to work.",
  "Local problems deserve careful engineering. Connectivity, payment methods and institutional workflows belong in the design from the beginning.",
  "Evidence should be allowed to change the claim. A rejected design or a disappointing experiment can be the most useful part of the work.",
];

export const otherWork = [
  {
    title: "X-Clusive",
    description:
      "An e-commerce onboarding project from my first V-Groups internship, built to learn the company stack. The project is now dormant.",
    technologies: ["Vue 3", "Node.js", "PostgreSQL"],
    status: "Dormant · onboarding project",
    repository: "https://github.com/Sama-Mokom/my-ecommerce-app",
    href: "https://x-clussive-shop.onrender.com/",
  },
  {
    title: "GoHighLevel integrations",
    description:
      "Workflows, custom actions, OAuth and webhooks developed as part of my learning and work during the second V-Groups internship stint.",
    technologies: ["GoHighLevel", "PHP", "Laravel"],
    status: "Active · internship journey",
    repository: null,
    href: "/lab#oauth",
  },
  {
    title: "QoE survey automation",
    description:
      "Browser automation created to help a friend generate mock survey data for a data-analysis project, separate from the NetInsight team project.",
    technologies: ["Node.js", "Playwright", "Selenium"],
    status: "Complete · mock-data tooling",
    repository: null,
    href: "/lab#survey-automation",
  },
];

export const labEntries = [
  {
    slug: "survey-automation",
    title: "Four versions of a form filler",
    description:
      "A Node.js and Playwright tool for sending mock survey data from CSV into a form, created to help a friend with a data-analysis project. Four iterations dealt with modal dialogs, value mapping, conditional fields and progress tracking; related Selenium experiments explored form automation.",
    year: "2026",
    technologies: ["Node.js", "Playwright", "Selenium"],
    status: "Complete · mock data only",
  },
  {
    slug: "ghl-integration",
    title: "OAuth, webhooks and a custom action",
    description:
      "A one-day PHP and Laravel practice integration in a GoHighLevel test environment, exploring OAuth 2.0, webhooks and a custom workflow action during my second V-Groups stint.",
    year: "2026",
    technologies: ["Laravel", "OAuth 2.0", "GoHighLevel"],
    status: "Learning experiment",
  },
  {
    slug: "ghl-workflows",
    title: "A gym-trial workflow, end to end",
    description:
      "Five connected GoHighLevel workflows using a calendar, pipeline and custom fields. The useful debugging was in platform behaviour: contact-cookie deduplication and workflow re-entry.",
    year: "2026",
    technologies: ["GoHighLevel", "Workflows"],
    status: "Development practice",
  },
  {
    slug: "mql5-experiments",
    title: "When a filter changes nothing",
    description:
      "MQL5 experiments testing whether alignment between H4 bias and M15 entries supplied independent confirmation. Unchanged results made the filter's underlying assumption the next thing to question.",
    year: "2026",
    technologies: ["MQL5", "MetaTrader 5"],
    status: "Active experiments",
    relatedWork: "goldstrat",
    relatedWriting: "when-a-backtest-changes-your-mind",
  },
  {
    slug: "environment-benchmark",
    title: "WSL2 and Docker under a benchmark",
    description:
      "A cloud-coursework comparison using sysbench to explore the behaviour of two development environments. Original result files are needed before any measured comparison is published.",
    year: "2026",
    technologies: ["WSL2", "Docker", "sysbench"],
    status: "Coursework experiment",
  },
  {
    slug: "document-generation",
    title: "A launch pamphlet, generated with code",
    description:
      "A programmatic document made with Node's docx library for the Grow You Grow Me Foundation's April 2026 launch. A small application of code to a practical communication task.",
    year: "2026",
    technologies: ["Node.js", "docx"],
    status: "Complete · volunteer work",
  },
];

export const currentActivities = [
  {
    title: "Building",
    paragraphs: [
      "CampusDesk's four dashboards are wired and tested. I’m now planning its CI/CD and deployment pipeline with Docker and AWS. During my second V-Groups internship stint in Yaoundé, I’m also working through GoHighLevel applications and integrations.",
    ],
  },
  {
    title: "Learning",
    paragraphs: [
      "Cloud and delivery fundamentals are the practical focus, alongside data structures, algorithms and system design. I want the deployment work to explain how the application reaches users, not simply produce a running server.",
    ],
  },
  {
    title: "Thinking about",
    paragraphs: [
      "How to make engineering work easier to inspect: the failed first fix, the assumption behind a test, the trade-off that changed a design. Away from the keyboard, there is usually football, a film or music somewhere in the day.",
    ],
  },
];
