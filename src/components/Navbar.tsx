'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="navbar">
      <Link href="/" className="nav-logo">
        <Image
          src="/assets/logo_nav.png"
          alt="Lone Cowry"
          width={40}
          height={40}
        />
        <div className="nav-logo-text">
          <span className="main-name">LONE COWRY</span>
          <span className="sub-name">Ventures</span>
        </div>
      </Link>

      <nav>
        <ul className="nav-links">
          <li>
            <Link href="/" className={isActive('/') && pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/#capabilities">Capabilities</Link>
          </li>
          <li>
            <Link href="/#sectors">Sectors</Link>
          </li>
          <li>
            <Link href="/blog" className={isActive('/blog') ? 'active' : ''}>
              Labs
            </Link>
          </li>
          <li>
            <Link href="/#team">Team</Link>
          </li>
        </ul>
      </nav>

      <Link href="/#contact" className="nav-cta">
        Contact
      </Link>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          background: rgba(10, 13, 26, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
        }

        .nav-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .main-name {
          font-family: var(--font-display);
          font-size: 1.45rem;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }

        .sub-name {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          color: var(--gold);
          text-transform: uppercase;
          margin-top: 2px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          list-style: none;
        }

        .nav-links a {
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: var(--gold);
        }

        .nav-cta {
          font-family: var(--font-ui);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.6rem 1.5rem;
          background: linear-gradient(135deg, var(--gold), var(--amber));
          color: var(--deep);
          border-radius: 3px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(245, 200, 66, 0.35);
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
