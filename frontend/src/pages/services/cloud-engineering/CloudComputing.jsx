import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const CloudComputing = () => {
  return (
    <UniversalServicePage 
      service={servicesData['cloud-computing']} 
      department={departmentsData.foundry} 
    />
  );
};

export default CloudComputing;
