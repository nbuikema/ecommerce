import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './redux/reducers';

import * as serviceWorker from './serviceWorker';

import App from './App';

import './index.css';
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';

const store = createStore(rootReducer, composeWithDevTools());
const persistor = persistStore(store);

ReactDOM.render(
  //<React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  //</React.StrictMode>
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
