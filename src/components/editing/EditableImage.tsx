"use client";

import { useState, useCallback, useRef } from "react";
import { useEditModeOptional } from "@/context/EditModeContext";
import { Pencil, ImagePlus } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";

interface EditableImageProps {
  src: string;
  alt: string;
  contentType: "setting" | "product" | "animal" | "post";
  contentId: string;
  contentField: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  isBackground?: boolean;
  children?: React.ReactNode;
  placeholderText?: string;
}

export default function EditableImage({
  src,
  alt,
  contentType,
  contentId,
  contentField,
  className = "",
  containerClassName = "",
  style,
  isBackground = false,
  children,
  placeholderText,
}: EditableImageProps) {
  const editMode = useEditModeOptional();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const clickLockRef = useRef(false);

  const editKey = `${contentType}:${contentId}:${contentField}`;
  const editedValue = editMode?.getEditedValue(editKey);
  const displaySrc = (editedValue as string) || src;

  const isEditing = editMode?.isEditMode && editMode?.isAdmin;
  const hasImage = displaySrc && !displaySrc.includes('placeholder') && !imageError;

  const handleUpload = useCallback((url: string) => {
    if (editMode) {
      editMode.updateContent(contentType, contentId, contentField, url, src);
    }
    setImageError(false);
    setIsModalOpen(false);
  }, [editMode, contentType, contentId, contentField, src]);

  const openModal = useCallback(() => {
    // Simple click lock to prevent double-firing
    if (clickLockRef.current || isModalOpen) return;
    clickLockRef.current = true;
    setIsModalOpen(true);
    setTimeout(() => { clickLockRef.current = false; }, 500);
  }, [isModalOpen]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Background image variant
  if (isBackground) {
    return (
      <>
        <div
          className={`${containerClassName} ${isEditing ? "relative" : ""}`}
          style={{
            ...style,
            backgroundImage: hasImage ? `url('${displaySrc}')` : undefined,
          }}
        >
          {children}

          {isEditing && (
            <button
              type="button"
              onClick={openModal}
              className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-2.5 bg-barn-red hover:bg-barn-red/90 text-cream rounded-lg shadow-lg"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Image</span>
            </button>
          )}
        </div>

        {isModalOpen && (
          <ImageUploadModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onUpload={handleUpload}
            currentImage={displaySrc}
            title="Change Background Image"
          />
        )}
      </>
    );
  }

  // Regular image - NOT in edit mode
  if (!isEditing) {
    if (!hasImage && placeholderText) {
      return (
        <div className={`${containerClassName}`}>
          <div className={`${className} bg-sage/20 flex items-center justify-center`}>
            <span className="text-warm-brown/50 font-heading text-sm">{placeholderText}</span>
          </div>
        </div>
      );
    }
    return (
      <div className={containerClassName}>
        <img
          src={displaySrc}
          alt={alt}
          className={className}
          style={style}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Regular image - IN EDIT MODE
  return (
    <>
      <div className={`${containerClassName} relative`}>
        {hasImage ? (
          // Has image - show image with edit button
          <>
            <img
              src={displaySrc}
              alt={alt}
              className={className}
              style={style}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <button
              type="button"
              onClick={openModal}
              className="absolute top-2 right-2 z-50 flex items-center gap-1.5 px-3 py-2 bg-barn-red hover:bg-barn-red/90 text-cream text-sm font-medium rounded-lg shadow-lg min-h-[44px]"
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </>
        ) : (
          // No image - show add button that fills the entire area
          <button
            type="button"
            onClick={openModal}
            className={`${className} bg-warm-brown/10 hover:bg-warm-brown/20 border-2 border-dashed border-warm-brown/30 hover:border-barn-red flex flex-col items-center justify-center cursor-pointer transition-colors`}
          >
            <ImagePlus className="w-8 h-8 text-warm-brown/40 mb-2" />
            <span className="text-warm-brown/60 text-sm font-medium">Add Image</span>
          </button>
        )}

        {/* Edit border indicator */}
        {hasImage && (
          <div className="absolute inset-0 border-2 border-barn-red/50 rounded pointer-events-none" />
        )}
      </div>

      {isModalOpen && (
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onUpload={handleUpload}
          currentImage={displaySrc}
          title={hasImage ? "Replace Image" : "Add Image"}
        />
      )}
    </>
  );
}
