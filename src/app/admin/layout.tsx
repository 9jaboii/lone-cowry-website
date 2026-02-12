import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
import './admin.css';

export const metadata = {
  title: 'Admin Dashboard | Lone Cowry Ventures',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Allow access to login page without auth
  // Check is done at page level for login page

  return (
    <div className="admin-layout">
      {session ? (
        <>
          <AdminSidebar user={session.user} />
          <main className="admin-main">{children}</main>
        </>
      ) : (
        <main className="admin-main admin-main-full">{children}</main>
      )}
    </div>
  );
}
