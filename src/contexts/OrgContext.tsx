import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type OrgContextValue = {
  organizationName: string;
  setOrganizationName: (name: string) => void;
};

const OrgContext = createContext<OrgContextValue | undefined>(undefined);

const ORG_STORAGE_KEY = 'nexusware_org_name';
const DEFAULT_ORG_NAME = 'Your Organisation';

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizationName, setOrganizationNameState] = useState<string>(DEFAULT_ORG_NAME);

  useEffect(() => {
    const stored = localStorage.getItem(ORG_STORAGE_KEY);
    if (stored) {
      setOrganizationNameState(stored);
    }
  }, []);

  const setOrganizationName = (name: string) => {
    const trimmed = name.trim();
    const next = trimmed.length > 0 ? trimmed : DEFAULT_ORG_NAME;
    setOrganizationNameState(next);
    localStorage.setItem(ORG_STORAGE_KEY, next);
  };

  const value = useMemo<OrgContextValue>(() => ({ organizationName, setOrganizationName }), [organizationName]);

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrg = (): OrgContextValue => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error('useOrg must be used within OrgProvider');
  return ctx;
};



