
import React from 'react';
import ServicesList from '../components/ServicesList.tsx';
import ServiceDetail from '../components/ServiceDetail.tsx';
import MarketingLayout from '../components/layout/MarketingLayout.tsx';
import { SiteContent, ViewState } from '../types.ts';

interface ServicesViewProps {
  type: 'list' | 'detail';
  view?: string;
  siteContent: SiteContent;
  onNavigate: (view: ViewState) => void;
}

const ServicesView: React.FC<ServicesViewProps> = ({ type, view, siteContent, onNavigate }) => {
  return (
    <MarketingLayout content={siteContent} onNavigate={onNavigate} onLoginClick={() => onNavigate('LOGIN')}>
      {type === 'list' ? (
        <ServicesList 
          siteContent={siteContent} 
          onBack={() => onNavigate('MARKETING')} 
          onServiceClick={(id) => onNavigate(id)} 
        />
      ) : (
        <ServiceDetail 
          view={view || ''} 
          siteContent={siteContent} 
          onBack={() => onNavigate('SERVICES_LIST')} 
        />
      )}
    </MarketingLayout>
  );
};

export default ServicesView;
