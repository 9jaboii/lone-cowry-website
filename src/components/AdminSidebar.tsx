'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

interface AdminSidebarProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    {
      section: 'Content',
      items: [
        { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
        { href: '/admin/posts', label: 'Blog Posts', icon: PostsIcon },
      ],
    },
    {
      section: 'Settings',
      items: [
        { href: '/admin/settings', label: 'Site Settings', icon: SettingsIcon },
      ],
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="admin-sidebar">
      <Link href="/" className="sidebar-logo">
        <Image
          src="/assets/logo_nav.png"
          alt="Lone Cowry"
          width={36}
          height={36}
        />
        <div className="sidebar-logo-text">
          <span className="main-name">LONE COWRY</span>
          <span className="sub-name">Admin Panel</span>
        </div>
      </Link>

      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section} className="nav-section">
            <div className="nav-section-title">{section.section}</div>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{getInitials(user.name)}</div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogoutIcon />
          Logout
        </button>
      </div>

      <style jsx>{`
        .admin-sidebar {
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1.5rem;
          text-decoration: none;
        }

        .sidebar-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .main-name {
          font-family: var(--font-display);
          font-size: 1.2rem;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }

        .sub-name {
          font-family: var(--font-mono);
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: var(--gold);
          text-transform: uppercase;
          margin-top: 2px;
        }

        .sidebar-nav {
          flex: 1;
        }

        .nav-section {
          margin-bottom: 1.5rem;
        }

        .nav-section-title {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          padding-left: 0.75rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 6px;
          font-family: var(--font-ui);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 0.25rem;
        }

        .nav-item:hover {
          background: var(--panel);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(245, 200, 66, 0.1);
          color: var(--gold);
          border-left: 2px solid var(--gold);
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), var(--amber));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-ui);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--deep);
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .user-role {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-ui);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          border-color: var(--crimson);
          color: var(--crimson);
        }
      `}</style>
    </aside>
  );
}

// Icon components
function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}

function PostsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}
