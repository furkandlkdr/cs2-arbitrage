'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'cs-arbitraj-theme';

function resolveSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  const resolvedTheme = mode === 'system' ? resolveSystemTheme() : mode;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
  window.localStorage.setItem(STORAGE_KEY, mode);
}

export default function ThemeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initialMode = savedTheme ?? 'system';
    setThemeMode(initialMode);
    applyTheme(initialMode);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    applyTheme(themeMode);

    const handleChange = () => {
      if (themeMode === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const options: Array<{ value: ThemeMode; label: string }> = [
    { value: 'system', label: 'Sistem' },
    { value: 'light', label: 'Açık' },
    { value: 'dark', label: 'Koyu' },
  ];

  return (
    <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
      {options.map((option) => {
        const active = themeMode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setThemeMode(option.value)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              active
                ? 'bg-[var(--accent-soft)] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--accent-border)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}