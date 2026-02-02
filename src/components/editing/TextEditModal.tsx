"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface TextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  value: string;
  title?: string;
  multiline?: boolean;
}

export default function TextEditModal({
  isOpen,
  onClose,
  onSave,
  value,
  title = "Edit Text",
  multiline = false,
}: TextEditModalProps) {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset value when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditValue(value);
    }
  }, [isOpen, value]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Save on Ctrl/Cmd + Enter for multiline
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && multiline) {
        e.preventDefault();
        handleSave();
      }
      // Save on Enter for single line
      if (e.key === "Enter" && !multiline && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, multiline, editValue]);

  const handleSave = () => {
    onSave(editValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-barn-red/20 focus:border-barn-red resize-y text-charcoal"
              placeholder="Enter text..."
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-barn-red/20 focus:border-barn-red text-charcoal"
              placeholder="Enter text..."
            />
          )}
          <p className="mt-2 text-xs text-gray-500">
            {multiline
              ? "Press Ctrl+Enter to save, Escape to cancel"
              : "Press Enter to save, Escape to cancel"}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-cream bg-barn-red hover:bg-barn-red/90 rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
