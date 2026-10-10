export const journey = [
  {
    period: "Foundations",
    time: "Levels 200–300",
    title: "Learning how things work.",
    summary:
      "C, circuits, operating systems and the foundations of computer engineering.",
    detail:
      "Before software, it was hardware: opening up an unreliable family desktop, finding the fault, and trying again. University gave that curiosity a more formal language.",
  },
  {
    period: "Full-stack breadth",
    time: "2025 – early 2026",
    title: "From exercises to applications.",
    summary:
      "Vue, Node.js and PostgreSQL; team projects and a first internship.",
    detail:
      "X-Clusive began as an onboarding project during my first V-Groups internship. Building across the stack helped me see the connection between an interface, its API and the data underneath.",
  },
  {
    period: "Production contact",
    time: "August 2025 — March 2026",
    title: "Real users, real consequences.",
    summary:
      "Working on EducLynk at Njomi Tech Solutions through issues and reviewed pull requests.",
    detail:
      "Stale React state, server-side search, responsive fixes and an OAuth configuration issue made debugging concrete. My contributions helped improve user-onboarding speed by 30%.",
  },
  {
    period: "Deliberate depth",
    time: "May 2026 — Present",
    title: "Choosing depth on purpose.",
    summary:
      "CampusDesk, quantitative experiments, and a deliberate move toward cloud and delivery work.",
    detail:
      "For CampusDesk, I write the backend by hand against documentation, with AI limited to mentoring and review. Its four dashboards are wired and tested; Docker, AWS and the delivery pipeline are the next focus.",
  },
] as const;

export const skillGroups = [
  {
    title: "Frontend",
    tools: "TypeScript · JavaScript · React · Vue 3 · Next.js",
    context:
      "React in a production team; Vue and TypeScript across personal projects. React Native in team coursework.",
  },
  {
    title: "Backend",
    tools: "Laravel · PHP · Node.js / Express · Flask",
    context:
      "Laravel in production contributions and CampusDesk. Node.js and Flask in project and coursework settings. NestJS is exploratory experience.",
  },
  {
    title: "Data",
    tools: "MySQL · PostgreSQL · MongoDB · SQL",
    context:
      "Relational modelling, transactions and audit trails in project work; PostgreSQL triggers and roles in advanced database coursework.",
  },
  {
    title: "Infrastructure",
    tools: "Docker · AWS EC2 / S3 · Linux · Git",
    context:
      "Hands-on cloud coursework. Applying that learning to CampusDesk’s CI/CD and deployment planning now.",
  },
  {
    title: "Quality",
    tools: "PHPUnit · Pest · Vitest · Playwright · Cppcheck",
    context:
      "Testing on CampusDesk, browser automation experiments, and unit, integration and security testing in verification coursework.",
  },
  {
    title: "Modelling & communication",
    tools: "ERDs · UML · State diagrams · Technical specifications",
    context:
      "I use diagrams and written decisions to make a system understandable before and after implementation.",
  },
] as const;

export const experiments = [
  {
    id: "mql5",
    title: "Testing the optimiser",
    year: "2026",
    kind: "Quantitative systems",
    tools: ["MQL5", "MetaTrader 5"],
    summary:
      "Testing whether a promising backtest reflects a repeatable signal or a particular market regime.",
    detail:
      "An eight-year backtest concentrated its net profit in the final two years. That changed the question from tuning parameters to checking regime dependence. These are software and validation experiments; there is no live trading record.",
    visual: "quant",
    href: "/work/goldstrat",
    link: "Read the engineering study",
  },
  {
    id: "survey-automation",
    title: "Four passes at automation",
    year: "2026",
    kind: "Browser automation",
    tools: ["Node.js", "Playwright", "Selenium"],
    summary:
      "A mock-survey-data tool built to help a friend with a data-analysis project.",
    detail:
      "Four iterations handled modal dialogs, CSV-to-field mappings, conditionally visible questions and progress tracking in KoboToolbox/Enketo. Related Selenium scripts used randomised answer pools for Google Forms. This was mock data, not collected survey evidence.",
    visual: "flow",
  },
  {
    id: "oauth",
    title: "A day with OAuth",
    year: "2026",
    kind: "Platform integration",
    tools: ["Laravel", "OAuth 2.0", "Webhooks"],
    summary:
      "A small GoHighLevel integration exploring the full path from authorisation to a custom workflow action.",
    detail:
      "Built against a test agency sub-account and marketplace developer account during my second V-Groups internship journey. The exercise joined OAuth, webhook handling and a custom action into one practice integration.",
    visual: "flow",
  },
  {
    id: "runtime-benchmark",
    title: "WSL2 versus Docker",
    year: "2026",
    kind: "Cloud coursework",
    tools: ["WSL2", "Docker", "sysbench"],
    summary:
      "Comparing two development environments through a deliberately small benchmark.",
    detail:
      "Used sysbench as part of cloud-computing coursework to investigate WSL2 and Docker. The useful lesson was to make the environment and workload explicit before drawing a performance conclusion; no benchmark figures are published here without the original report.",
    visual: "compare",
  },
  {
    id: "document-generation",
    title: "Documents as code",
    year: "2026",
    kind: "Practical tooling",
    tools: ["Node.js", "docx"],
    summary:
      "Programmatic document generation for the Grow You Grow Me Foundation’s launch pamphlet.",
    detail:
      "Created the foundation’s April 2026 launch pamphlet with the Node.js docx library. A small example of using code for a concrete publishing task in support of access to education.",
    visual: "document",
  },
] as const;
