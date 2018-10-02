import { action, store, asyncAction } from '../lib/redx';

@store
export default class CountStore {
    initialState = {
        counter: 10,
        delay: 0
    }

    // Examples of normal actions, which return new state
    increment = action(
        state => ({ counter: state.counter + 1 })
    );

    decrement = action(
        state => ({ counter: state.counter - 1 })
    );

    incrementStart = action(
        () => ({ delay: 5 })
    );

    countDown = action(
        state => ({ delay: state.delay - 1 })
    );

    // Example of async action which spawns child actions
    // Needs something like Redux Thunk to work
    incrementAsync = asyncAction(
        () => {
           return (dispatch, state) => {
                console.log(this);
                dispatch(this.incrementStart());
                const delayTimer = setInterval(
                    () => {
                        dispatch(this.countDown())
                    },
                    1000
                );
                setTimeout(
                    () => { 
                        dispatch(this.increment());
                        clearInterval(delayTimer);
                    },
                    5000
                );
            }
        }
    );
}