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
        this.increaseAsyncStart = action(this.increaseAsyncStart);
        this.countDown = action(this.countDown);
        this.increaseAsync = asyncAction(this.increaseAsync);
    }

     // increase the counter by 1
    increase(state) {
        return { counter: state.counter + 1 };
    }

    // decrease the counter by 1
    decrease(state) {
        return { counter: state.counter - 1 };
    }

    // Start the async increment, reset delay to 5
    increaseAsyncStart() {
        return { delay: 5 };
    }

    // Count down, decrease delay by 1
    countDown(state) {
        return { delay: state.delay -1 };
    }

    // Example of async action which spawns child actions
    // Needs something like Redux Thunk to work
    increaseAsync() {
        return (dispatch, actions, state) => {
            actions.increaseAsyncStart();
            const delayTimer = setInterval(
                () => {
                    actions.countDown();
                },
                1000
            );
            setTimeout(
                () => { 
                    actions.increase();
                    clearInterval(delayTimer);
                },
                5000
            );
        }
    }
}

export default store(CountStore);