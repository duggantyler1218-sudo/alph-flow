'use client';

import { createContext, useContext, useState } from 'react';

interface CoachContextValue {
  isOpen: boolean;
  openCoach: () => void;
  closeCoach: () => void;
}

const CoachContext = createContext<CoachContextValue | null>(null);

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CoachContext.Provider
      value={{
        isOpen,
        openCoach: () => setIsOpen(true),
        closeCoach: () => setIsOpen(false),
      }}
    >
      {children}
    </CoachContext.Provider>
  );
}

export function useCoach(): CoachContextValue {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error('useCoach must be used within CoachProvider');
  return ctx;
}
