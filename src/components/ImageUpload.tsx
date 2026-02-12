'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  hint?: string;
}

export default function ImageUpload({
  onImageUpload,
  currentImage,
  label = 'Upload Image',
  hint = 'Drag and drop an image, or click to select',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError('');

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, GIF, WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setUploading(true);

      try {
        // Convert to base64 for demo (in production, upload to S3)
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setPreview(base64);
          onImageUpload(base64);
          setUploading(false);
        };
        reader.onerror = () => {
          setError('Failed to read image file');
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Failed to upload image');
        setUploading(false);
      }
    },
    [onImageUpload]
  );

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

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-wrapper">
      {label && <label className="upload-label">{label}</label>}

      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        {uploading ? (
          <div className="upload-status">
            <div className="spinner" />
            <span>Uploading...</span>
          </div>
        ) : preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <button type="button" className="remove-btn" onClick={handleRemove}>
                Remove
              </button>
              <span className="change-hint">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m16 16-4-4-4 4" />
              </svg>
            </div>
            <span className="upload-hint">{hint}</span>
            <span className="upload-formats">PNG, JPG, GIF, WebP (max 5MB)</span>
          </div>
        )}
      </div>

      {error && <div className="upload-error">{error}</div>}

      <style jsx>{`
        .image-upload-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .upload-label {
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .upload-zone {
          position: relative;
          border: 2px dashed var(--border);
          border-radius: 8px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--panel);
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-zone:hover {
          border-color: var(--gold);
          background: rgba(245, 200, 66, 0.03);
        }

        .upload-zone.dragging {
          border-color: var(--gold);
          background: rgba(245, 200, 66, 0.08);
          border-style: solid;
        }

        .upload-zone.has-preview {
          padding: 0;
          border-style: solid;
          border-color: var(--border);
        }

        .upload-zone.uploading {
          pointer-events: none;
          opacity: 0.7;
        }

        .file-input {
          display: none;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }

        .upload-icon {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .upload-hint {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .upload-formats {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          opacity: 0.7;
        }

        .upload-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .preview-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: 6px;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .preview-container:hover .preview-overlay {
          opacity: 1;
        }

        .remove-btn {
          padding: 0.5rem 1rem;
          background: rgba(212, 63, 47, 0.9);
          border: none;
          border-radius: 4px;
          color: white;
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .remove-btn:hover {
          background: rgba(212, 63, 47, 1);
        }

        .change-hint {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .upload-error {
          font-size: 0.8rem;
          color: #ff6b6b;
          padding: 0.5rem;
          background: rgba(212, 63, 47, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
