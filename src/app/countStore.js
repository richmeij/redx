import { action, store, asyncAction } from '../lib/redx';

class CountStore {
    initialState = {
        counter: 10,
        delay: 0
    }

    // Examples of 'normal' actions
    @action 
    increment(state) {
        return { counter: state.counter + 1 };
    }

    @action 
    decrement(state) {
        return { counter: state.counter - 1 };
    }

    // Example of async actions which spawns child actions
    @action
    incrementStart() {
        return { delay: 5 };
    }

    @action
    countDown = (state) => ({ delay: state.delay - 1 });
    
    // @asyncAction
    // incrementAsync = () => {
    //     return (dispatch, actions, state) => {
    //         dispatch(actions.incrementStart());
    //         const delayTimer = setInterval(
    //             () => {
    //                 dispatch(actions.countDown())
    //             },
    //             1000
    //         );
    //         setTimeout(
    //             () => { 
    //                 dispatch(actions.increment());
    //                 clearInterval(delayTimer);
    //             },
    //             5000
    //         );
    //     }
    // }
}

export default store(new CountStore());