import React, { useEffect, useRef, useState } from 'react';
import { Circle, Monitor, Moon, Sun } from 'lucide-react';
import { Theme, useTheme } from '../../context/ThemeContext';

const themeOptions: Array<{
  label: string;
  value: Theme;
  icon: React.ElementType;
}> = [
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Dark', value: 'dark', icon: Moon },
  { label: 'Pure Dark', value: 'pure-dark', icon: Circle },
  { label: 'System', value: 'system', icon: Monitor },
];

const ThemeToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const activeTheme = themeOptions.find((option) => option.value === theme) ?? themeOptions[1];
  const ActiveIcon = activeTheme.icon;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="h-9 flex items-center gap-2 rounded-md border border-border bg-bg-tertiary px-3 text-xs font-body font-medium text-text-secondary hover:border-border-accent hover:bg-bg-hover hover:text-text-primary transition-all duration-150"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <ActiveIcon size={15} />
        <span>{activeTheme.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-lg border border-border bg-bg-tertiary shadow-dropdown z-50">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = option.value === theme;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs font-body transition-colors duration-150
                  ${isActive ? 'bg-bg-secondary text-text-primary' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'}`}
                role="menuitemradio"
                aria-checked={isActive}
              >
                <Icon size={15} className="flex-shrink-0" />
                <span className="flex-1">{option.label}</span>
                <span
                  className={`h-2 w-2 rounded-full ${isActive ? 'bg-accent-primary' : 'bg-transparent border border-border-accent'}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
