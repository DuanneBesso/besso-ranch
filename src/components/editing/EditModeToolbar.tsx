"use client";

import { useEditModeOptional } from "@/context/EditModeContext";
import { Pencil, Save, X, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditModeToolbar() {
  const editMode = useEditModeOptional();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track if component mounted (client-side only)
  useEffect(() => {
    setMounted(true);
    console.log("[EditModeToolbar] Mounted, isAdmin:", editMode?.isAdmin);
  }, [editMode?.isAdmin]);

  // Keyboard shortcut for save (Ctrl+S)
  useEffect(() => {
    if (!editMode?.isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (editMode.hasUnsavedChanges && !editMode.isSaving) {
          editMode.saveChanges();
        }
      }
      if (e.key === "Escape" && editMode.isEditMode) {
        editMode.toggleEditMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editMode]);

  // Don't render on server
  if (!mounted) {
    return null;
  }

  // Don't render if not admin or context not available
  if (!editMode?.isAdmin) {
    return null;
  }

  const { isEditMode, isSaving, hasUnsavedChanges, pendingChanges } = editMode;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-auto"
      }`}
    >
      <div className="bg-charcoal text-cream rounded-lg shadow-2xl border border-cream/10 overflow-hidden">
        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -top-3 right-3 w-6 h-6 bg-charcoal border border-cream/20 rounded-full flex items-center justify-center hover:bg-charcoal/80 transition-colors"
          title={isCollapsed ? "Expand toolbar" : "Collapse toolbar"}
        >
          {isCollapsed ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>

        {isCollapsed ? (
          // Collapsed state - just show edit icon
          <button
            onClick={() => {
              setIsCollapsed(false);
              if (!isEditMode) editMode.toggleEditMode();
            }}
            className={`p-3 ${
              isEditMode ? "bg-barn-red" : "hover:bg-cream/10"
            } transition-colors`}
            title="Edit Website"
          >
            <Pencil className="w-5 h-5" />
          </button>
        ) : (
          // Expanded state
          <div className="flex items-center gap-1 p-2">
            {/* Edit toggle button */}
            <button
              onClick={editMode.toggleEditMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                isEditMode
                  ? "bg-barn-red text-cream"
                  : "hover:bg-cream/10 text-cream"
              }`}
            >
              <Pencil className="w-4 h-4" />
              <span>{isEditMode ? "Editing" : "Edit Website"}</span>
            </button>

            {/* Show save/discard buttons when in edit mode */}
            {isEditMode && (
              <>
                <div className="w-px h-8 bg-cream/20 mx-1" />

                {/* Pending changes indicator */}
                {hasUnsavedChanges && (
                  <span className="px-2 py-1 bg-soft-gold/20 text-soft-gold text-xs rounded-md">
                    {pendingChanges.size} change
                    {pendingChanges.size !== 1 ? "s" : ""}
                  </span>
                )}

                {/* Save button */}
                <button
                  onClick={editMode.saveChanges}
                  disabled={!hasUnsavedChanges || isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                    hasUnsavedChanges && !isSaving
                      ? "bg-forest-green text-cream hover:bg-forest-green/90"
                      : "bg-cream/5 text-cream/30 cursor-not-allowed"
                  }`}
                  title="Save changes (Ctrl+S)"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </button>

                {/* Discard button */}
                <button
                  onClick={editMode.discardChanges}
                  disabled={!hasUnsavedChanges || isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                    hasUnsavedChanges && !isSaving
                      ? "bg-cream/10 text-cream hover:bg-cream/20"
                      : "bg-cream/5 text-cream/30 cursor-not-allowed"
                  }`}
                  title="Discard changes (Esc to exit edit mode)"
                >
                  <X className="w-4 h-4" />
                  <span>Discard</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hint text when edit mode is active */}
      {isEditMode && !isCollapsed && (
        <p className="text-xs text-cream/60 mt-2 text-right">
          Click highlighted elements to edit
        </p>
      )}
    </div>
  );
}
