
import React from 'react';
import ContactPage from '../components/ContactPage.tsx';
import MarketingLayout from '../components/layout/MarketingLayout.tsx';
import { SiteContent, ViewState, ContactMessage } from '../types.ts';

interface ContactViewProps {
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
  onAddMessage: (msg: ContactMessage) => void;
}

const ContactView: React.FC<ContactViewProps> = ({ content, onNavigate, onAddMessage }) => {
  return (
    <MarketingLayout content={content} onNavigate={onNavigate} onLoginClick={() => onNavigate('LOGIN')}>
      <ContactPage 
        content={content} 
        onBack={() => onNavigate('MARKETING')} 
        onAddMessage={onAddMessage} 
      />
    </MarketingLayout>
  );
};

export default ContactView;
