import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import 'normalize.css/normalize.css';
import 'css/tag_popup.css';
import App from './container/PopUpApp';
import configureStore from './store/configurePopStore';

const store = configureStore();

render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./container/App', () => {
    render(
      <AppContainer>
        <Provider store={store}>
          <App />         
        </Provider>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
