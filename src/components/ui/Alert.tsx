import React, { ReactNode } from 'react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  children,
  onClose,
}) => {
  const styles = {
    success: 'bg-[#8ECAE6] bg-opacity-10 border-[#219EBC] text-[#023047]',
    error: 'bg-[#FB8500] bg-opacity-10 border-[#FB8500] text-[#023047]',
    warning: 'bg-[#FFB703] bg-opacity-10 border-[#FFB703] text-[#023047]',
    info: 'bg-[#8ECAE6] bg-opacity-10 border-[#219EBC] text-[#023047]',
  };

  return (
    <div className={`border rounded-lg p-4 ${styles[type]}`}>
      <div className="flex items-start">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current opacity-70 hover:opacity-100"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};


