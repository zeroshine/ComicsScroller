import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/popup';

const logger = createLogger();
let createStoreWithMiddleware = applyMiddleware(logger)(createStore);

if (process.env.NODE_ENV === 'production') {
  createStoreWithMiddleware = createStore;
}

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  // sagaMiddleware.run(sagas);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/popup', () => {
      const nextReducer = require('../reducers/popup'); // eslint-disable-line
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
