
import React from 'react';

export type FoxIconType = 'FoxHead' | 'FoxSitting' | 'FoxRunning' | 'FoxSleeping' | 'FoxAlert';

interface FoxIconProps {
  type: FoxIconType;
  size?: number;
  className?: string;
}

const FoxIcons: React.FC<FoxIconProps> = ({ type, size = 24, className = "" }) => {
  const paths: Record<FoxIconType, React.ReactNode> = {
    FoxHead: (
      <path d="M12 2L4 8L4 12C4 16.4 7.6 20 12 22C16.4 20 20 16.4 20 12L20 8L12 2ZM12 4.5L18.5 9.5L18.5 12C18.5 15.6 15.6 18.5 12 20.5C8.4 18.5 5.5 15.6 5.5 12L5.5 9.5L12 4.5Z" fill="currentColor"/>
    ),
    FoxSitting: (
      <path d="M12 2C10.5 2 9.2 3.1 8.6 4.5C7.5 4.1 6.3 4.4 5.4 5.2C4.5 6.1 4.2 7.3 4.6 8.4C3.1 9 2 10.3 2 11.8V19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11.8C22 10.3 20.9 9 19.4 8.4C19.8 7.3 19.5 6.1 18.6 5.2C17.7 4.3 16.5 4 15.4 4.5C14.8 3.1 13.5 2 12 2Z" fill="currentColor"/>
    ),
    FoxRunning: (
      <path d="M2 12L6 8L10 12L6 16L2 12ZM14 12L18 8L22 12L18 16L14 12ZM8 10V14H16V10H8Z" fill="currentColor"/>
    ),
    FoxSleeping: (
      <path d="M4 14C4 11.8 5.8 10 8 10H16C18.2 10 20 11.8 20 14V16C20 18.2 18.2 20 16 20H8C5.8 20 4 18.2 4 16V14ZM12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12Z" fill="currentColor"/>
    ),
    FoxAlert: (
      <path d="M12 2L2 22H22L12 2ZM12 18C11.4 18 11 17.6 11 17C11 16.4 11.4 16 12 16C12.6 16 13 16.4 13 17C13 17.6 12.6 18 12 18ZM11 14V10H13V14H11Z" fill="currentColor"/>
    )
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {paths[type]}
    </svg>
  );
};

export default FoxIcons;
