import { createContext, useContext, useReducer } from 'react';

// Shared demo state. The driver app, mechanic app and dispatch view all read
// from this one store, so actions on one side show up on the others when they
// are open in the same browser tab. A real build would replace this with a
// backend (e.g. a database with realtime updates).

export const PROBLEMS = ['tyre', 'battery', 'fuel', 'lock', 'heat', 'tow'];

export const PROBLEM_EN = {
  tyre: 'Flat tyre',
  battery: "Won't start",
  fuel: 'Out of fuel',
  lock: 'Locked out',
  heat: 'Overheating',
  tow: 'Need a tow',
};

export const SAFETY_CODE = '4821';

const initial = {
  providerOnline: true,
  job: null, // { id, problem, safe, note, status, history: [{status, at}] }
  sosActive: false,
  log: [],
};

function stamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function withLog(state, msg, tone = 'info') {
  return { ...state, log: [{ at: stamp(), msg, tone }, ...state.log].slice(0, 30) };
}

function advance(job, status) {
  return { ...job, status, history: [...job.history, { status, at: stamp() }] };
}

function reducer(state, action) {
  switch (action.type) {
    case 'request': {
      const job = {
        id: 'OK-' + String(1000 + Math.floor(Math.random() * 9000)),
        problem: action.problem,
        safe: action.safe,
        note: action.note || '',
        status: 'searching',
        history: [{ status: 'searching', at: stamp() }],
      };
      const s = { ...state, job };
      return withLog(s, `${job.id}: new request, ${PROBLEM_EN[job.problem]}${job.safe === false ? ' (driver may be unsafe)' : ''}`, job.safe === false ? 'alert' : 'info');
    }
    case 'cancel':
      if (!state.job) return state;
      return withLog({ ...state, job: null }, `${state.job.id}: cancelled by driver`);
    case 'decline':
      if (!state.job) return state;
      return withLog(state, `${state.job.id}: declined by Peter Mwangi, still searching`);
    case 'accept':
      if (!state.job) return state;
      return withLog({ ...state, job: advance(state.job, 'accepted') }, `${state.job.id}: accepted by Peter Mwangi`);
    case 'arrive':
      if (!state.job) return state;
      return withLog({ ...state, job: advance(state.job, 'working') }, `${state.job.id}: mechanic on site, safety code confirmed`);
    case 'complete':
      if (!state.job) return state;
      return withLog({ ...state, job: advance(state.job, 'complete') }, `${state.job.id}: job marked complete, payment requested`);
    case 'pay':
      if (!state.job) return state;
      return withLog({ ...state, job: advance(state.job, 'paid') }, `${state.job.id}: paid via M-Pesa`);
    case 'close':
      if (!state.job) return state;
      return withLog({ ...state, job: null }, `${state.job.id}: closed${action.rating ? `, rated ${action.rating}/5` : ''}`);
    case 'toggleOnline':
      return withLog({ ...state, providerOnline: !state.providerOnline }, `Peter Mwangi is now ${state.providerOnline ? 'offline' : 'online'}`);
    case 'sos':
      return withLog({ ...state, sosActive: true }, 'SOS opened by driver near Limuru', 'alert');
    case 'sosClose':
      return withLog({ ...state, sosActive: false }, 'Driver closed SOS and reported safe');
    case 'sosShare':
      return withLog(state, 'Driver sent live location to emergency contacts', 'alert');
    case 'resetAll':
      return initial;
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
