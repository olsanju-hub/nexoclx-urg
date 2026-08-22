import { useEffect, useMemo, useState } from 'react';
import { appConfig, primarySections, secondarySections } from '../data/sections.js';
import { allClinicalItems, clinicalProtocols } from '../data/urgClinicalData.js';
import { routes } from './routes.js';
import { AppShell } from '../components/shell/AppShell.jsx';
import { Home } from '../screens/Home.jsx';
import { Protocols } from '../screens/Protocols.jsx';
import { ProtocolDetail } from '../screens/ProtocolDetail.jsx';
import { Tools } from '../screens/Tools.jsx';
import { More } from '../screens/More.jsx';
import { Procedures } from '../screens/Procedures.jsx';
import { Circuits } from '../screens/Circuits.jsx';
import { CircuitDetail } from '../screens/CircuitDetail.jsx';
import { Calculations } from '../screens/Calculations.jsx';
import { Sources } from '../screens/Sources.jsx';
import { MurilloBook } from '../screens/MurilloBook.jsx';
import { moduleBookReferences, murilloPdfUrl } from '../data/murilloBook.js';

const routeTitles = {
  [routes.home]: 'Inicio',
  [routes.protocols]: 'Protocolos',
  [routes.protocolDetail]: 'Protocolo',
  [routes.tools]: 'Herramientas',
  [routes.procedures]: 'Procedimientos',
  [routes.circuits]: 'Circuitos',
  [routes.circuitDetail]: 'Circuito',
  [routes.calculations]: 'Cálculos',
  [routes.sources]: 'Fuentes',
  [routes.murilloBook]: 'Murillo',
  [routes.more]: 'Más',
};

const parseHashState = () => {
  const rawHash = window.location.hash.replace(/^#\/?/, '');
  const [hashRoute, hashId] = rawHash.split('/');
  return {
    route: hashRoute || routes.home,
    selectedId: hashId || null,
  };
};

export default function App() {
  const initialHashState = parseHashState();
  const [route, setRoute] = useState(initialHashState.route);
  const [selectedId, setSelectedId] = useState(initialHashState.selectedId);

  const currentItem = useMemo(
    () => allClinicalItems.find((item) => item.id === selectedId) ?? null,
    [selectedId],
  );

  const navigate = (nextRoute, id = null) => {
    setRoute(nextRoute);
    setSelectedId(id);
    window.history.replaceState(null, '', `#/${nextRoute}${id ? `/${id}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const onHashChange = () => {
      const nextHashState = parseHashState();
      setRoute(nextHashState.route);
      setSelectedId(nextHashState.selectedId);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openItem = (id) => navigate(routes.protocolDetail, id);
  const openBookReference = () => {
    if (currentItem) {
      const reference = moduleBookReferences[currentItem.id];
      if (reference?.pdfPage) {
        window.open(murilloPdfUrl(reference.pdfPage), '_blank', 'noopener,noreferrer');
        return;
      }
    }
    navigate(routes.murilloBook);
  };

  return (
    <AppShell
      app={appConfig}
      route={route}
      title={routeTitles[route]}
      primarySections={primarySections}
      secondarySections={secondarySections}
      onNavigate={navigate}
      onBook={openBookReference}
    >
      {route === routes.home && <Home app={appConfig} sections={primarySections} onNavigate={navigate} onOpen={openItem} />}
      {route === routes.protocols && <Protocols protocols={clinicalProtocols} onOpen={openItem} />}
      {route === routes.protocolDetail && <ProtocolDetail item={currentItem} onBack={() => navigate(routes.protocols)} onOpen={openItem} />}
      {route === routes.tools && <Tools onOpen={openItem} />}
      {route === routes.procedures && <Procedures onOpen={openItem} />}
      {route === routes.circuits && <Circuits onOpen={openItem} />}
      {route === routes.circuitDetail && <CircuitDetail item={currentItem} onBack={() => navigate(routes.circuits)} />}
      {route === routes.calculations && <Calculations onOpen={openItem} />}
      {route === routes.sources && <Sources />}
      {route === routes.murilloBook && <MurilloBook item={currentItem} />}
      {route === routes.more && <More sections={secondarySections} onNavigate={navigate} />}
    </AppShell>
  );
}
