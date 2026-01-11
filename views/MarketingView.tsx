
import React from 'react';
import MarketingHome from '../app/page.tsx';
import { SiteContent, ViewState, ContactMessage } from '../types.ts';

interface MarketingViewProps {
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
  onAddMessage: (msg: ContactMessage) => void;
}

const MarketingView: React.FC<MarketingViewProps> = ({ content, onNavigate, onAddMessage }) => {
  return (
    <MarketingHome 
      content={content} 
      onLoginClick={() => onNavigate('LOGIN')} 
      onServiceClick={(s) => onNavigate(s)} 
      onNavigate={onNavigate} 
      onAddMessage={onAddMessage} 
    />
  );
};

export default MarketingView;
