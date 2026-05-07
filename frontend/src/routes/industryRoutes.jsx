import React from 'react';
import { Route } from 'react-router-dom';
// Industry pages
import Banking from '../pages/industries/Banking';
import Insurance from '../pages/industries/Insurance';
import EdTech from '../pages/industries/EdTech';
import Healthcare from '../pages/industries/Healthcare';
import LifeScience from '../pages/industries/LifeScience';
import MediaTechnology from '../pages/industries/MediaTechnology';
import Retail from '../pages/industries/Retail';
import TravelHospitality from '../pages/industries/TravelHospitality';
import EnergyUtilities from '../pages/industries/EnergyUtilities';
import Manufacturing from '../pages/industries/Manufacturing';
import InformationServices from '../pages/industries/InformationServices';
import ConsumerGoods from '../pages/industries/ConsumerGoods';

/**
 * Industry Routes
 */
export const industryRoutes = [
  <Route key="banking" path="/industries/banking" element={<Banking />} />,
  <Route key="insurance" path="/industries/insurance" element={<Insurance />} />,
  <Route key="edtech" path="/industries/edtech" element={<EdTech />} />,
  <Route key="healthcare" path="/industries/healthcare" element={<Healthcare />} />,
  <Route key="life-science" path="/industries/life-science" element={<LifeScience />} />,
  <Route key="media-technology" path="/industries/media-technology" element={<MediaTechnology />} />,
  <Route key="retail" path="/industries/retail" element={<Retail />} />,
  <Route key="travel-hospitality" path="/industries/travel-hospitality" element={<TravelHospitality />} />,
  <Route key="energy-utilities" path="/industries/energy-utilities" element={<EnergyUtilities />} />,
  <Route key="manufacturing" path="/industries/manufacturing" element={<Manufacturing />} />,
  <Route key="information-services" path="/industries/information-services" element={<InformationServices />} />,
  <Route key="consumer-goods" path="/industries/consumer-goods" element={<ConsumerGoods />} />
];

export default industryRoutes;
