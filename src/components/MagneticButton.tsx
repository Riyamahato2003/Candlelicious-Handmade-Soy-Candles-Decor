import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

export const MagneticButton: React.FC<MagneticProps> = ({
  children,
  className = '',
  to,
  onClick,
  type = 'button',
  disabled = false,
  ariaLabel,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: dx * 0.14, y: dy * 0.18 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style: React.CSSProperties = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: offset.x === 0 && offset.y === 0 ? 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 80ms linear',
  };

  if (to) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        to={to}
        aria-label={ariaLabel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 ${className}`}
    >
      {children}
    </button>
  );
};
