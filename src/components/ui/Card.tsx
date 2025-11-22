import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  footer?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  footer,
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-[#e5e7eb] hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-[#e5e7eb] bg-gradient-to-r from-white to-[#8ECAE6] bg-opacity-5">
          <h3 className="text-lg font-bold text-[#023047]">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-[#e5e7eb] bg-[#f9fafb]">
          {footer}
        </div>
      )}
    </div>
  );
};


