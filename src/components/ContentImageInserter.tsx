'use client';

import { useState, useRef, useCallback } from 'react';

interface ContentImageInserterProps {
  onInsertImage: (imageHtml: string) => void;
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

export default function ContentImageInserter({ onInsertImage }: ContentImageInserterProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    setError('');
    const validFiles: File[] = [];

    // Validate files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setError('Some files were skipped. Only image files are allowed.');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Some files were skipped. Images must be less than 5MB.');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    // Process files
    const newImages: UploadedImage[] = [];
    for (const file of validFiles) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: base64,
          name: file.name,
        });
      } catch (err) {
        console.error('Failed to process image:', file.name);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleInsert = (image: UploadedImage, alignment: 'left' | 'center' | 'right' | 'full') => {
    let style = '';
    let wrapperStyle = '';

    switch (alignment) {
      case 'left':
        style = 'float: left; margin: 0 1.5rem 1rem 0; max-width: 50%;';
        break;
      case 'right':
        style = 'float: right; margin: 0 0 1rem 1.5rem; max-width: 50%;';
        break;
      case 'center':
        wrapperStyle = 'text-align: center; margin: 2rem 0;';
        style = 'max-width: 80%; display: inline-block;';
        break;
      case 'full':
        wrapperStyle = 'margin: 2rem 0;';
        style = 'width: 100%;';
        break;
    }

    const html = wrapperStyle
      ? `<div style="${wrapperStyle}"><img src="${image.url}" alt="${image.name}" style="${style} border-radius: 8px;" /></div>`
      : `<img src="${image.url}" alt="${image.name}" style="${style} border-radius: 8px;" />`;

    onInsertImage(html);
  };

  const handleRemove = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  return (
    <div className="content-image-inserter">
      <label className="inserter-label">Content Images</label>
      <p className="inserter-hint">
        Upload images here, then click to insert them into your content at the cursor position.
      </p>

      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />

        {uploading ? (
          <div className="upload-status">
            <div className="spinner" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="drop-placeholder">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Drop images here or click to upload</span>
          </div>
        )}
      </div>

      {error && <div className="upload-error">{error}</div>}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="image-gallery">
          {images.map((image) => (
            <div key={image.id} className="gallery-item">
              <img src={image.url} alt={image.name} className="gallery-image" />
              <div className="gallery-actions">
                <div className="insert-buttons">
                  <button
                    type="button"
                    className="insert-btn"
                    onClick={() => handleInsert(image, 'left')}
                    title="Insert left-aligned"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="4" width="8" height="6" rx="1" />
                      <path d="M3 14h18M3 18h12" stroke="currentColor" fill="none" strokeWidth="2" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="insert-btn"
                    onClick={() => handleInsert(image, 'center')}
                    title="Insert centered"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="12" height="8" rx="1" />
                      <path d="M3 16h18M6 20h12" stroke="currentColor" fill="none" strokeWidth="2" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="insert-btn"
                    onClick={() => handleInsert(image, 'right')}
                    title="Insert right-aligned"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="13" y="4" width="8" height="6" rx="1" />
                      <path d="M3 14h18M9 18h12" stroke="currentColor" fill="none" strokeWidth="2" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="insert-btn"
                    onClick={() => handleInsert(image, 'full')}
                    title="Insert full-width"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="4" width="18" height="10" rx="1" />
                      <path d="M3 18h18" stroke="currentColor" fill="none" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemove(image.id)}
                  title="Remove image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <span className="image-name">{image.name}</span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .content-image-inserter {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .inserter-label {
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .inserter-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
          opacity: 0.8;
          margin: 0;
        }

        .drop-zone {
          border: 2px dashed var(--border);
          border-radius: 6px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--panel);
        }

        .drop-zone:hover {
          border-color: var(--gold);
        }

        .drop-zone.dragging {
          border-color: var(--gold);
          background: rgba(245, 200, 66, 0.08);
          border-style: solid;
        }

        .drop-zone.uploading {
          pointer-events: none;
          opacity: 0.7;
        }

        .file-input {
          display: none;
        }

        .drop-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .upload-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .upload-error {
          font-size: 0.8rem;
          color: #ff6b6b;
          padding: 0.5rem;
          background: rgba(212, 63, 47, 0.1);
          border-radius: 4px;
        }

        .image-gallery {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .gallery-item {
          position: relative;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
        }

        .gallery-image {
          width: 100%;
          height: 80px;
          object-fit: cover;
        }

        .gallery-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem;
          background: var(--panel);
          border-top: 1px solid var(--border);
        }

        .insert-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .insert-btn {
          padding: 0.35rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insert-btn:hover {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--deep);
        }

        .remove-btn {
          padding: 0.35rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-btn:hover {
          background: rgba(212, 63, 47, 0.9);
          border-color: rgba(212, 63, 47, 0.9);
          color: white;
        }

        .image-name {
          display: block;
          padding: 0.25rem 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background: var(--panel);
        }
      `}</style>
    </div>
  );
}
