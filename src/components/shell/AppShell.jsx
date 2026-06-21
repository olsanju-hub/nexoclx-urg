import { bottomNavItems, desktopNavItems } from '../../data/sections.js';
import { routes } from '../../app/routes.js';
import { AppHeader } from './AppHeader.jsx';
import { BottomNav } from '../navigation/BottomNav.jsx';
import { DesktopNav } from '../navigation/DesktopNav.jsx';

export function AppShell({ app, route, title, primarySections, secondarySections, onNavigate, children }) {
  const isHome = route === routes.home;

  return (
    <div className="app-shell">
      <AppHeader app={app} title={title} isHome={isHome} onHome={() => onNavigate(routes.home)}>
        <DesktopNav items={desktopNavItems} activeRoute={route} onNavigate={onNavigate} />
      </AppHeader>
      <main className={`app-main ${isHome ? 'app-main-home' : 'app-main-inner'}`}>{children}</main>
      {!isHome && (
        <BottomNav
          items={bottomNavItems}
          activeRoute={route}
          onNavigate={onNavigate}
          primarySections={primarySections}
          secondarySections={secondarySections}
        />
      )}
    </div>
  );
}
