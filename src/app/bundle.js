import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import CountStore from './CountStore';
import App from './app';
import { createStore } from '../lib/redux-util';

const store = createStore(CountStore)(thunk);

// render the app in the DOM
render(
        <Provider store={store}>
            <App title="count demo" />
        </Provider>
    , document.querySelector('#root')
);