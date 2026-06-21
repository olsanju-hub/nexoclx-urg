import { useEffect, useMemo, useState } from 'react';
import { appConfig, primarySections, secondarySections } from '../data/sections.js';
import { placeholderProtocols } from '../data/placeholders.js';
import { routes } from './routes.js';
import { AppShell } from '../components/shell/AppShell.jsx';
import { Home } from '../screens/Home.jsx';
import { Protocols } from '../screens/Protocols.jsx';
import { ProtocolDetail } from '../screens/ProtocolDetail.jsx';
import { Tools } from '../screens/Tools.jsx';
import { More } from '../screens/More.jsx';
import { Bibliography } from '../screens/Bibliography.jsx';
import { Procedures } from '../screens/Procedures.jsx';
import { Circuits } from '../screens/Circuits.jsx';
import { CircuitDetail } from '../screens/CircuitDetail.jsx';
import { Calculations } from '../screens/Calculations.jsx';
import { Sources } from '../screens/Sources.jsx';

const routeTitles = {
  [routes.home]: 'Inicio',
  [routes.protocols]: 'Protocolos',
  [routes.protocolDetail]: 'Protocolo',
  [routes.tools]: 'Herramientas',
  [routes.bibliography]: 'Bibliografia',
  [routes.procedures]: 'Procedimientos',
  [routes.circuits]: 'Circuitos',
  [routes.circuitDetail]: 'Circuito',
  [routes.calculations]: 'Calculos',
  [routes.sources]: 'Fuentes',
  [routes.more]: 'Mas',
};

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#/', '') || routes.home);
  const [selectedId, setSelectedId] = useState(null);

  const currentProtocol = useMemo(
    () => placeholderProtocols.find((item) => item.id === selectedId) ?? placeholderProtocols[0],
    [selectedId],
  );

  const navigate = (nextRoute, id = null) => {
    setRoute(nextRoute);
    setSelectedId(id);
    window.history.replaceState(null, '', `#/${nextRoute}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash.replace('#/', '') || routes.home);
      setSelectedId(null);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openProtocol = (id) => navigate(routes.protocolDetail, id);

  return (
    <AppShell
      app={appConfig}
      route={route}
      title={routeTitles[route]}
      primarySections={primarySections}
      secondarySections={secondarySections}
      onNavigate={navigate}
    >
      {route === routes.home && <Home app={appConfig} sections={primarySections} onNavigate={navigate} />}
      {route === routes.protocols && <Protocols protocols={placeholderProtocols} onOpen={openProtocol} />}
      {route === routes.protocolDetail && <ProtocolDetail protocol={currentProtocol} onBack={() => navigate(routes.protocols)} />}
      {route === routes.tools && <Tools app={appConfig} />}
      {route === routes.bibliography && <Bibliography />}
      {route === routes.procedures && <Procedures />}
      {route === routes.circuits && <Circuits onOpen={() => navigate(routes.circuitDetail)} />}
      {route === routes.circuitDetail && <CircuitDetail onBack={() => navigate(routes.circuits)} />}
      {route === routes.calculations && <Calculations />}
      {route === routes.sources && <Sources />}
      {route === routes.more && <More sections={secondarySections} onNavigate={navigate} />}
    </AppShell>
  );
}
