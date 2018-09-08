import { action, store, asyncAction } from '../lib/redx';

export class CountStore {
    initialState = {
        counter: 10,
        delay: 0
    }

    // Examples of 'normal' actions
    increment = action(
        (state) => ({ counter: state.counter + 1 })
    )

    decrement = action(
        (state) => ({ counter: state.counter - 1 })
    )

    // Example of async action which spawns child actions
    incrementStart = action(
        () => ({ delay: 5 })
    );
    countDown = action(
        (state) => ({ delay: state.delay - 1 })
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
    )
}

export default store(new CountStore());