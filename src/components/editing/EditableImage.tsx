"use client";

import { useState } from "react";
import { useEditModeOptional } from "@/context/EditModeContext";
import { Camera } from "lucide-react";
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

          {/* Edit overlay for background images */}
          {isEditing && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 bg-charcoal/80 hover:bg-charcoal text-cream rounded-lg transition-colors backdrop-blur-sm"
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Change Image</span>
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

  // Regular image variant
  return (
    <>
      <div className={`${containerClassName} ${isEditing ? "relative group" : ""}`}>
        <img
          src={displaySrc}
          alt={alt}
          className={className}
          style={style}
        />

        {/* Edit overlay */}
        {isEditing && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors group"
          >
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 bg-charcoal/90 text-cream rounded-lg transition-opacity">
              <Camera className="w-5 h-5" />
              <span className="font-medium">Change Image</span>
            </div>
          </button>
        )}

        {/* Edit mode indicator border */}
        {isEditing && (
          <div className="absolute inset-0 border-2 border-dashed border-barn-red/50 rounded pointer-events-none" />
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
