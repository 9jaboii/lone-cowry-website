'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Image
            src="/assets/logo_nav.png"
            alt="Lone Cowry"
            width={48}
            height={48}
            className="login-logo"
          />
          <h1>Admin Login</h1>
          <p>Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lonecowry.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo credentials: admin@lonecowry.com / admin123</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--deep);
          padding: 2rem;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2.5rem;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          font-family: var(--font-display);
          font-size: 1.75rem;
          margin: 1rem 0 0.5rem;
          letter-spacing: 0.05em;
        }

        .login-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .form-group input {
          padding: 0.875rem 1rem;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--gold);
        }

        .form-group input::placeholder {
          color: var(--text-muted);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-login {
          padding: 1rem;
          background: linear-gradient(135deg, var(--gold), var(--amber));
          border: none;
          border-radius: 6px;
          color: var(--deep);
          font-family: var(--font-ui);
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 0.5rem;
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(245, 200, 66, 0.3);
        }

        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(212, 63, 47, 0.15);
          border: 1px solid rgba(212, 63, 47, 0.3);
          color: #ff6b6b;
          padding: 0.875rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          text-align: center;
        }

        .login-footer {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .login-footer p {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
