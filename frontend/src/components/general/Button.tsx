import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success'; // add more variants as needed
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled? : false | true,
  type?: 'button' | 'submit' | 'reset';
}

const variants: Record<'primary' | 'success', string> = {
  primary: 'bg-PRIMARY hover:bg-primary-dark',
  success: 'bg-green-600 hover:bg-green-800',
};

function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  className,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled = {disabled}
      onClick={onClick}
      className={cn(
        `${variants[variant]} text-white font-bold py-2 px-4 rounded`,
        className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
