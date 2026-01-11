
import React from 'react';
import EmployeeDashboard from '../components/EmployeeDashboard.tsx';
import { SiteContent, Task } from '../types.ts';

interface EmployeeViewProps {
  content: SiteContent;
  tasks: Task[];
  onLogout: () => void;
}

const EmployeeView: React.FC<EmployeeViewProps> = (props) => {
  return (
    <div className="animate-in fade-in duration-500 h-full">
      <EmployeeDashboard {...props} />
    </div>
  );
};

export default EmployeeView;
