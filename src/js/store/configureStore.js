import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from '../reducers';
import rootEpic from '../epics';

const logger = createLogger();
const epicMiddleware = createEpicMiddleware(rootEpic);

let createStoreWithMiddleware = applyMiddleware(epicMiddleware, logger)(
  createStore,
);

if (process.env.NODE_ENV === 'production') {
  createStoreWithMiddleware = applyMiddleware(epicMiddleware)(createStore);
}

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  // sagaMiddleware.run(sagas);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers'); //eslint-disable-line
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
