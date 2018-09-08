import { action, store, asyncAction } from '../lib/redx';

@store
export default class CountStore {
    initialState = {
        counter: 10,
        delay: 0
    }

    // Examples of 'normal' actions
    increment = action(
        state => ({ counter: state.counter + 1 })
    );

    decrement = action(
        state => ({ counter: state.counter - 1 })
    );

    // Example of async actions which spawns child actions
    incrementStart = action(
        () => ({ delay: 5 })
    );

    countDown = action(
        state => ({ delay: state.delay - 1 })
    );
    
    incrementAsync = asyncAction(
        () => {
           return (dispatch, actions, state) => {
                dispatch(actions.incrementStart());
                const delayTimer = setInterval(
                    () => {
                        dispatch(actions.countDown())
                    },
                    1000
                );
                setTimeout(
                    () => { 
                        dispatch(actions.increment());
                        clearInterval(delayTimer);
                    },
                    5000
                );
            }
        }
    );
}