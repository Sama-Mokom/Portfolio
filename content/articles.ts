import type { ContentSection } from "./projects";

export interface Article {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  sections: ContentSection[];
  relatedWork: string[];
  relatedPosts: string[];
  code?: { label: string; language: string; value: string };
  diagram?: { steps: string[]; caption: string };
}

/** Newly authored notes derived from the supplied work record.
 * Dates represent these portfolio notes, not an invented earlier publication.
 * The optional sequence is explicitly illustrative, never claimed as repository code.
 */
export const articles: Article[] = [
  {
    slug: "from-ci-cd-theory-to-a-working-aws-deployment-pipeline",
    title: "From CI/CD theory to a working AWS deployment pipeline",
    summary:
      "How CampusDesk moved from local Docker containers to immutable images, controlled AWS deployments and tested off-site recovery—and what building the pipeline taught me that tutorials could not.",
    date: "2026-10-08",
    tags: ["ci-cd", "docker", "aws", "github-actions"],
    relatedWork: ["campusdesk"],
    relatedPosts: ["a-claim-is-more-than-a-check"],
    diagram: {
      steps: [
        "Test changes in GitHub Actions",
        "Publish immutable images to Amazon ECR",
        "Approve a commit for staging",
        "Deploy exact image digests to Amazon EC2",
        "Run health and API checks",
      ],
      caption:
        "The controlled path from a tested commit to the private CampusDesk staging environment.",
    },
    sections: [
      {
        id: "from-theory-to-practice",
        title:
          "Understanding the terms was not the same as building the system",
        paragraphs: [
          "I had always understood what continuous integration and continuous delivery meant in theory, but I had little hands-on experience with them. I knew what a Dockerfile was, for example, without ever having written one myself.",
          "Most of that understanding came from documentation and short explanations of virtual machines, containerization, images and containers. Fireship videos such as Docker in 100 Seconds and 100+ Docker Concepts You Need to Know helped give me the vocabulary. At least, I thought I understood the ideas—until it was time to implement them myself.",
          "CampusDesk would eventually need to leave my computer and become available to other users. That made it the right opportunity to turn the theory into practical experience.",
        ],
      },
      {
        id: "containerizing-campusdesk",
        title: "Containerizing CampusDesk",
        paragraphs: [
          "My first step was to package the application and its dependencies into consistent, portable containers. CampusDesk now runs as four primary services: a frontend that serves the interface, a backend that handles the application logic and API, a worker that processes background tasks, and a MySQL database that stores the application data.",
          "The backend and worker are separate containers that use the same custom backend image and run different processes. The frontend has its own custom image, while the database uses the official MySQL image.",
          "Getting the services to communicate correctly exposed problems involving networking, file permissions, startup order, data persistence and container shutdown behaviour. Eventually, the complete application was running locally through Docker Compose. That was a major milestone, but it also raised an obvious question: was the application going to remain on my computer, running through Docker Desktop forever?",
        ],
      },
      {
        id: "moving-to-aws",
        title: "Moving to AWS",
        paragraphs: [
          "To make CampusDesk available outside my computer, I needed a server that could remain online and run the application. I considered Microsoft Azure and Google Cloud, but AWS was the provider with which I had the most experience. I had attended several AWS events and knew people with practical AWS experience whom I could approach for guidance, so AWS was the most sensible choice for this project.",
          "I decided to run CampusDesk on an Amazon EC2 instance—essentially a virtual computer hosted in AWS. The application is now running in a private staging environment on that instance.",
          "It is not publicly accessible yet. Access is deliberately restricted through an SSH tunnel while I complete the remaining security work.",
        ],
      },
      {
        id: "continuous-integration",
        title: "Building the continuous integration pipeline",
        paragraphs: [
          "Before deploying new versions, I needed a consistent way to check that they were suitable release candidates. This is where GitHub Actions and the continuous integration part of the pipeline came in. The CI workflow runs whenever code is pushed to the development branch or a pull request targets that branch.",
          "For the backend, it installs the PHP dependencies and runs the PHPUnit test suite. For the frontend, it installs the Node.js dependencies, checks the code style, validates the TypeScript types, runs the tests and confirms that the production build succeeds. It also validates the staging Docker Compose configuration.",
          "These checks do not guarantee that the application has no bugs or is production-ready. They do provide an automatic quality gate that catches many problems before a change progresses further.",
        ],
      },
      {
        id: "immutable-images",
        title: "Building an identifiable release once",
        paragraphs: [
          "Pull requests confirm that the backend and frontend Docker images can be built successfully. When changes are pushed to development and all checks pass, GitHub Actions builds the two custom images and publishes them to Amazon Elastic Container Registry, or ECR.",
          "I considered Docker Hub, but ECR was a natural fit because the application was already being hosted on AWS and the registry integrates with AWS identity and access controls. Each image is tagged with the full Git commit SHA, a unique identifier for that exact version of the code. The ECR repositories use immutable tags, so an existing release tag cannot later be replaced with different contents.",
          "GitHub authenticates with AWS using short-lived credentials through OpenID Connect. I therefore do not need to store permanent AWS access keys in GitHub.",
        ],
      },
      {
        id: "controlled-delivery",
        title: "From manual deployments to controlled delivery",
        paragraphs: [
          "Initially, deploying a new version meant connecting to the EC2 instance through SSH, pulling the images and starting the containers manually. It worked, but it was repetitive, slow and easy to get wrong. That experience led me to build the continuous delivery part of the pipeline.",
          "The deployment workflow is intentionally not triggered by every push. I start it manually, provide the full commit SHA I want to deploy and approve the deployment through a protected GitHub environment. The workflow verifies that the selected commit belongs to the development branch and that both corresponding images exist in ECR. It then resolves those images to their exact digests—their unique content identities—and sends a restricted deployment command to the EC2 instance through AWS Systems Manager.",
          "A fixed deployment script on the server pulls the exact images, runs database migrations, recreates the required application containers and performs health and API checks. The workflow waits for the command to finish and reports whether the deployment succeeded.",
          "The images are not rebuilt on EC2. GitHub Actions builds them once, ECR stores them, and the server pulls them. This makes deployments more predictable because the version tested and published by CI is the same version that runs in staging.",
          "This is continuous delivery rather than fully automatic continuous deployment. Releasing a version still requires a deliberate human decision, but everything after that decision follows a controlled and repeatable process.",
        ],
      },
      {
        id: "protecting-persistent-data",
        title: "Protecting persistent data",
        paragraphs: [
          "CampusDesk currently runs on a single EC2 instance. That keeps the project affordable, but it also makes the instance a single point of failure. The database and uploaded attachments contain information that cannot be recreated by rebuilding a container, so I added an off-site recovery system for both.",
          "CampusDesk creates a recovery set twice a day containing a database backup, the uploaded attachments, integrity checks and references to the exact container images that were running at the time. These recovery sets are encrypted and stored in a private, versioned Amazon S3 bucket.",
          "A monitoring process checks the freshness of the latest successful backup every 15 minutes. I have also completed an isolated restore test, confirming that the database, attachments and application image can be recovered without modifying the live staging data.",
          "This is not automatic failover or high availability. If the server failed, recovery would still require a controlled manual process. Nevertheless, it is a significant improvement over keeping the only copy of the data on one virtual server.",
        ],
      },
      {
        id: "what-comes-next",
        title: "What comes next",
        paragraphs: [
          "CampusDesk now has a working CI and controlled delivery pipeline. A code change can be tested, built into immutable images, stored in ECR and deployed to EC2 through a repeatable workflow.",
          "The application is still private. Before exposing it to the public, I need to remove or replace the shared demonstration credentials, establish a stable address and DNS configuration, add HTTPS, review which network ports are exposed and complete another security-focused test.",
          "CampusDesk is not yet a highly available production system, but it has moved far beyond an application that runs only on my laptop. I now have practical experience with the engineering decisions behind containerization, continuous integration, controlled delivery, cloud deployment and disaster recovery.",
        ],
      },
      {
        id: "the-real-value",
        title: "The learning happened in the failures",
        paragraphs: [
          "Understanding CI/CD in theory is very different from building a real pipeline. Diagrams and short tutorials gave me the vocabulary, but the actual learning happened while diagnosing failed builds, correcting permissions, configuring cloud roles, designing safe deployment boundaries and testing whether the system could recover from failure.",
          "That has been the real value of building this pipeline.",
        ],
      },
    ],
  },
  {
    slug: "a-claim-is-more-than-a-check",
    title: "A claim is more than a check",
    summary:
      "A CampusDesk stage-claim race survived its first fix. What changed when I treated eligibility, ownership and history as one design problem.",
    date: "2026-09-21",
    tags: ["laravel", "concurrency", "architecture"],
    relatedWork: ["campusdesk"],
    relatedPosts: [],
    code: {
      label: "Illustrative sequence · not CampusDesk source code",
      language: "text",
      value:
        "Begin transaction\n  Evaluate the stage's eligibility in the claim path\n  Apply the documented existence condition and locking\n  Change ownership only if the conditions still hold\nComplete transaction\n\nThe exact query and lock scope belong to the implementation.",
    },
    diagram: {
      steps: [
        "Check eligibility",
        "Claim within a transaction",
        "Preserve ownership history",
      ],
      caption: "An explanatory view of the reasoning described in this note.",
    },
    sections: [
      {
        id: "the-visible-action",
        title: "One button, two different questions",
        paragraphs: [
          "In CampusDesk, staff can claim a stage of a university document request. The visible action is small: choose the work and take responsibility for it. Underneath, the application has to answer two questions. Is this stage available to this person, and can that person become its owner now?",
          "Those questions look almost identical in a single-user walkthrough. They stop being interchangeable when two actions compete. A check that was true earlier does not, on its own, guarantee that the later mutation is still allowed.",
          "The project exposed a time-of-check/time-of-use race in this path. A simpler first fix proved insufficient. That failure was useful because it forced the discussion away from the button and toward the boundary around the operation.",
        ],
      },
      {
        id: "the-boundary",
        title: "Move the reasoning to the transaction",
        paragraphs: [
          "The recorded correction uses whereExists inside DB::transaction(), together with lockForUpdate(), in the stage-claiming path. What matters in this account is the design change: the relevant eligibility condition is evaluated within the operation that changes the state, rather than being treated as a guarantee supplied by an earlier check.",
          "It would be misleading to reduce this to a universal recipe that says to add a lock anywhere and call the race solved. The actual query, the rows involved and the point where conditions are evaluated are part of the implementation. Those details determine whether the code enforces the rule it intends to enforce.",
          "The sequence shown with this note is therefore explanatory pseudocode, not an extract from the CampusDesk repository. The supplied work record documents the resolved approach, but it does not include the original implementation or a concurrent request trace that I can publish here.",
        ],
      },
      {
        id: "history",
        title: "Ownership is not the only invariant",
        paragraphs: [
          "The claim race sits alongside another CampusDesk design problem: reopening requests. A reopen needs to change what can happen next while preserving an intelligible account of what happened before. Simply making the interface show an earlier status is not the full requirement.",
          "I rejected two proposed reopen designs before accepting a status-flip approach. Regenerating stages would have introduced schema complexity and foreign-key conflicts with status history. Reusing the existing claim and resolve infrastructure kept the workflow closer to one coherent model.",
          "That choice was not free. Existing operations still had to make sense when a request could return to work after being considered complete. Reuse reduces duplication; it does not remove the need to reason about transitions and permissions.",
        ],
      },
      {
        id: "actor-model",
        title: "A history entry needs the right kind of actor",
        paragraphs: [
          "The reopen work also revealed that status_histories.changed_by had been associated with staff_profiles.id. Once a student could trigger a history entry, the relationship no longer represented every valid actor. It described a staff member where the domain needed a user.",
          "Moving the reference to users.id corrected that mismatch. This is the kind of schema change that can look minor in a diff while reflecting an important change in understanding. The model was learning that a state change and a staff action were not the same category.",
          "The broader lesson connects back to claiming: make the rule explicit. Who may act, which state permits the action, and whose identity is recorded afterwards are related questions. They should not be left as separate assumptions scattered between an interface and a database.",
        ],
      },
      {
        id: "verification",
        title: "What the evidence supports",
        paragraphs: [
          "CampusDesk's four role dashboards are wired and tested, and the project is now in Docker and AWS deployment planning. The claim-path correction and the history-model change are documented engineering outcomes. They are not a production reliability metric, and I do not have a deployment adoption claim to attach to them.",
          "A future publication of the original source and a reproducible concurrency trace would make this account easier to inspect. Until then, the useful public contribution is the reasoning and its limits: the first fix failed, the transaction boundary mattered, and the actor model changed when the workflow grew.",
        ],
      },
      {
        id: "carry-forward",
        title: "What I want to notice earlier",
        paragraphs: [
          "For the next feature, I want to write down the invariants before arguing about the implementation. A stage has an ownership rule. A history entry has an actor. A reopened request still has a past. Naming those constraints makes it easier to compare designs on something more concrete than how small the change appears.",
          "I also want to keep the unsuccessful approaches in the engineering record. A failed first fix is evidence about the problem. Two rejected designs are evidence about the eventual decision. Removing them from the story makes the work look simpler while making it less useful to learn from.",
        ],
      },
    ],
  },
  {
    slug: "when-a-backtest-changes-your-mind",
    title: "When a backtest changes your mind",
    summary:
      "Eight years of results did not establish eight years of an edge. A note on correctness, regime dependency and experiments that refuse to support the original idea.",
    date: "2026-09-21",
    tags: ["testing", "mql5", "experiments"],
    relatedWork: ["goldstrat"],
    relatedPosts: [],
    diagram: {
      steps: [
        "Verify the calculation",
        "Inspect results by period",
        "Reconsider the claim",
      ],
      caption: "An explanatory view of the reasoning described in this note.",
    },
    sections: [
      {
        id: "question",
        title: "A long test is not the same as a strong conclusion",
        paragraphs: [
          "The most useful finding in my GoldStrat / SMC_EA work was not a better-looking result. An eight-year backtest showed net profit concentrated in the final two years of a gold bull run. The preceding six years lost. The overall result concealed a much less convincing distribution through time.",
          "That changed the claim the experiment could support. I could describe behaviour that benefited from a particular regime. I could not responsibly treat the aggregate as evidence of a durable edge.",
          "This is software experimentation, not a claim of trading expertise. I am a beginner, non-professional trader with no live trading experience. The part worth discussing here is what happens when a test gives you a reason to revise the idea you brought to it.",
        ],
      },
      {
        id: "correctness-first",
        title: "First, check what the software is actually doing",
        paragraphs: [
          "Before interpreting a strategy, I had to investigate errors in the machinery executing it. A position-sizing bug produced lot sizes roughly ten times too large. Its source was a manual tick-value formula that appeared reasonable but relied on assumptions that did not fit the platform context.",
          "The fix delegated the calculation to the broker's OrderCalcProfit() engine. Other execution work accounted for SYMBOL_TRADE_STOPS_LEVEL and normalised prices to the tick grid after orders had been rejected. A target-finding function also needed a minimum-distance check to address a reward-to-risk imbalance.",
          "These are different problems from deciding whether a strategy has an edge. Correcting them does not prove the strategy. It makes the behaviour under investigation closer to the behaviour the code was intended to produce.",
        ],
      },
      {
        id: "distribution",
        title: "Ask where the result came from",
        paragraphs: [
          "An eight-year total can invite confidence simply because eight years sounds substantial. But the duration alone says little about how the result is distributed. In this case, the contrast between six losing years and the final two profitable years was more informative than the combined outcome.",
          "I read that as regime dependency. The software appeared to benefit from the gold bull run rather than demonstrate the general claim I had hoped to investigate. That is a narrower conclusion, and it gives the next experiment a more specific question.",
          "The original backtest exports have not been supplied for this portfolio. I am not reconstructing an equity curve or inventing the missing year-by-year values. The finding is recorded; the detailed chart should wait for its underlying data.",
        ],
      },
      {
        id: "unchanged-filter",
        title: "A filter that changed nothing",
        paragraphs: [
          "A separate experiment aligned H4 bias with M15 entries. The expectation was that agreement across the two timeframes would provide additional confirmation. It produced no change in results.",
          "The useful response was to question what the filter actually measured. State-based agreement was not supplying the independent confirmation it was meant to represent. More conditions in the code had not necessarily produced more information.",
          "That observation points toward investigating an event-based trigger, including the proposed change-of-character confirmation, rather than simply stacking another state condition on top. It remains a proposal. The failure of one approach is not evidence that its replacement will succeed.",
        ],
      },
      {
        id: "engineering-habit",
        title: "Keep three claims separate",
        paragraphs: [
          "I now find it useful to distinguish what the software does, what the historical experiment shows, and what I am tempted to conclude from it. A sizing correction belongs to the first. Concentration in a market period belongs to the second. An assertion about a durable edge belongs to the third and needs evidence the earlier two do not automatically provide.",
          "That distinction travels beyond trading software. A benchmark may measure an environment rather than a general performance claim. An additional validation step may repeat information already present. A successful path may say little about concurrent behaviour. The discipline is to keep the claim proportional to what was actually observed.",
          "The work is still active, but I am more interested in making the next question precise than in defending the original idea. An experiment earns its place when it can change my mind.",
        ],
      },
    ],
  },
];
