// STORE ENHANCER
const store = (target, initialState = {}) => {
    const targetName = target.constructor.name;
    const defaultState = target.initialState || initialState;
    const actions = Object.getOwnPropertyNames(target).filter(action => target[action].__isRedXAction);
    const handlers =
            actions.reduce((result, action) => {
                const handler = target[action];
                if (!handler.__isRedXAsyncAction) {
                    const key = `${targetName}_${action}`;
                    result[key] = handler;
                }
                return result;
            }, {});

    let reducer = (state = defaultState, action) => {
        console.log(action);
        const handler = handlers[action.type];
        if (handler !== undefined) {
            return handler(state, ...action.payload);
        }
        return state;
    };
    reducer.storeName = target.storeName || targetName.replace(/store/i, '').toLowerCase();
    reducer.__isRedXStore = true;
    reducer.actionCreators = actions.reduce((acc, cur) => {
        const handler = target[cur];
        if (handler.__isRedXAsyncAction) {
            acc[cur] = function(...args) { 
                return (dispatch) => {
                    return handler(...args)(redxDispatch(dispatch), reducer.actionCreators);
                };
            }.bind(reducer.actionCreators);
        } else {
            acc[cur] = (...payload) => {
                const action = { type: `${targetName}_${cur}`, payload };
                return action;
            };
        }
        return acc;
    }, {})
    return reducer;
}

function redxDispatch(dispatch) {
    return function(...args) {
        console.log('TEST: ', args)
        return dispatch(...args);
    };
}

// ACTION ENHANCER
const action = target => {
    target.__isRedXAction = true;
    return target;
}

// ASYNC ACTION ENHANCER
const asyncAction = target => {
    let asyncAction = action(target);
    asyncAction.__isRedXAsyncAction = true;
    return asyncAction;
}

// COMPONENT ENHANCER
const observer = (Component, ...stores) => {
    const mapStateToProps = (state) => stores.reduce((acc, cur) => {
        acc[cur.storeName] = state[cur.storeName];
        return acc;
    }, {});
    const mapDispatchToProps = stores.reduce((acc, cur) => {
        Object.getOwnPropertyNames(cur.actionCreators).forEach(actionCreator => {
            acc[actionCreator] = cur.actionCreators[actionCreator];
        });
        return acc;
    }, {});
    console.log(mapDispatchToProps);
    return connect(mapStateToProps, mapDispatchToProps)(Component);
}

// REDUX UTIL
const combineStores = (...stores) => {
    return stores.reduce((acc, cur) => {
        acc[cur.storeName] = cur;
        return acc;
    }, {});
}
