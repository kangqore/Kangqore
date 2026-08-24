import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const GoogleCloudServices = () => {
  return (
    <UniversalServicePage 
      service={servicesData['google-cloud-services']} 
      department={departmentsData.foundry} 
    />
  );
};

export default GoogleCloudServices;
