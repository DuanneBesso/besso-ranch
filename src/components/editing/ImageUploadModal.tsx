"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, Check } from "lucide-react";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string) => void;
  currentImage?: string;
  title?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  currentImage,
  title = "Upload Image",
}: ImageUploadModalProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Abort any ongoing upload
      abortRef.current?.abort();
      // Reset all state
      setStatus("idle");
      setError(null);
      setPreview(null);
      setSelectedFile(null);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateAndSetFile = (file: File) => {
    setError(null);
    setStatus("idle");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select JPEG, PNG, WebP, or GIF");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (max 5MB). Yours: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || status === "uploading") return;

    setStatus("uploading");
    setError(null);
    abortRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", "inline-edits");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
        signal: abortRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus("success");

      // Brief delay to show success, then close
      setTimeout(() => {
        onUpload(data.url);
        onClose();
      }, 300);

    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleClose = () => {
    if (status !== "uploading") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleClose}
            disabled={status === "uploading"}
            className="p-1.5 hover:bg-gray-100 rounded-full disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Preview */}
          {(preview || currentImage) && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                {preview ? "New image:" : "Current image:"}
              </p>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={preview || currentImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                {status === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                {status === "success" && (
                  <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File selector (hidden when file selected) */}
          {!preview && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-barn-red rounded-lg p-8 text-center cursor-pointer transition-colors"
            >
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Click to select or drag & drop
              </p>
              <p className="text-xs text-gray-400">
                JPEG, PNG, WebP, GIF (max 5MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Action buttons */}
          {preview && status !== "uploading" && status !== "success" && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpload}
                className="flex-1 py-2.5 bg-barn-red hover:bg-barn-red/90 text-white font-medium rounded-lg transition-colors"
              >
                Upload
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                  setError(null);
                }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Change
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t">
          <button
            onClick={handleClose}
            disabled={status === "uploading"}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
