
import React from 'react';
import InfoPage from '../components/InfoPage.tsx';
import MarketingLayout from '../components/layout/MarketingLayout.tsx';
import { SiteContent, ViewState } from '../types.ts';

interface AboutViewProps {
  type: 'manifesto' | 'about';
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
}

const AboutView: React.FC<AboutViewProps> = ({ type, content, onNavigate }) => {
  return (
    <MarketingLayout content={content} onNavigate={onNavigate} onLoginClick={() => onNavigate('LOGIN')}>
      <InfoPage 
        type={type} 
        content={content} 
        onBack={() => onNavigate('MARKETING')} 
      />
    </MarketingLayout>
  );
};

export default AboutView;
