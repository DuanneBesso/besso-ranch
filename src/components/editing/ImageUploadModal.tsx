"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X, Loader2, Camera, Image as ImageIcon, RefreshCw, Check } from "lucide-react";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow close animation
      const timer = setTimeout(() => {
        setPreview(null);
        setSelectedFile(null);
        setError(null);
        setUploadProgress(0);
        setUploadSuccess(false);
        setIsUploading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isUploading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isUploading, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Validate file before processing
  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please select a valid image (JPEG, PNG, WebP, or GIF)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File is too large. Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB`;
    }
    return null;
  }, []);

  // Process selected file
  const processFile = useCallback((file: File) => {
    setError(null);
    setUploadSuccess(false);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  }, [validateFile]);

  // Upload the file
  const uploadFile = async () => {
    if (!selectedFile) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", "inline-edits");

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      setUploadProgress(100);
      setUploadSuccess(true);

      // Brief delay to show success state
      setTimeout(() => {
        onUpload(data.url);
        onClose();
      }, 500);

    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Please check your connection and try again."
      );
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
  };

  // Handle close
  const handleClose = () => {
    if (!isUploading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 -mr-1"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Preview area */}
          {(preview || currentImage) && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">
                  {preview ? "Selected image:" : "Current image:"}
                </p>
                {preview && !isUploading && (
                  <button
                    onClick={clearSelection}
                    className="text-sm text-barn-red hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative w-full h-48 sm:h-56 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={preview || currentImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    {uploadSuccess ? (
                      <Check className="w-10 h-10 text-green-400" />
                    ) : (
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    )}
                    <p className="text-white text-sm mt-2">
                      {uploadSuccess ? "Success!" : `Uploading... ${uploadProgress}%`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload area - hidden when file is selected */}
          {!preview && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center
                transition-colors duration-200
                ${dragActive
                  ? "border-barn-red bg-barn-red/5"
                  : "border-gray-300"
                }
              `}
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {currentImage ? (
                    <ImageIcon className="w-7 h-7 text-gray-400" />
                  ) : (
                    <Upload className="w-7 h-7 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4 hidden sm:block">
                  Drag and drop an image here, or
                </p>
                <p className="text-sm text-gray-500 mb-4 sm:hidden">
                  Choose an image to upload
                </p>

                {/* Button group */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Choose file button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-barn-red text-white rounded-lg hover:bg-barn-red/90 transition-colors font-medium text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </button>

                  {/* Camera button - mobile only */}
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:hidden"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  JPEG, PNG, WebP, or GIF • Max 5MB
                </p>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Action buttons when file is selected */}
          {preview && !isUploading && (
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={uploadFile}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-barn-red text-white rounded-lg hover:bg-barn-red/90 transition-colors font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Choose Different
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
              {selectedFile && (
                <button
                  onClick={uploadFile}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Upload
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
