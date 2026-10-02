import { useState } from 'react';
import { useStore, PROBLEM_EN, SAFETY_CODE } from './store.jsx';
import { Icon, Logo, MapArt, Toast, useToast } from './ui.jsx';

export default function Provider() {
  const { state, dispatch } = useStore();
  const [toast, showToast] = useToast();
  const [declinedId, setDeclinedId] = useState(null);
  const [dismissedId, setDismissedId] = useState(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  const job = state.job;
  const online = state.providerOnline;

  let view = 'waiting';
  if (!online) view = 'offline';
  else if (job && job.id !== dismissedId) {
    if (job.status === 'searching') view = job.id === declinedId ? 'waiting' : 'incoming';
    else if (job.status === 'accepted') view = 'enroute';
    else if (job.status === 'working') view = 'working';
    else if (job.status === 'complete') view = 'awaiting';
    else if (job.status === 'paid') view = 'paid';
  }

  const accept = () => { setCode(''); setCodeError(false); dispatch({ type: 'accept' }); showToast('Job accepted. The driver can now see you on the map'); };
  const decline = () => { setDeclinedId(job.id); dispatch({ type: 'decline' }); };
  const start = () => {
    if (code.trim() === SAFETY_CODE) dispatch({ type: 'arrive' });
    else setCodeError(true);
  };
  const testJob = () => { setDeclinedId(null); setDismissedId(null); dispatch({ type: 'request', problem: 'tyre', safe: false, note: "Rear left tyre, I'm parked past the Shell station" }); };

  return (
    <div className="app" lang="en">
      <div className="partner-bar">
        <div className="stack-2">
          <Logo suffix="Partner" />
          <span className="muted small">Peter Mwangi, mobile mechanic</span>
        </div>
        <button className="online-toggle" aria-pressed={online} onClick={() => dispatch({ type: 'toggleOnline' })}>
          {online ? 'Online' : 'Offline'}
        </button>
      </div>

      {(view === 'waiting' || view === 'offline') && (
        <div className="center-screen stack-18">
          <h2 className="app-h2 m0">{view === 'offline' ? "You're offline" : 'Waiting for jobs'}</h2>
          <p className="muted body m0">
            {view === 'offline'
              ? 'Go online to start receiving requests from drivers near you.'
              : "We'll alert you when a driver nearby needs help. Requests made in the driver app show up here."}
          </p>
          {view === 'waiting' && !job && <button className="btn btn-demo" onClick={testJob}>Prototype: send a test job</button>}
        </div>
      )}

      {view === 'incoming' && (
        <div className="scroll pad stack-16">
          <span className="tag">New job request</span>
          <h2 className="app-h2 m0">{PROBLEM_EN[job.problem]}</h2>
          <div className="card flush"><MapArt variant="job" height={140} /></div>
          <div className="grid-2 gap-10">
            <div className="card tight stack-4"><span className="muted small">Distance</span><span className="price">3.2 km</span></div>
            <div className="card tight stack-4"><span className="muted small">You earn</span><span className="price">KSh [amount]</span></div>
          </div>
          <div className="card stack-6">
            <span className="strong">Wanjiru, Toyota Fielder KDA 123X</span>
            <span className="soft small">A104 Nairobi–Nakuru Highway, near Limuru</span>
            {job.note ? <span className="soft small">Note: “{job.note}”</span> : null}
            {job.safe === false ? <span className="red-text small strong">Driver may not be in a safe spot. Prioritise this job.</span> : null}
          </div>
          <div className="grid-2 gap-10 push-bottom">
            <button className="btn btn-ghost btn-lg" onClick={decline}>Decline</button>
            <button className="btn btn-primary btn-lg" onClick={accept}>Accept</button>
          </div>
        </div>
      )}

      {view === 'enroute' && (
        <div className="scroll pad stack-16">
          <span className="muted small">Heading to driver</span>
          <h2 className="app-h2 m0">12 min away</h2>
          <div className="grid-2 gap-10">
            <button className="action row" onClick={() => showToast('Prototype: this would open turn-by-turn directions')}><Icon name="nav" size={18} stroke={2} />Navigate</button>
            <button className="action row" onClick={() => showToast('Prototype: this would call the driver')}><Icon name="phone" size={18} stroke={2} />Call driver</button>
          </div>
          <div className="stack-8">
            <label htmlFor="code" className="strong">On arrival, enter the driver's code</label>
            <input id="code" inputMode="numeric" maxLength={4} className="field field-code" placeholder="0000" value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setCodeError(false); }} aria-describedby="code-hint" />
            <span id="code-hint" className={codeError ? 'red-text small' : 'muted small'}>
              {codeError ? "That code doesn't match. Ask the driver to read it from their screen." : `The driver sees this code in their app. Prototype hint: ${SAFETY_CODE}`}
            </span>
          </div>
          <button className="btn btn-primary btn-lg push-bottom" onClick={start}>Confirm arrival and start job</button>
        </div>
      )}

      {view === 'working' && (
        <div className="scroll pad stack-16">
          <span className="muted small">Job in progress</span>
          <h2 className="app-h2 m0">{PROBLEM_EN[job.problem]}, Wanjiru</h2>
          <div className="card stack-10">
            <span className="strong">Final price</span>
            <span className="soft small">Agree the amount with the driver before you finish. Any change from the estimate needs their approval in the app.</span>
            <span className="price-lg">KSh [final price]</span>
          </div>
          <button className="btn btn-primary btn-lg push-bottom" onClick={() => dispatch({ type: 'complete' })}>Mark job complete</button>
        </div>
      )}

      {(view === 'awaiting' || view === 'paid') && (
        <div className="center-screen stack-18">
          <span className="done-badge"><Icon name="check" size={28} stroke={3} /></span>
          <h2 className="app-h2 m0">{view === 'paid' ? 'Payment received' : 'Payment requested'}</h2>
          <p className="muted body m0">
            {view === 'paid'
              ? 'The driver paid via M-Pesa. Your earnings are in your wallet.'
              : 'The driver has an M-Pesa prompt on their phone. You’ll be notified once they pay.'}
          </p>
          {view === 'paid' && <button className="btn btn-primary btn-lg" onClick={() => setDismissedId(job.id)}>Back to jobs</button>}
        </div>
      )}

      <Toast msg={toast} />
    </div>
  );
}
