import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#023047] mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-[#219EBC] transition-all duration-200 ${
          error ? 'border-[#FB8500] focus:ring-[#FB8500]' : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[#FB8500] font-medium">{error}</p>
      )}
    </div>
  );
};


