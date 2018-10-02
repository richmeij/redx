import React from 'react';
import { observer } from '../lib/redx-react';
import CountStore from './CountStore';

// Create our app
export const App = ({ countStore, title }) => {
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

export default observer(CountStore)(App);