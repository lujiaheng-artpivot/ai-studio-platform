// 现代化 UI 组件库 - 按钮组件

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-semibold rounded-xl
      transition-all duration-200 transform active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-amber-500 to-orange-500 text-black
        hover:from-amber-400 hover:to-orange-400
        shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40
        focus:ring-amber-500
      `,
      secondary: `
        bg-gradient-to-r from-violet-500 to-purple-500 text-white
        hover:from-violet-400 hover:to-purple-400
        shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40
        focus:ring-violet-500
      `,
      outline: `
        bg-transparent border-2 border-white/20 text-white
        hover:bg-white/10 hover:border-white/30
        focus:ring-white/50
      `,
      ghost: `
        bg-transparent text-gray-300
        hover:bg-white/10 hover:text-white
        focus:ring-white/50
      `,
      gradient: `
        bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white
        hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400
        shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
        focus:ring-purple-500
        animate-gradient bg-[length:200%_200%]
      `,
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>处理中...</span>
          </>
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
