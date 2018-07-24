import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import countStore from './countStore';
import { observer } from '../lib/redx-react';

// Create store
const store = createStore(
    combineReducers({ countStore }), 
    applyMiddleware(thunk)
);

// Create our app
const App = ({ countStore, title }) => {
    const { counter, delay, increment, decrement, incrementAsync } = countStore;
    const disabled = delay > 0;
    return (
        <React.Fragment>
            <h1>{ title }</h1>
            <p>
                <button onClick={() => decrement()} disabled={disabled}>-</button>
                &nbsp;<em>{ counter }</em>&nbsp;
                <button onClick={() => increment()} disabled={disabled}>+</button>
            </p>
            <p>
                <button onClick={() => incrementAsync()} disabled={disabled}>Async + (5 decond delay)</button>
            </p>
            <p>
                { delay > 0
                    ? <span>Fetching next increment. ETA {delay} seconds...</span>
                    : null
                }
            </p>
        </React.Fragment>
    );
};

// Create a version of our app, which observes the countStore
const ObserverApp = observer(countStore)(App);

// render the app in the DOM
render(
        <Provider store={store}>
            <ObserverApp title="count demo" />
        </Provider>
    , document.querySelector('#root')
);