import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const QualityEngineeringAssurance = () => {
  return (
    <UniversalServicePage 
      service={servicesData['quality-engineering-assurance']} 
      department={departmentsData.foundry} 
    />
  );
};

export default QualityEngineeringAssurance;
