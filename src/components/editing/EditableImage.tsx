"use client";

import { useState, useCallback } from "react";
import { useEditModeOptional } from "@/context/EditModeContext";
import { Pencil } from "lucide-react";
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
  // For background images
  isBackground?: boolean;
  children?: React.ReactNode;
  // Placeholder text when no image
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

  const editKey = `${contentType}:${contentId}:${contentField}`;
  const editedValue = editMode?.getEditedValue(editKey);
  const displaySrc = (editedValue as string) || src;

  const handleUpload = useCallback((url: string) => {
    if (editMode) {
      editMode.updateContent(contentType, contentId, contentField, url, src);
    }
    setImageError(false);
    setIsModalOpen(false);
  }, [editMode, contentType, contentId, contentField, src]);

  const handleOpenModal = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const isEditing = editMode?.isEditMode && editMode?.isAdmin;

  // Check if image is a placeholder or empty
  const isPlaceholder = !displaySrc || displaySrc.includes('placeholder') || imageError;

  // Background image variant
  if (isBackground) {
    return (
      <>
        <div
          className={`${containerClassName} ${isEditing ? "relative" : ""}`}
          style={{
            ...style,
            backgroundImage: displaySrc && !imageError ? `url('${displaySrc}')` : undefined,
          }}
        >
          {children}

          {/* Edit button for background images */}
          {isEditing && (
            <button
              onClick={handleOpenModal}
              onTouchEnd={handleOpenModal}
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2.5 bg-barn-red hover:bg-barn-red/90 active:bg-barn-red/80 text-cream rounded-lg transition-colors shadow-lg touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Pencil className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Image</span>
            </button>
          )}
        </div>

        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpload={handleUpload}
          currentImage={displaySrc}
          title="Change Background Image"
        />
      </>
    );
  }

  // Regular image variant
  return (
    <>
      <div className={`${containerClassName} ${isEditing ? "relative" : ""}`}>
        {isPlaceholder && placeholderText ? (
          <div className={`${className} bg-sage/20 flex items-center justify-center`}>
            <span className="text-warm-brown/50 font-heading text-sm sm:text-base">{placeholderText}</span>
          </div>
        ) : (
          <img
            src={displaySrc}
            alt={alt}
            className={className}
            style={style}
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {/* Edit button - larger touch target for mobile */}
        {isEditing && (
          <button
            onClick={handleOpenModal}
            onTouchEnd={handleOpenModal}
            className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-3 py-2 bg-barn-red hover:bg-barn-red/90 active:bg-barn-red/80 text-cream text-sm font-medium rounded-lg transition-colors shadow-lg touch-manipulation min-h-[44px] min-w-[44px] justify-center"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label={`Edit ${alt}`}
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}

        {/* Edit mode indicator border */}
        {isEditing && (
          <div className="absolute inset-0 border-2 border-barn-red/70 rounded pointer-events-none" />
        )}
      </div>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpload={handleUpload}
        currentImage={displaySrc}
        title="Replace Image"
      />
    </>
  );
}
