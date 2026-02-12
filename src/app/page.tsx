import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      {/* Background Effects */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />

      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="tag">Global Technology Powerhouse</span>
            <h1 className="hero-title">
              Bridging <span className="gradient-text">Intelligence</span>
              <br />
              and Infrastructure
            </h1>
            <p className="hero-subtitle">
              Lone Cowry Ventures delivers world-class{' '}
              <strong>Generative AI, Agentic AI, defense technology, quantum computing,</strong> and{' '}
              <strong>cloud solutions</strong> from Washington DC to Dubai.
            </p>
            <div className="hero-cta">
              <Link href="#contact" className="btn-primary">
                Start a Conversation
              </Link>
              <Link href="/blog" className="btn-secondary">
                Explore Labs Research
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <Image
              src="/assets/logo_hero.png"
              alt="Lone Cowry Ventures"
              width={300}
              height={300}
              priority
            />
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="capabilities">
        <div className="container">
          <span className="tag">What We Do</span>
          <h2 className="section-title">
            Core <span className="gradient-text">Capabilities</span>
          </h2>
          <div className="capabilities-grid">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="capability-card">
                <span className="cap-icon">{cap.icon}</span>
                <h3>{cap.title}</h3>
                <p>{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="sectors">
        <div className="container">
          <span className="tag">Industries</span>
          <h2 className="section-title">
            Sectors We <span className="gradient-text">Serve</span>
          </h2>
          <div className="sectors-grid">
            {SECTORS.map((sector, idx) => (
              <div key={sector.name} className="sector-card" style={{ '--i': idx } as React.CSSProperties}>
                <span className="sector-icon">{sector.icon}</span>
                <h3>{sector.name}</h3>
                <p>{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team">
        <div className="container">
          <span className="tag">Leadership</span>
          <h2 className="section-title">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <div className="team-card">
            <div className="team-avatar">BM</div>
            <div className="team-info">
              <h3>Benedict Mbakogu</h3>
              <span className="team-role">Founder & CEO</span>
              <p>
                Leading Lone Cowry Ventures with a vision to bridge intelligence and infrastructure
                across global markets. Expertise in AI, defense technology, and enterprise
                transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <span className="tag">Get in Touch</span>
          <h2 className="section-title">
            Start a <span className="gradient-text">Conversation</span>
          </h2>
          <p className="contact-subtitle">
            Ready to transform your technology strategy? Let&apos;s discuss how Lone Cowry can help.
          </p>
          <div className="contact-grid">
            <div className="contact-card">
              <h4>Washington DC</h4>
              <p>1200 New Hampshire Ave NW, Suite 800</p>
              <p>Washington, DC 20036</p>
            </div>
            <div className="contact-card">
              <h4>Silver Spring, MD</h4>
              <p>Headquarters</p>
              <p>Silver Spring, Maryland</p>
            </div>
            <div className="contact-card">
              <h4>Global Offices</h4>
              <p>Dallas TX · New York · Dubai</p>
              <p>Lagos · Abuja</p>
            </div>
          </div>
          <a href="mailto:contact@lonecowry.com" className="btn-primary contact-btn">
            Email Us
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

const CAPABILITIES = [
  {
    icon: '🧠',
    title: 'Generative AI & Agentic AI',
    description:
      'LLM deployment, multi-agent orchestration, and autonomous AI systems for enterprise automation.',
  },
  {
    icon: '🛡️',
    title: 'Defense Technology',
    description:
      'Drone solutions, ISR systems, autonomous surveillance, and defense-grade AI applications.',
  },
  {
    icon: '⚛️',
    title: 'Quantum Computing',
    description:
      'Post-quantum cryptography, quantum-resistant systems, and quantum computing consulting.',
  },
  {
    icon: '☁️',
    title: 'Cloud & Infrastructure',
    description:
      'Multi-cloud architecture across AWS, GCP, and Azure. Kubernetes, GPU clusters, and MLOps.',
  },
  {
    icon: '🔐',
    title: 'Cybersecurity',
    description:
      'AI-native security operations, threat detection, zero trust architecture, and compliance.',
  },
  {
    icon: '📊',
    title: 'Data Engineering',
    description:
      'Data pipelines, warehousing, real-time analytics, and ML infrastructure at scale.',
  },
];

const SECTORS = [
  {
    icon: '🏛️',
    name: 'Government',
    description: 'Defense agencies, intelligence, and public sector modernization.',
  },
  {
    icon: '🏦',
    name: 'Financial Services',
    description: 'Banks, fintech, trading, and regulatory technology.',
  },
  {
    icon: '🏥',
    name: 'Healthcare',
    description: 'Medical AI, health tech, and biomedical research.',
  },
  {
    icon: '📡',
    name: 'Telecommunications',
    description: '5G/6G networks, LEO satellites, and connectivity.',
  },
  {
    icon: '⚡',
    name: 'Energy',
    description: 'Grid optimization, renewable energy, and battery tech.',
  },
  {
    icon: '🚚',
    name: 'Logistics',
    description: 'Supply chain AI, autonomous systems, and IoT.',
  },
  {
    icon: '🏭',
    name: 'Manufacturing',
    description: 'Industrial AI, robotics, and smart factories.',
  },
  {
    icon: '🛒',
    name: 'Retail',
    description: 'E-commerce AI, personalization, and analytics.',
  },
];
