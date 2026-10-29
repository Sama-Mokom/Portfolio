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

/** Newly authored notes derived from the supplied work record and technical audit.
 * Dates represent portfolio publication dates, not invented earlier releases.
 * The optional sequence is explicitly illustrative, never claimed as repository code.
 */
export const articles: Article[] = [
  {
    slug: "when-a-gateway-lacks-idempotency",
    title:
      "When a Gateway Lacks Idempotency: Avoiding Double Payments on CampusDesk",
    summary:
      "An unresponsive student portal and an impulsive second click can turn a 1,000 XAF fee into a 2,000 XAF double charge. How observing failures on University of Buea's GoStudent platform shaped my approach to payment idempotency for CampusDesk.",
    date: "2026-10-29",
    tags: ["campusdesk", "payments", "idempotency", "architecture"],
    relatedWork: ["campusdesk"],
    relatedPosts: [
      "building-campusdesk-beyond-crud",
      "why-i-built-campusdesk",
      "a-claim-is-more-than-a-check",
    ],
    diagram: {
      steps: [
        "Concurrent traffic spike overwhelms the portal during result release",
        "Delayed feedback prompts an anxious second payment click",
        "Local MoMo gateway processes duplicate debits without idempotency keys",
        "CampusDesk designs application-level locking and deterministic token guards",
      ],
      caption:
        "From identifying duplicate mobile money deductions to enforcing idempotency at the application boundary.",
    },
    sections: [
      {
        id: "the-result-release-spike",
        title: "The result-release spike",
        paragraphs: [
          "As a student at the University of Buea, we all get our end-of-semester results from the same place: the UB GoStudent platform.",
          "At the end of each semester when results are released, the intended workflow sounds straightforward. You log into your portal, pay the required service fee via Mobile Money (MoMo), and view your grades. In theory, that sounds remarkably convenient.",
          "The reality, however, is very different. The moment results are announced, there is a massive spike in the number of students attempting to access the platform at once. The sudden rush of concurrent traffic makes the platform slow and unresponsive. Sluggish response times during peak demand are frustrating, but on their own they are manageable. What raises the stakes dramatically is when payments enter the picture.",
        ],
      },
      {
        id: "the-double-payment-penalty",
        title: "The double-payment penalty",
        paragraphs: [
          "I know a good number of students who have experienced this exact situation: you log in, try to pay your service charge, and wait to view your results. Due to the sheer volume of students carrying out the same operation, the platform hangs without providing immediate visual feedback.",
          "Unsure whether the request registered, you impulsively click the pay button again.",
          "What happens next? The platform processes two separate charges for a single service fee. You are left sitting there with 2,000 XAF deducted from your Mobile Money wallet when the service only required 1,000 XAF. Anyone who has used the platform knows just how deeply that feeling sucks.",
        ],
      },
      {
        id: "the-idempotency-gap-in-local-gateways",
        title: "The idempotency gap in local gateways",
        paragraphs: [
          "I am not going to claim I know whether the developers of the platform are aware of this issue or where in their pipeline the breakdown occurs. What I do know is that I have to implement payments on CampusDesk, and I refuse to let users—especially students—experience that same frustrating feeling of double payments.",
          "That realization drove me to do as much research as possible into how modern systems handle payments safely, looking into idempotency and the different ways it can be implemented.",
          "Idempotency guarantees that performing an operation multiple times produces the exact same outcome as performing it once, without unintended side effects. In many mature payment APIs, idempotency is supported natively through client-supplied idempotency keys. A unique key identifies the payment attempt; if network instability or a nervous retry causes the request to be transmitted twice, the gateway recognizes the key and returns the original response instead of initiating a duplicate charge.",
          "Currently, however, most of the payment gateways and Mobile Money aggregators available in Cameroon do not support idempotency keys. If an application sends two charge requests across the wire, the gateway will treat each as a brand-new transaction and deduct funds twice.",
        ],
      },
      {
        id: "engineering-an-application-level-workaround",
        title: "Engineering an application-level workaround",
        paragraphs: [
          "Because the upstream gateway will not protect the student from duplicate deductions, I have to find and build a robust workaround at the application layer.",
          "A disabled button on the frontend is a sensible first step, but client-side safeguards alone are never sufficient. Network timeouts, page refreshes, and concurrent browser tabs can easily bypass interface controls.",
          "The actual guarantee must be enforced at the backend and database boundary. For CampusDesk, that means generating deterministic, request-bound transaction tokens before contacting any payment gateway, using database transactions with row-level locking to guard payment transitions, and enforcing strict state-machine checks so that a document request cannot trigger a second payment intent while one is already pending or completed.",
          "Building that reliability without native gateway support is a tedious and demanding task, but it is necessary if I am going to offer students the best and most trustworthy experience possible.",
        ],
      },
      {
        id: "spotting-shortcomings-in-everyday-systems",
        title: "Spotting shortcomings in everyday systems",
        paragraphs: [
          "This challenge highlights how I approach software engineering: by studying the engineering world around me, spotting the shortcomings in the systems I use every day, and finding deliberate ways to build around those shortcomings.",
          "Experiencing the double-charge problem as a University of Buea student made the concept of payment idempotency concrete and urgent. It showed that building software for local conditions requires anticipating local constraints—such as network latency, traffic surges, and gateway limitations—from the very beginning of system design.",
          "Good engineering is not about waiting for perfect infrastructure. It is about understanding the boundaries of the environment you are building for and making your systems dependable despite them.",
        ],
      },
    ],
  },
  {
    slug: "building-a-controlled-aws-delivery-platform-for-campusdesk",
    title: "Building a Controlled AWS Delivery Platform for CampusDesk",
    summary:
      "From local containers to verifiable deployments and tested recovery: immutable ECR images, keyless OIDC, digest-pinned SSM dispatch, declarative CloudFormation DR, and automated restore drills.",
    date: "2026-10-17",
    tags: ["aws", "devops", "docker", "ci-cd", "cloudformation", "linux"],
    relatedWork: ["campusdesk"],
    relatedPosts: [
      "building-campusdesk-beyond-crud",
      "from-ci-cd-theory-to-a-working-aws-deployment-pipeline",
      "why-i-built-campusdesk",
    ],
    diagram: {
      steps: [
        "Parallel CI quality gates & Compose validation",
        "Keyless OIDC publication to Amazon ECR",
        "Approval-gated AWS SSM deployment",
        "Automated DR snapshots & isolated restore drills",
      ],
      caption:
        "The verified delivery, security, and recovery pipeline for CampusDesk on AWS.",
    },
    sections: [
      {
        id: "verifiable-deployments-and-tested-recovery",
        title:
          "From Local Containers to Verifiable Deployments and Tested Recovery",
        paragraphs: [
          "Getting an application to run in Docker is not the same as building a delivery platform.",
          "A container running successfully on my computer answers only one question: can this application start here?",
          "It does not tell me which source revision is running, whether that revision passed its checks, whether the server received the same artifact that CI built, who authorised the release, whether two deployments can collide, or how I will recover the database and uploaded files if the host disappears.",
          "When I designed the delivery platform for CampusDesk, I wanted every release to answer five questions: what exact code am I deploying?; what checks did it pass?; who authorised it?; what happened on the server?; and can I recover the state if the deployment or host fails?.",
          "That led to a pipeline built around immutable artifacts, short-lived credentials, restricted deployment interfaces, explicit verification, and tested recovery.",
        ],
      },
      {
        id: "the-runtime-architecture",
        title: "The runtime architecture",
        paragraphs: [
          "CampusDesk currently runs as a single-host Docker Compose stack on an Ubuntu 24.04 EC2 instance.",
          "The main services are: a Vue application compiled with Node and served by Nginx; a Laravel API running on PHP 8.3 and Apache; a Laravel queue worker using the same backend image; MySQL 8.4; and a one-shot attachment-volume initializer.",
          "The frontend and backend are the only custom application images. The worker reuses the backend image but starts a queue process instead of Apache. MySQL uses the official image.",
          "This keeps the application artifact consistent while allowing the web and background workloads to have independent processes and restart behaviour.",
          "The frontend is the only externally reachable container in the Compose design. Laravel, the worker, and MySQL communicate over the internal Docker network and expose no host ports. In staging, even Nginx is bound only to 127.0.0.1:8080, so the application remains private and is accessed through an SSH tunnel.",
          "That boundary is intentional. I have not exposed staging publicly while DNS, TLS, origin configuration, and the remaining operational controls are unfinished.",
        ],
      },
      {
        id: "building-containers-that-behave-predictably",
        title: "Building containers that behave predictably",
        paragraphs: [
          "The frontend image uses a multi-stage build. Node 22 installs the locked dependencies and compiles the Vue application. Only the resulting static files are copied into the Nginx runtime image.",
          "The backend image contains the Laravel source, PHP extensions, Apache configuration, and production Composer dependencies. It does not contain a committed .env file. Configuration and secrets are injected at runtime.",
          "Using one image for both the backend and worker introduced a shutdown problem. The base Apache image declared SIGWINCH as its stop signal, which made an idle queue worker take roughly 70 seconds to stop. I overrode the worker’s signal with SIGTERM and kept a 70-second grace period above its 60-second job timeout. Verified idle shutdown dropped to roughly 0.2 seconds.",
          "Startup order required similar care.",
          "MySQL has a health check, and the application services wait for it during Compose-managed startup. Nginx waits for the Laravel health endpoint before starting. The worker still has a known host-reboot edge case: Docker restart policies operate independently of Compose dependencies, so it can briefly start before MySQL is accepting connections. It currently recovers automatically, but I keep that behaviour documented rather than pretending Compose dependencies are a complete orchestration system.",
        ],
      },
      {
        id: "the-continuous-integration-boundary",
        title: "The continuous integration boundary",
        paragraphs: [
          "The GitHub Actions workflow responds to pull requests and pushes involving the development branch.",
          "The backend job installs Composer dependencies and runs the PHPUnit suite. The frontend job installs locked npm dependencies, runs ESLint, checks TypeScript, executes the Vitest suite, and produces a production build. A separate job validates the staging Compose configuration.",
          "Pull requests also build the backend and frontend images to confirm that the Dockerfiles remain valid.",
          "A successful push to development builds the two release images and publishes them to separate Amazon ECR repositories. The repositories use immutable tags, and each image is tagged with the complete Git commit SHA.",
          "I intentionally do not use a moving tag such as latest as the deployment identity. A release should point to one exact artifact, not to whichever artifact happened to be pushed most recently.",
          "Immutable tags introduced another issue: rerunning a workflow for the same commit would cause ECR to reject the attempted overwrite. The publication jobs now check whether that exact SHA already exists. They skip publication only when the known image is already present and fail for unexpected registry errors.",
        ],
      },
      {
        id: "aws-authentication-without-stored-access-keys",
        title: "AWS authentication without stored access keys",
        paragraphs: [
          "GitHub authenticates to AWS through OpenID Connect.",
          "There is no permanent AWS access-key pair stored in GitHub. GitHub requests a signed OIDC token, AWS validates its claims, and STS issues short-lived credentials for a restricted role.",
          "Configuring this exposed an important IAM distinction.",
          "My first trust-policy subject was malformed because it contained an incorrect repository representation. I corrected it to constrain the subject to the intended repository and development reference while preserving the required STS audience.",
          "I also encountered an ARN-type error when the deployment configuration referenced a policy ARN where AWS expected a role ARN. A permissions policy describes what can be done; a role is the identity that can be assumed. They are connected, but they are not interchangeable resources.",
          "The resulting design separates responsibilities: a GitHub publication role can push only to the CampusDesk ECR repositories; a protected deployment role can inspect release images and invoke one restricted Systems Manager document against one staging instance; the EC2 instance role can pull from the application repositories but cannot push images; and the recovery permissions are scoped to the required storage prefix, KMS key, alert topic, and monitoring metric.",
          "This is more work than attaching broad AWS permissions, but the resulting failure boundary is much easier to understand.",
        ],
      },
      {
        id: "continuous-delivery-without-automatic-production-deployment",
        title: "Continuous delivery without automatic production deployment",
        paragraphs: [
          "Image publication is automatic after a successful push to development. EC2 deployment is not.",
          "The deployment workflow is manually dispatched with a full 40-character commit SHA and runs through a protected GitHub staging environment that requires approval.",
          "I made this distinction deliberately. Automation should remove repetitive execution, but it should not remove a meaningful release decision merely so the pipeline can be described as fully automatic.",
          "Before contacting the server, the workflow verifies that: the input is a correctly formed full SHA; the commit exists in the checked-out repository history; it belongs to the selected development history; both corresponding ECR images exist; and both tags resolve to valid SHA-256 image digests.",
          "The workflow constructs digest-pinned image references rather than deploying tags. It then assumes the environment-scoped deployment role and sends those references through a restricted AWS Systems Manager document.",
          "GitHub does not receive an SSH key or arbitrary remote-shell access.",
        ],
      },
      {
        id: "a-deliberately-narrow-deployment-interface",
        title: "A deliberately narrow deployment interface",
        paragraphs: [
          "The Systems Manager document can invoke only a fixed, root-owned deployment script on the EC2 instance.",
          "That script accepts a release SHA and exact backend and frontend image references. It validates the input, acquires a deployment lock, authenticates to ECR through the instance role, verifies that each SHA tag resolves to the supplied digest, and pulls both images before opening the maintenance window.",
          "It then runs the migration once, recreates the appropriate services, and performs health checks and API smoke tests.",
          "Deployments are serialized through GitHub Actions concurrency and the host-side lock. This protects the workflow from both duplicate dispatches and commands that reach the server through another execution path.",
          "Re-dispatching the currently deployed release follows a verified no-op path. The script runs health checks but does not pull images, rerun migrations, recreate containers, or introduce downtime.",
          "That no-op behaviour matters. Idempotency should be demonstrated, not assumed.",
        ],
      },
      {
        id: "debugging-service-discovery-after-container-replacement",
        title: "Debugging service discovery after container replacement",
        paragraphs: [
          "One of the more subtle deployment failures appeared after recreating the backend.",
          "The frontend container remained healthy, but API requests began returning Nginx 502 responses. Docker had assigned the recreated backend a new IP address, while the still-running Nginx process continued using the address it had resolved during startup.",
          "The service name was correct. The cached resolution was not.",
          "I updated Nginx to use Docker’s internal DNS resolver at 127.0.0.11 and a variable-based proxy_pass, allowing it to resolve the backend service again after container replacement.",
          "This was a useful reminder that service names do not automatically guarantee dynamic discovery. The behaviour depends on when and how the client resolves them.",
        ],
      },
      {
        id: "when-a-writable-volume-was-not-actually-writable",
        title: "When a writable volume was not actually writable",
        paragraphs: [
          "The most serious staging defect involved uploaded attachments.",
          "The attachment directory inside the named Docker volume was owned by root:root with permissions that did not allow Apache’s www-data user to write. Laravel’s storage operation returned false, and the earlier application logic allowed the failed result to be stored as an attachment path.",
          "The visible symptom was an API path ending in 0 and an authorised download returning 404. The underlying problem crossed infrastructure, operating-system permissions, framework behaviour, and database integrity.",
          "I corrected it in layers.",
          "A one-shot attachments-init service now runs as root before the backend and worker. It creates the directory, changes ownership to www-data:www-data, applies mode 0750, and verifies both ownership and permissions before exiting successfully.",
          "The backend and worker depend on that successful initialization.",
          "I also changed the application to reject unsuccessful storage results, roll back the request metadata, and remove any files written earlier in the same failed operation. Regression tests now cover the storage and authorisation paths.",
          "The important lesson was not simply “fix the volume permissions.” Infrastructure checks and application-level integrity controls should support each other because either layer can eventually fail.",
        ],
      },
      {
        id: "keeping-deployed-services-on-the-same-release",
        title: "Keeping deployed services on the same release",
        paragraphs: [
          "Before the automated deployment workflow existed, the backend and frontend images could be selected independently. That allowed the staging host to run images from different commits.",
          "I corrected the live mismatch by selecting one known development commit and deploying both services through the same workflow. The current contract treats the commit SHA as the release, verifies that both images exist for it, resolves both to digests, and deploys them together.",
          "The application consists of multiple images, but the release is one coordinated unit.",
        ],
      },
      {
        id: "designing-recovery-around-data-not-containers",
        title: "Designing recovery around data, not containers",
        paragraphs: [
          "Containers and images are replaceable. The database and uploaded attachments are not.",
          "CampusDesk has an accepted recovery-point objective of 12 hours and a recovery-time objective of one hour. The recovery system creates coherent sets twice a day.",
          "During capture, the process stops the frontend, worker, and backend while leaving MySQL healthy. It produces: a validated MySQL dump; an archive of the private attachments; checksums; database counts; normalised attachment paths; backend, frontend, and MySQL image references; and metadata tying the artifacts into one recovery set.",
          "The application services are then restarted and checked. Verified maintenance windows have been approximately 11 to 12 seconds. This is planned downtime, not zero-downtime architecture, and I describe it as such.",
          "The recovery set is uploaded to a private, versioned S3 bucket encrypted with a dedicated KMS key. Upload success alone is not accepted as proof of recovery.",
          "For every artifact, the process verifies the required encryption metadata and a non-null S3 version ID. It then downloads the data again and verifies the checksums and archive structure before marking the backup as off-site verified.",
          "Systemd triggers capture at midnight and midday UTC. A second timer checks freshness every 15 minutes. A successful check publishes a CloudWatch heartbeat, while a missing-heartbeat alarm notifies through an encrypted SNS topic.",
          "The recovery infrastructure—S3, KMS, SNS, the scoped instance-role policy, and the CloudWatch alarm—is currently defined through CloudFormation.",
        ],
      },
      {
        id: "testing-the-restore-without-touching-live-data",
        title: "Testing the restore without touching live data",
        paragraphs: [
          "A backup is only a theory until it has been restored.",
          "The restore test creates temporary Docker resources, restores the database and attachments away from the live volumes, runs table checks, compares captured counts and attachment paths, starts the captured backend image against the restored data, and verifies the migration state.",
          "Afterwards, it removes the temporary resources.",
          "This demonstrates that the recovery set is usable without performing a destructive restoration against live staging. It does not claim automatic failover, high availability, or automatic live rollback.",
          "Those are different capabilities and would require a different architecture.",
        ],
      },
      {
        id: "treating-seeded-credentials-as-an-operational-incident",
        title: "Treating seeded credentials as an operational incident",
        paragraphs: [
          "The demonstration dataset initially created many accounts with a known factory password. Keeping staging private reduced exposure, but it did not make that acceptable for future public access.",
          "I implemented staging-only remediation commands with a dry-run-first workflow.",
          "Three retained role personas received separate, unique credentials. The bulk command then transactionally disabled and replaced the credentials of 618 remaining accounts, revoked their tokens and password-reset credentials, and created safe append-only audit records.",
          "The operation was surrounded by a pre-change recovery capture, count verification, retained-account testing, a zero-result second dry run, a post-change recovery capture, and another isolated restore.",
          "The process is also repeatable. Restoring an older recovery set or running the full demonstration seed again is explicitly treated as reintroducing the risk, which requires rerunning the remediation before access can be widened.",
          "That is how I prefer to handle security work: not as a one-off database edit, but as an idempotent operational procedure with entry conditions, abort rules, verification, and recovery evidence.",
        ],
      },
      {
        id: "the-next-infrastructure-phase-terraform",
        title: "The next infrastructure phase: Terraform",
        paragraphs: [
          "Terraform is not yet implemented in the CampusDesk repository.",
          "The current environment combines manually provisioned AWS resources, repository-managed GitHub Actions workflows, host-level configuration, and a CloudFormation stack for recovery infrastructure. The system works, but reproducing it in another environment would still require too much knowledge that currently lives in operational documentation.",
          "My next infrastructure objective is to represent the broader AWS platform as code with Terraform.",
          "I do not plan to begin by recreating resources that already exist. That could destroy data, break trust relationships, or create competing owners for the same infrastructure.",
          "The migration needs to begin with discovery: inventory every AWS and GitHub dependency; identify which resources are manual and which belong to CloudFormation; decide which resources should remain under CloudFormation temporarily; import existing resources into Terraform where safe; compare Terraform plans against the live environment before allowing any apply; and ensure that only one system owns each resource.",
          "The first Terraform modules will likely follow the platform’s existing security boundaries: Identity: GitHub OIDC, publication roles, deployment roles, and EC2 runtime roles; Registry: immutable ECR repositories, lifecycle rules, and scanning configuration; Compute and networking: EC2, security groups, instance profiles, addressing, and internal exposure rules; Deployment: the restricted Systems Manager document and its permissions; Recovery: S3, KMS, SNS, CloudWatch, and retention controls; and Public edge: DNS, certificates, HTTPS termination, and reviewed ingress.",
          "Terraform state will need encrypted remote storage, versioning, locking, tightly restricted access, and its own recovery procedure. Sensitive runtime values should not be casually written into Terraform configuration or state. My preference is to let Terraform provision the secret-management boundary while secret values are inserted and rotated through an approved path.",
          "Infrastructure changes should follow the same delivery philosophy as application changes: a Terraform plan attached to a reviewed pull request, policy and validation checks before merge, and an approval-gated apply for staging.",
          "Destructive resources such as recovery storage and KMS keys will need deliberate lifecycle protections. Drift detection should report unexpected changes without automatically forcing live infrastructure back into compliance.",
          "The goal is not merely to say that CampusDesk uses Terraform. The goal is to make the platform reproducible without weakening the safeguards already proven manually.",
        ],
      },
      {
        id: "what-still-remains",
        title: "What still remains",
        paragraphs: [
          "The current platform is intentionally a private, single-host staging system. It does not yet provide: Public DNS or HTTPS; zero-downtime deployments; automatic failover; a load balancer or Auto Scaling Group; cross-region recovery; centralised application and container logging; comprehensive CPU, memory, disk, and application alerting; managed runtime secrets; image signing or software bills of materials; and a complete ECR retention and vulnerability policy.",
          "The next public-access phase includes stable addressing, DNS, TLS termination, automatic certificate renewal, reviewed exposure of ports 80 and 443, final CORS and origin configuration, and a security-focused smoke test.",
          "I also intend to evaluate Systems Manager Session Manager so routine administration no longer depends on interactive SSH, move runtime secrets into Parameter Store or Secrets Manager, expand CloudWatch monitoring, introduce centralised logs, add ECR lifecycle and scanning controls, and evaluate image provenance and signing.",
        ],
      },
      {
        id: "the-pipeline-i-wanted-to-build",
        title: "The pipeline I wanted to build",
        paragraphs: [
          "The result is not a collection of cloud services connected because they appeared in an architecture diagram.",
          "It is a chain of explicit contracts: pull requests prove that the code, configuration, and images can be built; development pushes publish immutable artifacts; oIDC replaces permanent AWS credentials; a commit SHA identifies a coordinated release; image digests identify its exact contents; a protected environment records the deployment decision; systems Manager exposes a narrow server-side operation; the deployment script verifies, locks, migrates, recreates, and tests; recovery automation protects the state that containers cannot replace; restore testing proves more than the existence of backup files; and operational limitations remain documented until the architecture genuinely removes them.",
          "I am still expanding the platform, but I am doing so from a foundation whose behaviour I can trace from source commit to running container and from live data to a verified recovery set.",
          "That is the standard I want the rest of the infrastructure—including Terraform—to preserve.",
        ],
      },
    ],
  },
  {
    slug: "building-campusdesk-beyond-crud",
    title: "Building CampusDesk Beyond CRUD",
    summary:
      "Designing a workflow system that handles real-world complexity: sequential routing, concurrency locks, coordinated failure rollbacks, private SPA attachments, and audit preservation.",
    date: "2026-10-17",
    tags: [
      "campusdesk",
      "workflow",
      "laravel",
      "vue",
      "concurrency",
      "testing",
    ],
    relatedWork: ["campusdesk"],
    relatedPosts: [
      "building-a-controlled-aws-delivery-platform-for-campusdesk",
      "why-i-built-campusdesk",
      "a-claim-is-more-than-a-check",
    ],
    diagram: {
      steps: [
        "Resolve academic routing template",
        "Acquire pessimistic claim lock",
        "Coordinate storage and database writes",
        "Preserve append-only audit history",
      ],
      caption:
        "Core integrity guarantees across the CampusDesk request lifecycle.",
    },
    sections: [
      {
        id: "beyond-crud",
        title: "Designing a Workflow System That Handles Real-World Complexity",
        paragraphs: [
          "At first glance, CampusDesk may look like a fairly straightforward application.",
          "A student submits a document request. A staff member processes it. The student collects the document.",
          "That description sounds like a few forms, database tables, and status fields. Once I began modelling the actual process, however, it became clear that CampusDesk was not simply a CRUD application. It was a workflow system with multiple actors, ordered stages, concurrent actions, private documents, notifications, administrative controls, and an audit history that needed to remain trustworthy.",
          "I did not want to build a polished interface around a collection of loosely connected endpoints. I wanted every important transition to have an explicit rule, every user role to have a clear boundary, and every failure to leave the system in a state I could explain.",
          "That decision shaped the entire architecture.",
        ],
      },
      {
        id: "technology-behind-campusdesk",
        title: "The technology behind CampusDesk",
        paragraphs: [
          "CampusDesk uses a decoupled single-page application and REST API architecture.",
          "The frontend is built with Vue 3, TypeScript, Vite, Vue Router, Axios, and Tailwind CSS. The backend is built with Laravel 12 and PHP, with MySQL as the relational database. Laravel Sanctum provides Bearer-token authentication, while a database-backed queue processes asynchronous work such as email notifications.",
          "The application has four distinct user experiences: students submit and track document requests; staff members process stages assigned to their departments; department administrators oversee work within their departments; and Super Administrators manage users, institutional reference data, requests, and system-wide controls.",
          "I deliberately separated these experiences into guarded, nested routes rather than building one enormous dashboard full of conditionally displayed components.",
          "Each role has its own layout and task pages. Page-specific composables load only the data required for the current route, while a small authentication composable manages the shared user and token state. I chose not to introduce a larger state-management library because the application did not yet have enough global state to justify one.",
          "That is an architectural decision I revisit as the application grows. I do not add abstractions simply because they are popular; I add them when the complexity they remove is greater than the complexity they introduce.",
        ],
      },
      {
        id: "modelling-a-request-as-a-workflow",
        title: "Modelling a request as a workflow",
        paragraphs: [
          "The central domain problem in CampusDesk is sequential routing.",
          "A transcript request does not simply change from “pending” to “complete.” It may need to pass through the student’s academic department, the records office for their faculty, and then a specialised transcript office.",
          "Different document types may follow different routes, and some parts of those routes depend on the student submitting the request.",
          "I modelled each request as a parent record with an ordered collection of request stages. A request type contains a routing template that can include symbolic values such as: sTUDENT_DEPARTMENT; fACULTY_RECORDS; and a specific department ID.",
          "When a student submits a request, a dedicated service resolves that template using the student’s academic profile. STUDENT_DEPARTMENT becomes the student’s actual department, while FACULTY_RECORDS becomes the records department belonging to the student’s faculty.",
          "The result is a concrete, ordered set of processing stages created for that specific request.",
          "This allows the routing model to remain configurable without hard-coding a separate workflow for every faculty and document type. It also lets administrators manage request types while the backend continues to enforce the same execution rules.",
          "The current routing model is based on my understanding of the University of Buea’s processes. It is a functional approximation, not a claim that every internal university procedure has already been formally validated.",
        ],
      },
      {
        id: "solving-the-concurrency-problem",
        title: "Solving the concurrency problem",
        paragraphs: [
          "Sequential routing sounds simple until two staff members try to claim the same request or a downstream office tries to act before the previous stage has finished.",
          "A frontend button cannot protect against either problem. Two users can click at nearly the same time, and API requests can arrive in an order the interface did not anticipate.",
          "I enforced the rule at the database boundary.",
          "When a staff member attempts to claim a stage, the backend begins a transaction and retrieves the stage using a pessimistic row lock. If it is not the first stage, the transaction verifies that its immediate predecessor has been approved. It then checks that the current stage is still pending and has no handler before assigning it to the staff member.",
          "A request that reaches the server too late receives a conflict instead of silently overwriting the first claim.",
          "This closes the time-of-check-to-time-of-use gap that would exist if the application checked availability first and updated the record later. The queue query also hides downstream stages until their predecessors are approved, but that query is a usability feature. The transactional claim guard remains the actual integrity boundary.",
          "I use the same approach for reopening rejected requests, marking completed documents as collected, reassigning active stages, disabling accounts, and protecting the last enabled Super Administrator. Important transitions lock the relevant rows, validate the current state, and apply the change atomically.",
          "The broader principle is simple: if a rule matters, it should survive two users acting at the same time.",
        ],
      },
      {
        id: "treating-failure-as-part-of-request-creation",
        title: "Treating failure as part of request creation",
        paragraphs: [
          "Submitting a request can involve both database writes and file storage. Those operations do not share one transaction manager.",
          "A database transaction can roll back request and attachment records, but it cannot automatically remove a file that has already been written to disk. The reverse is also dangerous: a failed storage operation must not leave attachment metadata pointing to a nonexistent file.",
          "CampusDesk treats request creation as a coordinated operation.",
          "The backend creates the request, generates its stages, records its initial history, stores each uploaded file, and then creates the matching attachment metadata. It verifies that storage returned a real, non-empty path. If any later step fails, the database transaction rolls back and the application explicitly deletes files that were already written by that attempt.",
          "This behaviour became especially important after staging exposed a subtle failure. The attachment volume belonged to root, while Apache ran as www-data. Laravel’s storage operation returned false, and an earlier implementation allowed that value to become a database path resembling 0.",
          "I addressed the problem at several levels: the container environment now initializes the attachment volume with the correct owner and permissions; the application treats an invalid storage result as an exception; partial uploads are removed when a later operation fails; attachment records are created only after successful writes; and regression tests cover successful storage, failed writes, partial cleanup, missing files, and role-based access.",
          "Fixing the directory permission would have addressed the immediate symptom. Strengthening the application contract prevented the same class of failure from silently corrupting data elsewhere.",
        ],
      },
      {
        id: "private-attachments-in-a-token-authenticated-spa",
        title: "Private attachments in a token-authenticated SPA",
        paragraphs: [
          "Attachments created another interesting frontend problem.",
          "CampusDesk uses Bearer tokens. An ordinary <img> or <iframe> source cannot attach the application’s authorization header in the same way as an Axios request. Pointing the browser directly at a private attachment URL would therefore either fail authentication or tempt the application into exposing the file publicly.",
          "I kept the files private.",
          "The frontend requests an attachment through Axios as a binary blob. The backend checks whether the user owns the request or has an authorised staff relationship with its workflow. The frontend then creates a temporary object URL and uses that URL to display the image or PDF.",
          "When the file is deselected, the object URL is revoked to release the browser resource.",
          "This may appear to be a small implementation detail, but it reflects an important design rule: the storage model should not be weakened to accommodate a convenient UI shortcut.",
        ],
      },
      {
        id: "status-history-notifications-and-rejected-requests",
        title: "Status history, notifications, and rejected requests",
        paragraphs: [
          "A request’s current status is useful, but it is not enough.",
          "CampusDesk records a history of stage and request transitions, including who performed the action and any relevant staff note. Model observers capture stage changes, while application services create lifecycle notifications after successful database commits.",
          "This separation prevents a failed or rolled-back transaction from producing a notification for a change that never actually happened.",
          "Rejected requests also have a defined recovery path. A rejection requires a staff note explaining the problem. The student can review that note and reopen the request. Reopening does not delete the original stages or erase the rejection. It resets the rejected stage, clears its previous assignment, marks the request as reopened, and adds another history entry.",
          "I chose preservation over replacement because an audit trail loses its value if inconvenient events can simply disappear.",
          "The same thinking now applies to administrative security actions. Account disablement, re-enablement, password rotation, and staging credential remediation are stored separately from document-request history in an append-only administrative action table. The model blocks updates and deletions to those audit records.",
        ],
      },
      {
        id: "account-security-as-application-state",
        title: "Account security as application state",
        paragraphs: [
          "Deleting a user is rarely the correct response when that user already appears in document history.",
          "CampusDesk therefore supports permanent account disablement. A disabled account remains part of the historical record but cannot sign in or continue using an existing token.",
          "Disablement is transactional. It locks the user, prevents an administrator from disabling themselves, protects the last enabled Super Administrator, revokes authentication and password-reset credentials, rotates the remember token, and records a safe audit event.",
          "Every protected API route checks both authentication and active account state. This means an already-issued token does not allow a disabled user to continue operating until it expires.",
          "The audit payload deliberately excludes passwords, hashes, Bearer tokens, and password-reset tokens. Observability is useful only when it does not become another source of sensitive-data exposure.",
        ],
      },
      {
        id: "testing-the-invariants-not-just-the-happy-path",
        title: "Testing the invariants, not just the happy path",
        paragraphs: [
          "At the time of writing, the backend suite contains 71 tests with 457 assertions. The frontend suite contains 132 tests across 14 files.",
          "The tests cover authentication, account disablement, credential remediation, request routing, stage claiming and resolution, rejected-request reopening, notifications, attachment storage, attachment authorization, department administration, Super Administrator endpoints, routed pages, and shared frontend interactions.",
          "Some of the most valuable tests came directly from failures: a downstream stage must remain unavailable until its predecessor is approved; a rejected request must reopen without losing its history; a failed upload must not leave database rows or partial files; a disabled account must be rejected even if it presents an old token; a Super Administrator must not disable themselves or the last enabled administrator; the notification bell must not create a login reload loop for unauthenticated visitors; and frontend forms must send the exact field names and status values expected by the API.",
          "There are still meaningful gaps. True parallel claim execution needs a multi-connection concurrency harness. Browser-level end-to-end testing is not yet installed, and attachment boundary cases need broader validation coverage.",
          "I prefer recording those limits plainly. A test suite should describe what has been demonstrated, not create a false sense that every possible failure has been eliminated.",
        ],
      },
      {
        id: "what-i-am-building-next",
        title: "What I am building next",
        paragraphs: [
          "The next application phase is focused on depth rather than adding disconnected features.",
          "Browser automation with Playwright or Cypress will verify complete workflows across role boundaries. That includes authentication, request submission, staff processing, rejection and reopening, administrative actions, attachments, and responsive behaviour at several screen sizes.",
          "I also plan to evolve the current notification service into a stronger domain-event source. First-party browser updates can then use authenticated WebSockets or Server-Sent Events rather than repeatedly polling the API.",
          "Administrative auditing will expand to cover the remaining privileged CRUD and role-change operations, with a dedicated interface separate from the document workflow history.",
          "I am also exploring two more ambitious features.",
          "The first is an AI-assisted support gateway. It would be read-only, restricted to approved support material, and designed to redact personal information before contacting an external model. It would never approve requests, change roles, or mutate workflow state. When automation is insufficient, the conversation would become a human escalation ticket routed to the appropriate administrator.",
          "The second is support for processing fees through Mobile Money. That requires much more than placing a payment button in the interface. The design must include a provider-neutral gateway, signed webhook verification, unique transaction references, idempotent processing, immutable payment events, and a locked transition that releases a request into the staff queue only after a verified payment.",
        ],
      },
      {
        id: "more-than-a-collection-of-screens",
        title: "More than a collection of screens",
        paragraphs: [
          "The most interesting part of CampusDesk is not any individual framework or library.",
          "It is the collection of decisions that make the application predictable when users act concurrently, storage fails, credentials are revoked, a request is rejected, or an administrator performs a sensitive action.",
          "Vue gives me a structured interface. Laravel gives me transactions, queues, policies, middleware, and an expressive domain layer. MySQL gives me the locking and relational integrity the workflow depends on.",
          "The engineering happens in how those pieces are combined.",
          "CampusDesk is becoming the kind of system where I can explain not only what happens when everything works, but also what should happen when it does not.",
        ],
      },
    ],
  },
  {
    slug: "why-i-built-campusdesk",
    title: "Why I built CampusDesk",
    summary:
      "A frustrating university document-request experience became a practical question: what if students could see where their requests were, what needed attention and what would happen next?",
    date: "2026-10-08",
    tags: ["campusdesk", "product-design", "workflow", "learning"],
    relatedWork: ["campusdesk"],
    relatedPosts: [
      "building-campusdesk-beyond-crud",
      "building-a-controlled-aws-delivery-platform-for-campusdesk",
      "from-ci-cd-theory-to-a-working-aws-deployment-pipeline",
    ],
    diagram: {
      steps: [
        "Submit a document request",
        "Follow its route through the relevant offices",
        "Receive reasons when action is required",
        "Track approval and collection status",
      ],
      caption:
        "The visibility CampusDesk is designed to add to a university document request.",
    },
    sections: [
      {
        id: "the-invisible-process",
        title: "A process students could not see",
        paragraphs: [
          "My first year at university was quite a wild ride. There were new experiences, unfamiliar procedures and plenty of challenges to overcome. One of the most frustrating was requesting official documents from my faculty.",
          "From my experience at the University of Buea, requesting something as important as a transcript could feel like taking part in a process whose rules and progress were mostly invisible to the student. You would provide the required information, attach the necessary documents and submit your request. After that, you often had little visibility into what was happening. To find out whether the document was ready, you might have to visit the faculty records office repeatedly and ask for an update.",
          "Sometimes, a request could be delayed or rejected because information was missing or incorrect. The bigger problem was that you might not discover this immediately. Without a clear update, you could spend days waiting without knowing that some action was required from you.",
          "That uncertainty becomes much more serious when the requested document is needed for a scholarship, university application, internship or job opportunity. These opportunities usually have deadlines. Waiting for a transcript or attestation while an admissions board or employer expects a response can be extremely stressful.",
          "This was not an experience unique to me. Several friends encountered similar problems during their time at the university. Those experiences prompted me to ask a simple question: what if students could actually see what was happening to their document requests?",
        ],
      },
      {
        id: "the-idea-behind-campusdesk",
        title: "The idea behind CampusDesk",
        paragraphs: [
          "That question led me to build CampusDesk, a university document request and tracking platform. Imagine submitting a transcript request online and then following it as it moves through the relevant offices. Instead of repeatedly visiting the university to ask for an update, you could open the platform and see whether your request was waiting for review, being processed, forwarded to another office, rejected or ready for collection.",
          "If a request were rejected, the staff member handling it would have to provide a reason. The student could read that explanation, address the problem and reopen the request instead of remaining unaware that something had gone wrong. Once the final office approved the request, the student would receive an update that the document was ready for collection.",
          "CampusDesk does not currently predict the exact date on which a document will be ready. Its purpose is to remove the information gap by showing where a request is in the process and notifying the student when its status changes.",
        ],
      },
      {
        id: "a-workflow-for-staff",
        title: "CampusDesk is also for university staff",
        paragraphs: [
          "The problem does not affect only students. Staff members also need an organised way to receive, process and forward requests. In CampusDesk, each office has a queue containing the requests that are ready for its attention. An authorised staff member can claim a request, review its information and attachments, and then approve or reject that stage.",
          "The platform routes requests in a defined sequence. The next office cannot begin processing a request until the previous office has approved it, and the system prevents two staff members from accidentally claiming the same piece of work at the same time.",
          "Department administrators can monitor requests passing through their departments and reassign active work when necessary. System administrators can manage users, departments, request types and the routes that different documents must follow.",
          "Every status change is recorded, creating a history of what happened to a request. This gives students greater visibility while giving staff a more structured and accountable workflow.",
        ],
      },
      {
        id: "what-has-been-built",
        title: "What has been built so far",
        paragraphs: [
          "CampusDesk is nearing completion. It has already progressed well beyond an idea or interface design. Students can register, authenticate, submit transcript or attestation requests with private attachments, follow their ordered route through multiple departments, and inspect their status history.",
          "Staff have queues for the work ready for their attention. They can claim a request, approve or reject its current stage, and must explain a rejection. Students can address the issue and reopen a rejected request. In-app and queued email notifications communicate changes, including when a document is ready or has been collected.",
          "Department administrators can oversee and reassign active work within their departments, while system administrators can manage the wider set of users, departments, request types and routes.",
          "Under the hood, CampusDesk has a Vue frontend, a Laravel backend, a MySQL database and a background worker for tasks such as notifications. Uploaded documents are stored privately and can be opened only by authorised users connected to the request.",
        ],
      },
      {
        id: "technical-foundations",
        title: "The technical foundations",
        paragraphs: [
          "The application is packaged into containers and deployed to a private staging environment on AWS. Automated checks test the frontend and backend whenever changes are proposed, while a controlled deployment pipeline publishes and deploys approved versions.",
          "Database records and uploaded attachments are included in encrypted off-site backups that have been restore-tested. These foundations matter because a platform handling student information and official documents must be designed with reliability, privacy and accountability in mind.",
        ],
      },
      {
        id: "real-world-adoption",
        title: "The challenge of real-world adoption",
        paragraphs: [
          "One of the biggest challenges ahead is not technical. It is ensuring that CampusDesk reflects how the university actually works. I built the current workflow from my experience and understanding of the university's document-request process, but that understanding may not cover every internal rule, exception, approval step or staff responsibility.",
          "The routes currently represented in the application should therefore be treated as a working model, not an official representation of every University of Buea procedure. For CampusDesk to become genuinely useful to the university, I would need to work with staff members who understand these processes in detail. Their knowledge would show where the current model is accurate, where it needs to change and what additional controls would be required.",
          "Adopting a new system involves more than demonstrating that the software works. It requires institutional support, staff training, data-protection reviews, operational planning and confidence that the platform will remain reliable.",
          "I hope the university and its staff will eventually be willing to support the idea and offer the insight needed to shape CampusDesk into something that can serve both students and employees effectively.",
        ],
      },
      {
        id: "turning-frustration-into-learning",
        title: "Turning frustration into a learning opportunity",
        paragraphs: [
          "CampusDesk has not been publicly launched or officially adopted by the university. It currently runs in a private staging environment while I continue improving its security, infrastructure and understanding of the real administrative process. Until an opportunity for adoption arises, I will continue developing it as both a potential solution and a learning platform.",
          "Building CampusDesk has allowed me to turn a frustrating personal experience into a practical engineering challenge. It has taught me about application development, workflow design, security, testing, cloud infrastructure, containerization, continuous delivery and disaster recovery.",
          "Most importantly, it has encouraged me to think beyond whether software simply works. I now also have to consider whether it solves the right problem, represents the people and processes involved accurately, and can earn the trust of the people expected to use it.",
        ],
      },
    ],
  },
  {
    slug: "from-ci-cd-theory-to-a-working-aws-deployment-pipeline",
    title: "From CI/CD theory to a working AWS deployment pipeline",
    summary:
      "How CampusDesk moved from local Docker containers to immutable images, controlled AWS deployments and tested off-site recovery—and what building the pipeline taught me that tutorials could not.",
    date: "2026-10-08",
    tags: ["ci-cd", "docker", "aws", "github-actions"],
    relatedWork: ["campusdesk"],
    relatedPosts: [
      "building-a-controlled-aws-delivery-platform-for-campusdesk",
      "building-campusdesk-beyond-crud",
      "why-i-built-campusdesk",
    ],
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
        title: "Why CampusDesk needed a pipeline",
        paragraphs: [
          "CampusDesk needed a dependable way to get every change tested and in front of users without me doing it by hand. I started out deploying over SSH: connect to the server, pull the images, restart the containers. It worked, but it was slow, repetitive and easy to get wrong, and it gave me no automatic check that a change was safe to ship. CI/CD was the natural fix, and it was new territory for me, so I learned it by building it for this project. This post walks through the pipeline I ended up with and the decisions behind it.",
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
    relatedPosts: [
      "building-campusdesk-beyond-crud",
      "building-a-controlled-aws-delivery-platform-for-campusdesk",
    ],
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
