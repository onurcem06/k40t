
import React from 'react';
import ServicesList from '../components/ServicesList.tsx';
import ServiceDetail from '../components/ServiceDetail.tsx';
import { SiteContent, ViewState } from '../types.ts';

interface ServiceViewProps {
  type: 'list' | 'detail';
  view?: string;
  siteContent: SiteContent;
  onNavigate: (view: ViewState) => void;
}

const ServiceView: React.FC<ServiceViewProps> = ({ type, view, siteContent, onNavigate }) => {
  if (type === 'list') {
    return (
      <ServicesList 
        siteContent={siteContent} 
        onBack={() => onNavigate('MARKETING')} 
        onServiceClick={(id) => onNavigate(id)} 
      />
    );
  }

  return (
    <ServiceDetail 
      view={view || ''} 
      siteContent={siteContent} 
      onBack={() => onNavigate('SERVICES_LIST')} 
    />
  );
};

export default ServiceView;
