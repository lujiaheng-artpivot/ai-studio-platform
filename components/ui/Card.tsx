// 现代化卡片组件 - 毛玻璃效果

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      hover = true,
      glow = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-2xl transition-all duration-300
    `;

    const variants = {
      default: `
        bg-white/5 border border-white/10 backdrop-blur-sm
        ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]' : ''}
        ${glow ? 'hover:shadow-xl hover:shadow-amber-500/20' : ''}
      `,
      glass: `
        bg-white/10 border border-white/20 backdrop-blur-md
        shadow-xl
        ${hover ? 'hover:bg-white/15 hover:border-white/30 hover:scale-[1.02]' : ''}
        ${glow ? 'hover:shadow-2xl hover:shadow-violet-500/30' : ''}
      `,
      gradient: `
        bg-gradient-to-br from-white/10 to-white/5 border border-white/20
        backdrop-blur-sm
        ${hover ? 'hover:from-white/15 hover:to-white/10 hover:scale-[1.02]' : ''}
        ${glow ? 'hover:shadow-2xl hover:shadow-purple-500/30' : ''}
      `,
      elevated: `
        bg-slate-800/50 border border-white/10 backdrop-blur-sm
        shadow-2xl shadow-black/20
        ${hover ? 'hover:bg-slate-800/70 hover:border-white/20 hover:scale-[1.02] hover:shadow-3xl' : ''}
        ${glow ? 'hover:shadow-amber-500/20' : ''}
      `,
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// 卡片子组件
export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`px-6 pb-6 ${className}`} {...props}>
    {children}
  </div>
));

CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`px-6 pb-6 pt-4 border-t border-white/10 ${className}`}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';
