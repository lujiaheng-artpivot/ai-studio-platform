import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-black focus:ring-amber-500',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10 focus:ring-white',
    outline: 'border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10 focus:ring-amber-500',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`
      bg-white/5 border border-white/10 rounded-2xl p-8
      ${hover ? 'hover:bg-white/10 hover:border-white/20 transition-all duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const variants = {
    primary: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    success: 'bg-green-500/10 border-green-500/20 text-green-500',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
    error: 'bg-red-500/10 border-red-500/20 text-red-500',
  };
  
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm ${variants[variant]}`}>
      {children}
    </span>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`py-24 ${className}`}>
      {children}
    </section>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
}

export function GradientText({ children, from = 'from-amber-500', to = 'to-orange-500' }: GradientTextProps) {
  return (
    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${from} ${to}`}>
      {children}
    </span>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group cursor-pointer">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition">
        {title}
      </h3>
      <p className="text-gray-400">
        {description}
      </p>
    </Card>
  );
}

interface PricingCardProps {
  name: string;
  price: number;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  onSelect: () => void;
}

export function PricingCard({ 
  name, 
  price, 
  period = '/月', 
  description, 
  features, 
  popular = false,
  onSelect 
}: PricingCardProps) {
  return (
    <div className={`
      p-8 rounded-2xl border
      ${popular 
        ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 scale-105' 
        : 'bg-white/5 border-white/10'
      }
    `}>
      {popular && (
        <div className="inline-block px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full mb-4">
          最受欢迎
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <p className="text-gray-400 text-sm mb-6">{description}</p>
      
      <div className="mb-6">
        <span className="text-5xl font-bold text-white">¥{price}</span>
        <span className="text-gray-400">{period}</span>
      </div>
      
      <div className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        variant={popular ? 'primary' : 'secondary'}
        className="w-full"
        onClick={onSelect}
      >
        开始使用
      </Button>
    </div>
  );
}

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export function TestimonialCard({ name, role, content, avatar }: TestimonialCardProps) {
  return (
    <Card>
      <div className="text-4xl mb-4">{avatar}</div>
      <p className="text-gray-300 mb-6 italic">&quot;{content}&quot;</p>
      <div>
        <div className="font-bold text-white">{name}</div>
        <div className="text-sm text-gray-400">{role}</div>
      </div>
    </Card>
  );
}
