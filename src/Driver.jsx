import { useEffect, useRef, useState } from 'react';
import { useStore, PROBLEMS, SAFETY_CODE } from './store.jsx';
import { useLang } from './i18n.jsx';
import { Icon, Logo, MapArt, Toast, useToast } from './ui.jsx';

const STATUS_VIEW = { searching: 'searching', accepted: 'enroute', working: 'working', complete: 'pay', paid: 'rate' };

export default function Driver() {
  const { state, dispatch } = useStore();
  const { t, lang, setLang } = useLang();
  const [toast, showToast] = useToast();

  const [screen, setScreen] = useState('home');
  const [problem, setProblem] = useState(null);
  const [safe, setSafe] = useState(null);
  const [note, setNote] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [sos, setSos] = useState(false);
  const [contactsShared, setContactsShared] = useState(false);
  const [tripShared, setTripShared] = useState(false);

  const job = state.job;
  const status = job?.status;
  const activeProblem = job?.problem ?? problem;
  const problemLabel = activeProblem ? t(`p_${activeProblem}`) : '';

  // Announce acceptance when the mechanic side accepts.
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === 'searching' && status === 'accepted') showToast(t('accepted'));
    if (prevStatus.current && !status) { setScreen('home'); setProblem(null); setSafe(null); setNote(''); setRating(0); setTripShared(false); }
    prevStatus.current = status;
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const view = sos ? 'sos' : job ? STATUS_VIEW[status] : screen;

  const openSos = () => { setSos(true); setContactsShared(false); dispatch({ type: 'sos' }); };
  const closeSos = () => { setSos(false); dispatch({ type: 'sosClose' }); };

  const request = () => dispatch({ type: 'request', problem, safe, note });

  const finish = () => {
    dispatch({ type: 'close', rating });
    showToast(t('thanks'));
  };

  const BackBar = ({ to, step }) => (
    <div className="topbar">
      <button className="icon-btn" onClick={() => setScreen(to)} aria-label={t('back')}><Icon name="back" size={24} /></button>
      <span className="muted small">{t('step', { n: step })}</span>
    </div>
  );

  return (
    <div className="app" lang={lang}>
      {view === 'home' && (
        <div className="scroll pad stack-20">
          <div className="row-between">
            <Logo />
            <div className="lang-toggle" role="group" aria-label="Language">
              <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              <button aria-pressed={lang === 'sw'} onClick={() => setLang('sw')}>SW</button>
            </div>
          </div>
          <div>
            <p className="muted m0">{t('greeting')}</p>
            <h1 className="app-h1">{t('headline')}</h1>
          </div>
          <div className="card flush">
            <MapArt variant="home" />
            <div className="card-body stack-4">
              <span className="muted small">{t('yourLocation')}</span>
              <span className="strong">{t('location')}</span>
              <span className="muted small">{t('locationNote')}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-xl" onClick={() => setScreen('problem')}>
            <Icon name="wrench" /> {t('getHelp')}
          </button>
          <button className="btn btn-sos" onClick={openSos}>
            <span className="sos-badge">SOS</span>
            <span className="stack-2 left">
              <span className="sos-title">{t('emergency')}</span>
              <span className="small">{t('emergencySub')}</span>
            </span>
          </button>
          <div className="card stack-10">
            <span className="strong">{t('coverTitle')}</span>
            <span className="soft body">{t('coverBody')}</span>
            <button className="btn btn-outline self-start" onClick={() => showToast(t('coverToast'))}>{t('checkCover')}</button>
          </div>
        </div>
      )}

      {view === 'problem' && (
        <div className="screen">
          <BackBar to="home" step={1} />
          <div className="scroll pad-x stack-18">
            <h2 className="app-h2">{t('whatsWrong')}</h2>
            <div className="grid-2">
              {PROBLEMS.map((p) => (
                <button key={p} className="tile" aria-pressed={problem === p} onClick={() => setProblem(p)}>
                  <span className="tile-title">{t(`p_${p}`)}</span>
                  <span className="muted small">{t(`h_${p}`)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="footer">
            <button className="btn btn-primary btn-lg full" disabled={!problem} onClick={() => setScreen('details')}>{t('continue')}</button>
          </div>
        </div>
      )}

      {view === 'details' && (
        <div className="screen">
          <BackBar to="problem" step={2} />
          <div className="scroll pad-x stack-16">
            <h2 className="app-h2">{t('confirmTitle')}</h2>
            <div className="card stack-10">
              <div className="kv"><span className="muted small">{t('problem')}</span><span className="strong">{problemLabel}</span></div>
              <div className="kv"><span className="muted small">{t('locationLabel')}</span><span className="strong right">{t('locationShort')}</span></div>
              <div className="kv"><span className="muted small">{t('vehicle')}</span><span className="strong">Toyota Fielder, KDA 123X</span></div>
            </div>
            <fieldset className="stack-10 bare">
              <legend className="strong mb-10">{t('safeQ')}</legend>
              <div className="grid-2 gap-10">
                <button className="choice" aria-pressed={safe === true} onClick={() => setSafe(true)}>{t('safeYes')}</button>
                <button className="choice danger" aria-pressed={safe === false} onClick={() => setSafe(false)}>{t('safeNo')}</button>
              </div>
            </fieldset>
            {safe === false && (
              <div className="alert stack-8">
                <span className="strong">{t('unsafeTitle')}</span>
                <span className="body alert-text">{t('unsafeBody')}</span>
                <button className="btn btn-sos-sm self-start" onClick={openSos}>{t('openSos')}</button>
              </div>
            )}
            <div className="stack-8">
              <label htmlFor="note" className="strong">{t('noteLabel')}</label>
              <textarea id="note" rows={3} className="field" placeholder={t('notePh')} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="estimate">
              <div className="stack-2">
                <span className="muted small">{t('estimate')}</span>
                <span className="price">KSh [estimate]</span>
              </div>
              <span className="muted small right narrow">{t('payAfter')}</span>
            </div>
          </div>
          <div className="footer">
            <button className="btn btn-primary btn-lg full" onClick={request}>{t('requestHelp')}</button>
          </div>
        </div>
      )}

      {view === 'searching' && (
        <div className="center-screen stack-22">
          <svg className="radar" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="96" fill="none" stroke="#F5A524" strokeOpacity="0.12" strokeWidth="2" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#F5A524" strokeOpacity="0.25" strokeWidth="2" />
            <circle className="radar-pulse" cx="100" cy="100" r="44" fill="#F5A524" fillOpacity="0.15" stroke="#F5A524" strokeOpacity="0.5" strokeWidth="2" />
            <circle cx="100" cy="100" r="12" fill="#F5A524" />
            <circle cx="160" cy="62" r="6" fill="#A9B4C0" />
            <circle cx="48" cy="140" r="6" fill="#A9B4C0" />
            <circle cx="150" cy="150" r="6" fill="#A9B4C0" />
          </svg>
          <h2 className="app-h2 m0">{t('searching')}</h2>
          <p className="muted body m0">{t('searchingBody', { p: problemLabel })}</p>
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'cancel' })}>{t('cancel')}</button>
          <button className="btn btn-demo" onClick={() => dispatch({ type: 'accept' })}>{t('simAccept')}</button>
        </div>
      )}

      {(view === 'enroute' || view === 'working') && (
        <div className="screen">
          <div className="map-wrap">
            <MapArt variant="route" height={280} />
            <div className="map-overlay">
              <span className="pill">{view === 'enroute' ? t('onTheWay') : t('working')}</span>
              <button className="btn btn-sos-sm round" onClick={openSos}>SOS</button>
            </div>
          </div>
          <div className="sheet scroll stack-16">
            {view === 'enroute' ? (
              <div className="stack-4">
                <span className="muted small">{t('arrivingIn')}</span>
                <span className="eta">{t('eta')}</span>
              </div>
            ) : (
              <div className="stack-4">
                <span className="eta-sm">{t('working')}</span>
                <span className="muted small">{t('workingBody')}</span>
              </div>
            )}
            <div className="card provider">
              <span className="avatar">PM</span>
              <div className="stack-2 grow">
                <span className="strong">Peter Mwangi</span>
                <span className="muted small">{t('providerSub')}</span>
                <span className="amber small strong">{t('verified')}</span>
              </div>
            </div>
            <div className="grid-3">
              <button className="action" onClick={() => showToast(t('callPeter'))}><Icon name="phone" size={20} stroke={2} />{t('call')}</button>
              <button className="action" onClick={() => showToast(t('msgPeter'))}><Icon name="message" size={20} stroke={2} />{t('message')}</button>
              <button className="action" onClick={() => { setTripShared(true); showToast(t('tripToast')); }}><Icon name="share" size={20} stroke={2} />{tripShared ? t('shared') : t('shareTrip')}</button>
            </div>
            {view === 'enroute' && (
              <div className="code-box">
                <span className="soft body">{t('codeText')}</span>
                <span className="code">{SAFETY_CODE}</span>
              </div>
            )}
            {view === 'enroute' ? (
              <button className="btn btn-demo" onClick={() => dispatch({ type: 'arrive' })}>{t('simArrive')}</button>
            ) : (
              <button className="btn btn-demo" onClick={() => dispatch({ type: 'complete' })}>{t('simComplete')}</button>
            )}
          </div>
        </div>
      )}

      {view === 'pay' && (
        <div className="screen">
          <div className="scroll pad stack-18 pt-40">
            <span className="done-badge"><Icon name="check" size={28} stroke={3} /></span>
            <h2 className="app-h2">{t('jobDone')}</h2>
            <div className="card stack-10">
              <div className="kv"><span className="muted small">{t('service')}</span><span className="strong">{problemLabel}</span></div>
              <div className="kv"><span className="muted small">{t('mechanic')}</span><span className="strong">Peter Mwangi</span></div>
              <div className="divider" />
              <div className="kv"><span className="strong">{t('total')}</span><span className="price">KSh [final price]</span></div>
            </div>
            <div className="stack-8">
              <label htmlFor="mpesa" className="strong">{t('mpesaLabel')}</label>
              <input id="mpesa" type="tel" inputMode="tel" className="field field-lg" placeholder="07XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <span className="muted small">{t('mpesaHint')}</span>
            </div>
          </div>
          <div className="footer">
            <button className="btn btn-primary btn-lg full" onClick={() => { dispatch({ type: 'pay' }); showToast(t('mpesaSent')); }}>{t('pay')}</button>
          </div>
        </div>
      )}

      {view === 'rate' && (
        <div className="center-screen stack-22">
          <h2 className="app-h2 m0">{t('rateTitle')}</h2>
          <p className="muted body m0">{t('rateBody')}</p>
          <div className="stars" role="group" aria-label={t('rateTitle')}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className="star" aria-label={t('star', { n })} aria-pressed={n <= rating} onClick={() => setRating(n)}>
                <svg width="38" height="38" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={n <= rating ? '#F5A524' : '#3A4552'} /></svg>
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-lg full" onClick={finish}>{t('done')}</button>
        </div>
      )}

      {view === 'sos' && (
        <div className="screen">
          <div className="sos-head stack-10">
            <button className="btn btn-on-red self-start" onClick={closeSos}>{t('sosClose')}</button>
            <h2 className="app-h2 m0">{t('emergency')}</h2>
            <span className="body">{t('location')}</span>
          </div>
          <div className="scroll pad stack-12">
            {[['999', t('policeAmb')], ['112', t('emergencyLine')], ['1199', t('redCross')]].map(([num, name]) => (
              <a key={num} className="dial" href={`tel:${num}`} onClick={(e) => { e.preventDefault(); showToast(t('callToast', { x: num })); }}>
                <span>{name}</span><span className="dial-num">{num}</span>
              </a>
            ))}
            <button className="btn btn-outline full btn-lg" onClick={() => { setContactsShared(true); dispatch({ type: 'sosShare' }); }}>
              {contactsShared ? t('sentLoc') : t('sendLoc')}
            </button>
            <div className="card stack-8">
              <span className="strong">{t('waitTitle')}</span>
              <span className="soft body">{t('waitBody')}</span>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toast} />
    </div>
  );
}
