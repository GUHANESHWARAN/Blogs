const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const db = require('./data/store');

async function seed() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_USERNAME) {
    throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_USERNAME must be set in the environment');
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const users = [
    {
      id: 'admin-1',
      name: ADMIN_USERNAME,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    }
  ];

  const categories = [
    {
      id: 'cat-1',
      name: 'Software Development',
      slug: 'software-development',
      description: 'Best practices, software engineering principles, system design, and coding guides.'
    },
    {
      id: 'cat-2',
      name: 'Artificial Intelligence & Machine Learning',
      slug: 'artificial-intelligence-machine-learning',
      description: 'Neural networks, generative AI, LLMs, and real-world ML applications.'
    },
    {
      id: 'cat-3',
      name: 'Web and Mobile App Development',
      slug: 'web-and-mobile-app-development',
      description: 'Modern frontend, backend, cross-platform mobile frameworks, and UI/UX engineering.'
    },
    {
      id: 'cat-4',
      name: 'Technology & Innovation',
      slug: 'technology-innovation',
      description: 'Breakthrough tech trends, enterprise computing, and disruptive industry shifts.'
    },
    {
      id: 'cat-5',
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Zero trust architecture, application security, threat detection, and privacy.'
    },
    {
      id: 'cat-6',
      name: 'Cloud Computing',
      slug: 'cloud-computing',
      description: 'Kubernetes, serverless, microservices, hybrid cloud, and modern DevOps.'
    },
    {
      id: 'cat-7',
      name: 'Industry Insights',
      slug: 'industry-insights',
      description: 'Tech business perspectives, hiring trends, engineering leadership, and company news.'
    }
  ];

  const authors = [
    {
      id: 'auth-1',
      name: 'Alex Turner',
      role: 'Principal Software Architect',
      email: 'alex.turner@papercup.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Over 12 years of experience designing scalable distributed systems and backend architectures.'
    },
    {
      id: 'auth-2',
      name: 'Priya Sharma',
      role: 'AI Research Scientist',
      email: 'priya.sharma@papercup.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Specialist in deep learning, natural language processing, and multimodal foundation models.'
    },
    {
      id: 'auth-3',
      name: 'Marcus Chen',
      role: 'Cloud & DevOps Lead',
      email: 'marcus.chen@papercup.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Kubernetes contributor passionate about automated CI/CD and cloud-native infrastructure.'
    },
    {
      id: 'auth-4',
      name: 'Sarah Jenkins',
      role: 'Senior Security Consultant',
      email: 'sarah.jenkins@papercup.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'Penetration tester and security researcher advocating for devsecops and zero-trust paradigms.'
    }
  ];

  const posts = [
    {
      id: 'post-1',
      title: 'Building Resilient Microservices with Event-Driven Architecture',
      slug: 'building-resilient-microservices-event-driven-architecture',
      excerpt: 'Discover how decoupling distributed services with message brokers guarantees fault tolerance, scalability, and predictable latency across mission-critical systems.',
      category: 'Software Development',
      tags: ['Microservices', 'Architecture', 'Kafka', 'Node.js', 'System Design'],
      author: authors[0],
      featuredImage: '/uploads/resilient-microservices-hero.jpg',
      readingTime: '8 min read',
      status: 'published',
      isFeatured: true,
      isTrending: true,
      publishedAt: '2026-11-10T09:00:00.000Z',
      views: 1420,
      seoTitle: 'Building Resilient Microservices with Event-Driven Architecture | papercup',
      seoDescription: 'A practical guide to designing fault-tolerant microservices using message brokers, event sourcing, and asynchronous messaging.',
      content: `<h2>Introduction to Event-Driven Design</h2>
<p>Modern applications require high availability, low latency, and graceful degradation during network partitions or service outages. Traditional synchronous REST APIs tightly couple upstream callers to downstream dependencies. When downstream services fail or slow down, cascades ripple through the entire infrastructure.</p>

<p>Event-driven architecture (EDA) inverts this dependency model. Instead of waiting synchronously for remote calls, services produce and consume immutable event streams via high-throughput message brokers such as Apache Kafka or RabbitMQ.</p>

<h3>Key Benefits of Event Decoupling</h3>
<ul>
  <li><strong>Fault Isolation:</strong> A crash in billing processing does not block checkout checkout events.</li>
  <li><strong>Elastic Scalability:</strong> Consumer groups can scale horizontally to handle peak queue backlogs.</li>
  <li><strong>Auditability:</strong> Event streams provide a definitive append-only ledger of state transitions.</li>
</ul>

<h3>Comparing Synchronous REST vs Asynchronous Events</h3>
<table>
  <thead>
    <tr>
      <th>Characteristic</th>
      <th>Synchronous REST</th>
      <th>Event-Driven Architecture</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Coupling</td>
      <td>Tightly coupled endpoint contracts</td>
      <td>Loose publisher/subscriber contract</td>
    </tr>
    <tr>
      <td>Failure Handling</td>
      <td>Requires circuit breakers and retries</td>
      <td>Built-in buffering & replay capability</td>
    </tr>
    <tr>
      <td>Throughput</td>
      <td>Limited by blocking socket pools</td>
      <td>High batch throughput with stream partitions</td>
    </tr>
  </tbody>
</table>

<h3>Code Snippet: Publishing Typed Events in Node.js</h3>
<pre><code class="language-javascript">const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka.production.internal:9092']
});

const producer = kafka.producer();

async function publishOrderCreated(order) {
  await producer.connect();
  await producer.send({
    topic: 'orders.events.v1',
    messages: [
      {
        key: order.id,
        value: JSON.stringify({
          eventType: 'ORDER_CREATED',
          timestamp: new Date().toISOString(),
          payload: order
        })
      }
    ]
  });
}
</code></pre>

<h3>Architectural Considerations</h3>
<p>When adopting event-driven architecture, teams must implement idempotent event consumers, distributed tracing using OpenTelemetry, and strict schema registries (like Protobuf or Avro) to avoid backward-incompatible breaking changes.</p>`
    },
    {
      id: 'post-2',
      title: 'State of Generative AI: From Foundation Models to Autonomous Agents',
      slug: 'state-of-generative-ai-foundation-models-autonomous-agents',
      excerpt: 'An in-depth analysis of reasoning models, tool-augmented inference, retrieval augmented generation, and the shift towards multi-agent enterprise workflows.',
      category: 'Artificial Intelligence & Machine Learning',
      tags: ['Generative AI', 'LLMs', 'Machine Learning', 'RAG', 'Python'],
      author: authors[1],
      featuredImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
      readingTime: '8 min read',
      status: 'published',
      isFeatured: true,
      isTrending: true,
      publishedAt: '2026-11-12T14:30:00.000Z',
      views: 2890,
      seoTitle: 'State of Generative AI: From Foundation Models to Autonomous Agents | papercup',
      seoDescription: 'Explore the evolution of large language models, agentic decision loops, vector search, and real-time enterprise AI integration.',
      content: `<h2>The Paradigm Shift in Artificial Intelligence</h2>
<p>The transition from static text completion models to autonomous, tool-executing agents represents one of the most profound evolutions in software engineering. Modern systems no longer merely summarize inputs; they decompose complex problems, query databases, execute code, and synthesize verified outputs.</p>

<h3>Core Pillars of Production AI Systems</h3>
<p>Building reliable enterprise AI requires moving beyond naive prompts. Real-world solutions depend on three core architectural pillars:</p>
<ol>
  <li><strong>Hybrid Retrieval (RAG):</strong> Combining dense vector embeddings with sparse BM25 keyword search for grounded domain context.</li>
  <li><strong>Deterministic Tool Invocation:</strong> Structured function calling with JSON schemas to interact safely with internal APIs.</li>
  <li><strong>Guardrails & Evaluation:</strong> Automated semantic validation pipelines to detect hallucinations and policy violations before responses reach users.</li>
</ol>`
    },
    {
      id: 'post-3',
      title: 'Mastering Modern Full Stack Performance with React and Node.js',
      slug: 'mastering-modern-full-stack-performance-react-node',
      excerpt: 'Practical performance optimization techniques covering code splitting, asset caching, memoization, database indexing, and streaming responses.',
      category: 'Web and Mobile App Development',
      tags: ['React', 'Node.js', 'Web Performance', 'Frontend', 'Full Stack'],
      author: authors[0],
      featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      readingTime: '5 min read',
      status: 'published',
      isFeatured: false,
      isTrending: true,
      publishedAt: '2026-11-08T11:15:00.000Z',
      views: 980,
      seoTitle: 'Mastering Modern Full Stack Performance with React and Node.js | papercup',
      seoDescription: 'Actionable tips and benchmarks for optimizing React render cycles and Express.js backend response times.',
      content: `<h2>Why Web Performance Matters</h2>
<p>Page load latency directly impacts conversion rates, search engine rankings, and user retention. A delay of just 100 milliseconds can measurably depress user engagement on high-traffic web applications.</p>

<h3>Key Optimization Strategies for the MERN Stack</h3>
<ul>
  <li><strong>Dynamic Imports:</strong> Split route components dynamically using React.lazy and Suspense to reduce initial bundle sizes.</li>
  <li><strong>Effective Server Caching:</strong> Use in-memory or Redis caching layers for frequently queried API endpoints.</li>
  <li><strong>Asset Optimization:</strong> Serve responsive modern image formats like WebP or AVIF with explicit width and height dimensions.</li>
</ul>`
    },
    {
      id: 'post-4',
      title: 'Zero Trust Security: Securing Cloud Native Workloads in 2026',
      slug: 'zero-trust-security-cloud-native-workloads',
      excerpt: 'Why perimeter security is obsolete and how mutual TLS, least-privilege IAM, and continuous identity verification protect enterprise clusters.',
      category: 'Cybersecurity',
      tags: ['Cybersecurity', 'Zero Trust', 'Cloud Security', 'DevSecOps'],
      author: authors[3],
      featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      readingTime: '7 min read',
      status: 'published',
      isFeatured: false,
      isTrending: false,
      publishedAt: '2026-11-05T08:20:00.000Z',
      views: 740,
      seoTitle: 'Zero Trust Security: Securing Cloud Native Workloads in 2026 | papercup',
      seoDescription: 'Comprehensive guide to zero-trust architecture, service mesh mTLS, and workload identity federation.',
      content: `<h2>The Fall of the Network Perimeter</h2>
<p>Traditional network models assumed that anything inside the corporate VPN or internal VPC was inherently trustworthy. In modern distributed cloud infrastructures with remote workforces and multi-tenant clusters, this assumption is fundamentally broken.</p>`
    },
    {
      id: 'post-5',
      title: 'Kubernetes vs Serverless: Choosing the Right Cloud Infrastructure',
      slug: 'kubernetes-vs-serverless-choosing-cloud-infrastructure',
      excerpt: 'Compare operational overhead, cold start latency, cost models, and developer ergonomics between container orchestration and event-driven serverless.',
      category: 'Cloud Computing',
      tags: ['Kubernetes', 'Serverless', 'DevOps', 'AWS', 'GCP', 'Containers'],
      author: authors[2],
      featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      readingTime: '6 min read',
      status: 'published',
      isFeatured: true,
      isTrending: false,
      publishedAt: '2026-11-03T16:00:00.000Z',
      views: 1120,
      seoTitle: 'Kubernetes vs Serverless: Choosing Cloud Infrastructure | papercup',
      seoDescription: 'An unbiased comparison of Kubernetes container management versus serverless functions for modern engineering teams.',
      content: `<h2>The Infrastructure Dilemma</h2>
<p>Engineering leaders frequently face the question: Should we orchestrate our workloads with Kubernetes, or build entirely on serverless abstractions? Both architectures have matured tremendously, but they address distinct operational constraints.</p>`
    },
    {
      id: 'post-6',
      title: 'The Evolution of Software Engineering Leadership in Distributed Teams',
      slug: 'evolution-software-engineering-leadership-distributed-teams',
      excerpt: 'How high-performing tech companies foster psychological safety, asynchronous documentation, and outcome-driven productivity in remote cultures.',
      category: 'Industry Insights',
      tags: ['Leadership', 'Culture', 'Remote Work', 'Management', 'Careers'],
      author: authors[0],
      featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      readingTime: '4 min read',
      status: 'published',
      isFeatured: false,
      isTrending: false,
      publishedAt: '2026-10-28T10:00:00.000Z',
      views: 650,
      seoTitle: 'The Evolution of Software Engineering Leadership | papercup',
      seoDescription: 'Best practices for managing distributed engineering teams with asynchronous communication and clear accountability.',
      content: `<h2>Beyond Physical Presence</h2>
<p>The shift to distributed engineering teams has exposed the flaws of presence-based management. Leading remote engineering organizations requires intentional culture design, asynchronous-first documentation, and clear metrics focused on team impact rather than hours logged.</p>`
    },
    {
      id: 'post-7',
      title: 'Next-Generation Web Standards: What You Need to Know',
      slug: 'next-generation-web-standards-what-to-know',
      excerpt: 'Explore upcoming standards including WebGPU, WebAssembly System Interface (WASI), HTTP/3, and Native View Transitions for high-fidelity web experiences.',
      category: 'Technology & Innovation',
      tags: ['Web Standards', 'Wasm', 'WebGPU', 'HTTP3', 'Innovation'],
      author: authors[1],
      featuredImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      readingTime: '5 min read',
      status: 'published',
      isFeatured: false,
      isTrending: false,
      publishedAt: '2026-10-25T13:45:00.000Z',
      views: 890,
      seoTitle: 'Next-Generation Web Standards | papercup',
      seoDescription: 'A deep dive into WebGPU, WebAssembly, and modern browser standards driving the next decade of web technology.',
      content: `<h2>The Web as an Application Platform</h2>
<p>The web browser is no longer merely a document reader; it has evolved into a full-featured operating system runtime capable of running compute-heavy 3D engines, CAD editors, and on-device machine learning models.</p>`
    }
  ];

  const fs = require('fs');
  const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dataDir, 'authors.json'), JSON.stringify(authors, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dataDir, 'posts.json'), JSON.stringify(posts, null, 2), 'utf-8');

  console.log('Seed completed successfully');
}

if (require.main === module) {
  seed().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { seed };
