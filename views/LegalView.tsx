
import React from 'react';
import LegalPage from '../components/LegalPage.tsx';
import { SiteContent, ViewState } from '../types.ts';

interface LegalViewProps {
  type: 'PRIVACY_POLICY' | 'KVKK_TEXT' | 'TERMS_OF_USE';
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
}

const LegalView: React.FC<LegalViewProps> = ({ type, content, onNavigate }) => {
  return (
    <LegalPage 
      type={type} 
      content={content} 
      onBack={() => onNavigate('MARKETING')} 
    />
  );
};

export default LegalView;
