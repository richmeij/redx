import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import countStore from './countStore';
import App from './app';

// Create store
const store = createStore(
    combineReducers({ countStore }), 
    applyMiddleware(thunk)
);

// render the app in the DOM
render(
        <Provider store={store}>
            <App title="count demo" />
        </Provider>
    , document.querySelector('#root')
);