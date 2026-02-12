import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import PostEditor from '@/components/PostEditor';

export const metadata = {
  title: 'Create New Post | Lone Cowry Admin',
};

export default async function NewPostPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Link href="/admin/posts" className="back-link">
            <svg
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Posts
          </Link>
          <h1 className="page-title">Create New Post</h1>
        </div>
      </div>

      <PostEditor mode="create" />
    </div>
  );
}
