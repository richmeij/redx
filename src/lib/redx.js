import { isEmptyObject, lowerCamelCase } from './util';

/**
 * Function accepts a class and returns a new class that you can use with RedX observer
 * @param {Store} RedX store class.
 * @returns {Class} A new Class, which when instantiated will return a Redux reducer.
 */
export function store(Store) {
    const target = new Store();
    const storeName = target.storeName || target.constructor.name;
    const initialState = target.initialState || {};
    const actions = Object.getOwnPropertyNames(target).filter(propName => target[propName].__isRedXAction);

    const handlers = actions.reduce((handlers, actionName) => {
        const handler = target[actionName];
        if (!handler.__isRedXAsyncAction) {
            const key = `${storeName}_${actionName}`;
            handlers[key] = handler; // eslint-disable-line no-param-reassign
        }
        return handlers;
    }, {});

    const reducer = (state = initialState, action) => {
        const handler = handlers[action.type];
        if (handler !== undefined) {
            let { redXAsync } = state;
            if (handler.__isRedXStartAction) {
                redXAsync = '__STARTED__';
            }
            if (handler.__isRedXDoneAction) {
                redXAsync = undefined;
            }
            const result = handler(...action.payload, state);
            return {
                ...state,
                ...result,
                redXAsync
            };
        }
        if (action.type.substr(0, 8) !== '@@redux/') {
            console.warn(`RedX: Handler for type [${action.type}] not found`);
        }
        return state;
    };

    reducer.storeName = lowerCamelCase(storeName);
    reducer.__isRedXStore = true;
    reducer.__actionCreators = actions.reduce((acc, cur) => {
        const handler = target[cur];
        if (handler.__isRedXAsyncAction) {
            acc[cur] = (...args) => {
                return (dispatch, getState) => {
                    const state = getState()[reducer.storeName];
                    const currentState = isEmptyObject(state) ? initialState : state;
                    const actions = Object.keys(reducer.__actionCreators).reduce((actions, key) => {
                        actions[key] = () => { dispatch(reducer.__actionCreators[key]()); }; // eslint-disable-line no-param-reassign
                        return actions;
                    }, {});
                    return handler(...args)(dispatch, actions, currentState);
                };
            };
        } else {
            acc[cur] = (...payload) => {
                const action = { type: `${storeName}_${cur}`, payload };
                return action;
            };
        }
        return acc;
    }, {});

    return () => {
        return reducer;
    };
}

/**
 * Function accepts function to mark as being a RedX action
 * @param {function} Function to mark as RedX action
 * @returns {function} RedX action
 */
export const action = (target) => {
    target.__isRedXAction = true; // eslint-disable-line no-param-reassign
    return target;
};

/**
 * Function accepts function to mark as being a RedX ASYNC action
 * @param {function} Function to mark as RedX ASYNC action
 * @returns {function} RedX ASYNC action
 */
export const asyncAction = (target) => {
    const asyncAction = action(target);
    asyncAction.__isRedXAsyncAction = true;
    return asyncAction;
};
