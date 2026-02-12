'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Post, PostCategory, PostStatus, CreatePostInput } from '@/types';
import ImageUpload from './ImageUpload';
import ContentImageInserter from './ContentImageInserter';

interface PostEditorProps {
  post?: Post;
  mode: 'create' | 'edit';
}

const CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'ai-ml', label: 'AI & ML' },
  { value: 'defense', label: 'Defense' },
  { value: 'quantum', label: 'Quantum' },
  { value: 'data', label: 'Data Engineering' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'telecom', label: 'Telecom' },
];

export default function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || ('ai-ml' as PostCategory),
    status: post?.status || ('draft' as PostStatus),
    tags: post?.tags?.join(', ') || '',
    featuredImage: post?.featuredImage || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturedImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, featuredImage: imageUrl }));
  };

  const handleInsertImage = (imageHtml: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = formData.content;

    // Insert image HTML at cursor position
    const newContent =
      content.substring(0, start) + '\n' + imageHtml + '\n' + content.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    // Reset cursor position after the inserted content
    setTimeout(() => {
      const newPosition = start + imageHtml.length + 2;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const category = CATEGORIES.find((c) => c.value === formData.category);
      const payload: CreatePostInput & { featuredImage?: string } = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        categoryLabel: category?.label || formData.category,
        status: formData.status,
        author: '',
        authorId: '',
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        featuredImage: formData.featuredImage,
      };

      const url = mode === 'edit' ? `/api/posts/${post?.id}` : '/api/posts';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to save post');
        setSaving(false);
        return;
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setFormData((prev) => ({ ...prev, status: 'draft' }));
    setTimeout(() => {
      const form = document.getElementById('post-form') as HTMLFormElement | null;
      form?.requestSubmit();
    }, 0);
  };

  const handlePublish = async () => {
    setFormData((prev) => ({ ...prev, status: 'published' }));
    setTimeout(() => {
      const form = document.getElementById('post-form') as HTMLFormElement | null;
      form?.requestSubmit();
    }, 0);
  };

  return (
    <form id="post-form" onSubmit={handleSubmit} className="post-editor">
      {error && <div className="error-message">{error}</div>}

      <div className="editor-main">
        {/* Featured Image */}
        <div className="featured-image-section">
          <ImageUpload
            label="Featured Image"
            hint="This image will appear at the top of your post and in previews"
            currentImage={formData.featuredImage}
            onImageUpload={handleFeaturedImageUpload}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief description for previews (max 300 characters)"
            rows={2}
            maxLength={300}
            required
            disabled={saving}
          />
          <span className="char-count">{formData.excerpt.length}/300</span>
        </div>

        <div className="form-group content-group">
          <label htmlFor="content">Content</label>
          <div className="content-toolbar">
            <span className="toolbar-hint">HTML supported. Click image buttons in sidebar to insert at cursor.</span>
          </div>
          <textarea
            ref={contentRef}
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here... (HTML supported)"
            rows={20}
            required
            disabled={saving}
          />
        </div>
      </div>

      <div className="editor-sidebar">
        <div className="sidebar-section">
          <h3>Publish</h3>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div className="button-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              Save Draft
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePublish}
              disabled={saving}
            >
              {saving ? 'Saving...' : mode === 'edit' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Category</h3>
          <div className="form-group">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={saving}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Tags</h3>
          <div className="form-group">
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Comma-separated tags"
              disabled={saving}
            />
          </div>
        </div>

        <div className="sidebar-section images-section">
          <ContentImageInserter onInsertImage={handleInsertImage} />
        </div>

        <div className="sidebar-section">
          <button
            type="button"
            className="btn btn-secondary cancel-btn"
            onClick={() => router.push('/admin/posts')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
        .post-editor {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
          align-items: start;
        }

        .editor-main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .featured-image-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem;
        }

        .editor-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 2rem;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
        }

        .sidebar-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem;
        }

        .sidebar-section.images-section {
          max-height: 400px;
          overflow-y: auto;
        }

        .sidebar-section h3 {
          font-family: var(--font-ui);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
        }

        .form-group label {
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 0.875rem 1rem;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color 0.2s;
          width: 100%;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--gold);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .content-group {
          flex: 1;
        }

        .content-toolbar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
        }

        .toolbar-hint {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          opacity: 0.8;
        }

        .form-group textarea#content {
          min-height: 500px;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .char-count {
          position: absolute;
          bottom: 0.5rem;
          right: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .button-group {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .button-group .btn {
          flex: 1;
          justify-content: center;
        }

        .cancel-btn {
          width: 100%;
          justify-content: center;
        }

        .error-message {
          grid-column: 1 / -1;
          background: rgba(212, 63, 47, 0.15);
          border: 1px solid rgba(212, 63, 47, 0.3);
          color: #ff6b6b;
          padding: 0.875rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        @media (max-width: 1024px) {
          .post-editor {
            grid-template-columns: 1fr;
          }

          .editor-sidebar {
            position: static;
            max-height: none;
          }
        }
      `}</style>
    </form>
  );
}
