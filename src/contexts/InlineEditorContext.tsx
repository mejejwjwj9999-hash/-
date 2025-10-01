import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InlineEditorContextType {
  isEditing: boolean;
  editingElement: string | null;
  setEditing: (elementKey: string | null, editing: boolean) => void;
  unsavedChanges: boolean;
  setUnsavedChanges: (hasChanges: boolean) => void;
}

const InlineEditorContext = createContext<InlineEditorContextType | null>(null);

export const useInlineEditor = () => {
  const context = useContext(InlineEditorContext);
  if (!context) {
    throw new Error('useInlineEditor must be used within InlineEditorProvider');
  }
  return context;
};

interface InlineEditorProviderProps {
  children: ReactNode;
}

export const InlineEditorProvider: React.FC<InlineEditorProviderProps> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const setEditing = (elementKey: string | null, editing: boolean) => {
    setEditingElement(elementKey);
    setIsEditing(editing);
    if (!editing) {
      setUnsavedChanges(false);
    }
  };

  return (
    <InlineEditorContext.Provider value={{
      isEditing,
      editingElement,
      setEditing,
      unsavedChanges,
      setUnsavedChanges
    }}>
      {children}
    </InlineEditorContext.Provider>
  );
};