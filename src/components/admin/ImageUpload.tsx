"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const dragCounterRef = useRef(0);

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleUpload = async (file: File) => {
    if (isUploading) return;

    setError(null);
    setIsUploading(true);

    // Create abort controller for this upload
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!isMountedRef.current) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (!isMountedRef.current) return;
      onChange(data.url);
    } catch (err) {
      if (!isMountedRef.current) return;
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (isMountedRef.current) {
        setIsUploading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter") {
      dragCounterRef.current++;
      setDragActive(true);
    } else if (e.type === "dragleave") {
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setDragActive(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    } else {
      setError("Please drop an image file");
    }
  };

  const handleRemove = async () => {
    if (value && value.includes("vercel-storage.com")) {
      try {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
    onChange("");
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-charcoal mb-2">
        {label}
      </label>

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="w-48 h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${dragActive
              ? "border-barn-red bg-barn-red/5"
              : "border-gray-300 hover:border-barn-red hover:bg-gray-50"
            }
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-barn-red animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-charcoal mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP, or GIF (max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Manual URL input as fallback */}
      <div className="mt-3">
        <label className="block text-xs text-gray-500 mb-1">
          Or enter image URL manually:
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or /images/..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-barn-red/20 focus:border-barn-red"
        />
      </div>
    </div>
  );
}
