import { isEmptyObject, findProperty, lowerCamelCase } from './util';

// STORE ENHANCER
export const store = (target) => {
    const storeName = target.storeName || target.constructor.name;
    const defaultState = target.initialState || {};
    const actions = Object.getOwnPropertyNames(target).filter(propName => target[propName].__isRedXAction);
    const handlers = actions.reduce((handlers, actionName) => {
        const handler = target[actionName];
        if (!handler.__isRedXAsyncAction) {
            const key = `${storeName}_${actionName}`;
            handlers[key] = handler; // eslint-disable-line no-param-reassign
        }
        return handlers;
    }, {});

    const reducer = (state = defaultState, action) => {
        const handler = handlers[action.type];
        if (handler !== undefined) {
            let redXAsync = state.redXAsync;
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
        } else {
            if(action.type.substr(0,8) !== '@@redux/') {
                console.warn(`RedX: Handler for type [${action.type}] not found`);
            }
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
                    const currentState = isEmptyObject(state) ? defaultState : state;
                    return handler(...args)(dispatch, reducer.__actionCreators, currentState);
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

    return reducer;
};

// ACTION ENHANCER
export const action = (target) => {
    target.__isRedXAction = true; // eslint-disable-line no-param-reassign
    return target;
};

// ASYNC ACTION ENHANCER
export const asyncAction = (target) => {
    const asyncAction = action(target);
    asyncAction.__isRedXAsyncAction = true;
    return asyncAction;
};

// START ACTION ENHANCER
export const startAction = (target) => {
    const startAction = action(target);
    startAction.__isRedXStartAction = true;
    return startAction;
};

// DONE ACTION ENHANCER
export const doneAction = (target) => {
    const doneAction = action(target);
    doneAction.__isRedXDoneAction = true;
    return doneAction;
};
