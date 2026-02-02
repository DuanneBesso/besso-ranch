"use client";

import { useState, useRef, useEffect } from "react";
import { useEditModeOptional } from "@/context/EditModeContext";
import { Pencil } from "lucide-react";
import TextEditModal from "./TextEditModal";

type TextElement = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";

interface EditableTextProps {
  value: string;
  contentType: "setting" | "product" | "animal" | "post";
  contentId: string;
  contentField: string;
  as?: TextElement;
  className?: string;
  multiline?: boolean;
  useModal?: boolean;
}

export default function EditableText({
  value,
  contentType,
  contentId,
  contentField,
  as: Tag = "p",
  className = "",
  multiline = false,
  useModal = false,
}: EditableTextProps) {
  const editMode = useEditModeOptional();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const editRef = useRef<HTMLElement>(null);

  const editKey = `${contentType}:${contentId}:${contentField}`;
  const editedValue = editMode?.getEditedValue(editKey);
  const displayValue = (editedValue as string) ?? localValue;

  const isInEditMode = editMode?.isEditMode && editMode?.isAdmin;

  // Sync local value with prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = (newValue: string) => {
    setLocalValue(newValue);
    if (editMode) {
      editMode.updateContent(contentType, contentId, contentField, newValue, value);
    }
    setIsEditing(false);
  };

  const handleModalSave = (newValue: string) => {
    handleSave(newValue);
    setIsModalOpen(false);
  };

  const handleClick = () => {
    if (!isInEditMode) return;

    if (useModal || multiline) {
      setIsModalOpen(true);
    } else {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (isEditing && editRef.current) {
      const newValue = editRef.current.textContent || "";
      handleSave(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setIsEditing(false);
      setLocalValue(value);
      if (editRef.current) {
        editRef.current.textContent = displayValue;
      }
    }
  };

  // Focus contenteditable when editing starts
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      // Move cursor to end
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  // Not in edit mode - render plain element
  if (!isInEditMode) {
    return <Tag className={className}>{displayValue}</Tag>;
  }

  // In edit mode with inline editing
  if (isEditing && !useModal && !multiline) {
    return (
      <Tag
        ref={editRef as React.RefObject<HTMLParagraphElement>}
        className={`${className} outline-none ring-2 ring-barn-red/50 rounded px-1 -mx-1`}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {displayValue}
      </Tag>
    );
  }

  // In edit mode - render with edit indicator
  return (
    <>
      <Tag
        className={`${className} relative cursor-pointer group`}
        onClick={handleClick}
      >
        {/* Edit indicator */}
        <span className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="w-4 h-4 text-barn-red" />
        </span>

        {/* Highlight border on hover */}
        <span className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-barn-red/50 rounded -m-1 pointer-events-none transition-colors" />

        {displayValue}
      </Tag>

      {/* Modal for multiline or when useModal is true */}
      <TextEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        value={displayValue}
        title={`Edit ${contentField.replace(/_/g, " ")}`}
        multiline={multiline}
      />
    </>
  );
}
