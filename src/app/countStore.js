import { store, action, asyncAction } from '../lib/redx';

class CountStore {
    constructor() {
        this.storeName = 'CountStore'; // optional
        
        this.initialState = {
            counter: 10,
            delay: 0
        }

        this.increase = action(this.increase);
        this.decrease = action(this.decrease);

        // Start the async increment, reset delay to 5
        this.incrementStart = action(
            () => ({ delay: 5 })
        );

        // Count down, decrease delay by 1
        this.countDown = action(
            state => ({ delay: state.delay - 1 })
        );

        // Example of async action which spawns child actions
        // Needs something like Redux Thunk to work

        this.increaseAsync = asyncAction(
            () => {
                return (dispatch, actions, state) => {
                    actions.incrementStart();
                    const delayTimer = setInterval(
                        () => {
                            actions.countDown();
                        },
                        1000
                    );
                    setTimeout(
                        () => { 
                            actions.increment();
                            clearInterval(delayTimer);
                        },
                        5000
                    );
                }
            }
        );            
    }

     // increase the counter by 1
    increase(state) {
        return { counter: state.counter + 1 };
    }

    // decrease the counter by 1
    decrease(state) {
        return { counter: state.counter - 1 };
    }
}

export default store(CountStore);