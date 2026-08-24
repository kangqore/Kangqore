import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const AWS = () => {
  return (
    <UniversalServicePage 
      service={servicesData['aws']} 
      department={departmentsData.foundry} 
    />
  );
};

export default AWS;
