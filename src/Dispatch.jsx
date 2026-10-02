import { useStore, PROBLEM_EN } from './store.jsx';

const STEPS = [
  ['searching', 'Requested'],
  ['accepted', 'Mechanic assigned'],
  ['working', 'On site'],
  ['complete', 'Job complete'],
  ['paid', 'Paid'],
];

export default function Dispatch() {
  const { state, dispatch } = useStore();
  const job = state.job;
  const reached = new Map((job?.history || []).map((h) => [h.status, h.at]));

  return (
    <div className="dispatch">
      <div className="dispatch-grid">
        <section className="panel">
          <h2 className="panel-title">Active request</h2>
          {job ? (
            <div className="stack-16">
              <div className="row-between wrap gap-10">
                <span className="job-id">{job.id}</span>
                {job.safe === false ? <span className="flag">Driver may be unsafe</span> : null}
              </div>
              <dl className="facts">
                <div><dt>Problem</dt><dd>{PROBLEM_EN[job.problem]}</dd></div>
                <div><dt>Driver</dt><dd>Wanjiru, Toyota Fielder KDA 123X</dd></div>
                <div><dt>Location</dt><dd>A104 Nairobi–Nakuru Highway, near Limuru</dd></div>
                <div><dt>Mechanic</dt><dd>{job.status === 'searching' ? 'Not yet assigned' : 'Peter Mwangi'}</dd></div>
                {job.note ? <div><dt>Driver note</dt><dd>{job.note}</dd></div> : null}
              </dl>
              <ol className="timeline">
                {STEPS.map(([key, label]) => (
                  <li key={key} className={reached.has(key) ? 'done' : ''}>
                    <span className="tl-label">{label}</span>
                    <span className="tl-time">{reached.get(key) || 'Pending'}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="muted body">No active requests. Start one from the driver app and it will appear here as it moves through each stage.</p>
          )}
        </section>

        <section className="panel">
          <h2 className="panel-title">Network</h2>
          <div className="stack-12">
            <div className="row-between">
              <span>Peter Mwangi, mobile mechanic</span>
              <span className={state.providerOnline ? 'status on' : 'status'}>{state.providerOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="row-between">
              <span>SOS</span>
              <span className={state.sosActive ? 'status alert' : 'status'}>{state.sosActive ? 'Active now' : 'None open'}</span>
            </div>
          </div>
        </section>

        <section className="panel span-2">
          <div className="row-between">
            <h2 className="panel-title m0">Activity</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'resetAll' })}>Reset demo</button>
          </div>
          {state.log.length ? (
            <ul className="log">
              {state.log.map((l, i) => (
                <li key={i} className={l.tone === 'alert' ? 'alert-row' : ''}>
                  <time>{l.at}</time><span>{l.msg}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted body">Every action from drivers and mechanics is logged here.</p>
          )}
        </section>
      </div>
    </div>
  );
}
