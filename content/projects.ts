/** Public editorial content, grounded in the supplied portfolio blueprint.
 * Links and original project media remain intentionally absent until supplied.
 * Architecture figures describe the record; they are not product screenshots.
 */
export interface ContentSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface ProjectDecision {
  title: string;
  choice: string;
  rejected: string;
  cost: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  role: string;
  year: string;
  timeframe: string;
  status: string;
  technologies: string[];
  featured: boolean;
  repository: string | null;
  live: string | null;
  sections: ContentSection[];
  architecture: { nodes: string[]; description: string };
  decisions: ProjectDecision[];
  relatedWriting: string[];
}

export const projects: Project[] = [
  {
    slug: "campusdesk",
    title: "CampusDesk",
    tagline: "Making university document requests visible.",
    summary:
      "A university document request and tracking system built around a simple question: where is my request now? Students can submit requests, staff can move them through defined stages, and the system keeps a record of who changed what. All four role dashboards are wired and tested; I am now planning the CI/CD and deployment pipeline with Docker and AWS.",
    role: "Sole engineer",
    year: "2026",
    timeframe: "2026 — present",
    status: "Active · deployment planning",
    technologies: ["Laravel", "Vue 3", "TypeScript", "MySQL"],
    featured: true,
    repository: "https://github.com/Sama-Mokom/CampusDesk",
    live: null,
    architecture: {
      nodes: [
        "Four role dashboards · Vue 3",
        "Authenticated API · Laravel",
        "Request stages + audit history · MySQL",
        "Queued email",
      ],
      description:
        "Students, staff, department administrators and super administrators use distinct Vue 3 dashboards. An authenticated Laravel API applies role and ownership rules, persists requests and their history in MySQL, and dispatches queued email. This is an explanatory reconstruction of the documented architecture, not a production deployment diagram.",
    },
    decisions: [
      {
        title: "Keep a reopen inside the existing workflow",
        choice:
          "Use a status change to reopen a request, preserving its history and reusing the existing claim and resolve operations.",
        rejected:
          "Regenerating stages introduced schema complexity and foreign-key conflicts with the existing status history. Two proposed designs were discarded before settling on the status-flip approach.",
        cost: "Reusing the workflow still requires careful transition and permission checks. A smaller schema change does not remove the responsibility to test the lifecycle.",
      },
      {
        title: "Make eligibility and claiming one operation",
        choice:
          "Evaluate the relevant existence condition within DB::transaction(), using whereExists and lockForUpdate() in the stage-claim path.",
        rejected:
          "A simpler first fix did not close the gap between checking whether a stage could be claimed and claiming it.",
        cost: "The claim path needs explicit transaction boundaries and concurrency reasoning, beyond the ordinary single-user request flow.",
      },
      {
        title: "Model an actor as a user",
        choice:
          "Point status_histories.changed_by at users.id so both students and staff can be represented as the actor behind a change.",
        rejected:
          "Keeping the reference at staff_profiles.id no longer matched the domain once a student could trigger a history entry.",
        cost: "The relationship and the code that writes history must agree on the same identity model.",
      },
    ],
    sections: [
      {
        id: "context",
        title: "A familiar problem, treated seriously",
        paragraphs: [
          "University document requests can involve physical handoffs with little visibility between them. A student may know that a request was submitted without knowing which stage it has reached or who is responsible for the next step. CampusDesk is my attempt to make that process legible.",
          "I chose to build it as a deliberate learning project. All backend implementation is handwritten against documentation. I use AI for Socratic mentoring, design review before implementation and code review afterwards, rather than for generating the backend code. The point is to understand the decisions well enough to defend them.",
        ],
      },
      {
        id: "problem",
        title: "Where is my request?",
        paragraphs: [
          "For the student, the problem is uncertainty: a request enters a process that is difficult to follow. For staff, the system needs to make responsibility explicit without letting two people take ownership of the same stage. Administrators need a wider view without losing the history of individual actions.",
          "That makes auditability part of the core domain. The current status matters, but so does the sequence of changes that produced it.",
        ],
      },
      {
        id: "users",
        title: "Four roles, one request history",
        paragraphs: [
          "Students submit and follow their document requests. Staff claim and process the stages assigned to them. Department administrators oversee their department, while super administrators have a broader administrative surface. Each role has its own dashboard, connected to the same underlying workflow.",
        ],
      },
      {
        id: "constraints",
        title: "Constraints that shape the work",
        paragraphs: [
          "I am the sole engineer, working alongside university commitments and an industrial attachment. The learning constraint makes implementation slower by design: I review the model, write the code myself, and work through the reasons a first attempt is insufficient.",
          "The system also needs to reflect its local context. Payment integration is still research and planned work; I am considering a Cameroon-focused aggregator for mobile-money processing rather than treating a payment provider chosen for another market as an automatic fit.",
        ],
      },
      {
        id: "my-role",
        title: "What I own",
        paragraphs: [
          "I own the application design and implementation, from the database model and Laravel API to the Vue 3 interfaces. That includes authentication, permissions, state transitions, audit history, queued mail and the four dashboard surfaces.",
          "The project uses PHPUnit, Pest, Vitest and Vue Test Utils, with linting as a quality gate. Student, Staff, Department Admin and Super Admin dashboards are fully wired and tested. Planning the release pipeline is the current phase of the work.",
        ],
      },
      {
        id: "architecture",
        title: "A workflow with an accountable backend",
        paragraphs: [
          "Vue 3, TypeScript and Axios provide the interface. Laravel handles the API using Sanctum bearer-token authentication, Eloquent, Gates and middleware. API Resources shape responses; observers and queued jobs support work around the request lifecycle. MySQL stores the workflow and its history, with Mailtrap used for queued email during development.",
          "The architectural boundary that matters most is the one around a state change. The interface can offer an action, but the backend still has to decide whether the current user may perform it against the current state.",
        ],
      },
      {
        id: "engineering-deep-dive",
        title: "The claim that survived its first fix",
        paragraphs: [
          "A stage-claiming bug exposed a time-of-check/time-of-use race: checking whether a stage was available did not, by itself, make the later claim safe. Two staff actions could compete for the same stage. The first, simpler fix did not fully resolve the problem.",
          "The eventual implementation brought the existence condition into the transaction, using whereExists alongside DB::transaction() and lockForUpdate(). The important shift was to reason about eligibility and mutation together, rather than treating a successful earlier check as a guarantee.",
          "The corrected claim path treats the eligibility condition and the change of ownership as one operation. A single-user walkthrough is not enough to reason about this kind of bug: the competing actions are part of the problem.",
        ],
      },
      {
        id: "hard-problem",
        title: "Reopening was a modelling problem",
        paragraphs: [
          "A request that can be reopened complicates the meaning of completion. I rejected two designs before accepting a status-flip approach that kept the existing stage and audit structure. Regenerating stages would have introduced schema complexity and conflicts with history references.",
          "The same feature exposed a second assumption: history had associated changed_by with a staff profile. Once students could cause changes, that relationship was too narrow. Moving it to users.id made the audit model describe the actor instead of one particular kind of actor.",
        ],
      },
      {
        id: "visual-evidence",
        title: "Reading the architecture",
        paragraphs: [
          "Read the architecture from the role dashboards to the backend: several interfaces reach the same application rules, and state changes meet in one persistence model. Queued email sits alongside that workflow rather than defining whether a request has changed state. The figure is an explanatory reconstruction, not an application screenshot.",
        ],
      },
      {
        id: "outcome",
        title: "Four working role surfaces",
        paragraphs: [
          "All four dashboards are wired and tested, and the project has moved into CI/CD and deployment planning. The work has produced concrete experience with concurrency, ownership rules, history modelling and revising designs after finding their weaknesses.",
          "CampusDesk is not presented here as a deployed university service. There are no adoption figures or processing-time improvements to report yet.",
        ],
      },
      {
        id: "current-state",
        title: "Current state",
        paragraphs: [
          "As of 21 September 2026, CampusDesk is my flagship active project. I am mapping the delivery pipeline around Docker and AWS services. This is also the practical vehicle for developing my cloud and DevOps skills.",
        ],
      },
      {
        id: "retrospective",
        title: "What I would carry forward",
        paragraphs: [
          "I would bring actor identity and transition invariants into the earliest model review. The reopen feature and claim race both showed that a flow can look reasonable in isolation while depending on an assumption that stops being true elsewhere.",
          "Rejecting an implementation before shipping it is useful work. The smaller final design was valuable because it preserved a coherent history and reused existing behaviour, not simply because it required fewer changes.",
        ],
      },
      {
        id: "next-steps",
        title: "What comes next",
        paragraphs: [
          "The next delivery work is the Docker and AWS pipeline. Planned application work includes a mark-as-collected endpoint, in-app notifications and payment integration for document-processing fees. The payment decision remains open while I evaluate local aggregator options.",
        ],
      },
    ],
    relatedWriting: ["a-claim-is-more-than-a-check"],
  },
  {
    slug: "goldstrat",
    title: "GoldStrat / SMC_EA",
    tagline: "Testing the assumptions behind a convincing backtest.",
    summary:
      "A series of correctness and backtesting experiments on MetaTrader 5 trading software. The most useful result was a reason to be sceptical: an eight-year test concentrated its gains in the final two years of a gold bull run. I treat this work as quantitative systems engineering, with no claim of trading expertise or live performance.",
    role: "Correctness engineering and experiments",
    year: "2026",
    timeframe: "Ongoing experiments",
    status: "Active · research",
    technologies: ["MQL5", "MetaTrader 5", "Strategy Tester"],
    featured: true,
    repository: null,
    live: null,
    architecture: {
      nodes: [
        "Market data + strategy conditions",
        "Risk and position sizing",
        "Broker constraints + order submission",
        "Strategy Tester + analysis",
      ],
      description:
        "The conceptual flow separates strategy conditions from position sizing, broker-aware order validation and retrospective testing. It illustrates the areas investigated in the documented Expert Advisors; it is not an exported architecture diagram or a performance chart.",
    },
    decisions: [
      {
        title: "Delegate the money calculation to the broker engine",
        choice:
          "Use OrderCalcProfit() when calculating exposure instead of relying on the manual tick-value formula that produced oversized positions.",
        rejected:
          "The original manual formula produced lot sizes roughly ten times too large. Plausible arithmetic was not enough to validate the underlying assumptions.",
        cost: "Position sizing now explicitly depends on the instrument and broker context represented by the platform.",
      },
      {
        title: "Validate an order before submitting it",
        choice:
          "Respect SYMBOL_TRADE_STOPS_LEVEL and normalise prices to the tick grid, alongside a minimum reward-to-risk distance check.",
        rejected:
          "Sending orders without those broker constraints had produced rejections, while a target-finding function without a minimum distance check created a reward-to-risk imbalance.",
        cost: "A strategy condition can be satisfied while the corresponding order is still invalid or unsuitable. The execution path has to represent that distinction.",
      },
      {
        title: "Question a filter that changes nothing",
        choice:
          "Treat the unchanged H4/M15 alignment results as evidence against the filter's premise and investigate event-based confirmation instead.",
        rejected:
          "Agreement between two timeframe states did not add the independent confirmation it was expected to provide.",
        cost: "The proposed replacement needs its own experiment. A reason to reject one signal is not proof that the next one will work.",
      },
    ],
    sections: [
      {
        id: "context",
        title: "A software investigation",
        paragraphs: [
          "This work started from existing MetaTrader 5 Expert Advisor files and developed through iterative improvement. The systems implement Smart Money Concepts and ICT-style ideas for XAUUSD. My contribution is in the debugging, correctness work and experiments that followed, rather than a claim to have created the original files from scratch.",
          "I am a beginner, non-professional trader with no live trading experience. The interesting question for this portfolio is how software assumptions were tested and corrected.",
        ],
      },
      {
        id: "problem",
        title: "A believable result can still be misleading",
        paragraphs: [
          "An automated strategy has several ways to be wrong before its overall result is interpreted. Position size can be incorrect. An order can violate the broker's constraints. A backtest can look encouraging while depending heavily on one market period.",
          "The engineering problem is to distinguish those layers and gather evidence about each one, instead of letting a final number stand in for the validity of the whole system.",
        ],
      },
      {
        id: "users",
        title: "Who this work is for",
        paragraphs: [
          "These are experimental tools for inspecting strategy behaviour in MetaTrader 5. They are not a public trading service, and this case study does not ask anyone to trade with them. My immediate user is the person trying to understand and verify the software, including myself.",
        ],
      },
      {
        id: "constraints",
        title: "Historical evidence, limited claims",
        paragraphs: [
          "The evidence comes from historical backtests and platform behaviour. It does not establish live execution performance or profitability. The existing strategy implementation and the broker's instrument rules also constrain what can be inferred from a formula or a single run.",
        ],
      },
      {
        id: "my-role",
        title: "My contribution",
        paragraphs: [
          "I investigated position sizing, target selection, order validity and multi-period results. That included replacing a faulty manual calculation, accounting for stop levels and tick-grid requirements, and testing whether an additional timeframe-alignment filter changed the result.",
        ],
      },
      {
        id: "architecture",
        title: "Separate the hypothesis from execution",
        paragraphs: [
          "MQL5 runs the strategy logic and order path inside MetaTrader 5. Strategy Tester supplies the environment for repeated historical tests. The useful conceptual separation is between conditions that propose a trade, sizing and broker rules that constrain it, and analysis that decides what a result actually supports.",
        ],
      },
      {
        id: "engineering-deep-dive",
        title: "The position that was an order of magnitude too large",
        paragraphs: [
          "A position-sizing bug produced lot sizes roughly ten times too large. I traced the problem to a manual tick-value formula. The calculation looked defensible on its own, but its assumptions did not fit the instrument and platform context.",
          "The correction delegated the profit calculation to the broker's own OrderCalcProfit() engine. This was a boundary decision as much as an arithmetic fix: the platform already had information that the manual formula was attempting to approximate.",
          "Related execution work addressed orders rejected because stop-distance constraints were not queried and prices were not normalised to the tick grid. Together, these fixes distinguish a proposed strategy action from an order that the platform can actually evaluate and accept.",
        ],
      },
      {
        id: "hard-problem",
        title: "Eight years did not mean eight years of evidence for an edge",
        paragraphs: [
          "The eight-year backtest concentrated net profit in the final two years of a gold bull run. The preceding six years lost. That finding changed the interpretation of the result: the test pointed to regime dependency rather than establishing a durable edge.",
          "A separate H4-bias/M15-entry alignment filter produced no change in results. State-based agreement was not providing independent confirmation. The absence of an improvement mattered as much as an apparent improvement would have.",
        ],
      },
      {
        id: "visual-evidence",
        title: "Show the reasoning, not an invented equity curve",
        paragraphs: [
          "The diagram separates the strategy's conditions, the sizing calculation, broker constraints and the historical test. Each boundary answers a different question; a valid order does not establish a useful strategy, and a positive aggregate does not explain the period that produced it. Original backtest exports are needed before adding a numerical chart.",
        ],
      },
      {
        id: "outcome",
        title: "Better questions and concrete corrections",
        paragraphs: [
          "The work corrected documented sizing and order-validity problems. It also identified reasons to doubt the apparent strength of the strategy and the usefulness of one proposed filter. Those are engineering outcomes; they are not a financial-performance claim.",
        ],
      },
      {
        id: "current-state",
        title: "Current state",
        paragraphs: [
          "As of 21 September 2026, this remains active experimental work. There is no live trading track record. An event-based change-of-character confirmation is a proposed next experiment, not a validated improvement.",
        ],
      },
      {
        id: "retrospective",
        title: "A result should change the claim",
        paragraphs: [
          "I would separate correctness checks from strategy evaluation earlier. There is little value in interpreting a backtest before understanding whether sizing and execution mean what the code assumes they mean.",
          "The most useful habit from this work is being willing to weaken a claim when the evidence demands it. Finding that a result depends on a particular regime gives the next experiment a clearer purpose.",
        ],
      },
      {
        id: "next-steps",
        title: "The next experiment",
        paragraphs: [
          "Investigate event-based confirmation rather than another state-alignment condition, and continue evaluating results across distinct historical periods. Any improvement still needs evidence of its own.",
        ],
      },
    ],
    relatedWriting: ["when-a-backtest-changes-your-mind"],
  },
  {
    slug: "netinsight",
    title: "NetInsight",
    tagline: "Measuring a network even when it lets you down.",
    summary:
      "A five-person university project collecting mobile-network quality-of-experience data in Cameroon. I owned requirements work and database design, including the survey instrument, an IEEE 830 specification and the offline synchronisation architecture. The central constraint was straightforward: an app that measures poor connectivity must be able to work through it.",
    role: "Requirements and database design · team of five",
    year: "2026",
    timeframe: "University team project",
    status: "Delivered · coursework",
    technologies: ["React Native", "Expo", "Node.js", "MongoDB"],
    featured: true,
    repository: "https://github.com/Sama-Mokom/CEF_440_Group_16",
    live: null,
    architecture: {
      nodes: [
        "Subscriber measurements · Expo",
        "Offline collection + later synchronisation",
        "REST API · Node.js / Express",
        "Measurement records · MongoDB Atlas",
      ],
      description:
        "An Expo mobile application collects subscriber-side measurements. The documented design allows offline collection and subsequent synchronisation through a Node.js/Express REST API to MongoDB Atlas, with Railway used for deployment. This reconstruction does not specify an undocumented conflict-resolution implementation.",
    },
    decisions: [
      {
        title: "Design collection around disconnection",
        choice:
          "Make offline collection and later synchronisation part of the architecture.",
        rejected:
          "Requiring a connection for every measurement would make the tool least useful under the poor network conditions it exists to observe.",
        cost: "Collection and submission become separate concerns, so the design must account for measurements that have not yet reached the server.",
      },
      {
        title: "Model the measurement record explicitly",
        choice:
          "Use MongoDB schemas for the heterogeneous measurement records and document the REST endpoint contracts.",
        rejected:
          "The project design selected MongoDB over a relational store for this measurement model.",
        cost: "The data model still needs clear field definitions and validation. Choosing a document database does not remove those responsibilities.",
      },
      {
        title: "Use managed deployment services",
        choice:
          "Design around Railway and MongoDB Atlas for the student project's deployment.",
        rejected:
          "In retrospect, a self-managed alternative would have shifted more of a student project's effort toward operating infrastructure.",
        cost: "The deployment design depends on the capabilities and constraints of those services.",
      },
    ],
    sections: [
      {
        id: "context",
        title: "Start from the subscriber's experience",
        paragraphs: [
          "NetInsight was a mobile application development project completed by a team of five. It addressed the lack of accessible subscriber-side evidence about mobile network quality in Cameroon: people experience degradation, but those experiences are difficult to compare without a consistent way to collect them.",
        ],
      },
      {
        id: "problem",
        title: "The worst connection is still worth measuring",
        paragraphs: [
          "A subscriber needs to contribute useful measurements without assuming reliable connectivity. The data includes signal strength, latency, jitter, packet loss and GPS position. Those fields need a defined meaning and a consistent record before they can support analysis.",
          "The hardest condition is also the most relevant one: poor connectivity must not prevent the application from collecting evidence about poor connectivity.",
        ],
      },
      {
        id: "users",
        title: "Subscribers and the people reading their data",
        paragraphs: [
          "The primary users are Cameroonian mobile subscribers collecting observations. The resulting records also need to be understandable to the people examining network quality. My requirements work connected the subscriber-facing collection process to the structure needed downstream.",
        ],
      },
      {
        id: "constraints",
        title: "A team project in an unreliable network environment",
        paragraphs: [
          "The project had a five-person team and a university course scope. Intermittent connectivity was a domain constraint, not an exceptional case to add later. The architecture also needed to remain practical within a student deployment budget.",
        ],
      },
      {
        id: "my-role",
        title: "The work I can claim precisely",
        paragraphs: [
          "I owned Task 2: requirements gathering, the survey instrument and the IEEE 830 software requirements specification. I also owned Task 6: database design, including MongoDB schemas, REST endpoint design, offline synchronisation architecture and deployment design.",
          "This is a team project. I do not claim sole authorship of the mobile application or every part of the backend. My contribution centred on making the requirements and system model explicit enough to guide implementation.",
        ],
      },
      {
        id: "architecture",
        title: "Collection and synchronisation have different jobs",
        paragraphs: [
          "The stack uses React Native with Expo, Node.js and Express, and MongoDB Atlas, with Railway for deployment. The architecture separates local collection from sending measurements through the API, allowing the design to account for periods without a usable connection.",
          "The modelling work includes context, level-1 data-flow, use-case, sequence, class and deployment diagrams. Each describes a different boundary: the system's surroundings, the movement of data, the user's actions or the relationships between components.",
        ],
      },
      {
        id: "engineering-deep-dive",
        title: "Make an offline requirement concrete",
        paragraphs: [
          "Saying that an application works offline is not enough to guide a team. The measurement model and API design need to distinguish collection from synchronisation. A record can exist on the device before the server has received it, and the documented architecture must make room for that state.",
          "My work connected this requirement to the database and endpoint design. The key design distinction is between a measurement being collected and that measurement being received by the server. This case study describes the architecture; it does not claim a particular conflict-resolution protocol.",
        ],
      },
      {
        id: "hard-problem",
        title: "An always-connected assumption would defeat the purpose",
        paragraphs: [
          "The hard problem was a contradiction in the operating context: the tool needs the network to report on the network, yet its most valuable observations may happen when that network is degraded. An always-connected collection flow would miss the point of the project.",
          "Offline-first synchronisation was the architectural response. It required treating unavailable connectivity as an expected state, rather than only as an error screen.",
        ],
      },
      {
        id: "visual-evidence",
        title: "A reconstruction of the documented flow",
        paragraphs: [
          "The figure places offline collection before the API boundary. That ordering is the important part: gathering an observation and delivering it are separate steps, and an interruption between them is expected. This is a reconstruction of the documented architecture; the original SRS and modelling diagrams are not reproduced here.",
        ],
      },
      {
        id: "outcome",
        title: "A delivered team project with a defined model",
        paragraphs: [
          "NetInsight was delivered as a university project. My recorded outputs are the requirements and survey work, an IEEE 830 specification, and the database, endpoint, offline-sync and deployment designs. No adoption figures or measured network-quality findings are claimed here.",
        ],
      },
      {
        id: "current-state",
        title: "Current state",
        paragraphs: [
          "As of 21 September 2026, NetInsight is a delivered university team project. The case study focuses on the requirements and architecture work I owned.",
        ],
      },
      {
        id: "retrospective",
        title: "The environment belongs in the first design conversation",
        paragraphs: [
          "This project reinforced why requirements work matters. The local operating environment changes the architecture before a screen is drawn or an endpoint is implemented.",
          "I would make the boundaries between collected, pending and submitted data especially visible in a future handoff. A clear model gives the team a shared vocabulary for what the application can guarantee at each stage.",
        ],
      },
    ],
    relatedWriting: [],
  },
  {
    slug: "cameroon-music-industry-platform",
    title: "Cameroon Music Industry Platform",
    tagline: "A first hackathon, an ambitious domain, a bounded MVP.",
    summary:
      "A halted MVP for CIMFEST Hackathon 2025, built around the needs of Cameroonian artists, fans and promoters. It was my first hackathon: a 72-hour event hosted by CIMFEST in partnership with NervTek, where our team ranked 11th out of 21. Development stopped after the foundational architecture and authentication milestones.",
    role: "Hackathon team contributor",
    year: "2025",
    timeframe: "November 2025 · 72-hour hackathon",
    status: "Halted · hackathon MVP",
    technologies: [
      "Next.js 14",
      "TypeScript",
      "NestJS",
      "Prisma",
      "PostgreSQL",
    ],
    featured: false,
    repository: "https://github.com/Sama-Mokom/cameroon-music-platform",
    live: null,
    architecture: {
      nodes: [
        "Artists, fans + promoters · Next.js",
        "Authentication + role boundaries · NestJS",
        "Data model · Prisma / PostgreSQL",
        "Local services · Docker Compose",
      ],
      description:
        "The MVP separates a Next.js interface from a NestJS backend, uses Prisma with PostgreSQL, and sets up local services through Docker Compose, with Redis included in the project stack. The diagram describes the foundation; it does not imply that the planned booking, wallet or tipping features were completed.",
    },
    decisions: [
      {
        title: "A foundation before the wider product",
        choice:
          "The completed milestones cover foundational architecture and authentication for the multi-sided platform.",
        rejected:
          "Looking back, attempting the full booking, wallet and tipping scope within the event would have been a much larger deliverable.",
        cost: "The result is a bounded foundation rather than a finished service for artists, fans and promoters.",
      },
      {
        title: "Keep setup work part of the deliverable",
        choice:
          "The project includes Docker Compose, an automated setup script, health-check endpoints and setup documentation.",
        rejected:
          "In retrospect, leaving setup implicit would make the foundation harder for another person to run.",
        cost: "Developer-experience work uses some of a short event's limited time, even when it is less visible than an additional screen.",
      },
    ],
    sections: [
      {
        id: "context",
        title: "My first hackathon",
        paragraphs: [
          "CIMFEST Hackathon 2025 ran for 72 hours in November 2025, hosted by CIMFEST in partnership with NervTek. It was my first hackathon, and our team placed 11th out of 21 teams.",
          "Our MVP explored digital infrastructure connecting artists, fans and promoters in Cameroon's music ecosystem. That is the context for the project's ambition and also for its limits.",
        ],
      },
      {
        id: "problem",
        title: "Three sides of a music platform",
        paragraphs: [
          "The product idea brought together people with different needs and permissions. An artist's account should not be treated as interchangeable with a fan's or a promoter's. The first engineering problem was establishing those identities and boundaries before expanding the product surface.",
          "Bookings, wallets and tipping belonged to the broader concept. They are described here as planned scope, not as evidence of a completed product.",
        ],
      },
      {
        id: "users",
        title: "Artists, fans and promoters",
        paragraphs: [
          "Artists form the creative side of the platform, fans the audience side, and promoters the event and booking side. Their different roles motivate the account and permission model. No live user adoption is claimed for this MVP.",
        ],
      },
      {
        id: "constraints",
        title: "Seventy-two hours and a new environment",
        paragraphs: [
          "The event deadline constrained how much of the domain could become working software. It was also my first hackathon, and the NestJS work represents exploratory experience rather than a primary backend strength.",
          "The project ended after Milestones 1 and 2: foundational architecture and authentication. That boundary is more useful to a reader than a feature list that blurs completed work with ambition.",
        ],
      },
      {
        id: "my-role",
        title: "My place in the team",
        paragraphs: [
          "I contributed to the MVP as part of the hackathon team. This account describes the shared foundation we built and the learning I took from my first event; it does not assign every subsystem to me.",
        ],
      },
      {
        id: "architecture",
        title: "A separated foundation",
        paragraphs: [
          "The stack paired Next.js 14 and TypeScript with a NestJS backend, Prisma and PostgreSQL. Redis and Docker Compose supported the local service environment. Tailwind, ESLint and Prettier were also part of the setup.",
          "The foundation includes JWT authentication, role-based access boundaries, backend health checks, CORS configuration, an automated setup script and setup documentation. Those elements made the system's structure and local setup explicit under time pressure.",
        ],
      },
      {
        id: "engineering-deep-dive",
        title: "Make the foundation understandable",
        paragraphs: [
          "A multi-service foundation creates practical questions immediately: how does a teammate bring the services up, how do they know the backend is responding, and where are the account boundaries? Docker Compose, setup documentation and health endpoints gave those questions a place in the deliverable.",
          "The lesson I take from that foundation is that setup is part of the handoff. A service boundary is easier to inspect when the next person can understand how the environment starts and how its health is checked.",
        ],
      },
      {
        id: "hard-problem",
        title: "The product idea was larger than the finished MVP",
        paragraphs: [
          "The hard boundary was scope. Connecting three sides of an industry is a larger undertaking than foundational architecture and authentication. Development halted after those two milestones rather than continuing into an active product.",
          "The useful retrospective is to distinguish a promising model from completed delivery. The hackathon result records participation and team ranking; it does not establish product adoption or validate the full business idea.",
        ],
      },
      {
        id: "visual-evidence",
        title: "A diagram of the foundation",
        paragraphs: [
          "The figure shows the boundary between the Next.js interface and the NestJS authentication layer, with Prisma and PostgreSQL behind it. It deliberately stops at the foundation: bookings, wallets and tipping are outside the completed milestone scope. This is an explanatory diagram of the halted MVP.",
        ],
      },
      {
        id: "outcome",
        title: "A first event and two completed milestones",
        paragraphs: [
          "The team ranked 11th out of 21 at my first hackathon. The software outcome is foundational architecture and authentication, with setup and developer-experience work alongside them. The project did not progress into a live music service.",
        ],
      },
      {
        id: "current-state",
        title: "Current state",
        paragraphs: [
          "As of 21 September 2026, development is halted. This is a completed chapter in my learning journey, not an active product or an announced relaunch.",
        ],
      },
      {
        id: "retrospective",
        title: "Keep the next scope easier to demonstrate",
        paragraphs: [
          "I would make the distinction between the long-term platform and the event's deliverable explicit earlier. A smaller demonstrable workflow is easier to evaluate honestly than a broad list of planned features.",
          "I would keep the attention to setup and documentation. Even under a deadline, understanding how another person will run the project is part of building it.",
        ],
      },
    ],
    relatedWriting: [],
  },
  {
    slug: "educlynk",
    title: "EducLynk",
    tagline: "Small, reviewed changes in a platform people use.",
    summary:
      "My contribution to a tutor-finding platform at Njomi Tech Solutions: filter state, server-side search, pagination, responsive layouts and an authentication configuration issue. The work happened through issues and pull requests reviewed by the team. My onboarding contributions helped improve user-onboarding speed by 30%.",
    role: "Junior developer · team contribution",
    year: "2026",
    timeframe: "Approximately six months · ended March 2026",
    status: "Contribution ended",
    technologies: ["React", "TypeScript", "Laravel", "Tailwind CSS"],
    featured: false,
    repository: null,
    live: null,
    architecture: {
      nodes: [
        "Tutor-search interface · React / TypeScript",
        "Filters, search + pagination",
        "Application API · Laravel",
        "Authentication configuration",
      ],
      description:
        "This contribution map shows the documented React/TypeScript interface and Laravel API, highlighting the search, state and authentication boundaries where I worked. It is not a complete proprietary architecture diagram and contains no private configuration values.",
    },
    decisions: [
      {
        title: "Use the actual previous state",
        choice:
          "Correct a pagination stale-closure bug with functional state updates.",
        rejected:
          "A callback's captured state could be older than the state the next update needed to build on.",
        cost: "The fix requires reasoning about update timing, not only replacing the value shown on screen.",
      },
      {
        title: "Search at the data boundary",
        choice:
          "Implement server-side search in the SearchableSelect component.",
        rejected:
          "In retrospect, a client-only alternative would be limited to the option set already available in the interface.",
        cost: "The interface and API need a clear agreement about query state and the options returned.",
      },
      {
        title: "Trace authentication across the interface and configuration",
        choice:
          "Diagnose the Laravel Passport issue at the authentication configuration boundary.",
        rejected:
          "Treating the visible failure as only a frontend problem would leave the incorrect OAuth client configuration unresolved.",
        cost: "Investigation needs to cross the frontend/backend boundary while keeping sensitive configuration private.",
      },
    ],
    sections: [
      {
        id: "context",
        title: "Working in an existing product",
        paragraphs: [
          "I worked remotely as a junior developer at Njomi Tech Solutions for approximately six months, ending in March 2026. EducLynk is a tutor-finding platform with a React and TypeScript frontend against a Laravel backend.",
          "This is a contribution study. I joined an existing codebase and worked through issues and pull requests for team review. The result belongs to the wider team's product, while the changes described here identify my own scope.",
        ],
      },
      {
        id: "problem",
        title: "The friction between a user and the next step",
        paragraphs: [
          "Search controls, filters and pagination are ordinary parts of a product until their state becomes confusing. A filter label that is not readable or a pagination update based on stale state can make it harder for someone to find the tutor they need.",
          "My work focused on those concrete interaction problems, alongside responsive corrections and an authentication configuration issue.",
        ],
      },
      {
        id: "users",
        title: "People finding tutors",
        paragraphs: [
          "The relevant users were people searching the platform and moving through onboarding, including students looking for tutors. The work also had to remain understandable to the developers reviewing and maintaining the existing application.",
        ],
      },
      {
        id: "constraints",
        title: "Change a part without claiming the whole",
        paragraphs: [
          "The application already had its own frontend/backend boundaries and team review process. Changes needed to fit that codebase and remain understandable to the people maintaining it. The job was to identify a specific problem, make a focused change and bring it through review.",
        ],
      },
      {
        id: "my-role",
        title: "The changes I made",
        paragraphs: [
          "Recorded contributions include stale-state and human-readable filter-chip fixes in ResidenceFilter, server-side search in SearchableSelect, a pagination stale-closure correction using functional state updates, Laravel Passport OAuth configuration diagnosis, and Tailwind responsive corrections.",
          "The February–March 2026 work was submitted through GitHub issues and pull requests for review. That experience made debugging part of a shared maintenance process rather than an isolated exercise.",
        ],
      },
      {
        id: "architecture",
        title: "Two sides of a user-visible bug",
        paragraphs: [
          "The interface uses React and TypeScript; Laravel provides the backend. Some fixes stayed in the interface's state model, while server-side search and authentication investigation required following behaviour across the API boundary.",
          "The architecture figure is deliberately a contribution map. It shows where the documented work happened, without inventing a complete system design or disclosing private infrastructure.",
        ],
      },
      {
        id: "engineering-deep-dive",
        title: "Pagination and the state a callback remembers",
        paragraphs: [
          "The pagination bug came from a stale closure. An update was using state captured earlier rather than the current state the next change should depend on. The correction used a functional state update, allowing the next value to be derived from the previous value supplied to the updater.",
          "The lesson is about timing: the code can be locally readable and still make an incorrect assumption about when a value was captured. Describing that assumption clearly makes the correction easier for another developer to review.",
        ],
      },
      {
        id: "hard-problem",
        title: "A frontend symptom with a configuration cause",
        paragraphs: [
          "An authentication failure required tracing the problem beyond the visible interface. The eventual cause was an incorrect Laravel Passport OAuth client configuration. Identifying the boundary responsible for the failure was more useful than continuing to adjust the frontend around it.",
          "What mattered was following the request far enough to distinguish an interface bug from a configuration problem. The place a failure becomes visible is not necessarily the place that caused it.",
        ],
      },
      {
        id: "visual-evidence",
        title: "A public contribution map",
        paragraphs: [
          "The contribution map connects tutor-search controls to interface state and the Laravel API. Search and pagination make the boundary visible in everyday interaction; the authentication issue required looking beyond that visible surface. The figure explains my work areas rather than depicting the platform's complete internal architecture.",
        ],
      },
      {
        id: "outcome",
        title: "A verified onboarding improvement",
        paragraphs: [
          "The onboarding changes I contributed to helped improve user-onboarding speed by 30%. This is a team product outcome, not a claim that I alone created the improvement or built the platform.",
          "The experience also gave me sustained practice with a real codebase, user-facing bugs and reviewed changes.",
        ],
      },
      {
        id: "current-state",
        title: "Current state",
        paragraphs: [
          "My contribution ended in March 2026. This case study records that period of work and does not imply an ongoing role or responsibility for the platform's present state.",
        ],
      },
      {
        id: "retrospective",
        title: "Make the assumption visible",
        paragraphs: [
          "I would describe the timing and boundary assumptions alongside a fix as explicitly as the code change itself. A functional update is easier to review when the stale value it replaces is clearly identified; an authentication correction is easier to trust when the investigation explains which side of the boundary was responsible.",
          "Working in an existing product taught me to value precise contributions. A small, well-understood change can remove real friction without needing to be presented as a complete rebuild.",
        ],
      },
    ],
    relatedWriting: [],
  },
];
