import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogGrid from '@/components/BlogGrid';

export const metadata: Metadata = {
  title: 'Lone Cowry Labs | Research & Insights | AI, Defense Technology, Quantum Computing',
  description:
    'Dispatches from the frontlines of innovation. Lone Cowry Labs shares research, project updates, and deep technical perspectives on Generative AI, Agentic AI, defense technology, drone solutions, quantum computing, cybersecurity, and data engineering.',
  keywords:
    'AI research, Generative AI blog, Agentic AI insights, defense technology research, drone technology articles, quantum computing blog',
};

// Blog post data
const BLOG_POSTS = [
  {
    id: '1',
    slug: 'agentic-ai-software-architecture',
    title: "Why Agentic AI Is the Last Software Architecture You'll Ever Need",
    excerpt:
      "The shift from passive AI models to autonomous Agentic AI agents represents the most fundamental restructuring of software architecture since the introduction of APIs. Lone Cowry Labs explores how multi-agent transformer pipelines are rewriting enterprise automation at its core.",
    category: 'ai-ml',
    categoryLabel: 'Generative AI · Agentic AI',
    categoryColor: 'var(--gold)',
    icon: '🧠',
    gradient: 'linear-gradient(135deg,rgba(245,200,66,0.15),rgba(232,145,42,0.1))',
    date: 'Feb 2025',
    author: 'Lone Cowry Labs',
  },
  {
    id: '2',
    slug: 'edge-ai-drone-solutions',
    title: 'Edge-AI Drone Solutions: The New Paradigm for Autonomous Surveillance',
    excerpt:
      'Project HAWTHORN has demonstrated that onboard ML inference on drone hardware is no longer an R&D exercise — it is an operational reality. Our lab reviews lessons from six months of live drone technology testing in contested electromagnetic environments.',
    category: 'defense',
    categoryLabel: 'Drone Technology · Defense',
    categoryColor: 'var(--crimson)',
    icon: '🛸',
    gradient: 'linear-gradient(135deg,rgba(212,63,47,0.15),rgba(27,95,190,0.1))',
    date: 'Jan 2025',
    author: 'Lone Cowry Labs',
  },
  {
    id: '3',
    slug: 'quantum-fintech-cryptography',
    title: 'Quantum Mechanics Meets Fintech: Why Banks Need Post-Quantum Cryptography Now',
    excerpt:
      'The timeline to cryptographically relevant quantum computing is collapsing. Lone Cowry Labs outlines the immediate steps financial institutions must take to deploy quantum-resistant cryptography before the window closes — and why waiting is not a strategy.',
    category: 'quantum',
    categoryLabel: 'Quantum Computing · Cryptography',
    categoryColor: 'var(--sky)',
    icon: '⚛️',
    gradient: 'linear-gradient(135deg,rgba(59,191,239,0.15),rgba(42,47,143,0.15))',
    date: 'Dec 2024',
    author: 'Lone Cowry Labs',
  },
  {
    id: '4',
    slug: 'inference-cost-optimization',
    title: 'The True Cost of Inference: How to Engineer Your Way to 10x Efficiency',
    excerpt:
      'As LLM deployments scale, inference cost becomes the dominant operational expense. Lone Cowry Labs shares our battle-tested architecture patterns for slashing inference costs across GPU clusters, Kubernetes orchestration, and multi-cloud deployments without sacrificing model quality.',
    category: 'data',
    categoryLabel: 'Data Engineering · AI/ML',
    categoryColor: 'var(--emerald)',
    icon: '📊',
    gradient: 'linear-gradient(135deg,rgba(45,184,124,0.15),rgba(27,95,190,0.1))',
    date: 'Nov 2024',
    author: 'Lone Cowry Labs',
  },
  {
    id: '5',
    slug: '5g-6g-leo-telecommunications',
    title: 'From 5G to 6G to LEO: The Converging Future of Global Telecommunications',
    excerpt:
      'The telecommunications landscape is undergoing its most dramatic transformation in 30 years. Lone Cowry Labs explores how the convergence of 5G ground networks, 6G architectures, and LEO satellite constellations creates entirely new connectivity paradigms for governments and enterprises.',
    category: 'telecom',
    categoryLabel: 'Telecom · LEO · 6G',
    categoryColor: 'var(--amber)',
    icon: '📡',
    gradient: 'linear-gradient(135deg,rgba(232,145,42,0.12),rgba(212,63,47,0.1))',
    date: 'Oct 2024',
    author: 'Lone Cowry Labs',
  },
  {
    id: '6',
    slug: 'zero-trust-ai-security',
    title: "Zero Trust Isn't Enough: The Case for AI-Native Security Operations",
    excerpt:
      'Zero Trust was the right framework for the last decade. But adversarial AI demands a new posture: AI-native security operations. Lone Cowry Labs makes the case for autonomous threat detection, AI-driven incident response, and the death of static perimeter thinking.',
    category: 'cybersecurity',
    categoryLabel: 'Cybersecurity · AI',
    categoryColor: 'var(--cobalt)',
    icon: '🔐',
    gradient: 'linear-gradient(135deg,rgba(27,95,190,0.15),rgba(42,47,143,0.1))',
    date: 'Sep 2024',
    author: 'Lone Cowry Labs',
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Background Effects */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />

      <Navbar />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <span className="tag">Research & Insights</span>
          <h1 className="page-title">
            From the <span className="gradient-text">Lab</span>
          </h1>
          <p className="page-subtitle">
            Dispatches from the frontlines of innovation. <strong>Lone Cowry Labs</strong> shares
            research, project updates, and deep technical perspectives on AI, defense, quantum
            computing, data engineering, and the technologies reshaping our world.
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <BlogGrid posts={BLOG_POSTS} />

      <Footer />
    </>
  );
}
