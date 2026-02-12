import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <span>&copy; {currentYear} Lone Cowry Ventures Limited. All rights reserved.</span>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/#contact">Contact</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
