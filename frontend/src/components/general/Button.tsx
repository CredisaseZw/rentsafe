import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary'; // add more variants as needed
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variants: Record<'primary', string> = {
  primary: 'bg-PRIMARY hover:bg-primary-dark',
};

function Button({
  children,
  variant = 'primary',
  onClick,
  className,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
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
