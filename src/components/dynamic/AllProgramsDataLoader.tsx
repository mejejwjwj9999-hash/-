import React from 'react';

interface AllProgramsDataLoaderProps {
  children: React.ReactNode;
}

// No-op wrapper to avoid client-side seeding loops and reloads
export const AllProgramsDataLoader: React.FC<AllProgramsDataLoaderProps> = ({ children }) => {
  return <>{children}</>;
};
