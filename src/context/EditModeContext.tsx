"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface PendingEdit {
  type: "setting" | "product" | "animal" | "post";
  id: string;
  field: string;
  value: string | number | boolean;
  originalValue: string | number | boolean;
}

interface EditModeContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  isSaving: boolean;
  pendingChanges: Map<string, PendingEdit>;
  toggleEditMode: () => void;
  updateContent: (
    type: "setting" | "product" | "animal" | "post",
    id: string,
    field: string,
    value: string | number | boolean,
    originalValue: string | number | boolean
  ) => void;
  getEditedValue: (key: string) => string | number | boolean | undefined;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;
  hasUnsavedChanges: boolean;
}

const EditModeContext = createContext<EditModeContextType | null>(null);

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
}

// Safe hook that returns null when not in provider (for components that may be outside)
export function useEditModeOptional() {
  return useContext(EditModeContext);
}

interface EditModeProviderProps {
  children: ReactNode;
}

export function EditModeProvider({ children }: EditModeProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingEdit>>(
    new Map()
  );

  // Check admin status on mount
  useEffect(() => {
    async function checkAdmin() {
      try {
        console.log("[EditMode] Checking admin status...");
        const res = await fetch("/api/admin/auth/me", {
          credentials: "include",
        });
        console.log("[EditMode] Auth response status:", res.status);
        if (res.ok) {
          const data = await res.json();
          console.log("[EditMode] Auth data:", data);
          setIsAdmin(!!data.admin);
        } else {
          console.log("[EditMode] Auth failed, not admin");
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("[EditMode] Auth check error:", err);
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, []);

  const toggleEditMode = useCallback(() => {
    if (pendingChanges.size > 0 && isEditMode) {
      // Confirm before exiting edit mode with unsaved changes
      if (!window.confirm("You have unsaved changes. Discard them?")) {
        return;
      }
      setPendingChanges(new Map());
    }
    setIsEditMode((prev) => !prev);
  }, [pendingChanges.size, isEditMode]);

  const updateContent = useCallback(
    (
      type: "setting" | "product" | "animal" | "post",
      id: string,
      field: string,
      value: string | number | boolean,
      originalValue: string | number | boolean
    ) => {
      const key = `${type}:${id}:${field}`;
      setPendingChanges((prev) => {
        const newMap = new Map(prev);
        // If value is back to original, remove the pending change
        if (value === originalValue) {
          newMap.delete(key);
        } else {
          newMap.set(key, { type, id, field, value, originalValue });
        }
        return newMap;
      });
    },
    []
  );

  const getEditedValue = useCallback(
    (key: string) => {
      const edit = pendingChanges.get(key);
      return edit?.value;
    },
    [pendingChanges]
  );

  const saveChanges = useCallback(async () => {
    if (pendingChanges.size === 0) return true;

    setIsSaving(true);
    try {
      const edits = Array.from(pendingChanges.values()).map((edit) => ({
        type: edit.type,
        id: edit.id,
        field: edit.field,
        value: edit.value,
      }));

      const res = await fetch("/api/admin/inline-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ edits }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save changes");
      }

      setPendingChanges(new Map());
      // Force a page reload to show the saved changes from database
      window.location.reload();
      return true;
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert(
        error instanceof Error ? error.message : "Failed to save changes"
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [pendingChanges]);

  const discardChanges = useCallback(() => {
    if (pendingChanges.size === 0) return;
    if (window.confirm("Discard all unsaved changes?")) {
      setPendingChanges(new Map());
      // Reload to reset to original values
      window.location.reload();
    }
  }, [pendingChanges.size]);

  return (
    <EditModeContext.Provider
      value={{
        isAdmin,
        isEditMode,
        isSaving,
        pendingChanges,
        toggleEditMode,
        updateContent,
        getEditedValue,
        saveChanges,
        discardChanges,
        hasUnsavedChanges: pendingChanges.size > 0,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
