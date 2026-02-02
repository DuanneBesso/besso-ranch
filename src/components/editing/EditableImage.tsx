"use client";

import { useState } from "react";
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

  const editKey = `${contentType}:${contentId}:${contentField}`;
  const editedValue = editMode?.getEditedValue(editKey);
  const displaySrc = (editedValue as string) || src;

  const handleUpload = (url: string) => {
    if (editMode) {
      editMode.updateContent(contentType, contentId, contentField, url, src);
    }
    setIsModalOpen(false);
  };

  const isEditing = editMode?.isEditMode && editMode?.isAdmin;

  // Background image variant
  if (isBackground) {
    return (
      <>
        <div
          className={`${containerClassName} ${isEditing ? "relative" : ""}`}
          style={{
            ...style,
            backgroundImage: `url('${displaySrc}')`,
          }}
        >
          {children}

          {/* Edit button for background images - always visible in edit mode */}
          {isEditing && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 bg-barn-red hover:bg-barn-red/90 text-cream rounded-lg transition-colors shadow-lg"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Image</span>
            </button>
          )}
        </div>

        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpload={handleUpload}
          currentImage={displaySrc}
          title="Change Background Image"
        />
      </>
    );
  }

  // Check if image is a placeholder or empty
  const isPlaceholder = !displaySrc || displaySrc.includes('placeholder');

  // Regular image variant
  return (
    <>
      <div className={`${containerClassName} ${isEditing ? "relative" : ""}`}>
        {isPlaceholder && placeholderText ? (
          <div className={`${className} bg-sage/20 flex items-center justify-center`}>
            <span className="text-warm-brown/50 font-heading">{placeholderText}</span>
          </div>
        ) : (
          <img
            src={displaySrc}
            alt={alt}
            className={className}
            style={style}
          />
        )}

        {/* Edit button - always visible in top-right corner during edit mode */}
        {isEditing && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 bg-barn-red hover:bg-barn-red/90 text-cream text-sm font-medium rounded-lg transition-colors shadow-lg"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        )}

        {/* Edit mode indicator border */}
        {isEditing && (
          <div className="absolute inset-0 border-2 border-barn-red/70 rounded pointer-events-none" />
        )}
      </div>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        currentImage={displaySrc}
        title="Replace Image"
      />
    </>
  );
}
