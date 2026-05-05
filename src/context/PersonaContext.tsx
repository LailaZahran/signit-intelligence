import React, { createContext, useContext, useState } from 'react';
import { PersonaId, Persona } from '../types';
import { personas, getPersona } from '../data/personas';

interface PersonaContextValue {
  activePersonaId: PersonaId;
  activePersona: Persona;
  setPersona: (id: PersonaId) => void;
  personas: Persona[];
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>('legal');

  const value: PersonaContextValue = {
    activePersonaId,
    activePersona: getPersona(activePersonaId),
    setPersona: (id: PersonaId) => setActivePersonaId(id),
    personas,
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
