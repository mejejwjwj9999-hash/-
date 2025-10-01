import React from 'react';
import { DynamicProgramPage } from '@/components/dynamic/DynamicProgramPage';
import { PharmacyDataLoader } from '@/components/dynamic/PharmacyDataLoader';

const Pharmacy = () => {
  return (
    <PharmacyDataLoader>
      <DynamicProgramPage 
        template="detailed"
        language="ar"
      />
    </PharmacyDataLoader>
  );
};

export default Pharmacy;