import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAppData } from '../app/AppDataProvider';
import { isPlainNavigationClick, setSpatialDirection } from './SpatialLink';

export default function AppShell({ children }) {
  const appData = useAppData();
  const savedTheme = appData?.data?.preferences?.theme === 'dark' ? 'dark' : 'light';
  const [theme, setTheme] = useState(savedTheme);
  useEffect(() => setTheme(savedTheme), [savedTheme]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#161a19' : '#f7f7f4');
  }, [theme]);
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    appData?.updateData?.((current) => ({ ...current, preferences: { ...(current.preferences ?? {}), theme: nextTheme } }), { immediate: true });
  };
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="app-header">
        <nav aria-label="Primary navigation">
          <NavLink to="/" end viewTransition onClick={(event) => { if (isPlainNavigationClick(event)) setSpatialDirection('back'); }}>Home</NavLink>
          <NavLink to="/journals" viewTransition onClick={(event) => { if (isPlainNavigationClick(event)) setSpatialDirection('forward'); }}>Journals</NavLink>
          <NavLink to="/settings" viewTransition onClick={(event) => { if (isPlainNavigationClick(event)) setSpatialDirection('forward'); }}>Settings</NavLink>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-pressed={theme === 'dark'} title={`Current theme: ${theme}`}>
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            <span className="theme-toggle__label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </nav>
      </header>
      <div id="main-content">{children}</div>
    </div>
  );
}
