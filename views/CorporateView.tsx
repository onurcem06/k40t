
import React from 'react';
import InfoPage from '../components/InfoPage.tsx';
import { SiteContent, ViewState } from '../types.ts';

interface CorporateViewProps {
  type: 'manifesto' | 'about';
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
}

const CorporateView: React.FC<CorporateViewProps> = ({ type, content, onNavigate }) => {
  return (
    <InfoPage 
      type={type} 
      content={content} 
      onBack={() => onNavigate('MARKETING')} 
    />
  );
};

export default CorporateView;
