import { useEffect, useState } from 'react';
import { StoreProvider } from './store.jsx';
import { LangProvider } from './i18n.jsx';
import { Logo, Phone } from './ui.jsx';
import Driver from './Driver.jsx';
import Provider from './Provider.jsx';
import Dispatch from './Dispatch.jsx';

function useHashRoute() {
  const read = () => window.location.hash.replace(/^#/, '') || '/';
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

const NAV = [
  ['/', 'Live demo'],
  ['/driver', 'Driver app'],
  ['/provider', 'Mechanic app'],
  ['/dispatch', 'Dispatch'],
];

function Header({ route }) {
  return (
    <header className="site-header">
      <a href="#/" className="brand-link" aria-label="Okoa home"><Logo /></a>
      <nav aria-label="Prototype views">
        {NAV.map(([path, label]) => (
          <a key={path} href={`#${path}`} aria-current={route === path ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

function Landing() {
  const [tab, setTab] = useState('driver');
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <h1 className="display">Broken down on the highway? Get a trusted mechanic to you, fast.</h1>
          <p className="lede">
            Okoa connects stranded drivers with verified mechanics, tow trucks and fuel delivery nearby, with
            an emergency button for when it's more than a breakdown.
          </p>
          <p className="hint">
            Both phones are live and connected. Request help as the driver and watch the job arrive on the mechanic's phone.
          </p>
        </div>
        <div className="hero-demo">
          <div className="demo-tabs" role="tablist" aria-label="Choose a phone">
            <button role="tab" aria-selected={tab === 'driver'} onClick={() => setTab('driver')}>Driver</button>
            <button role="tab" aria-selected={tab === 'provider'} onClick={() => setTab('provider')}>Mechanic</button>
          </div>
          <div className="phones" data-tab={tab}>
            <figure className="phone-fig is-driver">
              <figcaption>Driver</figcaption>
              <Phone label="Driver app demo"><Driver /></Phone>
            </figure>
            <div className="lane" aria-hidden="true" />
            <figure className="phone-fig is-provider">
              <figcaption>Mechanic</figcaption>
              <Phone label="Mechanic app demo"><Provider /></Phone>
            </figure>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">How a rescue works</h2>
        <ol className="steps">
          <li><h3>Say what's wrong</h3><p>The driver picks the problem and the app sends their location. No need to describe where they are.</p></li>
          <li><h3>A verified mechanic accepts</h3><p>The nearest available provider gets the job, with a flag if the driver may not be safe.</p></li>
          <li><h3>Confirm with a code</h3><p>The mechanic enters the driver's four-digit code on arrival, so the driver knows who they're letting near their car.</p></li>
          <li><h3>Pay with M-Pesa</h3><p>The driver pays once the work is done and rates the mechanic, which keeps the network reliable.</p></li>
        </ol>
      </section>

      <section className="section">
        <h2 className="section-title">Built for Kenyan roads</h2>
        <dl className="features">
          <div><dt>Emergency first</dt><dd>One tap reaches 999, 112 and Kenya Red Cross, and shares the driver's live location with their own contacts.</dd></div>
          <div><dt>M-Pesa payments</dt><dd>No cards or cash on a dark roadside. Payment is requested only after the job is complete.</dd></div>
          <div><dt>English and Swahili</dt><dd>Drivers can switch language from the home screen of the app.</dd></div>
          <div><dt>Cover you already have</dt><dd>Many motor policies include roadside rescue drivers don't know about. Okoa can show them what's included.</dd></div>
          <div><dt>Visibility for operators</dt><dd>A dispatch view tracks every request from first tap to payment, and surfaces SOS alerts.</dd></div>
        </dl>
      </section>

      <footer className="site-footer">
        <p>Okoa is a prototype for testing and pitching. It does not dispatch real mechanics or contact emergency services. In an emergency, dial 999 or 112.</p>
      </footer>
    </main>
  );
}

function Single({ title, children }) {
  return (
    <main className="single">
      <h1 className="single-title">{title}</h1>
      <Phone label={title}>{children}</Phone>
    </main>
  );
}

function Routes() {
  const route = useHashRoute();
  let page;
  if (route === '/driver') page = <Single title="Driver app"><Driver /></Single>;
  else if (route === '/provider') page = <Single title="Mechanic app"><Provider /></Single>;
  else if (route === '/dispatch') page = (
    <main className="single wide">
      <h1 className="single-title">Dispatch</h1>
      <p className="muted body narrow-copy">Open the driver or mechanic app in the menu, take some actions, then come back here. This view shares the same demo session.</p>
      <Dispatch />
    </main>
  );
  else page = <Landing />;
  return (
    <>
      <Header route={route} />
      {page}
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <LangProvider>
        <Routes />
      </LangProvider>
    </StoreProvider>
  );
}
