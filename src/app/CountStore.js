import { store, action, asyncAction } from '../lib/redx';

class CountStore {
    constructor() {
        this.initialState = {
            counter: 10,
            delay: 0
        };

        this.increase = action((state) => {
            return { counter: state.counter + 1 };
        });

        this.decrease = action((state) => {
            return { counter: state.counter - 1 };
        });

        this.increaseAsyncStart = action(() => { return { delay: 5 }; });

        this.reset = action(() => {
            return { delay: 0 };
        });

        this.countDown = action((state) => {
            return { delay: state.delay - 1 };
        });

        this.increaseAsync = asyncAction(() => {
            return (dispatch, actions) => {
                actions.increaseAsyncStart();
                const delayTimer = setInterval(
                    () => {
                        actions.countDown();
                    },
                    1000
                );
                setTimeout(
                    () => {
                        actions.reset();
                        actions.increase();
                        clearInterval(delayTimer);
                    },
                    5000
                );
            };
        });
    }
}

export default store(CountStore);
