
import React from 'react';
import LoginPage from '../app/login/page.tsx';
import { SiteContent, UserAccount, ViewState } from '../types.ts';

interface LoginViewProps {
  content: SiteContent;
  users: UserAccount[];
  onLoginAttempt: (u: string, p: string) => boolean;
  onNavigate: (view: ViewState) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ content, users, onLoginAttempt, onNavigate }) => {
  return (
    <LoginPage 
      content={content} 
      users={users} 
      onLoginAttempt={onLoginAttempt} 
      onNavigate={onNavigate} 
    />
  );
};

export default LoginView;
